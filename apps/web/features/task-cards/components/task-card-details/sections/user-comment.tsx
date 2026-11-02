import { CardData } from "@/features/task-cards/types"
import { GetCardQuery, MeQuery } from "@workspace/graphql"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@workspace/ui/components/button"
import { Ellipsis } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Field, FieldError, FieldGroup } from "@workspace/ui/components/field"
import { Textarea } from "@workspace/ui/components/textarea"
import { useForm } from "react-hook-form"
import {
  UpdateCommentInput,
  updateCommentSchema,
} from "@/features/comments/schemas/comment.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client/react"
import { UPDATE_COMMENT } from "@/features/comments/graphql/mutations"

function EditableText({ id, content }: UpdateCommentInput) {
  const [update] = useMutation(UPDATE_COMMENT)
  const form = useForm({ resolver: zodResolver(updateCommentSchema) })

  useEffect(() => {
    form.reset({ content })
  }, [form, content])

  async function save() {
    const valid = await form.trigger("content")

    if (!valid) return

    const value = form.getValues("content")

    if (!form.formState.dirtyFields["content"]) return

    await update({ variables: { input: { id, content: value } } })

    form.resetField("content", { defaultValue: value })
  }

  return (
    <form>
      <FieldGroup>
        <Field>
          <Textarea {...form.register("content", { onBlur: save })} />
          {form.formState.errors.content && (
            <FieldError>{form.formState.errors.content.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </form>
  )
}

interface UserCommentProps {
  comment: GetCardQuery["card"]["comments"][number]
  currentUser?: MeQuery["me"]
}

export function UserComment({ comment, currentUser }: UserCommentProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex gap-2">
      <Avatar>
        {/* <AvatarImage src={comment.user.avatar} alt={comment.user.name} /> */}
        <AvatarFallback>
          {comment.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${comment.user.id}`}
            className="text-sm font-medium !no-underline"
          >
            {comment.user.name}
          </Link>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {isEditing ? (
          <form>
            <FieldGroup>
              <Field>
                <Textarea />
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90">
            {comment.content}
          </p>
        )}
      </div>
      {comment.user.id === currentUser?.id && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="ml-auto">
                <Ellipsis />
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
