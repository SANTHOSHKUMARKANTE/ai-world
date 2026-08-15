# AI World Master Roadmap

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Master Roadmap |
| Document ID | P0-D18 |
| Area | Roadmaps |
| Status | ACCEPTED |
| Version | 1.2.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-15 |
| Current Delivery | Phase 3 COMPLETE — tagged `phase-3-complete`; Phase 4 Knowledge Platform ACTIVE — P4-M01 Knowledge Resource Model CLOSED; P4-M02 Typed Domain Resource Support CLOSED; P4-M03 Knowledge CRUD Baseline CLOSED; P4-M04 Knowledge Authorization CLOSED; P4-M05 Taxonomy Integration DEFERRED — no implemented Devotional classification consumer; P4-M06 Relationship Integration DEFERRED — no implemented Devotional Resource-to-Resource relationship consumer; P4-M07 Knowledge Lifecycle CLOSED; P4-M08 Knowledge Events NEXT |
| Authority | Canonical Delivery Sequence and Phase Governance |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md`, `docs/01-vision/terminology.md`, `docs/02-architecture/system-context.md`, `docs/02-architecture/platform-architecture.md`, `docs/02-architecture/platform-layers.md`, `docs/02-architecture/capability-map.md`, `docs/02-architecture/ownership-model.md`, `docs/02-architecture/dependency-rules.md`, `docs/02-architecture/extension-model.md`, `docs/02-architecture/repository-architecture.md`, `docs/02-architecture/technology-strategy.md` |

---

# 1. Purpose

This document defines the canonical **Master Roadmap** for AI World.

It converts the accepted:

```text
Vision

Architecture

Capability Map

Ownership Model

Dependency Rules

Extension Model

Repository Architecture

Technology Strategy
```

into a controlled implementation sequence.

This document answers:

```text
What do we build first?

What do we deliberately defer?

When does coding begin?

Which capabilities unblock others?

When are Devotional, Anime, and later proof Universes introduced?

When do Media, Discovery, AI, CMS, and Engagement begin?

What validates each phase?

What must be true before a phase closes?

How do we prevent architecture planning from continuing forever?

How do we prevent implementation from outrunning architecture?
```

---

# 2. Roadmap Authority

This document is the authoritative delivery sequence for AI World.

Other roadmap documents may provide:

```text
Platform-specific detail;

Foundation-specific detail;

module-level planning;

Universe-specific planning;

release planning.
```

They must not independently redefine the high-level sequencing established here.

---

# 3. Roadmap Principle

> **Build the minimum architecture necessary to support the next real capability, then validate it through working vertical slices before expanding further.**

AI World will not:

```text
build every Foundation first;

build the entire Kernel first;

design every future Platform before coding;

build all infrastructure before product capability;

implement every future Universe before validating shared architecture.
```

---

# 4. Architecture Before Implementation

Phase 0 intentionally precedes production implementation.

The purpose is not permanent planning.

The purpose is to establish enough architectural stability that implementation can proceed without immediately recreating the architectural problems the greenfield project is intended to avoid.

---

# 5. Coding Gate

Production implementation is prohibited until:

```text
P0-D18 — Master Roadmap
```

is accepted.

Once this document is accepted:

```text
PHASE 0 IS CLOSED

CODING MAY BEGIN.
```

---

# 6. Roadmap Philosophy

The roadmap follows these principles:

```text
Architecture first, but not architecture forever.

Foundation before dependency, but not every Foundation upfront.

Capability before infrastructure.

Vertical slices before broad unfinished frameworks.

Real consumers before speculative abstractions.

One canonical owner before cross-module integration.

Simple implementation before distributed implementation.

Proof through structurally different Universes.

Production readiness grows incrementally.
```

---

# 7. Canonical Phase Sequence

AI World will proceed through the following major phases:

```text
PHASE 0
Architecture Foundation

PHASE 1
Engineering Foundation

PHASE 2
Identity Platform

PHASE 3
Platform Kernel Baseline

PHASE 4
Knowledge Platform

PHASE 5
Media Platform

PHASE 6
Discovery Platform

PHASE 7
AI / Creator Platform

PHASE 8
Composition / CMS Platform

PHASE 9
Engagement Platform

PHASE 10
Production Operations
```

---

# 8. Proof Universe Strategy

Devotional is the first and only Universe implemented initially.

The sequence is intentionally evidence-driven:

```text
Devotional
    first real Universe implementation

Anime
    later second-Universe reuse test

History
    later third structural reuse test
```

Devotional should be allowed to produce real requirements before AI World attempts to prove cross-Universe reuse.

Anime is introduced only after enough shared architecture exists for reuse to be measurable.

History follows after Anime as a stronger third structural reuse test.

---

# 9. Why Devotional First

Devotional is implemented first because one real domain should drive the next required capability instead of speculative multi-Universe design.

Devotional can provide pressure around:

```text
Deity and devotional-figure Resources;

Scripture and textual Resources;

Temples and sacred-place concepts;

traditions and festivals;

source and provenance sensitivity;

domain-specific relationships;

content requiring careful semantic ownership;

future multilingual and media-rich experiences.
```

The shared Platform must remain generic while solving those real needs.

Genericity is not proven at this point; it is only designed so that later reuse remains possible.

---

# 10. Reuse-Test Universe Strategy

Anime is the second-Universe reuse test.

It is introduced after Devotional has exercised enough shared architecture to test whether a substantially different domain can reuse the same capabilities without duplicate infrastructure or named-Universe core branches.

Anime can later add pressure around:

```text
media-rich Resources;

Characters;

Series;

Episodes;

relationships;

Genres;

presentation variation;

future creator experiences.
```

History is retained as the third structural reuse test after Anime.

History can later add pressure around:

```text
People;

Events;

Places;

Civilizations;

Sources;

Citations;

time;

uncertainty;

verification;

cross-domain relationships.
```

The objective of both later Universes is reuse, not rebuilding shared architecture.

---

# 11. Roadmap Levels

AI World planning is organized at four levels:

```text
PHASE

    major delivery stage

MILESTONE

    coherent outcome inside a Phase

TASK

    implementation/documentation unit

CLOSURE GATE

    evidence required before moving forward.
```

---

# 12. Phase Closure Rule

A Phase is not complete because:

```text
files exist;

code compiles;

one happy-path demo works.
```

Closure requires the Phase's accepted validation criteria.

---

# 13. Vertical Slice Rule

Each implementation phase should contain working end-to-end slices.

Conceptually:

```text
Data
    ↓
Domain
    ↓
Application
    ↓
API
    ↓
Web/Consumer
    ↓
Tests
```

where relevant.

---

# 14. Partial Capability Rule

A capability may begin with only the behavior needed for the current vertical slice.

Example:

```text
Taxonomy
```

does not need every future taxonomy feature before Knowledge can classify an Entity.

---

# 15. Infrastructure Rule

Infrastructure is introduced only when an implemented capability requires it.

Examples:

```text
No Redis
until Cache/Queue requirement exists.

No dedicated Search
until PostgreSQL Search proves insufficient.

No durable Queue
until durable background work exists.

No AI Provider
until AI Platform begins.
```

---

# 16. Production-Minded Rule

Although full Production Operations is Phase 10, earlier phases must still implement the minimum production-minded behavior required for their risks.

Examples:

```text
password security during Identity;

migration discipline during Database work;

structured logging from Phase 1;

authorization before protected Knowledge writes.
```

---

# 17. Documentation Rule

Implementation phases should create capability documentation as capabilities become real.

Do not wait until Phase 10 to document architecture that was already implemented.

---

# 18. ADR Rule

Use ADRs for decisions that materially alter or instantiate important architecture.

Do not create an ADR for every ordinary implementation choice.

---

# 19. Technology Freeze Rule

P0-D17 defines the default implementation stack.

Implementation should follow those accepted defaults unless:

```text
a documented requirement conflicts;

new evidence appears;

an ADR changes the decision.
```

---

# 20. Baseline Technology Stack

Implementation begins with:

```text
TypeScript

Node.js LTS

pnpm

Turborepo

NestJS

Next.js

React

Tailwind CSS

REST / JSON

OpenAPI

Zod

PostgreSQL

Prisma

Vitest

Supertest

Playwright

Pino

Docker

Docker Compose

GitHub Actions.
```

---

# 21. Deferred Technology Remains Deferred

Initial implementation must not automatically introduce:

```text
Redis

Kafka

Kubernetes

dedicated Search engine

Vector Database

Graph Database

Temporal

microservices

multiple AI Providers.
```

---

# 22. Phase Status Vocabulary

Roadmap phase statuses are:

```text
NOT STARTED

ACTIVE

BLOCKED

VALIDATING

COMPLETE

DEFERRED.
```

---

# 23. Initial Roadmap Status

At acceptance of this document:

```text
Phase 0
    COMPLETE

Phase 1
    NEXT

Phase 2–10
    NOT STARTED
```

---

# 23A. Current Delivery Status

The status in Section 23 records the roadmap state at original acceptance.

The current implementation position is:

```text
PROJECT
AI World

PHASE 0 — Architecture Foundation
COMPLETE

PHASE 1 — Engineering Foundation
COMPLETE
EXIT OUTCOME: ENGINEERING-READY

PHASE 2 — Identity Platform
COMPLETE
EXIT OUTCOME: ONE SHARED IDENTITY PLATFORM

P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
CLOSED

P2-M06 — Recovery
CLOSED

P2-M07 — User Profile
CLOSED

P2-M08 — Roles and Permissions
CLOSED

P2-M09 — Owner-Side Authorization
CLOSED

P2-M10 — Session Security UX
CLOSED

PHASE 3 — Platform Kernel Baseline
COMPLETE
EXIT OUTCOME: MINIMAL SHARED SEMANTIC KERNEL

P3-M01 — Identifiers
CLOSED

P3-M02 — Namespace
CLOSED

P3-M03 — Events
DEFERRED — no current production consumer

P3-M04 — Audit
CLOSED

P3-M05 — Taxonomy
DEFERRED — no current Resource-classification consumer

P3-M06 — Relationships
DEFERRED — no current Resource-relationship consumer

P3-M07 — Architecture Enforcement Expansion
CLOSED

PHASE 4 — Knowledge Platform
ACTIVE

P4-M01 — Knowledge Resource Model
CLOSED

P4-M02 — Typed Domain Resource Support
CLOSED

P4-M03 — Knowledge CRUD Baseline
CLOSED

P4-M04 — Knowledge Authorization
CLOSED

P4-M05 — Taxonomy Integration
DEFERRED — no implemented Devotional classification consumer

P4-M06 — Relationship Integration
DEFERRED — no implemented Devotional Resource-to-Resource relationship consumer

P4-M07 — Knowledge Lifecycle
CLOSED

P4-M08 — Knowledge Events
NEXT
```

Final Phase 3 milestone sequence:

```text
P3-M01 — Identifiers
CLOSED

P3-M02 — Namespace
CLOSED

P3-M03 — Events
DEFERRED — pending real consumer

P3-M04 — Audit
CLOSED

P3-M05 — Taxonomy
DEFERRED — pending real Knowledge classification consumer

P3-M06 — Relationships
DEFERRED — pending real Knowledge relationship consumer

P3-M07 — Architecture Enforcement Expansion
CLOSED
```

Phase 3 remained demand-driven through closure. A listed milestone could be narrowed, deferred, or satisfied by a smaller implementation when real consumers did not justify broader scope. The deferred Event, Taxonomy, and Relationships milestones therefore do not block closure because each was reviewed against the implemented repository and retains a concrete Phase 4 activation gate.

Current non-blocking documentation debt:

```text
docs/13-roadmaps/README.md
docs/00-governance/documentation-standard.md
docs/00-governance/definition-of-done.md
docs/templates/closure-review-template.md

remain empty placeholders and are deferred to a dedicated governance/documentation task.
```

They do not redefine the completed Phase 2 or Phase 3 closure criteria.

P3-M03 remains deferred because no production capability presently requires business Event publication/subscription mechanics. Its first strong activation point remains Phase 4 Knowledge lifecycle Events.

P3-M04 established the reusable durable Audit Record baseline through a real security-sensitive Identity consumer. Audit remains separate from business Events and operational logging.

P3-M05 remains deferred because no implemented Resource currently requires reusable shared classification semantics. P4-M05 performed the planned activation review against the implemented Devotional domain and still found no real reusable classification consumer. Taxonomy therefore remains unmaterialized until a future implemented Resource establishes that requirement.

P3-M06 remains deferred because no implemented production capability currently owns or consumes a reusable semantic Resource-to-Resource Relationship. P4-M06 performed the planned activation review against the implemented Devotional domain and still found no real reusable Resource-to-Resource relationship consumer. Relationships therefore remains unmaterialized until future implemented Resources establish that requirement.

P3-M07 closed the concrete architecture-enforcement gaps exposed by the package structure that now exists. It added automated protection against application deep imports into package source, package-to-package deep imports into foreign package source, and production package dependencies on another package's infrastructure implementation. Application composition roots and integration tests remain able to compose infrastructure where ownership requires it.

The Phase 3 implementation checkpoint for P3-M07 is:

```text
aaf6e80 feat(architecture): expand package boundary enforcement
```

That implementation checkpoint is pushed and its GitHub Actions CI / Validate run is green.

The current implementation phase is:

```text
Phase 4 — Knowledge Platform
```

The next implementation milestone is:

```text
P4-M08 — Knowledge Events
```

P4-M01 established the smallest canonical Knowledge Resource model required by the multi-Universe architecture and remains unchanged.

P4-M02 established the first Devotional-owned typed specialization through `@ai-world/universe-devotional`, with `DeityResource` specializing the existing canonical `KnowledgeResource`. Knowledge remains unaware of Devotional, and Anime and History remain unmaterialized.

P4-M03 is now CLOSED. It established canonical Knowledge-owned create/read/update operations, public reader/writer Contracts, and a Prisma-backed Knowledge repository while retaining the existing `knowledge_resources` schema and DRAFT-only lifecycle. The P4-M03 update operation deliberately changes only `resourceType`; Resource identity, Universe association, lifecycle, and creation time remain outside that mutation.

Implementation checkpoint:

```text
c82a325 feat(knowledge): establish crud baseline
```

The implementation checkpoint is pushed to `origin/main`. GitHub Actions CI run `31885021623` completed successfully for exact commit `c82a325e88cf3ba9567d94c89da55a5fcd609b52`.

P4-M04 is now CLOSED. It protects Knowledge create/update mutations through actor-facing Knowledge operations backed by the existing Identity & Access `EvaluatePermission` public Contract. Knowledge owns the semantic action keys `knowledge.resource.create` and `knowledge.resource.update`; Identity & Access owns the `knowledge-editor` Role vocabulary and Permission evaluation. Administrator and Knowledge Editor receive both mutation Permissions, while an ordinary persisted User with no Role assignment is denied by default. Authorization is evaluated before underlying validation, target lookup, or persistence mutation, so denied updates do not reveal target existence and authorized missing-target updates retain the canonical `knowledge.resource.not_found` result.

P4-M04 added the data-only migration `20260815130500_knowledge_authorization_baseline` without changing the Prisma schema. Canonical migration count is now 11. It introduced no Knowledge API or Web behavior, no lifecycle expansion, no Events, Taxonomy, Relationships, Sources, Citations, Media, Search, Anime, or History implementation.

Implementation checkpoint:

```text
e42b3b3 feat(knowledge): establish authorization baseline
```

The exact implementation commit is `e42b3b33a61f54ecffbd0086d6dfbd091a832989`. GitHub Actions CI run `31889564998` completed successfully for that commit.

P4-M05 is next. It must begin with a demand review and activate shared Taxonomy only if an implemented Devotional Resource establishes a real reusable classification requirement.

Roadmap amendment recorded on 2026-08-15:

```text
FIRST IMPLEMENTATION UNIVERSE
Devotional

SECOND-UNIVERSE REUSE TEST
Anime

THIRD STRUCTURAL REUSE TEST
History

P4-M02
Devotional only — no Anime implementation in this milestone

P4-M01
remains CLOSED and unchanged
```

This amendment changes forward delivery strategy only. Historical Phase 3 demand-review evidence remains historical evidence and is not retroactively rewritten.

P4-M07 is now CLOSED. It expanded the Knowledge-owned lifecycle from DRAFT-only to the smallest accepted monotonic lifecycle:

```text
DRAFT
    ↓
PUBLISHED
    ↓
ARCHIVED
```

Knowledge now exposes explicit publish and archive owner operations plus actor-facing protected wrappers. Publication is permitted only from DRAFT and archival only from PUBLISHED. Invalid source states fail with `knowledge.resource.lifecycle_conflict`; missing targets preserve `knowledge.resource.not_found`. Knowledge owns the `knowledge.resource.publish` and `knowledge.resource.archive` action semantics, while Identity & Access continues to own Permission representation and evaluation. Administrator and `knowledge-editor` receive both lifecycle Permissions; ordinary persisted Users receive neither automatically. Authorization remains ahead of Resource parsing, lookup, and mutation.

P4-M07 reused the existing persisted lifecycle column, so the Prisma schema remained unchanged. Data-only migration `20260815162000_knowledge_lifecycle_authorization` added the two lifecycle Permissions and Role grants, bringing the canonical migration count to 12. P4-M07 did not add reverse transitions, restore/unpublish, scheduled publication, approval workflow, a Workflow Kernel, business Events, API/Web behavior, or Devotional-specific lifecycle branching.

Implementation checkpoint:

```text
aaa9e88 feat(knowledge): establish lifecycle baseline
```

The implementation checkpoint is pushed to `origin/main`. GitHub Actions CI run `31895231315` completed successfully for exact commit `aaa9e88e474b4ae055f7ceac76ebb10342f0e585`.

P4-M07 LOCAL VALIDATION

```text
21 / 21 validation steps PASS
Knowledge unit tests: 4 files / 25 tests PASS
Knowledge integration tests: 4 files / 15 tests PASS
Canonical migrations: 12
Devotional consumer typecheck: PASS
Architecture: 347 modules / 875 dependencies / 0 violations
```

P4-M08 — Knowledge Events is next. Event Contracts remain undefined until the next milestone establishes a real producer/consumer boundary.

---

# 24. Phase Dependency Model

```text
Phase 0
Architecture
    ↓

Phase 1
Engineering Foundation
    ↓

Phase 2
Identity
    ↓

Phase 3
Kernel Baseline
    ↓

Phase 4
Knowledge + Proof Universes
    ↓

Phase 5
Media
    ↓

Phase 6
Discovery
    ↓

Phase 7
AI / Creator
    ↓

Phase 8
Composition / CMS
    ↓

Phase 9
Engagement
    ↓

Phase 10
Production Operations
```

This does not prohibit limited parallel work where dependencies permit it.

---

# 25. Controlled Parallelism

Parallel work may occur when:

```text
ownership is independent;

required Contracts are stable enough;

one stream does not require speculative future behavior from another.
```

Parallelism must not create duplicate architecture.

---

# 26. Phase 0 — Architecture Foundation

Status:

```text
COMPLETE UPON ACCEPTANCE OF THIS DOCUMENT
```

Purpose:

```text
establish the architecture contract before implementation.
```

---

# 27. Phase 0 Deliverables

```text
P0-D01 Project Charter

P0-D02 Vision

P0-D03 Mission

P0-D04 Platform Principles

P0-D05 Universe Principles

P0-D06 Goals

P0-D07 Non-Goals

P0-D08 Terminology

P0-D09 System Context

P0-D10 Platform Architecture

P0-D11 Platform Layers

P0-D12 Capability Map

P0-D13 Ownership Model

P0-D14 Dependency Rules

P0-D15 Extension Model

P0-D16 Repository Architecture

P0-D17 Technology Strategy

P0-D18 Master Roadmap
```

---

# 28. Phase 0 Closure Criteria

Phase 0 closes when:

```text
architecture documents are accepted;

major Capability ownership is defined;

dependency direction is defined;

Universe Extension strategy is defined;

repository architecture is defined;

technology baseline is selected;

Master Roadmap is accepted.
```

---

# 29. Phase 0 Result

After Phase 0:

```text
architecture is sufficiently stable to begin implementation;

architecture is not frozen forever;

implementation feedback may refine architecture through controlled decisions.
```

---

# 30. Phase 0 Closure Statement

```text
ARCHITECTURE FOUNDATION
COMPLETE

CODING
AUTHORIZED

NEXT
PHASE 1 — ENGINEERING FOUNDATION
```

---

# 31. Phase 1 — Engineering Foundation

Purpose:

> **Create the smallest reliable engineering environment in which all later AI World capabilities can be built safely and consistently.**

---

# 32. Phase 1 Primary Outcomes

Phase 1 should establish:

```text
monorepo runtime structure;

API Application;

Web Application;

typed Configuration;

PostgreSQL;

Prisma;

migrations;

development seed baseline;

structured logging;

error baseline;

health checks;

testing baseline;

CI baseline;

local infrastructure;

dependency-boundary foundation.
```

---

# 33. Phase 1 Does Not Build Product Platforms

Phase 1 must not expand into:

```text
full Authentication;

Knowledge;

Media;

Search;

AI;

CMS.
```

Its job is to make those capabilities safe to implement next.

---

# 34. Phase 1 Repository Materialization

Expected initial structure:

```text
apps/
├── api/
└── web/

packages/
└── foundations/
    ├── configuration/
    ├── database/
    ├── migration/
    └── observability/
```

Additional directories appear only as necessary.

---

# 35. Phase 1 Milestone P1-M01 — Workspace Bootstrap

Establish:

```text
pnpm workspace;

Turborepo;

root package scripts;

TypeScript baseline;

repository aliases/exports where appropriate;

formatting;

linting.
```

---

# 36. P1-M01 Acceptance

Must be possible to run repository tasks consistently through root commands.

Expected task direction:

```text
pnpm dev

pnpm build

pnpm lint

pnpm typecheck

pnpm test.
```

Exact scripts may evolve.

---

# 37. Phase 1 Milestone P1-M02 — API Bootstrap

Create:

```text
apps/api
```

with:

```text
NestJS runtime;

basic Application bootstrap;

Configuration integration;

structured logging;

global boundary validation/error baseline;

health endpoint.
```

---

# 38. API Initial Rule

The API must initially remain small.

Avoid creating empty Modules for every future Platform.

---

# 39. Phase 1 Milestone P1-M03 — Web Bootstrap

Create:

```text
apps/web
```

with:

```text
Next.js;

React;

Tailwind CSS;

basic application shell;

API connectivity strategy;

health/development page where useful.
```

---

# 40. Web Initial Rule

Do not begin designing the entire future AI World UI during Phase 1.

Only establish the delivery foundation.

---

# 41. Phase 1 Milestone P1-M04 — Configuration Foundation

Implement:

```text
typed Configuration;

Zod environment validation;

namespaced configuration;

fail-fast required configuration;

safe `.env.example`;
```

---

# 42. Configuration Acceptance

Invalid required configuration must cause clear startup failure.

Direct scattered:

```text
process.env
```

reads must not become normal business code.

---

# 43. Phase 1 Milestone P1-M05 — Database Foundation

Implement:

```text
PostgreSQL connectivity;

Prisma client lifecycle;

database health;

transaction baseline;

local database infrastructure.
```

---

# 44. Database Acceptance

Must prove:

```text
API can connect;

health can detect availability;

test environment can use real PostgreSQL;

database credentials remain configuration-driven.
```

---

# 45. Phase 1 Milestone P1-M06 — Migration Foundation

Implement:

```text
Prisma migration workflow;

development migration command;

CI-compatible migration validation;

migration naming convention.
```

---

# 46. Migration Rule

No normal development workflow may rely on manually editing production database schema.

---

# 47. Phase 1 Milestone P1-M07 — Seed Baseline

Create only the minimal Seed framework needed to support development/reference data.

Do not create giant cross-domain seed scripts.

---

# 48. Phase 1 Milestone P1-M08 — Observability Baseline

Implement:

```text
Pino structured logging;

request correlation;

error logging;

health logs;

environment-aware log formatting.
```

---

# 49. Observability Phase 1 Scope

Not required yet:

```text
distributed tracing backend;

large metrics stack;

Grafana cluster;

complex dashboards.
```

---

# 50. Phase 1 Milestone P1-M09 — Error Model Baseline

Establish early distinction between:

```text
Domain/Application errors;

validation errors;

authentication/authorization errors;

infrastructure errors;

unexpected internal errors.
```

Detailed API standards may evolve later.

---

# 51. Error Leakage Rule

Initial API must not leak:

```text
stack traces;

database errors;

provider internals
```

to ordinary clients.

---

# 52. Phase 1 Milestone P1-M10 — Testing Baseline

Establish:

```text
Vitest;

API test harness;

Supertest;

real PostgreSQL integration tests;

Playwright baseline.
```

---

# 53. Testing Baseline Acceptance

At least one meaningful test should prove each configured testing level works.

Do not create large fake test suites simply to demonstrate tooling.

---

# 54. Phase 1 Milestone P1-M11 — Local Development Infrastructure

Establish reproducible local infrastructure.

Initial dependency:

```text
PostgreSQL
```

through Docker Compose or accepted equivalent.

---

# 55. Phase 1 Local Development Rule

Do not add:

```text
Redis;

Search engine;

Queue broker;

Vector DB
```

to the initial local stack.

---

# 56. Phase 1 Milestone P1-M12 — CI Baseline

GitHub Actions should validate:

```text
install;

format;

lint;

typecheck;

tests;

build.
```

---

# 57. CI Acceptance

A clean clone should be buildable/testable through documented commands and CI.

---

# 58. Phase 1 Milestone P1-M13 — Architecture Boundary Baseline

Introduce enough package/import structure to preserve accepted ownership.

Automation may begin with:

```text
workspace boundaries;

restricted imports;

simple cycle detection.
```

---

# 59. Architecture Enforcement Scope

Do not build an elaborate architecture-testing framework before enough source exists to justify it.

---

# 60. Phase 1 Security Baseline

Include:

```text
no committed Secrets;

safe development configuration;

dependency hygiene;

secure HTTP defaults where appropriate;

safe error responses.
```

---

# 61. Phase 1 Documentation

Expected supporting docs may include:

```text
engineering setup;

configuration standard;

database usage;

migration commands;

testing baseline;

local development instructions.
```

---

# 62. Phase 1 Closure Criteria

Phase 1 is complete when:

```text
API starts reliably;

Web starts reliably;

PostgreSQL runs reproducibly;

Prisma connectivity works;

migrations work;

Configuration validation works;

structured logs exist;

health works;

tests run;

CI passes;

architecture boundaries are visible;

new developer setup is documented.
```

---

# 63. Phase 1 Closure Review

Before closing:

```text
run clean environment setup;

run all root quality commands;

run database migration from empty database;

verify no unnecessary infrastructure exists;

verify no business Platforms have been prematurely mixed into Foundation code.
```

---

# 64. Phase 1 Exit Outcome

AI World becomes:

```text
ENGINEERING-READY.
```

At Phase 1 closure, the next work was:

```text
Phase 2 — Identity Platform.
```

---

# 65. Phase 2 — Identity Platform

Purpose:

> **Establish one secure AI World identity, authentication, authorization, and User foundation reused by every future Universe and Platform.**

---

# 66. Phase 2 Primary Capabilities

Build the minimum viable:

```text
Identity & Access Platform;

User Platform;

Email Foundation.
```

---

# 67. Phase 2 Architectural Objective

Prove:

```text
canonical ownership;

Platform isolation;

security boundaries;

public Contracts;

Foundation reuse;

API/Web integration.
```

---

# 68. Phase 2 Repository Materialization

Expected:

```text
packages/platforms/
├── identity-access/
└── user/

packages/foundations/
└── email/
```

Potential Kernel support may be added only if required.

---
# 69. Phase 2 Milestone P2-M01 — Actor and User Baseline

P2-M01 established the foundational distinction between:

```text
Actor
  → security identity
```

and:

```text
User
  → product profile
```

The distinction is architectural and persistent.

An Actor represents the security identity that later participates in capabilities such as:

```text
credentials
authentication
Sessions
verification
recovery
roles
permissions
security lifecycle
```

A User represents the product-facing profile that later owns capabilities such as:

```text
display name
profile basics
locale
timezone
product preferences
```

Actor and User are not the same Resource.

P2-M01 established their ownership, public Contracts, canonical persistence relationship, first committed database migration, and persistence-validation baseline.

Current P2-M01 status:

```text
STATUS
CLOSED

repository/package inspection           complete
Actor vs User ownership                 complete
persistence relationship                complete
public Contract boundaries              complete
Identity & Access package               complete
User package                            complete
first canonical Prisma migration        complete
Platform persistence tests              complete
root database integration-test lane     complete
CI PostgreSQL/migration wiring          complete
fresh-database reconstruction proof     complete
local architecture/full validation      complete
Git checkpoint                          complete
GitHub Actions CI / Validate            complete
```

Canonical migration:

```text
20260809133830_actor_user_baseline
```

P2-M01 is retained as the Phase 2 persistence baseline and is not reopened by later Credential, Session, or profile work unless a real architectural requirement requires change.

---

# 70. P2-M01 Core Resources

P2-M01 implements exactly two business Resources:

```text
Identity & Access Platform
  Actor

User Platform
  User
```

The canonical Platform packages are:

```text
@ai-world/platform-identity-access
@ai-world/platform-user
```

Credential and Session are intentionally not implemented in P2-M01.

They belong to later Phase 2 authentication and Session milestones when concrete behavior requires them.

The P2-M01 persistence relationship is:

```text
Actor 1 ───── 0..1 User
```

The invariants are:

```text
a User must reference exactly one Actor
an Actor may exist without a User
an Actor may have at most one User
Actor and User use separate identifiers
User.actorId is a unique foreign key
Actor deletion is restricted while referenced by a User
Actor identifier updates cascade to the User reference
```

Canonical persistence ownership is:

```text
identity_actors
  → Identity & Access Platform

users
  → User Platform
```

Physical Prisma schema and migration mechanics remain owned by the Database Foundation.

The Database Foundation does not become the business owner of Actor or User.

The canonical persistence baseline uses:

```text
UUID identifiers
Prisma-level uuid() generation
PostgreSQL UUID columns
TIMESTAMPTZ(3) timestamps
```

The first committed canonical business migration is:

```text
20260809133830_actor_user_baseline
```

The migration creates:

```text
identity_actors
users
users.actor_id unique constraint
users.actor_id → identity_actors.id foreign key
ON DELETE RESTRICT
ON UPDATE CASCADE
```

P2-M01 public Contracts remain independent of Prisma-generated models.

Production Platform source must not expose or depend on Prisma persistence types.

Database Foundation access is permitted only as test infrastructure for the P2-M01 persistence integration tests.

P2-M01 persistence validation proves:

```text
Actor creation                              passed
canonical Actor UUID/timestamps             passed
User linkage to existing Actor              passed
duplicate User for one Actor rejected       passed
nonexistent Actor reference rejected        passed
referenced Actor deletion rejected          passed
test-owned database cleanup                 passed
```

The automated database integration lane is:

```text
pnpm run test:integration
```

P2-M01 closure test-suite ownership was:

```text
Identity & Access Platform
  1 integration test

User Platform
  4 integration tests

Total
  5 integration tests
```

The normal repository test lane remains independent of live PostgreSQL:

```text
pnpm run test
```

Database-backed persistence validation remains separate:

```text
pnpm run test:integration
```

CI reconstructs the persistence baseline through:

```text
fresh PostgreSQL
  ↓
committed Prisma migrations
  ↓
Actor/User canonical schema
  ↓
Platform integration tests
```

No generalized Kernel identifier capability is pulled into P2-M01.

If later Phase 3 identifier work requires migration of these Resources, that migration must be intentional rather than supported through a premature compatibility layer.

---

# 71. Phase 2 Milestone P2-M02 — Registration

P2-M02 implemented the first password-based registration vertical slice.

Implemented scope:

```text
User registration;

Identity-owned Actor creation;

Identity-owned email identifier creation;

secure password Credential setup;

User Platform creation through an owner-controlled Contract;

input validation;

duplicate normalized-email handling;

cross-owner transaction correctness;

public API transport;

real PostgreSQL integration proof.
```

P2-M02 is:

```text
CLOSED
```

---

# 72. Registration Acceptance and Closure

P2-M02 acceptance required proof of:

```text
duplicate identity handling;

password security;

input validation;

canonical User linkage;

transaction failure behavior.
```

All accepted P2-M02 requirements are implemented and validated.

## P2-M02 Ownership and Transaction Boundary

Registration is coordinated by:

```text
Identity & Access Platform
```

because the use case establishes:

```text
Actor security identity
+
ActorEmail
+
PasswordCredential
```

while also creating the corresponding product-facing User.

The atomic registration invariant is:

```text
Actor
+
ActorEmail
+
PasswordCredential
+
User

all commit together
or
none commit.
```

Canonical ownership remains:

```text
Actor
ActorEmail
PasswordCredential
    → Identity & Access Platform

User
    → User Platform
```

Cross-owner User creation occurs through the User Platform public mutation Contract:

```text
UserRegistrationWriter
```

Identity & Access does not directly mutate User-owned persistence.

Concrete persistence implementations are wired by the API Application Composition Root.

This keeps production Platform source dependent on public Contracts rather than peer Platform concrete infrastructure.

## P2-M02 Email Rules

Registration email handling is:

```text
trim surrounding whitespace

validate structural email form

maximum 254 Unicode code points

preserve the trimmed email representation

lowercase normalizedEmail

enforce normalizedEmail uniqueness

do not perform provider-specific normalization
```

Email verification is intentionally not part of P2-M02.

It remains:

```text
P2-M05 — Email Verification
```

## P2-M02 Password Rules

The registration password policy is:

```text
minimum 15 Unicode code points

maximum 128 Unicode code points

NFC normalization before hashing

no trimming

no truncation

spaces allowed

Unicode allowed

no composition rules
```

Passwords are hashed with:

```text
Argon2id

memoryCost   19456 KiB
timeCost     2
parallelism  1
hashLength   32
version      0x13
```

Password hashing occurs before the registration database transaction is opened.

Raw passwords are not persisted or returned through:

```text
public API responses

ApplicationError public messages

diagnostic causes
```

## P2-M02 Persistence

P2-M02 adds Identity & Access-owned persistence for:

```text
ActorEmail

PasswordCredential
```

Canonical business tables after P2-M02 are:

```text
identity_actors

identity_actor_emails

identity_password_credentials

users
```

P2-M02 adds the committed migration:

```text
20260809170217_actor_email_password_credential
```

Current canonical migration history:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential
```

A fresh disposable PostgreSQL database was successfully reconstructed using only committed migrations.

## P2-M02 Registration API

The API Application exposes:

```text
POST /registration
```

Successful registration returns:

```text
HTTP 201

actorId
userId
```

The public registration response does not expose:

```text
password

password hash

Credential identifiers

internal persistence models

Session

token

cookie
```

Current public registration error behavior includes:

```text
400 — invalid transport request

400 — invalid email

400 — invalid password

409 — duplicate normalized email
```

Database/provider-specific failures are translated into AI World error semantics before reaching the public API.

## P2-M02 Validation Evidence

P2-M02 closure validation proves:

