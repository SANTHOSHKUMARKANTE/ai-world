import type { DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';

import type { AuditClock } from './audit-clock';
import type { AuditRecorder } from './audit-recorder';
import type { RecordAuditInput } from './audit-record';
import { createAuditRecord } from './create-audit-record';
import { SystemAuditClock } from './system-audit-clock';

export class PrismaAuditRecorder implements AuditRecorder {
  constructor(
    private readonly database: DatabaseClient,
    private readonly clock: AuditClock = new SystemAuditClock(),
  ) {}

  async record(input: RecordAuditInput): Promise<void> {
    const record = createAuditRecord(input, generateResourceId(), this.clock.now());

    await this.database.auditRecord.create({
      data: {
        id: record.id,
        actorId: record.actorId,
        action: record.action,
        resourceType: record.resource.type,
        resourceId: record.resource.id,
        result: record.result,
        ...(record.context === undefined
          ? {}
          : {
              context: { ...record.context },
            }),
        recordedAt: record.recordedAt,
      },
    });
  }
}
