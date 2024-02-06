import { PrismaModule } from "@app/common"
import { AuthModule as CommonAuthModule } from "@app/common/auth/auth.module"
import { AuthGuard } from "@app/common/auth/guards/auth.guard"
import { RmqModule } from "@app/common/rmq/rmq.module"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { ThrottlerModule } from "@nestjs/throttler"
import * as joi from "joi"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        AUTH_PORT: joi.number().required(),
        JWT_SECRET: joi.string().required(),

        RABBIT_MQ_URL: joi.string().required(),
        RABBIT_MQ_USER_QUEUE: joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: joi.string().required(),
      }),
      envFilePath: "./apps/auth/.env",
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 100 }]), // 100 requests per minute
    RmqModule.register({ name: "USER" }),
    PrismaModule,
    CommonAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
