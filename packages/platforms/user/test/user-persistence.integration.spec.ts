import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for persistence integration tests.');
  }

  return databaseUrl;
}

describe('User persistence', () => {
  let database: DatabaseClient;
  const actorIds = new Set<string>();
  const userIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterEach(async () => {
    if (userIds.size > 0) {
      await database.user.deleteMany({
        where: {
          id: {
            in: [...userIds],
          },
        },
      });
    }

    if (actorIds.size > 0) {
      await database.actor.deleteMany({
        where: {
          id: {
            in: [...actorIds],
          },
        },
      });
    }

    userIds.clear();
    actorIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  async function createActor() {
    const actor = await database.actor.create({
      data: {},
    });

    actorIds.add(actor.id);

    return actor;
  }

  async function createUser(actorId: string) {
    const user = await database.user.create({
      data: {
        actorId,
      },
    });

    userIds.add(user.id);

    return user;
  }

  it('creates a User linked to an existing Actor', async () => {
    const actor = await createActor();
    const user = await createUser(actor.id);

    expect(user.actorId).toBe(actor.id);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('rejects a second User for the same Actor', async () => {
    const actor = await createActor();

    await createUser(actor.id);

    await expect(
      database.user.create({
        data: {
          actorId: actor.id,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('rejects a User that references a nonexistent Actor', async () => {
    await expect(
      database.user.create({
        data: {
          actorId: randomUUID(),
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2003',
    });
  });

  it('prevents deletion of an Actor while a User references it', async () => {
    const actor = await createActor();
    const user = await createUser(actor.id);

    await expect(
      database.actor.delete({
        where: {
          id: actor.id,
        },
      }),
    ).rejects.toBeDefined();

    const persistedActor = await database.actor.findUnique({
      where: {
        id: actor.id,
      },
    });

    const persistedUser = await database.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(persistedActor?.id).toBe(actor.id);
    expect(persistedUser?.actorId).toBe(actor.id);
  });
});
