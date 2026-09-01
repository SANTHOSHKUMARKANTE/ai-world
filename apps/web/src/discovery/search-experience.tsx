'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useRef, useState } from 'react';

import {
  formatPublicKnowledgeResourceType,
  resolvePublicKnowledgeDestination,
} from '../knowledge/public-knowledge-destination';
import { WEB_UNIVERSE_PRESENTATIONS } from '../universes/presentation';
import { searchPublicKnowledge, type PublicDiscoverySearchResult } from './public-discovery-api';

const SEARCH_LIMIT = 20;

const RESOURCE_TYPE_OPTIONS = [
  ['devotional.deity', 'Devotional deity'],
  ['devotional.scripture', 'Devotional scripture'],
  ['devotional.temple', 'Devotional temple'],
  ['anime.character', 'Anime character'],
  ['anime.series', 'Anime series'],
] as const;

interface SearchCriteria {
  readonly query: string;
  readonly universeKey: string;
  readonly resourceTypes: readonly string[];
}

type SearchState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly items: readonly PublicDiscoverySearchResult[];
      readonly offset: number;
      readonly criteria: SearchCriteria;
    }
  | {
      readonly status: 'error';
      readonly offset: number;
      readonly criteria: SearchCriteria;
    };

export interface SearchExperienceProps {
  readonly initialQuery?: string;
  readonly initialUniverseKey?: string;
  readonly initialResourceTypes?: readonly string[];
  readonly initialOffset?: number;
}

function universeLabel(universeKey: string | null | undefined): string {
  if (!universeKey) {
    return 'Published Knowledge';
  }

  return (
    WEB_UNIVERSE_PRESENTATIONS.find((item) => item.universeKey === universeKey)?.label ?? 'AI World'
  );
}

function destinationFor(item: PublicDiscoverySearchResult): string {
  if (!item.universeKey || !item.slug) {
    return `/knowledge/resources/${encodeURIComponent(item.resourceId)}`;
  }

  return resolvePublicKnowledgeDestination({
    resourceId: item.resourceId,
    universeKey: item.universeKey,
    resourceType: item.resourceType,
    slug: item.slug,
  });
}

function replaceSearchState(input: {
  readonly query: string;
  readonly universeKey: string;
  readonly resourceTypes: readonly string[];
  readonly offset: number;
}): void {
  const params = new URLSearchParams(window.location.search);
  params.delete('query');
  params.delete('universeKey');
  params.delete('resourceType');
  params.delete('offset');

  const normalizedQuery = input.query.trim();
  if (normalizedQuery) {
    params.set('query', normalizedQuery);
  }
  if (input.universeKey) {
    params.set('universeKey', input.universeKey);
  }
  for (const resourceType of input.resourceTypes) {
    params.append('resourceType', resourceType);
  }
  if (input.offset > 0) {
    params.set('offset', String(input.offset));
  }

  const search = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
}

