import Link from 'next/link';

import { CreatorWorkspace } from '../../creator/creator-workspace';

export default function CreatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Creator breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-300">
            AI World
          </Link>{' '}
          <span aria-hidden="true">/</span> Creator
        </nav>

        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Composition / CMS
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Creator workspace</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Build canonical knowledge and media, then arrange them with reusable blocks into an
            ordered Page composition.
          </p>
        </header>

        <CreatorWorkspace />
      </div>
    </main>
  );
}
