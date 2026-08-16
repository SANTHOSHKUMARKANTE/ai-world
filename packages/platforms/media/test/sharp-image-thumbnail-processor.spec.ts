import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { SharpImageThumbnailProcessor } from '../src/sharp-image-thumbnail-processor';

describe('SharpImageThumbnailProcessor', () => {
  it('creates a PNG thumbnail bounded to 320 pixels without changing aspect ratio', async () => {
    const source = await sharp({
      create: {
        width: 640,
        height: 480,
        channels: 3,
        background: {
          r: 180,
          g: 40,
          b: 20,
        },
      },
    })
      .png()
      .toBuffer();

    const processor = new SharpImageThumbnailProcessor();

    const thumbnail = await processor.createThumbnail({
      content: source,
      mimeType: 'image/png',
      maxEdgePixels: 320,
    });

    expect(thumbnail.mimeType).toBe('image/png');
    expect(thumbnail.widthPixels).toBe(320);
    expect(thumbnail.heightPixels).toBe(240);

    const metadata = await sharp(thumbnail.content).metadata();

    expect(metadata.format).toBe('png');
    expect(metadata.width).toBe(320);
    expect(metadata.height).toBe(240);
  });

  it('preserves JPEG output format for an initial JPEG Asset', async () => {
    const source = await sharp({
      create: {
        width: 800,
        height: 400,
        channels: 3,
        background: {
          r: 30,
          g: 100,
          b: 180,
        },
      },
    })
      .jpeg()
      .toBuffer();

    const processor = new SharpImageThumbnailProcessor();

    const thumbnail = await processor.createThumbnail({
      content: source,
      mimeType: 'image/jpeg',
      maxEdgePixels: 320,
    });

    expect(thumbnail.mimeType).toBe('image/jpeg');
    expect(thumbnail.widthPixels).toBe(320);
    expect(thumbnail.heightPixels).toBe(160);

    const metadata = await sharp(thumbnail.content).metadata();

    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(320);
    expect(metadata.height).toBe(160);
  });

  it('does not enlarge an image that already fits within the thumbnail bound', async () => {
    const source = await sharp({
      create: {
        width: 120,
        height: 80,
        channels: 3,
        background: {
          r: 20,
          g: 140,
          b: 80,
        },
      },
    })
      .png()
      .toBuffer();

    const processor = new SharpImageThumbnailProcessor();

    const thumbnail = await processor.createThumbnail({
      content: source,
      mimeType: 'image/png',
      maxEdgePixels: 320,
    });

    expect(thumbnail.widthPixels).toBe(120);
    expect(thumbnail.heightPixels).toBe(80);
  });
});
