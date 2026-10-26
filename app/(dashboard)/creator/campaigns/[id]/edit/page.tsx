import { setCampaignStatus, updateCampaign } from "@/app/actions/campaigns"
import { CampaignForm } from "@/components/campaigns/campaign-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCreatorCampaign } from "@/lib/campaigns"
import type { CampaignStatus } from "@/lib/supabase/database.types"

const STATUS_ACTIONS: { status: CampaignStatus; label: string }[] = [
  { status: "active", label: "Mark active" },
  { status: "paused", label: "Pause" },
  { status: "completed", label: "Mark completed" },
  { status: "archived", label: "Archive" },
]

export default async function EditCampaignPage({
  params,
}: PageProps<"/creator/campaigns/[id]/edit">) {
  const { id } = await params
  const campaign = await getCreatorCampaign(id)

  return (
    <div className="space-y-8">
      <CampaignForm
        action={updateCampaign.bind(null, campaign.id)}
        campaign={campaign}
        submitLabel="Save changes"
      />
      <Separator />
      <section className="space-y-3">
        <div>
          <h2 className="font-medium">Status</h2>
          <p className="text-muted-foreground text-sm">
            Archive instead of deleting — tickets and deliverables stay linked to
            the campaign.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_ACTIONS.filter((option) => option.status !== campaign.status).map(
            (option) => (
              <form
                key={option.status}
                action={setCampaignStatus.bind(null, campaign.id, option.status)}
              >
                <Button type="submit" variant="outline" size="sm">
                  {option.label}
                </Button>
              </form>
            )
          )}
        </div>
      </section>
    </div>
  )
}
