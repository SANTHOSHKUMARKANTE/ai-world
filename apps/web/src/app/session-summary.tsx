'use client';

import { useSession } from '../session/session-provider';

export function SessionSummary() {
  const { state } = useSession();

  switch (state.status) {
    case 'loading':
      return <p>Checking your session…</p>;

    case 'anonymous':
      return <p>You are signed out.</p>;

    case 'authenticated':
      return <p>You are signed in.</p>;

    case 'error':
      return <p>Session status is temporarily unavailable.</p>;
  }
}
