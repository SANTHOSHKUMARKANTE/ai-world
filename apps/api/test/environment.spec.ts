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
    expect(result.webOrigin).toBe('http://127.0.0.1:3000');
  });

  it('accepts only a credential-free http(s) Web origin', () => {
    expect(
      loadApiEnvironment({
        DATABASE_URL,
        AI_WORLD_WEB_ORIGIN: 'https://www.ai-world.test',
      }).webOrigin,
    ).toBe('https://www.ai-world.test');

    for (const webOrigin of [
      'ftp://ai-world.test',
      'https://user:secret@ai-world.test',
      'https://ai-world.test/path',
      'https://ai-world.test?campaign=1',
      'https://ai-world.test#fragment',
    ]) {
      expect(() =>
        loadApiEnvironment({
          DATABASE_URL,
          AI_WORLD_WEB_ORIGIN: webOrigin,
        }),
      ).toThrow(/AI_WORLD_WEB_ORIGIN/u);
    }
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
