import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { KNOWLEDGE_EDITOR_ROLE_KEY } from '@ai-world/platform-identity-access';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Creator Knowledge API integration tests.');
}

const runMarker = `api-creator-knowledge-${randomUUID()}`;

function createFixtureEmail(label: string): string {
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

interface ActorFixture {
  readonly actorId: string;
  readonly email: string;
  readonly password: string;
  readonly cookiePair: string;
}

describe('Creator Knowledge API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  const createdResourceIds = new Set<string>();

  async function cleanupFixtures(): Promise<void> {
    if (createdResourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: {
          id: {
            in: [...createdResourceIds],
          },
        },
      });

      createdResourceIds.clear();
    }

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

  async function signInFixture(label: string): Promise<ActorFixture> {
    const email = createFixtureEmail(label);
    const password = 'correct horse battery staple';

    const registration = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password,
      })
      .expect(201);

    const authentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email,
        password,
      })
      .expect(200);

    return {
      actorId: registration.body.actorId as string,
      email,
      password,
      cookiePair: getSessionCookie(authentication),
    };
  }

  async function grantKnowledgeEditorRole(actorId: string): Promise<void> {
    const role = await database.role.findUniqueOrThrow({
      where: {
        key: KNOWLEDGE_EDITOR_ROLE_KEY,
      },
      select: {
        id: true,
      },
    });

    await database.actorRole.create({
      data: {
        actorId,
        roleId: role.id,
      },
    });
  }

  async function signInKnowledgeEditor(label: string): Promise<ActorFixture> {
    const fixture = await signInFixture(label);
    await grantKnowledgeEditorRole(fixture.actorId);
    return fixture;
  }

  async function createDirectDraft(resourceType = 'devotional.deity'): Promise<string> {
    const id = randomUUID();
    createdResourceIds.add(id);

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: 'universe.devotional',
        resourceType,
        lifecycle: 'DRAFT',
      },
    });

    return id;
  }

  beforeAll(async () => {
    database = createDatabaseClient({
      connectionString: databaseUrl,
    });

    await cleanupFixtures();

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

  it('requires a Session before creator creation', async () => {
    const response = await request(app.getHttpServer())
      .post('/knowledge/resources')
      .set('X-Request-Id', 'knowledge-creator-no-session-001')
      .send({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
      })
      .expect('X-Request-Id', 'knowledge-creator-no-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'knowledge-creator-no-session-001',
      },
    });
  });

  it('lists bounded Knowledge Resources for an authorized editor without exposing them publicly', async () => {
    const editor = await signInKnowledgeEditor('list-resources');
    const firstId = await createDirectDraft('devotional.deity');
    const secondId = await createDirectDraft('devotional.mantra');

    const response = await request(app.getHttpServer())
      .get('/knowledge/creator/resources')
      .query({ universeKey: 'universe.devotional', limit: 10 })
      .set('Cookie', editor.cookiePair)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: firstId, lifecycle: 'DRAFT' }),
        expect.objectContaining({ id: secondId, lifecycle: 'DRAFT' }),
      ]),
    );
  });

  it('denies Knowledge listing to an ordinary authenticated Actor', async () => {
    const ordinaryActor = await signInFixture('ordinary-list');

    const response = await request(app.getHttpServer())
      .get('/knowledge/creator/resources')
      .query({ universeKey: 'universe.devotional' })
      .set('Cookie', ordinaryActor.cookiePair)
      .expect(403);

    expect(response.body.error.code).toBe('knowledge.authorization.forbidden');
  });

  it('denies an ordinary authenticated Actor before canonical Knowledge input validation', async () => {
    const ordinaryActor = await signInFixture('ordinary-create');

    const response = await request(app.getHttpServer())
      .post('/knowledge/resources')
      .set('Cookie', ordinaryActor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-forbidden-create-001')
      .send({
        universeKey: 'INVALID UNIVERSE',
        resourceType: 'INVALID TYPE',
      })
      .expect('X-Request-Id', 'knowledge-creator-forbidden-create-001')
      .expect(403);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.authorization.forbidden',
        message: 'You do not have permission to perform this action.',
        status: 403,
        requestId: 'knowledge-creator-forbidden-create-001',
      },
    });
  });

  it('allows a Knowledge Editor to create a Devotional DRAFT that remains hidden from the public API', async () => {
    const editor = await signInKnowledgeEditor('editor-create');

    const response = await request(app.getHttpServer())
      .post('/knowledge/resources')
      .set('Cookie', editor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-create-001')
      .send({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
      })
      .expect('X-Request-Id', 'knowledge-creator-create-001')
      .expect(201);

    const resourceId = response.body.id as string;
    createdResourceIds.add(resourceId);

    expect(response.body).toEqual({
      id: resourceId,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'DRAFT',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    await expect(
      database.knowledgeResource.findUnique({
        where: {
          id: resourceId,
        },
      }),
    ).resolves.toMatchObject({
      id: resourceId,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'DRAFT',
    });

    const publicResponse = await request(app.getHttpServer())
      .get(`/knowledge/resources/${resourceId}`)
      .set('X-Request-Id', 'knowledge-creator-created-public-hidden-001')
      .expect(404);

    expect(publicResponse.body).toEqual({
      error: {
        code: 'knowledge.public.resource_not_found',
        message: 'Knowledge Resource not found.',
        status: 404,
        requestId: 'knowledge-creator-created-public-hidden-001',
      },
    });
  });

  it('rejects actingActorId injection through the creator request body', async () => {
    const editor = await signInKnowledgeEditor('acting-actor-injection');

    const response = await request(app.getHttpServer())
      .post('/knowledge/resources')
      .set('Cookie', editor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-acting-injection-001')
      .send({
        actingActorId: randomUUID(),
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
      })
      .expect('X-Request-Id', 'knowledge-creator-acting-injection-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.creator.invalid_request',
        message: 'The creator Knowledge request is invalid.',
        status: 400,
        requestId: 'knowledge-creator-acting-injection-001',
      },
    });
  });

  it('returns controlled validation for invalid canonical creation input after authorization succeeds', async () => {
    const editor = await signInKnowledgeEditor('invalid-create');

    const response = await request(app.getHttpServer())
      .post('/knowledge/resources')
      .set('Cookie', editor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-invalid-create-001')
      .send({
        universeKey: 'INVALID UNIVERSE',
        resourceType: 'devotional.deity',
      })
      .expect('X-Request-Id', 'knowledge-creator-invalid-create-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.resource.invalid_input',
        message: 'The Knowledge Resource input is invalid.',
        status: 400,
        requestId: 'knowledge-creator-invalid-create-001',
      },
    });
  });

  it('denies an ordinary Actor update without mutating the Resource', async () => {
    const ordinaryActor = await signInFixture('ordinary-update');
    const resourceId = await createDirectDraft();

    const response = await request(app.getHttpServer())
      .patch(`/knowledge/resources/${resourceId}`)
      .set('Cookie', ordinaryActor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-forbidden-update-001')
      .send({
        resourceType: 'devotional.temple',
      })
      .expect('X-Request-Id', 'knowledge-creator-forbidden-update-001')
      .expect(403);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.authorization.forbidden',
        message: 'You do not have permission to perform this action.',
        status: 403,
        requestId: 'knowledge-creator-forbidden-update-001',
      },
    });

    await expect(
      database.knowledgeResource.findUniqueOrThrow({
        where: {
          id: resourceId,
        },
      }),
    ).resolves.toMatchObject({
      resourceType: 'devotional.deity',
    });
  });

  it('does not reveal whether a target Resource exists to an unauthorized Actor', async () => {
    const ordinaryActor = await signInFixture('missing-resource-probe');
    const missingResourceId = randomUUID();

    const response = await request(app.getHttpServer())
      .patch(`/knowledge/resources/${missingResourceId}`)
      .set('Cookie', ordinaryActor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-hidden-resource-001')
      .send({
        resourceType: 'devotional.temple',
      })
      .expect('X-Request-Id', 'knowledge-creator-hidden-resource-001')
      .expect(403);

    expect(response.body.error).toMatchObject({
      code: 'knowledge.authorization.forbidden',
      status: 403,
    });
  });

  it('allows a Knowledge Editor to edit the canonical Resource Type', async () => {
    const editor = await signInKnowledgeEditor('editor-update');
    const resourceId = await createDirectDraft();

    const response = await request(app.getHttpServer())
      .patch(`/knowledge/resources/${resourceId}`)
      .set('Cookie', editor.cookiePair)
      .send({
        resourceType: 'devotional.temple',
      })
      .expect(200);

    expect(response.body).toEqual({
      id: resourceId,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.temple',
      lifecycle: 'DRAFT',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    await expect(
      database.knowledgeResource.findUniqueOrThrow({
        where: {
          id: resourceId,
        },
      }),
    ).resolves.toMatchObject({
      resourceType: 'devotional.temple',
      lifecycle: 'DRAFT',
    });
  });

  it('returns controlled validation for a malformed Resource ID after authorization succeeds', async () => {
    const editor = await signInKnowledgeEditor('invalid-update-id');

    const response = await request(app.getHttpServer())
      .patch('/knowledge/resources/not-a-resource-id')
      .set('Cookie', editor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-invalid-update-id-001')
      .send({
        resourceType: 'devotional.temple',
      })
      .expect('X-Request-Id', 'knowledge-creator-invalid-update-id-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.resource.invalid_input',
        message: 'The Knowledge Resource input is invalid.',
        status: 400,
        requestId: 'knowledge-creator-invalid-update-id-001',
      },
    });
  });

  it('preserves canonical not-found behavior for an authorized update', async () => {
    const editor = await signInKnowledgeEditor('missing-update');
    const missingResourceId = randomUUID();

    const response = await request(app.getHttpServer())
      .patch(`/knowledge/resources/${missingResourceId}`)
      .set('Cookie', editor.cookiePair)
      .set('X-Request-Id', 'knowledge-creator-missing-update-001')
      .send({
        resourceType: 'devotional.temple',
      })
      .expect('X-Request-Id', 'knowledge-creator-missing-update-001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.resource.not_found',
        message: 'Knowledge Resource not found.',
        status: 404,
        requestId: 'knowledge-creator-missing-update-001',
      },
    });
  });
});
