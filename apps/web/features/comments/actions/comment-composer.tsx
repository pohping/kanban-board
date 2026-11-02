import { useComment } from "../providers/comment-provider"
import { CreateComment } from "./create-comment"
import { EditComment } from "./edit-comment"

export function CommentComposer({ cardId }: { cardId: string }) {
  const { editableComment } = useComment()

  return editableComment ? <EditComment /> : <CreateComment cardId={cardId} />
}
