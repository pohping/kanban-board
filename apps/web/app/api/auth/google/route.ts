import { NextResponse } from "next/server"

export async function GET() {
  const apiUrl = process.env.GRAPHQL_API_URL ?? "http://localhost:3001/graphql"

  const googleUrl = apiUrl.replace("/graphql", "/auth/google")

  return NextResponse.redirect(googleUrl)
}
