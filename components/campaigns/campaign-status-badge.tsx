import { Badge } from "@/components/ui/badge"
import type { CampaignStatus } from "@/lib/supabase/database.types"

const LABEL: Record<CampaignStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
}

const VARIANT: Record<CampaignStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
  archived: "outline",
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return <Badge variant={VARIANT[status]}>{LABEL[status]}</Badge>
}
