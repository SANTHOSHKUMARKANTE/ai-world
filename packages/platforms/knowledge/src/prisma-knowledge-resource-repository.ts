import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import {
  isKnowledgeResourceLifecycle,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type KnowledgeResource,
} from './knowledge-resource';
import type {
  KnowledgeResourceAssetReferenceStore,
  ListKnowledgeResourceAssetIdsInput,
  ReplaceKnowledgeResourceMediaPlacementsInput,
} from './knowledge-resource-asset-reference-store';
import type { KnowledgeResourceMediaPlacement } from './knowledge-resource-media-placement';
import type {
  KnowledgeResourceLifecycleWriter,
  TransitionKnowledgeResourceLifecycleRecordInput,
} from './knowledge-resource-lifecycle-writer';
import type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from './knowledge-resource-reader';
import type {
  FindPublishedKnowledgeResourceByIdInput,
  ListPublishedKnowledgeResourcesInput,
  PublicKnowledgeResourceReader,
} from './public-knowledge-resource-reader';
import type {
  CreateKnowledgeResourceRecordInput,
  KnowledgeResourceWriter,
  UpdateKnowledgeResourceTypeRecordInput,
} from './knowledge-resource-writer';

interface PersistedKnowledgeResource {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly lifecycle: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function mapPersistedKnowledgeResource(resource: PersistedKnowledgeResource): KnowledgeResource {
  if (!isKnowledgeResourceLifecycle(resource.lifecycle)) {
    throw new TypeError(
      `Persisted Knowledge Resource has unsupported lifecycle: ${resource.lifecycle}`,
    );
  }

  return {
    id: parseResourceId(resource.id),
    universeKey: parseNamespacedKey(resource.universeKey),
    resourceType: parseNamespacedKey(resource.resourceType),
    lifecycle: resource.lifecycle,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}

export class PrismaKnowledgeResourceRepository
  implements
    KnowledgeResourceReader,
    PublicKnowledgeResourceReader,
    KnowledgeResourceWriter,
    KnowledgeResourceLifecycleWriter,
    KnowledgeResourceAssetReferenceStore
{
  constructor(private readonly database: DatabaseClient) {}

  async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    const resource = await this.database.knowledgeResource.findUnique({
      where: {
        id: input.id,
      },
    });

    return resource ? mapPersistedKnowledgeResource(resource) : null;
  }

  async findPublishedById(
    input: FindPublishedKnowledgeResourceByIdInput,
  ): Promise<KnowledgeResource | null> {
    const resource = await this.database.knowledgeResource.findFirst({
      where: {
        id: input.id,
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      },
    });

    return resource ? mapPersistedKnowledgeResource(resource) : null;
  }

  async listPublished(
    input: ListPublishedKnowledgeResourcesInput,
  ): Promise<readonly KnowledgeResource[]> {
    const resources = await this.database.knowledgeResource.findMany({
      where: {
        universeKey: input.universeKey,
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
        ...(input.resourceType
          ? {
              resourceType: input.resourceType,
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: input.limit,
    });

    return resources.map(mapPersistedKnowledgeResource);
  }

  async create(input: CreateKnowledgeResourceRecordInput): Promise<KnowledgeResource> {
    const resource = await this.database.knowledgeResource.create({
      data: {
        id: input.id,
        universeKey: input.universeKey,
        resourceType: input.resourceType,
        lifecycle: input.lifecycle,
      },
    });

    return mapPersistedKnowledgeResource(resource);
  }

  async updateResourceType(
    input: UpdateKnowledgeResourceTypeRecordInput,
  ): Promise<KnowledgeResource | null> {
    const result = await this.database.knowledgeResource.updateMany({
      where: {
        id: input.id,
      },
      data: {
        resourceType: input.resourceType,
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return this.findById({ id: input.id });
  }

  async transitionLifecycle(
    input: TransitionKnowledgeResourceLifecycleRecordInput,
  ): Promise<KnowledgeResource | null> {
    const result = await this.database.knowledgeResource.updateMany({
      where: {
        id: input.id,
        lifecycle: input.fromLifecycle,
      },
      data: {
        lifecycle: input.toLifecycle,
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return this.findById({ id: input.id });
  }

  async listAssetIds(input: ListKnowledgeResourceAssetIdsInput): Promise<readonly ResourceId[]> {
    const references = await this.database.knowledgeResourceAssetReference.findMany({
      where: {
        knowledgeResourceId: input.knowledgeResourceId,
      },
      select: {
        assetId: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return references.map(({ assetId }) => parseResourceId(assetId));
  }

  async replaceMediaPlacements(
    input: ReplaceKnowledgeResourceMediaPlacementsInput,
  ): Promise<readonly KnowledgeResourceMediaPlacement[]> {
    await this.database.$transaction(async (transaction) => {
      await transaction.knowledgeResourceAssetReference.deleteMany({
        where: {
          knowledgeResourceId: input.knowledgeResourceId,
        },
      });

      if (input.placements.length > 0) {
        await transaction.knowledgeResourceAssetReference.createMany({
          data: input.placements.map((placement) => ({
            knowledgeResourceId: input.knowledgeResourceId,
            assetId: placement.assetId,
            role: placement.role,
            playback: placement.playback,
            position: placement.position,
            altText: placement.altText,
            caption: placement.caption,
            posterAssetId: placement.posterAssetId,
          })),
        });
      }
    });

    return input.placements;
  }
}
