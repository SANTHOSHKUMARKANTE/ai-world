import { describe, expect, it } from 'vitest';

import { ApplicationError } from '../src';

describe('ApplicationError', () => {
  it('preserves its typed application error properties', () => {
    const error = new ApplicationError({
      code: 'identity.email_already_in_use',
      kind: 'conflict',
      message: 'Internal diagnostic message.',
      publicMessage: 'An account already exists for that email address.',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ApplicationError');
    expect(error.code).toBe('identity.email_already_in_use');
    expect(error.kind).toBe('conflict');
    expect(error.message).toBe('Internal diagnostic message.');
    expect(error.publicMessage).toBe('An account already exists for that email address.');
  });

  it('preserves an optional cause', () => {
    const cause = new Error('Underlying failure.');

    const error = new ApplicationError({
      code: 'test.failure',
      kind: 'conflict',
      message: 'Internal diagnostic message.',
      publicMessage: 'The operation could not be completed.',
      cause,
    });

    expect(error.cause).toBe(cause);
  });
});
