import { DynamicModule, Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ClientsModule, ClientsProviderAsyncOptions, Transport } from "@nestjs/microservices"

import { RmqService } from "./rmq.service"

interface RmqModuleOptions {
  name: string | string[]
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  private static getClientProviderOptions(name: string): ClientsProviderAsyncOptions {
    return {
      name,
      useFactory: (config: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [config.get<string>("RABBIT_MQ_URL")!],
          queue: config.get<string>(`RABBIT_MQ_${name}_QUEUE`)!,
        },
      }),
      inject: [ConfigService],
    }
  }
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync(
          Array.isArray(name)
            ? name.map(n => this.getClientProviderOptions(n))
            : [this.getClientProviderOptions(name)],
        ),
      ],
      exports: [ClientsModule],
    }
  }
}
