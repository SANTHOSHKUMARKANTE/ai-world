import type { Metadata } from 'next';

import { SearchExperience } from '../../discovery/search-experience';
import { parseSearchPageState } from '../../discovery/search-page-state';
import { PageContainer } from '../../ui/primitives';

const SEARCH_DESCRIPTION =
  'Search published Knowledge across AI World with real identity, focused filters, and canonical destinations.';

export const metadata: Metadata = {
  title: 'Search',
  description: SEARCH_DESCRIPTION,
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    type: 'website',
    siteName: 'AI World',
    title: 'Search · AI World',
    description: SEARCH_DESCRIPTION,
  },
};

interface SearchPageProps {
  readonly searchParams: Promise<Record<string, string | readonly string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const state = parseSearchPageState(await searchParams);

  return (
    <main className="aw-public-page aw-search-page" data-uxp08c-search="true">
      <PageContainer>
        <header className="aw-public-hero">
          <p className="aw-eyebrow">Discovery</p>
          <h1>Search AI World</h1>
          <p>
            Search all published Knowledge together, or narrow your results to Devotional, Anime,
            and selected Resource Types.
          </p>
        </header>

        <SearchExperience
          initialQuery={state.query}
          initialUniverseKey={state.universeKey}
          initialResourceTypes={state.resourceTypes}
          initialOffset={state.offset}
        />
      </PageContainer>
    </main>
  );
}
