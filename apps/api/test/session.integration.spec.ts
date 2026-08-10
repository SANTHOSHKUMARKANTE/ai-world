import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Session API integration tests.');
}

const runMarker = `api-session-${randomUUID()}`;

function createSessionEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@example.com`;
}

function getSessionCookie(response: { headers: Record<string, string | string[] | undefined> }): {
  readonly header: string;
  readonly cookiePair: string;
  readonly token: string;
} {
  const setCookie = response.headers['set-cookie'];

  const header = Array.isArray(setCookie) ? setCookie[0] : setCookie;

  if (!header) {
    throw new Error('Expected a Session Set-Cookie header.');
  }

  const cookiePair = header.split(';')[0];

  if (!cookiePair) {
    throw new Error('Expected a Session cookie pair.');
  }

  const prefix = `${SESSION_COOKIE_NAME}=`;

  if (!cookiePair.startsWith(prefix)) {
    throw new Error(`Expected ${SESSION_COOKIE_NAME} cookie.`);
  }

  const token = cookiePair.slice(prefix.length);

  if (!token) {
    throw new Error('Expected a non-empty opaque Session token.');
  }

  return {
    header,
    cookiePair,
    token,
  };
}

describe('Session API', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanupSessionFixtures(): Promise<void> {
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
    email: string;
    password: string;
  }> {
    const email = createSessionEmail(label);

    const response = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password,
      })
      .expect(201);

    return {
      actorId: response.body.actorId as string,
      email,
      password,
    };
  }

  async function signInFixture(label: string): Promise<{
    actorId: string;
    cookieHeader: string;
    cookiePair: string;
    token: string;
  }> {
    const fixture = await registerFixture(label);

    const response = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(200);

    const cookie = getSessionCookie(response);

    return {
      actorId: fixture.actorId,
      cookieHeader: cookie.header,
      cookiePair: cookie.cookiePair,
      token: cookie.token,
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
    await cleanupSessionFixtures();
  });

  afterAll(async () => {
    await cleanupSessionFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('returns the authenticated Actor and expiration for a valid Session cookie', async () => {
    const fixture = await signInFixture('valid');

    const databaseSession = await database.session.findFirstOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/session')
      .set('Cookie', fixture.cookiePair)
      .expect(200);

    expect(response.body).toEqual({
      actorId: fixture.actorId,
      expiresAt: databaseSession.expiresAt.toISOString(),
    });

    expect(response.body).not.toHaveProperty('sessionId');
    expect(response.body).not.toHaveProperty('token');
    expect(response.text).not.toContain(fixture.token);
  });

  it('returns the canonical 401 failure when the Session cookie is missing', async () => {
    const response = await request(app.getHttpServer())
      .get('/session')
      .set('X-Request-Id', 'session-missing-cookie-001')
      .expect('X-Request-Id', 'session-missing-cookie-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'session-missing-cookie-001',
      },
    });
  });

  it('returns the same canonical 401 failure for an unknown Session token', async () => {
    const response = await request(app.getHttpServer())
      .get('/session')
      .set('Cookie', `${SESSION_COOKIE_NAME}=unknown-opaque-session-token`)
      .set('X-Request-Id', 'session-unknown-token-001')
      .expect('X-Request-Id', 'session-unknown-token-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'session-unknown-token-001',
      },
    });
  });

  it('rejects an expired Session using the canonical 401 failure', async () => {
    const fixture = await signInFixture('expired');

    await database.session.updateMany({
      where: {
        actorId: fixture.actorId,
      },
      data: {
        expiresAt: new Date(Date.now() - 60_000),
      },
    });

    const response = await request(app.getHttpServer())
      .get('/session')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'session-expired-001')
      .expect('X-Request-Id', 'session-expired-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'session-expired-001',
      },
    });
  });

  it('rejects a revoked Session using the canonical 401 failure', async () => {
    const fixture = await signInFixture('revoked');

    await database.session.updateMany({
      where: {
        actorId: fixture.actorId,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const response = await request(app.getHttpServer())
      .get('/session')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'session-revoked-001')
      .expect('X-Request-Id', 'session-revoked-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'session-revoked-001',
      },
    });
  });

  it('logs out idempotently, revokes the Session, clears the cookie, and rejects subsequent Session validation', async () => {
    const fixture = await signInFixture('logout');

    const beforeLogout = await database.session.findFirstOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(beforeLogout.revokedAt).toBeNull();

    const logoutResponse = await request(app.getHttpServer())
      .delete('/session')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    expect(logoutResponse.text).toBe('');

    const clearCookieHeaderValue = logoutResponse.headers['set-cookie'];

    const clearCookieHeader = Array.isArray(clearCookieHeaderValue)
      ? clearCookieHeaderValue[0]
      : clearCookieHeaderValue;

    expect(clearCookieHeader).toBeDefined();

    if (!clearCookieHeader) {
      throw new Error('Expected logout to clear the Session cookie.');
    }

    expect(clearCookieHeader).toContain(`${SESSION_COOKIE_NAME}=`);
    expect(clearCookieHeader).toContain('HttpOnly');
    expect(clearCookieHeader).toContain('SameSite=Lax');
    expect(clearCookieHeader).toContain('Path=/');
    expect(clearCookieHeader).toContain('Max-Age=0');
    expect(clearCookieHeader).not.toContain('Secure');

    const afterLogout = await database.session.findFirstOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(afterLogout.revokedAt).not.toBeNull();

    await request(app.getHttpServer())
      .get('/session')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'session-after-logout-001')
      .expect('X-Request-Id', 'session-after-logout-001')
      .expect(401)
      .expect({
        error: {
          code: 'identity.session.invalid',
          message: 'Authentication is required.',
          status: 401,
          requestId: 'session-after-logout-001',
        },
      });

    await request(app.getHttpServer())
      .delete('/session')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const afterRepeatedLogout = await database.session.findFirstOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(afterRepeatedLogout.revokedAt?.getTime()).toBe(afterLogout.revokedAt?.getTime());
  });

  it('treats logout without a Session cookie as an idempotent success', async () => {
    const response = await request(app.getHttpServer()).delete('/session').expect(204);

    const setCookie = response.headers['set-cookie'];

    const clearCookieHeader = Array.isArray(setCookie) ? setCookie[0] : setCookie;

    expect(clearCookieHeader).toBeDefined();
    expect(clearCookieHeader).toContain(`${SESSION_COOKIE_NAME}=`);
    expect(clearCookieHeader).toContain('Max-Age=0');
  });
});
