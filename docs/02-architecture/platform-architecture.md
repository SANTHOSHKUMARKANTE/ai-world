# AI World Platform Architecture

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Platform Architecture |
| Document ID | P0-D10 |
| Area | Architecture |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Canonical High-Level Internal Architecture |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md`, `docs/01-vision/terminology.md`, `docs/02-architecture/system-context.md` |

---

# 1. Purpose

This document defines the high-level internal architecture of **AI World**.

The System Context defined:

```text
AI World
vs
the outside world.
```

This document opens the AI World boundary and defines:

```text
what exists inside AI World;

how the major architectural areas relate;

where Platforms belong;

where Universes belong;

what Foundations provide;

what the Platform Kernel provides;

how Applications consume the Platform;

how external providers are isolated;

how canonical data ownership is preserved;

how asynchronous behavior fits;

how future extraction and scaling remain possible.
```

This document intentionally remains above detailed:

```text
source folders

packages

database tables

API routes

framework modules

ORM models

deployment manifests
```

Those will be designed later.

---

# 2. Architecture Objective

AI World must support:

```text
ONE PLATFORM
+
MANY UNIVERSES
+
REUSABLE CAPABILITIES
+
CLEAR OWNERSHIP
+
CONTROLLED EXTENSIBILITY
+
REPLACEABLE INFRASTRUCTURE
```

without becoming:

```text
one giant generic object system

or

many duplicated Universe applications.
```

---

# 3. Core Architecture Statement

> **AI World is a capability-oriented modular platform in which Applications deliver experiences, Universes provide domain-specific meaning, Platforms own reusable business capabilities, the Platform Kernel provides stable shared semantics, Foundations provide reusable technical infrastructure, and external technologies are integrated through controlled adapters.**

---

# 4. Canonical Architecture Shape

The conceptual architecture is:

```text
┌───────────────────────────────────────────────────────────────┐
│                         APPLICATIONS                          │
│                                                               │
│ Public Web     Creator/Admin     API     Workers     Future   │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                         UNIVERSES                             │
│                                                               │
│ Anime            History           Future Universes           │
│                                                               │
│ Domain definitions                                              │
│ Taxonomy                                                      │
│ Metadata                                                      │
│ Relationships                                                 │
│ Workflows                                                     │
│ Policies                                                      │
│ AI configuration                                              │
│ Presentation                                                  │
│ Controlled extensions                                        │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                         PLATFORMS                             │
│                                                               │
│ Identity & Access                                             │
│ User                                                          │
│ Knowledge                                                     │
│ Media                                                         │
│ Discovery                                                     │
│ AI / Creator                                                  │
│ Composition / CMS                                             │
│ Engagement                                                    │
│ Operations                                                    │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                      PLATFORM KERNEL                          │
│                                                               │
│ Identifiers                                                   │
│ Namespace                                                     │
│ Taxonomy                                                      │
│ Metadata                                                      │
│ Relationships                                                 │
│ Events                                                        │
│ Audit                                                         │
│ Workflow                                                      │
│ Policy                                                        │
│ Localization                                                  │
│ Versioning                                                    │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                         FOUNDATIONS                           │
│                                                               │
│ Configuration                                                 │
│ Database                                                      │
│ Repository Infrastructure                                     │
│ Migration                                                     │
│ Seed                                                          │
│ Storage                                                       │
│ Cache                                                         │
│ Queue                                                         │
│ Scheduler                                                     │
│ Email                                                         │
│ Observability                                                 │
│ Feature Flags                                                 │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                PROVIDERS / INFRASTRUCTURE                     │
│                                                               │
│ Database Provider                                             │
│ Object Storage                                                │
│ AI Providers                                                  │
│ Search Infrastructure                                         │
│ Email Provider                                                │
│ Queue Infrastructure                                          │
│ Observability Backend                                         │
│ Cloud / Runtime Infrastructure                                │
└───────────────────────────────────────────────────────────────┘
```

This is a logical architecture.

It does not require each box to become a separate process.

---

# 5. Architecture Classification

Every significant AI World capability should belong primarily to one architectural classification:

```text
APPLICATION

UNIVERSE

PLATFORM

PLATFORM KERNEL

FOUNDATION

PROVIDER / INFRASTRUCTURE
```

A capability must not be placed somewhere merely because that folder already exists.

---

# 6. Applications

Applications are executable delivery surfaces.

Potential first-party Applications include:

```text
Public Web Application

Creator / Admin Application

API Application

Worker Runtime
```

Future Applications may include:

```text
Mobile

Desktop

Voice

AR

VR

XR

Partner Gateway
```

Applications are consumers of Platform capabilities.

They are not canonical owners of important business semantics.

---

# 7. Application Responsibility

Applications are responsible for concerns such as:

```text
request handling

presentation

routing

client-specific orchestration

transport translation

user interaction

runtime composition
```

Applications should not become the permanent owner of:

```text
authorization rules

Knowledge semantics

Asset lifecycle

Universe definition

workflow invariants
```

---

# 8. Public Web Application

The Public Web Application may compose:

```text
Knowledge

Media

Discovery

Engagement

AI

Composition
```

into user-facing experiences.

It should depend on supported Platform contracts.

---

# 9. Creator / Admin Application

The Creator/Admin Application may consume:

```text
Identity & Access

User

Knowledge

Media

Taxonomy

Metadata

Relationships

Workflow

AI / Creator

Composition / CMS

Audit

Operations
```

according to the Actor's permissions.

Admin interfaces do not bypass Platform boundaries.

---

# 10. API Application

The API Application provides inbound programmatic interfaces.

Responsibilities include:

```text
authentication boundary

request validation

transport-level concerns

response contracts

calling application/use-case services
```

It should not directly become a universal persistence gateway.

---

# 11. Worker Runtime

Workers execute background work.

Examples:

```text
media processing

AI generation

index updates

email delivery

bulk import

scheduled work
```

Workers remain consumers of Capability contracts.

A Worker is not the owner of the business concept merely because it executes work for it.

---

# 12. Application Independence

Business capabilities should remain usable from multiple Applications.

Example:

```text
Knowledge Platform
```

may be consumed by:

```text
Public Web

Admin

API

Worker

Future Mobile
```

without duplicating Knowledge logic.

---

# 13. Universes

Universes provide the domain-specific layer of AI World.

Initial architectural Proof Universes are:

```text
Anime

History
```

Future Universes may include:

```text
Nature

Science

Education

Mythology

Geography

Space

Culture
```

Universes specialize the Platform.

They do not replace it.

---

# 14. Universe Responsibility

A Universe may define:

```text
domain concepts

typed domain definitions

taxonomy

metadata schemas

relationship types

workflows

policies

content rules

AI configuration

presentation configuration

controlled extensions
```

---

# 15. Universe Non-Responsibility

A Universe should not own duplicated implementations of:

```text
authentication

authorization

database infrastructure

storage infrastructure

media processing

search infrastructure

AI provider integration

email delivery

audit infrastructure

queue infrastructure
```

---

# 16. Universe Composition

A Universe should increasingly resemble:

```text
Universe Definition
+
Shared Platform Capabilities
+
Domain Configuration
+
Typed Domain Extensions
+
Content
+
Presentation
```

rather than:

```text
Standalone Application Stack
```

---

# 17. Universe-to-Platform Relationship

Universes consume Platforms.

Conceptually:

```text
Anime
    ↓
Knowledge
Media
Discovery
AI / Creator
Composition
Engagement

History
    ↓
