import { SearchExperience } from '../../discovery/search-experience';
import { PageContainer } from '../../ui/primitives';

export default function SearchPage() {
  return (
    <main className="aw-public-page">
      <PageContainer>
        <header className="aw-public-hero">
          <p className="aw-eyebrow">Discovery</p>
          <h1>Search AI World</h1>
          <p>
            Search all published Knowledge together, or narrow your results to Devotional, Anime,
            and selected Resource Types.
          </p>
        </header>

        <SearchExperience />
      </PageContainer>
    </main>
  );
}
