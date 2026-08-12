import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PasswordRecoveryRequestForm } from '../src/app/forgot-password/password-recovery-request-form';
import { PasswordRecoveryResetForm } from '../src/app/reset-password/password-recovery-reset-form';
import { EmailVerificationPanel } from '../src/app/verify-email/email-verification-panel';
import { SessionProvider, useSession } from '../src/session/session-provider';

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

function invalidSessionResponse() {
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

function SessionStateProbe() {
  const { state } = useSession();

  return <p data-testid="session-state">{state.status}</p>;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Identity lifecycle UX', () => {
  it('requests email verification only through the authenticated Session', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      );

    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <EmailVerificationPanel />
      </SessionProvider>,
    );

    const button = await screen.findByRole('button', {
      name: 'Send verification email',
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toContain('verification email');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/email-verification/request',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
      }),
    );

    const options = fetchMock.mock.calls[1]?.[1] as RequestInit | undefined;

    expect(options?.body).toBeUndefined();
  });

  it('confirms email verification without requiring an authenticated Session', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(invalidSessionResponse())
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      );

    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <EmailVerificationPanel />
      </SessionProvider>,
    );

    await screen.findByText(/sign in/i);

    fireEvent.change(screen.getByLabelText('Verification token'), {
      target: {
        value: 'verification-token-value',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Verify email',
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Your email has been verified.');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/email-verification/confirm',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          token: 'verification-token-value',
        }),
      }),
    );
  });

  it('uses an enumeration-safe success message for password recovery requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    render(<PasswordRecoveryRequestForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: {
        value: 'person@example.com',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Recover password',
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Check your email',
        }),
      ).toBeTruthy();
    });

    expect(screen.getByText(/if this email can be recovered/i)).toBeTruthy();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/password-recovery/request',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'person@example.com',
        }),
      }),
    );
  });

  it('resets the password and revalidates browser Session state', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(authenticatedSessionResponse())
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      )
      .mockResolvedValueOnce(invalidSessionResponse());

    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <PasswordRecoveryResetForm />
        <SessionStateProbe />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-state').textContent).toBe('authenticated');
    });

    fireEvent.change(screen.getByLabelText('Recovery token'), {
      target: {
        value: 'recovery-token-value',
      },
    });

    fireEvent.change(screen.getByLabelText('New password'), {
      target: {
        value: 'new correct horse battery staple',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Reset password',
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Password reset',
        }),
      ).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/password-recovery/reset',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          token: 'recovery-token-value',
          password: 'new correct horse battery staple',
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

    expect(screen.getByTestId('session-state').textContent).toBe('anonymous');
  });

  it('surfaces a safe API error even when the response has no requestId', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(invalidSessionResponse())
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'identity.password_recovery.invalid_token',
              message: 'The password recovery token is invalid or expired.',
              status: 400,
            },
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <PasswordRecoveryResetForm />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByLabelText('Recovery token'), {
      target: {
        value: 'invalid-token',
      },
    });

    fireEvent.change(screen.getByLabelText('New password'), {
      target: {
        value: 'new correct horse battery staple',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Reset password',
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'The password recovery token is invalid or expired.',
      );
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/password-recovery/reset',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          token: 'invalid-token',
          password: 'new correct horse battery staple',
        }),
      }),
    );
  });
});
