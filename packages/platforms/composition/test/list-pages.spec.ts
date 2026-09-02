import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import { ListPages, type CreatorPageReader, type ListCreatorPagesInput } from '../src';

describe('ListPages', () => {
  it('lists recent Pages inside the requested Universe', async () => {
    const inputs: ListCreatorPagesInput[] = [];
    const reader: CreatorPageReader = {
      async listForCreator(input) {
        inputs.push(input);
        return [];
      },
    };

    await expect(new ListPages(reader).execute({ universeKey: 'universe.anime' })).resolves.toEqual(
      [],
    );
    expect(inputs).toEqual([{ universeKey: parseNamespacedKey('universe.anime'), limit: 50 }]);
  });

  it('rejects invalid limits before querying canonical Composition state', async () => {
    let queried = false;
    const reader: CreatorPageReader = {
      async listForCreator() {
        queried = true;
        return [];
      },
    };

    await expect(
      new ListPages(reader).execute({ universeKey: 'universe.anime', limit: 101 }),
    ).rejects.toMatchObject({ code: 'composition.page.invalid_input', kind: 'validation' });
    expect(queried).toBe(false);
  });
});
