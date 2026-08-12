'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../../api/api-error-message';
import { registerAccount } from '../account/account-api';

export function RegisterForm() {
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

  if (completed) {
    return (
      <section aria-labelledby="registration-complete-title">
        <h2 id="registration-complete-title">Account created</h2>

        <p>Your AI World account has been created successfully.</p>

        <Link href="/sign-in">Sign in to continue</Link>
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
          value={password}
          disabled={submitting}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </button>

      <p>
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </form>
  );
}
