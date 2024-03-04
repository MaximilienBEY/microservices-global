import { RmqService } from "@app/common/rmq/rmq.service"
import { XmlInterceptor } from "@app/common/xml/xml.interceptor"
import { NestFactory } from "@nestjs/core"
import { RmqOptions } from "@nestjs/microservices"

import { AuthModule } from "./auth.module"

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  app.useGlobalInterceptors(new XmlInterceptor())
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice<RmqOptions>(rmqService.getOptions("AUTH", true))
  await app.startAllMicroservices()
  await app.listen(3000)
}
bootstrap()
