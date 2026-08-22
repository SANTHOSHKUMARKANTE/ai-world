import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import {
  AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
  type AiProviderTextRequest,
} from '@ai-world/platform-ai-creator';
import { ADMINISTRATOR_ROLE_KEY, EvaluatePermission } from '@ai-world/platform-identity-access';
import { PrismaAuthorizationRepository } from '@ai-world/platform-identity-access/infrastructure';
import {
  PublishKnowledgeResource,
  PublishKnowledgeResourceAsActor,
} from '@ai-world/platform-knowledge';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import {
  ANIME_CHARACTER_RESOURCE_TYPE,
  ANIME_SERIES_RESOURCE_TYPE,
  ANIME_UNIVERSE_KEY,
} from '@ai-world/universe-anime';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for the Anime Composition proof.');
}

const runMarker = `api-anime-composition-${randomUUID()}`;

const ANIME_IMAGE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl9sAAAAASUVORK5CYII=',
  'base64',
);

class InMemoryStorageObjectStore implements StorageObjectStore {
  readonly objects = new Map<string, Uint8Array>();

  async writeObject(input: {
    readonly reference: string;
    readonly content: Uint8Array;
  }): Promise<string> {
    this.objects.set(input.reference, new Uint8Array(input.content));
    return input.reference;
  }

  async readObject(reference: string): Promise<Uint8Array> {
    const content = this.objects.get(reference);

    if (!content) {
      throw new Error(`Storage object not found: ${reference}`);
    }

    return new Uint8Array(content);
  }

  async deleteObject(reference: string): Promise<void> {
    this.objects.delete(reference);
  }

  clear(): void {
    this.objects.clear();
  }
}

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

