import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"

import { MovieModule } from "./movie.module"

async function bootstrap() {
  const app = await NestFactory.create(MovieModule)
  const configService = app.get(ConfigService)
  await app.listen(configService.get("MOVIE_PORT")!)
}
bootstrap()
