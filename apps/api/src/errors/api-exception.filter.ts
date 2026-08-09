import { ApplicationError } from '@ai-world/foundation-errors';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import type { ApiErrorResponse } from './api-error-response';
import { getApplicationErrorStatus, getHttpErrorCode, getSafeHttpMessage } from './error-mapping';

interface RequestWithId {
  readonly id?: string;
}

interface MappedError {
  readonly code: string;
  readonly message: string;
  readonly status: number;
}

function mapException(exception: unknown): MappedError {
  if (exception instanceof ApplicationError) {
    return {
      code: exception.code,
      message: exception.publicMessage,
      status: getApplicationErrorStatus(exception.kind),
    };
  }

  if (exception instanceof HttpException) {
    const status = exception.getStatus();

    return {
      code: getHttpErrorCode(status),
      message: getSafeHttpMessage(status),
      status,
    };
  }

  return {
    code: 'http.internal_server_error',
    message: 'Internal server error.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();

    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<unknown>();

    const mappedError = mapException(exception);

    const body: ApiErrorResponse = {
      error: {
        code: mappedError.code,
        message: mappedError.message,
        status: mappedError.status,
        ...(request.id
          ? {
              requestId: request.id,
            }
          : {}),
      },
    };

    httpAdapter.reply(response, body, mappedError.status);
  }
}
