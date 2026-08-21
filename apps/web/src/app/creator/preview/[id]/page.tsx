import Link from 'next/link';

import { DraftPreview } from '../../../../creator/draft-preview';

interface CreatorDraftPreviewPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function CreatorDraftPreviewPage({ params }: CreatorDraftPreviewPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Preview breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/creator" className="transition hover:text-cyan-300">
            Creator workspace
          </Link>{' '}
          <span aria-hidden="true">/</span> Saved draft preview
        </nav>
        <DraftPreview pageId={id} />
      </div>
    </main>
  );
}
