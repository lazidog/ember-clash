import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppGateway } from "./app.gateway";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(AppGateway);
  bot.initEvent();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
