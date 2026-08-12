'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../../api/api-error-message';
import {
  confirmEmailVerification,
  requestEmailVerification,
} from '../../identity/identity-lifecycle-api';
import { useSession } from '../../session/session-provider';

export function EmailVerificationPanel() {
  const { state } = useSession();

  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const [token, setToken] = useState('');
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  async function handleRequestVerification(): Promise<void> {
    setRequestSubmitting(true);
    setRequestMessage(null);
    setRequestError(null);

    try {
      await requestEmailVerification();

      setRequestMessage('If verification is still required, a verification email has been sent.');
    } catch (error) {
      setRequestError(getApiErrorMessage(error));
    } finally {
      setRequestSubmitting(false);
    }
  }

  async function handleConfirmation(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setConfirmSubmitting(true);
    setConfirmMessage(null);
    setConfirmError(null);

    try {
      await confirmEmailVerification(token);

      setToken('');
      setConfirmMessage('Your email has been verified.');
    } catch (error) {
      setConfirmError(getApiErrorMessage(error));
    } finally {
      setConfirmSubmitting(false);
    }
  }

  return (
    <>
      <section aria-labelledby="verification-request-title">
        <h2 id="verification-request-title">Request verification</h2>

        {state.status === 'loading' ? <p>Checking your session…</p> : null}

        {state.status === 'anonymous' ? (
          <p>
            <Link href="/sign-in">Sign in</Link> to request a verification email.
          </p>
        ) : null}

        {state.status === 'error' ? (
          <p role="alert">Session status is temporarily unavailable.</p>
        ) : null}

        {state.status === 'authenticated' ? (
          <>
            <p>Send a verification message to your registered email address.</p>

            {requestMessage ? <p role="status">{requestMessage}</p> : null}

            {requestError ? <p role="alert">{requestError}</p> : null}

            <button
              type="button"
              disabled={requestSubmitting}
              onClick={() => {
                void handleRequestVerification();
              }}
            >
              {requestSubmitting ? 'Sending…' : 'Send verification email'}
            </button>
          </>
        ) : null}
      </section>

      <section aria-labelledby="verification-confirm-title">
        <h2 id="verification-confirm-title">Confirm verification</h2>

        <p>Enter the verification token from your email.</p>

        <form onSubmit={handleConfirmation}>
          <div>
            <label htmlFor="email-verification-token">Verification token</label>

            <input
              id="email-verification-token"
              name="token"
              type="text"
              autoComplete="off"
              required
              value={token}
              disabled={confirmSubmitting}
              onChange={(event) => {
                setToken(event.target.value);
              }}
            />
          </div>

          {confirmMessage ? <p role="status">{confirmMessage}</p> : null}

          {confirmError ? <p role="alert">{confirmError}</p> : null}

          <button type="submit" disabled={confirmSubmitting}>
            {confirmSubmitting ? 'Verifying…' : 'Verify email'}
          </button>
        </form>
      </section>
    </>
  );
}