```text
Frozen dependency install               PASS

Prettier                                PASS

Lint                                    PASS

TypeScript                              PASS

Identity unit tests                     17 / 17 PASS

Identity integration tests              11 / 11 PASS

User integration tests                   4 / 4 PASS

API registration integration             5 / 5 PASS

Database integration total              20 / 20 PASS

API baseline tests                        7 / 7 PASS

Chromium browser E2E                      1 / 1 PASS

Production build                        PASS

Prisma schema validation                PASS

Canonical migration status              PASS

Fresh migration reconstruction          PASS

Architecture validation                 PASS
```

Current architecture validation result:

```text
98 modules

171 dependencies

0 dependency violations
```

After database-backed validation, test-owned canonical business rows are:

```text
identity_actors               0

identity_actor_emails         0

identity_password_credentials 0

users                         0
```

## P2-M02 Architecture Review Correction

Final canonical-document review identified one concrete peer-Platform wiring issue before closure.

The corrected dependency direction is:

```text
Identity & Access infrastructure
    ↓
UserRegistrationWriter public Contract
```

rather than:

```text
Identity & Access infrastructure
    ↓
User concrete persistence implementation
```

The API Composition Root now wires the concrete User persistence writer.

Focused validation after the correction passed:

```text
Identity typecheck/build/lint            PASS

API typecheck/lint                       PASS

Identity unit tests                      17 / 17 PASS

API baseline tests                        7 / 7 PASS

Database integration total              20 / 20 PASS

Architecture validation                 98 modules / 171 dependencies / 0 violations
```

## P2-M02 Scope Boundary

P2-M02 intentionally does not implement:

```text
password login

credential authentication flow

Session creation

Session validation

logout

email verification workflow

password recovery

User Profile editing

Roles

Permissions

owner-side Authorization
```

Those remain later Phase 2 milestones.

Current delivery position:

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
NEXT

Phase 2 — Identity Platform
ACTIVE
```

---

# 73. Phase 2 Milestone P2-M03 — Password Authentication

P2-M03 reuses the password Credential and Argon2id baseline established by P2-M02.

Implemented scope:

```text
login transport validation;

canonical email normalization;

canonical Identity lookup;

stored PasswordCredential lookup;

Argon2id password verification;

safe authentication failure semantics;

unknown-identity anti-enumeration verification;

successful Actor authentication result;

real PostgreSQL integration;

public API transport.
```

Current milestone status:

```text
CLOSED
```

P2-M03 is CLOSED after its intentional Git checkpoint and successful remote validation.

## P2-M03 Authentication Boundary

Password authentication is owned by:

```text
Identity & Access Platform
```

The use case is:

```text
email
+
password

    ↓

AuthenticatePassword

    ↓

ActorEmail lookup

    ↓

PasswordCredential lookup

    ↓

Argon2id verification

    ↓

authenticated actorId
```

The User Platform does not participate in credential authentication.

Authentication answers:

```text
Which Actor successfully proved possession of this Credential?
```

It does not resolve or return User profile state.

## P2-M03 Authentication Input Rules

Authentication email input is normalized through:

```text
trim surrounding whitespace

lowercase canonical email
```

Authentication password input is normalized through:

```text
Unicode NFC
```

Authentication does not reuse registration-specific validation errors or registration policy semantics.

Transport payload validation remains separate from credential authentication semantics.

## P2-M03 Password Verification

Password verification is represented through:

```text
PasswordVerifier
```

with the Argon2id implementation:

```text
Argon2idPasswordVerifier
```

Registration continues to use:

```text
PasswordHasher
Argon2idPasswordHasher
```

Hashing and verification remain separate capabilities.

The stored Argon2id hash parameters remain those established by P2-M02:

```text
memoryCost   19456 KiB

timeCost     2

parallelism  1

hashLength   32

version      0x13
```

## P2-M03 Unknown-Identity Handling

Unknown email and wrong password intentionally expose the same public failure:

```text
HTTP 401

identity.authentication.invalid_credentials

The email or password is incorrect.
```

Unknown identities do not skip password verification.

Instead, authentication verifies the supplied password against:

```text
ARGON2ID_AUTHENTICATION_DUMMY_PASSWORD_HASH
```

so the missing-identity path still performs Argon2id verification work.

The dummy hash is not a secret and does not represent a real Actor or Credential.

Its purpose is to reduce obvious account-enumeration differences between:

```text
unknown email

and

known email + wrong password.
```

No claim of perfectly identical wall-clock execution time is made.

## P2-M03 Persistence

P2-M03 authentication persistence is:

```text
READ ONLY
```

The authentication reader uses existing Identity-owned persistence:

```text
identity_actor_emails.normalized_email

identity_password_credentials.password_hash

identity_password_credentials.actor_id
```

P2-M03 introduces:

```text
NO new table

NO new column

NO Prisma schema change

NO database migration
```

The canonical migration history therefore remains:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential
```

## P2-M03 Authentication API

The API Application exposes:

```text
POST /authentication/password
```

Successful authentication returns:

```text
HTTP 200

actorId
```

The successful response intentionally does not return:

```text
userId

password

passwordHash

Credential ID

Session

token

cookie
```

Invalid transport payload returns:

```text
HTTP 400

identity.authentication.invalid_request

The authentication request is invalid.
```

Invalid credentials return:

```text
HTTP 401

identity.authentication.invalid_credentials

The email or password is incorrect.
```

Wrong-password and unknown-email failures use the same public error code, message, and HTTP status.

## P2-M03 Session Boundary

P2-M03 intentionally does not implement:

```text
Session creation

Session validation

Session expiration

Session revocation

logout

access token

refresh token

JWT

authentication cookie
```

Those remain primarily:

```text
P2-M04 — Session Management
```

A successful P2-M03 password-authentication result proves Actor authentication only.

## P2-M03 Validation Evidence

Full P2-M03 local validation proves:

```text
Frozen dependency install               PASS

Prettier                                PASS

Lint                                    PASS

TypeScript                              PASS

Identity unit tests                     23 / 23 PASS

Identity integration tests              11 / 11 PASS

User integration tests                   4 / 4 PASS

API baseline tests                        7 / 7 PASS

API registration integration             5 / 5 PASS

API authentication integration           6 / 6 PASS

API integration total                   11 / 11 PASS

Repository integration total            26 / 26 PASS

Chromium browser E2E                      1 / 1 PASS

Production build                        PASS

Prisma schema validation                PASS

Canonical migration status              PASS

Architecture validation                 PASS
```

Current architecture validation result:

```text
113 modules

211 dependencies

0 dependency violations
```

Canonical database state after integration execution:

```text
identity_actors               0

identity_actor_emails         0

identity_password_credentials 0

users                         0
```

P2-M03 security validation proves:

```text
successful canonicalized-email authentication;

real Argon2id verification;

wrong password → HTTP 401;

unknown email → HTTP 401;

wrong-password and unknown-email public failures equivalent;

raw password absent from public response;

passwordHash absent from public response;

Credential ID absent from public response;

Actor identity absent from failed-authentication response;

no Session returned;

no token returned;

no cookie created;

authentication does not create or mutate registration-owned state.
```

## P2-M03 Current Delivery Position

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
NEXT

Phase 2 — Identity Platform
ACTIVE
```

P2-M03 closure gate is complete:

intentional Git checkpoint

successful remote validation

P2-M04 subsequently implemented and validated Session Management.

---

# 74. Authentication Security

P2-M03 authentication security must prevent:

```text
plain-password persistence;

credential disclosure;

unsafe authentication error detail;

password logging;

obvious account existence disclosure.
```

Current implementation satisfies the P2-M03 security boundary through:

```text
Argon2id credential verification;

safe ApplicationError public messages;

equivalent public failures for unknown email and wrong password;

dummy-hash verification for unknown identities;

no password or passwordHash in API responses;

no Credential identifiers in failed responses;

read-only authentication persistence;

no Session/token/cookie creation.
```

P2-M04 subsequently implements the Session security baseline that P2-M03 intentionally excluded:

```text
Session creation;

Session validation;

Session expiration;

Session revocation;

logout;

Secure HttpOnly cookie transport.
```

Broader controls such as:

```text
rate limiting;

account lockout policy;

device/activity Session management;

advanced Session Security UX
```

remain separate capabilities and should be introduced only in their accepted milestone scope.

---

# 75. Phase 2 Milestone P2-M04 — Session Management

P2-M04 implements Identity-owned opaque server-side Session management.

Milestone status:

```text
P2-M04 — Session Management
CLOSED
```

## P2-M04 Session Ownership

Session lifecycle is owned by:

```text
Identity & Access Platform
```

Applications consume Session capabilities through Identity contracts.

Applications do not own:

```text
Session persistence;

Session token generation;

Session validation rules;

Session expiration;

Session revocation;

logout semantics.
```

The API Application owns transport concerns such as HTTP routes, cookie reading, cookie writing, and response shaping.

## P2-M04 Session Persistence

The Identity persistence model introduces:

```text
identity_sessions
```

Relationship:

```text
Actor 1 → many Sessions
```

A Session stores:

```text
id

actorId

tokenDigest

expiresAt

revokedAt

createdAt

updatedAt
```

The Session migration is:

```text
20260810123113_actor_session_baseline
```

The Session foreign key is:

```text
identity_sessions.actor_id
    → identity_actors.id

ON DELETE CASCADE

ON UPDATE CASCADE
```

Indexes exist for:

```text
actor_id

expires_at

unique token_digest
```

Physical Prisma schema and migration mechanics remain owned by the Database Foundation. Identity & Access remains the business owner of Session semantics and lifecycle.

## P2-M04 Opaque Session Token

Session authentication uses an opaque cryptographically random token.

Token generation:

```text
32 cryptographically random bytes

→ unpadded base64url

→ opaque Session token
```

The raw Session token is never persisted.

Before persistence:

```text
raw token

→ SHA-256

→ 64-character lowercase hexadecimal digest
```

Only the digest is stored in:

```text
identity_sessions.token_digest
```

This preserves the invariant:

```text
raw Session secret
    NEVER stored in PostgreSQL
```

## P2-M04 Session Lifetime

The initial Session lifetime is:

```text
7-day absolute expiration
```

P2-M04 does not implement sliding expiration.

A newly created Session has:

```text
revokedAt = NULL
```

Multiple concurrent Sessions for the same Actor are permitted.

Device and activity metadata remain outside P2-M04 scope.

## P2-M04 Session Creation

Successful password sign-in is coordinated inside Identity & Access through:

```text
SignInWithPassword

AuthenticatePassword
        ↓
CreateSession
```

The API controller does not independently coordinate password authentication and Session creation as separate business operations.

`CreateSession`:

```text
receives actorId;

generates the raw opaque token;

digests the token with SHA-256;

calculates absolute expiration;

persists the digest only;

returns the raw token for the Application transport boundary.
```

## P2-M04 Session Validation

Session validation receives the raw opaque token and derives its digest before persistence lookup.

A Session is valid only when:

```text
token digest exists

AND

revokedAt IS NULL

AND

expiresAt > current time
```

The expiration boundary is strict:

```text
expiresAt == now
→ expired
```

Unknown, revoked, and expired Sessions expose the same public authentication failure:

```text
HTTP 401

identity.session.invalid

Authentication is required.
```

The public API does not reveal why Session validation failed.

## P2-M04 Session Revocation

Identity & Access supports:

```text
logout by token digest;

Actor-scoped Session revocation.
```

Revocation persists:

```text
revokedAt
```

Revocation operations are intentionally idempotent.

The following cases do not expose Session existence:

```text
unknown Session;

already-revoked Session;

repeated logout.
```

Logout does not return whether a Session existed.

## P2-M04 Password Sign-In API

The existing endpoint remains:

```text
POST /authentication/password
```

Successful password authentication now:

```text
validates credentials;

creates a Session;

sets the Session cookie;

returns HTTP 200.
```

The JSON success body remains:

```json
{
  "actorId": "..."
}
```

It does not expose:

```text
Session ID;

raw Session token;

token digest;

password;

password hash;

Credential identifiers.
```

Wrong-password and unknown-email failures remain equivalent:

```text
HTTP 401

identity.authentication.invalid_credentials

The email or password is incorrect.
```

No Session is created and no Session cookie is issued when password authentication fails.

## P2-M04 Session API

The API Application exposes:

```text
GET /session

DELETE /session
```

`GET /session` validates the Session cookie and returns:

```json
{
  "actorId": "...",
  "expiresAt": "..."
}
```

It does not expose:

```text
Session ID;

raw token;

token digest.
```

`DELETE /session`:

```text
revokes the Session when a token is present;

clears the browser cookie;

returns HTTP 204;

remains successful when the cookie is missing;

remains successful for repeated logout.
```

## P2-M04 Browser Cookie

The first-party Session cookie is:

```text
ai_world_session
```

Cookie policy:

```text
HttpOnly

SameSite=Lax

Path=/

Max-Age aligned with the 7-day Session lifetime

Expires aligned with Session expiration

Secure in production

not Secure for local/test HTTP

no explicit Domain
```

The raw opaque Session token is transported only through the cookie boundary and is not returned in the JSON response.

P2-M04 does not use browser localStorage for the Session secret.

The initial browser deployment baseline is same-site. Generalized cross-site CSRF handling and deployment-specific Domain policy are not introduced speculatively; exact controls remain tied to deployment topology.

## P2-M04 JWT Boundary

JWT is not the default first-party browser Session storage model.

P2-M04 uses:

```text
server-managed opaque Sessions
```

JWT/JWS remains available for later capabilities where the accepted technology strategy requires it, but is not introduced as the user Session mechanism here.

## P2-M04 Security Invariants

P2-M04 validation proves:

```text
raw Session token is not persisted;

raw Session token is not returned in JSON;

database stores only SHA-256 token digest;

production Session cookie includes Secure;

Session cookie is HttpOnly;

Session cookie uses SameSite=Lax;

expired Sessions are rejected;

revoked Sessions are rejected;

unknown Sessions are rejected;

logout is idempotent;

repeated logout does not change the original revokedAt;

missing-cookie logout succeeds;

wrong-password authentication creates no Session;

unknown-email authentication creates no Session.
```

## P2-M04 Validation Evidence

Full P2-M04 local validation completed successfully.

```text
Frozen dependency install
PASS

Formatting
PASS

Lint
8 / 8 tasks

Typecheck
15 / 15 tasks

Normal repository tests
12 / 12 Turbo tasks

Identity & Access unit tests
41 / 41

API unit tests
12 / 12

API integration tests
18 / 18

Registration API integration
5 / 5

Password sign-in API integration
6 / 6

Session lifecycle API integration
7 / 7

Repository integration lane
PASS

E2E
PASS

Production build
PASS

Architecture
147 modules
294 dependencies
0 violations

Prisma validation
PASS

Prisma migrations
3 migrations
database schema up to date

Post-validation business rows
identity_actors                  0
identity_actor_emails            0
identity_password_credentials    0
users                            0
identity_sessions                0

git diff --check
PASS
```

The Session API integration exercises the real path:

```text
HTTP

→ Nest Application

→ Identity & Access use cases

→ PrismaSessionRepository

→ PostgreSQL

→ identity_sessions
```

This provides end-to-end proof of Session creation, digest-at-rest, validation, expiration rejection, revocation, logout, cookie clearing, and post-logout rejection.

## P2-M04 Closure

P2-M04 implementation and local validation are complete.

Current milestone position:

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
NEXT

Phase 2 — Identity Platform
ACTIVE
```

P2-M05 may proceed after the intentional P2-M04 Git checkpoint and successful remote validation.

---

# 76. Session Web Integration

P2-M04 establishes the first-party browser Session transport through:

```text
Secure HttpOnly cookie
```

with the concrete cookie baseline documented in Section 75.

The first-party Web should consume this Session mechanism rather than introducing a separate browser token-storage model.

Deployment-topology-specific cookie and CSRF controls remain governed by the accepted Security architecture and Technology Strategy.

---

# 77. Phase 2 Milestone P2-M05 — Email Verification

P2-M05 implemented the first complete Identity-owned email verification lifecycle through the shared Email Foundation.

Milestone status:

```text
P2-M05 — Email Verification
CLOSED
```

Implemented scope:

```text
Email Foundation delivery Contract;

SMTP delivery adapter;

local Mailpit infrastructure;

Identity-owned verification state;

ActorEmail verification timestamp;

verification challenge persistence;

secure verification token generation;

SHA-256 digest-only token persistence;

24-hour absolute token expiration;

authenticated verification issuance;

verification resend;

previous-token invalidation;

single-use verification confirmation;

atomic verification transaction;

public verification API;

real PostgreSQL lifecycle and security proof;

real SMTP → Mailpit provider proof.
```

## P2-M05 Architecture Boundary

The canonical flow is:

```text
Web / API
    ↓
Identity & Access Platform
    ↓
verification state
    ↓
Email Foundation
    ↓
SMTP adapter
    ↓
email provider
```

Canonical ownership is:

```text
Identity & Access Platform
    owns ActorEmail verification state
    owns verification challenge lifecycle
    owns token policy
    owns verification confirmation

Email Foundation
    owns provider-neutral email delivery
    owns SMTP delivery adapter

API Application
    owns runtime composition
```

Identity & Access depends on the Email Foundation delivery Contract.

Identity & Access does not depend directly on:

```text
Nodemailer

Mailpit
```

Registration remains uncoupled from email delivery.

A registration success therefore does not depend on SMTP or provider availability.

## P2-M05 Email Foundation

P2-M05 materialized:

```text
@ai-world/foundation-email
```

with the provider-neutral public Contract:

```text
EmailDelivery
EmailMessage
```

and concrete infrastructure adapter:

```text
SmtpEmailDelivery
```

Local development uses:

```text
Mailpit

SMTP
127.0.0.1:1025

HTTP / API
127.0.0.1:8025
```

## P2-M05 Persistence

ActorEmail now records:

```text
verifiedAt
```

Verification challenges are persisted in:

```text
identity_email_verification_challenges
```

The challenge references:

```text
ActorEmail
```

The persistence invariant is:

```text
one current verification challenge per ActorEmail
```

P2-M05 added the committed migration:

```text
20260811061735_actor_email_verification_baseline
```

Canonical migration history after P2-M05:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential

20260810123113_actor_session_baseline

20260811061735_actor_email_verification_baseline
```

Canonical migration count:

```text
4
```

## P2-M05 Verification Token Security

Verification tokens use:

```text
32 cryptographically random bytes

    ↓

base64url raw token

    ↓

43 characters

    ↓

no padding
```

The raw verification token is delivered through email.

The raw token is never persisted.

Persistence stores only:

```text
SHA-256

lowercase hexadecimal

64 characters
```

Verification tokens expire through:

```text
24-hour absolute expiration
```

P2-M05 does not implement sliding verification-token expiration.

## P2-M05 Issuance and Resend

Verification issuance requires an authenticated Actor Session.

The flow is:

```text
authenticated actorId

    ↓

resolve ActorEmail

    ↓

already verified?
    → successful no-op

    ↓

generate raw verification token

    ↓

SHA-256 digest

    ↓

persist current challenge

    ↓

deliver raw token through EmailDelivery
```

A resend replaces:

```text
tokenDigest

expiresAt
```

and resets:

```text
consumedAt
```

on the current challenge.

Therefore the previously issued raw verification token immediately becomes invalid.

Persistence occurs before SMTP delivery.

If SMTP delivery fails:

```text
the delivery error propagates
```

and a later retry replaces the current challenge with a new token/digest.

P2-M05 intentionally does not introduce:

```text
outbox

durable queue

distributed transaction
```

because those capabilities are not required by the accepted milestone scope.

## P2-M05 Confirmation

Confirmation receives the raw token delivered through email.

The flow is:

```text
raw token

    ↓

SHA-256 digest

    ↓

challenge lookup

    ↓

validate challenge state

    ↓

atomic database transaction

    ├── consume challenge
    └── set ActorEmail.verifiedAt
```

The same canonical invalid-token failure is exposed for:

```text
unknown token

expired token

already consumed token

token that is no longer applicable
```

This prevents public verification-state differences from exposing internal challenge state.

Challenge consumption uses a conditional persistence update.

Concurrent confirmation therefore permits:

```text
one successful consumer only
```

If the ActorEmail verification mutation fails after challenge consumption begins:

```text
the complete transaction rolls back
```

and the challenge remains unconsumed.

## P2-M05 API

The API Application exposes:

```text
POST /email-verification/request

POST /email-verification/confirm
```

### POST /email-verification/request

Requires:

```text
valid ai_world_session cookie
```

The endpoint accepts no meaningful payload.

Success:

```text
HTTP 204
```

An already verified ActorEmail produces:

```text
HTTP 204

no additional verification email
```

Missing, unknown, expired, or revoked Session state uses the existing canonical Session authentication failure.

### POST /email-verification/confirm

Accepts:

```json
{
  "token": "opaque verification token"
}
```

Confirmation deliberately does not require an authenticated Session.

Possession of the valid single-use emailed token is the verification proof.

Success:

```text
HTTP 204
```

Invalid verification tokens use the canonical public invalid-token failure.

P2-M05 does not mutate verification state through GET requests.

## P2-M05 Authentication Boundary

P2-M05 intentionally allows:

```text
password authentication
```

for an Actor whose ActorEmail has not yet been verified.

Therefore:

```text
unverified email
    does not block
password authentication
```

Future verification requirements must be introduced only where a later accepted capability requires them.

## P2-M05 Lifecycle and Security Proof

PostgreSQL-backed API integration tests prove:

```text
verification request requires authenticated Session;

unknown Session is rejected;

valid Session issues verification;

raw verification token is not persisted;

stored token digest is SHA-256 hexadecimal;

already verified request is a successful no-op;

confirmation does not require a Session;

unknown token is rejected;

malformed confirmation transport is rejected;

resend generates a replacement token;

resend invalidates the previous token;

expired token is rejected without verification mutation;

consumed token replay is rejected;

concurrent confirmation allows one successful consumer only;

verification-state mutation failure rolls back challenge consumption.
```

The real provider proof exercises:

```text
API

    ↓

Identity & Access

    ↓

Email Foundation

    ↓

SmtpEmailDelivery

    ↓

real SMTP

    ↓

Mailpit

    ↓

actual delivered raw token

    ↓

SHA-256 digest matches PostgreSQL

    ↓

confirmation without Session

    ↓

ActorEmail.verifiedAt

+

challenge.consumedAt

    ↓

replay rejected
```

## P2-M05 Validation Evidence

Final P2-M05 validation:

```text
Format check                              PASS

Lint                                      PASS

TypeScript                                PASS

Identity unit tests                       53 / 53 PASS

Identity integration tests                11 / 11 PASS

User integration tests                     4 / 4 PASS

API unit tests                            12 / 12 PASS

API PostgreSQL integration tests          31 / 31 PASS

Repository integration tests              46 / 46 PASS

Real SMTP → Mailpit integration            1 / 1 PASS

Production build                          PASS

Architecture validation                   PASS

Git diff validation                       PASS

GitHub Actions CI / Validate              PASS
```

Final architecture result:

```text
184 modules

383 dependencies

0 dependency violations
```

Canonical persistence state:

```text
4 committed migrations

schema up to date
```

P2-M05 implementation, local validation, real provider validation, Git checkpoint, and remote CI validation are complete.

## P2-M05 Delivery Position

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
CLOSED

P2-M06 — Recovery
NEXT

Phase 2 — Identity Platform
ACTIVE
```

---

# 78. Email Verification Ownership

The accepted ownership rule is implemented and validated:

```text
Identity & Access
    owns verification state

Email Foundation
    owns delivery
```

This remains the canonical boundary for later email-dependent Identity capabilities, including Recovery.

---

# 79. Phase 2 Milestone P2-M06 — Recovery

P2-M06 implemented controlled password recovery through Identity & Access while reusing the shared Email Foundation introduced by P2-M05.

Milestone status:

```text
P2-M06 — Recovery
CLOSED
```

Implemented scope:

```text
public forgot-password request;

enumeration-safe recovery issuance;

Identity-owned recovery challenge persistence;

secure recovery token generation;

SHA-256 digest-only token persistence;

1-hour absolute token expiration;

replacement recovery issuance;

previous-token invalidation;

Recovery email delivery through Email Foundation;

replacement-password validation;

Argon2id replacement password hashing;

single-use recovery reset;

atomic challenge consumption;

atomic PasswordCredential replacement;

atomic Actor-wide Session revocation;

public Recovery API;

real PostgreSQL lifecycle/security proof;

real SMTP → Mailpit recovery proof.
```

## P2-M06 Architecture Boundary

Canonical ownership is:

```text
Identity & Access Platform
    owns password recovery policy
    owns recovery challenge state
    owns recovery token lifecycle
    owns password replacement
    owns Session invalidation after reset

Email Foundation
    owns provider-neutral email delivery
    owns SMTP delivery infrastructure

API Application
    owns runtime composition
```

The canonical issuance flow is:

```text
public API request
    ↓
Identity & Access
    ↓
ActorEmail lookup
    ↓
PasswordCredential applicability check
    ↓
recovery challenge
    ↓
Email Foundation
    ↓
SMTP adapter
    ↓
email provider
```

Identity & Access depends only on the Email Foundation delivery Contract.

Recovery does not directly depend on:

```text
Nodemailer

Mailpit
```

P2-M06 does not introduce:

```text
Redis

queue infrastructure

outbox infrastructure

distributed transaction infrastructure
```

because none are required by the accepted Recovery scope.

## P2-M06 Persistence

Recovery challenges are persisted in:

```text
identity_password_recovery_challenges
```

Each challenge references:

```text
ActorEmail
```

The persistence invariant is:

```text
one current PasswordRecoveryChallenge per ActorEmail
```

The persisted challenge contains:

```text
id

actorEmailId

tokenDigest

expiresAt

consumedAt

createdAt

updatedAt
```

P2-M06 added the committed migration:

```text
20260811090103_actor_password_recovery_baseline
```

Canonical migration history after P2-M06:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential

20260810123113_actor_session_baseline

20260811061735_actor_email_verification_baseline

20260811090103_actor_password_recovery_baseline
```

Canonical migration count:

```text
5
```

## P2-M06 Recovery Token Security

Recovery tokens use:

```text
32 cryptographically random bytes

    ↓

base64url raw token

    ↓

43 characters

    ↓

no padding
```

The raw recovery token is delivered through email only.

The raw token is never persisted.

Persistence stores only:

```text
SHA-256

lowercase hexadecimal

64 characters
```

Recovery tokens use:

```text
1-hour absolute expiration
```

P2-M06 does not implement sliding recovery-token expiration.

## P2-M06 Forgot-Password Request

Recovery request email input is:

```text
trimmed

lowercased for normalized lookup
```

The stored ActorEmail representation is retained for delivery.

The request endpoint deliberately does not expose account existence.

Normal public behavior is equivalent for:

```text
known recoverable email

unknown email

semantically invalid email

ActorEmail without a usable PasswordCredential
```

Each produces the same successful no-content transport result under normal operation.

A recoverable ActorEmail may be:

```text
verified

or

unverified
```

Email verification is not a precondition for Recovery.

Issuance performs:

```text
normalized email lookup

    ↓

generate raw recovery token

    ↓

SHA-256 digest

    ↓

expiresAt = now + 1 hour

    ↓

upsert current challenge

    ↓

deliver raw token through EmailDelivery
```

## P2-M06 Replacement Issuance

A repeated Recovery request for the same ActorEmail replaces:

```text
tokenDigest

expiresAt
```

and resets:

```text
consumedAt
```

on the current challenge.

Therefore the previously issued raw recovery token becomes invalid immediately.

## P2-M06 Replacement Password Policy

Recovery replacement passwords use the same accepted password strength baseline as registration:

```text
minimum 15 Unicode code points

maximum 128 Unicode code points

NFC normalization

no trimming

no truncation

spaces allowed

Unicode allowed
```

Recovery exposes Recovery-specific validation semantics rather than registration-specific error codes.

Replacement password hashing reuses:

```text
Argon2idPasswordHasher
```

Hashing occurs before opening the Recovery database transaction.

The raw replacement password is never passed into the Recovery persistence transaction.

## P2-M06 Reset Transaction

Password reset receives:

```text
raw recovery token

new password
```

Application processing performs:

```text
validate + NFC-normalize password

    ↓

SHA-256 recovery-token digest

    ↓

Argon2id replacement password hash

    ↓

single PostgreSQL transaction
```

The transaction atomically:

```text
validates the current challenge

    ↓

conditionally consumes the challenge

    ↓

replaces PasswordCredential.passwordHash

    ↓

revokes every non-revoked Actor Session
```

The same canonical invalid-token failure is exposed for:

```text
unknown token

expired token

already consumed token

superseded token

token no longer applicable to a usable password Credential
```

Challenge consumption is conditional.

Concurrent reset attempts therefore permit:

```text
one successful consumer only
```

If password replacement or Session revocation fails after transaction processing begins:

```text
the complete transaction rolls back
```

Therefore challenge consumption, password replacement, and Session revocation cannot partially commit.

## P2-M06 Session Security

A successful Recovery reset revokes:

```text
every non-revoked Session owned by the Actor
```

This includes multiple concurrently existing Actor Sessions.

The reset does not issue a new Session automatically.

The User must authenticate with the replacement password to establish a new Session.

## P2-M06 Email Verification Boundary

Recovery intentionally does not mutate:

```text
ActorEmail.verifiedAt
```

A successful Recovery reset therefore proves possession of the Recovery token for password-reset purposes only.

It does not redefine the P2-M05 email-verification lifecycle.

## P2-M06 API

The API Application exposes:

```text
POST /password-recovery/request

POST /password-recovery/reset
```

### POST /password-recovery/request

Accepts:

```json
{
  "email": "person@example.com"
}
```

An authenticated Session is not required.

Success:

```text
HTTP 204
```

Known and unknown email addresses expose the same normal success response.

Semantically invalid string email values are also enumeration-safe successful no-ops.

Malformed transport shape is rejected through the canonical Recovery request-validation failure.

### POST /password-recovery/reset

Accepts:

```json
{
  "token": "opaque recovery token",
  "password": "replacement password"
}
```

An authenticated Session is not required.

Success:

```text
HTTP 204
```

Unknown, expired, consumed, superseded, and otherwise invalid tokens expose one canonical Recovery invalid-token failure.

## P2-M06 PostgreSQL Lifecycle and Security Proof

PostgreSQL-backed integration tests prove:

```text
Recovery request requires no Session;

normalized email lookup;

unknown email enumeration-safe behavior;

semantically invalid email enumeration-safe behavior;

raw token absent from persistence;

stored SHA-256 digest matches issued raw token;

1-hour absolute expiration;

replacement request reuses the current challenge;

replacement request invalidates the previous token;

expired-token rejection without state mutation;

single-use reset;

replay rejection;

replacement password persistence;

old-password rejection after reset;

new-password authentication after reset;

ActorEmail verification state remains unchanged;

every existing Actor Session is revoked;

concurrent reset permits one successful consumer only;

forced Session-revocation failure rolls back challenge consumption;

forced Session-revocation failure rolls back password replacement;

forced Session-revocation failure preserves previous Session state;

the same Recovery token remains usable after transactional rollback.
```

## P2-M06 Real SMTP and Mailpit Proof

The real provider integration exercises:

```text
POST /password-recovery/request

    ↓

IssuePasswordRecovery

    ↓

EmailDelivery

    ↓

SmtpEmailDelivery

    ↓

real SMTP

    ↓

Mailpit

    ↓

actual delivered 43-character raw token

    ↓

SHA-256 digest matches PostgreSQL

    ↓

POST /password-recovery/reset

    ↓

challenge consumed

+

password replaced

+

all prior Sessions revoked

    ↓

old password rejected

new password accepted

    ↓

exact delivered token replay rejected
```

## P2-M06 Validation Evidence

Final P2-M06 validation:

```text
Format check                              PASS

Lint                                      PASS

TypeScript                                PASS

Identity unit tests                       72 / 72 PASS

Identity integration tests                11 / 11 PASS

User integration tests                     4 / 4 PASS

API unit tests                            12 / 12 PASS

API PostgreSQL integration tests          45 / 45 PASS

Repository integration tests              60 / 60 PASS

Real SMTP → Mailpit integration            2 / 2 PASS

Production build                          PASS

Architecture validation                   PASS

Git diff validation                       PASS

GitHub Actions CI / Validate              PASS
```

Final architecture result:

```text
216 modules

473 dependencies

0 dependency violations
```

Canonical persistence state:

```text
5 committed migrations

schema up to date
```

Implementation checkpoint:

```text
15f7832 feat(identity): complete password recovery lifecycle
```

P2-M06 implementation, local validation, PostgreSQL security validation, real provider validation, Git checkpoint, and remote CI validation are complete.

## P2-M06 Delivery Position

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
CLOSED

P2-M06 — Recovery
CLOSED

P2-M07 — User Profile
CLOSED

P2-M08 — Roles and Permissions
CLOSED

P2-M09 — Owner-Side Authorization
CLOSED

P2-M10 — Session Security UX
NEXT

Phase 2 — Identity Platform
ACTIVE
```

---

# 80. Phase 2 Milestone P2-M07 — User Profile

P2-M07 implemented the minimal shared User Profile capability while preserving the architectural separation between Identity & Access and the User Platform.

Milestone status:

```text
P2-M07 — User Profile
CLOSED
```

Implemented scope:

```text
nullable User.displayName persistence;

minimal User Profile ownership in the User Platform;

display-name normalization and validation;

NFC normalization;

leading/trailing whitespace trimming;

internal whitespace preservation;

1–80 Unicode code-point display-name policy;

explicit display-name clearing through null;

UserProfileReader Contract;

UserProfileWriter Contract;

Prisma User Profile repository;

GetUserProfile use case;

UpdateUserProfile use case;

authenticated GET /user-profile;

authenticated PATCH /user-profile;

Session-derived Actor ownership;

strict profile update transport validation;

real PostgreSQL profile lifecycle proof;

owner-isolation and authentication security proof.
```

## P2-M07 Architecture Boundary

Canonical ownership is:

```text
Identity & Access Platform
    owns Actor identity
    owns authentication
    owns Session lifecycle
    validates authenticated Sessions

User Platform
    owns User
    owns User.displayName
    owns display-name policy
    owns profile read/update behavior

API Application
    owns HTTP transport
    owns Session-cookie composition
    derives actorId from the authenticated Session
    composes Identity & Access with the User Platform
```

The canonical authenticated profile flow is:

```text
Session cookie
    ↓
requireSessionToken
    ↓
ValidateSession
    ↓
authenticated actorId
    ↓
User Platform
    ↓
User lookup/update by actorId
```

Profile ownership is never selected by the HTTP client.

The profile API does not accept:

```text
actorId

userId
```

as ownership inputs.

## P2-M07 Persistence

P2-M07 extends the existing User model rather than introducing a separate UserProfile table.

The User persistence model now contains:

```text
id

actorId

displayName

createdAt

updatedAt
```

`displayName` is nullable.

Canonical meaning:

```text
null
    =
display name not configured
```

Newly registered Users begin with:

```text
displayName = null
```

P2-M07 added the committed migration:

```text
20260811110742_user_profile_baseline
```

Canonical migration history after P2-M07:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential

20260810123113_actor_session_baseline

20260811061735_actor_email_verification_baseline

20260811090103_actor_password_recovery_baseline

20260811110742_user_profile_baseline
```

Canonical migration count:

```text
6
```

## P2-M07 Display-Name Policy

The canonical display-name policy is:

```text
null
    ↓
clear display name

string
    ↓
trim leading/trailing whitespace
    ↓
