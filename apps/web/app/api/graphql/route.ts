import { NextRequest, NextResponse } from "next/server"

const GRAPHQL_API_URL =
  process.env.GRAPHQL_API_URL ?? "http://localhost:3001/graphql"

export async function POST(request: NextRequest) {
  const body = await request.text()

  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
      Accept: request.headers.get("accept") ?? "application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    body,
    cache: "no-store",
  })

  const responseBody = await response.text()

  const nextResponse = new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  })

  const setCookie = response.headers.get("set-cookie")

  if (setCookie) {
    nextResponse.headers.set("set-cookie", setCookie)
  }

  return nextResponse
}