Knowledge
Media
Discovery
AI / Creator
Composition
Engagement
```

The same Platforms serve both.

---

# 18. Universe-to-Kernel Relationship

Universes should normally use Kernel semantics through owning Platforms where appropriate.

Direct Universe interaction with Kernel capabilities may be valid for declarative registration or configuration.

Example:

```text
Anime
    registers taxonomy definitions
        through
Taxonomy capability
```

However, Universes must not reach into Kernel internals.

---

# 19. No Universe Switch Architecture

Core Platform behavior must not depend on growing patterns such as:

```ts
if (universe === 'anime') {
  ...
}

if (universe === 'history') {
  ...
}
```

Preferred mechanisms include:

```text
typed definitions

configuration

policy

registry

strategy

controlled extension
```

---

# 20. Platforms

Platforms are major reusable business capabilities.

Initial Platform architecture contains:

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

These Platforms represent ownership boundaries.

They are not necessarily deployment boundaries.

---

# 21. Platform Ownership Rule

Each Platform should have:

```text
clear responsibility

clear canonical concepts

clear public contracts

clear dependency rules

clear persistence ownership

clear events

clear extension points
```

where applicable.

---

# 22. Identity & Access Platform

The Identity & Access Platform owns security concepts relating to:

```text
Actor authentication

credentials

Sessions

verification

authentication methods

roles

permissions

authorization

machine identity

access policy integration
```

It is shared across every Universe and Application.

---

# 23. Identity & Access Must Not Own User Profile

Identity & Access should not automatically own all User information.

Example separation:

```text
Identity & Access
    credentials
    authentication
    Sessions
    Authorization

User Platform
    profile
    preferences
    privacy-related product settings
```

Exact data boundaries will be defined later.

---

# 24. Identity & Access Dependency Direction

Other Platforms may depend on Identity & Access contracts for security.

Identity & Access should not become dependent on higher-level business Platforms merely to authorize them.

Authorization must work through generic Resource/Action/Context contracts.

---

# 25. User Platform

The User Platform owns human-user product state.

Potential responsibilities include:

```text
profile

preferences

language

timezone

privacy preferences

accessibility preferences

personal settings
```

Some engagement behavior may remain in Engagement rather than User.

---

# 26. User Platform Boundary

User Platform should not own:

```text
passwords

authentication protocol

roles and permissions

content history

favorites

all notification delivery
```

unless a future ownership decision explicitly places a concept there.

---

# 27. Knowledge Platform

The Knowledge Platform is one of AI World's central Platforms.

It owns canonical structured knowledge concepts.

Potential responsibilities include:

```text
Entities

Entity Types

domain knowledge resources

knowledge lifecycle

knowledge semantics

knowledge source integration

knowledge-facing contracts
```

Detailed modeling is deferred to Knowledge architecture.

---

# 28. Knowledge Platform Principle

Knowledge must remain:

```text
canonical

structured

reusable

Universe-aware where needed

independent from presentation

independent from Search provider

independent from AI provider
```

---

# 29. Knowledge and Universes

Knowledge provides reusable primitives.

Universes provide domain meaning.

Conceptually:

```text
Knowledge Platform
        +
Anime Domain Definition
        =
Anime Knowledge

Knowledge Platform
        +
History Domain Definition
        =
History Knowledge
```

---

# 30. Knowledge Does Not Mean One Universal Entity Table

The architecture does not mandate:

```text
one table
+
JSON properties
```

for every domain concept.

The final Knowledge model may combine:

```text
shared primitives

typed domain models

metadata

relationships

specialized persistence
```

as appropriate.

---

# 31. Media Platform

The Media Platform owns AI World's managed media concepts.

Potential responsibilities:

```text
Asset

Asset lifecycle

media metadata

variants

processing

associations

delivery semantics

rights/policy integration

AI-generated media integration
```

---

# 32. Media and Storage Separation

The architecture explicitly separates:

```text
Media Platform
```

from:

```text
Storage Foundation.
```

Media understands:

```text
what the Asset is.
```

Storage understands:

```text
how bytes are stored.
```

---

# 33. Media Platform Consumers

Media may be consumed by:

```text
Knowledge

User

Composition / CMS

AI / Creator

Engagement

Universes
```

without duplicating Asset ownership.

---

# 34. Discovery Platform

The Discovery Platform owns how users and systems find relevant Resources.

Potential responsibilities include:

```text
search

indexing coordination

query semantics

ranking

filters

facets

semantic retrieval

related Resources

recommendations
```

implemented incrementally.

---

# 35. Discovery Is Not Canonical Knowledge

Discovery consumes Knowledge and other Resource owners.

It may produce derived representations.

It must not become the sole source of canonical Resource truth.

---

# 36. Discovery Security

Discovery must respect:

```text
visibility

authorization

Universe scope

privacy

policy
```

Search infrastructure is not permitted to bypass Platform security.

---

# 37. AI / Creator Platform

The AI / Creator Platform owns shared AI capabilities.

Potential responsibilities include:

```text
AI provider abstraction

model catalog

model capabilities

routing

prompts

prompt templates

generation

AI tools

AI jobs

provenance

lineage

evaluation

safety integration

creator assistance
```

implemented according to actual requirements.

---

# 38. AI Platform Boundary

Business Platforms request AI capabilities.

They should not scatter direct provider SDK usage across their internals.

Preferred:

```text
Knowledge Platform
        ↓
AI capability contract
        ↓
AI / Creator Platform
        ↓
Provider Adapter
        ↓
AI Provider
```

---

# 39. AI Does Not Own Canonical Knowledge

AI may:

```text
read

suggest

generate

classify

enrich
```

Knowledge.

The Knowledge Platform remains the canonical owner of accepted Knowledge state.

---

# 40. AI Generated Content Lifecycle

Conceptually:

```text
Generation
    ↓
Candidate Result
    ↓
Validation
    ↓
Optional Human Review
    ↓
Owning Platform Acceptance
    ↓
Canonical State
```

AI provider response alone is not publication.

---

# 41. Composition / CMS Platform

The Composition / CMS Platform owns reusable content composition and creator-management capabilities.

Potential responsibilities include:

```text
Pages

Blocks

Layouts

Experiences

composition

preview

publishing

SEO configuration

structured creator interfaces
```

---

# 42. Composition Does Not Own Canonical Knowledge

Composition references and arranges canonical Resources.

Example:

```text
Page
    references
Entity

Page
    references
Asset
```

The Page should not duplicate entire canonical Entity or Asset state unnecessarily.

---

# 43. Composition and Universe Presentation

Universes may define:

```text
allowed Blocks

themes

layout configuration

landing experiences

navigation configuration
```

through Composition capabilities.

The Composition engine remains shared.

---

# 44. Engagement Platform

The Engagement Platform owns reusable user-interaction state.

Potential responsibilities include:

```text
favorites

history

progress

collections

personalization signals

achievements

notification preferences integration
```

according to future requirements.

---

# 45. Engagement Is Cross-Universe

Engagement should support:

```text
Anime favorites

History progress

cross-Universe collections
```

without requiring separate engagement systems.

---

# 46. Operations Platform

The Operations Platform owns product-level operational and administrative capabilities where appropriate.

Potential responsibilities may include:

```text
operational dashboards

administrative controls

Platform status

provider status

feature management

usage visibility

operational reporting
```

---

# 47. Operations Platform vs Observability Foundation

They are different.

```text
Observability Foundation
    technical telemetry infrastructure

Operations Platform
    higher-level operational/product capability
```

For example:

```text
metrics collection
```

belongs to Observability.

A product-facing:

```text
AI usage dashboard
```

may belong to Operations.

---

# 48. Platform-to-Platform Interaction

Platforms may depend on other Platforms only through deliberate public contracts.

Example:

```text
Composition
    may reference
