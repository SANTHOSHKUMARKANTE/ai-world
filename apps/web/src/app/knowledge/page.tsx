import { KnowledgeUniverseSection } from '../../knowledge/knowledge-universe-section';
import { PageContainer } from '../../ui/primitives';
import { WEB_UNIVERSE_PRESENTATIONS } from '../../universes/presentation';

function presentation(universeKey: 'universe.devotional' | 'universe.anime') {
  const match = WEB_UNIVERSE_PRESENTATIONS.find((item) => item.universeKey === universeKey);

  if (!match) {
    throw new Error(`Missing Web Universe presentation for ${universeKey}.`);
  }

  return match;
}

export default function KnowledgePage() {
  const devotional = presentation('universe.devotional');
  const anime = presentation('universe.anime');

  return (
    <main className="aw-public-page">
      <PageContainer>
        <header className="aw-public-hero">
          <p className="aw-eyebrow">Explore AI World</p>
          <h1>Explore published Knowledge</h1>
          <p>
            Browse published Knowledge across AI World. Start with Devotional, explore Anime through
            the same shared experience, then open any Resource to view Media and save it for later.
          </p>
        </header>

        <div className="aw-universe-stack">
          <KnowledgeUniverseSection
            title={`${devotional.label} Resources`}
            description={devotional.description}
            universeKey={devotional.universeKey}
            priority="primary"
            tone={devotional.tone}
            imageResourceTypes={['devotional.temple']}
            imageSectionLabel="Temple imagery"
          />

          <KnowledgeUniverseSection
            title={`${anime.label} Resources`}
            description={anime.description}
            universeKey={anime.universeKey}
            tone={anime.tone}
            imageResourceTypes={['anime.character', 'anime.series']}
            imageSectionLabel="Anime imagery"
          />
        </div>
      </PageContainer>
    </main>
  );
}
