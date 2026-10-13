"use client"

import { useRef, useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { type TodoDispatch } from "./types"

export function CreateTodoForm({ dispatch }: { dispatch: TodoDispatch }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = title.trim()
    if (!value) {
      setError("Enter a todo first.")
      inputRef.current?.focus()
      return
    }

    dispatch({
      type: "add",
      todo: {
        id: crypto.randomUUID(),
        title: value,
        description: "",
        completed: false,
      },
    })
    setTitle("")
    setError(null)
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
