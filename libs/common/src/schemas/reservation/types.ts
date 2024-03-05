import { z } from "zod"

import { reservationCreateSchema } from "./schema"

// Create reservation request
export type ReservationCreateType = z.infer<typeof reservationCreateSchema>
