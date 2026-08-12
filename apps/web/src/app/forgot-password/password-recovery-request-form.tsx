'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../../api/api-error-message';
import { requestPasswordRecovery } from '../../identity/identity-lifecycle-api';

export function PasswordRecoveryRequestForm() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await requestPasswordRecovery(email);

      setCompleted(true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (completed) {
    return (
      <section aria-labelledby="recovery-request-complete-title">
        <h2 id="recovery-request-complete-title">Check your email</h2>

        <p>If this email can be recovered, password recovery instructions have been sent.</p>

        <Link href="/reset-password">Enter your recovery token</Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password-recovery-email">Email</label>

        <input
          id="password-recovery-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          disabled={submitting}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </div>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Requesting recovery…' : 'Recover password'}
      </button>

      <p>
        <Link href="/sign-in">Back to sign in</Link>
      </p>
    </form>
  );
}
