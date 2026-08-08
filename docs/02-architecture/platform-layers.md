# AI World Platform Layers

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Platform Layers |
| Document ID | P0-D11 |
| Area | Architecture |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Canonical Layering and Dependency Model |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md`, `docs/01-vision/terminology.md`, `docs/02-architecture/system-context.md`, `docs/02-architecture/platform-architecture.md` |

---

# 1. Purpose

This document defines the canonical architectural layers of **AI World**.

The Platform Architecture established the major areas of the system.

This document makes those boundaries stricter by defining:

```text
what each layer is responsible for;

what each layer may know;

what each layer must not know;

which dependencies are normally allowed;

which dependencies are forbidden;

how cross-Platform dependencies work;

how Universe Extensions integrate;

how Provider Adapters integrate;

how Applications compose multiple capabilities;

how runtime composition differs from source-code dependency;

how future service extraction preserves logical layering.
```

The objective is not to create ceremonial layers.

The objective is to protect:

```text
ownership

replaceability

maintainability

testability

Universe reuse

technology evolution
```

---

# 2. Layering Principle

> **Higher-level AI World concepts may depend on lower-level reusable capabilities, while lower-level capabilities must not acquire knowledge of higher-level product or Universe semantics.**

The preferred direction is:

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

External technology exists beyond these semantic layers.

---

# 3. Important Qualification

The diagram above describes:

```text
ARCHITECTURAL DEPENDENCY DIRECTION
```

It does **not** mean every runtime request must physically call every layer.

For example:

```text
Login Application
    ↓
Identity & Access Platform
```

does not need to pass through:

```text
Universe
```

or:

```text
Knowledge Platform.
```

Layers define responsibility and dependency constraints.

They are not mandatory call-chain steps.

---

# 4. Canonical Semantic Layers

AI World currently defines five primary semantic layers:

```text
L5 — Applications

L4 — Universes

L3 — Platforms

L2 — Platform Kernel

L1 — Foundations
```

Below these is an implementation/integration edge:

```text
Integration Edge
    Adapters
    Drivers
    Provider Clients
```

Outside AI World are:

```text
External Providers
External Infrastructure
External Systems
```

---

# 5. Layer Model

```text
┌───────────────────────────────────────────────┐
│ L5 — APPLICATIONS                            │
│                                               │
│ Web / Admin / API / Worker / Future Clients   │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│ L4 — UNIVERSES                               │
│                                               │
│ Anime / History / Future Universe Definitions │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│ L3 — PLATFORMS                               │
│                                               │
│ Identity & Access                             │
│ User                                          │
│ Knowledge                                     │
│ Media                                         │
│ Discovery                                     │
│ AI / Creator                                  │
│ Composition / CMS                             │
│ Engagement                                    │
│ Operations                                    │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│ L2 — PLATFORM KERNEL                         │
│                                               │
│ Identifiers                                   │
│ Namespace                                     │
│ Taxonomy                                      │
│ Metadata                                      │
│ Relationships                                 │
│ Events                                        │
│ Audit                                         │
│ Workflow                                      │
│ Policy                                        │
│ Localization                                  │
│ Versioning                                    │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│ L1 — FOUNDATIONS                             │
│                                               │
│ Configuration                                 │
│ Database                                      │
│ Repository                                    │
│ Migration                                     │
│ Seed                                          │
│ Storage                                       │
│ Cache                                         │
│ Queue                                         │
│ Scheduler                                     │
│ Email                                         │
│ Observability                                 │
│ Feature Flags                                 │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
              INTEGRATION EDGE
                       │
                       ▼
            EXTERNAL PROVIDERS
```

---

# 6. Layers Are Logical

A layer is an architectural responsibility.

It is not automatically:

```text
a package

a folder

a process

a service

a database

a deployment
```

Several layers may initially execute inside the same backend runtime.

---

# 7. Layers Are Not Security Zones Automatically

Layer boundaries primarily protect:

```text
architecture

ownership

change propagation
```

They are not automatically network security boundaries.

A future distributed architecture may introduce physical trust boundaries between some of them.

---

# 8. Layers Are Not Teams Automatically

A future team structure may align with Platforms or major capabilities.

That organizational decision is separate from architectural layer definition.

---

# 9. L5 — Applications

Applications are the outermost internal delivery layer.

Applications translate user, machine, HTTP, UI, scheduled, or runtime interactions into AI World capability usage.

Examples:

```text
Public Web Application

Creator / Admin Application

API Application

Worker Runtime

Future Mobile Application
```

---

# 10. Application Responsibilities

Applications may own:

```text
routing

transport handling

request parsing

response formatting

UI composition

application bootstrap

runtime composition

client-specific orchestration

presentation concerns

transport security concerns
```

---

# 11. Applications Must Not Own Canonical Domain Semantics

Applications should not be the canonical owners of:

```text
Entity lifecycle

Asset lifecycle

Authorization semantics

Universe definitions

Knowledge rules

Workflow invariants

AI Generation semantics
```

Those belong to lower architectural owners.

---

# 12. Applications Are Consumers

Applications primarily consume:

```text
Platforms

Universe definitions/context

selected public Kernel capabilities

selected Foundation capabilities for runtime concerns
```

Applications should avoid reaching directly into internal implementation.

---

# 13. Application Example

A page displaying a History Entity may need:

```text
Knowledge
Media
Engagement
Discovery
```

The Application may compose these results.

That does not transfer ownership to the Application.

---

# 14. Application Orchestration

Applications may perform lightweight orchestration when the work is:

```text
presentation-specific

transport-specific

client-specific
```

Business transactions should remain inside owning capabilities.

---

# 15. Bad Application Ownership

Avoid:

```text
HistoryPageController
    updates Entity table
    updates Media table
    updates Engagement table
```

Preferred:

```text
HistoryPageController
    invokes owned Platform contracts.
```

---

# 16. Application Dependency Rule

Applications may depend on:

```text
Universe public definitions/context

Platform public contracts

Application-level shared libraries

selected Kernel public contracts

selected Foundation public contracts
```

They should not depend on private Platform internals.

---

# 17. Application-to-Foundation Access

Applications may directly consume technical Foundations for legitimate runtime concerns.

Examples:

```text
Configuration

Observability

Feature Flags
```

This is acceptable.

Applications should not bypass business Platforms merely because a Foundation offers low-level access.

---

# 18. Invalid Foundation Bypass

Bad:

```text
API Controller
    ↓
Database Client
    ↓
UPDATE knowledge_entity
```

Preferred:

```text
API Controller
    ↓
Knowledge Platform
```

---

# 19. Worker Layer Position

Workers are Applications/runtime entry points.

A Worker may execute:

```text
Media Job

AI Job

Index Job
```

but the owning Platform defines the Job's business semantics.

---

# 20. Worker Example

```text
Worker Runtime
      ↓
Media Public/Application Contract
      ↓
Media processing logic
      ↓
Storage Foundation
```

The Worker itself does not become Media Platform.

---

# 21. L4 — Universes

Universes define domain-specific worlds.

They sit conceptually above reusable Platforms because they specialize shared capabilities for a particular domain.

Examples:

```text
Anime

History
```

---

# 22. Universe Responsibilities

A Universe may define:

```text
domain vocabulary

typed domain definitions

taxonomy definitions

metadata schemas

relationship definitions

workflow configuration

policies

AI configuration

presentation configuration

domain-specific extensions
```

---

# 23. Universe Non-Responsibilities

Universes should not own duplicate:

```text
authentication engines

authorization engines

database infrastructure

storage infrastructure

queue infrastructure

AI provider integrations

search infrastructure

email delivery
```

---

# 24. Universe Dependency Rule

Universes may normally depend on:

```text
Platform public contracts

Platform extension contracts

Kernel public contracts where appropriate

Universe-local domain code
```

Universes should normally not depend directly on technical Foundations.

---

# 25. Why Universes Should Avoid Foundations

A Universe should express:

```text
domain meaning
```

not:

```text
technical infrastructure implementation.
```

Bad:

```text
Anime Universe
    directly calls
Redis cache.
```

Preferred:

```text
Anime capability
    consumes shared Platform behavior
```

and the owning Platform determines its technical implementation.

---

# 26. Universe-to-Platform Dependency

Valid:

```text
History
    depends on
Knowledge Platform contracts
```

Valid:

```text
Anime
    depends on
Media Platform contracts
```

---

# 27. Platform-to-Universe Dependency

Normally forbidden:

```text
Knowledge Platform
    depends on
Anime implementation
```

Shared Platforms must remain usable without Anime being installed or active.

---

# 28. Universe Registration Direction

If Anime introduces definitions into Knowledge:

```text
Knowledge Platform
    defines extension/registration contract

Anime
    implements or supplies definitions
```

The dependency remains:

```text
Anime
    → Knowledge Contract
```

not:

```text
Knowledge
    → Anime.
```

---

# 29. Universe Composition Root

Runtime composition may connect:

```text
Anime Definitions
+
Knowledge Platform
```

without making Knowledge source code depend on Anime.

This distinction is fundamental.

---

# 30. Universe-to-Universe Dependencies

Direct Universe-to-Universe dependencies should generally be avoided.

Bad:

```text
Anime
    imports
History internal code
```

Cross-Universe interaction should normally use:

```text
Knowledge

Relationships

Discovery

shared identifiers

public contracts
```

---

# 31. Cross-Universe Relationship Example

Instead of:

```text
Anime module
    directly imports
HistoryPersonRepository
```

prefer:

```text
Anime Resource
    references