normalize to NFC
    ↓
count Unicode code points
    ↓
require 1–80 characters
    ↓
persist canonical value
```

Internal whitespace is preserved.

P2-M07 does not silently truncate display names.

Whitespace-only display names are invalid.

Display names longer than 80 Unicode code points are invalid.

## P2-M07 User Platform Contracts

The User Platform exposes:

```text
UserProfileReader

UserProfileWriter

GetUserProfile

UpdateUserProfile
```

The User Platform receives trusted:

```text
actorId
```

from its composing application.

It does not depend on:

```text
Session cookies

Session tokens

NestJS

HTTP transport
```

for profile semantics.

## P2-M07 API

P2-M07 exposes:

```text
GET /user-profile

PATCH /user-profile
```

Both endpoints require an authenticated Session.

Successful responses expose:

```text
userId

displayName
```

PATCH accepts only:

```text
displayName
```

with either a string value or explicit null.

Unexpected ownership fields including `actorId` and `userId` are rejected by strict transport validation.

## P2-M07 Ownership and Security Proof

PostgreSQL and API integration prove:

```text
missing Session
    → 401

expired Session
    → 401

revoked Session
    → 401

authenticated Actor
    → reads its own User profile

authenticated Actor
    → updates its own User profile

Actor A Session
    → cannot mutate Actor B User

actorId injection
    → rejected

userId injection
    → rejected

missing User for authenticated Actor
    → canonical 404
```

Profile mutation changes only User-owned profile state.

The proof verifies that profile updates do not mutate:

```text
Actor identity state

ActorEmail state

ActorEmail.verifiedAt

PasswordCredential password hash

Session token digest

Session expiration

Session revocation state
```

## P2-M07 Deferred Profile Scope

The accepted roadmap allowed locale/timezone preferences only if required.

P2-M07 deliberately defers:

```text
locale

timezone
```

because no current consumer requires their semantics yet.

P2-M07 also does not introduce:

```text
avatar

bio

username

handle

social links

followers

public profile pages

media upload

notification preferences

roles or permissions
```

Those concerns remain outside the minimal User Profile milestone.

## P2-M07 Validation Evidence

Final P2-M07 validation:

```text
User profile unit tests                    16 / 16 PASS

User persistence integration tests         6 / 6 PASS

Identity unit tests                        72 / 72 PASS

Identity integration tests                 11 / 11 PASS

API unit/e2e tests                         12 / 12 PASS

API PostgreSQL integration tests           59 / 59 PASS

Repository PostgreSQL integration tests    76 / 76 PASS

Real SMTP → Mailpit integration tests       2 / 2 PASS

Repository lint                            PASS

Repository TypeScript                      PASS

Production build                           10 / 10 PASS

Architecture validation                    PASS

Git diff validation                        PASS

GitHub Actions CI / Validate               PASS
```

Final architecture result:

```text
231 modules

526 dependencies

0 dependency violations
```

Canonical persistence state:

```text
6 committed migrations

schema up to date
```

Implementation checkpoint:

```text
b560a45 feat(user): complete user profile lifecycle
```

P2-M07 implementation, local validation, PostgreSQL ownership/security validation, Git checkpoint, and remote CI validation are complete.

## P2-M07 Delivery Position

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
CLOSED

P2-M06 — Recovery
CLOSED

P2-M07 — User Profile
CLOSED

P2-M08 — Roles and Permissions
CLOSED

P2-M09 — Owner-Side Authorization
CLOSED

P2-M10 — Session Security UX
NEXT

Phase 2 — Identity Platform
ACTIVE
```

---

# 81. Phase 2 Milestone P2-M08 — Roles and Permissions

P2-M08 implemented the minimal Identity-owned Roles and Permissions baseline required to support later owner-side Authorization without introducing a speculative policy engine.

Milestone status:

```text
P2-M08 — Roles and Permissions
CLOSED
```

Implemented scope:

```text
Identity-owned Role persistence;

Identity-owned Permission persistence;

Actor-to-Role assignment persistence;

Role-to-Permission grant persistence;

Role and Permission public Contracts;

RoleAssignmentWriter Contract;

PermissionEvaluationReader Contract;

AssignRoleToActor use case;

EvaluatePermission use case;

PrismaAuthorizationRepository;

idempotent Role assignment;

default-deny Permission evaluation;

multi-Role any-grant evaluation;

API Composition Root wiring;

real PostgreSQL persistence proof;

real PostgreSQL authorization behavior proof.
```

## P2-M08 Architecture Boundary

Canonical ownership is:

```text
Identity & Access Platform
    owns Role
    owns Permission
    owns Actor-to-Role assignment
    owns Role-to-Permission grants
    owns Permission evaluation semantics

Actor
    is the authorization subject

User Platform
    does not own Roles
    does not own Permissions
    does not evaluate authorization

API Application
    owns runtime composition
    exposes no P2-M08 authorization-management HTTP API
```

The canonical authorization relationship is:

```text
Actor
    ↓
ActorRole
    ↓
Role
    ↓
RolePermission
    ↓
Permission
```

P2-M08 establishes authorization facts.

P2-M09 remains responsible for enforcing those facts inside trusted owner-side business operations.

## P2-M08 Persistence

P2-M08 adds four Identity-owned persistence models:

```text
Role

Permission

ActorRole

RolePermission
```

Canonical tables are:

```text
identity_roles

identity_permissions

identity_actor_roles

identity_role_permissions
```

Role uses a unique `key`.

Permission uses a unique `key`.

ActorRole uses the composite identity:

```text
actorId + roleId
```

RolePermission uses the composite identity:

```text
roleId + permissionId
```

The authorization foreign-key rules are:

```text
Actor deletion
    → cascades ActorRole assignments

Role deletion
    → cascades ActorRole assignments
    → cascades RolePermission grants

Permission deletion
    → cascades RolePermission grants
```

Unrelated Actor, Role, and Permission rows remain intact.

P2-M08 added the committed migration:

```text
20260811132518_identity_authorization_baseline
```

Canonical migration history after P2-M08:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential

20260810123113_actor_session_baseline

20260811061735_actor_email_verification_baseline

20260811090103_actor_password_recovery_baseline

20260811110742_user_profile_baseline

20260811132518_identity_authorization_baseline
```

Canonical migration count:

```text
7
```

## P2-M08 Role Baseline

P2-M08 does not require an explicit persisted ordinary-User Role.

The baseline is:

```text
ordinary authenticated Actor
    → no elevated Role required
```

Registration remains unchanged and continues to create:

```text
Actor

ActorEmail

PasswordCredential

User
```

No default Role is assigned during registration.

P2-M08 also does not add canonical Role or Permission seed data to the Database Foundation.

Role and Permission definitions remain Identity-owned and demand-driven by real protected capabilities.

## P2-M08 Role Assignment

Role assignment is exposed through:

```text
AssignRoleToActor
```

Input:

```text
actorId

roleKey
```

Assignment semantics are:

```text
new assignment
    → success

existing assignment
    → successful idempotent no-op

missing Actor
    → canonical Actor not-found failure

missing Role
    → canonical Role not-found failure
```

Duplicate Actor-to-Role assignment is prevented by persistence identity.

## P2-M08 Permission Evaluation

Permission evaluation is exposed through:

```text
EvaluatePermission
```

Input:

```text
actorId

permissionKey
```

Result:

```text
allowed
    true | false
```

The canonical rule is:

```text
any assigned Role grants the requested Permission
    → allowed = true

otherwise
    → allowed = false
```

Default-deny behavior includes:

```text
unknown Actor
    → false

Actor with no Role
    → false

unknown Permission
    → false

assigned Role without the Permission
    → false

Permission granted only through an unrelated Role
    → false

another Actor's grant
    → does not leak
```

Permission evaluation deliberately does not throw a `forbidden` error.

P2-M09 will translate denied authorization facts into owner-side operation denial where required.

## P2-M08 Public Contracts and Infrastructure

P2-M08 exposes:

```text
Role

Permission

RoleAssignmentWriter

PermissionEvaluationReader

AssignRoleToActor

EvaluatePermission
```

Concrete PostgreSQL behavior is provided by:

```text
PrismaAuthorizationRepository
```

The API Composition Root wires `AssignRoleToActor` and `EvaluatePermission` against the real Prisma repository.

P2-M08 does not expose:

```text
Role-management HTTP endpoints

Permission-management HTTP endpoints

Role-assignment HTTP endpoints
```

because no accepted consumer requires those transports yet.

## P2-M08 PostgreSQL Persistence Proof

Persistence integration tests prove:

```text
Role persistence;

Role key uniqueness;

Permission persistence;

Permission key uniqueness;

ActorRole persistence;

duplicate ActorRole rejection;

RolePermission persistence;

duplicate RolePermission rejection;

missing Actor foreign-key rejection;

missing Role foreign-key rejection;

missing Permission foreign-key rejection;

Actor deletion cascade;

Role deletion cascade;

Permission deletion cascade;

unrelated authorization state preservation.
```

## P2-M08 PostgreSQL Authorization Behavior Proof

Production-path PostgreSQL integration tests prove:

```text
Role assignment through AssignRoleToActor;

PrismaAuthorizationRepository assignment persistence;

repeated Role assignment is idempotent;

missing Actor produces canonical not-found behavior;

missing Role produces canonical not-found behavior;

matching Role Permission grants access;

Actor with no Role is denied;

Role without Permission is denied;

unknown Permission is denied;

unknown Actor is denied without exposing existence;

unrelated Role grant does not authorize;

multiple assigned Roles allow when any Role grants;

another Actor's Permission grant does not leak.
```

The real evaluation path is:

```text
EvaluatePermission
    ↓
PermissionEvaluationReader
    ↓
PrismaAuthorizationRepository
    ↓
ActorRole
    ↓
Role
    ↓
RolePermission
    ↓
Permission
    ↓
PostgreSQL
```

## P2-M08 Deferred Authorization Scope

P2-M08 deliberately does not introduce:

```text
ABAC

Policy engine

OPA

Casbin

role hierarchy

direct Actor Permissions

explicit deny rules

dynamic authorization expressions

Universe-scoped Role assignments

Universe-scoped Permission grants

authorization cache

Redis

external authorization service

admin Role UI

Permission-management UI

frontend-only authorization

Audit pull-forward
```

Universe-scoped Authorization remains architecturally permitted and should be introduced only when a real consumer requires its semantics.

## P2-M08 Validation Evidence

Final P2-M08 validation:

```text
Format check                              PASS

Lint                                      9 / 9 PASS

TypeScript                                17 / 17 PASS

Identity unit tests                       78 / 78 PASS

Identity integration tests                38 / 38 PASS

User integration tests                     6 / 6 PASS

API unit/e2e tests                        12 / 12 PASS

API PostgreSQL integration tests          59 / 59 PASS

Repository PostgreSQL integration tests  103 / 103 PASS

Real SMTP → Mailpit integration tests       2 / 2 PASS

Production build                          10 / 10 PASS

Architecture validation                   PASS

Prisma schema validation                  PASS

Canonical migration status                PASS

Git diff validation                       PASS

GitHub Actions CI / Validate              PASS
```

Final architecture result:

```text
245 modules

556 dependencies

0 dependency violations
```

Canonical persistence state:

```text
7 committed migrations

schema up to date
```

Implementation checkpoint:

```text
7f8cfb3 feat(identity): complete roles and permissions baseline
```

P2-M08 implementation, local validation, PostgreSQL persistence/authorization validation, architecture validation, Git checkpoint, and remote CI validation are complete.

## P2-M08 Delivery Position

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
CLOSED

P2-M06 — Recovery
CLOSED

P2-M07 — User Profile
CLOSED

P2-M08 — Roles and Permissions
CLOSED

P2-M09 — Owner-Side Authorization
CLOSED

P2-M10 — Session Security UX
NEXT

Phase 2 — Identity Platform
ACTIVE
```

---

# 82. Authorization Initial Scope

Start with enough Authorization to support:

```text
ordinary User;

Creator/Editor;

Administrator
```

or similarly justified roles.

Do not design every future role upfront.

---

# 83. Universe-Scoped Authorization

Architecture should permit Universe scope.

Implement only what upcoming Knowledge proof requires.

---

# 84. Phase 2 Milestone P2-M09 — Owner-Side Authorization

P2-M09 implemented the first complete owner-side Authorization enforcement proof inside the trusted Identity & Access backend boundary.

Milestone status:

```text
P2-M09 — Owner-Side Authorization
CLOSED
```

Implemented scope:

```text
canonical Administrator Role baseline;

canonical authorization-management Permission baseline;

Administrator → authorization-management grant;

Identity-owned authorization policy constants;

owner-side protected Role-assignment use case;

forbidden ApplicationError semantics;

Session-derived acting Actor identity;

strict authorization HTTP request validation;

protected Role-assignment API;

deny-before-target-lookup/mutation behavior;

unauthorized target/Role existence non-disclosure;

authorized Role assignment;

idempotent repeated assignment;

real PostgreSQL authorization proof;

full API authorization/security proof.
```

## P2-M09 Architecture Boundary

Canonical ownership remains:

```text
Identity & Access Platform
    owns Role
    owns Permission
    owns Actor-to-Role assignment
    owns Role-to-Permission grants
    owns Permission evaluation
    owns protected authorization-management behavior

Actor
    is the authorization subject

API Application
    owns HTTP transport
    owns Session-cookie composition
    derives actingActorId from the validated Session
    never trusts actingActorId from the request body

Database Foundation
    owns Prisma migration mechanics
    does not own Identity authorization semantics
```

The protected execution path is:

```text
Session cookie
    ↓
requireSessionToken
    ↓
ValidateSession
    ↓
authenticated session.actorId
    ↓
strict transport validation
    ↓
AssignRoleToActorAsActor
    ↓
EvaluatePermission
    ↓
identity.authorization.manage
    ↓
allowed?
```

Denied authorization stops before target Actor or target Role lookup and before ActorRole mutation.

Allowed authorization proceeds to the existing owner mutation:

```text
AssignRoleToActor
    ↓
targetActorId + roleKey
    ↓
PrismaAuthorizationRepository
    ↓
PostgreSQL
```

Frontend authorization checks are not trusted as the enforcement boundary.

## P2-M09 Canonical Privileged Baseline

P2-M09 introduces the first real canonical privileged vocabulary because a real protected operation now consumes it.

Canonical Role:

```text
administrator
```

Canonical Permission:

```text
identity.authorization.manage
```

Canonical grant:

```text
administrator
    ↓
identity.authorization.manage
```

Identity exports the policy constants:

```text
ADMINISTRATOR_ROLE_KEY

IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY
```

P2-M09 does not create a canonical Creator/Editor Role yet.

Creator/editor authorization remains demand-driven by the first real creator-owned Knowledge mutation.

## P2-M09 Canonical Authorization Data Migration

P2-M09 added the committed data migration:

```text
20260811144700_identity_authorization_administrator_baseline
```

The migration creates or normalizes:

```text
administrator Role

identity.authorization.manage Permission

Administrator → Permission grant
```

It does not assign the Administrator Role to any Actor.

No registered Actor becomes Administrator automatically.

Registration remains unchanged and still creates:

```text
Actor

ActorEmail

PasswordCredential

User
```

without assigning a default Role.

The generic Database Foundation seed remains free of canonical Identity business semantics.

Canonical migration history after P2-M09:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential

20260810123113_actor_session_baseline

20260811061735_actor_email_verification_baseline

20260811090103_actor_password_recovery_baseline

20260811110742_user_profile_baseline

20260811132518_identity_authorization_baseline

20260811144700_identity_authorization_administrator_baseline
```

Canonical migration count:

```text
8
```

P2-M09 does not require a Prisma schema change beyond the P2-M08 authorization schema.

## P2-M09 Owner-Side Protected Use Case

The protected use case is:

```text
AssignRoleToActorAsActor
```

Input:

```text
actingActorId

targetActorId

roleKey
```

`actingActorId` is trusted application input derived from the authenticated Session.

The client does not select the acting Actor.

The use case first evaluates:

```text
actingActorId
+
identity.authorization.manage
```

through:

```text
EvaluatePermission
```

If authorization is denied:

```text
ApplicationError

code
identity.authorization.forbidden

kind
forbidden

public message
You do not have permission to perform this action.
```

No target Actor lookup occurs.

No target Role lookup occurs.

No ActorRole mutation occurs.

If authorization is allowed:

```text
AssignRoleToActor
```

performs the existing Role-assignment behavior.

Existing target failures remain canonical after authorization succeeds:

```text
missing target Actor
    → identity.authorization.actor_not_found

missing Role
    → identity.authorization.role_not_found
```

Repeated authorized Role assignment remains an idempotent success.

## P2-M09 Information-Disclosure Boundary

P2-M09 proves that an authenticated but unauthorized Actor cannot use the protected operation to probe authorization-management state.

For a structurally valid request:

```text
unauthorized Actor + existing target
    → forbidden

unauthorized Actor + missing target
    → forbidden

unauthorized Actor + missing Role
    → forbidden
```

Therefore target Actor and Role existence are not disclosed to an unauthorized caller through this operation.

Authorization failure occurs before target persistence lookup.

## P2-M09 Authorization API

The API Application exposes:

```text
POST /authorization/role-assignments
```

The request body accepts only:

```text
targetActorId

roleKey
```

`targetActorId` must be a UUID.

`roleKey` must satisfy the accepted Role-key transport bounds.

The request schema is strict.

Unexpected fields are rejected.

The endpoint never accepts:

```text
actingActorId
```

as a trusted ownership/authorization input.

The acting Actor is always derived through:

```text
Session cookie
    ↓
ValidateSession
    ↓
session.actorId
```

Successful assignment returns:

```text
HTTP 204
```

Repeated successful assignment also returns:

```text
HTTP 204
```

## P2-M09 Authentication and Authorization Failures

Authentication remains distinct from Authorization.

Missing Session:

```text
HTTP 401

identity.session.invalid

Authentication is required.
```

Revoked Session:

```text
HTTP 401

identity.session.invalid

Authentication is required.
```

Expired Session:

```text
HTTP 401

identity.session.invalid

Authentication is required.
```

Authenticated Actor without the required Permission:

```text
HTTP 403

identity.authorization.forbidden

You do not have permission to perform this action.
```

Authorized missing target Actor:

```text
HTTP 404

identity.authorization.actor_not_found

Actor not found.
```

Authorized missing Role:

```text
HTTP 404

identity.authorization.role_not_found

Role not found.
```

Invalid authorization request transport:

```text
HTTP 400

identity.authorization.invalid_request

The authorization request is invalid.
```

## P2-M09 PostgreSQL Authorization Baseline Proof

Identity integration tests prove:

```text
canonical Administrator Role exists;

canonical identity.authorization.manage Permission exists;

Administrator Role grants identity.authorization.manage.
```

The canonical baseline integration proof is:

```text
3 / 3 PASS
```

The complete Identity integration suite after P2-M09 is:

```text
41 / 41 PASS
```

## P2-M09 Owner-Side Unit Security Proof

Owner-side unit tests prove:

```text
authorized acting Actor reaches Role assignment;

required Permission key is evaluated;

unauthorized acting Actor receives forbidden;

denied authorization performs no Role assignment;

missing target Actor is not exposed to unauthorized Actor;

authorized missing target preserves canonical Actor not-found failure;

authorized missing Role preserves canonical Role not-found failure.
```

P2-M09 added:

```text
5 / 5
```

focused owner-side authorization unit tests.

The complete Identity unit suite after P2-M09 is:

```text
83 / 83 PASS
```

## P2-M09 API and PostgreSQL Security Proof

The production-path API integration proof exercises:

```text
HTTP
    ↓
Session cookie
    ↓
ValidateSession
    ↓
Session-derived acting Actor
    ↓
AuthorizationController
    ↓
AssignRoleToActorAsActor
    ↓
EvaluatePermission
    ↓
PrismaAuthorizationRepository
    ↓
PostgreSQL
```

The focused Authorization API/PostgreSQL suite proves:

```text
missing Session → 401 and no mutation;

ordinary authenticated Actor → 403 and no mutation;

missing target Actor is hidden from unauthorized Actor;

missing Role is hidden from unauthorized Actor;

actingActorId body injection is rejected;

malformed target Actor identifier is rejected before persistence;

Administrator can assign the Administrator Role;

ActorRole persistence is verified directly;

repeated authorized assignment is idempotent;

authorized missing target Actor → canonical 404;

authorized missing Role → canonical 404;

revoked Administrator Session → 401 and no mutation;

expired Administrator Session → 401 and no mutation.
```

Focused Authorization API/PostgreSQL result:

```text
12 / 12 PASS
```

Complete API PostgreSQL integration result:

```text
71 / 71 PASS
```

Repository PostgreSQL integration result:

```text
118 / 118 PASS
```

## P2-M09 Deferred Authorization Scope

P2-M09 deliberately does not introduce:

```text
Creator/Editor canonical provisioning;

ordinary-User persisted Role;

direct Actor Permissions;

explicit deny rules;

Role hierarchy;

ABAC;

Policy engine;

OPA;

Casbin;

Universe-scoped Role assignment;

Universe-scoped Permission grant;

authorization cache;

Redis;

external authorization service;

frontend-only authorization;

authorization-management UI;

Administrator UI;

general Permission-management API;

automatic Administrator Actor assignment;

Audit pull-forward.
```

Universe-scoped Authorization remains architecturally permitted.

It should be introduced only when upcoming Knowledge proof establishes real scope semantics.

Administrator bootstrap/provisioning beyond trusted operational assignment remains outside this milestone.

## P2-M09 Validation Evidence

Final P2-M09 validation:

```text
Format check                              PASS

Lint                                      9 / 9 PASS

TypeScript                                17 / 17 PASS

Identity unit tests                       83 / 83 PASS

Identity integration tests                41 / 41 PASS

User integration tests                     6 / 6 PASS

API unit/e2e tests                        12 / 12 PASS

Authorization API PostgreSQL proof        12 / 12 PASS

API PostgreSQL integration tests          71 / 71 PASS

Repository PostgreSQL integration tests  118 / 118 PASS

Real SMTP → Mailpit integration tests       2 / 2 PASS

Production build                          10 / 10 PASS

Architecture validation                   PASS

Prisma schema validation                  PASS

Canonical migration status                PASS

Git diff validation                       PASS

GitHub Actions CI / Validate               PASS
```

Final architecture result:

```text
254 modules

590 dependencies

0 dependency violations
```

Canonical persistence state:

```text
8 committed migrations

schema up to date
```

Implementation checkpoint:

```text
30eeef4 feat(identity): enforce owner-side authorization
```

Roadmap closure checkpoint:

```text
a6e4d98 docs(roadmap): close P2-M09
```

P2-M09 implementation, local validation, PostgreSQL owner-side authorization proof, API security proof, architecture validation, implementation Git checkpoint, and remote CI validation are complete.

## P2-M09 Delivery Position at Milestone Closure

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
CLOSED

P2-M06 — Recovery
CLOSED

P2-M07 — User Profile
CLOSED

P2-M08 — Roles and Permissions
CLOSED

P2-M09 — Owner-Side Authorization
CLOSED

P2-M10 — Session Security UX
NEXT

Phase 2 — Identity Platform
ACTIVE
```

This block records the historical delivery position at P2-M09 closure. The current delivery position is maintained in Sections 23A, 398, and 410.

---

# 85. Phase 2 Milestone P2-M10 — Session Security UX

P2-M10 implemented the first complete first-party browser Identity experience for AI World while preserving the server-managed opaque Session security model established by P2-M04.

Milestone status:

```text
P2-M10 — Session Security UX
CLOSED
```

Implemented scope:

```text
same-origin Web → API integration;

typed Web API boundary;

browser Session state;

registration UX;

password sign-in UX;

authenticated Session UX;

logout UX;

basic account/profile UX;

email-verification request UX;

email-verification confirmation UX;

password-recovery request UX;

password-reset UX;

401 → signed-out behavior;

real browser Session-security proof;

real browser registration/sign-in/profile/logout proof;

CI-backed PostgreSQL browser E2E proof.
```

## P2-M10 Architectural Boundary

The first-party Web uses:

```text
Browser
    ↓
Next.js Web
    ↓
same-origin /api/*
    ↓
Next.js rewrite
    ↓
NestJS API
```

The browser does not call the Nest API through a separately configured cross-origin frontend transport.

The canonical Web API origin strategy is:

```text
browser request
/api/*

    ↓

Next.js rewrite

    ↓

AI_WORLD_API_ORIGIN

default local API origin
http://127.0.0.1:3001
```

P2-M10 therefore does not introduce a general CORS policy solely for first-party browser Identity traffic.

The Web runtime may configure:

```text
AI_WORLD_API_ORIGIN
```

as a server-side deployment configuration value.

The value must represent an origin and may not contain:

```text
path

query

fragment.
```

## P2-M10 Session Security Model

P2-M10 continues using the P2-M04 server-managed opaque Session model.

The first-party Session cookie remains:

```text
ai_world_session
```

The browser Session secret remains:

```text
HttpOnly cookie only
```

The Web does not introduce:

```text
JWT browser Sessions;

access-token localStorage;

refresh-token localStorage;

Session token sessionStorage;

client-managed Session token persistence.
```

The Web determines authentication state through:

```text
GET /session
```

rather than trusting a client-submitted Actor identifier.

The canonical authenticated browser state is derived from:

```text
Session cookie
    ↓
GET /session
    ↓
validated server Session
    ↓
actorId + expiresAt
```

The browser does not treat the `actorId` returned from password authentication as authoritative Session state.

After successful password sign-in, the Web refreshes:

```text
GET /session
```

and derives authenticated state from the server Session.

## P2-M10 Typed Web API Boundary

P2-M10 introduced a typed Web API client boundary.

The client:

```text
uses same-origin /api requests;

includes browser credentials using same-origin semantics;

translates canonical API error payloads;

preserves status/code/message;

treats requestId as optional;

does not expose transport internals as application state.
```

Unexpected API failures are converted into a safe Web error rather than exposing provider or infrastructure detail.

The Web Session API exposes:

```text
getCurrentSession

logout
```

Session state is represented through:

```text
loading

anonymous

authenticated

error
```

A canonical API:

```text
HTTP 401
```

during Session lookup maps to:

```text
anonymous
```

rather than becoming an ordinary fatal application error.

## P2-M10 Registration UX

The Web exposes:

```text
/register
```

Registration accepts:

```text
email

password
```

through the existing API:

```text
POST /registration
```

Successful registration presents an account-created state and directs the User to sign in.

P2-M10 does not automatically establish a Session after registration.

Registration response identifiers are not used as browser authentication authority.

The Web does not display or persist internal Identity identifiers merely because the registration API returned them.

## P2-M10 Password Sign-In UX

The Web exposes:

```text
/sign-in
```

Password sign-in uses:

```text
POST /authentication/password
```

The API establishes the Session through the existing secure Session cookie.

After successful authentication, the Web performs:

```text
GET /session
```

to establish canonical authenticated browser state.

The password-authentication response `actorId` is not treated as ownership authority.

Invalid credential failures remain safe and do not expose:

```text
whether the email exists;

Credential identifiers;

password hash;

Session token.
```

The sign-in experience links to:

```text
/forgot-password
```

for password recovery.

## P2-M10 Account and Profile UX

The Web exposes:

```text
/account
```

Authenticated account behavior uses:

```text
GET /user-profile

PATCH /user-profile
```

Profile ownership is derived exclusively from the authenticated server Session.

The profile mutation request accepts only:

```text
displayName
```

The browser does not submit:

```text
actorId

userId
```

as profile ownership authority.

Canonical profile update payload:

```json
{
  "displayName": "..."
}
```

or:

```json
{
  "displayName": null
}
```

The Web uses the canonical User Profile returned by the API after mutation.

A profile API:

```text
HTTP 401
```

causes the Web to revalidate the Session.

If Session validation also returns:

```text
HTTP 401
```

the application transitions to:

```text
signed out
```

rather than preserving stale authenticated state.

## P2-M10 Logout UX

Logout uses:

```text
DELETE /session
```

Successful logout:

```text
revokes the server Session when present;

clears the browser Session cookie;

transitions Web Session state to anonymous.
```

The Web does not merely hide authenticated UI while leaving the server Session active.

After logout:

```text
GET /session
    → HTTP 401
```

and a browser reload remains signed out.

## P2-M10 Email Verification UX

The Web exposes:

```text
/verify-email
```

Authenticated verification issuance uses:

```text
POST /email-verification/request
```

The request does not submit:

```text
actorId

email

ownership identifiers
```

because the Actor is derived from the authenticated Session.

Verification confirmation uses:

```text
POST /email-verification/confirm
```

with:

```json
{
  "token": "..."
}
```

Confirmation remains public and possession-based according to the P2-M05 verification model.

P2-M10 does not redefine verification as a prerequisite for password sign-in.

## P2-M10 Password Recovery UX

The Web exposes:

```text
/forgot-password
```

Recovery request uses:

```text
POST /password-recovery/request
```

with:

```json
{
  "email": "..."
}
```

The browser presents enumeration-safe completion behavior.

The User-facing success state does not disclose whether:

```text
the email exists;

the Actor exists;

the email has a PasswordCredential.
```

The Web also exposes:

```text
/reset-password
```

Password reset uses:

```text
POST /password-recovery/reset
```

with:

```text
token

replacement password
```

A successful reset invokes Session revalidation because P2-M06 revokes every existing Session for the Actor.

The expected successful state is therefore:

```text
password reset succeeds
    ↓
existing Sessions revoked
    ↓
GET /session returns 401
    ↓
Web becomes anonymous
    ↓
User signs in using the replacement password
```

P2-M10 does not create a replacement Session automatically after Recovery.

## P2-M10 Real Browser Security Proof

P2-M10 added a real Chromium browser security flow through:

```text
Playwright
```

The real browser path exercises:

```text
Next.js Web

    ↓

same-origin /api rewrite

    ↓

NestJS API

    ↓

Identity & Access / User Platform

    ↓

Prisma

    ↓

real PostgreSQL
```

The browser security test proves:

```text
registration through the real Web succeeds;

password sign-in through the real Web succeeds;

ai_world_session cookie is created;

Session cookie contains an opaque non-empty secret;

Session cookie is HttpOnly;

Session cookie uses SameSite=Lax;

Session cookie Path is /;

Session cookie is not Secure in local/test HTTP;

document.cookie cannot read the Session secret;

localStorage does not contain the Session secret;

sessionStorage does not contain the Session secret;

browser reload preserves authenticated Session state;

GET /api/session succeeds through the Next.js same-origin proxy;

account/profile operation succeeds through the authenticated Session;

profile PATCH contains displayName only;

profile PATCH does not contain actorId;

profile PATCH does not contain userId;

logout removes the browser Session cookie;

post-logout GET /api/session returns 401;

browser reload remains signed out.
```

This test proves the browser Session mechanism without introducing a client-readable authentication token.

## P2-M10 Browser E2E Environment

Playwright owns local Web/API orchestration for the browser proof.

The local test topology is:

```text
PostgreSQL
127.0.0.1:55432

NestJS API
127.0.0.1:3001

Next.js Web
127.0.0.1:3100
```

Playwright starts:

```text
API
pnpm run start

Web
pnpm run dev:e2e
```

API readiness uses:

```text
GET /session
```

An unauthenticated:

```text
HTTP 401
```

is considered valid API readiness because the Session endpoint exists and the API is serving requests.

P2-M10 deliberately does not add a new `/health` endpoint merely for Playwright because the current API does not expose that route in this runtime baseline.

## P2-M10 CI Browser Database Correction

The first remote browser validation exposed a CI-environment configuration gap.

GitHub Actions already provided:

```text
PostgreSQL
127.0.0.1:5432

DATABASE_URL
postgresql://ai_world:ai_world@127.0.0.1:5432/ai_world
```

and applied all committed migrations before E2E execution.

However the root Turborepo:

```text
test:e2e
```

task did not pass `DATABASE_URL` through to the Web E2E task.

As a result the Playwright configuration fell back to the local development database URL:

```text
127.0.0.1:55432
```

inside GitHub Actions.

Real browser registration therefore correctly exposed:

```text
Prisma P1001
DatabaseNotReachable
```

rather than producing a false-positive E2E success.

The final CI correction declares:

```text
test:e2e
    passThroughEnv
        DATABASE_URL
```

in the root Turborepo configuration.

Playwright also fails fast when:

```text
CI=true

and

DATABASE_URL is missing
```

instead of silently falling back to the developer-local PostgreSQL port.

After this correction:

```text
GitHub Actions PostgreSQL
    ↓
DATABASE_URL :5432
    ↓
Turborepo test:e2e
    ↓
Playwright
    ↓
NestJS API
    ↓
Prisma
    ↓
real CI PostgreSQL
```

was validated successfully.

## P2-M10 Persistence Boundary

P2-M10 introduces:

```text
NO new Prisma model

NO new table

NO new column

NO new database migration
```

Canonical migration count remains:

```text
8
```

The Phase 2 persistence baseline therefore remains:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential

20260810123113_actor_session_baseline

20260811061735_actor_email_verification_baseline

20260811090103_actor_password_recovery_baseline

20260811110742_user_profile_baseline

20260811132518_identity_authorization_baseline

20260811144700_identity_authorization_administrator_baseline
```

Database schema status at Phase 2 closure:

```text
8 migrations found

Database schema is up to date
```

## P2-M10 Authorization Boundary

P2-M10 does not introduce:

```text
new Role;

new Permission;

new authorization-management operation;

frontend authorization authority.
```

P2-M09 remains the canonical owner-side authorization enforcement baseline.

The browser does not become a security enforcement boundary.

Authenticated and authorized backend behavior remains authoritative.

## P2-M10 Deferred Scope

P2-M10 deliberately does not introduce:

```text
JWT browser Sessions;

refresh tokens;

localStorage authentication;

Session-management dashboard;

device Session management;

Session activity history;

remember-me policy;

multi-factor authentication;

rate limiting;

account lockout;

new Role;

new Permission;

new Session persistence model;

Redis;

distributed Session storage;

cross-site browser deployment policy;

generalized CSRF framework without deployment evidence;

Administrator UI;

authorization-management UI;

Audit pull-forward.
```

These capabilities remain demand-driven.

## P2-M10 Validation Evidence

Final local and remote P2-M10 validation:

```text
Node.js                                  24.18.1

pnpm                                     10.17.1

Format check                             PASS

Lint                                      9 / 9 PASS

TypeScript                               17 / 17 PASS

Identity unit tests                      83 / 83 PASS

API unit/e2e tests                       12 / 12 PASS

Web Vitest tests                         20 / 20 PASS

Root normal test tasks                   13 / 13 PASS

Identity PostgreSQL integration          41 / 41 PASS

User PostgreSQL integration               6 / 6 PASS

API PostgreSQL integration               71 / 71 PASS

Repository PostgreSQL integration       118 / 118 PASS

Real SMTP → Mailpit integration           2 / 2 PASS

Real Chromium browser E2E                 2 / 2 PASS

Prisma schema validation                 PASS

Canonical migration status               8 migrations / schema up to date

Production build                         10 / 10 PASS

Architecture validation                 281 modules
                                        664 dependencies
                                          0 violations

Git diff validation                      PASS

GitHub Actions CI / Validate             PASS
```

The final browser E2E proof includes:

```text
Web browser baseline
PASS

