import Link from "next/link"
import { cn } from "cn"

import { AssetCard } from "@/components/library/asset-card"
import { UploadPanel } from "@/components/library/upload-panel"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCampaignAssets, getCampaignFolders } from "@/lib/assets"
import { getCreatorCampaign } from "@/lib/campaigns"

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function CampaignLibraryPage({
  params,
  searchParams,
}: PageProps<"/creator/campaigns/[id]/library">) {
  const { id } = await params
  const query = await searchParams
  const campaign = await getCreatorCampaign(id)

  const q = single(query.q)?.trim() ?? ""
  const folder = single(query.folder) ?? ""
  const archived = single(query.archived) === "1"

  const [assets, folders] = await Promise.all([
    getCampaignAssets(campaign.id, { q, folder, archived }),
    getCampaignFolders(campaign.id),
  ])

  const base = `/creator/campaigns/${campaign.id}/library`
  const hrefWith = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams()
    const merged = { q, folder, archived: archived ? "1" : "", ...changes }
    for (const [key, value] of Object.entries(merged)) {
      if (value) next.set(key, value)
    }
    const search = next.toString()
    return search ? `${base}?${search}` : base
  }
  const filtered = !!(q || folder)

  return (
    <div className="space-y-6">
      {!archived && <UploadPanel campaignId={campaign.id} folders={folders} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form action={base} className="flex gap-2">
          {folder && <input type="hidden" name="folder" value={folder} />}
          {archived && <input type="hidden" name="archived" value="1" />}
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search by name or tag"
            className="w-64"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        <Link
          href={hrefWith({ archived: archived ? null : "1", folder: null })}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          {archived ? "← Back to library" : "View archived"}
        </Link>
      </div>

      {!archived && folders.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {[{ label: "All files", value: null }, ...folders.map((name) => ({ label: name, value: name }))].map(
            (option) => (
              <Link
                key={option.label}
                href={hrefWith({ folder: option.value })}
                className={cn(
                  "rounded-full border px-3 py-1",
                  (option.value ?? "") === folder
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </Link>
            )
          )}
        </div>
      )}

      {assets.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          {archived
            ? "No archived files."
            : filtered
              ? "No files match. Try a different search or folder."
              : "No B-roll yet. Upload footage above and reuse it across every ticket in this campaign."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  )
}
