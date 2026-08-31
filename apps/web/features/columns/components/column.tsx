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
import { isSortable } from "@dnd-kit/react/sortable"
import { TaskCard } from "@/features/task-cards/components/task-card"
import { ColumnData } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { CreateTaskCard } from "@/features/task-cards/components/create-task-card"

interface ColumnProps {
  column: ColumnData
}

export function Column({ column }: ColumnProps) {
  const [openCreateCard, setOpenCreateCard] = useState(false)
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
    <Card
      ref={ref}
      className={cn("flex max-h-[80vh] min-h-0 flex-1 flex-col", {
        ["bg-muted"]: isOver,
      })}
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          {column.title}
          <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs dark:bg-slate-700">
            {column.cards.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto p-2">
        {column.cards.map((card, idx) => (
          <TaskCard
            key={card.id}
            card={card}
            columnId={column.id}
            index={idx}
          />
        ))}
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
