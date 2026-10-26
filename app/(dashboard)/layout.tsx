import type { ReactNode } from "react"

import { logout } from "@/app/actions/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProfile } from "@/lib/auth/dal"

const ROLE_LABEL: Record<string, string> = {
  creator: "Creator",
  editor: "Editor",
  admin: "Admin",
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const profile = await getProfile()

  return (
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold">MAXXUGC</span>
          <Badge variant="secondary">{ROLE_LABEL[profile.role]}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">
            {profile.full_name ?? profile.email}
          </span>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
