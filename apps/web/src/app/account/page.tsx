import Link from 'next/link';

import { IdentityPage } from '../../identity/identity-page';

import { AccountPanel } from './account-panel';

export default function AccountPage() {
  return (
    <IdentityPage
      eyebrow="Your AI World"
      title="Your account"
      description="Manage the profile information you choose to show and the security actions tied to your current session."
    >
      <AccountPanel />

      <nav className="aw-identity-security-links" aria-label="Account security">
        <Link href="/verify-email">Verify your email</Link>
        <Link href="/forgot-password">Recover your password</Link>
      </nav>
    </IdentityPage>
  );
}
