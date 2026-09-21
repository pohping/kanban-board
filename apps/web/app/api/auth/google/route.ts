import crypto from "node:crypto"
import { NextResponse } from "next/server"

export async function GET() {
  const apiUrl = process.env.GRAPHQL_API_URL ?? "http://localhost:3001/graphql"

  const state = crypto.randomBytes(32).toString()

  const googleUrl = new URL(apiUrl.replace("/graphql", "/auth/google"))

  googleUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(googleUrl)

  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  })

  return response
}
