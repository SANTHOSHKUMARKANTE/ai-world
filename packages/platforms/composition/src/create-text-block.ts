import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey, type NamespacedKey } from '@ai-world/kernel-namespace';

import {
  TEXT_BLOCK_TYPE,
  parseTextBlockContent,
  type TextBlock,
  type TextBlockContent,
} from './block';
import type { BlockWriter } from './block-writer';

export interface CreateTextBlockInput {
  readonly universeKey: NamespacedKey;
  readonly content: TextBlockContent;
}

export class CreateTextBlock {
  constructor(private readonly writer: BlockWriter) {}

  async execute(input: CreateTextBlockInput): Promise<TextBlock> {
    const universeKey = parseNamespacedKey(input.universeKey);
    const text = parseTextBlockContent(input.content.text);

    return this.writer.createTextBlock({
      id: generateResourceId(),
      universeKey,
      blockType: TEXT_BLOCK_TYPE,
      text,
    });
  }
}
