import "server-only"

import { requireRole } from "@/lib/auth/dal"
import { BUCKETS } from "@/lib/storage/buckets"
import { createPreviewUrls } from "@/lib/storage/server"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type CampaignAsset = Database["public"]["Tables"]["campaign_assets"]["Row"]
export type CampaignAssetWithPreview = CampaignAsset & { previewUrl: string | null }

export type AssetFilters = {
  q?: string
  folder?: string
  archived?: boolean
}

// PostgREST filter syntax treats these as delimiters inside .or(); strip
// them from free-text search rather than trying to escape them.
function sanitizeSearch(query: string) {
  return query.replace(/[,(){}"%*\\]/g, " ").trim()
}

export async function getCampaignAssets(
  campaignId: string,
  filters: AssetFilters = {}
): Promise<CampaignAssetWithPreview[]> {
  const profile = await requireRole("creator")
  const supabase = await createClient()

  let query = supabase
    .from("campaign_assets")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false })

  query = filters.archived
    ? query.not("archived_at", "is", null)
    : query.is("archived_at", null)

  if (filters.folder) {
    query = query.eq("folder", filters.folder)
  }

  const search = filters.q ? sanitizeSearch(filters.q) : ""
  if (search) {
    query = query.or(`filename.ilike.%${search}%,tags.cs.{${search.toLowerCase()}}`)
  }

  const { data, error } = await query
  if (error) {
    throw new Error("Could not load assets", { cause: error })
  }

  const previews = await createPreviewUrls(
    BUCKETS.campaignAssets,
    data.map((asset) => asset.storage_path)
  )

  return data.map((asset) => ({
    ...asset,
    previewUrl: previews.get(asset.storage_path) ?? null,
  }))
}

/** Distinct folder names in use across the campaign's live assets. */
export async function getCampaignFolders(campaignId: string): Promise<string[]> {
  const profile = await requireRole("creator")
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("campaign_assets")
    .select("folder")
    .eq("campaign_id", campaignId)
    .eq("creator_id", profile.id)
    .is("archived_at", null)
    .not("folder", "is", null)

  if (error) {
    throw new Error("Could not load folders", { cause: error })
  }

  return [...new Set(data.map((row) => row.folder as string))].sort()
}
