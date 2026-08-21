import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

export const PAGE_INITIAL_LIFECYCLE = 'DRAFT' as const;
export const PAGE_PUBLISHED_LIFECYCLE = 'PUBLISHED' as const;
export const PAGE_ARCHIVED_LIFECYCLE = 'ARCHIVED' as const;

export type PageLifecycle =
  typeof PAGE_INITIAL_LIFECYCLE | typeof PAGE_PUBLISHED_LIFECYCLE | typeof PAGE_ARCHIVED_LIFECYCLE;

export const PAGE_ROUTE_PATH_MAX_LENGTH = 512;
export const PAGE_PRESENTATION_TITLE_MAX_LENGTH = 160;

export interface PageRouteMetadata {
  readonly path: string;
}

export interface PagePresentationMetadata {
  readonly title: string;
}

export interface Page {
  readonly id: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly route: PageRouteMetadata;
  readonly presentation: PagePresentationMetadata;
  readonly lifecycle: PageLifecycle;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function isPageLifecycle(value: unknown): value is PageLifecycle {
  return (
    value === PAGE_INITIAL_LIFECYCLE ||
    value === PAGE_PUBLISHED_LIFECYCLE ||
    value === PAGE_ARCHIVED_LIFECYCLE
  );
}

function containsAsciiControlCharacter(value: string): boolean {
  return Array.from(value).some((character) => {
    const codePoint = character.codePointAt(0);

    return codePoint !== undefined && (codePoint < 0x20 || codePoint === 0x7f);
  });
}

export function isPageRoutePath(value: unknown): value is string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > PAGE_ROUTE_PATH_MAX_LENGTH ||
    !value.startsWith('/') ||
    value.includes('?') ||
    value.includes('#') ||
    value.includes('\\') ||
    containsAsciiControlCharacter(value) ||
    /\s/u.test(value)
  ) {
    return false;
  }

  if (value === '/') {
    return true;
  }

  if (value.endsWith('/') || value.includes('//')) {
    return false;
  }

  const segments = value.slice(1).split('/');

  return segments.every((segment) => segment.length > 0 && segment !== '.' && segment !== '..');
}

export function parsePageRoutePath(value: string): string {
  if (!isPageRoutePath(value)) {
    throw new TypeError(
      'Page route path must be a canonical absolute path without query, fragment, whitespace, backslash, empty segments, dot segments, or trailing slash.',
    );
  }

  return value;
}

export function isPagePresentationTitle(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= PAGE_PRESENTATION_TITLE_MAX_LENGTH &&
    value === value.trim() &&
    !containsAsciiControlCharacter(value)
  );
}

export function parsePagePresentationTitle(value: string): string {
  if (!isPagePresentationTitle(value)) {
    throw new TypeError(
      'Page presentation title must be a non-empty single-line value no longer than 160 characters and must not require trimming.',
    );
  }

  return value;
}
