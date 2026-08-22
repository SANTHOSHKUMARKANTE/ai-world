import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AccountPanel } from '../src/app/account/account-panel';
import { EmailVerificationPanel } from '../src/app/verify-email/email-verification-panel';
import { IdentityPage } from '../src/identity/identity-page';
import { SessionProvider } from '../src/session/session-provider';

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

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('WPR-M02 Identity and Account product UX', () => {
  it('provides one reusable semantic Identity page presentation', () => {
    const { container } = render(
      <IdentityPage
        eyebrow="Account security"
        title="Identity proof"
        description="A coherent account experience."
      >
        <form>
          <label htmlFor="identity-proof-email">Email</label>
          <input id="identity-proof-email" type="email" />
        </form>
      </IdentityPage>,
    );

    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Identity proof' })).toBeTruthy();
    expect(screen.getByText('A coherent account experience.')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(container.querySelector('.aw-identity-card')).toBeTruthy();
  });

  it('keeps anonymous Account recovery actions clear without exposing identifiers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(anonymousSessionResponse()));

    render(
      <SessionProvider>
        <AccountPanel />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('You are signed out.')).toBeTruthy();
    });

    expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe('/sign-in');
    expect(screen.getByRole('link', { name: 'Create account' }).getAttribute('href')).toBe(
      '/register',
    );
    expect(screen.queryByText(/actor/i)).toBeNull();
    expect(screen.queryByText(/profile-user-id/i)).toBeNull();
  });

  it('keeps token confirmation available to an anonymous visitor while verification request requires sign-in', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(anonymousSessionResponse()));

    render(
      <SessionProvider>
        <EmailVerificationPanel />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/to request a verification email/i)).toBeTruthy();
    });

    expect(screen.getByRole('heading', { name: 'Confirm verification' })).toBeTruthy();
    expect(screen.getByLabelText('Verification token')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Verify email' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Send verification email' })).toBeNull();
  });
});
