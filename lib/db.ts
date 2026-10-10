import "server-only"

import { randomUUID } from "node:crypto"
import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

// A tiny JSON-file "database". Swap this module for a real database without
// touching the UI or the Server Actions. Every query is scoped to a user id.

export type User = {
  id: string
  email: string
  displayName: string
  createdAt: string
}

export type Session = {
  token: string
  userId: string
  expiresAt: string
}

export type Project = {
  id: string
  userId: string
  name: string
  createdAt: string
}

export type Todo = {
  id: string
  userId: string
  /** `null` means the todo lives in the Inbox. */
  projectId: string | null
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

type Data = {
  users: User[]
  sessions: Session[]
  projects: Project[]
  todos: Todo[]
}

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "db.json")

const empty = (): Data => ({ users: [], sessions: [], projects: [], todos: [] })

async function load(): Promise<Data> {
  try {
    return { ...empty(), ...JSON.parse(await readFile(DATA_FILE, "utf8")) }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty()
    throw error
  }
}

async function save(data: Data) {
  await mkdir(DATA_DIR, { recursive: true })
  // Write atomically so a crash mid-write can't corrupt the file.
  const tmp = `${DATA_FILE}.${process.pid}.${randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(data, null, 2))
  await rename(tmp, DATA_FILE)
}

// Serialize writes so concurrent mutations don't clobber each other.
let queue: Promise<unknown> = Promise.resolve()
function mutate<T>(fn: (data: Data) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const data = await load()
    const result = await fn(data)
    await save(data)
    return result
  })
  queue = run.catch(() => {})
  return run
}

const now = () => new Date().toISOString()

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`)
  }
}

// ---- Users & sessions ------------------------------------------------------

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export function createSession(email: string) {
  return mutate((data) => {
    let user = data.users.find((u) => u.email === email)
    if (!user) {
      user = { id: randomUUID(), email, displayName: "", createdAt: now() }
      data.users.push(user)
    }
    const session: Session = {
      token: randomUUID(),
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    }
    // Drop expired sessions while we're here.
    data.sessions = data.sessions.filter(
      (s) => new Date(s.expiresAt).getTime() > Date.now()
    )
    data.sessions.push(session)
    return session
  })
}

export async function getUserBySessionToken(token: string) {
  const data = await load()
  const session = data.sessions.find((s) => s.token === token)
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    return null
  }
  return data.users.find((u) => u.id === session.userId) ?? null
}

export function deleteSession(token: string) {
  return mutate((data) => {
    data.sessions = data.sessions.filter((s) => s.token !== token)
  })
}

export function updateUser(userId: string, patch: Pick<User, "displayName">) {
  return mutate((data) => {
    const user = data.users.find((u) => u.id === userId)
    if (!user) throw new NotFoundError("User")
    Object.assign(user, patch)
    return user
  })
}

// ---- Projects --------------------------------------------------------------

export async function getProjects(userId: string) {
  const data = await load()
  return data.projects
    .filter((p) => p.userId === userId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function createProject(userId: string, name: string) {
  return mutate((data) => {
    const project: Project = { id: randomUUID(), userId, name, createdAt: now() }
    data.projects.push(project)
    return project
  })
}

/** Deletes a project; its todos move back to the Inbox. */
export function deleteProject(userId: string, projectId: string) {
  return mutate((data) => {
    const exists = data.projects.some(
      (p) => p.id === projectId && p.userId === userId
    )
    if (!exists) throw new NotFoundError("Project")
    data.projects = data.projects.filter((p) => p.id !== projectId)
    for (const todo of data.todos) {
      if (todo.userId === userId && todo.projectId === projectId) {
        todo.projectId = null
        todo.updatedAt = now()
      }
    }
  })
}

// ---- Todos -----------------------------------------------------------------

export async function getTodos(userId: string, projectId: string | null) {
  const data = await load()
  return data.todos
    .filter((t) => t.userId === userId && t.projectId === projectId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function createTodo(
  userId: string,
  input: { title: string; projectId: string | null }
) {
  return mutate((data) => {
    if (
      input.projectId &&
      !data.projects.some(
        (p) => p.id === input.projectId && p.userId === userId
      )
    ) {
      throw new NotFoundError("Project")
    }
    const todo: Todo = {
      id: randomUUID(),
      userId,
      projectId: input.projectId,
      title: input.title,
      description: "",
      completed: false,
      createdAt: now(),
      updatedAt: now(),
    }
    data.todos.push(todo)
    return todo
  })
}

export function updateTodo(
  userId: string,
  id: string,
  patch: Partial<Pick<Todo, "title" | "description" | "completed">>
) {
  return mutate((data) => {
    const todo = data.todos.find((t) => t.id === id && t.userId === userId)
    if (!todo) throw new NotFoundError("Todo")
    Object.assign(todo, patch, { updatedAt: now() })
    return todo
  })
}

export function deleteTodo(userId: string, id: string) {
  return mutate((data) => {
    const before = data.todos.length
    data.todos = data.todos.filter((t) => !(t.id === id && t.userId === userId))
    if (data.todos.length === before) throw new NotFoundError("Todo")
  })
}

export function deleteCompletedTodos(userId: string, projectId: string | null) {
  return mutate((data) => {
    data.todos = data.todos.filter(
      (t) =>
        !(t.userId === userId && t.projectId === projectId && t.completed)
    )
  })
}
