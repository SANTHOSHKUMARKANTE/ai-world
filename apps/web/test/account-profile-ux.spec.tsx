import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AccountPanel } from '../src/app/account/account-panel';
import { SessionProvider } from '../src/session/session-provider';

function authenticatedSessionResponse() {
  return new Response(
    JSON.stringify({
      actorId: 'authenticated-actor',
      expiresAt: '2026-08-18T12:00:00.000Z',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

function profileResponse(displayName: string | null) {
  return new Response(
    JSON.stringify({
      userId: 'profile-user-id',
      displayName,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

function invalidSessionResponse() {
  return new Response(
    JSON.stringify({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'web-account-session-invalid-001',
      },
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

function renderAccount() {
  return render(
    <SessionProvider>
      <AccountPanel />
    </SessionProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Account profile UX', () => {
  it('loads the profile only after the Session establishes the authenticated Actor', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(profileResponse('Ada Lovelace'));

    vi.stubGlobal('fetch', fetchMock);

    renderAccount();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Ada Lovelace')).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/session',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/user-profile',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );

    expect(screen.queryByText('profile-user-id')).toBeNull();
    expect(screen.queryByText('authenticated-actor')).toBeNull();
  });

  it('updates only displayName and consumes the canonical profile response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(profileResponse(null))
      .mockResolvedValueOnce(profileResponse('Grace Hopper'));

    vi.stubGlobal('fetch', fetchMock);

    renderAccount();

    const input = await screen.findByLabelText('Display name');

    fireEvent.change(input, {
      target: {
        value: '  Grace Hopper  ',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Save profile',
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Profile updated.');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/api/user-profile',
      expect.objectContaining({
        method: 'PATCH',
        credentials: 'same-origin',
        body: JSON.stringify({
          displayName: '  Grace Hopper  ',
        }),
      }),
    );

    expect(screen.getByLabelText<HTMLInputElement>('Display name').value).toBe('Grace Hopper');

    const requestOptions = fetchMock.mock.calls[2]?.[1] as RequestInit | undefined;

    const requestBody =
      typeof requestOptions?.body === 'string' ? JSON.parse(requestOptions.body) : null;

    expect(requestBody).toEqual({
      displayName: '  Grace Hopper  ',
    });

    expect(requestBody).not.toHaveProperty('actorId');
    expect(requestBody).not.toHaveProperty('userId');
  });

  it('clears the display name through explicit null', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(profileResponse('Existing Name'))
      .mockResolvedValueOnce(profileResponse(null));

    vi.stubGlobal('fetch', fetchMock);

    renderAccount();

    await screen.findByDisplayValue('Existing Name');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear display name',
      }),
    );

    await waitFor(() => {
      expect(screen.getByLabelText<HTMLInputElement>('Display name').value).toBe('');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/api/user-profile',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          displayName: null,
        }),
      }),
    );
  });

  it('logs out through DELETE /session and returns the account UX to signed-out state', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(profileResponse(null))
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      );

    vi.stubGlobal('fetch', fetchMock);

    renderAccount();

    await screen.findByLabelText('Display name');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Sign out',
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('You are signed out.')).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/api/session',
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'same-origin',
      }),
    );
  });

  it('returns to anonymous state when the profile operation discovers an invalid Session', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(invalidSessionResponse())
      .mockResolvedValueOnce(invalidSessionResponse());

    vi.stubGlobal('fetch', fetchMock);

    renderAccount();

    await waitFor(() => {
      expect(screen.getByText('You are signed out.')).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/api/session',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );

    expect(screen.queryByLabelText('Display name')).toBeNull();
  });

  it('retries profile loading without exposing internal identity', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'user.profile.unavailable',
              message: 'Profile is temporarily unavailable.',
              status: 503,
              requestId: 'web-profile-unavailable-001',
            },
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } },
        ),
      )
      .mockResolvedValueOnce(profileResponse('Retry Success'));

    vi.stubGlobal('fetch', fetchMock);
    renderAccount();

    await screen.findByRole('button', { name: 'Retry profile' });
    fireEvent.click(screen.getByRole('button', { name: 'Retry profile' }));

    await screen.findByDisplayValue('Retry Success');
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/api/user-profile',
      expect.objectContaining({ credentials: 'same-origin' }),
    );
    expect(screen.queryByText('authenticated-actor')).toBeNull();
    expect(screen.queryByText('profile-user-id')).toBeNull();
  });
});
