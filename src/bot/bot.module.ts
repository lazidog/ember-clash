import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ChannelMessageEventHandler } from './handlers/channelMessage.handler';
import { BotGateway } from './events/bot.gateway';

@Module({
  imports: [DiscoveryModule],
  providers: [
    BotGateway,
    ChannelMessageEventHandler
  ],
  controllers: [],
})
export class BotModule {}
