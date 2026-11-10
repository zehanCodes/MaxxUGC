import Link from "next/link"

import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

// Temporary setup check: confirms Supabase auth + the profiles table work.
// Replaced by the real landing page in Week 1.
export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub as string | undefined

  const profile = userId
    ? (await supabase.from("profiles").select("*").eq("id", userId).single()).data
    : null

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold">MaxxUGC</h1>
        {!userId ? (
          <>
            <p className="text-muted-foreground text-sm">You&apos;re not signed in.</p>
            <div className="flex justify-center gap-2">
              <Button nativeButton={false} render={<Link href="/signup" />}>Sign up</Button>
              <Button variant="outline" nativeButton={false} render={<Link href="/login" />}>
                Log in
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm">
              Signed in as <strong>{profile?.email ?? "unknown"}</strong>
            </p>
            <p className="text-muted-foreground text-sm">
              {profile
                ? "✅ Your profile row exists in Supabase."
                : "⚠️ Signed in, but no profile row found. Did the migration run?"}
            </p>
            <form action={logout}>
              <Button variant="outline" type="submit">
                Log out
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
