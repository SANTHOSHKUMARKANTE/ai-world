import { describe, expect, it, vi } from 'vitest';

import { SESSION_COOKIE_NAME, SessionCookie } from '../src/session/session-cookie';

function createResponse() {
  const setHeader = vi.fn<(name: string, value: string | readonly string[]) => void>();

  return {
    setHeader,
  };
}

describe('SessionCookie', () => {
  it('writes an HttpOnly same-site Session cookie without Secure in test', () => {
    const cookie = new SessionCookie('test');
    const response = createResponse();

    cookie.set(response, 'opaque-session-token', new Date('2026-08-17T12:00:00.000Z'));

    expect(response.setHeader).toHaveBeenCalledOnce();

    const value = response.setHeader.mock.calls[0]?.[1];

    expect(typeof value).toBe('string');

    if (typeof value !== 'string') {
      throw new Error('Expected a string Set-Cookie header.');
    }

    expect(value).toContain(`${SESSION_COOKIE_NAME}=opaque-session-token`);
    expect(value).toContain('HttpOnly');
    expect(value).toContain('SameSite=Lax');
    expect(value).toContain('Path=/');
    expect(value).toContain('Max-Age=604800');
    expect(value).not.toContain('Secure');
  });

  it('adds Secure to production Session cookies', () => {
    const cookie = new SessionCookie('production');
    const response = createResponse();

    cookie.set(response, 'opaque-session-token', new Date('2026-08-17T12:00:00.000Z'));

    const value = response.setHeader.mock.calls[0]?.[1];

    expect(typeof value).toBe('string');

    if (typeof value !== 'string') {
      throw new Error('Expected a string Set-Cookie header.');
    }

    expect(value).toContain('HttpOnly');
    expect(value).toContain('SameSite=Lax');
    expect(value).toContain('Secure');
  });

  it('clears the production Session cookie with matching security attributes', () => {
    const cookie = new SessionCookie('production');
    const response = createResponse();

    cookie.clear(response);

    const value = response.setHeader.mock.calls[0]?.[1];

    expect(typeof value).toBe('string');

    if (typeof value !== 'string') {
      throw new Error('Expected a string Set-Cookie header.');
    }

    expect(value).toContain(`${SESSION_COOKIE_NAME}=`);
    expect(value).toContain('Max-Age=0');
    expect(value).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(value).toContain('HttpOnly');
    expect(value).toContain('SameSite=Lax');
    expect(value).toContain('Path=/');
    expect(value).toContain('Secure');
  });

  it('reads the Session token from a Cookie header containing other cookies', () => {
    const cookie = new SessionCookie('test');

    expect(cookie.read(`theme=dark; ${SESSION_COOKIE_NAME}=opaque-session-token; locale=en`)).toBe(
      'opaque-session-token',
    );
  });

  it('returns null when the Session cookie is absent or empty', () => {
    const cookie = new SessionCookie('test');

    expect(cookie.read(undefined)).toBeNull();
    expect(cookie.read('theme=dark')).toBeNull();
    expect(cookie.read(`${SESSION_COOKIE_NAME}=`)).toBeNull();
  });
});
