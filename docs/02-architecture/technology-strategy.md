# AI World Technology Strategy

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Technology Strategy |
| Document ID | P0-D17 |
| Area | Architecture |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Canonical Technology Selection and Evolution Strategy |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md`, `docs/01-vision/terminology.md`, `docs/02-architecture/system-context.md`, `docs/02-architecture/platform-architecture.md`, `docs/02-architecture/platform-layers.md`, `docs/02-architecture/capability-map.md`, `docs/02-architecture/ownership-model.md`, `docs/02-architecture/dependency-rules.md`, `docs/02-architecture/extension-model.md`, `docs/02-architecture/repository-architecture.md` |

---

# 1. Purpose

This document defines the canonical **Technology Strategy** for AI World.

Earlier Phase 0 documents deliberately avoided selecting implementation technology until the architecture was established.

That sequence is now complete enough to make technology decisions.

This document determines:

```text
which technologies are accepted;

which technologies are deferred;

which technologies are intentionally excluded from the initial Platform;

how versions are selected;

how technologies map to architectural capabilities;

how provider-specific technology is isolated;

how technologies may later be replaced;

how AI World avoids unnecessary infrastructure complexity.
```

---

# 2. Technology Follows Architecture

The governing principle is:

> **Technology implements AI World architecture. Technology does not define AI World architecture.**

Framework terminology must not replace canonical AI World terminology.

Examples:

```text
NestJS Module
    does not replace
Platform Capability.

Prisma Model
    does not replace
Domain Model.

Next.js Route
    does not replace
Resource ownership.

PostgreSQL Table
    does not replace
Canonical data ownership.
```

---

# 3. Technology Selection Objectives

Technology decisions should optimize for:

```text
architectural fit;

maturity;

maintainability;

security;

developer productivity;

operability;

testability;

ecosystem quality;

portability;

cost;

incremental scalability.
```

---

# 4. Technology Non-Objectives

AI World does not optimize for:

```text
maximum number of technologies;

trend adoption;

resume-driven development;

hyperscale architecture before workload exists;

provider-specific lock-in;

microservices by default;

infrastructure complexity for theoretical future requirements.
```

---

# 5. Technology Decision Statuses

This document uses:

```text
ACCEPTED

    Selected as the default technology direction.

DEFERRED

    Decision intentionally postponed until a real requirement exists.

OPTIONAL

    Permitted where requirements justify it, but not part of the mandatory baseline.

NOT INITIAL

    Explicitly excluded from the initial architecture.

REPLACEABLE

    Accepted implementation technology behind an architectural boundary that may evolve.
```

---

# 6. Technology Freeze Levels

Not every technology has the same long-term stability expectation.

```text
ARCHITECTURAL BASELINE

    language
    runtime family
    database model
    Application model
    API direction

IMPLEMENTATION DEFAULT

    framework
    ORM
    logging library
    validation library

PROVIDER IMPLEMENTATION

    object storage provider
    email provider
    AI provider
    cloud provider
    search engine

DEMAND-DRIVEN INFRASTRUCTURE

    distributed cache
    queue
    broker
    vector database
    Kubernetes
```

---

# 7. Canonical Technology Stack

The accepted baseline is:

| Area | Technology | Status |
|---|---|---|
| Primary Language | TypeScript | ACCEPTED |
| Runtime | Node.js Active LTS | ACCEPTED |
| Package Manager | pnpm | ACCEPTED |
| Monorepo Task Orchestration | Turborepo | ACCEPTED |
| Backend Framework | NestJS | ACCEPTED |
| Frontend Framework | Next.js | ACCEPTED |
| Frontend Library | React | ACCEPTED |
| API Style | REST / JSON | ACCEPTED |
| API Description | OpenAPI | ACCEPTED |
| Runtime Validation | Zod | ACCEPTED |
| Primary Database | PostgreSQL | ACCEPTED |
| ORM / Data Access Baseline | Prisma ORM | ACCEPTED |
| Schema Migration | Prisma Migrate | ACCEPTED |
| Unit / Component Testing | Vitest | ACCEPTED |
| HTTP/API Integration Testing | Supertest | ACCEPTED |
| Browser E2E Testing | Playwright | ACCEPTED |
| Real Infrastructure Testing | Testcontainers where valuable | ACCEPTED |
| Structured Logging | Pino | ACCEPTED |
| Observability Standard | OpenTelemetry | ACCEPTED |
| Formatting | Prettier | ACCEPTED |
| Static Analysis | ESLint | ACCEPTED |
| Architecture Dependency Analysis | dependency-cruiser or equivalent rule enforcement | ACCEPTED DIRECTION |
| Container Packaging | Docker | ACCEPTED |
| CI/CD Platform | GitHub Actions | ACCEPTED |
| Object Storage Interface | S3-compatible architecture | ACCEPTED |
| Development Object Storage | Local filesystem adapter | ACCEPTED |
| Image Processing | Sharp | ACCEPTED WHEN MEDIA BEGINS |
| Development Email | Mailpit or equivalent local SMTP sink | ACCEPTED |
| Email Transport Baseline | SMTP through Email Foundation | ACCEPTED |
| Search Baseline | PostgreSQL search capabilities | ACCEPTED |
| Dedicated Search Engine | None initially | DEFERRED |
| Distributed Cache | None initially | DEFERRED |
| Durable Job Queue | None initially | DEFERRED |
| AI Provider | Not frozen in Phase 0 | DEFERRED |
| Vector Search | Not initial | DEFERRED |
| Cloud Provider | Not frozen | DEFERRED |
| Kubernetes | None initially | NOT INITIAL |
| Public Plugin Runtime | None initially | NOT INITIAL |

---

# 8. Primary Language — TypeScript

AI World will use:

```text
TypeScript
```

as the primary Application and Platform implementation language.

Status:

```text
ACCEPTED
```

---

# 9. Why TypeScript

TypeScript provides strong alignment with AI World requirements:

```text
typed Contracts;

typed Domain Models;

typed Universe Definitions;

frontend/backend consistency;

large ecosystem;

Node.js integration;

AI SDK ecosystem;

compile-time dependency visibility;

excellent developer tooling.
```

---

# 10. TypeScript Is Not the Domain Model

TypeScript provides the implementation type system.

AI World still requires explicit:

```text
Domain Models;

runtime validation;

database constraints;

API Contracts.
```

Compile-time typing alone does not validate external input.

---

# 11. TypeScript Strictness

The repository should use strict TypeScript settings.

Baseline direction:

```text
strict: true
```

and additional strictness should be enabled where compatible.

Potential settings include:

```text
noUncheckedIndexedAccess

noImplicitOverride

useUnknownInCatchVariables

exactOptionalPropertyTypes
```

These should be introduced deliberately if framework/library compatibility permits.

---

# 12. `any` Policy

Uncontrolled:

```text
any
```

should not become the normal escape mechanism.

Prefer:

```text
unknown

typed generic

validated boundary type

explicit narrow cast.
```

---

# 13. Runtime — Node.js

Backend runtimes will use:

```text
Node.js
```

Status:

```text
ACCEPTED
```

---

# 14. Node Version Policy

AI World should use an:

```text
Active LTS Node.js release
```

for production development.

The exact runtime version must be pinned in repository configuration.

The architecture document should not require frequent edits for Node patch releases.

---

# 15. Node Version Consistency

The following should use the same supported major runtime where practical:

```text
local development;

CI;

production API;

Workers;

build tooling.
```

---

# 16. Runtime Pinning

The repository should pin Node through an appropriate repository-level version declaration.

Possible mechanisms include:

```text
.node-version

tool-version manager configuration

CI runtime declaration

container image version.
```

Only one canonical mechanism should drive developer expectations.

---

# 17. No Alternative Backend Runtime Initially

AI World will not initially introduce:

```text
Deno

Bun
```

as production backend runtimes.

Status:

```text
NOT INITIAL
```

They may be reconsidered only if future measurable advantages justify migration.

---

# 18. Package Manager — pnpm

Canonical package manager:

```text
pnpm
```

Status:

```text
ACCEPTED
```

---

# 19. Why pnpm

pnpm aligns well with AI World because it provides:

```text
workspace support;

deterministic lockfile;

efficient dependency storage;

strict dependency visibility;

good monorepo ergonomics.
```

---

# 20. Single Package Manager Rule

Do not maintain mixed:

```text
npm lockfile

yarn lockfile

pnpm lockfile
```

inside AI World.

Canonical:

```text
pnpm-lock.yaml
```

---

# 21. Lockfile Policy

The lockfile must be:

```text
committed;

used by CI;

used for production builds.
```

CI should use frozen-lockfile behavior.

---

# 22. Dependency Version Policy

Do not use:

```text
latest

*

unbounded dependency versions.
```

Dependency upgrades must arrive through explicit repository changes.

---

# 23. Dependency Update Strategy

Dependencies should be upgraded through controlled pull requests.

Updates should prioritize:

```text
security;

bug fixes;

supported runtime compatibility;

framework support windows.
```

Major upgrades require deliberate review.

---

# 24. Package Manager Version

The pnpm version should be pinned through repository package-manager metadata or equivalent tooling.

Developer environments and CI should use the same expected pnpm version.

---

# 25. Monorepo — Turborepo

AI World will use:

```text
Turborepo
```

for monorepo task orchestration.

Status:

```text
ACCEPTED
```

---

# 26. Turborepo Responsibility

Turborepo may coordinate:

```text
build;

typecheck;

lint;

test;

development tasks;

dependency-aware execution;

cacheable repository tasks.
```

---

# 27. Turborepo Is Not Architecture Enforcement Alone

Turborepo does not replace:

```text
package boundaries;

ESLint rules;

architecture tests;

dependency-cruiser;

code review.
```

---

# 28. Nx

AI World will not use Nx initially.

Status:

```text
NOT INITIAL
```

Reason:

```text
Turborepo + pnpm provides sufficient initial monorepo orchestration
with less framework/tooling surface.
```

Nx may be reconsidered only if advanced repository requirements justify migration.

---

# 29. Backend Framework — NestJS

Canonical backend framework:

```text
NestJS
```

Status:

```text
ACCEPTED
```

---

# 30. Why NestJS

NestJS aligns with AI World because it provides:

```text
modular backend organization;

dependency injection;

HTTP/API integration;

guards;

interceptors;

pipes;

testing integration;

background/runtime compatibility;

mature Node ecosystem.
```

---

# 31. NestJS Does Not Define Platform Boundaries

Nest Modules should reflect AI World ownership where practical.

Do not allow framework conveniences to produce:

```text
one global SharedModule;

circular module graphs;

global service access;

unowned business logic.
```

---

# 32. NestJS Module Rule

A Nest Module may correspond to:

```text
Application adapter;

Platform integration;

Foundation integration;

