import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { afterAll, afterEach, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is required for Identity & Access authorization persistence integration tests.',
  );
}

const database: DatabaseClient = createDatabaseClient({
  connectionString: databaseUrl,
});

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

async function createRole() {
  const role = await database.role.create({
    data: {
      key: `role-${randomUUID()}`,
      name: 'Authorization Test Role',
    },
  });

  ownedRoleIds.add(role.id);

  return role;
}

async function createPermission() {
  const permission = await database.permission.create({
    data: {
      key: `permission.${randomUUID()}`,
      description: 'Authorization test permission',
    },
  });

  ownedPermissionIds.add(permission.id);

  return permission;
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

describe('authorization persistence', () => {
  it('persists a Role with its canonical fields', async () => {
    const key = `role-${randomUUID()}`;

    const role = await database.role.create({
      data: {
        key,
        name: 'Creator',
      },
    });

    ownedRoleIds.add(role.id);

    expect(role).toMatchObject({
      key,
      name: 'Creator',
    });

    expect(role.id).toEqual(expect.any(String));
    expect(role.createdAt).toBeInstanceOf(Date);
    expect(role.updatedAt).toBeInstanceOf(Date);
  });

  it('enforces Role key uniqueness', async () => {
    const key = `role-${randomUUID()}`;

    const firstRole = await database.role.create({
      data: {
        key,
        name: 'First Role',
      },
    });

    ownedRoleIds.add(firstRole.id);

    await expect(
      database.role.create({
        data: {
          key,
          name: 'Second Role',
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('persists a Permission with its canonical fields', async () => {
    const key = `permission.${randomUUID()}`;

    const permission = await database.permission.create({
      data: {
        key,
        description: 'Create a protected Resource',
      },
    });

    ownedPermissionIds.add(permission.id);

    expect(permission).toMatchObject({
      key,
      description: 'Create a protected Resource',
    });

    expect(permission.id).toEqual(expect.any(String));
    expect(permission.createdAt).toBeInstanceOf(Date);
    expect(permission.updatedAt).toBeInstanceOf(Date);
  });

  it('enforces Permission key uniqueness', async () => {
    const key = `permission.${randomUUID()}`;

    const firstPermission = await database.permission.create({
      data: {
        key,
        description: 'First permission',
      },
    });

    ownedPermissionIds.add(firstPermission.id);

    await expect(
      database.permission.create({
        data: {
          key,
          description: 'Second permission',
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('assigns a Role to an Actor', async () => {
    const actor = await createActor();
    const role = await createRole();

    const assignment = await database.actorRole.create({
      data: {
        actorId: actor.id,
        roleId: role.id,
      },
    });

    expect(assignment).toMatchObject({
      actorId: actor.id,
      roleId: role.id,
    });

    expect(assignment.assignedAt).toBeInstanceOf(Date);
  });

  it('prevents duplicate assignment of the same Role to one Actor', async () => {
    const actor = await createActor();
    const role = await createRole();

    await database.actorRole.create({
      data: {
        actorId: actor.id,
        roleId: role.id,
      },
    });

    await expect(
      database.actorRole.create({
        data: {
          actorId: actor.id,
          roleId: role.id,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('grants a Permission to a Role', async () => {
    const role = await createRole();
    const permission = await createPermission();

    const grant = await database.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    expect(grant).toMatchObject({
      roleId: role.id,
      permissionId: permission.id,
    });

    expect(grant.grantedAt).toBeInstanceOf(Date);
  });

  it('prevents duplicate grant of the same Permission to one Role', async () => {
    const role = await createRole();
    const permission = await createPermission();

    await database.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    await expect(
      database.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });

  it('rejects Role assignment for a missing Actor', async () => {
    const role = await createRole();

    await expect(
      database.actorRole.create({
        data: {
          actorId: randomUUID(),
          roleId: role.id,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2003',
    });
  });

  it('rejects Role assignment for a missing Role', async () => {
    const actor = await createActor();

    await expect(
      database.actorRole.create({
        data: {
          actorId: actor.id,
          roleId: randomUUID(),
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2003',
    });
  });

  it('rejects Permission grants when the Role or Permission does not exist', async () => {
    const role = await createRole();
    const permission = await createPermission();

    await expect(
      database.rolePermission.create({
        data: {
          roleId: randomUUID(),
          permissionId: permission.id,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2003',
    });

    await expect(
      database.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: randomUUID(),
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2003',
    });
  });

  it('cascades Actor deletion to ActorRole while preserving the Role', async () => {
    const actor = await createActor();
    const role = await createRole();

    await database.actorRole.create({
      data: {
        actorId: actor.id,
        roleId: role.id,
      },
    });

    await database.actor.delete({
      where: {
        id: actor.id,
      },
    });

    const assignment = await database.actorRole.findFirst({
      where: {
        actorId: actor.id,
        roleId: role.id,
      },
    });

    const preservedRole = await database.role.findUnique({
      where: {
        id: role.id,
      },
    });

    expect(assignment).toBeNull();
    expect(preservedRole).not.toBeNull();
  });

  it('cascades Role deletion to ActorRole and RolePermission while preserving Actor and Permission', async () => {
    const actor = await createActor();
    const role = await createRole();
    const permission = await createPermission();

    await database.actorRole.create({
      data: {
        actorId: actor.id,
        roleId: role.id,
      },
    });

    await database.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    await database.role.delete({
      where: {
        id: role.id,
      },
    });

    const actorRole = await database.actorRole.findFirst({
      where: {
        actorId: actor.id,
        roleId: role.id,
      },
    });

    const rolePermission = await database.rolePermission.findFirst({
      where: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    const preservedActor = await database.actor.findUnique({
      where: {
        id: actor.id,
      },
    });

    const preservedPermission = await database.permission.findUnique({
      where: {
        id: permission.id,
      },
    });

    expect(actorRole).toBeNull();
    expect(rolePermission).toBeNull();
    expect(preservedActor).not.toBeNull();
    expect(preservedPermission).not.toBeNull();
  });

  it('cascades Permission deletion to RolePermission while preserving the Role', async () => {
    const role = await createRole();
    const permission = await createPermission();

    await database.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    await database.permission.delete({
      where: {
        id: permission.id,
      },
    });

    const rolePermission = await database.rolePermission.findFirst({
      where: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    const preservedRole = await database.role.findUnique({
      where: {
        id: role.id,
      },
    });

    expect(rolePermission).toBeNull();
    expect(preservedRole).not.toBeNull();
  });

  it('keeps unrelated authorization rows intact when another Actor is deleted', async () => {
    const firstActor = await createActor();
    const secondActor = await createActor();

    const firstRole = await createRole();
    const secondRole = await createRole();

    const firstPermission = await createPermission();
    const secondPermission = await createPermission();

    await database.actorRole.createMany({
      data: [
        {
          actorId: firstActor.id,
          roleId: firstRole.id,
        },
        {
          actorId: secondActor.id,
          roleId: secondRole.id,
        },
      ],
    });

    await database.rolePermission.createMany({
      data: [
        {
          roleId: firstRole.id,
          permissionId: firstPermission.id,
        },
        {
          roleId: secondRole.id,
          permissionId: secondPermission.id,
        },
      ],
    });

    await database.actor.delete({
      where: {
        id: firstActor.id,
      },
    });

    const deletedActorAssignment = await database.actorRole.findFirst({
      where: {
        actorId: firstActor.id,
        roleId: firstRole.id,
      },
    });

    const unrelatedActorAssignment = await database.actorRole.findFirst({
      where: {
        actorId: secondActor.id,
        roleId: secondRole.id,
      },
    });

    const firstRolePermission = await database.rolePermission.findFirst({
      where: {
        roleId: firstRole.id,
        permissionId: firstPermission.id,
      },
    });

    const secondRolePermission = await database.rolePermission.findFirst({
      where: {
        roleId: secondRole.id,
        permissionId: secondPermission.id,
      },
    });

    expect(deletedActorAssignment).toBeNull();

    expect(unrelatedActorAssignment).toMatchObject({
      actorId: secondActor.id,
      roleId: secondRole.id,
    });

    expect(firstRolePermission).toMatchObject({
      roleId: firstRole.id,
      permissionId: firstPermission.id,
    });

    expect(secondRolePermission).toMatchObject({
      roleId: secondRole.id,
      permissionId: secondPermission.id,
    });
  });
});
