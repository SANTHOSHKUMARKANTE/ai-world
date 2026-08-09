import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { loadApiEnvironment } from './config/environment';

async function bootstrap() {
  const environment = loadApiEnvironment();

  const app = await NestFactory.create(
    AppModule.register({
      databaseUrl: environment.databaseUrl,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(environment.port);
}

void bootstrap();
