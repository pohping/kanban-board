import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { CardData } from "../types"
import { useMutation, useQuery, useApolloClient } from "@apollo/client/react"
import {
  ADD_CARD_LABEL,
  ASSIGN_CARD,
  REMOVE_CARD_LABEL,
  UNASSIGN_CARD,
  UPDATE_CARD,
} from "../graphql/mutations"
import { UpdateCardInput, updateCardSchema } from "../schemas/card.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@workspace/ui/components/toast"
import { Spinner } from "@workspace/ui/components/spinner"
import { useParams } from "next/navigation"
import { GET_BOARD } from "@/features/boards/graphql/queries"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { AlertCircleIcon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Label } from "@workspace/ui/components/label"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { DatePicker } from "@/components/date-picker/date-picker"

interface EditTaskCardProps {
  card: CardData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskCard({ card, open, onOpenChange }: EditTaskCardProps) {
  const client = useApolloClient()
  const { id: boardId } = useParams<{ id: string }>()
  const boardData = client.readQuery({
    query: GET_BOARD,
    variables: { id: boardId },
  })

  const boardLabels = boardData?.board?.labels ?? []
  const boardMembers = boardData?.board?.members ?? []

  const refetchOptions = {
    refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
    awaitRefetchQueries: true,
  }

  const [updateCard, { loading, error, reset: resetMutation }] = useMutation(
    UPDATE_CARD,
    refetchOptions
  )
  const [assignCard] = useMutation(ASSIGN_CARD, refetchOptions)
  const [unassignCard] = useMutation(UNASSIGN_CARD, refetchOptions)
  const [addCardLabel] = useMutation(ADD_CARD_LABEL, refetchOptions)
  const [removeCardLabel] = useMutation(REMOVE_CARD_LABEL, refetchOptions)

  const form = useForm({
    resolver: zodResolver(updateCardSchema),
  })

  useEffect(() => {
    if (open && card) {
      // Clear Grahpql mutation state
      resetMutation()

      // Reset form fields
      form.reset({
        title: card.title,
        description: card.description ?? "",
        dueDate: card.dueDate ?? null,
      })
    }
  }, [open, card, form])

  async function handleSubmit(input: UpdateCardInput) {
    console.log("submit")
    try {
      await updateCard({
        variables: {
          input: {
            id: card.id,
            title: input.title,
            description: input.description,
            dueDate: input.dueDate
              ? new Date(input.dueDate).toISOString()
              : null,
          },
        },
      })
      toast.add({ type: "success", description: "Card updated" })
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  const assignedUsersIds = new Set(card.assignees?.map((a) => a.user.id) ?? [])
  const cardLabelIds = new Set(card.labels.map((l) => l.id) ?? [])

  async function toggleLabel(labelId: string, shouldApply: boolean) {
    try {
      if (shouldApply) {
        await addCardLabel({
          variables: { input: { cardId: card.id, labelId } },
        })
      } else {
        await removeCardLabel({
          variables: { input: { cardId: card.id, labelId } },
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleAssignee(userId: string, shouldAssign: boolean) {
    try {
      if (shouldAssign) {
        await assignCard({ variables: { input: { cardId: card.id, userId } } })
      } else {
        await unassignCard({
          variables: { input: { cardId: card.id, userId } },
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>Make changes to your task card.</DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Update failed</AlertTitle>
            <AlertDescription>
              {error.message || "Please try again."}
            </AlertDescription>
          </Alert>
        )}
        <form id="edit-card-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                {...form.register("title")}
                aria-invalid={!!form.formState.errors.title}
              />
              {form.formState.errors.title && (
                <FieldError>{form.formState.errors.title.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                {...form.register("description")}
                aria-invalid={!!form.formState.errors.description}
              />
              {form.formState.errors.description && (
                <FieldError>
                  {form.formState.errors.description.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="dueDate">Due date</FieldLabel>
              <Controller
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : null)
                    }
                  />
                )}
              />
              {form.formState.errors.dueDate && (
                <FieldError>{form.formState.errors.dueDate.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </form>

        {boardLabels.length > 0 && (
          <Field>
            <FieldLabel>Labels</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {boardLabels.map((label) => {
                const active = cardLabelIds.has(label.id)
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id, !active)}
                    className="focus:outline-none"
                  >
                    <Badge
                      key={label.id}
                      variant={active ? "secondary" : "ghost"}
                      className="gap-1.5"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      {label.name}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </Field>
        )}

        {boardMembers.length > 0 && (
          <Field>
            <FieldLabel>Assignees</FieldLabel>
            <div className="flex flex-col gap-2">
              {boardMembers.map((member) => {
                const checked = assignedUsersIds.has(member.user.id)
                return (
                  <Label
                    key={member.user.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        toggleAssignee(member.user.id, !!value)
                      }
                    />
                    {member.user.username}
                  </Label>
                )
              })}
            </div>
          </Field>
        )}
        {form.formState.isDirty && (
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" form="edit-card-form" disabled={loading}>
              {loading ? (
                <>
                  <Spinner data-icon="inline-start" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
