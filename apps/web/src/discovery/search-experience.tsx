'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { WEB_UNIVERSE_PRESENTATIONS } from '../universes/presentation';
import { searchPublicKnowledge, type PublicDiscoverySearchResult } from './public-discovery-api';

const RESOURCE_TYPE_OPTIONS = [
  ['devotional.deity', 'Devotional deity'],
  ['devotional.scripture', 'Devotional scripture'],
  ['devotional.temple', 'Devotional temple'],
  ['anime.character', 'Anime character'],
  ['anime.series', 'Anime series'],
] as const;

type SearchState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly items: readonly PublicDiscoverySearchResult[] }
  | { readonly status: 'error' };

function universeLabel(universeKey: string | null | undefined): string {
  if (!universeKey) {
    return 'Published Knowledge';
  }

  return (
    WEB_UNIVERSE_PRESENTATIONS.find((item) => item.universeKey === universeKey)?.label ??
    universeKey
  );
}

export function SearchExperience() {
  const [query, setQuery] = useState('');
  const [universeKey, setUniverseKey] = useState('');
  const [resourceTypes, setResourceTypes] = useState<readonly string[]>([]);
  const [state, setState] = useState<SearchState>({ status: 'idle' });

  function toggleResourceType(resourceType: string, checked: boolean): void {
    setResourceTypes((current) =>
      checked
        ? current.includes(resourceType)
          ? current
          : [...current, resourceType]
        : current.filter((candidate) => candidate !== resourceType),
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (query.trim().length === 0) {
      setState({ status: 'ready', items: [] });
      return;
    }

    setState({ status: 'loading' });

    try {
      const response = await searchPublicKnowledge({
        query,
        ...(universeKey.length === 0 ? {} : { universeKey }),
        resourceTypes,
        offset: 0,
        limit: 20,
      });
      setState({ status: 'ready', items: response.items });
    } catch {
      setState({ status: 'error' });
    }
  }

  return (
    <section aria-labelledby="discovery-search-heading" className="aw-search-surface">
      <div className="aw-search-surface__intro">
        <h2 id="discovery-search-heading">Search published Knowledge</h2>
        <p>One Search experience, with scope controls when you need them.</p>
      </div>

      <form className="aw-search-form" onSubmit={(event) => void submit(event)}>
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

      <div className="aw-search-results" aria-live="polite">
        {state.status === 'idle' ? (
          <p>Search globally or narrow results to one Universe and selected Resource Types.</p>
        ) : null}
        {state.status === 'loading' ? <p role="status">Searching published Knowledge…</p> : null}
        {state.status === 'error' ? <p role="alert">Search is temporarily unavailable.</p> : null}
        {state.status === 'ready' && state.items.length === 0 ? (
          <p className="aw-empty-state">No published Search results.</p>
        ) : null}
        {state.status === 'ready' && state.items.length > 0 ? (
          <ol aria-label="Search results" className="aw-search-result-list">
            {state.items.map((item) => (
              <li key={item.resourceId} className="aw-search-result">
                <p className="aw-eyebrow">{universeLabel(item.universeKey)}</p>
                <h3>{item.resourceType}</h3>
                <p className="aw-resource-card__type">{item.resourceId}</p>
                <Link
                  href={`/knowledge/resources/${encodeURIComponent(item.resourceId)}`}
                  className="aw-text-link"
                >
                  Open resource
                </Link>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
