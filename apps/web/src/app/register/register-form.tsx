'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../../api/api-error-message';
import { useSession } from '../../session/session-provider';
import { registerAccount } from '../account/account-api';

const REGISTRATION_PASSWORD_MIN_LENGTH = 15;
const REGISTRATION_PASSWORD_MAX_LENGTH = 128;

export function RegisterForm() {
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
      await registerAccount({
        email,
        password,
      });

      setPassword('');
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
      <section aria-labelledby="registration-session-error-title">
        <h2 id="registration-session-error-title">Account status unavailable</h2>
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

  if (state.status === 'authenticated') {
    return (
      <section aria-labelledby="registration-authenticated-title">
        <h2 id="registration-authenticated-title">You are already signed in</h2>
        <p>Manage your profile and secure Session from your account.</p>
        <div className="aw-identity-actions">
          <Link href="/account">Go to your account</Link>
          <Link href="/">Continue exploring</Link>
        </div>
      </section>
    );
  }

  if (completed) {
    return (
      <section aria-labelledby="registration-complete-title">
        <h2 id="registration-complete-title">Account created</h2>

        <p>Your account is ready. Sign in next, then request an email verification message.</p>

        <div className="aw-identity-actions">
          <Link href="/sign-in?continueTo=%2Fverify-email">Sign in and verify your email</Link>
          <Link href="/sign-in">Sign in to your account</Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="registration-email">Email</label>

        <input
          id="registration-email"
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
        <label htmlFor="registration-password">Password</label>

        <input
          id="registration-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
          maxLength={REGISTRATION_PASSWORD_MAX_LENGTH}
          aria-describedby="registration-password-requirements"
          value={password}
          disabled={submitting}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <p id="registration-password-requirements" className="aw-identity-hint">
          Use {REGISTRATION_PASSWORD_MIN_LENGTH}–{REGISTRATION_PASSWORD_MAX_LENGTH} characters.
        </p>
      </div>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </button>

      <p>
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>

      <p>
        Need help accessing an existing account?{' '}
        <Link href="/forgot-password">Recover your password</Link>
      </p>
    </form>
  );
}
