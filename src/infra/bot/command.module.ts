import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { AppGateway } from "src/app.gateway";
import { PikaCommand } from "src/application/commands/pika";
import { CommandHandler } from "./command.handler";

@Module({
  imports: [DiscoveryModule],
  providers: [AppGateway, CommandHandler, PikaCommand],
  controllers: [],
})
export class CommandModule {}
