'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import {
  listPublicKnowledgeDiscovery,
  type PublicKnowledgeDiscoveryItem,
  type PublicKnowledgeDiscoveryPreview,
} from './public-knowledge-discovery-api';
import {
  formatPublicKnowledgeResourceType,
  resolvePublicKnowledgeDestination,
} from './public-knowledge-destination';
import { Button } from '../ui/primitives';

const DEFAULT_KNOWLEDGE_BROWSE_LIMIT = 8;

type KnowledgeSectionState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly items: readonly PublicKnowledgeDiscoveryItem[];
    }
  | { readonly status: 'error' };

export interface KnowledgeUniverseSectionProps {
  readonly sectionId: string;
  readonly title: string;
  readonly description: string;
  readonly universeKey: string;
  readonly priority?: 'primary' | 'secondary';
  readonly tone?: 'devotional' | 'anime';
  readonly limit?: number;
}

function formatUpdatedAt(updatedAt: string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(new Date(updatedAt));
}

function mediaThumbnailPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/thumbnail`;
}

function mediaContentPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/content`;
}

function previewAltText(preview: PublicKnowledgeDiscoveryPreview, displayName: string): string {
  const explicit = preview.altText?.trim();

  return explicit && explicit.length > 0 ? explicit : `${displayName} preview`;
}

function useShortMotionAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAllowed(!query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => {
      query.removeEventListener('change', sync);
    };
  }, []);

  return allowed;
}

function KnowledgePreview({
  item,
  motionAllowed,
}: {
  readonly item: PublicKnowledgeDiscoveryItem;
  readonly motionAllowed: boolean;
}) {
  const preview = item.previewMedia;

  if (preview === null) {
    return (
      <div
        className="aw-knowledge-discovery-card__media"
        data-preview-kind="none"
        aria-hidden="true"
      >
        <span className="aw-knowledge-discovery-card__fallback">
          {item.displayName.trim().slice(0, 1) || 'K'}
        </span>
      </div>
    );
  }

  const altText = previewAltText(preview, item.displayName);

  if (preview.assetType === 'IMAGE') {
    return (
      <div className="aw-knowledge-discovery-card__media" data-preview-kind="image">
        <Image
          src={mediaThumbnailPath(preview.assetId)}
          alt={altText}
          fill
          unoptimized
          sizes="(max-width: 48rem) 92vw, 42vw"
        />
      </div>
    );
  }

  const posterAssetId = preview.posterAssetId;

  if (posterAssetId === null || !motionAllowed || preview.mimeType !== 'video/mp4') {
    return (
      <div className="aw-knowledge-discovery-card__media" data-preview-kind="video-poster">
        {posterAssetId ? (
          <Image
            src={mediaThumbnailPath(posterAssetId)}
            alt={altText}
            fill
            unoptimized
            sizes="(max-width: 48rem) 92vw, 42vw"
          />
        ) : (
          <span className="aw-knowledge-discovery-card__fallback" aria-hidden="true">
            {item.displayName.trim().slice(0, 1) || 'K'}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="aw-knowledge-discovery-card__media" data-preview-kind="short-loop">
      <video
        data-knowledge-discovery-short-loop="true"
        src={mediaContentPath(preview.assetId)}
        poster={mediaThumbnailPath(posterAssetId)}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={altText}
      />
    </div>
  );
}

function KnowledgeCard({
  item,
  motionAllowed,
}: {
  readonly item: PublicKnowledgeDiscoveryItem;
  readonly motionAllowed: boolean;
}) {
  const destination = resolvePublicKnowledgeDestination(item);
  const resourceLabel = formatPublicKnowledgeResourceType(item.resourceType);

  return (
    <li
      data-knowledge-resource-id={item.resourceId}
      data-knowledge-resource-type={item.resourceType}
      data-knowledge-resource-destination={destination}
    >
      <Link
        className="aw-knowledge-discovery-card"
        href={destination}
        aria-label={`Open ${item.displayName}`}
      >
        <KnowledgePreview item={item} motionAllowed={motionAllowed} />

        <div className="aw-knowledge-discovery-card__body">
          <div className="aw-knowledge-discovery-card__identity">
            <p className="aw-eyebrow">{resourceLabel}</p>
            <time dateTime={item.updatedAt}>Updated {formatUpdatedAt(item.updatedAt)}</time>
          </div>
          <h3>{item.displayName}</h3>
          {item.summary.trim().length > 0 ? <p>{item.summary}</p> : null}
          <span className="aw-knowledge-discovery-card__cta" aria-hidden="true">
            Open published Knowledge <span>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

export function KnowledgeUniverseSection({
  sectionId,
  title,
  description,
  universeKey,
  priority = 'secondary',
  tone,
  limit = DEFAULT_KNOWLEDGE_BROWSE_LIMIT,
}: KnowledgeUniverseSectionProps) {
  const [state, setState] = useState<KnowledgeSectionState>({ status: 'loading' });
  const [requestVersion, setRequestVersion] = useState(0);
  const motionAllowed = useShortMotionAllowed();

  const headingId = useMemo(() => `${sectionId}-heading`, [sectionId]);

  useEffect(() => {
    let active = true;

    void listPublicKnowledgeDiscovery({
      universeKey,
      limit,
    })
      .then((items) => {
        if (active) {
          setState({
            status: 'ready',
            items,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error' });
        }
      });

    return () => {
      active = false;
    };
  }, [limit, requestVersion, universeKey]);

  const retry = () => {
    setState({ status: 'loading' });
    setRequestVersion((version) => version + 1);
  };

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      data-priority={priority}
      data-universe={universeKey}
      data-universe-tone={tone}
      data-discovery-status={state.status}
      className="aw-universe-section aw-knowledge-universe-section"
    >
      <header className="aw-universe-section__header aw-knowledge-universe-section__header">
        <p className="aw-eyebrow">{priority === 'primary' ? 'Start here' : 'Continue exploring'}</p>
        <h2 id={headingId}>{title}</h2>
        <p>{description}</p>
        <p className="aw-knowledge-universe-section__ordering">
          Published Knowledge, ordered by the latest canonical updates.
        </p>
      </header>

      {state.status === 'loading' ? (
        <div className="aw-knowledge-discovery-state" role="status">
          <p>Loading published {title}…</p>
          <div className="aw-knowledge-discovery-skeletons" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      ) : null}

      {state.status === 'error' ? (
        <div
          className="aw-knowledge-discovery-state aw-knowledge-discovery-state--error"
          role="alert"
        >
          <div>
            <strong>{title} is temporarily unavailable.</strong>
            <p>Try the published Knowledge feed again without leaving this page.</p>
          </div>
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : null}

      {state.status === 'ready' && state.items.length === 0 ? (
        <div className="aw-knowledge-discovery-state aw-knowledge-discovery-state--empty">
          <strong>No published resources yet.</strong>
          <p>This Universe remains available while published Knowledge is being prepared.</p>
        </div>
      ) : null}

      {state.status === 'ready' && state.items.length > 0 ? (
        <ul
          className="aw-knowledge-discovery-grid"
          aria-label={`${title} recently updated resources`}
        >
          {state.items.map((item) => (
            <KnowledgeCard key={item.resourceId} item={item} motionAllowed={motionAllowed} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
