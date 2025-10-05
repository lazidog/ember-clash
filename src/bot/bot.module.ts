import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { BotGateway } from './events/bot.gateway';
import { CommandHandler } from './handlers/command.handler';

@Module({
  imports: [DiscoveryModule],
  providers: [
    BotGateway,
    CommandHandler
  ],
  controllers: [],
})
export class BotModule {}
