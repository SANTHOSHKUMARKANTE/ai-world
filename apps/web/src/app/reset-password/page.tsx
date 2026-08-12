import Link from 'next/link';

import { PasswordRecoveryResetForm } from './password-recovery-reset-form';

export default function ResetPasswordPage() {
  return (
    <main>
      <Link href="/">AI World</Link>

      <h1>Reset your password</h1>

      <PasswordRecoveryResetForm />
    </main>
  );
}
