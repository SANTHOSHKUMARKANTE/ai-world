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
  throw new Error('DATABASE_URL is required for UXP-08B API integration tests.');
}

describe('UXP-08B public Entity by Resource ID', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  const resourceIds = new Set<string>();

  async function cleanup(): Promise<void> {
    if (resourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: { id: { in: [...resourceIds] } },
      });
      resourceIds.clear();
    }
  }

  async function createResource(
    lifecycle: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    options: {
      readonly withProfile?: boolean;
      readonly resourceType?: string;
      readonly displayName?: string;
    } = {},
  ): Promise<string> {
    const id = randomUUID();
    resourceIds.add(id);

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: 'universe.devotional',
        resourceType: options.resourceType ?? 'devotional.temple',
        lifecycle,
        ...(options.withProfile === false
          ? {}
          : {
              profile: {
                create: {
                  routeKey: `universe.devotional/temple-${id}`,
                  slug: `temple-${id}`,
                  displayName: options.displayName ?? 'Kashi Vishwanath Temple',
                  summary: 'Published sacred-place Knowledge used by the generic detail.',
                  overview: 'A public overview reused through the existing Entity projection.',
                  facts: [{ key: 'devotional.location', label: 'Location', value: 'Varanasi' }],
                },
              },
            }),
      },
    });

    return id;
  }

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    await cleanup();

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

  afterEach(cleanup);

  afterAll(async () => {
    await cleanup();
    await app.close();
    await database.$disconnect();
  });

  it('returns the same published profile through Resource ID and route-key reads', async () => {
    const id = await createResource('PUBLISHED');

    const byResource = await request(app.getHttpServer())
      .get(`/knowledge/entities/by-resource/${id}`)
      .expect(200);

    expect(byResource.body).toMatchObject({
      resource: {
        id,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.temple',
      },
      profile: {
        displayName: 'Kashi Vishwanath Temple',
        summary: 'Published sacred-place Knowledge used by the generic detail.',
        overview: 'A public overview reused through the existing Entity projection.',
        facts: [{ key: 'devotional.location', label: 'Location', value: 'Varanasi' }],
      },
      media: [],
      relations: [],
    });

    const slug = byResource.body.profile.slug as string;
    const byRoute = await request(app.getHttpServer())
      .get(`/knowledge/entities/universe.devotional/${slug}`)
      .expect(200);

    expect(byResource.body).toEqual(byRoute.body);
  });

  it('keeps DRAFT, ARCHIVED, profileless and malformed Resource IDs opaque', async () => {
    const draftId = await createResource('DRAFT');
    const archivedId = await createResource('ARCHIVED');
    const profilelessId = await createResource('PUBLISHED', { withProfile: false });

    for (const id of [draftId, archivedId, profilelessId, 'not-a-resource-id']) {
      const response = await request(app.getHttpServer())
        .get(`/knowledge/entities/by-resource/${id}`)
        .set('X-Request-Id', `uxp08b-${id}`)
        .expect(404);

      expect(response.body.error).toMatchObject({
        code: 'knowledge.entity.public_not_found',
        message: 'Knowledge Entity not found.',
        status: 404,
      });
    }
  });
});
