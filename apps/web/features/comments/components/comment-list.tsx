import { GetCardQuery } from "@workspace/graphql"
import { CommentItem } from "./comment-item"
import { useQuery } from "@apollo/client/react"
import { ME } from "@/features/auth/graphql/queries"

export type Comments = GetCardQuery["card"]["comments"]

interface CommentListProps {
  comments: Comments
}

export function CommentList({ comments }: CommentListProps) {
  const { data: currentUser } = useQuery(ME)

  if (comments.length === 0) {
    return <span className="text-muted-foreground">No comments</span>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser?.me}
        />
      ))}
    </div>
  )
}
