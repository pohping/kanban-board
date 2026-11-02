import { GetCardQuery, MeQuery } from "@workspace/graphql"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@workspace/ui/components/button"
import { Ellipsis } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useComment } from "../providers/comment-provider"

interface CommentItemProps {
  comment: GetCardQuery["card"]["comments"][number]
  currentUser?: MeQuery["me"]
}

export function CommentItem({ comment, currentUser }: CommentItemProps) {
  const { setEditableComment } = useComment()

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
      {comment.user.id === currentUser?.id && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="ml-auto">
                <Ellipsis />
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setEditableComment(comment)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
