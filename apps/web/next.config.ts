import type { NextConfig } from 'next';

const DEFAULT_API_ORIGIN = 'http://127.0.0.1:3001';

function resolveApiOrigin(): string {
  const configuredOrigin = process.env.AI_WORLD_API_ORIGIN ?? DEFAULT_API_ORIGIN;

  const url = new URL(configuredOrigin);

  if (url.pathname !== '/' || url.search.length > 0 || url.hash.length > 0) {
    throw new Error('AI_WORLD_API_ORIGIN must be an origin without a path, query, or fragment.');
  }

  return url.origin;
}

const apiOrigin = resolveApiOrigin();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
