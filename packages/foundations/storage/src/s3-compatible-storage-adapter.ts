import {
  assertStorageObjectReference,
  type StorageObjectReference,
  type StorageObjectStore,
  type WriteStorageObjectInput,
} from './storage-object-store';

export interface S3CompatiblePutObjectInput {
  readonly bucket: string;
  readonly key: string;
  readonly body: Uint8Array;
}

export interface S3CompatibleGetObjectInput {
  readonly bucket: string;
  readonly key: string;
}

export interface S3CompatibleDeleteObjectInput {
  readonly bucket: string;
  readonly key: string;
}

export interface S3CompatibleObjectStorageClient {
  putObject(input: S3CompatiblePutObjectInput): Promise<void>;

  getObject(input: S3CompatibleGetObjectInput): Promise<Uint8Array>;

  deleteObject(input: S3CompatibleDeleteObjectInput): Promise<void>;
}

export interface S3CompatibleStorageAdapterOptions {
  readonly bucket: string;
  readonly client: S3CompatibleObjectStorageClient;
}

export class S3CompatibleStorageAdapter implements StorageObjectStore {
  private readonly bucket: string;

  private readonly client: S3CompatibleObjectStorageClient;

  constructor(options: S3CompatibleStorageAdapterOptions) {
    if (options.bucket.trim().length === 0) {
      throw new TypeError('S3-compatible storage bucket must be non-empty.');
    }

    this.bucket = options.bucket;
    this.client = options.client;
  }

  async writeObject(input: WriteStorageObjectInput): Promise<StorageObjectReference> {
    assertStorageObjectReference(input.reference);

    await this.client.putObject({
      bucket: this.bucket,
      key: input.reference,
      body: input.content,
    });

    return input.reference;
  }

  async readObject(reference: StorageObjectReference): Promise<Uint8Array> {
    assertStorageObjectReference(reference);

    return this.client.getObject({
      bucket: this.bucket,
      key: reference,
    });
  }

  async deleteObject(reference: StorageObjectReference): Promise<void> {
    assertStorageObjectReference(reference);

    await this.client.deleteObject({
      bucket: this.bucket,
      key: reference,
    });
  }
}
