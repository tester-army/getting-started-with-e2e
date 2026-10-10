import { NextResponse, type NextRequest } from "next/server"

// Optimistic auth redirects based on cookie presence only. The real session
// check happens on the server (see lib/auth.ts) for every page and action.
const SESSION_COOKIE = "session"
const PROTECTED = ["/todos", "/settings"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE)

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasSession ? "/todos" : "/login", request.url)
    )
  }

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Note: /login isn't redirected here because a stale cookie would cause a
  // redirect loop; the login page validates the session itself.
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/todos/:path*", "/settings/:path*"],
}
