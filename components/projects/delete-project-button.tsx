"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { deleteProjectAction } from "@/app/actions/projects"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SidebarMenuAction } from "@/components/ui/sidebar"

export function DeleteProjectButton({
  project,
  isActive,
}: {
  project: { id: string; name: string }
  isActive: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProjectAction(project.id)
      setOpen(false)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      if (isActive) router.push("/todos")
    })
  }

  return (
    <>
      <SidebarMenuAction
        showOnHover
        aria-label={`Delete project ${project.name}`}
        onClick={() => setOpen(true)}
      >
        <Trash2Icon />
      </SidebarMenuAction>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{project.name}&rdquo; will be deleted. Its todos will move
              to your Inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
