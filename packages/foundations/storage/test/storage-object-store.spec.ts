import { describe, expect, it } from 'vitest';

import { assertStorageObjectReference } from '../src';

describe('Storage object reference contract', () => {
  it('accepts portable relative object references', () => {
    expect(() => assertStorageObjectReference('media/assets/example.png')).not.toThrow();
    expect(() => assertStorageObjectReference('asset.bin')).not.toThrow();
  });

  it('rejects unsafe or non-portable object references', () => {
    const invalidReferences = [
      '',
      ' media/object.bin',
      'media/object.bin ',
      '/absolute/object.bin',
      '../outside.bin',
      'media/../outside.bin',
      'media//object.bin',
      'media/./object.bin',
      'media\\object.bin',
    ];

    for (const reference of invalidReferences) {
      expect(() => assertStorageObjectReference(reference)).toThrow(TypeError);
    }
  });
});