Real browser Session security
PASS
```

The remote CI correction was also validated through the root:

```text
pnpm run test:e2e
```

Turborepo path with real GitHub Actions PostgreSQL.

## P2-M10 Implementation Checkpoints

P2-M10 implementation was delivered through two intentional implementation commits:

```text
9c6ab56 feat(web): complete session security ux

05778dd fix(ci): pass database url to web e2e
```

The first commit delivered the browser Session Security UX and real Playwright security proof.

The second commit corrected the CI E2E environment boundary by passing the CI PostgreSQL `DATABASE_URL` through Turborepo and making missing CI database configuration fail fast.

Both implementation checkpoints passed remote GitHub Actions CI / Validate before Phase 2 documentation closure.

## P2-M10 Closure

P2-M10 is complete.

The milestone proves:

```text
first-party Web registration;

password sign-in;

server-derived authenticated Session state;

secure HttpOnly opaque Session transport;

logout;

basic account/profile;

email verification UX;

password recovery/reset UX;

401 → signed-out behavior;

real browser security properties;

real browser ownership boundaries;

real PostgreSQL E2E behavior;

CI-backed browser integration.
```

Final Phase 2 milestone position:

```text
P2-M01 — Actor and User Baseline
CLOSED

P2-M02 — Registration
CLOSED

P2-M03 — Password Authentication
CLOSED

P2-M04 — Session Management
CLOSED

P2-M05 — Email Verification
CLOSED

P2-M06 — Recovery
CLOSED

P2-M07 — User Profile
CLOSED

P2-M08 — Roles and Permissions
CLOSED

P2-M09 — Owner-Side Authorization
CLOSED

P2-M10 — Session Security UX
CLOSED

Phase 2 — Identity Platform
COMPLETE
```

P2-M10 closes the final planned Phase 2 milestone.

The next implementation phase is:

```text
Phase 3 — Platform Kernel Baseline
```

---

# 86. Phase 2 Audit

Security-sensitive actions should begin using:

```text
Audit
```

if the Kernel Audit baseline is introduced here.

If Audit requires Phase 3 extraction, do not duplicate temporary audit systems.

---

# 87. Kernel Pull-Forward Rule

Phase 2 may implement a Phase 3 Kernel capability early if Identity genuinely requires it.

Likely candidates:

```text
Identifiers;

Namespace;

Audit.
```

If pulled forward, ownership remains Kernel.

---

# 88. Phase 2 Testing

Required emphasis:

```text
registration;

login;

logout;

Session revocation;

verification;

recovery;

authorization;

password security;

invalid token behavior.
```

---

# 89. Phase 2 Closure Criteria

Phase 2 closes when:

```text
User can register;

User can verify required identity;

User can authenticate;

Session is securely established;

User can logout;

Session can be revoked;

recovery works;

User Profile exists separately from security identity;

Roles/Permissions work;

protected operations prove owner-side Authorization;

security-sensitive tests pass.
```

All accepted Phase 2 closure criteria are satisfied.

Closure evidence includes:

```text
registration
    implemented and PostgreSQL-tested

email verification
    implemented with real SMTP → Mailpit proof

password authentication
    implemented with Argon2id and anti-enumeration behavior

Session establishment
    implemented through opaque server-side Sessions

Session browser security
    implemented through HttpOnly SameSite=Lax cookie transport

logout
    implemented with server revocation + cookie clearing

Session revocation
    implemented directly and through Recovery reset

password recovery
    implemented with single-use digest-only token lifecycle

User Profile
    implemented in the User Platform separately from Actor security identity

Roles and Permissions
    implemented and PostgreSQL-proven

owner-side Authorization
    implemented and API/PostgreSQL-proven

first-party Web Identity UX
    implemented across registration, sign-in, account/profile,
    verification, recovery, reset, and logout

real browser security proof
    implemented with Playwright

CI browser/database proof
    implemented with GitHub Actions PostgreSQL

full repository validation
    passed

remote CI / Validate
    passed
```

Phase 2 therefore closes without pulling forward speculative:

```text
Redis

distributed Session infrastructure

JWT browser Sessions

Policy engines

ABAC

Universe-scoped authorization

Creator/Editor canonical provisioning

Audit infrastructure

MFA
```

---

# 90. Phase 2 Exit Outcome

AI World gains:

```text
ONE SHARED IDENTITY PLATFORM.
```

All future Universes reuse it.

Final Phase 2 state:

```text
PHASE 2 — IDENTITY PLATFORM
COMPLETE

MILESTONES
10 / 10 CLOSED

CANONICAL MIGRATIONS
8

FINAL ARCHITECTURE
281 modules
664 dependencies
0 violations

REPOSITORY POSTGRESQL INTEGRATION
118 / 118 PASS

REAL SMTP → MAILPIT
2 / 2 PASS

REAL CHROMIUM BROWSER E2E
2 / 2 PASS

PRODUCTION BUILD
10 / 10 PASS

GITHUB ACTIONS CI / VALIDATE
PASS
```

Next:

```text
Phase 3 — Platform Kernel Baseline.
```

Phase 3 must implement only the universal semantic capabilities required by real upcoming consumers.

---
# 91. Phase 3 — Platform Kernel Baseline

Purpose:

> **Implement only the universal semantic capabilities required by upcoming Knowledge and cross-Platform work.**

---

# 92. Phase 3 Is Not Full Kernel

Do not implement every documented Kernel capability.

Initial likely scope:

```text
Identifiers

Namespace

Events

Audit

Taxonomy

Relationships.
```

---

# 93. Conditional Kernel Scope

Potentially defer:

```text
Metadata

Workflow

Policy

Localization

Versioning
```

until consumers demand them.

---

# 94. Phase 3 Milestone P3-M01 — Identifiers

P3-M01 established the first concrete Platform Kernel capability: canonical AI World Resource identifier semantics shared by real Platform consumers.

Milestone status:

```text
P3-M01 — Identifiers
CLOSED
```

Implemented scope:

```text
@ai-world/kernel-identifiers package;

ResourceId semantic type;

canonical Resource identifier generation;

canonical Resource identifier validation;

strict parsing without silent normalization;

Identity & Access consumption through Actor.id;

User Platform consumption through User.id and User.actorId;

unit validation of canonical and invalid identifier forms;

architecture-boundary proof;

full repository regression validation.
```

## P3-M01 Architecture Boundary

Canonical ownership is:

```text
Platform Kernel
    owns ResourceId semantics
    owns canonical generation
    owns canonical validation
    owns canonical parsing rules

Identity & Access Platform
    owns Actor
    consumes ResourceId for Actor.id

User Platform
    owns User
    consumes ResourceId for User.id
    consumes ResourceId for User.actorId

Database Foundation
    owns Prisma/PostgreSQL persistence mechanics
    does not own Resource identifier business semantics
```

The dependency direction is:

```text
Identity & Access ───────┐
                         ├──→ @ai-world/kernel-identifiers
User Platform ───────────┘
```

The Kernel package does not depend upward on:

```text
Platforms

Universes

Applications.
```

Existing dependency-cruiser rules already protected this direction, so P3-M01 required no architecture-rule rewrite.

## P3-M01 Canonical ResourceId Semantics

The canonical baseline is:

```text
semantic name
ResourceId

runtime representation
string

canonical textual representation
lowercase UUID v4

generation
Node.js crypto.randomUUID()

validation
strict canonical lowercase UUID v4

parsing
validate and return the original canonical value

normalization
none

whitespace trimming
none

case conversion
none
```

Invalid input fails rather than being silently transformed into a different identity value.

Examples rejected by the canonical validator include:

```text
uppercase UUID text;

surrounding whitespace;

non-v4 UUID values;

nil UUID;

malformed identifier text;

non-string values.
```

The first implementation deliberately keeps:

```text
ResourceId = string
```

at runtime.

This avoids introducing object wrappers or broad branded-type rewrites without evidence while still establishing one shared semantic vocabulary and one canonical validation/generation contract.

## P3-M01 Persistence and Migration Outcome

The Phase 2 persistence baseline already used one compatible identifier scheme:

```text
Prisma String identifiers

@default(uuid())

PostgreSQL @db.Uuid columns
```

P3-M01 therefore introduces:

```text
NO Prisma model change

NO database table

NO database column

NO database migration

NO identifier format replacement

NO Phase 2 data rewrite.
```

The canonical migration count remains:

```text
8
```

and PostgreSQL remains:

```text
schema up to date.
```

This is an intentional application of the Section 95 migration rule: migrate only when existing Resource identifiers conflict with the finalized canonical semantics. No such conflict exists in the current Identity/User baseline.

## P3-M01 Real Platform Consumers

P3-M01 is not an unused speculative Kernel abstraction.

The first real consumers are:

```text
Identity & Access Platform
    Actor.id: ResourceId

User Platform
    User.id: ResourceId
    User.actorId: ResourceId
```

This proves shared consumption across two existing Platforms before Knowledge begins.

Future capabilities may reuse the same semantic contract for Resource references where appropriate, including potential Knowledge Resources, Audit references, classifications, and Relationships.

P3-M01 does not require every database UUID in AI World to become a canonical ResourceId. Internal persistence identifiers remain capability-owned and should adopt ResourceId semantics only when they represent canonical cross-capability Resource identity.

## P3-M01 Repository Materialization

P3-M01 materialized:

```text
packages/kernel/identifiers/
    package.json
    tsconfig.json
    tsconfig.test.json
    src/index.ts
    src/resource-id.ts
    test/resource-id.spec.ts
```

Canonical package:

```text
@ai-world/kernel-identifiers
```

The package has no third-party runtime dependency.

Node.js type definitions are development-only support for the built-in:

```text
node:crypto
```

identifier generator.

Generated/package-local runtime material remains ignored:

```text
dist/
node_modules/
.turbo/
```

and is not part of the committed Kernel source surface.

## P3-M01 Validation Evidence

Final P3-M01 local and remote validation:

```text
Format check                              PASS

Lint                                      10 / 10 PASS

TypeScript                                19 / 19 PASS

Kernel Identifiers unit tests             11 / 11 PASS

Identity unit tests                       83 / 83 PASS

API unit/e2e tests                        12 / 12 PASS

Web Vitest tests                          20 / 20 PASS

Root normal Turbo tasks                   15 / 15 PASS

Identity PostgreSQL integration           41 / 41 PASS

User PostgreSQL integration                6 / 6 PASS

API PostgreSQL integration                71 / 71 PASS

Repository PostgreSQL integration        118 / 118 PASS

Real Chromium browser E2E                  2 / 2 PASS

Root Turborepo browser E2E                 2 / 2 PASS

Prisma schema validation                  PASS

Canonical migration status                8 migrations / schema up to date

Production build                          11 / 11 PASS

Architecture validation                  286 modules
                                         672 dependencies
                                           0 violations

Generated-output ignore validation        PASS

Git diff validation                       PASS

GitHub Actions CI / Validate              PASS
```

P3-M01 does not change Email/SMTP behavior. The existing Phase 2 real SMTP → Mailpit baseline remains the canonical provider proof for those unchanged capabilities.

## P3-M01 Implementation Checkpoint

Implementation checkpoint:

```text
feat(kernel): establish resource identifier baseline
```

The exact implementation commit hash remains available from Git history and can be added during a later documentation normalization pass. This roadmap update does not invent a hash that was not captured in the closure input.

The implementation checkpoint passed remote GitHub Actions CI / Validate before roadmap closure.

## P3-M01 Closure

P3-M01 is complete.

The milestone proves:

```text
one canonical ResourceId semantic vocabulary;

strict UUID v4 generation/validation semantics;

no unnecessary database migration;

no Phase 2 identifier rewrite;

real reuse by Identity & Access and User Platforms;

Kernel → Platform dependency prohibition remains intact;

full repository regression validation remains green.
```

Phase 3 position at P3-M01 closure:

```text
P3-M01 — Identifiers
CLOSED

P3-M02 — Namespace
NEXT

P3-M03 — Events
PLANNED

P3-M04 — Audit
PLANNED

P3-M05 — Taxonomy
PLANNED

P3-M06 — Relationships
PLANNED

P3-M07 — Architecture Enforcement Expansion
PLANNED

Phase 3 — Platform Kernel Baseline
ACTIVE
```

This block records the historical delivery position at P3-M01 closure. The current delivery position is maintained in Sections 23A, 96, 398, and 410.

---

# 95. Identifier Migration Rule

If Phase 2 Resources were created before generalized Identifiers were finalized, migrate intentionally rather than maintaining multiple unrelated schemes without reason.

P3-M01 applied this rule and found no migration requirement.

The existing Phase 2 canonical Resource persistence already uses:

```text
UUID identifiers

Prisma uuid() generation

PostgreSQL UUID columns
```

which is compatible with the finalized P3-M01 ResourceId baseline.

Therefore:

```text
Actor IDs remain unchanged;

User IDs remain unchanged;

User.actorId references remain unchanged;

all eight committed migrations remain unchanged.
```

Future identifier migration is required only if a real capability introduces incompatible canonical Resource identity semantics.

---

# 96. Phase 3 Milestone P3-M02 — Namespace

P3-M02 established the minimal canonical Namespace semantic required by existing permission vocabulary and future shared semantic consumers.

Milestone status:

```text
P3-M02 — Namespace
CLOSED
```

Implemented scope:

```text
@ai-world/kernel-namespace package;

NamespacedKey semantic type;

canonical lowercase dot-separated key representation;

maximum 128-character total length;

minimum two namespace segments;

strict segment validation;

strict parsing without silent normalization;

Identity Permission integration;

Permission.key NamespacedKey typing;

Permission evaluation Contract integration;

runtime validation of identity.authorization.manage;

unit validation of canonical and invalid key forms;

architecture-boundary proof;

full repository regression validation.
```

## P3-M02 Architecture Boundary

Canonical ownership is:

```text
Platform Kernel
    owns NamespacedKey syntax
    owns NamespacedKey validation
    owns NamespacedKey parsing rules

Identity & Access Platform
    owns Permission meaning
    owns Role meaning
    owns identity.authorization.manage semantics
    consumes NamespacedKey for Permission keys

Database Foundation
    owns Prisma/PostgreSQL persistence mechanics
    does not own Namespace semantics
```

Namespace does not become the owner of:

```text
Permission

Role

Event

Taxonomy

Relationship

Definition
```

It owns only the shared collision-safe key semantic.

The dependency direction is:

```text
Identity & Access
    ↓
@ai-world/kernel-namespace
```

The Kernel package remains independent of:

```text
Platforms

Universes

Applications.
```

## P3-M02 Canonical NamespacedKey Semantics

The canonical baseline is:

```text
semantic name
NamespacedKey

runtime representation
string

maximum total length
128 characters

separator
.

minimum segments
2

segment start
lowercase ASCII letter

remaining segment characters
lowercase ASCII letters
digits
single internal hyphens

normalization
none

whitespace trimming
none

case conversion
none
```

Canonical validation rejects:

```text
unnamespaced local keys;

uppercase text;

leading or trailing whitespace;

empty segments;

leading or trailing dots;

underscores;

segments beginning with a hyphen;

segments ending with a hyphen;

repeated hyphens;

keys longer than 128 characters;

non-string values.
```

Valid examples include:

```text
identity.session

identity.authorization.manage

knowledge.resource.create

knowledge.resource.lifecycle.publish

media.asset.upload
```

The Kernel intentionally does not require exactly three segments.

The first implementation deliberately keeps:

```text
NamespacedKey = string
```

at runtime.

This avoids wrapper-object or branded-type ceremony while still establishing one canonical validation/parsing contract.

## P3-M02 Real Consumer

P3-M02 is not an unused speculative abstraction.

The first production consumer is the existing Identity Permission vocabulary.

The canonical Permission:

```text
identity.authorization.manage
```

is now created through:

```text
parseNamespacedKey('identity.authorization.manage')
```

so the existing policy constant is validated against the Kernel-owned Namespace contract at runtime initialization.

Identity continues to own what that Permission means.

Conceptually:

```text
Identity & Access
    defines
identity.authorization.manage

Kernel Namespace
    validates
identity.authorization.manage
```

P3-M02 also applies `NamespacedKey` typing to:

```text
Permission.key

EvaluatePermissionInput.permissionKey

EvaluateActorPermissionInput.permissionKey
```

This gives both the public Permission Contract and permission-evaluation boundary the same semantic key vocabulary.

## P3-M02 Role-Key Boundary

The existing Role key:

```text
administrator
```

remains unchanged.

P3-M02 does not require every local key in AI World to become namespaced.

Role semantics remain Identity-owned, and no current collision requirement justifies replacing:

```text
administrator
```

with a namespaced representation.

This preserves the demand-driven rule:

```text
namespace where collision-safe shared vocabulary is required;

do not namespace every local string merely for uniformity.
```

## P3-M02 Error-Code Boundary

Existing application/API error codes such as:

```text
identity.authorization.invalid_request

identity.authorization.forbidden
```

are not migrated into `NamespacedKey`.

The current application error vocabulary permits forms such as underscores and belongs to the Error/Application contract rather than the minimal Namespace consumer scope.

P3-M02 therefore introduces:

```text
NO error-code migration
```

and does not broaden Namespace merely to absorb unrelated vocabularies.

## P3-M02 Persistence and Migration Outcome

The existing canonical Permission key persisted by Phase 2 already satisfies the finalized NamespacedKey contract:

```text
identity.authorization.manage
```

P3-M02 therefore introduces:

```text
NO Prisma model change

NO new table

NO new column

NO data rewrite

NO database migration
```

Canonical migration count remains:

```text
8
```

Database status remains:

```text
schema up to date
```

The existing persisted Permission value requires no compatibility layer and no rewrite.

## P3-M02 Repository Materialization

P3-M02 materialized:

```text
packages/kernel/namespace/
    package.json
    tsconfig.json
    tsconfig.test.json
    src/index.ts
    src/namespaced-key.ts
    test/namespaced-key.spec.ts
```

Canonical package:

```text
@ai-world/kernel-namespace
```

The public Contract exposes:

```text
NamespacedKey

NAMESPACED_KEY_MAX_LENGTH

isNamespacedKey()

parseNamespacedKey()
```

Generated/package-local runtime material remains outside committed source through the existing repository ignore rules.

## P3-M02 Infrastructure Boundary

P3-M02 deliberately does not introduce:

```text
Namespace database table;

central Namespace registry;

Namespace service;

Redis;

Cache;

Queue;

Kafka;

RabbitMQ;

distributed registry.
```

`NamespacedKey` is a semantic Kernel primitive, not infrastructure.

## P3-M02 Validation Evidence

Final P3-M02 local and remote validation:

```text
Kernel Namespace lint                     PASS

Kernel Namespace typecheck                PASS

Kernel Namespace unit tests               19 / 19 PASS

Kernel Namespace build                    PASS

Repository lint                           11 / 11 Turbo tasks PASS

Repository TypeScript                     21 / 21 Turbo tasks PASS

Identity unit tests                       83 / 83 PASS

Kernel Identifiers unit tests             11 / 11 PASS

API unit/e2e tests                        12 / 12 PASS

Web Vitest tests                          20 / 20 PASS

Root normal test tasks                    17 / 17 Turbo tasks PASS

Identity PostgreSQL integration           41 / 41 PASS

User PostgreSQL integration                6 / 6 PASS

API PostgreSQL integration                71 / 71 PASS

Repository PostgreSQL integration        118 / 118 PASS

Integration Turbo tasks                   13 / 13 PASS

Real SMTP → Mailpit integration            2 / 2 PASS

Real Chromium browser E2E                  2 / 2 PASS

Prisma schema validation                  PASS

Canonical migration status                8 migrations / schema up to date

Production build                          12 / 12 Turbo tasks PASS

Architecture validation                  291 modules
                                         681 dependencies
                                           0 violations

Git diff validation                       PASS

GitHub Actions CI / Validate              PASS
```

The browser and SMTP proofs are regression validation for unchanged Phase 2 behavior. P3-M02 itself adds no browser, email, or persistence infrastructure.

## P3-M02 Implementation Checkpoint

P3-M02 implementation was committed and pushed before roadmap closure.

The implementation checkpoint passed remote GitHub Actions CI / Validate.

The exact implementation hash is intentionally not invented in this documentation update; Git history remains the source of truth if the hash is added later.

## P3-M02 Closure

P3-M02 is complete.

The milestone proves:

```text
one canonical NamespacedKey semantic vocabulary;

strict lowercase dot-separated validation;

real reuse by the existing Identity Permission contract;

no unnecessary database migration;

no forced Role-key migration;

no forced application-error migration;

no central Namespace registry or service;

Kernel → Platform dependency prohibition remains intact;

full repository regression validation remains green.
```

Phase 3 position at P3-M02 closure:

```text
P3-M01 — Identifiers
CLOSED

P3-M02 — Namespace
CLOSED

P3-M03 — Events
NEXT

P3-M04 — Audit
PLANNED

P3-M05 — Taxonomy
PLANNED

P3-M06 — Relationships
PLANNED

P3-M07 — Architecture Enforcement Expansion
PLANNED

Phase 3 — Platform Kernel Baseline
ACTIVE
```

P3-M03 must remain demand-driven and establish only the smallest typed internal Event capability justified by real consumers.

P3-M03 does not justify Kafka, RabbitMQ, or another distributed broker by default.

This block records the historical delivery position at P3-M02 closure. The current delivery position is maintained in Sections 23A, 97, 398, and 410.

---

# 97. Phase 3 Milestone P3-M03 — Events

At the time of the P3-M03 demand review, P3-M03 was evaluated against the implemented production codebase before introducing a new Kernel package or Event mechanism.

Milestone status:

```text
P3-M03 — Events
DEFERRED
```

Deferral reason:

```text
NO current production Event publisher

NO current production Event subscriber

NO current cross-capability operation requires asynchronous Event propagation

NO current requirement for Event-driven eventual consistency

NO current requirement for durable Event delivery
```

Repository inspection found ordinary browser/React `FormEvent` usage, but no AI World business Event mechanism. Searches for publication/subscription vocabulary also found no production publisher, subscriber, emitter, dispatcher, or listener implementation.

Existing API `requestId` values provide request/error correlation at the transport boundary, but they do not by themselves justify a generalized Event context model.

The architecture still reserves Event responsibilities for the Platform Kernel:

```text
Events Kernel
    owns shared Event mechanics
    owns Event envelope conventions
    owns publication/subscription mechanics

Producing Capability
    owns the semantic meaning of each Event

Event consumers
    own only their derived state
    do not gain ownership of producer state
```

The dependency rule remains:

```text
Event
    describes something that already happened

producer
    must not depend on consumers

Commands and Events
    remain distinct
```

## P3-M03 Demand Review Result

At the time of the P3-M03 demand review, the implemented Platforms already completed their required synchronous business operations without a shared Event mechanism.

Potential existing operations such as:

```text
Role assignment

password Recovery reset

email verification confirmation

User Profile update
```

did not have an independent post-operation consumer whose requirement justified adding publication/subscription infrastructure at review time.

Adding Events only because these operations are significant would violate the Phase 3 demand-driven rule.

The first explicit future Event consumer remains the Knowledge phase, where the roadmap already anticipates meaningful lifecycle facts such as:

```text
KnowledgeCreated

KnowledgeUpdated

KnowledgePublished

KnowledgeArchived
```

Final Event names and Contracts remain intentionally undefined until that real producer/consumer boundary exists.

## P3-M03 Implementation Outcome

P3-M03 therefore introduces:

```text
NO @ai-world/kernel-events package

NO Event base class

NO generic Event envelope

NO Event publisher abstraction

NO Event subscriber abstraction

NO in-process Event bus

NO Event persistence

NO Prisma schema change

NO database migration

NO queue

NO Kafka

NO RabbitMQ
```

No speculative compatibility layer is created for a future Event design.

## P3-M03 Activation Gate

P3-M03 should be reactivated when a real capability requires one or more of:

```text
independent post-operation consumers;

producer/consumer decoupling;

in-process publication to multiple consumers;

eventual consistency between owned capabilities;

meaningful lifecycle Event Contracts;

correlation/context that must flow with business Events.
```

The expected first strong candidate is:

```text
Phase 4 Knowledge lifecycle
    → P4-M08 Knowledge Events
```

A future earlier consumer may reactivate P3-M03 if the requirement becomes concrete.

## P3-M03 Audit Boundary

P3-M04 Audit does not automatically require Events.

Audit and Events remain separate concepts:

```text
Event
    communicates a business fact to interested consumers

Audit Record
    durably records an accountability fact

Log
    records operational/diagnostic information
```

P3-M04 may therefore proceed directly if current security-sensitive operations justify reusable Audit Record semantics.

## P3-M03 Closure Decision

P3-M03 is intentionally deferred rather than implemented speculatively.

The milestone review proves:

```text
Event architecture was inspected before implementation;

no real current Event consumer exists;

no unnecessary Kernel package was created;

no distributed infrastructure was introduced;

future Knowledge Event needs remain explicitly preserved;

Phase 3 can continue to the next demand-justified milestone.
```

Phase 3 position at the P3-M03 deferral decision:

```text
P3-M01 — Identifiers
CLOSED

P3-M02 — Namespace
CLOSED

P3-M03 — Events
DEFERRED — pending real consumer

P3-M04 — Audit
NEXT

P3-M05 — Taxonomy
PLANNED

P3-M06 — Relationships
PLANNED

P3-M07 — Architecture Enforcement Expansion
PLANNED

Phase 3 — Platform Kernel Baseline
ACTIVE
```

This block records the historical delivery position at the P3-M03 deferral decision. Current delivery status is maintained in Sections 23A, 99, 383, 398, 410, and 411.

---

# 98. Events Initial Scope

When P3-M03 is reactivated, begin with the smallest mechanism required by the real producer and consumer.

The preferred initial direction remains:

```text
typed internal Events;

in-process publication;

subscription;

minimal correlation/context.
```

Do not introduce durable or distributed delivery unless a measured requirement exists.

Do not add by default:

```text
Kafka;

RabbitMQ;

distributed broker;

outbox infrastructure;

Event store;

stream-processing platform.
```

---

# 99. Phase 3 Milestone P3-M04 — Audit

P3-M04 established the minimal durable Audit capability justified by existing security-sensitive Identity operations.

Milestone status:

```text
P3-M04 — Audit
CLOSED
```

Implemented scope:

```text
@ai-world/kernel-audit package;

canonical AuditRecord semantic Contract;

AuditRecorder Contract;

AuditClock Contract;

SystemAuditClock implementation;

createAuditRecord canonical validation;

ResourceId-backed Audit/Actor/Resource identifiers;

NamespacedKey-backed action/resource-type/result semantics;

flat optional business context;

PrismaAuditRecorder durable implementation;

PostgreSQL audit_records persistence;

Identity privileged Role-assignment authorization decision integration;

allowed authorization Audit;

denied authorization Audit;

fail-closed protected mutation when required Audit persistence fails;

real API/PostgreSQL integration proof;

full repository regression and architecture validation.
```

## P3-M04 Architecture Boundary

Canonical ownership is:

```text
Audit Kernel
    owns Audit Record semantics
    owns Audit Record validation
    owns the AuditRecorder Contract
    owns durable Audit Record mechanism
    owns Audit persistence implementation

Identity & Access Platform
    owns authorization business meaning
    owns Role-assignment authorization semantics
    decides Actor, Action, Resource, result, and business context
    publishes accountability information through the Audit Contract

Database Foundation
    owns Prisma/PostgreSQL mechanics
    does not own Audit business semantics

API Application
    owns runtime composition
    wires Identity & Access to the concrete Audit implementation
```

The dependency direction is:

```text
Identity & Access
    ↓
@ai-world/kernel-audit

@ai-world/kernel-audit
    ↓
@ai-world/kernel-identifiers
@ai-world/kernel-namespace
@ai-world/foundation-database
```

Identity & Access does not write `audit_records` directly.

This preserves the accepted Audit dependency rule:

```text
Capabilities publish Audit information through Audit Contracts.

Capability code must not write Audit tables directly.
```

P3-M04 does not make Audit depend on Identity & Access to function. The Kernel remains independent of individual Platforms.

## P3-M04 Canonical Audit Record Baseline

The canonical first Audit Record contains:

```text
id
    ResourceId

actorId
    ResourceId

action
    NamespacedKey

resource.type
    NamespacedKey

resource.id
    ResourceId

result
    NamespacedKey

context
    optional flat business context

recordedAt
    Date
```

The first implementation intentionally keeps the record small.

Optional `context` supports only flat values:

```text
string
finite number
boolean
null
```

Nested objects, arrays, non-finite numbers, empty context keys, and other unsupported values are rejected by canonical record creation.

The baseline does not introduce a generalized arbitrary nested metadata document.

P3-M04 does not materialize a separate `scope` field because the first real consumer has no independent scope semantic that requires persistence. Scope remains available for a future Audit Contract extension when a real scoped operation defines its meaning.

P3-M04 also does not invent anonymous/system-Actor semantics without a current consumer. The first consumer has a concrete authenticated acting Actor.

## P3-M04 Identifier and Namespace Reuse

Audit reuses the earlier Phase 3 Kernel primitives rather than creating parallel formats.

Canonical reuse is:

```text
AuditRecord.id
    ResourceId

AuditRecord.actorId
    ResourceId

AuditRecord.resource.id
    ResourceId

AuditRecord.action
    NamespacedKey

AuditRecord.resource.type
    NamespacedKey

AuditRecord.result
    NamespacedKey
```

`createAuditRecord()` validates these values through the existing Identifiers and Namespace Kernels.

This provides the first direct proof that P3-M01 and P3-M02 compose into a later shared Kernel capability.

## P3-M04 Persistence

P3-M04 introduces the durable table:

```text
audit_records
```

Canonical persisted fields are:

```text
id             UUID
actor_id       UUID
action         VARCHAR(128)
resource_type  VARCHAR(128)
resource_id    UUID
result         VARCHAR(128)
context        JSONB nullable
recorded_at    TIMESTAMPTZ(3)
```

P3-M04 added the committed migration:

```text
20260812162301_audit_record_baseline
```

Canonical migration count after P3-M04:

```text
9
```

Database status at closure:

```text
schema valid
schema up to date
```

Audit persistence is owned by:

```text
PrismaAuditRecorder
```

The recorder:

```text
generates a canonical ResourceId;

obtains recordedAt through AuditClock;

creates a validated AuditRecord;

persists the durable record through the Database Foundation client.
```

## P3-M04 First Real Consumer

The first production consumer is the existing protected Identity operation:

```text
AssignRoleToActorAsActor
```

This operation is security-sensitive because one Actor attempts to assign a Role to another Actor.

Identity & Access owns the business Audit vocabulary for this operation.

The canonical action is:

```text
identity.authorization.role-assignment.decision
```

The target Resource type is:

```text
identity.actor
```

The authorization result uses Identity-owned namespaced result semantics such as:

```text
identity.authorization.allowed

identity.authorization.denied
```

The target Actor identifier is stored as the Resource identifier.

The requested local Role key is stored as business context:

```text
roleKey
```

The local Role key remains Identity-owned and is not forced into NamespacedKey merely because it appears in Audit context.

## P3-M04 Authorization Decision Semantics

P3-M04 deliberately audits the authorization decision rather than falsely claiming that a Role assignment mutation completed.

Conceptually:

```text
acting Actor
    ↓
EvaluatePermission
    ↓
authorization decision
    ↓
AuditRecorder.record(...decision...)
    ↓
if allowed
    protected Role-assignment mutation

if denied
    forbidden ApplicationError
```

For an allowed decision, the Audit Record is durably written before the protected mutation proceeds.

Therefore:

```text
required Audit persistence fails
    → protected mutation does not execute
```

This is a fail-closed accountability boundary for the protected operation.

The Audit action is intentionally a:

```text
role-assignment decision
```

rather than:

```text
role assigned
```

so a later target/Role lookup or persistence failure does not make the Audit Record semantically false. The record states that the acting Actor was authorized to attempt the operation, not that the operation necessarily committed.

Denied authorization is also recorded as an accountability decision before the canonical forbidden response is produced when Audit persistence succeeds.

The existing security rule remains intact:

```text
unauthorized Actor
    → authorization evaluated
    → denied decision audited
    → no target Actor lookup
    → no target Role lookup
    → no Role assignment mutation
```

Audit therefore does not weaken the existing target/Role existence non-disclosure behavior.

## P3-M04 API Composition

The API Application wires one concrete Audit implementation:

```text
DatabaseService
    ↓
PrismaAuditRecorder
    ↓
AssignRoleToActorAsActor
```

The API Application depends on the Audit infrastructure export only for composition.

Identity & Access depends on the Audit Contract and remains unaware of Prisma Audit persistence details.

No new Audit HTTP endpoint is introduced by P3-M04.

Audit Query remains a separate later capability.

## P3-M04 Audit vs Events and Logging

P3-M04 preserves three separate semantics:

```text
Audit Record
    durable accountability record

Business Event
    fact communicated to independent consumers

Operational Log
    diagnostic/operational information
```

P3-M04 therefore introduces:

```text
NO @ai-world/kernel-events package

NO Event bus

NO Event publisher/subscriber mechanism

NO Kafka

NO RabbitMQ

NO Redis Streams

NO outbox

NO queue
```

P3-M03 remains deferred.

Operational Pino logging remains useful but is not treated as the canonical Audit store.

## P3-M04 Query and Retention Boundary

The architecture reserves later Audit capabilities for:

```text
Audit Query

Audit Retention
```

P3-M04 does not implement them because the first real consumer requires durable record creation, not a user-facing Audit search capability or retention engine.

P3-M04 therefore adds no:

```text
Audit query API;

Audit viewing UI;

search/filter framework;

retention scheduler;

retention policy engine;

archive pipeline.
```

Those capabilities remain demand-driven.

## P3-M04 Validation Evidence

Final P3-M04 local and remote validation:

```text
Format check                              PASS

Lint                                      12 / 12 Turbo tasks PASS

TypeScript                                23 / 23 Turbo tasks PASS

Kernel Audit unit tests                   11 / 11 PASS

Identity unit tests                       84 / 84 PASS

API unit/e2e tests                        12 / 12 PASS

Web Vitest tests                          20 / 20 PASS

Root normal test tasks                    19 / 19 Turbo tasks PASS

Identity PostgreSQL integration           41 / 41 PASS

User PostgreSQL integration                6 / 6 PASS

API PostgreSQL integration                71 / 71 PASS

Repository PostgreSQL integration        118 / 118 PASS

Focused Authorization API/PostgreSQL      12 / 12 PASS

Integration Turbo tasks                   14 / 14 PASS

Real SMTP → Mailpit integration            2 / 2 PASS

Real Chromium browser E2E                  2 / 2 PASS

Prisma schema validation                  PASS

Canonical migration status                9 migrations / schema up to date

Production build                          13 / 13 Turbo tasks PASS

Architecture validation                  307 modules
                                         718 dependencies
                                           0 violations

Git diff validation                       PASS

GitHub Actions CI / Validate              PASS
```

P3-M04 changes no email, browser Session, or Web behavior. SMTP/Mailpit and Chromium results are regression proof for previously completed capabilities.

## P3-M04 Implementation Checkpoint

Implementation checkpoint:

```text
8a0be6b feat(kernel): establish audit baseline
```

The implementation checkpoint was pushed to `origin/main` and passed remote GitHub Actions CI / Validate before this roadmap closure update.

## P3-M04 Closure

P3-M04 is complete.

The milestone proves:

```text
one canonical durable Audit Record semantic;

