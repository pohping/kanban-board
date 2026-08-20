"use client"

import { ColumnWithCards } from "@repo/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { BoardTaskCard } from "./board-task-card"
import { useDragDropMonitor, useDroppable } from "@dnd-kit/react"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { isSortable } from "@dnd-kit/react/sortable"

interface BoardColumnProps {
  column: ColumnWithCards
}

export function BoardColumn({ column }: BoardColumnProps) {
  const { ref } = useDroppable({
    id: column.id,
    type: "column",
    collisionPriority: 0,
  })

  const [isOver, setIsOver] = useState(false)

  useDragDropMonitor({
    onDragOver(event) {
      const { target } = event.operation
      const targetGroup =
        target && isSortable(target) ? target.group : target?.id
      setIsOver(targetGroup === column.id)
    },
    onDragEnd() {
      setIsOver(false)
    },
  })

  return (
    <Card ref={ref} className={cn("flex-1", { ["bg-muted"]: isOver })}>
      <CardHeader>
        <CardTitle>{column.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {column.cards.map((card, idx) => (
          <BoardTaskCard
            key={card.id}
            card={card}
            columnId={column.id}
            index={idx}
          />
        ))}
      </CardContent>
    </Card>
  )
}
