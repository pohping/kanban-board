import { CardData } from "@/features/task-cards/types"
import { GetCardQuery } from "@workspace/graphql"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface CommentProps {
  comment: GetCardQuery["card"]["comments"][number]
}

export function Comment({ comment }: CommentProps) {
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
          <Link
            href={`/profile/${comment.user.id}`}
            className="text-sm font-medium !no-underline"
          >
            {comment.user.name}
          </Link>
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