Composition Root wiring.
```

It does not automatically become an architectural Capability.

---

# 33. NestJS `forwardRef`

Framework mechanisms such as:

```text
forwardRef
```

must not be used to hide architectural cycles.

Any requirement for `forwardRef` between major Platforms triggers dependency review.

---

# 34. NestJS Global Modules

Global modules should be limited to genuinely low-level infrastructure where broad access is intentional.

Possible examples:

```text
Configuration;

Observability.
```

Business Platforms should not become global by convenience.

---

# 35. Backend Domain Independence

Where practical, Domain Models and important Platform Contracts should remain independent from NestJS-specific types.

Avoid Domain code depending on:

```text
Request

Response

Controller

Guard

Decorator metadata.
```

---

# 36. Backend Initial Deployment Model

Initial backend direction:

```text
MODULAR MONOLITH
```

running as one primary API Application.

Status:

```text
ACCEPTED
```

---

# 37. Modular Monolith Rationale

This provides:

```text
simple deployment;

simple debugging;

local transactions;

lower operational overhead;

fast architectural iteration;

strong logical boundaries without distributed complexity.
```

---

# 38. Microservices

Microservices are:

```text
NOT INITIAL
```

A Platform becomes independently deployed only when evidence shows a need such as:

```text
independent scale;

security isolation;

special runtime;

availability requirement;

independent deployment lifecycle.
```

---

# 39. Service Extraction Principle

Logical Capability boundaries are established first.

Physical distribution comes later.

---

# 40. Frontend Framework — Next.js

Canonical first-party Web framework:

```text
Next.js
```

Status:

```text
ACCEPTED
```

---

# 41. Frontend Library — React

Canonical UI library:

```text
React
```

Status:

```text
ACCEPTED
```

---

# 42. Next.js Application Model

Use:

```text
App Router
```

as the default modern application structure.

The Web Application should be server-first where appropriate.

---

# 43. Server Components Direction

Server rendering and Server Components may be used for:

```text
initial data loading;

SEO-sensitive pages;

public Knowledge browsing;

reducing unnecessary browser JavaScript.
```

---

# 44. Client Components Direction

Client Components should be used where real client interaction requires:

```text
forms;

interactive editors;

stateful UI;

browser APIs;

rich interactions.
```

Do not mark large feature trees client-side by default.

---

# 45. Web-to-Backend Boundary

The initial architectural direction is:

```text
apps/web
    ↓ HTTP
apps/api
    ↓
Platform capabilities
```

The Web Application must not become a second backend implementation.

---

# 46. No Direct Database From Next.js

`apps/web` must not directly access canonical database models for ordinary business behavior.

Bad:

```text
Next.js page
    → Prisma
    → Knowledge table.
```

Preferred:

```text
Next.js
    → AI World API
    → Knowledge Platform.
```

---

# 47. No Backend Platform Implementation Imports Into Web

The default rule is:

```text
apps/web
```

does not import server-side Platform implementation packages.

Browser-safe Contracts may be generated from OpenAPI or exposed through explicitly browser-safe interfaces later.

---

# 48. Why Separate Web and API

The separate backend API supports:

```text
future mobile clients;

future external APIs;

Workers;

clear security boundaries;

independent backend architecture;

frontend replacement without Domain rewrite.
```

---

# 49. Styling — Tailwind CSS

Initial Web styling direction:

```text
Tailwind CSS
```

Status:

```text
ACCEPTED
```

---

# 50. UI Framework Policy

AI World will not initially lock itself into a large opinionated UI component framework.

Reusable accessible primitives may be introduced where needed.

---

# 51. Design System Direction

Begin with:

```text
application-level reusable components.
```

Extract a shared UI package only when multiple Applications require it.

---

# 52. Frontend Global State

No large global client state framework is required initially.

Status:

```text
NOT INITIAL
```

Prefer:

```text
server state;

URL state;

React local state;

small focused contexts.
```

---

# 53. TanStack Query

TanStack Query or equivalent is:

```text
OPTIONAL
```

Use it when client-side server-state synchronization provides real value.

It is not mandatory for every API request.

---

# 54. Redux

Redux is:

```text
NOT INITIAL
```

Introduce only if product complexity demonstrates a genuine need for global client state.

---

# 55. Runtime Validation — Zod

Canonical runtime schema validation technology:

```text
Zod
```

Status:

```text
ACCEPTED
```

---

# 56. Zod Usage

Appropriate uses include:

```text
environment configuration;

HTTP input;

external Provider payload normalization;

Universe configuration;

typed Definition validation;

form validation where useful.
```

---

# 57. Zod Is Not the Entire Domain Model

Do not move every Domain invariant into Zod schemas.

Complex Domain rules remain with their canonical owners.

---

# 58. API Style — REST / JSON

Initial external and Web-facing API style:

```text
REST over HTTP
+
JSON
```

Status:

```text
ACCEPTED
```

---

# 59. Why REST First

REST provides:

```text
simple tooling;

browser compatibility;

mobile compatibility;

OpenAPI support;

clear resource/use-case boundaries;

low operational complexity.
```

---

# 60. OpenAPI

Canonical API description format:

```text
OpenAPI
```

Status:

```text
ACCEPTED
```

---

# 61. OpenAPI Uses

OpenAPI should support:

```text
API documentation;

contract review;

client generation where useful;

testing;

integration development.
```

---

# 62. OpenAPI Does Not Own Domain Models

External API schemas may differ from:

```text
Domain Models;

Prisma Models;

internal application objects.
```

---

# 63. API Client Generation

Generated API types/client code may be introduced once API surface becomes substantial.

Status:

```text
OPTIONAL / EXPECTED LATER
```

Generated code must remain reproducible.

---

# 64. GraphQL

GraphQL is:

```text
NOT INITIAL
```

Reason:

```text
current requirements do not justify maintaining an additional query/runtime model.
```

It may be reconsidered for future highly compositional external APIs.

---

# 65. tRPC

tRPC is:

```text
NOT INITIAL
```

The primary reason is that AI World intends to support clients beyond one TypeScript Web Application.

The canonical backend Contract should remain independently consumable.

---

# 66. gRPC

gRPC is:

```text
DEFERRED
```

It may become useful only if independently deployed internal services later require high-performance typed RPC.

---

# 67. WebSockets

WebSockets are:

```text
DEFERRED
```

Introduce only for genuinely bidirectional realtime use cases.

---

# 68. Server-Sent Events

SSE is:

```text
OPTIONAL LATER
```

It may be preferable for one-way progress/event streams such as:

```text
AI generation progress;

long-running Job status.
```

---

# 69. Primary Database — PostgreSQL

Canonical relational database:

```text
PostgreSQL
```

Status:

```text
ACCEPTED
```

---

# 70. Why PostgreSQL

PostgreSQL aligns with AI World because it supports:

```text
strong relational integrity;

transactions;

structured relational modeling;

JSONB where controlled extensibility is required;

text search;

advanced indexing;

mature operational tooling;

extensions;

large ecosystem.
```

---

# 71. PostgreSQL Is Canonical Operational Storage

PostgreSQL will initially hold most canonical Platform state.

Specialized stores may later appear only where requirements justify them.

---

# 72. One Primary Database Initially

Initial direction:

```text
one PostgreSQL database
```

with logical Capability ownership.

Do not create:

```text
one database per Platform

one database per Universe
```

initially.

---

# 73. Logical Ownership Remains Mandatory

One physical PostgreSQL database does not authorize:

```text
cross-Platform table writes;

unrestricted ORM access;

shared canonical ownership.
```

---

# 74. Database Version Policy

Development, CI, staging, and production should run compatible PostgreSQL major versions.

Production should use a currently supported stable PostgreSQL major at environment creation.

---

# 75. PostgreSQL JSONB

JSONB is permitted for:

```text
bounded configuration;

provider metadata;

extensible non-core data;

some Metadata implementation.
```

---

# 76. JSONB Restriction

JSONB must not become the default replacement for:

```text
typed Domain Models;

important searchable fields;

relational constraints;

stable business concepts.
```

---

# 77. MongoDB

MongoDB is:

```text
NOT INITIAL
```

There is no current requirement sufficient to justify operating a second canonical database model.

---

# 78. Graph Database

Neo4j or another graph database is:

```text
NOT INITIAL
```

AI World supports graph-like Knowledge relationships conceptually without requiring a graph database.

---

# 79. Relationship Persistence

Initial Relationship persistence should use PostgreSQL.

A graph store may be introduced later only if measured traversal requirements justify it.

---

# 80. ORM — Prisma

Canonical initial ORM/data-access baseline:

```text
Prisma ORM
```

Status:

```text
ACCEPTED
```

---

# 81. Why Prisma

Prisma provides:

```text
typed database access;

PostgreSQL support;

schema migrations;

developer productivity;

transaction support;

mature TypeScript integration.
```

---

# 82. Prisma Is Persistence Infrastructure

Prisma models must remain:

```text
persistence representations.
```

They are not canonical public Domain Models.

---

# 83. Prisma Type Leakage Rule

Prisma-generated model types must not appear in:

```text
external API Contracts;

Universe public definitions;

cross-Platform public Contracts;

frontend Contracts.
```

---

# 84. Prisma Access Location

Prisma access should be confined to:

```text
Database Foundation integration;

owned Platform persistence implementations;

Kernel persistence implementations;

migration tooling;

appropriate integration tests.
```

---

# 85. No Generic Prisma Repository

Do not create:

```text
GenericRepository<T>
```

merely to hide Prisma.

Repositories should exist only where Domain ownership and query behavior justify them.

---

# 86. No Fake ORM Neutrality

AI World will not construct a large generic ORM abstraction pretending PostgreSQL/Prisma do not exist.

Replaceability is achieved through:

```text
Domain ownership;

repository boundaries;

public Contracts;

localized persistence details.
```

---

# 87. Raw SQL

Raw SQL is permitted inside owned persistence/Discovery implementations when it provides a clear benefit.

Examples:

```text
advanced PostgreSQL search;

optimized joins;

specialized reporting.
```

---

# 88. Raw SQL Restriction

Raw SQL must still respect:

```text
ownership;

security;

parameterization;

migration compatibility;

testing.
```

---

# 89. Prisma Schema Organization

Where supported, Prisma schema should be organized into owner-oriented logical files/sections.

Conceptually:

```text
database/
└── prisma/
    └── schema/
        ├── foundation.prisma
        ├── identity-access.prisma
        ├── user.prisma
        ├── knowledge.prisma
        ├── media.prisma
        └── engagement.prisma
```

Exact physical layout depends on the Prisma version selected during implementation.

---

# 90. Central Schema Does Not Mean Central Ownership

Even if Prisma requires a centralized physical schema integration point:

```text
Identity models
    remain Identity & Access-owned.

Knowledge models
    remain Knowledge-owned.

Media models
    remain Media-owned.
```

---

# 91. Database Foundation Responsibility

Database Foundation owns:

```text
Prisma client lifecycle;

database connection health;

transaction infrastructure;

