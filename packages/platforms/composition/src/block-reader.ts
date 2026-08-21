import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Block } from './block';

export interface FindBlockByIdInput {
  readonly id: ResourceId;
}

export interface BlockReader {
  findById(input: FindBlockByIdInput): Promise<Block | null>;
}
