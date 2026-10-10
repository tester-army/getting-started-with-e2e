import { redirect } from "next/navigation"

// proxy.ts normally handles "/" (to /todos or /login); this is a fallback.
export default function Home() {
  redirect("/todos")
}
