export interface EmailVerificationTokenGenerator {
  generate(): string;
}
