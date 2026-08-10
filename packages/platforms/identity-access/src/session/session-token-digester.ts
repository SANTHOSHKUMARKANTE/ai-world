export interface SessionTokenDigester {
  digest(token: string): string;
}
