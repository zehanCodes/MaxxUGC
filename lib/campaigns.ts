import "server-only"

import { cache } from "react"
import { notFound } from "next/navigation"

import { requireRole } from "@/lib/auth/dal"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"]

/**
 * The calling creator's campaigns, newest first. RLS already limits rows to
 * the owner; the explicit creator_id filter keeps an admin who somehow hits
 * a creator route from seeing everyone's campaigns.
 */
export async function getCreatorCampaigns(): Promise<Campaign[]> {
  const profile = await requireRole("creator")
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Could not load campaigns", { cause: error })
  }

  return data
}

/**
 * A single campaign owned by the calling creator. 404s for a missing id, a
 * malformed id, or someone else's campaign alike, so ids can't be probed.
 */
export const getCreatorCampaign = cache(async (id: string): Promise<Campaign> => {
  const profile = await requireRole("creator")
  const supabase = await createClient()

  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("creator_id", profile.id)
    .maybeSingle()

  if (!data) {
    notFound()
  }

  return data
})
