import { z } from "nestjs-zod/z"

import { userCreateSchema, userSchema } from "../user/schema"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export const registerSchema = userCreateSchema.omit({ role: true })
export const updateMeSchema = userCreateSchema
  .pick({ name: true, email: true, password: true })
  .partial()
export const refreshSchema = z.object({ token: z.string() })

export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})
export const authResponseSchema = z.object({
  user: userSchema,
  tokens: tokensSchema,
})
