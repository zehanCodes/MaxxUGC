import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth/dal"
import { getCreatorCampaigns } from "@/lib/campaigns"

export default async function CreatorOverviewPage() {
  const profile = await requireRole("creator")
  const campaigns = await getCreatorCampaigns()

  // Ticket counts stay at 0 until tickets land later in Phase 2.
  const summaryCards = [
    {
      label: "Active campaigns",
      value: campaigns.filter((campaign) => campaign.status === "active").length,
    },
    { label: "Open editing tickets", value: 0 },
    { label: "Being edited", value: 0 },
    { label: "Awaiting your approval", value: 0 },
    { label: "Completed videos", value: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Welcome, {profile.full_name ?? "creator"}</h1>
        <Link href="/creator/campaigns/new" className={buttonVariants()}>
          New campaign
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl">{card.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
