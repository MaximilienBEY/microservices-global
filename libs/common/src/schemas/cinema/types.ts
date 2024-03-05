import { z } from "zod"

import {
  cinemaCreateSchema,
  cinemaSchema,
  cinemaUpdateSchema,
  roomCreateSchema,
  roomSchema,
  roomUpdateSchema,
  sceanceCreateSchema,
  sceanceSchema,
  sceanceUpdateSchema,
} from "./schema"

export type CinemaType = z.infer<typeof cinemaSchema>
export type RoomType = z.infer<typeof roomSchema>
export type SceanceType = z.infer<typeof sceanceSchema>

export type CinemaCreateType = z.infer<typeof cinemaCreateSchema>
export type RoomCreateType = z.infer<typeof roomCreateSchema>
export type SceanceCreateType = z.infer<typeof sceanceCreateSchema>

export type CinemaUpdateType = z.infer<typeof cinemaUpdateSchema>
export type RoomUpdateType = z.infer<typeof roomUpdateSchema>
export type SceanceUpdateType = z.infer<typeof sceanceUpdateSchema>