canonical History/Knowledge Resource
through shared Relationship semantics.
```

---

# 32. Explicit Universe Dependency Exception

A future Universe may genuinely depend on another Universe.

If that occurs:

```text
dependency must be explicit;

reason must be documented;

cycle must be prevented;

public contracts must be used.
```

This should be exceptional.

---

# 33. L3 — Platforms

Platforms own large reusable business capabilities.

Current Platforms:

```text
Identity & Access

User

Knowledge

Media

Discovery

AI / Creator

Composition / CMS

Engagement

Operations
```

---

# 34. Platform Responsibilities

A Platform normally owns:

```text
Domain semantics

application/use-case services

business invariants

canonical persistence

public contracts

Platform Events

Platform-specific extension contracts

security integration

Platform documentation
```

---

# 35. Platform Dependency Rule

Platforms may depend on:

```text
Platform Kernel public capabilities

Foundations

other Platform public contracts when justified
```

Platforms must not depend on:

```text
Applications

specific Universe implementations
```

---

# 36. Peer Platform Dependency

Peer Platform dependencies are allowed when semantically correct.

Example:

```text
Composition
    depends on
Knowledge public contract
```

This is not automatically a problem.

The objective is not zero Platform dependencies.

The objective is:

```text
clear and acyclic Platform dependencies.
```

---

# 37. Peer Platform Dependency Standard

A Platform-to-Platform dependency must:

```text
use a public contract;

have clear semantic reason;

avoid internal persistence access;

avoid circular ownership;

remain documented.
```

---

# 38. Example — Valid Platform Dependency

```text
Composition / CMS
    ↓
Knowledge public query contract
```

because Composition needs to reference/render Knowledge.

---

# 39. Example — Potentially Valid Platform Dependency

```text
Knowledge
    ↓
Media public contract
```

if Knowledge needs to verify/reference an Asset.

The exact direction must be decided during Capability architecture.

---

# 40. Example — Invalid Platform Dependency

```text
Knowledge
    ↓
Media/internal/storage-repository
```

This violates encapsulation.

---

# 41. Platform Circular Dependency

Bad:

```text
Knowledge
    ↓
Media
    ↓
Knowledge
```

If both need each other, determine whether:

```text
one dependency can become an Event;

one dependency can become a Resource Reference;

one concern belongs in Kernel;

one interaction belongs in Application composition;

one boundary is incorrectly owned.
```

---

# 42. Circular Dependency Is a Design Signal

Do not solve architectural cycles with:

```text
forwardRef

runtime service locator

dynamic import tricks
```

before understanding the ownership problem.

Framework workarounds do not resolve architecture.

---

# 43. Platform Public Surface

A Platform should expose only what legitimate consumers require.

Conceptually:

```text
platform/
    public contracts
    public services
    public events

    internal/
        repositories
        persistence
        algorithms
        adapters
```

Exact folders are deferred.

---

# 44. Public Contract Stability

The broader the number of consumers, the stronger the stability expectation.

For example:

```text
Knowledge Entity public reference contract
```

may require higher stability than:

```text
internal Knowledge repository query.
```

---

# 45. Platform Persistence

Platforms own their canonical persistence semantics.

They may use:

```text
Database Foundation

Repository Infrastructure

Storage Foundation
```

to implement persistence.

---

# 46. Platform Data Ownership

Physical storage location does not determine logical ownership.

Example:

```text
User
and
Knowledge
```

may use the same database.

Their data remains separately owned.

---

# 47. Platform Internal Dependencies

A Platform may internally use:

```text
Domain services

Application services

Repositories

Policies

Adapters

Mappers

Validators
```

where needed.

This document does not mandate a fixed internal layered pattern for every Platform.

---

# 48. Avoid Internal Layer Ceremony

A simple capability does not require:

```text
Controller
→ Facade
→ UseCase
→ Manager
→ Service
→ Repository
```

unless those components each have real responsibility.

---

# 49. L2 — Platform Kernel

The Platform Kernel contains broadly reusable semantic primitives and engines.

Current Kernel areas:

```text
Identifiers

Namespace

Taxonomy

Metadata

Relationships

Events

Audit

Workflow

Policy

Localization

Versioning
```

---

# 50. Kernel Responsibility

Kernel capabilities provide semantics needed by several Platforms or Universes without belonging primarily to one product Platform.

---

# 51. Kernel Dependency Rule

Kernel capabilities may depend on:

```text
Foundations

other Kernel capabilities where justified
```

Kernel must not depend on:

```text
Platforms

Universes

Applications
```

---

# 52. Kernel Must Be Universe-Neutral

Forbidden inside Kernel:

```text
AnimeCharacter

HistoricalBattle

HistoryEditor

AnimeEpisode
```

Kernel contracts must remain meaningful outside one Universe.

---

# 53. Kernel Must Be Platform-Neutral Enough

A Kernel capability should not become narrowly tailored to one Platform.

Example:

If Metadata only works for Knowledge Entities and cannot support other Resource categories, it may belong in Knowledge rather than Kernel.

---

# 54. Kernel Promotion Rule

A concept should enter Kernel only when:

```text
multiple consumers require it;

semantics are genuinely shared;

ownership is stable;

a dedicated Kernel abstraction reduces duplication;

the abstraction does not distort domain-specific behavior.
```

---

# 55. Kernel Is Not Shared Utilities

Do not move code into Kernel because:

```text
two modules import it.
```

Kernel is semantic infrastructure.

Generic utilities require separate ownership.

---

# 56. Kernel-to-Kernel Dependencies

Kernel capabilities may depend on one another where natural.

Example:

```text
Metadata
    may use
Namespace
```

or:

```text
Relationships
    may use
Identifiers.
```

Such dependencies must remain acyclic and intentional.

---

# 57. Kernel Cycles

A cycle such as:

```text
Metadata
→ Relationships
→ Metadata
```

must be examined carefully.

Possible solutions include:

```text
extracting a smaller shared primitive;

changing ownership;

using stable references;

separating definitions from runtime resolution.
```

---

# 58. Identifiers Layer Position

Identifiers is a Kernel capability because stable Resource identification may be needed across many Platforms.

It must remain separate from Actor authentication Identity.

---

# 59. Namespace Layer Position

Namespace belongs in Kernel because collision-safe names may be required across:

```text
Permissions

Events

Metadata

Relationships

Extensions
```

---

# 60. Taxonomy Layer Position

Taxonomy belongs in Kernel if multiple Platforms need reusable classification semantics.

Universe-specific taxonomy definitions remain in the Universe/domain layer.

---

# 61. Metadata Layer Position

Metadata provides extensibility semantics.

Domain-specific Metadata Definitions may come from Platforms or Universes.

The engine remains generic.

---

# 62. Relationships Layer Position

Relationships provides generic connection semantics.

Domain-specific Relationship Types may be registered by:

```text
Knowledge

Universes

other Platforms
```

where appropriate.

---

# 63. Events Layer Position

Events provides common communication semantics.

Domain-specific events remain owned by their producing Platform.

---

# 64. Audit Layer Position

Audit provides reusable accountability semantics.

Business Platforms supply meaningful audit actions/context.

Audit does not own their business operation.

---

# 65. Workflow Layer Position

Workflow provides reusable process mechanics only where configurable workflow semantics are genuinely shared.

Simple Domain state machines may remain Platform-local.

---

# 66. Policy Layer Position

Policy provides reusable policy mechanics.

Domain-specific rules remain defined by owning Platforms or Universes.

---

# 67. Localization Layer Position

Localization provides shared locale-aware semantics.

Actual localized Content remains owned by its relevant Platform.

---

# 68. Versioning Layer Position

Versioning may provide reusable version/revision mechanics.

It does not automatically own every historical copy of Platform data.

---

# 69. L1 — Foundations

Foundations provide reusable technical infrastructure.

Current Foundations:

```text
Configuration

Database

Repository

Migration

Seed

Storage

Cache

Queue

Scheduler

Email

Observability

Feature Flags
```

---

# 70. Foundation Responsibility

A Foundation should answer technical questions such as:

```text
How do we load configuration?

How do we transact with persistence?

How do we store bytes?

How do we enqueue work?

How do we send email?

How do we emit telemetry?
```

It should not answer domain questions such as:

```text
Can this History Entity be published?

Who owns this Anime Character?

Which User may approve this Asset?
```

---

# 71. Foundation Dependency Rule

Foundations must not depend on:

```text
Platform Kernel business semantics

Platforms

Universes

Applications
```

except for narrow technical contracts explicitly designed for inversion at integration boundaries.

---

# 72. Foundation-to-Foundation Dependencies

Foundations may depend on other Foundations when the dependency is technical and coherent.

Example:

```text
Migration
    may use
Database
```

Example:

```text
Seed
    may use
Database
```

---

# 73. Foundation Dependency Cycles

Foundation cycles should be avoided.

Bad:

```text
Configuration
    → Database
    → Observability
    → Configuration
```

Architecture should define clean startup/bootstrap dependency order.

---

# 74. Configuration Foundation

Configuration should remain low in the dependency graph.

Many areas may consume Configuration.

Configuration should depend on very little higher-level system behavior.

---

# 75. Database Foundation

Database provides:

```text
connection

transaction capability

health

technical database access
```

It must not know business ownership merely because it hosts business tables.

---

# 76. Repository Foundation

Repository Infrastructure may provide:

```text
common transaction context

persistence abstractions

repository support primitives
```

if valuable.

It must not become:

```text
UniversalRepository<T>
```

that allows arbitrary data access across all ownership boundaries.

---

# 77. Migration Foundation

Migration may depend on:

```text
Database

