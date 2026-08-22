import type { ResourceId } from '@ai-world/kernel-identifiers';

/**
 * Engagement-owned record that a User intentionally selected a Resource as favored.
 *
 * The stable Resource ID is a reference only. Favorite never owns or copies the
 * referenced Resource's canonical state. Target availability and lifecycle are
 * resolved through the target owner when a consumer presents the Favorite; they
 * are not synchronous Favorite-mutation invariants that couple Engagement to
 * every Resource-owning Platform.
 */
export interface Favorite {
  readonly id: ResourceId;
  readonly userId: ResourceId;
  readonly resourceId: ResourceId;
  readonly createdAt: Date;
}
