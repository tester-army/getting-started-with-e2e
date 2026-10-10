"use client"

import { useOptimistic, useState, useTransition } from "react"
import { HashIcon, InboxIcon } from "lucide-react"
import { toast } from "sonner"

import { clearCompletedAction } from "@/app/actions/todos"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CreateTodoForm } from "./create-todo-form"
import { TodoItem } from "./todo-item"
import { optimisticReducer, type Todo } from "./types"

type Filter = "all" | "open" | "done"

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: "No todos yet. Add one above to get started.",
  open: "Nothing left to do. Nice work!",
  done: "No done todos yet.",
}

export function TodoApp({
  projectId,
  projectName,
  todos,
}: {
  /** `null` is the Inbox. */
  projectId: string | null
  projectName: string
  todos: Todo[]
}) {
  const [optimisticTodos, dispatch] = useOptimistic(todos, optimisticReducer)
  const [filter, setFilter] = useState<Filter>("all")
  const [isClearing, startTransition] = useTransition()

  const remaining = optimisticTodos.filter((t) => !t.completed).length
  const doneCount = optimisticTodos.length - remaining

  const visibleTodos = optimisticTodos.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.completed : t.completed
  )

  function handleClearDone() {
    startTransition(async () => {
      dispatch({ type: "clear-completed" })
      const result = await clearCompletedAction(projectId)
      if (!result.ok) toast.error(result.error)
    })
  }

  const Icon = projectId ? HashIcon : InboxIcon

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="flex items-end justify-between gap-4">
        <h1 className="flex min-w-0 items-center gap-2 text-2xl font-semibold tracking-tight">
          <Icon className="size-5 shrink-0 text-muted-foreground" />
          <span className="truncate">{projectName}</span>
        </h1>
        <p
          role="status"
          aria-label="Remaining"
          className="shrink-0 text-sm text-muted-foreground tabular-nums"
        >
          {remaining} remaining
        </p>
      </header>

      <CreateTodoForm projectId={projectId} dispatch={dispatch} />

      <div className="flex items-center justify-between gap-2">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
        >
          <TabsList aria-label="Filter todos">
            <TabsTrigger value="all" className="px-3">
              All
            </TabsTrigger>
            <TabsTrigger value="open" className="px-3">
              Open
            </TabsTrigger>
            <TabsTrigger value="done" className="px-3">
              Done
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearDone}
          disabled={doneCount === 0 || isClearing}
          className="text-muted-foreground"
        >
          Clear done
        </Button>
      </div>

      {visibleTodos.length > 0 ? (
        <ul className="-mx-3 flex flex-col" aria-label="Todos">
          {visibleTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          {EMPTY_MESSAGES[filter]}
        </p>
      )}
    </div>
  )
}
