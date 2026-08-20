export interface AiProviderTextRequest {
  readonly input: string;
  readonly instructions?: string;
}

export interface AiProviderTextUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;
}

export interface AiProviderTextResult {
  readonly text: string;
  readonly model: string;
  readonly usage?: AiProviderTextUsage;
}

export interface AiProviderPort {
  generateText(request: AiProviderTextRequest): Promise<AiProviderTextResult>;
}
