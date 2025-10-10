import { Module } from '@nestjs/common';
import { MezonModule } from './infra/mezon/mezon.module';
import { CommandModule } from './infra/bot/command.module';

@Module({
  imports: [
    MezonModule.forRootAsync(),
    CommandModule,
  ],
})
export class AppModule {}
