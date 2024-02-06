import { z } from "zod"

import { userCreateSchema, userSchema, userUpdateSchema } from "./schema"

export type UserType = z.infer<typeof userSchema>
export type UserCreateType = z.infer<typeof userCreateSchema>
export type UserUpdateType = z.infer<typeof userUpdateSchema>
