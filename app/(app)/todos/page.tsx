import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { TodoApp } from "@/components/todos/todo-app"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser } from "@/lib/auth"
import * as db from "@/lib/db"

export const metadata: Metadata = { title: "Todos" }

export default function TodosPage({ searchParams }: PageProps<"/todos">) {
  return (
    <Suspense fallback={<TodosSkeleton />}>
      <Todos searchParams={searchParams} />
    </Suspense>
  )
}

async function Todos({
  searchParams,
}: {
  searchParams: PageProps<"/todos">["searchParams"]
}) {
  const { project } = await searchParams
  const projectId = typeof project === "string" && project ? project : null

  const user = await getCurrentUser()
  const projects = await db.getProjects(user.id)
  const current = projectId ? projects.find((p) => p.id === projectId) : null
  if (projectId && !current) notFound()

  const todos = await db.getTodos(user.id, projectId)

  return (
    <TodoApp
      // Reset local UI state (filter, form) when switching projects.
      key={projectId ?? "inbox"}
      projectId={projectId}
      projectName={current?.name ?? "Inbox"}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      todos={todos.map(({ userId, ...todo }) => todo)}
    />
  )
}

function TodosSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-8 sm:px-6"
      aria-busy="true"
      aria-label="Loading todos"
    >
      <div className="flex items-end justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-8 w-52" />
      {["w-3/4", "w-1/2", "w-2/3"].map((w) => (
        <div key={w} className="flex items-center gap-3 py-1">
          <Skeleton className="size-4" />
          <Skeleton className={`h-4 ${w}`} />
        </div>
      ))}
    </div>
  )
}
