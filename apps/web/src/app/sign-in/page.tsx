import Link from 'next/link';

import { SignInForm } from './sign-in-form';

export default function SignInPage() {
  return (
    <main>
      <Link href="/">AI World</Link>

      <h1>Sign in</h1>

      <SignInForm />

      <p>
        <Link href="/forgot-password">Forgot your password?</Link>
      </p>
    </main>
  );
}
