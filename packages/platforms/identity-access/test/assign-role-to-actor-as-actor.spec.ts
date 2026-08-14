import { ApplicationError } from '@ai-world/foundation-errors';
import type { AuditRecorder, RecordAuditInput } from '@ai-world/kernel-audit';
import { describe, expect, it } from 'vitest';

import {
  AssignRoleToActor,
  AssignRoleToActorAsActor,
  EvaluatePermission,
  IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
  type AssignActorRoleInput,
  type AssignActorRoleResult,
  type EvaluateActorPermissionInput,
  type PermissionEvaluationReader,
  type RoleAssignmentWriter,
} from '../src';

const ADMINISTRATOR_ACTOR_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const ORDINARY_ACTOR_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const TARGET_ACTOR_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const MISSING_TARGET_ACTOR_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

class FakePermissionEvaluationReader implements PermissionEvaluationReader {
  readonly inputs: EvaluateActorPermissionInput[] = [];

  constructor(private readonly allowed: boolean) {}

  async hasPermission(input: EvaluateActorPermissionInput): Promise<boolean> {
    this.inputs.push(input);

    return this.allowed;
  }
}

class FakeRoleAssignmentWriter implements RoleAssignmentWriter {
  readonly inputs: AssignActorRoleInput[] = [];

  constructor(private readonly result: AssignActorRoleResult = 'assigned') {}

  async assign(input: AssignActorRoleInput): Promise<AssignActorRoleResult> {
    this.inputs.push(input);

    return this.result;
  }
}

class FakeAuditRecorder implements AuditRecorder {
  readonly inputs: RecordAuditInput[] = [];

  constructor(private readonly failure?: Error) {}

  async record(input: RecordAuditInput): Promise<void> {
    this.inputs.push(input);

    if (this.failure) {
      throw this.failure;
    }
  }
}

