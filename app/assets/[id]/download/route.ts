import { NextResponse, type NextRequest } from "next/server"

import { createDownloadUrl } from "@/lib/storage/server"
import { BUCKETS } from "@/lib/storage/buckets"
import { createClient } from "@/lib/supabase/server"

/**
 * Stable download link for a campaign asset. Looks the asset up under the
 * caller's RLS, then redirects to a short-lived signed URL, so the link in
 * the page never grants access on its own.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/assets/[id]/download">
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: asset } = await supabase
    .from("campaign_assets")
    .select("storage_path, filename")
    .eq("id", id)
    .maybeSingle()

  if (!asset) {
    return new NextResponse("Not found", { status: 404 })
  }

  const url = await createDownloadUrl(BUCKETS.campaignAssets, asset.storage_path, {
    download: asset.filename,
  })

  return NextResponse.redirect(url)
}
