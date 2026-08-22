import { IdentityPage } from '../../identity/identity-page';

import { PasswordRecoveryRequestForm } from './password-recovery-request-form';

export default function ForgotPasswordPage() {
  return (
    <IdentityPage
      eyebrow="Account recovery"
      title="Recover your password"
      description="Request a recovery message without revealing whether an email address belongs to an AI World account."
    >
      <PasswordRecoveryRequestForm />
    </IdentityPage>
  );
}
