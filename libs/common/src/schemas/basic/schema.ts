import { z } from "nestjs-zod/z"

export const successResponseSchema = z.object({
  message: z.string(),
})
