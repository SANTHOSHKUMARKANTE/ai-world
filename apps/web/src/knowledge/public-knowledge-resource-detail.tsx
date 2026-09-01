'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { ApiClientError } from '../api/api-client';
import { ResourceEngagementControls } from '../engagement/resource-engagement-controls';
import { resolveWebUniversePresentation } from '../universes/presentation';
import { getPublicKnowledgeResource, type PublicKnowledgeResource } from './public-knowledge-api';
import {
  getPublicKnowledgeEntityByResourceId,
  type PublicKnowledgeEntity,
  type PublicKnowledgeEntityMedia,
} from './public-knowledge-entity-api';
import {
  formatPublicKnowledgeResourceType,
  resolvePublicKnowledgeDestination,
} from './public-knowledge-destination';
import { PublishedResourceImageGallery } from './published-resource-image-gallery';

type State =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly resource: PublicKnowledgeResource;
      readonly entity: PublicKnowledgeEntity | null;
    }
  | { readonly status: 'not-found' }
  | { readonly status: 'error' };

function genericPath(resourceId: string): string {
  return `/knowledge/resources/${encodeURIComponent(resourceId)}`;
}

function mediaThumbnailPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/thumbnail`;
}

function mediaContentPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/content`;
}

function mediaAlt(media: PublicKnowledgeEntityMedia, displayName: string): string {
  return media.altText?.trim() || `${displayName} artwork`;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

async function getOptionalEntity(resourceId: string): Promise<PublicKnowledgeEntity | null> {
  try {
    return await getPublicKnowledgeEntityByResourceId(resourceId);
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

function eligibleMedia(media: PublicKnowledgeEntityMedia): boolean {
  return (
    (media.assetType === 'IMAGE' && media.playback === 'STILL') ||
    (media.assetType === 'VIDEO' &&
      media.playback === 'SHORT_LOOP' &&
      media.mimeType === 'video/mp4' &&
      media.posterAssetId !== null &&
      media.durationMs !== undefined &&
      media.durationMs > 0 &&
      media.durationMs <= 8000)
  );
}

function GenericMedia({
  media,
  displayName,
  reducedMotion,
}: {
  readonly media: PublicKnowledgeEntityMedia;
  readonly displayName: string;
  readonly reducedMotion: boolean;
}) {
  const alt = mediaAlt(media, displayName);

  if (media.assetType === 'IMAGE') {
    return (
      <figure className="aw-generic-media-card">
        <Image
          src={mediaThumbnailPath(media.assetId)}
          alt={alt}
          width={media.width ?? 1200}
          height={media.height ?? 800}
          unoptimized
        />
        {media.caption ? <figcaption>{media.caption}</figcaption> : null}
      </figure>
    );
  }

  if (!media.posterAssetId) {
    return null;
  }

  return (
    <figure className="aw-generic-media-card">
      {reducedMotion ? (
        <Image
          data-generic-video-poster="true"
          src={mediaThumbnailPath(media.posterAssetId)}
          alt={alt}
          width={media.width ?? 1200}
          height={media.height ?? 800}
          unoptimized
        />
      ) : (
        <video
          data-generic-short-loop="true"
          src={mediaContentPath(media.assetId)}
          poster={mediaThumbnailPath(media.posterAssetId)}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      )}
      {media.caption ? <figcaption>{media.caption}</figcaption> : null}
    </figure>
  );
}

function ShareControls({
  resourceId,
  displayName,
}: {
  readonly resourceId: string;
  readonly displayName: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  function canonicalUrl(): string {
    return new URL(genericPath(resourceId), window.location.origin).toString();
  }

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(canonicalUrl());
      setMessage('Link copied.');
    } catch {
      setMessage('Copy is unavailable.');
    }
  }

  async function share(): Promise<void> {
    const url = canonicalUrl();

    try {
      if (navigator.share) {
        await navigator.share({ title: displayName, url });
        setMessage('Share opened.');
      } else {
        await navigator.clipboard.writeText(url);
        setMessage('Link copied for sharing.');
      }
    } catch {
      setMessage('Share was not completed.');
    }
  }

  return (
    <div className="aw-generic-share" aria-label="Share this Knowledge">
      <button
        className="aw-button aw-button--secondary aw-button--compact"
        type="button"
        onClick={share}
      >
        Share
      </button>
      <button
        className="aw-button aw-button--secondary aw-button--compact"
        type="button"
        onClick={copy}
      >
        Copy link
      </button>
      {message ? (
        <span className="aw-generic-share__message" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}

export function PublicKnowledgeResourceDetail({ resourceId }: { readonly resourceId: string }) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;

    void Promise.all([getPublicKnowledgeResource(resourceId), getOptionalEntity(resourceId)])
      .then(([resource, entity]) => {
        if (active) {
          setState({ status: 'ready', resource, entity });
        }
      })
      .catch((error: unknown) => {
        if (!active) return;

        setState(
          error instanceof ApiClientError && error.status === 404
            ? { status: 'not-found' }
            : { status: 'error' },
        );
      });

    return () => {
      active = false;
    };
  }, [attempt, resourceId]);

  useEffect(() => {
    if (state.status !== 'ready' || !state.entity) return;

    const destination = resolvePublicKnowledgeDestination({
      resourceId: state.entity.resource.id,
      universeKey: state.entity.resource.universeKey,
      resourceType: state.entity.resource.resourceType,
      slug: state.entity.profile.slug,
    });

    if (destination !== genericPath(resourceId)) {
      window.location.replace(destination);
    }
  }, [resourceId, state]);

  const relationGroups = useMemo(() => {
    if (state.status !== 'ready' || !state.entity) return [];

    const groups = new Map<string, PublicKnowledgeEntity['relations'][number][]>();
    for (const relation of state.entity.relations) {
      const group = groups.get(relation.sectionKey) ?? [];
      group.push(relation);
      groups.set(relation.sectionKey, group);
    }

    return [...groups.entries()].map(([sectionKey, relations]) => ({
      sectionKey,
      relations: relations.toSorted((left, right) => left.position - right.position),
    }));
  }, [state]);

  if (state.status === 'loading') {
    return (
      <div className="aw-resource-detail aw-generic-status" role="status">
        Loading published Knowledge…
      </div>
    );
  }

  if (state.status === 'not-found') {
    return (
      <div className="aw-resource-detail aw-generic-status" role="status">
        <strong>Published Knowledge not found</strong>
        <span>This resource is not publicly available.</span>
        <Link href="/knowledge" className="aw-text-link">
          Explore published Knowledge
        </Link>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="aw-resource-detail aw-generic-status" role="alert">
        <strong>This published Knowledge is temporarily unavailable.</strong>
        <button
          className="aw-button aw-button--secondary aw-button--compact"
          type="button"
          onClick={() => {
            setState({ status: 'loading' });
            setAttempt((value) => value + 1);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const { resource, entity } = state;
  const presentation = resolveWebUniversePresentation(resource.universeKey);
  const typeLabel = formatPublicKnowledgeResourceType(resource.resourceType);

  if (entity) {
    const destination = resolvePublicKnowledgeDestination({
      resourceId: entity.resource.id,
      universeKey: entity.resource.universeKey,
      resourceType: entity.resource.resourceType,
      slug: entity.profile.slug,
    });

    if (destination !== genericPath(resourceId)) {
      return (
        <div className="aw-resource-detail aw-generic-status" role="status">
          Opening the canonical {formatPublicKnowledgeResourceType(entity.resource.resourceType)}{' '}
          page…
        </div>
      );
    }

    const media = entity.media.filter(eligibleMedia);
    const overview =
      entity.profile.overview && entity.profile.overview !== entity.profile.summary
        ? entity.profile.overview
        : null;

    return (
      <article
        className="aw-resource-detail aw-generic-resource-detail"
        data-universe-tone={presentation?.tone}
        aria-labelledby="public-resource-title"
      >
        <header className="aw-resource-detail__header aw-generic-resource-hero">
          <p className="aw-eyebrow">
            {presentation?.label ?? 'AI World'} · {typeLabel} · Published Knowledge
          </p>
          <h1 id="public-resource-title">{entity.profile.displayName}</h1>
          <p className="aw-generic-resource-summary">{entity.profile.summary}</p>

          {entity.profile.nativeName || entity.profile.alternateNames.length > 0 ? (
            <div className="aw-generic-alternate-names">
              {entity.profile.nativeName ? <span>{entity.profile.nativeName}</span> : null}
              {entity.profile.alternateNames.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          ) : null}

          <ShareControls resourceId={resourceId} displayName={entity.profile.displayName} />
        </header>

        <ResourceEngagementControls resourceId={resource.id} />

        {media.length > 0 ? (
          <section className="aw-generic-section" aria-labelledby="generic-media-title">
            <div className="aw-generic-section__heading">
              <p className="aw-eyebrow">Published Media</p>
              <h2 id="generic-media-title">Media highlights</h2>
            </div>
            <div className="aw-generic-media-grid">
              {media.map((item) => (
                <GenericMedia
                  key={item.assetId}
                  media={item}
                  displayName={entity.profile.displayName}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </section>
        ) : null}

        {overview ? (
          <section className="aw-generic-section" aria-labelledby="generic-overview-title">
            <div className="aw-generic-section__heading">
              <p className="aw-eyebrow">Overview</p>
              <h2 id="generic-overview-title">About {entity.profile.displayName}</h2>
            </div>
            <p className="aw-generic-reading-copy">{overview}</p>
          </section>
        ) : null}

        {entity.profile.facts.length > 0 ? (
          <section className="aw-generic-section" aria-labelledby="generic-facts-title">
            <div className="aw-generic-section__heading">
              <p className="aw-eyebrow">Quick facts</p>
              <h2 id="generic-facts-title">Details</h2>
            </div>
            <dl className="aw-generic-facts">
              {entity.profile.facts.map((fact) => (
                <div key={fact.key}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {relationGroups.map(({ sectionKey, relations }) => (
          <section
            className="aw-generic-section"
            aria-labelledby={`generic-relation-${sectionKey}`}
            key={sectionKey}
          >
            <div className="aw-generic-section__heading">
              <p className="aw-eyebrow">Connected Knowledge</p>
              <h2 id={`generic-relation-${sectionKey}`}>Related Knowledge</h2>
            </div>
            <ul className="aw-generic-related-grid">
              {relations.map((relation) => {
                const href = resolvePublicKnowledgeDestination({
                  resourceId: relation.target.id,
                  universeKey: relation.target.universeKey,
                  resourceType: relation.target.resourceType,
                  slug: relation.target.slug,
                });

                return (
                  <li key={`${relation.relationshipType}:${relation.target.id}`}>
                    <Link href={href} className="aw-generic-related-card">
                      <strong>{relation.target.displayName}</strong>
                      <span>{relation.target.summary}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <dl className="aw-resource-meta aw-resource-meta--detail">
          <div>
            <dt>Type</dt>
            <dd>{typeLabel}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>
              {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
                new Date(resource.updatedAt),
              )}
            </dd>
          </div>
        </dl>

        <nav className="aw-generic-continuation" aria-label="Continue exploring">
          <Link href="/knowledge" className="aw-text-link">
            Explore Knowledge
          </Link>
          <Link href="/search" className="aw-text-link">
            Search AI World
          </Link>
        </nav>
      </article>
    );
  }

  return (
    <article
      className="aw-resource-detail aw-generic-resource-detail"
      data-universe-tone={presentation?.tone}
      aria-labelledby="public-resource-title"
    >
      <header className="aw-resource-detail__header aw-generic-resource-hero">
        <p className="aw-eyebrow">{presentation?.label ?? 'AI World'} · Published Knowledge</p>
        <h1 id="public-resource-title">{typeLabel}</h1>
        <p className="aw-generic-resource-summary">
          Published {typeLabel} in {presentation?.label ?? 'AI World'}.
        </p>
        <ShareControls resourceId={resourceId} displayName={typeLabel} />
      </header>

      <ResourceEngagementControls resourceId={resource.id} />

      <PublishedResourceImageGallery
        resourceId={resource.id}
        resourceType={resource.resourceType}
        label="Published imagery"
      />

      <dl className="aw-resource-meta aw-resource-meta--detail">
        <div>
          <dt>Type</dt>
          <dd>{typeLabel}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>
            {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
              new Date(resource.updatedAt),
            )}
          </dd>
        </div>
      </dl>

      <nav className="aw-generic-continuation" aria-label="Continue exploring">
        <Link href="/knowledge" className="aw-text-link">
          Explore Knowledge
        </Link>
        <Link href="/search" className="aw-text-link">
          Search AI World
        </Link>
      </nav>
    </article>
  );
}
