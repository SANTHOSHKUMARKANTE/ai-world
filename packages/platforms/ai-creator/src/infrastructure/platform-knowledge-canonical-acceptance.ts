import {
  CreateKnowledgeResourceAsActor,
  type KnowledgeResource,
} from '@ai-world/platform-knowledge';

import type {
  KnowledgeCanonicalAcceptanceInput,
  KnowledgeCanonicalAcceptanceOwner,
} from '../review-and-accept-generation-as-knowledge-resource';

export class PlatformKnowledgeCanonicalAcceptance implements KnowledgeCanonicalAcceptanceOwner {
  constructor(private readonly createKnowledgeResourceAsActor: CreateKnowledgeResourceAsActor) {}

  async accept(input: KnowledgeCanonicalAcceptanceInput): Promise<KnowledgeResource> {
    return this.createKnowledgeResourceAsActor.execute({
      actingActorId: input.reviewedByActorId,
      universeKey: input.universeKey,
      resourceType: input.candidateResourceType,
    });
  }
}
