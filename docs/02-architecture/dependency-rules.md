# AI World Dependency Rules

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Dependency Rules |
| Document ID | P0-D14 |
| Area | Architecture |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Canonical Architectural Dependency Policy |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md`, `docs/01-vision/terminology.md`, `docs/02-architecture/system-context.md`, `docs/02-architecture/platform-architecture.md`, `docs/02-architecture/platform-layers.md`, `docs/02-architecture/capability-map.md`, `docs/02-architecture/ownership-model.md` |

---

# 1. Purpose

This document defines the canonical architectural **Dependency Rules** for AI World.

It determines:

```text
which architectural areas may depend on which others;

which source imports are allowed;

which imports are forbidden;

how Platforms communicate;

how Universes integrate;

how shared Kernel capabilities are consumed;

how Foundations remain domain-neutral;

how Provider Adapters are isolated;

how canonical data ownership is protected;

how synchronous and asynchronous communication is selected;

how circular dependencies are prevented;

how runtime composition differs from source dependency;

how architecture violations will eventually be automated.
```

This document converts the architectural direction established by earlier Phase 0 documents into enforceable rules.

---

# 2. Dependency Objective

AI World seeks:

```text
CONTROLLED DEPENDENCY
```

not:

```text
ZERO DEPENDENCY.
```

A useful system necessarily contains dependencies.

The architectural objective is to ensure those dependencies are:

```text
explicit;

owned;

directional;

stable;

minimal;

testable;

replaceable where appropriate.
```

---

# 3. Core Dependency Principle

> **A capability may depend only on another capability's deliberately exposed Contract, unless both areas belong to the same ownership boundary and the internal dependency is intentional.**

Cross-boundary access to internal implementation is forbidden by default.

---

# 4. Dependency Direction Principle

The normal conceptual direction remains:

```text
Applications
      ↓
Universes
      ↓
Platforms
      ↓
Platform Kernel
      ↓
Foundations
```

At external boundaries:

```text
Capability Contract
       ▲
       │ implemented by
Concrete Adapter
       │
       ▼
External Provider
```

---

# 5. Dependency Direction Is Not a Mandatory Call Chain

A request does not need to traverse every layer.

Valid:

```text
Application
    ↓
Identity & Access
```

Valid:

```text
Platform
    ↓
Storage Foundation
```

Valid:

```text
Universe
    ↓
Knowledge Platform
```

The rule concerns ownership and allowed dependency direction.

---

# 6. Dependency Categories

AI World distinguishes:

```text
Source Dependency

Contract Dependency

Runtime Dependency

Data Dependency

Event Dependency

Operational Dependency

Deployment Dependency

Provider Dependency
```

These must not be treated as identical.

---

# 7. Source Dependency

A **Source Dependency** exists when source code from one area imports or otherwise statically references another area.

Examples:

```text
import type
import class
package dependency
module import
generated type dependency
```

Source dependencies are among the most important architecture rules to automate.

---

# 8. Contract Dependency

A **Contract Dependency** exists when one capability depends on another capability's supported public interface.

This is the preferred form of cross-capability dependency.

---

# 9. Runtime Dependency

A **Runtime Dependency** exists when one capability requires another capability to be operational at runtime.

Example:

```text
Media
    requires
Storage.
```

---

# 10. Data Dependency

A **Data Dependency** exists when one owner references data owned by another owner.

Example:

```text
User
    references
Asset ID.
```

A Data Dependency does not grant mutation authority.

---

# 11. Event Dependency

An **Event Dependency** exists when a consumer relies on an Event published by another capability.

Example:

```text
Discovery
    consumes
EntityPublished.
```

---

# 12. Operational Dependency

An **Operational Dependency** exists when functionality depends on external or internal infrastructure being available.

Example:

```text
AI Generation
    operationally depends on
AI Provider.
```

---

# 13. Deployment Dependency

A **Deployment Dependency** exists when one independently deployed runtime requires another runtime.

This becomes more important if AI World later becomes distributed.

---

# 14. Provider Dependency

A **Provider Dependency** exists when AI World depends on external technology or service implementation.

Examples:

```text
database provider

storage provider

AI provider

email provider

search provider.
```

Provider dependencies must remain localized.

---

# 15. Public vs Internal Boundary

Every substantial capability should eventually distinguish:

```text
PUBLIC
```

from:

```text
INTERNAL.
```

Public means intentionally consumable across the ownership boundary.

Internal means implementation detail.

---

# 16. Public Does Not Mean Internet-Public

A Public Contract may be:

```text
public to another Module;

public to another Platform;

public to another Application;

public to an external consumer.
```

These are different exposure scopes.

---

# 17. Internal Import Rule

A capability must not import another capability's internal implementation by default.

Bad:

```text
Composition
    imports
Knowledge/internal/entity.repository
```

Preferred:

```text
Composition
    imports
Knowledge public Contract.
```

---

# 18. Barrel Export Rule

A barrel file must not accidentally expose internals.

Bad:

```text
knowledge/index.ts

export * from './internal';
```

Preferred:

```text
export only supported public surface.
```

---

# 19. Type Import Rule

Type-only imports still count as architectural dependencies.

Bad:

```text
Universe
    imports type
KnowledgeInternalOrmEntity.
```

The absence of runtime JavaScript does not remove architectural coupling.

---

# 20. Generated Type Rule

Generated types must obey ownership boundaries.

Examples include:

```text
ORM-generated models

OpenAPI-generated types

GraphQL-generated types

provider SDK types.
```

Generated code is not exempt from architecture.

---

# 21. Framework Injection Rule

Dependency injection does not automatically create architectural decoupling.

Bad:

```text
Knowledge depends on concrete DiscoveryService
through DI.
```

If the ownership direction is wrong, injection does not fix it.

---

# 22. Service Locator Rule

Avoid hiding dependencies through:

```text
global service locator

runtime string lookups

container.get('Anything')

global registry access.
```

Dependencies should remain visible.

---

# 23. Reflection Rule

Reflection-based wiring must not be used to conceal prohibited architectural dependencies.

---

# 24. Dynamic Import Rule

Dynamic import is not an architectural escape hatch.

If:

```text
Platform A
```

is forbidden from depending on:

```text
Universe B,
```

then replacing a normal import with:

```text
dynamic import()
```

does not make the dependency valid.

---

# 25. Application Dependency Rules

Applications may depend on:

```text
Platform Public Contracts

Universe public definitions/context

selected Kernel Contracts

selected Foundations for runtime concerns

Application-local components.
```

---

# 26. Application Forbidden Dependencies

Applications must not normally depend on:

```text
Platform private repositories

Platform private persistence models

Kernel private implementation

Foundation provider internals

raw database tables for business mutation.
```

---

# 27. Application-to-Platform Rule

Allowed:

```text
Public Web
    → Discovery

Admin
    → Knowledge

API
    → Identity & Access.
```

Applications are delivery consumers.

---

# 28. Application-to-Universe Rule

Allowed for:

```text
Universe routing

Universe presentation configuration

Universe selection

Universe definition resolution.
```

---

# 29. Application-to-Kernel Rule

Allowed only when directly appropriate.

Example:

```text
Application serialization
    may use
canonical Identifier public type.
```

Prefer Platform contracts when business capability already exists.

---

# 30. Application-to-Foundation Rule

Allowed for technical application concerns.

Examples:

```text
Configuration

Observability

Feature Flags

application health.
```

---

# 31. Application-to-Database Rule

Direct database access for owned Application configuration may be allowed if such data genuinely belongs to Application.

Direct business mutation is forbidden.

Bad:

```text
Admin Controller
    updates Entity table.
```

---

# 32. Application-to-Provider Rule

Applications should not directly invoke concrete external Providers for owned business capabilities.

Bad:

```text
Admin backend
    directly calls AI SDK.
```

Preferred:

```text
Admin
    → AI / Creator
    → AI Provider Adapter.
```

---

# 33. Application-to-Application Rule

Applications should not depend on each other's internal implementation.

Bad:

```text
Public Web
    imports
Admin app service.
```

Shared behavior belongs in an appropriate shared capability.

---

# 34. Universe Dependency Rules

Universes may depend on:

```text
Platform Public Contracts

Platform extension Contracts

Kernel public semantic Contracts

Universe-local Domain code.
```

---

# 35. Universe Forbidden Dependencies

Universes must not normally depend on:

```text
Foundation implementation

Database client

Cache provider

Queue provider

Storage provider

Email provider

AI provider SDK

Search provider SDK

another Universe's internals.
```

---

# 36. Universe-to-Platform Rule

Expected:

```text
Anime
    → Knowledge

History
    → Knowledge

Anime
    → Media

History
    → Discovery.
```

---

# 37. Universe-to-Kernel Rule

Allowed for domain definitions.

Examples:

```text
History
    → Taxonomy Contract

Anime
    → Relationships Contract

History
    → Metadata Definition Contract.
```

---

# 38. Universe-to-Foundation Rule

Default:

```text
FORBIDDEN.
```

A Universe is domain specialization, not infrastructure ownership.

---

# 39. Universe-to-Provider Rule

Strictly forbidden by default.

Bad:

```text
Anime
    imports OpenAI SDK.

