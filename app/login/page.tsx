import Link from "next/link"

import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams
  const notice = params.confirm_error
      ? "That confirmation link is invalid or expired. Log in to get a new one, or sign up again."
      : null

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Log in to MaxxUGC</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back. Enter your details to continue.
          </p>
        </div>
        {notice && (
          <p className="text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-sm">
            {notice}
          </p>
        )}
        <LoginForm />
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
