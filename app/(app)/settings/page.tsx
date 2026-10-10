import type { Metadata } from "next"
import { Suspense } from "react"

import { SettingsForm } from "@/components/settings/settings-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = { title: "Settings · Todos" }

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear in the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SettingsSkeleton />}>
            <Settings />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function Settings() {
  const user = await getCurrentUser()
  return <SettingsForm email={user.email} displayName={user.displayName} />
}

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-8 w-16" />
    </div>
  )
}
