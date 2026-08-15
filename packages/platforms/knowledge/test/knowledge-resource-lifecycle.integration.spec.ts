import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  ADMINISTRATOR_ROLE_KEY,
  AssignRoleToActor,
  EvaluatePermission,
  KNOWLEDGE_EDITOR_ROLE_KEY,
} from '@ai-world/platform-identity-access';
import { PrismaAuthorizationRepository } from '@ai-world/platform-identity-access/infrastructure';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  ArchiveKnowledgeResource,
  ArchiveKnowledgeResourceAsActor,
  CreateKnowledgeResource,
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY,
  PublishKnowledgeResource,
  PublishKnowledgeResourceAsActor,
} from '../src';
import { PrismaKnowledgeResourceRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Knowledge lifecycle integration tests.');
  }

  return databaseUrl;
}

describe('Knowledge Resource lifecycle persistence', () => {
  let database: DatabaseClient;
  let assignRoleToActor: AssignRoleToActor;
  let createKnowledgeResource: CreateKnowledgeResource;
  let publishKnowledgeResource: PublishKnowledgeResource;
  let archiveKnowledgeResource: ArchiveKnowledgeResource;
  let publishAsActor: PublishKnowledgeResourceAsActor;
  let archiveAsActor: ArchiveKnowledgeResourceAsActor;

  const actorIds = new Set<string>();
  const userIds = new Set<string>();
  const resourceIds = new Set<string>();

  async function createActor(): Promise<{ readonly id: string }> {
    const actor = await database.actor.create({
      data: {},
      select: { id: true },
    });

    actorIds.add(actor.id);
    return actor;
  }

  async function createUser(actorId: string): Promise<{ readonly id: string }> {
    const user = await database.user.create({
      data: { actorId },
      select: { id: true },
    });

    userIds.add(user.id);
    return user;
  }

  async function assignRole(actorId: string, roleKey: string): Promise<void> {
    await assignRoleToActor.execute({
      actorId,
      roleKey,
    });
  }

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });

    const authorizationRepository = new PrismaAuthorizationRepository(database);
    const evaluatePermission = new EvaluatePermission(authorizationRepository);
    assignRoleToActor = new AssignRoleToActor(authorizationRepository);

    const knowledgeRepository = new PrismaKnowledgeResourceRepository(database);

    createKnowledgeResource = new CreateKnowledgeResource(knowledgeRepository);
    publishKnowledgeResource = new PublishKnowledgeResource(
      knowledgeRepository,
      knowledgeRepository,
    );
    archiveKnowledgeResource = new ArchiveKnowledgeResource(
      knowledgeRepository,
      knowledgeRepository,
    );

    publishAsActor = new PublishKnowledgeResourceAsActor(
      evaluatePermission,
      publishKnowledgeResource,
    );
    archiveAsActor = new ArchiveKnowledgeResourceAsActor(
      evaluatePermission,
      archiveKnowledgeResource,
    );
  });

  afterEach(async () => {
    if (resourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: {
          id: {
            in: [...resourceIds],
          },
        },
      });
    }

    if (userIds.size > 0) {
      await database.user.deleteMany({
        where: {
          id: {
            in: [...userIds],
          },
        },
      });
    }

    if (actorIds.size > 0) {
      await database.actorRole.deleteMany({
        where: {
          actorId: {
            in: [...actorIds],
          },
        },
      });

      await database.actor.deleteMany({
        where: {
          id: {
            in: [...actorIds],
          },
        },
      });
    }

    resourceIds.clear();
    userIds.clear();
    actorIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it('persists publish/archive Permissions for Knowledge editor and Administrator', async () => {
    const permissions = await database.permission.findMany({
      where: {
        key: {
          in: [
            KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY,
            KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY,
          ],
        },
      },
      select: {
        key: true,
      },
    });

    expect(permissions.map((permission) => permission.key).sort()).toEqual(
      [KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY, KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY].sort(),
    );

    const grants = await database.rolePermission.findMany({
      where: {
        role: {
          key: {
            in: [ADMINISTRATOR_ROLE_KEY, KNOWLEDGE_EDITOR_ROLE_KEY],
          },
        },
        permission: {
          key: {
            in: [
              KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY,
              KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY,
            ],
          },
        },
      },
      select: {
        role: {
          select: {
            key: true,
          },
        },
        permission: {
          select: {
            key: true,
          },
        },
      },
    });

    expect(grants.map((grant) => `${grant.role.key}:${grant.permission.key}`).sort()).toEqual(
      [
        `${ADMINISTRATOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY}`,
        `${ADMINISTRATOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY}`,
        `${KNOWLEDGE_EDITOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY}`,
        `${KNOWLEDGE_EDITOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY}`,
      ].sort(),
    );
  });

  it('allows a Knowledge editor to persist DRAFT -> PUBLISHED -> ARCHIVED', async () => {
    const editor = await createActor();
    await assignRole(editor.id, KNOWLEDGE_EDITOR_ROLE_KEY);

    const created = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.lifecycle-test'),
      resourceType: parseNamespacedKey('knowledge.lifecycle-resource'),
    });
    resourceIds.add(created.id);

    const published = await publishAsActor.execute({
      actingActorId: editor.id,
      id: created.id,
    });

    expect(published.lifecycle).toBe(KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE);

    const archived = await archiveAsActor.execute({
      actingActorId: editor.id,
      id: created.id,
    });

    expect(archived.lifecycle).toBe(KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE);

    const persisted = await database.knowledgeResource.findUniqueOrThrow({
      where: { id: created.id },
    });

    expect(persisted.lifecycle).toBe(KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE);
  });

  it('allows an Administrator through the same lifecycle Permissions', async () => {
    const administrator = await createActor();
    await assignRole(administrator.id, ADMINISTRATOR_ROLE_KEY);

    const created = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.lifecycle-test'),
      resourceType: parseNamespacedKey('knowledge.lifecycle-resource'),
    });
    resourceIds.add(created.id);

    await publishAsActor.execute({
      actingActorId: administrator.id,
      id: created.id,
    });

    const archived = await archiveAsActor.execute({
      actingActorId: administrator.id,
      id: created.id,
    });

    expect(archived.lifecycle).toBe(KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE);
  });

  it('denies an ordinary persisted User and leaves lifecycle unchanged', async () => {
    const ordinaryActor = await createActor();
    await createUser(ordinaryActor.id);

    const roleCount = await database.actorRole.count({
      where: {
        actorId: ordinaryActor.id,
      },
    });
    expect(roleCount).toBe(0);

    const created = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.lifecycle-test'),
      resourceType: parseNamespacedKey('knowledge.lifecycle-resource'),
    });
    resourceIds.add(created.id);

    await expect(
      publishAsActor.execute({
        actingActorId: ordinaryActor.id,
        id: created.id,
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });

    const afterDeniedPublish = await database.knowledgeResource.findUniqueOrThrow({
      where: { id: created.id },
    });
    expect(afterDeniedPublish.lifecycle).toBe('DRAFT');

    await publishKnowledgeResource.execute({ id: created.id });

    await expect(
      archiveAsActor.execute({
        actingActorId: ordinaryActor.id,
        id: created.id,
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });

    const afterDeniedArchive = await database.knowledgeResource.findUniqueOrThrow({
      where: { id: created.id },
    });
    expect(afterDeniedArchive.lifecycle).toBe(KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE);
  });

  it('enforces lifecycle conflicts and preserves missing-target semantics', async () => {
    const created = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.lifecycle-test'),
      resourceType: parseNamespacedKey('knowledge.lifecycle-resource'),
    });
    resourceIds.add(created.id);

    await expect(archiveKnowledgeResource.execute({ id: created.id })).rejects.toMatchObject({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
    });

    await publishKnowledgeResource.execute({ id: created.id });

    await expect(publishKnowledgeResource.execute({ id: created.id })).rejects.toMatchObject({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
    });

    await archiveKnowledgeResource.execute({ id: created.id });

    await expect(archiveKnowledgeResource.execute({ id: created.id })).rejects.toMatchObject({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
    });

    await expect(
      publishKnowledgeResource.execute({
        id: generateResourceId(),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });
  });
});