export function SearchExperience({
  initialQuery = '',
  initialUniverseKey = '',
  initialResourceTypes = [],
  initialOffset = 0,
}: SearchExperienceProps) {
  const [query, setQuery] = useState(initialQuery);
  const [universeKey, setUniverseKey] = useState(initialUniverseKey);
  const [resourceTypes, setResourceTypes] = useState<readonly string[]>(initialResourceTypes);
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const requestSequence = useRef(0);
  const initialSearchStarted = useRef(false);

  function toggleResourceType(resourceType: string, checked: boolean): void {
    setResourceTypes((current) =>
      checked
        ? current.includes(resourceType)
          ? current
          : [...current, resourceType]
        : current.filter((candidate) => candidate !== resourceType),
    );
  }

  async function runSearch(offset: number, criteria: SearchCriteria): Promise<void> {
    const committedCriteria: SearchCriteria = {
      ...criteria,
      query: criteria.query.trim(),
    };

    if (!committedCriteria.query) {
      requestSequence.current += 1;
      replaceSearchState({ ...committedCriteria, offset: 0 });
      setState({ status: 'idle' });
      return;
    }

    const requestId = requestSequence.current + 1;
    requestSequence.current = requestId;
    setState({ status: 'loading' });
    replaceSearchState({ ...committedCriteria, offset });

    try {
      const response = await searchPublicKnowledge({
        query: committedCriteria.query,
        ...(committedCriteria.universeKey ? { universeKey: committedCriteria.universeKey } : {}),
        resourceTypes: committedCriteria.resourceTypes,
        offset,
        limit: SEARCH_LIMIT,
      });

      if (requestSequence.current === requestId) {
        setState({
          status: 'ready',
          items: response.items,
          offset: response.pagination.offset,
          criteria: committedCriteria,
        });
      }
    } catch {
      if (requestSequence.current === requestId) {
        setState({ status: 'error', offset, criteria: committedCriteria });
      }
    }
  }

  useEffect(() => {
    if (initialSearchStarted.current || !initialQuery.trim()) {
      return;
    }

    initialSearchStarted.current = true;
    void runSearch(initialOffset, {
      query: initialQuery,
      universeKey: initialUniverseKey,
      resourceTypes: initialResourceTypes,
    });
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void runSearch(0, { query, universeKey, resourceTypes });
  }

  const readyState = state.status === 'ready' ? state : null;

  return (
    <section aria-labelledby="discovery-search-heading" className="aw-search-surface">
      <div className="aw-search-surface__intro">
        <p className="aw-eyebrow">Published discovery</p>
        <h2 id="discovery-search-heading">Search published Knowledge</h2>
        <p>Find meaningful results across AI World, then narrow by Universe or Resource Type.</p>
      </div>

      <form className="aw-search-form" onSubmit={submit}>
        <label>
          <span>Search query</span>
          <input
            required
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try temple, character, scripture…"
          />
        </label>

        <label>
          <span>Search scope</span>
          <select value={universeKey} onChange={(event) => setUniverseKey(event.target.value)}>
            <option value="">All Universes</option>
            {WEB_UNIVERSE_PRESENTATIONS.map((item) => (
              <option key={item.universeKey} value={item.universeKey}>
                {item.label} Universe
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>Resource Type filters</legend>
          <div className="aw-search-filter-grid">
            {RESOURCE_TYPE_OPTIONS.map(([value, label]) => (
              <label key={value} className="aw-check-label">
                <input
                  type="checkbox"
                  checked={resourceTypes.includes(value)}
                  onChange={(event) => toggleResourceType(value, event.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className="aw-button aw-button--primary" type="submit">
          Search
        </button>
      </form>

      <div className="aw-search-results" aria-live="polite" aria-busy={state.status === 'loading'}>
        {state.status === 'idle' ? (
          <p>Enter a query to search published Knowledge across every Universe.</p>
        ) : null}
        {state.status === 'loading' ? <p role="status">Searching published Knowledge…</p> : null}
        {state.status === 'error' ? (
          <div className="aw-inline-alert" role="alert">
            <p>Search is temporarily unavailable.</p>
            <button
              className="aw-button aw-button--secondary aw-button--compact"
              type="button"
              onClick={() => void runSearch(state.offset, state.criteria)}
            >
              Try again
            </button>
          </div>
        ) : null}
        {readyState && readyState.items.length === 0 ? (
          <div className="aw-empty-state">
            <strong>No published results found</strong>
            <p>Try a broader query, another Universe, or fewer Resource Type filters.</p>
          </div>
        ) : null}
        {readyState && readyState.items.length === 0 && readyState.offset > 0 ? (
          <nav className="aw-search-pagination" aria-label="Search result pages">
            <button
              className="aw-button aw-button--secondary aw-button--compact"
              type="button"
              onClick={() =>
                void runSearch(Math.max(0, readyState.offset - SEARCH_LIMIT), readyState.criteria)
              }
            >
              Previous
            </button>
            <button
              className="aw-button aw-button--secondary aw-button--compact"
              type="button"
              disabled
            >
              Next
            </button>
          </nav>
        ) : null}
        {readyState && readyState.items.length > 0 ? (
          <>
            <div className="aw-search-results__header">
              <p>
                Showing {readyState.offset + 1}–{readyState.offset + readyState.items.length}
              </p>
              <p>
                {readyState.criteria.universeKey
                  ? `${universeLabel(readyState.criteria.universeKey)} Universe`
                  : 'All Universes'}
              </p>
            </div>
            <ol aria-label="Search results" className="aw-search-result-list">
              {readyState.items.map((item) => {
                const typeLabel = formatPublicKnowledgeResourceType(item.resourceType);
                const displayName = item.displayName?.trim() || typeLabel;

                return (
                  <li key={item.resourceId} className="aw-search-result">
                    <p className="aw-eyebrow">
                      {universeLabel(item.universeKey)} · {typeLabel}
                    </p>
                    <h3>{displayName}</h3>
                    <p className="aw-search-result__summary">
                      {item.summary?.trim() ||
                        `Published ${typeLabel} in ${universeLabel(item.universeKey)}.`}
                    </p>
                    <Link href={destinationFor(item)} className="aw-text-link">
                      Explore {displayName}
                    </Link>
                  </li>
                );
              })}
            </ol>
            <nav className="aw-search-pagination" aria-label="Search result pages">
              <button
                className="aw-button aw-button--secondary aw-button--compact"
                type="button"
                disabled={readyState.offset === 0}
                onClick={() =>
                  void runSearch(Math.max(0, readyState.offset - SEARCH_LIMIT), readyState.criteria)
                }
              >
                Previous
              </button>
              <button
                className="aw-button aw-button--secondary aw-button--compact"
                type="button"
                disabled={readyState.items.length < SEARCH_LIMIT}
                onClick={() =>
                  void runSearch(readyState.offset + SEARCH_LIMIT, readyState.criteria)
                }
              >
                Next
              </button>
            </nav>
          </>
        ) : null}
      </div>
    </section>
  );
}
