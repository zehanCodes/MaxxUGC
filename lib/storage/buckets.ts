// Shared between server and client: bucket ids and the media types each
// accepts. Must stay in sync with supabase/migrations/0002_storage.sql.

export const BUCKETS = {
  campaignAssets: "campaign-assets",
  ticketSubmissions: "ticket-submissions",
} as const

export type BucketId = (typeof BUCKETS)[keyof typeof BUCKETS]

export const ALLOWED_MIME_TYPES: Record<BucketId, readonly string[]> = {
  "campaign-assets": [
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "image/png",
    "image/jpeg",
    "image/webp",
  ],
  "ticket-submissions": ["video/mp4", "video/quicktime", "video/webm"],
}

const EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
}

export function extensionFor(mimeType: string): string | undefined {
  return EXTENSIONS[mimeType]
}
