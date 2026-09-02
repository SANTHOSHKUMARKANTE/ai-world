import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RegisterForm } from '../src/app/register/register-form';
import { SignInForm } from '../src/app/sign-in/sign-in-form';
import { resolveIdentityContinuePath } from '../src/identity/identity-continue-path';
import { SessionProvider, useSession } from '../src/session/session-provider';

function anonymousSessionResponse() {
  return new Response(
    JSON.stringify({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
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

function authenticatedSessionResponse() {
  return new Response(
    JSON.stringify({
      actorId: 'authenticated-actor',
      expiresAt: '2026-09-02T12:00:00.000Z',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

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
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(anonymousSessionResponse())
      .mockResolvedValueOnce(
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

    render(
      <SessionProvider>
        <RegisterForm />
      </SessionProvider>,
    );

    await screen.findByRole('button', { name: 'Create account' });

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

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
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
    expect(
      screen.getByRole('link', { name: 'Sign in and verify your email' }).getAttribute('href'),
    ).toBe('/sign-in?continueTo=%2Fverify-email');
  });

  it('shows the safe registration API error message', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(anonymousSessionResponse())
      .mockResolvedValueOnce(
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

    render(
      <SessionProvider>
        <RegisterForm />
      </SessionProvider>,
    );

    await screen.findByRole('button', { name: 'Create account' });

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

  it('communicates the canonical registration password length before submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(anonymousSessionResponse()));

    render(
      <SessionProvider>
        <RegisterForm />
      </SessionProvider>,
    );

    const password = await screen.findByLabelText('Password');

    expect(password.getAttribute('minlength')).toBe('15');
    expect(password.getAttribute('maxlength')).toBe('128');
    expect(password.getAttribute('aria-describedby')).toBe('registration-password-requirements');
    expect(screen.getByText('Use 15–128 characters.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Recover your password' }).getAttribute('href')).toBe(
      '/forgot-password',
    );
  });

  it('does not show duplicate registration or sign-in forms to an authenticated visitor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(authenticatedSessionResponse));

    const { unmount } = render(
      <SessionProvider>
        <RegisterForm />
      </SessionProvider>,
    );

    await screen.findByRole('heading', { name: 'You are already signed in' });

    expect(screen.queryByRole('button', { name: 'Create account' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Go to your account' }).getAttribute('href')).toBe(
      '/account',
    );

    unmount();

    render(
      <SessionProvider>
        <SignInForm continueTo="/saved" />
      </SessionProvider>,
    );

    await screen.findByRole('heading', { name: 'You are already signed in' });

    expect(screen.queryByRole('button', { name: 'Sign in' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Continue' }).getAttribute('href')).toBe('/saved');
  });

  it('accepts only local first-party continuation paths', () => {
    expect(resolveIdentityContinuePath('/saved?view=collections')).toBe('/saved?view=collections');
    expect(resolveIdentityContinuePath('https://malicious.example')).toBe('/account');
    expect(resolveIdentityContinuePath('//malicious.example')).toBe('/account');
    expect(resolveIdentityContinuePath('/\\malicious.example')).toBe('/account');
    expect(resolveIdentityContinuePath('/sign-in?continueTo=/saved')).toBe('/account');
    expect(resolveIdentityContinuePath('/register')).toBe('/account');
    expect(resolveIdentityContinuePath(['/saved'])).toBe('/account');
  });
});
