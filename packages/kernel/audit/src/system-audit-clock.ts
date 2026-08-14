import type { AuditClock } from './audit-clock';

export class SystemAuditClock implements AuditClock {
  now(): Date {
    return new Date();
  }
}
