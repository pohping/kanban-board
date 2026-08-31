import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { CardData } from "../types"
import { Trash2Icon } from "lucide-react"
import { useMutation } from "@apollo/client/react"
import { DELETE_CARD } from "../graphql/mutations"
import { toast } from "@workspace/ui/components/toast"
import { Spinner } from "@workspace/ui/components/spinner"
import { useParams } from "next/navigation"
import { GET_BOARD } from "@/features/boards/graphql/queries"

interface DeleteTaskCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: CardData
}

export function DeleteTaskCard({
  open,
  onOpenChange,
  card,
}: DeleteTaskCardProps) {
  const { id: boardId } = useParams<{ id: string }>()

  const [deleteCard, { loading }] = useMutation(DELETE_CARD, {
    refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
  })

  async function handleDelete() {
    try {
      await deleteCard({ variables: { id: card.id } })
      toast.add({ type: "success", description: "Card deleted" })
      onOpenChange(false)
    } catch (err) {
      toast.add({ type: "error", description: "Card failed to delete." })
      console.error(err)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete card?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this card.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? (
              <>
                <Spinner data-icon="inline-start" /> Deleting…
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
