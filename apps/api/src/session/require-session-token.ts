import { ApplicationError } from '@ai-world/foundation-errors';

import { SessionCookie } from './session-cookie';

export function requireSessionToken(
  sessionCookie: SessionCookie,
  cookieHeader: string | undefined,
): string {
  const token = sessionCookie.read(cookieHeader);

  if (!token) {
    throw new ApplicationError({
      code: 'identity.session.invalid',
      kind: 'unauthenticated',
      message: 'Session validation failed because no Session cookie was supplied.',
      publicMessage: 'Authentication is required.',
    });
  }

  return token;
}
