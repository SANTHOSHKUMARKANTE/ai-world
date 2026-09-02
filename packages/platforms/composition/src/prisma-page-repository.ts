import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import { isPageLifecycle, parsePagePresentationTitle, parsePageRoutePath, type Page } from './page';
import type { CreatorPageReader, ListCreatorPagesInput } from './creator-page-reader';
import type { FindPageByIdInput, FindPageByRouteInput, PageReader } from './page-reader';
import type {
  PageLifecycleWriter,
  TransitionPageLifecycleRecordInput,
} from './page-lifecycle-writer';
import type { CreatePageRecordInput, PageWriter } from './page-writer';

type PageDatabaseClient = Pick<DatabaseClient, 'compositionPage'>;

interface PersistedPage {
  readonly id: string;
  readonly universeKey: string;
  readonly routePath: string;
  readonly title: string;
  readonly lifecycle: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function mapPersistedPage(page: PersistedPage): Page {
  if (!isPageLifecycle(page.lifecycle)) {
    throw new TypeError(`Persisted Page has unsupported lifecycle: ${page.lifecycle}`);
  }

  return {
    id: parseResourceId(page.id),
    universeKey: parseNamespacedKey(page.universeKey),
    route: {
      path: parsePageRoutePath(page.routePath),
    },
    presentation: {
      title: parsePagePresentationTitle(page.title),
    },
    lifecycle: page.lifecycle,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

export class PrismaPageRepository
  implements PageReader, CreatorPageReader, PageWriter, PageLifecycleWriter
{
  constructor(private readonly database: PageDatabaseClient) {}

  async findById(input: FindPageByIdInput): Promise<Page | null> {
    const page = await this.database.compositionPage.findUnique({
      where: {
        id: input.id,
      },
    });

    return page ? mapPersistedPage(page) : null;
  }

  async findByRoute(input: FindPageByRouteInput): Promise<Page | null> {
    const universeKey = parseNamespacedKey(input.universeKey);
    const routePath = parsePageRoutePath(input.routePath);

    const page = await this.database.compositionPage.findUnique({
      where: {
        universeKey_routePath: {
          universeKey,
          routePath,
        },
      },
    });

    return page ? mapPersistedPage(page) : null;
  }

  async listForCreator(input: ListCreatorPagesInput): Promise<readonly Page[]> {
    const pages = await this.database.compositionPage.findMany({
      where: { universeKey: input.universeKey },
      orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
      take: input.limit,
    });

    return pages.map(mapPersistedPage);
  }

  async create(input: CreatePageRecordInput): Promise<Page> {
    const page = await this.database.compositionPage.create({
      data: {
        id: input.id,
        universeKey: input.universeKey,
        routePath: input.routePath,
        title: input.title,
        lifecycle: input.lifecycle,
      },
    });

    return mapPersistedPage(page);
  }

  async transitionLifecycle(input: TransitionPageLifecycleRecordInput): Promise<Page | null> {
    const result = await this.database.compositionPage.updateMany({
      where: {
        id: input.id,
        lifecycle: input.fromLifecycle,
      },
      data: {
        lifecycle: input.toLifecycle,
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return this.findById({ id: input.id });
  }
}
