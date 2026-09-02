export interface IdentityLifecycleLinkBuilder {
  buildEmailVerificationLink(token: string): string;

  buildPasswordRecoveryLink(token: string): string;
}
