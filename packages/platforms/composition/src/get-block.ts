import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Block } from './block';
import type { BlockReader } from './block-reader';

export interface GetBlockInput {
  readonly id: ResourceId;
}

export class GetBlock {
  constructor(private readonly reader: BlockReader) {}

  execute(input: GetBlockInput): Promise<Block | null> {
    return this.reader.findById(input);
  }
}
