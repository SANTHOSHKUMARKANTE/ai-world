const DEFAULT_IDENTITY_CONTINUE_PATH = '/account';
const IDENTITY_ENTRY_PATHS = new Set(['/register', '/sign-in']);

export function resolveIdentityContinuePath(value: string | string[] | undefined): string {
  if (typeof value !== 'string') {
    return DEFAULT_IDENTITY_CONTINUE_PATH;
  }

  const candidate = value.trim();

  if (
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\') ||
    candidate.includes('\u0000')
  ) {
    return DEFAULT_IDENTITY_CONTINUE_PATH;
  }

  const pathname = candidate.split(/[?#]/u, 1)[0];

  if (!pathname || IDENTITY_ENTRY_PATHS.has(pathname)) {
    return DEFAULT_IDENTITY_CONTINUE_PATH;
  }

  return candidate;
}
