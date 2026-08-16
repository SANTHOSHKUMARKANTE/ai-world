import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { FilesystemStorageAdapter } from '../src/filesystem';

describe('FilesystemStorageAdapter', () => {
  const temporaryRoots = new Set<string>();

  async function createAdapter(): Promise<{
    readonly adapter: FilesystemStorageAdapter;
    readonly rootDirectory: string;
  }> {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'ai-world-storage-'));
    temporaryRoots.add(rootDirectory);

    return {
      adapter: new FilesystemStorageAdapter({
        rootDirectory,
      }),
      rootDirectory,
    };
  }

  afterEach(async () => {
    await Promise.all(
      [...temporaryRoots].map((rootDirectory) =>
        rm(rootDirectory, {
          recursive: true,
          force: true,
        }),
      ),
    );

    temporaryRoots.clear();
  });

  it('writes and reads a nested object using the same opaque reference', async () => {
    const { adapter, rootDirectory } = await createAdapter();
    const content = new Uint8Array([1, 2, 3, 4]);

    const reference = await adapter.writeObject({
      reference: 'media/assets/example.bin',
      content,
    });

    expect(reference).toBe('media/assets/example.bin');
    await expect(adapter.readObject(reference)).resolves.toEqual(content);

    const persisted = await readFile(join(rootDirectory, 'media', 'assets', 'example.bin'));
    expect(new Uint8Array(persisted)).toEqual(content);
  });

  it('overwrites an existing object at the same reference', async () => {
    const { adapter } = await createAdapter();

    await adapter.writeObject({
      reference: 'media/assets/example.bin',
      content: new Uint8Array([1]),
    });

    await adapter.writeObject({
      reference: 'media/assets/example.bin',
      content: new Uint8Array([9, 8]),
    });

    await expect(adapter.readObject('media/assets/example.bin')).resolves.toEqual(
      new Uint8Array([9, 8]),
    );
  });

  it('deletes an existing object', async () => {
    const { adapter } = await createAdapter();

    await adapter.writeObject({
      reference: 'media/assets/example.bin',
      content: new Uint8Array([1, 2]),
    });

    await adapter.deleteObject('media/assets/example.bin');

    await expect(adapter.readObject('media/assets/example.bin')).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('rejects traversal before touching filesystem state', async () => {
    const { adapter } = await createAdapter();

    await expect(
      adapter.writeObject({
        reference: '../outside.bin',
        content: new Uint8Array([1]),
      }),
    ).rejects.toBeInstanceOf(TypeError);
  });
});