describe('AssignRoleToActorAsActor', () => {
  it('audits an allowed authorization decision before assigning the Role', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const roleWriter = new FakeRoleAssignmentWriter();
    const auditRecorder = new FakeAuditRecorder();

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
      auditRecorder,
    );

    await expect(
      useCase.execute({
        actingActorId: ADMINISTRATOR_ACTOR_ID,
        targetActorId: TARGET_ACTOR_ID,
        roleKey: 'administrator',
      }),
    ).resolves.toBeUndefined();

    expect(permissionReader.inputs).toEqual([
      {
        actorId: ADMINISTRATOR_ACTOR_ID,
        permissionKey: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
      },
    ]);

    expect(auditRecorder.inputs).toEqual([
      {
        actorId: ADMINISTRATOR_ACTOR_ID,
        action: 'identity.authorization.role-assignment.decision',
        resource: {
          type: 'identity.actor',
          id: TARGET_ACTOR_ID,
        },
        result: 'identity.authorization.allowed',
        context: {
          roleKey: 'administrator',
        },
      },
    ]);

    expect(roleWriter.inputs).toEqual([
      {
        actorId: TARGET_ACTOR_ID,
        roleKey: 'administrator',
      },
    ]);
  });

  it('audits a denied authorization decision and performs no Role assignment', async () => {
    const permissionReader = new FakePermissionEvaluationReader(false);
    const roleWriter = new FakeRoleAssignmentWriter();
    const auditRecorder = new FakeAuditRecorder();

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
      auditRecorder,
    );

    const error = await useCase
      .execute({
        actingActorId: ORDINARY_ACTOR_ID,
        targetActorId: TARGET_ACTOR_ID,
        roleKey: 'administrator',
      })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApplicationError);

    expect(error).toMatchObject({
      code: 'identity.authorization.forbidden',
      kind: 'forbidden',
      publicMessage: 'You do not have permission to perform this action.',
    });

    expect(permissionReader.inputs).toEqual([
      {
        actorId: ORDINARY_ACTOR_ID,
        permissionKey: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
      },
    ]);

    expect(auditRecorder.inputs).toEqual([
      {
        actorId: ORDINARY_ACTOR_ID,
        action: 'identity.authorization.role-assignment.decision',
        resource: {
          type: 'identity.actor',
          id: TARGET_ACTOR_ID,
        },
        result: 'identity.authorization.denied',
        context: {
          roleKey: 'administrator',
        },
      },
    ]);

    expect(roleWriter.inputs).toEqual([]);
  });

  it('does not expose a missing target Actor to an unauthorized acting Actor', async () => {
    const permissionReader = new FakePermissionEvaluationReader(false);
    const roleWriter = new FakeRoleAssignmentWriter('actor_not_found');
    const auditRecorder = new FakeAuditRecorder();

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
      auditRecorder,
    );

    const error = await useCase
      .execute({
        actingActorId: ORDINARY_ACTOR_ID,
        targetActorId: MISSING_TARGET_ACTOR_ID,
        roleKey: 'administrator',
      })
      .catch((caught: unknown) => caught);

    expect(error).toMatchObject({
      code: 'identity.authorization.forbidden',
      kind: 'forbidden',
    });

    expect(auditRecorder.inputs).toEqual([
      {
        actorId: ORDINARY_ACTOR_ID,
        action: 'identity.authorization.role-assignment.decision',
        resource: {
          type: 'identity.actor',
          id: MISSING_TARGET_ACTOR_ID,
        },
        result: 'identity.authorization.denied',
        context: {
          roleKey: 'administrator',
        },
      },
    ]);

    expect(roleWriter.inputs).toEqual([]);
  });

  it('preserves canonical target not-found behavior after an allowed authorization decision', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const roleWriter = new FakeRoleAssignmentWriter('actor_not_found');
    const auditRecorder = new FakeAuditRecorder();

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
      auditRecorder,
    );

    const error = await useCase
      .execute({
        actingActorId: ADMINISTRATOR_ACTOR_ID,
        targetActorId: MISSING_TARGET_ACTOR_ID,
        roleKey: 'administrator',
      })
      .catch((caught: unknown) => caught);

    expect(error).toMatchObject({
      code: 'identity.authorization.actor_not_found',
      kind: 'not_found',
      publicMessage: 'Actor not found.',
    });

    expect(auditRecorder.inputs).toEqual([
      {
        actorId: ADMINISTRATOR_ACTOR_ID,
        action: 'identity.authorization.role-assignment.decision',
        resource: {
          type: 'identity.actor',
          id: MISSING_TARGET_ACTOR_ID,
        },
        result: 'identity.authorization.allowed',
        context: {
          roleKey: 'administrator',
        },
      },
    ]);

    expect(roleWriter.inputs).toEqual([
      {
        actorId: MISSING_TARGET_ACTOR_ID,
        roleKey: 'administrator',
      },
    ]);
  });

  it('preserves canonical Role not-found behavior after an allowed authorization decision', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const roleWriter = new FakeRoleAssignmentWriter('role_not_found');
    const auditRecorder = new FakeAuditRecorder();

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
      auditRecorder,
    );

    const error = await useCase
      .execute({
        actingActorId: ADMINISTRATOR_ACTOR_ID,
        targetActorId: TARGET_ACTOR_ID,
        roleKey: 'missing-role',
      })
      .catch((caught: unknown) => caught);

    expect(error).toMatchObject({
      code: 'identity.authorization.role_not_found',
      kind: 'not_found',
      publicMessage: 'Role not found.',
    });

    expect(auditRecorder.inputs).toEqual([
      {
        actorId: ADMINISTRATOR_ACTOR_ID,
        action: 'identity.authorization.role-assignment.decision',
        resource: {
          type: 'identity.actor',
          id: TARGET_ACTOR_ID,
        },
        result: 'identity.authorization.allowed',
        context: {
          roleKey: 'missing-role',
        },
      },
    ]);

    expect(roleWriter.inputs).toEqual([
      {
        actorId: TARGET_ACTOR_ID,
        roleKey: 'missing-role',
      },
    ]);
  });

  it('does not perform the privileged mutation when required Audit persistence fails', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const roleWriter = new FakeRoleAssignmentWriter();
    const auditFailure = new Error('Audit persistence unavailable.');
    const auditRecorder = new FakeAuditRecorder(auditFailure);

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
      auditRecorder,
    );

    await expect(
      useCase.execute({
        actingActorId: ADMINISTRATOR_ACTOR_ID,
        targetActorId: TARGET_ACTOR_ID,
        roleKey: 'administrator',
      }),
    ).rejects.toBe(auditFailure);

    expect(auditRecorder.inputs).toHaveLength(1);
    expect(roleWriter.inputs).toEqual([]);
  });
});
