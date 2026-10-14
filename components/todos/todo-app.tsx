"use client"

import { useState } from "react"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

type Todo = { id: string; title: string; completed: boolean }

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")

  const remaining = todos.filter((t) => !t.completed).length

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = title.trim()
    if (!value) return
    setTodos([...todos, { id: crypto.randomUUID(), title: value, completed: false }])
    setTitle("")
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-8">
      <header className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Todos</h1>
        <p role="status" aria-label="Remaining" className="text-sm text-muted-foreground">
          {remaining} remaining
        </p>
      </header>

      <form onSubmit={add} className="flex gap-2">
        <Input
          aria-label="New todo"
          placeholder="New todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>

      <ul aria-label="Todos" className="flex flex-col">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 py-2">
            <Checkbox
              aria-label={todo.title}
              checked={todo.completed}
              onCheckedChange={(completed) =>
                setTodos(todos.map((t) => (t.id === todo.id ? { ...t, completed } : t)))
              }
            />
            <span className={todo.completed ? "flex-1 text-muted-foreground line-through" : "flex-1"}>
              {todo.title}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${todo.title}`}
              onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}
            >
              <Trash2Icon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
