import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "db/prisma/schema.prisma",
  migrations: {
    path: "db/prisma/migrations",
  },
});
