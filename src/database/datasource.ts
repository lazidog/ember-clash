import "dotenv/config";
import { appConfig } from "src/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "./snake-naming.strategy";

const isDevEnv = () => {
  return process.env.NODE_ENV !== "prod";
};

export const AppDataSource = new DataSource({
  type: appConfig.database.type,
  url: appConfig.database.directUrl,
  dropSchema: isDevEnv(),
  logging: isDevEnv(),
  keepConnectionAlive: !isDevEnv(),
  entities: ["src/entities/**/*.entity{.ts,.js}"],
  migrations: ["src/database/migrations/*{.ts,.js}"],
  subscribers: ["src/modules/**/*.subscriber{.ts,.js}"],
  namingStrategy: new SnakeNamingStrategy(),
} as DataSourceOptions);
