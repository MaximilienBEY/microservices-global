import { z } from "nestjs-zod/z"

import { successResponseSchema } from "./schema"

export type SuccessResponseType = z.infer<typeof successResponseSchema>
