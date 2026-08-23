import { describe, expect, it } from 'vitest';

import {
  MEDIA_SHORT_VIDEO_MAX_DURATION_MS,
  MEDIA_UPLOAD_MP4_MIME_TYPE,
  validateMediaUpload,
} from '../src/media-upload-policy';
import { inspectShortMp4Video } from '../src/mp4-short-video';

function box(type: string, payload: Uint8Array): Uint8Array {
  const result = new Uint8Array(8 + payload.byteLength);
  const view = new DataView(result.buffer);
  view.setUint32(0, result.byteLength);
  for (let index = 0; index < 4; index += 1) {
    result[4 + index] = type.charCodeAt(index);
  }
  result.set(payload, 8);
  return result;
}

function concat(...parts: readonly Uint8Array[]): Uint8Array {
  const length = parts.reduce((total, part) => total + part.byteLength, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.byteLength;
  }
  return result;
}

function shortMp4(durationMs: number, codec = 'avc1'): Uint8Array {
  const ftyp = new Uint8Array(16);
  ftyp.set([0x69, 0x73, 0x6f, 0x6d], 0);
  ftyp.set([0x69, 0x73, 0x6f, 0x6d], 8);

  const mvhd = new Uint8Array(20);
  const view = new DataView(mvhd.buffer);
  view.setUint32(12, 1000);
  view.setUint32(16, durationMs);

  return concat(
    box('ftyp', ftyp),
    box('moov', concat(box('mvhd', mvhd), box(codec, new Uint8Array(0)))),
  );
}

describe('inspectShortMp4Video', () => {
  it('extracts bounded version-0 movie duration and requires an AVC sample marker', () => {
    expect(inspectShortMp4Video(shortMp4(5000))).toEqual({ durationMs: 5000 });
  });

  it('rejects malformed ISO BMFF structure safely', () => {
    expect(() => inspectShortMp4Video(new Uint8Array([1, 2, 3, 4]))).toThrow('Invalid MP4');
  });

  it('rejects MP4 structure without an H.264/AVC sample marker', () => {
    expect(() => inspectShortMp4Video(shortMp4(5000, 'vp09'))).toThrow('H.264/AVC');
  });
});

describe('validateMediaUpload VIDEO policy', () => {
  it('accepts a bounded video/mp4 and records canonical duration metadata', () => {
    const content = shortMp4(5000);
    expect(validateMediaUpload(content, MEDIA_UPLOAD_MP4_MIME_TYPE)).toEqual({
      assetType: 'VIDEO',
      technicalMetadata: {
        mimeType: 'video/mp4',
        sizeBytes: content.byteLength,
        durationMs: 5000,
      },
    });
  });

  it('rejects video longer than the bounded short-motion capability', () => {
    expect(() =>
      validateMediaUpload(
        shortMp4(MEDIA_SHORT_VIDEO_MAX_DURATION_MS + 1),
        MEDIA_UPLOAD_MP4_MIME_TYPE,
      ),
    ).toThrow('duration');
  });

  it('rejects declared video/mp4 when bytes are not plausible MP4', () => {
    expect(() =>
      validateMediaUpload(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), MEDIA_UPLOAD_MP4_MIME_TYPE),
    ).toThrow('Invalid MP4');
  });
});
