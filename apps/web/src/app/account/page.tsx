import Link from 'next/link';

import { AccountPanel } from './account-panel';

export default function AccountPage() {
  return (
    <main>
      <Link href="/">AI World</Link>

      <h1>Your account</h1>

      <AccountPanel />

      <nav aria-label="Account security">
        <Link href="/verify-email">Verify your email</Link>
      </nav>
    </main>
  );
}