Knowledge public contracts

Knowledge
    may reference
Media public contracts
```

The exact dependency graph will be formalized later.

---

# 49. Avoid Peer Internal Imports

Bad:

```text
Composition
    imports
Knowledge/internal/repositories/entity.repository
```

Preferred:

```text
Composition
    consumes
Knowledge public contract
```

---

# 50. Platform Cycles

Circular Platform dependencies are architectural warnings.

Example:

```text
Knowledge → Media → Knowledge
```

requires examination.

Possible corrections include:

```text
public abstractions

relationship ownership

events

or moving genuinely shared semantics downward.
```

---

# 51. No Automatic Shared-Layer Promotion

A circular dependency does not automatically mean:

```text
move everything into Platform Kernel.
```

Kernel promotion requires broad semantic justification.

---

# 52. Platform Kernel

The Platform Kernel contains stable shared semantic capabilities.

Initial Kernel areas are:

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

These concepts may serve multiple Platforms and Universes.

---

# 53. Kernel Design Standard

A Kernel capability must satisfy stronger criteria than ordinary shared code.

It should be:

```text
broadly reusable

semantically stable

domain-neutral enough for multiple Platforms

carefully versioned where necessary

small in public surface
```

---

# 54. Kernel Must Remain Small

The Kernel must not become:

```text
everything shared

everything reusable

everything important
```

Large business capabilities belong in Platforms.

Technical infrastructure belongs in Foundations.

---

# 55. Identifiers

The Identifiers capability defines reusable semantics for stable AI World identifiers.

Potential responsibilities may include:

```text
identifier creation contracts

identifier parsing where needed

canonical identifier strategy

external identifier mapping primitives
```

The implementation format is not yet chosen.

---

# 56. Identifiers vs Identity

The distinction is architectural:

```text
Identifiers
    identify Resources

Identity & Access
    identifies/authenticates Actors
```

These remain separate.

---

# 57. Namespace

Namespace capability provides collision-safe naming semantics for shared concepts.

Potential consumers:

```text
Permissions

Events

Metadata

Relationship Types

Universe definitions

Extension registrations
```

---

# 58. Taxonomy

Taxonomy provides reusable classification semantics.

Platforms and Universes may define vocabularies.

Taxonomy capability owns common:

```text
term semantics

hierarchy semantics

classification contracts
```

where the final design requires them.

---

# 59. Metadata

Metadata provides controlled extensibility for descriptive Resource properties.

Metadata should remain:

```text
typed

validated

governed

scoped
```

Metadata is not a replacement for strong Domain Models.

---

# 60. Relationships

Relationships provide reusable typed connection semantics between Resources.

The capability may eventually support:

```text
relationship definitions

source/target constraints

direction

inverse relationships

validation
```

---

# 61. Relationships and Knowledge

Relationships may be heavily used by Knowledge.

However, if the relationship concept proves broadly applicable to:

```text
Knowledge

Media

Users

Composition

other Resources
```

it belongs in the Kernel rather than being hidden inside Knowledge.

The final boundary must be validated during implementation.

---

# 62. Events

Events provide reusable semantics and infrastructure integration for meaningful facts.

The Event capability may define:

```text
event metadata

publication contracts

subscription contracts

event naming

delivery abstraction
```

without requiring distributed messaging initially.

---

# 63. Audit

Audit provides durable accountability semantics.

Audit may be used by:

```text
Identity & Access

Knowledge

Media

CMS

AI

Administration
```

Audit is distinct from Logging.

---

# 64. Workflow

Workflow provides reusable lifecycle/process semantics when multiple Platforms require configurable processes.

Potential consumers:

```text
Knowledge publishing

AI review

Media approval

CMS publishing
```

Workflow implementation must remain proportionate.

---

# 65. Workflow Is Not Required for Every State Machine

Simple Platform-specific lifecycle logic may remain inside the owning Platform.

Kernel Workflow should be used when reusable configurable process behavior genuinely exists.

---

# 66. Policy

Policy provides explicit context-sensitive rule evaluation where reusable policy mechanics are valuable.

Potential applications include:

```text
publication policy

AI usage policy

visibility policy

regional policy
```

Authorization itself remains owned by Identity & Access, though it may consume policy capabilities.

---

# 67. Localization

Localization provides reusable locale-aware semantics.

Potential responsibilities:

```text
localized values

locale resolution

translation representation

localized taxonomy labels
```

Implementation will emerge from real consumers.

---

# 68. Versioning

Versioning provides reusable revision/version semantics where multiple Platforms require them.

It should not force version history onto every Resource.

---

# 69. Kernel Capability Independence

Kernel capabilities should not contain named assumptions such as:

```text
Anime Character

Historical Battle

User Profile Page
```

Their contracts should remain meaningful across Domains.

---

# 70. Foundations

Foundations provide reusable technical capabilities.

Initial Foundation areas:

```text
Configuration

Database

Repository Infrastructure

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

Foundations serve higher layers.

---

# 71. Foundation Rule

Foundations may know about:

```text
technical concepts
```

but must not know unnecessary business semantics.

Example:

```text
Storage
```

may know:

```text
object key

binary stream

content length
```

It should not know:

```text
Anime Character
```

---

# 72. Configuration Foundation

Configuration provides typed and validated runtime configuration.

Potential responsibilities include:

```text
environment loading

validation

configuration namespaces

configuration access
```

Product/Universe configuration may eventually live in persistence and be owned elsewhere.

---

# 73. Database Foundation

Database provides shared relational/persistence infrastructure.

Potential responsibilities:

```text
connection lifecycle

transaction support

health

database client access

migration integration
```

It does not own Domain data merely because data is stored in the database.

---

# 74. Repository Infrastructure

Repository infrastructure may provide shared primitives supporting owned persistence implementations.

It must not create one generic Repository that bypasses Domain ownership.

---

# 75. Migration Foundation

Migration provides controlled historical state evolution.

The architecture distinguishes:

```text
schema migration

application migration
```

where necessary.

Exact implementation will be designed when the engineering foundation is built.

---

# 76. Seed Foundation

Seed provides controlled intentional initial/reference/environment population.

It remains separate from historical Migration.

---

# 77. Storage Foundation

Storage provides binary/object persistence capability.

Potential operations:

```text
store

retrieve

delete

stream

generate access reference
```

depending on implementation.

Storage does not own Media semantics.

---

# 78. Cache Foundation

Cache provides temporary data acceleration.

Cache should not become canonical Domain state by accident.

---

# 79. Queue Foundation

Queue provides asynchronous work delivery infrastructure.

It does not own:

```text
Workflow

Job business semantics

Domain state
```

Higher-level capabilities define those.

---

# 80. Scheduler Foundation

Scheduler triggers work according to time.

It may enqueue Jobs or call supported operations.

Scheduling semantics remain separate from Workflow semantics.

---

# 81. Email Foundation

Email provides reusable message-delivery infrastructure.

Potential responsibilities:

```text
message transport

provider abstraction

templates where infrastructure-level
```

Higher-level notification semantics may belong elsewhere.

---

# 82. Observability Foundation

Observability provides shared runtime instrumentation.

Potential capabilities:

```text
structured logging

metrics

tracing

correlation

health instrumentation
```

---

# 83. Feature Flags Foundation

Feature Flags provide controlled temporary rollout behavior.

Feature Flags should not become permanent business configuration.

---

# 84. Foundation Provider Boundary

Foundations may rely on external Providers.

Conceptually:

