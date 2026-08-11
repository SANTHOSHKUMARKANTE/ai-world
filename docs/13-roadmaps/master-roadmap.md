# AI World Master Roadmap

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Master Roadmap |
| Document ID | P0-D18 |
| Area | Roadmaps |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-11 |
| Current Delivery | Phase 2 ACTIVE — P2-M08 Roles and Permissions CLOSED; P2-M09 Owner-Side Authorization NEXT |
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

When are Anime and History introduced?

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

Anime and History are not delayed until every Platform is complete.

They are introduced incrementally during the Knowledge phase and expanded as later Platforms mature.

Their purpose is to validate shared architecture early.

---

# 9. Why Anime and History

Anime provides pressure around:

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

History provides pressure around:

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

Together they reduce the risk of overfitting AI World to one domain.

---

# 10. Third Universe Strategy

A third structurally different Universe is intentionally deferred until:

```text
Anime

and

History
```

have exercised the shared architecture sufficiently.

The third Universe is a major reuse test.

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
ACTIVE

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
NEXT
```

Current Phase 2 milestone sequence:

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
NEXT

P2-M10 — Session Security UX
PLANNED
```

Current non-blocking documentation debt:

```text
docs/13-roadmaps/README.md
docs/00-governance/documentation-standard.md
docs/00-governance/definition-of-done.md
docs/templates/closure-review-template.md

remain empty placeholders and are deferred to a dedicated governance/documentation task.
```

They do not redefine current milestone closure criteria.

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

Next:

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
GitHub Actions CI / Validate             complete
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

GitHub Actions CI / Validate               PASS
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

GitHub Actions CI / Validate               PASS
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

GitHub Actions CI / Validate               PASS
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

Prove protected business operations enforce Authorization inside trusted backend boundaries.

Frontend checks are not sufficient.

---

# 85. Phase 2 Milestone P2-M10 — Session Security UX

Initial Web may expose:

```text
login;

logout;

registration;

verification;

recovery;

basic account/profile.
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

---

# 90. Phase 2 Exit Outcome

AI World gains:

```text
ONE SHARED IDENTITY PLATFORM.
```

All future Universes reuse it.

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

Implement stable canonical Resource identifier semantics.

Requirements:

```text
generation;

validation;

representation;

tests.
```

---

# 95. Identifier Migration Rule

If Phase 2 Resources were created before generalized Identifiers were finalized, migrate intentionally rather than maintaining multiple unrelated schemes without reason.

---

# 96. Phase 3 Milestone P3-M02 — Namespace

Implement namespaced Keys only to the degree required by:

```text
permissions;

Events;

Taxonomy;

Relationships;

Definitions.
```

---

# 97. Phase 3 Milestone P3-M03 — Events

Implement:

```text
typed internal Events;

in-process publication;

subscription;

correlation/context.
```

---

# 98. Events Initial Scope

Do not add:

```text
Kafka;

RabbitMQ;

distributed broker.
```

---

# 99. Phase 3 Milestone P3-M04 — Audit

Implement reusable Audit Record semantics.

Prove integration with Identity operations and future Knowledge mutations.

---

# 100. Phase 3 Milestone P3-M05 — Taxonomy

Implement minimal:

```text
Taxonomy Definition;

Term;

Resource classification.
```

Only features needed by proof Universes.

---

# 101. Taxonomy Deferred Features

Potentially defer:

```text
complex hierarchy;

aliases;

localization;

advanced governance
```

until needed.

---

# 102. Phase 3 Milestone P3-M06 — Relationships

Implement:

```text
Relationship Type;

Relationship Instance;

source/target validation;

direction;

basic traversal.
```

---

# 103. Relationships Storage

Initial persistence:

```text
PostgreSQL.
```

No Graph Database.

---

# 104. Phase 3 Milestone P3-M07 — Architecture Enforcement Expansion

Once multiple architectural areas exist, strengthen automated rules:

```text
Foundation → Platform forbidden;

Kernel → Platform forbidden;

Platform → Universe forbidden;

deep-import restrictions;

cycle detection.
```

---

# 105. Phase 3 Testing

Kernel tests should prove:

```text
Universe neutrality;

type/definition validation;

ownership;

