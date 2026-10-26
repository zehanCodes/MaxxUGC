import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import type { Database, UserRole } from "@/lib/supabase/database.types"

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
 * Loads the caller's profile row (role, account status, etc). This is the
 * source of truth for authorization checks — never trust a role passed
 * from the client.
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

  if (data.account_status === "suspended") {
    redirect("/login?suspended=1")
  }

  return data
})

/**
 * Gates a page/action to a single role. Redirects non-matching roles back
 * to their own dashboard rather than showing a 403, since every role has
 * a valid home to land on.
 */
export async function requireRole(role: UserRole): Promise<Profile> {
  const profile = await getProfile()

  if (profile.role !== role) {
    redirect(`/${profile.role}`)
  }

  return profile
}
