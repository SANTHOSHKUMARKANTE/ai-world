import { ApplicationError } from '@ai-world/foundation-errors';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import type { CreatorPageReader } from './creator-page-reader';
import type { Page } from './page';

export const CREATOR_PAGE_DEFAULT_LIMIT = 50;
export const CREATOR_PAGE_MAX_LIMIT = 100;

export interface ListPagesInput {
  readonly universeKey: string;
  readonly limit?: number;
}

export class ListPages {
  public constructor(private readonly reader: CreatorPageReader) {}

  public async execute(input: ListPagesInput): Promise<readonly Page[]> {
    let universeKey;
    try {
      universeKey = parseNamespacedKey(input.universeKey);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new ApplicationError({
          code: 'composition.page.invalid_input',
          kind: 'validation',
          message: `Creator Page listing input failed canonical validation: ${error.message}`,
          publicMessage: 'The creator Page input is invalid.',
        });
      }
      throw error;
    }

    const limit = input.limit ?? CREATOR_PAGE_DEFAULT_LIMIT;
    if (!Number.isInteger(limit) || limit < 1 || limit > CREATOR_PAGE_MAX_LIMIT) {
      throw new ApplicationError({
        code: 'composition.page.invalid_input',
        kind: 'validation',
        message: `Creator Page listing limit must be between 1 and ${CREATOR_PAGE_MAX_LIMIT}.`,
        publicMessage: 'The creator Page input is invalid.',
      });
    }

    return this.reader.listForCreator({ universeKey, limit });
  }
}
