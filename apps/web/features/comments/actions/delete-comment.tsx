import { useMutation } from "@apollo/client/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@workspace/ui/components/alert-dialog"
import { REMOVE_COMMENT } from "../graphql/mutations"
import { useState } from "react"
import { toast } from "sonner"
import { GET_CARD } from "@/features/task-cards/graphql/queries"
// import { toast } from "@workspace/ui/components/toast"

interface DeleteCommentProps {
  commentId: string
}

export function DeleteComment({ commentId }: DeleteCommentProps) {
  const [open, setOpen] = useState(true)
  const [deleteComment, { loading: deleting }] = useMutation(REMOVE_COMMENT, {
    refetchQueries: [GET_CARD],
  })

  async function handleDelete() {
    try {
      await deleteComment({ variables: { commentId } })
      toast.success("Comment deleted.", { position: "top-center" })
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Error occured while deleting.", { position: "top-center" })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogHeader>Are you sure to delete?</AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
