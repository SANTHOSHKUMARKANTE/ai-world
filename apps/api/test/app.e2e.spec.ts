import { ApplicationError } from '@ai-world/foundation-errors';
import { Controller, Get, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

@Controller('__test')
class ErrorTestController {
  @Get('application-error')
  getApplicationError(): never {
    throw new ApplicationError({
      code: 'test.conflict',
      kind: 'conflict',
      message: 'INTERNAL_APPLICATION_ERROR_DO_NOT_EXPOSE',
      publicMessage: 'A safe conflict occurred.',
    });
  }

  @Get('unexpected-error')
  getUnexpectedError(): never {
    throw new Error('INTERNAL_UNEXPECTED_ERROR_DO_NOT_EXPOSE');
  }
}

describe('API integration baseline', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.register({
          databaseUrl: 'postgresql://ai_world:ai_world@127.0.0.1:1/ai_world',
          environment: 'test',
          logLevel: 'fatal',
        }),
      ],
      controllers: [ErrorTestController],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves the API smoke-test route with a generated request ID', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    expect(response.text).toBe('Hello World!');

    expect(response.headers['x-request-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('propagates a supplied request ID', async () => {
    await request(app.getHttpServer())
      .get('/')
      .set('X-Request-Id', 'api-test-request-001')
      .expect('X-Request-Id', 'api-test-request-001')
      .expect(200);
  });

  it('returns the canonical error envelope for an unknown route', async () => {
    const response = await request(app.getHttpServer())
      .get('/does-not-exist')
      .set('X-Request-Id', 'api-test-404-001')
      .expect('X-Request-Id', 'api-test-404-001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'http.not_found',
        message: 'Resource not found.',
        status: 404,
        requestId: 'api-test-404-001',
      },
    });
  });

  it('exposes only the public ApplicationError message', async () => {
    const response = await request(app.getHttpServer())
      .get('/__test/application-error')
      .set('X-Request-Id', 'api-test-409-001')
      .expect('X-Request-Id', 'api-test-409-001')
      .expect(409);

    expect(response.body).toEqual({
      error: {
        code: 'test.conflict',
        message: 'A safe conflict occurred.',
        status: 409,
        requestId: 'api-test-409-001',
      },
    });

    expect(response.text).not.toContain('INTERNAL_APPLICATION_ERROR_DO_NOT_EXPOSE');
  });

  it('returns a safe response for an unexpected exception', async () => {
    const response = await request(app.getHttpServer())
      .get('/__test/unexpected-error')
      .set('X-Request-Id', 'api-test-500-001')
      .expect('X-Request-Id', 'api-test-500-001')
      .expect(500);

    expect(response.body).toEqual({
      error: {
        code: 'http.internal_server_error',
        message: 'Internal server error.',
        status: 500,
        requestId: 'api-test-500-001',
      },
    });

    expect(response.text).not.toContain('INTERNAL_UNEXPECTED_ERROR_DO_NOT_EXPOSE');
  });
});
