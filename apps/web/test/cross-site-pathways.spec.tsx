import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SavedExperience } from '../src/engagement/saved-experience';
import { ResourceEngagementControls } from '../src/engagement/resource-engagement-controls';
import { SessionProvider } from '../src/session/session-provider';

function anonymousSessionResponse(): Response {
  return new Response(
    JSON.stringify({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
      },
    }),
    { status: 401, headers: { 'Content-Type': 'application/json' } },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UXP-11C cross-site pathways', () => {
  it('returns an anonymous visitor to the Resource they intended to save', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(anonymousSessionResponse()));
    const resourceId = '11111111-1111-4111-8111-111111111111';

    render(
      <SessionProvider>
        <ResourceEngagementControls resourceId={resourceId} />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/to favorite this Resource/i)).toBeTruthy();
    });

    expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe(
      `/sign-in?continueTo=${encodeURIComponent(`/knowledge/resources/${resourceId}`)}`,
    );
  });

  it('returns an anonymous visitor to their Saved library after sign-in', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(anonymousSessionResponse()));

    render(
      <SessionProvider>
        <SavedExperience />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Sign in to see your saved Knowledge' }),
      ).toBeTruthy();
    });

    expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe(
      '/sign-in?continueTo=%2Fsaved',
    );
  });
});
