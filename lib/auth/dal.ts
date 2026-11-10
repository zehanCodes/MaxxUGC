import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

/**
 * Verifies the current request has a valid session. Redirects to /login
 * otherwise. Memoized per render pass so it's cheap to call from multiple
 * Server Components on the same page.
 */
export const verifySession = cache(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/login")
  }

  return { userId: data.claims.sub as string }
})

/**
 * Loads the caller's profile row (display name, time zone, etc).
 */
export const getProfile = cache(async (): Promise<Profile> => {
  const { userId } = await verifySession()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error || !data) {
    redirect("/login")
  }

  return data
})
