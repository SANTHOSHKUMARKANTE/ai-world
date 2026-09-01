import type { Metadata } from 'next';

import { entitySocialImageUrl } from './entity-social-media';
import {
  parsePublicKnowledgeEntity,
  type PublicKnowledgeEntity,
} from './public-knowledge-entity-api';
import { resolvePublicKnowledgeDestination } from './public-knowledge-destination';

const DEFAULT_API_ORIGIN = 'http://127.0.0.1:3001';

function resolveApiOrigin(): string {
  const configuredOrigin = process.env.AI_WORLD_API_ORIGIN ?? DEFAULT_API_ORIGIN;
  const url = new URL(configuredOrigin);

  if (url.pathname !== '/' || url.search.length > 0 || url.hash.length > 0) {
    throw new Error('AI_WORLD_API_ORIGIN must be an origin without a path, query, or fragment.');
  }

  return url.origin;
}

export function genericKnowledgeResourcePath(resourceId: string): string {
  return `/knowledge/resources/${encodeURIComponent(resourceId)}`;
}

export function canonicalDestinationForEntity(entity: PublicKnowledgeEntity): string {
  return resolvePublicKnowledgeDestination({
    resourceId: entity.resource.id,
    universeKey: entity.resource.universeKey,
    resourceType: entity.resource.resourceType,
    slug: entity.profile.slug,
  });
}

export async function getPublicKnowledgeEntityByResourceIdFromApi(
  resourceId: string,
  apiOrigin = resolveApiOrigin(),
): Promise<PublicKnowledgeEntity | null> {
  try {
    const response = await fetch(
      new URL(`/knowledge/entities/by-resource/${encodeURIComponent(resourceId)}`, apiOrigin),
      { cache: 'no-store' },
    );

    if (!response.ok) {
      return null;
    }

    return parsePublicKnowledgeEntity(await response.json());
  } catch {
    return null;
  }
}

export function buildGenericKnowledgeResourceMetadata(
  entity: PublicKnowledgeEntity | null,
  resourceId: string,
  apiOrigin: string,
): Metadata {
  const genericPath = genericKnowledgeResourcePath(resourceId);

  if (!entity) {
    const title = 'Published Knowledge';
    const description = 'Explore this published AI World Knowledge resource.';

    return {
      title,
      description,
      alternates: { canonical: genericPath },
      openGraph: { title, description },
    };
  }

  const canonical = canonicalDestinationForEntity(entity);
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

export async function getGenericKnowledgeResourceMetadata(
  resourceId: string,
  apiOrigin = resolveApiOrigin(),
): Promise<Metadata> {
  const entity = await getPublicKnowledgeEntityByResourceIdFromApi(resourceId, apiOrigin);
  return buildGenericKnowledgeResourceMetadata(entity, resourceId, apiOrigin);
}
