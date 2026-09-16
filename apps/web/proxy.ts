import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const PROTECTED_PREFIXES = ["/boards"]
const LOGIN_PATH = "/login"
const COOKIE_NAME = "access_token"

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set(
    "callbackUrl",
    request.nextUrl.pathname + request.nextUrl.search
  )

  return NextResponse.redirect(loginUrl)
}

export async function proxy(
  request: NextRequest
): Promise<NextResponse | void> {
  const { pathname } = request.nextUrl

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return redirectToLogin(request)
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return NextResponse.next()
  } catch {
    const response = redirectToLogin(request)
    response.cookies.delete("access_token")
    return response
  }
}

export const config = {
  matcher: ["/boards/:path*"],
}
