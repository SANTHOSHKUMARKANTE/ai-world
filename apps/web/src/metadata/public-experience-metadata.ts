import type { Metadata } from 'next';

const DEFAULT_API_ORIGIN = 'http://127.0.0.1:3001';
const FALLBACK_TITLE = 'Published Experience';
const FALLBACK_DESCRIPTION = 'Explore this published Experience in AI World.';
const MAX_DESCRIPTION_LENGTH = 180;

export interface PublicExperienceMetadataProjection {
  readonly title: string;
  readonly description: string | null;
  readonly socialImageAssetId: string | null;
}

function resolveApiOrigin(): string {
  const configuredOrigin = process.env.AI_WORLD_API_ORIGIN ?? DEFAULT_API_ORIGIN;
  const url = new URL(configuredOrigin);

  if (
    (url.protocol !== 'http:' && url.protocol !== 'https:') ||
    url.username.length > 0 ||
    url.password.length > 0 ||
    url.pathname !== '/' ||
    url.search.length > 0 ||
    url.hash.length > 0
  ) {
    throw new Error(
      'AI_WORLD_API_ORIGIN must be an http(s) origin without credentials, path, query, or fragment.',
    );
  }

  return url.origin;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function boundedDescription(value: string): string {
  const normalized = normalizeText(value);

  if (normalized.length <= MAX_DESCRIPTION_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
}

export function publicExperienceCanonicalPath(id: string): string {
  return `/experiences/${encodeURIComponent(id)}`;
}

export function parsePublicExperienceMetadataProjection(
  value: unknown,
  expectedId: string,
): PublicExperienceMetadataProjection | null {
  if (!isRecord(value) || !isRecord(value.page) || !Array.isArray(value.items)) {
    return null;
  }

  const page = value.page;
  if (page.id !== expectedId || page.lifecycle !== 'PUBLISHED' || typeof page.title !== 'string') {
    return null;
  }

  const title = normalizeText(page.title);
  if (!title) {
    return null;
  }

  let description: string | null = null;
  let socialImageAssetId: string | null = null;

  for (const item of value.items) {
    if (!isRecord(item)) {
      continue;
    }

    if (description === null && item.kind === 'BLOCK' && typeof item.text === 'string') {
      const candidate = normalizeText(item.text);
      if (candidate) {
        description = boundedDescription(candidate);
      }
    }

    if (
      socialImageAssetId === null &&
      item.kind === 'MEDIA_ASSET' &&
      item.assetType === 'IMAGE' &&
      typeof item.id === 'string'
    ) {
      socialImageAssetId = item.id;
    }

    if (description !== null && socialImageAssetId !== null) {
      break;
    }
  }

  return {
    title,
    description,
    socialImageAssetId,
  };
}

function fallbackDescription(title: string): string {
  if (title === FALLBACK_TITLE) {
    return FALLBACK_DESCRIPTION;
  }

  return boundedDescription(`Explore ${title} in AI World.`);
}

export function buildPublicExperienceMetadata(
  projection: PublicExperienceMetadataProjection | null,
  id: string,
): Metadata {
  const canonical = publicExperienceCanonicalPath(id);
  const title = projection?.title ?? FALLBACK_TITLE;
  const description = projection?.description ?? fallbackDescription(title);
  const socialImage = projection?.socialImageAssetId
    ? `/api/media/assets/${encodeURIComponent(projection.socialImageAssetId)}/thumbnail`
    : null;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      ...(socialImage ? { images: [{ url: socialImage, alt: title }] } : {}),
    },
  };
}

export async function getPublicExperienceMetadata(
  id: string,
  apiOrigin = resolveApiOrigin(),
): Promise<Metadata> {
  try {
    const response = await fetch(
      new URL(`/composition/public/pages/${encodeURIComponent(id)}`, apiOrigin),
      { cache: 'no-store' },
    );

    if (!response.ok) {
      return buildPublicExperienceMetadata(null, id);
    }

    const projection = parsePublicExperienceMetadataProjection(await response.json(), id);

    return buildPublicExperienceMetadata(projection, id);
  } catch {
    return buildPublicExperienceMetadata(null, id);
  }
}
