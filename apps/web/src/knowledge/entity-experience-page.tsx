'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { ResourceEngagementControls } from '../engagement/resource-engagement-controls';
import {
  resolveEntitySectionTitle,
  resolveWebUniversePresentation,
  type WebUniversePresentation,
} from '../universes/presentation';
import {
  getPublicKnowledgeEntity,
  type PublicKnowledgeEntity,
  type PublicKnowledgeEntityMedia,
  type PublicKnowledgeEntityRelation,
} from './public-knowledge-entity-api';

type State =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly entity: PublicKnowledgeEntity }
  | { readonly status: 'error' };

const SECTION_ORDER = [
  'entity.forms',
  'entity.meditation',
  'entity.stories',
  'entity.family',
  'entity.temples',
  'entity.quotes',
  'entity.experiences',
] as const;

function entityKindLabel(resourceType: string): string {
  switch (resourceType) {
    case 'devotional.deity':
      return 'Deity';
    case 'anime.character':
      return 'Character';
    case 'anime.series':
      return 'Series';
    default:
      return 'Entity';
  }
}

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

function isPlayableShortLoopMedia(media: PublicKnowledgeEntityMedia): boolean {
  return (
    media.assetType === 'VIDEO' &&
    media.playback === 'SHORT_LOOP' &&
    media.mimeType === 'video/mp4' &&
    media.posterAssetId !== null &&
    media.durationMs !== undefined &&
    Number.isInteger(media.durationMs) &&
    media.durationMs > 0 &&
    media.durationMs <= 8000
  );
}