```text
Higher-Level Capability
       ↓
Foundation Contract
       ↓
Adapter
       ↓
Provider
```

Examples:

```text
Media
    ↓
Storage
    ↓
Object Storage Adapter
    ↓
Cloud Object Storage
```

---

# 85. Provider Layer

Providers and infrastructure are implementation details beyond AI World's stable Domain contracts.

Potential categories:

```text
database

storage

queue

email

AI

search

observability

cloud runtime
```

---

# 86. Provider Rule

Provider SDK types should be confined near Provider/Adapter boundaries.

They should not spread into:

```text
Universe definitions

Domain Models

Public APIs

canonical contracts
```

without explicit justification.

---

# 87. Adapter Rule

Adapters translate between:

```text
AI World semantics
```

and:

```text
provider semantics.
```

Adapters should not redefine Domain behavior.

---

# 88. Provider Capabilities Can Be Unequal

A provider abstraction does not require every provider to support identical functionality.

Architecture may support:

```text
required core capability

optional provider extensions
```

when valuable.

---

# 89. Canonical Dependency Direction

The preferred conceptual dependency direction is:

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
        ↓
Provider Adapters
        ↓
External Infrastructure
```

Not every interaction must pass through every layer.

This represents allowable architectural direction, not a mandatory call chain.

---

# 90. Direct Platform Consumption

Applications may consume Platforms directly.

Example:

```text
Login page
    ↓
Identity & Access
```

It does not need to pass through a Universe.

---

# 91. Universe-Aware Platform Consumption

Applications may also consume a Platform with Universe context.

Example:

```text
Anime Search Page
    ↓
Discovery Platform
    +
Anime Universe context
```

---

# 92. Kernel Use

Platforms consume Kernel capabilities when required.

Not every Platform must depend on every Kernel capability.

---

# 93. Foundation Use

Platforms or Kernel capabilities may consume Foundations where needed.

Example:

```text
Audit
    ↓
Database Foundation
```

or:

```text
Media
    ↓
Storage Foundation
```

---

# 94. Layer Skipping

Higher-level architecture may consume a Foundation directly when the concern is genuinely technical and ownership remains clear.

Example:

```text
AI Platform
    may consume
Queue Foundation
```

without requiring a Kernel intermediary.

The dependency graph must remain intentional.

---

# 95. No Reverse Domain Dependency

A Foundation must not depend on a Platform.

Bad:

```text
Storage Foundation
    imports
Media Platform
```

Preferred:

```text
Media Platform
    consumes
Storage Foundation
```

---

# 96. No Reverse Universe Dependency

Shared Platforms must not depend on specific Universe implementations.

Bad:

```text
Knowledge Platform
    imports
Anime definitions directly
```

Preferred:

```text
Anime registers/uses
Knowledge extension/configuration contracts
```

---

# 97. Shared Registration Direction

Where registration is required:

```text
Extension
    depends on
Extension Contract
```

not:

```text
Core
    depends on
Extension.
```

Conceptually:

```text
Core Contract
      ▲
      │ implements
Anime Extension
```

Runtime composition connects them.

---

# 98. Composition Root

AI World should have explicit runtime composition points responsible for wiring:

```text
Applications

Platforms

Foundations

Adapters

Universe definitions

Extensions
```

The composition mechanism should prevent shared core modules from importing high-level implementations merely to discover them.

---

# 99. Dependency Inversion at Extension Boundaries

When lower-level capability needs variability supplied by higher-level configuration:

```text
shared contract
```

should mediate the relationship.

Do not reverse the entire architectural dependency.

---

# 100. Synchronous Interaction

Use direct synchronous contracts when:

```text
caller requires immediate result

operation is part of one consistency boundary

failure must be returned immediately
```

Example:

```text
Composition asks Knowledge for an Entity representation.
```

---

# 101. Asynchronous Interaction

Use Events or Jobs when:

```text
reaction may happen later

work is long-running

multiple independent consumers react

eventual consistency is acceptable
```

Example:

```text
EntityPublished
    ↓
Search indexing
```

---

# 102. Event-Driven Reactions

Conceptual example:

```text
Knowledge Platform
    commits publication
        ↓
EntityPublished
        │
        ├── Discovery updates index
        ├── Audit records relevant action
        ├── Analytics observes publication
        └── Cache invalidation may occur
```

The publishing transaction should not depend synchronously on every derived consumer unless required.

---

# 103. Events Do Not Replace Public Contracts

A Platform may expose both:

```text
synchronous public services

and

Events.
```

Choose based on interaction semantics.

---

# 104. Eventual Consistency Zones

Likely eventually-consistent areas include:

```text
search index

analytics

recommendations

some notifications

derived caches
```

Canonical business invariants should not depend on these systems being immediately synchronized unless architecture explicitly requires it.

---

# 105. Strong Consistency Zones

Potential strongly consistent operations include:

```text
credential changes

permission assignments

canonical resource mutation

workflow transitions

publication state changes
```

within appropriate persistence boundaries.

Exact transaction design belongs to Capability architecture.

---

# 106. Transaction Ownership

Application/use-case services inside the owning Capability should normally coordinate transactions for atomic business operations.

Repositories should participate in those transactions rather than independently redefining consistency.

---

# 107. External Side Effects

External effects such as:

```text
email

AI provider calls

object storage

search indexing

webhooks
```

cannot generally participate in ordinary database atomic transactions.

Flows involving them must define failure handling explicitly.

---

# 108. Outbox Direction

A Transactional Outbox may later be introduced where:

```text
canonical database commit
+
reliable event delivery
```

must be coordinated.

It is not mandatory before the requirement exists.

---

# 109. Job Architecture Direction

Long-running work should be represented intentionally.

Conceptual model:

```text
Capability
    creates Job
        ↓
Queue
        ↓
Worker
        ↓
Capability execution
        ↓
Job result/state
```

The Job's business ownership remains with the Capability that requested or defines the work.

---

# 110. Canonical Data Architecture

Canonical state belongs to owning Capabilities.

A single physical database may initially store data for many Capabilities.

That does not create shared logical ownership.

---

# 111. Shared Database Does Not Mean Shared Tables

Even if Platforms share one database server:

```text
Knowledge
```

must not freely mutate:

```text
Identity & Access tables.
```

Persistence access should respect logical ownership.

---

# 112. Persistence Encapsulation

The long-term target is:

```text
Capability A
    cannot casually access
Capability B persistence internals
```

Cross-Capability data needs should be served through:

```text
public query contracts

owned application services

Events

derived read models
```

as appropriate.

---

# 113. Data Ownership vs Physical Foreign Keys

A relational implementation may use cross-domain foreign keys when valuable.

A foreign key does not automatically transfer ownership.

Architecture must distinguish:

```text
referential integrity
```

from:

```text
mutation authority.
```

---

# 114. Resource References

Cross-Capability references should generally use stable identifiers.

Example:

```text
Knowledge Entity
    references
Asset ID
```

rather than embedding Media provider internals.

---

# 115. Derived Views

Read-heavy use cases may create derived models combining data from several owners.

Examples:

```text
search documents

page projections

analytics aggregates
```

Derived models do not change canonical ownership.

---

# 116. Read Composition

Some user-facing responses may require multiple Platforms.

A higher-level Application or dedicated query/composition layer may combine:

```text
Entity

Media

Engagement

Recommendations
```

without forcing one Platform to own the others.

---

# 117. Avoid Mega Aggregate Services

Do not create one universal:

```text
AIWorldService
```

that knows every Platform and becomes the true hidden owner of all business behavior.

Composition should remain use-case focused.

---

# 118. Public Contract Architecture

Every major Platform should eventually define its intentional public surface.

Potential contract forms:

```text
Application Services

