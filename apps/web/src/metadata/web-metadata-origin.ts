export const DEFAULT_WEB_METADATA_ORIGIN = 'http://127.0.0.1:3000';

export function resolveWebMetadataBase(
  configuredOrigin = process.env.AI_WORLD_WEB_ORIGIN ?? DEFAULT_WEB_METADATA_ORIGIN,
): URL {
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
      'AI_WORLD_WEB_ORIGIN must be an http(s) origin without credentials, path, query, or fragment.',
    );
  }

  return new URL(url.origin);
}
