import { Calendar } from "lucide-react"
import { CardData } from "../types"

interface TaskCardMetaProps {
  card: CardData
}

export function TaskCardMeta({ card }: TaskCardMetaProps) {
  if (!card.dueDate) {
    return null
  }

  const dueDate = new Date(card.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Calendar className="size-3.5" />
      <span>{dueDate}</span>
    </div>
  )
}