History
    imports Elasticsearch client.
```

---

# 40. Universe-to-Universe Rule

Default:

```text
AVOID / FORBIDDEN FOR INTERNAL DEPENDENCY.
```

Cross-Universe interactions should use shared Platform Resources and Contracts.

---

# 41. Universe Reference Rule

A Universe may refer to Resources associated with another Universe through canonical Resource identifiers and shared Platform semantics.

This is not a source-code dependency on the other Universe implementation.

---

# 42. Universe Registration Rule

A Universe supplies definitions to a shared capability through a Contract defined by the shared capability.

Conceptually:

```text
Knowledge Extension Contract
       ▲
       │
Anime definition implements/supplies
```

Not:

```text
Knowledge
    imports Anime.
```

---

# 43. Universe Discovery Rule

Shared core code must not scan high-level Universe directories in a way that creates implicit source ownership inversion.

Runtime registration should remain explicit enough to understand.

---

# 44. Universe Condition Rule

Shared Platform code must not accumulate named conditions.

Bad:

```text
if Anime ...
if History ...
if Nature ...
```

Preferred:

```text
configuration

definitions

policy

strategy

extension.
```

---

# 45. Platform Dependency Rules

Platforms may depend on:

```text
Kernel public Contracts

Foundations

selected peer Platform public Contracts

provider Ports owned by themselves.
```

---

# 46. Platform Forbidden Dependencies

Platforms must not depend on:

```text
Applications

named Universe implementations

peer Platform internals

concrete provider implementations supplied at runtime.
```

---

# 47. Platform-to-Kernel Rule

Expected when semantics are reused.

Examples:

```text
Knowledge
    → Taxonomy

Knowledge
    → Relationships

Identity & Access
    → Audit.
```

---

# 48. Platform-to-Foundation Rule

Expected for technical infrastructure.

Examples:

```text
Media
    → Storage

AI / Creator
    → Queue

Identity & Access
    → Database.
```

---

# 49. Platform-to-Universe Rule

Default:

```text
FORBIDDEN.
```

A shared Platform must operate independently from any named Universe.

---

# 50. Platform-to-Application Rule

Strictly forbidden.

Domain logic must not depend on delivery surfaces.

---

# 51. Peer Platform Dependency Rule

Peer Platform dependencies are allowed only when:

```text
the dependency is semantically real;

the target exposes a public Contract;

the dependency remains acyclic;

the caller does not mutate target persistence directly;

the relationship is documented.
```

---

# 52. Valid Peer Platform Example

```text
Composition / CMS
    → Knowledge Reference Contract.
```

Composition needs canonical Knowledge references.

---

# 53. Valid Peer Platform Example — AI

```text
AI / Creator
    → Knowledge Read Contract.
```

AI may need authorized Knowledge context.

---

# 54. Valid Peer Platform Example — User/Media

```text
User
    → Media Asset Reference Contract.
```

If User validates avatar Asset references.

---

# 55. Invalid Peer Platform Example

```text
Engagement
    → Knowledge EntityRepository.
```

Engagement should use a Resource reference or public Contract.

---

# 56. Peer Dependency Minimality Rule

Depend only on what is needed.

If Engagement only needs:

```text
Resource ID
```

it should not depend on the full Knowledge Platform API.

---

# 57. Reference Contract Rule

Platforms should consider narrow stable reference Contracts where many consumers need only:

```text
identity

type

display label

existence

basic lifecycle.
```

---

# 58. Platform Cycle Rule

Platform dependency cycles are forbidden by default.

Example:

```text
Knowledge → Media → Knowledge
```

must be redesigned before implementation proceeds.

---

# 59. Platform Cycle Resolution Order

When a cycle appears, evaluate in this order:

```text
1. Can one side use a stable Resource ID only?

2. Can one side consume an Event?

3. Can Application composition resolve the read?

4. Is one responsibility owned by the wrong Platform?

5. Is a narrow shared semantic capability justified in Kernel?

6. Is a dedicated orchestration capability required?
```

---

# 60. Framework Cycle Workaround Rule

Framework mechanisms such as:

```text
forwardRef

lazy injection

runtime proxies
```

must not be used as the primary solution to an architectural cycle.

---

# 61. Kernel Dependency Rules

Kernel capabilities may depend on:

```text
Foundations

selected other Kernel public Contracts.
```

---

# 62. Kernel Forbidden Dependencies

Kernel must not depend on:

```text
Platforms

Universes

Applications.
```

---

# 63. Kernel-to-Foundation Rule

Allowed and expected when required.

Examples:

```text
Audit
    → Database

Events
    → Observability.
```

---

# 64. Kernel-to-Kernel Rule

Allowed only where semantics are naturally composed.

Example:

```text
Relationships
    → Identifiers.
```

---

# 65. Kernel Cycle Rule

Kernel cycles are forbidden by default.

Because Kernel has broad reuse, cycles here create large architectural impact.

---

# 66. Kernel Promotion Rule

Do not solve Platform dependency issues by moving business logic into Kernel unless the concept is genuinely:

```text
cross-Platform;

stable;

semantically shared;

Universe-neutral.
```

---

# 67. Kernel Internal Leakage Rule

Platforms may consume Kernel Public Contracts.

They must not import private Kernel persistence implementation.

---

# 68. Foundation Dependency Rules

Foundations may depend on:

```text
other Foundations where technically justified;

external provider Ports/SDKs near integration boundaries.
```

---

# 69. Foundation Forbidden Dependencies

Foundations must not depend on:

```text
Kernel business semantics

Platforms

Universes

Applications.
```

---

# 70. Foundation-to-Foundation Rule

Allowed where technically natural.

Examples:

```text
Migration → Database

Seed → Database

Storage → Configuration

Email → Observability.
```

---

# 71. Foundation Cycle Rule

Foundation cycles are forbidden by default.

Startup infrastructure should have a comprehensible dependency order.

---

# 72. Configuration Dependency Rule

Configuration should sit close to the bottom of the runtime dependency graph.

Configuration must not require business Platforms to initialize itself.

---

# 73. Observability Dependency Rule

Observability is intentionally cross-cutting and may be consumed broadly.

Observability must remain technically low-level and Domain-neutral.

---

# 74. Database Dependency Rule

Database Foundation must not import Domain models merely to provide connection infrastructure.

Domain persistence implementations depend on Database Foundation.

---

# 75. Repository Foundation Rule

Repository Infrastructure must not expose arbitrary universal CRUD over every Domain table.

Bad:

```text
GenericRepository.updateAnyTable(...)
```

---

# 76. Storage Dependency Rule

Storage remains independent from Media semantics.

Bad:

```text
Storage.saveAnimeImage(...)
```

Preferred:

```text
Storage.store(...)
```

with Media owning Asset meaning.

---

# 77. Queue Dependency Rule

Queue knows transport mechanics.

It must not know every Platform Job type through hard-coded imports.

Job registration/execution should preserve owner direction.

---

# 78. Scheduler Dependency Rule

Scheduler triggers supported commands/jobs.

It must not own Platform business operations.

---

# 79. Email Dependency Rule

Email Foundation delivers messages.

It must not depend on Identity & Access internals to determine verification rules.

---

# 80. Cache Dependency Rule

Cache Foundation must remain generic.

Business cache semantics belong to consumers.

---

# 81. Feature Flag Dependency Rule

Feature Flag mechanics remain Foundation-owned.

Business meaning remains with the feature owner.

---

# 82. Migration Registration Rule

Migration Foundation defines migration execution contracts.

Owned migrations register into the framework.

Foundation must not import every Platform directly.

---

# 83. Seed Registration Rule

Seed Foundation follows the same direction.

Seed definitions depend on Seed Contracts, not the reverse.

---

# 84. Integration Edge Rule

Concrete Adapters belong at the integration edge.

They may depend on:

```text
the AI World Contract they implement;

external SDK;

provider-specific configuration;

technical observability.
```

---

# 85. Core-to-Adapter Rule

Core business code must not depend directly on concrete Adapters.

Bad:

```text
MediaService
    depends on
S3StorageAdapter.
```

Preferred:

```text
Media
    → Storage Contract

S3StorageAdapter
    implements Storage Contract.
```

---

# 86. Adapter-to-Contract Rule

Expected:

```text
Concrete Adapter
    → Contract.
```

This is dependency inversion.

---

# 87. Adapter-to-Provider Rule

Expected:

```text
Adapter
    → External SDK/Provider.
```

Provider-specific logic must stay near this edge.

---

# 88. Provider SDK Isolation Rule

Provider SDK imports must not spread into unrelated Domain areas.

Examples to isolate:

```text
AI SDK

cloud storage SDK

email SDK

search SDK

queue SDK

cloud SDK.
```

---

# 89. Provider Type Leakage Rule

Provider-specific response/request types must not become public Domain Contracts by default.

Bad:

```text
Knowledge returns SearchVendorHit.
```

Preferred:

```text
Discovery returns AI World SearchResult.
```

---

# 90. Provider Error Leakage Rule

Provider-specific errors should normally be translated into owned AI World errors.

Example:

```text
ProviderRateLimitException
```

may become:

```text
AIProviderUnavailable
```

or another stable AI World error category.

---

# 91. Provider Identifier Rule

Provider identifiers must remain mappings.

Bad:

```text
Entity ID = Search Provider Document ID.
```

Preferred:

```text
Entity ID
    canonical

