import { NextRequest, NextResponse } from "next/server"

const GRAPHQL_API_URL =
  process.env.GRAPHQL_API_URL ?? "http://localhost:3001/graphql"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const code = searchParams.get("code")
  const state = searchParams.get("state")

  const expectedState = request.cookies.get("google_oauth_state")?.value

  if (!code || !state || !expectedState || state !== expectedState) {
    const response = NextResponse.redirect(
      new URL("/login?error=google", request.url)
    )

    response.cookies.delete("google_oauth_state")

    return response
  }

  try {
    const exchangeUrl = GRAPHQL_API_URL.replace(
      "/graphql",
      "/auth/google/exchange"
    )

    const response = await fetch(exchangeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(
        "Google token exchange failed.",
        response.status,
        await response.text()
      )

      const redirectResponse = NextResponse.redirect(
        new URL("/login?error=google", request.url)
      )
      redirectResponse.cookies.delete("google_oauth_state")

      return redirectResponse
    }

    const data: { accessToken?: string } = await response.json()

    if (!data.accessToken) {
      throw new Error("Missing access token")
    }

    const redirectResponse = NextResponse.redirect(new URL("/", request.url))

    redirectResponse.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    redirectResponse.cookies.delete("google_oauth_state")

    return redirectResponse
  } catch (error) {
    console.error("Google authentication failed", error)

    const response = NextResponse.redirect(
      new URL("/login?error=google", request.url)
    )

    response.cookies.delete("google_oauth_state")

    return response
  }
}
