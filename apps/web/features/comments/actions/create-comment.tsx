import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldGroup } from "@workspace/ui/components/field"
import { Textarea } from "@workspace/ui/components/textarea"
import { Paperclip, Send } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_COMMENT } from "@/features/comments/graphql/mutations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateCommentInput,
  createCommentSchema,
} from "@/features/comments/schemas/comment.schema"
import { GET_CARD } from "@/features/task-cards/graphql/queries"
import { useEffect } from "react"
import { GET_BOARD } from "@/features/boards/graphql/queries"
import { ME } from "@/features/auth/graphql/queries"
import { toast } from "sonner"

interface CreateCommentProps {
  cardId: string
}

export function CreateComment({ cardId }: CreateCommentProps) {
  const { data: currentUser } = useQuery(ME)

  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [GET_CARD, GET_BOARD],
  })
  const form = useForm({ resolver: zodResolver(createCommentSchema) })

  async function handleSubmit(input: CreateCommentInput) {
    try {
      await createComment({
        variables: { input },
      })
      form.reset({ cardId, content: "" })

      toast.success("Comment created", { position: "top-center" })
    } catch (err) {
      console.error(err)
      toast.error("Comment create failed.", { position: "top-center" })
    }
  }

  useEffect(() => {
    form.reset({ cardId, content: "" })
  }, [form, cardId])

  return (
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
              <Button type="button" variant="outline" size="icon">
                <Paperclip />
              </Button>
              <Button type="submit" size="icon" disabled={loading}>
                <Send />
              </Button>
            </div>
          </Field>
        </div>
      </FieldGroup>
    </form>
  )
}
