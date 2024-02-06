import { loginSchema } from "@app/common/schemas/auth/schema"
import { createZodDto } from "nestjs-zod"

export class LoginDto extends createZodDto(loginSchema) {}
