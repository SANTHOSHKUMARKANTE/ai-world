import { describe, expect, it } from 'vitest';

import {
  EMAIL_VERIFICATION_TOKEN_DIGEST_LENGTH,
  EMAIL_VERIFICATION_TOKEN_RANDOM_BYTES,
  NodeEmailVerificationTokenGenerator,
  Sha256EmailVerificationTokenDigester,
} from '../src/infrastructure';

describe('email verification token security', () => {
  it('generates a 32-byte base64url token without padding', () => {
    const generator = new NodeEmailVerificationTokenGenerator();

    const token = generator.generate();

    expect(EMAIL_VERIFICATION_TOKEN_RANDOM_BYTES).toBe(32);
    expect(token).toHaveLength(43);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/u);
    expect(token).not.toContain('=');
  });

  it('generates different tokens', () => {
    const generator = new NodeEmailVerificationTokenGenerator();

    expect(generator.generate()).not.toBe(generator.generate());
  });

  it('digests tokens as lowercase SHA-256 hexadecimal', () => {
    const digester = new Sha256EmailVerificationTokenDigester();

    const digest = digester.digest('verification-token');

    expect(EMAIL_VERIFICATION_TOKEN_DIGEST_LENGTH).toBe(64);
    expect(digest).toBe('46f6e828be35b9e2482ea7fc7a6a8f43f95a131098470486be3d137d408c8811');
    expect(digest).toMatch(/^[0-9a-f]{64}$/u);
  });

  it('produces the same digest for the same token', () => {
    const digester = new Sha256EmailVerificationTokenDigester();

    expect(digester.digest('same-token')).toBe(digester.digest('same-token'));
  });

  it('produces different digests for different tokens', () => {
    const digester = new Sha256EmailVerificationTokenDigester();

    expect(digester.digest('token-one')).not.toBe(digester.digest('token-two'));
  });
});