technical database initialization.
```

It does not own Domain models semantically.

---

# 92. Prisma Migrate

Schema migration technology:

```text
Prisma Migrate
```

Status:

```text
ACCEPTED
```

---

# 93. Schema Migration Rule

All schema changes must be version-controlled.

No manual production schema changes as normal workflow.

---

# 94. Migration Naming

Migration intent should reveal the canonical owner.

Examples conceptually:

```text
identity_access_create_sessions

knowledge_add_entity_status

media_add_asset_checksum.
```

---

# 95. Application Data Migrations

Complex semantic backfills should not be disguised as ordinary seed data.

Use explicit:

```text
application/data migration scripts
```

owned by the affected Capability.

---

# 96. Seed Strategy

Seed execution should use TypeScript and canonical Platform operations or controlled persistence mechanisms according to seed purpose.

---

# 97. Seed Categories

Distinguish:

```text
reference seed;

development seed;

test fixtures;

data migrations.
```

They are not interchangeable.

---

# 98. Identifier Technology

The exact canonical Resource identifier format is:

```text
DEFERRED TO IDENTIFIERS / DATA ARCHITECTURE
```

Technology Strategy does not select IDs simply because PostgreSQL/Prisma offers a convenient default.

---

# 99. Time Storage

Canonical server timestamps should be normalized consistently.

Preferred database direction:

```text
timestamp with timezone semantics where appropriate.
```

Platform APIs should use unambiguous standardized time representations.

Detailed standards belong to Data/Engineering documentation.

---

# 100. Search Baseline

Initial Search implementation will use:

```text
PostgreSQL
```

through the Discovery Platform.

Status:

```text
ACCEPTED
```

---

# 101. PostgreSQL Search Capabilities

Initial Discovery may use:

```text
full-text search;

GIN indexes;

trigram similarity;

structured filters;

relational ranking signals.
```

as requirements demand.

---

# 102. Search Architecture Remains Abstracted

Even when PostgreSQL implements Search initially:

```text
Discovery Platform
```

owns Search semantics.

Applications must not execute arbitrary search SQL themselves.

---

# 103. Dedicated Search Engine

A dedicated engine such as:

```text
OpenSearch;

Elasticsearch;

Meilisearch;

Typesense;

another specialized provider
```

is:

```text
DEFERRED
```

---

# 104. Dedicated Search Trigger

Introduce dedicated Search infrastructure only when PostgreSQL can no longer adequately satisfy requirements such as:

```text
ranking quality;

large index size;

faceting;

query latency;

advanced language analysis;

independent scaling.
```

---

# 105. Search Provider Migration

Because Discovery owns the search boundary:

```text
PostgreSQL search
```

may later be replaced or supplemented by:

```text
dedicated Search Adapter
```

without changing Knowledge ownership.

---

# 106. Vector Search

Vector Search is:

```text
DEFERRED
```

---

# 107. pgvector

If semantic retrieval first becomes necessary, PostgreSQL-based vector capability should be evaluated before introducing an independent vector database.

Status:

```text
OPTIONAL FUTURE
```

---

# 108. Dedicated Vector Database

Dedicated vector infrastructure is:

```text
NOT INITIAL
```

It requires evidence that PostgreSQL-based vector capability is insufficient.

---

# 109. Cache Strategy

AI World will begin without a distributed cache.

Status:

```text
ACCEPTED STRATEGY
```

---

# 110. Redis

Redis is:

```text
DEFERRED
```

It will not be introduced merely because it is common in Web architectures.

---

# 111. Cache Introduction Trigger

Distributed Cache becomes justified when measurements show:

```text
repeated expensive reads;

rate-limit state requirements;

shared ephemeral coordination;

performance bottlenecks;

specific Session architecture requiring it.
```

---

# 112. Process-Local Cache

Small process-local caching may be used for:

```text
immutable configuration;

small reference data;

safe memoization.
```

It must never be assumed globally consistent across multiple runtime instances.

---

# 113. Cache Failure Principle

Canonical correctness must not depend on Cache availability unless a future architecture explicitly declares otherwise.

---

# 114. Queue Strategy

AI World will not deploy a durable Queue during Engineering Foundation merely because future Media and AI features may need one.

Status:

```text
DEFERRED
```

---

# 115. Queue Introduction Trigger

A durable Queue should be introduced when real asynchronous work requires:

```text
retries;

durability;

worker scaling;

process restart survival;

delayed execution;

long-running Job execution.
```

---

# 116. Likely Queue Consumers

Future consumers may include:

```text
Media processing;

AI Generation;

Search indexing;

bulk import;

email delivery;

reconciliation.
```

---

# 117. Queue Technology Selection

The first durable Queue implementation should favor:

```text
minimal infrastructure;

reliable Node.js support;

clear retry semantics;

operational simplicity;

Job observability.
```

---

# 118. PostgreSQL-Backed Queue Preference

When the first Queue requirement appears, PostgreSQL-backed job queues should be evaluated before introducing Redis solely for Queue transport.

Potential implementations may include mature PostgreSQL-backed Node job systems available at that time.

---

# 119. Redis Queue Escalation

Redis/BullMQ or another dedicated Queue system may be selected if workload characteristics justify:

```text
higher throughput;

specialized scheduling;

strong operational ecosystem;

independent Queue scaling.
```

---

# 120. Kafka

Kafka is:

```text
NOT INITIAL
```

There is no current event-streaming requirement that justifies its operational complexity.

---

# 121. RabbitMQ

RabbitMQ is:

```text
DEFERRED
```

It may be considered only when messaging requirements exceed the initial Queue strategy.

---

# 122. Temporal

Temporal or another distributed workflow engine is:

```text
NOT INITIAL
```

AI World Workflow semantics must first be proven through actual Platform requirements.

---

# 123. Scheduler Strategy

Dedicated scheduling infrastructure is:

```text
DEFERRED
```

---

# 124. Scheduler Introduction

Scheduled operations may initially use:

```text
deployment scheduler;

future Queue scheduler;

small Foundation scheduler.
```

The choice depends on actual scheduling requirements.

---

# 125. Cron Rule

Do not scatter unmanaged cron expressions throughout business modules.

Scheduled business operations remain owned by their Platforms.

---

# 126. Event Technology

Initial internal Events should be:

```text
in-process
```

behind the Events Kernel Contract.

Status:

```text
ACCEPTED INITIAL DIRECTION
```

---

# 127. Events Kernel Independence

The public Events abstraction must not depend permanently on a NestJS event package or external broker semantics.

---

# 128. Event Implementation

A small in-process dispatcher or framework adapter is sufficient initially.

No broker is required before durability requirements exist.

---

# 129. Reliable Events

When canonical commits require reliable asynchronous delivery, evaluate:

```text
Transactional Outbox

durable Queue/broker

consumer idempotency

reconciliation.
```

---

# 130. No Event Sourcing Initially

Event Sourcing is:

```text
NOT INITIAL
```

Canonical state remains primarily relational operational state.

---

# 131. CQRS

AI World may use conceptual:

```text
Commands

Queries
```

where useful.

A dedicated CQRS framework is:

```text
NOT REQUIRED INITIALLY
```

---

# 132. Object Storage Strategy

Media binary content must be stored through:

```text
Storage Foundation
```

rather than inside Application source directories.

---

# 133. Production Storage Interface

Canonical production capability:

```text
S3-compatible object storage interface
```

Status:

```text
ACCEPTED
```

---

# 134. Why S3-Compatible

The S3 protocol provides broad compatibility across:

```text
cloud object storage;

S3-compatible providers;

local/emulated solutions;

future provider migration.
```

Provider SDK types remain internal to the Adapter.

---

# 135. Production Storage Provider

The actual hosted object-storage vendor is:

```text
DEFERRED
```

until deployment infrastructure is selected.

---

# 136. Development Storage

Local development may initially use:

```text
filesystem Storage Adapter.
```

Status:

```text
ACCEPTED
```

---

# 137. Local Filesystem Limitation

Filesystem Storage is development-only unless explicitly approved otherwise.

Production Media must not rely on local container disk durability.

---

# 138. Direct Upload Strategy

Initial Media upload may pass through:

```text
API
    → Media
    → Storage.
```

---

# 139. Signed Upload Strategy

Direct signed object-storage upload may be introduced later when:

```text
large files;

bandwidth;

upload scale
```

justify bypassing the API data path.

AI World must still own authorization and Asset lifecycle.

---

# 140. Image Processing

Canonical image processing library:

```text
Sharp
```

Status:

```text
ACCEPTED WHEN MEDIA PLATFORM IMPLEMENTATION BEGINS
```

---

# 141. Image Processing Uses

Potential uses:

```text
resize;

thumbnail generation;

format conversion;

metadata extraction;

optimization.
```

---

# 142. Video Processing

FFmpeg is:

```text
DEFERRED UNTIL VIDEO PROCESSING IS REQUIRED
```

Do not deploy video-processing infrastructure during initial Media implementation unless a real feature requires it.

---

# 143. Email Strategy

AI World will own Email delivery through:

```text
Email Foundation.
```

---

# 144. Development Email

Development should use a local mail sink such as:

```text
Mailpit
```

or equivalent.

Status:

```text
ACCEPTED
```

This prevents local development from sending real transactional email.

---

# 145. Email Transport

Initial Email delivery abstraction should support:

```text
SMTP.
```

A mature Node mail transport library may be used behind the Foundation.

---

# 146. Production Email Provider

The production Email provider is:

```text
DEFERRED
```

until deployment and deliverability requirements are established.

---

# 147. Provider-Specific Email API

A provider-specific HTTP Adapter may later be added when requirements such as:

```text
delivery events;

templates;

analytics;

provider features
```

justify it.

---

# 148. Email Templates

Business-specific Email content remains owned by the requesting Platform.

The Email Foundation owns:

```text
delivery/rendering mechanics
```

where shared.

---

# 149. Authentication Technology Direction

Identity & Access will be implemented as an AI World Platform capability.

AI World will not make an external authentication SaaS the canonical owner of identity architecture.

Status:

```text
ACCEPTED
```

---

# 150. Authentication Ownership

External Identity providers may later participate.

AI World still owns:

```text
Actor mapping;

Session;

Authorization;

Roles;

Permissions;

Universe scope.
```

---

# 151. Password Hashing

Password credentials must use:

```text
Argon2id
```

through a maintained implementation.

Status:

```text
ACCEPTED
```

---

# 152. Password Storage

Never store:

```text
plain passwords;

reversible password encryption.
```

Only secure password hashes and required algorithm parameters are persisted.

---

# 153. Browser Session Strategy

Initial first-party browser authentication should use:

```text
server-managed opaque Sessions
+
Secure HttpOnly cookies.
```

Status:

```text
ACCEPTED
```

---

# 154. Why Opaque Sessions

Opaque Sessions support:

```text
central revocation;

Session listing;

