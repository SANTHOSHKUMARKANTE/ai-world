import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type {
  KnowledgeEntityFact,
  KnowledgeEntityProfile,
  PublicKnowledgeEntity,
} from './knowledge-entity';

export interface FindKnowledgeEntityRouteOwnerInput {
  readonly routeKey: string;
}

export interface FindPublishedKnowledgeEntityByRouteKeyInput {
  readonly routeKey: string;
}

export interface KnowledgeEntityRelationRecordInput {
  readonly targetResourceId: ResourceId;
  readonly sectionKey: NamespacedKey;
  readonly relationshipType: NamespacedKey;
  readonly position: number;
}

export interface ReplaceKnowledgeEntityConfigurationInput {
  readonly knowledgeResourceId: ResourceId;
  readonly routeKey: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName: string | null;
  readonly alternateNames: readonly string[];
  readonly summary: string;
  readonly overview: string | null;
  readonly facts: readonly KnowledgeEntityFact[];
  readonly relations: readonly KnowledgeEntityRelationRecordInput[];
}

export interface KnowledgeEntityStore {
  findRouteOwner(input: FindKnowledgeEntityRouteOwnerInput): Promise<ResourceId | null>;

  replaceConfiguration(
    input: ReplaceKnowledgeEntityConfigurationInput,
  ): Promise<KnowledgeEntityProfile>;

  findPublishedByRouteKey(
    input: FindPublishedKnowledgeEntityByRouteKeyInput,
  ): Promise<PublicKnowledgeEntity | null>;
}
