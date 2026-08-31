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
import { Controller, useForm } from "react-hook-form"
import { Input } from "@workspace/ui/components/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateCardInput, createCardSchema } from "../schemas/card.schema"
import { Textarea } from "@workspace/ui/components/textarea"
import { useMutation } from "@apollo/client/react"
import { CREATE_CARD } from "../graphql/mutations"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { AlertCircleIcon } from "lucide-react"
import { useEffect } from "react"
import { DatePicker } from "@/components/date-picker/date-picker"
import { toast } from "@workspace/ui/components/toast"
import { useParams } from "next/navigation"
import { GET_BOARD } from "@/features/boards/graphql/queries"

interface CreateTaskCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: string
}

export function CreateTaskCard({
  open,
  onOpenChange,
  columnId,
}: CreateTaskCardProps) {
  const { id: boardId } = useParams<{ id: string }>()
  const [createCard, { loading, error }] = useMutation(CREATE_CARD, {
    refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
  })
  const form = useForm({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      columnId,
      title: "",
      description: "",
      dueDate: null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        columnId,
        title: "",
        description: "",
        dueDate: null,
      })
    }
  }, [open, columnId, form])

  async function handleSubmit(input: CreateCardInput) {
    console.log(input)
    try {
      await createCard({ variables: { input } })
      toast.add({ type: "success", description: "Card created" })
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  // console.log(form.getErrors())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Card</DialogTitle>
          <DialogDescription>Add a task to this column.</DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Update failed</AlertTitle>
            <AlertDescription>Please try again.</AlertDescription>
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
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="edit-card-form" disabled={loading}>
            {loading ? (
              <>
                <Spinner data-icon="inline-start" /> Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
