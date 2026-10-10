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

export async function createProjectAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser()
  const name = readText(formData, "name", {
    label: "Project name",
    max: 60,
    required: true,
  })
  if (!name.ok) return name
  try {
    const project = await db.createProject(user.id, name.value)
    refresh()
    return { ok: true, data: { id: project.id } }
  } catch (error) {
    return fail(errorMessage(error))
  }
}

export async function deleteProjectAction(
  projectId: string
): Promise<ActionResult> {
  const user = await getCurrentUser()
  try {
    await db.deleteProject(user.id, projectId)
  } catch (error) {
    return fail(errorMessage(error))
  }
  refresh()
  return { ok: true, data: undefined }
}
