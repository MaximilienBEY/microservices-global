import { RmqService } from "@app/common/rmq/rmq.service"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { RmqOptions } from "@nestjs/microservices"

import { AuthModule } from "./auth.module"

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice<RmqOptions>(rmqService.getOptions("AUTH", true))
  const configService = app.get(ConfigService)
  await app.startAllMicroservices()
  await app.listen(configService.get("AUTH_PORT")!)
}
bootstrap()
