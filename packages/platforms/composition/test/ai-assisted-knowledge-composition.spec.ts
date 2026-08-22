import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
  GENERATION_SUCCEEDED_STATUS,
  type Generation,
} from '@ai-world/platform-ai-creator';
import { describe, expect, it, vi } from 'vitest';

import { AiAssistedKnowledgeComposition } from '../src';

const ACTOR_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const OTHER_ACTOR_ID = parseResourceId('22222222-2222-4222-8222-222222222222');
const GENERATION_ID = parseResourceId('33333333-3333-4333-8333-333333333333');
const RESOURCE_ID = parseResourceId('44444444-4444-4444-8444-444444444444');
const UNIVERSE_KEY = parseNamespacedKey('universe.devotional');
const RESOURCE_TYPE = parseNamespacedKey('devotional.temple');
const CREATED_AT = new Date('2026-08-22T12:00:00.000Z');

function generation(overrides: Partial<Generation> = {}): Generation {
  return {
    id: GENERATION_ID,
    actorId: ACTOR_ID,
    status: GENERATION_SUCCEEDED_STATUS,
    provider: 'provider.test',
    model: 'model.test',
    request: { input: 'Suggest a Resource type.', createdAt: CREATED_AT },
    result: { text: RESOURCE_TYPE, createdAt: CREATED_AT },
    provenance: {
      task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
      sourceContext: { universeKey: UNIVERSE_KEY, knowledgeResources: [] },
      createdAt: CREATED_AT,
    },
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    ...overrides,
  };
}

function createSubject(candidateGeneration = generation()) {
  const suggestions = {
    execute: vi.fn().mockResolvedValue({
      generation: candidateGeneration,
      candidate: { universeKey: UNIVERSE_KEY, resourceType: RESOURCE_TYPE },
    }),
  };
  const generations = { findById: vi.fn().mockResolvedValue(candidateGeneration) };
  const acceptance = {
    execute: vi.fn().mockResolvedValue({
      generationId: GENERATION_ID,
      reviewedByActorId: ACTOR_ID,
      canonicalOwner: 'knowledge' as const,
      canonicalResource: {
        id: RESOURCE_ID,
        universeKey: UNIVERSE_KEY,
        resourceType: RESOURCE_TYPE,
        lifecycle: 'DRAFT' as const,
        createdAt: CREATED_AT,
        updatedAt: CREATED_AT,
      },
    }),
  };

  return {
    subject: new AiAssistedKnowledgeComposition(suggestions, generations, acceptance),
    suggestions,
    generations,
    acceptance,
  };
}

describe('AiAssistedKnowledgeComposition', () => {
  it('returns a non-canonical suggestion through the AI / Creator public contract', async () => {
    const { subject, suggestions, acceptance } = createSubject();

    await expect(
      subject.suggest({
        actingActorId: ACTOR_ID,
        universeKey: UNIVERSE_KEY,
        request: 'Suggest a Resource type.',
        contextQuery: 'temple',
      }),
    ).resolves.toEqual({
      generationId: GENERATION_ID,
      universeKey: UNIVERSE_KEY,
      resourceType: RESOURCE_TYPE,
      createdAt: CREATED_AT,
    });

    expect(suggestions.execute).toHaveBeenCalledWith({
      actorId: ACTOR_ID,
      universeKey: UNIVERSE_KEY,
      request: 'Suggest a Resource type.',
      contextQuery: 'temple',
    });
    expect(acceptance.execute).not.toHaveBeenCalled();
  });

  it('derives the canonical acceptance Universe from persisted Generation provenance', async () => {
    const { subject, acceptance } = createSubject();

    await expect(
      subject.accept({ actingActorId: ACTOR_ID, generationId: GENERATION_ID }),
    ).resolves.toMatchObject({
      generationId: GENERATION_ID,
      canonicalResource: { id: RESOURCE_ID, lifecycle: 'DRAFT' },
    });

    expect(acceptance.execute).toHaveBeenCalledWith({
      generationId: GENERATION_ID,
      reviewedByActorId: ACTOR_ID,
      universeKey: UNIVERSE_KEY,
    });
  });

  it.each([
    ['another Actor', generation({ actorId: OTHER_ACTOR_ID })],
    [
      'another AI task',
      generation({
        provenance: {
          task: 'ai.text-generation',
          sourceContext: { universeKey: UNIVERSE_KEY, knowledgeResources: [] },
          createdAt: CREATED_AT,
        },
      }),
    ],
    [
      'missing source scope',
      generation({
        provenance: {
          task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
          sourceContext: null,
          createdAt: CREATED_AT,
        },
      }),
    ],
  ])('rejects acceptance for %s without canonical mutation', async (_label, candidate) => {
    const { subject, acceptance } = createSubject(candidate);

    await expect(
      subject.accept({ actingActorId: ACTOR_ID, generationId: GENERATION_ID }),
    ).rejects.toBeInstanceOf(ApplicationError);
    expect(acceptance.execute).not.toHaveBeenCalled();
  });
});
