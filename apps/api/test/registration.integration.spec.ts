import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for registration API integration tests.');
}

const runMarker = `api-registration-${randomUUID()}`;

function createRegistrationEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@Example.COM`;
}

describe('POST /registration', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanupRegistrationFixtures(): Promise<void> {
    const actorEmails = await database.actorEmail.findMany({
      where: {
        normalizedEmail: {
          contains: runMarker.toLowerCase(),
        },
      },
      select: {
        actorId: true,
      },
    });

    const actorIds = actorEmails.map(({ actorId }) => actorId);

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

    await database.actor.deleteMany({
      where: {
        id: {
          in: actorIds,
        },
      },
    });
  }

  beforeAll(async () => {
    database = createDatabaseClient({
      connectionString: databaseUrl,
    });

    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.register({
          databaseUrl,
          environment: 'test',
          logLevel: 'fatal',
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    await app.init();
  });

  afterEach(async () => {
    await cleanupRegistrationFixtures();
  });

  afterAll(async () => {
    await cleanupRegistrationFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('registers a User and returns only public registration identifiers', async () => {
    const email = createRegistrationEmail('success');
    const password = 'correct horse battery staple';

    const response = await request(app.getHttpServer())
      .post('/registration')
      .set('X-Request-Id', 'registration-success-001')
      .send({
        email: `  ${email}  `,
        password,
      })
      .expect('X-Request-Id', 'registration-success-001')
      .expect(201);

    expect(response.body).toEqual({
      actorId: expect.any(String),
      userId: expect.any(String),
    });

    expect(response.text).not.toContain(password);
    expect(response.text).not.toContain('passwordHash');
    expect(response.text).not.toContain('credential');
    expect(response.text).not.toContain('session');
    expect(response.text).not.toContain('token');

    const actorId = response.body.actorId as string;
    const userId = response.body.userId as string;

    const [actor, actorEmail, credential, user] = await Promise.all([
      database.actor.findUnique({
        where: {
          id: actorId,
        },
      }),

      database.actorEmail.findUnique({
        where: {
          actorId,
        },
      }),

      database.passwordCredential.findUnique({
        where: {
          actorId,
        },
      }),

      database.user.findUnique({
        where: {
          actorId,
        },
      }),
    ]);

    expect(actor).not.toBeNull();

    expect(actorEmail).toMatchObject({
      actorId,
      email,
      normalizedEmail: email.toLowerCase(),
    });

    expect(credential).not.toBeNull();
    expect(credential?.actorId).toBe(actorId);
    expect(credential?.passwordHash).toMatch(/^\$argon2id\$/);
    expect(credential?.passwordHash).not.toContain(password);

    expect(user).toMatchObject({
      id: userId,
      actorId,
    });
  });

  it('returns 400 for an invalid transport payload without exposing the password', async () => {
    const email = createRegistrationEmail('invalid-request');
    const password = 'transport-secret-password';

    const response = await request(app.getHttpServer())
      .post('/registration')
      .set('X-Request-Id', 'registration-invalid-request-001')
      .send({
        email,
        password,
        unexpectedProperty: true,
      })
      .expect('X-Request-Id', 'registration-invalid-request-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.registration.invalid_request',
        message: 'The registration request is invalid.',
        status: 400,
        requestId: 'registration-invalid-request-001',
      },
    });

    expect(response.text).not.toContain(password);

    await expect(
      database.actorEmail.count({
        where: {
          normalizedEmail: email.toLowerCase(),
        },
      }),
    ).resolves.toBe(0);
  });

  it('returns 400 for an invalid email', async () => {
    const password = 'correct horse battery staple';

    const response = await request(app.getHttpServer())
      .post('/registration')
      .set('X-Request-Id', 'registration-invalid-email-001')
      .send({
        email: 'not-an-email',
        password,
      })
      .expect('X-Request-Id', 'registration-invalid-email-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.registration.invalid_email',
        message: 'A valid email address is required.',
        status: 400,
        requestId: 'registration-invalid-email-001',
      },
    });

    expect(response.text).not.toContain(password);
  });

  it('returns 400 for an invalid password without creating registration state', async () => {
    const email = createRegistrationEmail('invalid-password');
    const password = 'too-short';

    const response = await request(app.getHttpServer())
      .post('/registration')
      .set('X-Request-Id', 'registration-invalid-password-001')
      .send({
        email,
        password,
      })
      .expect('X-Request-Id', 'registration-invalid-password-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.registration.invalid_password',
        message: 'Password must contain between 15 and 128 characters.',
        status: 400,
        requestId: 'registration-invalid-password-001',
      },
    });

    expect(response.text).not.toContain(password);

    await expect(
      database.actorEmail.count({
        where: {
          normalizedEmail: email.toLowerCase(),
        },
      }),
    ).resolves.toBe(0);
  });

  it('returns 409 for a duplicate normalized email without creating a second registration', async () => {
    const email = createRegistrationEmail('duplicate');
    const password = 'correct horse battery staple';

    const firstResponse = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password,
      })
      .expect(201);

    const firstActorId = firstResponse.body.actorId as string;

    const response = await request(app.getHttpServer())
      .post('/registration')
      .set('X-Request-Id', 'registration-duplicate-001')
      .send({
        email: email.toUpperCase(),
        password,
      })
      .expect('X-Request-Id', 'registration-duplicate-001')
      .expect(409);

    expect(response.body).toEqual({
      error: {
        code: 'identity.registration.email_conflict',
        message: 'Registration could not be completed with this email.',
        status: 409,
        requestId: 'registration-duplicate-001',
      },
    });

    expect(response.text).not.toContain(password);
    expect(response.text).not.toContain('P2002');

    await expect(
      database.actorEmail.count({
        where: {
          normalizedEmail: email.toLowerCase(),
        },
      }),
    ).resolves.toBe(1);

    await expect(
      database.user.count({
        where: {
          actorId: firstActorId,
        },
      }),
    ).resolves.toBe(1);

    await expect(
      database.passwordCredential.count({
        where: {
          actorId: firstActorId,
        },
      }),
    ).resolves.toBe(1);
  });
});