Queries

Commands

Events

API Schemas

Extension Interfaces
```

Not every form is mandatory.

---

# 119. Public Surface Rule

Public contracts should be:

```text
smaller than internal implementation

semantically stable

owned

documented

tested where important
```

---

# 120. Internal Implementation Freedom

A Platform should be able to change internal:

```text
repositories

ORM usage

helper structure

algorithms

provider adapters
```

without breaking consumers when the Public Contract remains stable.

---

# 121. API Architecture

External APIs should sit above Platform contracts.

Conceptually:

```text
HTTP / API Boundary
        ↓
Platform Application Contract
        ↓
Domain Capability
```

Avoid:

```text
Controller
    directly manipulates database.
```

---

# 122. API Models

API models should be designed for consumer contracts.

They must not automatically equal:

```text
ORM models

database rows

provider objects
```

---

# 123. Error Architecture

Domain and Platform errors should be translated at Application/API boundaries.

Conceptually:

```text
Domain Error
      ↓
Application Error Contract
      ↓
HTTP/API Error Representation
```

Detailed standards belong to Engineering/API documentation.

---

# 124. Security Architecture Position

Security is cross-cutting but primarily owned through:

```text
Identity & Access

Policy

Platform-specific invariants

Application security boundaries
```

Security is not a separate outer wrapper applied only after business logic.

---

# 125. Authorization Integration

Each owning Platform defines meaningful Actions and Resource context.

Identity & Access performs or coordinates authorization.

Example:

```text
Knowledge
    defines
Publish Entity action

Identity & Access
    evaluates
Actor permission/policy
```

---

# 126. Authorization Ownership

Identity & Access owns authorization infrastructure.

The owning business Platform owns the semantics of what the business action means.

This prevents Authorization from needing full knowledge of every Domain's internal rules.

---

# 127. Domain Invariants vs Authorization

Example:

```text
Actor has permission to publish Entity
```

is Authorization.

```text
Entity cannot be published because required source is missing
```

is a Knowledge invariant.

Both must pass.

---

# 128. Policy Position

Policy may support contextual rules used by multiple Platforms.

However, security-critical authorization decisions must remain explicit and auditable.

Policy must not become unreviewable arbitrary scripting.

---

# 129. Audit Position

Important actions may emit or create Audit Records.

Audit should receive enough structured context to answer:

```text
who

what

which Resource

when

result

relevant scope
```

without owning business mutation itself.

---

# 130. Observability Position

All runtime layers may emit operational telemetry.

Observability provides shared technical capability.

Business Platforms define meaningful business metrics where necessary.

---

# 131. Logging Boundary

Logs should include technical context without becoming the only durable source of:

```text
audit

business state

workflow history.
```

---

# 132. Configuration Architecture

AI World distinguishes:

```text
Runtime Configuration

Product Configuration

Universe Configuration

Secrets

Feature Flags
```

These concepts should not be collapsed into one configuration mechanism.

---

# 133. Runtime Configuration

Runtime Configuration may include:

```text
database connection

port

provider endpoint

environment mode
```

and belongs to technical configuration.

---

# 134. Secrets

Secrets require stronger controls than ordinary configuration.

Examples:

```text
database passwords

AI API keys

signing keys

email credentials
```

---

# 135. Product Configuration

Product Configuration controls product behavior.

Examples may include:

```text
enabled product capabilities

global product limits

public feature settings
```

---

# 136. Universe Configuration

Universe Configuration controls domain-specific variation.

Examples:

```text
taxonomy

entity definitions

AI prompts/preferences

presentation configuration

workflow selection
```

---

# 137. Feature Flags

Feature Flags provide temporary rollout controls.

They should not become long-lived Universe configuration.

---

# 138. Extension Architecture Position

AI World supports three major forms of variation:

```text
CONFIGURATION

IMPLEMENTATION ADAPTER

TYPED EXTENSION
```

These should be preferred before modifying shared core behavior for every consumer.

---

# 139. Configuration Variation

Use when differences are declarative.

Example:

```text
History enables source review workflow.
```

---

# 140. Adapter Variation

Use when the same AI World capability needs multiple technology implementations.

Example:

```text
Storage Adapter A
Storage Adapter B
```

---

# 141. Typed Extension Variation

Use when a Universe or Platform requires genuine specialized behavior.

Example:

```text
HistoricalDateInterpretationExtension
```

if generic temporal configuration cannot represent the behavior safely.

---

# 142. Extension Registration

Extensions should register against stable contracts.

Conceptually:

```text
Extension Contract
      ▲
      │ implements
Extension
      │
      ▼
Composition Root / Registry
```

The core contract should not import the extension implementation.

---

# 143. Extension Scope

Extensions should receive only the capabilities they need.

Avoid giving every extension access to:

```text
raw database

all providers

all Platform internals

all User data
```

---

# 144. Extension Security

Extensions must operate through the same:

```text
authorization

validation

audit

data ownership
```

expectations as ordinary Platform code where applicable.

---

# 145. Dynamic Extensibility

Runtime dynamic plugin installation is not required for the first implementation.

Initial extensions may be:

```text
first-party

compile-time registered

typed

repository-controlled
```

This is sufficient to prove architecture.

---

# 146. Platform Registries

Registries may be introduced where multiple registered implementations or definitions must be resolved.

Potential examples:

```text
Universe Registry

AI Provider Registry

Composition Block Registry

Media Processor Registry
```

Do not create a universal Registry framework before real consumers exist.

---

# 147. Architecture for Multiple Universes

Conceptually:

```text
                   ┌───────────────┐
                   │ Anime         │
                   │ Definition    │
                   └──────┬────────┘
                          │
                   ┌──────▼────────┐
                   │ Shared        │
                   │ Platforms     │
                   └──────▲────────┘
                          │
                   ┌──────┴────────┐
                   │ History       │
                   │ Definition    │
                   └───────────────┘
```

Neither Universe owns the shared Platforms.

---

# 148. Anime Architecture Role

Anime should test capabilities such as:

```text
media-heavy Resources

characters

series

episodes

scenes

quotes

genres

studios

relationships

release sequencing
```

---

# 149. History Architecture Role

History should test capabilities such as:

```text
people

events

civilizations

places

sources

timelines

date uncertainty

verification

cross-domain relationships
```

---

# 150. Proof of Generality

The shared architecture must support both without turning core concepts into:

```text
Anime-specific abstractions

or

History-specific abstractions.
```

---

# 151. Third Universe Architecture Test

Later, a third structurally different Universe should be introduced.

Success target:

```text
mostly configuration

typed domain definitions

limited extensions

little or no shared architectural redesign
```

---

# 152. Architecture Evolution

AI World architecture should evolve incrementally.

Expected evolution pattern:

```text
Initial modular architecture
        ↓
real workload
        ↓
measured pressure
        ↓
bounded optimization
        ↓
optional runtime extraction
```

---

# 153. Modular Monolith Direction

The logical architecture is intentionally compatible with an initial modular monolith.

Conceptually:

```text
One Backend Deployment
    ├── Identity & Access
    ├── User
    ├── Knowledge
    ├── Media
    ├── Discovery
    ├── AI
    └── ...
```

while preserving strong internal boundaries.

The final deployment choice is confirmed later by Technology Strategy.

---

# 154. Modular Monolith Does Not Mean Shared Internals

Even in one process:

```text
module boundaries

ownership

public contracts

data ownership
```

must remain explicit.

---

# 155. Future Service Extraction

A Platform or capability may later become independently deployed if justified by:

```text
independent scale

