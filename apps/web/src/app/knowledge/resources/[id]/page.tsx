import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import {
  canonicalDestinationForEntity,
  genericKnowledgeResourcePath,
  getGenericKnowledgeResourceMetadata,
  getPublicKnowledgeEntityByResourceIdFromApi,
} from '../../../../knowledge/generic-knowledge-resource-metadata';
import { PublicKnowledgeResourceDetail } from '../../../../knowledge/public-knowledge-resource-detail';

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return getGenericKnowledgeResourceMetadata(id);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const entity = await getPublicKnowledgeEntityByResourceIdFromApi(id);

  if (entity) {
    const destination = canonicalDestinationForEntity(entity);
    if (destination !== genericKnowledgeResourcePath(id)) {
      redirect(destination);
    }
  }

  return (
    <main className="aw-container aw-generic-resource-page">
      <PublicKnowledgeResourceDetail resourceId={id} />
    </main>
  );
}
