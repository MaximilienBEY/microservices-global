import { updateMeSchema } from "@app/common/schemas/auth/schema"
import { createZodDto } from "nestjs-zod"

export class UpdateMeDto extends createZodDto(updateMeSchema) {}
