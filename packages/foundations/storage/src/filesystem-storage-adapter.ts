import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve, sep } from 'node:path';

import {
  assertStorageObjectReference,
  type StorageObjectReference,
  type StorageObjectStore,
  type WriteStorageObjectInput,
} from './storage-object-store';

export interface FilesystemStorageAdapterOptions {
  readonly rootDirectory: string;
}

export class FilesystemStorageAdapter implements StorageObjectStore {
  private readonly rootDirectory: string;

  constructor(options: FilesystemStorageAdapterOptions) {
    if (options.rootDirectory.trim().length === 0) {
      throw new TypeError('Filesystem storage rootDirectory must be non-empty.');
    }

    this.rootDirectory = resolve(options.rootDirectory);
  }

  async writeObject(input: WriteStorageObjectInput): Promise<StorageObjectReference> {
    const objectPath = this.resolveObjectPath(input.reference);

    await mkdir(dirname(objectPath), {
      recursive: true,
    });

    await writeFile(objectPath, input.content);

    return input.reference;
  }

  async readObject(reference: StorageObjectReference): Promise<Uint8Array> {
    const objectPath = this.resolveObjectPath(reference);
    const content = await readFile(objectPath);

    return new Uint8Array(content);
  }

  async deleteObject(reference: StorageObjectReference): Promise<void> {
    const objectPath = this.resolveObjectPath(reference);

    await rm(objectPath);
  }

  private resolveObjectPath(reference: StorageObjectReference): string {
    assertStorageObjectReference(reference);

    if (isAbsolute(reference)) {
      throw new TypeError('Storage object reference must be relative.');
    }

    const objectPath = resolve(this.rootDirectory, ...reference.split('/'));
    const rootPrefix = this.rootDirectory.endsWith(sep)
      ? this.rootDirectory
      : `${this.rootDirectory}${sep}`;

    if (!objectPath.startsWith(rootPrefix)) {
      throw new TypeError('Storage object reference resolves outside the configured root.');
    }

    return objectPath;
  }
}
