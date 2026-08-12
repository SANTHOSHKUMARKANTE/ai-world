import { apiRequest } from '../api/api-client';

export interface UserProfile {
  readonly userId: string;
  readonly displayName: string | null;
}

export interface UpdateUserProfileInput {
  readonly displayName: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUserProfile(value: unknown): value is UserProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.userId === 'string' &&
    (typeof value.displayName === 'string' || value.displayName === null)
  );
}

async function readUserProfileResponse(response: Response): Promise<UserProfile> {
  const payload: unknown = await response.json();

  if (!isUserProfile(payload)) {
    throw new Error('User Profile API response did not match the expected contract.');
  }

  return payload;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiRequest('/user-profile');

  return readUserProfileResponse(response);
}

export async function updateUserProfile(input: UpdateUserProfileInput): Promise<UserProfile> {
  const response = await apiRequest('/user-profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      displayName: input.displayName,
    }),
  });

  return readUserProfileResponse(response);
}
