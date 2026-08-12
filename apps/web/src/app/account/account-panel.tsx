'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void getUserProfile()
      .then((profile) => {
        if (!active) {
          return;
        }

        setProfileState({
          status: 'ready',
          profile,
        });

        setDisplayName(profile.displayName ?? '');
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        if (isUnauthenticated(error)) {
          void refreshSession();

          return;
        }

        setProfileState({
          status: 'error',
          message: getApiErrorMessage(error),
        });
      });

    return () => {
      active = false;
    };
  }, [actorId, refreshSession]);

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

  if (profileState.status === 'loading') {
    return <p>Loading your profile…</p>;
  }

  if (profileState.status === 'error') {
    return (
      <section>
        <p role="alert">{profileState.message}</p>

        <button
          type="button"
          onClick={() => {
            void refreshSession();
          }}
        >
          Check session
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
            value={displayName}
            disabled={submitting}
            onChange={(event) => {
              setDisplayName(event.target.value);
            }}
          />
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
          onClick={() => {
            void signOut();
          }}
        >
          Sign out
        </button>
      </section>
    </section>
  );
}

export function AccountPanel() {
  const { state, refreshSession, signOut } = useSession();

  switch (state.status) {
    case 'loading':
      return <p>Checking your session…</p>;

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
