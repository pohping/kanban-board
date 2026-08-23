import { CardWithRelations } from "@repo/types"
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
import { MessageCircle, MoreHorizontal, Paperclip } from "lucide-react"
import { TaskCardMenu } from "./task-card-menu"
import { TaskCardLabels } from "./task-card-labels"
import { TaskCardAssignees } from "./task-card-assignees"
import { TaskCardMeta } from "./task-card-meta"

interface TaskCardProps {
  card: CardWithRelations
}

export function TaskCard({ card }: TaskCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        {card.description && (
          <CardDescription>{card.description}</CardDescription>
        )}
        <CardAction>
          <TaskCardMenu />
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
            <span className="text-xs">{card.comments.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-1 px-2"
          >
            <Paperclip className="size-3.5" />
            <span className="text-xs">{card.attachments.length}</span>
          </Button>
        </div>
        <TaskCardAssignees assignees={card.assignees} />
      </CardFooter>
    </Card>
  )
}
