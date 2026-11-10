"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

export function CampaignTabs({ campaignId }: { campaignId: string }) {
  const pathname = usePathname()
  const base = `/creator/campaigns/${campaignId}`

  // Tickets and Deliverables are the next Phase 2/3 pieces.
  const tabs = [
    { label: "Overview", href: base },
    { label: "Tickets" },
    { label: "B-roll Library", href: `${base}/library` },
    { label: "Guidelines", href: `${base}/guidelines` },
    { label: "Deliverables" },
  ]

  return (
    <nav className="flex gap-1 border-b">
      {tabs.map((tab) =>
        tab.href ? (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm",
              pathname === tab.href
                ? "border-foreground font-medium"
                : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            {tab.label}
          </Link>
        ) : (
          <span
            key={tab.label}
            title="Coming soon"
            className="text-muted-foreground/50 -mb-px cursor-not-allowed border-b-2 border-transparent px-3 py-2 text-sm"
          >
            {tab.label}
          </span>
        )
      )}
    </nav>
  )
}
