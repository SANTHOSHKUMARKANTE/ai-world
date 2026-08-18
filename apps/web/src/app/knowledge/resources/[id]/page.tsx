import Link from 'next/link';

import { PublicKnowledgeResourceDetail } from '../../../../knowledge/public-knowledge-resource-detail';

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function KnowledgeResourcePage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Knowledge resource" className="flex gap-4">
          <Link
            href="/search"
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
          >
            ← Search
          </Link>
          <Link
            href="/knowledge"
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
          >
            Explore Knowledge
          </Link>
        </nav>
        <div className="py-10">
          <PublicKnowledgeResourceDetail resourceId={id} />
        </div>
      </div>
    </main>
  );
}
