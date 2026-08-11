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
  throw new Error('DATABASE_URL is required for User Profile API integration tests.');
}

const runMarker = `api-user-profile-${randomUUID()}`;

function createProfileEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@example.com`;
}

function getSessionCookie(response: { headers: Record<string, string | string[] | undefined> }): {
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
    cookiePair,
    token,
  };
}

interface ProfileFixture {
  readonly actorId: string;
  readonly userId: string;
  readonly email: string;
  readonly password: string;
}

interface SignedInProfileFixture extends ProfileFixture {
  readonly cookiePair: string;
  readonly token: string;
}

describe('User Profile API', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanupFixtures(): Promise<void> {
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
  ): Promise<ProfileFixture> {
    const email = createProfileEmail(label);

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

  async function signInFixture(label: string): Promise<SignedInProfileFixture> {
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
      ...fixture,
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
    await cleanupFixtures();
  });

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('creates a registered User with no display name and returns only the authenticated User profile', async () => {
    const fixture = await signInFixture('initial-profile');

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.actorId).toBe(fixture.actorId);
    expect(persistedUser.displayName).toBeNull();

    const response = await request(app.getHttpServer())
      .get('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .expect(200);

    expect(response.body).toEqual({
      userId: fixture.userId,
      displayName: null,
    });

    expect(response.body).not.toHaveProperty('actorId');
    expect(response.body).not.toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
    expect(response.body).not.toHaveProperty('session');
    expect(response.body).not.toHaveProperty('token');

    expect(response.text).not.toContain(fixture.token);
    expect(response.text).not.toContain(fixture.password);
  });

  it('rejects profile reads without a Session cookie', async () => {
    const response = await request(app.getHttpServer())
      .get('/user-profile')
      .set('X-Request-Id', 'user-profile-get-no-session-001')
      .expect('X-Request-Id', 'user-profile-get-no-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'user-profile-get-no-session-001',
      },
    });
  });

  it('rejects profile updates without a Session cookie and leaves the User unchanged', async () => {
    const fixture = await registerFixture('patch-no-session');

    const response = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('X-Request-Id', 'user-profile-patch-no-session-001')
      .send({
        displayName: 'Unauthorized Profile Change',
      })
      .expect('X-Request-Id', 'user-profile-patch-no-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'user-profile-patch-no-session-001',
      },
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBeNull();
  });

  it('normalizes, persists, and subsequently returns an updated display name', async () => {
    const fixture = await signInFixture('update-normalization');

    const response = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .send({
        displayName: '  Jose\u0301   Lovelace  ',
      })
      .expect(200);

    expect(response.body).toEqual({
      userId: fixture.userId,
      displayName: 'José   Lovelace',
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBe('José   Lovelace');

    const readResponse = await request(app.getHttpServer())
      .get('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .expect(200);

    expect(readResponse.body).toEqual({
      userId: fixture.userId,
      displayName: 'José   Lovelace',
    });
  });

  it('clears an existing display name when null is supplied explicitly', async () => {
    const fixture = await signInFixture('clear-display-name');

    await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .send({
        displayName: 'Grace Hopper',
      })
      .expect(200);

    const clearResponse = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .send({
        displayName: null,
      })
      .expect(200);

    expect(clearResponse.body).toEqual({
      userId: fixture.userId,
      displayName: null,
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBeNull();
  });

  it('rejects a whitespace-only display name without changing persisted profile state', async () => {
    const fixture = await signInFixture('invalid-whitespace');

    const response = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'user-profile-invalid-display-name-001')
      .send({
        displayName: '     ',
      })
      .expect('X-Request-Id', 'user-profile-invalid-display-name-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'user.profile.invalid_display_name',
        message: 'Display name must contain between 1 and 80 characters.',
        status: 400,
        requestId: 'user-profile-invalid-display-name-001',
      },
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBeNull();
  });

  it('rejects a display name longer than 80 Unicode code points', async () => {
    const fixture = await signInFixture('display-name-too-long');

    const displayName = '𐐷'.repeat(81);

    const response = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'user-profile-too-long-001')
      .send({
        displayName,
      })
      .expect('X-Request-Id', 'user-profile-too-long-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'user.profile.invalid_display_name',
        message: 'Display name must contain between 1 and 80 characters.',
        status: 400,
        requestId: 'user-profile-too-long-001',
      },
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBeNull();
  });

  it('rejects actorId injection through the PATCH transport body', async () => {
    const fixture = await signInFixture('actor-id-injection');

    const response = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'user-profile-actor-injection-001')
      .send({
        displayName: 'Injected Name',
        actorId: randomUUID(),
      })
      .expect('X-Request-Id', 'user-profile-actor-injection-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'user.profile.invalid_request',
        message: 'The user profile request is invalid.',
        status: 400,
        requestId: 'user-profile-actor-injection-001',
      },
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBeNull();
  });

  it('rejects userId injection through the PATCH transport body', async () => {
    const fixture = await signInFixture('user-id-injection');

    const response = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'user-profile-user-injection-001')
      .send({
        displayName: 'Injected Name',
        userId: randomUUID(),
      })
      .expect('X-Request-Id', 'user-profile-user-injection-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'user.profile.invalid_request',
        message: 'The user profile request is invalid.',
        status: 400,
        requestId: 'user-profile-user-injection-001',
      },
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBeNull();
  });

  it('allows an authenticated Actor to modify only its own User profile', async () => {
    const firstFixture = await signInFixture('ownership-first');
    const secondFixture = await signInFixture('ownership-second');

    await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', firstFixture.cookiePair)
      .send({
        displayName: 'First Actor Profile',
      })
      .expect(200);

    const firstUser = await database.user.findUniqueOrThrow({
      where: {
        id: firstFixture.userId,
      },
    });

    const secondUser = await database.user.findUniqueOrThrow({
      where: {
        id: secondFixture.userId,
      },
    });

    expect(firstUser.actorId).toBe(firstFixture.actorId);
    expect(firstUser.displayName).toBe('First Actor Profile');

    expect(secondUser.actorId).toBe(secondFixture.actorId);
    expect(secondUser.displayName).toBeNull();

    const secondResponse = await request(app.getHttpServer())
      .get('/user-profile')
      .set('Cookie', secondFixture.cookiePair)
      .expect(200);

    expect(secondResponse.body).toEqual({
      userId: secondFixture.userId,
      displayName: null,
    });
  });

  it('rejects a revoked Session and does not mutate the User profile', async () => {
    const fixture = await signInFixture('revoked-session');

    await database.session.updateMany({
      where: {
        actorId: fixture.actorId,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const response = await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'user-profile-revoked-session-001')
      .send({
        displayName: 'Should Not Persist',
      })
      .expect('X-Request-Id', 'user-profile-revoked-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'user-profile-revoked-session-001',
      },
    });

    const persistedUser = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(persistedUser.displayName).toBeNull();
  });

  it('rejects an expired Session and does not expose the User profile', async () => {
    const fixture = await signInFixture('expired-session');

    await database.session.updateMany({
      where: {
        actorId: fixture.actorId,
      },
      data: {
        expiresAt: new Date(Date.now() - 60_000),
      },
    });

    const response = await request(app.getHttpServer())
      .get('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'user-profile-expired-session-001')
      .expect('X-Request-Id', 'user-profile-expired-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'user-profile-expired-session-001',
      },
    });
  });

  it('returns the canonical 404 when an authenticated Actor no longer has a User profile', async () => {
    const fixture = await signInFixture('missing-user');

    await database.user.delete({
      where: {
        id: fixture.userId,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'user-profile-not-found-001')
      .expect('X-Request-Id', 'user-profile-not-found-001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'user.profile.not_found',
        message: 'User profile not found.',
        status: 404,
        requestId: 'user-profile-not-found-001',
      },
    });
  });

  it('changes only User-owned profile state and preserves Identity and Session security state', async () => {
    const fixture = await signInFixture('ownership-boundary');

    const actorBefore = await database.actor.findUniqueOrThrow({
      where: {
        id: fixture.actorId,
      },
    });

    const actorEmailBefore = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const credentialBefore = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const sessionBefore = await database.session.findFirstOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    await request(app.getHttpServer())
      .patch('/user-profile')
      .set('Cookie', fixture.cookiePair)
      .send({
        displayName: 'Profile Boundary Proof',
      })
      .expect(200);

    const actorAfter = await database.actor.findUniqueOrThrow({
      where: {
        id: fixture.actorId,
      },
    });

    const actorEmailAfter = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const credentialAfter = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const sessionAfter = await database.session.findFirstOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const userAfter = await database.user.findUniqueOrThrow({
      where: {
        id: fixture.userId,
      },
    });

    expect(userAfter.displayName).toBe('Profile Boundary Proof');

    expect(actorAfter.id).toBe(actorBefore.id);
    expect(actorAfter.createdAt.getTime()).toBe(actorBefore.createdAt.getTime());

    expect(actorEmailAfter.id).toBe(actorEmailBefore.id);
    expect(actorEmailAfter.email).toBe(actorEmailBefore.email);
    expect(actorEmailAfter.normalizedEmail).toBe(actorEmailBefore.normalizedEmail);
    expect(actorEmailAfter.verifiedAt?.getTime()).toBe(actorEmailBefore.verifiedAt?.getTime());

    expect(credentialAfter.id).toBe(credentialBefore.id);
    expect(credentialAfter.passwordHash).toBe(credentialBefore.passwordHash);

    expect(sessionAfter.id).toBe(sessionBefore.id);
    expect(sessionAfter.tokenDigest).toBe(sessionBefore.tokenDigest);
    expect(sessionAfter.expiresAt.getTime()).toBe(sessionBefore.expiresAt.getTime());
    expect(sessionAfter.revokedAt?.getTime()).toBe(sessionBefore.revokedAt?.getTime());
  });
});
