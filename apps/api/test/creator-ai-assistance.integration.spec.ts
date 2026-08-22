import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import {
  AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
  type AiProviderTextRequest,
} from '@ai-world/platform-ai-creator';
import { ADMINISTRATOR_ROLE_KEY } from '@ai-world/platform-identity-access';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Creator AI assistance API integration tests.');
}

const runMarker = `api-creator-ai-${randomUUID()}`;

function getSessionCookie(response: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  const setCookie = response.headers['set-cookie'];
  const header = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  const cookiePair = header?.split(';')[0];

  if (!cookiePair?.startsWith(`${SESSION_COOKIE_NAME}=`)) {
    throw new Error(`Expected ${SESSION_COOKIE_NAME} cookie.`);
  }

  return cookiePair;
}

interface ActorFixture {
  readonly actorId: string;
  readonly cookiePair: string;
}

describe('Creator AI assistance API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  const providerRequests: AiProviderTextRequest[] = [];
  const knowledgeIds = new Set<string>();

  async function actorIds(): Promise<string[]> {
    const emails = await database.actorEmail.findMany({
      where: { normalizedEmail: { contains: runMarker.toLowerCase() } },
      select: { actorId: true },
    });
    return emails.map(({ actorId }) => actorId);
  }

  async function cleanupFixtures(): Promise<void> {
    const actors = await actorIds();
    if (actors.length > 0) {
      await database.generation.deleteMany({ where: { actorId: { in: actors } } });
      await database.user.deleteMany({ where: { actorId: { in: actors } } });
      await database.actor.deleteMany({ where: { id: { in: actors } } });
    }

    if (knowledgeIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: { id: { in: [...knowledgeIds] } },
      });
      knowledgeIds.clear();
    }
    providerRequests.length = 0;
  }

  async function signIn(label: string): Promise<ActorFixture> {
    const email = `${runMarker}-${label}-${randomUUID()}@example.com`;
    const password = 'correct horse battery staple';
    const registration = await request(app.getHttpServer())
      .post('/registration')
      .send({ email, password })
      .expect(201);
    const authentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({ email, password })
      .expect(200);
    return {
      actorId: registration.body.actorId as string,
      cookiePair: getSessionCookie(authentication),
    };
  }

  async function signInAdministrator(label: string): Promise<ActorFixture> {
    const actor = await signIn(label);
    const role = await database.role.findUniqueOrThrow({
      where: { key: ADMINISTRATOR_ROLE_KEY },
      select: { id: true },
    });
    await database.actorRole.create({ data: { actorId: actor.actorId, roleId: role.id } });
    return actor;
  }

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    await cleanupFixtures();
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.register({
          databaseUrl,
          environment: 'test',
          logLevel: 'fatal',
          aiProviderKey: 'provider.integration-test',
          aiProvider: {
            async generateText(input) {
              providerRequests.push(input);
              return {
                text: 'devotional.temple',
                model: 'model.integration-test',
                usage: { inputTokens: 10, outputTokens: 2, totalTokens: 12 },
              };
            },
          },
        }),
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    await app.init();
  });

  afterEach(cleanupFixtures);

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('authorizes before request validation and canonical mutation', async () => {
    await request(app.getHttpServer())
      .post('/composition/ai/knowledge-candidates')
      .send({ unexpected: true })
      .expect(401);

    const ordinary = await signIn('ordinary');
    const response = await request(app.getHttpServer())
      .post('/composition/ai/knowledge-candidates')
      .set('Cookie', ordinary.cookiePair)
      .send({ unexpected: true })
      .expect(403);

    expect(response.body.error).toMatchObject({
      code: 'composition.authorization.forbidden',
      message: 'You do not have permission to perform this action.',
    });
    expect(providerRequests).toHaveLength(0);
  });

  it('persists a non-canonical suggestion and requires same-actor explicit acceptance', async () => {
    const creator = await signInAdministrator('creator');
    const otherCreator = await signInAdministrator('other-creator');
    const contextId = randomUUID();
    knowledgeIds.add(contextId);
    await database.knowledgeResource.create({
      data: {
        id: contextId,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        lifecycle: 'PUBLISHED',
      },
    });

    const suggestion = await request(app.getHttpServer())
      .post('/composition/ai/knowledge-candidates')
      .set('Cookie', creator.cookiePair)
      .send({
        universeKey: 'universe.devotional',
        request: 'Suggest a useful Knowledge Resource type.',
        contextQuery: 'deity',
        contextResourceTypes: ['devotional.deity'],
        contextLimit: 5,
      })
      .expect(201);

    const generationId = suggestion.body.generationId as string;
    expect(suggestion.body).toMatchObject({
      universeKey: 'universe.devotional',
      resourceType: 'devotional.temple',
      canonical: false,
    });
    expect(providerRequests).toHaveLength(1);
    expect(providerRequests[0]?.instructions).toContain('Authorized AI context:');
    expect(providerRequests[0]?.instructions).toContain(`- devotional.deity | ${contextId}`);

    const generation = await database.generation.findUnique({
      where: { id: generationId },
      include: { provenance: true, result: true, usage: true },
    });
    expect(generation).toMatchObject({
      actorId: creator.actorId,
      status: 'SUCCEEDED',
      provider: 'provider.integration-test',
      model: 'model.integration-test',
      result: { text: 'devotional.temple' },
      provenance: { task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK },
      usage: { totalTokens: 12 },
    });
    await expect(
      database.knowledgeResource.count({
        where: { resourceType: 'devotional.temple', universeKey: 'universe.devotional' },
      }),
    ).resolves.toBe(0);

    const denied = await request(app.getHttpServer())
      .post(`/composition/ai/knowledge-candidates/${generationId}/accept`)
      .set('Cookie', otherCreator.cookiePair)
      .expect(404);
    expect(denied.body.error).toMatchObject({
      code: 'composition.ai_assistance.candidate_not_found',
    });

    const accepted = await request(app.getHttpServer())
      .post(`/composition/ai/knowledge-candidates/${generationId}/accept`)
      .set('Cookie', creator.cookiePair)
      .expect(201);
    const acceptedResourceId = accepted.body.resource.id as string;
    knowledgeIds.add(acceptedResourceId);
    expect(accepted.body).toMatchObject({
      generationId,
      canonical: true,
      canonicalOwner: 'knowledge',
      resource: {
        id: acceptedResourceId,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.temple',
        lifecycle: 'DRAFT',
      },
    });
  });
});