Search Document ID
    derived/provider mapping.
```

---

# 92. Composition Root Rule

Composition Roots are controlled exceptions.

They may depend on:

```text
Applications

Universes

Platforms

Kernel

Foundations

Adapters

configuration.
```

because runtime wiring is their responsibility.

---

# 93. Composition Root Restriction

Composition Root must not contain:

```text
business validation

authorization policy

Domain workflows

canonical mutation logic.
```

---

# 94. Runtime Wiring Rule

The Composition Root selects concrete implementations.

Example:

```text
Storage Contract
    ← S3 Adapter

AI Provider Contract
    ← Provider A Adapter.
```

---

# 95. Dependency Inversion Rule

When stable business logic requires replaceable implementation:

```text
stable side defines the Contract;

variable side implements it.
```

---

# 96. Port Ownership Rule

A Port should normally be owned by the Capability that needs the external capability.

Example:

```text
AI / Creator
    owns
AI Provider Port.
```

---

# 97. Adapter Placement Rule

Concrete Adapter source should be located close enough to its owner that ownership remains obvious.

Avoid one global:

```text
integrations/
```

dumping ground unless its internal structure preserves capability ownership.

---

# 98. Synchronous Communication Rule

Use synchronous interaction when:

```text
the caller requires a result now;

the operation belongs to one immediate use case;

failure must immediately affect caller outcome;

stronger consistency is required.
```

---

# 99. Synchronous Public Contract Rule

Cross-Platform synchronous calls must use public Contracts.

---

# 100. Synchronous Chain Rule

Avoid deep dependency chains.

Warning example:

```text
Application
    → A
    → B
    → C
    → D
    → Provider.
```

Review:

```text
latency

failure propagation

ownership

test complexity.
```

---

# 101. Asynchronous Communication Rule

Use Events or Jobs when:

```text
work can happen later;

producer should not wait;

multiple independent consumers may react;

work is long-running;

eventual consistency is acceptable.
```

---

# 102. Event Rule

An Event describes something that already happened.

Preferred naming semantics:

```text
EntityPublished

AssetProcessed

UserRegistered.
```

---

# 103. Command Rule

A Command asks for something to happen.

Examples:

```text
PublishEntity

ProcessAsset

GenerateContent.
```

Commands and Events must not be conflated.

---

# 104. Query Rule

A Query asks for information.

It should not intentionally mutate canonical state.

---

# 105. Event Ownership Rule

The producer owns the Event's business semantics.

Events Kernel owns shared event mechanics.

---

# 106. Event Consumer Rule

A producer must not depend on Event consumers.

Bad:

```text
Knowledge publishes EntityPublished
and imports Discovery handler to guarantee consumption.
```

---

# 107. Event Handler Rule

Consumers own their handlers and resulting derived state.

---

# 108. Event Publication Timing Rule

Events representing canonical state changes should normally be emitted only when the canonical mutation is considered successful.

Exact transactional semantics are deferred.

---

# 109. Event Reliability Rule

When missed Events would create unacceptable divergence, stronger delivery mechanisms must be introduced.

Potential future mechanisms:

```text
Transactional Outbox

broker persistence

reconciliation.
```

---

# 110. Event Reliability Is Demand-Driven

Do not introduce enterprise messaging infrastructure solely because Events exist.

Initial Events may be in-process if requirements permit.

---

# 111. Eventual Consistency Rule

Derived systems may be eventually consistent.

Examples:

```text
Search

Analytics

Recommendations

Cache invalidation

some notifications.
```

---

# 112. Canonical Consistency Rule

Core invariants must remain enforced by canonical owners.

Do not depend on eventually-consistent derived systems to enforce critical business rules unless explicitly designed.

---

# 113. Job Rule

A Job belongs to the Capability defining the work.

Queue Foundation transports the Job.

Worker Application executes it.

---

# 114. Job Dependency Example

```text
Media
    defines
ProcessAsset

Queue
    transports

Worker
    invokes
Media processing Contract.
```

---

# 115. Job Payload Rule

Job payloads should contain stable information necessary to execute work.

Avoid passing:

```text
ORM entities

request objects

provider clients

large mutable object graphs.
```

---

# 116. Job Identifier Rule

Prefer stable Resource identifiers and Job-specific immutable inputs.

---

# 117. Job Retry Rule

Retries must respect idempotency.

A Job must not be assumed safe to retry merely because Queue supports retry.

---

# 118. Scheduler Rule

Scheduler triggers owned operations.

It must not directly modify owner persistence.

---

# 119. Webhook Rule

External Webhooks enter through an Application/integration boundary.

They must not directly mutate internal tables.

---

# 120. Webhook Processing Direction

Preferred:

```text
External Provider
        ↓
Webhook Boundary
        ↓
Verification
        ↓
Owned Capability Command
        ↓
Canonical mutation.
```

---

# 121. Data Ownership Dependency Rule

Cross-Capability dependency must respect the canonical owner.

If:

```text
Knowledge owns Entity
```

then:

```text
Discovery

CMS

AI

Engagement
```

must not directly mutate Entity persistence.

---

# 122. Cross-Owner Mutation Rule

Default:

```text
FORBIDDEN.
```

Use:

```text
Owner Command/Application Contract.
```

---

# 123. Cross-Owner Read Rule

Reads should use:

```text
Public Query Contract

Reference Contract

Projection

Application composition.
```

---

# 124. Direct Table Access Rule

Direct access to another Capability's tables is forbidden as a normal integration mechanism.

---

# 125. Shared ORM Client Rule

A shared ORM client may technically access all models.

That does not authorize every capability to use every model.

Logical ownership still applies.

---

# 126. ORM Model Import Rule

A Platform must not import another Platform's persistence model as its Domain Contract.

---

# 127. Foreign Key Rule

Cross-owner foreign keys may be permitted for physical integrity.

They do not grant mutation authority.

---

# 128. Cascade Rule

Cross-owner destructive database cascades require explicit review.

Avoid automatic cascading deletion across independent canonical owners.

---

# 129. Cross-Owner Join Rule

Read-only cross-owner joins may be acceptable for specialized query/projection needs.

They must not become a backdoor for cross-owner mutation.

---

# 130. Projection Rule

A projection has one derived-state owner and one or more canonical source owners.

---

# 131. Projection Rebuild Rule

Where practical, derived projections should be rebuildable from canonical state.

---

# 132. Search Projection Rule

Discovery owns Search projections.

Knowledge remains canonical owner of Knowledge Resources.

---

# 133. Cache Projection Rule

Cache remains derived unless explicitly designed as canonical storage for a particular infrastructure concept.

---

# 134. Analytics Projection Rule

Analytics state is derived by default.

---

# 135. Snapshot Rule

A snapshot must be clearly modeled as a snapshot.

It must not silently become a second editable canonical copy.

---

# 136. Reference Rule

A capability may store a stable ID referencing another owner.

Example:

```text
Favorite
    contains
Resource ID.
```

Engagement owns Favorite.

Resource owner owns Resource.

---

# 137. Reference Validation Rule

Whether a reference must be validated synchronously, asynchronously, or eventually depends on the business invariant.

---

# 138. Reference Lifecycle Rule

Owners of references must decide what happens when the target Resource becomes:

```text
archived

deleted

private

unavailable.
```

---

# 139. No Universal Resource Mutation Rule

A generic Resource reference must not automatically enable generic mutation of the referenced Resource.

---

# 140. Identity & Access Dependency Rules

Identity & Access may depend on:

```text
Identifiers as needed

Namespace as needed

Audit

Database

Email

Configuration

Observability.
```

---

# 141. Identity & Access Forbidden Dependencies

Identity & Access must not depend on:

```text
Knowledge

Media business internals

Discovery

CMS

Engagement

Anime

History.
```

---

# 142. Authorization Contract Rule

Other Platforms may depend on Identity & Access authorization Contracts.

Identity & Access must not import those Platforms' internal implementations.

---

# 143. Business Action Registration Rule

A Platform may define stable Action/Permission descriptors consumed by Identity & Access without creating reverse implementation dependency.

The exact registration architecture is deferred.

---

# 144. User Dependency Rules

User may depend on:

```text
Identity & Access public identity linkage

Media reference Contract if avatar validation is needed

Localization later

Database

Events/Audit as required.
```

---

# 145. User Forbidden Dependency

User must not depend on:

```text
Engagement internals
```

merely because Engagement data belongs to Users.

---

# 146. Knowledge Dependency Rules

Knowledge may depend on:

```text
Identifiers

Taxonomy

Metadata when needed

Relationships

Events

Audit

Workflow when needed

Policy when needed

Database

Media public references where justified.
```

---

# 147. Knowledge Forbidden Dependencies

Knowledge must not depend on:

```text
Discovery internals

CMS internals

AI Provider SDKs

