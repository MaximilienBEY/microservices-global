import { z } from "zod"

import { reservationCreateSchema, reservationSchema } from "./schema"

// Create reservation request
export type ReservationCreateType = z.infer<typeof reservationCreateSchema>

export type ReservationType = z.infer<typeof reservationSchema>
