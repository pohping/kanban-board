import { z } from "zod"

const columnSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1, { message: "Title is required" }).max(100),
  position: z.number().int().nonnegative(),
  boardId: z.uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const createColumnSchema = columnSchema.pick({
  title: true,
  // boardId: true,
})

export type CreateColumnInput = z.infer<typeof createColumnSchema>
