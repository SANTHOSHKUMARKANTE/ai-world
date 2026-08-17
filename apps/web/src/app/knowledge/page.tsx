import Link from 'next/link';

import { KnowledgeUniverseSection } from '../../knowledge/knowledge-universe-section';

export default function KnowledgePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Knowledge">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
          >
            ← AI World
          </Link>
        </nav>

        <header className="max-w-3xl py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Shared Knowledge Platform
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Explore published Knowledge
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            One public Knowledge contract powers multiple Universes. Devotional remains the primary
            product experience while Anime provides the bounded reuse proof.
          </p>
        </header>

        <div className="grid gap-6">
          <KnowledgeUniverseSection
            title="Devotional Resources"
            description="The primary AI World domain experience, now proving shared Media through published temple imagery without Devotional-specific storage or processing."
            universeKey="universe.devotional"
            priority="primary"
            imageResourceTypes={['devotional.temple']}
            imageSectionLabel="Temple imagery"
          />

          <KnowledgeUniverseSection
            title="Anime Resources"
            description="A bounded second-Universe reuse view using the same public Knowledge contract without separate infrastructure."
            universeKey="universe.anime"
          />
        </div>
      </div>
    </main>
  );
}
