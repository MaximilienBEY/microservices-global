import { z } from "zod"

import { userCreateSchema, userReadSchema, userSchema, userUpdateSchema } from "./schema"

export type UserType = z.infer<typeof userSchema>
export type UserReadType = z.infer<typeof userReadSchema>
export type UserCreateType = z.infer<typeof userCreateSchema>
export type UserUpdateType = z.infer<typeof userUpdateSchema>
