import type { ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey, type NamespacedKey } from '@ai-world/kernel-namespace';

import { GENERATION_SUCCEEDED_STATUS, type Generation } from './generation';
import type { GenerateTextWithAuthorizedContext } from './generate-text-with-authorized-context';

export const AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK =
  'ai.creator.knowledge-resource-candidate' as const;

export const AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_INSTRUCTIONS = [
  'Create structured candidate data for a Knowledge Resource.',
  'Return exactly one Knowledge Resource type as a namespaced key.',
  'Return only the namespaced key.',
  'Do not return prose, Markdown, JSON, code fences, or multiple candidates.',
].join(' ');

export type AiCreatorAssistanceErrorCode =
  'GENERATION_NOT_SUCCEEDED' | 'GENERATION_RESULT_MISSING' | 'INVALID_CANDIDATE';

export class AiCreatorAssistanceError extends Error {
  constructor(
    readonly code: AiCreatorAssistanceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AiCreatorAssistanceError';
  }
}

export interface SuggestKnowledgeResourceCandidateInput {
  readonly actorId: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly request: string;
  readonly contextQuery: string;
  readonly contextResourceTypes?: readonly NamespacedKey[];
  readonly contextLimit?: number;
}

export interface KnowledgeResourceCandidate {
  readonly universeKey: NamespacedKey;
  readonly resourceType: NamespacedKey;
}

export interface SuggestKnowledgeResourceCandidateResult {
  readonly generation: Generation;
  readonly candidate: KnowledgeResourceCandidate;
}

type AuthorizedContextGenerator = Pick<GenerateTextWithAuthorizedContext, 'execute'>;

export class SuggestKnowledgeResourceCandidate {
  constructor(private readonly generateWithContext: AuthorizedContextGenerator) {}

  async execute(
    input: SuggestKnowledgeResourceCandidateInput,
  ): Promise<SuggestKnowledgeResourceCandidateResult> {
    const generation = await this.generateWithContext.execute({
      actorId: input.actorId,
      universeKey: input.universeKey,
      input: input.request,
      instructions: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_INSTRUCTIONS,
      task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
      contextQuery: input.contextQuery,
      ...(input.contextResourceTypes === undefined
        ? {}
        : { contextResourceTypes: input.contextResourceTypes }),
      ...(input.contextLimit === undefined ? {} : { contextLimit: input.contextLimit }),
    });

    if (generation.status !== GENERATION_SUCCEEDED_STATUS) {
      throw new AiCreatorAssistanceError(
        'GENERATION_NOT_SUCCEEDED',
        'AI Creator assistance requires a successful Generation.',
      );
    }

    if (!generation.result) {
      throw new AiCreatorAssistanceError(
        'GENERATION_RESULT_MISSING',
        'Successful AI Creator assistance Generation is missing its result.',
      );
    }

    let resourceType: NamespacedKey;

    try {
      resourceType = parseNamespacedKey(generation.result.text.trim());
    } catch {
      throw new AiCreatorAssistanceError(
        'INVALID_CANDIDATE',
        'AI Creator assistance returned an invalid Knowledge Resource candidate.',
      );
    }

    return {
      generation,
      candidate: {
        universeKey: input.universeKey,
        resourceType,
      },
    };
  }
}
