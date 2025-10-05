import { Module } from '@nestjs/common';
import { MezonModule } from './mezon/mezon.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    MezonModule.forRootAsync(),
    BotModule,
  ],
})
export class AppModule {}
