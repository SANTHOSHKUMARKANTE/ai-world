import Link from 'next/link';

import { HomeKnowledgeFoundation } from '../home/home-knowledge-foundation';
import { LinkButton, PageContainer, Surface } from '../ui/primitives';
import { WEB_UNIVERSE_PRESENTATIONS } from '../universes/presentation';
import { SessionSummary } from './session-summary';

const PRODUCT_PATHS = [
  {
    title: 'Explore Knowledge',
    description:
      'Browse published structured Knowledge while canonical ownership remains with the shared platform.',
    href: '/knowledge',
    linkLabel: 'Open Knowledge',
  },
  {
    title: 'Search across AI World',
    description:
      'Search published Knowledge across Universes through one shared Discovery experience.',
    href: '/search',
    linkLabel: 'Search AI World',
  },
  {
    title: 'Create structured experiences',
    description:
      'Authorized creators can compose Knowledge, Media, Pages, and responsible AI-assisted drafts.',
    href: '/creator',
    linkLabel: 'Open Creator',
  },
] as const;

export default function Home() {
  return (
    <main>
      <PageContainer className="aw-home">
        <section className="aw-hero" aria-labelledby="home-heading">
          <p className="aw-eyebrow">Knowledge · Creation · Exploration</p>
          <h1 id="home-heading">One world. Many universes.</h1>
          <p className="aw-hero-copy">
            AI World brings structured Knowledge, shared discovery, creator tools, and responsible
            AI assistance into one coherent platform designed to evolve with technology.
          </p>
          <div className="aw-hero-actions">
            <LinkButton href="/knowledge">Explore Knowledge</LinkButton>
            <LinkButton href="/search" variant="secondary">
              Search AI World
            </LinkButton>
          </div>
        </section>

        <section className="aw-home-section" aria-labelledby="product-paths-heading">
          <div className="aw-section-heading">
            <p className="aw-eyebrow">Start with what matters</p>
            <h2 id="product-paths-heading">A clear path from curiosity to creation.</h2>
            <p>
              AI World is not a collection of disconnected sites or an AI chatbot attached to one
              topic. Shared capabilities stay consistent while each Universe can express its own
              character.
            </p>
          </div>

          <div className="aw-card-grid">
            {PRODUCT_PATHS.map((path) => (
              <Surface className="aw-feature-card" key={path.href}>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <Link href={path.href}>{path.linkLabel}</Link>
              </Surface>
            ))}
          </div>
        </section>

        <section className="aw-home-section" aria-labelledby="universes-heading">
          <div className="aw-section-heading">
            <p className="aw-eyebrow">Universes</p>
            <h2 id="universes-heading">Different worlds. One interaction language.</h2>
            <p>
              Universe presentation can evolve independently without changing canonical Knowledge or
              forcing users to learn a different product every time.
            </p>
          </div>

          <div className="aw-universe-grid">
            {WEB_UNIVERSE_PRESENTATIONS.map((universe) => (
              <Surface
                className="aw-universe-card"
                data-universe-key={universe.universeKey}
                data-universe-tone={universe.tone}
                key={universe.universeKey}
              >
                <h3>{universe.label}</h3>
                <p>{universe.description}</p>
                <Link href={universe.href}>Enter {universe.label}</Link>
              </Surface>
            ))}
          </div>

          <SessionSummary />
        </section>

        <HomeKnowledgeFoundation />
      </PageContainer>
    </main>
  );
}
