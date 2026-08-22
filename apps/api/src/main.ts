import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { loadApiEnvironment } from './config/environment';

async function bootstrap() {
  const environment = loadApiEnvironment();

  const app = await NestFactory.create(
    AppModule.register({
      databaseUrl: environment.databaseUrl,
      environment: environment.nodeEnv,
      logLevel: environment.logLevel,
      storageRootDirectory: environment.mediaStorageRootDirectory,
      email: environment.email,
      ...(environment.openAiApiKey === undefined ? {} : { openAiApiKey: environment.openAiApiKey }),
    }),
    {
      bufferLogs: true,
    },
  );

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.enableShutdownHooks();

  await app.listen(environment.port);
}

void bootstrap();
