import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import * as db from "@/lib/db"

export const SESSION_COOKIE = "session"

/** The signed-in user, or `null`. Deduplicated per request. */
export const getOptionalUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const user = await db.getUserBySessionToken(token)
  if (!user) return null
  // Expose only what the app needs.
  return { id: user.id, email: user.email, displayName: user.displayName }
})

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getOptionalUser>>>

/** The signed-in user; redirects to /login when there is no valid session. */
export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await getOptionalUser()
  if (!user) redirect("/login")
  return user
}

export async function startSession(email: string) {
  const session = await db.createSession(email)
  ;(await cookies()).set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  })
}

export async function endSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) await db.deleteSession(token)
  store.delete(SESSION_COOKIE)
}
