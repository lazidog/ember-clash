import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { BotGateway } from './events/bot.gateway';
import { CommandHandler } from './handlers/command.handler';
import { PikaCommand } from 'src/application/commands/pika';

@Module({
  imports: [DiscoveryModule],
  providers: [
    BotGateway,
    CommandHandler,
    PikaCommand
  ],
  controllers: [],
})
export class CommandModule {}
