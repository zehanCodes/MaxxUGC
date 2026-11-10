"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import * as z from "zod"

import { createClient } from "@/lib/supabase/server"

export type AuthState =
  | {
      errors?: {
        fullName?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

const SignupSchema = z.object({
  fullName: z.string().trim().min(2, { error: "Enter your full name." }),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Use at least 8 characters." })
    .regex(/[a-zA-Z]/, { error: "Include at least one letter." })
    .regex(/[0-9]/, { error: "Include at least one number." }),
})

export async function signup(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validated = SignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const { fullName, email, password } = validated.data
  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
    },
  })

  if (error) {
    return { message: error.message }
  }

  if (!data.session) {
    redirect("/signup/check-email")
  }

  redirect("/")
}

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Enter your password." }),
})

export async function login(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(validated.data)

  if (error?.code === "email_not_confirmed") {
    return { message: "Confirm your email first — check your inbox for the link." }
  }

  if (error) {
    return { message: "Invalid email or password." }
  }

  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
