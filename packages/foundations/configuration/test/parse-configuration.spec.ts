import { z } from 'zod';
import { describe, expect, it } from 'vitest';

import { ConfigurationError, parseConfiguration } from '../src';

describe('parseConfiguration', () => {
  it('returns the parsed configuration', () => {
    const schema = z.object({
      PORT: z.coerce.number().int().min(1),
    });

    const configuration = parseConfiguration(schema, {
      PORT: '3000',
    });

    expect(configuration).toEqual({
      PORT: 3000,
    });
  });

  it('throws ConfigurationError when validation fails', () => {
    const schema = z.object({
      PORT: z.coerce.number().int().min(1),
    });

    expect(() =>
      parseConfiguration(schema, {
        PORT: 'invalid',
      }),
    ).toThrow(ConfigurationError);
  });
});
