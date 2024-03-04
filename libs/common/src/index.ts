import { Module } from "@nestjs/common"
import { APP_PIPE } from "@nestjs/core"
import { ZodValidationPipe } from "nestjs-zod"

import { AppAuthModule } from "./auth/auth.module"
import { PrismaModule } from "./prisma/prisma.module"
import { AppThrottlerModule } from "./throttler/throttler.module"

export * from "./prisma/prisma.module"
export * from "./prisma/prisma.service"

@Module({
  imports: [PrismaModule, AppAuthModule, AppThrottlerModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
  exports: [PrismaModule],
})
export class CommonModule {}
