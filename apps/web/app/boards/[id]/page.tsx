"use client"

import { RequireAuth } from "@/features/auth/components/require-auth"
import { BoardContent } from "@/features/boards/components/board-content"
import { use } from "react"

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <RequireAuth>
      <BoardContent id={id} />
    </RequireAuth>
  )
}
