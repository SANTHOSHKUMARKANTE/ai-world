import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';
import type { AssetType } from '@ai-world/platform-media';

import type { KnowledgeResource } from './knowledge-resource';
import type {
  KnowledgeResourceMediaPlayback,
  KnowledgeResourceMediaRole,
} from './knowledge-resource-media-placement';

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

export interface PublicKnowledgeEntityMedia {
  readonly assetId: ResourceId;
  readonly assetType: AssetType;
  readonly mimeType: string;
  readonly role: KnowledgeResourceMediaRole;
  readonly playback: KnowledgeResourceMediaPlayback;
  readonly position: number;
  readonly altText: string | null;
  readonly caption: string | null;
  readonly width?: number;
  readonly height?: number;
  readonly durationMs?: number;
  readonly posterAssetId: ResourceId | null;
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
  readonly media: readonly PublicKnowledgeEntityMedia[];
  readonly relations: readonly KnowledgeEntityRelation[];
}
