import type { AuditRecorder } from '@ai-world/kernel-audit';

import type { AssetWriter } from './asset-writer';

export interface MediaAssetUploadTransactionResources {
  readonly assetWriter: AssetWriter;
  readonly auditRecorder: AuditRecorder;
}

export interface MediaAssetUploadTransaction {
  execute<TResult>(
    operation: (resources: MediaAssetUploadTransactionResources) => Promise<TResult>,
  ): Promise<TResult>;
}
