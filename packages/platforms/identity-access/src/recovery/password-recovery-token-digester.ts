export interface PasswordRecoveryTokenDigester {
  digest(token: string): string;
}
