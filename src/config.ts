import { z } from "zod";

const DatabaseEnvSchema = z.object({
  type: z.enum(["postgres"]),
  url: z.string(),
  directUrl: z.string(),
});

const AppEnvSchema = z.object({
  env: z.string(),
  name: z.string(),
  port: z.coerce.number(),
});

export const appConfig = {
  database: DatabaseEnvSchema.parse({
    type: "postgres",
    url: process.env.DB_URL,
    directUrl: process.env.DB_DIRECT_URL,
  }),
  app: AppEnvSchema.parse({
    env: process.env.ENV,
    name: process.env.NAME,
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
  }),
};
