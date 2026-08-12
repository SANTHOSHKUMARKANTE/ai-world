'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../../api/api-error-message';
import { resetPasswordWithRecovery } from '../../identity/identity-lifecycle-api';
import { useSession } from '../../session/session-provider';

export function PasswordRecoveryResetForm() {
  const { refreshSession } = useSession();

  const [token, setToken] = useState('');
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

      setToken('');
      setPassword('');

      await refreshSession();

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
            setToken(event.target.value);
          }}
        />
      </div>

      <div>
        <label htmlFor="password-recovery-new-password">New password</label>

        <input
          id="password-recovery-new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          disabled={submitting}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Resetting…' : 'Reset password'}
      </button>
    </form>
  );
}
