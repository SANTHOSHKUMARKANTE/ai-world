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
  CreateKnowledgeResource,
  CreateKnowledgeResourceAsActor,
  KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY,
  KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
  UpdateKnowledgeResource,
  UpdateKnowledgeResourceAsActor,
} from '../src';
import { PrismaKnowledgeResourceRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Knowledge authorization integration tests.');
  }

  return databaseUrl;
}

describe('Knowledge Resource authorization persistence', () => {
  let database: DatabaseClient;
  let assignRoleToActor: AssignRoleToActor;
  let createKnowledgeResource: CreateKnowledgeResource;
  let createKnowledgeResourceAsActor: CreateKnowledgeResourceAsActor;
  let updateKnowledgeResourceAsActor: UpdateKnowledgeResourceAsActor;

  const actorIds = new Set<string>();
  const userIds = new Set<string>();
  const resourceIds = new Set<string>();

  async function createActor(): Promise<{ readonly id: string }> {
    const actor = await database.actor.create({
      data: {},
      select: {
        id: true,
      },
    });

    actorIds.add(actor.id);
    return actor;
  }

  async function createUser(actorId: string): Promise<{ readonly id: string }> {
    const user = await database.user.create({
      data: {
        actorId,
      },
      select: {
        id: true,
      },
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

    createKnowledgeResourceAsActor = new CreateKnowledgeResourceAsActor(
      evaluatePermission,
      createKnowledgeResource,
    );

    updateKnowledgeResourceAsActor = new UpdateKnowledgeResourceAsActor(
      evaluatePermission,
      new UpdateKnowledgeResource(knowledgeRepository),
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

  it('provides the Knowledge editor Role and grants both Knowledge mutation Permissions to editor and Administrator', async () => {
    const editorRole = await database.role.findUnique({
      where: {
        key: KNOWLEDGE_EDITOR_ROLE_KEY,
      },
    });

    expect(editorRole).toMatchObject({
      key: KNOWLEDGE_EDITOR_ROLE_KEY,
      name: 'Knowledge Editor',
    });

    const permissions = await database.permission.findMany({
      where: {
        key: {
          in: [KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY, KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY],
        },
      },
      orderBy: {
        key: 'asc',
      },
    });

    expect(permissions.map((permission) => permission.key)).toEqual([
      KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY,
      KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
    ]);

    const grants = await database.rolePermission.findMany({
      where: {
        role: {
          key: {
            in: [KNOWLEDGE_EDITOR_ROLE_KEY, ADMINISTRATOR_ROLE_KEY],
          },
        },
        permission: {
          key: {
            in: [
              KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY,
              KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
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
        `${ADMINISTRATOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY}`,
        `${ADMINISTRATOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY}`,
        `${KNOWLEDGE_EDITOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY}`,
        `${KNOWLEDGE_EDITOR_ROLE_KEY}:${KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY}`,
      ].sort(),
    );
  });

  it('allows a Knowledge editor to create and update canonical Knowledge', async () => {
    const editor = await createActor();
    await assignRole(editor.id, KNOWLEDGE_EDITOR_ROLE_KEY);

    const created = await createKnowledgeResourceAsActor.execute({
      actingActorId: editor.id,
      universeKey: parseNamespacedKey('knowledge.authorization-test'),
      resourceType: parseNamespacedKey('knowledge.authorization-resource'),
    });

    resourceIds.add(created.id);

    const updated = await updateKnowledgeResourceAsActor.execute({
      actingActorId: editor.id,
      id: created.id,
      resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
    });

    expect(updated.id).toBe(created.id);
    expect(updated.universeKey).toBe(created.universeKey);
    expect(updated.resourceType).toBe('knowledge.authorization-resource-updated');
    expect(updated.lifecycle).toBe('DRAFT');
  });

  it('allows an Administrator to create and update canonical Knowledge through the same Permissions', async () => {
    const administrator = await createActor();
    await assignRole(administrator.id, ADMINISTRATOR_ROLE_KEY);

    const created = await createKnowledgeResourceAsActor.execute({
      actingActorId: administrator.id,
      universeKey: parseNamespacedKey('knowledge.authorization-test'),
      resourceType: parseNamespacedKey('knowledge.authorization-resource'),
    });

    resourceIds.add(created.id);

    const updated = await updateKnowledgeResourceAsActor.execute({
      actingActorId: administrator.id,
      id: created.id,
      resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
    });

    expect(updated.resourceType).toBe('knowledge.authorization-resource-updated');
  });

  it('denies an ordinary User and performs no Knowledge creation or update', async () => {
    const ordinaryActor = await createActor();
    await createUser(ordinaryActor.id);

    const ordinaryUserRoleCount = await database.actorRole.count({
      where: {
        actorId: ordinaryActor.id,
      },
    });

    expect(ordinaryUserRoleCount).toBe(0);

    const beforeCreateCount = await database.knowledgeResource.count({
      where: {
        universeKey: 'knowledge.authorization-test',
      },
    });

    await expect(
      createKnowledgeResourceAsActor.execute({
        actingActorId: ordinaryActor.id,
        universeKey: parseNamespacedKey('knowledge.authorization-test'),
        resourceType: parseNamespacedKey('knowledge.authorization-resource'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });

    const afterCreateCount = await database.knowledgeResource.count({
      where: {
        universeKey: 'knowledge.authorization-test',
      },
    });

    expect(afterCreateCount).toBe(beforeCreateCount);

    const existing = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.authorization-test'),
      resourceType: parseNamespacedKey('knowledge.authorization-resource'),
    });

    resourceIds.add(existing.id);

    await expect(
      updateKnowledgeResourceAsActor.execute({
        actingActorId: ordinaryActor.id,
        id: existing.id,
        resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });

    const persisted = await database.knowledgeResource.findUniqueOrThrow({
      where: {
        id: existing.id,
      },
    });

    expect(persisted.resourceType).toBe('knowledge.authorization-resource');
  });

  it('denies before Resource lookup, while an authorized missing update preserves canonical not-found semantics', async () => {
    const ordinaryActor = await createActor();
    const editor = await createActor();
    await assignRole(editor.id, KNOWLEDGE_EDITOR_ROLE_KEY);

    const missingId = generateResourceId();

    await expect(
      updateKnowledgeResourceAsActor.execute({
        actingActorId: ordinaryActor.id,
        id: missingId,
        resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });

    await expect(
      updateKnowledgeResourceAsActor.execute({
        actingActorId: editor.id,
        id: missingId,
        resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });
  });
});
