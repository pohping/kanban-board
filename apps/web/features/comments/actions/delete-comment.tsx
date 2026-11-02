import { useMutation } from "@apollo/client/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { REMOVE_COMMENT } from "../graphql/mutations"
import { useState } from "react"
import { toast } from "@workspace/ui/components/toast"

interface DeleteCommentProps {
  commentId: string
}

export function DeleteComment({ commentId }: DeleteCommentProps) {
  const [open, setOpen] = useState(true)
  const [deleteComment, { loading: deleting }] = useMutation(REMOVE_COMMENT)

  async function handleDelete() {
    try {
      await deleteComment({ variables: { commentId } })
      toast.add({ title: "Comment deleted." })
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.add({ title: "Error occured while deleting." })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
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
