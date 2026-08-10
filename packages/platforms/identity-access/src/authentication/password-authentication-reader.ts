export interface PasswordAuthenticationCredential {
  readonly actorId: string;
  readonly passwordHash: string;
}

export interface PasswordAuthenticationReader {
  findByNormalizedEmail(normalizedEmail: string): Promise<PasswordAuthenticationCredential | null>;
}
