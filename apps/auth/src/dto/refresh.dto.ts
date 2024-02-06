import { refreshSchema } from "@app/common/schemas/auth/schema"
import { createZodDto } from "nestjs-zod"

export class RefreshDto extends createZodDto(refreshSchema) {}