special runtime

security isolation

deployment cadence

availability requirement

team ownership
```

Logical boundaries should make extraction possible.

---

# 156. Extraction Principle

Physical extraction should preserve the existing logical contract where practical.

Example:

```text
Media processing
```

may move from an in-process worker to a separate processing service without changing what an Asset means.

---

# 157. Worker Extraction

Long-running work may be among the first capabilities to require separate runtime scaling.

Possible candidates:

```text
Media Processing

AI Generation

Indexing
```

This does not require splitting the owning Platform's business model.

---

# 158. Search Infrastructure Evolution

Discovery may initially use simple database search.

Later it may adopt:

```text
dedicated search engine

vector index

special ranking system
```

without moving canonical Knowledge ownership.

---

# 159. Storage Evolution

Storage may evolve from:

```text
local development storage
```

to:

```text
managed object storage
```

without changing Asset identity or Media semantics.

---

# 160. AI Provider Evolution

AI may begin with one Provider.

Later:

```text
Provider A
Provider B
self-hosted model
specialized models
```

may coexist behind AI Platform routing.

---

# 161. Database Evolution

The initial canonical relational database may evolve through:

```text
schema optimization

read replicas

partitioning

specialized derived stores
```

without requiring every Platform to abandon ownership boundaries.

---

# 162. Data Distribution

If a Platform is physically extracted later, its owned data may eventually require separate persistence.

Logical ownership should already exist before physical separation.

---

# 163. No Database-per-Platform Requirement

Logical ownership does not require:

```text
one database per Platform
```

initially.

Physical topology remains an implementation decision.

---

# 164. No Microservice-per-Platform Requirement

Likewise:

```text
Platform
```

does not equal:

```text
Microservice.
```

A Platform is a business ownership concept.

---

# 165. No Package-per-Capability Requirement

Architecture classification does not automatically imply source package granularity.

Repository Architecture will decide where packages provide meaningful boundaries.

---

# 166. Architecture and Repository Separation

This document defines:

```text
logical architecture.
```

P0-D16 will define:

```text
repository architecture.
```

The repository should reflect architecture without mechanically creating one directory for every conceptual term.

---

# 167. Architecture and Technology Separation

This document defines:

```text
what kinds of capabilities exist
```

without selecting:

```text
NestJS

Next.js

Prisma

PostgreSQL

Redis

OpenAI

AWS
```

Technology Strategy will map concepts to implementation.

---

# 168. Architecture and Deployment Separation

Logical architecture remains stable whether deployment begins as:

```text
one backend
```

or eventually becomes:

```text
API
Workers
Search service
Media processing service
```

---

# 169. Architecture and API Separation

Platform architecture defines ownership.

API architecture exposes suitable operations.

Do not allow API route grouping to redefine Domain ownership.

---

# 170. Architecture and Database Separation

Database tables should follow owning capabilities.

Database schema convenience must not become the primary architecture.

---

# 171. Architecture and UI Separation

UI pages may combine many Platforms.

That does not mean their Domain concepts should be combined into one backend module.

Example:

```text
Entity Detail Page
    displays
Knowledge + Media + Engagement + Discovery
```

The page is a composition surface.

---

# 172. Vertical Slice Principle

Implementation should validate architecture through thin vertical slices.

Example:

```text
History Person
    ↓
Knowledge definition
    ↓
Persistence
    ↓
API
    ↓
Authorization
    ↓
Public presentation
```

This tests boundaries with real behavior.

---

# 173. Shared Capability Before Broad Feature Expansion

Once a thin slice works, expand carefully.

Do not create complete generic infrastructure in isolation before real Platform consumers prove the design.

---

# 174. Capability Lifecycle

A major Capability should conceptually progress through:

```text
Specification

Architecture

Implementation

Integration

Testing

Validation

Closure
```

The exact process depends on complexity.

---

# 175. Architecture Governance

Major changes affecting:

```text
Platform ownership

Kernel membership

dependency direction

canonical data ownership

extension architecture

deployment boundary strategy
```

may require ADRs.

---

# 176. Kernel Promotion Gate

Before moving something into Platform Kernel, ask:

```text
Do multiple Platforms genuinely need it?

Are the semantics shared?

Is the concept stable?

Would placing it here reduce duplication?

Would it introduce unnecessary coupling?

Can it remain a Platform-owned capability instead?
```

---

# 177. Foundation Promotion Gate

Before creating a new Foundation, ask:

```text
Is this primarily technical infrastructure?

Will multiple Capabilities use it?

Does it remain Domain-neutral?

Does it have coherent ownership?

Is a dedicated Foundation better than a local implementation?
```

---

# 178. Platform Creation Gate

Before declaring a new Platform, ask:

```text
Is this a major reusable business capability?

Does it own meaningful canonical concepts?

Will multiple Applications or Universes consume it?

Does it deserve independent lifecycle and contracts?
```

---

# 179. Universe-Specific Gate

Before putting behavior in a Universe, ask:

```text
Is it truly domain-specific?

Could it be configuration?

Could another Universe reuse it?

Does it reveal a missing Platform capability?
```

---

# 180. Adapter Creation Gate

Before creating an Adapter abstraction, ask:

```text
Is there a meaningful provider boundary?

Is replacement plausible?

Does provider-specific shape need isolation?

Would direct use be simpler without harming architecture?
```

---

# 181. Event Creation Gate

Before publishing an Event, ask:

```text
Did something meaningful happen?

Does another Capability need to react?

Can the reaction be asynchronous?

Is the Event contract stable enough?

Would a direct call be clearer?
```

---

# 182. Job Creation Gate

Before introducing a Job, ask:

```text
Is the work too long for synchronous execution?

Must it survive process restart?

Could it be retried?

Does progress/state matter?

Who owns the Job semantics?
```

---

# 183. Cache Creation Gate

Before adding Cache:

```text
Is there measured performance benefit?

What is canonical state?

How is invalidation handled?

What happens if cache is unavailable?
```

---

# 184. Search Infrastructure Gate

Before adopting a dedicated Search Provider:

```text
Can current persistence satisfy the requirement?

What search capabilities are missing?

What indexing complexity is introduced?

How will private data remain protected?

Can the index be rebuilt?
```

---

# 185. Distributed Architecture Gate

Before extracting a service:

```text
What measured problem does distribution solve?

How does data ownership change?

How is consistency handled?

How is failure handled?

How is deployment improved?

Is operational complexity justified?
```

---

# 186. Canonical Platform Interaction Example

Consider publishing a History Entity.

Conceptually:

```text
Creator Application
        ↓
Identity & Access
        ↓
Knowledge Platform
        ↓
History domain validation
        ↓
Workflow / Policy
        ↓
Canonical Database
        ↓
EntityPublished
        │
        ├── Discovery indexes
        ├── Audit records
        ├── Cache invalidates
        └── Analytics observes
```

Each responsibility remains owned.

---

# 187. Canonical Media Interaction Example

```text
Creator
    ↓
Media Platform
    ↓
Storage Foundation
    ↓
Storage Adapter
    ↓
Storage Provider
```

Then:

```text
AssetCreated
    ↓
Media Processing Job
    ↓
Worker
    ↓
Variant generation
```

Knowledge may reference the resulting Asset ID.

---

# 188. Canonical AI Interaction Example

```text
Creator
    ↓
AI / Creator Platform
    ↓
Authorization
    ↓
Context retrieval from Knowledge
    ↓
AI Policy
    ↓
AI Provider Adapter
    ↓
External Model
    ↓
Generation Result
    ↓
