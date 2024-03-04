import { z } from "nestjs-zod/z"

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string().default("USER"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export const userReadSchema = userSchema.extend({ password: z.string() })
export const usersSchema = z.array(userSchema)

// User Create
export const userCreateSchema = userSchema.pick({ email: true, name: true, role: true }).extend({
  password: z.string().min(6),
})

// User Update
export const userUpdateSchema = userCreateSchema.partial()
