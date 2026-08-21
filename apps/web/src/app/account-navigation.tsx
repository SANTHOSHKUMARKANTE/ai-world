'use client';

import Link from 'next/link';

import { useSession } from '../session/session-provider';

export function AccountNavigation() {
  const { state, signOut } = useSession();

  switch (state.status) {
    case 'loading':
      return null;

    case 'anonymous':
      return (
        <nav aria-label="Account">
          <Link href="/register">Create account</Link> <Link href="/sign-in">Sign in</Link>
        </nav>
      );

    case 'authenticated':
      return (
        <nav aria-label="Account">
          <Link href="/creator">Creator</Link> <Link href="/account">Account</Link>{' '}
          <button
            type="button"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </button>
        </nav>
      );

    case 'error':
      return (
        <nav aria-label="Account">
          <Link href="/sign-in">Sign in</Link>
        </nav>
      );
  }
}
