import { describe, expect, it } from 'vitest';

import {
  ASSET_ARCHIVED_LIFECYCLE,
  ASSET_AUDIO_TYPE,
  ASSET_DELETED_LIFECYCLE,
  ASSET_DOCUMENT_TYPE,
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
  ASSET_VIDEO_TYPE,
  isAssetLifecycle,
  isAssetType,
  type Asset,
} from '../src';

describe('Media Asset model baseline', () => {
  it('defines the canonical P5-M01 Asset Type vocabulary', () => {
    expect(ASSET_IMAGE_TYPE).toBe('IMAGE');
    expect(ASSET_VIDEO_TYPE).toBe('VIDEO');
    expect(ASSET_AUDIO_TYPE).toBe('AUDIO');
    expect(ASSET_DOCUMENT_TYPE).toBe('DOCUMENT');

    expect(isAssetType('IMAGE')).toBe(true);
    expect(isAssetType('VIDEO')).toBe(true);
    expect(isAssetType('AUDIO')).toBe(true);
    expect(isAssetType('DOCUMENT')).toBe(true);
    expect(isAssetType('image/png')).toBe(false);
    expect(isAssetType('UNKNOWN')).toBe(false);
  });

  it('keeps Asset Type distinct from concrete MIME Type', () => {
    const asset: Asset = {
      id: '3f58a301-16e4-4a9e-8e92-bebcd3e0d581',
      assetType: ASSET_IMAGE_TYPE,
      technicalMetadata: {
        mimeType: 'image/png',
        sizeBytes: 1_024,
      },
      storageReference: 'media/test/image.png',
      lifecycle: ASSET_INITIAL_LIFECYCLE,
      createdAt: new Date('2026-08-16T09:56:00.000Z'),
      updatedAt: new Date('2026-08-16T09:56:00.000Z'),
    };

    expect(asset.assetType).toBe('IMAGE');
    expect(asset.technicalMetadata.mimeType).toBe('image/png');
    expect(asset.assetType).not.toBe(asset.technicalMetadata.mimeType);
  });

  it('defines ACTIVE as the initial Asset lifecycle', () => {
    expect(ASSET_INITIAL_LIFECYCLE).toBe('ACTIVE');
    expect(isAssetLifecycle('ACTIVE')).toBe(true);
  });

  it('defines the bounded P5-M01 lifecycle vocabulary', () => {
    expect(ASSET_ARCHIVED_LIFECYCLE).toBe('ARCHIVED');
    expect(ASSET_DELETED_LIFECYCLE).toBe('DELETED');

    expect(isAssetLifecycle('ARCHIVED')).toBe(true);
    expect(isAssetLifecycle('DELETED')).toBe(true);
    expect(isAssetLifecycle('active')).toBe(false);
    expect(isAssetLifecycle('PENDING')).toBe(false);
    expect(isAssetLifecycle(null)).toBe(false);
  });

  it('keeps storageReference opaque and provider-neutral at the model boundary', () => {
    const asset: Asset = {
      id: '5bfbba1e-4d9b-4acf-a789-36c78e0fb226',
      assetType: ASSET_DOCUMENT_TYPE,
      technicalMetadata: {
        mimeType: 'application/pdf',
        sizeBytes: 4_096,
      },
      storageReference: 'media/test/document.pdf',
      lifecycle: ASSET_INITIAL_LIFECYCLE,
      createdAt: new Date('2026-08-16T09:56:00.000Z'),
      updatedAt: new Date('2026-08-16T09:56:00.000Z'),
    };

    expect(asset.storageReference).toBe('media/test/document.pdf');
  });
});
