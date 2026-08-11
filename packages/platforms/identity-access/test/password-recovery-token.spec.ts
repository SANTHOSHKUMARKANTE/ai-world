import { describe, expect, it } from 'vitest';

import {
  NodePasswordRecoveryTokenGenerator,
  PASSWORD_RECOVERY_TOKEN_DIGEST_LENGTH,
  PASSWORD_RECOVERY_TOKEN_RANDOM_BYTES,
  Sha256PasswordRecoveryTokenDigester,
} from '../src/infrastructure';

describe('password recovery token security', () => {
  it('generates a 32-byte base64url token without padding', () => {
    const generator = new NodePasswordRecoveryTokenGenerator();

    const token = generator.generate();

    expect(PASSWORD_RECOVERY_TOKEN_RANDOM_BYTES).toBe(32);
    expect(token).toHaveLength(43);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/u);
    expect(token).not.toContain('=');
  });

  it('generates different tokens', () => {
    const generator = new NodePasswordRecoveryTokenGenerator();

    expect(generator.generate()).not.toBe(generator.generate());
  });

  it('digests tokens as lowercase SHA-256 hexadecimal', () => {
    const digester = new Sha256PasswordRecoveryTokenDigester();

    const digest = digester.digest('recovery-token');

    expect(PASSWORD_RECOVERY_TOKEN_DIGEST_LENGTH).toBe(64);
    expect(digest).toBe('c1b5aef239f406a0b14bfe13d3fe2485e18d5e0d8fe3516e1f5b4afc9a6d64b9');
    expect(digest).toMatch(/^[0-9a-f]{64}$/u);
  });

  it('produces the same digest for the same token', () => {
    const digester = new Sha256PasswordRecoveryTokenDigester();

    expect(digester.digest('same-token')).toBe(digester.digest('same-token'));
  });

  it('produces different digests for different tokens', () => {
    const digester = new Sha256PasswordRecoveryTokenDigester();

    expect(digester.digest('token-one')).not.toBe(digester.digest('token-two'));
  });
});
