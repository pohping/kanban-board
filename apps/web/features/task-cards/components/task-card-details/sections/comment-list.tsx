import { GetCardQuery } from "@workspace/graphql"
import { UserComment } from "./user-comment"
import { useQuery } from "@apollo/client/react"
import { ME } from "@/features/auth/graphql/queries"

export interface CommentListProps {
  comments: GetCardQuery["card"]["comments"]
}

export function CommentList({ comments }: CommentListProps) {
  const { data: currentUser } = useQuery(ME)
  console.log({ currentUser })

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <UserComment
          key={comment.id}
          comment={comment}
          currentUser={currentUser?.me}
        />
      ))}
    </div>
  )
}
