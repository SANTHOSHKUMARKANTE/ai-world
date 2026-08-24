import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  ASSET_IMAGE_TYPE,
  ASSET_VIDEO_TYPE,
  MEDIA_SHORT_VIDEO_MAX_DURATION_MS,
  MEDIA_UPLOAD_MP4_MIME_TYPE,
  type PublicMediaAssetDescriptor,
  type PublicMediaAssetDescriptorReader,
} from '@ai-world/platform-media';

import type {
  KnowledgeEntityConfiguration,
  KnowledgeEntityFact,
  KnowledgeEntityProfile,
  KnowledgeEntityRelation,
  PublicKnowledgeEntity,
  PublicKnowledgeEntityMedia,
} from './knowledge-entity';
import type {
  FindKnowledgeEntityRouteOwnerInput,
  FindPublishedKnowledgeEntityByRouteKeyInput,
  KnowledgeEntityStore,
  ReplaceKnowledgeEntityConfigurationInput,
} from './knowledge-entity-store';
import type {
  FindKnowledgeEntityConfigurationByResourceIdInput,
  KnowledgeEntityConfigurationReader,
} from './knowledge-entity-configuration-reader';
import {
  isKnowledgeResourceLifecycle,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type KnowledgeResource,
} from './knowledge-resource';
import {
  isKnowledgeResourceMediaPlayback,
  isKnowledgeResourceMediaRole,
  KNOWLEDGE_MEDIA_HERO_ROLE,
  KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK,
  KNOWLEDGE_MEDIA_STILL_PLAYBACK,
  type KnowledgeResourceMediaPlayback,
  type KnowledgeResourceMediaRole,
} from './knowledge-resource-media-placement';

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
  readonly nativeName: string | null;
  readonly alternateNames: unknown;
  readonly summary: string;
  readonly overview: string | null;
  readonly facts: unknown;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface PersistedKnowledgeEntityMediaPlacement {
  readonly assetId: string;
  readonly role: string;
  readonly playback: string;
  readonly position: number;
  readonly altText: string | null;
  readonly caption: string | null;
  readonly posterAssetId: string | null;
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

function mapAlternateNames(value: unknown): readonly string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new TypeError('Persisted Knowledge Entity alternate names must be a string array.');
  }
  return value;
}

