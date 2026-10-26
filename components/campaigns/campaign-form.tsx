"use client"

import { useActionState } from "react"

import type { CampaignFormState } from "@/app/actions/campaigns"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Campaign } from "@/lib/campaigns"

type CampaignAction = (
  state: CampaignFormState,
  formData: FormData
) => Promise<CampaignFormState>

export function CampaignForm({
  action: formAction,
  campaign,
  submitLabel,
}: {
  action: CampaignAction
  campaign?: Campaign
  submitLabel: string
}) {
  const [state, action, pending] = useActionState(formAction, undefined)
  const errors = state?.errors

  const fieldError = (messages?: string[]) => (
    <FieldError errors={messages?.map((message) => ({ message }))} />
  )

  return (
    <form action={action} className="max-w-2xl">
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors?.name}>
            <FieldLabel htmlFor="name">Campaign name</FieldLabel>
            <Input id="name" name="name" defaultValue={campaign?.name} required />
            {fieldError(errors?.name)}
          </Field>
          <Field data-invalid={!!errors?.brandName}>
            <FieldLabel htmlFor="brandName">Brand name</FieldLabel>
            <Input
              id="brandName"
              name="brandName"
              defaultValue={campaign?.brand_name}
              required
            />
            {fieldError(errors?.brandName)}
          </Field>
        </div>
        <Field data-invalid={!!errors?.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            defaultValue={campaign?.description ?? ""}
          />
          {fieldError(errors?.description)}
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field data-invalid={!!errors?.startDate}>
            <FieldLabel htmlFor="startDate">Start date</FieldLabel>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={campaign?.start_date ?? ""}
            />
            {fieldError(errors?.startDate)}
          </Field>
          <Field data-invalid={!!errors?.endDate}>
            <FieldLabel htmlFor="endDate">End date (optional)</FieldLabel>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={campaign?.end_date ?? ""}
            />
            {fieldError(errors?.endDate)}
          </Field>
          <Field data-invalid={!!errors?.deliverableQuota}>
            <FieldLabel htmlFor="deliverableQuota">Deliverable quota</FieldLabel>
            <Input
              id="deliverableQuota"
              name="deliverableQuota"
              type="number"
              min={1}
              step={1}
              defaultValue={campaign?.deliverable_quota ?? ""}
            />
            {fieldError(errors?.deliverableQuota)}
          </Field>
        </div>
        <Field data-invalid={!!errors?.guidelines}>
          <FieldLabel htmlFor="guidelines">Editing guidelines</FieldLabel>
          <FieldDescription>
            Caption styles, fonts, colors, music preferences, examples and brand
            requirements. Editors see this on every ticket in the campaign.
          </FieldDescription>
          <Textarea
            id="guidelines"
            name="guidelines"
            className="min-h-32"
            defaultValue={campaign?.guidelines ?? ""}
          />
          {fieldError(errors?.guidelines)}
        </Field>
        <Field data-invalid={!!errors?.defaultInstructions}>
          <FieldLabel htmlFor="defaultInstructions">Default editing instructions</FieldLabel>
          <FieldDescription>Pre-filled on new tickets for this campaign.</FieldDescription>
          <Textarea
            id="defaultInstructions"
            name="defaultInstructions"
            defaultValue={campaign?.default_instructions ?? ""}
          />
          {fieldError(errors?.defaultInstructions)}
        </Field>
        {state?.message && <FieldError>{state.message}</FieldError>}
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
