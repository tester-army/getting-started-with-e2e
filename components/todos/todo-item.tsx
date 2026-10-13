"use client"

import { cn } from "cn"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { EditTodoDialog } from "./edit-todo-dialog"
import type { Todo, TodoDispatch } from "./types"

export function TodoItem({
  todo,
  dispatch,
}: {
  todo: Todo
  dispatch: TodoDispatch
}) {
  return (
    <li
      data-testid="todo-item"
      data-completed={todo.completed}
      className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(completed) =>
          dispatch({ type: "update", id: todo.id, patch: { completed } })
        }
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
        <EditTodoDialog todo={todo} dispatch={dispatch} />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${todo.title}`}
          className="hover:text-destructive"
          onClick={() => dispatch({ type: "delete", id: todo.id })}
        >
          <Trash2Icon />
        </Button>
      </div>
    </li>
  )
}