Session lifecycle control;

logout;

security activity;

server-side Authorization integration.
```

---

# 155. Browser Token Storage

Authentication credentials/session secrets must not be stored in:

```text
localStorage
```

as the default browser authentication architecture.

---

# 156. Cookie Security

Production Session cookies should use appropriate:

```text
HttpOnly;

Secure;

SameSite;

Path/Domain controls.
```

Exact policy depends on deployment topology.

---

# 157. Web and API Origin Strategy

Prefer Web and API deployment under a compatible same-site architecture where practical.

This reduces unnecessary:

```text
CORS;

cookie;

CSRF;

cross-site authentication complexity.
```

---

# 158. CSRF

Cookie-based mutation endpoints must be designed with CSRF protection appropriate to deployment topology.

Detailed controls belong to Security architecture.

---

# 159. JWT Strategy

JWT is:

```text
NOT THE DEFAULT USER SESSION STORAGE MODEL.
```

---

# 160. JWT Permitted Uses

JWT/JWS may be introduced for:

```text
machine credentials;

external API tokens;

short-lived signed assertions;

federation/OIDC.
```

when the use case requires it.

---

# 161. JWT Library

If signed token standards are required, use a maintained standards-oriented JOSE implementation rather than implementing token cryptography manually.

---

# 162. Verification Tokens

Email verification and recovery tokens should use:

```text
cryptographically secure random values;

short lifetime;

single-use semantics where appropriate;

safe server-side representation.
```

---

# 163. Authorization Baseline

Initial Authorization should support:

```text
Roles;

Permissions;

Resource/Universe context.
```

---

# 164. Policy Engine

A generalized Policy engine remains:

```text
DEFERRED
```

until real contextual policy requirements justify it.

---

# 165. OAuth / OIDC

External authentication through:

```text
OAuth/OIDC
```

is:

```text
LATER / OPTIONAL
```

It should integrate with Identity & Access rather than replace its canonical ownership.

---

# 166. Passport

Framework authentication helpers such as Passport may be used for specific external authentication protocols if useful.

They must not define the Identity Domain Model.

---

# 167. AI Technology Strategy

AI World deliberately separates:

```text
AI Platform architecture
```

from:

```text
AI Provider selection.
```

---

# 168. AI Provider Status

No AI Provider is permanently selected in Phase 0.

Status:

```text
DEFERRED TO AI PLATFORM PHASE
```

---

# 169. AI Provider Selection Criteria

The initial AI Provider should be evaluated against:

```text
required modalities;

model quality;

tool/function capabilities;

structured output;

latency;

cost;

availability;

data handling;

safety;

rate limits;

SDK quality;

regional requirements.
```

---

# 170. AI Provider Integration Rule

Only:

```text
AI / Creator Provider Adapters
```

may directly depend on Provider SDKs.

---

# 171. AI Provider SDK Rule

Use the official or otherwise well-maintained Provider SDK where appropriate.

Do not expose Provider request/response types outside the Adapter boundary.

---

# 172. AI Orchestration Framework

No large AI orchestration framework is selected initially.

Status:

```text
NOT INITIAL
```

---

# 173. LangChain / Similar Frameworks

Frameworks such as broad agent/RAG orchestration libraries must not become AI World's canonical AI architecture merely for convenience.

They may be used internally later only if:

```text
they solve a demonstrated capability;

their abstractions fit AI World;

Provider/domain ownership remains intact.
```

---

# 174. AI Tooling

AI Tools should be modeled through AI World-owned typed Contracts.

They must not be arbitrary provider callback objects spread through Domain code.

---

# 175. AI Context Retrieval

AI should consume canonical Knowledge through:

```text
Knowledge/Discovery public Contracts.
```

It must not query arbitrary Platform tables.

---

# 176. AI Structured Output

Where Providers support structured generation, Provider-specific structured output should be normalized into AI World schemas and validated before use.

---

# 177. AI Canonical Acceptance

AI output remains a:

```text
Generation Result
```

until accepted by the canonical owner.

Technology must preserve this lifecycle.

---

# 178. Embeddings

Embedding generation is:

```text
DEFERRED
```

until semantic Search, recommendations, or AI retrieval require it.

---

# 179. Vector Store

No independent Vector Database is selected.

Status:

```text
NOT INITIAL
```

---

# 180. AI Agents

Agent frameworks and autonomous multi-step execution are:

```text
LATER / OPTIONAL
```

They are not part of initial AI implementation.

---

# 181. Observability — Structured Logging

Canonical logging technology:

```text
Pino
```

Status:

```text
ACCEPTED
```

---

# 182. Logging Format

Production logs should be:

```text
structured JSON.
```

Development may use human-readable formatting.

---

# 183. Logging Fields

Important logs should support fields such as:

```text
timestamp;

level;

message;

request/correlation ID;

Capability;

Actor ID where safe;

Resource ID where useful;

error details.
```

---

# 184. Logging Privacy

Sensitive values must not be logged unnecessarily.

Examples to exclude:

```text
passwords;

Session secrets;

API keys;

raw access tokens;

sensitive personal data.
```

---

# 185. OpenTelemetry

Canonical telemetry interoperability standard:

```text
OpenTelemetry
```

Status:

```text
ACCEPTED
```

---

# 186. OpenTelemetry Scope

OpenTelemetry may eventually provide:

```text
traces;

metrics;

context propagation;

exporter integration.
```

---

# 187. OpenTelemetry Incremental Adoption

Do not deploy a complex observability stack during initial Engineering Foundation solely to satisfy future tracing requirements.

Begin with:

```text
structured logs;

correlation;

health.
```

Add metrics/tracing as operational needs mature.

---

# 188. Observability Backend

No hosted monitoring/telemetry provider is frozen.

Status:

```text
DEFERRED
```

---

# 189. Error Tracking Service

A hosted error tracking service may be added later.

Status:

```text
OPTIONAL
```

It must integrate through Observability concerns rather than spread SDK usage across Domain code.

---

# 190. Health Endpoints

The API should expose at least:

```text
liveness/health
```

and later:

```text
readiness
```

where infrastructure requires the distinction.

---

# 191. Health Ownership

Each dependency/capability defines meaningful health.

The Application aggregates health for runtime infrastructure.

---

# 192. Testing Strategy — Vitest

Canonical TypeScript unit/component test runner:

```text
Vitest
```

Status:

```text
ACCEPTED
```

---

# 193. Vitest Scope

Use for:

```text
Domain tests;

Application Service tests;

utility tests;

frontend component/unit tests;

most fast integration tests.
```

---

# 194. Jest

Jest is:

```text
NOT THE DEFAULT
```

Do not maintain both Jest and Vitest without a strong reason.

---

# 195. API Testing — Supertest

HTTP-level NestJS integration/E2E testing should use:

```text
Supertest
```

or an equivalent lightweight HTTP testing interface.

Status:

```text
ACCEPTED
```

---

# 196. Browser Testing — Playwright

Canonical browser E2E framework:

```text
Playwright
```

Status:

```text
ACCEPTED
```

---

# 197. Playwright Uses

Use for critical flows such as:

```text
registration;

login;

logout;

Knowledge browsing;

creator flows;

authorization boundaries;

future Media upload.
```

---

# 198. Database Integration Testing

Database behavior should be validated against:

```text
real PostgreSQL
```

for queries/constraints/transactions where correctness matters.

---

# 199. Testcontainers

Use:

```text
Testcontainers
```

where automated ephemeral infrastructure provides sufficient value.

Status:

```text
ACCEPTED WHEN USEFUL
```

---

# 200. Mock Database Rule

Do not rely entirely on mocked Repository/Prisma behavior for persistence correctness.

Real integration tests are required for important database behavior.

---

# 201. Provider Testing

Provider Adapters should have:

```text
unit translation tests;

error normalization tests;

optional live/sandbox integration suites.
```

---

# 202. Test Pyramid Direction

Prefer:

```text
many fast Domain/unit tests;

focused integration tests;

smaller critical E2E suite.
```

---

# 203. Test Coverage

A universal numeric coverage target is not frozen in Phase 0.

Critical business behavior and security paths require explicit tests regardless of percentage.

---

# 204. Property-Based Testing

Property-based testing libraries are:

```text
OPTIONAL
```

They may be useful for:

```text
identifiers;

relationship constraints;

permission evaluation;

schema invariants.
```

---

# 205. Linting — ESLint

Canonical linting framework:

```text
ESLint
```

Status:

```text
ACCEPTED
```

---

# 206. ESLint Responsibilities

ESLint should enforce:

```text
code correctness rules;

TypeScript best practices;

framework-specific rules;

selected import restrictions.
```

---

# 207. Formatting — Prettier

Canonical formatter:

```text
Prettier
```

Status:

```text
ACCEPTED
```

Formatting debates should not occupy code review.

---

# 208. Architecture Dependency Checks

AI World should add automated dependency checks when implementation packages exist.

Accepted direction:

```text
dependency-cruiser
```

or an equivalent architecture graph enforcement tool.

---

# 209. Architecture Check Requirements

The tool must be able to detect:

```text
forbidden layer imports;

cycles;

deep imports;

Universe-to-Foundation violations;

Platform-to-Universe violations;

provider SDK leakage.
```

---

# 210. ESLint Architecture Rules

Some local dependency restrictions may also use:

```text
ESLint no-restricted-imports
```

or equivalent rules.

---

# 211. Architecture Enforcement Layering

Preferred:

```text
package exports
    +
workspace dependency graph
    +
ESLint import restrictions
    +
architecture tests.
```

No single mechanism is expected to solve every boundary.

---

# 212. Git Hooks

Git hooks are:

```text
OPTIONAL
```

CI remains authoritative.

Hooks may later improve developer feedback but should not become required for correctness.

---

# 213. Commitlint

Conventional commit validation is:

```text
OPTIONAL
```

It may be adopted if automated release/change-log processes later benefit from it.

---

# 214. CI/CD — GitHub Actions

Canonical CI/CD platform:

```text
GitHub Actions
```

Status:

```text
ACCEPTED
```

---

# 215. Initial CI Pipeline

The initial CI pipeline should eventually run:

```text
install with frozen lockfile;

format verification;

lint;

typecheck;

unit tests;

integration tests where appropriate;

architecture checks;

build.
```

---

# 216. Security CI Evolution

Later CI may include:

```text
dependency vulnerability checks;

secret detection;

static security analysis;

container scanning;

migration validation.
```

according to production maturity.

---

# 217. CI Is Source of Truth

Local hooks may assist.

Merge eligibility should depend on CI rather than individual developer tooling configuration.

---

# 218. Turborepo in CI

Turborepo should coordinate affected task execution and caching where beneficial.

Remote cache may be added later.

---

# 219. Docker

Application packaging standard:

```text
Docker
```

Status:

```text
ACCEPTED
```

---

# 220. Container Targets

Likely production artifacts:

```text
Web container;

