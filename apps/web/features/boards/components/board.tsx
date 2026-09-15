"use client"

import { DragDropProvider, useDroppable } from "@dnd-kit/react"
import { useEffect, useRef, useState } from "react"
import { move } from "@dnd-kit/helpers"
import { isSortable } from "@dnd-kit/react/sortable"
import type { BoardData } from "../types"
import { Column } from "@/features/columns/components/column"
import { useMutation } from "@apollo/client/react"
import { MOVE_CARD } from "@/features/task-cards/graphql/mutations"
import { toast } from "@workspace/ui/components/toast"
// import { useParams } from "next/navigation"
import { GET_BOARD } from "../graphql/queries"
import { NewColumn } from "@/features/columns/components/new-column"
import { MOVE_COLUMN } from "@/features/columns/graphql/mutations"

interface BoardProps {
  board: BoardData
}

export function Board({ board }: BoardProps) {
  // const { id: boardId } = useParams<{ id: string }>()
  const [moveCard] = useMutation(MOVE_CARD, {
    refetchQueries: [{ query: GET_BOARD, variables: { id: board.id } }],
    awaitRefetchQueries: true,
  })
  const [moveColumn] = useMutation(MOVE_COLUMN, {
    refetchQueries: [{ query: GET_BOARD, variables: { id: board.id } }],
    awaitRefetchQueries: true,
  })
  const [columnOrder, setColumnOrder] = useState(() =>
    [...board.columns]
      .sort((a, b) => a.position - b.position)
      .map((c) => `col-sortable:${c.id}`)
  )
  const [cardsByColumn, setCardsByColumn] = useState(() =>
    Object.fromEntries(board.columns.map((c) => [c.id, c.cards]))
  )
  const columnMeta = useRef(
    new Map(board.columns.map((c) => [c.id, c]))
  ).current

  const cardsSnapshot = useRef(cardsByColumn)
  const columnOrderSnapshot = useRef(columnOrder)

  const isDragging = useRef(false)

  useEffect(() => {
    if (isDragging.current) return

    setCardsByColumn(
      Object.fromEntries(board.columns.map((c) => [c.id, c.cards]))
    )
    setColumnOrder(
      [...board.columns]
        .sort((a, b) => a.position - b.position)
        .map((c) => `col-sortable:${c.id}`)
    )
  }, [board])

  useEffect(() => {
    columnMeta.clear()
    board.columns.forEach((c) => columnMeta.set(c.id, c))
  }, [board.columns])

  return (
    <DragDropProvider
      onDragStart={() => {
        isDragging.current = true
        columnOrderSnapshot.current = columnOrder
        cardsSnapshot.current = cardsByColumn
      }}
      onDragOver={(event) => {
        const { source } = event.operation
        if (!isSortable(source)) return

        if (source.type === "column") {
          console.log("column moved")
          setColumnOrder((order) => move(order, event))
        } else {
          setCardsByColumn((items) => move(items, event))
        }
      }}
      onDragEnd={async (event) => {
        isDragging.current = false

        if (event.canceled) {
          setColumnOrder(columnOrderSnapshot.current)
          setCardsByColumn(cardsSnapshot.current)
          return
        }

        const { source } = event.operation
        if (!isSortable(source)) return

        // column move
        if (source.type === "column") {
          const columnId = String(source.id).replace(/^col-sortable:/, "")
          const idx = columnOrder.indexOf(String(source.id))
          const prevId = columnOrder[idx - 1]?.replace(/^col-sortable:/, "")
          const nextId = columnOrder[idx + 1]?.replace(/^col-sortable:/, "")
          const prevPos = prevId ? (columnMeta.get(prevId)?.position ?? 0) : 0
          const nextPos = nextId
            ? (columnMeta.get(nextId)?.position ?? prevPos + 2)
            : prevPos + 2
          const newPosition = (prevPos + nextPos) / 2

          const rollback = columnOrderSnapshot.current
          console.log({ columnId, newPosition, columnOrder, idx, columnMeta })

          try {
            const { data } = await moveColumn({
              variables: {
                input: {
                  columnId,
                  position: newPosition,
                },
              },
            })
            if (data?.moveColumn) {
            }
            toast.add({ type: "success", description: "Column moved" })
          } catch (err) {
            console.error(err)
            toast.add({
              type: "error",
              description: "Couldn't move column — reverting",
            })
            setColumnOrder(rollback)
          }

          return
        }

        // card move
        const cardId = String(source.id)
        const columnId = String(source.group)

        const cards = cardsByColumn[columnId] ?? []
        const index = cards.findIndex((c) => c.id === cardId)
        if (index === -1) return

        const prevPos = cards[index - 1]?.position ?? 0
        const nextPos = cards[index + 1]?.position ?? prevPos + 2
        const newPosition = (prevPos + nextPos) / 2

        const rollback = cardsSnapshot.current

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

          // const confirmed = data?.moveCard
          // if (confirmed) {
          //   setCardsByColumn((current) => ({
          //     ...current,
          //     [columnId]: (current[columnId] ?? []).map((c) =>
          //       c.id === cardId
          //         ? {
          //             ...c,
          //             position: confirmed.position,
          //             columnId: confirmed.columnId,
          //           }
          //         : c
          //     ),
          //   }))
          // }

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
      <div className="flex gap-4 *:w-72 *:flex-shrink-0">
        {columnOrder.map((sortableId, idx) => {
          const id = sortableId.replace(/^col-sortable:/, "")
          const column = columnMeta.get(id)!
          return (
            <Column
              key={id}
              index={idx}
              column={{ ...column, cards: cardsByColumn[id] ?? [] }}
            />
          )
        })}
        <NewColumn boardId={board.id} />
      </div>
    </DragDropProvider>
  )
}
