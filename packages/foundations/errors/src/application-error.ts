export const applicationErrorKinds = [
  'validation',
  'unauthenticated',
  'forbidden',
  'not_found',
  'conflict',
  'rate_limited',
] as const;

export type ApplicationErrorKind = (typeof applicationErrorKinds)[number];

export interface ApplicationErrorOptions {
  readonly code: string;
  readonly kind: ApplicationErrorKind;

  /**
   * Diagnostic message intended for internal logs and debugging.
   * This value must not automatically be exposed to API clients.
   */
  readonly message: string;

  /**
   * Deliberately safe client-facing message.
   */
  readonly publicMessage: string;

  readonly cause?: unknown;
}

export class ApplicationError extends Error {
  readonly code: string;
  readonly kind: ApplicationErrorKind;
  readonly publicMessage: string;

  constructor(options: ApplicationErrorOptions) {
    super(options.message, {
      cause: options.cause,
    });

    this.name = 'ApplicationError';
    this.code = options.code;
    this.kind = options.kind;
    this.publicMessage = options.publicMessage;
  }
}
