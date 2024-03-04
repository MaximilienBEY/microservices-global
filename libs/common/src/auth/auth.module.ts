import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"

import { RmqModule } from "../rmq/rmq.module"
import { AuthGuard } from "./guards/auth.guard"

@Module({
  imports: [RmqModule.register({ name: "AUTH" })],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
  exports: [RmqModule],
})
export class AppAuthModule {}