persistence integrity;

cross-consumer reuse.
```

---

# 106. Phase 3 Closure Criteria

Phase 3 closes when:

```text
required Kernel capabilities exist;

Identity can consume them where relevant;

Knowledge can begin without inventing duplicated primitives;

no Kernel capability contains Anime/History-specific business logic;

architecture checks protect the primary layer direction.
```

---

# 107. Phase 3 Exit Outcome

AI World gains:

```text
MINIMAL SHARED SEMANTIC KERNEL.
```

---

# 108. Phase 4 — Knowledge Platform

Purpose:

> **Build AI World's canonical structured, typed, connected Knowledge capability and prove it against Anime and History.**

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

Expected:

```text
packages/platforms/knowledge/

packages/universes/anime/

packages/universes/history/
```

and required Kernel packages.

---

# 111. Phase 4 Milestone P4-M01 — Knowledge Resource Model

Define and implement the minimum canonical Knowledge Resource model.

Requirements should include:

```text
stable ID;

Resource type;

Universe context/association;

lifecycle;

audit fields;

typed public Contract.
```

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

Prove shared Knowledge can support typed domain models.

Anime candidate:

```text
Character

Series.
```

History candidate:

```text
Person

Event.
```

Keep the proof set intentionally small.

---

# 114. Phase 4 Milestone P4-M03 — Knowledge CRUD Baseline

Implement canonical owner operations:

```text
create;

read;

update;

archive/delete according to lifecycle.
```

---

# 115. Knowledge Mutation Rule

Only Knowledge-owned operations mutate canonical Knowledge state.

---

# 116. Phase 4 Milestone P4-M04 — Knowledge Authorization

Protect mutation operations through shared Identity & Access.

Prove:

```text
creator/editor;

admin;

ordinary User
```

behave correctly.

---

# 117. Phase 4 Milestone P4-M05 — Taxonomy Integration

Anime proof:

```text
Genre
```

History proof:

```text
Era / historical classification.
```

---

# 118. Phase 4 Milestone P4-M06 — Relationship Integration

Examples:

```text
Anime Character
    APPEARS_IN
Series

History Person
    PARTICIPATED_IN
Event.
```

---

# 119. Phase 4 Milestone P4-M07 — Knowledge Lifecycle

Begin with a simple lifecycle.

Possible baseline:

```text
DRAFT

PUBLISHED

ARCHIVED.
```

Do not build full Workflow engine merely to support three states.

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

History proof should introduce minimal Source semantics.

---

# 122. Phase 4 Milestone P4-M10 — Citations

If necessary for History proof, support structured Citation association.

Do not overbuild academic citation infrastructure initially.

---

# 123. Phase 4 Milestone P4-M11 — Temporal Baseline

History should test:

```text
dates;

date ranges;

uncertainty where required.
```

Avoid creating universal time ontology prematurely.

---

# 124. Phase 4 Milestone P4-M12 — Anime Proof Universe v1

Create a minimal Anime Universe Definition.

Potential scope:

```text
Character

Series

Genre

Character APPEARS_IN Series.
```

---

# 125. Anime v1 Goal

Prove:

```text
Universe definitions specialize shared Knowledge;

no Anime-specific auth;

no Anime-specific database engine;

no Anime-specific search;

no Anime-specific Platform core branches.
```

---

# 126. Phase 4 Milestone P4-M13 — History Proof Universe v1

Create minimal History Universe Definition.

Potential scope:

```text
Person

Event

Era

Person PARTICIPATED_IN Event

basic Source.
```

---

# 127. History v1 Goal

Prove:

```text
same Knowledge Platform;

same Taxonomy;

same Relationships;

same Identity;

different domain semantics.
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
Anime Resources;

History Resources;

relationships;

classification.
```

---

# 131. Phase 4 Proof Generality Review

Review:

```text
How many Knowledge changes were Anime-specific?

How many were History-specific?

Did either require duplicate infrastructure?

Did Metadata become a temptation to avoid typing?

Did Platform code introduce Universe switches?
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

Anime v1 works;

History v1 works;

Taxonomy works across both;

Relationships work across both;

Identity/Authorization protects mutation;

basic lifecycle works;

Events/Audit exist where required;

