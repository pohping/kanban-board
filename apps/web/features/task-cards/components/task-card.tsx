import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { MessageCircle, Paperclip } from "lucide-react"
import { TaskCardMenu } from "./task-card-menu"
import { TaskCardLabels } from "./task-card-labels"
import { TaskCardAssignees } from "./task-card-assignees"
import { TaskCardMeta } from "./task-card-meta"
import { useSortable } from "@dnd-kit/react/sortable"
import type { CardData } from "../types"
import { cn } from "@workspace/ui/lib/utils"

interface TaskCardProps {
  index: number
  columnId: string
  card: CardData
}

export function TaskCard({ card, columnId, index }: TaskCardProps) {
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    group: columnId,
    type: "card",
    accept: "card",
  })

  return (
    <Card
      size="sm"
      ref={ref}
      className={cn("shadow transition-shadow hover:shadow-md", {
        ["opacity-50"]: isDragging,
      })}
    >
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        {card.description && (
          <CardDescription>{card.description}</CardDescription>
        )}
        <CardAction>
          <TaskCardMenu card={card} />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <TaskCardLabels labels={card.labels} />
        <TaskCardMeta card={card} />
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="item-center flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-1 px-2"
          >
            <MessageCircle className="size-3.5" />
            <span className="text-xs">{card.commentCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-1 px-2"
          >
            <Paperclip className="size-3.5" />
            <span className="text-xs">{card.attachmentCount}</span>
          </Button>
        </div>
        <TaskCardAssignees assignees={card.assignees} />
      </CardFooter>
    </Card>
  )
}
