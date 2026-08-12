import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SessionProvider, useSession } from '../src/session/session-provider';

function SessionHarness() {
  const { state, signOut } = useSession();

  return (
    <section>
      <p data-testid="session-status">{state.status}</p>

      {state.status === 'authenticated' ? (
        <p data-testid="actor-id">{state.session.actorId}</p>
      ) : null}

      <button
        type="button"
        onClick={() => {
          void signOut();
        }}
      >
        Sign out
      </button>
    </section>
  );
}

function renderSessionHarness() {
  return render(
    <SessionProvider>
      <SessionHarness />
    </SessionProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Session security UX', () => {
  it('treats an API 401 as an anonymous browser Session', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'identity.session.invalid',
            message: 'Authentication is required.',
            status: 401,
            requestId: 'web-session-anonymous-001',
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

    renderSessionHarness();

    await waitFor(() => {
      expect(screen.getByTestId('session-status').textContent).toBe('anonymous');
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/session',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );
  });

  it('stores only public Session state returned by the Session API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          actorId: 'actor-123',
          expiresAt: '2026-08-18T12:00:00.000Z',
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

    renderSessionHarness();

    await waitFor(() => {
      expect(screen.getByTestId('session-status').textContent).toBe('authenticated');
    });

    expect(screen.getByTestId('actor-id').textContent).toBe('actor-123');
  });

  it('logs out through the Session API and returns to anonymous state', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            actorId: 'actor-123',
            expiresAt: '2026-08-18T12:00:00.000Z',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      );

    vi.stubGlobal('fetch', fetchMock);

    renderSessionHarness();

    await waitFor(() => {
      expect(screen.getByTestId('session-status').textContent).toBe('authenticated');
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Sign out',
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-status').textContent).toBe('anonymous');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/session',
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'same-origin',
      }),
    );
  });

  it('fails closed when the Session API returns an unexpected contract', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          token: 'must-not-be-consumed',
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

    renderSessionHarness();

    await waitFor(() => {
      expect(screen.getByTestId('session-status').textContent).toBe('error');
    });

    expect(screen.queryByText('must-not-be-consumed')).toBeNull();
  });
});
