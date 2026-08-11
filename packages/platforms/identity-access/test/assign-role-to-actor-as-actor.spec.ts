import { ApplicationError } from '@ai-world/foundation-errors';
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
import { describe, expect, it } from 'vitest';

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

describe('AssignRoleToActorAsActor', () => {
  it('authorizes the acting Actor before assigning the Role to the target Actor', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const roleWriter = new FakeRoleAssignmentWriter();

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
    );

    await expect(
      useCase.execute({
        actingActorId: 'administrator-actor',
        targetActorId: 'target-actor',
        roleKey: 'administrator',
      }),
    ).resolves.toBeUndefined();

    expect(permissionReader.inputs).toEqual([
      {
        actorId: 'administrator-actor',
        permissionKey: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
      },
    ]);

    expect(roleWriter.inputs).toEqual([
      {
        actorId: 'target-actor',
        roleKey: 'administrator',
      },
    ]);
  });

  it('returns forbidden and performs no Role assignment when the acting Actor lacks Permission', async () => {
    const permissionReader = new FakePermissionEvaluationReader(false);
    const roleWriter = new FakeRoleAssignmentWriter();

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
    );

    const error = await useCase
      .execute({
        actingActorId: 'ordinary-actor',
        targetActorId: 'target-actor',
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
        actorId: 'ordinary-actor',
        permissionKey: IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
      },
    ]);

    expect(roleWriter.inputs).toEqual([]);
  });

  it('does not expose a missing target Actor to an unauthorized acting Actor', async () => {
    const permissionReader = new FakePermissionEvaluationReader(false);
    const roleWriter = new FakeRoleAssignmentWriter('actor_not_found');

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
    );

    const error = await useCase
      .execute({
        actingActorId: 'ordinary-actor',
        targetActorId: 'missing-target-actor',
        roleKey: 'administrator',
      })
      .catch((caught: unknown) => caught);

    expect(error).toMatchObject({
      code: 'identity.authorization.forbidden',
      kind: 'forbidden',
    });

    expect(roleWriter.inputs).toEqual([]);
  });

  it('preserves canonical target not-found behavior after authorization succeeds', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const roleWriter = new FakeRoleAssignmentWriter('actor_not_found');

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
    );

    const error = await useCase
      .execute({
        actingActorId: 'administrator-actor',
        targetActorId: 'missing-target-actor',
        roleKey: 'administrator',
      })
      .catch((caught: unknown) => caught);

    expect(error).toMatchObject({
      code: 'identity.authorization.actor_not_found',
      kind: 'not_found',
      publicMessage: 'Actor not found.',
    });

    expect(roleWriter.inputs).toEqual([
      {
        actorId: 'missing-target-actor',
        roleKey: 'administrator',
      },
    ]);
  });

  it('preserves canonical Role not-found behavior after authorization succeeds', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const roleWriter = new FakeRoleAssignmentWriter('role_not_found');

    const useCase = new AssignRoleToActorAsActor(
      new EvaluatePermission(permissionReader),
      new AssignRoleToActor(roleWriter),
    );

    const error = await useCase
      .execute({
        actingActorId: 'administrator-actor',
        targetActorId: 'target-actor',
        roleKey: 'missing-role',
      })
      .catch((caught: unknown) => caught);

    expect(error).toMatchObject({
      code: 'identity.authorization.role_not_found',
      kind: 'not_found',
      publicMessage: 'Role not found.',
    });

    expect(roleWriter.inputs).toEqual([
      {
        actorId: 'target-actor',
        roleKey: 'missing-role',
      },
    ]);
  });
});
