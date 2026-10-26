import { getCreatorCampaign } from "@/lib/campaigns"

export default async function CampaignGuidelinesPage({
  params,
}: PageProps<"/creator/campaigns/[id]/guidelines">) {
  const { id } = await params
  const campaign = await getCreatorCampaign(id)

  return (
    <div className="max-w-3xl space-y-6">
      <section className="space-y-2">
        <h2 className="font-medium">Editing guidelines</h2>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {campaign.guidelines || "No guidelines yet. Add them from Edit campaign."}
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-medium">Default editing instructions</h2>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {campaign.default_instructions || "None set."}
        </p>
      </section>
    </div>
  )
}
