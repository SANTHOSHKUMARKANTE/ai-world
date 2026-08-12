interface ApiErrorPayload {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly status: number;
    readonly requestId?: string;
  };
}

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId: string | null;

  constructor(options: {
    readonly code: string;
    readonly message: string;
    readonly status: number;
    readonly requestId: string | null;
  }) {
    super(options.message);

    this.name = 'ApiClientError';
    this.code = options.code;
    this.status = options.status;
    this.requestId = options.requestId;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  if (!isRecord(value)) {
    return false;
  }

  const error = value.error;

  if (!isRecord(error)) {
    return false;
  }

  return (
    typeof error.code === 'string' &&
    typeof error.message === 'string' &&
    typeof error.status === 'number' &&
    (error.requestId === undefined || typeof error.requestId === 'string')
  );
}

async function createApiClientError(response: Response): Promise<ApiClientError> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (isApiErrorPayload(payload)) {
    return new ApiClientError({
      code: payload.error.code,
      message: payload.error.message,
      status: payload.error.status,
      requestId: payload.error.requestId ?? null,
    });
  }

  return new ApiClientError({
    code: 'web.api.unexpected_error',
    message: 'The request could not be completed.',
    status: response.status,
    requestId: null,
  });
}

export async function apiRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw await createApiClientError(response);
  }

  return response;
}
