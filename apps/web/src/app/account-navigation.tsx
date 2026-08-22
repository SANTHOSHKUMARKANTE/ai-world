'use client';

import Link from 'next/link';

import { useSession } from '../session/session-provider';
import { Button, LinkButton } from '../ui/primitives';

export function AccountNavigation() {
  const { state, refreshSession, signOut } = useSession();

  switch (state.status) {
    case 'loading':
      return (
        <nav className="aw-account-nav" aria-label="Account">
          <span className="aw-account-status" role="status">
            Checking account…
          </span>
        </nav>
      );

    case 'anonymous':
      return (
        <nav className="aw-account-nav" aria-label="Account">
          <Link className="aw-nav-link" href="/register">
            Create account
          </Link>
          <LinkButton href="/sign-in" variant="secondary" compact>
            Sign in
          </LinkButton>
        </nav>
      );

    case 'authenticated':
      return (
        <nav className="aw-account-nav" aria-label="Account">
          <Link className="aw-nav-link" href="/account">
            Account
          </Link>
          <Button
            variant="secondary"
            compact
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </Button>
        </nav>
      );

    case 'error':
      return (
        <nav className="aw-account-nav" aria-label="Account">
          <span className="aw-account-status">Session unavailable.</span>
          <Button
            variant="secondary"
            compact
            onClick={() => {
              void refreshSession();
            }}
          >
            Retry session
          </Button>
          <Link className="aw-nav-link" href="/sign-in">
            Sign in
          </Link>
        </nav>
      );
  }
}
