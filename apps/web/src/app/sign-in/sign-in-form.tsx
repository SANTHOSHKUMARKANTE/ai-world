'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { signInWithPassword } from '../account/account-api';
import { getApiErrorMessage } from '../../api/api-error-message';
import { useSession } from '../../session/session-provider';

export function SignInForm() {
  const { refreshSession } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await signInWithPassword({
        email,
        password,
      });

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
      <section aria-labelledby="sign-in-complete-title">
        <h2 id="sign-in-complete-title">Signed in</h2>

        <p>Your secure AI World session is active.</p>

        <Link href="/">Continue to AI World</Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="sign-in-email">Email</label>

        <input
          id="sign-in-email"
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

      <div>
        <label htmlFor="sign-in-password">Password</label>

        <input
          id="sign-in-password"
          name="password"
          type="password"
          autoComplete="current-password"
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
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>

      <p>
        Need an account? <Link href="/register">Create one</Link>
      </p>
    </form>
  );
}
