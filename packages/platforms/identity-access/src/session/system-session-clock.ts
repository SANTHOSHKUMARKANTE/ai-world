import type { SessionClock } from './session-clock';

export class SystemSessionClock implements SessionClock {
  now(): Date {
    return new Date();
  }
}