History Source baseline works;

Web/API can consume both Universes;

no duplicate Universe infrastructure exists;

no core `switch(universe)` architecture exists.
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

# 148. Phase 5 Milestone P5-M07 — Anime Media Proof

Use Anime to validate:

```text
Character image;

Series image;

possibly visual media relationships.
```

---

# 149. Phase 5 Milestone P5-M08 — History Media Proof

Use History to validate:

```text
Person portrait;

Artifact image;

historical source image where appropriate.
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

Anime and History reuse the same Media Platform;

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
Anime-only Search;

History-only Search.
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

Anime and History are searchable;

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

# 188. Phase 7 Anime AI Proof

Potential controlled use:

```text
character summary draft;

series metadata suggestion.
```

---

# 189. Phase 7 History AI Proof

Potential controlled use:

```text
Source summarization;

Entity draft;

relationship suggestion.
```

Factual integrity requires stronger source awareness/review.

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

Anime and History can consume AI without Provider-specific code;

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

# 203. Phase 8 Milestone P8-M08 — Anime Composition Proof

Potential:

```text
Anime home Page;

Character spotlight;

Series composition.
```

---

# 204. Phase 8 Milestone P8-M09 — History Composition Proof

Potential:

```text
historical topic Page;

timeline-like composition;

Source-aware content presentation.
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

Anime and History can compose distinct experiences without separate CMS systems.
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

works across Anime and History;

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
| Events | Phase 3 |
| Audit | Phase 3 or pulled into Phase 2 |
| Taxonomy | Phase 3 |
| Relationships | Phase 3 |
| Knowledge | Phase 4 |
| Anime Universe | Phase 4 |
| History Universe | Phase 4 |
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

Anime

History

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

Can Knowledge serve both Anime and History?

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
anime

history

nature
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

event integrity.
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

Emphasize semantic Kernel contracts.

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
Anime v1

History v1

expand both incrementally

third Universe validation

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

Media/Discovery reuse is demonstrated;

Anime + History architectural lessons are incorporated.
```

---

# 318. Third Universe Selection

Choose a structurally different domain.

Avoid selecting something too similar to Anime or History merely to make reuse appear easy.

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

If Anime and History cannot coexist cleanly under one Knowledge Platform, architecture review is mandatory before expanding further.

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

6. Knowledge is proven against at least Anime and History.

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

# 360. Roadmap Anti-Pattern — Anime First App

Bad:

```text
build Anime as independent product
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

Expected:

```text
registration;

verification;

login;

Session;

logout;

recovery;

authorization
```

working end-to-end.

---

# 383. Phase 3 Completion Evidence

Expected:

```text
shared Kernel semantics
```

used by real Platform consumers.

---

# 384. Phase 4 Completion Evidence

Expected:

```text
Anime and History
```

operating through one shared Knowledge Platform.

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
    ACTIVE
    ✅ P2-M01 Actor and User Baseline — CLOSED
    ✅ P2-M02 Registration — CLOSED
    ✅ P2-M03 Password Authentication — CLOSED
    ✅ P2-M04 Session Management — CLOSED
    ✅ P2-M05 Email Verification — CLOSED
    ✅ P2-M06 Recovery — CLOSED
    ✅ P2-M07 User Profile — CLOSED
    ✅ P2-M08 Roles and Permissions — CLOSED
    →  P2-M09 Owner-Side Authorization — NEXT
    ☐  P2-M10 Session Security UX

PHASE 3
PLATFORM KERNEL BASELINE
    NOT STARTED
    Identifiers
    Namespace
    Events
    Audit
    Taxonomy
    Relationships
    other Kernel capabilities only as required


PHASE 4
KNOWLEDGE
    NOT STARTED
    Canonical Knowledge
    Typed domain resources
    Anime v1
    History v1
    Sources
    relationships
    taxonomy


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

> **AI World will move from architecture into implementation through a controlled sequence of increasingly valuable and increasingly demanding capabilities. Engineering Foundations will establish a reliable development platform; Identity will establish one secure Actor and User model; the Platform Kernel will introduce only the semantic primitives required by real consumers; Knowledge will prove the architecture across Anime and History; Media and Discovery will provide shared content and exploration capabilities; AI will operate on canonical Platform data through governed provider-independent boundaries; Composition will enable creators to build Experiences; Engagement will connect Users across Universes; and Production Operations will mature the Platform into a durable production system.**

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

