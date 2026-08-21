import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import {
  TEXT_BLOCK_TYPE,
  isBlockType,
  parseTextBlockContent,
  type Block,
  type TextBlock,
} from './block';
import type { BlockReader, FindBlockByIdInput } from './block-reader';
import type { BlockWriter, CreateTextBlockRecordInput } from './block-writer';

interface PersistedBlock {
  readonly id: string;
  readonly universeKey: string;
  readonly blockType: string;
  readonly textContent: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function mapPersistedBlock(block: PersistedBlock): Block {
  if (!isBlockType(block.blockType)) {
    throw new TypeError(`Persisted Block has unsupported Block Type: ${block.blockType}`);
  }

  return {
    id: parseResourceId(block.id),
    universeKey: parseNamespacedKey(block.universeKey),
    blockType: block.blockType,
    content: {
      text: parseTextBlockContent(block.textContent),
    },
    createdAt: block.createdAt,
    updatedAt: block.updatedAt,
  };
}

export class PrismaBlockRepository implements BlockReader, BlockWriter {
  constructor(private readonly database: DatabaseClient) {}

  async findById(input: FindBlockByIdInput): Promise<Block | null> {
    const block = await this.database.compositionBlock.findUnique({
      where: {
        id: input.id,
      },
    });

    return block ? mapPersistedBlock(block) : null;
  }

  async createTextBlock(input: CreateTextBlockRecordInput): Promise<TextBlock> {
    if (input.blockType !== TEXT_BLOCK_TYPE) {
      throw new TypeError(`Unsupported Text Block Type: ${input.blockType}`);
    }

    const block = await this.database.compositionBlock.create({
      data: {
        id: input.id,
        universeKey: input.universeKey,
        blockType: input.blockType,
        textContent: input.text,
      },
    });

    return mapPersistedBlock(block);
  }
}
