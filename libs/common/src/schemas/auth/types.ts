import { z } from "zod"

import {
  authResponseSchema,
  loginSchema,
  registerSchema,
  tokensSchema,
  updateMeSchema,
} from "./schema"

export type LoginType = z.infer<typeof loginSchema>
export type RegisterType = z.infer<typeof registerSchema>
export type UserMeUpdateType = z.infer<typeof updateMeSchema>

export type AuthTokensType = z.infer<typeof tokensSchema>
export type AuthResponseType = z.infer<typeof authResponseSchema>