Configuration

Observability
```

as required.

Individual Platform migrations may supply migration definitions through controlled registration.

---

# 78. Migration Registration Direction

Preferred:

```text
Migration Framework/Contract
       ▲
       │
Platform Migration implements/registers
```

The Migration Foundation must not import specific Platforms to discover their migrations through hard-coded dependencies.

---

# 79. Seed Foundation

Seed provides shared execution mechanics.

Platform or Environment-specific seed definitions may depend on the Seed contract.

Seed core must remain Domain-neutral.

---

# 80. Storage Foundation

Storage may depend on:

```text
Configuration

Observability

provider adapter contracts
```

It should not know:

```text
Media Asset business lifecycle.
```

---

# 81. Cache Foundation

Cache provides technical caching capability.

Higher layers decide:

```text
what may be cached

cache key semantics

consistency requirements

invalidation triggers
```

---

# 82. Queue Foundation

Queue provides technical delivery of asynchronous work.

Platforms define business Job semantics.

---

# 83. Scheduler Foundation

Scheduler defines technical scheduling.

Platforms define scheduled business operations.

---

# 84. Email Foundation

Email Foundation handles delivery mechanics.

Identity & Access might request:

```text
SendVerificationEmail
```

but Email Foundation should not own email-verification business state.

---

# 85. Observability Foundation

Observability may be consumed from every internal layer.

This creates a deliberate cross-cutting technical dependency.

Observability must remain low-level and Domain-neutral.

---

# 86. Feature Flags Foundation

Feature Flags may be consumed by Applications and Platforms.

They should remain infrastructure for rollout control rather than business policy storage.

---

# 87. Integration Edge

Provider Adapters and Drivers occupy an architectural integration edge.

Examples:

```text
Database Driver

Object Storage Adapter

Email Provider Adapter

AI Provider Adapter

Search Provider Adapter

Observability Exporter
```

---

# 88. Integration Edge Is Special

The Integration Edge is not a normal semantic layer in the downward dependency stack.

This is because dependency inversion often requires:

```text
Adapter
    depends on
AI World Contract
```

that it implements.

Example:

```text
AI Provider Contract
      ▲
      │ implements
OpenAIAdapter
```

The core AI Platform does not depend directly on `OpenAIAdapter`.

---

# 89. Dependency Inversion

At provider boundaries:

```text
Core Capability
    defines Port/Contract

Concrete Adapter
    implements Contract

Composition Root
    supplies Adapter
```

Therefore source dependency is:

```text
Adapter
    → Contract
```

while runtime use appears as:

```text
Core
    → Contract
    → Adapter
    → Provider.
```

This distinction is intentional.

---

# 90. Provider Adapter Ownership

An Adapter should be owned near the capability whose contract it implements.

Examples:

```text
AI Provider Adapter
    owned by AI / Creator implementation

Storage Adapter
    owned by Storage Foundation implementation

Email Adapter
    owned by Email Foundation implementation
```

Do not create one giant global `adapters` architecture with unclear ownership.

---

# 91. Adapter Isolation

Provider-specific imports should remain near the Adapter.

Bad:

```text
OpenAI SDK
    imported across
Knowledge
CMS
Anime
History
```

Preferred:

```text
AI Provider Adapter
    imports OpenAI SDK.
```

---

# 92. Concrete Adapter Dependency

Core business code must not depend on concrete provider Adapter classes.

Bad:

```text
KnowledgeService
    constructor(
      private readonly openAIAdapter: OpenAIAdapter
    )
```

Preferred:

```text
Knowledge capability
    consumes AI Platform contract

AI Platform
    consumes AI capability Port

Composition Root
    provides concrete Adapter.
```

---

# 93. External Providers

External Providers exist outside AI World's semantic ownership.

Examples:

```text
AI model provider

object storage

email service

search engine

managed database

cloud platform
```

External systems must not become architectural layers inside Domain logic.

---

# 94. Composition Root

AI World requires explicit runtime composition points.

A Composition Root is allowed to know concrete implementations that ordinary business modules should not know.

It may wire:

```text
Applications

Platforms

Foundations

Adapters

Universe definitions

Extensions
```

---

# 95. Composition Root Exception

The Composition Root is a controlled exception to ordinary dependency rules.

It may import:

```text
high-level contracts

concrete implementations

Adapters

Universe registrations
```

because wiring is its responsibility.

Business logic must not copy this privilege.

---

# 96. Composition Root Must Stay Thin

The Composition Root should contain:

```text
wiring

registration

bootstrap
```

not business rules.

Bad:

```text
bootstrap file
    decides publication policy.
```

---

# 97. Source Dependency vs Runtime Call

These concepts must be distinguished.

### Source Dependency

```text
Module A imports types/code from Module B.
```

### Runtime Interaction

```text
Object A calls an implementation supplied at runtime.
```

Dependency inversion may make these directions different.

---

# 98. Example — Source vs Runtime

```text
Storage Contract
    defined by Storage Foundation

S3 Adapter
    imports Storage Contract

Runtime:
Media
    → Storage Contract
    → S3 Adapter
```

Media never imports the S3 Adapter.

---

# 99. Public Contract Dependency

A higher-level Capability may depend on lower-level public contracts.

It must avoid:

```text
private classes

internal repositories

provider SDK types

private persistence models.
```

---

# 100. Type-Only Dependencies Still Matter

A compile-time type import can still create architectural coupling.

Example:

```text
Anime
    imports
KnowledgeInternalEntityRecord
```

is still an invalid dependency even if only used as a TypeScript type.

---

# 101. Generated Types Still Matter

Generated ORM types must not be used as an excuse to bypass ownership.

Bad:

```text
every Platform imports generated database models directly.
```

Generated types should remain controlled by repository/persistence architecture.

---

# 102. Dependency Categories

AI World recognizes several forms of dependency:

```text
source-code dependency

runtime dependency

data dependency

contract dependency

operational dependency

deployment dependency
```

These are related but not identical.

---

# 103. Source-Code Dependency

Exists when one source area imports another.

These should be among the easiest dependency rules to automate.

---

# 104. Runtime Dependency

Exists when one Capability requires another to operate at runtime.

Example:

```text
Media
    requires
Storage.
```

---

# 105. Data Dependency

Exists when one Capability references data owned by another.

Example:

```text
Knowledge Entity
    references
Asset ID.
```

Data dependency does not imply mutation ownership.

---

# 106. Contract Dependency

Exists when one Capability relies on another Capability's public Contract.

This is the preferred form of cross-Capability dependency.

---

# 107. Operational Dependency

Exists when a runtime depends on infrastructure being available.

Example:

```text
AI Generation
    depends operationally on
AI Provider.
```

---

# 108. Deployment Dependency

Exists when deployment of one unit requires another deployment unit.

This becomes more significant if AI World later becomes distributed.

---

# 109. Canonical Allowed Dependency Matrix

The matrix below describes the default logical/source dependency policy.

| Consumer | Application | Universe | Platform | Kernel | Foundation | Concrete Adapter | External Provider |
|---|---:|---:|---:|---:|---:|---:|---:|
| Application | Conditional | Yes | Yes | Limited | Limited | No* | No* |
| Universe | No | Avoid | Yes | Yes | No | No | No |
| Platform | No | No | Conditional | Yes | Yes | No* | No* |
| Kernel | No | No | No | Conditional | Yes | No* | No* |
| Foundation | No | No | No | No | Conditional | No* | No* |
| Concrete Adapter | No | No | Contract only | Contract only | Contract only | Conditional | Yes |
| Composition Root | Yes | Yes | Yes | Yes | Yes | Yes | Configuration only |

```text
* Concrete Provider implementations should normally be supplied
  through dependency inversion and runtime composition.
```

---

# 110. Application-to-Application Dependencies

Applications should generally remain independently composable.

Examples:

```text
Public Web
```

should not import:

```text
Admin Application internals.
```

Shared behavior should move to an appropriately owned package/capability.

---

# 111. Universe-to-Universe Dependencies

Default:

```text
AVOID.
```

Use shared canonical Resource references and Platforms instead.

---

# 112. Platform-to-Platform Dependencies

Status:

```text
CONDITIONAL.
```

Allowed through public Contracts where the business dependency is legitimate and acyclic.

---

# 113. Kernel-to-Kernel Dependencies

Status:

```text
CONDITIONAL.
```

Keep the Kernel dependency graph small and acyclic.

---

# 114. Foundation-to-Foundation Dependencies

Status:

```text
CONDITIONAL.
```

Use only for technical dependency.

Examples:

```text
Migration → Database

Seed → Database
```

---

# 115. Application-to-Kernel Dependency

Allowed only when the Application genuinely needs the semantic primitive directly.

Example:

```text
Application-level serialization
    may use
Identifier public type.
```

Applications should normally consume Platform contracts instead of building business behavior directly on Kernel internals.

---

# 116. Application-to-Foundation Dependency

Allowed for application runtime concerns such as:

```text
Configuration

Logging

Tracing

Feature Flags
```

Not for bypassing Platform business ownership.

---

# 117. Universe-to-Kernel Dependency

Allowed for:

```text
definitions

schemas

registrations

typed semantic contracts
```

Example:

```text
History
    defines
Relationship Types
```

through Relationship contracts.

---

# 118. Universe-to-Foundation Dependency

Default:

```text
FORBIDDEN.
```

If Universe code needs Queue, Storage, Cache, or Database directly, ownership should be reviewed.

---

# 119. Platform-to-Foundation Dependency

Expected.

Examples:

```text
Media → Storage

Identity & Access → Database

AI / Creator → Queue

