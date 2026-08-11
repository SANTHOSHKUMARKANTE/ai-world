export interface EmailMessage {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
  readonly html?: string;
}

export interface EmailDelivery {
  send(message: EmailMessage): Promise<void>;
}
