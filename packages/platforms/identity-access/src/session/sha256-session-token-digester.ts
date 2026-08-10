import { createHash } from 'node:crypto';

import type { SessionTokenDigester } from './session-token-digester';

export const SESSION_TOKEN_DIGEST_LENGTH = 64;

export class Sha256SessionTokenDigester implements SessionTokenDigester {
  digest(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
  }
}
