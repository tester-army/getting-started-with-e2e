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

export async function updateSettingsAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser()
  const displayName = readText(formData, "displayName", {
    label: "Display name",
    max: 60,
  })
  if (!displayName.ok) return displayName
  try {
    await db.updateUser(user.id, { displayName: displayName.value })
  } catch (error) {
    return fail(errorMessage(error))
  }
  refresh()
  return { ok: true, data: undefined }
}
