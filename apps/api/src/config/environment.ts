import { parseConfiguration } from '@ai-world/foundation-configuration';
import { logLevels } from '@ai-world/foundation-observability';
import { z } from 'zod';

const apiEnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    DATABASE_URL: z.url(),

    LOG_LEVEL: z.enum(logLevels).default('info'),

    MEDIA_STORAGE_ROOT: z.string().trim().min(1).default('./uploads'),

    EMAIL_SMTP_HOST: z.string().trim().min(1).default('127.0.0.1'),

    EMAIL_SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(1025),

    EMAIL_SMTP_SECURE: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),

    EMAIL_FROM: z.string().trim().min(1).default('AI World <noreply@ai-world.local>'),

    EMAIL_SMTP_USERNAME: z.string().trim().min(1).optional(),

    EMAIL_SMTP_PASSWORD: z.string().min(1).optional(),

    OPENAI_API_KEY: z.string().trim().min(1).optional(),
  })
  .superRefine(({ EMAIL_SMTP_USERNAME, EMAIL_SMTP_PASSWORD }, context) => {
    if ((EMAIL_SMTP_USERNAME === undefined) !== (EMAIL_SMTP_PASSWORD === undefined)) {
      context.addIssue({
        code: 'custom',
        message: 'EMAIL_SMTP_USERNAME and EMAIL_SMTP_PASSWORD must be configured together.',
        path: ['EMAIL_SMTP_USERNAME'],
      });
    }
  })
  .transform(
    ({
      NODE_ENV,
      PORT,
      DATABASE_URL,
      LOG_LEVEL,
      MEDIA_STORAGE_ROOT,
      EMAIL_SMTP_HOST,
      EMAIL_SMTP_PORT,
      EMAIL_SMTP_SECURE,
      EMAIL_FROM,
      EMAIL_SMTP_USERNAME,
      EMAIL_SMTP_PASSWORD,
      OPENAI_API_KEY,
    }) => ({
      nodeEnv: NODE_ENV,
      port: PORT,
      databaseUrl: DATABASE_URL,
      logLevel: LOG_LEVEL,
      mediaStorageRootDirectory: MEDIA_STORAGE_ROOT,
      email: {
        smtp: {
          host: EMAIL_SMTP_HOST,
          port: EMAIL_SMTP_PORT,
          secure: EMAIL_SMTP_SECURE,
          ...(EMAIL_SMTP_USERNAME === undefined
            ? {}
            : {
                username: EMAIL_SMTP_USERNAME,
                password: EMAIL_SMTP_PASSWORD!,
              }),
        },
        from: EMAIL_FROM,
      },
      ...(OPENAI_API_KEY === undefined ? {} : { openAiApiKey: OPENAI_API_KEY }),
    }),
  );

export type ApiEnvironment = z.output<typeof apiEnvironmentSchema>;

export function loadApiEnvironment(input: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  return parseConfiguration(apiEnvironmentSchema, input);
}