Audit-owned persistence mechanism;

ResourceId and NamespacedKey reuse;

real Identity security-sensitive consumption;

allowed and denied authorization accountability records;

fail-closed protected mutation when required Audit persistence fails;

no direct Identity writes to Audit persistence;

Audit remains separate from Events and operational logging;

no speculative Audit Query or Retention implementation;

no distributed infrastructure;

full repository regression and architecture validation remains green.
```

Phase 3 position at P3-M04 closure:

```text
P3-M01 — Identifiers
CLOSED

P3-M02 — Namespace
CLOSED

P3-M03 — Events
DEFERRED — pending real consumer

P3-M04 — Audit
CLOSED

P3-M05 — Taxonomy
NEXT — demand review before implementation

P3-M06 — Relationships
PLANNED

P3-M07 — Architecture Enforcement Expansion
PLANNED

Phase 3 — Platform Kernel Baseline
ACTIVE
```

P3-M04 is an ordinary milestone closure and does not receive a Git tag.

The next work is P3-M05 Taxonomy demand review. Taxonomy should be implemented only if upcoming Knowledge proof establishes a concrete need for shared classification semantics.

---

# 100. Phase 3 Milestone P3-M05 — Taxonomy

P3-M05 was demand-reviewed before introducing a Taxonomy Kernel package or persistence model.

Milestone status:

```text
P3-M05 — Taxonomy
DEFERRED — no current Resource-classification consumer
```

Repository evidence at the time of the P3-M05 demand review:

```text
Knowledge Platform
NOT YET IMPLEMENTED AT REVIEW TIME

Universe packages
NOT YET IMPLEMENTED AT REVIEW TIME

production Resource-classification consumer
NONE

Taxonomy Definition consumer
NONE

Taxonomy Term consumer
NONE

shared classification persistence requirement
NONE
```

At the time of the P3-M05 demand review, the implemented Identity & Access and User Platforms did not require a shared Taxonomy semantic. Existing Role, Permission, profile, Session, verification, Recovery, and Audit concepts remain owned by their existing capabilities and must not be forced into Taxonomy merely to materialize the roadmap item.

P3-M05 therefore introduces:

```text
NO @ai-world/kernel-taxonomy package

NO Taxonomy Definition model

NO Term model

NO Resource classification model

NO Taxonomy registry

NO hierarchy implementation

NO Prisma schema change

NO database migration
```

The first strong activation point remains:

```text
Phase 4
P4-M05 — Taxonomy Integration
```

when a real Knowledge Resource requires reusable classification semantics such as:

```text
Anime
Genre

History
Era / historical classification
```

At activation, begin with only the smallest shared contract required by the real Knowledge consumer.

---

# 101. Taxonomy Deferred Features

While P3-M05 remains deferred, the following also remain intentionally unimplemented:

```text
complex hierarchy;

aliases;

localization;

advanced governance;

taxonomy administration UI;

generic ontology machinery;

cross-Universe taxonomy infrastructure without a consumer.
```

Activation requires an implemented Resource that needs reusable classification through a shared Taxonomy Definition/Term semantic.

---

# 102. Phase 3 Milestone P3-M06 — Relationships

P3-M06 was demand-reviewed before introducing a Relationships Kernel package, relationship persistence, or graph-style infrastructure.

Milestone status:

```text
P3-M06 — Relationships
DEFERRED — no current Resource-relationship consumer
```

Repository evidence at the time of the P3-M06 demand review:

```text
Knowledge Platform
NOT YET IMPLEMENTED AT REVIEW TIME

Universe packages
NOT YET IMPLEMENTED AT REVIEW TIME

production semantic Resource-to-Resource Relationship consumer
NONE

Relationship Type consumer
NONE

Relationship Instance consumer
NONE

relationship traversal consumer
NONE
```

Existing database relations such as Actor/User, Actor/Session, Actor/Role, and Audit Resource references are capability-owned persistence/reference semantics. They do not represent the shared typed Resource-connection capability described by K5 Relationships.

The architecture remains reserved for a future real consumer:

```text
Relationships Kernel
    owns shared Relationship Type mechanics
    owns canonical Relationship Instance semantics
    owns validation mechanics
    owns traversal semantics

defining Platform or Universe
    owns the domain meaning of each Relationship Type

source and target Resource owners
    retain ownership of their Resources
```

P3-M06 therefore introduces:

```text
NO @ai-world/kernel-relationships package

NO Relationship Type model

NO Relationship Instance model

NO Relationship Type registry

NO source/target validator framework

NO traversal API

NO relationship persistence table

NO Prisma schema change

NO database migration

NO Graph Database

NO Neo4j

NO Event dependency

NO queue or broker
```

The first strong activation point remains:

```text
Phase 4
P4-M06 — Relationship Integration
```

when real typed Knowledge Resources require connections such as:

```text
Anime Character
    APPEARS_IN
Series

History Person
    PARTICIPATED_IN
Event
```

At activation, the Relationships Kernel must remain Universe-neutral. Anime or History owns the meaning of concrete Relationship Types; the Kernel owns only shared mechanics.

---

# 103. Relationships Storage

Because P3-M06 is deferred, no Relationship persistence is introduced during the current Phase 3 baseline.

When a real Relationship consumer activates the capability, the default first persistence remains:

```text
PostgreSQL.
```

Do not introduce a Graph Database merely because the concept is called Relationships.

A Graph Database may be evaluated only if measured traversal, scale, or query requirements later prove PostgreSQL insufficient.


---

# 104. Phase 3 Milestone P3-M07 — Architecture Enforcement Expansion

P3-M07 strengthened automated ownership enforcement only where the current repository demonstrated concrete unprotected package boundaries.

Milestone status:

```text
P3-M07 — Architecture Enforcement Expansion
CLOSED
```

The demand review first confirmed that the existing dependency-cruiser baseline already enforced:

```text
no circular source dependencies;

no unresolvable imports;

no undeclared external dependencies;

no production source using dev-only dependencies;

no cross-application source dependencies;

Foundations do not depend upward;

Kernel does not depend upward;

Platforms do not depend on Universes or Applications;

Universes do not depend on Applications.
```

P3-M07 did not duplicate or rewrite those working rules.

## P3-M07 Concrete Enforcement Gaps

The implemented repository now contains real Foundation, Kernel, Platform, API, and Web package boundaries. Inspection showed three concrete gaps that the Phase 1 baseline did not yet reject:

```text
Application source could deep-import package-internal src files.

Package source could deep-import another package's internal src files.

Package production source could consume another package's infrastructure export
instead of depending on the owning package's public semantic Contract.
```

These gaps were now material because the repository includes public package exports and concrete infrastructure exports such as Audit and User persistence adapters.

## P3-M07 New Architecture Rules

P3-M07 added exactly three dependency-cruiser rules:

```text
applications-do-not-deep-import-package-source

packages-do-not-deep-import-other-package-source

package-production-does-not-depend-on-foreign-infrastructure
```

The first rule requires Applications to consume packages through declared package exports rather than package-internal `src` files.

The second rule requires packages to consume other packages through declared package exports rather than another package's internal `src` files. A package remains free to organize and import its own source internally.

The third rule prevents production package source from depending on another package's infrastructure implementation. Production package code should depend on the foreign owner's public semantic Contract instead.

The rule intentionally permits:

```text
Application composition roots
    → package infrastructure

integration tests
    → package infrastructure
```

because those are legitimate composition/proof boundaries.

P3-M07 does not globally prohibit Platform-to-Platform dependencies. The existing Identity & Access registration flow may continue to depend on the User Platform's public `UserRegistrationWriter` Contract. The enforcement concern is bypassing owner-controlled public Contracts or importing foreign infrastructure directly from production package source.

## P3-M07 Controlled Negative Proofs

The new rules were validated with temporary controlled violations that were deleted immediately after each proof.

Proof 1:

```text
packages/platforms/identity-access/src
    → @ai-world/kernel-audit/infrastructure
```

Result:

```text
REJECTED
package-production-does-not-depend-on-foreign-infrastructure
```

Proof 2:

```text
packages/platforms/user/src
    → ../../../kernel/identifiers/src/resource-id
```

Result:

```text
REJECTED
packages-do-not-deep-import-other-package-source
```

Proof 3:

```text
apps/api/src
    → ../../../packages/kernel/audit/src/create-audit-record
```

Result:

```text
REJECTED
applications-do-not-deep-import-package-source
```

After the temporary probes were removed, the real repository graph remained clean.

## P3-M07 Validation Evidence

Final local P3-M07 validation:

```text
Prettier — architecture config/documentation
PASS

Repository format check
PASS

Architecture configuration ESLint
PASS

Repository lint
12 / 12 Turbo tasks PASS

Production build through architecture:check
13 / 13 Turbo tasks PASS

Architecture validation
307 modules
718 dependencies
0 violations

git diff --check
PASS

Controlled foreign-infrastructure negative proof
PASS — violation rejected

Controlled package deep-import negative proof
PASS — violation rejected

Controlled application deep-import negative proof
PASS — violation rejected

GitHub Actions CI / Validate
PASS
```

P3-M07 changes no product behavior and therefore introduces:

```text
NO new package

NO Prisma model

NO database table

NO database column

NO database migration

NO Redis

NO Queue

NO Kafka

NO RabbitMQ

NO Graph Database

NO speculative Knowledge/Universe package rule requiring packages that do not yet exist.
```

Canonical migration count remains:

```text
9
```

## P3-M07 Documentation

The canonical engineering boundary document was updated alongside the configuration:

```text
docs/03-engineering/architecture-boundaries.md
```

The original P1-M13 architecture-boundary baseline remains historical evidence. P3-M07 records the later package-boundary expansion justified by real Kernel and Platform code.

## P3-M07 Implementation Checkpoint

Implementation checkpoint:

```text
aaf6e80 feat(architecture): expand package boundary enforcement
```

The checkpoint was pushed to `origin/main` and GitHub Actions CI / Validate is green.

## P3-M07 Closure

P3-M07 is complete.

The milestone proves:

```text
current layer-direction rules remain intact;

applications cannot bypass package exports through source deep imports;

packages cannot bypass foreign package exports through source deep imports;

production package source cannot depend on foreign infrastructure implementations;

application composition remains possible;

integration-test infrastructure composition remains possible;

real Platform-to-Platform public Contract dependencies remain possible;

controlled negative proofs fail as expected;

the complete real repository graph remains clean;

no speculative future package architecture was introduced.
```

P3-M07 closes the final accepted Phase 3 milestone.

---

# 105. Phase 3 Testing

Phase 3 validation proves both semantic Kernel behavior and automated ownership boundaries.

Kernel tests prove, where implemented:

```text
Universe neutrality;

type/definition validation;

ownership;

persistence integrity;

cross-consumer reuse.
```

Architecture validation additionally proves:

```text
primary layer direction;

cycle protection;

package export boundaries;

application/package deep-import rejection;

foreign infrastructure rejection from production package source;

clean real repository graph after controlled negative proofs.
```

Deferred capabilities do not require artificial test suites. Their evidence is the documented demand review and activation gate until a real consumer exists.

---

# 106. Phase 3 Closure Criteria

Phase 3 closes when:

```text
all currently demand-justified Kernel capabilities are implemented or explicitly deferred with activation gates;

Identity consumes implemented Kernel semantics where relevant;

deferred Knowledge-driven capabilities have clear ownership and Phase 4 activation points;

no Kernel capability contains Anime/History-specific business logic;

architecture checks protect the primary layer direction and current package boundaries;

no speculative distributed or graph infrastructure was introduced.
```

All accepted Phase 3 closure criteria are satisfied.

Closure evidence is:

```text
Identifiers
implemented and consumed by Identity & Access and User

Namespace
implemented and consumed by Identity Permission semantics

Events
reviewed and deferred with Phase 4 Knowledge Event activation gate

Audit
implemented durably and consumed by a real Identity authorization decision

Taxonomy
reviewed and deferred with P4-M05 activation gate

Relationships
reviewed and deferred with P4-M06 activation gate

Architecture enforcement expansion
implemented with three concrete package-boundary rules and negative proofs

Universe neutrality
preserved — no Anime/History business logic exists in Kernel packages

Distributed infrastructure
not introduced

Graph infrastructure
not introduced

Repository architecture
307 modules / 718 dependencies / 0 violations

P3-M07 remote CI
PASS
```

A deferred milestone does not block Phase 3 closure merely because it appeared in the original likely scope. Deferral is valid when repository evidence shows no current consumer and the roadmap preserves a concrete future activation gate.

Phase 3 is therefore complete and Phase 4 Knowledge may become the next implementation phase after the Phase 3 documentation-closure commit is pushed, its CI is green, and the `phase-3-complete` repository tag is established according to Section 411.

---

# 107. Phase 3 Exit Outcome

AI World gains:

```text
MINIMAL SHARED SEMANTIC KERNEL.
```

Final Phase 3 state:

```text
PHASE 3 — PLATFORM KERNEL BASELINE
COMPLETE

CLOSED MILESTONES
P3-M01 — Identifiers
P3-M02 — Namespace
P3-M04 — Audit
P3-M07 — Architecture Enforcement Expansion

DEFERRED WITH ACTIVATION GATES
P3-M03 — Events
P3-M05 — Taxonomy
P3-M06 — Relationships

CANONICAL MIGRATIONS
9

FINAL ARCHITECTURE
307 modules
718 dependencies
0 violations

P3-M07 IMPLEMENTATION CHECKPOINT
aaf6e80 feat(architecture): expand package boundary enforcement

P3-M07 GITHUB ACTIONS CI / VALIDATE
PASS
```

Next:

```text
Phase 4 — Knowledge Platform

P4-M01 — Knowledge Resource Model
```

Phase 4 is the first major multi-Universe architecture proof and should activate deferred Kernel capabilities only when real Knowledge consumers require them.

---

# 108. Phase 4 — Knowledge Platform

Purpose:

> **Build AI World's canonical structured, typed, connected Knowledge capability beginning with Devotional, then validate reuse through Anime, while retaining History as the later third structural reuse test.**

---

# 109. Phase 4 Importance

Knowledge is the first major test of the AI World Platform architecture.

It validates whether:

```text
one Platform
```

can support:

```text
structurally different Universes
```

without becoming untyped or Universe-specific.

---

# 110. Phase 4 Repository Materialization

Current Phase 4 materialization is:

```text
packages/platforms/knowledge/

packages/universes/devotional/
```

Devotional is now the first materialized Universe and consumes the Knowledge public Contract. Anime remains intentionally unmaterialized until its later second-Universe reuse-test milestone. History remains deferred as the later third structural reuse test. Deferred Kernel capabilities remain deferred and are activated only when a concrete consumer establishes the required semantics.

---

# 111. Phase 4 Milestone P4-M01 — Knowledge Resource Model

Define and implement the minimum canonical Knowledge Resource model.

Milestone status:

```text
CLOSED
```

Requirements should include:

```text
stable ID;

Resource type;

Universe context/association;

lifecycle;

createdAt / updatedAt persistence timestamps;

typed public Contract.
```

Implementation checkpoint:

```text
af7edb8 feat(knowledge): establish knowledge resource baseline
```

P4-M01 established `@ai-world/platform-knowledge`, the canonical `KnowledgeResource` public Contract, durable PostgreSQL persistence, and the initial `DRAFT` lifecycle. The implementation commit is pushed and its GitHub Actions CI / Validate run is green.

---

# 112. No Universal Object Engine

Knowledge must not become:

```text
Object {
    type: string;
    data: JSON;
}
```

for every domain concept.

---

# 113. Phase 4 Milestone P4-M02 — Typed Domain Resource Support

P4-M02 proved that shared Knowledge can support the first real typed domain model owned by Devotional while Knowledge remains generic and Universe-neutral.

Milestone status:

```text
CLOSED
```

Implemented scope:

```text
@ai-world/universe-devotional

DEVOTIONAL_UNIVERSE_KEY
    universe.devotional

DEVOTIONAL_DEITY_RESOURCE_TYPE
    devotional.deity

DeityResource
    extends KnowledgeResource
    narrows universeKey to universe.devotional
    narrows resourceType to devotional.deity
    adds name: string
```

The canonical dependency direction is:

```text
Devotional Universe
    ↓
@ai-world/platform-knowledge public Contract
```

Knowledge does not import Devotional.

Canonical ownership remains:

```text
Knowledge Platform
    owns canonical Knowledge Resource identity
    owns canonical lifecycle semantics
    owns canonical persistence

Devotional Universe
    owns the concrete meaning of Deity
    owns the Devotional Universe key
    owns the Deity Resource Type key
    owns Devotional-specific typed fields
```

P4-M02 introduced no new Knowledge abstraction merely to make Universe specialization symmetrical. The existing `KnowledgeResource` Contract was sufficient.

P4-M02 deliberately introduced:

```text
NO Anime package or Anime domain model;

NO History package or History domain model;

NO Knowledge source modification;

NO Prisma schema change;

NO database migration;

NO central switch(universe);

NO central switch(resourceType);

NO universal TypedKnowledgeResource<T> engine;

NO generic Metadata/JSON object engine;

NO CRUD;

NO Authorization;

NO Taxonomy;

NO Relationships;

NO lifecycle expansion;

NO Events;

NO Sources;

NO Citations;

NO Temporal semantics;

NO Media;

NO Search.
```

Focused Devotional validation proves:

```text
canonical Devotional Universe key
PASS

canonical Deity Resource Type key
PASS

DeityResource specializes KnowledgeResource
PASS

focused Devotional tests
3 / 3 PASS

Devotional lint
PASS

Devotional TypeScript
PASS

Devotional build
PASS
```

Repository validation after the P4-M02 implementation:

```text
Repository lint
14 / 14 Turbo tasks PASS

Repository TypeScript
26 / 26 Turbo tasks PASS

Repository normal tests
22 / 22 Turbo tasks PASS

Architecture validation
316 modules
734 dependencies
0 violations

Knowledge source diff
NONE

Prisma diff
NONE

Anime package
NOT MATERIALIZED

History package
NOT MATERIALIZED

forbidden genericization scan
PASS
```

Canonical migration count remains:

```text
10
```

Implementation checkpoint:

```text
dbb4a9a feat(devotional): establish deity resource type
```

The checkpoint was pushed to `origin/main`.

GitHub Actions workflow run `CI` completed successfully for the exact implementation commit `dbb4a9a110f1a29b8597f587f72a1134dd98a1b4`. Its `Validate` job completed with conclusion:

```text
success
```

Remote Validate included dependency installation, formatting, lint, TypeScript, tests, database migrations, database integration tests, Chromium browser E2E, build, and architecture validation.

P4-M02 closure proves:

```text
one real Universe can specialize shared Knowledge without changing Knowledge;

Universe-owned meaning can remain strongly typed;

shared Knowledge does not need named-Universe branches;

Anime does not need to be co-developed merely to claim genericity;

no speculative generic object engine is required;

no duplicate Universe infrastructure is introduced.
```

Anime remains intentionally deferred to the later second-Universe reuse-test milestone.

At P4-M02 closure, the next milestone was:

```text
P4-M03 — Knowledge CRUD Baseline
```

---

# 114. Phase 4 Milestone P4-M03 — Knowledge CRUD Baseline

Current milestone status:

```text
CLOSED
```

P4-M03 established canonical Knowledge-owned operations for:

```text
create;

read;

update.
```

Implemented public owner operations:

```text
CreateKnowledgeResource

GetKnowledgeResource

UpdateKnowledgeResource
```

Implemented public persistence Contracts:

```text
KnowledgeResourceReader

KnowledgeResourceWriter
```

Implemented Knowledge-owned infrastructure:

```text
PrismaKnowledgeResourceRepository

@ai-world/platform-knowledge/infrastructure
```

Create semantics:

```text
generate canonical ResourceId;

validate universeKey as NamespacedKey;

validate resourceType as NamespacedKey;

force initial lifecycle to DRAFT;

persist through the Knowledge-owned writer Contract.
```

Read semantics:

```text
validate canonical ResourceId;

read through the Knowledge-owned reader Contract;

missing Resource
    → knowledge.resource.not_found
    → not_found.
```

P4-M03 deliberately narrows update semantics to:

```text
resourceType
```

The update operation does not expose mutation of:

```text
id;

universeKey;

lifecycle;

createdAt.
```

`updatedAt` remains persistence-managed.

This deliberately avoids turning an ordinary update into a lifecycle transition or allowing a canonical Resource to silently move between Universes.

Lifecycle-driven archive behavior remains owned by P4-M07.

Persistence continues to use:

```text
knowledge_resources
```

P4-M03 introduced:

```text
NO Prisma schema change;

NO database migration;

NO lifecycle expansion;

NO API or Web behavior;

NO Authorization implementation;

NO Events;

NO Taxonomy;

NO Relationships;

NO Sources;

NO Citations;

NO Media;

NO Search;

NO Anime package;

NO History package.
```

Canonical migration count remains:

```text
10
```

Focused local validation:

```text
Knowledge unit tests
11 / 11 PASS

Knowledge PostgreSQL integration tests
5 / 5 PASS

Knowledge lint
PASS

Knowledge TypeScript
PASS

Devotional consumer TypeScript
PASS

Architecture validation
328 modules
785 dependencies
0 violations
```

The Knowledge CRUD tests use Universe-neutral test keys rather than importing or inventing Devotional domain definitions.

Scope guards confirmed:

```text
Devotional source
UNCHANGED

Prisma schema / migrations
UNCHANGED

API / Web
UNCHANGED

Anime
NOT MATERIALIZED

History
NOT MATERIALIZED
```

Implementation checkpoint:

```text
c82a325 feat(knowledge): establish crud baseline
```

Exact implementation commit:

```text
c82a325e88cf3ba9567d94c89da55a5fcd609b52
```

The implementation checkpoint is pushed to `origin/main`.

GitHub Actions workflow run:

```text
CI
run 31885021623
status completed
conclusion success
```

Remote Validate exercised the repository CI pipeline, including formatting, lint, TypeScript, tests, database migrations, database integration tests, browser E2E, build, and architecture validation.

P4-M03 closure proves that canonical Knowledge mutation authority now exists behind Knowledge-owned Contracts and persistence without changing the canonical schema, expanding lifecycle semantics, or introducing Universe-specific behavior into the shared Platform.

At P4-M03 closure, the next milestone was:

```text
P4-M04 — Knowledge Authorization
```

---

# 115. Knowledge Mutation Rule

Only Knowledge-owned operations mutate canonical Knowledge state.

---

# 116. Phase 4 Milestone P4-M04 — Knowledge Authorization

Current milestone status:

```text
CLOSED
```

P4-M04 protects canonical Knowledge mutation operations through the existing shared Identity & Access authorization capability while preserving the P4-M03 public owner-operation contract.

Protected actor-facing operations:

```text
CreateKnowledgeResourceAsActor

UpdateKnowledgeResourceAsActor
```

The P4-M03 owner operations remain public:

```text
CreateKnowledgeResource

UpdateKnowledgeResource
```

Authorization dependency:

```text
Knowledge Platform
    ↓
@ai-world/platform-identity-access public Contract
    ↓
EvaluatePermission
```

Knowledge owns the semantic meaning of the protected actions:

```text
knowledge.resource.create

knowledge.resource.update
```

Identity & Access owns Role and Permission evaluation vocabulary. P4-M04 adds the Identity-owned Role key:

```text
knowledge-editor
```

The grant baseline is:

```text
administrator
    → knowledge.resource.create
    → knowledge.resource.update

knowledge-editor
    → knowledge.resource.create
    → knowledge.resource.update

ordinary User
    → no automatic Role assignment
    → denied by default
```

Authorization ordering is intentionally security-first:

```text
evaluate Permission
    ↓
if denied
    → knowledge.authorization.forbidden
    → forbidden
    → no underlying mutation/validation/target lookup

if allowed
    ↓
delegate to canonical Knowledge owner operation
```

The public denied message is:

```text
You do not have permission to perform this action.
```

This ordering proves:

```text
denied create performs no persistence mutation;

denied update performs no persistence mutation;

denied update does not disclose whether the target Resource exists;

authorized update of a missing Resource preserves
knowledge.resource.not_found.
```

P4-M04 persistence is a data-only authorization baseline migration:

```text
20260815130500_knowledge_authorization_baseline
```

It adds the Knowledge Editor Role, the two Knowledge mutation Permissions, and Role-to-Permission grants for Administrator and Knowledge Editor.

P4-M04 introduces:

```text
NO Prisma schema change;

NO automatic administrator assignment;

NO automatic knowledge-editor assignment;

NO Knowledge API endpoint;

NO Web change;

NO lifecycle expansion;

NO archive/delete;

NO Knowledge Audit expansion;

NO Events;

NO Taxonomy implementation;

NO Relationships;

NO Sources or Citations;

NO Media or Search;

NO Anime package;

NO History package.
```

Canonical migration count is now:

```text
11
```

Focused local validation:

```text
Knowledge unit tests
17 / 17 PASS

Knowledge PostgreSQL integration tests
10 / 10 PASS

Knowledge lint
PASS

Knowledge TypeScript
PASS

Identity lint / TypeScript
PASS

Devotional consumer TypeScript
PASS

Architecture validation
336 modules
820 dependencies
0 violations
```

The PostgreSQL authorization proof includes:

```text
Knowledge Editor create/update allowed;

Administrator create/update allowed;

persisted ordinary User with zero Role assignments denied;

denied create/update perform no mutation;

denied missing-target update returns forbidden;

authorized missing-target update returns knowledge.resource.not_found.
```

Scope guards confirmed:

```text
Prisma schema
UNCHANGED

API / Web
UNCHANGED

Devotional source
UNCHANGED

Anime
NOT MATERIALIZED

History
NOT MATERIALIZED
```

Implementation checkpoint:

```text
e42b3b3 feat(knowledge): establish authorization baseline
```

Exact implementation commit:

```text
e42b3b33a61f54ecffbd0086d6dfbd091a832989
```

The implementation checkpoint is pushed to `origin/main`.

GitHub Actions workflow run:

```text
CI
run 31889564998
status completed
conclusion success
```

Remote CI exercised the repository validation pipeline after the P4-M04 implementation commit.

P4-M04 closure proves that shared Identity & Access authorization can protect Knowledge-owned mutations without moving ownership into Identity, exposing resource existence on denial, changing canonical Knowledge persistence, or introducing Universe-specific authorization branches.

At P4-M04 closure, the next milestone was:

```text
P4-M05 — Taxonomy Integration
```

P4-M05 remained demand-driven and required an activation review before any Taxonomy implementation.

---

# 117. Phase 4 Milestone P4-M05 — Taxonomy Integration

Current milestone status:

```text
DEFERRED — no implemented Devotional classification consumer
```

P4-M05 was demand-reviewed before materializing the deferred Taxonomy Kernel capability.

The activation gate remains:

```text
implement Taxonomy only when
an implemented Resource requires
reusable classification semantics
```

Repository evidence at the P4-M05 demand review:

```text
implemented Devotional Resource types
DeityResource only

DeityResource domain fields
name only

Devotional taxonomy/classification field
NONE

Devotional taxonomy dependency
NONE

Taxonomy Kernel package
NOT MATERIALIZED

Taxonomy persistence models
NONE

Taxonomy migration
NONE
```

The implemented `DeityResource` currently needs:

```text
canonical Knowledge identity and lifecycle
+
Devotional Universe/type specialization
+
name
```

It does not currently establish a real requirement for:

```text
Taxonomy Definition

Taxonomy Term

classification assignment

classification hierarchy

tradition taxonomy

category taxonomy
```

Potential Devotional tradition/category semantics remain candidates rather than approved taxonomy structure. Creating them merely to satisfy P4-M05 would violate the roadmap rule that shared capabilities must be activated by real consumers rather than speculative symmetry.

The accepted ownership model remains unchanged:

```text
Taxonomy Kernel
    owns canonical Taxonomy mechanics
    owns Taxonomy / Taxonomy Term semantics
    may own classification association mechanics

Devotional Universe
    may define domain-specific vocabulary meaning
    only when a real Devotional requirement exists

Knowledge Platform
    retains ownership of the classified Knowledge Resource
```

P4-M05 therefore introduces:

```text
NO @ai-world/kernel-taxonomy package

NO Taxonomy model

NO Taxonomy Term model

NO classification-assignment model

NO Prisma schema change

NO database migration

NO Devotional source change

NO Knowledge source change

NO API or Web change

NO Anime or History implementation
```

Canonical migration count remains:

```text
11
```

Deferral is intentional and does not represent a failed implementation. The activation gate remains open: if a future implemented Devotional Resource requires reusable classification semantics, Taxonomy should be activated with only the smallest contract and persistence required by that real consumer.

P4-M05 demand-review conclusion:

```text
REAL CLASSIFICATION CONSUMER
NONE

TAXONOMY IMPLEMENTATION
DEFERRED

SPECULATIVE TAXONOMY SCAFFOLDING
REJECTED
```

At P4-M05 demand review, the next milestone became:

```text
P4-M06 — Relationship Integration
```

P4-M06 remained demand-driven and required an activation review before any Relationships implementation.

---

# 118. Phase 4 Milestone P4-M06 — Relationship Integration

Current milestone status:

```text
DEFERRED — no implemented Devotional Resource-to-Resource relationship consumer
```

P4-M06 was demand-reviewed before materializing the deferred Relationships Kernel capability.

The activation gate remains:

```text
implement Relationships only when
real implemented Resources require
reusable Resource-to-Resource connection semantics
```

Repository evidence at the P4-M06 demand review:

```text
implemented Devotional Resource types
DeityResource only

second implemented Devotional Resource type
NONE

TempleResource
NOT MATERIALIZED

Devotional relationship field/reference
NONE

Devotional Relationships dependency
NONE

Relationships Kernel package
NOT MATERIALIZED

Relationship Type / Instance persistence
NONE

Relationship migration
NONE
```

The conceptual Devotional pressure point from the roadmap remains only conceptual:

```text
Deity
    ASSOCIATED_WITH
Temple
```

Because `Temple` is not yet an implemented Devotional Resource, there is no real pair of typed Resources that currently requires a reusable Relationship Type or Relationship Instance.

Inventing `ASSOCIATED_WITH`, `TempleResource`, traversal semantics, or relationship tables merely to satisfy P4-M06 would violate the roadmap rule that shared capabilities must be activated by real consumers rather than speculative symmetry.

The accepted ownership model remains unchanged:

```text
Devotional Universe
    owns the domain meaning of a specific Relationship Type
    when it introduces one for a real domain requirement

Relationships Kernel
    owns Relationship Type infrastructure
    owns Relationship Instance semantics
    owns validation mechanics
    owns shared traversal semantics

Knowledge Platform
    retains ownership of the connected Knowledge Resources
```

P4-M06 therefore introduces:

```text
NO @ai-world/kernel-relationships package

NO Relationship Type model

NO Relationship Instance model

NO relationship traversal layer

NO Graph Database

NO Prisma schema change

NO database migration

NO Devotional source change

NO Knowledge source change

NO API or Web change

NO Anime or History implementation
```

Canonical migration count remains:

```text
11
```

Deferral is intentional and does not represent a failed implementation. The activation gate remains open: once real implemented Devotional Resources require a reusable typed connection, Relationships should be activated with only the smallest Contract, validation, and persistence needed by that real consumer.

P4-M06 demand-review conclusion:

```text
REAL RESOURCE-TO-RESOURCE RELATIONSHIP CONSUMER
NONE

RELATIONSHIPS IMPLEMENTATION
DEFERRED

SPECULATIVE RELATIONSHIP SCAFFOLDING
REJECTED
```

The next milestone is:

```text
P4-M07 — Knowledge Lifecycle
```

P4-M07 should expand the current DRAFT-only Knowledge lifecycle only as far as the real lifecycle requirement justifies, without introducing a generalized Workflow engine.

---

# 119. Phase 4 Milestone P4-M07 — Knowledge Lifecycle

Current milestone status:

```text
CLOSED
```

P4-M07 establishes the smallest real lifecycle required by canonical Knowledge publication semantics:

```text
DRAFT
    ↓
PUBLISHED
    ↓
ARCHIVED
```

Lifecycle ownership remains with the Knowledge Platform.

Canonical lifecycle vocabulary:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Allowed transitions:

```text
DRAFT -> PUBLISHED
PUBLISHED -> ARCHIVED
```

Not introduced:

```text
PUBLISHED -> DRAFT
ARCHIVED -> PUBLISHED
restore
unpublish
scheduled publication
approval workflow
generic transition graph
generic Workflow engine
```

P4-M07 introduces explicit owner operations:

```text
PublishKnowledgeResource
ArchiveKnowledgeResource
```

and protected actor-facing operations:

```text
PublishKnowledgeResourceAsActor
ArchiveKnowledgeResourceAsActor
```

Knowledge owns the semantic Permission actions:

```text
knowledge.resource.publish
knowledge.resource.archive
```

Identity & Access remains the owner of Role, Permission representation, assignment, and evaluation. The existing `administrator` and `knowledge-editor` Roles receive both lifecycle Permissions. No automatic Role assignment is introduced for ordinary Users.

Authorization ordering remains:

```text
evaluate Permission
    ↓
if denied: forbidden, no Resource parse/lookup/mutation
    ↓
if allowed: perform Knowledge lifecycle operation
```

Lifecycle transition failures are intentionally distinguished:

```text
missing Resource
    knowledge.resource.not_found
    kind: not_found

existing Resource in invalid source lifecycle
    knowledge.resource.lifecycle_conflict
    kind: conflict
```

The Prisma-backed Knowledge repository performs a conditional lifecycle update using the expected source lifecycle. This prevents an invalid lifecycle source state from being silently overwritten.

Persistence impact:

```text
Prisma schema change
NONE

existing knowledge_resources.lifecycle column
REUSED

data-only authorization migration
20260815162000_knowledge_lifecycle_authorization

canonical migration count
12
```

P4-M07 deliberately does not introduce:

```text
Workflow Kernel
Events Kernel
Knowledge lifecycle Events
reverse lifecycle transitions
restore/unpublish
scheduled publication
approval/review workflow
API routes
Web UI
Devotional-specific lifecycle behavior
Anime or History
```

Implementation checkpoint:

```text
aaa9e88 feat(knowledge): establish lifecycle baseline
```

Exact implementation commit:

```text
aaa9e88e474b4ae055f7ceac76ebb10342f0e585
```

GitHub Actions implementation CI:

```text
run 31895231315
PASS
```

P4-M07 LOCAL VALIDATION

```text
21 / 21 validation steps PASS

Knowledge unit tests
4 files / 25 tests PASS

Knowledge integration tests
4 files / 15 tests PASS

Database migrations
12 / up to date

Devotional consumer typecheck
PASS

Architecture
347 modules
875 dependencies
0 violations
```

P4-M07 closure proves that canonical Knowledge now owns a minimal persisted publication lifecycle without introducing a generalized Workflow engine or prematurely materializing business Events.

The next milestone is:

```text
P4-M08 — Knowledge Events
```

P4-M08 must establish whether a real producer/consumer boundary now justifies activating the deferred Events capability. Event names, envelope Contracts, and delivery mechanics remain intentionally undefined until that review.

---

# 120. Phase 4 Milestone P4-M08 — Knowledge Events

Publish meaningful Events such as conceptual:

```text
KnowledgeCreated

KnowledgeUpdated

KnowledgePublished

