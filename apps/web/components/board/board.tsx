"use client"

import { BoardWithRelations, CardWithRelations } from "@repo/types"
import { BoardColumn } from "./board-column"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider, DragOverlay } from "@dnd-kit/react"
import { useRef, useState } from "react"
import { isSortable } from "@dnd-kit/react/sortable"
import { toast, Toaster } from "@workspace/ui/components/toast"

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
    <main className="min-h-screen w-full bg-background">
      <div className="flex h-screen gap-3 p-4">
        <DragDropProvider
          onDragStart={() => {
            snapshot.current = cardsByColumn
          }}
          onDragOver={(event) => {
            setCardsByColumn((items) => move(items, event))
          }}
          onDragEnd={(event) => {
            if (event.canceled) {
              setCardsByColumn(snapshot.current)
              return
            }

            const { source } = event.operation
            if (!isSortable(source)) return

            const cardId = String(source.id)
            const columnId = String(source.group)

            const cards = cardsByColumn[columnId] ?? []
            const index = cards.findIndex((c) => c.id === cardId)
            if (index === -1) return

            const prevPos = cards[index - 1]?.position ?? 0
            const nextPos = cards[index + 1]?.position ?? prevPos + 2
            const newPosition = (prevPos + nextPos) / 2

            const rollback = snapshot.current

            // reflect the resolved position/columnId in local state
            setCardsByColumn((current) => ({
              ...current,
              [columnId]: (current[columnId] ?? []).map((c) =>
                c.id === cardId ? { ...c, columnId, position: newPosition } : c
              ),
            }))

            toast.add({
              title: "Card moved",
              description: (
                <div className="space-y-2 py-2">
                  <div>{`Card ID : ${cardId}`}</div>
                  <div>{`Column ID: ${columnId}`}</div>
                  <div>{`New Position: ${newPosition}`}</div>
                </div>
              ),
            })
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
      <Toaster />
    </main>
  )
}
