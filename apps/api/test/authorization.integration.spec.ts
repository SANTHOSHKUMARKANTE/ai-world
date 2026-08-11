import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { ADMINISTRATOR_ROLE_KEY } from '@ai-world/platform-identity-access';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Authorization API integration tests.');
}

const runMarker = `api-authorization-${randomUUID()}`;

function createAuthorizationEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@example.com`;
}

function getSessionCookie(response: {
  headers: Record<string, string | string[] | undefined>;
}): string {
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

  return cookiePair;
}

interface AuthorizationFixture {
  readonly actorId: string;
  readonly userId: string;
  readonly email: string;
  readonly password: string;
}

interface SignedInAuthorizationFixture extends AuthorizationFixture {
  readonly cookiePair: string;
}

describe('Authorization API', () => {
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
  ): Promise<AuthorizationFixture> {
    const email = createAuthorizationEmail(label);

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

  async function signInFixture(label: string): Promise<SignedInAuthorizationFixture> {
    const fixture = await registerFixture(label);

    const response = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(200);

    return {
      ...fixture,
      cookiePair: getSessionCookie(response),
    };
  }

  async function grantAdministratorRole(actorId: string): Promise<void> {
    const administratorRole = await database.role.findUniqueOrThrow({
      where: {
        key: ADMINISTRATOR_ROLE_KEY,
      },
      select: {
        id: true,
      },
    });

    await database.actorRole.create({
      data: {
        actorId,
        roleId: administratorRole.id,
      },
    });
  }

  async function signInAdministrator(label: string): Promise<SignedInAuthorizationFixture> {
    const fixture = await signInFixture(label);

    await grantAdministratorRole(fixture.actorId);

    return fixture;
  }

  async function countAdministratorAssignments(actorId: string): Promise<number> {
    const administratorRole = await database.role.findUniqueOrThrow({
      where: {
        key: ADMINISTRATOR_ROLE_KEY,
      },
      select: {
        id: true,
      },
    });

    return database.actorRole.count({
      where: {
        actorId,
        roleId: administratorRole.id,
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
    await cleanupFixtures();
  });

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('rejects Role assignment without a Session and performs no mutation', async () => {
    const target = await registerFixture('no-session-target');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('X-Request-Id', 'authorization-no-session-001')
      .send({
        targetActorId: target.actorId,
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-no-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'authorization-no-session-001',
      },
    });

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(0);
  });

  it('returns forbidden for an authenticated ordinary Actor and performs no mutation', async () => {
    const actingActor = await signInFixture('ordinary-actor');
    const target = await registerFixture('ordinary-target');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', actingActor.cookiePair)
      .set('X-Request-Id', 'authorization-forbidden-001')
      .send({
        targetActorId: target.actorId,
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-forbidden-001')
      .expect(403);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authorization.forbidden',
        message: 'You do not have permission to perform this action.',
        status: 403,
        requestId: 'authorization-forbidden-001',
      },
    });

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(0);
  });

  it('does not expose a missing target Actor to an unauthorized Actor', async () => {
    const actingActor = await signInFixture('missing-target-probe');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', actingActor.cookiePair)
      .set('X-Request-Id', 'authorization-hidden-target-001')
      .send({
        targetActorId: randomUUID(),
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-hidden-target-001')
      .expect(403);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authorization.forbidden',
        message: 'You do not have permission to perform this action.',
        status: 403,
        requestId: 'authorization-hidden-target-001',
      },
    });
  });

  it('does not expose a missing Role to an unauthorized Actor', async () => {
    const actingActor = await signInFixture('missing-role-probe');
    const target = await registerFixture('missing-role-target');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', actingActor.cookiePair)
      .set('X-Request-Id', 'authorization-hidden-role-001')
      .send({
        targetActorId: target.actorId,
        roleKey: `missing-role-${randomUUID()}`,
      })
      .expect('X-Request-Id', 'authorization-hidden-role-001')
      .expect(403);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authorization.forbidden',
        message: 'You do not have permission to perform this action.',
        status: 403,
        requestId: 'authorization-hidden-role-001',
      },
    });

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(0);
  });

  it('rejects actingActorId injection through the transport body', async () => {
    const administrator = await signInAdministrator('acting-actor-injection-admin');

    const target = await registerFixture('acting-actor-injection-target');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', administrator.cookiePair)
      .set('X-Request-Id', 'authorization-acting-injection-001')
      .send({
        actingActorId: randomUUID(),
        targetActorId: target.actorId,
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-acting-injection-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authorization.invalid_request',
        message: 'The authorization request is invalid.',
        status: 400,
        requestId: 'authorization-acting-injection-001',
      },
    });

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(0);
  });

  it('rejects a malformed target Actor identifier before persistence', async () => {
    const administrator = await signInAdministrator('invalid-target-admin');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', administrator.cookiePair)
      .set('X-Request-Id', 'authorization-invalid-target-001')
      .send({
        targetActorId: 'not-a-uuid',
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-invalid-target-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authorization.invalid_request',
        message: 'The authorization request is invalid.',
        status: 400,
        requestId: 'authorization-invalid-target-001',
      },
    });
  });

  it('allows an Administrator to assign the Administrator Role and persists the ActorRole', async () => {
    const administrator = await signInAdministrator('authorized-admin');

    const target = await registerFixture('authorized-target');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', administrator.cookiePair)
      .send({
        targetActorId: target.actorId,
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect(204);

    expect(response.text).toBe('');

    const administratorRole = await database.role.findUniqueOrThrow({
      where: {
        key: ADMINISTRATOR_ROLE_KEY,
      },
      select: {
        id: true,
      },
    });

    const assignment = await database.actorRole.findUnique({
      where: {
        actorId_roleId: {
          actorId: target.actorId,
          roleId: administratorRole.id,
        },
      },
    });

    expect(assignment).toMatchObject({
      actorId: target.actorId,
      roleId: administratorRole.id,
    });

    expect(assignment?.assignedAt).toBeInstanceOf(Date);
  });

  it('treats repeated authorized Role assignment as an idempotent success', async () => {
    const administrator = await signInAdministrator('idempotent-admin');

    const target = await registerFixture('idempotent-target');

    const performAssignment = () =>
      request(app.getHttpServer())
        .post('/authorization/role-assignments')
        .set('Cookie', administrator.cookiePair)
        .send({
          targetActorId: target.actorId,
          roleKey: ADMINISTRATOR_ROLE_KEY,
        });

    await performAssignment().expect(204);
    await performAssignment().expect(204);

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(1);
  });

  it('returns the canonical target Actor not-found failure after authorization succeeds', async () => {
    const administrator = await signInAdministrator('authorized-missing-target-admin');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', administrator.cookiePair)
      .set('X-Request-Id', 'authorization-target-not-found-001')
      .send({
        targetActorId: randomUUID(),
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-target-not-found-001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authorization.actor_not_found',
        message: 'Actor not found.',
        status: 404,
        requestId: 'authorization-target-not-found-001',
      },
    });
  });

  it('returns the canonical Role not-found failure after authorization succeeds', async () => {
    const administrator = await signInAdministrator('authorized-missing-role-admin');

    const target = await registerFixture('authorized-missing-role-target');

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', administrator.cookiePair)
      .set('X-Request-Id', 'authorization-role-not-found-001')
      .send({
        targetActorId: target.actorId,
        roleKey: `missing-role-${randomUUID()}`,
      })
      .expect('X-Request-Id', 'authorization-role-not-found-001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'identity.authorization.role_not_found',
        message: 'Role not found.',
        status: 404,
        requestId: 'authorization-role-not-found-001',
      },
    });

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(0);
  });

  it('rejects a revoked Administrator Session and performs no Role assignment', async () => {
    const administrator = await signInAdministrator('revoked-admin');

    const target = await registerFixture('revoked-target');

    await database.session.updateMany({
      where: {
        actorId: administrator.actorId,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', administrator.cookiePair)
      .set('X-Request-Id', 'authorization-revoked-session-001')
      .send({
        targetActorId: target.actorId,
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-revoked-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'authorization-revoked-session-001',
      },
    });

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(0);
  });

  it('rejects an expired Administrator Session and performs no Role assignment', async () => {
    const administrator = await signInAdministrator('expired-admin');

    const target = await registerFixture('expired-target');

    await database.session.updateMany({
      where: {
        actorId: administrator.actorId,
      },
      data: {
        expiresAt: new Date(Date.now() - 60_000),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/authorization/role-assignments')
      .set('Cookie', administrator.cookiePair)
      .set('X-Request-Id', 'authorization-expired-session-001')
      .send({
        targetActorId: target.actorId,
        roleKey: ADMINISTRATOR_ROLE_KEY,
      })
      .expect('X-Request-Id', 'authorization-expired-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'authorization-expired-session-001',
      },
    });

    await expect(countAdministratorAssignments(target.actorId)).resolves.toBe(0);
  });
});
