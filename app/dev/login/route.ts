import { NextResponse, type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

/**
 * Development-only shortcut that signs in as a local test creator, so the
 * app can be clicked through without the login form. Creates the account on
 * first use. Requires "Confirm email" to be off in the Supabase project
 * (otherwise sign-up doesn't return a session). Never available in
 * production builds.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 })
  }

  const email = process.env.DEV_LOGIN_EMAIL
  const password = process.env.DEV_LOGIN_PASSWORD
  if (!email || !password) {
    return new NextResponse(
      "Set DEV_LOGIN_EMAIL and DEV_LOGIN_PASSWORD in .env.local to use dev login.",
      { status: 500 }
    )
  }

  const supabase = await createClient()
  const { origin } = request.nextUrl

  const signIn = await supabase.auth.signInWithPassword({ email, password })
  if (!signIn.error) {
    return NextResponse.redirect(`${origin}/`)
  }

  if (signIn.error.code !== "invalid_credentials") {
    return new NextResponse(`Dev login failed: ${signIn.error.message}`, { status: 500 })
  }

  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: "Dev Creator" } },
  })

  if (signUp.error || !signUp.data.session) {
    return new NextResponse(
      signUp.error
        ? `Dev sign-up failed: ${signUp.error.message}`
        : "Dev account created but not signed in. Turn off Authentication → Providers → Email → Confirm email in Supabase, delete the dev user, and reload.",
      { status: 500 }
    )
  }

  return NextResponse.redirect(`${origin}/`)
}
