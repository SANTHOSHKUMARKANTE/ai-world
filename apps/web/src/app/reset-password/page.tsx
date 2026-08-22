import { IdentityPage } from '../../identity/identity-page';

import { PasswordRecoveryResetForm } from './password-recovery-reset-form';

export default function ResetPasswordPage() {
  return (
    <IdentityPage
      eyebrow="Account recovery"
      title="Reset your password"
      description="Use the single-use recovery token from your email and choose a new password for your AI World account."
    >
      <PasswordRecoveryResetForm />
    </IdentityPage>
  );
}
