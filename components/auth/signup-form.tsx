"use client"

import { useActionState } from "react"

import { signup } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <FieldGroup>
        <Field data-invalid={!!state?.errors?.fullName}>
          <FieldLabel htmlFor="fullName">Full name</FieldLabel>
          <Input id="fullName" name="fullName" autoComplete="name" required />
          <FieldError errors={state?.errors?.fullName?.map((message) => ({ message }))} />
        </Field>
        <Field data-invalid={!!state?.errors?.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required />
          <FieldError errors={state?.errors?.email?.map((message) => ({ message }))} />
        </Field>
        <Field data-invalid={!!state?.errors?.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <FieldError errors={state?.errors?.password?.map((message) => ({ message }))} />
        </Field>
        {state?.message && <FieldError>{state.message}</FieldError>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  )
}
