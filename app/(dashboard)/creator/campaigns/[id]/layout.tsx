import Link from "next/link"

import { CampaignStatusBadge } from "@/components/campaigns/campaign-status-badge"
import { CampaignTabs } from "@/components/campaigns/campaign-tabs"
import { buttonVariants } from "@/components/ui/button"
import { getCreatorCampaign } from "@/lib/campaigns"

export default async function CampaignLayout({
  children,
  params,
}: LayoutProps<"/creator/campaigns/[id]">) {
  const { id } = await params
  const campaign = await getCreatorCampaign(id)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/creator/campaigns"
            className="text-muted-foreground text-sm hover:underline"
          >
            ← Campaigns
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{campaign.name}</h1>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          <p className="text-muted-foreground text-sm">{campaign.brand_name}</p>
        </div>
        <Link
          href={`/creator/campaigns/${campaign.id}/edit`}
          className={buttonVariants({ variant: "outline" })}
        >
          Edit campaign
        </Link>
      </div>
      <CampaignTabs campaignId={campaign.id} />
      {children}
    </div>
  )
}
