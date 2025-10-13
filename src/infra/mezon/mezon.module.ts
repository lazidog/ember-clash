import { DynamicModule, Global, Module } from "@nestjs/common";
import { appConfig } from "src/config";
import { MezonClientService } from "./client.service";

@Global()
@Module({})
export class MezonModule {
  static forRootAsync(): DynamicModule {
    return {
      module: MezonModule,
      providers: [
        {
          provide: MezonClientService,
          useFactory: async () => {
            const client = new MezonClientService(
              appConfig.bot.botId,
              appConfig.bot.token,
            );

            await client.initializeClient();

            return client;
          },
        },
      ],
      exports: [MezonClientService],
    };
  }
}
