import { AppDataSource } from "../src/database/data-source";

async function run() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await AppDataSource.destroy();
}

run().catch(async (error) => {
  console.error("Migration failed", error);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  process.exit(1);
});
