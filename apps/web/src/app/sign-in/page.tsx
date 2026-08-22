import Link from 'next/link';

import { IdentityPage } from '../../identity/identity-page';

import { SignInForm } from './sign-in-form';

export default function SignInPage() {
  return (
    <IdentityPage
      eyebrow="Welcome back"
      title="Sign in"
      description="Continue with your secure AI World session. Your account identity stays separate from public content and Universe presentation."
    >
      <SignInForm />

      <p className="aw-identity-support-link">
        <Link href="/forgot-password">Forgot your password?</Link>
      </p>
    </IdentityPage>
  );
}
