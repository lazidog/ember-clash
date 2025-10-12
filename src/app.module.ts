import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./database/provider";
import { CommandModule } from "./infra/bot/command.module";
import { MezonModule } from "./infra/mezon/mezon.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MezonModule.forRootAsync(),
    CommandModule,
  ],
})
export class AppModule {}
