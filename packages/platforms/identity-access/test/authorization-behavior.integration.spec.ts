import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { AssignRoleToActor, EvaluatePermission } from '../src';
import { PrismaAuthorizationRepository } from '../src/infrastructure';
import { afterAll, afterEach, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is required for Identity & Access authorization behavior integration tests.',
  );
}

const database: DatabaseClient = createDatabaseClient({
  connectionString: databaseUrl,
});

const authorizationRepository = new PrismaAuthorizationRepository(database);

const assignRoleToActor = new AssignRoleToActor(authorizationRepository);

const evaluatePermission = new EvaluatePermission(authorizationRepository);

const ownedActorIds = new Set<string>();
const ownedRoleIds = new Set<string>();
const ownedPermissionIds = new Set<string>();

async function createActor() {
  const actor = await database.actor.create({
    data: {},
  });

  ownedActorIds.add(actor.id);

  return actor;
}

async function createRole(name = 'Authorization Test Role') {
  const role = await database.role.create({
    data: {
      key: `role-${randomUUID()}`,
      name,
    },
  });

  ownedRoleIds.add(role.id);

  return role;
}

async function createPermission(description = 'Authorization test permission') {
  const permission = await database.permission.create({
    data: {
      key: `permission.${randomUUID()}`,
      description,
    },
  });

  ownedPermissionIds.add(permission.id);

  return permission;
}

async function grantPermission(roleId: string, permissionId: string): Promise<void> {
  await database.rolePermission.create({
    data: {
      roleId,
      permissionId,
    },
  });
}

afterEach(async () => {
  const actorIds = [...ownedActorIds];
  const roleIds = [...ownedRoleIds];
  const permissionIds = [...ownedPermissionIds];

  if (roleIds.length > 0) {
    await database.rolePermission.deleteMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
    });

    await database.actorRole.deleteMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
    });
  }

  if (permissionIds.length > 0) {
    await database.rolePermission.deleteMany({
      where: {
        permissionId: {
          in: permissionIds,
        },
      },
    });
  }

  if (actorIds.length > 0) {
    await database.actorRole.deleteMany({
      where: {
        actorId: {
          in: actorIds,
        },
      },
    });
  }

  if (roleIds.length > 0) {
    await database.role.deleteMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    });
  }

  if (permissionIds.length > 0) {
    await database.permission.deleteMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });
  }

  if (actorIds.length > 0) {
    await database.actor.deleteMany({
      where: {
        id: {
          in: actorIds,
        },
      },
    });
  }

  ownedActorIds.clear();
  ownedRoleIds.clear();
  ownedPermissionIds.clear();
});

afterAll(async () => {
  await database.$disconnect();
});

