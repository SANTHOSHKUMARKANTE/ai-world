import { ApiClientError, apiRequest } from '../api/api-client';

export interface WebSession {
  readonly actorId: string;
  readonly expiresAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWebSession(value: unknown): value is WebSession {
  if (!isRecord(value)) {
    return false;
  }

  if (typeof value.actorId !== 'string' || typeof value.expiresAt !== 'string') {
    return false;
  }

  return !Number.isNaN(Date.parse(value.expiresAt));
}

export async function getCurrentSession(): Promise<WebSession | null> {
  try {
    const response = await apiRequest('/session');

    const payload: unknown = await response.json();

    if (!isWebSession(payload)) {
      throw new Error('Session API response did not match the expected contract.');
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function logoutCurrentSession(): Promise<void> {
  await apiRequest('/session', {
    method: 'DELETE',
  });
}
