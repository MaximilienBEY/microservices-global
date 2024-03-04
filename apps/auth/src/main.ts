import { RmqService } from "@app/common/rmq/rmq.service"
import { NestFactory } from "@nestjs/core"
import { RmqOptions } from "@nestjs/microservices"

import { AuthModule } from "./auth.module"

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice<RmqOptions>(rmqService.getOptions("AUTH", true))
  await app.startAllMicroservices()
  await app.listen(3000)
}
bootstrap()
