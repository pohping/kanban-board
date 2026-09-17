import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const PROTECTED_PREFIXES = ["/boards"]
const GUEST_ONLY_PATHS = ["/login"]

const LOGIN_PATH = "/login"
const COOKIE_NAME = "access_token"

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isGuestOnly(pathname: string): boolean {
  return GUEST_ONLY_PATHS.includes(pathname)
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(LOGIN_PATH, request.url)

  loginUrl.searchParams.set(
    "callbackUrl",
    request.nextUrl.pathname + request.nextUrl.search
  )

  return NextResponse.redirect(loginUrl)
}

function redirectToHome(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL("/", request.url))
}

export async function proxy(
  request: NextRequest
): Promise<NextResponse | void> {
  const { pathname } = request.nextUrl

  const protectedRoute = isProtected(pathname)
  const guestOnlyRoute = isGuestOnly(pathname)

  // Public route that doesn't need authentication
  if (!protectedRoute && !guestOnlyRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  // Protected route + no token → login
  if (protectedRoute && !token) {
    return redirectToLogin(request)
  }

  // Guest-only route + no token → allow login page
  if (guestOnlyRoute && !token) {
    return NextResponse.next()
  }

  try {
    await jwtVerify(token!, new TextEncoder().encode(process.env.JWT_SECRET))

    // Authenticated user trying to access /login
    if (guestOnlyRoute) {
      return redirectToHome(request)
    }

    // Authenticated user accessing protected route
    return NextResponse.next()
  } catch {
    // Invalid/expired token
    const response = protectedRoute
      ? redirectToLogin(request)
      : NextResponse.next()

    response.cookies.delete(COOKIE_NAME)

    return response
  }
}

export const config = {
  matcher: ["/boards/:path*", "/login"],
}
