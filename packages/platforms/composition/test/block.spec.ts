import { describe, expect, it } from 'vitest';

import {
  CreateTextBlock,
  TEXT_BLOCK_CONTENT_MAX_LENGTH,
  TEXT_BLOCK_TYPE,
  isBlockType,
  isTextBlockContent,
  parseTextBlockContent,
  type BlockWriter,
  type CreateTextBlockRecordInput,
  type TextBlock,
} from '../src';

function textBlockFromRecord(input: CreateTextBlockRecordInput): TextBlock {
  const now = new Date('2026-08-21T00:00:00.000Z');

  return {
    id: input.id,
    universeKey: input.universeKey,
    blockType: TEXT_BLOCK_TYPE,
    content: { text: input.text },
    createdAt: now,
    updatedAt: now,
  };
}

describe('Block model', () => {
  it('defines the initial typed Block vocabulary without a generic payload', () => {
    expect(TEXT_BLOCK_TYPE).toBe('composition.block.text');
    expect(isBlockType(TEXT_BLOCK_TYPE)).toBe(true);
    expect(isBlockType('composition.block.image')).toBe(false);
    expect(isBlockType('anime.block.character-spotlight')).toBe(false);
  });

  it('accepts bounded plain-text configuration without normalizing it', () => {
    const text = 'A devotional introduction.\nA second paragraph.';

    expect(isTextBlockContent(text)).toBe(true);
    expect(parseTextBlockContent(text)).toBe(text);
  });

  it('rejects invalid Text Block configuration', () => {
    for (const value of [
      '',
      '   ',
      'contains\0null',
      'a'.repeat(TEXT_BLOCK_CONTENT_MAX_LENGTH + 1),
    ]) {
      expect(isTextBlockContent(value)).toBe(false);
    }
  });

  it('creates an independent Universe-scoped Text Block through the canonical writer', async () => {
    const records: CreateTextBlockRecordInput[] = [];

    const writer: BlockWriter = {
      async createTextBlock(input) {
        records.push(input);
        return textBlockFromRecord(input);
      },
    };

    const createTextBlock = new CreateTextBlock(writer);

    const block = await createTextBlock.execute({
      universeKey: 'universe.devotional',
      content: { text: 'Welcome to the devotional experience.' },
    });

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      universeKey: 'universe.devotional',
      blockType: TEXT_BLOCK_TYPE,
      text: 'Welcome to the devotional experience.',
    });
    expect(block).toMatchObject({
      universeKey: 'universe.devotional',
      blockType: TEXT_BLOCK_TYPE,
      content: { text: 'Welcome to the devotional experience.' },
    });
  });

  it('rejects invalid Text Block input before persistence', async () => {
    let writes = 0;

    const writer: BlockWriter = {
      async createTextBlock(input) {
        writes += 1;
        return textBlockFromRecord(input);
      },
    };

    const createTextBlock = new CreateTextBlock(writer);

    await expect(
      createTextBlock.execute({
        universeKey: 'Universe.Devotional',
        content: { text: 'Valid text' },
      }),
    ).rejects.toBeInstanceOf(TypeError);

    await expect(
      createTextBlock.execute({
        universeKey: 'universe.devotional',
        content: { text: '   ' },
      }),
    ).rejects.toBeInstanceOf(TypeError);

    expect(writes).toBe(0);
  });
});
