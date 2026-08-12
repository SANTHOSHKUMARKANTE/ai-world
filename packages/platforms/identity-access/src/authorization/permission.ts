import type { NamespacedKey } from '@ai-world/kernel-namespace';

export interface Permission {
  readonly id: string;
  readonly key: NamespacedKey;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
