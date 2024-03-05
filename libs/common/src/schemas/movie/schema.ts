import { z } from "nestjs-zod/z"

export const movieSchema = z.object({
  uid: z.string(),
  name: z.string().max(128),
  description: z.string().max(4096),
  rate: z.coerce.number().int().min(0).max(5),
  duration: z.coerce.number().int().min(0).max(240),
  hasReservationAvailable: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// List movies request
export const movieListQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
  query: z.string().optional(),
})
export const movieListResponseSchema = z.array(movieSchema)
// export const movieListResponseSchema = z.object({
//   _links: z.object({
//     self: z.string(),
//     next: z.string().optional(),
//     prev: z.string().optional(),
//   }),
//   items: z.array(movieSchema),
//   limit: z.number(),
//   page: z.number(),
//   total: z.number(),
// })

// Create movie request
export const movieCreateSchema = movieSchema
  .omit({
    uid: true,
    createdAt: true,
    updatedAt: true,
    hasReservationAvailable: true,
  })
  .extend({
    categories: z.array(z.string()),
    poster: z.any().optional(),
  })
// export const movieCreateSchema = z.object({
//   title: z.string().min(1).max(128),
//   description: z.string().min(1).max(2048),
//   releaseAt: z.coerce.date(),
//   rating: z.coerce.number().min(0).max(5).optional(),
//   categories: z.array(z.string()).min(1),
//   poster: z.any().optional(),
// })

// Update movie request
export const movieUpdateSchema = movieCreateSchema.partial()
