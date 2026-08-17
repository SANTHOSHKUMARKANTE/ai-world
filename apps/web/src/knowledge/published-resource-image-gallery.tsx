'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { listPublicKnowledgeResourceAssetIds } from './public-knowledge-api';

type PublishedResourceImageGalleryState =
  | {
      readonly status: 'loading';
    }
  | {
      readonly status: 'ready';
      readonly assetIds: readonly string[];
    }
  | {
      readonly status: 'error';
    };

export interface PublishedResourceImageGalleryProps {
  readonly resourceId: string;
  readonly resourceType: string;
  readonly label: string;
}

function mediaThumbnailPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/thumbnail`;
}

function mediaContentPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/content`;
}

export function PublishedResourceImageGallery({
  resourceId,
  resourceType,
  label,
}: PublishedResourceImageGalleryProps) {
  const [state, setState] = useState<PublishedResourceImageGalleryState>({
    status: 'loading',
  });
  const [unavailableAssetKeys, setUnavailableAssetKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  useEffect(() => {
    let active = true;

    void listPublicKnowledgeResourceAssetIds(resourceId)
      .then((assetIds) => {
        if (active) {
          setState({
            status: 'ready',
            assetIds,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            status: 'error',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [resourceId]);

  const visibleAssetIds = useMemo(() => {
    if (state.status !== 'ready') {
      return [];
    }

    return state.assetIds.filter(
      (assetId) => !unavailableAssetKeys.has(`${resourceId}:${assetId}`),
    );
  }, [resourceId, state, unavailableAssetKeys]);

  if (state.status === 'loading') {
    return (
      <p role="status" className="mt-4 text-sm text-slate-500">
        Loading {label.toLowerCase()}…
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <p role="alert" className="mt-4 text-sm text-slate-600">
        {label} is temporarily unavailable.
      </p>
    );
  }

  if (state.assetIds.length === 0 || visibleAssetIds.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={`${label} for ${resourceType}`}
      className="mt-5 border-t border-slate-200 pt-4"
    >
      <h4 className="text-sm font-semibold text-slate-800">{label}</h4>

      <ul className="mt-3 grid grid-cols-2 gap-3">
        {visibleAssetIds.map((assetId) => (
          <li key={assetId}>
            <a
              href={mediaContentPath(assetId)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open full-size ${label.toLowerCase()}`}
              className="block overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={mediaThumbnailPath(assetId)}
                  alt={`${label} for this published resource`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 240px"
                  className="object-cover"
                  onError={() => {
                    setUnavailableAssetKeys((current) => {
                      const next = new Set(current);
                      next.add(`${resourceId}:${assetId}`);
                      return next;
                    });
                  }}
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
