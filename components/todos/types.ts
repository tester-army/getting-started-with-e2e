export type Todo = {
  id: string
  title: string
  description: string
  completed: boolean
}

export type TodoAction =
  | { type: "add"; todo: Todo }
  | {
      type: "update"
      id: string
      patch: Partial<Pick<Todo, "title" | "description" | "completed">>
    }
  | { type: "delete"; id: string }
  | { type: "clear-completed" }

export type TodoDispatch = (action: TodoAction) => void

export function todoReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "add":
      return [...todos, action.todo]
    case "update":
      return todos.map((t) =>
        t.id === action.id ? { ...t, ...action.patch } : t
      )
    case "delete":
      return todos.filter((t) => t.id !== action.id)
    case "clear-completed":
      return todos.filter((t) => !t.completed)
  }
}
