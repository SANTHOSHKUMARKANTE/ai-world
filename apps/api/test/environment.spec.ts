import { describe, expect, it } from 'vitest';

import { loadApiEnvironment } from '../src/config/environment';

const DATABASE_URL = 'postgresql://ai_world:ai_world@127.0.0.1:55432/ai_world';

function environment(
  aiWorldEnvironment: 'development' | 'test' | 'staging' | 'production',
  nodeEnvironment: 'development' | 'test' | 'production',
): NodeJS.ProcessEnv {
  return {
    AI_WORLD_ENV: aiWorldEnvironment,
    NODE_ENV: nodeEnvironment,
    DATABASE_URL,
  };
}

describe('API environment architecture', () => {
  it.each([
    ['development', 'development'],
    ['test', 'test'],
    ['staging', 'production'],
    ['production', 'production'],
  ] as const)('accepts AI_WORLD_ENV=%s with NODE_ENV=%s', (aiWorldEnvironment, nodeEnvironment) => {
    const result = loadApiEnvironment(environment(aiWorldEnvironment, nodeEnvironment));

    expect(result.environmentName).toBe(aiWorldEnvironment);
    expect(result.nodeEnv).toBe(nodeEnvironment);
  });

  it.each([
    ['development', 'production'],
    ['test', 'production'],
    ['staging', 'development'],
    ['staging', 'test'],
    ['production', 'development'],
    ['production', 'test'],
  ] as const)(
    'rejects AI_WORLD_ENV=%s with incompatible NODE_ENV=%s',
    (aiWorldEnvironment, nodeEnvironment) => {
      expect(() => loadApiEnvironment(environment(aiWorldEnvironment, nodeEnvironment))).toThrow();
    },
  );

  it('defaults to local development identity when neither environment variable is provided', () => {
    const result = loadApiEnvironment({ DATABASE_URL });

    expect(result.environmentName).toBe('development');
    expect(result.nodeEnv).toBe('development');
  });

  it('forces an explicit AI_WORLD_ENV for a production-mode runtime', () => {
    expect(() =>
      loadApiEnvironment({
        NODE_ENV: 'production',
        DATABASE_URL,
      }),
    ).toThrow();
  });
});
