import { IdentityPage } from '../../identity/identity-page';

import { EmailVerificationPanel } from './email-verification-panel';

export default function VerifyEmailPage() {
  return (
    <IdentityPage
      eyebrow="Account security"
      title="Email verification"
      description="Request a verification message while signed in, or confirm a single-use token delivered to your email."
    >
      <EmailVerificationPanel />
    </IdentityPage>
  );
}
