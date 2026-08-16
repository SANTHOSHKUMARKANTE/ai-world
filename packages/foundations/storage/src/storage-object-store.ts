export type StorageObjectReference = string;

export interface WriteStorageObjectInput {
  readonly reference: StorageObjectReference;
  readonly content: Uint8Array;
}

export interface StorageObjectStore {
  writeObject(input: WriteStorageObjectInput): Promise<StorageObjectReference>;

  readObject(reference: StorageObjectReference): Promise<Uint8Array>;

  deleteObject(reference: StorageObjectReference): Promise<void>;
}

export function assertStorageObjectReference(
  reference: StorageObjectReference,
): asserts reference is StorageObjectReference {
  if (reference.length === 0 || reference.trim() !== reference) {
    throw new TypeError('Storage object reference must be a non-empty trimmed string.');
  }

  if (reference.includes('\\') || reference.includes('\0') || reference.startsWith('/')) {
    throw new TypeError(
      'Storage object reference must use portable forward-slash relative key syntax.',
    );
  }

  const segments = reference.split('/');

  if (segments.some((segment) => segment.length === 0 || segment === '.' || segment === '..')) {
    throw new TypeError(
      'Storage object reference must not contain empty, current-directory, or parent segments.',
    );
  }
}
