import {
  EvaluatePermission,
  type EvaluateActorPermissionInput,
  type PermissionEvaluationReader,
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

describe('EvaluatePermission', () => {
  it('returns allowed when an assigned Role grants the Permission', async () => {
    const reader = new FakePermissionEvaluationReader(true);
    const useCase = new EvaluatePermission(reader);

    await expect(
      useCase.execute({
        actorId: 'actor-1',
        permissionKey: 'knowledge.resource.create',
      }),
    ).resolves.toEqual({
      allowed: true,
    });

    expect(reader.inputs).toEqual([
      {
        actorId: 'actor-1',
        permissionKey: 'knowledge.resource.create',
      },
    ]);
  });

  it('returns denied when the Actor has no matching Permission grant', async () => {
    const reader = new FakePermissionEvaluationReader(false);
    const useCase = new EvaluatePermission(reader);

    await expect(
      useCase.execute({
        actorId: 'actor-1',
        permissionKey: 'knowledge.resource.create',
      }),
    ).resolves.toEqual({
      allowed: false,
    });
  });
});
