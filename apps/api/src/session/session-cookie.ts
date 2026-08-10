import { SESSION_ABSOLUTE_TTL_MILLISECONDS } from '@ai-world/platform-identity-access';

export const SESSION_COOKIE_NAME = 'ai_world_session';

const SESSION_COOKIE_MAX_AGE_SECONDS = SESSION_ABSOLUTE_TTL_MILLISECONDS / 1000;

interface CookieResponse {
  setHeader(name: string, value: string | readonly string[]): void;
}

function shouldUseSecureCookie(environment: string): boolean {
  return environment === 'production';
}

export class SessionCookie {
  constructor(private readonly environment: string) {}

  read(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) {
      return null;
    }

    for (const cookiePart of cookieHeader.split(';')) {
      const separatorIndex = cookiePart.indexOf('=');

      if (separatorIndex < 0) {
        continue;
      }

      const name = cookiePart.slice(0, separatorIndex).trim();

      if (name !== SESSION_COOKIE_NAME) {
        continue;
      }

      const value = cookiePart.slice(separatorIndex + 1).trim();

      return value || null;
    }

    return null;
  }

  set(response: CookieResponse, token: string, expiresAt: Date): void {
    const attributes = [
      `${SESSION_COOKIE_NAME}=${token}`,
      'HttpOnly',
      'SameSite=Lax',
      'Path=/',
      `Max-Age=${SESSION_COOKIE_MAX_AGE_SECONDS}`,
      `Expires=${expiresAt.toUTCString()}`,
    ];

    if (shouldUseSecureCookie(this.environment)) {
      attributes.push('Secure');
    }

    response.setHeader('Set-Cookie', attributes.join('; '));
  }

  clear(response: CookieResponse): void {
    const attributes = [
      `${SESSION_COOKIE_NAME}=`,
      'HttpOnly',
      'SameSite=Lax',
      'Path=/',
      'Max-Age=0',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ];

    if (shouldUseSecureCookie(this.environment)) {
      attributes.push('Secure');
    }

    response.setHeader('Set-Cookie', attributes.join('; '));
  }
}
