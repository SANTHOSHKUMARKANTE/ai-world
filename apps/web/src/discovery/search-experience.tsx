'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

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
    <section
      aria-labelledby="discovery-search-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 id="discovery-search-heading" className="text-2xl font-semibold tracking-tight">
        Search published Knowledge
      </h2>

      <form className="mt-6 grid gap-5" onSubmit={(event) => void submit(event)}>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-800">Search query</span>
          <input
            required
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Try temple, character, scripture…"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-800">Search scope</span>
          <select
            value={universeKey}
            onChange={(event) => setUniverseKey(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">All Universes</option>
            <option value="universe.devotional">Devotional Universe</option>
            <option value="universe.anime">Anime Universe</option>
          </select>
        </label>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium text-slate-800">Resource Type filters</legend>
          <div className="grid gap-2 md:grid-cols-2">
            {RESOURCE_TYPE_OPTIONS.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-slate-700">
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

        <div>
          <button
            type="submit"
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-8" aria-live="polite">
        {state.status === 'idle' ? (
          <p className="text-sm text-slate-500">
            Search globally or narrow results to one Universe and selected Resource Types.
          </p>
        ) : null}
        {state.status === 'loading' ? (
          <p role="status" className="text-sm text-slate-500">
            Searching published Knowledge…
          </p>
        ) : null}
        {state.status === 'error' ? (
          <p role="alert" className="text-sm text-slate-700">
            Search is temporarily unavailable.
          </p>
        ) : null}
        {state.status === 'ready' && state.items.length === 0 ? (
          <p className="text-sm text-slate-500">No published Search results.</p>
        ) : null}
        {state.status === 'ready' && state.items.length > 0 ? (
          <ol aria-label="Search results" className="grid gap-4">
            {state.items.map((item) => (
              <li
                key={item.resourceId}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.universeKey ?? 'Published Knowledge'}
                </p>
                <h3 className="mt-1 font-semibold text-slate-950">{item.resourceType}</h3>
                <p className="mt-2 break-all font-mono text-xs text-slate-600">{item.resourceId}</p>
                <Link
                  href={`/knowledge/resources/${encodeURIComponent(item.resourceId)}`}
                  className="mt-3 inline-block text-sm font-medium text-slate-800 underline-offset-4 hover:underline"
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
