'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { PublicKnowledgeEntityMedia } from '../knowledge/public-knowledge-entity-api';

function mediaThumbnailPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/thumbnail`;
}

function mediaContentPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/content`;
}

function mediaAltText(media: PublicKnowledgeEntityMedia, displayName: string): string {
  const altText = media.altText?.trim();
  return altText && altText.length > 0 ? altText : `${displayName} artwork`;
}

export function AnimeEntityMediaViewer({
  media,
  displayName,
  onRequestClose,
}: {
  readonly media: PublicKnowledgeEntityMedia | null;
  readonly displayName: string;
  readonly onRequestClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (media) {
      if (!dialog.open) {
        dialog.showModal();
      }

      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [media]);

  const mediaName = media ? mediaAltText(media, displayName) : '';

  return (
    <dialog
      ref={dialogRef}
      className="aw-anime-media-viewer"
      aria-labelledby="aw-anime-media-viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        onRequestClose();
      }}
    >
      {media ? (
        <div className="aw-anime-media-viewer__surface">
          <header className="aw-anime-media-viewer__header">
            <div>
              <p className="aw-eyebrow">{media.assetType === 'VIDEO' ? 'Short motion' : 'Image'}</p>
              <h2 id="aw-anime-media-viewer-title">{displayName} media</h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="aw-anime-media-viewer__close"
              aria-label="Close media viewer"
              onClick={onRequestClose}
            >
              Close
            </button>
          </header>

          <div className="aw-anime-media-viewer__frame">
            {media.assetType === 'VIDEO' ? (
              <video
                key={media.assetId}
                data-anime-viewer-video="true"
                data-character-viewer-video="true"
                src={mediaContentPath(media.assetId)}
                poster={media.posterAssetId ? mediaThumbnailPath(media.posterAssetId) : undefined}
                controls
                playsInline
                preload="metadata"
                aria-label={mediaName}
              />
            ) : (
              <Image
                key={media.assetId}
                src={mediaContentPath(media.assetId)}
                alt={mediaName}
                fill
                unoptimized
                sizes="min(92vw, 1120px)"
              />
            )}
          </div>

          {media.caption ? <p className="aw-anime-media-viewer__caption">{media.caption}</p> : null}
        </div>
      ) : null}
    </dialog>
  );
}
