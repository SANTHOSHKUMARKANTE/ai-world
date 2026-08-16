import { describe, expect, it } from 'vitest';

import {
  S3CompatibleStorageAdapter,
  type S3CompatibleDeleteObjectInput,
  type S3CompatibleGetObjectInput,
  type S3CompatibleObjectStorageClient,
  type S3CompatiblePutObjectInput,
} from '../src/s3-compatible';

class FakeS3CompatibleClient implements S3CompatibleObjectStorageClient {
  readonly objects = new Map<string, Uint8Array>();

  readonly puts: S3CompatiblePutObjectInput[] = [];

  readonly gets: S3CompatibleGetObjectInput[] = [];

  readonly deletes: S3CompatibleDeleteObjectInput[] = [];

  async putObject(input: S3CompatiblePutObjectInput): Promise<void> {
    this.puts.push(input);
    this.objects.set(`${input.bucket}/${input.key}`, input.body);
  }

  async getObject(input: S3CompatibleGetObjectInput): Promise<Uint8Array> {
    this.gets.push(input);

    const object = this.objects.get(`${input.bucket}/${input.key}`);

    if (!object) {
      throw new Error('Object not found.');
    }

    return object;
  }

  async deleteObject(input: S3CompatibleDeleteObjectInput): Promise<void> {
    this.deletes.push(input);
    this.objects.delete(`${input.bucket}/${input.key}`);
  }
}

describe('S3CompatibleStorageAdapter', () => {
  it('maps provider-neutral writes to the configured bucket and object key', async () => {
    const client = new FakeS3CompatibleClient();
    const adapter = new S3CompatibleStorageAdapter({
      bucket: 'ai-world-media',
      client,
    });
    const content = new Uint8Array([7, 8, 9]);

    const reference = await adapter.writeObject({
      reference: 'media/assets/example.bin',
      content,
    });

    expect(reference).toBe('media/assets/example.bin');
    expect(client.puts).toEqual([
      {
        bucket: 'ai-world-media',
        key: 'media/assets/example.bin',
        body: content,
      },
    ]);
  });

  it('maps reads and deletes without leaking provider configuration into references', async () => {
    const client = new FakeS3CompatibleClient();
    const adapter = new S3CompatibleStorageAdapter({
      bucket: 'ai-world-media',
      client,
    });
    const content = new Uint8Array([4, 5, 6]);

    await adapter.writeObject({
      reference: 'media/assets/example.bin',
      content,
    });

    await expect(adapter.readObject('media/assets/example.bin')).resolves.toEqual(content);

    await adapter.deleteObject('media/assets/example.bin');

    expect(client.gets).toEqual([
      {
        bucket: 'ai-world-media',
        key: 'media/assets/example.bin',
      },
    ]);

    expect(client.deletes).toEqual([
      {
        bucket: 'ai-world-media',
        key: 'media/assets/example.bin',
      },
    ]);
  });

  it('keeps actual S3-compatible provider implementation outside this milestone', () => {
    const client = new FakeS3CompatibleClient();

    expect(
      () =>
        new S3CompatibleStorageAdapter({
          bucket: 'ai-world-media',
          client,
        }),
    ).not.toThrow();
  });
});
