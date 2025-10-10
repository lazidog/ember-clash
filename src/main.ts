import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppGateway } from './app.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(AppGateway);
  bot.initEvent();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
