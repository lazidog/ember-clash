import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    env: {
      DB_DIRECT_URL: "postgresql://postgres:postgres@0.0.0.0:6544/postgres",
      DB_URL:
        "postgresql://postgres:postgres@0.0.0.0:6544/postgres?pgbouncer=true",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
