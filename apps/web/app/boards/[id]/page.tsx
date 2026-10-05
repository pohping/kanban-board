"use client"

import { RequireAuth } from "@/features/auth/components/require-auth"
import { BoardContent } from "@/features/boards/components/board-content"
import { BoardProvider } from "@/features/boards/providers/board-provider"
import { TaskCardProvider } from "@/features/task-cards/providers/task-card-provider"
import { use } from "react"

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <BoardProvider>
      <TaskCardProvider>
        <BoardContent id={id} />
      </TaskCardProvider>
    </BoardProvider>
    // <RequireAuth>
    // </RequireAuth>
  )
}
