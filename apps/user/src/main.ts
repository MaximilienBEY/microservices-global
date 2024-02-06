import { RmqService } from "@app/common/rmq/rmq.service"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { RmqOptions } from "@nestjs/microservices"

import { UserModule } from "./user.module"

async function bootstrap() {
  const app = await NestFactory.create(UserModule)
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice<RmqOptions>(rmqService.getOptions("USER", true))
  const configService = app.get(ConfigService)
  await app.startAllMicroservices()
  await app.listen(configService.get("USER_PORT")!)
}
bootstrap()
