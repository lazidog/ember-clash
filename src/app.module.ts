import { Module } from "@nestjs/common";
import { PrismaModule } from "./database/prisma.module";
import { CommandModule } from "./infra/bot/command.module";
import { MezonModule } from "./infra/mezon/mezon.module";
import { UserInteractionManagerModule } from "./infra/storages/userInteractionManager.module";

@Module({
  imports: [
    PrismaModule,
    MezonModule.forRootAsync(),
    CommandModule,
    UserInteractionManagerModule,
  ],
})
export class AppModule {}