KnowledgeArchived.
```

Final naming belongs to Event Contract design.

---

# 121. Phase 4 Milestone P4-M09 — Sources

Introduce minimal Source/provenance semantics only when an implemented Devotional Resource requires traceability to an external or textual source.

Devotional Scripture or source-sensitive devotional content is the first likely Phase 4 pressure point.

Anime should not influence the Source model before Anime exists.

History remains the later stronger independent reuse proof for Source semantics.

If Devotional does not require a shared Source capability, defer implementation rather than inventing it.

---

# 122. Phase 4 Milestone P4-M10 — Citations

Support structured Citation association only when a real source-backed Resource requires citation semantics distinct from the Source itself.

Devotional may activate this through source-sensitive Scripture or explanatory content.

History remains the later independent reuse test for stronger citation requirements.

Do not overbuild academic citation infrastructure initially.

---

# 123. Phase 4 Milestone P4-M11 — Temporal Baseline

Conduct a demand review before implementing reusable temporal semantics.

If Devotional establishes a real requirement, begin with only the smallest shared date/date-range semantics required by that consumer.

If Devotional does not require reusable temporal behavior:

```text
DEFER implementation
```

Anime may later provide a second independent pressure point during its reuse test.

If neither Devotional nor Anime establishes the requirement, defer until the History third-Universe reuse test.

History remains the strongest expected pressure around:

```text
dates;

date ranges;

uncertainty where required.
```

Avoid creating a universal time ontology prematurely.

---

# 124. Phase 4 Milestone P4-M12 — Devotional Universe v1

Create a minimal Devotional Universe Definition.

Potential scope:

```text
Deity

Scripture

Temple

one justified reusable classification

one justified Resource relationship

minimal Source/provenance only if required
```

The exact set remains demand-driven and should stay small enough to prove shared architecture without building the complete future Devotional domain.

---

# 125. Devotional v1 Goal

Prove:

```text
Universe definitions specialize shared Knowledge;

Devotional uses shared Identity/Authorization;

Devotional does not own a separate database engine;

Devotional does not own separate Search infrastructure;

Devotional-specific semantics remain in the Devotional owner;

shared Platform code contains no Devotional-specific core branches.
```

---

# 126. Phase 4 Milestone P4-M13 — Anime Reuse-Test Universe v1

Introduce a minimal Anime Universe Definition as the second-Universe reuse test after Devotional v1 has established real shared architecture.

Potential scope:

```text
Character

Series

Genre

Character APPEARS_IN Series.
```

---

# 127. Anime v1 Goal

Prove:

```text
same Knowledge Platform;

same Identity/Authorization;

same Taxonomy mechanics where activated;

same Relationship mechanics where activated;

different domain semantics;

no Anime-specific database engine;

no Anime-specific Search infrastructure;

no Anime-specific Platform core branches.
```

---

# 128. Phase 4 Milestone P4-M14 — Basic Public Knowledge API

Expose controlled read/query APIs.

---

# 129. Phase 4 Milestone P4-M15 — Basic Creator Knowledge API

Expose protected creation/editing APIs.

Creator UI may remain minimal.

---

# 130. Phase 4 Milestone P4-M16 — Web Knowledge Experience

Web should display limited:

```text
Devotional Resources;

Anime Resources;

relationships where activated;

classification where activated.
```

The Web must consume shared Platform Contracts rather than introducing Universe-specific canonical ownership.

---

# 131. Phase 4 Proof Generality Review

Review:

```text
Which shared Knowledge capabilities were genuinely required by Devotional?

How much of that architecture did Anime reuse without modification?

Did either require duplicate infrastructure?

Did Metadata become a temptation to avoid typing?

Did Platform code introduce Universe switches?

Would the later History Universe require fewer shared-core changes?
```

---

# 132. Metadata Decision Gate

At the end of initial Knowledge proof, evaluate whether real domain variation justifies:

```text
Metadata Kernel.
```

If yes:

```text
implement minimal Metadata.
```

If no:

```text
defer it.
```

---

# 133. Workflow Decision Gate

Evaluate whether editorial requirements now justify reusable Workflow.

Do not add it merely because publishing states exist.

---

# 134. Policy Decision Gate

Evaluate whether configurable cross-context rules justify Policy Kernel.

Otherwise keep stable rules in their Domain owners.

---

# 135. Phase 4 Closure Criteria

Phase 4 closes when:

```text
Knowledge owns canonical Resources;

typed domain modeling works;

Devotional v1 works;

Anime v1 works;

Taxonomy works across both where reusable classification is required;

Relationships work across both where reusable connections are required;

Identity/Authorization protects mutation;

basic lifecycle works;

Events/Audit exist where required;

Source/Citation semantics exist only where required by real Resources;

Temporal semantics are either implemented from real demand or explicitly deferred to History;

Web/API can consume both initial proof Universes;

no duplicate Universe infrastructure exists;

no core `switch(universe)` architecture exists;

History remains positioned as the later third structural reuse test.
```

---

# 136. Phase 4 Exit Outcome

AI World becomes a demonstrated:

```text
MULTI-UNIVERSE KNOWLEDGE PLATFORM.
```

---

# 137. Phase 5 — Media Platform

Purpose:

> **Build one reusable Media capability for Assets used by all Universes and Platforms.**

---

# 138. Phase 5 Primary Outcomes

Implement:

```text
Asset;

upload;

technical metadata;

storage abstraction;

delivery;

basic processing;

Knowledge/Universe association.
```

---

# 139. Phase 5 Repository Materialization

Expected:

```text
packages/platforms/media/

packages/foundations/storage/
```

Potential future:

```text
apps/worker
packages/foundations/queue
```

only if processing requires durable asynchronous work.

---

# 140. Phase 5 Milestone P5-M01 — Asset Model

Implement canonical:

```text
Asset ID;

Media type;

technical metadata;

storage reference;

lifecycle.
```

---

# 141. Phase 5 Milestone P5-M02 — Storage Foundation

Implement:

```text
Storage Contract;

filesystem development Adapter;

S3-compatible production Contract/Adapter direction.
```

Actual production vendor may remain deferred.

---

# 142. Phase 5 Milestone P5-M03 — Upload

Implement secure upload flow.

Validate:

```text
authorized Actor;

file size;

media type;

technical metadata.
```

---

# 143. Phase 5 Milestone P5-M04 — Delivery

Support controlled delivery for initial Assets.

---

# 144. Phase 5 Milestone P5-M05 — Image Processing

Introduce:

```text
Sharp
```

for real required image transformations such as thumbnails.

---

# 145. Synchronous Processing First

If early transformations are sufficiently small:

```text
process synchronously.
```

Do not create Worker/Queue prematurely.

---

# 146. Queue Introduction Gate

Introduce durable Queue only if Media processing demonstrates requirements such as:

```text
long execution;

retry;

durability;

concurrency;

failure isolation.
```

---

# 147. Phase 5 Milestone P5-M06 — Knowledge Integration

Knowledge Resources should reference:

```text
Asset IDs
```

through owned Media Contracts.

---

# 148. Phase 5 Milestone P5-M07 — Devotional Media Proof

Use Devotional to validate shared Media through real needs such as:

```text
Temple imagery;

Resource artwork/imagery where rights and domain policy permit;

shared image delivery and variants.
```

Do not create Devotional-specific storage or processing infrastructure.

---

# 149. Phase 5 Milestone P5-M08 — Anime Media Proof

Use Anime to validate:

```text
Character image;

Series image;

possibly visual media relationships.
```

---

# 150. Phase 5 Milestone P5-M09 — Media Audit/Events

Important Asset lifecycle actions should publish/record required Events/Audit.

---

# 151. Phase 5 Rights Scope

Advanced:

```text
licensing;

regional restrictions;

rights workflows
```

may remain deferred unless real content requires them.

---

# 152. Phase 5 Closure Criteria

Phase 5 closes when:

```text
Media owns Assets;

Storage does not own Asset semantics;

filesystem development storage works;

production-compatible S3 boundary exists;

image upload works;

basic processing works;

Knowledge references Assets safely;

Devotional and Anime reuse the same Media Platform;

no Universe-specific storage exists.
```

---

# 153. Phase 6 — Discovery Platform

Purpose:

> **Provide shared Search and discovery across AI World without making Search the source of truth.**

---

# 154. Phase 6 Initial Technology

Start with:

```text
PostgreSQL Search.
```

---

# 155. Phase 6 Milestone P6-M01 — Search Contract

Create Discovery-owned Search Contract supporting:

```text
query;

scope;

filter;

pagination;

result normalization.
```

---

# 156. Phase 6 Milestone P6-M02 — Knowledge Search

Search canonical Knowledge Resources through a Discovery-owned implementation.

---

# 157. Phase 6 Milestone P6-M03 — Universe-Scoped Search

Support:

```text
Devotional-only Search;

Anime-only Search.
```

---

# 158. Phase 6 Milestone P6-M04 — Cross-Universe Search

Support global Search across authorized Universes.

---

# 159. Phase 6 Milestone P6-M05 — Filters

Initial filters may include:

```text
Universe;

Resource Type;

Taxonomy.
```

Add others only as needed.

---

# 160. Phase 6 Milestone P6-M06 — Basic Ranking

Use understandable PostgreSQL ranking.

Do not introduce AI ranking immediately.

---

# 161. Phase 6 Milestone P6-M07 — Indexing Architecture Review

If PostgreSQL queries directly over canonical relational state remain adequate:

```text
no separate index projection required.
```

If a dedicated Search projection becomes valuable:

```text
Discovery owns it.
```

---

# 162. Dedicated Search Gate

Evaluate dedicated Search only after measuring:

```text
latency;

result quality;

faceting complexity;

scale;

language analysis.
```

---

# 163. Semantic Search Gate

Semantic/vector Search remains deferred until product requirements demonstrate value.

---

# 164. Recommendations

Basic related Resources may use:

```text
relationships;

taxonomy.
```

Personalized recommendation systems remain later scope.

---

# 165. Phase 6 Web Integration

Provide:

```text
global search UI;

Universe search;

filters;

Resource navigation.
```

---

# 166. Phase 6 Security

Discovery must respect:

```text
Resource visibility;

Universe scope;

Authorization/privacy rules.
```

Search may not expose hidden Resources.

---

# 167. Phase 6 Closure Criteria

Phase 6 closes when:

```text
Discovery owns Search;

Devotional and Anime are searchable;

Universe scope works;

global Search works;

filters work;

Search security is preserved;

Search does not own canonical Knowledge;

PostgreSQL Search is measured before specialized infrastructure is introduced.
```

---

# 168. Phase 7 — AI / Creator Platform

Purpose:

> **Introduce AI as a governed shared Platform capability operating on canonical AI World models.**

---

# 169. AI Entry Requirement

AI begins only after AI World has meaningful canonical:

```text
Identity;

Knowledge;

Media;

Discovery
```

to consume.

---

# 170. Phase 7 Provider Decision

At the beginning of Phase 7:

```text
select ONE initial AI Provider
```

based on current capabilities.

This decision may create an ADR.

---

# 171. Phase 7 Milestone P7-M01 — AI Provider Port

Create typed AI World-owned Provider Contract.

---

# 172. Phase 7 Milestone P7-M02 — Initial Provider Adapter

Implement one Provider Adapter.

Provider SDK must remain isolated.

---

# 173. Phase 7 Milestone P7-M03 — Generation Model

Implement canonical:

```text
Generation;

Generation Request;

Generation Result;

status;

Actor;

provider/model mapping;

timestamps.
```

---

# 174. Phase 7 Milestone P7-M04 — Text Generation

Begin with one clearly valuable AI capability.

Potential:

```text
creator drafting;

summarization;

Knowledge explanation.
```

Avoid an open-ended "AI everything" endpoint.

---

# 175. Phase 7 Milestone P7-M05 — Authorized AI Context

AI context should flow through:

```text
Knowledge;

Discovery;

User/Universe Context
```

using approved Contracts.

---

# 176. AI Database Rule

AI must not bypass public Platform Contracts to read arbitrary canonical tables.

---

# 177. Phase 7 Milestone P7-M06 — AI Provenance

Record enough provenance to answer:

```text
which Provider;

which model;

which task;

which source context;

when;

who requested it.
```

---

# 178. Phase 7 Milestone P7-M07 — Safety Baseline

Implement:

```text
input validation;

tool restriction;

output schema validation;

permission checks;

sensitive-data handling;

failure controls.
```

---

# 179. Phase 7 Milestone P7-M08 — Canonical Acceptance Flow

Prove:

```text
AI generates candidate
        ↓
Creator reviews
        ↓
Knowledge/Media/CMS owner accepts
        ↓
canonical Resource changes.
```

---

# 180. AI Source-of-Truth Rule

Generation Result is not canonical Knowledge merely because a model produced it.

---

# 181. Phase 7 Milestone P7-M09 — AI Creator Assistance

Possible features:

```text
draft description;

suggest taxonomy;

suggest relationships;

summarize Source;

create structured candidate data.
```

Each accepted result must pass canonical owner validation.

---

# 182. Phase 7 Milestone P7-M10 — AI Tool Baseline

Introduce typed Tool execution only when needed.

Potential:

```text
Search Knowledge;

Fetch Resource.
```

Do not build autonomous Agent framework.

---

# 183. Phase 7 Queue Gate

If Generation becomes long-running or requires reliable retry:

```text
introduce Queue Foundation

and

apps/worker
```

at this point.

---

# 184. Queue Selection

Choose the simplest durable implementation matching actual workload.

Do not automatically adopt Kafka.

---

# 185. Phase 7 Milestone P7-M11 — AI Usage Tracking

Track at least enough operational data for:

```text
usage;

latency;

failure;

cost estimation.
```

---

# 186. Phase 7 Multi-Provider Gate

Do not add a second Provider until there is evidence such as:

```text
missing modality;

availability requirement;

cost benefit;

quality requirement;

regional requirement.
```

---

# 187. Phase 7 Semantic Search Gate

AI phase may trigger embeddings/semantic Search evaluation.

Introduce them only if a real use case proves value.

---

# 188. Phase 7 Devotional AI Proof

Potential controlled use:

```text
source-grounded devotional explanation draft;

Scripture/source summary candidate;

structured Resource drafting with provenance.
```

Devotional AI output requires appropriate provenance, review, and canonical owner validation. AI-generated interpretation must not become canonical merely because a model produced it.

---

# 189. Phase 7 Anime AI Proof

Potential controlled use:

```text
character summary draft;

series metadata suggestion.
```

---

# 190. Phase 7 Closure Criteria

Phase 7 closes when:

```text
AI Provider is behind owned Adapter;

one Generation capability works;

Generation state is canonical to AI / Creator;

AI context respects authorization;

provenance exists;

safety baseline exists;

AI output requires owner acceptance before canonical mutation;

Devotional and Anime can consume AI without Provider-specific code;

Provider SDK is isolated.
```

---

# 191. Phase 8 — Composition / CMS Platform

Purpose:

> **Provide structured creator tools for composing canonical AI World Resources into publishable Experiences without duplicating their ownership.**

---

# 192. Phase 8 Entry Requirements

Requires sufficiently mature:

```text
Knowledge;

Media;

Identity;

AI Creator assistance
```

where relevant.

---

# 193. Phase 8 Milestone P8-M01 — Page Model

Implement canonical:

```text
Page;

Page lifecycle;

route/presentation metadata.
```

---

# 194. Phase 8 Milestone P8-M02 — Block Model

Implement typed reusable Blocks.

Avoid arbitrary unvalidated JSON composition.

---

# 195. Phase 8 Milestone P8-M03 — Layout / Composition

Allow Pages to compose:

```text
Knowledge;

Media;

other Blocks.
```

---

# 196. Phase 8 Ownership Rule

CMS may edit Knowledge through Knowledge Contracts.

CMS does not become Knowledge owner.

---

# 197. Phase 8 Milestone P8-M04 — Creator Editing UI

Build structured creator interface for:

```text
Knowledge;

Media;

Pages;

taxonomy/relationships where appropriate.
```

---

# 198. Phase 8 Milestone P8-M05 — Preview

Provide controlled draft preview.

---

# 199. Phase 8 Milestone P8-M06 — Publishing

Support composition publication lifecycle.

---

# 200. Workflow Gate

If editorial requirements now involve:

```text
multiple review states;

approval;

assignment;

rejection;

scheduled transitions
```

introduce reusable Workflow Kernel.

---

# 201. Policy Gate

If publication rules vary significantly by:

```text
Universe;

Resource;

region;

Actor;

content status
```

evaluate Policy Kernel.

---

# 202. Phase 8 Milestone P8-M07 — AI-Assisted CMS

Integrate AI creator assistance through AI / Creator public Contracts.

---

# 203. Phase 8 Milestone P8-M08 — Devotional Composition Proof

Potential:

```text
Devotional home/topic Page;

Deity or Temple presentation;

Scripture/source-aware content composition.
```

---

# 204. Phase 8 Milestone P8-M09 — Anime Composition Proof

Potential:

```text
Anime home Page;

Character spotlight;

Series composition.
```

---

# 205. Rich Editor Gate

Select rich editor technology only when actual structured editing requirements are understood.

---

# 206. Phase 8 Localization Gate

If product rollout now requires multiple locales:

```text
implement Localization Kernel baseline.
```

Do not implement localization solely for hypothetical future languages.

---

# 207. Phase 8 Versioning Gate

If creators require revision history beyond simple Audit:

```text
evaluate Versioning Kernel.
```

---

# 208. Phase 8 Closure Criteria

Phase 8 closes when:

```text
Pages/Blocks have canonical owner;

Creator UI edits shared Resources safely;

Media/Knowledge ownership remains intact;

preview works;

publishing works;

AI assistance is integrated safely;

Devotional and Anime can compose distinct experiences without separate CMS systems.
```

---

# 209. Phase 9 — Engagement Platform

Purpose:

> **Introduce reusable user interaction and personalization capabilities across Universes.**

---

# 210. Phase 9 Scope Principle

Engagement should begin with features that demonstrate cross-Universe value.

Likely:

```text
Favorites;

Collections.
```

Others remain demand-driven.

---

# 211. Phase 9 Milestone P9-M01 — Favorites

Implement generic Resource Favorites.

---

# 212. Favorite Architecture

Engagement owns:

```text
Favorite.
```

Referenced Resource owner remains unchanged.

---

# 213. Phase 9 Milestone P9-M02 — Collections

Allow Users to build Collections of Resources where product requirements justify it.

---

# 214. Phase 9 Milestone P9-M03 — Activity History

Introduce only if product value justifies tracking viewed/interacted Resources.

---

# 215. Privacy Requirement

Activity History must respect:

```text
privacy;

retention;

User preferences.
```

---

# 216. Phase 9 Milestone P9-M04 — Progress

Introduce if AI World adds:

```text
learning paths;

Experiences;

long-running journeys.
```

Otherwise defer.

---

# 217. Phase 9 Milestone P9-M05 — Notifications

Introduce user-facing Notification semantics if product workflows require them.

---

# 218. Email Relationship

Engagement owns Notification.

Email Foundation owns delivery.

---

# 219. Phase 9 Milestone P9-M06 — Personalization

Start with explicit preferences/signals before complex ML systems.

---

# 220. Recommendation Gate

Personalized recommendation infrastructure is introduced only after:

```text
sufficient usage data;

clear product value;

privacy design;

evaluation method
```

exist.

---

# 221. Community Features

Features such as:

```text
comments;

follows;

ratings;

social graph
```

remain optional and are not necessary to close Phase 9 unless roadmap is explicitly revised.

---

# 222. Phase 9 Closure Criteria

At minimum, Phase 9 closes when accepted core Engagement scope:

```text
uses shared Resource references;

works across Devotional and Anime;

does not duplicate User ownership;

respects privacy;

uses canonical Authorization where required.
```

---

# 223. Phase 10 — Production Operations

Purpose:

> **Bring AI World from functionally complete Platform capability into mature, observable, recoverable, scalable production operation.**

---

# 224. Operations Exist Before Phase 10

Phase 10 is maturity and closure.

Earlier phases already include minimum:

```text
logging;

health;

security;

migrations;

testing.
```

---

# 225. Phase 10 Milestone P10-M01 — Environment Architecture

Formalize:

```text
development;

test;

staging;

production.
```

---

# 226. Phase 10 Milestone P10-M02 — Production Infrastructure Provider

Select:

```text
cloud/hosting provider;

managed PostgreSQL;

object storage;

production email;

observability services.
```

Use ADRs where choices materially affect architecture.

---

# 227. Phase 10 Milestone P10-M03 — Infrastructure as Code

Select and implement Infrastructure-as-Code strategy.

---

# 228. Phase 10 Milestone P10-M04 — Deployment Pipeline

Implement controlled:

```text
build;

migration;

deployment;

rollback/recovery;

environment promotion.
```

---

# 229. Phase 10 Milestone P10-M05 — Metrics

Add production metrics for critical capabilities.

---

# 230. Phase 10 Milestone P10-M06 — Distributed Tracing

Introduce OpenTelemetry tracing where runtime complexity makes it valuable.

---

# 231. Phase 10 Milestone P10-M07 — Alerting

Alerts should cover meaningful failure conditions.

Avoid alerting on every technical fluctuation.

---

# 232. Phase 10 Milestone P10-M08 — Backup

Establish:

```text
database backup;

object-storage protection;

configuration recovery.
```

---

# 233. Phase 10 Milestone P10-M09 — Disaster Recovery

Document and test recovery procedures.

---

# 234. Phase 10 Milestone P10-M10 — Security Hardening

Perform broad review covering:

```text
authentication;

authorization;

Secrets;

dependency security;

headers;

uploads;

AI;

provider access;

logging;

data privacy.
```

---

# 235. Phase 10 Milestone P10-M11 — Performance Baseline

Measure:

```text
API latency;

database performance;

Search;

Media delivery;

AI latency;

Web performance.
```

Optimize actual bottlenecks.

---

# 236. Phase 10 Milestone P10-M12 — Scaling Review

Determine whether current modular monolith remains sufficient.

---

# 237. Service Extraction Gate

Only consider service extraction when evidence supports:

```text
independent scale;

reliability requirement;

specialized runtime;

deployment contention;

security boundary.
```

---

# 238. No Automatic Microservice Migration

Phase 10 does not mean:

```text
rewrite modular monolith into microservices.
```

---

# 239. Phase 10 Milestone P10-M13 — Cost Visibility

Track:

```text
database;

storage;

bandwidth;

AI;

Search;

compute.
```

---

# 240. Phase 10 Milestone P10-M14 — Operational Runbooks

Create runbooks for:

```text
database incidents;

failed migrations;

storage outage;

AI provider failure;

Search failure;

Queue backlog when present;

security incident.
```

---

# 241. Phase 10 Milestone P10-M15 — Production Readiness Review

Conduct final Platform-level review against:

```text
security;

reliability;

observability;

backup;

recovery;

capacity;

cost;

documentation.
```

---

# 242. Phase 10 Closure Criteria

Phase 10 closes when AI World has:

```text
reproducible production deployment;

safe Secrets;

managed canonical persistence;

backups;

recovery;

monitoring;

alerting;

security baseline;

performance measurements;

operational documentation;

incident procedures.
```

---

# 243. Platform Development Is Not Finished at Phase 10

Phase 10 completes the initial master roadmap.

AI World then enters continuous:

```text
capability expansion;

Universe expansion;

architecture evolution;

product development;

operations.
```

---
# 244. Cross-Phase Capability Timing

The following table provides the default first meaningful implementation phase.

| Capability | First Primary Phase |
|---|---|
| Configuration | Phase 1 |
| Database | Phase 1 |
| Migration | Phase 1 |
| Seed | Phase 1 |
| Observability | Phase 1 |
| Identity & Access | Phase 2 |
| User | Phase 2 |
| Email | Phase 2 |
| Identifiers | Phase 3 or pulled into Phase 2 |
| Namespace | Phase 3 |
| Events | Phase 3 demand review; activate with P4-M08 Knowledge Events or another real producer/consumer |
| Audit | Phase 3 or pulled into Phase 2 |
| Taxonomy | Phase 3 demand review; activate with Phase 4 Knowledge classification when required |
| Relationships | Phase 3 demand review; activate with Phase 4 Knowledge relationships when required |
| Knowledge | Phase 4 |
| Devotional Universe | Phase 4 |
| Anime Universe | Phase 4 |
| History Universe | Later third-Universe reuse test after Devotional + Anime shared Knowledge/Media/Discovery proof |
| Metadata | Phase 4+ if proven necessary |
| Media | Phase 5 |
| Storage | Phase 5 |
| Queue | Phase 5+ or Phase 7 when justified |
| Worker | When durable Jobs exist |
| Discovery | Phase 6 |
| Dedicated Search | Only if Phase 6 evidence requires |
| AI / Creator | Phase 7 |
| Workflow | Phase 8 if proven necessary |
| Policy | Phase 8 if proven necessary |
| Composition / CMS | Phase 8 |
| Localization | Phase 8+ when needed |
| Versioning | Phase 8+ when needed |
| Engagement | Phase 9 |
| Feature Flags | Later when rollout complexity requires |
| Scheduler | When real scheduled operations require |
| Advanced Operations | Phase 10 |

---

# 245. Kernel Demand-Driven Rule

The roadmap intentionally does **not** state:

```text
Phase 3 builds all Kernel capabilities.
```

Only capabilities with consumers are implemented.

---

# 246. Foundation Demand-Driven Rule

Likewise, Phase 1 does not automatically implement:

```text
Storage;

Cache;

Queue;

Scheduler;

Feature Flags.
```

Those Foundations appear when required.

---

# 247. Search Demand-Driven Rule

Discovery exists before specialized Search infrastructure.

---

# 248. AI Demand-Driven Rule

AI architecture exists before multiple Providers or Agent frameworks.

---

# 249. Universe Demand-Driven Rule

Universes initially implement only the small domain subset necessary to prove architecture.

---

# 250. MVP Definition

AI World's first meaningful Platform MVP should include a coherent subset of:

```text
Web

API

Identity & Access

User

Knowledge

Devotional

Anime

Media

Discovery
```

AI and CMS may follow quickly but should not be required merely to claim the first Platform proof.

---

# 251. MVP Philosophy

The MVP is not:

```text
one tiny Universe-specific app.
```

It should prove:

```text
shared Platform architecture.
```

---

# 252. MVP Proof Requirements

The first serious Platform proof must demonstrate:

```text
one User identity;

two Universes;

shared Knowledge;

shared Taxonomy/Relationships;

shared Media;

shared Search;

shared Authorization.
```

---

# 253. AI-Enhanced MVP

An AI-enhanced release may follow once Phase 7 is complete.

It should prove:

```text
AI uses canonical Platform data;

AI respects permissions;

AI output has provenance;

AI does not become canonical automatically.
```

---

# 254. Creator MVP

A Creator-focused release may follow Phase 8 and demonstrate:

```text
structured editing;

Media;

Knowledge;

AI assistance;

composition;

publishing.
```

---

# 255. Release Planning

This Master Roadmap defines architecture sequencing.

Actual releases may bundle completed milestones in product-meaningful combinations.

---

# 256. Release Numbering

Release/versioning policy is separate from phase numbering.

Do not assume:

```text
Phase 4 = v4.0.
```

---

# 257. Phase vs Sprint

Phases are architectural/product stages.

They are not fixed-length:

```text
sprints;

weeks;

months.
```

---

# 258. No Artificial Dates

This roadmap intentionally avoids unsupported delivery-date promises.

Scheduling may be added once:

```text
capacity;

team;

velocity;

scope
```

are known.

---

# 259. Planning Accuracy Principle

Prefer:

```text
dependency-based milestones
```

over false calendar precision.

---

# 260. Phase Entry Gate

Before beginning a Phase:

```text
previous required dependencies are stable enough;

current scope is clear;

ownership is known;

technology requirements are understood;

new infrastructure is justified.
```

---

# 261. Phase Exit Gate

Before closing:

```text
working implementation exists;

tests pass;

security is appropriate;

docs reflect implementation;

known debt is tracked;

required validation is complete.
```

---

# 262. Closure Review

Each major phase should conduct a closure review.

Possible structure:

```text
Scope planned

Scope completed

Scope deferred

Architecture changes

Security status

Testing status

Operational status

Known debt

Next phase readiness.
```

---

# 263. Definition of Done

The project-level Definition of Done remains authoritative.

This roadmap adds phase-specific closure criteria.

---

# 264. Technical Debt

Debt discovered during implementation must be classified.

Examples:

```text
architecture debt;

security debt;

testing debt;

operational debt;

documentation debt;

performance debt.
```

---

# 265. Debt Does Not Block Everything

A Phase may close with accepted non-critical debt if:

```text
debt is explicit;

risk is understood;

owner exists;

roadmap placement exists.
```

Critical security/data-integrity problems cannot be deferred casually.

---

# 266. No Silent Scope Creep

A Phase should not continuously absorb future Platforms.

Example:

```text
Phase 2 Identity
```

must not become:

```text
Identity + CMS + Search + Media
```

because implementation ideas emerge.

---

# 267. Scope Change Process

Material scope additions should answer:

```text
Why is this required now?

Which current milestone depends on it?

Can it be deferred?

Does it alter architecture?

Does roadmap need revision?
```

---

# 268. Phase Pull-Forward

A later capability may be pulled forward only when a current requirement genuinely needs it.

Example:

```text
Audit
```

may be pulled into Identity.

---

# 269. Pull-Forward Does Not Change Ownership

Pulled-forward capability remains owned by its canonical architectural area.

---

# 270. Phase Deferral

A planned capability may remain deferred if proof demonstrates it is unnecessary.

Example:

```text
Metadata
```

need not be implemented merely because P0-D12 lists it.

---

# 271. Architecture Feedback Loop

Implementation may expose architecture flaws.

The correct response is:

```text
review;

document;

update architecture;

use ADR when appropriate.
```

Not:

```text
silently bypass the architecture.
```

---

# 272. Early Architecture Validation

The most important early validation questions are:

```text
Can Identity remain shared?

Can Knowledge serve both Devotional and Anime?

Can Universes remain configuration/definitions rather than infrastructure?

Can Platforms communicate without table sharing?

Can Providers remain isolated?

Can public Contracts remain small?
```

---

# 273. Proof Universe Validation Metrics

Useful directional metrics include:

```text
core changes per new Universe;

duplicate infrastructure count;

Universe-specific conditions in shared code;

shared capability reuse count;

new extension count.
```

---

# 274. Architecture Warning — Too Many Universe Conditions

If shared Platform code accumulates:

```text
devotional

anime

history
```

conditions, stop and review Extension/Definition architecture.

---

# 275. Architecture Warning — Too Much Metadata

If typed models disappear into arbitrary Metadata, review Knowledge architecture.

---

# 276. Architecture Warning — Too Many Kernel Capabilities

If every shared helper becomes Kernel, stop Kernel expansion.

---

# 277. Architecture Warning — Too Many Packages

If package count grows faster than meaningful capability ownership, stop package extraction.

---

# 278. Architecture Warning — Too Much Infrastructure

If local development requires many services before product value exists, review technology additions.

---

# 279. Architecture Warning — Too Many Peer Platform Calls

If many Platforms synchronously call one another in long chains, review ownership and orchestration.

---

# 280. Architecture Warning — Too Many Events

If ordinary synchronous operations require complex Event chains, review Event usage.

---

# 281. Architecture Warning — Provider Leakage

If provider SDK types appear outside Adapters, repair the boundary before expansion.

---

# 282. Architecture Warning — Prisma Leakage

If Prisma models become public Domain/API types, repair persistence boundaries.

---

# 283. Architecture Warning — Web Database Access

If Web begins querying Prisma directly for canonical Platform operations, restore Web → API boundary.

---

# 284. Architecture Warning — Shared Module

If one:

```text
SharedModule
```

begins exporting most of the backend, remove the ownership ambiguity.

---

# 285. Architecture Warning — Common Package

If:

```text
common/

shared/

utils/
```

grows rapidly, review every item for real ownership.

---

# 286. Security Roadmap

Security evolves across all phases.

---

# 287. Phase 1 Security

```text
Secrets discipline;

safe config;

safe errors;

dependency hygiene.
```

---

# 288. Phase 2 Security

```text
password hashing;

Sessions;

verification;

recovery;

Authorization;

security tests.
```

---

# 289. Phase 3 Security

```text
Audit;

namespaced permissions;

package/public-boundary enforcement;

Event integrity when business Events activate.
```

---

# 290. Phase 4 Security

```text
Resource Authorization;

publication controls;

data integrity.
```

---

# 291. Phase 5 Security

```text
upload validation;

Asset access;

Storage privacy.
```

---

# 292. Phase 6 Security

```text
Search visibility filtering;

private Resource protection.
```

---

# 293. Phase 7 Security

```text
AI context authorization;

Provider data transfer;

tool restrictions;

output validation.
```

---

# 294. Phase 8 Security

```text
creator permissions;

publishing controls;

workflow security.
```

---

# 295. Phase 9 Security

```text
privacy;

personalization controls;

notification safety.
```

---

# 296. Phase 10 Security

```text
production hardening;

incident response;

secrets management;

infrastructure security;

security testing.
```

---

# 297. Testing Roadmap

Testing similarly matures incrementally.

---

# 298. Phase 1 Testing

Establish tools and baseline infrastructure.

---

# 299. Phase 2 Testing

Emphasize security-critical flows.

---

# 300. Phase 3 Testing

Emphasize semantic Kernel contracts and controlled architecture-boundary negative proofs.

---

# 301. Phase 4 Testing

Emphasize:

```text
Knowledge behavior;

Universe compatibility;

cross-Universe proof.
```

---

# 302. Phase 5 Testing

Emphasize:

```text
upload;

Storage integration;

processing;

Asset lifecycle.
```

---

# 303. Phase 6 Testing

Emphasize:

```text
Search relevance baseline;

filters;

security;

pagination.
```

---

# 304. Phase 7 Testing

Emphasize:

```text
Provider translation;

AI safety;

provenance;

canonical acceptance;

Provider failures.
```

---

# 305. Phase 8 Testing

Emphasize:

```text
creator workflow;

composition;

preview;

publishing.
```

---

# 306. Phase 9 Testing

Emphasize user-owned Engagement semantics and privacy.

---

# 307. Phase 10 Testing

Add:

```text
performance;

security;

recovery;

deployment;

disaster-recovery validation.
```

---

# 308. Observability Roadmap

Observability grows from:

```text
logs
```

to:

```text
logs + health
```

to:

```text
metrics
```

to:

```text
tracing + alerting + operational dashboards.
```

---

# 309. Database Roadmap

Initial:

```text
one PostgreSQL database.
```

Later scaling should first consider:

```text
indexes;

query optimization;

connection management;

read patterns;

partitioning where justified.
```

Do not jump immediately to sharding/multiple databases.

---

# 310. Search Roadmap

```text
PostgreSQL
    ↓
optimized PostgreSQL Search
    ↓
dedicated Search only if measured need
    ↓
semantic/vector capabilities only if real use case.
```

---

# 311. Queue Roadmap

```text
synchronous/in-process
    ↓
durable Queue when needed
    ↓
specialized Queue/broker only if workload requires.
```

---

# 312. Cache Roadmap

```text
no distributed Cache
    ↓
measure bottleneck
    ↓
introduce Cache
    ↓
validate correctness without Cache.
```

---

# 313. Media Roadmap

```text
image Assets
    ↓
