import type { Todo as DbTodo } from "@/lib/db"

/** The todo shape sent to the client (no owner info). */
export type Todo = Omit<DbTodo, "userId">

/** A todo as rendered on the client; `pending` marks optimistic entries. */
export type ClientTodo = Todo & { pending?: boolean }

export const OPTIMISTIC_PREFIX = "optimistic-"

export type OptimisticAction =
  | { type: "add"; todo: ClientTodo }
  | {
      type: "update"
      id: string
      patch: Partial<Pick<Todo, "title" | "description" | "completed">>
    }
  | { type: "delete"; id: string }
  | { type: "clear-completed" }

export type OptimisticDispatch = (action: OptimisticAction) => void

export function optimisticReducer(
  todos: ClientTodo[],
  action: OptimisticAction
): ClientTodo[] {
  switch (action.type) {
    case "add":
      return [...todos, action.todo]
    case "update":
      return todos.map((t) =>
        t.id === action.id ? { ...t, ...action.patch, pending: true } : t
      )
    case "delete":
      return todos.filter((t) => t.id !== action.id)
    case "clear-completed":
      return todos.filter((t) => !t.completed)
  }
}
