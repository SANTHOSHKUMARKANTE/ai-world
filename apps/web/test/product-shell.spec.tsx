import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AccountNavigation } from '../src/app/account-navigation';
import { SessionProvider } from '../src/session/session-provider';
import { WEB_UNIVERSE_PRESENTATIONS } from '../src/universes/presentation';

function renderAccountNavigation() {
  return render(
    <SessionProvider>
      <AccountNavigation />
    </SessionProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('WPR-M01 product shell', () => {
  it('keeps the Web Universe presentation map explicit and bounded', () => {
    expect(WEB_UNIVERSE_PRESENTATIONS).toEqual([
      expect.objectContaining({
        universeKey: 'universe.devotional',
        tone: 'devotional',
      }),
      expect.objectContaining({
        universeKey: 'universe.anime',
        tone: 'anime',
      }),
    ]);

    expect(new Set(WEB_UNIVERSE_PRESENTATIONS.map((item) => item.universeKey)).size).toBe(
      WEB_UNIVERSE_PRESENTATIONS.length,
    );
  });

  it('renders anonymous account entry actions after an expected 401', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'identity.session.invalid',
            message: 'Authentication is required.',
            status: 401,
            requestId: 'wpr-m01-anonymous',
          },
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    renderAccountNavigation();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Create account' })).toBeTruthy();
      expect(screen.getByRole('link', { name: 'Sign in' })).toBeTruthy();
    });
  });

  it('recovers a temporary Session lookup failure through an explicit bounded retry', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('temporary connection failure'))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            actorId: 'actor-wpr-m01',
            expiresAt: '2026-08-23T12:00:00.000Z',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

    vi.stubGlobal('fetch', fetchMock);

    renderAccountNavigation();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Retry session' })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Retry session' }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Account' })).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
