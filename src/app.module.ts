import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MezonModule } from './mezon/mezon.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MezonModule.forRootAsync(),
    BotModule,
  ],
})
export class AppModule {}