describe('P8-M09 Anime Composition proof', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  let publishKnowledgeAsActor: PublishKnowledgeResourceAsActor;

  const storage = new InMemoryStorageObjectStore();
  const providerRequests: AiProviderTextRequest[] = [];
  const pageIds = new Set<string>();
  const blockIds = new Set<string>();
  const knowledgeIds = new Set<string>();
  const assetIds = new Set<string>();

  async function actorIds(): Promise<string[]> {
    const emails = await database.actorEmail.findMany({
      where: { normalizedEmail: { contains: runMarker.toLowerCase() } },
      select: { actorId: true },
    });

    return emails.map(({ actorId }) => actorId);
  }

  async function cleanupFixtures(): Promise<void> {
    if (pageIds.size > 0) {
      await database.compositionPage.deleteMany({ where: { id: { in: [...pageIds] } } });
      pageIds.clear();
    }

    if (blockIds.size > 0) {
      await database.compositionBlock.deleteMany({ where: { id: { in: [...blockIds] } } });
      blockIds.clear();
    }

    if (knowledgeIds.size > 0) {
      await database.knowledgeResource.deleteMany({ where: { id: { in: [...knowledgeIds] } } });
      knowledgeIds.clear();
    }

    if (assetIds.size > 0) {
      await database.auditRecord.deleteMany({
        where: { resourceId: { in: [...assetIds] }, resourceType: 'media.asset' },
      });
      await database.asset.deleteMany({ where: { id: { in: [...assetIds] } } });
      assetIds.clear();
    }

    const actors = await actorIds();

    if (actors.length > 0) {
      await database.generation.deleteMany({ where: { actorId: { in: actors } } });
      await database.user.deleteMany({ where: { actorId: { in: actors } } });
      await database.actor.deleteMany({ where: { id: { in: actors } } });
    }

    providerRequests.length = 0;
    storage.clear();
  }

  async function signInAdministrator(): Promise<ActorFixture> {
    const email = `${runMarker}-${randomUUID()}@example.com`;
    const password = 'correct horse battery staple';
    const registration = await request(app.getHttpServer())
      .post('/registration')
      .send({ email, password })
      .expect(201);
    const authentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({ email, password })
      .expect(200);
    const actorId = registration.body.actorId as string;
    const role = await database.role.findUniqueOrThrow({
      where: { key: ADMINISTRATOR_ROLE_KEY },
      select: { id: true },
    });

    await database.actorRole.create({ data: { actorId, roleId: role.id } });

    return {
      actorId,
      cookiePair: getSessionCookie(authentication),
    };
  }

  async function createSeries(actor: ActorFixture): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/knowledge/resources')
      .set('Cookie', actor.cookiePair)
      .send({
        universeKey: ANIME_UNIVERSE_KEY,
        resourceType: ANIME_SERIES_RESOURCE_TYPE,
      })
      .expect(201);
    const resourceId = response.body.id as string;

    knowledgeIds.add(resourceId);
    return resourceId;
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
          storageObjectStore: storage,
          aiProviderKey: 'provider.anime-composition-proof',
          aiProvider: {
            async generateText(input) {
              providerRequests.push(input);
              return {
                text: ANIME_CHARACTER_RESOURCE_TYPE,
                model: 'model.anime-composition-proof',
                usage: { inputTokens: 30, outputTokens: 4, totalTokens: 34 },
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

    const authorizationRepository = new PrismaAuthorizationRepository(database);
    const knowledgeRepository = new PrismaKnowledgeResourceRepository(database);
    publishKnowledgeAsActor = new PublishKnowledgeResourceAsActor(
      new EvaluatePermission(authorizationRepository),
      new PublishKnowledgeResource(knowledgeRepository, knowledgeRepository),
    );
  });

  afterEach(cleanupFixtures);

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('composes and publishes an Anime character spotlight through shared owner contracts', async () => {
    const creator = await signInAdministrator();
    const publishedSeriesId = await createSeries(creator);
    const draftSeriesId = await createSeries(creator);

    await publishKnowledgeAsActor.execute({
      actingActorId: creator.actorId,
      id: parseResourceId(publishedSeriesId),
    });

    const characterCountBefore = await database.knowledgeResource.count({
      where: {
        universeKey: ANIME_UNIVERSE_KEY,
        resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      },
    });

    const suggestion = await request(app.getHttpServer())
      .post('/composition/ai/knowledge-candidates')
      .set('Cookie', creator.cookiePair)
      .send({
        universeKey: ANIME_UNIVERSE_KEY,
        request: 'Create a Character spotlight grounded in a published Series.',
        contextQuery: 'series',
        contextResourceTypes: [ANIME_SERIES_RESOURCE_TYPE],
        contextLimit: 5,
      })
      .expect(201);
    const generationId = suggestion.body.generationId as string;

    expect(suggestion.body).toMatchObject({
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      canonical: false,
    });
    expect(providerRequests).toHaveLength(1);
    expect(providerRequests[0]?.instructions).toContain(
      `- ${ANIME_SERIES_RESOURCE_TYPE} | ${publishedSeriesId}`,
    );
    expect(providerRequests[0]?.instructions).not.toContain(draftSeriesId);
    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey: ANIME_UNIVERSE_KEY,
          resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
        },
      }),
    ).resolves.toBe(characterCountBefore);

    const acceptance = await request(app.getHttpServer())
      .post(`/composition/ai/knowledge-candidates/${generationId}/accept`)
      .set('Cookie', creator.cookiePair)
      .expect(201);
    const characterId = acceptance.body.resource.id as string;

    knowledgeIds.add(characterId);
    expect(acceptance.body).toMatchObject({
      generationId,
      canonical: true,
      canonicalOwner: 'knowledge',
      resource: {
        id: characterId,
        universeKey: ANIME_UNIVERSE_KEY,
        resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
        lifecycle: 'DRAFT',
      },
    });
    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey: ANIME_UNIVERSE_KEY,
          resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
        },
      }),
    ).resolves.toBe(characterCountBefore + 1);

    const page = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('Cookie', creator.cookiePair)
      .send({
        universeKey: ANIME_UNIVERSE_KEY,
        routePath: `/anime/home-${randomUUID()}`,
        title: 'Anime Home',
      })
      .expect(201);
    const pageId = page.body.id as string;

    pageIds.add(pageId);

    const block = await request(app.getHttpServer())
      .post('/composition/blocks/text')
      .set('Cookie', creator.cookiePair)
      .send({
        universeKey: ANIME_UNIVERSE_KEY,
        text: 'Meet this Character through their published Series context.',
      })
      .expect(201);
    const blockId = block.body.id as string;

    blockIds.add(blockId);

    const media = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', creator.cookiePair)
      .attach('file', ANIME_IMAGE, {
        filename: 'anime-character.png',
        contentType: 'image/png',
      })
      .expect(201);
    const assetId = media.body.id as string;

    assetIds.add(assetId);
    expect(media.body).toMatchObject({
      id: assetId,
      assetType: 'IMAGE',
      lifecycle: 'ACTIVE',
      technicalMetadata: {
        mimeType: 'image/png',
        sizeBytes: ANIME_IMAGE.byteLength,
      },
    });
    expect(media.body.storageReference).toBeUndefined();

    const persistedAsset = await database.asset.findUniqueOrThrow({ where: { id: assetId } });
    await expect(storage.readObject(persistedAsset.storageReference)).resolves.toEqual(
      new Uint8Array(ANIME_IMAGE),
    );

    const orderedItems = [
      { kind: 'BLOCK', id: blockId },
      { kind: 'KNOWLEDGE_RESOURCE', id: characterId },
      { kind: 'KNOWLEDGE_RESOURCE', id: publishedSeriesId },
      { kind: 'MEDIA_ASSET', id: assetId },
    ];

    await request(app.getHttpServer())
      .put(`/composition/pages/${pageId}/composition`)
      .set('Cookie', creator.cookiePair)
      .send({ items: orderedItems })
      .expect(200)
      .expect(({ body }) => {
        expect(body.items).toEqual(orderedItems.map((item, position) => ({ position, ...item })));
      });

    await request(app.getHttpServer())
      .get(`/composition/pages/${pageId}/preview`)
      .set('Cookie', creator.cookiePair)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          page: {
            id: pageId,
            universeKey: ANIME_UNIVERSE_KEY,
            routePath: page.body.routePath,
            title: 'Anime Home',
            lifecycle: 'DRAFT',
          },
          items: [
            {
              position: 0,
              kind: 'BLOCK',
              id: blockId,
              blockType: 'composition.block.text',
              text: 'Meet this Character through their published Series context.',
            },
            {
              position: 1,
              kind: 'KNOWLEDGE_RESOURCE',
              id: characterId,
              resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
              lifecycle: 'DRAFT',
            },
            {
              position: 2,
              kind: 'KNOWLEDGE_RESOURCE',
              id: publishedSeriesId,
              resourceType: ANIME_SERIES_RESOURCE_TYPE,
              lifecycle: 'PUBLISHED',
            },
            { position: 3, kind: 'MEDIA_ASSET', id: assetId },
          ],
        });
      });

    await request(app.getHttpServer())
      .post(`/composition/pages/${pageId}/publish`)
      .set('Cookie', creator.cookiePair)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: pageId, lifecycle: 'PUBLISHED' });
      });

    const generation = await database.generation.findUniqueOrThrow({
      where: { id: generationId },
      include: { provenance: true, result: true, usage: true },
    });

    expect(generation).toMatchObject({
      actorId: creator.actorId,
      provider: 'provider.anime-composition-proof',
      model: 'model.anime-composition-proof',
      status: 'SUCCEEDED',
      result: { text: ANIME_CHARACTER_RESOURCE_TYPE },
      provenance: {
        task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
        sourceContext: { universeKey: ANIME_UNIVERSE_KEY },
      },
      usage: { totalTokens: 34 },
    });
    const sourceContext = z
      .object({
        universeKey: z.string(),
        knowledgeResources: z.array(
          z.object({
            id: z.string(),
            universeKey: z.string(),
            resourceType: z.string(),
          }),
        ),
      })
      .parse(generation.provenance?.sourceContext);

    expect(sourceContext.universeKey).toBe(ANIME_UNIVERSE_KEY);
    expect(sourceContext.knowledgeResources).toContainEqual({
      id: publishedSeriesId,
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_SERIES_RESOURCE_TYPE,
    });
    expect(
      sourceContext.knowledgeResources.every(
        (resource) =>
          resource.universeKey === ANIME_UNIVERSE_KEY &&
          resource.resourceType === ANIME_SERIES_RESOURCE_TYPE,
      ),
    ).toBe(true);
    expect(sourceContext.knowledgeResources.map((resource) => resource.id)).not.toContain(
      draftSeriesId,
    );
  });
});
