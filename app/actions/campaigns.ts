"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

import { requireRole } from "@/lib/auth/dal"
import { createClient } from "@/lib/supabase/server"
import type { CampaignStatus } from "@/lib/supabase/database.types"

export type CampaignFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof CampaignSchema>, string[]>>
      message?: string
    }
  | undefined

// Blank optional inputs arrive as "" from FormData; store them as null.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Keep this under ${max} characters.` })
    .transform((value) => value || null)

const optionalDate = z
  .string()
  .trim()
  .transform((value) => value || null)
  .pipe(z.iso.date({ error: "Enter a valid date." }).nullable())

const CampaignSchema = z
  .object({
    name: z.string().trim().min(1, { error: "Enter a campaign name." }).max(120),
    brandName: z.string().trim().min(1, { error: "Enter the brand name." }).max(120),
    description: optionalText(2000),
    startDate: optionalDate,
    endDate: optionalDate,
    deliverableQuota: z
      .string()
      .trim()
      .transform((value) => (value ? Number(value) : null))
      .pipe(
        z
          .int({ error: "Enter a whole number." })
          .positive({ error: "Must be at least 1." })
          .nullable()
      ),
    guidelines: optionalText(10000),
    defaultInstructions: optionalText(5000),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { error: "End date can't be before the start date.", path: ["endDate"] }
  )

function parseCampaignForm(formData: FormData) {
  const field = (name: string) => formData.get(name) ?? ""

  return CampaignSchema.safeParse({
    name: field("name"),
    brandName: field("brandName"),
    description: field("description"),
    startDate: field("startDate"),
    endDate: field("endDate"),
    deliverableQuota: field("deliverableQuota"),
    guidelines: field("guidelines"),
    defaultInstructions: field("defaultInstructions"),
  })
}

function toColumns(data: z.infer<typeof CampaignSchema>) {
  return {
    name: data.name,
    brand_name: data.brandName,
    description: data.description,
    start_date: data.startDate,
    end_date: data.endDate,
    deliverable_quota: data.deliverableQuota,
    guidelines: data.guidelines,
    default_instructions: data.defaultInstructions,
  }
}

export async function createCampaign(
  _state: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  const profile = await requireRole("creator")

  const validated = parseCampaignForm(formData)
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("campaigns")
    .insert({ ...toColumns(validated.data), creator_id: profile.id })
    .select("id")
    .single()

  if (error || !data) {
    return { message: "Could not create the campaign. Try again." }
  }

  revalidatePath("/creator", "layout")
  redirect(`/creator/campaigns/${data.id}`)
}

export async function updateCampaign(
  campaignId: string,
  _state: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  const profile = await requireRole("creator")

  const validated = parseCampaignForm(formData)
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("campaigns")
    .update(toColumns(validated.data))
    .eq("id", campaignId)
    .eq("creator_id", profile.id)
    .select("id")

  // RLS turns an update on someone else's row into zero rows, not an error.
  if (error || !data?.length) {
    return { message: "Could not save the campaign. Try again." }
  }

  revalidatePath("/creator", "layout")
  redirect(`/creator/campaigns/${campaignId}`)
}

const StatusSchema = z.enum(["active", "paused", "completed", "archived"])

export async function setCampaignStatus(
  campaignId: string,
  status: CampaignStatus
) {
  const profile = await requireRole("creator")
  const validStatus = StatusSchema.parse(status)

  const supabase = await createClient()
  const { error } = await supabase
    .from("campaigns")
    .update({ status: validStatus })
    .eq("id", campaignId)
    .eq("creator_id", profile.id)

  if (error) {
    throw new Error("Could not update campaign status", { cause: error })
  }

  revalidatePath("/creator", "layout")
}
