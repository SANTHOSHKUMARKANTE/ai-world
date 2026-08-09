export interface ApiErrorBody {
  readonly code: string;
  readonly message: string;
  readonly status: number;
  readonly requestId?: string;
}

export interface ApiErrorResponse {
  readonly error: ApiErrorBody;
}
