import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import Joi from 'joi';
import { MezonModule } from './mezon/mezon.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    MezonModule.forRootAsync({
      imports: [ConfigModule],
    }),
    BotModule,
  ],
})
export class AppModule {}
