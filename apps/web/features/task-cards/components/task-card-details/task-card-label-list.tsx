import { GetCardQuery } from "@workspace/graphql"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Pen } from "lucide-react"
import { useState } from "react"
import { useApolloClient, useMutation } from "@apollo/client/react"
import {
  ADD_CARD_LABEL,
  REMOVE_CARD_LABEL,
} from "@/features/task-cards/graphql/mutations"
import { PageLoader } from "@/components/page-loader/page-loader"
import { useParams } from "next/navigation"
import { GET_BOARD } from "@/features/boards/graphql/queries"
import { TaskCardEditLabel } from "./task-card-edit-label"

interface TaskCardLabelListProps {
  cardId: string
  onClose?: () => void
  labels: GetCardQuery["card"]["labels"]
}

export function TaskCardLabelList({
  labels,
  cardId,
  onClose,
}: TaskCardLabelListProps) {
  const client = useApolloClient()
  const { id: boardId } = useParams<{ id: string }>()
  const boardData = client.readQuery({
    query: GET_BOARD,
    variables: { id: boardId },
  })
  const boardLabels = boardData?.board?.labels ?? []
  const cardLabelIds = new Set(labels.map((l) => l.id) ?? [])

  const [labelToEdit, setLabelToEdit] = useState<(typeof labels)[number]>()
  const [addCardLabel, { loading: addingCardLabel }] =
    useMutation(ADD_CARD_LABEL)
  const [removeCardLabel, { loading: removingCardLabel }] =
    useMutation(REMOVE_CARD_LABEL)

  async function toggleLabel(labelId: string, shouldApply: boolean) {
    try {
      if (shouldApply) {
        await addCardLabel({
          variables: { input: { cardId: cardId, labelId } },
        })
      } else {
        await removeCardLabel({
          variables: { input: { cardId: cardId, labelId } },
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open && onClose) {
      onClose()
    }
  }

  const isLoading = addingCardLabel || removingCardLabel

  if (labelToEdit) {
    return (
      <TaskCardEditLabel
        label={labelToEdit}
        onOpenChange={() => setLabelToEdit(undefined)}
      />
    )
  }

  return (
    <Drawer open={true} swipeDirection="right" onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Labels</DrawerTitle>
          <DrawerDescription>
            List of labels available in board
          </DrawerDescription>
        </DrawerHeader>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="h-full p-4">
            <form>
              <FieldGroup className="gap-3">
                {boardLabels.map((label) => (
                  <Field key={label.id} orientation="horizontal">
                    <Checkbox
                      id={label.id}
                      checked={cardLabelIds.has(label.id)}
                      onCheckedChange={(checked) =>
                        toggleLabel(label.id, checked)
                      }
                    />
                    <FieldLabel
                      htmlFor={label.id}
                      className="flex-1 self-stretch rounded-sm px-2 text-white"
                      style={{ background: label.color }}
                    >
                      {label.name}
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setLabelToEdit(label)}
                    >
                      <Pen />
                    </Button>
                  </Field>
                ))}
              </FieldGroup>
            </form>
          </div>
        )}

        <DrawerFooter>
          <Button>Add Label</Button>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
