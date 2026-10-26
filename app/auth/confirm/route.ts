import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

/**
 * Landing point for links in Supabase auth emails. Handles both the default
 * template's PKCE redirect (`?code=`) and a custom template pointing here
 * with `?token_hash=&type=`. Either way the user ends up signed in and is
 * routed to their dashboard by `/`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  const supabase = await createClient()

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
      : { error: new Error("Missing confirmation parameters") }

  if (error) {
    return NextResponse.redirect(`${origin}/login?confirm_error=1`)
  }

  return NextResponse.redirect(`${origin}/`)
}
