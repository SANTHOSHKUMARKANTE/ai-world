import { ApplicationError } from '@ai-world/foundation-errors';

import type { PasswordVerifier } from '../password/password-verifier';
import {
  normalizeAuthenticationEmail,
  normalizeAuthenticationPassword,
} from './authentication-input';
import type { PasswordAuthenticationReader } from './password-authentication-reader';

export interface AuthenticatePasswordInput {
  readonly email: string;
  readonly password: string;
}

export interface AuthenticatePasswordResult {
  readonly actorId: string;
}

export class AuthenticatePassword {
  constructor(
    private readonly reader: PasswordAuthenticationReader,
    private readonly passwordVerifier: PasswordVerifier,
    private readonly dummyPasswordHash: string,
  ) {}

  async execute(input: AuthenticatePasswordInput): Promise<AuthenticatePasswordResult> {
    const normalizedEmail = normalizeAuthenticationEmail(input.email);
    const normalizedPassword = normalizeAuthenticationPassword(input.password);

    const credential = await this.reader.findByNormalizedEmail(normalizedEmail);

    const passwordHash = credential?.passwordHash ?? this.dummyPasswordHash;

    const passwordMatches = await this.passwordVerifier.verify(normalizedPassword, passwordHash);

    if (!credential || !passwordMatches) {
      throw new ApplicationError({
        code: 'identity.authentication.invalid_credentials',
        kind: 'unauthenticated',
        message: 'Password authentication failed.',
        publicMessage: 'The email or password is incorrect.',
      });
    }

    return {
      actorId: credential.actorId,
    };
  }
}
