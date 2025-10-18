import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { AppGateway } from "src/app.gateway";
import { MenuCommand } from "src/application/commands/menu";
import { MenuBackCommand } from "src/application/commands/menuBack";
import { MenuBattleCommand } from "src/application/commands/menuBattle";
import { MenuDragonsCommand } from "src/application/commands/menuDragons";
import { PikaCommand } from "src/application/commands/pika";
import { CommandHandler } from "./command.handler";

@Module({
  imports: [DiscoveryModule],
  providers: [
    AppGateway,
    CommandHandler,
    PikaCommand,
    MenuCommand,
    MenuBackCommand,
    MenuBattleCommand,
    MenuDragonsCommand,
  ],
  controllers: [],
})
export class CommandModule {}
