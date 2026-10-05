import { useEffect, useState } from "react"
import { useTaskCard } from "../../providers/task-card-provider"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@workspace/ui/components/drawer"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Textarea } from "@workspace/ui/components/textarea"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  updateCardSchema,
  type UpdateCardInput,
} from "../../schemas/card.schema"
import { useMutation, useQuery } from "@apollo/client/react"
import { UPDATE_CARD } from "../../graphql/mutations"
import { DatePicker } from "@/components/date-picker/date-picker"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { FileCodeIcon, Paperclip, PenLine, Send, XIcon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { TaskCardLabelList } from "./task-card-label-list"
import { GET_CARD } from "../../graphql/queries"
import { Comment } from "./sections/comment"
import { TaskCardAssigneeList } from "./task-card-assignee-list"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@workspace/ui/components/attachment"

export function TaskCardDetails() {
  const [view, setView] = useState<"labels" | "assignees" | null>(null)
  const taskCard = useTaskCard()
  if (!taskCard.currentId) {
    throw new Error("Task card id is required to render TaskCardDetails")
  }

  const [updateCard] = useMutation(UPDATE_CARD)
  const { data, loading } = useQuery(GET_CARD, {
    variables: { id: taskCard.currentId },
  })

  const form = useForm({
    resolver: zodResolver(updateCardSchema),
    mode: "onBlur",
  })

  useEffect(() => {
    taskCard.setView("details")
  }, [taskCard])

  useEffect(() => {
    form.reset({
      title: data?.card.title ?? "",
      description: data?.card.description ?? "",
      dueDate: data?.card.dueDate ?? null,
    })
  }, [data, form])

  if (!data?.card) {
    return null
  }
  const { card } = data

  async function saveField<K extends keyof UpdateCardInput>(field: K) {
    const valid = await form.trigger(field)

    if (!valid) return

    const value = form.getValues(field)

    if (!form.formState.dirtyFields[field]) {
      return
    }

    await updateCard({
      variables: {
        input: {
          id: card.id,
          [field]: value,
        },
      },
    })

    form.resetField(field, {
      defaultValue: value,
    })
  }

  return (
    <Drawer
      open={true}
      swipeDirection="right"
      onOpenChange={() => taskCard.setCurrentId(null)}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Task Card</DrawerTitle>
          <DrawerDescription>
            View and edit details for this card
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 overflow-y-scroll p-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Textarea
                {...form.register("title", {
                  onBlur: () => saveField("title"),
                })}
                spellCheck={false}
              />
              {form.formState.errors.title && (
                <FieldError>{form.formState.errors.title.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                {...form.register("description", {
                  onBlur: () => saveField("description"),
                })}
                spellCheck={false}
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
                    onChange={async (date) => {
                      const value = date ? date.toISOString() : null

                      field.onChange(value)

                      await updateCard({
                        variables: {
                          input: {
                            id: card.id,
                            dueDate: value,
                          },
                        },
                      })

                      form.resetField("dueDate", {
                        defaultValue: value,
                      })
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {form.formState.errors.dueDate && (
                <FieldError>{form.formState.errors.dueDate.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Assignees</FieldLabel>
              <div>
                {card.assignees.length === 0 ? (
                  <span className="text-muted-foreground">No assignees</span>
                ) : (
                  <div
                    className="group flex cursor-pointer items-center gap-2 py-1"
                    onClick={() => setView("assignees")}
                  >
                    {card.assignees.map((assignee) => (
                      <Avatar key={assignee.user.id}>
                        <AvatarFallback>
                          {assignee.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="ml-auto flex items-center justify-center p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <PenLine className="size-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </Field>
            <Field>
              <FieldLabel>Labels</FieldLabel>
              <div>
                {card.labels.length === 0 ? (
                  <span className="text-muted-foreground">No labels</span>
                ) : (
                  <div
                    className="group flex cursor-pointer flex-wrap items-center gap-2 py-1"
                    onClick={() => setView("labels")}
                  >
                    {card.labels.map((label) => (
                      <Badge
                        key={label.id}
                        variant="secondary"
                        className="gap-1.5 px-2 py-3"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}
                      </Badge>
                    ))}
                    <div className="ml-auto flex items-center justify-center p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <PenLine className="size-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </Field>
          </FieldGroup>
          <Accordion multiple defaultValue={["attachments", "comments"]}>
            <AccordionItem value="attachments">
              <AccordionTrigger>Attachments</AccordionTrigger>
              <AccordionContent className="space-y-4 py-2">
                {data?.card.attachments.length === 0 ? (
                  <span>No attachment</span>
                ) : (
                  data?.card.attachments.map((attachment) => (
                    <Attachment key={attachment.id} className="w-full">
                      <AttachmentMedia>
                        <FileCodeIcon />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{attachment.filename}</AttachmentTitle>
                      </AttachmentContent>
                      <AttachmentActions>
                        <AttachmentAction aria-label="Remove message-renderer.tsx">
                          <XIcon />
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                  ))
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="comments">
              <AccordionTrigger>Comments</AccordionTrigger>
              <AccordionContent className="space-y-4 py-2">
                {data.card.comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {view === "labels" && (
          <TaskCardLabelList
            labels={card.labels}
            cardId={card.id}
            onClose={() => setView(null)}
          />
        )}

        {view === "assignees" && (
          <TaskCardAssigneeList card={card} onClose={() => setView(null)} />
        )}

        <DrawerFooter>
          <form>
            <FieldGroup>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="" alt="" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <Field>
                  <Textarea placeholder="Add a comment..." />
                  <div className="flex justify-end gap-2">
                    <Button>
                      <Paperclip />
                    </Button>
                    <Button>
                      <Send />
                    </Button>
                  </div>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
