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
  return explicit && explicit.length > 0 ? explicit : `${displayName} artwork`;
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

function useAnimeDiscovery(
  resourceType: 'anime.character' | 'anime.series',
  limit: number,
): {
  readonly state: DiscoveryState;
  readonly retry: () => void;
} {
  const [state, setState] = useState<DiscoveryState>({ status: 'loading' });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;

    void listPublicKnowledgeDiscovery({
      universeKey: 'universe.anime',
      resourceType,
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
          setState({
            status: 'error',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [limit, requestVersion, resourceType]);

  return {
    state,
    retry: () => {
      setState({ status: 'loading' });
      setRequestVersion((version) => version + 1);
    },
  };
}

function DiscoveryPreview({
  item,
  motionAllowed,
}: {
  readonly item: PublicKnowledgeDiscoveryItem;
  readonly motionAllowed: boolean;
}) {
  const preview = item.previewMedia;

  if (preview === null) {
    return (
      <div className="aw-anime-discovery-card__media" data-preview-kind="none" aria-hidden="true">
        <span className="aw-anime-discovery-card__fallback">{item.displayName.slice(0, 1)}</span>
      </div>
    );
  }

  const altText = previewAltText(preview, item.displayName);

  if (preview.assetType === 'IMAGE') {
    return (
      <div className="aw-anime-discovery-card__media" data-preview-kind="image">
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
      <div className="aw-anime-discovery-card__media" data-preview-kind="video-poster">
        {posterAssetId ? (
          <Image
            src={mediaThumbnailPath(posterAssetId)}
            alt={altText}
            fill
            unoptimized
            sizes="(max-width: 42rem) 92vw, (max-width: 70rem) 45vw, 30vw"
          />
        ) : (
          <span className="aw-anime-discovery-card__fallback" aria-hidden="true">
            {item.displayName.slice(0, 1)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="aw-anime-discovery-card__media" data-preview-kind="short-loop">
      <video
        data-anime-discovery-short-loop="true"
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

function CharacterCard({
  item,
  motionAllowed,
}: {
  readonly item: PublicKnowledgeDiscoveryItem;
  readonly motionAllowed: boolean;
}) {
  return (
    <li data-character-slug={item.slug}>
      <Link
        className="aw-anime-discovery-card"
        href={`/anime/characters/${encodeURIComponent(item.slug)}`}
      >
        <DiscoveryPreview item={item} motionAllowed={motionAllowed} />

        <div className="aw-anime-discovery-card__body">
          <p className="aw-eyebrow">Character</p>
          <h3>{item.displayName}</h3>
          <p>{item.summary}</p>
          <span className="aw-anime-discovery-card__cta" aria-hidden="true">
            Explore character <span>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

function SeriesCard({
  item,
  motionAllowed,
}: {
  readonly item: PublicKnowledgeDiscoveryItem;
  readonly motionAllowed: boolean;
}) {
  return (
    <li data-series-resource-id={item.resourceId}>
      <Link
        className="aw-anime-discovery-card aw-anime-series-card"
        href={`/knowledge/resources/${encodeURIComponent(item.resourceId)}`}
      >
        <DiscoveryPreview item={item} motionAllowed={motionAllowed} />

        <div className="aw-anime-discovery-card__body">
          <p className="aw-eyebrow">Series</p>
          <h3>{item.displayName}</h3>
          <p>{item.summary}</p>
          <span className="aw-anime-discovery-card__cta" aria-hidden="true">
            Open series knowledge <span>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

function SeriesDiscovery({
  state,
  motionAllowed,
}: {
  readonly state: DiscoveryState;
  readonly motionAllowed: boolean;
}) {
  if (state.status === 'loading') {
    return null;
  }

  if (state.status === 'error') {
    return (
      <section
        className="aw-anime-series"
        aria-labelledby="anime-series-heading"
        data-series-status="error"
      >
        <header className="aw-anime-discovery__heading">
          <div>
            <p className="aw-eyebrow">Series discovery</p>
            <h2 id="anime-series-heading">Explore Series</h2>
          </div>
        </header>
        <p className="aw-anime-series-note" role="status">
          Published Series discovery is temporarily unavailable. Character discovery remains
          available above.
        </p>
      </section>
    );
  }

  if (state.items.length === 0) {
    return null;
  }

  return (
    <section
      className="aw-anime-series"
      aria-labelledby="anime-series-heading"
      data-series-status="ready"
    >
      <header className="aw-anime-discovery__heading">
        <div>
          <p className="aw-eyebrow">Series discovery</p>
          <h2 id="anime-series-heading">Explore Series</h2>
        </div>
        <p>Published Anime Series from the same public Knowledge catalog.</p>
      </header>

      <ul
        className="aw-anime-discovery-grid aw-anime-series-grid"
        aria-label="Published Anime Series"
      >
        {state.items.map((item) => (
          <SeriesCard key={item.resourceId} item={item} motionAllowed={motionAllowed} />
        ))}
      </ul>
    </section>
  );
}

export function AnimeUniverseDiscoveryFoundation() {
  const characterDiscovery = useAnimeDiscovery('anime.character', 6);
  const seriesDiscovery = useAnimeDiscovery('anime.series', 4);
  const motionAllowed = useShortMotionAllowed();
  const state = characterDiscovery.state;

  return (
    <>
      <section
        id="recently-updated-characters"
        className="aw-anime-discovery"
        aria-labelledby="recently-updated-characters-heading"
        data-discovery-status={state.status}
      >
        <header className="aw-anime-discovery__heading">
          <div>
            <p className="aw-eyebrow">Character discovery</p>
            <h2 id="recently-updated-characters-heading">Recently Updated Characters</h2>
          </div>
          <p>Published Anime Characters, ordered by their latest Knowledge updates.</p>
        </header>

        {state.status === 'loading' ? (
          <div className="aw-anime-discovery-state" role="status">
            <p>Loading recently updated characters…</p>
            <div className="aw-anime-discovery-skeletons" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : null}

        {state.status === 'error' ? (
          <div className="aw-anime-discovery-state aw-anime-discovery-state--error" role="alert">
            <div>
              <strong>Character discovery is temporarily unavailable.</strong>
              <p>The Anime front door is still here. Try the published Character feed again.</p>
            </div>
            <Button variant="secondary" onClick={characterDiscovery.retry}>
              Try again
            </Button>
          </div>
        ) : null}

        {state.status === 'ready' && state.items.length === 0 ? (
          <div className="aw-anime-discovery-state aw-anime-discovery-state--empty">
            <div>
              <strong>No published Anime Characters yet.</strong>
              <p>Search AI World while the first published Character pages arrive.</p>
            </div>
            <LinkButton href="/search" variant="secondary">
              Search Anime
            </LinkButton>
          </div>
        ) : null}

        {state.status === 'ready' && state.items.length > 0 ? (
          <ul className="aw-anime-discovery-grid" aria-label="Recently Updated Anime Characters">
            {state.items.map((item) => (
              <CharacterCard key={item.resourceId} item={item} motionAllowed={motionAllowed} />
            ))}
          </ul>
        ) : null}
      </section>

      <SeriesDiscovery state={seriesDiscovery.state} motionAllowed={motionAllowed} />
    </>
  );
}
