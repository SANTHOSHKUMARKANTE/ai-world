import { ApplicationError } from '@ai-world/foundation-errors';
import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';
import {
  AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
  type GenerationReader,
  type ReviewAndAcceptGenerationAsKnowledgeResource,
  type SuggestKnowledgeResourceCandidate,
} from '@ai-world/platform-ai-creator';
import type { KnowledgeResource } from '@ai-world/platform-knowledge';

export interface SuggestAiAssistedKnowledgeCandidateInput {
  readonly actingActorId: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly request: string;
  readonly contextQuery: string;
  readonly contextResourceTypes?: readonly NamespacedKey[];
  readonly contextLimit?: number;
}

export interface AiAssistedKnowledgeCandidate {
  readonly generationId: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly resourceType: NamespacedKey;
  readonly createdAt: Date;
}

export interface AcceptAiAssistedKnowledgeCandidateInput {
  readonly actingActorId: ResourceId;
  readonly generationId: ResourceId;
}

export interface AcceptedAiAssistedKnowledgeCandidate {
  readonly generationId: ResourceId;
  readonly canonicalResource: KnowledgeResource;
}

type KnowledgeCandidateSuggester = Pick<SuggestKnowledgeResourceCandidate, 'execute'>;
type KnowledgeCandidateAcceptor = Pick<ReviewAndAcceptGenerationAsKnowledgeResource, 'execute'>;

function unavailableCandidate(): ApplicationError {
  return new ApplicationError({
    code: 'composition.ai_assistance.candidate_not_found',
    kind: 'not_found',
    message:
      'The AI-assisted Knowledge candidate was not found for the acting Actor or was not created by the supported assistance task.',
    publicMessage: 'The requested AI-assisted Knowledge candidate was not found.',
  });
}

/**
 * Composition-owned orchestration for the CMS review boundary.
 *
 * AI / Creator remains the owner of Generation and suggestion semantics. This
 * use case derives acceptance scope from persisted Generation provenance so a
 * client cannot substitute another Actor, task, or Universe during acceptance.
 */
export class AiAssistedKnowledgeComposition {
  constructor(
    private readonly suggestions: KnowledgeCandidateSuggester,
    private readonly generations: GenerationReader,
    private readonly acceptance: KnowledgeCandidateAcceptor,
  ) {}

  async suggest(
    input: SuggestAiAssistedKnowledgeCandidateInput,
  ): Promise<AiAssistedKnowledgeCandidate> {
    const result = await this.suggestions.execute({
      actorId: input.actingActorId,
      universeKey: input.universeKey,
      request: input.request,
      contextQuery: input.contextQuery,
      ...(input.contextResourceTypes === undefined
        ? {}
        : { contextResourceTypes: input.contextResourceTypes }),
      ...(input.contextLimit === undefined ? {} : { contextLimit: input.contextLimit }),
    });

    return {
      generationId: result.generation.id,
      universeKey: result.candidate.universeKey,
      resourceType: result.candidate.resourceType,
      createdAt: result.generation.createdAt,
    };
  }

  async accept(
    input: AcceptAiAssistedKnowledgeCandidateInput,
  ): Promise<AcceptedAiAssistedKnowledgeCandidate> {
    const generation = await this.generations.findById({ id: input.generationId });
    const sourceContext = generation?.provenance?.sourceContext;

    if (
      !generation ||
      generation.actorId !== input.actingActorId ||
      generation.provenance?.task !== AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK ||
      !sourceContext
    ) {
      throw unavailableCandidate();
    }

    const accepted = await this.acceptance.execute({
      generationId: generation.id,
      reviewedByActorId: input.actingActorId,
      universeKey: sourceContext.universeKey,
    });

    return {
      generationId: accepted.generationId,
      canonicalResource: accepted.canonicalResource,
    };
  }
}
