import Link from 'next/link';

import { KnowledgeUniverseSection } from '../knowledge/knowledge-universe-section';
import { WEB_UNIVERSE_PRESENTATIONS } from '../universes/presentation';

const HOME_KNOWLEDGE_LIMIT = 3;

export function HomeKnowledgeFoundation() {
  return (
    <section
      className="aw-home-section aw-home-knowledge"
      aria-labelledby="home-knowledge-heading"
      data-uxp11a-home-knowledge="true"
    >
      <div className="aw-section-heading aw-home-knowledge__heading">
        <p className="aw-eyebrow">Published across AI World</p>
        <h2 id="home-knowledge-heading">Continue with real Knowledge.</h2>
        <p>
          Browse recently updated public Knowledge from each Universe, or use Search when you
          already know what you want to find.
        </p>
      </div>

      <div className="aw-home-knowledge__universes">
        {WEB_UNIVERSE_PRESENTATIONS.map((universe, index) => (
          <KnowledgeUniverseSection
            key={universe.universeKey}
            sectionId={`home-${universe.tone}-knowledge`}
            title={`${universe.label} Knowledge`}
            description={universe.description}
            universeKey={universe.universeKey}
            priority={index === 0 ? 'primary' : 'secondary'}
            tone={universe.tone}
            limit={HOME_KNOWLEDGE_LIMIT}
          />
        ))}
      </div>

      <p className="aw-home-knowledge__continue">
        <Link href="/knowledge">Browse all published Knowledge</Link>
        <span aria-hidden="true">·</span>
        <Link href="/search">Search across Universes</Link>
      </p>
    </section>
  );
}
