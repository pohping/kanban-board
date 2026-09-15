import z from "zod"

const boardSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1, { message: "Title is required" }).max(255),
  description: z.string().nullable(),
  ownerId: z.uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const createBoardSchema = boardSchema.pick({
  title: true,
  description: true,
})

export type CreateBoardInput = z.infer<typeof createBoardSchema>
