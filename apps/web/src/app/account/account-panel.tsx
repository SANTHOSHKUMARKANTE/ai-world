'use client';

import Link from 'next/link';
import { type FormEvent, useCallback, useEffect, useState } from 'react';

import { ApiClientError } from '../../api/api-client';
import { getApiErrorMessage } from '../../api/api-error-message';
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from '../../profile/user-profile-api';
import { useSession } from '../../session/session-provider';

type ProfileState =
  | {
      readonly status: 'loading';
    }
  | {
      readonly status: 'ready';
      readonly profile: UserProfile;
    }
  | {
      readonly status: 'error';
      readonly message: string;
    };

const DISPLAY_NAME_MAX_LENGTH = 80;

function isUnauthenticated(error: unknown): boolean {
  return error instanceof ApiClientError && error.status === 401;
}

interface AuthenticatedAccountProps {
  readonly actorId: string;
  readonly refreshSession: () => Promise<void>;
  readonly signOut: () => Promise<void>;
}

function AuthenticatedAccount({ actorId, refreshSession, signOut }: AuthenticatedAccountProps) {
  const [profileState, setProfileState] = useState<ProfileState>({
    status: 'loading',
  });

  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProfile = useCallback(
    async (isActive: () => boolean = () => true): Promise<void> => {
      setProfileState({ status: 'loading' });

      try {
        const profile = await getUserProfile();
        if (!isActive()) {
          return;
        }

        setProfileState({ status: 'ready', profile });
        setDisplayName(profile.displayName ?? '');
      } catch (error) {
        if (!isActive()) {
          return;
        }

        if (isUnauthenticated(error)) {
          await refreshSession();
          return;
        }

        setProfileState({
          status: 'error',
          message: getApiErrorMessage(error),
        });
      }
    },
    [refreshSession],
  );

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => loadProfile(() => active));

    return () => {
      active = false;
    };
  }, [actorId, loadProfile]);

  async function persistDisplayName(nextDisplayName: string | null): Promise<void> {
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const profile = await updateUserProfile({
        displayName: nextDisplayName,
      });

      setProfileState({
        status: 'ready',
        profile,
      });

      setDisplayName(profile.displayName ?? '');
      setSuccessMessage('Profile updated.');
    } catch (error) {
      if (isUnauthenticated(error)) {
        await refreshSession();

        return;
      }

      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    await persistDisplayName(displayName);
  }

  async function handleSignOut(): Promise<void> {
    setSigningOut(true);
    await signOut();
  }

  if (profileState.status === 'loading') {
    return <p role="status">Loading your profile…</p>;
  }

  if (profileState.status === 'error') {
    return (
      <section>
        <p role="alert">{profileState.message}</p>

        <button
          type="button"
          onClick={() => {
            void loadProfile();
          }}
        >
          Retry profile
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="profile-title">
      <h2 id="profile-title">Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="profile-display-name">Display name</label>

          <input
            id="profile-display-name"
            name="displayName"
            type="text"
            autoComplete="name"
            maxLength={DISPLAY_NAME_MAX_LENGTH}
            aria-describedby="profile-display-name-requirements"
            value={displayName}
            disabled={submitting}
            onChange={(event) => {
              setDisplayName(event.target.value);
            }}
          />
          <p id="profile-display-name-requirements" className="aw-identity-hint">
            Use up to {DISPLAY_NAME_MAX_LENGTH} characters, or clear the name to keep it private.
          </p>
        </div>

        {successMessage ? <p role="status">{successMessage}</p> : null}

        {errorMessage ? <p role="alert">{errorMessage}</p> : null}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save profile'}
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() => {
            void persistDisplayName(null);
          }}
        >
          Clear display name
        </button>
      </form>

      <section aria-labelledby="session-actions-title">
        <h2 id="session-actions-title">Session</h2>

        <p>Your secure Session is active.</p>

        <button
          type="button"
          disabled={signingOut}
          onClick={() => {
            void handleSignOut();
          }}
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </section>
    </section>
  );
}

export function AccountPanel() {
  const { state, refreshSession, signOut } = useSession();

  switch (state.status) {
    case 'loading':
      return <p role="status">Checking your session…</p>;

    case 'anonymous':
      return (
        <section>
          <p>You are signed out.</p>
          <Link href="/sign-in">Sign in</Link> <Link href="/register">Create account</Link>
        </section>
      );

    case 'error':
      return (
        <section>
          <p role="alert">Session status is temporarily unavailable.</p>

          <button
            type="button"
            onClick={() => {
              void refreshSession();
            }}
          >
            Try again
          </button>
        </section>
      );

    case 'authenticated':
      return (
        <AuthenticatedAccount
          key={state.session.actorId}
          actorId={state.session.actorId}
          refreshSession={refreshSession}
          signOut={signOut}
        />
      );
  }
}
