import { Module } from "@nestjs/common";
import { PrismaModule } from "./database/prisma.module";
import { CommandModule } from "./infra/bot/command.module";
import { MezonModule } from "./infra/mezon/mezon.module";

@Module({
  imports: [PrismaModule, MezonModule.forRootAsync(), CommandModule],
})
export class AppModule {}
