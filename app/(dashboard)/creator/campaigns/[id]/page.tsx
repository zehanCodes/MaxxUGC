import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCreatorCampaign } from "@/lib/campaigns"

export default async function CampaignOverviewPage({
  params,
}: PageProps<"/creator/campaigns/[id]">) {
  const { id } = await params
  const campaign = await getCreatorCampaign(id)

  // Ticket and deliverable counts are placeholders until tickets exist.
  const stats = [
    { label: "Deliverable quota", value: campaign.deliverable_quota ?? "—" },
    { label: "Completed videos", value: 0 },
    { label: "Open tickets", value: 0 },
    { label: "Start date", value: campaign.start_date ?? "—" },
    { label: "End date", value: campaign.end_date ?? "—" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-lg">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <section className="space-y-2">
        <h2 className="font-medium">Description</h2>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {campaign.description || "No description yet."}
        </p>
      </section>
    </div>
  )
}
