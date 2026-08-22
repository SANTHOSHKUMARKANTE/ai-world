import { IdentityPage } from '../../identity/identity-page';

import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <IdentityPage
      eyebrow="Join AI World"
      title="Create your account"
      description="One secure account gives you a consistent identity across AI World while public exploration stays open."
    >
      <RegisterForm />
    </IdentityPage>
  );
}
