import { redirect } from "next/navigation"

import { getProfile } from "@/lib/auth/dal"

export default async function RootPage() {
  const profile = await getProfile()
  redirect(`/${profile.role}`)
}
