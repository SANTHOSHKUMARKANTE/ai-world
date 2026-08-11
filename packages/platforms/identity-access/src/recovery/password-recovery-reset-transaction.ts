export interface ResetPasswordWithRecoveryTransactionInput {
  readonly tokenDigest: string;
  readonly passwordHash: string;
  readonly resetAt: Date;
}

export interface PasswordRecoveryResetTransaction {
  reset(input: ResetPasswordWithRecoveryTransactionInput): Promise<boolean>;
}
