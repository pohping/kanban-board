"use client"

import { ColumnWithCards } from "@repo/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { TaskCard } from "../task-card/task-card"
import { DragDropProvider } from "@dnd-kit/react"

interface BoardColumnProps {
  column: ColumnWithCards
}

export function BoardColumn({ column }: BoardColumnProps) {
  return (
    <DragDropProvider>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{column.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {column.cards.map((card) => (
            <TaskCard key={card.id} card={card} />
          ))}
        </CardContent>
      </Card>
    </DragDropProvider>
  )
}