Discovery → Cache
```

when requirements justify them.

---

# 120. Kernel-to-Foundation Dependency

Expected when implementation requires technical infrastructure.

Example:

```text
Audit → Database
```

---

# 121. Foundation-to-Kernel Dependency

Default:

```text
FORBIDDEN.
```

Technical infrastructure must not require Platform semantic primitives.

---

# 122. Foundation-to-Platform Dependency

Strictly forbidden by default.

Example of invalid architecture:

```text
Email Foundation
    imports
Identity & Access User entity
```

---

# 123. Foundation-to-Universe Dependency

Strictly forbidden.

A Foundation must not care whether:

```text
Anime
History
Nature
```

exist.

---

# 124. Platform-to-Universe Dependency

Strictly forbidden by default.

Shared Platform code must not import named Universe implementations.

---

# 125. Kernel-to-Universe Dependency

Strictly forbidden.

---

# 126. Kernel-to-Platform Dependency

Strictly forbidden by default.

A Kernel Capability must remain lower-level than business Platforms.

---

# 127. Adapter-to-Contract Dependency

Allowed and expected.

An Adapter may import the Contract it implements.

---

# 128. Adapter-to-Domain Internal Dependency

Adapters should import only the minimum types/contracts necessary.

Avoid giving provider adapters access to entire Domain internals.

---

# 129. External SDK Dependency

External SDKs belong at the Integration Edge.

Examples:

```text
AI SDK

Email SDK

Storage SDK

Search SDK
```

They should not propagate upward unnecessarily.

---

# 130. Cross-Layer Data References

A Resource may reference another Capability using stable identifiers.

Example:

```text
Knowledge Entity
    stores
Asset ID
```

This is valid if Media remains canonical owner.

---

# 131. Cross-Layer Snapshot Duplication

If a Capability stores a copied snapshot from another owner for performance/history, it must be explicitly modeled as:

```text
derived

snapshot

denormalized

historical
```

rather than silently treated as a second canonical copy.

---

# 132. Direct Database Reads Across Platforms

Default:

```text
DISCOURAGED / FORBIDDEN AS BUSINESS INTEGRATION.
```

Even in one physical database.

Prefer public queries or deliberate read models.

---

# 133. Cross-Platform Foreign Keys

Physical foreign keys may be allowed.

Example:

```text
favorite.resourceId
```

or direct relational references where appropriate.

A foreign key does not authorize direct cross-owner mutation.

---

# 134. Cross-Platform Joins

Cross-owner joins may sometimes be useful for optimized read paths.

They must not quietly bypass ownership for business writes.

Read architecture will define whether:

```text
query layer

projection

database view

application composition
```

is appropriate.

---

# 135. Mutation Rule

A Capability should normally mutate only state it owns.

Preferred:

```text
Capability A
    requests
Capability B operation
```

rather than:

```text
Capability A
    updates
Capability B tables.
```

---

# 136. Read Rule

Reads may be more flexible than writes but must still respect encapsulation.

The wider the dependency, the more valuable an explicit query Contract becomes.

---

# 137. Event Rule

A producing Capability owns the semantics of the Event it publishes.

Consumers must not infer undocumented internal state.

---

# 138. Event Consumer Dependency

Event consumers may depend on published Event Contracts.

The producer must not depend on consumers.

Conceptually:

```text
Producer
    publishes Event

Consumer
    depends on Event Contract.
```

---

# 139. Event Dependency Direction

Example:

```text
Knowledge
    publishes EntityPublished

Discovery
    consumes EntityPublished
```

Knowledge must not import:

```text
DiscoveryIndexer
```

just because Discovery reacts to publication.

---

# 140. Asynchronous Decoupling

Events are appropriate when producer success should not require immediate consumer completion.

Examples:

```text
search indexing

analytics

some notifications
```

---

# 141. Synchronous Dependency

Use a synchronous Contract when the result is required to complete the current operation.

Example:

```text
Knowledge asks Media
whether an Asset reference is valid.
```

If immediate validation is a business requirement.

---

# 142. Synchronous Dependency Warning

Do not create long chains such as:

```text
A → B → C → D → E → F
```

for ordinary requests without examining:

```text
latency

failure propagation

ownership

transaction boundaries.
```

---

# 143. Event Chain Warning

Likewise avoid opaque chains:

```text
Event A
    triggers Event B
        triggers Event C
            triggers Event D
```

without clear ownership and observability.

---

# 144. Transaction Boundary

A transaction should normally stay inside one canonical data ownership/use-case boundary.

Cross-Platform transactions require stronger architectural justification.

---

# 145. Shared Database Transaction

A modular monolith may technically support transactions touching several owners.

Technical possibility does not automatically make this good architecture.

---

# 146. Cross-Platform Atomicity

If a business invariant genuinely spans Platforms, review whether:

```text
ownership is incorrectly split;

one Platform should coordinate the use case;

a shared lower-level concept exists;

eventual consistency is acceptable.
```

---

# 147. Application Coordination

Applications may coordinate independent operations for a user experience.

They should not create hidden multi-owner atomic invariants outside Platform ownership.

---

# 148. Dedicated Orchestration Capability

A complex business process spanning several Platforms may eventually justify a dedicated:

```text
application service

workflow

or orchestration capability.
```

Do not default to a generic orchestration framework.

---

# 149. Security Dependency

Security logic has two dimensions:

```text
Authorization infrastructure
    owned by Identity & Access

Domain rules
    owned by business Platform
```

These should cooperate without merging ownership.

---

# 150. Authentication Dependency

Applications may directly depend on Identity & Access for authentication.

Universe context is not required for general Platform authentication.

---

# 151. Authorization Dependency

Platforms may depend on Identity & Access Authorization contracts.

Identity & Access must remain independent from their internal business implementations.

---

# 152. Authorization Resource Description

A Platform should expose enough abstract Resource/Action context for authorization without exposing its internal persistence structure.

---

# 153. Policy Dependency

Platforms and Universes may use Kernel Policy capability when policy variability is appropriate.

Policy must not become a route around Platform ownership.

---

# 154. Audit Dependency

Platforms may emit audit information through the Audit capability.

Audit should not call back into business Platforms to reconstruct basic semantics whenever avoidable.

---

# 155. Observability Dependency

Every layer may depend on Observability Foundation.

This is an intentional exception to strict adjacent-layer thinking.

Example:

```text
Universe extension
    may emit structured telemetry
```

through approved instrumentation.

---

# 156. Observability Must Not Own Domain Decisions

Logs or metrics should not determine canonical business behavior.

---

# 157. Feature Flag Dependency

Applications and Platforms may consume Feature Flags.

Universes may also use controlled flags where rollout is Universe-scoped.

Feature Flags remain operational controls.

---

# 158. Configuration Dependency

Most runtime areas may depend on approved Configuration contracts.

Configuration Foundation must not depend back upward on those consumers.

---

# 159. Secrets Dependency

Higher layers should not directly read arbitrary secret stores.

Provider credentials should usually remain localized around:

```text
integration/configuration boundaries.
```

---

# 160. Provider Selection

Provider selection should occur within the Capability owning the provider abstraction or at Composition Root.

Universe code should not usually select concrete provider classes.

---

# 161. Universe AI Provider Preference

A Universe may express:

```text
quality preference

capability requirement

routing policy hint
```

but should avoid hard-coding:

```text
instantiate ProviderX SDK.
```

---

# 162. Universe Storage Selection

Universes should not decide where raw bytes are physically stored.

Media/Storage architecture owns that decision.

---

# 163. Universe Search Provider Selection

Universes may define:

```text
search fields

ranking configuration
```

but not normally concrete search-provider infrastructure.

---

# 164. Applications and Providers

Applications should not directly call external infrastructure providers for canonical business operations when an AI World Capability owns the boundary.

Bad:

```text
Admin UI backend
    directly invokes
AI Provider
```

Preferred:

```text
Admin
    → AI / Creator Platform
    → Provider Adapter.
```

---

# 165. Frontend Provider Calls

Some specialized client-side provider interactions may eventually be required.

Example:

```text
direct signed media upload.
```

Even then:

```text
AI World authorizes the operation;

AI World owns canonical Asset lifecycle;

temporary provider access is scoped.
```

---

# 166. Integration Edge Does Not Mean Vendor Lock-In

Concrete adapters may use vendor-specific functionality.

The rest of AI World should depend on stable capability semantics where meaningful.

---

# 167. Generic Provider Interface Warning

Avoid interfaces like:

```ts
interface Provider {
  execute(input: any): Promise<any>;
}
```

Such interfaces hide semantics rather than define them.

Prefer capability-oriented contracts.

---

# 168. Dependency Granularity

Consumers should depend on the smallest stable public contract that satisfies their requirement.

Avoid importing an entire Platform facade merely for one unrelated helper.

---

# 169. Capability-Specific Contracts

A Platform may expose multiple public contracts.

Example:

```text
KnowledgeReadContract

KnowledgeMutationContract

KnowledgeReferenceContract
```

if that improves dependency clarity.

This is not mandatory until real complexity requires it.

---

# 170. Read-Only Contract

Some consumers may need only stable read/reference access.

A narrow read contract can reduce coupling and privilege.

---

# 171. Mutation Contract

Mutation operations generally require stronger:

```text
authorization

validation

ownership guarantees.
```

These should remain explicit.

---

# 172. Architecture Boundary vs Package Boundary

One architectural boundary may be implemented by multiple packages.

One package should not casually contain multiple unrelated owners.

Repository Architecture will decide physical mapping.

---

# 173. Package Extraction

Do not extract a package solely because:

```text
the architecture diagram has a box.
```

Package extraction must improve:

```text
ownership