Review
    ↓
Knowledge / Media / CMS acceptance
```

The target owning Platform decides whether the output becomes canonical state.

---

# 189. Canonical Search Interaction Example

```text
User
    ↓
Discovery Platform
    ↓
Universe Scope
    ↓
Authorization / Visibility
    ↓
Search Provider
    ↓
Candidate Results
    ↓
AI World Result Contract
```

Search results are shaped through AI World semantics.

---

# 190. Canonical Composition Example

```text
Page
    │
    ├── references Entity
    ├── references Assets
    ├── references Collection
    └── contains presentation Blocks
```

Composition owns presentation structure.

Knowledge and Media retain canonical ownership.

---

# 191. Canonical Engagement Example

```text
User
    ↓
Favorite Entity
    ↓
Engagement Platform
    stores:
        User ID
        Resource Reference
        Universe Context if needed
```

Engagement does not copy the complete Entity.

---

# 192. Canonical Authorization Example

```text
Actor
    ↓
attempts
Publish Entity
    ↓
Identity & Access evaluates access
    ↓
Knowledge validates business invariants
    ↓
Workflow validates lifecycle
    ↓
operation succeeds
```

Security and Domain correctness remain separate but coordinated.

---

# 193. Architectural Anti-Pattern — Universe Vertical Silos

Bad:

```text
Anime
    Auth
    Users
    Media
    Search
    AI
    CMS

History
    Auth
    Users
    Media
    Search
    AI
    CMS
```

Preferred:

```text
Shared Platforms
    ↓
Anime
History
```

---

# 194. Architectural Anti-Pattern — Giant Shared Core

Bad:

```text
core/
    everything
```

Preferred:

```text
clear Foundations
clear Kernel
clear Platforms
```

---

# 195. Architectural Anti-Pattern — Shared Database as Integration API

Bad:

```text
every Platform
    directly queries
every other Platform's tables
```

Preferred:

```text
owned persistence
+
public contracts
```

---

# 196. Architectural Anti-Pattern — Provider Leakage

Bad:

```text
Knowledge Domain
    uses OpenAI SDK directly

Media Domain
    returns S3 object shape
```

Preferred:

```text
owned Platform contract
+
Adapter boundary
```

---

# 197. Architectural Anti-Pattern — Everything Through Events

Bad:

```text
all communication
    =
events
```

Preferred:

```text
synchronous contracts
when immediate consistency/result is required

events
when independent asynchronous reaction is appropriate
```

---

# 198. Architectural Anti-Pattern — Everything Through One Service

Bad:

```text
AIWorldService
    does everything
```

This destroys ownership.

---

# 199. Architectural Anti-Pattern — Everything in Kernel

Bad:

```text
"If two modules use it, move it to Kernel."
```

Kernel requires semantic stability and broad reuse.

---

# 200. Architectural Anti-Pattern — Framework Before Capability

Bad:

```text
build generic workflow framework

before any real workflow exists.
```

Preferred:

```text
real capability
    ↓
shared requirement emerges
    ↓
reusable mechanism
```

---

# 201. Architectural Anti-Pattern — ORM-Driven Architecture

Bad:

```text
Prisma schema
    defines
Platform architecture.
```

Preferred:

```text
Domain ownership
    defines architecture

Persistence
    implements it.
```

---

# 202. Architectural Anti-Pattern — API-Driven Ownership

Bad:

```text
one controller owns everything returned by its page.
```

UI/API aggregation does not imply Domain ownership.

---

# 203. Architectural Anti-Pattern — Frontend Business Rules

Bad:

```text
publish button disabled
therefore publication is valid.
```

Trusted Platform boundaries must enforce rules.

---

# 204. Architectural Anti-Pattern — AI Owns Workflow

Bad:

```text
AI decides directly
what becomes published.
```

Preferred:

```text
AI produces result
Owning Platform + Workflow decides canonical acceptance.
```

---

# 205. Architectural Anti-Pattern — Search Owns Relationships

Bad:

```text
relationship only exists inside search index.
```

Canonical relationship semantics belong to AI World.

---

# 206. Architectural Anti-Pattern — Cache Owns Session Truth Without Design

If Cache is intentionally selected as Session persistence later, that must be explicit.

Do not accidentally let an optimization become critical persistence.

---

# 207. Architectural Anti-Pattern — Extension Gets Raw Everything

Bad:

```text
Universe extension
    receives unrestricted database client
```

Preferred:

```text
narrow capability contracts
```

---

# 208. Architectural Anti-Pattern — Runtime Discovery Magic

Avoid architecture where modules become active simply because files happen to exist with naming conventions no one can trace.

Registration and composition should remain explicit enough to understand.

---

# 209. Architectural Anti-Pattern — Deep Layer Ceremony

The architecture does not require every operation to travel mechanically through:

```text
Controller
Facade
UseCase
Manager
DomainService
Repository
Adapter
Driver
```

unless each layer has real responsibility.

---

# 210. Architecture Simplicity Rule

A useful operation may legitimately be:

```text
Controller
    ↓
Application Service
    ↓
Repository
```

if that is sufficient.

Architecture quality comes from ownership and contracts, not maximum layer count.

---

# 211. Architecture Testability

Capability boundaries should permit isolated testing.

Examples:

```text
Knowledge Domain logic
    test without real Search Provider

AI routing
    test with fake provider

Media lifecycle
    test with fake Storage Adapter
```

---

# 212. Integration Testing

Important integration boundaries should eventually validate:

```text
database persistence

transactions

provider adapters

event handling

API behavior
```

where real behavior matters.

---

# 213. Contract Testing

Stable interfaces may require Contract tests between:

```text
Platform consumers and providers

AI World and external Providers

published Events and consumers
```

when value justifies them.

---

# 214. Architecture Rule Enforcement

Some dependency rules may later be automated.

Examples:

```text
Foundation cannot import Universe

Platform cannot import another Platform's internal code

Universe extension cannot import provider SDK directly
```

Implementation tooling will be selected later.

---

# 215. Architecture Documentation

Each major Capability should eventually document:

```text
responsibility

ownership

public contracts

data ownership

dependencies

extension points

testing

status
```

using the canonical documentation structure.

---

# 216. Capability Documentation Pack

Default substantial Capability documentation may include:

```text
README.md

specification.md

architecture.md

contracts.md

testing.md

roadmap.md
```

Additional documents should be created only when needed.

---

# 217. Platform Architecture and ADRs

This document establishes the baseline.

Future changes such as:

```text
adopting microservices as primary architecture

moving a major concept between Platforms

changing canonical ownership

introducing public plugin execution

changing fundamental Universe composition
```

should normally use ADRs.

---

# 218. Architecture Stability Levels

Concepts have different expected stability.

High stability:

```text
Universe

Platform

Foundation

Actor

Asset

Entity

canonical ownership principles
```

Lower initial stability:

```text
exact internal module split

exact API design

exact provider interface

exact persistence schema
```

Implementation should evolve more easily than foundational semantics.

---

# 219. Experimental Architecture

New infrastructure or capability approaches may initially be marked experimental.

Experimental status must not silently become stable Platform Contract merely because code exists.

---

# 220. Initial Implementation Architecture

The likely first implementation should favor:

```text
one monorepo

few Applications

modular backend

shared database infrastructure

strong module boundaries

provider adapters only where valuable

background workers only when required
```

Exact technology choices remain pending.

---

# 221. Initial Architecture Priorities

Early implementation should prioritize:

```text
clarity

correctness

security

data integrity

developer productivity

testability

simple operation
```

before:

```text
extreme distribution

maximum extensibility

