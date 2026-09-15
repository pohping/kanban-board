import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateBoardInput, createBoardSchema } from "../schemas/board.schema"
import { toast } from "sonner"
import { CREATE_BOARD } from "../graphql/mutations"
import { useMutation } from "@apollo/client/react/compiled"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { useEffect } from "react"

interface CreateBoardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoard({ open, onOpenChange }: CreateBoardProps) {
  const form = useForm({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })
  const [createBoard, { loading }] = useMutation(CREATE_BOARD)

  useEffect(() => {
    if (open) {
      form.reset({ title: "", description: "" })
    }
  }, [open])

  async function handleSubmit(input: CreateBoardInput) {
    try {
      await createBoard({ variables: { input } })
      toast.success("Board created successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create board")
      console.error("Error creating board:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Board</DialogTitle>
          <DialogDescription>
            Add a new board to your workspace
          </DialogDescription>
        </DialogHeader>
        <form id="create-board-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                {...form.register("title")}
                aria-invalid={!!form.formState.errors.title}
              />
              {form.formState.errors.title && (
                <FieldError>{form.formState.errors.title.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                {...form.register("description")}
                aria-invalid={!!form.formState.errors.description}
              />
            </Field>
            {form.formState.errors.description && (
              <FieldError>
                {form.formState.errors.description.message}
              </FieldError>
            )}
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="create-board-form" disabled={loading}>
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
