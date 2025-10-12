import { Injectable } from "@nestjs/common";
import type {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from "@nestjs/typeorm";
import { appConfig } from "src/config";
import { SnakeNamingStrategy } from "src/database/snake-naming.strategy";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor() {}

  private isDevEnv = () => {
    return appConfig.app.env !== "prod";
  };

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: appConfig.database.type,
      url: appConfig.database.url,
      dropSchema: this.isDevEnv(),
      migrationsRun: this.isDevEnv(),
      logging: this.isDevEnv(),
      keepConnectionAlive: !this.isDevEnv(),
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      subscribers: [`${__dirname}/../**/*.subscriber{.ts,.js}`],
      namingStrategy: new SnakeNamingStrategy(),
    } as TypeOrmModuleOptions;
  }
}
