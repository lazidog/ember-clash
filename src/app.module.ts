import { Module } from '@nestjs/common';
import { MezonModule } from './mezon/mezon.module';
import { CommandModule } from './bot/command.module';

@Module({
  imports: [
    MezonModule.forRootAsync(),
    CommandModule,
  ],
})
export class AppModule {}
