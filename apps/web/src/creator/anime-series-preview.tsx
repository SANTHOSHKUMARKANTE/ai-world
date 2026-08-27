'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import {
  ANIME_SERIES_SECTION_DEFINITIONS,
  ANIME_SERIES_SECTION_KEYS,
} from '../anime/anime-series-sections';
import { getApiErrorMessage } from '../api/api-error-message';
import { useSession } from '../session/session-provider';
import {
  getCreatorKnowledgeEntity,
  getCreatorKnowledgeMedia,
  type CreatorKnowledgeEntityConfiguration,
  type CreatorKnowledgeMediaPlacement,
} from './creator-api';

type PreviewState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly entity: CreatorKnowledgeEntityConfiguration;
      readonly media: readonly CreatorKnowledgeMediaPlacement[];
    }
  | { readonly status: 'error'; readonly message: string };

function mediaThumbnailPath(assetId: string): string {
  return `/api/media/assets/${encodeURIComponent(assetId)}/thumbnail`;
}

function AuthenticatedAnimeSeriesPreview({ resourceId }: { readonly resourceId: string }) {
  const [state, setState] = useState<PreviewState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    void Promise.all([getCreatorKnowledgeEntity(resourceId), getCreatorKnowledgeMedia(resourceId)])
      .then(([entity, media]) => {
        if (!active) {
          return;
        }
        if (
          entity.resource.universeKey !== 'universe.anime' ||
          entity.resource.resourceType !== 'anime.series'
        ) {
          setState({
            status: 'error',
            message: 'Creator Series preview requires an Anime Series Resource.',
          });
          return;
        }
        setState({ status: 'ready', entity, media: media.placements });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({ status: 'error', message: getApiErrorMessage(error) });
        }
      });

    return () => {
      active = false;
    };
  }, [resourceId]);

  const groupedRelations = useMemo(() => {
    if (state.status !== 'ready') {
      return new Map<string, CreatorKnowledgeEntityConfiguration['relations'][number][]>();
    }

    const grouped = new Map<string, CreatorKnowledgeEntityConfiguration['relations'][number][]>();

    for (const relation of state.entity.relations) {
      const items = grouped.get(relation.sectionKey) ?? [];
      items.push(relation);
      grouped.set(relation.sectionKey, items);
    }

    for (const items of grouped.values()) {
      items.sort((left, right) => left.position - right.position);
    }

    return grouped;
  }, [state]);

  if (state.status === 'loading') {
    return <p className="text-slate-400">Loading Creator-only Series preview…</p>;
  }

  if (state.status === 'error') {
    return (
      <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
        <h1 className="text-2xl font-semibold">Series preview unavailable</h1>
        <p role="alert" className="mt-3 text-rose-200">
          {state.message}
        </p>
      </section>
    );
  }

  const { entity, media } = state;
  const orderedMedia = [...media].sort((left, right) => left.position - right.position);
  const visibleSections = ANIME_SERIES_SECTION_KEYS.filter((sectionKey) =>
    groupedRelations.has(sectionKey),
  );

  return (
    <article data-creator-anime-series-preview="true" className="space-y-7">
      <header className="rounded-3xl border border-orange-400/25 bg-gradient-to-br from-orange-400/15 via-slate-900 to-slate-950 p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="rounded-full bg-orange-300 px-3 py-1 text-slate-950">
            Creator-only Series preview
          </span>
          <span className="text-orange-100/70">{entity.resource.lifecycle}</span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
          {entity.displayName}
        </h1>
        {entity.nativeName ? (
          <p className="mt-2 text-xl text-slate-300">{entity.nativeName}</p>
        ) : null}
        {entity.alternateNames.length > 0 ? (
          <p className="mt-2 text-sm text-slate-400">
            Also known as {entity.alternateNames.join(' · ')}
          </p>
        ) : null}
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{entity.summary}</p>
        <p className="mt-4 break-all text-xs text-slate-600">{entity.resource.id}</p>
      </header>

      {entity.facts.length > 0 ? (
        <dl
          aria-label={`${entity.displayName} preview facts`}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {entity.facts.map((fact) => (
            <div key={fact.key} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <dt className="text-xs uppercase tracking-wider text-slate-500">{fact.label}</dt>
              <dd className="mt-2 font-semibold text-slate-100">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {orderedMedia.length > 0 ? (
        <section aria-labelledby="series-preview-media-title">
          <h2 id="series-preview-media-title" className="text-2xl font-semibold">
            Media placements
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedMedia.map((placement) => {
              const imageAssetId =
                placement.playback === 'SHORT_LOOP' && placement.posterAssetId
                  ? placement.posterAssetId
                  : placement.assetId;
              return (
                <li
                  key={placement.assetId}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={mediaThumbnailPath(imageAssetId)}
                      alt={placement.altText ?? `${entity.displayName} media preview`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                      {placement.role} · {placement.playback}
                    </p>
                    {placement.caption ? (
                      <p className="mt-2 text-sm text-slate-300">{placement.caption}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
        aria-labelledby="series-preview-overview-title"
      >
        <h2 id="series-preview-overview-title" className="text-2xl font-semibold">
          About {entity.displayName}
        </h2>
        <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
          {entity.overview ?? entity.summary}
        </p>
      </section>

      {visibleSections.map((sectionKey) => {
        const definition = ANIME_SERIES_SECTION_DEFINITIONS.find(
          (section) => section.sectionKey === sectionKey,
        );
        const relations = groupedRelations.get(sectionKey) ?? [];

        return (
          <section
            key={sectionKey}
            aria-labelledby={`series-preview-${sectionKey.replaceAll('.', '-')}`}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
          >
            <h2
              id={`series-preview-${sectionKey.replaceAll('.', '-')}`}
              className="text-2xl font-semibold"
            >
              {definition?.title ?? sectionKey}
            </h2>
            <ol className="mt-4 space-y-3">
              {relations.map((relation) => (
                <li
                  key={`${relation.relationshipType}-${relation.targetResourceId}`}
                  className="rounded-xl bg-slate-950/70 p-4"
                >
                  <p className="font-medium text-slate-200">{relation.relationshipType}</p>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {relation.targetResourceId}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/creator"
          className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200"
        >
          Back to Creator workspace
        </Link>
        {entity.resource.lifecycle === 'PUBLISHED' ? (
          <Link
            href={`/anime/series/${encodeURIComponent(entity.slug)}`}
            className="rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-slate-950"
          >
            View public Series
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function AnimeSeriesPreview({ resourceId }: { readonly resourceId: string }) {
  const { state, refreshSession } = useSession();

  switch (state.status) {
    case 'loading':
      return <p className="text-slate-400">Checking Series preview access…</p>;
    case 'anonymous':
      return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Sign in to preview this Series</h1>
          <p className="mt-3 text-slate-400">
            DRAFT Series configuration is available only through the authorized Creator boundary.
          </p>
          <Link
            className="mt-5 inline-block rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-slate-950"
            href="/sign-in"
          >
            Sign in
          </Link>
        </section>
      );
    case 'error':
      return (
        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
          <p role="alert" className="text-rose-200">
            Series preview session status is unavailable.
          </p>
          <button
            className="mt-4 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium"
            type="button"
            onClick={() => void refreshSession()}
          >
            Try again
          </button>
        </section>
      );
    case 'authenticated':
      return <AuthenticatedAnimeSeriesPreview resourceId={resourceId} />;
  }
}
