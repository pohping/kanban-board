import { z } from "zod"

export const LabelSchema = z.object({
  id: z.uuid(),
  boardId: z.uuid(),
  name: z.string(),
  color: z.string(),
})
export type Label = z.infer<typeof LabelSchema>

export const createLabelSchema = z.object({
  boardId: z.uuid(),
  name: z.string().min(1),
  color: z.string().min(1),
})
export type CreateLabelInput = z.infer<typeof createLabelSchema>

export const updateLabelSchema = createLabelSchema.partial().omit({
  boardId: true,
})
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>
