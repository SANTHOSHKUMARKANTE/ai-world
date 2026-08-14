import type { RecordAuditInput } from './audit-record';

export interface AuditRecorder {
  record(input: RecordAuditInput): Promise<void>;
}