reuse

build boundaries

dependency enforcement.
```

---

# 174. Architecture Boundary vs Deployment Boundary

A Platform may remain one logical owner even if implemented across:

```text
API process

Worker process

specialized processing runtime.
```

---

# 175. Example — Media Physical Distribution

Future:

```text
Media API
Media Processing Workers
Media Transcoding Runtime
```

may all belong to:

```text
Media Platform.
```

---

# 176. Example — AI Physical Distribution

Future:

```text
AI API

AI Queue Workers

Model Gateway
```

may all remain owned by:

```text
AI / Creator Platform.
```

---

# 177. Service Extraction Rule

When a logical Capability becomes a networked service, internal contract may need promotion to:

```text
network contract

versioned API

integration event.
```

Do not rewrite its Domain semantics merely because transport changes.

---

# 178. Distributed Boundary Consequences

Physical distribution introduces:

```text
network failure

serialization

timeouts

retries

eventual consistency

deployment independence

observability requirements.
```

Extraction must justify these costs.

---

# 179. No Premature Physical Layering

AI World should not create:

```text
one microservice per layer.
```

That would create broad horizontal services and excessive coupling.

Logical layers are not deployment recommendations.

---

# 180. Platform-Level Vertical Ownership

Physical extraction, when needed, should generally follow coherent Capability ownership rather than technical layers.

Better future candidate:

```text
Media Processing Service
```

than:

```text
Repository Service
```

used by every Domain.

---

# 181. Shared Database Service Anti-Pattern

Do not create a network service whose purpose is:

```text
allow every Platform to remotely execute generic database operations.
```

This preserves no ownership.

---

# 182. Shared Utility Service Anti-Pattern

Do not deploy generic network services such as:

```text
CommonService

HelperService
```

without coherent capability semantics.

---

# 183. Cross-Cutting Concerns Are Not Layers

The following are important but are not separate semantic layers:

```text
Security

Quality

Testing

Documentation

Data Architecture

Observability

Governance
```

They apply across appropriate layers.

---

# 184. Security Is Cross-Cutting

Security responsibilities occur at:

```text
Application boundaries

Identity & Access

Platform Domain invariants

Provider boundaries

Operations.
```

Security is not one isolated module that magically secures everything.

---

# 185. Testing Is Cross-Cutting

Each layer should be tested according to its responsibilities.

Examples:

```text
Foundation integration tests

Kernel behavior tests

Platform Domain tests

Universe configuration tests

Application E2E tests.
```

---

# 186. Documentation Is Cross-Cutting

Each major Capability documents its own responsibility.

Architecture documents define cross-Capability rules.

---

# 187. Data Architecture Is Cross-Cutting

Data ownership follows capability boundaries.

Physical persistence may span several layers or capabilities.

The dedicated Data Architecture documents will define persistence strategy later.

---

# 188. Localization Is Kernel but Also Cross-Cutting in Use

Localization is a Kernel Capability because it provides shared semantics.

Its behavior may be consumed throughout the product.

Being widely used does not make something an architectural layer.

---

# 189. Events Are Kernel but Not a Layer

Events enable interaction.

They do not become a middleware layer through which every operation must pass.

---

# 190. Workflow Is Kernel but Not Mandatory

Workflow capability may be broadly reusable.

That does not mean every operation must enter Workflow.

---

# 191. Policy Is Kernel but Not Universal Business Logic

Policy supports configurable contextual decisions.

Stable business invariants remain in owning Platforms.

---

# 192. Dependency Rule — Prefer Ownership Over Convenience

When choosing between:

```text
quick direct import
```

and:

```text
owned public contract,
```

prefer the owned contract when the dependency crosses an architectural boundary.

---

# 193. Dependency Rule — Do Not Hide Violations

Avoid hiding invalid imports behind:

```text
barrel exports

global dependency injection

reflection

service locators

runtime string lookups.
```

A hidden dependency is still a dependency.

---

# 194. Dependency Rule — Explicit Registration

Where extensibility is required, prefer explicit:

```text
registration

configuration

contract implementation
```

over magical file discovery unless discovery provides clear value and remains understandable.

---

# 195. Dependency Rule — Avoid Global Mutable Registries

Registries should have controlled ownership and lifecycle.

Avoid:

```text
any module can register anything at any time.
```

---

# 196. Dependency Rule — Avoid Shared Mutable State

Shared mutable global state creates implicit dependencies.

Prefer state owned by explicit capabilities or request/runtime contexts.

---

# 197. Dependency Rule — Stable IDs Across Boundaries

When one Capability references another, stable identifiers should normally cross the boundary rather than internal persistence objects.

---

# 198. Dependency Rule — No ORM Entity Passing Across Boundaries by Default

Avoid:

```text
MediaRepository ORM row
```

being passed directly into:

```text
Knowledge Domain logic.
```

Use public Resource/reference contracts.

---

# 199. Dependency Rule — No Provider Object Passing Upward

Avoid:

```text
OpenAI response object

S3 SDK object

Elasticsearch hit
```

becoming Domain/public Platform contracts.

---

# 200. Dependency Rule — No Request Object in Domain

Framework-specific request/response objects should remain at Application boundaries.

Domain and Platform logic should receive meaningful typed inputs.

---

# 201. Dependency Rule — No Environment Variable Reads Everywhere

Avoid:

```text
process.env
```

scattered through Domain logic.

Runtime configuration should enter through the Configuration boundary.

---

# 202. Dependency Rule — No Logger Construction Everywhere

Capabilities should use approved Observability contracts rather than independently constructing provider loggers where architecture provides centralized behavior.

---

# 203. Dependency Rule — No Raw Queue Publishing Everywhere

Platforms should publish meaningful Jobs/Events through owned contracts.

Do not let business code scatter provider queue payloads throughout the system.

---

# 204. Dependency Rule — No Raw Cache Access From Universe Logic

If Universe-specific behavior depends heavily on direct cache manipulation, the abstraction boundary should be reviewed.

---

# 205. Dependency Rule — No Raw Storage Access From Knowledge

Knowledge should reference Assets or Media contracts.

It should not retrieve arbitrary storage provider objects unless a specific infrastructure-level use case is intentionally designed.

---

# 206. Dependency Rule — No Direct AI SDK From Universe

Universe AI behavior must flow through AI / Creator Platform contracts.

---

# 207. Dependency Rule — No Direct Email SDK From Identity

Identity & Access may request Email Foundation capability.

It should not embed provider-specific Email SDK semantics.

---

# 208. Dependency Rule — No Search Provider Types in Public APIs

Discovery translates provider results into AI World search contracts.

---

# 209. Dependency Rule — No Application Routes in Domain Identity

Routes belong to Applications.

Canonical identifiers belong to owning Platform/Kernel semantics.

---

# 210. Dependency Rule — No UI Component Dependency in Domain

Platform Domain logic must not depend on React/Vue/frontend components or page structure.

---

# 211. Dependency Rule — Universe Presentation Does Not Own Knowledge

Universe-specific presentation may depend on Knowledge.

Knowledge must remain independent from its current presentation.

---

# 212. Layer Skipping Rule

Layer skipping is permitted when responsibility justifies it.

For example:

```text
Application
    → Identity & Access
```

is valid.

The Application does not need:

```text
Universe
    → Knowledge
```

in between.

---

# 213. Layer Skipping Does Not Mean Ownership Bypass

Invalid:

```text
Application
    → Database Foundation
```

for business mutation merely because direct technical access exists.

---

# 214. Adjacent-Layer Rule Is Not Mandatory

AI World does not require:

```text
L5 must only import L4

L4 must only import L3
```

Such rigid layering would create unnecessary wrappers.

The rule is:

```text
depend only on appropriately owned lower/public capability boundaries.
```

---

# 215. Layer Depth Principle

Use the fewest architectural layers necessary to preserve:

```text
ownership

semantic clarity

replaceability.
```

---

# 216. Example — Login

Correct conceptual path:

```text
Web Application
    ↓
Identity & Access
    ↓
Database / security infrastructure
```

Universe and Knowledge are irrelevant.

---

# 217. Example — Anime Entity Page

```text
Public Web
    ↓
Anime Universe Context
    ↓
Knowledge
    ├── Media references
    ├── Engagement state
    └── Discovery links
```

Application may compose these Platform responses.

---

# 218. Example — History Publication

```text
Creator Application
    ↓
History Context
    ↓
Knowledge Platform
    ├── Authorization
    ├── Workflow
    ├── Policy
    └── Database
        ↓
EntityPublished
        ↓
Discovery
```

---

# 219. Example — Media Upload

```text
Creator Application
    ↓
Media Platform
    ↓
Storage Foundation
    ↓
Storage Adapter
    ↓
External Storage Provider
```

---

# 220. Example — AI Generation

```text
Creator Application
    ↓
AI / Creator Platform
    ├── Identity & Access
    ├── Knowledge public query contract
    ├── Policy
    └── AI Provider Contract
            ↓
       Provider Adapter
            ↓
       External AI Provider
```

---

# 221. Example — Search

```text
Public Web
    ↓
Discovery Platform
    ↓
Search Contract
    ↓
Search Adapter / Index
```

Knowledge supplies canonical content to indexing flows.

---

# 222. Example — Email Verification

```text
Web/API Application
    ↓
Identity & Access
    ↓
verification state
    ↓
Email Foundation
    ↓
Email Adapter
    ↓
