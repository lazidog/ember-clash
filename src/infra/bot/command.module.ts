import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PikaCommand } from 'src/application/commands/pika';
import { CommandHandler } from './command.handler';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [DiscoveryModule],
  providers: [
    AppGateway,
    CommandHandler,
    PikaCommand
  ],
  controllers: [],
})
export class CommandModule {}
