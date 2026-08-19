export interface AiProviderTextRequest {
  readonly input: string;
  readonly instructions?: string;
}

export interface AiProviderTextResult {
  readonly text: string;
  readonly model: string;
}

export interface AiProviderPort {
  generateText(request: AiProviderTextRequest): Promise<AiProviderTextResult>;
}
