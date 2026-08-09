import { createDatabaseClient } from '../src/database-client';

const MISSING_DATABASE_URL_MESSAGE = 'DATABASE_URL is required to run database seeds.';

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(MISSING_DATABASE_URL_MESSAGE);
  }

  const database = createDatabaseClient({
    connectionString,
  });

  try {
    await database.$queryRaw`SELECT 1`;

    console.log('Database seed baseline complete. No canonical seed data is defined yet.');
  } finally {
    await database.$disconnect();
  }
}

void main().catch((error: unknown) => {
  if (error instanceof Error && error.message === MISSING_DATABASE_URL_MESSAGE) {
    console.error(error.message);
  } else if (error instanceof Error) {
    console.error(`Database seed failed: ${error.name}`);
  } else {
    console.error('Database seed failed.');
  }

  process.exitCode = 1;
});
