import type { Metadata } from 'next';

import { entitySocialImageUrl } from '../knowledge/entity-social-media';
import {
  parsePublicKnowledgeEntity,
  type PublicKnowledgeEntity,
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

export function devotionalDeityCanonicalPath(slug: string): string {
  return `/devotional/${encodeURIComponent(slug)}`;
}

function fallbackMetadata(slug: string): Metadata {
  const canonical = devotionalDeityCanonicalPath(slug);
  const title = 'Devotional Deity';
  const description = 'Explore this published Devotional Deity in AI World.';

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

export function buildDevotionalDeityMetadata(
  entity: PublicKnowledgeEntity,
  slug: string,
  apiOrigin: string,
): Metadata {
  const canonical = devotionalDeityCanonicalPath(slug);
  const socialImage = entitySocialImageUrl(entity, apiOrigin);

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

export async function getDevotionalDeityMetadata(
  slug: string,
  apiOrigin = resolveApiOrigin(),
): Promise<Metadata> {
  try {
    const response = await fetch(
      new URL(`/knowledge/entities/universe.devotional/${encodeURIComponent(slug)}`, apiOrigin),
      { cache: 'no-store' },
    );

    if (!response.ok) {
      return fallbackMetadata(slug);
    }

    const entity = parsePublicKnowledgeEntity(await response.json());

    if (
      !entity ||
      entity.resource.universeKey !== 'universe.devotional' ||
      entity.resource.resourceType !== 'devotional.deity'
    ) {
      return fallbackMetadata(slug);
    }

    return buildDevotionalDeityMetadata(entity, slug, apiOrigin);
  } catch {
    return fallbackMetadata(slug);
  }
}
