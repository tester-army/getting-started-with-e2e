"use server"

import { refresh } from "next/cache"

import { getCurrentUser } from "@/lib/auth"
import {
  errorMessage,
  fail,
  readText,
  type ActionResult,
} from "@/lib/action-result"
import * as db from "@/lib/db"

const MAX_TITLE = 200
const MAX_DESCRIPTION = 1000

async function run(fn: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await fn()
  } catch (error) {
    return fail(errorMessage(error))
  }
  refresh()
  return { ok: true, data: undefined }
}

export async function createTodoAction(
  projectId: string | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser()
  const title = readText(formData, "title", {
    label: "Todo",
    max: MAX_TITLE,
    required: true,
  })
  if (!title.ok) return title
  return run(() =>
    db.createTodo(user.id, { title: title.value, projectId })
  )
}

export async function updateTodoAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser()
  const title = readText(formData, "title", {
    label: "Title",
    max: MAX_TITLE,
    required: true,
  })
  if (!title.ok) return title
  const description = readText(formData, "description", {
    label: "Description",
    max: MAX_DESCRIPTION,
  })
  if (!description.ok) return description
  return run(() =>
    db.updateTodo(user.id, id, {
      title: title.value,
      description: description.value,
    })
  )
}

export async function toggleTodoAction(
  id: string,
  completed: boolean
): Promise<ActionResult> {
  const user = await getCurrentUser()
  return run(() => db.updateTodo(user.id, id, { completed: completed === true }))
}

export async function deleteTodoAction(id: string): Promise<ActionResult> {
  const user = await getCurrentUser()
  return run(() => db.deleteTodo(user.id, id))
}

export async function clearCompletedAction(
  projectId: string | null
): Promise<ActionResult> {
  const user = await getCurrentUser()
  return run(() => db.deleteCompletedTodos(user.id, projectId))
}
