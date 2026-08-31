import z from "zod"

export const cardSchema = z.object({
  id: z.uuid(),
  columnId: z.uuid(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable(),
  position: z.number(),
  dueDate: z.iso.datetime().nullable(),
  createdBy: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const createCardSchema = cardSchema
  .pick({
    columnId: true,
    title: true,
    description: true,
    dueDate: true,
  })
  .partial({
    description: true,
    dueDate: true,
  })

export const updateCardSchema = cardSchema
  .pick({
    title: true,
    description: true,
    dueDate: true,
    columnId: true,
    position: true,
  })
  .partial()

export type CreateCardInput = z.infer<typeof createCardSchema>
export type UpdateCardInput = z.infer<typeof updateCardSchema>
