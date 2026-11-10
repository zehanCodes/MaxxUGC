"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"

import { requireRole } from "@/lib/auth/dal"
import { BUCKETS } from "@/lib/storage/buckets"
import { createCampaignAssetUpload } from "@/lib/storage/server"
import { createClient } from "@/lib/supabase/server"

type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string }

const libraryPath = (campaignId: string) =>
  `/creator/campaigns/${campaignId}/library`

const folderName = z
  .string()
  .trim()
  .max(80, { error: "Keep folder names under 80 characters." })
  .transform((value) => value || null)

/** Step 1 of an upload: get a signed URL the browser uploads straight to. */
export async function requestAssetUpload(
  campaignId: string,
  mimeType: string
): Promise<ActionResult<{ path: string; token: string }>> {
  await requireRole("creator")

  try {
    const { path, token } = await createCampaignAssetUpload({ campaignId, mimeType })
    return { ok: true, data: { path, token } }
  } catch {
    return { ok: false, error: "This file type isn't supported, or the campaign wasn't found." }
  }
}

const RecordUploadSchema = z.object({
  campaignId: z.uuid(),
  path: z.string().min(1),
  filename: z.string().trim().min(1).max(255),
  folder: folderName,
})

/**
 * Step 2: register the uploaded object as an asset. Size and type come from
 * storage, not the browser, so the row always matches the stored file.
 */
export async function recordAssetUpload(input: {
  campaignId: string
  path: string
  filename: string
  folder: string
}): Promise<ActionResult> {
  const profile = await requireRole("creator")

  const validated = RecordUploadSchema.safeParse(input)
  if (!validated.success) {
    return { ok: false, error: "Invalid upload details." }
  }
  const { campaignId, path, filename, folder } = validated.data

  if (!path.startsWith(`${profile.id}/${campaignId}/`)) {
    return { ok: false, error: "Invalid upload path." }
  }

  const supabase = await createClient()
  const { data: info, error: infoError } = await supabase.storage
    .from(BUCKETS.campaignAssets)
    .info(path)

  if (infoError || !info?.contentType) {
    return { ok: false, error: "Upload not found. Try again." }
  }

  const { error } = await supabase.from("campaign_assets").insert({
    campaign_id: campaignId,
    creator_id: profile.id,
    uploaded_by: profile.id,
    storage_path: path,
    filename,
    mime_type: info.contentType,
    asset_type: info.contentType.startsWith("video/") ? "video" : "image",
    size_bytes: info.size ?? 0,
    folder,
  })

  if (error) {
    return { ok: false, error: "Uploaded, but couldn't save it to the library." }
  }

  revalidatePath(libraryPath(campaignId))
  return { ok: true }
}

export type AssetFormState = { error?: string; saved?: boolean } | undefined

const UpdateAssetSchema = z.object({
  filename: z.string().trim().min(1, { error: "Name can't be empty." }).max(255),
  folder: folderName,
  tags: z
    .string()
    .transform((value) =>
      [
        ...new Set(
          value
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean)
        ),
      ]
    )
    .pipe(
      z
        .array(z.string().max(40, { error: "Keep tags under 40 characters." }))
        .max(20, { error: "Use 20 tags or fewer." })
    ),
})

export async function updateAsset(
  campaignId: string,
  assetId: string,
  _state: AssetFormState,
  formData: FormData
): Promise<AssetFormState> {
  const profile = await requireRole("creator")

  const validated = UpdateAssetSchema.safeParse({
    filename: formData.get("filename") ?? "",
    folder: formData.get("folder") ?? "",
    tags: formData.get("tags") ?? "",
  })
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Check the fields." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("campaign_assets")
    .update(validated.data)
    .eq("id", assetId)
    .eq("creator_id", profile.id)
    .select("id")

  if (error || !data?.length) {
    return { error: "Could not save changes." }
  }

  revalidatePath(libraryPath(campaignId))
  return { saved: true }
}

export async function setAssetArchived(
  campaignId: string,
  assetId: string,
  archived: boolean
) {
  const profile = await requireRole("creator")
  const supabase = await createClient()

  const { error } = await supabase
    .from("campaign_assets")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", assetId)
    .eq("creator_id", profile.id)

  if (error) {
    throw new Error("Could not update asset", { cause: error })
  }

  revalidatePath(libraryPath(campaignId))
}

/**
 * Permanently removes an archived asset and its file. Only archived assets
 * can be deleted, so deletion is always a deliberate second step. Once
 * tickets exist this must also refuse assets referenced by open tickets.
 */
export async function deleteAsset(campaignId: string, assetId: string) {
  const profile = await requireRole("creator")
  const supabase = await createClient()

  const { data: asset } = await supabase
    .from("campaign_assets")
    .select("storage_path, archived_at")
    .eq("id", assetId)
    .eq("creator_id", profile.id)
    .maybeSingle()

  if (!asset?.archived_at) {
    throw new Error("Only archived assets can be deleted")
  }

  const { error: storageError } = await supabase.storage
    .from(BUCKETS.campaignAssets)
    .remove([asset.storage_path])

  if (storageError) {
    throw new Error("Could not delete file", { cause: storageError })
  }

  await supabase.from("campaign_assets").delete().eq("id", assetId)

  revalidatePath(libraryPath(campaignId))
}
