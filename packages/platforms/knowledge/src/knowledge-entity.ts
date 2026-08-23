import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { KnowledgeResource } from './knowledge-resource';

export interface KnowledgeEntityFact {
  readonly key: NamespacedKey;
  readonly label: string;
  readonly value: string;
}

export interface KnowledgeEntityProfile {
  readonly knowledgeResourceId: ResourceId;
  readonly routeKey: string;
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
  readonly facts: readonly KnowledgeEntityFact[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface KnowledgeEntityRelationTarget {
  readonly resource: KnowledgeResource;
  readonly profile: KnowledgeEntityProfile;
  readonly previewAssetId: ResourceId | null;
}

export interface KnowledgeEntityRelation {
  readonly sectionKey: NamespacedKey;
  readonly relationshipType: NamespacedKey;
  readonly position: number;
  readonly target: KnowledgeEntityRelationTarget;
}

export interface PublicKnowledgeEntity {
  readonly resource: KnowledgeResource;
  readonly profile: KnowledgeEntityProfile;
  readonly assetIds: readonly ResourceId[];
  readonly relations: readonly KnowledgeEntityRelation[];
}