named Universes.
```

---

# 148. Knowledge-to-AI Rule

Knowledge may request AI capabilities through:

```text
AI / Creator public Contract
```

if such synchronous dependency is accepted.

Alternative flows may originate from AI / Creator itself.

The direction must avoid a cycle.

---

# 149. Knowledge-AI Cycle Warning

Potential cycle:

```text
Knowledge → AI
AI → Knowledge
```

must be carefully avoided.

Preferred patterns may include:

```text
Application/creator orchestration;

AI reads Knowledge but Knowledge does not depend on AI;

or a one-direction public capability based on actual use case.
```

---

# 150. Media Dependency Rules

Media may depend on:

```text
Identifiers

Events

Audit where needed

Database

Storage

Queue when needed

Observability.
```

---

# 151. Media Forbidden Dependencies

Media must not depend on:

```text
Knowledge internals

CMS internals

Anime

History

concrete cloud storage from Domain code.
```

---

# 152. Discovery Dependency Rules

Discovery may depend on:

```text
Knowledge public Contracts

Media public Contracts where required

Events

Cache optionally

Search Provider Port/Adapter

Observability.
```

---

# 153. Discovery Forbidden Dependencies

Discovery must not mutate:

```text
Knowledge

Media

User
```

canonical state merely to index or rank it.

---

# 154. AI / Creator Dependency Rules

AI / Creator may depend on:

```text
Identity & Access

Policy

Knowledge public read Contracts

Media public Contracts

Queue

Database

Events

Audit

Observability

AI Provider Ports.
```

---

# 155. AI / Creator Forbidden Dependencies

AI / Creator must not depend on:

```text
named Universe implementation internals

Knowledge private repositories

Media private repositories

concrete Provider SDK outside adapter area.
```

---

# 156. Composition / CMS Dependency Rules

Composition may depend on:

```text
Knowledge public Contracts

Media public Contracts

Workflow

Localization

AI / Creator public Contracts when needed

Database

Events.
```

---

# 157. Composition Forbidden Dependencies

Composition must not:

```text
mutate Knowledge tables directly;

mutate Media tables directly;

depend on Application UI internals.
```

---

# 158. Engagement Dependency Rules

Engagement may depend on:

```text
User public Contract

stable Resource references

Events

Database

Email through Notification behavior when needed.
```

---

# 159. Engagement Forbidden Dependencies

Engagement must not depend deeply on every Resource owner merely because it can favorite those Resources.

Prefer generic stable Resource references where semantics allow.

---

# 160. Operations Dependency Rules

Operations may consume:

```text
Observability

Audit queries

provider health interfaces

usage projections

owner repair Commands.
```

---

# 161. Operations Forbidden Dependencies

Operations must not directly modify unrelated owner persistence for routine operational actions.

---

# 162. Kernel Specific Dependency Rules

Kernel capabilities should remain independently understandable.

A Kernel capability should depend on another Kernel capability only when:

```text
the semantic relationship is stable;

the dependency reduces duplication;

the dependency does not create a cycle.
```

---

# 163. Identifiers Dependency Rule

Identifiers should depend on minimal technical infrastructure.

It should not require higher semantic capabilities.

---

# 164. Namespace Dependency Rule

Namespace should remain low-level and broadly reusable.

---

# 165. Taxonomy Dependency Rule

Taxonomy may use:

```text
Identifiers

Namespace

Database

Localization later.
```

It must not depend on Knowledge merely because Knowledge is a primary consumer.

---

# 166. Metadata Dependency Rule

Metadata may use:

```text
Identifiers

Namespace

Database

Versioning later.
```

It must not depend on named Platforms that consume Metadata.

---

# 167. Relationships Dependency Rule

Relationships may use:

```text
Identifiers

Namespace

Database

Events.
```

It must not depend on Knowledge internals.

---

# 168. Events Dependency Rule

Events should remain broadly reusable and low-level.

Event mechanism must not depend on business Event producers.

---

# 169. Audit Dependency Rule

Audit may use:

```text
Identifiers

Database

Observability.
```

It must not depend on individual Platforms to function.

---

# 170. Workflow Dependency Rule

Workflow may depend on:

```text
Identifiers

Events

Audit

Database

Policy where justified.
```

It must not import target Platform repositories.

---

# 171. Policy Dependency Rule

Policy should depend on stable context/semantic inputs rather than target business implementations.

---

# 172. Localization Dependency Rule

Localization should remain independent from specific Content owners.

---

# 173. Versioning Dependency Rule

Versioning should provide shared mechanics without owning target Resources.

---

# 174. Dependency on Utility Code

Small technical utilities may be shared when:

```text
stateless;

Domain-neutral;

cohesive;

clearly named.
```

---

# 175. Shared Utility Restriction

Utilities must not accumulate:

```text
business rules;

database access;

authorization;

provider integration;

Domain orchestration.
```

---

# 176. Common Folder Rule

Avoid generic ownership-free folders such as:

```text
common

shared

helpers

utils
```

becoming cross-cutting dumping grounds.

---

# 177. Shared Contracts Rule

A shared contracts package may exist if Repository Architecture justifies it.

Every Contract inside it must still have an owner.

---

# 178. Shared Types Rule

Do not create one global:

```text
types
```

package containing unrelated Domain types from every capability.

---

# 179. Shared Constants Rule

Constants should live with the capability that gives them meaning.

---

# 180. Error Dependency Rules

Capabilities should expose stable owned error categories where consumers need them.

Internal infrastructure exceptions should not leak unnecessarily.

---

# 181. Error Translation Rule

Translate errors at boundaries.

Conceptually:

```text
Provider Error
    ↓
Capability Error
    ↓
Application/API Error.
```

---

# 182. Framework Error Rule

Framework-specific exceptions should remain near framework boundaries.

---

# 183. HTTP Dependency Rule

Domain/Platform logic should not depend on:

```text
HTTP Request

HTTP Response

HTTP status codes
```

as its primary semantic model.

Applications translate transport concerns.

---

# 184. UI Dependency Rule

Backend Domain logic must not depend on:

```text
React components

routes

screen state

CSS

frontend framework primitives.
```

---

# 185. Environment Variable Rule

Business code must not directly read:

```text
process.env
```

throughout the codebase.

Configuration Foundation owns runtime configuration access.

---

# 186. Logger Dependency Rule

Business code should use approved Observability interfaces rather than constructing arbitrary provider loggers independently.

---

# 187. Clock Dependency Rule

Where time affects Domain behavior significantly, the relevant capability should consider a testable time abstraction rather than scattering uncontrolled current-time access.

Do not introduce one until real testability requirements justify it.

---

# 188. Randomness Dependency Rule

Where randomness affects important Domain behavior, it should be controlled enough to remain testable.

This is a local engineering concern unless it becomes broadly reusable.

---

# 189. File System Dependency Rule

Domain logic should not directly depend on local filesystem behavior when Storage is the owned abstraction for durable binary content.

Development tooling may legitimately use filesystem directly.

---

# 190. Network Dependency Rule

Network calls belong at explicit integration boundaries.

Business logic should not make arbitrary HTTP calls to external services.

---

# 191. External API Client Rule

External API clients must be owned by the integrating capability.

---

# 192. External Source Integration Rule

Knowledge import from an external source should flow:

```text
External Source Adapter
        ↓
Knowledge Import Contract
        ↓
Validation
        ↓
Canonical Knowledge.
```

---

# 193. No External Database Integration Shortcut

External systems should not generally write directly into AI World's canonical database.

---

# 194. Public API Consumer Rule

External consumers may depend only on intentionally public external Contracts.

They must not depend on:

```text
database schema

internal event schema

repository structure

provider mapping.
```

---

# 195. External Event Rule

Only Events explicitly designated as Integration Events may become supported external Event Contracts.

---

# 196. Internal Event Freedom

Internal Events may evolve more freely than external Integration Events, subject to their consumer impact.

---

# 197. Versioning Dependency Rule

Versioning is applied according to Contract stability.

Do not version every internal method mechanically.

---

# 198. Compatibility Rule

The broader and more independent the consumer, the stronger the compatibility requirement.

---

# 199. Cross-Package Dependency Rule

When repository packages are introduced, declared package dependencies must reflect architectural dependency rules.

---

# 200. Package Boundary Rule

A package must not import another package's private filesystem path.

Preferred:

```text
package public entrypoint.
```

---

# 201. Deep Import Rule

Deep imports into another architectural package's internals are forbidden by default.

Bad:

```text
@ai-world/knowledge/src/internal/repositories/entity
```

Preferred conceptual form:

```text
@ai-world/knowledge
```

or an explicit public subpath.

Exact package naming is deferred.

---

# 202. Public Subpath Rule

A package may expose intentional public subpaths when different Contracts deserve separate surfaces.

Example conceptual:

```text
knowledge/contracts

knowledge/events

