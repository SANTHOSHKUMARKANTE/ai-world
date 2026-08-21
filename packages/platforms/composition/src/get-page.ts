import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Page } from './page';
import type { PageReader } from './page-reader';

export interface GetPageInput {
  readonly id: ResourceId;
}

export class GetPage {
  constructor(private readonly reader: PageReader) {}

  execute(input: GetPageInput): Promise<Page | null> {
    return this.reader.findById(input);
  }
}
