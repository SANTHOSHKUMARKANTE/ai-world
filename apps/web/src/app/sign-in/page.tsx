import { IdentityPage } from '../../identity/identity-page';
import { resolveIdentityContinuePath } from '../../identity/identity-continue-path';

import { SignInForm } from './sign-in-form';

interface SignInPageProps {
  readonly searchParams: Promise<{
    readonly continueTo?: string | string[];
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { continueTo } = await searchParams;

  return (
    <IdentityPage
      eyebrow="Welcome back"
      title="Sign in"
      description="Continue with your secure AI World session. Your account identity stays separate from public content and Universe presentation."
    >
      <SignInForm continueTo={resolveIdentityContinuePath(continueTo)} />
    </IdentityPage>
  );
}
