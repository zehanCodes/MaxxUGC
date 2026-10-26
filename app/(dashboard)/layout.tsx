import type { ReactNode } from "react"
import Link from "next/link"

import { logout } from "@/app/actions/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProfile } from "@/lib/auth/dal"

const ROLE_LABEL: Record<string, string> = {
  creator: "Creator",
  editor: "Editor",
  admin: "Admin",
}

// Grows as each role's sections are built (docs/PRD.md 5.1, 6.1, 7.1).
const NAV: Record<string, { label: string; href: string }[]> = {
  creator: [
    { label: "Overview", href: "/creator" },
    { label: "Campaigns", href: "/creator/campaigns" },
  ],
  editor: [{ label: "Overview", href: "/editor" }],
  admin: [{ label: "Overview", href: "/admin" }],
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
          <nav className="ml-4 flex items-center gap-4 text-sm">
            {NAV[profile.role].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
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
