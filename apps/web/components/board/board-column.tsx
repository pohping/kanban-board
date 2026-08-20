"use client"

import { ColumnWithCards } from "@repo/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { BoardTaskCard } from "./board-task-card"
import { useDroppable } from "@dnd-kit/react"
import { cn } from "@workspace/ui/lib/utils"

interface BoardColumnProps {
  column: ColumnWithCards
}

export function BoardColumn({ column }: BoardColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
    type: "column",
    collisionPriority: 0,
  })

  return (
    <Card ref={ref} className={cn("flex-1", { ["bg-muted"]: isDropTarget })}>
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
