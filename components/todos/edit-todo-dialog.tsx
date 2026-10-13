"use client"

import { useState } from "react"
import { PencilIcon } from "lucide-react"

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

import type { Todo, TodoDispatch } from "./types"

export function EditTodoDialog({
  todo,
  dispatch,
}: {
  todo: Todo
  dispatch: TodoDispatch
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
  todo: Todo
  dispatch: TodoDispatch
  onDone: () => void
}) {
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    if (!title) {
      setError("Title is required.")
      return
    }
    dispatch({ type: "update", id: todo.id, patch: { title, description } })
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}
