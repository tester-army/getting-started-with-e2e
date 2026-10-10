"use client"

import { useActionState } from "react"

import { updateSettingsAction } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SettingsForm({
  email,
  displayName,
}: {
  email: string
  displayName: string
}) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    null
  )
  const error = state && !state.ok ? state.error : null

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} readOnly disabled className="h-9" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={displayName}
          placeholder="How should we call you?"
          maxLength={60}
          autoComplete="name"
          aria-invalid={error ? true : undefined}
          aria-describedby="displayName-hint"
          className="h-9"
        />
        <p id="displayName-hint" className="text-xs text-muted-foreground">
          Shown in the sidebar. Leave empty to use your email.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
        <p role="status" className="text-sm">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : state?.ok && !isPending ? (
            <span className="text-muted-foreground">Saved.</span>
          ) : null}
        </p>
      </div>
    </form>
  )
}
