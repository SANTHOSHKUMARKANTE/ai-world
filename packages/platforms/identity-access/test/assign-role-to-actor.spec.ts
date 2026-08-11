import { ApplicationError } from '@ai-world/foundation-errors';
import {
  AssignRoleToActor,
  type AssignActorRoleInput,
  type AssignActorRoleResult,
  type RoleAssignmentWriter,
} from '../src';
import { describe, expect, it } from 'vitest';

class FakeRoleAssignmentWriter implements RoleAssignmentWriter {
  readonly inputs: AssignActorRoleInput[] = [];

  constructor(private readonly result: AssignActorRoleResult) {}

  async assign(input: AssignActorRoleInput): Promise<AssignActorRoleResult> {
    this.inputs.push(input);

    return this.result;
  }
}

describe('AssignRoleToActor', () => {
  it('assigns the requested Role to the Actor', async () => {
    const writer = new FakeRoleAssignmentWriter('assigned');
    const useCase = new AssignRoleToActor(writer);

    await expect(
      useCase.execute({
        actorId: 'actor-1',
        roleKey: 'creator',
      }),
    ).resolves.toBeUndefined();

    expect(writer.inputs).toEqual([
      {
        actorId: 'actor-1',
        roleKey: 'creator',
      },
    ]);
  });

  it('treats an already assigned Role as an idempotent success', async () => {
    const writer = new FakeRoleAssignmentWriter('already_assigned');
    const useCase = new AssignRoleToActor(writer);

    await expect(
      useCase.execute({
        actorId: 'actor-1',
        roleKey: 'creator',
      }),
    ).resolves.toBeUndefined();
  });

  it('returns the canonical not-found failure when the Actor does not exist', async () => {
    const writer = new FakeRoleAssignmentWriter('actor_not_found');
    const useCase = new AssignRoleToActor(writer);

    const error = await useCase
      .execute({
        actorId: 'missing-actor',
        roleKey: 'creator',
      })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApplicationError);

    expect(error).toMatchObject({
      code: 'identity.authorization.actor_not_found',
      kind: 'not_found',
      publicMessage: 'Actor not found.',
    });
  });

  it('returns the canonical not-found failure when the Role does not exist', async () => {
    const writer = new FakeRoleAssignmentWriter('role_not_found');
    const useCase = new AssignRoleToActor(writer);

    const error = await useCase
      .execute({
        actorId: 'actor-1',
        roleKey: 'missing-role',
      })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApplicationError);

    expect(error).toMatchObject({
      code: 'identity.authorization.role_not_found',
      kind: 'not_found',
      publicMessage: 'Role not found.',
    });
  });
});
