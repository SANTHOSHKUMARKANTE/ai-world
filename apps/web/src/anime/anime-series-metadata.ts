import type { Metadata } from 'next';

import {
  parsePublicKnowledgeEntity,
  type PublicKnowledgeEntity,
} from '../knowledge/public-knowledge-entity-api';
import { animeEntitySocialImageUrl } from './anime-entity-social-media';

const DEFAULT_API_ORIGIN = 'http://127.0.0.1:3001';

function resolveApiOrigin(): string {
  const configuredOrigin = process.env.AI_WORLD_API_ORIGIN ?? DEFAULT_API_ORIGIN;
  const url = new URL(configuredOrigin);

  if (url.pathname !== '/' || url.search.length > 0 || url.hash.length > 0) {
    throw new Error('AI_WORLD_API_ORIGIN must be an origin without a path, query, or fragment.');
  }

  return url.origin;
}

export function animeSeriesCanonicalPath(slug: string): string {
  return `/anime/series/${encodeURIComponent(slug)}`;
}

function fallbackMetadata(slug: string): Metadata {
  const canonical = animeSeriesCanonicalPath(slug);
  const title = 'Anime Series';
  const description = 'Explore this published Anime Series in AI World.';

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

export function buildAnimeSeriesMetadata(
  entity: PublicKnowledgeEntity,
  slug: string,
  apiOrigin: string,
): Metadata {
  const canonical = animeSeriesCanonicalPath(slug);
  const socialImage = animeEntitySocialImageUrl(entity, apiOrigin);

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

export async function getAnimeSeriesMetadata(
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
      entity.resource.resourceType !== 'anime.series'
    ) {
      return fallbackMetadata(slug);
    }

    return buildAnimeSeriesMetadata(entity, slug, apiOrigin);
  } catch {
    return fallbackMetadata(slug);
  }
}
