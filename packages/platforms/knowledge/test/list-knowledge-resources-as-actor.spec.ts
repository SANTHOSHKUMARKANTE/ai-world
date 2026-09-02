import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  EvaluatePermission,
  type PermissionEvaluationReader,
} from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import {
  ListKnowledgeResourcesAsActor,
  type CreatorKnowledgeResourceReader,
  type ListCreatorKnowledgeResourcesInput,
} from '../src';

class PermissionReader implements PermissionEvaluationReader {
  public constructor(private readonly allowed: boolean) {}

  public async hasPermission(): Promise<boolean> {
    return this.allowed;
  }
}

describe('ListKnowledgeResourcesAsActor', () => {
  it('lists recent resources inside the requested Universe for an editor', async () => {
    const inputs: ListCreatorKnowledgeResourcesInput[] = [];
    const reader: CreatorKnowledgeResourceReader = {
      async listForCreator(input) {
        inputs.push(input);
        return [];
      },
    };
    const useCase = new ListKnowledgeResourcesAsActor(
      new EvaluatePermission(new PermissionReader(true)),
      reader,
    );

    await expect(
      useCase.execute({ actingActorId: 'actor-1', universeKey: 'universe.anime' }),
    ).resolves.toEqual([]);
    expect(inputs).toEqual([{ universeKey: parseNamespacedKey('universe.anime'), limit: 50 }]);
  });

  it('denies listing before querying canonical Knowledge state', async () => {
    let queried = false;
    const reader: CreatorKnowledgeResourceReader = {
      async listForCreator() {
        queried = true;
        return [];
      },
    };
    const useCase = new ListKnowledgeResourcesAsActor(
      new EvaluatePermission(new PermissionReader(false)),
      reader,
    );

    await expect(
      useCase.execute({ actingActorId: 'actor-1', universeKey: 'INVALID UNIVERSE' }),
    ).rejects.toMatchObject({ code: 'knowledge.authorization.forbidden', kind: 'forbidden' });
    expect(queried).toBe(false);
  });
});
