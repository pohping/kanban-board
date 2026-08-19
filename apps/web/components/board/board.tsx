"use client"

import { BoardWithRelations } from "@repo/types"
import { BoardColumn } from "./board-column"
import { DragDropProvider } from "@dnd-kit/react"

interface BoardProps {
  data: BoardWithRelations
}

export function Board({ data }: BoardProps) {
  return (
    <main className="bg-background">
      <div className="flex gap-3 p-4">
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return
            const { source } = event.operation
            if (!source) return

            console.log({ source })
          }}
        >
          {data.columns
            .sort((a, b) => a.position - b.position)
            .map((column) => (
              <BoardColumn key={column.id} column={column} />
            ))}
        </DragDropProvider>
      </div>
    </main>
  )
}
