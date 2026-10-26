import Link from "next/link"

import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Create your creator account</h1>
          <p className="text-muted-foreground text-sm">
            Editor and admin accounts are set up separately.
          </p>
        </div>
        <SignupForm />
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
