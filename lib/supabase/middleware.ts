import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { LOGIN_PATH } from "@/lib/auth/paths"

const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth"]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

/**
 * Refreshes the Supabase session on every request and performs an
 * optimistic (cookie-only) redirect for unauthenticated users hitting a
 * protected route. This is not the authorization boundary — see
 * lib/auth/dal.ts for the checks that actually gate data access.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()

  if (
    !data?.claims &&
    !isPublicPath(request.nextUrl.pathname) &&
    !request.nextUrl.pathname.startsWith("/dev/")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
