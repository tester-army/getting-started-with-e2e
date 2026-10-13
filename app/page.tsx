import { redirect } from "next/navigation"

// This page redirects instead of rendering an instant UI.
export const instant = false

export default function Home() {
  redirect("/todos")
}
