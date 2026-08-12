import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RegisterForm } from '../src/app/register/register-form';
import { SignInForm } from '../src/app/sign-in/sign-in-form';
import { SessionProvider, useSession } from '../src/session/session-provider';

function SessionStateProbe() {
  const { state } = useSession();

  return (
    <p data-testid="session-state">
      {state.status === 'authenticated' ? `${state.status}:${state.session.actorId}` : state.status}
    </p>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Account entry UX', () => {
  it('registers through the Web API boundary and never displays returned identifiers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          actorId: 'registration-actor-id',
          userId: 'registration-user-id',
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: {
        value: 'person@example.com',
      },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: {
        value: 'correct horse battery staple',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create account',
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Account created',
        }),
      ).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/registration',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          email: 'person@example.com',
          password: 'correct horse battery staple',
        }),
      }),
    );

    expect(screen.queryByText('registration-actor-id')).toBeNull();

    expect(screen.queryByText('registration-user-id')).toBeNull();
  });

  it('shows the safe registration API error message', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'identity.registration.email_conflict',
            message: 'Registration could not be completed with this email.',
            status: 409,
            requestId: 'web-registration-conflict-001',
          },
        }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: {
        value: 'duplicate@example.com',
      },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: {
        value: 'correct horse battery staple',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create account',
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'Registration could not be completed with this email.',
      );
    });
  });

  it('establishes authenticated browser state from GET /session after password sign-in', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'identity.session.invalid',
              message: 'Authentication is required.',
              status: 401,
              requestId: 'web-session-before-sign-in-001',
            },
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            actorId: 'authentication-response-actor',
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
        new Response(
          JSON.stringify({
            actorId: 'validated-session-actor',
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

    render(
      <SessionProvider>
        <SignInForm />
        <SessionStateProbe />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-state').textContent).toBe('anonymous');
    });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: {
        value: 'person@example.com',
      },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: {
        value: 'correct horse battery staple',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Sign in',
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-state').textContent).toBe(
        'authenticated:validated-session-actor',
      );
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/authentication/password',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          email: 'person@example.com',
          password: 'correct horse battery staple',
        }),
      }),
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/api/session',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );

    expect(screen.queryByText('authentication-response-actor')).toBeNull();
  });

  it('shows the canonical safe invalid-credentials message without exposing account existence', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'identity.session.invalid',
              message: 'Authentication is required.',
              status: 401,
              requestId: 'web-session-before-invalid-sign-in-001',
            },
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'identity.authentication.invalid_credentials',
              message: 'The email or password is incorrect.',
              status: 401,
              requestId: 'web-invalid-sign-in-001',
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

    render(
      <SessionProvider>
        <SignInForm />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: {
        value: 'person@example.com',
      },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: {
        value: 'wrong password value',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Sign in',
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe('The email or password is incorrect.');
    });

    expect(screen.queryByText(/unknown email/i)).toBeNull();
    expect(screen.queryByText(/wrong password/i)).toBeNull();
  });
});
