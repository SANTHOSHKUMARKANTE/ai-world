import type { Metadata } from 'next';

import { KnowledgeUniverseSection } from '../../knowledge/knowledge-universe-section';
import { LinkButton, PageContainer } from '../../ui/primitives';
import { WEB_UNIVERSE_PRESENTATIONS } from '../../universes/presentation';

const KNOWLEDGE_DESCRIPTION =
  'Browse published Knowledge across Devotional and Anime with real identity, public Media, and canonical AI World destinations.';

export const metadata: Metadata = {
  title: 'Knowledge',
  description: KNOWLEDGE_DESCRIPTION,
  alternates: {
    canonical: '/knowledge',
  },
  openGraph: {
    type: 'website',
    siteName: 'AI World',
    title: 'Knowledge · AI World',
    description: KNOWLEDGE_DESCRIPTION,
  },
};

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
    <main className="aw-public-page aw-knowledge-browse-page" data-uxp08a-knowledge-browse="true">
      <PageContainer>
        <header className="aw-knowledge-browse-hero">
          <p className="aw-eyebrow">Explore AI World</p>
          <h1>Explore published Knowledge</h1>
          <p>
            Discover real published Knowledge across AI World with typed Universe identity,
            meaningful names, public-safe Media, and truthful destinations.
          </p>
          <div className="aw-knowledge-browse-actions">
            <LinkButton href="#devotional-knowledge">Explore Devotional</LinkButton>
            <LinkButton href="/search" variant="secondary">
              Search AI World
            </LinkButton>
          </div>
        </header>

        <div className="aw-universe-stack">
          <KnowledgeUniverseSection
            sectionId="devotional-knowledge"
            title={`${devotional.label} Knowledge`}
            description={devotional.description}
            universeKey={devotional.universeKey}
            priority="primary"
            tone={devotional.tone}
          />

          <KnowledgeUniverseSection
            sectionId="anime-knowledge"
            title={`${anime.label} Knowledge`}
            description={anime.description}
            universeKey={anime.universeKey}
            tone={anime.tone}
          />
        </div>

        <section
          className="aw-knowledge-browse-continue"
          aria-labelledby="knowledge-continue-title"
        >
          <div>
            <p className="aw-eyebrow">Continue discovery</p>
            <h2 id="knowledge-continue-title">Looking for something specific?</h2>
            <p>
              Use the existing cross-Universe Search experience when you already know what you want
              to find.
            </p>
          </div>
          <LinkButton href="/search" variant="secondary">
            Search AI World
          </LinkButton>
        </section>
      </PageContainer>
    </main>
  );
}