Email Provider
```

Email Foundation does not own verification state.

---

# 223. Example — Scheduled Publication

```text
Scheduler Foundation
    triggers
Platform-owned scheduled command/job
        ↓
Owning Platform
        ↓
Authorization/System Policy
        ↓
Publication
```

Scheduler does not own publication semantics.

---

# 224. Example — Search Index Update

```text
Knowledge
    publishes EntityPublished
        ↓
Discovery Event Handler
        ↓
Search Index Adapter
        ↓
Search Provider
```

Knowledge does not call concrete search SDK.

---

# 225. Example — Cross-Universe Relationship

```text
Anime Resource
      │
      └──── Relationship ──── History Resource
                     │
                     ▼
             Relationships Kernel
```

No direct Universe repository dependency is required.

---

# 226. Example — User Favorite

```text
User
    ↓
Engagement Platform
    ↓
Resource Reference
```

Engagement references the Resource.

It does not own its canonical state.

---

# 227. Example — CMS Composition

```text
Creator/Admin
    ↓
Composition / CMS
    ├── Knowledge public contract
    ├── Media public contract
    └── Workflow
```

Composition does not reach into Knowledge repositories.

---

# 228. Forbidden Example — Foundation Knows Universe

```text
StorageFoundation.saveAnimeCharacterImage(...)
```

Incorrect because Storage has acquired Domain knowledge.

---

# 229. Preferred Foundation Contract

```text
Storage.store(object)
```

with Media determining the Asset semantics.

---

# 230. Forbidden Example — Kernel Knows Platform

```text
MetadataEngine.validateUserProfile(...)
```

if Metadata is intended as generic Kernel capability.

User-specific metadata semantics belong to User Platform.

---

# 231. Preferred Kernel Contract

```text
Metadata
    validates against
registered Metadata Definition
```

with User Platform supplying the relevant definition.

---

# 232. Forbidden Example — Platform Knows Universe

```text
KnowledgeService.createAnimeCharacter(...)
```

inside generic Knowledge core.

---

# 233. Possible Preferred Model

```text
Anime Domain Definition
    supplies Character semantics

Knowledge Platform
    provides reusable Knowledge capability.
```

Detailed Knowledge architecture will determine exact modeling.

---

# 234. Forbidden Example — Universe Knows Provider

```text
AnimeImageGenerator
    imports
VendorAI SDK directly.
```

---

# 235. Preferred AI Boundary

```text
Anime behavior
    ↓
AI / Creator Platform
    ↓
ImageGeneration capability
    ↓
Provider Adapter.
```

---

# 236. Forbidden Example — App Owns Domain Transaction

```text
Controller
    manually updates
Knowledge + Media + User tables.
```

---

# 237. Preferred Application Boundary

```text
Controller
    invokes
owned Platform use case(s).
```

---

# 238. Forbidden Example — Database as Service Locator

Do not let modules query arbitrary tables to discover functionality or ownership.

Architecture must remain explicit.

---

# 239. Forbidden Example — Shared Utils Becomes Layer

A folder such as:

```text
shared/utils
```

must never become an unofficial layer containing:

```text
business rules

database access

security

provider integrations.
```

---

# 240. Forbidden Example — Common Domain

There is no default:

```text
Common Domain
```

where concepts go when ownership is unclear.

Ownership must be resolved.

---

# 241. Forbidden Example — Everything Uses Kernel Directly

Platforms should use Kernel capabilities where meaningful.

Applications and Universes should not assemble business architecture entirely from Kernel primitives when a Platform already owns the relevant behavior.

---

# 242. Kernel Bypass Example

Bad:

```text
Admin Application
    directly manipulates Metadata tables
```

Preferred:

```text
Admin
    uses owning Platform/CMS operation
```

which may internally use Metadata.

---

# 243. Runtime Composition Principle

The final executable runtime may contain modules from multiple layers.

Example:

```text
API Runtime
    includes
Applications
Platforms
Kernel
Foundations
Adapters
```

This does not collapse their logical boundaries.

---

# 244. Build Dependency Principle

Where tooling permits, build/import boundaries should mirror logical dependency rules.

Future architecture tests may enforce this automatically.

---

# 245. Architecture Test Candidates

Potential automated rules:

```text
Foundation cannot import Platform.

Foundation cannot import Universe.

Kernel cannot import Platform.

Kernel cannot import Universe.

Platform cannot import Universe.

Universe cannot import Foundation.

Universe cannot import provider SDKs.

Application cannot import Platform internals.

Platform cannot import peer Platform internals.
```

---

# 246. Enforcement Timing

These rules should be automated after the repository structure exists and the enforcement provides useful value.

Phase 0 does not require implementation tooling.

---

# 247. Exceptions

An architecture rule may occasionally require an exception.

An exception must be:

```text
explicit

narrow

justified

documented

reviewable.
```

---

# 248. Exception Is Not New Default

One exception must not silently redefine the architecture.

If the same exception repeats, the architecture itself should be reviewed.

---

# 249. Dependency Exception Review

When requesting an exception, answer:

```text
Why is the dependency required?

Why can the public Contract not satisfy it?

Why can the responsibility not move?

Will it create a cycle?

Will other consumers copy the pattern?

What is the migration path away from it?
```

---

# 250. Stable Inner Layers

Generally, lower semantic layers should change less frequently than higher ones.

Expected trend:

```text
Foundations / Kernel
    stable reusable capability

Platforms
    evolve with business capability

Universes
    evolve with domain/content

Applications
    evolve fastest with product experience
```

This is a tendency, not an absolute law.

---

# 251. Stable Does Not Mean Frozen

Foundations and Kernel will still evolve.

Their broader consumer impact means changes require more deliberate compatibility consideration.

---

# 252. Change Propagation Goal

A change should propagate only as far as the public Contract requires.

Example:

```text
Storage provider replacement
```

should ideally affect:

```text
Storage Adapter

configuration

provider-specific tests
```

not:

```text
Anime

History

Knowledge Domain.
```

---

# 253. Universe Change Propagation Goal

Adding:

```text
Nature Universe
```

should primarily affect:

```text
Nature definitions

Nature content

Nature presentation

possibly new reusable capability discovered through validation.
```

---

# 254. Application Change Propagation Goal

Redesigning the Public Web should not require migration of canonical Knowledge simply because page layout changes.

---

# 255. Kernel Change Propagation Risk

A breaking Kernel Contract may affect many Platforms.

Therefore Kernel public surfaces should remain deliberately small.

---

# 256. Foundation Change Propagation Risk

Changing a Foundation implementation should be isolated by stable technical contracts where meaningful.

---

# 257. Platform Change Propagation Risk

A Platform Contract used by many Applications/Universes should evolve through deliberate compatibility practices.

---

# 258. Universe Change Risk

Universe-specific behavior should remain isolated enough that modifying Anime does not unexpectedly change History.

---

# 259. Layer Ownership Summary

```text
APPLICATION
    owns delivery/presentation/runtime entry concerns

UNIVERSE
    owns domain-world specialization

PLATFORM
    owns major reusable business capabilities

PLATFORM KERNEL
    owns broadly reusable semantic primitives

FOUNDATION
    owns reusable technical infrastructure

ADAPTER
    owns translation to implementation/provider

EXTERNAL PROVIDER
    owns external execution/infrastructure behavior
```

---

# 260. Layer Dependency Summary

Preferred:

```text
Application
    → Universe / Platform / selected lower public contracts

Universe
    → Platform / Kernel public contracts

Platform
    → Kernel / Foundations / selected peer Platform contracts

Kernel
    → Foundations / selected Kernel contracts

Foundation
    → selected Foundations / its provider Ports

Adapter
    → contract it implements + external SDK

Composition Root
    → concrete implementations for wiring
```

---

# 261. Forbidden Dependency Summary

Default forbidden:

```text
Foundation → Kernel

Foundation → Platform

Foundation → Universe

Foundation → Application

Kernel → Platform

Kernel → Universe

Kernel → Application

Platform → Universe

Platform → Application

Universe → Foundation

Universe → Provider SDK

Business code → Concrete Provider Adapter

Platform → Peer Platform internal code

Application → Platform internal code
```

---

# 262. Layering and Reuse

Higher-level code is usually more specific.

Lower-level code is usually more reusable.

Conceptually:

```text
Anime Character Page
    highly specific

Anime Universe
    domain-specific

Knowledge Platform
    reusable across Universes

Relationships Kernel
    reusable across Platforms

Database Foundation
    technical infrastructure
```

---

# 263. Reuse Does Not Require Moving Downward

A feature used by two Universes might belong in a Platform.

It does not automatically belong in Kernel.

A feature used by two Platforms might still belong in one Platform exposed through a public Contract.

---

# 264. Lowest Possible Layer Is Not the Goal

Do not force logic downward merely to maximize reuse.

The correct layer is determined by:

```text
ownership

semantics

stability

consumer scope.
```

---

# 265. Highest Possible Layer Is Not the Goal

Likewise, do not leave reusable infrastructure inside one Application or Universe when multiple consumers clearly require it.

---

# 266. Layer Selection Questions

When placing a new capability, ask:

```text
Is this presentation/runtime behavior?

Is this Universe-specific meaning?

Is this a major reusable business capability?

Is this a broadly reusable semantic primitive?

Is this technical infrastructure?

Is this merely a concrete provider implementation?
```

---

# 267. Application Candidate

Likely Application-layer concerns:

```text
HTTP routing

frontend navigation

UI state

transport serialization

request correlation entry point

runtime bootstrap.
```

---

# 268. Universe Candidate

Likely Universe concerns:

```text
Anime Episode definition

History source requirements

