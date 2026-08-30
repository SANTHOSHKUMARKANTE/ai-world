'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  listPublicKnowledgeDiscovery,
  type PublicKnowledgeDiscoveryItem,
  type PublicKnowledgeDiscoveryPreview,
} from '../knowledge/public-knowledge-discovery-api';
import { Button, LinkButton } from '../ui/primitives';

type DiscoveryState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly items: readonly PublicKnowledgeDiscoveryItem[];
    }
  | { readonly status: 'error' };

function mediaThumbnailPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/thumbnail`;
}

function mediaContentPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/content`;
}

function previewAltText(preview: PublicKnowledgeDiscoveryPreview, displayName: string): string {
  const explicit = preview.altText?.trim();
  return explicit && explicit.length > 0 ? explicit : `${displayName} devotional artwork`;
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

function useDevotionalDiscovery(): {
  readonly state: DiscoveryState;
  readonly retry: () => void;
} {
  const [state, setState] = useState<DiscoveryState>({ status: 'loading' });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;

    void listPublicKnowledgeDiscovery({
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      limit: 6,
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
          setState({
            status: 'error',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  return {
    state,
    retry: () => {
      setState({ status: 'loading' });
      setRequestVersion((version) => version + 1);
    },
  };
}

function DevotionalPreview({
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
        className="aw-devotional-discovery-card__media"
        data-preview-kind="none"
        aria-hidden="true"
      >
        <span className="aw-devotional-discovery-card__fallback">
          {item.displayName.slice(0, 1)}
        </span>
      </div>
    );
  }

  const altText = previewAltText(preview, item.displayName);

  if (preview.assetType === 'IMAGE') {
    return (
      <div className="aw-devotional-discovery-card__media" data-preview-kind="image">
        <Image
          src={mediaThumbnailPath(preview.assetId)}
          alt={altText}
          fill
          unoptimized
          sizes="(max-width: 42rem) 92vw, (max-width: 70rem) 45vw, 30vw"
        />
      </div>
    );
  }

  const posterAssetId = preview.posterAssetId;

  if (posterAssetId === null || !motionAllowed || preview.mimeType !== 'video/mp4') {
    return (
      <div className="aw-devotional-discovery-card__media" data-preview-kind="video-poster">
        {posterAssetId ? (
          <Image
            src={mediaThumbnailPath(posterAssetId)}
            alt={altText}
            fill
            unoptimized
            sizes="(max-width: 42rem) 92vw, (max-width: 70rem) 45vw, 30vw"
          />
        ) : (
          <span className="aw-devotional-discovery-card__fallback" aria-hidden="true">
            {item.displayName.slice(0, 1)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="aw-devotional-discovery-card__media" data-preview-kind="short-loop">
      <video
        data-devotional-discovery-short-loop="true"
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

function DeityCard({
  item,
  motionAllowed,
}: {
  readonly item: PublicKnowledgeDiscoveryItem;
  readonly motionAllowed: boolean;
}) {
  return (
    <li data-deity-resource-id={item.resourceId} data-deity-slug={item.slug}>
      <Link
        className="aw-devotional-discovery-card"
        href={`/devotional/${encodeURIComponent(item.slug)}`}
      >
        <DevotionalPreview item={item} motionAllowed={motionAllowed} />

        <div className="aw-devotional-discovery-card__body">
          <p className="aw-eyebrow">Deity</p>
          <h3>{item.displayName}</h3>
          <p>{item.summary}</p>
          <span className="aw-devotional-discovery-card__cta" aria-hidden="true">
            Explore deity <span>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

export function DevotionalUniverseDiscoveryFoundation() {
  const discovery = useDevotionalDiscovery();
  const motionAllowed = useShortMotionAllowed();
  const state = discovery.state;

  return (
    <>
      <section
        id="recently-updated-deities"
        className="aw-devotional-discovery"
        aria-labelledby="recently-updated-deities-heading"
        data-discovery-status={state.status}
      >
        <header className="aw-devotional-discovery__heading">
          <div>
            <p className="aw-eyebrow">Deity discovery</p>
            <h2 id="recently-updated-deities-heading">Recently Updated Deities</h2>
          </div>
          <p>Published Deities, ordered by their latest Knowledge updates.</p>
        </header>

        {state.status === 'loading' ? (
          <div className="aw-devotional-discovery-state" role="status">
            <p>Loading recently updated Deities…</p>
            <div className="aw-devotional-discovery-skeletons" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : null}

        {state.status === 'error' ? (
          <div
            className="aw-devotional-discovery-state aw-devotional-discovery-state--error"
            role="alert"
          >
            <div>
              <strong>Deity discovery is temporarily unavailable.</strong>
              <p>The Devotional front door is still here. Try the published Deity feed again.</p>
            </div>
            <Button variant="secondary" onClick={discovery.retry}>
              Try again
            </Button>
          </div>
        ) : null}

        {state.status === 'ready' && state.items.length === 0 ? (
          <div className="aw-devotional-discovery-state aw-devotional-discovery-state--empty">
            <div>
              <strong>No published Deities yet.</strong>
              <p>Explore AI World while the first published Deity pages arrive.</p>
            </div>
            <LinkButton href="/search" variant="secondary">
              Search AI World
            </LinkButton>
          </div>
        ) : null}

        {state.status === 'ready' && state.items.length > 0 ? (
          <ul
            className="aw-devotional-discovery-grid"
            aria-label="Recently Updated Devotional Deities"
          >
            {state.items.map((item) => (
              <DeityCard key={item.resourceId} item={item} motionAllowed={motionAllowed} />
            ))}
          </ul>
        ) : null}
      </section>

      <section className="aw-devotional-continue" aria-labelledby="devotional-continue-heading">
        <div>
          <p className="aw-eyebrow">Continue exploring</p>
          <h2 id="devotional-continue-heading">More published Knowledge across AI World</h2>
          <p>
            Continue through the shared Knowledge catalog or use the existing Search experience.
          </p>
        </div>
        <div className="aw-devotional-continue__actions">
          <LinkButton href="/knowledge" variant="secondary">
            Explore Knowledge
          </LinkButton>
          <LinkButton href="/search" variant="secondary">
            Search AI World
          </LinkButton>
        </div>
      </section>
    </>
  );
}
