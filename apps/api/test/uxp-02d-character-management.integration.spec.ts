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
  throw new Error('DATABASE_URL is required for UXP-02D integration tests.');
}

const marker = `uxp-02d-${randomUUID()}`;

const sectionProofs = [
  ['entity.forms', 'anime.form'],
  ['entity.techniques', 'anime.technique'],
  ['entity.arcs', 'anime.arc'],
  ['entity.allies', 'anime.ally'],
  ['entity.rivals', 'anime.rival'],
  ['entity.family', 'anime.family'],
  ['entity.affiliations', 'anime.affiliation'],
  ['entity.places', 'anime.place'],
  ['entity.quotes', 'anime.quote'],
  ['entity.experiences', 'anime.experience'],
  ['entity.characters', 'anime.character'],
  ['entity.series', 'anime.appearance'],
] as const;

function sessionCookie(response: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  const raw = response.headers['set-cookie'];
  const first = Array.isArray(raw) ? raw[0] : raw;
  const pair = first?.split(';')[0];

  if (!pair?.startsWith(`${SESSION_COOKIE_NAME}=`)) {
    throw new Error('Expected opaque Session cookie.');
  }

  return pair;
}

describe('UXP-02D Character management + lifecycle', () => {
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

    const emails = await database.actorEmail.findMany({
      where: { normalizedEmail: { contains: marker.toLowerCase() } },
      select: { actorId: true },
    });
    const actorIds = emails.map(({ actorId }) => actorId);

    if (actorIds.length > 0) {
      await database.user.deleteMany({ where: { actorId: { in: actorIds } } });
      await database.actor.deleteMany({ where: { id: { in: actorIds } } });
    }
  }

  async function createResource(
    lifecycle: 'DRAFT' | 'PUBLISHED',
    resourceType: string,
  ): Promise<string> {
    const id = randomUUID();
    resourceIds.add(id);

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: 'universe.anime',
        resourceType,
        lifecycle,
      },
    });

    return id;
  }

  async function signIn(editor: boolean): Promise<string> {
    const email = `${marker}-${randomUUID()}@example.com`;
    const password = 'correct horse battery staple';

    const registration = await request(app.getHttpServer())
      .post('/registration')
      .send({ email, password })
      .expect(201);

    if (editor) {
      const role = await database.role.findUniqueOrThrow({
        where: { key: KNOWLEDGE_EDITOR_ROLE_KEY },
        select: { id: true },
      });

      await database.actorRole.create({
        data: {
          actorId: registration.body.actorId as string,
          roleId: role.id,
        },
      });
    }

    const authentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({ email, password })
      .expect(200);

    return sessionCookie(authentication);
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

  it('round-trips the finished Anime vocabulary and uses existing Knowledge lifecycle permissions', async () => {
    const editor = await signIn(true);
    const ordinary = await signIn(false);
    const mainId = await createResource('DRAFT', 'anime.character');

    const targetIds: string[] = [];
    for (let index = 0; index < sectionProofs.length + 1; index += 1) {
      const resourceType =
        index === sectionProofs.length - 1
          ? 'anime.series'
          : index === sectionProofs.length
            ? 'anime.character'
            : 'anime.character';

      const targetId = await createResource('PUBLISHED', resourceType);
      targetIds.push(targetId);

      await request(app.getHttpServer())
        .put(`/knowledge/resources/${targetId}/entity`)
        .set('Cookie', editor)
        .send({
          profile: {
            slug: `uxp-02d-target-${index}`,
            displayName: `UXP-02D Target ${index}`,
            nativeName: null,
            alternateNames: [],
            summary: `Published relation target ${index}.`,
            overview: null,
            facts: [],
          },
          relations: [],
        })
        .expect(200);
    }

    const relations: {
      targetResourceId: string;
      sectionKey: string;
      relationshipType: string;
      position: number;
    }[] = sectionProofs.map(([sectionKey, relationshipType], index) => {
      const targetResourceId = targetIds[index];
      if (!targetResourceId) {
        throw new Error(`Missing UXP-02D relation target at index ${index}.`);
      }

      return {
        targetResourceId,
        sectionKey,
        relationshipType,
        position: 0,
      };
    });

    relations.push({
      targetResourceId: targetIds.at(-1) as string,
      sectionKey: 'entity.rivals',
      relationshipType: 'anime.teammate',
      position: 1,
    });

    const deniedRead = await request(app.getHttpServer())
      .get(`/knowledge/resources/${mainId}/entity`)
      .set('Cookie', ordinary)
      .expect(403);

    expect(deniedRead.body.error).toMatchObject({
      code: 'knowledge.authorization.forbidden',
      status: 403,
    });

    const deniedWrite = await request(app.getHttpServer())
      .put(`/knowledge/resources/${mainId}/entity`)
      .set('Cookie', ordinary)
      .send({
        profile: {
          slug: 'denied-character',
          displayName: 'Denied',
          summary: 'Denied.',
          facts: [],
        },
        relations: [],
      })
      .expect(403);

    expect(deniedWrite.body.error).toMatchObject({
      code: 'knowledge.authorization.forbidden',
      status: 403,
    });

    await request(app.getHttpServer())
      .put(`/knowledge/resources/${mainId}/entity`)
      .set('Cookie', editor)
      .send({
        profile: {
          slug: 'uxp-02d-character',
          displayName: 'UXP-02D Character',
          nativeName: 'テストキャラクター',
          alternateNames: ['Character D', 'D Proof'],
          summary: 'A managed Anime Character.',
          overview: 'A Creator-managed Character proving canonical relationship depth.',
          facts: [
            { key: 'anime.series', label: 'Series', value: 'UXP-02D' },
            { key: 'anime.role', label: 'Role', value: 'Shinobi' },
          ],
        },
        relations,
      })
      .expect(200);

    const configuration = await request(app.getHttpServer())
      .get(`/knowledge/resources/${mainId}/entity`)
      .set('Cookie', editor)
      .expect(200);

    expect(configuration.body.resource).toEqual(
      expect.objectContaining({
        id: mainId,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        lifecycle: 'DRAFT',
      }),
    );
    expect(configuration.body).toMatchObject({
      resourceId: mainId,
      slug: 'uxp-02d-character',
      displayName: 'UXP-02D Character',
      nativeName: 'テストキャラクター',
      alternateNames: ['Character D', 'D Proof'],
      facts: [
        { key: 'anime.series', label: 'Series', value: 'UXP-02D' },
        { key: 'anime.role', label: 'Role', value: 'Shinobi' },
      ],
    });
    expect(configuration.body.relations).toHaveLength(sectionProofs.length + 1);
    expect(
      configuration.body.relations
        .filter((relation: { sectionKey: string }) => relation.sectionKey === 'entity.rivals')
        .map((relation: { position: number }) => relation.position),
    ).toEqual([0, 1]);

    await request(app.getHttpServer())
      .get('/knowledge/entities/universe.anime/uxp-02d-character')
      .expect(404);

    const deniedPublish = await request(app.getHttpServer())
      .post(`/knowledge/resources/${mainId}/publish`)
      .set('Cookie', ordinary)
      .expect(403);

    expect(deniedPublish.body.error).toMatchObject({
      code: 'knowledge.authorization.forbidden',
      status: 403,
    });

    const published = await request(app.getHttpServer())
      .post(`/knowledge/resources/${mainId}/publish`)
      .set('Cookie', editor)
      .expect(201);

    expect(published.body).toEqual(
      expect.objectContaining({
        id: mainId,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        lifecycle: 'PUBLISHED',
      }),
    );

    const publicEntity = await request(app.getHttpServer())
      .get('/knowledge/entities/universe.anime/uxp-02d-character')
      .expect(200);

    const publicSectionKeys = new Set(
      (publicEntity.body.relations as { sectionKey: string }[]).map(
        (relation) => relation.sectionKey,
      ),
    );

    for (const [sectionKey] of sectionProofs) {
      expect(publicSectionKeys.has(sectionKey)).toBe(true);
    }

    const publicRivals = (
      publicEntity.body.relations as {
        sectionKey: string;
        position: number;
        relationshipType: string;
      }[]
    )
      .filter((relation) => relation.sectionKey === 'entity.rivals')
      .sort((left, right) => left.position - right.position);

    expect(publicRivals.map(({ relationshipType }) => relationshipType)).toEqual([
      'anime.rival',
      'anime.teammate',
    ]);

    const archived = await request(app.getHttpServer())
      .post(`/knowledge/resources/${mainId}/archive`)
      .set('Cookie', editor)
      .expect(201);

    expect(archived.body.lifecycle).toBe('ARCHIVED');

    await request(app.getHttpServer())
      .get('/knowledge/entities/universe.anime/uxp-02d-character')
      .expect(404);
  });
});
