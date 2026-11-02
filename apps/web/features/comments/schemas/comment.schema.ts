import z from "zod"

const commentSchema = z.object({
  id: z.uuid(),
  cardId: z.uuid(),
  content: z.string().min(1, "Content is required").max(255),
})

export const createCommentSchema = commentSchema.pick({
  cardId: true,
  content: true,
})

export const updateCommentSchema = commentSchema.pick({
  id: true,
  content: true,
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
