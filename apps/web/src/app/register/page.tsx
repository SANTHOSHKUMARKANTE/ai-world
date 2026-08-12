import Link from 'next/link';

import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <main>
      <Link href="/">AI World</Link>

      <h1>Create your account</h1>

      <RegisterForm />
    </main>
  );
}
