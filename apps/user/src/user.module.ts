import { PrismaModule } from "@app/common"
import { AuthModule } from "@app/common/auth/auth.module"
import { AuthGuard } from "@app/common/auth/guards/auth.guard"
import { RmqModule } from "@app/common/rmq/rmq.module"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import * as joi from "joi"

import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        USER_PORT: joi.number().required(),

        RABBIT_MQ_URL: joi.string().required(),
        RABBIT_MQ_USER_QUEUE: joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: joi.string().required(),
      }),
      envFilePath: "./apps/user/.env",
    }),
    PrismaModule,
    RmqModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class UserModule {}
