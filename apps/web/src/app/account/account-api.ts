import { apiRequest } from '../../api/api-client';

export interface RegisterAccountInput {
  readonly email: string;
  readonly password: string;
}

export interface SignInWithPasswordInput {
  readonly email: string;
  readonly password: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRegistrationResponse(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.actorId === 'string' && typeof value.userId === 'string';
}

function isPasswordAuthenticationResponse(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.actorId === 'string';
}

export async function registerAccount(input: RegisterAccountInput): Promise<void> {
  const response = await apiRequest('/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload: unknown = await response.json();

  if (!isRegistrationResponse(payload)) {
    throw new Error('Registration API response did not match the expected contract.');
  }
}

export async function signInWithPassword(input: SignInWithPasswordInput): Promise<void> {
  const response = await apiRequest('/authentication/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload: unknown = await response.json();

  if (!isPasswordAuthenticationResponse(payload)) {
    throw new Error('Password authentication API response did not match the expected contract.');
  }
}
