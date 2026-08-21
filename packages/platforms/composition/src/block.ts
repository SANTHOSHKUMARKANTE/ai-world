import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

export const TEXT_BLOCK_TYPE = 'composition.block.text' as const;

export type BlockType = typeof TEXT_BLOCK_TYPE;

export const TEXT_BLOCK_CONTENT_MAX_LENGTH = 10_000;

export interface TextBlockContent {
  readonly text: string;
}

export interface TextBlock {
  readonly id: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly blockType: typeof TEXT_BLOCK_TYPE;
  readonly content: TextBlockContent;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type Block = TextBlock;

export function isBlockType(value: unknown): value is BlockType {
  return value === TEXT_BLOCK_TYPE;
}

export function isTextBlockContent(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= TEXT_BLOCK_CONTENT_MAX_LENGTH &&
    value.trim().length > 0 &&
    !value.includes('\0')
  );
}

export function parseTextBlockContent(value: string): string {
  if (!isTextBlockContent(value)) {
    throw new TypeError(
      'Text Block content must contain non-whitespace text, must not contain a null character, and must be no longer than 10000 characters.',
    );
  }

  return value;
}
