import { PrismaModule } from "@app/common"
import { AuthModule } from "@app/common/auth/auth.module"
import { AuthGuard } from "@app/common/auth/guards/auth.guard"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import * as joi from "joi"

import { MovieController } from "./movie.controller"
import { MovieService } from "./movie.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
      }),
      envFilePath: "./apps/movie/.env",
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [MovieController],
  providers: [MovieService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class MovieModule {}
