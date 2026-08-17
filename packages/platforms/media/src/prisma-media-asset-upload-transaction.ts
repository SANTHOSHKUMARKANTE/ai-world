import type { DatabaseClient, DatabaseTransactionClient } from '@ai-world/foundation-database';
import type { AuditRecorder } from '@ai-world/kernel-audit';

import type {
  MediaAssetUploadTransaction,
  MediaAssetUploadTransactionResources,
} from './media-asset-upload-transaction';
import { PrismaAssetRepository } from './prisma-asset-repository';

export type MediaAuditRecorderFactory = (transaction: DatabaseTransactionClient) => AuditRecorder;

export class PrismaMediaAssetUploadTransaction implements MediaAssetUploadTransaction {
  constructor(
    private readonly database: DatabaseClient,
    private readonly createAuditRecorder: MediaAuditRecorderFactory,
  ) {}

  execute<TResult>(
    operation: (resources: MediaAssetUploadTransactionResources) => Promise<TResult>,
  ): Promise<TResult> {
    return this.database.$transaction(async (transaction) =>
      operation({
        assetWriter: new PrismaAssetRepository(transaction),
        auditRecorder: this.createAuditRecorder(transaction),
      }),
    );
  }
}