hyperscale optimization
```

---

# 222. Architecture Maturity Direction

AI World may mature through:

```text
PHASE A
Strong logical boundaries

PHASE B
Reusable Platform capabilities

PHASE C
Multiple proof Universes

PHASE D
Measured infrastructure specialization

PHASE E
Selective distributed deployment

PHASE F
Broader ecosystem/extensibility
```

No later phase is mandatory without requirements.

---

# 223. Architecture Health Indicators

Healthy architecture should show:

```text
clear ownership

few circular dependencies

small public surfaces

high Platform reuse

minimal Universe duplication

localized provider integration

reconstructable derived state

predictable dependency direction

safe internal refactoring
```

---

# 224. Architecture Warning Indicators

Warning signs include:

```text
many cross-Platform internal imports

many Universe-specific conditions in shared code

provider SDK usage across Domains

duplicate Platforms per Universe

large shared/common folders

unclear canonical data owner

search/caches becoming truth

one mega orchestration service

many abstractions with one consumer
```

---

# 225. Architecture Evolution Metric

A useful long-term question is:

```text
How much unrelated core code must change
when adding a new Universe or Provider?
```

The desired trend is:

```text
less over time.
```

---

# 226. New Universe Architecture Metric

For each new Universe, observe:

```text
new Foundation code

new Kernel code

new Platform code

new Universe definitions

new Universe-specific behavior
```

Mature architecture should increasingly concentrate changes in:

```text
Universe definitions
+
content
+
controlled extensions.
```

---

# 227. Provider Replacement Metric

A Provider replacement should ideally affect:

```text
adapter

configuration

provider-specific tests

possibly migration/operations
```

not unrelated Domain Models.

---

# 228. Platform Extraction Metric

If a Platform later becomes independently deployed, the logical business model should not require redesign merely because network boundaries appear.

---

# 229. Architecture Decision Filter

Before approving a major design, ask:

```text
1. Which architectural area owns this?

2. Is it Foundation, Kernel, Platform, Universe, or Application?

3. Who owns the canonical data?

4. Which public contract exposes it?

5. What does it depend on?

6. Are dependencies pointing downward appropriately?

7. Is there a circular dependency?

8. Is provider technology leaking upward?

9. Is Universe-specific logic leaking downward?

10. Could configuration handle the variation?

11. Is an Adapter appropriate?

12. Is a typed Extension required?

13. Should interaction be synchronous or asynchronous?

14. What consistency does the operation require?

15. What happens when external dependencies fail?

16. Can the internal implementation change without breaking consumers?

17. Does this help future Universes reuse the Platform?

18. Is the complexity justified today?
```

---

# 230. Architecture Invariants

The following invariants are established by this document:

```text
1. AI World is capability-oriented.

2. Applications are delivery surfaces, not canonical business owners.

3. Universes specialize shared Platforms.

4. Universes do not duplicate shared infrastructure.

5. Platforms own major reusable business capabilities.

6. Platform Kernel contains only broadly reusable semantic primitives.

7. Foundations remain technical and Domain-neutral.

8. External Providers remain behind controlled boundaries where meaningful.

9. Canonical data ownership is independent from physical database topology.

10. Derived systems do not become canonical truth automatically.

11. Platform-to-Platform interaction uses deliberate public Contracts.

12. Reverse dependencies from Foundations to Platforms are prohibited.

13. Shared Platforms must not depend on named Universe implementations.

14. Genericity must preserve type safety and Domain semantics.

15. Synchronous and asynchronous interaction are chosen intentionally.

16. External side effects require explicit failure handling.

17. Security is enforced by trusted Platform boundaries.

18. AI does not automatically own or publish canonical Knowledge.

19. Logical modularity precedes physical distribution.

20. Architecture must evolve incrementally from real requirements.
```

---

# 231. Initial Major Architecture Areas

The canonical major areas are currently:

```text
APPLICATIONS

    Public Web
    Creator/Admin
    API
    Worker
    Future Clients

UNIVERSES

    Anime
    History
    Future Universes

PLATFORMS

    Identity & Access
    User
    Knowledge
    Media
    Discovery
    AI / Creator
    Composition / CMS
    Engagement
    Operations

PLATFORM KERNEL

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

FOUNDATIONS

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

This catalog will be refined by the Capability Map.

---

# 232. What Is Not Yet Decided

This document does not decide:

```text
exact monorepo application names

exact package names

backend framework

frontend framework

ORM

database technology

ID format

HTTP API style

session/token mechanism

queue technology

cache technology

search provider

AI provider

cloud provider

deployment provider

specific table structure

exact event envelope

exact source folder organization
```

---

# 233. What Is Decided

This document does decide:

```text
AI World is one reusable Platform.

Universes exist above shared Platforms.

Platforms own reusable business capabilities.

Kernel capabilities provide shared semantics.

Foundations provide shared technical infrastructure.

Provider technology remains below Platform-owned contracts.

Canonical data ownership is explicit.

Applications do not own Domain truth.

Logical modularity comes before physical distribution.

Architecture must support incremental evolution.
```

---

# 234. Relationship to Platform Layers

This document identifies architectural areas.

The next document:

```text
P0-D11 — Platform Layers
```

will formalize:

```text
layer responsibilities

allowed dependency directions

cross-layer interaction rules

which concepts may skip layers

what must never depend upward.
```

---

# 235. Relationship to Capability Map

P0-D12 will enumerate the major Capabilities inside each area and clarify:

```text
current requirement

future requirement

classification

major consumers

expected maturity
```

---

# 236. Relationship to Ownership Model

P0-D13 will formally map concepts such as:

```text
User

Credential

Session

Entity

Asset

Relationship

Generation

Page

Favorite
```

to canonical owners.

---

# 237. Relationship to Dependency Rules

P0-D14 will turn this architecture into enforceable dependency constraints.

---

# 238. Relationship to Extension Model

P0-D15 will define exactly how:

```text
configuration

Adapters

registries

strategies

Universe Extensions

provider implementations
```

may extend the Platform.

---

# 239. Relationship to Repository Architecture

P0-D16 will map the logical architecture into:

```text
apps/

packages/

modules/

shared contracts/

tooling/

docs/
```

without violating ownership.

---

# 240. Relationship to Technology Strategy

P0-D17 will select technologies capable of implementing this architecture.

Technology must fit the architecture.

Architecture should not be rewritten merely to resemble the preferred framework's default folder structure.

---

# 241. Relationship to Master Roadmap

P0-D18 will determine implementation order.

Architecture describes:

```text
what depends on what.
```

Roadmap describes:

```text
what we build when.
```

---

# 242. Platform Architecture Summary

AI World is structured conceptually as:

```text
APPLICATIONS
    deliver AI World

UNIVERSES
    provide domain-specific worlds

PLATFORMS
    provide reusable business capabilities

PLATFORM KERNEL
    provides reusable semantic primitives

FOUNDATIONS
    provide reusable technical infrastructure

ADAPTERS / PROVIDERS
    implement replaceable technology boundaries
```

---

# 243. Final Platform Architecture Statement

> **AI World will be built as one modular, capability-oriented platform whose shared business capabilities and semantic primitives support many typed, configurable Universes. Canonical data and business ownership remain inside clearly bounded Platforms; technical Foundations remain domain-neutral; external providers remain replaceable implementation details; and the architecture may evolve from a simple modular deployment toward more specialized runtimes only when real requirements justify that complexity.**

---

# 244. Acceptance

```text
DOCUMENT
P0-D10 — AI World Platform Architecture

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

NEXT DOCUMENT
P0-D11 — Platform Layers

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```