Universe-specific taxonomy

domain AI instructions

Universe presentation.
```

---

# 269. Platform Candidate

Likely Platform concerns:

```text
Asset management

Search

User Preferences

Authentication

Knowledge management

CMS publishing.
```

---

# 270. Kernel Candidate

Likely Kernel concerns:

```text
stable identifiers

generic relationships

generic metadata definitions

generic taxonomy mechanics.
```

---

# 271. Foundation Candidate

Likely Foundation concerns:

```text
database transaction support

object storage

email transport

queue execution

configuration loading.
```

---

# 272. Adapter Candidate

Likely Adapter concerns:

```text
translate AI request to Provider X

translate Storage contract to Provider Y

translate Email contract to Provider Z.
```

---

# 273. Layering and Future Proof Universes

Anime and History must challenge the layer model.

If Anime-specific logic appears in Foundation or Kernel, it is likely misplaced.

If History requires duplicate Media or Search infrastructure, the Platform boundary is likely incomplete.

---

# 274. Third Universe Test

A third Universe should test whether:

```text
shared lower layers remain unchanged;

existing Platforms are reusable;

new differences stay in Universe/domain definitions.
```

---

# 275. Layering and AI

AI is a Platform, not a Foundation.

Why?

Because AI World owns meaningful business concepts such as:

```text
Generation

Prompt

AI Tool

Model capability

Provenance

Evaluation
```

AI is more than technical transport.

---

# 276. AI Provider Integration

Concrete AI Provider adapters live at the Integration Edge and implement AI Platform contracts.

---

# 277. Layering and Search

Discovery is a Platform because Search semantics are product/business capability.

A concrete search engine is Integration infrastructure.

---

# 278. Layering and Storage

Storage is a Foundation because it deals with technical object persistence.

Media is a Platform because it owns Asset semantics.

---

# 279. Layering and Email

Email delivery is a Foundation.

Future Notification semantics may belong to Engagement or another appropriately owned Platform capability.

---

# 280. Layering and Database

Database is Foundation.

Persisted Domain models remain owned by Platforms/Kernel capabilities.

---

# 281. Layering and Repository

Repository Infrastructure is Foundation only when providing technical persistence primitives.

Domain Repositories belong to their owning Platform or Kernel capability.

---

# 282. Layering and Migration

Migration execution mechanics may belong to Foundation.

Migration definitions belong to the capability whose data evolution they perform.

---

# 283. Layering and Seed

Seed execution mechanics belong to Foundation.

Seed definitions belong to their relevant environment/capability ownership.

---

# 284. Layering and Audit

Audit remains Kernel because accountability semantics may cross many Platforms.

Storage of Audit Records may use Database Foundation.

---

# 285. Layering and Observability

Observability remains Foundation because it is technical runtime instrumentation.

Audit must not be folded into Observability merely because both record information.

---

# 286. Layering and Policy

Policy remains Kernel only where policy mechanics are reusable.

Identity & Access retains Authorization ownership.

Business Platforms retain Domain invariants.

---

# 287. Layering and Workflow

Workflow remains Kernel only where reusable business-process mechanics emerge.

Platform-specific lifecycle logic need not use Workflow automatically.

---

# 288. Layering and Versioning

Versioning remains Kernel if multiple Platforms require reusable revision semantics.

Otherwise early versioning logic may remain local until genericity is proven.

---

# 289. Layering and Localization

Localization belongs in Kernel because localized semantic values may span:

```text
Knowledge

Taxonomy

CMS

Universe configuration.
```

Frontend translation infrastructure may also exist at Application level.

---

# 290. Layering and Feature Flags

Feature Flags remain Foundation.

Universe-specific permanent configuration does not belong there.

---

# 291. Layering and Operations

Operations Platform contains product/business operational capability.

Technical logging/metrics/tracing remain Observability Foundation.

Deployment tooling belongs to engineering/operations infrastructure rather than Operations Platform Domain by default.

---

# 292. Layering and Admin

Admin is an Application.

It consumes Platforms.

There should not be a giant:

```text
Admin Domain
```

owning data merely because admins manipulate that data.

---

# 293. Layering and Public Web

Public Web is Application.

Knowledge, Media, Engagement, and Discovery remain lower reusable capabilities.

---

# 294. Layering and API

API transport is Application layer.

API route organization must not determine Platform ownership.

---

# 295. Layering and Worker

Worker is Application/runtime layer.

Job semantics belong to owning Platform.

Queue mechanics belong to Foundation.

---

# 296. Layering and Scheduler

Scheduler is Foundation.

A scheduled business use case belongs to the Platform that owns the operation.

---

# 297. Layering and Import

Generic ingestion mechanics may eventually become a shared capability if proven reusable.

Domain import rules remain with their owning Platform/Universe.

Do not create an Ingestion Platform prematurely.

---

# 298. Layering and Export

Export concerns may span:

```text
Application

owning Platform

Storage
```

depending on semantics.

No generic Export Framework is assumed yet.

---

# 299. Layering and Analytics

Product Analytics is currently not finalized as a major Platform.

Operational analytics may belong to Operations.

Telemetry belongs to Observability.

Derived data ownership will be refined later.

---

# 300. Layering and Recommendations

Recommendations likely belong within Discovery unless future scale and semantics justify separate Platform ownership.

Do not create Recommendation Platform prematurely.

---

# 301. Layering and Notifications

Notification semantics may eventually belong to Engagement or a dedicated capability if requirements justify it.

Email transport remains Foundation.

---

# 302. Layering and Payments

Payment is not currently a defined Platform because monetization requirements do not yet justify one.

It must not be pre-created merely because future products may charge money.

---

# 303. Layering and Organizations

Organization/Tenant concepts are not currently established.

They must not be forced into Universe architecture.

---

# 304. Layering and Plugins

A public Plugin layer does not currently exist.

First-party typed Extensions belong to the layer supplying the specialized behavior.

---

# 305. Layering and Extensions

An Extension is not a separate layer.

It is an implementation mechanism associated with:

```text
Universe

Platform

or Provider integration
```

depending on ownership.

---

# 306. Layering and Registries

Registry is not a layer.

A Registry belongs to the Capability that owns the registered concept.

---

# 307. Layering and Events

Event Bus infrastructure does not become a layer.

Events remain a Kernel capability and messaging infrastructure may use Foundation/provider implementations.

---

# 308. Layering and Contracts

Contracts exist at boundaries between layers/capabilities.

Contracts themselves are not a separate runtime layer.

---

# 309. Layering and Shared Packages

A shared package must still have architectural ownership.

Example:

```text
contracts package
```

may contain deliberately public cross-application contracts.

It does not become an ownership-free area.

---

# 310. Layering and Generated Code

Generated code must also obey ownership boundaries where practical.

Generation tools should not expose every database type across all packages.

---

# 311. Layering and Tests

Tests may cross implementation boundaries intentionally to validate integration.

Production source dependency rules still remain authoritative.

Test helpers should not become a way for production code to bypass architecture.

---

# 312. Layering and Development Tools

CLI and development tooling may depend on multiple layers when their role is orchestration.

Example:

```text
migration CLI

seed CLI

validation CLI
```

Such tooling should remain outside ordinary business dependency paths.

---

# 313. Tooling Composition Exception

Like Composition Root, certain operational tools may legitimately wire multiple capabilities.

Their privileges must remain narrow to the tool's purpose.

---

# 314. Layering and Documentation

Documentation mirrors architecture conceptually.

It does not require source code to mirror the documentation tree one-to-one.

---

# 315. Architecture Layers vs Documentation Areas

Examples:

```text
docs/04-foundations/
```

documents Foundation capabilities.

```text
docs/05-platform-kernel/
```

documents Kernel.

```text
docs/06-platforms/
```

documents major Platforms.

```text
docs/07-universes/
```

documents Universe architecture.

---

# 316. Dependency Documentation

Every substantial Platform/Kernel/Foundation architecture document should eventually state:

```text
Allowed Dependencies

Forbidden Dependencies

Public Consumers
```

where relevant.

---

# 317. Capability README

A Capability README should summarize:

```text
classification

owner

status

purpose

public entry points.
```

---

# 318. Architecture Review Requirement

Review layer placement whenever a new Capability:

```text
spans several owners;

requires reverse dependency;

requires a Kernel addition;

requires a Foundation addition;

introduces a new Provider abstraction;

introduces cross-Universe coupling.
```

---

# 319. Layering Anti-Pattern — Horizontal Technical Business Architecture

Bad:

```text
controllers/
services/
repositories/
models/
```

as the primary project-wide architecture where every Domain is mixed together.

Technical roles may exist inside owned capability boundaries.

---

# 320. Preferred Capability Ownership

Conceptually:

```text
knowledge/
    application
    domain
    persistence
```

may be more maintainable than global:

```text
services/
    knowledge.service

repositories/
    knowledge.repository
```

The exact repository structure remains undecided.

---

# 321. Layering Anti-Pattern — Strict Onion Everywhere

AI World does not require every module to implement the same textbook layered architecture.

Patterns should protect real boundaries, not create boilerplate.

---

# 322. Layering Anti-Pattern — UI-Led Backend Modules

Avoid backend ownership such as:

```text
HomepageModule

SearchPageModule

ProfileScreenService
```

when the underlying capability is reusable beyond one screen.

---

# 323. Layering Anti-Pattern — Database-Led Modules

Avoid modules whose architecture is derived purely from tables without Domain ownership.

---

# 324. Layering Anti-Pattern — Provider-Led Modules

Avoid Domain modules named primarily after vendors when the real capability is broader.

Bad:

```text
OpenAIModule
```

as AI architecture.

Preferred:

```text
AI / Creator Platform
    +
