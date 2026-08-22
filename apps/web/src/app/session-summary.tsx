'use client';

import { useSession } from '../session/session-provider';
import { Button, Surface } from '../ui/primitives';

export function SessionSummary() {
  const { state, refreshSession } = useSession();

  switch (state.status) {
    case 'loading':
      return (
        <Surface className="aw-session-card" aria-live="polite">
          <div className="aw-session-card-copy">
            <strong>Checking your AI World session</strong>
            <p role="status">Your public experience is available while we check your account.</p>
          </div>
        </Surface>
      );

    case 'anonymous':
      return (
        <Surface className="aw-session-card" aria-live="polite">
          <div className="aw-session-card-copy">
            <strong>Explore as a guest</strong>
            <p>Sign in when you want account and authorized creator tools.</p>
          </div>
        </Surface>
      );

    case 'authenticated':
      return (
        <Surface className="aw-session-card" aria-live="polite">
          <div className="aw-session-card-copy">
            <strong>You are signed in</strong>
            <p>
              Your account and authorized creator tools are available from the global navigation.
            </p>
          </div>
        </Surface>
      );

    case 'error':
      return (
        <Surface className="aw-session-card" aria-live="polite">
          <div className="aw-session-card-copy">
            <strong>We could not check your session</strong>
            <p role="alert">
              Public exploration still works. Retry after the API is available again.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              void refreshSession();
            }}
          >
            Retry session
          </Button>
        </Surface>
      );
  }
}