describe('authorization behavior', () => {
  it('assigns a Role to an Actor through the production authorization repository', async () => {
    const actor = await createActor();
    const role = await createRole('Creator');

    await expect(
      assignRoleToActor.execute({
        actorId: actor.id,
        roleKey: role.key,
      }),
    ).resolves.toBeUndefined();

    const assignment = await database.actorRole.findUnique({
      where: {
        actorId_roleId: {
          actorId: actor.id,
          roleId: role.id,
        },
      },
    });

    expect(assignment).toMatchObject({
      actorId: actor.id,
      roleId: role.id,
    });

    expect(assignment?.assignedAt).toBeInstanceOf(Date);
  });

  it('treats repeated Role assignment as an idempotent success', async () => {
    const actor = await createActor();
    const role = await createRole('Creator');

    await assignRoleToActor.execute({
      actorId: actor.id,
      roleKey: role.key,
    });

    await expect(
      assignRoleToActor.execute({
        actorId: actor.id,
        roleKey: role.key,
      }),
    ).resolves.toBeUndefined();

    const assignments = await database.actorRole.findMany({
      where: {
        actorId: actor.id,
        roleId: role.id,
      },
    });

    expect(assignments).toHaveLength(1);
  });

  it('returns the canonical Actor not-found failure when assigning a Role to a missing Actor', async () => {
    const role = await createRole('Creator');

    await expect(
      assignRoleToActor.execute({
        actorId: randomUUID(),
        roleKey: role.key,
      }),
    ).rejects.toMatchObject({
      code: 'identity.authorization.actor_not_found',
      kind: 'not_found',
      publicMessage: 'Actor not found.',
    });
  });

  it('returns the canonical Role not-found failure when assigning a missing Role', async () => {
    const actor = await createActor();

    await expect(
      assignRoleToActor.execute({
        actorId: actor.id,
        roleKey: `missing-role-${randomUUID()}`,
      }),
    ).rejects.toMatchObject({
      code: 'identity.authorization.role_not_found',
      kind: 'not_found',
      publicMessage: 'Role not found.',
    });
  });

  it('allows an Actor when an assigned Role grants the requested Permission', async () => {
    const actor = await createActor();
    const role = await createRole('Creator');
    const permission = await createPermission('Create a protected Resource');

    await grantPermission(role.id, permission.id);

    await assignRoleToActor.execute({
      actorId: actor.id,
      roleKey: role.key,
    });

    await expect(
      evaluatePermission.execute({
        actorId: actor.id,
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: true,
    });
  });

  it('denies an Actor that has no Role assignments', async () => {
    const actor = await createActor();
    const permission = await createPermission();

    await expect(
      evaluatePermission.execute({
        actorId: actor.id,
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: false,
    });
  });

  it('denies an Actor whose assigned Role does not grant the requested Permission', async () => {
    const actor = await createActor();
    const role = await createRole('Creator');
    const permission = await createPermission();

    await assignRoleToActor.execute({
      actorId: actor.id,
      roleKey: role.key,
    });

    await expect(
      evaluatePermission.execute({
        actorId: actor.id,
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: false,
    });
  });

  it('denies an unknown Permission key', async () => {
    const actor = await createActor();
    const role = await createRole('Creator');

    await assignRoleToActor.execute({
      actorId: actor.id,
      roleKey: role.key,
    });

    await expect(
      evaluatePermission.execute({
        actorId: actor.id,
        permissionKey: `unknown.permission.${randomUUID()}`,
      }),
    ).resolves.toEqual({
      allowed: false,
    });
  });

  it('denies an unknown Actor without exposing Actor existence', async () => {
    const permission = await createPermission();

    await expect(
      evaluatePermission.execute({
        actorId: randomUUID(),
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: false,
    });
  });

  it('does not grant a Permission through an unrelated Role', async () => {
    const actor = await createActor();

    const assignedRole = await createRole('Creator');
    const grantingRole = await createRole('Administrator');

    const permission = await createPermission();

    await grantPermission(grantingRole.id, permission.id);

    await assignRoleToActor.execute({
      actorId: actor.id,
      roleKey: assignedRole.key,
    });

    await expect(
      evaluatePermission.execute({
        actorId: actor.id,
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: false,
    });
  });

  it('allows when any one of multiple assigned Roles grants the Permission', async () => {
    const actor = await createActor();

    const firstRole = await createRole('Creator');
    const secondRole = await createRole('Administrator');

    const permission = await createPermission();

    await grantPermission(secondRole.id, permission.id);

    await assignRoleToActor.execute({
      actorId: actor.id,
      roleKey: firstRole.key,
    });

    await assignRoleToActor.execute({
      actorId: actor.id,
      roleKey: secondRole.key,
    });

    await expect(
      evaluatePermission.execute({
        actorId: actor.id,
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: true,
    });
  });

  it('does not leak another Actor permission grant', async () => {
    const allowedActor = await createActor();
    const deniedActor = await createActor();

    const role = await createRole('Creator');
    const permission = await createPermission();

    await grantPermission(role.id, permission.id);

    await assignRoleToActor.execute({
      actorId: allowedActor.id,
      roleKey: role.key,
    });

    await expect(
      evaluatePermission.execute({
        actorId: allowedActor.id,
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: true,
    });

    await expect(
      evaluatePermission.execute({
        actorId: deniedActor.id,
        permissionKey: permission.key,
      }),
    ).resolves.toEqual({
      allowed: false,
    });
  });
});
