export interface PasswordVerifier {
  verify(password: string, passwordHash: string): Promise<boolean>;
}
