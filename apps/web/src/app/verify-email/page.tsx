import Link from 'next/link';

import { EmailVerificationPanel } from './email-verification-panel';

export default function VerifyEmailPage() {
  return (
    <main>
      <Link href="/">AI World</Link>

      <h1>Email verification</h1>

      <EmailVerificationPanel />
    </main>
  );
}
