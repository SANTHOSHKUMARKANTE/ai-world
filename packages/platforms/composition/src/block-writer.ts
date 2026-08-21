import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { BlockType, TextBlock } from './block';

export interface CreateTextBlockRecordInput {
  readonly id: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly blockType: BlockType;
  readonly text: string;
}

export interface BlockWriter {
  createTextBlock(input: CreateTextBlockRecordInput): Promise<TextBlock>;
}
