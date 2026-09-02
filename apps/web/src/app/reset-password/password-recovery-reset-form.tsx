'use client';

import Link from 'next/link';
import { type FormEvent, useState, useSyncExternalStore } from 'react';

import { getApiErrorMessage } from '../../api/api-error-message';
import { resetPasswordWithRecovery } from '../../identity/identity-lifecycle-api';
import {
  clearIdentityLifecycleTokenFragment,
  readIdentityLifecycleTokenFragment,
} from '../../identity/identity-lifecycle-token-fragment';
import { useSession } from '../../session/session-provider';

const PASSWORD_RECOVERY_MIN_LENGTH = 15;
const PASSWORD_RECOVERY_MAX_LENGTH = 128;

function subscribeToIdentityLifecycleLocation(onStoreChange: () => void): () => void {
  window.addEventListener('hashchange', onStoreChange);
  window.addEventListener('popstate', onStoreChange);

  return () => {
    window.removeEventListener('hashchange', onStoreChange);
    window.removeEventListener('popstate', onStoreChange);
  };
}

function getServerIdentityLifecycleTokenFragment(): string | null {
  return null;
}

export function PasswordRecoveryResetForm() {
  const { refreshSession } = useSession();
  const linkedToken = useSyncExternalStore(
    subscribeToIdentityLifecycleLocation,
    readIdentityLifecycleTokenFragment,
    getServerIdentityLifecycleTokenFragment,
  );
  const [manualToken, setManualToken] = useState('');
  const token = linkedToken ?? manualToken;
  const tokenFromLink = linkedToken !== null;
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await resetPasswordWithRecovery(token, password);
      setManualToken('');
      setPassword('');

      await refreshSession();

      clearIdentityLifecycleTokenFragment();
      setCompleted(true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (completed) {
    return (
      <section aria-labelledby="password-reset-complete-title">
        <h2 id="password-reset-complete-title">Password reset</h2>
        <p>
          Your password has been changed. Existing sessions for the recovered account have been
          revoked.
        </p>

        <Link href="/sign-in">Sign in with your new password</Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {tokenFromLink ? (
        <p role="status" className="aw-identity-hint">
          Recovery link recognized. Choose a new password to continue.
        </p>
      ) : (
        <div>
          <label htmlFor="password-recovery-token">Recovery token</label>
          <input
            id="password-recovery-token"
            name="token"
            type="text"
            autoComplete="off"
            required
            value={token}
            disabled={submitting}
            onChange={(event) => {
              setManualToken(event.target.value);
            }}
          />
        </div>
      )}

      <div>
        <label htmlFor="password-recovery-new-password">New password</label>
        <input
          id="password-recovery-new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={PASSWORD_RECOVERY_MIN_LENGTH}
          maxLength={PASSWORD_RECOVERY_MAX_LENGTH}
          aria-describedby="password-recovery-password-requirements"
          value={password}
          disabled={submitting}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <p id="password-recovery-password-requirements" className="aw-identity-hint">
          Use {PASSWORD_RECOVERY_MIN_LENGTH}–{PASSWORD_RECOVERY_MAX_LENGTH} characters.
        </p>
      </div>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      <button type="submit" disabled={submitting || token.length === 0}>
        {submitting ? 'Resetting…' : 'Reset password'}
      </button>
    </form>
  );
}
