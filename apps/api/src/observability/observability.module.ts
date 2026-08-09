import { createHttpLoggerOptions, type LogLevel } from '@ai-world/foundation-observability';
import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

export interface ObservabilityModuleOptions {
  readonly environment: string;
  readonly logLevel: LogLevel;
}

@Module({})
export class ObservabilityModule {
  static register(options: ObservabilityModuleOptions): DynamicModule {
    return {
      module: ObservabilityModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: createHttpLoggerOptions({
            serviceName: 'ai-world-api',
            environment: options.environment,
            level: options.logLevel,
          }),
        }),
      ],
      exports: [LoggerModule],
    };
  }
}
