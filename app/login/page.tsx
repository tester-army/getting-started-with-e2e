import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { ListTodoIcon } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getOptionalUser } from "@/lib/auth"

export const metadata: Metadata = { title: "Sign in · Todos" }

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ListTodoIcon className="size-5" />
          </div>
          <CardTitle className="text-xl">
            <h1>Sign in</h1>
          </CardTitle>
          <CardDescription>
            Enter your email and password to get to your todos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}

async function RedirectIfSignedIn() {
  if (await getOptionalUser()) redirect("/todos")
  return null
}
