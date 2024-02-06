import { registerSchema } from "@app/common/schemas/auth/schema"
import { createZodDto } from "nestjs-zod"

export class RegisterDto extends createZodDto(registerSchema) {}
