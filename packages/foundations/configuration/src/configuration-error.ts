export interface ConfigurationIssue {
  readonly path: string;
  readonly message: string;
}

export class ConfigurationError extends Error {
  readonly issues: readonly ConfigurationIssue[];

  constructor(issues: readonly ConfigurationIssue[]) {
    const details = issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ');

    super(details.length > 0 ? `Invalid configuration: ${details}` : 'Invalid configuration.');

    this.name = 'ConfigurationError';
    this.issues = issues;
  }
}
