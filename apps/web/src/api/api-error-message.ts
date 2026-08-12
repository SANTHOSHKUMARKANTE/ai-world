import { ApiClientError } from './api-client';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  return 'The request could not be completed. Please try again.';
}