API container;

Worker container when introduced.
```

---

# 221. Backend Runtime Model

NestJS API should initially target:

```text
long-running Node.js container/process
```

rather than serverless functions.

---

# 222. Why Long-Running API

This better matches:

```text
modular backend lifecycle;

database connections;

background integration;

predictable runtime behavior;

future WebSocket/SSE support.
```

---

# 223. Next.js Runtime

The Web Application should use the standard Node-compatible Next.js production runtime unless deployment requirements later justify another model.

---

# 224. Edge Runtime

Edge runtime is:

```text
OPTIONAL / NOT DEFAULT
```

Canonical business logic must not depend on edge-specific limitations.

---

# 225. Local Development Containers

Local development should containerize infrastructure dependencies, not necessarily every developer process.

Preferred:

```text
API/Web
    run through pnpm locally

PostgreSQL/Mailpit/etc.
    run through Docker Compose.
```

---

# 226. Docker Compose

Local infrastructure orchestration should use:

```text
Docker Compose
```

when multiple dependencies exist.

Status:

```text
ACCEPTED
```

---

# 227. Local Infrastructure Location

Preferred repository direction:

```text
infrastructure/local/compose.yml
```

or equivalent accepted infrastructure location.

Do not duplicate competing Compose definitions.

---

# 228. Initial Local Infrastructure

Early Engineering Foundation should require as little infrastructure as possible.

Likely:

```text
PostgreSQL
```

and when Identity email begins:

```text
Mailpit.
```

---

# 229. Redis Not in Initial Compose

Do not add Redis before a confirmed Queue/Cache requirement.

---

# 230. Search Engine Not in Initial Compose

Do not add Elasticsearch/OpenSearch/Meilisearch/etc. before a dedicated Search requirement exists.

---

# 231. Vector DB Not in Initial Compose

Do not add one before semantic retrieval exists.

---

# 232. Message Broker Not in Initial Compose

Do not add one before durable asynchronous messaging exists.

---

# 233. Infrastructure as Code

The final Infrastructure-as-Code technology is:

```text
DEFERRED
```

until production cloud/provider requirements are selected.

---

# 234. IaC Selection Criteria

Future selection should optimize for:

```text
provider support;

state management;

reviewability;

automation;

team familiarity;

portability;

operational maturity.
```

---

# 235. Cloud Provider

No permanent cloud provider is selected in Phase 0.

Status:

```text
DEFERRED
```

---

# 236. Cloud Neutrality Scope

AI World aims for:

```text
reasonable provider replaceability
```

not:

```text
perfect lowest-common-denominator cloud abstraction.
```

---

# 237. Managed Services

Production should prefer mature managed infrastructure where it reduces operational burden.

Likely categories:

```text
managed PostgreSQL;

managed object storage;

managed email;

managed monitoring.
```

Actual providers remain deferred.

---

# 238. Kubernetes

Kubernetes is:

```text
NOT INITIAL
```

---

# 239. Kubernetes Introduction Trigger

Consider Kubernetes only when operational requirements such as:

```text
many independently deployed services;

advanced scheduling;

multi-service autoscaling;

platform team maturity;

specific infrastructure needs
```

justify its cost.

---

# 240. Service Mesh

Service mesh technology is:

```text
NOT INITIAL
```

---

# 241. API Gateway

A dedicated API Gateway product is:

```text
DEFERRED
```

Initial routing can use the hosting platform/reverse proxy.

---

# 242. Reverse Proxy

Production infrastructure may expose:

```text
Web

/api
```

through one site/reverse-proxy topology where practical.

The exact technology is deployment-specific.

---

# 243. Secrets Management

Production Secrets must use the hosting environment's managed secret mechanism or another approved secure store.

Status:

```text
ACCEPTED STRATEGY
```

---

# 244. Vault

A dedicated Vault deployment is:

```text
NOT INITIAL
```

unless deployment/security requirements later justify it.

---

# 245. Development Secrets

Development uses ignored local environment configuration.

Committed files should contain:

```text
examples;

safe defaults;

schema documentation
```

only.

---

# 246. Configuration Foundation Technology

Runtime Configuration should use:

```text
typed TypeScript interfaces

+
Zod validation

+
environment/application sources.
```

---

# 247. Nest Configuration Integration

NestJS configuration integration may load validated Configuration into the API runtime.

The canonical schema/semantics should remain owned by Configuration Foundation rather than scattered throughout Nest Modules.

---

# 248. Environment Variable Rule

Direct:

```text
process.env
```

reads should be confined to Configuration/bootstrap code.

Business code consumes typed Configuration.

---

# 249. Feature Flag Technology

No external Feature Flag service will be introduced initially.

Status:

```text
DEFERRED
```

---

# 250. Initial Feature Variation

Simple deployment-time feature availability may use typed Configuration.

This must not become permanent business configuration.

---

# 251. Runtime Feature Flags

If runtime flags become necessary, first evaluate a minimal AI World-controlled implementation before adopting an external SaaS.

---

# 252. Internationalization Technology

Frontend/localization libraries are:

```text
DEFERRED UNTIL LOCALIZATION IMPLEMENTATION
```

The Localization Kernel semantics should be designed before framework-specific localization libraries define the model.

---

# 253. Rich Text Editing

A CMS rich text/editor framework is:

```text
DEFERRED
```

until Composition / CMS requirements are concrete.

---

# 254. CMS Editor Selection Criteria

Future editor selection should consider:

```text
structured content;

schema control;

extensions;

collaboration;

serialization;

accessibility;

React integration.
```

---

# 255. Documentation Format

Canonical architecture/engineering documentation remains:

```text
Markdown.
```

Status:

```text
ACCEPTED
```

---

# 256. Architecture Diagrams

Prefer:

```text
Mermaid
```

for diagrams that can be expressed clearly as source-controlled text.

Status:

```text
ACCEPTED DIRECTION
```

---

# 257. Diagram Assets

Complex visual assets may still be stored under:

```text
docs/15-reference/diagrams/
```

where Mermaid is insufficient.

---

# 258. Documentation Site

A dedicated docs website is:

```text
NOT INITIAL
```

Markdown in the repository is canonical.

---

# 259. API Documentation

OpenAPI-generated API documentation may be exposed in non-production or appropriately protected environments.

Production exposure depends on security requirements.

---

# 260. Backend Build Strategy

Backend builds should use:

```text
NestJS/TypeScript-compatible standard build tooling.
```

No separate universal bundler is required for every internal package initially.

---

# 261. Frontend Build Strategy

Next.js owns Web production bundling.

Do not add another frontend bundler around Next.js unless a real requirement exists.

---

# 262. Internal Package Builds

Internal packages should remain private workspace packages.

They may be compiled:

```text
through application build pipelines;

or

through package-level TypeScript builds
```

depending on actual monorepo constraints.

---

# 263. Package Bundler

A package bundler such as:

```text
tsup
```

is:

```text
DEFERRED
```

until independently built packages need one.

---

# 264. Module Format

AI World source should use modern TypeScript module syntax.

The exact emitted module format should follow framework/runtime compatibility rather than becoming a Domain concern.

---

# 265. Browser Compatibility

Next.js-supported modern browsers define the initial browser baseline.

Specific browser support policy belongs to Product/Engineering standards.

---

# 266. Database Search Before Search Infrastructure

This is a major technology strategy decision:

> **AI World will exhaust reasonable PostgreSQL Search capability before adding a dedicated Search service.**

This reduces:

```text
infrastructure;

index synchronization;

operational burden;

development setup.
```

---

# 267. PostgreSQL Before Redis

Similarly:

> **AI World will not add Redis until an actual distributed cache/queue/coordination requirement exists.**

---

# 268. PostgreSQL Before Extra Databases

New persistent stores must justify:

```text
why PostgreSQL is insufficient.
```

---

# 269. Managed Provider Before Self-Hosting Complex Infrastructure

Where commodity services are required, prefer managed offerings unless:

```text
cost;

privacy;

control;

performance;

availability
```

provides a strong reason to self-host.

---

# 270. Technology Boundary Principle

Provider-specific technology may be replaced.

Canonical AI World concepts should survive.

Examples:

```text
Prisma may change;
Entity should remain.

Storage provider may change;
Asset should remain.

AI provider may change;
Generation should remain.

Search engine may change;
Discovery Contract should remain.
```

---

# 271. Framework Leakage Rule

Framework-specific types may exist at:

```text
Application;

infrastructure;

Adapter
```

boundaries.

They should not define canonical Domain Contracts.

---

# 272. NestJS Leakage Rule

Avoid exposing:

```text
Nest decorators;

ExecutionContext;

Request objects;

HTTP Exceptions
```

inside framework-neutral Domain models.

---

# 273. Prisma Leakage Rule

Avoid exposing:

```text
Prisma records;

Prisma errors;

Prisma input types
```

as public Platform Contracts.

---

# 274. Next.js Leakage Rule

Universe semantic definitions must not require:

```text
React components;

Next.js route objects.
```

---

# 275. Provider Leakage Rule

Avoid exposing:

```text
storage SDK objects;

AI SDK response objects;

Search engine hits;

SMTP/provider message types
```

outside the owned integration boundary.

---

# 276. Technology Replacement Review

Replacing a major accepted technology should evaluate:

```text
architecture impact;

data migration;

developer migration;

test impact;

deployment impact;

operational risk;

benefit.
```

---

# 277. ADR Triggers

An ADR should normally be created before replacing foundational accepted choices such as:

```text
TypeScript;

Node.js;

NestJS;

Next.js;

PostgreSQL;

Prisma;

REST/OpenAPI;

monorepo architecture.
```

---

# 278. Provider Changes

Changing one implementation behind an existing stable Adapter may not require a global architecture ADR unless it materially changes:

```text
cost;

security;

data residency;

operational model;

Platform Contracts.
```

---

# 279. Version Upgrade Policy

Architecture documents should not list every framework patch version.

Repository configuration is the canonical source for exact installed versions.

---

# 280. Framework Major Upgrades

Major framework upgrades require:

```text
migration review;

test execution;

security review where relevant;

dependency compatibility review.
```

---

# 281. No Automatic Major Upgrade

Automated dependency tooling may propose major upgrades.

They must not merge automatically without review.

---

# 282. Unsupported Technology

AI World should not continue indefinitely on:

```text
unsupported Node versions;

unsupported database versions;

unsupported framework releases.
```

Upgrade planning is part of operational maintenance.

---

# 283. Dependency Minimization

Do not add a third-party dependency for trivial behavior that can be safely implemented with standard platform functionality.

---

# 284. Dependency Justification

Before adding a dependency ask:

```text
What problem does it solve?

Is it actively maintained?

What is the security surface?

How large is its transitive dependency tree?

Does it leak into public Contracts?

Could the platform/library already provide this behavior?
```

---

# 285. Framework Within Framework Warning

Avoid layering large frameworks on top of:

```text
NestJS;

