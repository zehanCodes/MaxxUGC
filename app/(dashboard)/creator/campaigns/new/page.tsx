import { createCampaign } from "@/app/actions/campaigns"
import { CampaignForm } from "@/components/campaigns/campaign-form"
import { requireRole } from "@/lib/auth/dal"

export default async function NewCampaignPage() {
  await requireRole("creator")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">New campaign</h1>
        <p className="text-muted-foreground text-sm">
          You can edit any of this later.
        </p>
      </div>
      <CampaignForm action={createCampaign} submitLabel="Create campaign" />
    </div>
  )
}
