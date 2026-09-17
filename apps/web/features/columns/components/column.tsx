"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card"
import { useDragDropMonitor, useDroppable } from "@dnd-kit/react"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { isSortable, useSortable } from "@dnd-kit/react/sortable"
import { TaskCard } from "@/features/task-cards/components/task-card"
import { ColumnData } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { CreateTaskCard } from "@/features/task-cards/components/create-task-card"
import { CollisionPriority } from "@dnd-kit/abstract"

interface ColumnProps {
  column: ColumnData
  index: number
}

export function Column({ column, index }: ColumnProps) {
  const [openCreateCard, setOpenCreateCard] = useState(false)

  const { ref, isDragging } = useSortable({
    id: `col-sortable:${column.id}`,
    index,
    group: "board",
    type: "column",
    accept: "column",
  })

  const { ref: dropRef } = useDroppable({
    id: column.id,
    type: "column-content",
    accept: "card",
    collisionPriority: CollisionPriority.Low,
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
    <Card
      ref={ref}
      className={cn("flex max-h-[80vh] min-h-0 flex-1 flex-col gap-0", {
        ["opacity-50"]: isDragging,
      })}
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          {column.title}
          <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs">
            {column.cards.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-2">
        <div
          ref={dropRef}
          className={cn("h-full space-y-4 overflow-y-auto p-2", {
            ["bg-muted"]: isOver,
          })}
        >
          {column.cards.map((card, idx) => (
            <TaskCard
              key={card.id}
              card={card}
              columnId={column.id}
              index={idx}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-1">
        <Button
          variant="ghost"
          className="h-10 w-full cursor-pointer"
          onClick={() => setOpenCreateCard(true)}
        >
          <Plus /> Add Task
        </Button>
      </CardFooter>
      <CreateTaskCard
        open={openCreateCard}
        onOpenChange={setOpenCreateCard}
        columnId={column.id}
      />
    </Card>
  )
}