Next.js;

Prisma
```

without demonstrated benefit.

---

# 286. Technology Duplication Rule

Avoid multiple technologies solving the same responsibility without reason.

Examples:

```text
Jest + Vitest

Prisma + another ORM

Redis + separate cache store

several logging libraries.
```

---

# 287. One Default Technology Per Capability

Prefer one canonical default.

Alternatives may exist behind Adapters only where actual requirements justify them.

---

# 288. Initial Technology Exclusions

The following are explicitly **not part of the initial baseline**:

```text
Microservices

Kubernetes

Kafka

Service Mesh

Event Sourcing

dedicated CQRS framework

GraphQL

tRPC

MongoDB

Neo4j

Redis

Elasticsearch/OpenSearch

dedicated Vector Database

Temporal

public Plugin Runtime

AI Agent framework

multiple AI Providers

multiple cloud providers.
```

---

# 289. Exclusion Does Not Mean Permanent Ban

These technologies are not declared bad.

They are simply not justified by current AI World requirements.

---

# 290. Infrastructure Complexity Ladder

AI World should approximately evolve through:

```text
LEVEL 1

Node
PostgreSQL
Web
API


LEVEL 2

Object Storage
Email


LEVEL 3

Worker / durable Queue
when asynchronous workload exists


LEVEL 4

specialized Search / Cache
when measured requirements exist


LEVEL 5

selective service extraction
when independent runtime requirements exist


LEVEL 6

advanced orchestration/distribution
only if Platform scale requires it.
```

---

# 291. Local Development Objective

A new developer should eventually be able to start core AI World development with a small number of commands.

Target direction:

```text
install dependencies

start required infrastructure

run development applications.
```

---

# 292. Initial Local Dependencies

Expected first local infrastructure dependency:

```text
PostgreSQL.
```

Later:

```text
Mailpit.
```

Other services should appear only as corresponding capabilities are implemented.

---

# 293. Local Development Reproducibility

Versions/configuration for local infrastructure should be source-controlled.

Developer machines should not require manually installed databases where Compose can provide reproducibility.

---

# 294. Development Database Persistence

Local PostgreSQL data may use a named Docker volume.

It should remain disposable enough that migrations/seeds can recreate expected development state.

---

# 295. Test Database Isolation

Tests should not depend on a developer's persistent local database state.

Integration tests should use dedicated databases/containers/schemas as appropriate.

---

# 296. Production Database

Production should use managed PostgreSQL where practical.

Backup, point-in-time recovery, monitoring, and scaling requirements will be defined in Operations documentation.

---

# 297. Production Object Storage

Production Media should use durable managed object storage.

Application container disk must not be canonical Media storage.

---

# 298. Production Email

Production transactional Email must use a provider capable of appropriate:

```text
deliverability;

security;

domain authentication;

operational visibility.
```

Exact provider remains deferred.

---

# 299. Production Search

PostgreSQL remains acceptable until real Discovery requirements prove otherwise.

Do not migrate to a dedicated Search provider because of hypothetical future scale.

---

# 300. Production Cache

Do not deploy distributed Cache without a measured purpose.

---

# 301. Production Queue

Durable Queue becomes mandatory only when Platform workloads require reliable background execution.

---

# 302. Production AI

The first AI Provider should be selected during AI phase using actual:

```text
text;

vision;

image;

embedding;

tool
```

requirements rather than selecting a vendor before capabilities are known.

---

# 303. Security Technology Principles

Technology choices must support:

```text
secure defaults;

least privilege;

strong credential storage;

Secret isolation;

input validation;

auditing;

dependency patching;

safe logging.
```

---

# 304. Dependency Vulnerability Management

Dependency vulnerability monitoring should be enabled through GitHub/repository tooling.

Security updates receive priority according to risk.

---

# 305. Supply Chain

CI must install dependencies from the committed lockfile.

Unexpected install-time mutation should be minimized.

---

# 306. Dependency Scripts

Third-party installation scripts should be treated as part of supply-chain risk.

Packages with unusual install behavior require review.

---

# 307. Container Security

Production containers should eventually:

```text
use minimal supported images;

avoid unnecessary tools;

run with reduced privilege;

contain no build Secrets.
```

Detailed requirements belong to Security/Operations docs.

---

# 308. Database Security

Production PostgreSQL credentials should be scoped to the Application's actual requirements.

Administrative credentials must not be used as ordinary runtime credentials.

---

# 309. Storage Security

Object Storage access must remain private by default unless an Asset is intentionally publicly deliverable.

---

# 310. AI Security

Provider requests must be treated as external data transfer.

Sensitive context must only be sent when authorized and required.

---

# 311. Email Security

Email templates and provider calls must avoid leaking sensitive authentication state.

Recovery links/tokens require expiration and one-time semantics.

---

# 312. Browser Security

Frontend technology must support:

```text
CSP;

secure cookies;

CSRF controls;

XSS prevention;

safe HTML rendering.
```

---

# 313. Rich HTML

Untrusted HTML must not be rendered without appropriate sanitization.

A sanitization technology will be selected when rich user-managed content is implemented.

---

# 314. File Upload Security

Media implementation must validate uploads using more than user-supplied filenames/extensions.

Detailed scanning/content validation technology is deferred to Media/Security implementation.

---

# 315. Architecture Automation

Technology Strategy supports eventual automated architecture enforcement.

Likely stack:

```text
pnpm workspace boundaries

package exports

ESLint restrictions

dependency-cruiser

CI architecture tests.
```

---

# 316. Architecture Graph

A dependency graph should eventually be generated from real source imports.

It should validate the accepted architecture rather than becoming the architecture itself.

---

# 317. Technology Choice — Applications

Initial Applications:

```text
apps/api
    NestJS

apps/web
    Next.js + React
```

---

# 318. Technology Choice — Worker

Future:

```text
apps/worker
    Node.js/Nest-compatible runtime
```

only once durable asynchronous workloads require it.

---

# 319. Technology Choice — Foundations

Initial Engineering Foundation likely uses:

```text
Configuration
    TypeScript + Zod

Database
    PostgreSQL + Prisma

Migration
    Prisma Migrate

Observability
    Pino + health baseline

Testing
    Vitest + PostgreSQL integration.
```

---

# 320. Technology Choice — Identity

Likely implementation stack:

```text
NestJS

PostgreSQL

Prisma

Argon2id

opaque server-side Sessions

Secure HttpOnly cookies

Email Foundation

Zod boundary validation.
```

---

# 321. Technology Choice — Knowledge

Likely implementation stack:

```text
NestJS Platform module

PostgreSQL

Prisma

typed Domain Models

Kernel Identifiers

Taxonomy

Relationships

Events.
```

---

# 322. Technology Choice — Media

Likely implementation stack:

```text
NestJS Platform module

PostgreSQL metadata

Storage Foundation

S3-compatible production storage

filesystem development storage

Sharp image processing

future Worker/Queue when processing requires it.
```

---

# 323. Technology Choice — Discovery

Initial:

```text
PostgreSQL full-text / trigram search
```

Later, if required:

```text
dedicated Search Adapter.
```

---

# 324. Technology Choice — AI

Initial AI phase:

```text
AI / Creator Platform

first-party typed Provider Port

one Provider Adapter

Provider official SDK

PostgreSQL Generation state

Queue only if Generation requires durable async work.
```

Provider itself remains deferred.

---

# 325. Technology Choice — Composition

Likely:

```text
NestJS backend Platform

Next.js presentation

PostgreSQL canonical Page/Block state

structured JSON only where schema-governed

rich editor selected later.
```

---

# 326. Technology Choice — Engagement

Likely:

```text
PostgreSQL

Prisma

Platform Events

no Redis requirement initially.
```

---

# 327. Technology Choice — Operations

Likely:

```text
Pino

OpenTelemetry

PostgreSQL operational projections where necessary

provider health interfaces.
```

Hosted monitoring backend deferred.

---

# 328. Technology Choice — Universe Definitions

Universe Definitions should be implemented initially as:

```text
typed TypeScript first-party definitions
```

validated at runtime where necessary.

---

# 329. Universe Storage

Universe definitions may initially live in source control.

Dynamic database-managed Universe Definition editing is:

```text
DEFERRED
```

until product requirements justify it.

---

# 330. Why Code-Defined Universes First

First-party typed source definitions provide:

```text
version control;

type checking;

review;

tests;

simple registration;

no dynamic schema management system.
```

---

# 331. Future Data-Driven Universes

As AI World matures, more Universe configuration may move to:

```text
CMS/admin-managed persistent definitions.
```

This evolution should preserve the same conceptual Contracts.

---

# 332. Extension Implementation

Initial Extensions are:

```text
TypeScript;

first-party;

compiled with the monorepo;

explicitly registered.
```

---

# 333. Dynamic Module Loading

Arbitrary dynamic runtime module loading is:

```text
NOT INITIAL
```

---

# 334. Sandboxed Plugins

No sandbox/plugin runtime technology is selected.

Status:

```text
NOT INITIAL
```

---

# 335. Technology Replacement Principle

The following should remain comparatively easy to replace:

```text
Email provider;

Storage provider;

AI provider;

Search engine;

Observability backend;

Queue implementation.
```

---

# 336. More Expensive Technology Changes

Changes to:

```text
Primary language;

Runtime;

Backend framework;

Frontend framework;

Primary database;

ORM
```

have larger migration costs.

They require stronger evidence.

---

# 337. PostgreSQL Lock-In Perspective

AI World accepts reasonable use of PostgreSQL strengths.

We will not avoid useful PostgreSQL functionality merely to maintain theoretical database portability.

---

# 338. ORM Lock-In Perspective

Prisma is an implementation choice.

Business logic should not expose Prisma types, allowing future persistence changes without rewriting consumer Contracts.

---

# 339. NestJS Lock-In Perspective

NestJS is accepted as backend Application/integration framework.

Core terminology and Domain Models should remain AI World-owned.

---

# 340. Next.js Lock-In Perspective

Next.js owns first-party Web implementation.

The backend remains independent enough that a future frontend framework change does not rewrite canonical Platform logic.

---

# 341. TypeScript Long-Term Role

TypeScript may remain a durable Platform language.

Future specialized components may use other languages only if requirements such as:

```text
specialized Media processing;

ML workloads;

high-performance computation
```

justify them.

---

# 342. Polyglot Technology

AI World is:

```text
TypeScript-first
```

not:

```text
TypeScript-only forever.
```

New languages require a clear Capability/runtime reason.

---

# 343. Python

Python is:

```text
NOT INITIAL FOR CORE PLATFORM
```

It may later support specialized:

```text
ML;

data;

media;

AI evaluation
```

workloads if needed.

---

# 344. Rust / Go

Rust or Go are:

```text
NOT INITIAL
```

They may later support specialized high-performance services if measurements justify them.

---

# 345. No Premature Polyglot Services

Do not introduce another language solely because a library exists in that ecosystem.

---

# 346. Technology Decision Filter

Before adding technology ask:

```text
1. Which AI World capability requires it?

