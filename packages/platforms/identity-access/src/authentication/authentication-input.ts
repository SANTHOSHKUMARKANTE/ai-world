export function normalizeAuthenticationEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeAuthenticationPassword(password: string): string {
  return password.normalize('NFC');
}
