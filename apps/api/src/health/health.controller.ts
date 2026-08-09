import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

interface LivenessResponse {
  readonly status: 'ok';
}

interface ReadinessResponse {
  readonly status: 'ok';
  readonly checks: {
    readonly database: 'up';
  };
}

@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get('live')
  liveness(): LivenessResponse {
    return {
      status: 'ok',
    };
  }

  @Get('ready')
  async readiness(): Promise<ReadinessResponse> {
    try {
      await this.database.checkReadiness();

      return {
        status: 'ok',
        checks: {
          database: 'up',
        },
      };
    } catch (error: unknown) {
      throw new ServiceUnavailableException(undefined, {
        cause: error,
      });
    }
  }
}
