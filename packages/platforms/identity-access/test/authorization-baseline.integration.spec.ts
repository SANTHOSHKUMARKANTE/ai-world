import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ADMINISTRATOR_ROLE_KEY, IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY } from '../src';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is required for Identity & Access authorization baseline integration tests.',
  );
}

describe('authorization baseline', () => {
  let database: DatabaseClient;

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: databaseUrl,
    });
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it('provides the canonical Administrator Role', async () => {
    const role = await database.role.findUnique({
      where: {
        key: ADMINISTRATOR_ROLE_KEY,
      },
    });

    expect(role).toMatchObject({
      key: ADMINISTRATOR_ROLE_KEY,
      name: 'Administrator',
    });
  });

  it('provides the canonical authorization-management Permission', async () => {
    const permission = await database.permission.findUnique({
      where: {
        key: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
      },
    });

    expect(permission).toMatchObject({
      key: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
      description: 'Manage Identity and Access authorization assignments.',
    });
  });

  it('grants authorization management to the Administrator Role', async () => {
    const grant = await database.rolePermission.findFirst({
      where: {
        role: {
          key: ADMINISTRATOR_ROLE_KEY,
        },
        permission: {
          key: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
        },
      },
      select: {
        roleId: true,
        permissionId: true,
        grantedAt: true,
      },
    });

    expect(grant).not.toBeNull();
    expect(grant?.grantedAt).toBeInstanceOf(Date);
  });
});
