import type { output, ZodType } from 'zod';

import { ConfigurationError, type ConfigurationIssue } from './configuration-error';

function toConfigurationPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) {
    return '<root>';
  }

  return path.map(String).join('.');
}

export function parseConfiguration<TSchema extends ZodType>(
  schema: TSchema,
  input: unknown,
): output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issues: ConfigurationIssue[] = result.error.issues.map((issue) => ({
      path: toConfigurationPath(issue.path),
      message: issue.message,
    }));

    throw new ConfigurationError(issues);
  }

  return result.data;
}
