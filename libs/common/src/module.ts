import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_PIPE } from "@nestjs/core"
import * as joi from "joi"
import { ZodValidationPipe } from "nestjs-zod"

import { AppAuthModule } from "./auth/auth.module"
import { PrismaModule } from "./prisma/prisma.module"
import { AppThrottlerModule } from "./throttler/throttler.module"

const isCI = process.env.CI === "true"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: isCI ? joi.string().optional() : joi.string().required(),
        RABBIT_MQ_URL: isCI ? joi.string().optional() : joi.string().required(),
        JWT_SECRET: isCI ? joi.string().optional() : joi.string().required(),
      }),
    }),
    PrismaModule,
    AppAuthModule,
    AppThrottlerModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
  exports: [PrismaModule],
})
export class CommonModule {}