The following block preserves the Phase 0 acceptance snapshot from 2026-08-08. Current delivery status is tracked in Sections 23A, 81, 398, and 410.

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
2026-08-11

CURRENT PHASE
Phase 2 — Identity Platform

STATUS
ACTIVE

COMPLETED
P2-M01 — Actor and User Baseline
P2-M02 — Registration
P2-M03 — Password Authentication
P2-M04 — Session Management
P2-M05 — Email Verification
P2-M06 — Recovery
P2-M07 — User Profile
P2-M08 — Roles and Permissions

NEXT
P2-M09 — Owner-Side Authorization

BLOCKED
None

DEFERRED
P2-M10 — Session Security UX remains planned in its accepted Phase 2 order.
Universe-scoped authorization remains deferred until a real consumer requires its semantics.
Locale and timezone profile preferences remain deferred until a real consumer defines their semantics.

P2-M08 OWNERSHIP
Identity & Access owns Role, Permission, Actor-to-Role assignment, Role-to-Permission grants, and Permission evaluation.
Actor is the authorization subject.
User Platform does not own or evaluate authorization.
API Application owns runtime composition.

P2-M08 MODEL
Minimal RBAC baseline.
Actor → Role.
Role → Permission.
No direct Actor Permission grants.
No explicit deny rules.
No Role hierarchy.

P2-M08 PERSISTENCE
Role, Permission, ActorRole, and RolePermission.
Migration: 20260811132518_identity_authorization_baseline.
Canonical migration count: 7.

P2-M08 REGISTRATION
Registration is unchanged.
No explicit persisted ordinary-User Role is required.
No default Role is assigned during registration.
No canonical Role or Permission seed data was added to the Database Foundation.

P2-M08 ROLE ASSIGNMENT
AssignRoleToActor accepts actorId + roleKey.
First assignment succeeds.
Repeated assignment is an idempotent success.
Missing Actor and missing Role use canonical not-found failures.

P2-M08 PERMISSION EVALUATION
EvaluatePermission accepts actorId + permissionKey.
Any assigned Role granting the Permission allows.
Otherwise evaluation denies by default.
Unknown Actor, no Role, unknown Permission, wrong Role, and unrelated Actor grants all deny.

P2-M08 APPLICATION
RoleAssignmentWriter.
PermissionEvaluationReader.
AssignRoleToActor.
EvaluatePermission.
PrismaAuthorizationRepository.

P2-M08 API
AssignRoleToActor and EvaluatePermission are wired through the API Composition Root.
No Role-management, Permission-management, or Role-assignment HTTP endpoints were introduced.

P2-M08 P2-M09 BOUNDARY
P2-M08 returns authorization facts as allowed true/false.
P2-M09 will enforce those facts inside trusted owner-side operations and introduce forbidden semantics where required.

P2-M08 VALIDATION
Format check: PASS
Lint: 9 / 9
TypeScript: 17 / 17
Identity unit tests: 78 / 78
Identity integration tests: 38 / 38
User integration tests: 6 / 6
API unit/e2e tests: 12 / 12
API PostgreSQL integration tests: 59 / 59
Repository PostgreSQL integration tests: 103 / 103
Real SMTP → Mailpit integration tests: 2 / 2
Production build: 10 / 10
Architecture: 245 modules / 556 dependencies / 0 violations
Prisma: 7 migrations / schema up to date
Git diff validation: PASS
GitHub Actions CI / Validate: PASS

P2-M08 IMPLEMENTATION
7f8cfb3 feat(identity): complete roles and permissions baseline

DOCUMENTATION DEBT
Roadmap README, Documentation Standard, project Definition of Done, and Closure Review Template remain empty placeholders and are intentionally deferred to a dedicated governance/documentation task.
```

The next implementation work is:

```text
P2-M09 — Owner-Side Authorization
```

P2-M09 may begin because the P2-M08 implementation checkpoint, full local validation, PostgreSQL persistence/authorization proof, architecture validation, and remote CI validation completed successfully.
