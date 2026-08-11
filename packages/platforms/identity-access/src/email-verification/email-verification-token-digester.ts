export interface EmailVerificationTokenDigester {
  digest(token: string): string;
}
