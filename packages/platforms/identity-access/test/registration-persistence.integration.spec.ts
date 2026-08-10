import { randomUUID } from 'node:crypto';

import { createDatabaseClient } from '@ai-world/foundation-database';
import { afterAll, afterEach, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Identity & Access persistence integration tests.');
}

const database = createDatabaseClient({
  connectionString: databaseUrl,
});

const ownedActorIds = new Set<string>();

async function createActor() {
  const actor = await database.actor.create({
    data: {},
  });

  ownedActorIds.add(actor.id);

  return actor;
}

afterEach(async () => {
  const actorIds = [...ownedActorIds];

  if (actorIds.length === 0) {
    return;
  }

  await database.actorEmail.deleteMany({
    where: {
      actorId: {
        in: actorIds,
      },
    },
  });

  await database.passwordCredential.deleteMany({
    where: {
      actorId: {
        in: actorIds,
      },
    },
  });

  await database.actor.deleteMany({
    where: {
      id: {
        in: actorIds,
      },
    },
  });

  ownedActorIds.clear();
});

afterAll(async () => {
  await database.$disconnect();
});

describe('registration persistence', () => {
  it('creates an ActorEmail linked to an existing Actor', async () => {
    const actor = await createActor();
    const email = `Registration-${randomUUID()}@Example.COM`;
    const normalizedEmail = email.toLowerCase();

    const actorEmail = await database.actorEmail.create({
      data: {
        actorId: actor.id,
        email,
        normalizedEmail,
      },
    });

    expect(actorEmail).toMatchObject({
      actorId: actor.id,
      email,
      normalizedEmail,
    });

    expect(actorEmail.id).toEqual(expect.any(String));
    expect(actorEmail.createdAt).toBeInstanceOf(Date);
    expect(actorEmail.updatedAt).toBeInstanceOf(Date);
  });

  it('enforces normalized email uniqueness across Actors', async () => {
    const firstActor = await createActor();
    const secondActor = await createActor();

    const uniquePart = randomUUID();
    const normalizedEmail = `registration-${uniquePart}@example.com`;

    await database.actorEmail.create({
      data: {
        actorId: firstActor.id,
        email: `Registration-${uniquePart}@Example.COM`,
        normalizedEmail,
      },
    });

    await expect(
      database.actorEmail.create({
        data: {
          actorId: secondActor.id,
          email: `REGISTRATION-${uniquePart}@EXAMPLE.COM`,
          normalizedEmail,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('allows only one ActorEmail per Actor', async () => {
    const actor = await createActor();

    await database.actorEmail.create({
      data: {
        actorId: actor.id,
        email: `first-${randomUUID()}@example.com`,
        normalizedEmail: `first-${randomUUID()}@example.com`,
      },
    });

    await expect(
      database.actorEmail.create({
        data: {
          actorId: actor.id,
          email: `second-${randomUUID()}@example.com`,
          normalizedEmail: `second-${randomUUID()}@example.com`,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('creates a PasswordCredential linked to an existing Actor', async () => {
    const actor = await createActor();

    const passwordHash = '$argon2id$v=19$m=19456,p=1,t=2$test-salt$test-password-hash';

    const credential = await database.passwordCredential.create({
      data: {
        actorId: actor.id,
        passwordHash,
      },
    });

    expect(credential).toMatchObject({
      actorId: actor.id,
      passwordHash,
    });

    expect(credential.id).toEqual(expect.any(String));
    expect(credential.createdAt).toBeInstanceOf(Date);
    expect(credential.updatedAt).toBeInstanceOf(Date);
  });

  it('allows only one PasswordCredential per Actor', async () => {
    const actor = await createActor();

    await database.passwordCredential.create({
      data: {
        actorId: actor.id,
        passwordHash: 'first-encoded-password-hash',
      },
    });

    await expect(
      database.passwordCredential.create({
        data: {
          actorId: actor.id,
          passwordHash: 'second-encoded-password-hash',
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('rejects email and password Credential records for a missing Actor', async () => {
    const missingActorId = randomUUID();

    await expect(
      database.actorEmail.create({
        data: {
          actorId: missingActorId,
          email: `missing-${randomUUID()}@example.com`,
          normalizedEmail: `missing-${randomUUID()}@example.com`,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2003',
    });

    await expect(
      database.passwordCredential.create({
        data: {
          actorId: missingActorId,
          passwordHash: 'encoded-password-hash',
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2003',
    });
  });

  it('cascades Actor deletion to its email and PasswordCredential', async () => {
    const actor = await createActor();

    const actorEmail = await database.actorEmail.create({
      data: {
        actorId: actor.id,
        email: `cascade-${randomUUID()}@example.com`,
        normalizedEmail: `cascade-${randomUUID()}@example.com`,
      },
    });

    const credential = await database.passwordCredential.create({
      data: {
        actorId: actor.id,
        passwordHash: 'encoded-password-hash',
      },
    });

    await database.actor.delete({
      where: {
        id: actor.id,
      },
    });

    await expect(
      database.actorEmail.findUnique({
        where: {
          id: actorEmail.id,
        },
      }),
    ).resolves.toBeNull();

    await expect(
      database.passwordCredential.findUnique({
        where: {
          id: credential.id,
        },
      }),
    ).resolves.toBeNull();
  });
});