knowledge/testing
```

if Repository Architecture adopts such a structure.

---

# 203. Testing Import Rule

Tests may import internal code belonging to the same capability.

Cross-capability tests should prefer public Contracts.

---

# 204. Test Helper Rule

Testing support may expose dedicated test utilities.

Production code must never depend on testing packages.

---

# 205. Fixture Dependency Rule

Fixtures belong to test support and may depend on public/domain builders.

Production source must not depend on Fixtures.

---

# 206. Mock Dependency Rule

Mocks should not become production dependencies.

---

# 207. Development Tool Dependency Rule

Development/CLI tools may depend on several capabilities for orchestration.

This is a controlled tooling exception similar to Composition Root.

---

# 208. CLI Business Rule

CLI commands must invoke owning Capability operations rather than duplicate business logic.

---

# 209. Migration Tool Exception

Migration tooling may access persistence-level interfaces needed to evolve data.

Semantic migrations remain owned by the data-owning Capability.

---

# 210. Seed Tool Exception

Seed tooling may invoke multiple seed definitions.

It must not become a universal business writer.

---

# 211. Architecture Enforcement Rule

Where practical, dependency rules should eventually be enforced automatically.

Potential enforcement categories:

```text
module boundaries

package dependencies

import path restrictions

lint rules

architecture tests

CI checks.
```

---

# 212. Enforcement Principle

Architecture enforcement should focus on high-value rules.

Avoid complex tooling that is harder to maintain than the violations it prevents.

---

# 213. Initial Enforcement Candidates

High-value automated checks include:

```text
Foundation cannot import Platform.

Foundation cannot import Universe.

Kernel cannot import Platform.

Kernel cannot import Universe.

Platform cannot import Universe.

Universe cannot import Foundation implementation.

Universe cannot import provider SDK.

Application cannot import Platform internals.

Platform cannot deep-import peer Platform internals.

Production code cannot import test helpers.
```

---

# 214. Provider SDK Enforcement Candidate

External SDKs may eventually be restricted to approved directories/packages.

---

# 215. Database Access Enforcement Candidate

ORM/database imports may be restricted to:

```text
Foundation

owned persistence implementations

migration tooling

approved infrastructure.
```

---

# 216. Architecture Test Candidate — Universe Neutrality

Shared Platform source should not contain imports from:

```text
anime

history

future Universe implementation packages.
```

---

# 217. Architecture Test Candidate — Provider Isolation

Domain code should not import provider package names outside integration areas.

---

# 218. Architecture Test Candidate — Public Entrypoints

Cross-package imports may be checked to ensure public entrypoint use.

---

# 219. Architecture Test Candidate — Cycle Detection

Package/module dependency graph should eventually be checked for cycles.

---

# 220. Cycle Policy

Architectural cycles are forbidden unless explicitly reviewed and documented as an exceptional temporary condition.

---

# 221. Circular Import vs Architectural Cycle

A language-level circular import is a symptom.

An architectural cycle can exist even if framework techniques hide the circular import.

Both matter.

---

# 222. Cycle Resolution Priority

Resolve semantic ownership before applying framework-level fixes.

---

# 223. Allowed Internal Cycles

Inside a tightly owned implementation boundary, local cyclic collaboration may occasionally be technically manageable.

Even there, cycles should be reviewed because they often indicate poor cohesion.

---

# 224. Architecture Exception Process

An intentional rule exception should document:

```text
rule being violated;

reason;

scope;

risk;

alternative considered;

expected lifetime;

removal plan if temporary.
```

---

# 225. ADR Requirement for Exceptions

A small temporary implementation exception may not require an ADR.

A structural exception affecting long-term architecture usually should.

---

# 226. Exception Repetition Rule

Repeated exceptions indicate:

```text
the rule is wrong;
or
the architecture is wrong.
```

Review instead of normalizing repeated violations.

---

# 227. Temporary Violation Rule

Temporary architecture debt must be visible.

Do not hide it behind vague TODO comments only.

---

# 228. Technical Debt Registration

Significant dependency violations should be recorded in the project's technical debt tracking when accepted temporarily.

---

# 229. Dependency Review During Code Review

Code review should ask:

```text
Does this import cross an ownership boundary?

Is this the public Contract?

Does this create a new peer dependency?

Does it create a cycle?

Is provider technology leaking?

Is a Universe-specific assumption entering shared code?

Is canonical data ownership being bypassed?
```

---

# 230. Dependency Review During Architecture Review

For major changes ask:

```text
What new dependency is introduced?

Why is it required?

What direction does it point?

What Contract mediates it?

Could Resource reference suffice?

Could an Event suffice?

Could Application composition suffice?

Does it create operational coupling?

Does it create deployment coupling?
```

---

# 231. Dependency Budget Principle

Every dependency has cost.

Do not introduce cross-capability dependency merely because calling another service is easy.

---

# 232. Dependency Stability Principle

Depending on a highly stable narrow Contract is safer than depending on a broad rapidly changing internal model.

---

# 233. Dependency Surface Principle

Prefer:

```text
small public surface
```

over:

```text
large convenience facade exposing everything.
```

---

# 234. Dependency Ownership Principle

The target capability decides what it exposes.

Consumers must not define public access by reaching into target internals.

---

# 235. Dependency Naming Principle

Public Contracts should use canonical AI World terminology.

Avoid names derived from current technology.

---

# 236. Dependency Technology Neutrality

Example bad public Contract:

```text
PrismaEntityRepository
```

if consumers need Knowledge semantics.

Better conceptual Contract:

```text
EntityRepository
```

inside Knowledge persistence or:

```text
KnowledgeQuery
```

for external consumption.

---

# 237. Repository Dependency Rule

Repositories are internal by default.

Cross-Platform dependency on another Platform's Repository is forbidden.

---

# 238. Domain Service Dependency Rule

Internal Domain Services should remain inside their ownership boundary unless intentionally promoted to public application capability.

---

# 239. Application Service Dependency Rule

Application Services may form the synchronous public surface of a Platform where appropriate.

---

# 240. Domain Model Dependency Rule

Cross-capability consumers should not automatically import the entire target Domain Model.

Use a public Contract appropriate to the interaction.

---

# 241. Value Object Sharing Rule

A Value Object may be shared only if its semantics are truly shared.

Do not reuse types solely because their structure is identical.

---

# 242. Example — EmailAddress

If:

```text
EmailAddress
```

has one stable semantic definition reused by Identity and User, a shared semantic primitive may be justified.

If semantics differ, separate types may remain correct.

---

# 243. Structural Equality Is Not Semantic Equality

Two types both shaped like:

```text
{ id: string }
```

do not imply one shared Domain type.

---

# 244. Generic Primitive Rule

Primitive wrappers such as:

```text
Identifier
```

may be shared at Kernel level when semantics are truly universal.

---

# 245. Cross-Universe Dependency Rule

Cross-Universe relationships should use Platform-owned Resource/Relationship capabilities.

Do not import domain implementation just to create cross-world linkage.

---

# 246. Universe Extensibility Dependency Rule

Universe Extensions depend on stable extension Contracts.

Core Platform must not depend on concrete extension implementation.

---

# 247. Extension Capability Access Rule

An Extension receives only approved capabilities.

Avoid giving every Extension:

```text
raw ORM

raw database

all providers

all secrets

all other Platform internals.
```

---

# 248. Extension Context Rule

Where needed, Extensions may receive:

```text
Universe Context

Actor Context

Resource references

approved Platform services.
```

---

# 249. Extension Event Rule

Extensions may publish/consume Events only through approved Event Contracts.

---

# 250. Extension Provider Rule

Universe Extensions must not directly instantiate provider SDKs by default.

If specialized provider behavior is required, integrate through the owning Platform extension/provider architecture.

---

# 251. Configuration Dependency Rule

Configuration may control behavior.

Configuration must not create hidden dependencies through arbitrary string references to internal implementation classes.

---

# 252. Registry Dependency Rule

Registries must expose controlled lookup based on stable keys/types.

A Registry must not become a global Service Locator.

---

# 253. Strategy Dependency Rule

Strategies implement a defined behavior variation.

The consumer depends on the Strategy Contract, not concrete strategy classes scattered through business logic.

---

# 254. Plugin Dependency Rule

Public Plugin architecture is not currently active.

No code should assume arbitrary third-party executable extensions exist.

---

# 255. Future Plugin Security Rule

If Plugins are introduced later, they will require a stronger trust and dependency model than first-party Extensions.

---

# 256. Data Migration Dependency Rule

A data migration may use owner internals because it is part of the owner's persistence evolution.

Other capabilities must not use migrations as integration mechanisms.

---

# 257. Event Replay Rule

If Event replay is introduced later, consumers must own replay idempotency and projection rebuild behavior.

---

# 258. Reconciliation Dependency Rule

Reconciliation processes should compare:

```text
canonical owner state

vs

derived/external state.
```

The derived system should converge toward canonical ownership unless another contract explicitly defines otherwise.

---

# 259. External Provider Reconciliation Rule

Example:

```text
Media
    canonical Asset state

Storage Provider
    physical object state
```

Reconciliation should repair differences according to Media/Storage ownership rules.

---

# 260. Search Reconciliation Rule

Discovery owns:

```text
index reconciliation.
```

Knowledge does not manage search engine internals.

---

# 261. AI Provider Reconciliation Rule

AI / Creator owns reconciliation of:

```text
provider request IDs

generation status

