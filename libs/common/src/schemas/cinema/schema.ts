import { z } from "nestjs-zod/z"

export const cinemaSchema = z.object({
  uid: z.string(),
  name: z.string().max(128),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export const roomSchema = z.object({
  uid: z.string(),
  name: z.string().max(128),
  seats: z.coerce.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export const sceanceSchema = z.object({
  uid: z.string(),
  date: z.coerce.date(),
  movieUid: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const cinemaListResponseSchema = z.array(cinemaSchema)

export const cinemaCreateSchema = cinemaSchema.omit({
  uid: true,
  createdAt: true,
  updatedAt: true,
})
export const roomCreateSchema = roomSchema.omit({
  uid: true,
  createdAt: true,
  updatedAt: true,
})
export const sceanceCreateSchema = sceanceSchema
  .omit({
    uid: true,
    createdAt: true,
    updatedAt: true,
    movieUid: true,
  })
  .extend({ movie: z.string() })

export const cinemaUpdateSchema = cinemaCreateSchema.partial()
export const roomUpdateSchema = roomCreateSchema.partial()
export const sceanceUpdateSchema = sceanceCreateSchema.partial()
