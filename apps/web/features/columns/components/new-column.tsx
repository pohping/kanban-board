import { Card, CardContent } from "@workspace/ui/components/card"
import { Plus } from "lucide-react"
import { useState } from "react"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateColumnInput, createColumnSchema } from "../schemas/column.schema"
import { useMutation } from "@apollo/client/react"
import { CREATE_COLUMN } from "../graphql/mutations"
import { Spinner } from "@workspace/ui/components/spinner"
import { toast } from "sonner"
import { GET_BOARD } from "@/features/boards/graphql/queries"

interface NewColumnProps {
  boardId: string
}

export function NewColumn({ boardId }: NewColumnProps) {
  const [openAddColumn, setOpenAddColumn] = useState(false)
  const [createColumn, { loading }] = useMutation(CREATE_COLUMN, {
    refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
  })

  const form = useForm({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      title: "",
    },
  })

  async function handleSubmit(input: CreateColumnInput) {
    try {
      await createColumn({ variables: { input: { ...input, boardId } } })
      setOpenAddColumn(false)
      toast.success("Column added")
    } catch (err) {
      console.error(err)
      toast.error("Failed to create column")
    }
  }

  return (
    <>
      <Card
        className="h-fit flex-1 cursor-pointer flex-col transition-shadow duration-200 hover:shadow-lg"
        onClick={() => {
          setOpenAddColumn(true)
        }}
      >
        <CardContent className="flex items-center justify-center gap-2 text-base font-medium text-muted-foreground">
          {openAddColumn ? (
            <form
              className="flex-1"
              id="create-board-form"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    {...form.register("title")}
                    aria-invalid={!!form.formState.errors.title}
                  />
                  {form.formState.errors.title && (
                    <FieldError>
                      {form.formState.errors.title.message}
                    </FieldError>
                  )}
                </Field>
                <Field orientation="horizontal">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenAddColumn(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {loading ? (
                      <>
                        <Spinner data-icon="inline-start" /> Adding...
                      </>
                    ) : (
                      "Add"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          ) : (
            <>
              {/* <Plus /> */}
              <span>Add Column</span>
            </>
          )}
        </CardContent>
      </Card>
      {/* <Dialog open={false} onOpenChange={setOpenAddColumn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Board</DialogTitle>
            <DialogDescription>
              Add a new board to your workspace
            </DialogDescription>
          </DialogHeader>
          <form
            id="create-board-form"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
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
      </Dialog> */}
    </>
  )
}
