import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

export type AuditContextValue = string | number | boolean | null;

export type AuditContext = Readonly<Record<string, AuditContextValue>>;

export interface AuditResourceReference {
  readonly type: NamespacedKey;
  readonly id: ResourceId;
}

export interface RecordAuditInput {
  readonly actorId: ResourceId;
  readonly action: NamespacedKey;
  readonly resource: AuditResourceReference;
  readonly result: NamespacedKey;
  readonly context?: AuditContext;
}

export interface AuditRecord extends RecordAuditInput {
  readonly id: ResourceId;
  readonly recordedAt: Date;
}
