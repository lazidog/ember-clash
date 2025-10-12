require("dotenv").config();

import { AppDataSource } from "../src/database/datasource";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await AppDataSource.runMigrations();
}, 30000);

afterEach(async () => {
  // Clear data from all tables after each test to ensure isolation
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(
      `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
    );
  }
});

afterAll(async () => {
  // Close the database connection
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
