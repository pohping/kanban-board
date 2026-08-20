"use client"

import { BoardWithRelations, CardWithRelations } from "@repo/types"
import { BoardColumn } from "./board-column"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider, DragOverlay } from "@dnd-kit/react"
import { useRef, useState } from "react"

interface BoardProps {
  data: BoardWithRelations
}

export function Board({ data }: BoardProps) {
  const [columns] = useState(() =>
    [...data.columns].sort((a, b) => a.position - b.position)
  )
  const [cardsByColumn, setCardsByColumn] = useState<
    Record<string, CardWithRelations[]>
  >(() => Object.fromEntries(data.columns.map((c) => [c.id, c.cards])))
  const snapshot = useRef(cardsByColumn)

  return (
    <main className="bg-background">
      <div className="flex gap-3 p-4">
        <DragDropProvider
          onDragStart={() => {
            snapshot.current = cardsByColumn
          }}
          onDragOver={(event) => {
            setCardsByColumn((items) => move(items, event))
          }}
          onDragEnd={(event) => {
            if (event.canceled) setCardsByColumn(snapshot.current)
          }}
        >
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={{ ...column, cards: cardsByColumn[column.id] ?? [] }}
            />
          ))}
        </DragDropProvider>
      </div>
    </main>
  )
}