Provider Adapter.
```

---

# 325. Layering Anti-Pattern — Universe-Led Infrastructure

Avoid:

```text
AnimeQueue

HistoryDatabase

AnimeStorage
```

without independent operational justification.

---

# 326. Layering Anti-Pattern — Kernel Dumping Ground

Do not move difficult ownership problems into Kernel just to remove cycles.

---

# 327. Layering Anti-Pattern — Foundation Dumping Ground

Do not place business logic in Foundations because many modules need it.

---

# 328. Layering Anti-Pattern — Application Mega Orchestrator

Applications should not accumulate business rules simply because they can call every Platform.

---

# 329. Layering Anti-Pattern — Cross-Platform Repository Access

Do not use another Platform's Repository as its public API.

---

# 330. Layering Anti-Pattern — Provider Adapter Exposed Publicly

Consumers should not generally instantiate or invoke concrete Adapters directly.

---

# 331. Layering Anti-Pattern — Composition Root Business Logic

The Composition Root wires implementations.

It must not become the place where business decisions are made.

---

# 332. Layering Anti-Pattern — Layer Number as Importance

L1 is not less important than L5.

Layer numbers describe dependency position, not product priority.

---

# 333. Layering Anti-Pattern — Build Entire Lower Layer First

The architecture does not require implementing all Foundations and Kernel capabilities before any Platform work.

Implementation should be demand-driven.

---

# 334. Incremental Layer Implementation

Preferred:

```text
Platform requirement
      ↓
identify required Kernel/Foundation capability
      ↓
implement minimal reusable capability
      ↓
integrate vertical slice
      ↓
validate.
```

---

# 335. Example Incremental Flow

Identity & Access may require:

```text
Configuration

Database

Observability
```

early.

It may not require:

```text
Taxonomy

Relationships

Versioning.
```

Therefore those Kernel capabilities should remain unimplemented until consumers need them.

---

# 336. Layering and Roadmap

Architecture defines valid dependency direction.

Roadmap decides implementation sequence.

A lower layer may be documented before implementation but remain unbuilt.

---

# 337. Layering and Capability Map

The Capability Map will classify all planned major capabilities under these layers.

This document defines the rules the map must follow.

---

# 338. Layering and Ownership Model

The Ownership Model will identify the canonical owner of major concepts.

Layering and ownership must agree.

---

# 339. Layering and Dependency Rules

P0-D14 will convert this document's high-level constraints into more precise dependency governance and enforcement rules.

---

# 340. Layering and Extension Model

P0-D15 will define how dependency inversion works for:

```text
Universe Extensions

Provider Adapters

Strategies

Registries

configuration.
```

---

# 341. Layering and Repository Architecture

P0-D16 will determine how these logical boundaries map into source structure.

Repository structure must make invalid dependencies difficult.

---

# 342. Layering and Technology Strategy

P0-D17 will select technologies that support:

```text
modularity

public/private imports

dependency injection

testing

provider isolation

monorepo boundaries.
```

---

# 343. Layering Success Criteria

This model succeeds when:

```text
Foundations can be reused without knowing business Domains;

Kernel capabilities remain Universe-neutral;

Platforms own coherent business capabilities;

Universes specialize rather than duplicate;

Applications remain replaceable delivery surfaces;

provider changes stay near integration boundaries;

cross-Platform dependencies remain explicit;

future service extraction preserves existing Domain ownership.
```

---

# 344. Layering Warning Indicators

Review the architecture if:

```text
Foundation imports a Platform;

Kernel imports Universe code;

Platform imports a named Universe;

Universe imports database/provider SDK;

Application manipulates canonical persistence directly;

Platform imports peer internal repository;

provider types appear in public Domain Contracts;

many dependency cycles require framework workarounds;

Kernel grows faster than Platforms;

new Universes require duplicate infrastructure.
```

---

# 345. Layering Health Questions

Periodically ask:

```text
Can each Capability explain why it belongs in its layer?

Are lower layers still more reusable?

Are Provider SDKs isolated?

Are Universe-specific assumptions moving downward?

Are cross-Platform Contracts intentional?

Are we using Events where appropriate rather than everywhere?

Can an Application be redesigned without rewriting Domain logic?

Could a Provider be replaced without changing Universe code?
```

---

# 346. Layer Selection Checklist

Before creating a new architectural capability:

```text
If it is primarily delivery/presentation:
    Application

If it defines one domain world's specialization:
    Universe

If it owns a reusable business capability:
    Platform

If it provides broadly reusable semantic mechanics:
    Platform Kernel

If it provides technical infrastructure:
    Foundation

If it translates to one technology/provider:
    Adapter / Integration Edge
```

---

# 347. Dependency Approval Checklist

Before adding a cross-boundary dependency:

```text
Who owns the required concept?

Is there already a public Contract?

Is the direction downward?

Is this a peer Platform dependency?

Could it create a cycle?

Is synchronous access required?

Would an Event be better?

Is only a stable identifier needed?

Are Provider details leaking?

Could Application composition solve the use case instead?

Will future Universes inherit this coupling?
```

---

# 348. Layer Invariants

The following are formal architectural invariants:

```text
1. Applications may consume Platforms but must not own canonical Domain truth.

2. Universes depend on shared Platforms; shared Platforms do not depend on named Universes.

3. Universes normally do not depend directly on Foundations.

4. Platforms may depend on Kernel, Foundations, and deliberate peer Platform public Contracts.

5. Platforms must not depend on Application implementations.

6. Kernel must not depend on Platforms or Universes.

7. Foundations must not depend on Kernel business semantics, Platforms, or Universes.

8. Foundation code remains Domain-neutral.

9. Concrete Provider Adapters depend on the Contracts they implement, not the reverse.

10. Core business code must not depend on concrete Provider Adapters.

11. Composition Roots may wire concrete implementations but must not own business logic.

12. Cross-Platform business writes must use owning Capability operations.

13. Search, Cache, and Analytics remain derived unless explicitly designed otherwise.

14. Public Contracts protect architectural boundaries.

15. Layer skipping is allowed when responsibility is valid; ownership bypass is not.

16. Logical layers do not imply microservices.

17. Cross-layer dependency cycles are architectural defects unless explicitly justified.

18. Shared does not mean unowned.

19. Genericity does not justify moving everything downward.

20. Implementation order is driven by requirements, not by completing every lower layer first.
```

---

# 349. Current Layer Classification

```text
L5 — APPLICATIONS

    Public Web              PLANNED
    Creator/Admin           PLANNED
    API                     PLANNED
    Workers                 PLANNED


L4 — UNIVERSES

    Anime                   PROOF UNIVERSE / PLANNED
    History                 PROOF UNIVERSE / PLANNED


L3 — PLATFORMS

    Identity & Access       PLANNED
    User                    PLANNED
    Knowledge               PLANNED
    Media                   PLANNED
    Discovery               PLANNED
    AI / Creator            PLANNED
    Composition / CMS       PLANNED
    Engagement              PLANNED
    Operations              PLANNED


L2 — PLATFORM KERNEL

    Identifiers             PLANNED
    Namespace               PLANNED
    Taxonomy                PLANNED
    Metadata                PLANNED
    Relationships           PLANNED
    Events                  PLANNED
    Audit                   PLANNED
    Workflow                PLANNED
    Policy                  PLANNED
    Localization            PLANNED
    Versioning              PLANNED


L1 — FOUNDATIONS

    Configuration           PLANNED
    Database                PLANNED
    Repository              PLANNED
    Migration               PLANNED
    Seed                    PLANNED
    Storage                 PLANNED
    Cache                   PLANNED
    Queue                   PLANNED
    Scheduler               PLANNED
    Email                   PLANNED
    Observability           PLANNED
    Feature Flags           PLANNED
```

No implementation status is implied merely by the existence of documentation folders.

---

# 350. What This Document Decides

This document decides:

```text
the five primary semantic layers;

their core responsibilities;

default dependency direction;

the special Integration Edge;

Composition Root exception;

Universe dependency rules;

Platform peer dependency policy;

Kernel dependency policy;

Foundation neutrality;

provider dependency inversion;

cross-owner mutation restrictions;

logical-layer independence from deployment topology.
```

---

# 351. What This Document Does Not Decide

This document does not decide:

```text
exact source folders

exact package structure

exact Nest/Next or framework modules

database schema

ORM

provider technologies

API protocols

queue implementation

event broker

deployment topology

exact dependency enforcement tool.
```

---

# 352. Relationship to P0-D12

The next document:

```text
P0-D12 — Capability Map
```

will take these layers and map the actual AI World capability landscape onto them.

It will answer:

```text
What capabilities exist?

Which layer owns each capability?

What are the major sub-capabilities?

Who consumes them?

Which are foundational now?

Which are future capabilities?
```

---

# 353. Final Layering Statement

> **AI World uses logical layers to protect responsibility rather than to create ceremony. Applications deliver experiences; Universes supply domain specialization; Platforms own reusable business capabilities; the Platform Kernel supplies stable shared semantics; Foundations provide domain-neutral technical infrastructure; and concrete provider implementations remain isolated at integration boundaries. Dependencies must preserve this ownership direction while allowing direct, intentional public-contract interaction where the use case requires it.**

The architecture should remain simple enough to build today and strong enough to evolve tomorrow.

---

# 354. Acceptance

```text
DOCUMENT
P0-D11 — AI World Platform Layers

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

NEXT DOCUMENT
P0-D12 — Capability Map

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```