provider callbacks
```

where asynchronous Provider behavior exists.

---

# 262. Email Provider Callback Rule

Email provider events must be translated through Email/owning business semantics rather than directly altering unrelated User state.

---

# 263. Security Boundary Dependency Rule

Authorization must happen at trusted owner boundaries.

Callers may pre-check permissions for usability, but owner-side enforcement remains authoritative.

---

# 264. Permission Dependency Rule

Consumers may depend on stable Permission/Authorization Contracts.

They must not query authorization tables directly.

---

# 265. Policy Dependency Rule

Policy engines may evaluate Context.

Policies must not gain arbitrary access to every capability's internal persistence.

---

# 266. Audit Dependency Rule

Capabilities publish Audit information through Audit Contracts.

They must not write Audit tables directly unless that write belongs to Audit implementation itself.

---

# 267. Logging Dependency Rule

Logging is not an Event or Audit substitute.

Do not create business dependency on parsing logs.

---

# 268. Metrics Dependency Rule

Business workflows must not depend on external monitoring metrics as canonical state.

---

# 269. Health Dependency Rule

Health endpoints may aggregate dependency status.

Health aggregation must not create reverse Domain dependencies.

---

# 270. Feature Flag Dependency Rule

Feature flag checks should not spread so deeply that old and new Domain models coexist indefinitely.

Flags are temporary rollout controls.

---

# 271. Localization Dependency Rule

Platforms may consume Localization Contracts.

Localization must not import every Platform's content model.

---

# 272. Versioning Dependency Rule

Target capability owns versioned Resource semantics.

Versioning provides mechanics.

No reverse dependency is required.

---

# 273. Search Provider Dependency Rule

Discovery owns the Search provider boundary.

Knowledge must not import the Search provider SDK.

---

# 274. Storage Provider Dependency Rule

Storage Foundation owns the Storage provider boundary.

Media consumes Storage Contract.

---

# 275. Email Provider Dependency Rule

Email Foundation owns the Email provider boundary.

Identity & Access and Engagement consume Email capability.

---

# 276. AI Provider Dependency Rule

AI / Creator owns AI provider integration.

Other Platforms consume AI / Creator.

---

# 277. Queue Provider Dependency Rule

Queue Foundation owns queue technology integration.

Platforms define Jobs independently from provider transport.

---

# 278. Database Provider Dependency Rule

Database Foundation owns database connectivity technology.

Domain persistence uses Database infrastructure without making provider APIs public Domain Contracts.

---

# 279. Cloud Provider Dependency Rule

Cloud-provider-specific infrastructure should remain inside infrastructure/deployment or Adapter boundaries.

Cloud concepts must not become Domain concepts.

---

# 280. Dependency on Deployment Topology

Source architecture must not assume one permanent deployment topology.

Example:

```text
direct in-process call today
```

may later become:

```text
network call
```

if the Contract is extracted.

---

# 281. Network Transparency Warning

Do not pretend network calls are identical to local calls.

If a capability becomes distributed, architecture must account for:

```text
timeout

retry

serialization

partial failure

eventual consistency.
```

---

# 282. Service Extraction Dependency Rule

Physical extraction should preserve logical ownership.

Do not create network service boundaries that contradict Domain boundaries.

---

# 283. No Database Service Rule

Avoid a generic shared network:

```text
Database Service
```

through which every Platform performs arbitrary CRUD.

That centralizes infrastructure while destroying ownership.

---

# 284. No Repository Service Rule

Likewise avoid network-exposing generic Repository operations as the Platform architecture.

---

# 285. No Universal API Gateway Business Logic

An API Gateway or edge routing layer, if introduced, must not become the canonical business owner of multiple Domains.

---

# 286. BFF Rule

A future Backend-for-Frontend may compose responses for one Client.

It must not own the canonical data it aggregates.

---

# 287. Read Aggregator Rule

A dedicated read aggregation layer may depend on multiple public read Contracts.

It should remain read/composition focused.

---

# 288. Write Aggregator Warning

A generic write aggregator spanning many owners is dangerous.

Business coordination should belong to a meaningful use case or Workflow.

---

# 289. Architectural Dependency Graph

The architecture should trend toward a Directed Acyclic Graph where practical.

Conceptually:

```text
Applications
     ↓
Universes / Platforms
     ↓
Platforms
     ↓
Kernel
     ↓
Foundations
```

with controlled peer Platform edges.

---

# 290. Dependency Graph Review

The dependency graph should be reviewed periodically for:

```text
cycles

highly connected hubs

unnecessary broad dependencies

provider leakage

Universe leakage

shared dumping grounds.
```

---

# 291. Highly Connected Hub Warning

A package imported by almost everything deserves review.

It may be:

```text
legitimate low-level infrastructure

or

an architectural dumping ground.
```

---

# 292. God Contract Warning

Avoid public interfaces exposing:

```text
hundreds of unrelated methods.
```

Split by coherent capability/consumer need when useful.

---

# 293. God Event Warning

Avoid generic Events such as:

```text
ResourceChanged
```

for every Domain if meaningful semantic Events are required.

---

# 294. Generic Command Warning

Avoid:

```text
UpdateResource(type, id, data)
```

as a universal cross-Platform mutation API.

This destroys Domain ownership and type safety.

---

# 295. Generic Repository Warning

Avoid:

```text
Repository<Resource>
```

as the business abstraction for unrelated Resource types.

---

# 296. EAV Dependency Warning

Metadata must not become a dependency that every Domain uses to avoid defining meaningful typed models.

---

# 297. Generic Extension Warning

Avoid:

```text
Extension.execute(anyContext)
```

as the only extension Contract.

Extensions should expose meaningful typed behavior.

---

# 298. Dependency Simplicity Principle

Use the simplest dependency mechanism that preserves ownership.

Examples:

```text
stable ID
before
full API dependency;

direct Contract
before
Event when immediate result is required;

Event
before
hard coupling for independent reactions;

local implementation
before
shared framework if no real reuse.
```

---

# 299. Direct Call vs Event Decision

Use direct call when:

```text
caller needs result;

target failure must affect operation;

consistency is immediate.
```

Use Event when:

```text
reaction is independent;

result not immediately required;

multiple consumers may react.
```

---

# 300. Direct Call vs Reference Decision

If the consumer only needs to remember another Resource:

```text
store stable Resource reference.
```

Do not introduce synchronous dependency just to retain identity.

---

# 301. Direct Call vs Projection Decision

If repeated cross-owner reads create performance issues, consider a derived projection.

Do not bypass ownership by direct database reads without design.

---

# 302. Contract vs Shared Database Decision

Default:

```text
Contract.
```

Shared database access is infrastructure convenience, not integration architecture.

---

# 303. Contract vs Shared Domain Model Decision

Share a Domain type only when semantics are genuinely shared.

Otherwise expose a boundary Contract.

---

# 304. Dependency Health Metrics

Potential future architecture metrics include:

```text
cross-Platform dependency count;

cycle count;

deep import count;

provider SDK import locations;

Universe-to-shared-layer violations;

public surface size;

unused shared capabilities.
```

These are diagnostic metrics, not goals by themselves.

---

# 305. Dependency Change Review

A new cross-Platform dependency should be treated as more significant than a new internal dependency within one owner.

---

# 306. Dependency Removal

Removing unnecessary dependency is generally beneficial when it improves ownership and simplicity.

Do not preserve old dependency only because it existed historically.

---

# 307. Legacy Dependency Rule

The legacy AI World implementation is reference only.

The new architecture must not recreate historical dependency patterns merely for compatibility.

---

# 308. Greenfield Dependency Rule

Because the implementation is greenfield:

```text
we do not need backward source compatibility
with legacy architecture.
```

We do need:

```text
clear migration of useful lessons.
```

---

# 309. Technology Selection Dependency Requirement

P0-D17 must select technologies capable of supporting these rules.

Important capabilities include:

```text
module boundaries;

controlled imports;

dependency injection;

testability;

provider abstraction;

monorepo dependency control.
```

---

# 310. Repository Architecture Dependency Requirement

P0-D16 must create a source structure where valid dependencies are natural and invalid dependencies are visible.

---

# 311. Repository Architecture Must Not Fight Ownership

If repository structure makes it easier to import internals than public Contracts, repository design is wrong.

---

# 312. Public Contract Placement Requirement

Public Contracts must be easy to discover.

Consumers should not inspect implementation directories to understand how to use a capability.

---

# 313. Internal Code Placement Requirement

Internal implementation should be sufficiently separated that accidental external import can be restricted.

---

# 314. Dependency Documentation Requirement

Each substantial capability architecture should eventually state:

```text
Dependencies

Consumers

Public Contracts

Events

External Providers

Forbidden Dependencies.
```

---

# 315. Dependency ADR Triggers

An ADR should normally be considered when introducing:

```text
new primary Platform-to-Platform dependency;

new reverse-layer exception;

new shared Kernel dependency;

new service boundary;

new provider integration pattern;

new cross-owner transaction model;

new public external Contract architecture.
```

---

# 316. Dependency Exception Example

Suppose:

```text
Universe
```

requires direct Foundation access for an unusual high-performance operation.

Before approving:

```text
Why can Platform capability not own it?

Is this really Universe-specific?

Could a typed extension Port be added?

Will other Universes copy this pattern?

