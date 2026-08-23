import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import type {
  KnowledgeEntityFact,
  KnowledgeEntityProfile,
  KnowledgeEntityRelation,
  PublicKnowledgeEntity,
} from './knowledge-entity';
import type {
  FindKnowledgeEntityRouteOwnerInput,
  FindPublishedKnowledgeEntityByRouteKeyInput,
  KnowledgeEntityStore,
  ReplaceKnowledgeEntityConfigurationInput,
} from './knowledge-entity-store';
import {
  isKnowledgeResourceLifecycle,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type KnowledgeResource,
} from './knowledge-resource';

interface PersistedKnowledgeResource {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly lifecycle: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface PersistedKnowledgeEntityProfile {
  readonly knowledgeResourceId: string;
  readonly routeKey: string;
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
  readonly facts: unknown;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function mapResource(resource: PersistedKnowledgeResource): KnowledgeResource {
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

function mapFacts(value: unknown): readonly KnowledgeEntityFact[] {
  if (!Array.isArray(value)) {
    throw new TypeError('Persisted Knowledge Entity facts must be an array.');
  }

  return value.map((fact) => {
    if (
      typeof fact !== 'object' ||
      fact === null ||
      !('key' in fact) ||
      !('label' in fact) ||
      !('value' in fact) ||
      typeof fact.key !== 'string' ||
      typeof fact.label !== 'string' ||
      typeof fact.value !== 'string'
    ) {
      throw new TypeError('Persisted Knowledge Entity fact is invalid.');
    }

    return {
      key: parseNamespacedKey(fact.key),
      label: fact.label,
      value: fact.value,
    };
  });
}

function mapProfile(profile: PersistedKnowledgeEntityProfile): KnowledgeEntityProfile {
  return {
    knowledgeResourceId: parseResourceId(profile.knowledgeResourceId),
    routeKey: profile.routeKey,
    slug: profile.slug,
    displayName: profile.displayName,
    summary: profile.summary,
    facts: mapFacts(profile.facts),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export class PrismaKnowledgeEntityRepository implements KnowledgeEntityStore {
  public constructor(private readonly database: DatabaseClient) {}

  public async findRouteOwner(
    input: FindKnowledgeEntityRouteOwnerInput,
  ): Promise<ResourceId | null> {
    const profile = await this.database.knowledgeResourceProfile.findUnique({
      where: {
        routeKey: input.routeKey,
      },
      select: {
        knowledgeResourceId: true,
      },
    });

    return profile ? parseResourceId(profile.knowledgeResourceId) : null;
  }

  public async replaceConfiguration(
    input: ReplaceKnowledgeEntityConfigurationInput,
  ): Promise<KnowledgeEntityProfile> {
    const profile = await this.database.$transaction(async (transaction) => {
      const saved = await transaction.knowledgeResourceProfile.upsert({
        where: {
          knowledgeResourceId: input.knowledgeResourceId,
        },
        create: {
          knowledgeResourceId: input.knowledgeResourceId,
          routeKey: input.routeKey,
          slug: input.slug,
          displayName: input.displayName,
          summary: input.summary,
          facts: input.facts.map((fact) => ({
            key: fact.key,
            label: fact.label,
            value: fact.value,
          })),
        },
        update: {
          routeKey: input.routeKey,
          slug: input.slug,
          displayName: input.displayName,
          summary: input.summary,
          facts: input.facts.map((fact) => ({
            key: fact.key,
            label: fact.label,
            value: fact.value,
          })),
        },
      });

      await transaction.knowledgeResourceRelation.deleteMany({
        where: {
          sourceResourceId: input.knowledgeResourceId,
        },
      });

      if (input.relations.length > 0) {
        await transaction.knowledgeResourceRelation.createMany({
          data: input.relations.map((relation) => ({
            sourceResourceId: input.knowledgeResourceId,
            targetResourceId: relation.targetResourceId,
            sectionKey: relation.sectionKey,
            relationshipType: relation.relationshipType,
            position: relation.position,
          })),
        });
      }

      return saved;
    });

    return mapProfile(profile);
  }

  public async findPublishedByRouteKey(
    input: FindPublishedKnowledgeEntityByRouteKeyInput,
  ): Promise<PublicKnowledgeEntity | null> {
    const profile = await this.database.knowledgeResourceProfile.findUnique({
      where: {
        routeKey: input.routeKey,
      },
      include: {
        knowledgeResource: true,
      },
    });

    if (
      !profile ||
      profile.knowledgeResource.lifecycle !== KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE
    ) {
      return null;
    }

    const [assetReferences, relations] = await Promise.all([
      this.database.knowledgeResourceAssetReference.findMany({
        where: {
          knowledgeResourceId: profile.knowledgeResourceId,
        },
        select: {
          assetId: true,
        },
        orderBy: {
          position: 'asc',
        },
      }),
      this.database.knowledgeResourceRelation.findMany({
        where: {
          sourceResourceId: profile.knowledgeResourceId,
        },
        include: {
          targetResource: {
            include: {
              profile: true,
              assetReferences: {
                select: {
                  assetId: true,
                },
                orderBy: {
                  position: 'asc',
                },
                take: 1,
              },
            },
          },
        },
        orderBy: [{ sectionKey: 'asc' }, { position: 'asc' }],
      }),
    ]);

    const publicRelations: KnowledgeEntityRelation[] = [];

    for (const relation of relations) {
      if (
        relation.targetResource.lifecycle !== KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE ||
        !relation.targetResource.profile
      ) {
        continue;
      }

      publicRelations.push({
        sectionKey: parseNamespacedKey(relation.sectionKey),
        relationshipType: parseNamespacedKey(relation.relationshipType),
        position: relation.position,
        target: {
          resource: mapResource(relation.targetResource),
          profile: mapProfile(relation.targetResource.profile),
          previewAssetId: relation.targetResource.assetReferences[0]
            ? parseResourceId(relation.targetResource.assetReferences[0].assetId)
            : null,
        },
      });
    }

    return {
      resource: mapResource(profile.knowledgeResource),
      profile: mapProfile(profile),
      assetIds: assetReferences.map(({ assetId }) => parseResourceId(assetId)),
      relations: publicRelations,
    };
  }
}