2. Why can the accepted stack not satisfy the requirement?

3. Does the technology introduce new infrastructure?

4. Does it create a new persistence system?

5. Does it create a new Provider dependency?

6. Who owns the integration?

7. Can it remain behind an Adapter?

8. Does it complicate local development?

9. Does it complicate operations?

10. Does it complicate testing?

11. Does it leak into public Contracts?

12. Is it mature and maintained?

13. What happens if it disappears?

14. Is the benefit measurable?

15. Is it required now?
```

---

# 347. New Database Checklist

Before adding another database:

```text
Why is PostgreSQL insufficient?

Is the data canonical or derived?

Who owns it?

Can it be rebuilt?

What consistency is required?

How is it backed up?

How is it observed?

How is local development affected?
```

---

# 348. New Infrastructure Checklist

Before adding:

```text
Redis

Kafka

Search engine

Vector DB

Workflow engine
```

answer:

```text
What concrete workload requires it?

What measurable problem does it solve?

What new failure modes appear?

Who operates it?

How is it developed locally?

Can it be deferred?
```

---

# 349. New Framework Checklist

Before introducing a major framework:

```text
What capability does it own?

Could a library solve the requirement?

Will it define unwanted architecture?

Does it overlap NestJS/Next.js/Prisma?

Can it be isolated?

What long-term maintenance burden appears?
```

---

# 350. AI Framework Checklist

Before adopting AI orchestration framework:

```text
Which AI capability does it simplify?

Does it preserve Provider abstraction?

Does it preserve AI World Tool Contracts?

Does it expose Provider-specific types?

Can we test the behavior?

Can we remove it later?
```

---

# 351. Technology ADR Checklist

Create an ADR when technology:

```text
changes a foundational accepted choice;

introduces a new database;

introduces major distributed infrastructure;

changes deployment model;

creates a new external public Contract style;

introduces public Plugin runtime;

creates a new long-term Provider lock-in.
```

---

# 352. Initial Developer Experience Target

The baseline development experience should trend toward:

```text
pnpm install

docker compose up required infrastructure

pnpm dev
```

Exact commands will be established during Engineering Foundation.

---

# 353. Repository Command Strategy

Root package scripts should expose canonical tasks such as:

```text
dev

build

lint

format

typecheck

test

test:e2e

db:migrate

db:seed
```

when those capabilities exist.

---

# 354. Script Ownership

Root scripts orchestrate repository tasks.

Capability-specific behavior should live with the owning package/tool.

---

# 355. CI Command Consistency

CI should run the same canonical repository commands developers can run locally wherever practical.

---

# 356. Technology Environment Strategy

Expected environments:

```text
local

test

staging

production.
```

Not every environment needs identical infrastructure size.

They should preserve compatible behavior.

---

# 357. Test Provider Strategy

Tests should prefer:

```text
fakes for pure capability tests;

real PostgreSQL for persistence integration;

local provider emulation when valuable;

live external Provider tests only in controlled suites.
```

---

# 358. Production Provider Strategy

Use Provider Adapters to allow production implementations to differ from local ones.

Example:

```text
Storage

local:
    filesystem

production:
    S3-compatible object storage.
```

---

# 359. Development Email Strategy

```text
Email

local:
    Mailpit

production:
    managed provider through SMTP/provider Adapter.
```

---

# 360. Search Evolution Strategy

```text
Stage 1
    PostgreSQL

Stage 2
    PostgreSQL optimized indexes/search

Stage 3
    dedicated Search provider
    only if required.
```

---

# 361. Cache Evolution Strategy

```text
Stage 1
    no Cache

Stage 2
    local memoization where safe

Stage 3
    distributed Cache
    only if measured.
```

---

# 362. Queue Evolution Strategy

```text
Stage 1
    synchronous/in-process operations

Stage 2
    durable PostgreSQL-backed or similarly simple Queue

Stage 3
    dedicated Queue infrastructure
    if workload requires it.
```

---

# 363. AI Evolution Strategy

```text
Stage 1
    one Provider

Stage 2
    multiple model capabilities

Stage 3
    routing/fallback if required

Stage 4
    multiple Providers only when justified.
```

---

# 364. Deployment Evolution Strategy

```text
Stage 1

Web
API
PostgreSQL


Stage 2

Object Storage
Email


Stage 3

Worker/Queue


Stage 4

specialized Search/cache


Stage 5

selective service extraction.
```

---

# 365. Technology Simplicity Rule

If two technologies solve the requirement adequately, prefer the option with:

```text
fewer infrastructure components;

smaller operational burden;

clearer debugging;

stronger architecture compatibility.
```

---

# 366. Technology Maturity Rule

Prefer mature commodity infrastructure for:

```text
database;

HTTP;

storage;

email;

logging.
```

Innovation should focus on AI World's differentiating capabilities.

---

# 367. Technology Cost Rule

Infrastructure cost must be considered during architecture decisions.

AI and Media capabilities especially require visibility into:

```text
compute;

storage;

bandwidth;

provider usage.
```

---

# 368. Technology Portability Rule

Portability matters most around external Providers.

It matters less than correctness for internal framework implementation.

Do not create excessive abstraction purely for theoretical portability.

---

# 369. Technology Security Rule

Technology that materially expands the attack surface requires explicit justification.

Examples:

```text
dynamic Plugin loaders;

script execution;

public Webhooks;

new external Providers;

new databases.
```

---

# 370. Technology Operations Rule

A technology is not production-ready merely because developers can run it locally.

Operational requirements may include:

```text
backup;

monitoring;

upgrade;

alerting;

capacity;

security;

recovery.
```

---

# 371. Technology Documentation Rule

Every major new technology should document:

```text
owner;

purpose;

configuration;

local development;

production operation;

failure behavior;

upgrade strategy.
```

---

# 372. Technology Anti-Pattern — Framework Identity

Bad:

```text
AI World is a NestJS app.
```

Correct:

```text
AI World is a Platform currently implemented with NestJS.
```

---

# 373. Technology Anti-Pattern — ORM Identity

Bad:

```text
Prisma models are the Domain.
```

---

# 374. Technology Anti-Pattern — Database-First Architecture

Bad:

```text
design tables first,
then infer ownership.
```

---

# 375. Technology Anti-Pattern — Redis by Default

Bad:

```text
add Redis because every production app needs Redis.
```

---

# 376. Technology Anti-Pattern — Elasticsearch by Default

Bad:

```text
add Search cluster before PostgreSQL Search is tested.
```

---

# 377. Technology Anti-Pattern — Kafka for Events

Bad:

```text
we have Domain Events,
therefore we need Kafka.
```

---

# 378. Technology Anti-Pattern — Kubernetes for Containers

Bad:

```text
we use Docker,
therefore we need Kubernetes.
```

---

# 379. Technology Anti-Pattern — Microservice per Platform

Bad:

```text
Identity Platform
    = Identity microservice

Knowledge Platform
    = Knowledge microservice.
```

Logical capability does not equal deployment unit.

---

# 380. Technology Anti-Pattern — Separate Database per Platform

Not initially required.

---

# 381. Technology Anti-Pattern — Separate Database per Universe

Forbidden as default Universe architecture.

---

# 382. Technology Anti-Pattern — Graph DB Because Relationships Exist

Typed Relationships do not automatically require graph database infrastructure.

---

# 383. Technology Anti-Pattern — Vector DB Because AI Exists

AI does not automatically require embeddings or vector storage.

---

# 384. Technology Anti-Pattern — AI Framework Before AI Capability

Do not adopt agent/RAG frameworks before AI Platform requirements are defined.

---

# 385. Technology Anti-Pattern — Auth SaaS Owns Authorization

External authentication may verify identity.

AI World Authorization remains Platform-owned.

---

# 386. Technology Anti-Pattern — JWT Everywhere

Do not use long-lived self-contained JWTs for every user/browser operation simply because they avoid server-side Session storage.

---

# 387. Technology Anti-Pattern — Tokens in Local Storage

Not accepted as default browser authentication architecture.

---

# 388. Technology Anti-Pattern — Prisma Everywhere

Only persistence implementations should understand Prisma.

---

# 389. Technology Anti-Pattern — Next.js Full Backend

Next.js must not become a second unrestricted persistence/business backend.

---

# 390. Technology Anti-Pattern — Shared UI Owns Domain

UI libraries/components do not own business state.

---

# 391. Technology Anti-Pattern — Multiple Testing Frameworks

Prefer one canonical tool per testing category.

---

# 392. Technology Anti-Pattern — Build Tool Explosion

Avoid combining several monorepo/build systems without clear responsibility.

Canonical orchestration:

```text
pnpm
+
Turborepo.
```

---

# 393. Technology Anti-Pattern — Tooling Before Source

Do not spend Phase 1 constructing elaborate generators or architecture automation before real modules exist.

---

# 394. Technology Anti-Pattern — Provider Abstraction for Every Library

Not every library needs an interface.

Provider abstraction is justified at meaningful external/replacement boundaries.

---

# 395. Technology Anti-Pattern — Lowest Common Denominator

Adapters should protect AI World semantics.

They should not eliminate useful capabilities merely to make all Providers look identical.

---

# 396. Technology Anti-Pattern — Provider SDK as Contract

Forbidden.

---

# 397. Technology Anti-Pattern — Cloud Resource Names in Domain

Domain code must not depend on:

```text
bucket ARN;

cloud region object;

queue URL;

cloud account identifier
```

unless it is specifically infrastructure integration code.

---

# 398. Technology Anti-Pattern — Manual Environment Drift

Development and CI infrastructure versions should be defined in repository configuration.

---

# 399. Technology Anti-Pattern — Production-Only Architecture

Core development architecture should remain reasonably reproducible locally.

---

# 400. Technology Anti-Pattern — Local Infrastructure Explosion

A developer should not need to run:

```text
Postgres

Redis

Kafka

Elasticsearch

Vector DB

Temporal

multiple AI emulators
```

just to work on Authentication.

---

# 401. Phase 1 Technology Baseline

Engineering Foundation should initially establish only:

```text
TypeScript

Node.js LTS

pnpm

Turborepo

NestJS

Next.js

PostgreSQL

Prisma

Zod

Pino

Vitest

Supertest

Playwright baseline

Docker Compose

GitHub Actions

ESLint

Prettier.
```

---

# 402. Phase 1 Explicitly Does Not Need

Engineering Foundation should not initially add:

```text
Redis

Queue broker

Search cluster

Vector database

AI Provider

Object storage cloud provider

Kubernetes

Workflow engine

Feature flag SaaS.
```

---

# 403. Identity Phase Technology Additions

Identity implementation may add:

```text
Argon2id library

Session cookie handling

Email Foundation

Mailpit local Email

SMTP transport

