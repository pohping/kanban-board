"use client"

import { ColumnWithCards } from "@repo/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { BoardTaskCard } from "./board-task-card"

interface BoardColumnProps {
  column: ColumnWithCards
}

export function BoardColumn({ column }: BoardColumnProps) {
  return (
    <Card className="flex-1">
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
