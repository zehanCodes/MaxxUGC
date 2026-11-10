import "server-only"

import * as z from "zod"

import { getProfile } from "@/lib/auth/dal"
import { createClient } from "@/lib/supabase/server"
import {
  ALLOWED_MIME_TYPES,
  BUCKETS,
  extensionFor,
  type BucketId,
} from "@/lib/storage/buckets"

// Short enough that a link copied out of the app goes stale quickly, which
// is what makes revoking an editor's ticket access actually stick.
const DOWNLOAD_URL_TTL_SECONDS = 5 * 60

const UploadRequestSchema = z.object({
  campaignId: z.uuid(),
  mimeType: z.string(),
})

/**
 * Issues a one-time signed upload URL for a new campaign asset. The browser
 * uploads straight to storage with `uploadToSignedUrl(path, token, file)`,
 * so large videos never pass through the Next.js server.
 *
 * Runs with the caller's session, so storage RLS (not this function) is the
 * final say on whether the upload is allowed. The object name is generated
 * here, never taken from the client, so a crafted filename can't escape the
 * caller's prefix. Keep the original filename in CampaignAsset metadata.
 */
export async function createCampaignAssetUpload(input: {
  campaignId: string
  mimeType: string
}) {
  const { campaignId, mimeType } = UploadRequestSchema.parse(input)
  const profile = await getProfile()

  const extension = extensionFor(mimeType)
  if (
    !extension ||
    !ALLOWED_MIME_TYPES[BUCKETS.campaignAssets].includes(mimeType)
  ) {
    throw new Error(`Unsupported file type: ${mimeType}`)
  }

  const path = `${profile.id}/${campaignId}/${crypto.randomUUID()}.${extension}`

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from(BUCKETS.campaignAssets)
    .createSignedUploadUrl(path)

  if (error || !data) {
    throw new Error("Could not create upload URL", { cause: error })
  }

  return { bucket: BUCKETS.campaignAssets, path: data.path, token: data.token }
}

/**
 * Issues a short-lived signed download URL. Fails unless the caller's own
 * RLS policies allow reading the object, so guessing or editing a path gets
 * an error rather than a file (docs/PRD.md Section 13, "File permissions").
 */
export async function createDownloadUrl(
  bucket: BucketId,
  path: string,
  options?: { download?: boolean | string }
) {
  await getProfile()

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, DOWNLOAD_URL_TTL_SECONDS, options)

  if (error || !data) {
    throw new Error("File not found or access denied", { cause: error })
  }

  return data.signedUrl
}

// In-app previews outlive a download link so a video doesn't stop loading
// mid-session; they're still scoped by RLS when issued.
const PREVIEW_URL_TTL_SECONDS = 60 * 60

/**
 * Signed preview URLs for many objects in one round trip, keyed by path.
 * Paths the caller can't read are simply missing from the result.
 */
export async function createPreviewUrls(
  bucket: BucketId,
  paths: string[]
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map()

  await getProfile()

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, PREVIEW_URL_TTL_SECONDS)

  if (error || !data) {
    throw new Error("Could not create preview URLs", { cause: error })
  }

  return new Map(
    data.flatMap((entry) =>
      entry.path && entry.signedUrl ? [[entry.path, entry.signedUrl] as const] : []
    )
  )
}