variants
    ↓
more processing
    ↓
video/audio only when required.
```

---

# 314. AI Roadmap

```text
one Generation capability
    ↓
creator assistance
    ↓
Tools
    ↓
additional modalities
    ↓
routing
    ↓
multiple Providers
    ↓
Agents only if justified.
```

---

# 315. Universe Roadmap

```text
Devotional v1

Anime v1

expand both incrementally

History third-Universe reuse validation

additional Universe validation

creator-driven Universe configuration later.
```

---

# 316. Universe Creation Evolution

Early:

```text
typed source definitions.
```

Later:

```text
more persistent/admin-managed configuration.
```

Potential long term:

```text
creator-driven Universe definition
```

without requiring a full arbitrary-code Plugin model.

---

# 317. Third Universe Gate

Introduce the third Universe after:

```text
Knowledge is stable;

Devotional + Anime Knowledge lessons are incorporated;

Media/Discovery reuse across Devotional + Anime is demonstrated.
```

The third-Universe test should occur only after enough shared capability exists for it to measure reuse rather than merely repeat initial Platform construction.

---

# 318. Third Universe Selection

History is the selected third structural reuse test.

History is intentionally later because it can independently pressure:

```text
People;

Events;

Places;

Civilizations;

Sources;

Citations;

time;

uncertainty;

verification;

cross-domain relationships.
```

The test succeeds only if those domain pressures reuse the established shared architecture rather than requiring a parallel History-specific stack.

---

# 319. Third Universe Success

Success means most implementation work is:

```text
domain definition;

taxonomy;

relationships;

content;

presentation;

configuration.
```

Not:

```text
new infrastructure.
```

---

# 320. Fourth and Later Universes

After the third-Universe test, Universe expansion may become a regular product capability rather than an architecture experiment.

---

# 321. Product Depth vs Universe Count

Prefer:

```text
a few useful Universes
```

over:

```text
dozens of empty Universe shells.
```

---

# 322. Platform Depth vs Feature Count

Likewise, prefer coherent core capabilities over broad incomplete feature lists.

---

# 323. Phase Sequencing Flexibility

This roadmap is authoritative in dependency direction but not rigid at the level of every individual Task.

Example:

```text
basic Media work
```

may begin late in Knowledge phase if needed to validate Anime.

That does not mean Media architecture becomes Knowledge-owned.

---

# 324. Milestone Reordering

Milestones inside a Phase may be reordered when:

```text
dependencies allow;

the outcome remains unchanged;

architecture boundaries are preserved.
```

---

# 325. Major Phase Reordering

Changing major Phase sequence requires stronger justification and likely roadmap update.

---

# 326. Skipping a Phase

A Phase may be effectively skipped only if its capabilities are no longer required.

Example:

```text
Engagement
```

could remain deferred for an extended period.

---

# 327. Cannot Skip Security Foundations

Some cross-cutting requirements cannot be skipped merely because their dedicated documentation/operations phase is later.

---

# 328. Release Readiness vs Phase Completion

A Phase may be complete while the overall Platform is not yet ready for public production release.

Release criteria may be stricter.

---

# 329. Internal Preview

AI World may run internal/dev previews during earlier phases.

That does not imply production maturity.

---

# 330. Staging Introduction

A dedicated staging environment becomes useful once:

```text
integration complexity;

external Providers;

creator workflows;

release validation
```

justify it.

Likely no later than pre-production phases.

---

# 331. Production Introduction

A limited production deployment may occur before Phase 10 completion if sufficient safeguards exist.

Phase 10 then matures the operational platform.

---

# 332. Production Gate

Before any real user production deployment, require at minimum:

```text
secure Identity;

authorization;

safe Secrets;

database backups;

migration process;

observability;

incident response baseline;

privacy-aware handling;

tested core flows.
```

---

# 333. Architecture Closure Does Not Mean Architecture Ends

After Phase 0:

```text
architecture moves from design-only
to
design + implementation feedback.
```

---
# 334. ADR Evolution

Important implementation feedback should result in:

```text
ADR
```

rather than undocumented divergence.

---

# 335. Documentation Evolution

Accepted architecture documents may be revised through normal governance.

History must remain traceable.

---

# 336. Roadmap Evolution

This Master Roadmap may change when:

```text
product priorities change;

architecture evidence changes;

major capability scope changes;

dependencies shift;

production constraints emerge.
```

---

# 337. Roadmap Change Discipline

Updates must preserve:

```text
one authoritative sequence;

clear current Phase;

clear completed work;

clear deferred work.
```

---

# 338. Status Reporting

Future status updates should answer:

```text
CURRENT PHASE

CURRENT MILESTONE

COMPLETED

IN PROGRESS

NEXT

BLOCKED

DEFERRED

ARCHITECTURE CHANGES

TECHNICAL DEBT.
```

---

# 339. Historical Status Immediately After Phase 0

```text
PROJECT
AI World

PROJECT TYPE
Greenfield

LEGACY
Reference only

ARCHITECTURE FOUNDATION
Complete

TECHNOLOGY BASELINE
Accepted

SOURCE IMPLEMENTATION
Not started yet

NEXT PHASE
Phase 1 — Engineering Foundation
```

---

# 340. First Coding Objective

The first coding objective is **not Authentication**.

It is:

```text
establish the Engineering Foundation
that Authentication will rely on.
```

---

# 341. First Source Milestone

The first source work should establish:

```text
workspace;

apps/api;

apps/web;

Configuration;

Database;

Observability;

testing;

CI.
```

---

# 342. First Backend Success Condition

A minimal backend success condition is:

```text
NestJS API starts;

validated Configuration loads;

PostgreSQL connects;

structured logging works;

health reports correctly;

test suite runs.
```

---

# 343. First Frontend Success Condition

A minimal frontend success condition is:

```text
Next.js Web starts;

basic App shell renders;

API connectivity strategy works;

lint/type/build pass.
```

---

# 344. First Database Success Condition

```text
empty PostgreSQL
    ↓
migration
    ↓
expected schema
    ↓
integration test
```

must work reproducibly.

---

# 345. First CI Success Condition

A pull request should be unable to merge normally when baseline:

```text
typecheck;

lint;

tests;

build
```

fail.

---

# 346. Phase 1 Must Stay Small

Do not start building:

```text
Taxonomy;

Relationships;

AI;

Media;

Search
```

while Engineering Foundation is still unstable.

---

# 347. Phase 1 Must Also End

Do not spend months perfecting:

```text
build caching;

code generators;

architecture frameworks;

developer portals
```

before Identity begins.

---

# 348. Phase 2 Must Use Real Foundation

Identity should become the first serious consumer proving Phase 1 infrastructure.

---

# 349. Phase 3 Must Use Real Consumers

Kernel capabilities should be driven by:

```text
Identity;

Knowledge.
```

---

# 350. Phase 4 Is First Major Architecture Proof

If Devotional and Anime cannot coexist cleanly under one Knowledge Platform, architecture review is mandatory before expanding further.

---

# 351. Phase 5 Proves Shared Asset Infrastructure

Media must not be duplicated per Universe.

---

# 352. Phase 6 Proves Shared Discovery

Search must not be duplicated per Universe.

---

# 353. Phase 7 Proves AI as Platform

AI must not become:

```text
a Chatbot module attached to one Universe.
```

---

# 354. Phase 8 Proves Creator Composition

Creators should increasingly manipulate structured Platform Resources rather than requiring engineering changes for every page.

---

# 355. Phase 9 Proves Cross-Universe User Experience

Favorites/Collections should demonstrate that Users experience AI World as one Platform rather than isolated applications.

---

# 356. Phase 10 Proves Operational Durability

Production capability completes the initial architecture-to-operations lifecycle.

---

# 357. Master Roadmap Architecture Invariants

The following are non-negotiable roadmap invariants:

```text
1. Phase 0 architecture precedes source implementation.

2. Phase 0 ends; planning is not allowed to become permanent postponement.

3. Phase 1 creates only necessary Engineering Foundations.

4. Identity & Access is implemented once and reused by all Universes.

5. Kernel capabilities are implemented demand-first, not all upfront.

6. Knowledge is proven against at least Devotional and Anime; History is retained as a later structural reuse test.

7. Universe-specific infrastructure duplication is forbidden.

8. Media is shared across Universes.

9. Discovery is shared across Universes.

10. AI consumes canonical Platform data.

11. AI Providers remain implementation details.

12. CMS composes canonical Resources rather than duplicating ownership.

13. Engagement references Resources through shared canonical identity.

14. Production Operations mature incrementally.

15. PostgreSQL remains the first canonical persistence/search foundation unless evidence justifies another technology.

16. Distributed infrastructure is introduced from real workload evidence.

17. Microservices are not a roadmap milestone by themselves.

18. Kubernetes is not a roadmap objective.

19. Provider count is not a measure of architecture maturity.

20. New Universes should require decreasing shared-core modification.

21. Vertical slices validate architecture continuously.

22. Architecture violations are fixed rather than normalized through framework workarounds.

23. Security and data integrity outrank delivery convenience.

24. Technical debt must remain visible.

25. Each Phase must close before scope expands indefinitely.
```

---

# 358. Roadmap Anti-Pattern — Build All Foundations First

Bad:

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

all fully built
before first User exists.
```

---

# 359. Roadmap Anti-Pattern — Build Whole Kernel First

Bad:

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

all completed
before Knowledge exists.
```

---

# 360. Roadmap Anti-Pattern — Proof Universe First App

Bad:

```text
build Devotional or Anime as an independent product
then generalize later.
```

The first proof already uses shared AI World architecture.

---

# 361. Roadmap Anti-Pattern — AI First

Bad:

```text
build advanced chatbot/agents
before canonical Knowledge, Authorization, and User context exist.
```

---

# 362. Roadmap Anti-Pattern — Search Cluster First

Bad:

```text
deploy Elasticsearch
before one Search feature exists.
```

---

# 363. Roadmap Anti-Pattern — Redis First

Bad:

```text
deploy Redis
before Cache/Queue requirements exist.
```

---

# 364. Roadmap Anti-Pattern — Kubernetes First

Bad:

```text
build Kubernetes deployment
before one production Application requires it.
```

---

# 365. Roadmap Anti-Pattern — Microservices First

Bad:

```text
split every Platform into network service
before logical boundaries are validated.
```

---

# 366. Roadmap Anti-Pattern — Perfect Architecture Forever

Bad:

```text
continue writing architecture documents
indefinitely
without implementing Phase 1.
```

---

# 367. Roadmap Anti-Pattern — Code Without Closure

Bad:

```text
start Phase 2
while Phase 1 remains undocumented, broken, and unreproducible.
```

---

# 368. Roadmap Anti-Pattern — Feature Explosion

Bad:

```text
add social network;

billing;

marketplace;

notifications;

agents;

recommendations
```

before shared Platform core is validated.

---

# 369. Roadmap Anti-Pattern — Universe Count as Progress

Ten empty Universes are not more valuable than two well-proven Universes.

---

# 370. Roadmap Anti-Pattern — Technology Count as Progress

More infrastructure is not architectural maturity.

---

# 371. Roadmap Anti-Pattern — Coverage Number as Progress

A coverage percentage does not replace meaningful behavior validation.

---

# 372. Roadmap Anti-Pattern — Documentation Count as Progress

More documents do not replace working software.

---

# 373. Roadmap Anti-Pattern — Demo-Only Completion

A capability is not complete because one demo works.

---

# 374. Roadmap Anti-Pattern — Production Cleanup Later

Critical:

```text
security;

migration;

ownership;

data integrity
```

cannot all be postponed to Phase 10.

---

# 375. Roadmap Anti-Pattern — Legacy Copying

Do not accelerate development by copying legacy architecture wholesale.

Reuse only validated lessons or isolated implementation where it conforms to the new architecture.

---

# 376. Roadmap Anti-Pattern — Rewrite Loop

Once implementation starts, do not repeatedly restart the repository because a cleaner pattern appears.

Prefer incremental refactoring.

---

# 377. Decision Priority During Delivery

When roadmap pressure creates tradeoffs, prioritize:

```text
1. Security

2. Data integrity

3. Correctness

4. Canonical ownership

5. Maintainability

6. Simplicity

7. User value

8. Developer experience

9. Reuse

10. Performance

11. Extensibility

12. Convenience.
```

Performance may move upward when measurements demonstrate critical need.

---

# 378. Roadmap Review Cadence

Review this roadmap:

```text
at Phase closure;

after major architectural evidence;

before major roadmap scope changes;

before major technology changes.
```

No arbitrary weekly rewriting is required.

---

# 379. Completion Evidence

Each Phase closure should leave durable evidence such as:

```text
working source;

passing tests;

updated documentation;

accepted migrations;

architecture review;

closure review.
```

---

# 380. Phase 0 Completion Evidence

The accepted Phase 0 document set itself is the architectural evidence.

---

# 381. Phase 1 Completion Evidence

Expected:

```text
repository builds;

applications start;

database works;

health works;

tests/CI pass;

setup is reproducible.
```

---

# 382. Phase 2 Completion Evidence

Completed Phase 2 evidence includes:

```text
registration;

email verification;

password authentication;

opaque server-managed Session;

secure HttpOnly browser Session transport;

Session validation;

logout;

Session revocation;

password recovery;

User Profile;

Roles;

Permissions;

owner-side Authorization;

first-party account UX;

real SMTP delivery;

real PostgreSQL integration;

real Chromium browser security proof;

remote CI validation.
```

Final Phase 2 validation baseline:

```text
Identity unit tests
83 / 83 PASS

User PostgreSQL integration
6 / 6 PASS

Identity PostgreSQL integration
41 / 41 PASS

API PostgreSQL integration
71 / 71 PASS

Repository PostgreSQL integration
118 / 118 PASS

Web Vitest
20 / 20 PASS

SMTP → Mailpit
2 / 2 PASS

Chromium E2E
2 / 2 PASS

Architecture
281 modules
664 dependencies
0 violations

Prisma
8 migrations
schema up to date

Build
10 / 10 PASS

GitHub Actions CI / Validate
PASS
```

---

# 383. Phase 3 Completion Evidence

Phase 3 is COMPLETE.

Final Phase 3 evidence:

```text
P3-M01 — Identifiers
CLOSED

@ai-world/kernel-identifiers
implemented

ResourceId generation / validation / parsing
implemented

Real consumers
Identity Actor.id
User User.id
User User.actorId

Identifier persistence migration
not required

Kernel Identifiers unit tests
11 / 11 PASS

P3-M02 — Namespace
CLOSED

@ai-world/kernel-namespace
implemented

NamespacedKey validation / parsing
implemented

NamespacedKey maximum length
128

Real consumer
identity.authorization.manage

Namespace persistence migration
not required

Kernel Namespace unit tests
19 / 19 PASS

P3-M03 — Events
DEFERRED — pending real consumer

Kernel Events package
not created

Event persistence migration
not required

Distributed Event infrastructure
not introduced

Activation gate
Phase 4 P4-M08 Knowledge Events or an earlier concrete producer/consumer

P3-M04 — Audit
CLOSED

@ai-world/kernel-audit
implemented

AuditRecord semantics
implemented

AuditRecorder Contract
implemented

PrismaAuditRecorder
implemented

Durable persistence
audit_records

First real consumer
Identity privileged Role-assignment authorization decision

Allowed decision Audit
implemented

Denied decision Audit
implemented

Required Audit failure behavior
protected mutation fails closed

Kernel Audit unit tests
11 / 11 PASS

Identity unit tests
84 / 84 PASS

Repository PostgreSQL integration
118 / 118 PASS

Prisma
9 migrations
schema up to date

P3-M05 — Taxonomy
DEFERRED — pending real Knowledge classification consumer

Kernel Taxonomy package
not created

Taxonomy persistence migration
not required

Activation gate
Phase 4 P4-M05 Taxonomy Integration

P3-M06 — Relationships
DEFERRED — pending real Knowledge relationship consumer

Kernel Relationships package
not created

Relationship persistence migration
not required

Graph Database
not introduced

Activation gate
Phase 4 P4-M06 Relationship Integration

P3-M07 — Architecture Enforcement Expansion
CLOSED

New rule
applications-do-not-deep-import-package-source

New rule
packages-do-not-deep-import-other-package-source

New rule
package-production-does-not-depend-on-foreign-infrastructure

Application deep-import negative proof
PASS — rejected

Package deep-import negative proof
PASS — rejected

Foreign-infrastructure negative proof
PASS — rejected

Repository format check
PASS

Repository lint
12 / 12 Turbo tasks PASS

Production build through architecture:check
13 / 13 Turbo tasks PASS

Final architecture
307 modules
718 dependencies
0 violations

Git diff validation
PASS

P3-M07 implementation checkpoint
aaf6e80 feat(architecture): expand package boundary enforcement

P3-M07 GitHub Actions CI / Validate
PASS
```

Phase 3 closure additionally proves:

```text
all currently justified Kernel semantics are implemented;

unjustified Kernel semantics were deferred rather than scaffolded;

Identity consumes ResourceId, NamespacedKey, and Audit where relevant;

Kernel remains Universe-neutral;

package owners retain public Contract control;

application composition roots may still compose infrastructure;

production packages cannot bypass foreign owners through infrastructure imports;

no Redis, Kafka, RabbitMQ, Graph Database, or speculative distributed system was introduced.
```

Phase 3 exit outcome:

```text
MINIMAL SHARED SEMANTIC KERNEL
```

The Phase 3 roadmap closure is represented by the annotated `phase-3-complete` tag at `9b424ee96e1722e4fa6774580b960284ab071dbe` (`docs(roadmap): close P3-M07 and Phase 3`).

The next phase is:

```text
Phase 4 — Knowledge Platform
```

The current next milestone is:

```text
P4-M08 — Knowledge Events
```

---

# 384. Phase 4 Completion Evidence

Current completed Phase 4 evidence:

```text
P4-M01 — Knowledge Resource Model
CLOSED

Package
@ai-world/platform-knowledge

Canonical public model
KnowledgeResource

Shared semantics
ResourceId
NamespacedKey-backed Universe and Resource Type association
DRAFT-only initial lifecycle
createdAt / updatedAt persistence timestamps

Persistence
knowledge_resources

Migration
20260814135808_knowledge_resource_baseline

Canonical migration count
10

Implementation checkpoint
af7edb8 feat(knowledge): establish knowledge resource baseline

Implementation CI
GitHub Actions CI / Validate — PASS

P4-M02 — Typed Domain Resource Support
CLOSED

Package
@ai-world/universe-devotional

First typed domain model
DeityResource

Devotional Universe key
universe.devotional

Deity Resource Type key
devotional.deity

Domain-specific field
name: string

Dependency direction
Devotional → Knowledge public Contract

Knowledge source change for P4-M02
NONE

Prisma / migration change for P4-M02
NONE

Anime package
NOT MATERIALIZED

History package
NOT MATERIALIZED

Focused Devotional tests
3 / 3 PASS

P4-M02 architecture
316 modules
734 dependencies
0 violations

Implementation checkpoint
dbb4a9a feat(devotional): establish deity resource type

P4-M02 implementation CI
GitHub Actions CI / Validate — PASS


P4-M03 — Knowledge CRUD Baseline
CLOSED

Public owner operations
CreateKnowledgeResource
GetKnowledgeResource
UpdateKnowledgeResource

Public persistence Contracts
KnowledgeResourceReader
KnowledgeResourceWriter

Knowledge infrastructure
PrismaKnowledgeResourceRepository
@ai-world/platform-knowledge/infrastructure

Create lifecycle
DRAFT

Update scope
resourceType only

Immutable through P4-M03 update
id
universeKey
lifecycle
createdAt

Not-found semantic
knowledge.resource.not_found

Prisma / migration change
NONE

Canonical migration count
10

Knowledge unit tests
11 / 11 PASS

Knowledge PostgreSQL integration tests
5 / 5 PASS

Devotional source change
NONE

Anime package
NOT MATERIALIZED

History package
NOT MATERIALIZED

P4-M03 architecture
328 modules
785 dependencies
0 violations

Implementation checkpoint
c82a325 feat(knowledge): establish crud baseline

P4-M03 implementation CI
GitHub Actions CI / Validate — PASS

P4-M04 — Knowledge Authorization
CLOSED

Protected actor-facing operations
CreateKnowledgeResourceAsActor
UpdateKnowledgeResourceAsActor

Authorization Contract
EvaluatePermission
@ai-world/platform-identity-access public Contract

Knowledge-owned Permission keys
knowledge.resource.create
knowledge.resource.update

Identity-owned capability Role
knowledge-editor

Grant baseline
administrator → create/update
knowledge-editor → create/update
ordinary User → no automatic Role assignment / denied by default

Forbidden semantic
knowledge.authorization.forbidden
kind: forbidden

Authorization ordering
before underlying validation, target lookup, or mutation

Denied missing-target update
forbidden without existence disclosure

Authorized missing-target update
knowledge.resource.not_found

Migration
20260815130500_knowledge_authorization_baseline

Prisma schema change
NONE

Canonical migration count
11

Knowledge unit tests
17 / 17 PASS

Knowledge PostgreSQL integration tests
10 / 10 PASS

P4-M04 architecture
336 modules
820 dependencies
0 violations

API / Web change
NONE

Devotional source change
NONE

Anime package
NOT MATERIALIZED

History package
NOT MATERIALIZED

Implementation checkpoint
e42b3b3 feat(knowledge): establish authorization baseline

P4-M04 implementation CI
GitHub Actions CI run 31889564998 — PASS

P4-M05 — Taxonomy Integration
DEFERRED — no implemented Devotional classification consumer

Demand-review evidence
DeityResource is the only implemented Devotional Resource type
DeityResource currently adds name only
Taxonomy Kernel package NOT MATERIALIZED
Taxonomy persistence NONE
Prisma schema change NONE
Database migration NONE
Canonical migrations remain 11
Devotional source change NONE
Knowledge source change NONE

P4-M06 — Relationship Integration
DEFERRED — no implemented Devotional Resource-to-Resource relationship consumer

Demand-review evidence
DeityResource is the only implemented Devotional Resource type
Second Devotional Resource type NONE
TempleResource NOT MATERIALIZED
Relationships Kernel package NOT MATERIALIZED
Relationship persistence NONE
Prisma schema change NONE
Database migration NONE
Canonical migrations remain 11
Devotional source change NONE
Knowledge source change NONE

P4-M07 — Knowledge Lifecycle
CLOSED

Lifecycle
DRAFT -> PUBLISHED -> ARCHIVED

Allowed transitions
DRAFT -> PUBLISHED
PUBLISHED -> ARCHIVED

Reverse transitions
NONE

Lifecycle owner operations
PublishKnowledgeResource
ArchiveKnowledgeResource

Protected actor operations
PublishKnowledgeResourceAsActor
ArchiveKnowledgeResourceAsActor

Permission actions
knowledge.resource.publish
knowledge.resource.archive

Lifecycle conflict
knowledge.resource.lifecycle_conflict

Prisma schema change
NONE

Data-only migration
20260815162000_knowledge_lifecycle_authorization

Canonical migrations
12

Implementation checkpoint
aaa9e88 feat(knowledge): establish lifecycle baseline

Implementation CI
GitHub Actions run 31895231315 — PASS

Local validation
21 / 21 steps PASS
25 unit tests PASS
15 integration tests PASS
347 modules / 875 dependencies / 0 architecture violations
```

The four P4-M01 unit tests prove the initial lifecycle vocabulary. The PostgreSQL integration proof establishes durable ResourceId/NamespacedKey-backed persistence and duplicate identifier rejection.

P4-M01 deliberately introduced no generic JSON payload, Universe registry, Taxonomy, Relationships, Events, API, Web behavior, or expanded lifecycle.

P4-M02 then proved the first real Universe-owned typed specialization without changing Knowledge, persistence, or the canonical lifecycle. It deliberately created only Devotional and kept Anime and History unmaterialized.

P4-M03 then established canonical Knowledge-owned create/read/update operations and Prisma-backed persistence behind public Knowledge Contracts. It kept the existing schema and migration count unchanged, kept lifecycle at DRAFT, and limited the update operation to `resourceType`.

P4-M04 then protected Knowledge create/update mutations through the shared Identity & Access permission evaluator, added the Identity-owned `knowledge-editor` Role and Knowledge-owned create/update Permission actions, proved Administrator, editor, and ordinary User behavior against real PostgreSQL, preserved denial non-disclosure, and introduced only the required data-only authorization migration.

P4-M05 then demand-reviewed Taxonomy against the currently implemented Devotional domain. Because only `DeityResource` exists and it currently requires no reusable classification semantic, Taxonomy remains deferred and unmaterialized rather than being scaffolded speculatively.

P4-M06 then demand-reviewed Relationships against the same implemented Devotional domain. Because there is still only `DeityResource`, with no second implemented Devotional Resource such as `TempleResource`, there is no real reusable Resource-to-Resource relationship consumer. Relationships therefore remains deferred and unmaterialized.

Phase 4 remains active.

P4-M07 closed the first real Knowledge publication lifecycle with explicit `DRAFT -> PUBLISHED -> ARCHIVED` semantics, protected publish/archive operations, conditional persistence transitions, and no generic Workflow engine. Events remain separate and are evaluated in P4-M08.

The current next milestone is:

```text
P4-M08 — Knowledge Events
```

Phase 4 eventual completion evidence is expected to demonstrate Devotional and the later Anime reuse-test Universe operating through one shared Knowledge Platform. History remains the later third structural reuse test after Devotional and Anime have exercised enough shared capabilities for reuse to be measured.

---

# 385. Phase 5 Completion Evidence

Expected:

```text
same Media Platform
```

serving both proof Universes.

---

# 386. Phase 6 Completion Evidence

Expected:

```text
same Discovery Platform
```

searching both Universes.

---

# 387. Phase 7 Completion Evidence

Expected:

```text
one governed AI Platform
```

serving both Universes without Provider leakage.

---

# 388. Phase 8 Completion Evidence

Expected:

```text
structured creator experience
```

composing shared Resources.

---

# 389. Phase 9 Completion Evidence

Expected:

```text
cross-Universe user engagement.
```

---

# 390. Phase 10 Completion Evidence

Expected:

```text
operational production readiness.
```

---

# 391. Long-Term Roadmap After Phase 10

Potential future directions include:

```text
additional Universes;

advanced localization;

mobile clients;

advanced personalization;

semantic discovery;

advanced AI Tools;

controlled Agents;

spatial experiences;

AR/VR/XR;

external developer APIs;

third-party extension ecosystems;

Commerce
```

only when product direction requires them.

---

# 392. Future Capabilities Remain Evidence-Driven

The Vision permits broad future experiences.

The roadmap does not obligate AI World to build all of them.

---

# 393. Long-Term Architecture Goal

The roadmap should steadily reduce:

```text
cost of adding a Universe
```

toward:

```text
domain modeling + configuration + content.
```

---

# 394. Long-Term Engineering Goal

Future engineers should be able to implement a new feature by identifying:

```text
its Capability;

its owner;

its Contracts;

its dependencies
```

without understanding the entire Platform implementation.

---

# 395. Long-Term Product Goal

Users should experience:

```text
one AI World
```

across many Universes.

---

# 396. Long-Term Creator Goal

Creators should increasingly build through:

```text
structured content;

configuration;

relationships;

taxonomy;

workflows;

AI assistance;

composition
```

rather than repetitive engineering.

---

# 397. Long-Term Operations Goal

Infrastructure should evolve with:

```text
measured scale
```

rather than speculative scale.

---

# 398. Master Roadmap Summary

```text
PHASE 0
ARCHITECTURE FOUNDATION
    COMPLETE
    ✅ Architecture contract
    ✅ Repository architecture
    ✅ Technology stack
    ✅ Master roadmap


PHASE 1
ENGINEERING FOUNDATION
    COMPLETE
    EXIT: ENGINEERING-READY
    ✅ Workspace
    ✅ API
    ✅ Web
    ✅ Configuration
    ✅ Database
    ✅ Migrations
    ✅ Observability
    ✅ Testing
    ✅ CI
    ✅ Architecture boundary baseline


PHASE 2
IDENTITY PLATFORM
    COMPLETE
    EXIT: ONE SHARED IDENTITY PLATFORM
    ✅ P2-M01 Actor and User Baseline — CLOSED
    ✅ P2-M02 Registration — CLOSED
    ✅ P2-M03 Password Authentication — CLOSED
    ✅ P2-M04 Session Management — CLOSED
    ✅ P2-M05 Email Verification — CLOSED
    ✅ P2-M06 Recovery — CLOSED
    ✅ P2-M07 User Profile — CLOSED
    ✅ P2-M08 Roles and Permissions — CLOSED
    ✅ P2-M09 Owner-Side Authorization — CLOSED
    ✅ P2-M10 Session Security UX — CLOSED


PHASE 3
PLATFORM KERNEL BASELINE
    COMPLETE
    EXIT: MINIMAL SHARED SEMANTIC KERNEL
    ✅ P3-M01 Identifiers — CLOSED
    ✅ P3-M02 Namespace — CLOSED
    ↷  P3-M03 Events — DEFERRED (pending real consumer)
    ✅ P3-M04 Audit — CLOSED
    ↷  P3-M05 Taxonomy — DEFERRED (pending real Knowledge classification consumer)
    ↷  P3-M06 Relationships — DEFERRED (pending real Knowledge relationship consumer)
    ✅ P3-M07 Architecture Enforcement Expansion — CLOSED
    ✅ 307 modules / 718 dependencies / 0 violations
    ✅ P3-M07 CI / Validate — PASS
    ✅ phase-3-complete ESTABLISHED


PHASE 4
KNOWLEDGE
    ACTIVE
    ✅ P4-M01 Knowledge Resource Model — CLOSED
    ✅ P4-M02 Typed Domain Resource Support — CLOSED
    ✅ P4-M03 Knowledge CRUD Baseline — CLOSED
    ✅ P4-M04 Knowledge Authorization — CLOSED
    ↷  P4-M05 Taxonomy Integration — DEFERRED (no implemented Devotional classification consumer)
    ↷  P4-M06 Relationship Integration — DEFERRED (no implemented Devotional Resource-to-Resource relationship consumer)
    ✅ P4-M07 Knowledge Lifecycle — CLOSED
    → P4-M08 Knowledge Events — NEXT
    Canonical Knowledge
    Typed domain resources
    Devotional v1
    Anime v1
    Sources/provenance when required
    relationships when required
    taxonomy when required
    History later third-Universe reuse test


PHASE 5
MEDIA
    NOT STARTED
    Assets
    Storage
    Upload
    Processing
    Delivery


PHASE 6
DISCOVERY
    NOT STARTED
    Search
    Filters
    Ranking
    Cross-Universe discovery


PHASE 7
AI / CREATOR
    NOT STARTED
    Provider Adapter
    Generation
    Context
    Provenance
    Safety
    Creator assistance


PHASE 8
COMPOSITION / CMS
    NOT STARTED
    Pages
    Blocks
    Editing
    Preview
    Publishing
    AI-assisted creation


PHASE 9
ENGAGEMENT
    NOT STARTED
    Favorites
    Collections
    optional Progress
    Notifications
    Personalization


PHASE 10
PRODUCTION OPERATIONS
    NOT STARTED
    Environments
    Deployment
    Observability
    Backup
    Recovery
    Security
    Performance
    Scaling
    Cost
    Runbooks
```

---

# 399. Historical Immediate Next Action at Phase 0 Acceptance

Upon acceptance of this roadmap:

```text
PHASE 0
CLOSED

PHASE 1
AUTHORIZED
```

The next work is not another Phase 0 architecture document.

The next work is:

```text
Phase 1 — Engineering Foundation
```

beginning with repository/workspace implementation.

---

# 400. Historical First Implementation Sequence

The initial implementation should proceed approximately:

```text
1. Verify clean repository baseline

2. Establish pnpm workspace

3. Establish Turborepo

4. Establish root TypeScript / ESLint / Prettier configuration

5. Create apps/api

6. Create apps/web

7. Implement Configuration Foundation

8. Establish local PostgreSQL

9. Implement Database Foundation

10. Establish Prisma

11. Establish Migration workflow

12. Establish structured logging

13. Establish health endpoints

14. Establish testing infrastructure

15. Establish GitHub Actions CI

16. Establish initial architecture boundary checks

17. Perform Phase 1 closure review.
```

The exact command-by-command sequence may be refined during implementation without changing this roadmap.

---

# 401. Historical Coding Authorization at Phase 0 Acceptance

From the moment this document is accepted:

```text
CODING
ALLOWED

CURRENT IMPLEMENTATION PHASE
PHASE 1 — ENGINEERING FOUNDATION
```

---

# 402. What This Document Decides

This document decides:

```text
the authoritative AI World phase sequence;

the point at which implementation begins;

the scope and intent of Phases 1–10;

the Proof Universe timing;

the first implementation sequence;

the demand-driven Kernel/Foundation strategy;

the timing of Media, Discovery, AI, CMS, Engagement, and Operations;

the infrastructure introduction gates;

phase closure expectations;

roadmap governance;

the transition from architecture design to implementation.
```

---

# 403. What This Document Does Not Decide

This document does not fix:

```text
calendar dates;

team capacity;

sprint duration;

exact release numbers;

exact story estimates;

exact dependency versions;

exact class/file implementation;

future product priorities not yet validated.
```

Those evolve through execution planning.

---

# 404. Relationship to Future Roadmaps

Future roadmap detail may appear under:

```text
docs/13-roadmaps/foundation-roadmap.md

docs/13-roadmaps/platform-roadmap.md

docs/13-roadmaps/module-roadmap.md

docs/13-roadmaps/universe-roadmap.md

docs/13-roadmaps/release-roadmap.md
```

when needed.

They must remain subordinate to this Master Roadmap.

---

# 405. Relationship to Technical Debt

Tracked architecture/implementation compromises belong in:

```text
docs/13-roadmaps/technical-debt.md
```

when that document is activated.

Debt must not silently redefine the roadmap.

---

# 406. Relationship to Architecture

Architecture answers:

```text
WHAT SHOULD AI WORLD BE?
```

and:

```text
HOW SHOULD IT BE STRUCTURED?
```

The Master Roadmap answers:

```text
IN WHAT ORDER WILL WE BUILD IT?
```

---

# 407. Final Roadmap Statement

> **AI World will move from architecture into implementation through a controlled sequence of increasingly valuable and increasingly demanding capabilities. Engineering Foundations will establish a reliable development platform; Identity will establish one secure Actor and User model; the Platform Kernel will introduce only the semantic primitives required by real consumers; Knowledge will prove the architecture first across Devotional and Anime, with History retained as the later third structural reuse test; Media and Discovery will provide shared content and exploration capabilities; AI will operate on canonical Platform data through governed provider-independent boundaries; Composition will enable creators to build Experiences; Engagement will connect Users across Universes; and Production Operations will mature the Platform into a durable production system.**

The governing delivery principle is:

```text
BUILD THE NEXT REAL CAPABILITY

REUSE WHAT ALREADY EXISTS

INTRODUCE INFRASTRUCTURE ONLY WHEN REQUIRED

VALIDATE THROUGH WORKING SOFTWARE

CLOSE EACH PHASE

THEN CONTINUE.
```

---

# 408. Phase 0 Closure

```text
PHASE
Phase 0 — Architecture Foundation

STATUS
COMPLETE

DOCUMENTS
18 / 18 COMPLETE

ARCHITECTURE
ACCEPTED

