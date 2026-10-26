import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth/dal"

const SUMMARY_CARDS = [
  { label: "Open tickets", value: 0 },
  { label: "Claimed tickets", value: 0 },
  { label: "Overdue tickets", value: 0 },
  { label: "Editors on shift", value: 0 },
  { label: "Editors on standby", value: 0 },
  { label: "Estimated labor cost", value: "$0.00" },
]

export default async function AdminOverviewPage() {
  const profile = await requireRole("admin")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome, {profile.full_name ?? "admin"}</h1>
        <p className="text-muted-foreground text-sm">
          Operational oversight lands here across Phases 2-4 — this is the Foundation shell.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
