import { describe, expect, it } from 'vitest';

import {
  NodeSessionTokenGenerator,
  SESSION_TOKEN_DIGEST_LENGTH,
  SESSION_TOKEN_RANDOM_BYTES,
  Sha256SessionTokenDigester,
} from '../src/infrastructure';

describe('Session token security primitives', () => {
  it('generates a 32-byte base64url opaque Session token', () => {
    const generator = new NodeSessionTokenGenerator();

    const token = generator.generate();

    expect(SESSION_TOKEN_RANDOM_BYTES).toBe(32);
    expect(token).toHaveLength(43);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('generates different Session tokens', () => {
    const generator = new NodeSessionTokenGenerator();

    const first = generator.generate();
    const second = generator.generate();

    expect(first).not.toBe(second);
  });

  it('produces a deterministic 64-character SHA-256 digest', () => {
    const digester = new Sha256SessionTokenDigester();

    const first = digester.digest('opaque-session-token');
    const second = digester.digest('opaque-session-token');

    expect(SESSION_TOKEN_DIGEST_LENGTH).toBe(64);
    expect(first).toHaveLength(64);
    expect(first).toMatch(/^[0-9a-f]{64}$/);
    expect(second).toBe(first);
  });

  it('produces different digests for different Session tokens', () => {
    const digester = new Sha256SessionTokenDigester();

    expect(digester.digest('session-token-a')).not.toBe(digester.digest('session-token-b'));
  });
});
