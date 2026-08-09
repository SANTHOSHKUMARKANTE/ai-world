import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for persistence integration tests.');
  }

  return databaseUrl;
}

describe('Actor persistence', () => {
  let database: DatabaseClient;
  const actorIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterAll(async () => {
    if (actorIds.size > 0) {
      await database.actor.deleteMany({
        where: {
          id: {
            in: [...actorIds],
          },
        },
      });
    }

    await database.$disconnect();
  });

  it('creates an Actor with its canonical persistence fields', async () => {
    const actor = await database.actor.create({
      data: {},
    });

    actorIds.add(actor.id);

    expect(actor.id).toMatch(UUID_PATTERN);
    expect(actor.createdAt).toBeInstanceOf(Date);
    expect(actor.updatedAt).toBeInstanceOf(Date);
  });
});
