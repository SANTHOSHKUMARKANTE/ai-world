import type { SearchContract, SearchResultPage } from '@ai-world/platform-discovery';
import { Controller, Get, Inject, Query } from '@nestjs/common';

import { parsePublicDiscoverySearchQuery } from './public-discovery-search-request';

export const PUBLIC_DISCOVERY_SEARCH = Symbol('PUBLIC_DISCOVERY_SEARCH');

@Controller('discovery/search')
export class PublicDiscoverySearchController {
  public constructor(
    @Inject(PUBLIC_DISCOVERY_SEARCH)
    private readonly searchContract: SearchContract,
  ) {}

  @Get()
  public async search(@Query() query: unknown): Promise<SearchResultPage> {
    return this.searchContract.search(parsePublicDiscoverySearchQuery(query));
  }
}
