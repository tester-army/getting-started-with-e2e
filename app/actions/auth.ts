"use server"

import { redirect } from "next/navigation"

import { endSession, startSession, verifyCredentials } from "@/lib/auth"
import { fail, type ActionResult } from "@/lib/action-result"

export async function signInAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!email.trim() || !password) {
    return fail("Enter your email and password.")
  }

  const verifiedEmail = verifyCredentials(email, password)
  if (!verifiedEmail) return fail("Invalid email or password.")

  await startSession(verifiedEmail)
  redirect("/todos")
}

export async function signOutAction() {
  await endSession()
  redirect("/login")
}
