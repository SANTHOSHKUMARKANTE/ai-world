import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_INITIAL_STATUS,
  GENERATION_SUCCEEDED_STATUS,
  KNOWLEDGE_CANONICAL_OWNER,
  ReviewAndAcceptGenerationAsKnowledgeResource,
  type Generation,
  type GenerationReader,
  type KnowledgeCanonicalAcceptanceOwner,
} from '../src';

function generation(
  status: Generation['status'],
  options: {
    readonly withResult?: boolean;
  } = {},
): Generation {
  const id = generateResourceId();
  const actorId = generateResourceId();
  const createdAt = new Date('2026-08-20T00:00:00.000Z');

  return {
    id,
    actorId,
    status,
    provider: 'provider.test',
    model: status === GENERATION_SUCCEEDED_STATUS ? 'model.actual' : null,
    request: {
      input: 'Suggest a canonical Knowledge Resource type.',
      createdAt,
    },
    result:
      options.withResult === false || status !== GENERATION_SUCCEEDED_STATUS
        ? null
        : {
            text: 'acceptance.resource',
            createdAt,
          },
    provenance: {
      task: 'ai.canonical-acceptance-proof',
      sourceContext: null,
      createdAt,
    },
    createdAt,
    updatedAt: createdAt,
  };
}

describe('ReviewAndAcceptGenerationAsKnowledgeResource', () => {
  it('keeps generated output non-canonical until explicit review/accept execution', async () => {
    const candidate = generation(GENERATION_SUCCEEDED_STATUS);
    const reviewedByActorId = generateResourceId();
    const calls: unknown[] = [];

    const reader: GenerationReader = {
      async findById(input) {
        expect(input).toEqual({ id: candidate.id });
        return candidate;
      },
    };

    const owner: KnowledgeCanonicalAcceptanceOwner = {
      async accept(input) {
        calls.push(input);

        return {
          id: generateResourceId(),
          universeKey: parseNamespacedKey('acceptance.test'),
          resourceType: parseNamespacedKey('acceptance.resource'),
          lifecycle: 'DRAFT',
          createdAt: new Date('2026-08-20T00:00:01.000Z'),
          updatedAt: new Date('2026-08-20T00:00:01.000Z'),
        };
      },
    };

    const useCase = new ReviewAndAcceptGenerationAsKnowledgeResource(reader, owner);

    expect(calls).toEqual([]);

    const result = await useCase.execute({
      generationId: candidate.id,
      reviewedByActorId,
      universeKey: 'acceptance.test',
    });

    expect(calls).toEqual([
      {
        reviewedByActorId,
        universeKey: 'acceptance.test',
        candidateResourceType: 'acceptance.resource',
      },
    ]);

    expect(result).toMatchObject({
      generationId: candidate.id,
      reviewedByActorId,
      canonicalOwner: KNOWLEDGE_CANONICAL_OWNER,
      canonicalResource: {
        universeKey: 'acceptance.test',
        resourceType: 'acceptance.resource',
        lifecycle: 'DRAFT',
      },
    });
  });

  it('fails closed when the Generation does not exist', async () => {
    let ownerCalled = false;

    const useCase = new ReviewAndAcceptGenerationAsKnowledgeResource(
      {
        async findById() {
          return null;
        },
      },
      {
        async accept() {
          ownerCalled = true;
          throw new Error('owner must not be called');
        },
      },
    );

    await expect(
      useCase.execute({
        generationId: generateResourceId(),
        reviewedByActorId: generateResourceId(),
        universeKey: 'acceptance.test',
      }),
    ).rejects.toMatchObject({
      code: 'GENERATION_NOT_FOUND',
    });

    expect(ownerCalled).toBe(false);
  });

  it.each([GENERATION_INITIAL_STATUS, GENERATION_FAILED_STATUS])(
    'rejects a %s Generation before canonical owner mutation',
    async (status) => {
      const candidate = generation(status);
      let ownerCalled = false;

      const useCase = new ReviewAndAcceptGenerationAsKnowledgeResource(
        {
          async findById() {
            return candidate;
          },
        },
        {
          async accept() {
            ownerCalled = true;
            throw new Error('owner must not be called');
          },
        },
      );

      await expect(
        useCase.execute({
          generationId: candidate.id,
          reviewedByActorId: generateResourceId(),
          universeKey: 'acceptance.test',
        }),
      ).rejects.toMatchObject({
        code: 'GENERATION_NOT_SUCCEEDED',
      });

      expect(ownerCalled).toBe(false);
    },
  );

  it('rejects an inconsistent successful Generation without a result', async () => {
    const candidate = generation(GENERATION_SUCCEEDED_STATUS, {
      withResult: false,
    });
    let ownerCalled = false;

    const useCase = new ReviewAndAcceptGenerationAsKnowledgeResource(
      {
        async findById() {
          return candidate;
        },
      },
      {
        async accept() {
          ownerCalled = true;
          throw new Error('owner must not be called');
        },
      },
    );

    await expect(
      useCase.execute({
        generationId: candidate.id,
        reviewedByActorId: generateResourceId(),
        universeKey: 'acceptance.test',
      }),
    ).rejects.toMatchObject({
      code: 'GENERATION_RESULT_MISSING',
    });

    expect(ownerCalled).toBe(false);
  });
});
