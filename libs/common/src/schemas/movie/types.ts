import { z } from "zod"

import {
  movieCreateSchema,
  movieListQuerySchema,
  movieListResponseSchema,
  movieSchema,
  movieUpdateSchema,
} from "./schema"

export type MovieType = z.infer<typeof movieSchema>

// List movies request
export type MovieListQueryType = z.infer<typeof movieListQuerySchema>
export type MovieListResponseType = z.infer<typeof movieListResponseSchema>

// Create movie request
export type MovieCreateType = z.infer<typeof movieCreateSchema>

// Update movie request
export type MovieUpdateType = z.infer<typeof movieUpdateSchema>
