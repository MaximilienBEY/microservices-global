import { z } from "zod"

export const reservationCreateSchema = z.object({
  nbSeats: z.coerce.number(),
  sceance: z.string(),
  room: z.string(),
})

export const reservationSchema = z.object({
  uid: z.string(),
  sceanceUid: z.string(),
  status: z.enum(["OPEN", "PENDING", "EXPIRED", "CONFIRMED"]),
  seats: z.number(),
  rank: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  expiresAt: z.coerce.date().nullable(),
})
