import { useMutation, useQuery } from "@apollo/client/react"
import { UPDATE_COMMENT } from "../graphql/mutations"
import {
  UpdateCommentInput,
  updateCommentSchema,
} from "../schemas/comment.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Field, FieldError, FieldGroup } from "@workspace/ui/components/field"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { ME } from "@/features/auth/graphql/queries"
import { Button } from "@workspace/ui/components/button"
import { Send } from "lucide-react"
import { useComment } from "../providers/comment-provider"
import { toast } from "sonner"

export function EditComment() {
  const { data: currentUser } = useQuery(ME)
  const { editableComment, setEditableComment } = useComment()

  const [updateComment] = useMutation(UPDATE_COMMENT)
  const form = useForm({ resolver: zodResolver(updateCommentSchema) })

  useEffect(() => {
    form.reset({ id: editableComment?.id, content: editableComment?.content })
  }, [form, editableComment])

  async function handleSubmit(input: UpdateCommentInput) {
    if (!editableComment) return

    try {
      await updateComment({
        variables: { input: { ...input, id: editableComment.id } },
      })
      toast.success("Comment updated", { position: "top-center" })

      setEditableComment(undefined)
    } catch (err) {
      console.error(err)
      toast.error("Comment update failed", { position: "top-center" })
    }
  }

  return (
    <div className="">
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.log("validation errors", errors)
        })}
      >
        <FieldGroup>
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="" alt="" />
              <AvatarFallback>
                {currentUser?.me.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Field>
              <Textarea
                {...form.register("content")}
                spellCheck={false}
                placeholder="Add a comment..."
                aria-invalid={!!form.formState.errors.content}
              />
              {form.formState.errors.content && (
                <FieldError>{form.formState.errors.content.message}</FieldError>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditableComment(undefined)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="icon">
                  <Send />
                </Button>
              </div>
            </Field>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
