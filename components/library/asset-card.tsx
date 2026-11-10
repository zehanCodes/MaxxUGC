"use client"

import { useActionState, useState, useTransition } from "react"

import {
  deleteAsset,
  setAssetArchived,
  updateAsset,
  type AssetFormState,
} from "@/app/actions/assets"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CampaignAssetWithPreview } from "@/lib/assets"

import { formatBytes } from "./format"

export function AssetCard({ asset }: { asset: CampaignAssetWithPreview }) {
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, startTransition] = useTransition()
  const [state, formAction, saving] = useActionState(
    async (previous: AssetFormState, formData: FormData) => {
      const result = await updateAsset(asset.campaign_id, asset.id, previous, formData)
      if (result?.saved) setEditing(false)
      return result
    },
    undefined
  )
  const archived = !!asset.archived_at

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="bg-muted flex aspect-video items-center justify-center">
        {!asset.previewUrl ? (
          <span className="text-muted-foreground text-xs">Preview unavailable</span>
        ) : asset.asset_type === "video" ? (
          <video
            src={asset.previewUrl}
            controls
            preload="metadata"
            className="h-full w-full object-contain"
          />
        ) : (
          // Signed URLs expire and are per-user, so next/image's optimizer
          // (which caches by URL) isn't a fit here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.previewUrl}
            alt={asset.filename}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      <div className="space-y-2 p-3">
        {editing ? (
          <form action={formAction} className="space-y-2">
            <Input name="filename" defaultValue={asset.filename} aria-label="Name" required />
            <Input
              name="folder"
              defaultValue={asset.folder ?? ""}
              placeholder="Folder"
              aria-label="Folder"
            />
            <Input
              name="tags"
              defaultValue={asset.tags.join(", ")}
              placeholder="Tags, comma separated"
              aria-label="Tags"
            />
            {state?.error && <p className="text-destructive text-xs">{state.error}</p>}
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <p className="truncate text-sm font-medium" title={asset.filename}>
                {asset.filename}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatBytes(asset.size_bytes)}
                {asset.folder && ` · ${asset.folder}`}
              </p>
            </div>
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {asset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {!archived && (
                <Button size="xs" variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              <a
                href={`/assets/${asset.id}/download`}
                className={buttonVariants({ size: "xs", variant: "outline" })}
              >
                Download
              </a>
              <Button
                size="xs"
                variant="outline"
                disabled={busy}
                onClick={() =>
                  startTransition(() => setAssetArchived(asset.campaign_id, asset.id, !archived))
                }
              >
                {archived ? "Restore" : "Archive"}
              </Button>
              {archived &&
                (confirmingDelete ? (
                  <>
                    <Button
                      size="xs"
                      variant="destructive"
                      disabled={busy}
                      onClick={() =>
                        startTransition(() => deleteAsset(asset.campaign_id, asset.id))
                      }
                    >
                      Delete forever
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                      Keep
                    </Button>
                  </>
                ) : (
                  <Button size="xs" variant="ghost" onClick={() => setConfirmingDelete(true)}>
                    Delete
                  </Button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
