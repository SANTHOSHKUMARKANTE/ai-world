export interface ConfirmEmailVerificationTransactionInput {
  readonly tokenDigest: string;
  readonly confirmedAt: Date;
}

export interface EmailVerificationConfirmationTransaction {
  confirm(input: ConfirmEmailVerificationTransactionInput): Promise<boolean>;
}