function ShortLoopVisual({
  media,
  displayName,
  motionAllowed,
  priority = false,
  sizes,
}: {
  readonly media: PublicKnowledgeEntityMedia;
  readonly displayName: string;
  readonly motionAllowed: boolean;
  readonly priority?: boolean;
  readonly sizes: string;
}) {
  if (!media.posterAssetId) {
    return null;
  }

  if (!motionAllowed || !isPlayableShortLoopMedia(media)) {
    return (
      <Image
        src={mediaThumbnailPath(media.posterAssetId)}
        alt={mediaAltText(media, displayName)}
        fill
        unoptimized
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <video
      data-short-loop="true"
      src={mediaContentPath(media.assetId)}
      poster={mediaThumbnailPath(media.posterAssetId)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={mediaAltText(media, displayName)}
    />
  );
}

function entityPath(target: PublicKnowledgeEntityRelation['target']): string {
  if (target.resourceType === 'devotional.deity') {
    return `/devotional/${encodeURIComponent(target.slug)}`;
  }

  if (target.resourceType === 'anime.character') {
    return `/anime/characters/${encodeURIComponent(target.slug)}`;
  }

  return `/knowledge/resources/${encodeURIComponent(target.id)}`;
}

function sectionAnchor(sectionKey: string): string {
  return `entity-${sectionKey.replaceAll('.', '-')}`;
}

function EntityRail({
  sectionKey,
  items,
  displayName,
  presentation,
}: {
  readonly sectionKey: string;
  readonly items: readonly PublicKnowledgeEntityRelation[];
  readonly displayName: string;
  readonly presentation: WebUniversePresentation | undefined;
}) {
  const title = resolveEntitySectionTitle(presentation, sectionKey, displayName);
  const quoteSection = sectionKey === 'entity.quotes';

  return (
    <section
      id={sectionAnchor(sectionKey)}
      className="aw-entity-section"
      aria-labelledby={`${sectionAnchor(sectionKey)}-title`}
    >
      <div className="aw-entity-section__heading">
        <h2 id={`${sectionAnchor(sectionKey)}-title`}>{title}</h2>
      </div>

      <ul className={`aw-entity-rail ${quoteSection ? 'aw-entity-rail--quotes' : ''}`}>
        {items.map((relation) => (
          <li key={`${relation.relationshipType}:${relation.target.id}`}>
            {quoteSection ? (
              <blockquote className="aw-entity-quote-card">
                <p>“{relation.target.displayName}”</p>
                <footer>{relation.target.summary}</footer>
              </blockquote>
            ) : (
              <Link
                href={entityPath(relation.target)}
                className="aw-entity-card"
                aria-label={relation.target.displayName}
              >
                <div className="aw-entity-card__media">
                  {relation.target.previewAssetId ? (
                    <Image
                      src={mediaThumbnailPath(relation.target.previewAssetId)}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 700px) 74vw, 240px"
                    />
                  ) : (
                    <span className="aw-entity-card__fallback" aria-hidden="true">
                      {relation.target.displayName.slice(0, 1)}
                    </span>
                  )}
                </div>
                <div className="aw-entity-card__body">
                  <h3>{relation.target.displayName}</h3>
                  <p>{relation.target.summary}</p>
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EntityExperiencePage({
  universeKey,
  slug,
}: {
  readonly universeKey: string;
  readonly slug: string;
}) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    void getPublicKnowledgeEntity(universeKey, slug)
      .then((entity) => {
        if (active) {
          setState({ status: 'ready', entity });
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
  }, [slug, universeKey]);

  const motionAllowed = useShortMotionAllowed();

  const grouped = useMemo(() => {
    if (state.status !== 'ready') {
      return new Map<string, PublicKnowledgeEntityRelation[]>();
    }

    const groups = new Map<string, PublicKnowledgeEntityRelation[]>();

    for (const relation of state.entity.relations) {
      const group = groups.get(relation.sectionKey) ?? [];
      group.push(relation);
      groups.set(relation.sectionKey, group);
    }

    for (const group of groups.values()) {
      group.sort((left, right) => left.position - right.position);
    }

    return groups;
  }, [state]);

  if (state.status === 'loading') {
    return (
      <div className="aw-entity-status" role="status">
        Opening this world…
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="aw-entity-status" role="alert">
        This page is not available yet.
      </div>
    );
  }

  const entity = state.entity;
  const presentation = resolveWebUniversePresentation(entity.resource.universeKey);
  const mediaHighlights = entity.media.filter(
    (media) =>
      (media.assetType === 'IMAGE' && media.playback === 'STILL') ||
      (media.assetType === 'VIDEO' &&
        media.playback === 'SHORT_LOOP' &&
        media.posterAssetId !== null),
  );
  const imageMedia = mediaHighlights.filter((media) => media.assetType === 'IMAGE');
  const heroMedia = mediaHighlights.find((media) => media.role === 'HERO') ?? null;
  const fallbackImage = imageMedia[0] ?? null;
  const heroVisual = heroMedia ?? fallbackImage;
  const availableSectionKeys = SECTION_ORDER.filter((sectionKey) => grouped.has(sectionKey));

  return (
    <article
      className="aw-entity-experience"
      data-universe-tone={presentation?.tone}
      data-universe-motion={presentation?.motion}
    >
      <header className="aw-entity-hero">
        <div className="aw-entity-hero__copy">
          <Link href="/knowledge" className="aw-entity-context-link">
            ← {presentation?.label ?? 'Knowledge'} Universe
          </Link>

          <p className="aw-eyebrow">
            {entityKindLabel(entity.resource.resourceType)} ·{' '}
            {presentation?.label ?? entity.resource.universeKey}
          </p>
          <h1>{entity.profile.displayName}</h1>
          <p className="aw-entity-hero__summary">{entity.profile.summary}</p>

          <div className="aw-entity-hero__actions">
            {mediaHighlights.length > 0 ? (
              <a href="#entity-images" className="aw-button aw-button--primary">
                Explore media
              </a>
            ) : null}
            <a href="#entity-engagement" className="aw-button aw-button--secondary">
              Save
            </a>
          </div>
        </div>

        <div className="aw-entity-hero__visual">
          {heroVisual ? (
            heroVisual.assetType === 'VIDEO' ? (
              <ShortLoopVisual
                media={heroVisual}
                displayName={entity.profile.displayName}
                motionAllowed={motionAllowed}
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
              />
            ) : (
              <Image
                src={mediaThumbnailPath(heroVisual.assetId)}
                alt={mediaAltText(heroVisual, entity.profile.displayName)}
                fill
                unoptimized
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
              />
            )
          ) : (
            <div className="aw-entity-hero__fallback" aria-hidden="true" />
          )}
          <div className="aw-entity-hero__veil" aria-hidden="true" />
        </div>
      </header>

      {entity.profile.facts.length > 0 ? (
        <dl className="aw-entity-facts" aria-label={`${entity.profile.displayName} quick facts`}>
          {entity.profile.facts.map((fact) => (
            <div key={fact.key}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div id="entity-engagement" className="aw-entity-engagement">
        <ResourceEngagementControls resourceId={entity.resource.id} />
      </div>

      <nav className="aw-entity-section-nav" aria-label={`${entity.profile.displayName} sections`}>
        <a href="#entity-overview">Overview</a>
        {mediaHighlights.length > 0 ? <a href="#entity-images">Media</a> : null}
        {availableSectionKeys.map((sectionKey) => (
          <a key={sectionKey} href={`#${sectionAnchor(sectionKey)}`}>
            {resolveEntitySectionTitle(presentation, sectionKey, entity.profile.displayName)}
          </a>
        ))}
      </nav>

      <section
        id="entity-overview"
        className="aw-entity-overview"
        aria-labelledby="entity-overview-title"
      >
        <p className="aw-eyebrow">Overview</p>
        <h2 id="entity-overview-title">Discover {entity.profile.displayName}</h2>
        <p>{entity.profile.summary}</p>
      </section>

      {mediaHighlights.length > 0 ? (
        <section
          id="entity-images"
          className="aw-entity-section aw-entity-section--images"
          aria-labelledby="entity-images-title"
        >
          <div className="aw-entity-section__heading">
            <div>
              <p className="aw-eyebrow">Media</p>
              <h2 id="entity-images-title">Media Highlights</h2>
            </div>
          </div>
          <ul className="aw-entity-image-rail">
            {mediaHighlights.map((media) => (
              <li key={media.assetId}>
                <a href={mediaContentPath(media.assetId)} target="_blank" rel="noreferrer">
                  <div className="aw-entity-image-card">
                    {media.assetType === 'VIDEO' ? (
                      <ShortLoopVisual
                        media={media}
                        displayName={entity.profile.displayName}
                        motionAllowed={motionAllowed}
                        sizes="(max-width: 700px) 70vw, 260px"
                      />
                    ) : (
                      <Image
                        src={mediaThumbnailPath(media.assetId)}
                        alt={mediaAltText(media, entity.profile.displayName)}
                        fill
                        unoptimized
                        sizes="(max-width: 700px) 70vw, 260px"
                      />
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {availableSectionKeys.map((sectionKey) => (
        <EntityRail
          key={sectionKey}
          sectionKey={sectionKey}
          items={grouped.get(sectionKey) ?? []}
          displayName={entity.profile.displayName}
          presentation={presentation}
        />
      ))}
    </article>
  );
}
