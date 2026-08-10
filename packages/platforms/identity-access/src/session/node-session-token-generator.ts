import { randomBytes } from 'node:crypto';

import type { SessionTokenGenerator } from './session-token-generator';

export const SESSION_TOKEN_RANDOM_BYTES = 32;

export class NodeSessionTokenGenerator implements SessionTokenGenerator {
  generate(): string {
    return randomBytes(SESSION_TOKEN_RANDOM_BYTES).toString('base64url');
  }
}
