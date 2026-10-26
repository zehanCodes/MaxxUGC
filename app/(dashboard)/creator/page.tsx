import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth/dal"

const SUMMARY_CARDS = [
  { label: "Active campaigns", value: 0 },
  { label: "Open editing tickets", value: 0 },
  { label: "Being edited", value: 0 },
  { label: "Awaiting your approval", value: 0 },
  { label: "Completed videos", value: 0 },
]

export default async function CreatorOverviewPage() {
  const profile = await requireRole("creator")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome, {profile.full_name ?? "creator"}</h1>
        <p className="text-muted-foreground text-sm">
          Campaigns and tickets land here in Phase 2 — this is the Foundation shell.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {SUMMARY_CARDS.map((card) => (
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
