import { CardData } from "@/features/task-cards/types"
import { GetCardQuery } from "@workspace/graphql"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { formatDistanceToNow } from "date-fns"

interface CardCommentProps {
  comment: GetCardQuery["card"]["comments"][number]
}

export function CardComment({ comment }: CardCommentProps) {
  return (
    <div className="flex gap-2">
      <Avatar>
        {/* <AvatarImage src={comment.user.avatar} alt={comment.user.name} /> */}
        <AvatarFallback>
          {comment.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <a
            href={`/profile/${comment.user.id}`}
            className="text-sm font-medium"
          >
            {comment.user.name}
          </a>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          {comment.content}
        </p>
      </div>
    </div>
  )
}
