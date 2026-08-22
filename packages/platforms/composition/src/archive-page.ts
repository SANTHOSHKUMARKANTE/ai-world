import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';

import { PAGE_ARCHIVED_LIFECYCLE, PAGE_PUBLISHED_LIFECYCLE, type Page } from './page';
import type { PageLifecycleWriter } from './page-lifecycle-writer';
import type { PageReader } from './page-reader';

export interface ArchivePageInput {
  readonly id: ResourceId;
}

export class ArchivePage {
  constructor(
    private readonly reader: PageReader,
    private readonly lifecycleWriter: PageLifecycleWriter,
  ) {}

  async execute(input: ArchivePageInput): Promise<Page> {
    const id = parseResourceId(input.id);
    const archived = await this.lifecycleWriter.transitionLifecycle({
      id,
      fromLifecycle: PAGE_PUBLISHED_LIFECYCLE,
      toLifecycle: PAGE_ARCHIVED_LIFECYCLE,
    });

    if (archived) {
      return archived;
    }

    const existing = await this.reader.findById({ id });
    if (!existing) {
      throw new ApplicationError({
        code: 'composition.page.not_found',
        kind: 'not_found',
        message: 'No Page exists for the supplied Resource ID.',
        publicMessage: 'Page not found.',
      });
    }

    throw new ApplicationError({
      code: 'composition.page.lifecycle_conflict',
      kind: 'conflict',
      message: `Page cannot be archived from lifecycle ${existing.lifecycle}.`,
      publicMessage: 'Page lifecycle transition is not allowed.',
    });
  }
}