Does it introduce provider coupling?
```

---

# 317. Dependency Review Example — Media + Knowledge

Requirement:

```text
Entity must display image.
```

Minimal dependency:

```text
Knowledge stores Asset ID
or
association references Asset.
```

No need for:

```text
Knowledge → Storage Provider.
```

---

# 318. Dependency Review Example — Search

Requirement:

```text
published Entity becomes searchable.
```

Preferred:

```text
Knowledge
    publishes EntityPublished

Discovery
    consumes

Search projection updates.
```

Avoid:

```text
Knowledge
    imports Search SDK.
```

---

# 319. Dependency Review Example — AI Draft

Requirement:

```text
Creator generates Entity description.
```

Possible flow:

```text
Creator Application
    ↓
AI / Creator
    ↓
Knowledge Read Contract for context
    ↓
AI Provider

Generation Result
    ↓
Creator accepts
    ↓
Knowledge mutation Contract.
```

This avoids:

```text
Knowledge ↔ AI circular dependency.
```

---

# 320. Dependency Review Example — Avatar

Requirement:

```text
User selects avatar.
```

Preferred:

```text
User
    owns avatarAssetId

Media
    owns Asset.
```

Potential dependency:

```text
User → Media reference validation.
```

No direct Storage dependency.

---

# 321. Dependency Review Example — Verification Email

```text
Identity & Access
    owns verification state

Email
    owns delivery mechanics

Identity & Access
    → Email Contract.
```

Email never decides whether identity is verified.

---

# 322. Dependency Review Example — Scheduled Page

```text
Composition
    owns Page publication

Scheduler
    triggers owned command.
```

Scheduler does not import Page repository.

---

# 323. Dependency Review Example — History Workflow

```text
History
    defines review requirements

Knowledge
    owns Entity

Workflow
    coordinates review process

Identity & Access
    authorizes reviewer.
```

No single component should absorb all four responsibilities.

---

# 324. Dependency Review Example — Cross-Universe Search

```text
Application
    → Discovery
    + allowed Universe scope.
```

Discovery uses canonical Resource projections.

Application does not query each Universe database separately.

---

# 325. Dependency Review Example — Operations Reindex

```text
Operations
    → Discovery.rebuildIndex()
```

not:

```text
Operations
    directly executes Search SDK mutation.
```

---

# 326. Dependency Review Example — Audit

```text
Knowledge mutation
    → Audit Contract
```

or Audit Event integration depending on reliability requirements.

Audit does not own Entity mutation.

---

# 327. Dependency Review Example — Metadata

Anime may define:

```text
voiceActorLanguage
```

as Metadata if appropriate.

Dependency:

```text
Anime
    → Metadata Definition Contract.
```

Metadata does not depend on Anime.

---

# 328. Dependency Review Example — Relationship

History defines:

```text
PARTICIPATED_IN.
```

Dependency:

```text
History
    → Relationships Contract.
```

Relationships Kernel does not import History.

---

# 329. Dependency Review Example — Localization

Knowledge may use:

```text
Localized Value Contract.
```

Localization does not need Knowledge's Entity repository.

---

# 330. Dependency Anti-Pattern — Reverse Foundation Dependency

Bad:

```text
Storage
    → Media.
```

---

# 331. Dependency Anti-Pattern — Reverse Kernel Dependency

Bad:

```text
Relationships
    → Knowledge.
```

if Relationships is truly Kernel.

---

# 332. Dependency Anti-Pattern — Universe Leakage

Bad:

```text
Knowledge
    → Anime.
```

---

# 333. Dependency Anti-Pattern — Provider Leakage

Bad:

```text
Anime
    → OpenAI SDK.
```

---

# 334. Dependency Anti-Pattern — Persistence Leakage

Bad:

```text
CMS
    → Knowledge ORM model.
```

---

# 335. Dependency Anti-Pattern — Event Consumer Coupling

Bad:

```text
Knowledge
    knows Discovery must receive Event.
```

---

# 336. Dependency Anti-Pattern — Global Data Access

Bad:

```text
DatabaseService.queryAnyTable(...)
```

used as business API.

---

# 337. Dependency Anti-Pattern — Shared Singleton State

Avoid globally mutable singletons shared across unrelated capabilities.

---

# 338. Dependency Anti-Pattern — Configuration Service Locator

Bad:

```text
config.get("some.internal.class.name")
```

to dynamically instantiate arbitrary business implementations.

---

# 339. Dependency Anti-Pattern — Circular Platform Facades

Bad:

```text
KnowledgeFacade → MediaFacade
MediaFacade → KnowledgeFacade.
```

Facades do not remove the cycle.

---

# 340. Dependency Anti-Pattern — Infrastructure Events as Domain Events

Provider callbacks such as:

```text
queue.message.received
```

must not automatically become public Domain Events.

---

# 341. Dependency Anti-Pattern — Business Logic in Adapter

Adapters should translate and integrate.

They should not become the canonical location for core Domain rules.

---

# 342. Dependency Anti-Pattern — Domain Logic in Controller

Controllers handle boundary concerns.

They should not own large business processes.

---

# 343. Dependency Anti-Pattern — Domain Logic in Repository

Repositories persist/query owned state.

They should not absorb unrelated workflow/orchestration.

---

# 344. Dependency Anti-Pattern — Domain Logic in Queue Handler

A queue handler should invoke the owning capability.

It should not duplicate the full business operation.

---

# 345. Dependency Anti-Pattern — Domain Logic in Scheduler Handler

Same principle.

---

# 346. Dependency Anti-Pattern — Provider SDK in Public Contract

Do not expose provider classes/types as public stable AI World Contracts.

---

# 347. Dependency Anti-Pattern — Architecture by Import Convenience

Do not place code based on:

```text
"this folder already imports that package."
```

Placement follows responsibility.

---

# 348. Dependency Anti-Pattern — Everything Shared

Not every repeated helper should become a shared dependency.

Duplication may be cheaper than coupling when semantics differ.

---

# 349. Dependency Anti-Pattern — Zero Duplication Obsession

AI World optimizes for:

```text
correct reuse
```

not:

```text
zero repeated lines.
```

Semantic independence matters more than superficial DRY.

---

# 350. Dependency Anti-Pattern — Core Switchboard

Avoid one central component routing every call between all Platforms.

This becomes a hidden dependency hub.

---

# 351. Dependency Anti-Pattern — Global Event Bus Abuse

Events should communicate meaningful asynchronous facts.

Do not use Event Bus as a substitute for clear synchronous Contracts.

---

# 352. Dependency Anti-Pattern — Dependency Explosion Through Interfaces

Creating an interface for every class does not automatically improve dependency architecture.

Interfaces are valuable where they protect real boundaries.

---

# 353. Dependency Anti-Pattern — Architecture Through DI Tokens Alone

Tokens do not define ownership.

Documentation and public Contracts must make ownership explicit.

---

# 354. Dependency Anti-Pattern — Technical Layers Across Whole Codebase

Avoid one project-wide structure where every service depends across global:

```text
controllers

services

repositories

models.
```

Capability ownership should remain primary.

---

# 355. Dependency Invariants

The following are formal architectural invariants:

```text
1. Applications must not own or directly mutate another Capability's canonical persistence.

2. Applications may consume supported Platform Contracts.

3. Universes may consume Platform and appropriate Kernel Contracts.

4. Universes must not normally consume Foundation implementations directly.

5. Universes must not depend on Provider SDKs directly.

6. Shared Platforms must not depend on named Universe implementations.

7. Platforms must not depend on Applications.

8. Platforms may depend on peer Platform public Contracts only when the dependency is deliberate and acyclic.

9. Platforms must not depend on peer Platform internals.

10. Kernel must not depend on Platforms or Universes.

11. Foundations must not depend on Kernel business semantics, Platforms, Universes, or Applications.

12. Concrete Adapters depend on the Contracts they implement.

13. Core business code must not depend on concrete Provider Adapters.

14. Provider SDKs remain localized near integration boundaries.

15. Provider types do not become canonical public Domain Contracts.

16. Canonical data mutation occurs through the canonical owner's supported operations.

17. Direct cross-owner table mutation is forbidden by default.

18. Cross-owner reads use public Contracts, stable references, projections, or deliberate composition.

19. Search, Cache, Analytics, and similar projections remain derived by default.

20. Events describe facts and do not replace every synchronous interaction.

21. Event producers must not depend on their consumers.

22. Jobs remain owned by the Capability defining the business work.

23. Queue and Scheduler provide execution mechanics, not business ownership.

24. Composition Root may know concrete implementations only for wiring.

25. Composition Root must not contain business logic.

26. Type-only and generated imports still count as dependencies.

27. Dynamic imports, reflection, or dependency injection may not be used to hide architectural violations.

28. Circular architectural dependencies are forbidden by default.

29. Shared utilities must remain stateless, narrow, and Domain-neutral.

30. Public Contracts must remain smaller and more stable than implementation internals.

31. Framework-specific request, response, ORM, and provider types remain near boundaries.

32. Architecture dependency exceptions must be explicit and reviewable.

33. Repeated exceptions trigger architecture review.

34. Logical dependency boundaries remain valid regardless of deployment topology.