function mapProfile(profile: PersistedKnowledgeEntityProfile): KnowledgeEntityProfile {
  return {
    knowledgeResourceId: parseResourceId(profile.knowledgeResourceId),
    routeKey: profile.routeKey,
    slug: profile.slug,
    displayName: profile.displayName,
    nativeName: profile.nativeName,
    alternateNames: mapAlternateNames(profile.alternateNames),
    summary: profile.summary,
    overview: profile.overview,
    facts: mapFacts(profile.facts),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

function parseRole(value: string): KnowledgeResourceMediaRole {
  if (!isKnowledgeResourceMediaRole(value)) {
    throw new TypeError(`Persisted Knowledge media role is unsupported: ${value}`);
  }

  return value;
}

function parsePlayback(value: string): KnowledgeResourceMediaPlayback {
  if (!isKnowledgeResourceMediaPlayback(value)) {
    throw new TypeError(`Persisted Knowledge media playback is unsupported: ${value}`);
  }

  return value;
}

function isBoundedShortVideo(descriptor: PublicMediaAssetDescriptor): boolean {
  return (
    descriptor.assetType === ASSET_VIDEO_TYPE &&
    descriptor.mimeType === MEDIA_UPLOAD_MP4_MIME_TYPE &&
    descriptor.durationMs !== undefined &&
    Number.isInteger(descriptor.durationMs) &&
    descriptor.durationMs > 0 &&
    descriptor.durationMs <= MEDIA_SHORT_VIDEO_MAX_DURATION_MS
  );
}

export class PrismaKnowledgeEntityRepository
  implements KnowledgeEntityStore, KnowledgeEntityConfigurationReader
{
  public constructor(
    private readonly database: DatabaseClient,
    private readonly mediaDescriptors: PublicMediaAssetDescriptorReader,
  ) {}

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

  public async findConfigurationByResourceId(
    input: FindKnowledgeEntityConfigurationByResourceIdInput,
  ): Promise<KnowledgeEntityConfiguration | null> {
    const profile = await this.database.knowledgeResourceProfile.findUnique({
      where: { knowledgeResourceId: input.knowledgeResourceId },
    });
    if (!profile) {
      return null;
    }
    const relations = await this.database.knowledgeResourceRelation.findMany({
      where: { sourceResourceId: input.knowledgeResourceId },
      orderBy: [{ sectionKey: 'asc' }, { position: 'asc' }],
    });
    return {
      profile: mapProfile(profile),
      relations: relations.map((relation) => ({
        targetResourceId: parseResourceId(relation.targetResourceId),
        sectionKey: parseNamespacedKey(relation.sectionKey),
        relationshipType: parseNamespacedKey(relation.relationshipType),
        position: relation.position,
      })),
    };
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
          nativeName: input.nativeName,
          alternateNames: [...input.alternateNames],
          summary: input.summary,
          overview: input.overview,
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
          nativeName: input.nativeName,
          alternateNames: [...input.alternateNames],
          summary: input.summary,
          overview: input.overview,
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

    const placementSelect = {
      assetId: true,
      role: true,
      playback: true,
      position: true,
      altText: true,
      caption: true,
      posterAssetId: true,
    } as const;

    const [assetReferences, relations] = await Promise.all([
      this.database.knowledgeResourceAssetReference.findMany({
        where: {
          knowledgeResourceId: profile.knowledgeResourceId,
        },
        select: placementSelect,
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
                select: placementSelect,
                orderBy: {
                  position: 'asc',
                },
              },
            },
          },
        },
        orderBy: [{ sectionKey: 'asc' }, { position: 'asc' }],
      }),
    ]);

    const descriptorCache = new Map<string, Promise<PublicMediaAssetDescriptor | null>>();

    const describe = (assetId: string): Promise<PublicMediaAssetDescriptor | null> => {
      const existing = descriptorCache.get(assetId);
      if (existing) {
        return existing;
      }

      const descriptor = this.mediaDescriptors.findById({
        id: parseResourceId(assetId),
      });
      descriptorCache.set(assetId, descriptor);
      return descriptor;
    };

    const toPublicMedia = async (
      placement: PersistedKnowledgeEntityMediaPlacement,
    ): Promise<PublicKnowledgeEntityMedia | null> => {
      const role = parseRole(placement.role);
      const playback = parsePlayback(placement.playback);
      const descriptor = await describe(placement.assetId);

      if (!descriptor) {
        return null;
      }

      if (descriptor.assetType === ASSET_IMAGE_TYPE) {
        if (playback !== KNOWLEDGE_MEDIA_STILL_PLAYBACK) {
          return null;
        }

        return {
          assetId: descriptor.id,
          assetType: descriptor.assetType,
          mimeType: descriptor.mimeType,
          role,
          playback,
          position: placement.position,
          altText: placement.altText,
          caption: placement.caption,
          ...(descriptor.width === undefined ? {} : { width: descriptor.width }),
          ...(descriptor.height === undefined ? {} : { height: descriptor.height }),
          ...(descriptor.durationMs === undefined ? {} : { durationMs: descriptor.durationMs }),
          posterAssetId: null,
        };
      }

      if (
        !isBoundedShortVideo(descriptor) ||
        playback !== KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK ||
        !placement.posterAssetId
      ) {
        return null;
      }

      const poster = await describe(placement.posterAssetId);
      if (!poster || poster.assetType !== ASSET_IMAGE_TYPE) {
        return null;
      }

      return {
        assetId: descriptor.id,
        assetType: descriptor.assetType,
        mimeType: descriptor.mimeType,
        role,
        playback,
        position: placement.position,
        altText: placement.altText,
        caption: placement.caption,
        ...(descriptor.width === undefined ? {} : { width: descriptor.width }),
        ...(descriptor.height === undefined ? {} : { height: descriptor.height }),
        ...(descriptor.durationMs === undefined ? {} : { durationMs: descriptor.durationMs }),
        posterAssetId: poster.id,
      };
    };

    const selectPreviewAssetId = async (
      placements: readonly PersistedKnowledgeEntityMediaPlacement[],
    ): Promise<ResourceId | null> => {
      const heroPlacements = placements.filter(
        (placement) => parseRole(placement.role) === KNOWLEDGE_MEDIA_HERO_ROLE,
      );

      for (const placement of heroPlacements) {
        const descriptor = await describe(placement.assetId);
        if (
          descriptor?.assetType === ASSET_IMAGE_TYPE &&
          parsePlayback(placement.playback) === KNOWLEDGE_MEDIA_STILL_PLAYBACK
        ) {
          return descriptor.id;
        }
      }

      for (const placement of heroPlacements) {
        const descriptor = await describe(placement.assetId);
        if (
          !descriptor ||
          !isBoundedShortVideo(descriptor) ||
          parsePlayback(placement.playback) !== KNOWLEDGE_MEDIA_SHORT_LOOP_PLAYBACK ||
          !placement.posterAssetId
        ) {
          continue;
        }

        const poster = await describe(placement.posterAssetId);
        if (poster?.assetType === ASSET_IMAGE_TYPE) {
          return poster.id;
        }
      }

      for (const placement of placements) {
        const descriptor = await describe(placement.assetId);
        if (
          descriptor?.assetType === ASSET_IMAGE_TYPE &&
          parsePlayback(placement.playback) === KNOWLEDGE_MEDIA_STILL_PLAYBACK
        ) {
          return descriptor.id;
        }
      }

      return null;
    };

    const media = (
      await Promise.all(
        assetReferences.map((placement) =>
          toPublicMedia(placement as PersistedKnowledgeEntityMediaPlacement),
        ),
      )
    ).filter((item): item is PublicKnowledgeEntityMedia => item !== null);

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
          previewAssetId: await selectPreviewAssetId(
            relation.targetResource
              .assetReferences as readonly PersistedKnowledgeEntityMediaPlacement[],
          ),
        },
      });
    }

    return {
      resource: mapResource(profile.knowledgeResource),
      profile: mapProfile(profile),
      media,
      relations: publicRelations,
    };
  }
}
