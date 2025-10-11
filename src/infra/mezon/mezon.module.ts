import { type DynamicModule, Global, Module } from "@nestjs/common";
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
            const token = process.env.MEZON_TOKEN;
            if (!token) return null;
            const client = new MezonClientService(token);

            await client.initializeClient();

            return client;
          },
        },
      ],
      exports: [MezonClientService],
    };
  }
}
