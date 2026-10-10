"use client"

import { useActionState, useState } from "react"
import { PencilIcon } from "lucide-react"

import { updateTodoAction } from "@/app/actions/todos"
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
import { Textarea } from "@/components/ui/textarea"
import type { ActionResult } from "@/lib/action-result"

import type { ClientTodo, OptimisticDispatch } from "./types"

export function EditTodoDialog({
  todo,
  dispatch,
  disabled,
}: {
  todo: ClientTodo
  dispatch: OptimisticDispatch
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  // Bumped on every open so the form remounts with fresh values, while
  // staying mounted during the close animation.
  const [formKey, setFormKey] = useState(0)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setFormKey((k) => k + 1)
        setOpen(next)
      }}
    >
      <DialogTrigger
        disabled={disabled}
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${todo.title}`}
          />
        }
      >
        <PencilIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <EditTodoForm
          key={formKey}
          todo={todo}
          dispatch={dispatch}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function EditTodoForm({
  todo,
  dispatch,
  onDone,
}: {
  todo: ClientTodo
  dispatch: OptimisticDispatch
  onDone: () => void
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => {
      const title = String(formData.get("title") ?? "").trim()
      const description = String(formData.get("description") ?? "").trim()
      if (title) {
        dispatch({ type: "update", id: todo.id, patch: { title, description } })
      }

      const result = await updateTodoAction(todo.id, formData)
      if (result.ok) onDone()
      return result
    },
    null
  )

  const error = state && !state.ok ? state.error : null

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Edit todo</DialogTitle>
        <DialogDescription>
          Update the title or description, then save your changes.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`title-${todo.id}`}>Title</Label>
        <Input
          id={`title-${todo.id}`}
          name="title"
          defaultValue={todo.title}
          maxLength={200}
          required
          autoComplete="off"
          aria-invalid={error ? true : undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`description-${todo.id}`}>Description</Label>
        <Textarea
          id={`description-${todo.id}`}
          name="description"
          defaultValue={todo.description}
          maxLength={1000}
          rows={4}
          placeholder="Optional details"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>
          Cancel
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}