35. Technology selection must support enforcement of these rules.
```

---

# 356. Default Dependency Matrix

| Consumer | Application | Universe | Platform | Kernel | Foundation | Concrete Adapter | External Provider |
|---|---:|---:|---:|---:|---:|---:|---:|
| Application | Conditional | Yes | Yes | Limited | Limited | No | No |
| Universe | No | Avoid | Yes | Yes | No | No | No |
| Platform | No | No | Conditional | Yes | Yes | No | No |
| Kernel | No | No | No | Conditional | Yes | No | No |
| Foundation | No | No | No | No | Conditional | Contract-driven only | No |
| Concrete Adapter | No | No | Contract only | Contract only | Contract only | Conditional | Yes |
| Composition Root | Yes | Yes | Yes | Yes | Yes | Yes | Configuration/SDK wiring |

Notes:

```text
"Conditional"
means allowed only when ownership and cycle rules permit.

"Limited"
means legitimate technical/semantic usage without ownership bypass.

"No"
means forbidden by default, subject only to explicit architectural exception.
```

---

# 357. Public Dependency Preference Order

When one capability needs another, prefer the least-coupled valid mechanism:

```text
1. Stable Identifier / Resource Reference

2. Narrow Public Read Contract

3. Public Mutation/Application Contract

4. Event for asynchronous reaction

5. Derived Projection

6. Workflow/orchestration where process complexity requires it

7. New shared Kernel abstraction only when semantics genuinely justify it.
```

The order is guidance, not a mandatory algorithm.

---

# 358. Dependency Decision Checklist

Before adding a dependency:

```text
1. What capability owns the concept?

2. Does the consumer actually need this dependency?

3. Could a Resource ID be enough?

4. Is there an existing public Contract?

5. Is the target lower-level or a peer Platform?

6. Does this dependency point upward?

7. Does it create a cycle?

8. Is internal implementation being imported?

9. Is provider technology leaking?

10. Is Universe-specific code leaking into shared Platform?

11. Is synchronous interaction required?

12. Would an Event better model independent reaction?

13. Is a projection better for repeated reads?

14. Who owns the resulting state?

15. How does the dependency fail?

16. Does this make future service extraction harder?

17. Does this increase coupling for every new Universe?

18. Is the complexity justified now?
```

---

# 359. Public Contract Checklist

A Public Contract should answer:

```text
Who owns it?

Who are its intended consumers?

What semantics does it guarantee?

What inputs are allowed?

What outputs are stable?

What errors are exposed?

What security expectations exist?

Does it expose provider/framework types?

What compatibility expectation applies?
```

---

# 360. Event Dependency Checklist

Before using an Event:

```text
Did something meaningful already happen?

Does producer need the consumer result?

Can the consumer react later?

Can multiple consumers legitimately react?

Can duplicate delivery occur?

Must delivery be reliable?

Who owns the Event schema?

Can consumers tolerate eventual consistency?
```

---

# 361. Provider Dependency Checklist

Before introducing Provider dependency:

```text
Which Capability owns this provider boundary?

What Port/Contract represents the needed capability?

What provider-specific data must remain localized?

What identifiers need mapping?

What failure modes exist?

What data leaves AI World?

How is the Provider configured?

How is it tested?

Can another implementation be substituted with bounded effort?
```

---

# 362. Cross-Platform Dependency Checklist

Before Platform A depends on Platform B:

```text
Why is B the correct owner?

What exact Contract is needed?

Can a stable Resource reference suffice?

Is the dependency one-directional?

Could B ever need A?

Would Application composition be simpler?

Would an Event reduce unnecessary coupling?

Does this create a transaction across owners?

Does the dependency belong in Kernel instead?

Is Kernel promotion actually justified?
```

---

# 363. Architecture Enforcement Roadmap

Dependency enforcement should mature incrementally.

```text
STAGE 1
Documentation + Code Review

STAGE 2
Repository/package boundaries

STAGE 3
Lint/import restrictions

STAGE 4
Architecture tests

STAGE 5
CI quality gates

STAGE 6
Periodic dependency graph review
```

Do not introduce every enforcement tool on day one.

---

# 364. Stage 1 — Documentation Enforcement

Initially:

```text
architecture documents

code reviews

module design
```

enforce dependency direction.

---

# 365. Stage 2 — Structural Enforcement

Repository Architecture should make invalid imports inconvenient and valid imports obvious.

---

# 366. Stage 3 — Static Enforcement

Potential mechanisms:

```text
lint rules

workspace dependency boundaries

restricted imports.
```

Exact technology will be selected later.

---

# 367. Stage 4 — Architecture Tests

Architecture tests may assert:

```text
layer dependencies

package dependencies

provider SDK location

Universe neutrality

public/private import boundaries.
```

---

# 368. Stage 5 — CI Enforcement

Critical architecture tests should become CI gates once stable.

---

# 369. Stage 6 — Dependency Graph Review

Periodically inspect real dependency graph and compare it with intended architecture.

---

# 370. Enforcement Failure Principle

If developers constantly need to bypass an enforcement rule, investigate the architecture or rule.

Do not simply weaken enforcement automatically.

---

# 371. Current Phase 0 Enforcement State

At acceptance of this document:

```text
Source code:
NOT STARTED

Automated dependency checks:
NOT IMPLEMENTED

Repository Architecture:
PENDING P0-D16

Technology Strategy:
PENDING P0-D17

Dependency policy:
DEFINED AND ACCEPTED.
```

---

# 372. What This Document Decides

This document decides:

```text
default allowed dependency direction;

forbidden reverse-layer dependencies;

Platform peer dependency rules;

Universe dependency rules;

Kernel dependency rules;

Foundation neutrality rules;

public/internal import boundaries;

provider SDK isolation;

Adapter dependency inversion;

Composition Root exception;

cross-owner persistence restrictions;

Event/Command/Query dependency guidance;

Job and Scheduler dependency ownership;

cycle prevention;

future automated architecture enforcement direction.
```

---

# 373. What This Document Does Not Decide

This document does not decide:

```text
exact package names;

exact source paths;

exact lint tool;

exact architecture-test library;

exact dependency-injection framework;

exact event bus;

exact queue technology;

exact API protocol;

exact Provider implementations;

exact monorepo tooling;

exact code-level public entrypoint syntax.
```

Those decisions belong to Repository Architecture, Technology Strategy, and later engineering standards.

---

# 374. Relationship to Extension Model

The next document:

```text
P0-D15 — Extension Model
```

will define how intentional variability works without breaking these Dependency Rules.

It will formalize:

```text
configuration;

Universe Definitions;

typed Extensions;

Strategies;

Registries;

Provider Adapters;

extension Contracts;

composition and registration;

extension security;

extension lifecycle;

how to avoid switch(universe);

how to decide when variation becomes a shared Platform capability.
```

---

# 375. Relationship to Repository Architecture

P0-D16 must translate these dependency constraints into repository structure.

It should make:

```text
allowed imports natural
```

and:

```text
forbidden imports visible/enforceable.
```

---

# 376. Relationship to Technology Strategy

P0-D17 must select a stack that can support:

```text
modular boundaries;

public/private Contracts;

testable dependency inversion;

monorepo dependency control;

provider isolation;

architecture checks.
```

---

# 377. Relationship to Ownership Model

Ownership answers:

```text
WHO OWNS THE CONCEPT?
```

Dependency Rules answer:

```text
HOW MAY EVERYONE ELSE USE IT?
```

The two documents are inseparable.

---

# 378. Dependency Rule Summary

```text
APPLICATIONS
    consume Platform capabilities
    but do not own Domain truth.

UNIVERSES
    specialize Platforms
    but do not consume infrastructure directly.

PLATFORMS
    own reusable business capability
    and interact through public Contracts.

KERNEL
    provides shared semantics
    and never depends upward.

FOUNDATIONS
    provide technical infrastructure
    and remain Domain-neutral.

ADAPTERS
    implement Ports
    and isolate provider technology.

PROVIDERS
    remain external implementation details.

CANONICAL OWNERS
    control canonical mutation.

EVENT CONSUMERS
    own reactions, not producer state.

COMPOSITION ROOT
    wires everything
    but owns no business rules.
```

---

# 379. Final Dependency Statement

> **AI World dependencies must follow ownership rather than convenience. Applications consume capabilities; Universes specialize them; Platforms collaborate through deliberate public Contracts; the Platform Kernel provides stable shared semantics; Foundations remain domain-neutral; and external Providers are isolated behind owned integration boundaries. No framework feature, shared database, generated type, service locator, or dependency-injection mechanism may be used to bypass these rules.**

The goal is not maximum indirection.

The goal is architecture that remains understandable and evolvable as AI World grows from two proof Universes to many.

---

# 380. Acceptance

```text
DOCUMENT
P0-D14 — AI World Dependency Rules

STATUS
ACCEPTED

VERSION
1.0.0

PHASE
Phase 0 — Architecture Foundation

PARENTS
P0-D01 — Project Charter
P0-D02 — Vision
P0-D03 — Mission
P0-D04 — Platform Principles
P0-D05 — Universe Principles
P0-D06 — Goals
P0-D07 — Non-Goals
P0-D08 — Terminology
P0-D09 — System Context
P0-D10 — Platform Architecture
P0-D11 — Platform Layers
P0-D12 — Capability Map
P0-D13 — Ownership Model

NEXT DOCUMENT
P0-D15 — Extension Model

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```