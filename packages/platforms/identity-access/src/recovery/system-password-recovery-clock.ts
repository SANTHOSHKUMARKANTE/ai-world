import type { PasswordRecoveryClock } from './password-recovery-clock';

export class SystemPasswordRecoveryClock implements PasswordRecoveryClock {
  public now(): Date {
    return new Date();
  }
}
