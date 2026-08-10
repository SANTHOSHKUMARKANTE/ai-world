import { randomUUID } from 'node:crypto';

import { createDatabaseClient } from '@ai-world/foundation-database';

import * as argon2 from 'argon2';
import { afterAll, afterEach, describe, expect, it } from 'vitest';

import { RegisterUser } from '../src';
import { Argon2idPasswordHasher, PrismaRegistrationTransaction } from '../src/infrastructure';
import { PrismaUserRegistrationWriter } from '@ai-world/platform-user/infrastructure';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for registration integration tests.');
}

const database = createDatabaseClient({
  connectionString: databaseUrl,
});

const ownedActorIds = new Set<string>();

afterEach(async () => {
  const actorIds = [...ownedActorIds];

  if (actorIds.length === 0) {
    return;
  }

  await database.user.deleteMany({
    where: {
      actorId: {
        in: actorIds,
      },
    },
  });

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

describe('RegisterUser persistence transaction', () => {
  it('atomically creates Actor, ActorEmail, PasswordCredential, and User', async () => {
    const transaction = new PrismaRegistrationTransaction(
      database,
      (transaction) => new PrismaUserRegistrationWriter(transaction),
    );

    const registerUser = new RegisterUser(transaction, new Argon2idPasswordHasher());

    const uniquePart = randomUUID();

    const email = `Registration-${uniquePart}@Example.COM`;
    const password = 'correct horse battery staple';

    const result = await registerUser.execute({
      email: `  ${email}  `,
      password,
    });

    ownedActorIds.add(result.actorId);

    const [actor, actorEmail, credential, user] = await Promise.all([
      database.actor.findUnique({
        where: {
          id: result.actorId,
        },
      }),

      database.actorEmail.findUnique({
        where: {
          actorId: result.actorId,
        },
      }),

      database.passwordCredential.findUnique({
        where: {
          actorId: result.actorId,
        },
      }),

      database.user.findUnique({
        where: {
          actorId: result.actorId,
        },
      }),
    ]);

    expect(actor).not.toBeNull();

    expect(actorEmail).toMatchObject({
      actorId: result.actorId,
      email,
      normalizedEmail: email.toLowerCase(),
    });

    expect(credential).not.toBeNull();
    expect(credential?.actorId).toBe(result.actorId);
    expect(credential?.passwordHash).not.toBe(password);

    await expect(argon2.verify(credential!.passwordHash, password)).resolves.toBe(true);

    expect(user).toMatchObject({
      id: result.userId,
      actorId: result.actorId,
    });
  });

  it('maps duplicate normalized email to the registration conflict error', async () => {
    const existingActor = await database.actor.create({
      data: {},
    });

    ownedActorIds.add(existingActor.id);

    const uniquePart = randomUUID();
    const normalizedEmail = `duplicate-${uniquePart}@example.com`;

    await database.actorEmail.create({
      data: {
        actorId: existingActor.id,
        email: `Duplicate-${uniquePart}@Example.COM`,
        normalizedEmail,
      },
    });

    const registerUser = new RegisterUser(
      new PrismaRegistrationTransaction(
        database,
        (transaction) => new PrismaUserRegistrationWriter(transaction),
      ),
      new Argon2idPasswordHasher(),
    );

    await expect(
      registerUser.execute({
        email: `DUPLICATE-${uniquePart}@EXAMPLE.COM`,
        password: 'correct horse battery staple',
      }),
    ).rejects.toMatchObject({
      name: 'ApplicationError',
      code: 'identity.registration.email_conflict',
      kind: 'conflict',
      publicMessage: 'Registration could not be completed with this email.',
    });

    await expect(
      database.actorEmail.count({
        where: {
          normalizedEmail,
        },
      }),
    ).resolves.toBe(1);
  });

  it('rolls back all cross-owner writes when the transaction operation fails', async () => {
    const transaction = new PrismaRegistrationTransaction(
      database,
      (transaction) => new PrismaUserRegistrationWriter(transaction),
    );

    const uniquePart = randomUUID();
    let actorId: string | undefined;

    await expect(
      transaction.execute(async ({ identity, user }) => {
        const actor = await identity.createActor();

        actorId = actor.id;
        ownedActorIds.add(actor.id);

        await identity.createActorEmail({
          actorId: actor.id,
          email: `rollback-${uniquePart}@example.com`,
          normalizedEmail: `rollback-${uniquePart}@example.com`,
        });

        await identity.createPasswordCredential({
          actorId: actor.id,
          passwordHash: 'encoded-password-hash',
        });

        await user.create({
          actorId: actor.id,
        });

        throw new Error('force-registration-rollback');
      }),
    ).rejects.toThrow('force-registration-rollback');

    expect(actorId).toBeDefined();

    const [actor, actorEmail, credential, user] = await Promise.all([
      database.actor.findUnique({
        where: {
          id: actorId!,
        },
      }),

      database.actorEmail.findUnique({
        where: {
          actorId: actorId!,
        },
      }),

      database.passwordCredential.findUnique({
        where: {
          actorId: actorId!,
        },
      }),

      database.user.findUnique({
        where: {
          actorId: actorId!,
        },
      }),
    ]);

    expect(actor).toBeNull();
    expect(actorEmail).toBeNull();
    expect(credential).toBeNull();
    expect(user).toBeNull();
  });
});
