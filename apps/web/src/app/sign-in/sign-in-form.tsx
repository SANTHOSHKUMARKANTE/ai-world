'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { signInWithPassword } from '../account/account-api';
import { getApiErrorMessage } from '../../api/api-error-message';
import { useSession } from '../../session/session-provider';

interface SignInFormProps {
  readonly continueTo?: string;
}

export function SignInForm({ continueTo = '/account' }: SignInFormProps) {
  const { state, refreshSession } = useSession();

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

  if (state.status === 'loading') {
    return <p role="status">Checking your account…</p>;
  }

  if (state.status === 'error') {
    return (
      <section aria-labelledby="sign-in-session-error-title">
        <h2 id="sign-in-session-error-title">Account status unavailable</h2>
        <p role="alert">We could not check whether you are already signed in.</p>
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
  }

  if (state.status === 'authenticated' && !completed) {
    return (
      <section aria-labelledby="sign-in-authenticated-title">
        <h2 id="sign-in-authenticated-title">You are already signed in</h2>
        <p>Your secure AI World Session is active.</p>
        <div className="aw-identity-actions">
          <Link href={continueTo}>Continue</Link>
          <Link href="/account">Go to your account</Link>
        </div>
      </section>
    );
  }

  if (completed) {
    return (
      <section aria-labelledby="sign-in-complete-title">
        <h2 id="sign-in-complete-title">Signed in</h2>

        <p>Your secure AI World session is active.</p>

        <div className="aw-identity-actions">
          <Link href={continueTo}>Continue</Link>
          <Link href="/account">Go to your account</Link>
        </div>
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

      <p>
        <Link href="/forgot-password">Forgot your password?</Link>
      </p>
    </form>
  );
}
