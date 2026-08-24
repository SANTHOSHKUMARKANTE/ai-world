import type { Metadata } from 'next';

import {
  parsePublicKnowledgeEntity,
  type PublicKnowledgeEntity,
  type PublicKnowledgeEntityMedia,
} from '../knowledge/public-knowledge-entity-api';

const DEFAULT_API_ORIGIN = 'http://127.0.0.1:3001';

function resolveApiOrigin(): string {
  const configuredOrigin = process.env.AI_WORLD_API_ORIGIN ?? DEFAULT_API_ORIGIN;
  const url = new URL(configuredOrigin);

  if (url.pathname !== '/' || url.search.length > 0 || url.hash.length > 0) {
    throw new Error('AI_WORLD_API_ORIGIN must be an origin without a path, query, or fragment.');
  }

  return url.origin;
}

export function animeCharacterCanonicalPath(slug: string): string {
  return `/anime/characters/${encodeURIComponent(slug)}`;
}

function isEligibleSocialMedia(media: PublicKnowledgeEntityMedia): boolean {
  return (
    (media.assetType === 'IMAGE' && media.playback === 'STILL') ||
    (media.assetType === 'VIDEO' && media.playback === 'SHORT_LOOP' && media.posterAssetId !== null)
  );
}

function socialAssetId(entity: PublicKnowledgeEntity): string | null {
  const eligible = entity.media.filter(isEligibleSocialMedia);
  const media = eligible.find((item) => item.role === 'HERO') ?? eligible[0];

  if (!media) {
    return null;
  }

  return media.assetType === 'VIDEO' ? media.posterAssetId : media.assetId;
}

function fallbackMetadata(slug: string): Metadata {
  const canonical = animeCharacterCanonicalPath(slug);
  const title = 'Anime Character';
  const description = 'Explore this published Anime Character in AI World.';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
    },
  };
}

export function buildAnimeCharacterMetadata(
  entity: PublicKnowledgeEntity,
  slug: string,
  apiOrigin: string,
): Metadata {
  const canonical = animeCharacterCanonicalPath(slug);
  const socialId = socialAssetId(entity);
  const socialImage = socialId
    ? new URL(`/media/assets/${encodeURIComponent(socialId)}/thumbnail`, apiOrigin).toString()
    : null;

  return {
    title: entity.profile.displayName,
    description: entity.profile.summary,
    alternates: { canonical },
    openGraph: {
      title: entity.profile.displayName,
      description: entity.profile.summary,
      ...(socialImage
        ? {
            images: [
              {
                url: socialImage,
                alt: `${entity.profile.displayName} artwork`,
              },
            ],
          }
        : {}),
    },
  };
}

export async function getAnimeCharacterMetadata(
  slug: string,
  apiOrigin = resolveApiOrigin(),
): Promise<Metadata> {
  try {
    const response = await fetch(
      new URL(`/knowledge/entities/universe.anime/${encodeURIComponent(slug)}`, apiOrigin),
      { cache: 'no-store' },
    );

    if (!response.ok) {
      return fallbackMetadata(slug);
    }

    const entity = parsePublicKnowledgeEntity(await response.json());

    if (
      !entity ||
      entity.resource.universeKey !== 'universe.anime' ||
      entity.resource.resourceType !== 'anime.character'
    ) {
      return fallbackMetadata(slug);
    }

    return buildAnimeCharacterMetadata(entity, slug, apiOrigin);
  } catch {
    return fallbackMetadata(slug);
  }
}
