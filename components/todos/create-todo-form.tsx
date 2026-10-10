"use client"

import { useRef, useState, useTransition } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { createTodoAction } from "@/app/actions/todos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { OPTIMISTIC_PREFIX, type OptimisticDispatch } from "./types"

export function CreateTodoForm({
  projectId,
  dispatch,
}: {
  projectId: string | null
  dispatch: OptimisticDispatch
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = title.trim()
    if (!value) {
      setError("Enter a todo first.")
      inputRef.current?.focus()
      return
    }

    // Clear right away so the next todo can be typed while this one saves.
    setTitle("")
    setError(null)

    const formData = new FormData()
    formData.set("title", value)

    startTransition(async () => {
      const now = new Date().toISOString()
      dispatch({
        type: "add",
        todo: {
          id: `${OPTIMISTIC_PREFIX}${crypto.randomUUID()}`,
          projectId,
          title: value,
          description: "",
          completed: false,
          createdAt: now,
          updatedAt: now,
          pending: true,
        },
      })
      const result = await createTodoAction(projectId, formData)
      if (!result.ok) {
        toast.error(result.error)
        // Give the text back unless the user has started typing again.
        setTitle((current) => current || value)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <label htmlFor="new-todo" className="sr-only">
          New todo
        </label>
        <Input
          ref={inputRef}
          id="new-todo"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError(null)
          }}
          placeholder="New todo"
          maxLength={200}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "new-todo-error" : undefined}
          className="h-9"
        />
        <Button type="submit" size="lg">
          <PlusIcon data-icon="inline-start" />
          Add
        </Button>
      </div>
      {error && (
        <p id="new-todo-error" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
