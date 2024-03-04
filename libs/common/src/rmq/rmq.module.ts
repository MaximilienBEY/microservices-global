import { DynamicModule, Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ClientsModule, ClientsProviderAsyncOptions, Transport } from "@nestjs/microservices"

import { RmqService } from "./rmq.service"

interface RmqModuleOptions {
  name: string
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  private static getClientProviderOptions({ name }: RmqModuleOptions): ClientsProviderAsyncOptions {
    return {
      name,
      useFactory: (config: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [config.get<string>("RABBIT_MQ_URL")!],
          queue: name,
          // queue: config.get<string>(`RABBIT_MQ_${name}_QUEUE`)!,
        },
      }),
      inject: [ConfigService],
    }
  }
  static register(options: RmqModuleOptions | RmqModuleOptions[]): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync(
          Array.isArray(options)
            ? options.map(option => this.getClientProviderOptions(option))
            : [this.getClientProviderOptions(options)],
        ),
      ],
      exports: [ClientsModule],
    }
  }
}
