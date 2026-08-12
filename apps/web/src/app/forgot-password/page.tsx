import Link from 'next/link';

import { PasswordRecoveryRequestForm } from './password-recovery-request-form';

export default function ForgotPasswordPage() {
  return (
    <main>
      <Link href="/">AI World</Link>

      <h1>Recover your password</h1>

      <PasswordRecoveryRequestForm />
    </main>
  );
}
