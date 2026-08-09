import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

import type { Options } from 'pino-http';

import type { LogLevel } from './log-level';

const MAX_INCOMING_REQUEST_ID_LENGTH = 128;

export interface HttpLoggerOptions {
  readonly serviceName: string;
  readonly environment: string;
  readonly level: LogLevel;
}

export function createHttpLoggerOptions(
  options: HttpLoggerOptions,
): Options<IncomingMessage, ServerResponse> {
  return {
    level: options.level,

    base: {
      service: options.serviceName,
      environment: options.environment,
    },

    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["proxy-authorization"]',
        'req.headers["x-api-key"]',
        'res.headers["set-cookie"]',
      ],
      censor: '[REDACTED]',
    },

    genReqId(request: IncomingMessage, response: ServerResponse): string {
      const incomingRequestId = request.headers['x-request-id'];

      const candidate = Array.isArray(incomingRequestId) ? incomingRequestId[0] : incomingRequestId;

      const normalizedCandidate = candidate?.trim();

      const requestId =
        normalizedCandidate && normalizedCandidate.length <= MAX_INCOMING_REQUEST_ID_LENGTH
          ? normalizedCandidate
          : randomUUID();

      response.setHeader('X-Request-Id', requestId);

      return requestId;
    },

    customLogLevel(request: IncomingMessage, response: ServerResponse, error?: Error): LogLevel {
      // The request parameter is part of pino-http's callback contract.
      void request;

      if (error || response.statusCode >= 500) {
        return 'error';
      }

      if (response.statusCode >= 400) {
        return 'warn';
      }

      return 'info';
    },
  };
}
