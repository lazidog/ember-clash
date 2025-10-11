import { Module } from "@nestjs/common";
import { CommandModule } from "./infra/bot/command.module";
import { MezonModule } from "./infra/mezon/mezon.module";

@Module({
  imports: [MezonModule.forRootAsync(), CommandModule],
})
export class AppModule {}
