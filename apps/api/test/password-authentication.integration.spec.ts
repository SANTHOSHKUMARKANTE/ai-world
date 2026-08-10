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
  throw new Error('DATABASE_URL is required for password authentication API integration tests.');
}

const runMarker = `api-authentication-${randomUUID()}`;

function createAuthenticationEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@Example.COM`;
}

describe('POST /authentication/password', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanupAuthenticationFixtures(): Promise<void> {
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

  async function registerFixture(
    label: string,
    password = 'correct horse battery staple',
  ): Promise<{
    actorId: string;
    userId: string;
    email: string;
    password: string;
  }> {
    const email = createAuthenticationEmail(label);

    const response = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password,
      })
      .expect(201);

    return {
      actorId: response.body.actorId as string,
      userId: response.body.userId as string,
      email,
      password,
    };
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
    await cleanupAuthenticationFixtures();
  });

  afterAll(async () => {
    await cleanupAuthenticationFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('authenticates an Actor using canonicalized email and returns only actorId', async () => {
    const fixture = await registerFixture('success');

    const response = await request(app.getHttpServer())
      .post('/authentication/password')
      .set('X-Request-Id', 'authentication-success-001')
      .send({
        email: `  ${fixture.email.toUpperCase()}  `,
        password: fixture.password,
      })
      .expect('X-Request-Id', 'authentication-success-001')
      .expect(200);

    expect(response.body).toEqual({
      actorId: fixture.actorId,
    });

    expect(response.body).not.toHaveProperty('userId');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
    expect(response.body).not.toHaveProperty('credentialId');
    expect(response.body).not.toHaveProperty('session');
    expect(response.body).not.toHaveProperty('token');

    expect(response.text).not.toContain(fixture.password);
    expect(response.text).not.toContain('passwordHash');
    expect(response.text.toLowerCase()).not.toContain('credential');
    expect(response.text.toLowerCase()).not.toContain('session');
    expect(response.text.toLowerCase()).not.toContain('token');

    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('returns the canonical 401 failure for a wrong password without exposing credentials', async () => {
    const fixture = await registerFixture('wrong-password');

    const wrongPassword = 'wrong authentication password';

    const response = await request(app.getHttpServer())
      .post('/authentication/password')
      .set('X-Request-Id', 'authentication-wrong-password-001')
      .send({
        email: fixture.email,
        password: wrongPassword,
      })
      .expect('X-Request-Id', 'authentication-wrong-password-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authentication.invalid_credentials',
        message: 'The email or password is incorrect.',
        status: 401,
        requestId: 'authentication-wrong-password-001',
      },
    });

    expect(response.text).not.toContain(wrongPassword);
    expect(response.text).not.toContain(fixture.password);
    expect(response.text).not.toContain('passwordHash');
    expect(response.body.error).not.toHaveProperty('credentialId');
    expect(response.body.error).not.toHaveProperty('passwordHash');
    expect(response.body.error).not.toHaveProperty('actorId');
  });

  it('returns the same public credential failure for an unknown email', async () => {
    const unknownEmail = createAuthenticationEmail('unknown');
    const password = 'unknown account password';

    const response = await request(app.getHttpServer())
      .post('/authentication/password')
      .set('X-Request-Id', 'authentication-unknown-email-001')
      .send({
        email: unknownEmail,
        password,
      })
      .expect('X-Request-Id', 'authentication-unknown-email-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authentication.invalid_credentials',
        message: 'The email or password is incorrect.',
        status: 401,
        requestId: 'authentication-unknown-email-001',
      },
    });

    expect(response.text).not.toContain(password);
    expect(response.text).not.toContain('passwordHash');
    expect(response.body.error).not.toHaveProperty('credentialId');
    expect(response.body.error).not.toHaveProperty('passwordHash');
    expect(response.body.error).not.toHaveProperty('actorId');
  });

  it('keeps wrong-password and unknown-email public failures equivalent', async () => {
    const fixture = await registerFixture('equivalent-failure');

    const wrongPasswordResponse = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: 'definitely the wrong password',
      })
      .expect(401);

    const unknownEmailResponse = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: createAuthenticationEmail('equivalent-unknown'),
        password: 'definitely the wrong password',
      })
      .expect(401);

    expect({
      code: wrongPasswordResponse.body.error.code,
      message: wrongPasswordResponse.body.error.message,
      status: wrongPasswordResponse.body.error.status,
    }).toEqual({
      code: unknownEmailResponse.body.error.code,
      message: unknownEmailResponse.body.error.message,
      status: unknownEmailResponse.body.error.status,
    });

    expect(wrongPasswordResponse.body.error).toMatchObject({
      code: 'identity.authentication.invalid_credentials',
      message: 'The email or password is incorrect.',
      status: 401,
    });
  });

  it('returns 400 for an invalid transport request without invoking credential semantics publicly', async () => {
    const password = 'transport authentication secret';

    const response = await request(app.getHttpServer())
      .post('/authentication/password')
      .set('X-Request-Id', 'authentication-invalid-request-001')
      .send({
        email: createAuthenticationEmail('invalid-request'),
        password,
        unexpectedProperty: true,
      })
      .expect('X-Request-Id', 'authentication-invalid-request-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authentication.invalid_request',
        message: 'The authentication request is invalid.',
        status: 400,
        requestId: 'authentication-invalid-request-001',
      },
    });

    expect(response.text).not.toContain(password);
  });

  it('authenticates without creating or mutating registration-owned state', async () => {
    const fixture = await registerFixture('read-only');

    const before = await Promise.all([
      database.actor.count({
        where: {
          id: fixture.actorId,
        },
      }),
      database.actorEmail.count({
        where: {
          actorId: fixture.actorId,
        },
      }),
      database.passwordCredential.count({
        where: {
          actorId: fixture.actorId,
        },
      }),
      database.user.count({
        where: {
          actorId: fixture.actorId,
        },
      }),
    ]);

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(200);

    const after = await Promise.all([
      database.actor.count({
        where: {
          id: fixture.actorId,
        },
      }),
      database.actorEmail.count({
        where: {
          actorId: fixture.actorId,
        },
      }),
      database.passwordCredential.count({
        where: {
          actorId: fixture.actorId,
        },
      }),
      database.user.count({
        where: {
          actorId: fixture.actorId,
        },
      }),
    ]);

    expect(before).toEqual([1, 1, 1, 1]);
    expect(after).toEqual(before);
  });
});
