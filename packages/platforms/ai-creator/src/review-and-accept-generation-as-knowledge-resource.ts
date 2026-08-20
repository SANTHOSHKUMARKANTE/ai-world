import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { KnowledgeResource } from '@ai-world/platform-knowledge';

import { GENERATION_SUCCEEDED_STATUS } from './generation';
import type { GenerationReader } from './generation-reader';

export const KNOWLEDGE_CANONICAL_OWNER = 'knowledge' as const;

export type GenerationCanonicalAcceptanceErrorCode =
  'GENERATION_NOT_FOUND' | 'GENERATION_NOT_SUCCEEDED' | 'GENERATION_RESULT_MISSING';

export class GenerationCanonicalAcceptanceError extends Error {
  constructor(
    readonly code: GenerationCanonicalAcceptanceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'GenerationCanonicalAcceptanceError';
  }
}

export interface KnowledgeCanonicalAcceptanceInput {
  readonly reviewedByActorId: ResourceId;
  readonly universeKey: string;
  readonly candidateResourceType: string;
}

export interface KnowledgeCanonicalAcceptanceOwner {
  accept(input: KnowledgeCanonicalAcceptanceInput): Promise<KnowledgeResource>;
}

export interface ReviewAndAcceptGenerationAsKnowledgeResourceInput {
  readonly generationId: ResourceId;
  readonly reviewedByActorId: ResourceId;
  readonly universeKey: string;
}

export interface ReviewAndAcceptGenerationAsKnowledgeResourceResult {
  readonly generationId: ResourceId;
  readonly reviewedByActorId: ResourceId;
  readonly canonicalOwner: typeof KNOWLEDGE_CANONICAL_OWNER;
  readonly canonicalResource: KnowledgeResource;
}

export class ReviewAndAcceptGenerationAsKnowledgeResource {
  constructor(
    private readonly generations: GenerationReader,
    private readonly knowledgeOwner: KnowledgeCanonicalAcceptanceOwner,
  ) {}

  async execute(
    input: ReviewAndAcceptGenerationAsKnowledgeResourceInput,
  ): Promise<ReviewAndAcceptGenerationAsKnowledgeResourceResult> {
    const generation = await this.generations.findById({
      id: input.generationId,
    });

    if (!generation) {
      throw new GenerationCanonicalAcceptanceError(
        'GENERATION_NOT_FOUND',
        'Generation does not exist.',
      );
    }

    if (generation.status !== GENERATION_SUCCEEDED_STATUS) {
      throw new GenerationCanonicalAcceptanceError(
        'GENERATION_NOT_SUCCEEDED',
        'Only a successful Generation can enter canonical acceptance.',
      );
    }

    if (!generation.result) {
      throw new GenerationCanonicalAcceptanceError(
        'GENERATION_RESULT_MISSING',
        'Successful Generation is missing its candidate result.',
      );
    }

    const canonicalResource = await this.knowledgeOwner.accept({
      reviewedByActorId: input.reviewedByActorId,
      universeKey: input.universeKey,
      candidateResourceType: generation.result.text,
    });

    return {
      generationId: generation.id,
      reviewedByActorId: input.reviewedByActorId,
      canonicalOwner: KNOWLEDGE_CANONICAL_OWNER,
      canonicalResource,
    };
  }
}
