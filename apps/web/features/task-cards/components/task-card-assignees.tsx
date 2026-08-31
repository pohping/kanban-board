import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@workspace/ui/components/avatar"
import { CardData } from "../types"

interface TaskCardAssigneesProps {
  assignees: CardData["assignees"]
}

export function TaskCardAssignees({ assignees }: TaskCardAssigneesProps) {
  const visible = assignees.slice(0, 3)
  const remaining = assignees.length - visible.length

  return (
    <AvatarGroup>
      {visible.map((assignee) => (
        <Avatar key={assignee.user.id}>
          <AvatarFallback>
            {assignee.user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}

      {remaining > 0 && (
        <Avatar>
          <AvatarFallback>+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </AvatarGroup>
  )
}
