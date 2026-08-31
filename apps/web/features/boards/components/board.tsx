"use client"

import { DragDropProvider } from "@dnd-kit/react"
import { useEffect, useRef, useState } from "react"
import { move } from "@dnd-kit/helpers"
import { isSortable } from "@dnd-kit/react/sortable"
import type { BoardData } from "../types"
import { Column } from "@/features/columns/components/column"
import { useMutation } from "@apollo/client/react"
import { MOVE_CARD } from "@/features/task-cards/graphql/mutations"
import { toast } from "@workspace/ui/components/toast"
import { useParams } from "next/navigation"
import { GET_BOARD } from "../graphql/queries"

interface BoardProps {
  board: BoardData
}

export function Board({ board }: BoardProps) {
  const { id: boardId } = useParams<{ id: string }>()
  const [moveCard] = useMutation(MOVE_CARD, {
    refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
    awaitRefetchQueries: true,
  })
  const [cardsByColumn, setCardsByColumn] = useState(() =>
    Object.fromEntries(board.columns.map((c) => [c.id, c.cards]))
  )
  const snapshot = useRef(cardsByColumn)
  const isDragging = useRef(false)

  useEffect(() => {
    if (isDragging.current) return

    setCardsByColumn(
      Object.fromEntries(board.columns.map((c) => [c.id, c.cards]))
    )
  }, [board])

  return (
    <DragDropProvider
      onDragStart={() => {
        isDragging.current = true
        snapshot.current = cardsByColumn
      }}
      onDragOver={(event) => {
        setCardsByColumn((items) => move(items, event))
      }}
      onDragEnd={async (event) => {
        isDragging.current = false

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

        try {
          const { data } = await moveCard({
            variables: {
              input: {
                cardId,
                targetColumnId: columnId,
                position: newPosition,
              },
            },
          })

          const confirmed = data?.moveCard
          if (confirmed) {
            setCardsByColumn((current) => ({
              ...current,
              [columnId]: (current[columnId] ?? []).map((c) =>
                c.id === cardId
                  ? {
                      ...c,
                      position: confirmed.position,
                      columnId: confirmed.columnId,
                    }
                  : c
              ),
            }))
          }

          toast.add({ type: "success", description: "Card moved" })
        } catch (err) {
          toast.add({
            type: "error",
            description: "Couldn't move card — reverting",
          })
          setCardsByColumn(rollback)
        }
      }}
    >
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={{ ...column, cards: cardsByColumn[column.id] ?? [] }}
        />
      ))}
    </DragDropProvider>
  )
}
