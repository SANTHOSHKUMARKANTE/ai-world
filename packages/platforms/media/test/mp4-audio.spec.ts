import { describe, expect, it } from 'vitest';

import { inspectMp4Audio } from '../src/mp4-audio';
import {
  AAC_LC_AUDIO_MP4,
  MIXED_AUDIO_VIDEO_MP4,
  asVideoOnly,
  withAudioObjectType,
} from './audio-mp4-fixture';

describe('inspectMp4Audio', () => {
  it('accepts the rights-safe AAC-LC audio/mp4 fixture and derives mdhd duration', () => {
    expect(inspectMp4Audio(AAC_LC_AUDIO_MP4)).toEqual({
      durationMs: 273,
    });
  });

  it('rejects a generic mp4a track when AudioSpecificConfig is not AAC-LC', () => {
    expect(() => inspectMp4Audio(withAudioObjectType(AAC_LC_AUDIO_MP4, 5))).toThrow(
      'AAC-LC Audio Object Type 2 is required',
    );
  });

  it('rejects truncated AudioSpecificConfig even when the first AOT bits say AAC-LC', () => {
    const result = Buffer.from(AAC_LC_AUDIO_MP4);
    const marker = Buffer.from([0x05, 0x80, 0x80, 0x80, 0x05]);
    const markerIndex = result.indexOf(marker);

    expect(markerIndex).toBeGreaterThanOrEqual(0);
    result[markerIndex + 4] = 1;

    expect(() => inspectMp4Audio(result)).toThrow(
      'AudioSpecificConfig is truncated while reading samplingFrequencyIndex',
    );
  });

  it('rejects extensionFlag metadata truncated before mandatory extensionFlag3', () => {
    const result = Buffer.from(AAC_LC_AUDIO_MP4);
    const marker = Buffer.from([0x05, 0x80, 0x80, 0x80, 0x05]);
    const markerIndex = result.indexOf(marker);

    expect(markerIndex).toBeGreaterThanOrEqual(0);
    result[markerIndex + 4] = 2;
    const configIndex = markerIndex + marker.byteLength;
    result[configIndex + 1] = result[configIndex + 1]! | 0x01;

    expect(() => inspectMp4Audio(result)).toThrow(
      'AudioSpecificConfig is truncated while reading extensionFlag3',
    );
  });

  it('rejects non-zero AAC-LC extensionFlag3', () => {
    const result = Buffer.from(AAC_LC_AUDIO_MP4);
    const marker = Buffer.from([0x05, 0x80, 0x80, 0x80, 0x05]);
    const markerIndex = result.indexOf(marker);

    expect(markerIndex).toBeGreaterThanOrEqual(0);
    result[markerIndex + 4] = 3;
    const configIndex = markerIndex + marker.byteLength;
    result[configIndex + 1] = result[configIndex + 1]! | 0x01;
    result[configIndex + 2] = result[configIndex + 2]! | 0x80;

    expect(() => inspectMp4Audio(result)).toThrow('AAC-LC extensionFlag3 must be zero');
  });

  it('rejects implicit SBR/HE-AAC signalled through the AAC sync extension', () => {
    const result = Buffer.from(AAC_LC_AUDIO_MP4);
    const marker = Buffer.from([0x05, 0x80, 0x80, 0x80, 0x05]);
    const markerIndex = result.indexOf(marker);

    expect(markerIndex).toBeGreaterThanOrEqual(0);
    const configIndex = markerIndex + marker.byteLength;
    result[configIndex + 4] = result[configIndex + 4]! | 0x80;

    expect(() => inspectMp4Audio(result)).toThrow(
      'SBR/HE-AAC is outside the initial AAC-LC profile',
    );
  });

  it('rejects video-only and mixed audio/video MP4 content', () => {
    expect(() => inspectMp4Audio(asVideoOnly(AAC_LC_AUDIO_MP4))).toThrow(
      'VIDEO tracks are not permitted',
    );
    expect(() => inspectMp4Audio(MIXED_AUDIO_VIDEO_MP4)).toThrow('VIDEO tracks are not permitted');
  });

  it('rejects a dense tiny-box payload while keeping box scanning streaming', () => {
    const boxCount = 100_000;
    const content = Buffer.allocUnsafe((boxCount + 1) * 8);

    content.writeUInt32BE(8, 0);
    content.write('ftyp', 4, 'ascii');

    for (let index = 1; index <= boxCount; index += 1) {
      const offset = index * 8;
      content.writeUInt32BE(8, offset);
      content.write('free', offset + 4, 'ascii');
    }

    expect(() => inspectMp4Audio(content)).toThrow('moov box is required');
  });

  it('rejects truncated or metadata-only spoofed content safely', () => {
    expect(() => inspectMp4Audio(AAC_LC_AUDIO_MP4.subarray(0, 96))).toThrow(TypeError);

    const withoutMediaData = AAC_LC_AUDIO_MP4.subarray(0, 838);
    expect(() => inspectMp4Audio(withoutMediaData)).toThrow(
      'non-empty mdat media data is required',
    );
  });
});
