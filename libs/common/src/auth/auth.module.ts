import { Module } from "@nestjs/common"

import { RmqModule } from "../rmq/rmq.module"

@Module({
  imports: [RmqModule.register({ name: "AUTH" })],
  exports: [RmqModule],
})
export class AuthModule {}
