import { parseConfiguration } from '@ai-world/foundation-configuration';
import { z } from 'zod';

const apiEnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  })
  .transform(({ NODE_ENV, PORT }) => ({
    nodeEnv: NODE_ENV,
    port: PORT,
  }));

export type ApiEnvironment = z.output<typeof apiEnvironmentSchema>;

export function loadApiEnvironment(input: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  return parseConfiguration(apiEnvironmentSchema, input);
}
