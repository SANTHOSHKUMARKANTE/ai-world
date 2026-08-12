import { apiRequest } from '../api/api-client';

export async function requestEmailVerification(): Promise<void> {
  await apiRequest('/email-verification/request', {
    method: 'POST',
  });
}

export async function confirmEmailVerification(token: string): Promise<void> {
  await apiRequest('/email-verification/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
    }),
  });
}

export async function requestPasswordRecovery(email: string): Promise<void> {
  await apiRequest('/password-recovery/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });
}

export async function resetPasswordWithRecovery(token: string, password: string): Promise<void> {
  await apiRequest('/password-recovery/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      password,
    }),
  });
}
