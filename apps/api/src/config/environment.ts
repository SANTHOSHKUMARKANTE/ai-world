import { parseConfiguration } from '@ai-world/foundation-configuration';
import { z } from 'zod';

const apiEnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.url(),
  })
  .transform(({ NODE_ENV, PORT, DATABASE_URL }) => ({
    nodeEnv: NODE_ENV,
    port: PORT,
    databaseUrl: DATABASE_URL,
  }));

export type ApiEnvironment = z.output<typeof apiEnvironmentSchema>;

export function loadApiEnvironment(input: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  return parseConfiguration(apiEnvironmentSchema, input);
}