security-focused integration tests.
```

---

# 404. Kernel Phase Technology Additions

Kernel implementation should primarily use:

```text
TypeScript

PostgreSQL/Prisma where persistence exists

Zod where Definition validation is needed.
```

No dedicated infrastructure is implied.

---

# 405. Knowledge Phase Technology Additions

Knowledge may require:

```text
PostgreSQL relational structures

Taxonomy tables

Relationship tables

search-supporting indexes.
```

No graph database is required.

---

# 406. Media Phase Technology Additions

Media may add:

```text
Storage Foundation

filesystem development Adapter

S3-compatible production Adapter

Sharp

future Queue only when processing requires durability.
```

---

# 407. Discovery Phase Technology Additions

Discovery begins with:

```text
PostgreSQL Search.
```

Dedicated Search is a later evidence-based decision.

---

# 408. AI Phase Technology Additions

AI phase selects:

```text
one initial Provider

official/provider SDK

AI Provider Adapter

Generation persistence

optional Queue if Generation needs durable background work.
```

---

# 409. Composition Phase Technology Additions

Composition may later select:

```text
rich content editor;

preview architecture;

structured block rendering libraries
```

based on actual creator requirements.

---

# 410. Engagement Phase Technology Additions

Engagement should primarily reuse PostgreSQL first.

No new datastore is assumed.

---

# 411. Production Operations Technology Additions

Production maturity may add:

```text
managed monitoring;

metrics backend;

distributed tracing;

alerting;

managed backup;

container registry;

IaC;

CD automation;

scaling infrastructure.
```

---

# 412. Technology Baseline Summary

```text
LANGUAGE
    TypeScript

RUNTIME
    Node.js LTS

MONOREPO
    pnpm
    Turborepo

BACKEND
    NestJS
    Modular Monolith

FRONTEND
    Next.js
    React
    Tailwind CSS

API
    REST
    JSON
    OpenAPI

VALIDATION
    Zod

DATABASE
    PostgreSQL

DATA ACCESS
    Prisma ORM

MIGRATIONS
    Prisma Migrate

AUTHENTICATION
    first-party Identity & Access
    Argon2id
    opaque server Sessions
    HttpOnly secure cookies

SEARCH
    PostgreSQL first

MEDIA
    S3-compatible Storage architecture
    local filesystem development Adapter
    Sharp

EMAIL
    SMTP abstraction
    Mailpit locally

OBSERVABILITY
    Pino
    OpenTelemetry direction

TESTING
    Vitest
    Supertest
    Playwright
    Testcontainers where valuable

QUALITY
    ESLint
    Prettier
    architecture import checks

CONTAINERS
    Docker
    Docker Compose local infrastructure

CI/CD
    GitHub Actions
```

---

# 413. Deferred Technology Summary

```text
AI Provider

Cloud Provider

Infrastructure-as-Code technology

Redis

dedicated Queue/broker

dedicated Search engine

Vector Database

advanced Scheduler

external Feature Flag provider

hosted Observability provider

GraphQL

gRPC

WebSockets

rich CMS editor

advanced Workflow engine

runtime Plugin system.
```

---

# 414. Not-Initial Technology Summary

```text
Microservices-first architecture

Kubernetes

Service Mesh

Kafka

Event Sourcing

full CQRS framework

MongoDB

Neo4j

separate DB per Universe

separate DB per Platform

public Plugin Marketplace

arbitrary script execution

AI Agent platform

multi-provider AI routing

Redis-by-default architecture

Elasticsearch-by-default architecture.
```

---

# 415. Technology Success Criteria

The strategy succeeds when:

```text
developers can run AI World locally without excessive infrastructure;

Domain code remains independent from Provider SDKs;

new Universes do not require new infrastructure stacks;

PostgreSQL handles canonical state coherently;

NestJS modules preserve Platform boundaries;

Next.js remains a delivery Application rather than Domain owner;

Prisma remains confined to persistence;

Search can evolve without moving Knowledge ownership;

AI provider can change without changing canonical models;

production can scale incrementally rather than through rewrite.
```

---

# 416. Technology Health Questions

Periodically ask:

```text
Are we running infrastructure nobody needs?

Are Provider SDKs leaking upward?

Is Prisma leaking into public Contracts?

Is Next.js bypassing the API?

Are Nest modules becoming circular?

Has Redis become canonical state accidentally?

Has Search become canonical Knowledge?

Are we maintaining two libraries for the same concern?

Could PostgreSQL still solve this requirement?

Is a new service actually necessary?

Can a new developer understand the stack?
```

---

# 417. Technology Change Principle

Technology changes are expected over AI World's lifetime.

The architecture should make such changes bounded.

The correct question is not:

```text
Will this technology last forever?
```

The better question is:

```text
If it must change,
how much unrelated AI World code must change with it?
```

---

# 418. Accepted Stack Authority

The technologies marked:

```text
ACCEPTED
```

in this document form the default implementation baseline.

They should not be substituted casually during implementation.

Significant substitutions require:

```text
architectural justification;

documentation update;

ADR where appropriate.
```

---

# 419. Deferred Decisions Are Intentional

A deferred technology is not missing architecture.

Deferral means:

```text
we know the capability boundary;

we know the decision criteria;

the implementation technology is intentionally not selected yet.
```

---

# 420. Technology Strategy and Architecture

The selected stack maps to the architecture as follows:

```text
APPLICATIONS

    Web
        Next.js + React

    API
        NestJS

    Worker
        Node.js / Nest-compatible runtime when needed


PLATFORMS / KERNEL

    TypeScript
    framework-neutral Domain concepts where practical


FOUNDATIONS

    PostgreSQL
    Prisma
    Pino
    SMTP
    S3-compatible Storage
    future Queue/Cache implementations


PROVIDER EDGE

    Provider SDKs
    localized inside Adapters


OPERATIONS

    Docker
    GitHub Actions
    OpenTelemetry
    managed infrastructure later.
```

---

# 421. What This Document Decides

This document decides:

```text
TypeScript as primary language;

Node.js LTS as runtime;

pnpm as package manager;

Turborepo as monorepo orchestrator;

NestJS as backend framework;

modular monolith as initial backend deployment model;

Next.js + React as Web stack;

Tailwind CSS as initial styling technology;

REST/JSON + OpenAPI as API baseline;

Zod as runtime validation baseline;

PostgreSQL as canonical operational database;

Prisma as initial ORM/data-access technology;

Prisma Migrate as schema migration technology;

opaque server-side browser Sessions;

Argon2id password hashing;

Pino structured logging;

OpenTelemetry direction;

Vitest, Supertest, Playwright and real PostgreSQL integration testing;

Docker as container format;

Docker Compose for local infrastructure;

GitHub Actions as CI/CD;

S3-compatible Storage architecture;

filesystem Storage for development;

Sharp for image processing;

SMTP-based Email baseline with local Mailpit;

PostgreSQL-first Search;

no distributed Cache initially;

no durable Queue initially;

no dedicated Search engine initially;

AI Provider selection deferred;

Cloud/IaC provider selection deferred;

no Kubernetes or microservices-first architecture.
```

---

# 422. What This Document Does Not Decide

This document intentionally does not finalize:

```text
exact dependency versions;

canonical Resource ID format;

production cloud provider;

production object-storage vendor;

production Email vendor;

AI Provider;

durable Queue implementation;

distributed Cache implementation;

dedicated Search engine;

vector Search implementation;

Infrastructure-as-Code tool;

observability backend;

rich text editor;

runtime Feature Flag provider;

future service boundaries.
```

---

# 423. Relationship to Repository Architecture

Repository Architecture defines:

```text
where technologies may live.
```

Technology Strategy provides the concrete implementations.

Examples:

```text
apps/api
    NestJS

apps/web
    Next.js

packages/foundations/database
    PostgreSQL + Prisma integration

packages/platforms/ai-creator
    future AI Provider Adapter

packages/platforms/discovery
    PostgreSQL Search implementation first.
```

---

# 424. Relationship to Dependency Rules

Technology must obey established dependency direction.

Examples:

```text
Prisma
    may exist inside persistence implementation
    but not public Domain Contracts.

Provider SDK
    may exist inside Adapter
    but not Universe code.

Next.js
    may consume API
    but not mutate database directly.
```

---

# 425. Relationship to Extension Model

Provider Adapters implement technology variability.

Universe Extensions implement Domain variability.

The Technology Strategy preserves the distinction.

---

# 426. Relationship to Ownership Model

Technology does not transfer canonical ownership.

Examples:

```text
PostgreSQL
    stores Entity
    but Knowledge owns Entity.

S3-compatible Storage
    stores bytes
    but Media owns Asset.

AI Provider
    generates output
    but AI / Creator owns Generation.

Search implementation
    indexes Entity
    but Knowledge owns Entity.
```

---

# 427. Relationship to Master Roadmap

The next document:

```text
P0-D18 — Master Roadmap
```

will convert the accepted architecture and technology decisions into implementation sequence.

It will determine:

```text
what is built first;

which repository structure is created first;

when Engineering Foundation begins;

when Identity & Access begins;

when Knowledge begins;

when Anime and History appear;

when Media, Discovery, AI, CMS, Engagement, and Operations follow;

what completion gates close each phase.
```

---

# 428. Phase 0 Technology Outcome

At acceptance of this document:

```text
Architecture:
DEFINED

Repository Architecture:
DEFINED

Dependency Model:
DEFINED

Extension Model:
DEFINED

Core Technology Stack:
SELECTED

Provider Technologies:
INTENTIONALLY DEFERRED WHERE APPROPRIATE

Source Implementation:
NOT STARTED BY DESIGN
```

---

# 429. Final Technology Strategy Statement

> **AI World will begin as a TypeScript and Node.js capability-oriented monorepo using pnpm and Turborepo, with NestJS providing the modular backend runtime, Next.js and React providing the Web experience, PostgreSQL providing canonical relational persistence, Prisma providing typed persistence access, REST/OpenAPI defining the initial external API boundary, and Docker/GitHub Actions providing portable build and delivery foundations.**

> **Additional infrastructure—including Redis, durable messaging, dedicated Search, vector databases, multiple AI Providers, microservices, Kubernetes, and specialized cloud services—will be introduced only when a real AI World capability demonstrates that the simpler accepted stack is insufficient.**

The strategy is therefore:

```text
MATURE TECHNOLOGY
+
CLEAR BOUNDARIES
+
MINIMAL INFRASTRUCTURE
+
MEASURED EVOLUTION
```

rather than:

```text
MAXIMUM TECHNOLOGY
BEFORE PRODUCT REQUIREMENTS.
```

---

# 430. Acceptance

```text
DOCUMENT
P0-D17 — AI World Technology Strategy

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
P0-D14 — Dependency Rules
P0-D15 — Extension Model
P0-D16 — Repository Architecture

NEXT DOCUMENT
P0-D18 — Master Roadmap

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```