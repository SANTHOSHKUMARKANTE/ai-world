import { ApplicationError } from '@ai-world/foundation-errors';
import type { ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey, type NamespacedKey } from '@ai-world/kernel-namespace';
import type { AssetType } from '@ai-world/platform-media';

import {
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type KnowledgeResource,
} from './knowledge-resource';
import type { KnowledgeResourceMediaPlayback } from './knowledge-resource-media-placement';
import type { PublicKnowledgeDiscoveryReader } from './public-knowledge-discovery-reader';

export const PUBLIC_KNOWLEDGE_DISCOVERY_DEFAULT_LIMIT = 20;
export const PUBLIC_KNOWLEDGE_DISCOVERY_MAX_LIMIT = 50;

export interface ListPublicKnowledgeDiscoveryInput {
  readonly universeKey: string;
  readonly resourceType?: string | undefined;
  readonly limit?: number | undefined;
}

export interface PublicKnowledgeDiscoveryPreview {
  readonly assetId: ResourceId;
  readonly assetType: AssetType;
  readonly mimeType: string;
  readonly playback: KnowledgeResourceMediaPlayback;
  readonly posterAssetId: ResourceId | null;
  readonly altText: string | null;
}

export interface PublicKnowledgeDiscoveryItem {
  readonly resourceId: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly resourceType: NamespacedKey;
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
  readonly updatedAt: Date;
  readonly previewMedia: PublicKnowledgeDiscoveryPreview | null;
}

function invalidPublicQuery(message: string): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.public.invalid_query',
    kind: 'validation',
    message,
    publicMessage: 'The public Knowledge query is invalid.',
  });
}

function parsePublicKey(value: string, field: string): NamespacedKey {
  try {
    return parseNamespacedKey(value);
  } catch {
    throw invalidPublicQuery(`Public Knowledge discovery contains an invalid ${field}.`);
  }
}

function parseLimit(value: number | undefined): number {
  if (value === undefined) {
    return PUBLIC_KNOWLEDGE_DISCOVERY_DEFAULT_LIMIT;
  }

  if (!Number.isInteger(value) || value < 1 || value > PUBLIC_KNOWLEDGE_DISCOVERY_MAX_LIMIT) {
    throw invalidPublicQuery(
      `Public Knowledge discovery limit must be an integer between 1 and ${PUBLIC_KNOWLEDGE_DISCOVERY_MAX_LIMIT}.`,
    );
  }

  return value;
}

function isExpectedResource(
  resource: KnowledgeResource,
  universeKey: NamespacedKey,
  resourceType: NamespacedKey | undefined,
): boolean {
  return (
    resource.lifecycle === KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE &&
    resource.universeKey === universeKey &&
    (resourceType === undefined || resource.resourceType === resourceType)
  );
}

export class ListPublicKnowledgeDiscovery {
  public constructor(private readonly reader: PublicKnowledgeDiscoveryReader) {}

  public async execute(
    input: ListPublicKnowledgeDiscoveryInput,
  ): Promise<readonly PublicKnowledgeDiscoveryItem[]> {
    const universeKey = parsePublicKey(input.universeKey, 'Universe key');
    const resourceType =
      input.resourceType === undefined
        ? undefined
        : parsePublicKey(input.resourceType, 'Resource Type');
    const limit = parseLimit(input.limit);

    const entities = await this.reader.listPublishedEntities({
      universeKey,
      ...(resourceType === undefined ? {} : { resourceType }),
      limit,
    });

    return entities
      .filter((entity) => isExpectedResource(entity.resource, universeKey, resourceType))
      .slice(0, limit)
      .map((entity) => {
        const preview = entity.media[0];

        return {
          resourceId: entity.resource.id,
          universeKey: entity.resource.universeKey,
          resourceType: entity.resource.resourceType,
          slug: entity.profile.slug,
          displayName: entity.profile.displayName,
          summary: entity.profile.summary,
          updatedAt: entity.resource.updatedAt,
          previewMedia:
            preview === undefined
              ? null
              : {
                  assetId: preview.assetId,
                  assetType: preview.assetType,
                  mimeType: preview.mimeType,
                  playback: preview.playback,
                  posterAssetId: preview.posterAssetId,
                  altText: preview.altText,
                },
        };
      });
  }
}
