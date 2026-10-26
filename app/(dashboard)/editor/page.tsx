import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth/dal"

const SUMMARY_CARDS = [
  { label: "Shift status", value: "Off shift" },
  { label: "Active tickets", value: 0 },
  { label: "Pending revisions", value: 0 },
  { label: "Available in queue", value: 0 },
]

export default async function EditorOverviewPage() {
  const profile = await requireRole("editor")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome, {profile.full_name ?? "editor"}</h1>
        <p className="text-muted-foreground text-sm">
          Shifts, queue, and earnings land here in Phase 4 — this is the Foundation shell.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
