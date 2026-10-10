"use server"

import { redirect } from "next/navigation"

import { endSession, startSession } from "@/lib/auth"
import { fail, type ActionResult } from "@/lib/action-result"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function signInAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!EMAIL_RE.test(email)) return fail("Enter a valid email address.")
  if (!password) return fail("Password is required.")

  // Demo auth: any email/password pair signs in, creating the account on
  // first use. Replace with real credential verification before production.
  await startSession(email)
  redirect("/todos")
}

export async function signOutAction() {
  await endSession()
  redirect("/login")
}
