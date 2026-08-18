import Link from 'next/link';

import { SearchExperience } from '../../discovery/search-experience';

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Search">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
          >
            ← AI World
          </Link>
        </nav>
        <header className="max-w-3xl py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Discovery Platform
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Search AI World</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Search published Knowledge across Universes, narrow the scope, filter by Resource Type,
            and navigate to the matching public Resource.
          </p>
        </header>
        <SearchExperience />
      </div>
    </main>
  );
}