TECHNOLOGY STRATEGY
ACCEPTED

REPOSITORY ARCHITECTURE
ACCEPTED

MASTER ROADMAP
ACCEPTED

PRODUCTION SOURCE CODE
NOT YET IMPLEMENTED

CODING STATUS
AUTHORIZED

NEXT PHASE
Phase 1 — Engineering Foundation

NEXT ACTION
Begin implementation of the AI World repository/workspace baseline.
```

---

# 409. Acceptance

The following block preserves the Phase 0 acceptance snapshot from 2026-08-08. Current delivery status is tracked in Sections 23A, 104, 106, 107, 383, 398, 410, and 411.

```text
DOCUMENT
P0-D18 — AI World Master Roadmap

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
P0-D17 — Technology Strategy

PHASE 0 STATUS
COMPLETE

NEXT PHASE
PHASE 1 — ENGINEERING FOUNDATION

NEXT IMPLEMENTATION MILESTONE
P1-M01 — Workspace Bootstrap

IMPLEMENTATION STATUS
AUTHORIZED TO BEGIN
```

---

# 410. Current Delivery Snapshot

As of the latest roadmap review:

```text
DATE
2026-08-15

CURRENT PHASE
Phase 4 — Knowledge Platform

STATUS
ACTIVE

COMPLETED IN PHASE 4
P4-M01 — Knowledge Resource Model
P4-M02 — Typed Domain Resource Support
P4-M03 — Knowledge CRUD Baseline
P4-M04 — Knowledge Authorization
P4-M07 — Knowledge Lifecycle

DEFERRED IN PHASE 4
P4-M05 — Taxonomy Integration — no implemented Devotional classification consumer
P4-M06 — Relationship Integration — no implemented Devotional Resource-to-Resource relationship consumer

NEXT MILESTONE
P4-M08 — Knowledge Events

UNIVERSE IMPLEMENTATION / REUSE ORDER
Devotional
    first implementation — MATERIALIZED
    ↓
Anime
    second-Universe reuse test — DEFERRED
    ↓
History
    third structural reuse test — DEFERRED

P4-M01 ROADMAP AMENDMENT EFFECT
NONE — P4-M01 remains CLOSED and its implementation is unchanged

P4-M02 RESULT
@ai-world/universe-devotional
DeityResource
universe.devotional
devotional.deity
Knowledge unchanged
Prisma unchanged
Anime not materialized
History not materialized

P4-M03 RESULT
CreateKnowledgeResource
GetKnowledgeResource
UpdateKnowledgeResource
KnowledgeResourceReader
KnowledgeResourceWriter
PrismaKnowledgeResourceRepository
resourceType-only update
knowledge.resource.not_found
DRAFT lifecycle retained
Prisma schema unchanged
No new migration
Canonical migrations: 10
Knowledge unit tests: 11 / 11 PASS
Knowledge integration tests: 5 / 5 PASS
Architecture: 328 modules / 785 dependencies / 0 violations
Devotional source unchanged
Anime not materialized
History not materialized

P4-M04 RESULT
CreateKnowledgeResourceAsActor
UpdateKnowledgeResourceAsActor
EvaluatePermission
knowledge.resource.create
knowledge.resource.update
knowledge-editor Role owned by Identity & Access
administrator and knowledge-editor both granted create/update
ordinary persisted User with zero Roles denied
knowledge.authorization.forbidden
authorization before validation / target lookup / mutation
denied missing-target update does not disclose existence
authorized missing-target update preserves knowledge.resource.not_found
data-only authorization migration
20260815130500_knowledge_authorization_baseline
Prisma schema unchanged
Canonical migrations: 11
Knowledge unit tests: 17 / 17 PASS
Knowledge integration tests: 10 / 10 PASS
Architecture: 336 modules / 820 dependencies / 0 violations
API / Web unchanged
Devotional source unchanged
Anime not materialized
History not materialized

P4-M05 DEMAND REVIEW RESULT
DeityResource only implemented Devotional Resource type
No reusable Devotional classification requirement
Taxonomy Kernel not materialized
Taxonomy persistence none
Prisma schema unchanged
No migration
Canonical migrations remain 11
Decision: DEFERRED

P4-M06 DEMAND REVIEW RESULT
DeityResource only implemented Devotional Resource type
Second Devotional Resource type none
TempleResource not materialized
No reusable Devotional Resource-to-Resource relationship requirement
Relationships Kernel not materialized
Relationship persistence none
Prisma schema unchanged
No migration
Canonical migrations remain 11
Decision: DEFERRED

P4-M07 IMPLEMENTATION RESULT
Knowledge lifecycle DRAFT -> PUBLISHED -> ARCHIVED
Allowed transitions DRAFT -> PUBLISHED and PUBLISHED -> ARCHIVED
Reverse transitions none
Publish/archive owner operations implemented
Actor-facing publish/archive authorization implemented
Permissions knowledge.resource.publish / knowledge.resource.archive
Administrator + knowledge-editor granted both
Ordinary User default deny preserved
Lifecycle conflict knowledge.resource.lifecycle_conflict
Prisma schema unchanged
Data-only migration 20260815162000_knowledge_lifecycle_authorization
Canonical migrations 12
Implementation aaa9e88
CI run 31895231315 PASS
Local validation 21 / 21 PASS
Decision: CLOSED

BLOCKED
None

PHASE 3 TAG STATUS
phase-3-complete ESTABLISHED

P4-M01 IMPLEMENTATION
af7edb8 feat(knowledge): establish knowledge resource baseline

P4-M01 IMPLEMENTATION CI
GREEN

P4-M02 IMPLEMENTATION
dbb4a9a feat(devotional): establish deity resource type

P4-M02 IMPLEMENTATION CI
GREEN

P4-M03 IMPLEMENTATION
c82a325 feat(knowledge): establish crud baseline

P4-M03 IMPLEMENTATION CI
GREEN

P4-M04 IMPLEMENTATION
e42b3b3 feat(knowledge): establish authorization baseline

P4-M04 IMPLEMENTATION CI
GREEN — GitHub Actions run 31889564998

DEFERRED / DEMAND-DRIVEN
P3-M03 Events remains deferred until a real producer/consumer requirement exists.
P3-M05 Taxonomy remains deferred until an implemented Resource requires reusable shared classification semantics.
P3-M06 Relationships remains deferred until implemented Resources require a reusable typed Resource-to-Resource connection.
Metadata remains deferred until a real consumer requires it.
Workflow remains deferred until a real consumer requires it.
Policy remains deferred until a real consumer requires it.
Localization remains deferred until a real consumer requires it.
Versioning remains deferred until a real consumer requires it.
Audit Query remains deferred until a real search/view consumer exists.
Audit Retention remains deferred until a real retention requirement exists.
Distributed Event infrastructure remains deferred; no Kafka or RabbitMQ is justified.
Graph Database remains deferred; future Relationships should begin with PostgreSQL when required.
Universe-specific Kernel behavior remains forbidden.
```

## Historical Phase 3 Ownership Result at Closure

```text
Platform Kernel
    owns canonical shared semantic primitives
    currently materialized through Identifiers, Namespace, and Audit

Identifiers Kernel
    owns ResourceId semantics
    owns canonical generation
    owns canonical validation
    owns canonical parsing

Namespace Kernel
    owns NamespacedKey syntax
    owns NamespacedKey validation
    owns NamespacedKey parsing

Audit Kernel
    owns Audit Record semantics
    owns Audit Record validation
    owns AuditRecorder Contract
    owns durable Audit Record mechanism
    owns Prisma Audit persistence implementation

Identity & Access Platform
    owns Actor
    owns Permission semantics
    owns Role semantics
    owns authorization decision meaning
    consumes ResourceId for Actor.id
    consumes NamespacedKey for Permission keys
    publishes accountability information through Audit Contracts
    does not write Audit tables directly

User Platform
    owns User
    consumes ResourceId for User.id
    consumes ResourceId for User.actorId

Database Foundation
    owns Prisma/PostgreSQL persistence mechanics
    does not own ResourceId, NamespacedKey, or Audit business semantics
```

## P3-M01 Canonical Identifier Baseline

```text
Package
@ai-world/kernel-identifiers

Semantic type
ResourceId

Runtime representation
string

Canonical format
lowercase UUID v4

Generation
node:crypto randomUUID()

Validation
strict canonical UUID v4

Normalization
none

Persistence
existing PostgreSQL UUID

Database migration
none
```

P3-M01 deliberately avoids:

```text
identifier microservice;

central identifier table;

new distributed ID generator;

ULID/NanoID/Snowflake expansion;

Phase 2 identifier rewrite;

object-wrapper ceremony without a real requirement.
```

## P3-M01 Real Consumers

```text
Actor.id
    ResourceId

User.id
    ResourceId

User.actorId
    ResourceId
```

This is the first proof that a Kernel semantic can be consumed by multiple real Platforms without moving Platform ownership into the Kernel.

## P3-M01 Persistence Result

```text
Prisma schema change
NONE

New migration
NONE

Canonical migrations
8

Database status
schema up to date
```

The existing UUID persistence established in Phase 2 was compatible with the finalized ResourceId semantic baseline.

## P3-M01 Final Validation

```text
Format check
PASS

Lint
10 / 10 PASS

TypeScript
19 / 19 PASS

Kernel Identifiers unit tests
11 / 11 PASS

Identity unit tests
83 / 83 PASS

API unit/e2e tests
12 / 12 PASS

Web Vitest tests
20 / 20 PASS

Root normal Turbo tasks
15 / 15 PASS

Identity PostgreSQL integration
41 / 41 PASS

User PostgreSQL integration
6 / 6 PASS

API PostgreSQL integration
71 / 71 PASS

Repository PostgreSQL integration
118 / 118 PASS

Real Chromium Playwright E2E
2 / 2 PASS

Root Turborepo E2E
2 / 2 PASS

Prisma validation
PASS

Prisma migration status
8 migrations
schema up to date

Production build
11 / 11 PASS

Architecture
286 modules
672 dependencies
0 violations

Generated-output ignore validation
PASS

Git diff validation
PASS

GitHub Actions CI / Validate
PASS
```

## P3-M01 Implementation Checkpoint

```text
feat(kernel): establish resource identifier baseline
```

The implementation commit passed remote CI. The exact hash is intentionally not fabricated in this documentation update because it was not captured in the supplied closure input.

## P3-M02 Canonical Namespace Baseline

```text
Package
@ai-world/kernel-namespace

Semantic type
NamespacedKey

Runtime representation
string

Canonical structure
lowercase dot-separated segments

Minimum segments
2

Maximum length
128 characters

Segment start
lowercase ASCII letter

Allowed subsequent segment characters
lowercase ASCII letters
digits
single internal hyphens

Validation
strict

Normalization
none

Database migration
none
```

P3-M02 deliberately avoids:

```text
central Namespace registry;

Namespace service;

Namespace persistence table;

forced Role-key migration;

forced error-code migration;

Redis;

Queue;

Kafka;

RabbitMQ.
```

## P3-M02 Real Consumer

The existing Identity Permission key is the first production consumer:

```text
identity.authorization.manage
```

The policy constant is validated through:

```text
parseNamespacedKey()
```

and the Namespace semantic is applied to:

```text
Permission.key

EvaluatePermissionInput.permissionKey

EvaluateActorPermissionInput.permissionKey
```

The local Role key remains:

```text
administrator
```

because P3-M02 does not namespace every local string without a collision requirement.

## P3-M02 Persistence Result

```text
Prisma schema change
NONE

New migration
NONE

Canonical migrations
8

Database status
schema up to date
```

The existing persisted Permission key already satisfies the canonical NamespacedKey contract.

## P3-M02 Final Validation

```text
Kernel Namespace unit tests
19 / 19 PASS

Repository lint
11 / 11 Turbo tasks PASS

Repository TypeScript
21 / 21 Turbo tasks PASS

Identity unit tests
83 / 83 PASS

Repository normal test tasks
17 / 17 Turbo tasks PASS

Identity PostgreSQL integration
41 / 41 PASS

User PostgreSQL integration
6 / 6 PASS

API PostgreSQL integration
71 / 71 PASS

Repository PostgreSQL integration
118 / 118 PASS

Integration Turbo tasks
13 / 13 PASS

SMTP → Mailpit
2 / 2 PASS

Chromium E2E
2 / 2 PASS

Prisma validation
PASS

Prisma migration status
8 migrations
schema up to date

Production build
12 / 12 Turbo tasks PASS

Architecture
291 modules
681 dependencies
0 violations

Git diff validation
PASS

GitHub Actions CI / Validate
PASS
```

## P3-M03 Event Demand Review

P3-M03 was reviewed before implementation and intentionally deferred.

Repository inspection found:

```text
production business Event publisher
NONE

production business Event subscriber
NONE

publish/subscribe/dispatch mechanism
NONE

current eventual-consistency requirement
NONE

current durable Event delivery requirement
NONE
```

Existing React `FormEvent` usage is browser UI behavior and is unrelated to the Platform Kernel Event capability. Existing API `requestId` values remain transport/error correlation and do not justify a generalized business Event envelope.

P3-M03 therefore adds no source package, persistence model, migration, broker, queue, or Event bus.

The first strong future consumer remains Knowledge lifecycle Events in Phase 4 unless an earlier concrete producer/consumer requirement appears.

P3-M04 Audit proceeded independently because Audit Records, business Events, and operational logs remain separate semantics. P3-M03 remains deferred.

## P3-M04 Canonical Audit Baseline

```text
Package
@ai-world/kernel-audit

Primary semantic
AuditRecord

Record identifier
ResourceId

Actor identifier
ResourceId

Action
NamespacedKey

Resource type
NamespacedKey

Resource identifier
ResourceId

Result
NamespacedKey

Context
optional flat primitive business context

Timestamp
recordedAt

Durable implementation
PrismaAuditRecorder

Persistence
audit_records

Migration
20260812162301_audit_record_baseline
```

P3-M04 deliberately avoids:

```text
Event dependency;

Audit Event bus;

Kafka;

RabbitMQ;

Redis Streams;

outbox;

Audit query API;

Audit viewing UI;

retention framework;

nested arbitrary metadata;

direct Platform writes to Audit tables.
```

## P3-M04 Real Consumer

The first production consumer is the protected Identity operation:

```text
AssignRoleToActorAsActor
```

Identity owns the business meaning of the authorization decision.

Canonical first action:

```text
identity.authorization.role-assignment.decision
```

Canonical target Resource type:

```text
identity.actor
```

The Audit result records whether authorization was allowed or denied, and the requested local `roleKey` is supplied as flat business context.

The action is intentionally an authorization decision rather than a claim that the Role mutation completed.

For the allowed path:

```text
authorization allowed
    ↓
Audit decision persisted
    ↓
protected mutation may execute
```

If required Audit persistence fails, the protected Role-assignment mutation does not execute.

For the denied path, the decision is audited before the canonical forbidden response when Audit persistence succeeds. Target/Role existence remains undisclosed because authorization denial still occurs before target/Role lookup.

## P3-M04 Persistence Result

```text
Prisma schema change
YES

New table
audit_records

New migration
20260812162301_audit_record_baseline

Canonical migrations
9

Database status
schema up to date
```

The canonical persisted record contains:

```text
id
actor_id
action
resource_type
resource_id
result
context
recorded_at
```

## P3-M04 Final Validation

```text
Format check
PASS

Lint
12 / 12 Turbo tasks PASS

TypeScript
23 / 23 Turbo tasks PASS

Kernel Audit unit tests
11 / 11 PASS

Identity unit tests
84 / 84 PASS

API unit/e2e tests
12 / 12 PASS

Web Vitest tests
20 / 20 PASS

Root normal test tasks
19 / 19 Turbo tasks PASS

Identity PostgreSQL integration
41 / 41 PASS

User PostgreSQL integration
6 / 6 PASS

API PostgreSQL integration
71 / 71 PASS

Repository PostgreSQL integration
118 / 118 PASS

Focused Authorization API/PostgreSQL
12 / 12 PASS

Integration Turbo tasks
14 / 14 PASS

SMTP → Mailpit
2 / 2 PASS

Chromium E2E
2 / 2 PASS

Prisma validation
PASS

Prisma migration status
9 migrations
schema up to date

Production build
13 / 13 Turbo tasks PASS

Architecture
307 modules
718 dependencies
0 violations

Git diff validation
PASS

GitHub Actions CI / Validate
PASS
```

## P3-M04 Implementation Checkpoint

```text
8a0be6b feat(kernel): establish audit baseline
```

The implementation checkpoint is pushed to `origin/main` and remote CI is green.

## P3-M05 Taxonomy Demand Review

P3-M05 was reviewed against the implemented repository before creating a Taxonomy Kernel capability.

Current result:

```text
P3-M05 — Taxonomy
DEFERRED — no current Resource-classification consumer

Knowledge Platform
not implemented

Universe packages
not implemented

shared Resource classification
not present

Taxonomy package
not created

Taxonomy persistence
not introduced

database migration
not required
```

The first strong consumer remains Phase 4 Knowledge Taxonomy Integration when actual Knowledge Resources require reusable classification such as Anime Genre or History Era.

Wake-up condition:

```text
an implemented canonical Resource
requires reusable shared classification
through Taxonomy Definition / Term semantics
```

## P3-M06 Relationships Demand Review

P3-M06 was reviewed against the implemented repository before creating a Relationships Kernel capability.

Current result:

```text
P3-M06 — Relationships
DEFERRED — no current Resource-relationship consumer

Knowledge Platform
not implemented

Universe packages
not implemented

semantic Resource-to-Resource relationship
not present in production

Relationships package
not created

Relationship persistence
not introduced

Graph Database
not introduced

database migration
not required
```

Repository searches found Audit Resource references and ordinary capability-owned persistence relations, but no shared semantic Relationship Type/Instance consumer.

The architecture remains reserved for future Knowledge proof:

```text
Relationships Kernel
    owns shared mechanics

defining Platform / Universe
    owns concrete Relationship Type meaning

source and target Resource owners
    retain Resource ownership
```

The first strong consumer remains Phase 4 Knowledge Relationship Integration, with proof examples such as:

```text
Anime Character APPEARS_IN Series

History Person PARTICIPATED_IN Event
```

Wake-up condition:

```text
implemented canonical Resources
require a reusable typed connection
through shared Relationship mechanics
```

## P3-M07 Architecture Enforcement Expansion

P3-M07 is closed.

Final implementation result:

```text
Configuration
.dependency-cruiser.mjs

Canonical documentation
docs/03-engineering/architecture-boundaries.md

New rule
applications-do-not-deep-import-package-source

New rule
packages-do-not-deep-import-other-package-source

New rule
package-production-does-not-depend-on-foreign-infrastructure
```

The rules protect public package ownership without breaking legitimate composition:

```text
Application composition roots
may consume package infrastructure

Integration tests
may compose package infrastructure

Production package source
must not consume foreign package infrastructure

Applications and packages
must not bypass declared package exports by deep-importing foreign src files
```

Controlled negative proof:

```text
Identity production source → @ai-world/kernel-audit/infrastructure
REJECTED

User production source → kernel-identifiers/src/resource-id
REJECTED

API source → kernel-audit/src/create-audit-record
REJECTED
```

Final validation:

```text
Repository format check
PASS

Repository lint
12 / 12 Turbo tasks PASS

Production build through architecture:check
13 / 13 Turbo tasks PASS

Architecture
307 modules
718 dependencies
0 violations

Git diff validation
PASS

GitHub Actions CI / Validate
PASS
```

Implementation checkpoint:

```text
aaf6e80 feat(architecture): expand package boundary enforcement
```

P3-M07 introduced no package, persistence model, migration, queue, broker, Graph Database, or speculative Knowledge/Universe implementation.

## Historical Phase 3 Delivery Position at Closure

```text
PHASE
Phase 3 — Platform Kernel Baseline

STATUS
COMPLETE

EXIT OUTCOME
MINIMAL SHARED SEMANTIC KERNEL

P3-M01 — Identifiers
CLOSED

P3-M02 — Namespace
CLOSED

P3-M03 — Events
DEFERRED — pending real consumer

P3-M04 — Audit
CLOSED

P3-M05 — Taxonomy
DEFERRED — pending real Knowledge classification consumer

P3-M06 — Relationships
DEFERRED — pending real Knowledge relationship consumer

P3-M07 — Architecture Enforcement Expansion
CLOSED

BLOCKERS
NONE

PHASE EXIT
REACHED

NEXT PHASE
Phase 4 — Knowledge Platform

NEXT MILESTONE
P4-M01 — Knowledge Resource Model
```

At Phase 3 closure, the next implementation work after establishing the Phase 3 tag was:

```text
P4-M01 — Knowledge Resource Model
```

Phase 4 begins the first major multi-Universe proof. It should reactivate Events, Taxonomy, or Relationships only when concrete Knowledge operations establish their required contracts.

## Historical Phase 2 Closure Context

Phase 2 remains complete and tagged. The detailed closure snapshot below is retained so Phase 3 changes do not erase the Identity Platform evidence that established the first real consumers for Kernel work.

## Historical Phase 2 Ownership Result

```text
Identity & Access Platform
    owns Actor
    owns ActorEmail
    owns PasswordCredential
    owns Session
    owns verification lifecycle
    owns Recovery lifecycle
    owns Role
    owns Permission
    owns authorization evaluation
    owns protected authorization-management behavior

User Platform
    owns User
    owns User Profile
    owns display-name policy

Email Foundation
    owns provider-neutral email delivery
    owns SMTP adapter infrastructure

API Application
    owns HTTP transport
    owns runtime composition
    derives authenticated Actor from Session

Web Application
    owns browser presentation/state orchestration
    consumes API through same-origin /api boundary
    does not own authentication authority
    does not persist Session secrets
```

## Historical Phase 2 Canonical Security Baseline

```text
password hashing
Argon2id

password authentication
unknown-email and wrong-password public equivalence

Session model
opaque server-managed Session

Session persistence
SHA-256 token digest only

browser Session transport
HttpOnly
SameSite=Lax
Path=/
Secure in production

browser secret storage
no localStorage
no sessionStorage
not readable through document.cookie

verification token persistence
SHA-256 digest only

Recovery token persistence
SHA-256 digest only

Recovery reset
single-use
atomic password replacement
Actor-wide Session revocation

authorization
Role/Permission default-deny evaluation

owner-side enforcement
backend trusted boundary

acting Actor authority
validated Session only

profile ownership
validated Session only

frontend authorization
not trusted as enforcement
```

## Historical Phase 2 Canonical Privileged Baseline

```text
Role
administrator

Permission
identity.authorization.manage

Grant
administrator
    →
identity.authorization.manage
```

No Actor is assigned Administrator automatically.

Registration remains free of automatic Role assignment.

## Historical Phase 2 Persistence

Canonical migration history:

```text
20260809133830_actor_user_baseline

20260809170217_actor_email_password_credential

20260810123113_actor_session_baseline

20260811061735_actor_email_verification_baseline

20260811090103_actor_password_recovery_baseline

20260811110742_user_profile_baseline

20260811132518_identity_authorization_baseline

20260811144700_identity_authorization_administrator_baseline
```

Canonical migration count:

```text
8
```

Database status:

```text
schema up to date
```

P2-M10 introduced no new persistence migration.

## Historical P2-M10 Web Delivery

Implemented browser routes:

```text
/

/register

/sign-in

/account

/verify-email

/forgot-password

/reset-password
```

Implemented first-party browser flows:

```text
registration

password sign-in

Session state

logout

profile read/update

verification issuance

verification confirmation

Recovery request

Recovery reset
```

The Web API boundary is:

```text
Browser
    ↓
/api/*
    ↓
Next.js rewrite
    ↓
NestJS API
```

The first-party Web does not introduce a cross-origin CORS dependency for these flows.

## Historical P2-M10 Browser Security

Real Playwright proof validates:

```text
Session cookie created after sign-in;

Session cookie is HttpOnly;

Session cookie is SameSite=Lax;

Session cookie Path is /;

Session secret is inaccessible to document.cookie;

Session secret is absent from localStorage;

Session secret is absent from sessionStorage;

authenticated state survives reload;

same-origin /api/session works;

profile mutation submits displayName only;

profile mutation submits no actorId;

profile mutation submits no userId;

logout removes cookie;

post-logout /api/session returns 401;

reload remains signed out.
```

## Historical P2-M10 CI Correction

GitHub Actions provides:

```text
PostgreSQL
127.0.0.1:5432

DATABASE_URL
postgresql://ai_world:ai_world@127.0.0.1:5432/ai_world
```

The final E2E task configuration explicitly passes:

```text
DATABASE_URL
```

through Turborepo.

Playwright fails fast in CI if `DATABASE_URL` is unavailable.

The final remote browser proof therefore executes against real CI PostgreSQL rather than the developer-local `55432` fallback.

## Historical Phase 2 Final Validation

```text
Format check
PASS

Lint
9 / 9 PASS

TypeScript
17 / 17 PASS

Identity unit tests
83 / 83 PASS

API unit/e2e tests
12 / 12 PASS

Web Vitest tests
20 / 20 PASS

Root normal test tasks
13 / 13 PASS

Identity PostgreSQL integration
41 / 41 PASS

User PostgreSQL integration
6 / 6 PASS

API PostgreSQL integration
71 / 71 PASS

Repository PostgreSQL integration
118 / 118 PASS

Real SMTP → Mailpit
2 / 2 PASS

Real Chromium Playwright E2E
2 / 2 PASS

Prisma validation
PASS

Prisma migration status
8 migrations
schema up to date

Production build
10 / 10 PASS

Architecture
281 modules
664 dependencies
0 violations

Git diff validation
PASS

GitHub Actions CI / Validate
PASS
```

## Historical Phase 2 Implementation Checkpoints

Major implementation checkpoints include:

```text
15f7832 feat(identity): complete password recovery lifecycle

b560a45 feat(user): complete user profile lifecycle

7f8cfb3 feat(identity): complete roles and permissions baseline

30eeef4 feat(identity): enforce owner-side authorization

9c6ab56 feat(web): complete session security ux

05778dd fix(ci): pass database url to web e2e
```

The exact P2-M10 implementation hashes are now recorded above. Both commits passed remote CI validation before the Phase 2 documentation closure.

## Historical Phase 2 Documentation Debt

The following remain intentionally deferred:

```text
docs/13-roadmaps/README.md

docs/00-governance/documentation-standard.md

docs/00-governance/definition-of-done.md

docs/templates/closure-review-template.md
```

These placeholders do not invalidate Phase 2 because they do not define or alter the accepted Identity implementation/security closure criteria.

## Historical Phase 2 Closure

```text
PHASE
Phase 2 — Identity Platform

STATUS
COMPLETE

MILESTONES
10 / 10 CLOSED

EXIT OUTCOME
ONE SHARED IDENTITY PLATFORM

BLOCKERS
NONE

NEXT PHASE
Phase 3 — Platform Kernel Baseline
```

Phase 2 remains closed. Its completed Identity, User, Email, browser-security, persistence, and authorization evidence is retained here as historical closure context. Phase 3 has now also closed, and Phase 4 Knowledge is active.

---

# 411. Phase Completion Git Tags

AI World uses Git tags as durable repository markers for major roadmap phase completion.

Phase tags are:

```text
engineering roadmap checkpoints
```

They are not:

```text
product release versions.
```

Release/version tags remain governed separately from roadmap phase numbering.

## Phase Tag Naming

Canonical phase-completion tag format:

```text
phase-1-complete

phase-2-complete

phase-3-complete

...

phase-10-complete
```

Use lowercase names with the exact:

```text
phase-<number>-complete
```

pattern.

## Annotated Tags

Phase completion tags must be:

```text
annotated Git tags
```

rather than lightweight tags.

Example:

```text
git tag -a phase-2-complete -m "Phase 2 complete"
```

Annotated tags preserve:

```text
tagger identity;

tag creation time;

closure message;

explicit repository checkpoint.
```

## Tag Target Rule

A phase-completion tag should point to:

```text
the final phase documentation-closure commit
```

after:

```text
implementation is complete;

full local validation passes;

implementation CI is green;

roadmap documentation records closure;

documentation closure commit is pushed;

documentation closure CI is green.
```

Canonical sequence:

```text
implementation complete

    ↓

local closure validation

    ↓

implementation commit(s)

    ↓

remote CI green

    ↓

roadmap closure update

    ↓

documentation closure commit

    ↓

remote CI green

    ↓

annotated phase-completion tag

    ↓

push tag
```

This ensures a phase tag identifies the complete repository state containing:

```text
source;

tests;

migrations;

CI configuration;

architecture validation;

roadmap closure documentation.
```

## Milestone Tag Rule

Individual milestones do not receive Git tags by default.

Milestone history is already represented by:

```text
Git commits;

roadmap milestone sections;

CI history.
```

Creating tags for every:

```text
P1-M01

P1-M02

P2-M01

P2-M02

...
```

would add repository noise without materially improving phase-level traceability.

A milestone tag should be introduced only when a future operational or release requirement explicitly needs one.

## Historical Tag Backfill

A phase tag may be created after the phase originally closed.

Backfilling a tag:

```text
does not rewrite Git history.
```

The tag is attached to the exact historical closure commit.

Therefore earlier completed phases may receive tags when their canonical closure commit can be verified.

The rule is:

```text
identify exact closure commit

    ↓

verify it represents the completed phase state

    ↓

create annotated tag against that commit

    ↓

push tag
```

Do not guess historical closure hashes.

## Phase 1 Tag

Phase 1 is complete and the historical phase tag has been backfilled successfully.

Canonical tag:

```text
phase-1-complete
```

Verified tag target:

```text
d7c76bf0e8a54ffe8d96ecc15b0fe9063e429e3a
docs: document architecture boundary baseline
```

This commit is the final Phase 1 engineering/documentation checkpoint immediately before Phase 2 implementation begins.

The annotated tag has been pushed to the remote repository.

## Phase 2 Tag

Phase 2 is complete and its annotated phase-completion tag is established.

Canonical tag:

```text
phase-2-complete
```

Verified tag target:

```text
eb06e7ac1661efc1bdf182c53d79381d366473f9
docs(roadmap): close P2-M10 and Phase 2
```

The documentation-closure commit passed GitHub Actions CI / Validate before the tag was created.

The annotated tag has been pushed to the remote repository.

Current established phase tags:

```text
phase-1-complete
phase-2-complete
phase-3-complete
```

Phase 3 does not receive milestone tags for P3-M01, P3-M02, P3-M04, or P3-M07.

Phase 3 is complete and its annotated phase-completion tag is established.

Canonical tag:

```text
phase-3-complete
```

The P3-M07 implementation checkpoint:

```text
aaf6e80 feat(architecture): expand package boundary enforcement
```

is not the final Phase 3 tag target. The tag must point to the documentation-closure commit that contains this completed roadmap state, after that commit is pushed and its GitHub Actions CI / Validate run is green.

## Phase 3 Tag Status

Current Phase 3 repository-tag state:

```text
Phase 3 implementation
COMPLETE

P3-M07 implementation CI
GREEN

Phase 3 roadmap closure
COMPLETE

Phase 3 documentation closure commit
9b424ee96e1722e4fa6774580b960284ab071dbe

Phase 3 documentation closure CI
GREEN

phase-3-complete
ESTABLISHED
```

Verified tag target:

```text
9b424ee96e1722e4fa6774580b960284ab071dbe
docs(roadmap): close P3-M07 and Phase 3
```

## Release Tags Remain Separate

Phase tags must not be confused with product versions such as:

```text
v0.1.0

v0.2.0

v1.0.0
```

Roadmap tag:

```text
phase-2-complete
```

means:

```text
the engineering roadmap Phase 2 closure state.
```

A release tag such as:

```text
v1.0.0
```

means:

```text
a product/software release according to the future release/versioning policy.
```

The two concepts remain independent.

## Tag Governance Summary

```text
major Phase closure
    → annotated tag

ordinary milestone closure
    → commit + roadmap evidence

historical completed Phase
    → may be backfilled after exact closure commit verification

release version
    → separate SemVer/release policy

tag target
    → final phase documentation closure commit after green CI
```

The current next implementation work is:

```text
Phase 4 — Knowledge Platform

P4-M08 — Knowledge Events
```

P3-M01 established canonical Resource identifier semantics.

P3-M02 established the minimal collision-safe NamespacedKey semantic and proved it through the existing Identity Permission vocabulary.

P3-M03 was reviewed and intentionally deferred because the production codebase has no real Event producer/consumer requirement. No Event package, bus, persistence, queue, Kafka, or RabbitMQ was introduced.

P3-M04 established the durable Audit Record baseline through `@ai-world/kernel-audit`, PostgreSQL `audit_records`, and a real Identity authorization-decision consumer. Audit remains separate from Events and operational logging; Audit Query and Retention remain deferred until real consumers require them.

P3-M05 Taxonomy was demand-reviewed and intentionally deferred because no implemented Resource currently requires reusable shared classification semantics. No Taxonomy package, persistence model, registry, or migration was introduced. Its first strong activation gate remains Phase 4 P4-M05 Taxonomy Integration.

P3-M06 Relationships was demand-reviewed and intentionally deferred because no implemented production capability currently requires a shared semantic Resource-to-Resource relationship. No Relationships package, Relationship Type/Instance persistence, traversal layer, Graph Database, or migration was introduced. Its first strong activation gate remains Phase 4 P4-M06 Relationship Integration.

P3-M07 strengthened the concrete package boundaries that now exist. Applications and packages can no longer deep-import foreign package source, and production package source cannot consume foreign infrastructure implementations. Legitimate application composition and integration-test composition remain supported. The implementation checkpoint is `aaf6e80 feat(architecture): expand package boundary enforcement`, and its remote CI is green.

Phase 3 is therefore complete with the exit outcome `MINIMAL SHARED SEMANTIC KERNEL`. Phase 4 Knowledge is active; P4-M01, P4-M02, P4-M03, P4-M04, and P4-M07 are closed; P4-M05 and P4-M06 are deferred after demand review; and P4-M08 is next.

P4-M02 established the first Devotional typed resource only. Anime remains deferred to its later second-Universe reuse-test milestone, and History remains the later third structural reuse test.

P4-M03 established canonical Knowledge create/read/update operations behind Knowledge-owned Contracts and Prisma persistence. It introduced no new migration, kept Knowledge lifecycle at DRAFT, and kept the shared Platform Universe-neutral.

P4-M04 established shared authorization around Knowledge create/update mutations through the Identity & Access public permission evaluator. It introduced the `knowledge-editor` capability Role, Knowledge-owned create/update Permission actions, a data-only grant migration, default-deny ordinary User proof, and denial non-disclosure without adding API/Web behavior or changing the Prisma schema.

P4-M05 demand-reviewed Taxonomy Integration against the implemented Devotional domain and found no real reusable classification consumer. The Taxonomy Kernel therefore remains deferred and unmaterialized.

P4-M06 demand-reviewed Relationship Integration against the same implemented Devotional domain and found no real reusable Resource-to-Resource relationship consumer. With only `DeityResource` implemented and no `TempleResource` or other second Devotional Resource present, the Relationships Kernel remains deferred and unmaterialized.

P4-M07 then established the smallest canonical Knowledge lifecycle: `DRAFT -> PUBLISHED -> ARCHIVED`, with explicit protected publish/archive operations, lifecycle-specific Permission actions, conditional persistence, and no generalized Workflow engine. P4-M08 Knowledge Events is next.
