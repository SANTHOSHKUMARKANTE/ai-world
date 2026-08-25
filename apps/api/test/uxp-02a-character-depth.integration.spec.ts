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
  throw new Error('DATABASE_URL is required for UXP-02A integration tests.');
}

const marker = `uxp-02a-${randomUUID()}`;

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

describe('UXP-02A Character canonical depth', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  const resourceIds = new Set<string>();

  async function cleanup(): Promise<void> {
    if (resourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({ where: { id: { in: [...resourceIds] } } });
      resourceIds.clear();
    }
    const emails = await database.actorEmail.findMany({
      where: { normalizedEmail: { contains: marker.toLowerCase() } },
      select: { actorId: true },
    });
    const ids = emails.map(({ actorId }) => actorId);
    if (ids.length > 0) {
      await database.user.deleteMany({ where: { actorId: { in: ids } } });
      await database.actor.deleteMany({ where: { id: { in: ids } } });
    }
  }

  async function createResource(
    lifecycle: 'DRAFT' | 'PUBLISHED',
    universeKey: string,
    resourceType: string,
  ): Promise<string> {
    const id = randomUUID();
    resourceIds.add(id);
    await database.knowledgeResource.create({ data: { id, universeKey, resourceType, lifecycle } });
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
        data: { actorId: registration.body.actorId as string, roleId: role.id },
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
      imports: [AppModule.register({ databaseUrl, environment: 'test', logLevel: 'fatal' })],
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

  it('keeps legacy-shaped profiles valid through deterministic migration defaults', async () => {
    const id = await createResource('PUBLISHED', 'universe.devotional', 'devotional.deity');
    await database.knowledgeResourceProfile.create({
      data: {
        knowledgeResourceId: id,
        routeKey: 'universe.devotional/uxp-02a-legacy',
        slug: 'uxp-02a-legacy',
        displayName: 'Legacy Profile',
        summary: 'Created without the new optional Character fields.',
        facts: [],
      },
    });
    const response = await request(app.getHttpServer())
      .get('/knowledge/entities/universe.devotional/uxp-02a-legacy')
      .expect(200);
    expect(response.body.profile).toMatchObject({
      nativeName: null,
      alternateNames: [],
      overview: null,
    });
  });

  it('round-trips Naruto and a second Character through one shared Creator/public contract', async () => {
    const narutoId = await createResource('PUBLISHED', 'universe.anime', 'anime.character');
    const sasukeId = await createResource('PUBLISHED', 'universe.anime', 'anime.character');
    const editor = await signIn(true);
    const ordinary = await signIn(false);

    await request(app.getHttpServer())
      .put(`/knowledge/resources/${sasukeId}/entity`)
      .set('Cookie', editor)
      .send({
        profile: {
          slug: 'sasuke-uchiha',
          displayName: 'Sasuke Uchiha',
          nativeName: '  うちはサスケ  ',
          alternateNames: ['Sasuke'],
          summary: 'A shinobi of the Uchiha clan.',
          overview: '  A canonical second Character proving shared reuse.  ',
          facts: [{ key: 'anime.series', label: 'Series', value: 'Naruto' }],
        },
        relations: [],
      })
      .expect(200);

    const writeResponse = await request(app.getHttpServer())
      .put(`/knowledge/resources/${narutoId}/entity`)
      .set('Cookie', editor)
      .send({
        profile: {
          slug: 'naruto-uzumaki',
          displayName: 'Naruto Uzumaki',
          nativeName: '  うずまきナルト  ',
          alternateNames: ['Naruto', 'Uzumaki Naruto'],
          summary: 'A shinobi whose ambition is to become Hokage.',
          overview:
            '  Naruto grows from an isolated child into a leader through persistence, bonds, and responsibility.  ',
          facts: [{ key: 'anime.series', label: 'Series', value: 'Naruto' }],
        },
        relations: [
          {
            targetResourceId: sasukeId,
            sectionKey: 'anime.rivals',
            relationshipType: 'anime.rival',
            position: 1,
          },
          {
            targetResourceId: sasukeId,
            sectionKey: 'anime.rivals',
            relationshipType: 'anime.teammate',
            position: 0,
          },
        ],
      })
      .expect(200);

    expect(writeResponse.body).toMatchObject({
      resourceId: narutoId,
      nativeName: 'うずまきナルト',
      alternateNames: ['Naruto', 'Uzumaki Naruto'],
      overview:
        'Naruto grows from an isolated child into a leader through persistence, bonds, and responsibility.',
    });

    const denied = await request(app.getHttpServer())
      .get(`/knowledge/resources/${narutoId}/entity`)
      .set('Cookie', ordinary)
      .set('X-Request-Id', 'uxp-02a-denied-001')
      .expect('X-Request-Id', 'uxp-02a-denied-001')
      .expect(403);
    expect(denied.body.error).toMatchObject({
      code: 'knowledge.authorization.forbidden',
      status: 403,
    });

    const creator = await request(app.getHttpServer())
      .get(`/knowledge/resources/${narutoId}/entity`)
      .set('Cookie', editor)
      .expect(200);
    expect(creator.body).toEqual({
      resource: {
        id: narutoId,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        lifecycle: 'PUBLISHED',
      },
      resourceId: narutoId,
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      nativeName: 'うずまきナルト',
      alternateNames: ['Naruto', 'Uzumaki Naruto'],
      summary: 'A shinobi whose ambition is to become Hokage.',
      overview:
        'Naruto grows from an isolated child into a leader through persistence, bonds, and responsibility.',
      facts: [{ key: 'anime.series', label: 'Series', value: 'Naruto' }],
      updatedAt: expect.any(String),
      relations: [
        {
          targetResourceId: sasukeId,
          sectionKey: 'anime.rivals',
          relationshipType: 'anime.teammate',
          position: 0,
        },
        {
          targetResourceId: sasukeId,
          sectionKey: 'anime.rivals',
          relationshipType: 'anime.rival',
          position: 1,
        },
      ],
    });

    const persisted = await database.knowledgeResourceProfile.findUniqueOrThrow({
      where: { knowledgeResourceId: narutoId },
    });
    expect(persisted).toMatchObject({
      nativeName: 'うずまきナルト',
      alternateNames: ['Naruto', 'Uzumaki Naruto'],
      overview:
        'Naruto grows from an isolated child into a leader through persistence, bonds, and responsibility.',
    });

    const publicNaruto = await request(app.getHttpServer())
      .get('/knowledge/entities/universe.anime/naruto-uzumaki')
      .expect(200);
    expect(publicNaruto.body.profile).toEqual({
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      nativeName: 'うずまきナルト',
      alternateNames: ['Naruto', 'Uzumaki Naruto'],
      summary: 'A shinobi whose ambition is to become Hokage.',
      overview:
        'Naruto grows from an isolated child into a leader through persistence, bonds, and responsibility.',
      facts: [{ key: 'anime.series', label: 'Series', value: 'Naruto' }],
    });
    expect(publicNaruto.body.profile).not.toHaveProperty('routeKey');
    expect(publicNaruto.body.profile).not.toHaveProperty('updatedAt');

    const publicSasuke = await request(app.getHttpServer())
      .get('/knowledge/entities/universe.anime/sasuke-uchiha')
      .expect(200);
    expect(publicSasuke.body.profile).toMatchObject({
      displayName: 'Sasuke Uchiha',
      nativeName: 'うちはサスケ',
      alternateNames: ['Sasuke'],
      overview: 'A canonical second Character proving shared reuse.',
    });
  });

  it('rejects duplicate alternate names after canonical comparison', async () => {
    const id = await createResource('DRAFT', 'universe.anime', 'anime.character');
    const editor = await signIn(true);
    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${id}/entity`)
      .set('Cookie', editor)
      .send({
        profile: {
          slug: 'duplicate-names',
          displayName: 'Duplicate Names',
          alternateNames: ['Naruto', '  NARUTO  '],
          summary: 'Validation proof.',
          facts: [],
        },
        relations: [],
      })
      .expect(400);
    expect(response.body.error).toMatchObject({
      code: 'knowledge.entity.invalid_input',
      status: 400,
    });
  });
});
