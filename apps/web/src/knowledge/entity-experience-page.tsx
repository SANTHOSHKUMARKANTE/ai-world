'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AnimeEntityMediaViewer } from '../anime/anime-entity-media-viewer';
import { ANIME_CHARACTER_SECTION_KEYS } from '../anime/anime-character-sections';
import { ANIME_SERIES_SECTION_DEFINITIONS } from '../anime/anime-series-sections';
import { AnimeCharacterShareControls } from '../anime/anime-character-share-controls';
import { AnimeSeriesShareControls } from '../anime/anime-series-share-controls';
import { ApiClientError } from '../api/api-client';
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
  | { readonly status: 'not-found' }
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

const ANIME_LEGACY_SECTION_KEYS = [
  'entity.meditation',
  'entity.stories',
  'entity.temples',
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

function isViewerEligibleMedia(media: PublicKnowledgeEntityMedia): boolean {
  return (
    (media.assetType === 'IMAGE' && media.playback === 'STILL') || isPlayableShortLoopMedia(media)
  );
}

function updateMediaSelectionQuery(assetId: string | null): void {
  const url = new URL(window.location.href);

  if (assetId) {
    url.searchParams.set('media', assetId);
  } else {
    url.searchParams.delete('media');
  }

  window.history.replaceState(window.history.state, '', url.toString());
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

  if (target.resourceType === 'anime.series') {
    return `/anime/series/${encodeURIComponent(target.slug)}`;
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
  titleOverride,
}: {
  readonly sectionKey: string;
  readonly items: readonly PublicKnowledgeEntityRelation[];
  readonly displayName: string;
  readonly presentation: WebUniversePresentation | undefined;
  readonly titleOverride: string | undefined;
}) {
  const title = titleOverride ?? resolveEntitySectionTitle(presentation, sectionKey, displayName);
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
  initialMediaId = null,
  expectedResourceType,
}: {
  readonly universeKey: string;
  readonly slug: string;
  readonly initialMediaId?: string | null;
  readonly expectedResourceType?: string;
}) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(initialMediaId);
  const mediaOpenerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let active = true;

    void getPublicKnowledgeEntity(universeKey, slug)
      .then((entity) => {
        if (!active) {
          return;
        }

        if (
          entity.resource.universeKey !== universeKey ||
          (expectedResourceType !== undefined &&
            entity.resource.resourceType !== expectedResourceType)
        ) {
          setState({ status: 'not-found' });
          return;
        }

        setState({ status: 'ready', entity });
      })
      .catch((error: unknown) => {
        if (active) {
          setState(
            error instanceof ApiClientError && error.status === 404
              ? { status: 'not-found' }
              : { status: 'error' },
          );
        }
      });

    return () => {
      active = false;
    };
  }, [expectedResourceType, slug, universeKey]);

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

  useEffect(() => {
    if (state.status !== 'ready' || !initialMediaId) {
      return;
    }

    const isAnimeEntity =
      state.entity.resource.universeKey === 'universe.anime' &&
      (state.entity.resource.resourceType === 'anime.character' ||
        state.entity.resource.resourceType === 'anime.series');

    if (!isAnimeEntity) {
      return;
    }

    const eligible = state.entity.media.some(
      (media) => media.assetId === initialMediaId && isViewerEligibleMedia(media),
    );

    if (!eligible) {
      updateMediaSelectionQuery(null);
    }
  }, [initialMediaId, state]);

  function openMediaViewer(media: PublicKnowledgeEntityMedia, trigger: HTMLButtonElement): void {
    mediaOpenerRef.current = trigger;
    setSelectedMediaId(media.assetId);
    updateMediaSelectionQuery(media.assetId);
  }

  function closeMediaViewer(): void {
    const opener = mediaOpenerRef.current;

    mediaOpenerRef.current = null;
    setSelectedMediaId(null);
    updateMediaSelectionQuery(null);

    if (opener) {
      window.requestAnimationFrame(() => opener.focus());
    }
  }

  if (state.status === 'loading') {
    return (
      <div className="aw-entity-status" role="status">
        Opening this world…
      </div>
    );
  }

  if (state.status === 'not-found') {
    const notFoundKind =
      expectedResourceType === 'anime.series'
        ? 'Series'
        : expectedResourceType === 'anime.character'
          ? 'Character'
          : 'Entity';
    const returnToAnime = expectedResourceType === 'anime.series';

    return (
      <div className="aw-entity-status aw-entity-status--not-found" role="status">
        <strong>{notFoundKind} not found</strong>
        <span>This published page is not available.</span>
        <Link href={returnToAnime ? '/anime' : '/knowledge'} className="aw-text-link">
          {returnToAnime ? 'Explore Anime' : 'Explore published Knowledge'}
        </Link>
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
  const animeCharacter =
    entity.resource.universeKey === 'universe.anime' &&
    entity.resource.resourceType === 'anime.character';
  const animeSeries =
    entity.resource.universeKey === 'universe.anime' &&
    entity.resource.resourceType === 'anime.series';
  const animeIdentity = animeCharacter || animeSeries;
  const seriesFact = animeCharacter
    ? entity.profile.facts.find((fact) => fact.key === 'anime.series')
    : undefined;
  const presentation = resolveWebUniversePresentation(entity.resource.universeKey);
  const mediaHighlights = entity.media.filter(
    (media) =>
      (media.assetType === 'IMAGE' && media.playback === 'STILL') ||
      (media.assetType === 'VIDEO' &&
        media.playback === 'SHORT_LOOP' &&
        media.posterAssetId !== null),
  );
  const visibleMediaHighlights = mediaHighlights;
  const imageMedia = visibleMediaHighlights.filter((media) => media.assetType === 'IMAGE');
  const viewerMedia = animeIdentity ? visibleMediaHighlights.filter(isViewerEligibleMedia) : [];
  const selectedMedia = viewerMedia.find((media) => media.assetId === selectedMediaId) ?? null;
  const heroMedia = visibleMediaHighlights.find((media) => media.role === 'HERO') ?? null;
  const fallbackImage = imageMedia[0] ?? null;
  const heroVisual = heroMedia ?? fallbackImage;
  const sectionOrder = animeCharacter
    ? [...ANIME_CHARACTER_SECTION_KEYS, ...ANIME_LEGACY_SECTION_KEYS]
    : SECTION_ORDER;
  const seriesSectionGroups = animeSeries
    ? ANIME_SERIES_SECTION_DEFINITIONS.map((definition) => ({
        definition,
        items: (grouped.get(definition.sectionKey) ?? []).filter(
          (relation) =>
            relation.relationshipType === definition.relationshipType &&
            relation.target.universeKey === 'universe.anime' &&
            relation.target.resourceType === definition.targetResourceType,
        ),
      })).filter((group) => group.items.length > 0)
    : [];
  const availableSectionKeys = animeSeries
    ? seriesSectionGroups.map((group) => group.definition.sectionKey)
    : sectionOrder.filter((sectionKey) => grouped.has(sectionKey));
  const overviewEyebrow = animeCharacter
    ? 'Character story'
    : animeSeries
      ? 'Series overview'
      : 'Overview';
  const overviewTitle =
    animeCharacter || animeSeries
      ? `About ${entity.profile.displayName}`
      : `Discover ${entity.profile.displayName}`;
  const overviewCopy = animeIdentity
    ? (entity.profile.overview ?? entity.profile.summary)
    : entity.profile.summary;

  function sectionItems(sectionKey: string): readonly PublicKnowledgeEntityRelation[] {
    if (!animeSeries) {
      return grouped.get(sectionKey) ?? [];
    }

    return (
      seriesSectionGroups.find((group) => group.definition.sectionKey === sectionKey)?.items ?? []
    );
  }

  function sectionTitle(sectionKey: string): string {
    if (animeSeries) {
      const title = seriesSectionGroups.find((group) => group.definition.sectionKey === sectionKey)
        ?.definition.title;
      if (title) {
        return title;
      }
    }

    return resolveEntitySectionTitle(presentation, sectionKey, entity.profile.displayName);
  }

  return (
    <article
      className={`aw-entity-experience ${animeCharacter ? 'aw-anime-character' : ''} ${
        animeSeries ? 'aw-anime-series' : ''
      }`}
      data-universe-tone={presentation?.tone}
      data-universe-motion={presentation?.motion}
      data-character-shell={animeCharacter ? 'anime' : undefined}
      data-series-shell={animeSeries ? 'anime' : undefined}
    >
      <header className="aw-entity-hero">
        <div className="aw-entity-hero__copy">
          <Link href={animeSeries ? '/anime' : '/knowledge'} className="aw-entity-context-link">
            ← {presentation?.label ?? 'Knowledge'} Universe
          </Link>

          <p className="aw-eyebrow">
            {entityKindLabel(entity.resource.resourceType)} ·{' '}
            {presentation?.label ?? entity.resource.universeKey}
          </p>

          {animeCharacter && seriesFact ? (
            <p className="aw-anime-character__series">From {seriesFact.value}</p>
          ) : null}

          <h1>{entity.profile.displayName}</h1>

          {animeIdentity &&
          (entity.profile.nativeName !== null || entity.profile.alternateNames.length > 0) ? (
            <div
              className={
                animeCharacter ? 'aw-anime-character__identity' : 'aw-anime-series__identity'
              }
              aria-label={animeCharacter ? 'Character identity' : 'Series identity'}
            >
              {entity.profile.nativeName ? (
                <p
                  className={
                    animeCharacter
                      ? 'aw-anime-character__native-name'
                      : 'aw-anime-series__native-name'
                  }
                >
                  {entity.profile.nativeName}
                </p>
              ) : null}
              {entity.profile.alternateNames.length > 0 ? (
                <p
                  className={
                    animeCharacter
                      ? 'aw-anime-character__alternate-names'
                      : 'aw-anime-series__alternate-names'
                  }
                >
                  Also known as {entity.profile.alternateNames.join(' · ')}
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="aw-entity-hero__summary">{entity.profile.summary}</p>

          <div className="aw-entity-hero__actions">
            {visibleMediaHighlights.length > 0 ? (
              <a href="#entity-images" className="aw-button aw-button--primary">
                Explore media
              </a>
            ) : null}
            <a href="#entity-engagement" className="aw-button aw-button--secondary">
              Save
            </a>
            {animeCharacter ? (
              <AnimeCharacterShareControls
                slug={entity.profile.slug}
                displayName={entity.profile.displayName}
                summary={entity.profile.summary}
              />
            ) : animeSeries ? (
              <AnimeSeriesShareControls
                slug={entity.profile.slug}
                displayName={entity.profile.displayName}
                summary={entity.profile.summary}
              />
            ) : null}
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
        {visibleMediaHighlights.length > 0 ? <a href="#entity-images">Media</a> : null}
        {availableSectionKeys.map((sectionKey) => (
          <a key={sectionKey} href={`#${sectionAnchor(sectionKey)}`}>
            {sectionTitle(sectionKey)}
          </a>
        ))}
      </nav>

      <section
        id="entity-overview"
        className="aw-entity-overview"
        aria-labelledby="entity-overview-title"
      >
        <p className="aw-eyebrow">{overviewEyebrow}</p>
        <h2 id="entity-overview-title">{overviewTitle}</h2>
        <p>{overviewCopy}</p>
      </section>

      {visibleMediaHighlights.length > 0 ? (
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
            {visibleMediaHighlights.map((media) => {
              const mediaName = mediaAltText(media, entity.profile.displayName);
              const card = (
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
                      alt={mediaName}
                      fill
                      unoptimized
                      sizes="(max-width: 700px) 70vw, 260px"
                    />
                  )}
                  {animeIdentity ? (
                    <span className="aw-anime-media-trigger__kind" aria-hidden="true">
                      {media.assetType === 'VIDEO' ? 'Short motion' : 'Image'}
                    </span>
                  ) : null}
                </div>
              );

              return (
                <li key={media.assetId}>
                  {animeIdentity ? (
                    isViewerEligibleMedia(media) ? (
                      <button
                        type="button"
                        className="aw-anime-media-trigger"
                        aria-label={`Open ${mediaName} in media viewer`}
                        onClick={(event) => openMediaViewer(media, event.currentTarget)}
                      >
                        {card}
                      </button>
                    ) : (
                      <div className="aw-anime-media-static" aria-label={`${mediaName} preview`}>
                        {card}
                      </div>
                    )
                  ) : (
                    <a href={mediaContentPath(media.assetId)} target="_blank" rel="noreferrer">
                      {card}
                    </a>
                  )}

                  {animeIdentity && media.caption ? (
                    <p className="aw-anime-media-caption">{media.caption}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {availableSectionKeys.map((sectionKey) => (
        <EntityRail
          key={sectionKey}
          sectionKey={sectionKey}
          items={sectionItems(sectionKey)}
          displayName={entity.profile.displayName}
          presentation={presentation}
          titleOverride={animeSeries ? sectionTitle(sectionKey) : undefined}
        />
      ))}

      {animeIdentity ? (
        <AnimeEntityMediaViewer
          media={selectedMedia}
          displayName={entity.profile.displayName}
          onRequestClose={closeMediaViewer}
        />
      ) : null}
    </article>
  );
}
