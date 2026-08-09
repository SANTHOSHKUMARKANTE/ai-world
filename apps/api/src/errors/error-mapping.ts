import type { ApplicationErrorKind } from '@ai-world/foundation-errors';
import { HttpStatus } from '@nestjs/common';

export function getApplicationErrorStatus(kind: ApplicationErrorKind): number {
  switch (kind) {
    case 'validation':
      return HttpStatus.BAD_REQUEST;

    case 'unauthenticated':
      return HttpStatus.UNAUTHORIZED;

    case 'forbidden':
      return HttpStatus.FORBIDDEN;

    case 'not_found':
      return HttpStatus.NOT_FOUND;

    case 'conflict':
      return HttpStatus.CONFLICT;

    case 'rate_limited':
      return HttpStatus.TOO_MANY_REQUESTS;
  }
}

export function getHttpErrorCode(status: number): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'http.bad_request';

    case HttpStatus.UNAUTHORIZED:
      return 'http.unauthorized';

    case HttpStatus.FORBIDDEN:
      return 'http.forbidden';

    case HttpStatus.NOT_FOUND:
      return 'http.not_found';

    case HttpStatus.METHOD_NOT_ALLOWED:
      return 'http.method_not_allowed';

    case HttpStatus.CONFLICT:
      return 'http.conflict';

    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'http.unprocessable_entity';

    case HttpStatus.TOO_MANY_REQUESTS:
      return 'http.too_many_requests';

    default:
      return status >= 500 ? 'http.internal_server_error' : 'http.error';
  }
}

export function getSafeHttpMessage(status: number): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'The request is invalid.';

    case HttpStatus.UNAUTHORIZED:
      return 'Authentication is required.';

    case HttpStatus.FORBIDDEN:
      return 'You do not have permission to perform this action.';

    case HttpStatus.NOT_FOUND:
      return 'Resource not found.';

    case HttpStatus.METHOD_NOT_ALLOWED:
      return 'The HTTP method is not allowed for this resource.';

    case HttpStatus.CONFLICT:
      return 'The request conflicts with the current state of the resource.';

    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'The request could not be processed.';

    case HttpStatus.TOO_MANY_REQUESTS:
      return 'Too many requests.';

    default:
      return status >= 500 ? 'Internal server error.' : 'Request failed.';
  }
}
