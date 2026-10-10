"use client"

import { useTransition } from "react"
import { cn } from "cn"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { deleteTodoAction, toggleTodoAction } from "@/app/actions/todos"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { EditTodoDialog } from "./edit-todo-dialog"
import {
  OPTIMISTIC_PREFIX,
  type ClientTodo,
  type OptimisticDispatch,
} from "./types"

export function TodoItem({
  todo,
  dispatch,
}: {
  todo: ClientTodo
  dispatch: OptimisticDispatch
}) {
  const [, startTransition] = useTransition()
  // Optimistic (not yet saved) todos can't be changed until the server
  // confirms them.
  const isUnsaved = todo.id.startsWith(OPTIMISTIC_PREFIX)

  function handleToggle(completed: boolean) {
    startTransition(async () => {
      dispatch({ type: "update", id: todo.id, patch: { completed } })
      const result = await toggleTodoAction(todo.id, completed)
      if (!result.ok) toast.error(result.error)
    })
  }

  function handleDelete() {
    startTransition(async () => {
      dispatch({ type: "delete", id: todo.id })
      const result = await deleteTodoAction(todo.id)
      if (!result.ok) toast.error(result.error)
    })
  }

  return (
    <li
      data-testid="todo-item"
      data-completed={todo.completed}
      className={cn(
        "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50",
        todo.pending && "opacity-60"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(checked) => handleToggle(checked)}
        disabled={isUnsaved}
        aria-label={todo.title}
        className="mt-0.5"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "text-sm font-medium break-words",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.title}
        </span>
        {todo.description && (
          <p className="text-xs whitespace-pre-line break-words text-muted-foreground">
            {todo.description}
          </p>
        )}
      </div>
      <div className="-my-1 flex shrink-0 items-center gap-0.5 text-muted-foreground">
        <EditTodoDialog todo={todo} dispatch={dispatch} disabled={isUnsaved} />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${todo.title}`}
          className="hover:text-destructive"
          onClick={handleDelete}
          disabled={isUnsaved}
        >
          <Trash2Icon />
        </Button>
      </div>
    </li>
  )
}
