import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import {
  AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_INSTRUCTIONS,
  AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
  GENERATION_FAILED_STATUS,
  GENERATION_SUCCEEDED_STATUS,
  SuggestKnowledgeResourceCandidate,
  type Generation,
  type GenerateTextWithAuthorizedContextInput,
} from '../src';

function generation(
  input: {
    readonly status?: Generation['status'];
    readonly text?: string | null;
  } = {},
): Generation {
  const now = new Date('2026-08-20T00:00:00.000Z');
  const status = input.status ?? GENERATION_SUCCEEDED_STATUS;

  return {
    id: generateResourceId(),
    actorId: generateResourceId(),
    status,
    provider: 'provider.test',
    model: status === GENERATION_SUCCEEDED_STATUS ? 'model.actual' : null,
    request: {
      input: 'Suggest a Knowledge Resource type.',
      createdAt: now,
    },
    result:
      input.text === null || status !== GENERATION_SUCCEEDED_STATUS
        ? null
        : {
            text: input.text ?? 'assistance.suggested-type',
            createdAt: now,
          },
    provenance: {
      task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
      sourceContext: null,
      createdAt: now,
    },
    createdAt: now,
    updatedAt: now,
  };
}

describe('SuggestKnowledgeResourceCandidate', () => {
  it('uses authorized context and returns typed structured candidate data', async () => {
    const actorId = generateResourceId();
    const universeKey = parseNamespacedKey('assistance.test');
    const calls: GenerateTextWithAuthorizedContextInput[] = [];

    const generated = generation({
      text: ' assistance.suggested-type\n',
    });

    const useCase = new SuggestKnowledgeResourceCandidate({
      async execute(input) {
        calls.push(input);
        return generated;
      },
    });

    const result = await useCase.execute({
      actorId,
      universeKey,
      request: 'Suggest the best Resource type for this creator draft.',
      contextQuery: 'temple',
      contextResourceTypes: [parseNamespacedKey('assistance.context')],
      contextLimit: 3,
    });

    expect(calls).toEqual([
      {
        actorId,
        universeKey,
        input: 'Suggest the best Resource type for this creator draft.',
        instructions: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_INSTRUCTIONS,
        task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
        contextQuery: 'temple',
        contextResourceTypes: [parseNamespacedKey('assistance.context')],
        contextLimit: 3,
      },
    ]);

    expect(result).toEqual({
      generation: generated,
      candidate: {
        universeKey,
        resourceType: parseNamespacedKey('assistance.suggested-type'),
      },
    });
  });

  it('rejects invalid structured candidate output', async () => {
    const useCase = new SuggestKnowledgeResourceCandidate({
      async execute() {
        return generation({
          text: 'Suggested: assistance.suggested-type',
        });
      },
    });

    await expect(
      useCase.execute({
        actorId: generateResourceId(),
        universeKey: parseNamespacedKey('assistance.test'),
        request: 'Suggest one type.',
        contextQuery: 'context',
      }),
    ).rejects.toMatchObject({
      name: 'AiCreatorAssistanceError',
      code: 'INVALID_CANDIDATE',
    });
  });

  it('fails closed when the delegated Generation did not succeed', async () => {
    const useCase = new SuggestKnowledgeResourceCandidate({
      async execute() {
        return generation({
          status: GENERATION_FAILED_STATUS,
          text: null,
        });
      },
    });

    await expect(
      useCase.execute({
        actorId: generateResourceId(),
        universeKey: parseNamespacedKey('assistance.test'),
        request: 'Suggest one type.',
        contextQuery: 'context',
      }),
    ).rejects.toMatchObject({
      code: 'GENERATION_NOT_SUCCEEDED',
    });
  });

  it('fails closed on an inconsistent successful Generation without a result', async () => {
    const inconsistent = generation();
    const withoutResult: Generation = {
      ...inconsistent,
      result: null,
    };

    const useCase = new SuggestKnowledgeResourceCandidate({
      async execute() {
        return withoutResult;
      },
    });

    await expect(
      useCase.execute({
        actorId: generateResourceId(),
        universeKey: parseNamespacedKey('assistance.test'),
        request: 'Suggest one type.',
        contextQuery: 'context',
      }),
    ).rejects.toMatchObject({
      code: 'GENERATION_RESULT_MISSING',
    });
  });
});
