import Link from "next/link"

import { CampaignStatusBadge } from "@/components/campaigns/campaign-status-badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCreatorCampaigns } from "@/lib/campaigns"

export default async function CampaignsPage() {
  const campaigns = await getCreatorCampaigns()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Campaigns</h1>
          <p className="text-muted-foreground text-sm">
            Each campaign has its own private B-roll library and tickets.
          </p>
        </div>
        <Link href="/creator/campaigns/new" className={buttonVariants()}>
          New campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No campaigns yet</CardTitle>
            <CardDescription>
              Create a campaign for each brand deal, then upload B-roll and submit
              editing tickets inside it.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-right">Quota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <Link
                    href={`/creator/campaigns/${campaign.id}`}
                    className="font-medium hover:underline"
                  >
                    {campaign.name}
                  </Link>
                </TableCell>
                <TableCell>{campaign.brand_name}</TableCell>
                <TableCell>
                  <CampaignStatusBadge status={campaign.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {campaign.start_date ?? "—"}
                  {campaign.end_date && ` → ${campaign.end_date}`}
                </TableCell>
                <TableCell className="text-right">
                  {campaign.deliverable_quota ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
