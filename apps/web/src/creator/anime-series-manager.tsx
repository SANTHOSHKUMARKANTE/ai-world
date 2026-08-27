'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import {
  ANIME_SERIES_SECTION_DEFINITIONS,
  animeSeriesSectionOrder,
  findAnimeSeriesSection,
} from '../anime/anime-series-sections';
import { getApiErrorMessage } from '../api/api-error-message';
import {
  archiveCreatorKnowledgeResource,
  getCreatorKnowledgeEntity,
  publishCreatorKnowledgeResource,
  replaceCreatorKnowledgeEntity,
  type CreatorKnowledgeEntityConfiguration,
  type CreatorKnowledgeEntityRelation,
  type CreatorKnowledgeResource,
} from './creator-api';

interface FactDraft {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

interface RelationDraft {
  readonly targetResourceId: string;
  readonly sectionKey: string;
  readonly relationshipType: string;
}

export interface AnimeSeriesManagerProps {
  readonly knowledgeResourceId: string;
  readonly initialResource: CreatorKnowledgeResource | null;
  readonly onKnowledgeResourceIdChange: (id: string) => void;
  readonly onResourceChange: (resource: CreatorKnowledgeResource | null) => void;
}

const inputClassName =
  'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 disabled:opacity-60';
const primaryButtonClassName =
  'rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButtonClassName =
  'rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50';

const SERIES_FACT_TEMPLATES = [
  { key: 'anime.format', label: 'Format', value: '' },
  { key: 'anime.status', label: 'Status', value: '' },
  { key: 'anime.episodes', label: 'Episodes', value: '' },
] as const satisfies readonly FactDraft[];

function isAnimeSeriesResource(resource: CreatorKnowledgeResource | null): boolean {
  return resource?.universeKey === 'universe.anime' && resource.resourceType === 'anime.series';
}

function configurationRelations(
  configuration: CreatorKnowledgeEntityConfiguration,
): readonly RelationDraft[] {
  return [...configuration.relations]
    .sort((left, right) => {
      const sectionDifference =
        animeSeriesSectionOrder(left.sectionKey) - animeSeriesSectionOrder(right.sectionKey);
      return sectionDifference !== 0 ? sectionDifference : left.position - right.position;
    })
    .map(({ targetResourceId, sectionKey, relationshipType }) => ({
      targetResourceId,
      sectionKey,
      relationshipType,
    }));
}

function normalizeRelations(
  relations: readonly RelationDraft[],
): readonly CreatorKnowledgeEntityRelation[] {
  const positions = new Map<string, number>();

  return relations.map((relation) => {
    const position = positions.get(relation.sectionKey) ?? 0;
    positions.set(relation.sectionKey, position + 1);

    return {
      targetResourceId: relation.targetResourceId.trim(),
      sectionKey: relation.sectionKey,
      relationshipType: relation.relationshipType.trim(),
      position,
    };
  });
}

export function AnimeSeriesManager({
  knowledgeResourceId,
  initialResource,
  onKnowledgeResourceIdChange,
  onResourceChange,
}: AnimeSeriesManagerProps) {
  const initialSeriesResource = isAnimeSeriesResource(initialResource) ? initialResource : null;

  const [resource, setResource] = useState<CreatorKnowledgeResource | null>(initialSeriesResource);
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [nativeName, setNativeName] = useState('');
  const [alternateNames, setAlternateNames] = useState('');
  const [summary, setSummary] = useState('');
  const [overview, setOverview] = useState('');
  const [facts, setFacts] = useState<readonly FactDraft[]>([]);
  const [relations, setRelations] = useState<readonly RelationDraft[]>([]);
  const [newFact, setNewFact] = useState<FactDraft>({
    key: 'anime.format',
    label: 'Format',
    value: '',
  });
  const firstSection = ANIME_SERIES_SECTION_DEFINITIONS[0];
  const [newRelation, setNewRelation] = useState<RelationDraft>({
    targetResourceId: '',
    sectionKey: firstSection.sectionKey,
    relationshipType: firstSection.relationshipType,
  });
  const [loaded, setLoaded] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const busy = busyAction !== null;
  const canInitialize = isAnimeSeriesResource(resource);

  function clearEditorForResourceChange(id: string): void {
    setResource(null);
    setLoaded(false);
    setSlug('');
    setDisplayName('');
    setNativeName('');
    setAlternateNames('');
    setSummary('');
    setOverview('');
    setFacts([]);
    setRelations([]);
    setStatusMessage(null);
    setErrorMessage(null);
    onResourceChange(null);
    onKnowledgeResourceIdChange(id);
  }

  function applyConfiguration(configuration: CreatorKnowledgeEntityConfiguration): void {
    if (!isAnimeSeriesResource(configuration.resource)) {
      throw new Error(
        'Anime Series management requires an universe.anime / anime.series Knowledge Resource.',
      );
    }

    setResource(configuration.resource);
    onResourceChange(configuration.resource);
    setSlug(configuration.slug);
    setDisplayName(configuration.displayName);
    setNativeName(configuration.nativeName ?? '');
    setAlternateNames(configuration.alternateNames.join('\n'));
    setSummary(configuration.summary);
    setOverview(configuration.overview ?? '');
    setFacts(configuration.facts);
    setRelations(configurationRelations(configuration));
    setLoaded(true);
  }

  async function loadSeries(): Promise<void> {
    const id = knowledgeResourceId.trim();
    if (!id) {
      setErrorMessage('Enter a Series Knowledge Resource ID before loading.');
      return;
    }

    setBusyAction('load-series');
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const configuration = await getCreatorKnowledgeEntity(id);
      applyConfiguration(configuration);
      setStatusMessage(`Loaded Series configuration for ${configuration.displayName}.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error &&
          error.message ===
            'Anime Series management requires an universe.anime / anime.series Knowledge Resource.'
          ? error.message
          : getApiErrorMessage(error),
      );
    } finally {
      setBusyAction(null);
    }
  }

  function addFact(): void {
    if (facts.length >= 12) {
      setErrorMessage('A Series can have no more than 12 quick facts.');
      return;
    }

    if (!newFact.key.trim() || !newFact.label.trim() || !newFact.value.trim()) {
      setErrorMessage('Fact key, label, and value are required.');
      return;
    }

    setFacts((current) => [...current, { ...newFact }]);
    setNewFact({ key: 'anime.format', label: 'Format', value: '' });
    setErrorMessage(null);
  }

  function moveFact(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= facts.length) {
      return;
    }

    setFacts((current) => {
      const next = [...current];
      const selected = next[index];
      const displaced = next[target];
      if (!selected || !displaced) {
        return current;
      }
      next[index] = displaced;
      next[target] = selected;
      return next;
    });
  }

  function addRelation(): void {
    if (!newRelation.targetResourceId.trim() || !newRelation.relationshipType.trim()) {
      setErrorMessage('Related Resource ID and relationship type are required.');
      return;
    }

    setRelations((current) => [...current, { ...newRelation }]);
    const section =
      findAnimeSeriesSection(newRelation.sectionKey) ?? ANIME_SERIES_SECTION_DEFINITIONS[0];
    setNewRelation({
      targetResourceId: '',
      sectionKey: section.sectionKey,
      relationshipType: section.relationshipType,
    });
    setErrorMessage(null);
  }

  function moveRelation(index: number, direction: -1 | 1): void {
    const selected = relations[index];
    if (!selected) {
      return;
    }

    const sectionIndexes = relations
      .map((relation, relationIndex) =>
        relation.sectionKey === selected.sectionKey ? relationIndex : -1,
      )
      .filter((relationIndex) => relationIndex >= 0);
    const currentSectionPosition = sectionIndexes.indexOf(index);
    const targetSectionPosition = currentSectionPosition + direction;

    if (
      currentSectionPosition < 0 ||
      targetSectionPosition < 0 ||
      targetSectionPosition >= sectionIndexes.length
    ) {
      return;
    }

    const targetIndex = sectionIndexes[targetSectionPosition];
    if (targetIndex === undefined) {
      return;
    }

    setRelations((current) => {
      const next = [...current];
      const displaced = next[targetIndex];
      const currentSelected = next[index];
      if (!currentSelected || !displaced) {
        return current;
      }
      next[index] = displaced;
      next[targetIndex] = currentSelected;
      return next;
    });
  }

  async function saveSeries(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const id = knowledgeResourceId.trim();
    if (!id) {
      setErrorMessage('Enter or create an Anime Series Knowledge Resource first.');
      return;
    }

    if (!canInitialize && !loaded) {
      setErrorMessage(
        'Load an existing Anime Series or create an anime.series Resource in this workspace before saving.',
      );
      return;
    }

    if (!slug.trim() || !displayName.trim() || !summary.trim()) {
      setErrorMessage('Slug, display name, and summary are required.');
      return;
    }

    if (facts.some((fact) => !fact.key.trim() || !fact.label.trim() || !fact.value.trim())) {
      setErrorMessage('Every quick fact requires key, label, and value.');
      return;
    }

    if (
      relations.some(
        (relation) =>
          !relation.targetResourceId.trim() ||
          !relation.sectionKey.trim() ||
          !relation.relationshipType.trim(),
      )
    ) {
      setErrorMessage('Every relationship requires target, section, and type.');
      return;
    }

    setBusyAction('save-series');
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const configuration = await replaceCreatorKnowledgeEntity(id, {
        profile: {
          slug: slug.trim(),
          displayName: displayName.trim(),
          nativeName: nativeName.trim() || null,
          alternateNames: alternateNames
            .split('\n')
            .map((name) => name.trim())
            .filter(Boolean),
          summary: summary.trim(),
          overview: overview.trim() || null,
          facts: facts.map((fact) => ({
            key: fact.key.trim(),
            label: fact.label.trim(),
            value: fact.value.trim(),
          })),
        },
        relations: normalizeRelations(relations),
      });

      applyConfiguration(configuration);
      setStatusMessage(`Saved Series configuration for ${configuration.displayName}.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  async function publishSeries(): Promise<void> {
    if (!resource || resource.lifecycle !== 'DRAFT') {
      return;
    }

    setBusyAction('publish-series');
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const published = await publishCreatorKnowledgeResource(resource.id);
      setResource(published);
      onResourceChange(published);
      setStatusMessage(`Published Series Knowledge Resource ${published.id}.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  async function archiveSeries(): Promise<void> {
    if (!resource || resource.lifecycle !== 'PUBLISHED') {
      return;
    }

    setBusyAction('archive-series');
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const archived = await archiveCreatorKnowledgeResource(resource.id);
      setResource(archived);
      onResourceChange(archived);
      setStatusMessage(`Archived Series Knowledge Resource ${archived.id}.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section
      data-creator-anime-series-manager="true"
      aria-labelledby="creator-anime-series-title"
      className="mt-6 rounded-2xl border border-orange-400/25 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
    >
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            Anime · Series
          </p>
          <h2 id="creator-anime-series-title" className="mt-2 text-2xl font-semibold">
            Series profile & relationships
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Edit the canonical Entity profile, quick facts, and ordered Anime relationships. Media
            stays in the shared Knowledge Media manager below/above; this editor writes the existing
            Knowledge Entity configuration only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={secondaryButtonClassName}
            type="button"
            disabled={busy || !knowledgeResourceId.trim()}
            onClick={() => void loadSeries()}
          >
            {busyAction === 'load-series' ? 'Loading…' : 'Load Series configuration'}
          </button>
          {knowledgeResourceId.trim() ? (
            <Link
              className={secondaryButtonClassName}
              href={`/creator/series/${encodeURIComponent(knowledgeResourceId.trim())}/preview`}
            >
              Preview Series
            </Link>
          ) : null}
        </div>
      </div>

      <label className="mt-5 block text-sm font-medium" htmlFor="creator-series-resource-id">
        Series Knowledge Resource ID
        <input
          id="creator-series-resource-id"
          className={inputClassName}
          placeholder="UUID"
          value={knowledgeResourceId}
          disabled={busy}
          onChange={(event) => clearEditorForResourceChange(event.target.value)}
        />
      </label>

      {resource ? (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <dl className="grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Universe</dt>
              <dd>{resource.universeKey}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Type</dt>
              <dd>{resource.resourceType}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Lifecycle</dt>
              <dd>{resource.lifecycle}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      {statusMessage ? (
        <p
          role="status"
          className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200"
        >
          {statusMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <form onSubmit={saveSeries} className="mt-6 space-y-6">
        <fieldset className="grid gap-4 rounded-xl border border-slate-800 p-4 sm:grid-cols-2">
          <legend className="px-2 text-sm font-semibold text-orange-200">Series identity</legend>

          <label className="block text-sm font-medium" htmlFor="creator-series-slug">
            Slug
            <input
              id="creator-series-slug"
              className={inputClassName}
              value={slug}
              disabled={busy}
              onChange={(event) => setSlug(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium" htmlFor="creator-series-display-name">
            Display name
            <input
              id="creator-series-display-name"
              className={inputClassName}
              value={displayName}
              disabled={busy}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium" htmlFor="creator-series-native-name">
            Native name
            <input
              id="creator-series-native-name"
              className={inputClassName}
              value={nativeName}
              disabled={busy}
              onChange={(event) => setNativeName(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium" htmlFor="creator-series-alternate-names">
            Alternate names · one per line
            <textarea
              id="creator-series-alternate-names"
              className={`${inputClassName} min-h-28 resize-y`}
              value={alternateNames}
              disabled={busy}
              onChange={(event) => setAlternateNames(event.target.value)}
            />
          </label>

          <label
            className="block text-sm font-medium sm:col-span-2"
            htmlFor="creator-series-summary"
          >
            Short summary
            <textarea
              id="creator-series-summary"
              className={`${inputClassName} min-h-24 resize-y`}
              value={summary}
              disabled={busy}
              onChange={(event) => setSummary(event.target.value)}
            />
          </label>

          <label
            className="block text-sm font-medium sm:col-span-2"
            htmlFor="creator-series-overview"
          >
            Long overview
            <textarea
              id="creator-series-overview"
              className={`${inputClassName} min-h-40 resize-y`}
              value={overview}
              disabled={busy}
              onChange={(event) => setOverview(event.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-800 p-4">
          <legend className="px-2 text-sm font-semibold text-orange-200">Quick facts</legend>

          <div
            aria-label="Preferred Series quick fact templates"
            className="mb-4 rounded-xl border border-orange-400/20 bg-orange-400/5 p-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-200">
              Preferred Series fact templates
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Reuse the generic quick-fact model with the accepted Anime Series keys.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SERIES_FACT_TEMPLATES.map((template) => (
                <button
                  key={template.key}
                  type="button"
                  className={secondaryButtonClassName}
                  disabled={busy}
                  onClick={() => setNewFact({ ...template })}
                >
                  Use {template.label} template
                </button>
              ))}
            </div>
          </div>

          <ol aria-label="Series quick facts" className="space-y-3">
            {facts.map((fact, index) => (
              <li
                key={`${fact.key}-${index}`}
                className="grid gap-3 rounded-xl bg-slate-950/70 p-3 md:grid-cols-[1fr_0.8fr_1fr_auto]"
              >
                <input
                  aria-label={`Fact ${index + 1} key`}
                  className={inputClassName}
                  value={fact.key}
                  disabled={busy}
                  onChange={(event) =>
                    setFacts((current) =>
                      current.map((candidate, factIndex) =>
                        factIndex === index ? { ...candidate, key: event.target.value } : candidate,
                      ),
                    )
                  }
                />
                <input
                  aria-label={`Fact ${index + 1} label`}
                  className={inputClassName}
                  value={fact.label}
                  disabled={busy}
                  onChange={(event) =>
                    setFacts((current) =>
                      current.map((candidate, factIndex) =>
                        factIndex === index
                          ? { ...candidate, label: event.target.value }
                          : candidate,
                      ),
                    )
                  }
                />
                <input
                  aria-label={`Fact ${index + 1} value`}
                  className={inputClassName}
                  value={fact.value}
                  disabled={busy}
                  onChange={(event) =>
                    setFacts((current) =>
                      current.map((candidate, factIndex) =>
                        factIndex === index
                          ? { ...candidate, value: event.target.value }
                          : candidate,
                      ),
                    )
                  }
                />
                <div className="flex items-end gap-1">
                  <button
                    type="button"
                    className={secondaryButtonClassName}
                    aria-label={`Move fact ${index + 1} up`}
                    disabled={busy || index === 0}
                    onClick={() => moveFact(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={secondaryButtonClassName}
                    aria-label={`Move fact ${index + 1} down`}
                    disabled={busy || index === facts.length - 1}
                    onClick={() => moveFact(index, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={secondaryButtonClassName}
                    aria-label={`Remove fact ${index + 1}`}
                    disabled={busy}
                    onClick={() =>
                      setFacts((current) => current.filter((_, factIndex) => factIndex !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="text-sm font-medium" htmlFor="creator-new-fact-key">
              Fact key
              <input
                id="creator-new-fact-key"
                className={inputClassName}
                value={newFact.key}
                disabled={busy}
                onChange={(event) =>
                  setNewFact((current) => ({ ...current, key: event.target.value }))
                }
              />
            </label>
            <label className="text-sm font-medium" htmlFor="creator-new-fact-label">
              Fact label
              <input
                id="creator-new-fact-label"
                className={inputClassName}
                value={newFact.label}
                disabled={busy}
                onChange={(event) =>
                  setNewFact((current) => ({ ...current, label: event.target.value }))
                }
              />
            </label>
            <label className="text-sm font-medium" htmlFor="creator-new-fact-value">
              Fact value
              <input
                id="creator-new-fact-value"
                className={inputClassName}
                value={newFact.value}
                disabled={busy}
                onChange={(event) =>
                  setNewFact((current) => ({ ...current, value: event.target.value }))
                }
              />
            </label>
          </div>
          <button
            type="button"
            className={`${secondaryButtonClassName} mt-3`}
            disabled={busy || facts.length >= 12}
            onClick={addFact}
          >
            Add quick fact
          </button>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-800 p-4">
          <legend className="px-2 text-sm font-semibold text-orange-200">
            Anime relationships
          </legend>

          <ol aria-label="Series relationships" className="space-y-3">
            {relations.map((relation, index) => {
              const sameSection = relations.filter(
                (candidate) => candidate.sectionKey === relation.sectionKey,
              );
              const positionInSection = sameSection.indexOf(relation);

              return (
                <li
                  key={`${relation.relationshipType}-${relation.targetResourceId}-${index}`}
                  className="grid gap-3 rounded-xl bg-slate-950/70 p-3 lg:grid-cols-[1fr_1fr_1.4fr_auto]"
                >
                  <label className="text-xs font-medium text-slate-400">
                    Section
                    <select
                      aria-label={`Relation ${index + 1} section`}
                      className={inputClassName}
                      value={relation.sectionKey}
                      disabled={busy}
                      onChange={(event) => {
                        const definition = findAnimeSeriesSection(event.target.value);
                        setRelations((current) =>
                          current.map((candidate, relationIndex) =>
                            relationIndex === index
                              ? {
                                  ...candidate,
                                  sectionKey: event.target.value,
                                  relationshipType:
                                    definition?.relationshipType ?? candidate.relationshipType,
                                }
                              : candidate,
                          ),
                        );
                      }}
                    >
                      {ANIME_SERIES_SECTION_DEFINITIONS.map((section) => (
                        <option key={section.sectionKey} value={section.sectionKey}>
                          {section.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-medium text-slate-400">
                    Relationship type
                    <input
                      aria-label={`Relation ${index + 1} type`}
                      className={inputClassName}
                      value={relation.relationshipType}
                      readOnly
                      aria-readonly="true"
                    />
                  </label>

                  <label className="text-xs font-medium text-slate-400">
                    Related Resource ID
                    <input
                      aria-label={`Relation ${index + 1} target`}
                      className={inputClassName}
                      value={relation.targetResourceId}
                      disabled={busy}
                      onChange={(event) =>
                        setRelations((current) =>
                          current.map((candidate, relationIndex) =>
                            relationIndex === index
                              ? { ...candidate, targetResourceId: event.target.value }
                              : candidate,
                          ),
                        )
                      }
                    />
                  </label>

                  <div className="flex items-end gap-1">
                    <button
                      type="button"
                      className={secondaryButtonClassName}
                      aria-label={`Move relation ${index + 1} up within section`}
                      disabled={busy || positionInSection === 0}
                      onClick={() => moveRelation(index, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={secondaryButtonClassName}
                      aria-label={`Move relation ${index + 1} down within section`}
                      disabled={
                        busy ||
                        positionInSection < 0 ||
                        positionInSection === sameSection.length - 1
                      }
                      onClick={() => moveRelation(index, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={secondaryButtonClassName}
                      aria-label={`Remove relation ${index + 1}`}
                      disabled={busy}
                      onClick={() =>
                        setRelations((current) =>
                          current.filter((_, relationIndex) => relationIndex !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <label className="text-sm font-medium" htmlFor="creator-new-relation-section">
              Section
              <select
                id="creator-new-relation-section"
                className={inputClassName}
                value={newRelation.sectionKey}
                disabled={busy}
                onChange={(event) => {
                  const definition =
                    findAnimeSeriesSection(event.target.value) ??
                    ANIME_SERIES_SECTION_DEFINITIONS[0];
                  setNewRelation((current) => ({
                    ...current,
                    sectionKey: definition.sectionKey,
                    relationshipType: definition.relationshipType,
                  }));
                }}
              >
                {ANIME_SERIES_SECTION_DEFINITIONS.map((section) => (
                  <option key={section.sectionKey} value={section.sectionKey}>
                    {section.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium" htmlFor="creator-new-relation-type">
              Relationship type
              <input
                id="creator-new-relation-type"
                className={inputClassName}
                value={newRelation.relationshipType}
                readOnly
                aria-readonly="true"
              />
            </label>
            <label className="text-sm font-medium" htmlFor="creator-new-relation-target">
              Related Resource ID
              <input
                id="creator-new-relation-target"
                className={inputClassName}
                placeholder="UUID"
                value={newRelation.targetResourceId}
                disabled={busy}
                onChange={(event) =>
                  setNewRelation((current) => ({
                    ...current,
                    targetResourceId: event.target.value,
                  }))
                }
              />
            </label>
            <button
              type="button"
              className={secondaryButtonClassName}
              disabled={busy || relations.length >= 120}
              onClick={addRelation}
            >
              Add relationship
            </button>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className={primaryButtonClassName}
            type="submit"
            disabled={busy || !knowledgeResourceId.trim()}
          >
            {busyAction === 'save-series'
              ? 'Saving…'
              : loaded
                ? 'Save Series configuration'
                : 'Initialize Series configuration'}
          </button>

          {resource?.lifecycle === 'DRAFT' && loaded ? (
            <button
              className={secondaryButtonClassName}
              type="button"
              disabled={busy}
              onClick={() => void publishSeries()}
            >
              {busyAction === 'publish-series' ? 'Publishing…' : 'Publish Series'}
            </button>
          ) : null}

          {resource?.lifecycle === 'PUBLISHED' ? (
            <button
              className={secondaryButtonClassName}
              type="button"
              disabled={busy}
              onClick={() => void archiveSeries()}
            >
              {busyAction === 'archive-series' ? 'Archiving…' : 'Archive Series'}
            </button>
          ) : null}

          {resource?.lifecycle === 'ARCHIVED' ? (
            <span className="text-sm text-slate-400">Archived Series Resources are terminal.</span>
          ) : null}
        </div>
      </form>
    </section>
  );
}
