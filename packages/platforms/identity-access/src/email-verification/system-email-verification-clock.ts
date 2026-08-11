import type { EmailVerificationClock } from './email-verification-clock';

export class SystemEmailVerificationClock implements EmailVerificationClock {
  public now(): Date {
    return new Date();
  }
}
