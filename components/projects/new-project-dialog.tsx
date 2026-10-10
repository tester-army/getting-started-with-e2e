"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { PlusIcon } from "lucide-react"

import { createProjectAction } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSidebar } from "@/components/ui/sidebar"

export function NewProjectDialog() {
  const router = useRouter()
  const { setOpenMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createProjectAction(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(false)
      setOpenMobile(false)
      // Jump into the new project so new todos land there.
      router.push(`/todos?project=${encodeURIComponent(result.data.id)}`)
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setError(null)
        setOpen(next)
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
          />
        }
      >
        <PlusIcon data-icon="inline-start" />
        New project
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Group related todos together. Todos without a project stay in
              your Inbox.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              name="name"
              placeholder="e.g. Work"
              maxLength={60}
              autoComplete="off"
              autoFocus
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "project-name-error" : undefined}
            />
            {error && (
              <p
                id="project-name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
