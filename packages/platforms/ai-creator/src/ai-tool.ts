export interface AiTool<TName extends string, TInput, TResult> {
  readonly name: TName;
  execute(input: TInput): Promise<TResult>;
}
