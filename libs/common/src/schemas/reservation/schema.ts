import { z } from "zod"

export const reservationCreateSchema = z.object({
  nbSeats: z.coerce.number(),
  sceance: z.string(),
  room: z.string(),
})
