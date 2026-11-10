"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { recordAssetUpload, requestAssetUpload } from "@/app/actions/assets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ALLOWED_MIME_TYPES, BUCKETS } from "@/lib/storage/buckets"
import { createClient } from "@/lib/supabase/client"

import { formatBytes } from "./format"

type UploadStatus = "queued" | "uploading" | "done" | "error"
type UploadItem = { key: string; name: string; size: number; status: UploadStatus; error?: string }

const ACCEPT = ALLOWED_MIME_TYPES[BUCKETS.campaignAssets].join(",")

export function UploadPanel({
  campaignId,
  folders,
}: {
  campaignId: string
  folders: string[]
}) {
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [folder, setFolder] = useState("")
  const [items, setItems] = useState<UploadItem[]>([])
  const uploading = items.some((item) => item.status === "uploading" || item.status === "queued")

  const update = (key: string, patch: Partial<UploadItem>) =>
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)))

  async function uploadOne(file: File, key: string) {
    update(key, { status: "uploading" })

    const requested = await requestAssetUpload(campaignId, file.type)
    if (!requested.ok) {
      update(key, { status: "error", error: requested.error })
      return
    }

    const supabase = createClient()
    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.campaignAssets)
      .uploadToSignedUrl(requested.data.path, requested.data.token, file, {
        contentType: file.type,
      })

    if (uploadError) {
      update(key, { status: "error", error: uploadError.message })
      return
    }

    const recorded = await recordAssetUpload({
      campaignId,
      path: requested.data.path,
      filename: file.name,
      folder,
    })

    update(key, recorded.ok ? { status: "done" } : { status: "error", error: recorded.error })
  }

  async function handleUpload() {
    const files = Array.from(fileInput.current?.files ?? [])
    if (files.length === 0) return

    const queued = files.map((file) => ({
      file,
      item: {
        key: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        status: "queued" as const,
      },
    }))
    setItems(queued.map(({ item }) => item))

    // Three at a time: enough to keep the connection busy without
    // starting dozens of large video uploads at once.
    const pending = [...queued]
    await Promise.all(
      Array.from({ length: Math.min(3, pending.length) }, async () => {
        for (let next = pending.shift(); next; next = pending.shift()) {
          await uploadOne(next.file, next.item.key)
        }
      })
    )

    if (fileInput.current) fileInput.current.value = ""
    router.refresh()
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1 space-y-1 text-sm">
          <span className="font-medium">Files</span>
          <Input ref={fileInput} type="file" multiple accept={ACCEPT} disabled={uploading} />
        </label>
        <label className="w-48 space-y-1 text-sm">
          <span className="font-medium">Folder (optional)</span>
          <Input
            list="library-folders"
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
            placeholder="New or existing"
            disabled={uploading}
          />
          <datalist id="library-folders">
            {folders.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>
        <Button type="button" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        MP4, MOV, WebM, PNG, JPG or WebP. Each file is private to this campaign.
      </p>
      {items.length > 0 && (
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.key} className="flex justify-between gap-4">
              <span className="truncate">
                {item.name}{" "}
                <span className="text-muted-foreground">({formatBytes(item.size)})</span>
              </span>
              <span
                className={
                  item.status === "error"
                    ? "text-destructive"
                    : item.status === "done"
                      ? "text-foreground"
                      : "text-muted-foreground"
                }
              >
                {item.status === "error" ? item.error : item.status === "done" ? "Uploaded" : item.status === "uploading" ? "Uploading…" : "Waiting"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
