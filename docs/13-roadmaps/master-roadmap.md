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
| Last Reviewed | 2026-08-18 |
| Current Delivery | Phase 3 COMPLETE — tagged `phase-3-complete`; Phase 4 Knowledge Platform COMPLETE — P4-M01 Knowledge Resource Model CLOSED; P4-M02 Typed Domain Resource Support CLOSED; P4-M03 Knowledge CRUD Baseline CLOSED; P4-M04 Knowledge Authorization CLOSED; P4-M05 Taxonomy Integration DEFERRED — no implemented Devotional classification consumer; P4-M06 Relationship Integration DEFERRED — no implemented Devotional Resource-to-Resource relationship consumer; P4-M07 Knowledge Lifecycle CLOSED; P4-M08 Knowledge Events DEFERRED — no real production Event consumer; P4-M09 Sources DEFERRED — no implemented Devotional source-backed Resource; P4-M10 Citations DEFERRED — no implemented Devotional Resource requires Citation semantics distinct from Source; P4-M11 Temporal Baseline DEFERRED — no implemented Devotional Resource requires reusable date/date-range semantics; P4-M12 Devotional Universe v1 CLOSED; P4-M13 Anime Reuse-Test Universe v1 CLOSED; P4-M14 Basic Public Knowledge API CLOSED; P4-M15 Basic Creator Knowledge API CLOSED; P4-M16 Web Knowledge Experience CLOSED; Phase 4 Proof Generality Review CLOSED; Metadata Decision Gate CLOSED — Metadata Kernel DEFERRED; Workflow Decision Gate CLOSED — Workflow Kernel DEFERRED; Policy Decision Gate CLOSED — Policy Kernel DEFERRED; Phase 4 Closure Criteria Evaluation CLOSED — 15/15 SATISFIED; Exit Outcome MULTI-UNIVERSE KNOWLEDGE PLATFORM; Phase 5 Media Platform COMPLETE — P5-M01 Asset Model CLOSED; P5-M02 Storage Foundation CLOSED; P5-M03 Upload CLOSED; P5-M04 Delivery CLOSED; P5-M05 Image Processing CLOSED; P5-M06 Knowledge Integration CLOSED; P5-M07 Devotional Media Proof CLOSED; P5-M08 Anime Media Proof CLOSED; P5-M09 Media Audit/Events CLOSED; Phase 5 Closure Criteria Evaluation CLOSED — 9/9 SATISFIED; Phase 6 Discovery Platform COMPLETE — P6-M01 Search Contract CLOSED; P6-M02 Knowledge Search CLOSED; P6-M03 Universe-Scoped Search CLOSED; P6-M04 Cross-Universe Search CLOSED; P6-M05 Filters CLOSED; P6-M06 Basic Ranking CLOSED; P6-M07 Indexing Architecture Review CLOSED; Phase 6 Web Integration CLOSED; Phase 6 Security Review CLOSED; PostgreSQL Search Measurement Evidence CLOSED; Phase 6 Closure Criteria Evaluation CLOSED — 8/8 SATISFIED; Exit Outcome SHARED MULTI-UNIVERSE DISCOVERY PLATFORM; Phase 6 Final Closure Documentation CLOSED; Phase 7 AI / Creator Platform ACTIVE — Phase 7 Provider Decision CLOSED — INITIAL PROVIDER OpenAI API — P7-M01 AI Provider Port CLOSED — P7-M02 Initial Provider Adapter CLOSED — INITIAL MODEL gpt-5.6-terra — OPENAI SDK 7.5.0 — P7-M03 Generation Model CLOSED — P7-M03 CI Revalidation CLOSED — P7-M04 Text Generation CLOSED — P7-M05 Authorized AI Context CLOSED — P7-M06 AI Provenance CLOSED — P7-M07 Safety Baseline CLOSED — P7-M08 Canonical Acceptance Flow CLOSED — P7-M09 AI Creator Assistance CLOSED — P7-M10 AI Tool Baseline CLOSED — P7-M11 AI Usage Tracking CLOSED — Phase 7 Multi-Provider Gate CLOSED — SECOND PROVIDER DEFERRED — Phase 7 Semantic Search Gate CLOSED — SEMANTIC/VECTOR SEARCH DEFERRED — Phase 7 Devotional AI Proof CLOSED — Phase 7 Anime AI Proof CLOSED — Phase 7 Closure Criteria Evaluation CLOSED — 9/9 SATISFIED — Phase 7 COMPLETE — `phase-7-complete` TAG PENDING exact green final closure CI — Phase 8 BLOCKED pending tag verification |
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
COMPLETE
EXIT OUTCOME: MULTI-UNIVERSE KNOWLEDGE PLATFORM

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
DEFERRED — no real production Event consumer

P4-M09 — Sources
DEFERRED — no implemented Devotional source-backed Resource

P4-M10 — Citations
DEFERRED — no implemented Devotional Resource requires Citation semantics distinct from Source

P4-M11 — Temporal Baseline
DEFERRED — no implemented Devotional Resource requires reusable date/date-range semantics

P4-M12 — Devotional Universe v1
CLOSED

P4-M13 — Anime Reuse-Test Universe v1
CLOSED

P4-M14 — Basic Public Knowledge API
CLOSED

P4-M15 — Basic Creator Knowledge API
CLOSED

P4-M16 — Web Knowledge Experience
CLOSED

PHASE 4 PROOF GENERALITY REVIEW
CLOSED

METADATA DECISION GATE
CLOSED — METADATA KERNEL DEFERRED

WORKFLOW DECISION GATE
CLOSED — WORKFLOW KERNEL DEFERRED

POLICY DECISION GATE
CLOSED — POLICY KERNEL DEFERRED

PHASE 4 CLOSURE CRITERIA EVALUATION
CLOSED — 15/15 SATISFIED

PHASE 5 — Media Platform
COMPLETE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

P5-M05 — Image Processing
CLOSED

P5-M06 — Knowledge Integration
CLOSED

P5-M07 — Devotional Media Proof
CLOSED

P5-M08 — Anime Media Proof
CLOSED

P5-M09 — Media Audit/Events
CLOSED

PHASE 5 CLOSURE CRITERIA EVALUATION
CLOSED — 9/9 SATISFIED

PHASE 6 — Discovery Platform
COMPLETE
EXIT OUTCOME: SHARED MULTI-UNIVERSE DISCOVERY PLATFORM

P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

P6-M03 — Universe-Scoped Search
CLOSED

P6-M04 — Cross-Universe Search
CLOSED

P6-M05 — Filters
CLOSED

P6-M06 — Basic Ranking
CLOSED

P6-M07 — Indexing Architecture Review
CLOSED

PHASE 6 WEB INTEGRATION
CLOSED

PHASE 6 SECURITY REVIEW
CLOSED

POSTGRESQL SEARCH MEASUREMENT EVIDENCE
CLOSED

PHASE 6 CLOSURE CRITERIA EVALUATION
CLOSED — 8 / 8 SATISFIED

PHASE 6 FINAL CLOSURE DOCUMENTATION
CLOSED

PHASE 7 — AI / Creator Platform
ACTIVE

PHASE 7 PROVIDER DECISION
CLOSED

INITIAL PROVIDER
OPENAI API

CONCRETE MODEL
gpt-5.6-terra

PROVIDER SDK
openai 7.5.0

P7-M01 — AI Provider Port
CLOSED

P7-M02 — Initial Provider Adapter
CLOSED

P7-M03 — Generation Model
CLOSED

P7-M03 CI REVALIDATION
CLOSED — CI reliability repaired and exact green push CI re-established

P7-M04 — Text Generation
CLOSED

P7-M05 — Authorized AI Context
CLOSED

P7-M06 — AI Provenance
CLOSED

P7-M07 — Safety Baseline
CLOSED

P7-M08 — Canonical Acceptance Flow
CLOSED

P7-M09 — AI Creator Assistance
CLOSED

P7-M10 — AI Tool Baseline
CLOSED

P7-M11 — AI Usage Tracking
CLOSED

Phase 7 Multi-Provider Gate
CLOSED — SECOND PROVIDER DEFERRED — no evidence trigger

Phase 7 Semantic Search Gate
CLOSED — SEMANTIC/VECTOR SEARCH DEFERRED — no proven real use case

Phase 7 Devotional AI Proof
CLOSED — controlled provider-neutral PostgreSQL vertical proof

Phase 7 Anime AI Proof
CLOSED — provider-neutral cross-Universe creator-draft proof

Phase 7 Closure Criteria
CLOSED — 9/9 SATISFIED

Phase 7
COMPLETE — completion tag pending exact green final closure CI

Phase 8
BLOCKED — pending phase-7-complete remote tag verification
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

P3-M03 remains deferred. P4-M08 performed the planned activation review after P4-M07 established real Knowledge lifecycle transitions. Those transitions now provide plausible future producer points, but no implemented production capability consumes Knowledge business Events and no real producer/consumer Event boundary exists. Events therefore remains unmaterialized until a concrete consumer requires decoupled business notification.

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

At closure of the Proof Generality Review, the next Phase 4 delivery action was:

```text
Metadata Decision Gate
```

Section 132 is now closed with the Metadata Kernel deferred.

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

At P4-M07 closure, P4-M08 — Knowledge Events was next. P4-M08 later completed its demand review and remained deferred because no real production Event consumer or producer/consumer Event boundary existed.

P4-M09 performed the planned Source/provenance demand review against the currently implemented Devotional domain. `DeityResource` remains the only implemented Devotional Resource type and its only domain-specific field is `name`. No `ScriptureResource`, source-sensitive explanatory Resource, external/textual Source reference, Source Contract, Source persistence model, or provenance requirement exists in production. P4-M09 therefore remains deferred rather than introducing Source infrastructure without a real traceability consumer. Canonical migration count remains 12.

At P4-M09 deferral, P4-M10 — Citations was next and retained the same demand-review requirement. Citation semantics still required a real source-backed Resource with needs distinct from the Source itself.

P4-M10 performed the planned Citation demand review after P4-M09 Sources remained deferred. `DeityResource` is still the only implemented Devotional Resource and still adds only `name`; no source-backed Devotional Resource, Citation field, Citation association, locator semantics, Citation Contract, Citation persistence model, or requirement for Citation semantics distinct from Source exists in production. P4-M10 therefore remains deferred instead of materializing academic or generic Citation infrastructure speculatively. Canonical migration count remains 12.

At P4-M10 deferral, P4-M11 — Temporal Baseline was next and retained the same demand-review requirement: reusable temporal semantics still required an implemented domain consumer rather than a possible future need.

P4-M11 performed the planned Temporal Baseline demand review against the implemented Devotional domain. `DeityResource` remains the only Devotional Resource and still adds only `name`; it has no birth/death, festival, observance, event, effective, start/end, year/era, or date-range semantics. `KnowledgeResource.createdAt` and `updatedAt` remain technical record timestamps and do not constitute a reusable domain temporal consumer. No shared DateRange/Temporal abstraction or Knowledge domain temporal persistence exists. P4-M11 therefore remains deferred rather than creating a universal time model prematurely. Canonical migration count remains 12.

At P4-M11 deferral, P4-M12 — Devotional Universe v1 was next.

P4-M12 is CLOSED. The implementation checkpoint is `1b7fab5 feat(devotional): establish universe v1`, with GitHub Actions CI run `31926097194` green for the exact implementation SHA `1b7fab5bcdbe39024bef686af3c636a738042623`.

Devotional v1 now has a concrete Devotional-owned Universe Definition for `universe.devotional` and three typed Resource Types: `devotional.deity`, `devotional.scripture`, and `devotional.temple`. `DeityResource`, `ScriptureResource`, and `TempleResource` all specialize shared `KnowledgeResource`, while Devotional-specific semantics remain in the Devotional package and shared Knowledge contains no Devotional-specific core branch.

The v1 scope deliberately did not create a generic shared `UniverseDefinition` framework or Universe Registry. Taxonomy, Relationships, Source/provenance, Citation, and reusable Temporal semantics remain deferred because P4-M12 did not establish a real activation need for those shared capabilities. Devotional also gained no separate database, Search, or authorization engine. Prisma remained unchanged and canonical migration count remains 12.

At P4-M12 closure, P4-M13 — Anime Reuse-Test Universe v1 was next. Anime was the second-Universe reuse test intended to determine which Devotional-local definition patterns, if any, deserved promotion into shared reusable contracts.

P4-M13 is CLOSED. The implementation checkpoint is `c90b4a99 feat(anime): establish reuse-test universe v1`, with GitHub Actions CI run `31927100260` green for the exact implementation SHA `c90b4a99e1d66319e54278afbf2017a6c63af6b8`.

Anime v1 was deliberately implemented as a bounded architecture reuse test rather than a parallel product priority. Devotional remains AI World's primary product/domain priority. The Anime package reuses the same shared `KnowledgeResource` model through `universe.anime`, `anime.character`, and `anime.series`, while keeping Anime-specific semantics inside `@ai-world/universe-anime`.

The concrete Universe-definition pattern established by Devotional was successfully reused by Anime without an Anime-to-Devotional dependency and without named-Universe branches in shared Platform code. P4-M13 therefore proves the reuse pattern at the current abstraction level. A generic shared `UniverseDefinition` contract or Universe Registry was not promoted because no shared runtime consumer currently requires that abstraction.

The optional `Genre` classification and `Character APPEARS_IN Series` relationship were intentionally not materialized. Taxonomy and Relationships therefore remain deferred until a real product capability needs their mechanics. Anime also gained no separate database, Search, or authorization infrastructure; Prisma remained unchanged and canonical migration count remains 12.

At P4-M13 closure, P4-M14 — Basic Public Knowledge API was next. That milestone returned delivery focus to shared platform capability that could directly serve the Devotional product priority.

P4-M14 is CLOSED. The implementation checkpoint is `c7f21161 feat(knowledge): expose public read API`, with GitHub Actions CI run `31928964366` green for the exact implementation SHA `c7f21161e896cd3daa838aa14fca71907313b7a8`.

P4-M14 established the first controlled public Knowledge read surface through `GET /knowledge/resources/:id` and `GET /knowledge/resources`. Public access requires no session, but visibility is intentionally restricted to `PUBLISHED` Knowledge Resources. `DRAFT` and `ARCHIVED` Resources remain hidden from public reads, with individual hidden Resources indistinguishable from missing Resources.

The public query requires a canonical `universeKey`, supports an optional canonical `resourceType`, uses a default limit of 20 and maximum limit of 50, and returns stable ordering by `createdAt DESC, id ASC`. The HTTP response exposes only canonical public Knowledge metadata (`id`, `universeKey`, `resourceType`, `createdAt`, `updatedAt`) and does not expose lifecycle.

Devotional remains the primary product/domain focus. Integration proof used published Devotional Deity and Scripture Resources, verified that draft Temple and archived Deity Resources remain hidden, and used a published Anime Resource only to prove cross-Universe query isolation. Production Knowledge and API code remains Universe-generic with no Devotional- or Anime-specific branches.

The implementation introduced no creator write endpoint, no full-text Search capability, no domain-payload persistence, no Taxonomy, Relationships, Source, Citation, or reusable Temporal semantics, and no new database schema or migration. Canonical migration count remains 12.

Final local validation included 5 Knowledge test files / 37 tests passed and 1 public Knowledge API integration test file / 10 tests passed. Architecture validation remained 367 modules / 943 dependencies / 0 violations; the final empty-Resource-Type repair changed no imports or dependencies.

At P4-M14 closure, P4-M15 — Basic Creator Knowledge API was next. That milestone has now established the protected Knowledge creation/editing transport boundary while preserving Devotional as the primary product focus.

P4-M15 is CLOSED. The implementation checkpoint is `888523cb feat(knowledge): expose creator write API`, with GitHub Actions CI run `31930221502` green for the exact implementation SHA `888523cbf7d35e8dc4f5751d650f81384da8a6df`.

P4-M15 exposed the minimal protected creator Knowledge transport surface through `POST /knowledge/resources` and `PATCH /knowledge/resources/:id`. Both operations require a valid Session, derive the acting Actor only from the validated Session, and reuse the existing owner-side `knowledge.resource.create` and `knowledge.resource.update` authorization permissions.

Authorization remains before canonical Knowledge input validation. Unauthorized callers therefore receive the canonical forbidden result before Resource existence or malformed canonical input can be used for probing. After authorization succeeds, malformed canonical Resource identifiers or NamespacedKeys are translated to the controlled `knowledge.resource.invalid_input` validation failure. The final repair narrowed that translation to parser failures only so downstream repository/data-integrity `TypeError`s remain internal failures instead of being misclassified as client input errors.

Devotional remains the primary product/domain focus. Integration proof used a `knowledge-editor` to create a `universe.devotional` / `devotional.deity` Resource in `DRAFT`, verified that the new draft remained hidden through the P4-M14 public API, and exercised the existing canonical edit operation by changing the Resource Type to `devotional.temple`. Production Knowledge and API code remains Universe-generic with no Devotional- or Anime-specific branches.

P4-M15 deliberately adds no creator UI, no publish/archive HTTP endpoint, no domain-payload persistence for typed Universe fields, no Search, and no Taxonomy, Relationships, Source, Citation, or reusable Temporal capability. Prisma remains unchanged, no migration was created, and canonical migration count remains 12.

Final local validation after the narrow parser-error repair included 5 Knowledge test files / 41 tests passed, 1 Creator Knowledge API integration test file / 10 tests passed, and architecture validation at 370 modules / 968 dependencies / 0 violations. The earlier full P4-M15 validation also kept API non-integration tests and the P4-M14 public Knowledge regression suite green.

At P4-M15 closure, P4-M16 — Web Knowledge Experience was next. That milestone has now established the first limited public Web Knowledge experience while preserving Devotional as the primary product focus.

P4-M16 is CLOSED. The implementation checkpoint is `b61374d feat(web): add knowledge experience`, with GitHub Actions CI run `31933927697` green for the exact implementation SHA `b61374d744c8accf9da8300c5f196644bf9e1dc9`.

P4-M16 established the first limited Web Knowledge experience at `/knowledge`. Devotional is presented first and explicitly as the primary Universe experience. Anime is presented second as the bounded reuse-test view. Both views consume the same existing public Knowledge HTTP contract through the Web API adapter: `GET /knowledge/resources?universeKey=...`.

The Web continues to consume the shared API/Platform boundary rather than taking canonical ownership. The P4-M16 Web implementation adds no direct Platform or Universe package dependency, no deep import, and no new canonical domain ownership. Universe-specific presentation choices remain in the application layer.

Relationships and reusable classification remain absent from the Web because those capabilities are still deferred and were not activated by a real consumer. P4-M16 does not introduce placeholder Taxonomy, Relationships, Source, Citation, reusable Temporal, Search, creator UI, or Knowledge write/lifecycle controls.

Final validation evidence for the completed slice includes Web lint and typecheck green, 6 Web unit test files / 23 tests passed, Web production build green, 3 Playwright browser tests passed, and architecture validation at 375 modules / 978 dependencies / 0 violations. Prisma remains unchanged, no migration was created, and canonical migration count remains 12.

P4-M16 closes the final named implementation milestone currently listed for Phase 4, but it does not by itself close Phase 4. At P4-M16 closure, the next delivery action was Section 131 — Phase 4 Proof Generality Review. That review is now closed. The Metadata, Workflow, and Policy decision gates plus explicit Phase 4 Closure Criteria evaluation remain before Phase 4 can be declared complete.

Phase 4 Proof Generality Review is CLOSED.

Review evidence confirms that Devotional genuinely exercised the shared canonical Knowledge Resource model, typed Universe Resource extension, generic persistence/create/get/update behavior, owner-side mutation authorization, `DRAFT -> PUBLISHED -> ARCHIVED` lifecycle semantics, and published-only public read/list behavior. Devotional remained the primary product proof throughout the API and Web vertical slices.

Anime then reused the same baseline without shared-core modification. The P4-M13 Anime implementation commit added only the Anime Universe package plus workspace lockfile registration; it did not modify Knowledge Platform, Kernel, API, Web, or Prisma production code. Both Devotional and Anime Universe packages have a single runtime dependency on `@ai-world/platform-knowledge`.

Neither Universe required duplicate infrastructure. The repository retains one canonical `KnowledgeResource` persistence model, with no Devotional- or Anime-specific persistence model and no Universe-owned authentication, search, event, or persistence subsystem.

Metadata did not become an escape hatch from typing. The canonical Knowledge Resource and Prisma model contain no generic Metadata bag, while the Devotional and Anime Resource contracts keep explicit typed fields such as `name` and `title`.

Reviewed Platform and Kernel production source contains no named Devotional or Anime Resource/Universe tokens. Shared Knowledge create/public-list paths remain generic over `NamespacedKey` / `universeKey` / `resourceType`. Named Universe values occur at Universe definition and application presentation boundaries, not as Platform switches.

History is therefore expected to require fewer changes to the already-proven baseline Resource/CRUD/auth/lifecycle/public-read core. This is a forward-looking architectural inference rather than a completed History proof: History may still legitimately activate currently deferred Source, Citation, Temporal, Taxonomy, or Relationship capabilities when real History requirements establish those consumers.

Review conclusion:

```text
BASELINE MULTI-UNIVERSE KNOWLEDGE GENERALITY
DEMONSTRATED

DUPLICATE UNIVERSE INFRASTRUCTURE
NONE

GENERIC METADATA ESCAPE HATCH
NOT INTRODUCED

NAMED-UNIVERSE PLATFORM SWITCHES
NONE FOUND

HISTORY BASELINE REUSE EXPECTATION
FEWER SHARED-CORE CHANGES EXPECTED
DEFERRED SEMANTIC CAPABILITIES MAY STILL ACTIVATE
```

Phase 4 remains ACTIVE.

At Proof Generality Review closure, Section 132 — Metadata Decision Gate followed next. That gate is now closed with Metadata deferred.

Section 132 — Metadata Decision Gate is CLOSED.

Decision:

```text
METADATA KERNEL
DEFERRED
```

The implemented Devotional and Anime variation does not currently justify a reusable Metadata Kernel/capability. Both Universes continue to preserve meaningful stable domain properties through explicit typed Resource contracts, including `DeityResource.name`, `ScriptureResource.title`, `TempleResource.name`, `CharacterResource.name`, and `SeriesResource.title`.

The canonical `KnowledgeResource` contract and canonical Prisma `KnowledgeResource` persistence model contain no generic Metadata bag. No Metadata Kernel/Platform package, Metadata definition registry, or shared Metadata persistence/query/versioning mechanics currently exist.

The preceding Phase 4 Proof Generality Review demonstrated that Anime reused the shared Knowledge baseline without requiring shared-core modification. Introducing Metadata now would therefore add a new definition contract, ownership surface, validation mechanics, persistence/query semantics, compatibility/versioning concerns, and likely registry mechanics without a concrete production consumer.

This decision is consistent with the accepted architecture: meaningful stable domain invariants remain typed; controlled Metadata extensions are permitted when justified; Metadata must be typed, validated, owned, queryable where required, and versionable where required; and the least powerful safe variation mechanism should be preferred.

Metadata is not rejected permanently. Re-evaluate this gate when a real implemented Resource/Universe needs extensible descriptive properties that cannot safely remain ordinary typed domain fields or owned configuration, and when a concrete shared consumer requires Metadata definition, validation, persistence, query, or compatibility/versioning semantics.

Decision result:

```text
METADATA DECISION GATE
CLOSED

METADATA KERNEL
DEFERRED

IMPLEMENTATION CHANGE
NONE

PRISMA CHANGE
NONE

MIGRATION
NONE

CANONICAL MIGRATIONS
12
```

Phase 4 remains ACTIVE.

At Metadata Decision Gate closure, Section 133 — Workflow Decision Gate followed next. That gate is now closed with Workflow deferred.

Section 133 — Workflow Decision Gate is CLOSED.

Decision:

```text
WORKFLOW KERNEL
DEFERRED
```

The implemented Knowledge editorial requirements do not currently justify reusable Workflow mechanics. Knowledge already owns and enforces the small canonical lifecycle `DRAFT -> PUBLISHED -> ARCHIVED`, with direct owner-side publish/archive transitions and distinct Knowledge permissions for create, update, publish, and archive.

Those publication states are lifecycle semantics, not evidence of a reusable editorial process. The current implementation has no review stage, no submit-for-review operation, no reviewer assignment, no approval/rejection state, no multi-step approval, no reusable Workflow Definition, no Workflow Instance, and no approval history/process persistence.

The creator HTTP surface remains intentionally limited to create/update. Publish/archive remain owner-side Knowledge lifecycle capabilities rather than a transport-level editorial workflow. No Workflow Kernel/Platform package or Workflow persistence exists.

This matches the accepted ownership model: Workflow may coordinate advanced process later, but it does not own the target Knowledge Resource or its canonical mutation. Knowledge remains lifecycle/canonical owner; a future Workflow capability would own reusable process mechanics only.

Workflow is not rejected permanently. Re-evaluate when a real implemented editorial process requires reusable mechanics beyond direct lifecycle transitions—for example multi-step review, explicit approval/rejection, reviewer/participant assignment, reusable transition definitions, workflow instances/history, or materially different editorial processes across contexts/Universes.

Decision result:

```text
WORKFLOW DECISION GATE
CLOSED

WORKFLOW KERNEL
DEFERRED

IMPLEMENTATION CHANGE
NONE

PRISMA CHANGE
NONE

MIGRATION
NONE

CANONICAL MIGRATIONS
12
```

Phase 4 remains ACTIVE.

At Workflow Decision Gate closure, the next delivery action was:

```text
Section 134 — Policy Decision Gate
```

Section 134 is now closed with the Policy Kernel deferred.

Section 134 — Policy Decision Gate is CLOSED.

Decision:

```text
POLICY KERNEL
DEFERRED
```

The implemented system does not currently contain genuinely configurable cross-context business rules that justify shared Policy representation/evaluation mechanics.

Current rules remain stable and correctly owned by their Domain owners. Knowledge owns its `DRAFT -> PUBLISHED -> ARCHIVED` lifecycle, the meaning of `create` / `update` / `publish` / `archive`, and the rule that only `PUBLISHED` Resources are publicly readable. Identity & Access owns authorization representation/evaluation and evaluates the Knowledge permission keys through its existing Role/Permission capability.

Files named `authorization-policy.ts` are owner-local authorization vocabulary, not a reusable configurable Policy Kernel. Their existence does not justify promoting Policy into shared Kernel architecture.

Neither the Devotional nor Anime Universe definition currently declares policy configuration. There is no implemented Universe/context-dependent publication requirement, source requirement, moderation rule, visibility rule, regional restriction, or AI-use rule that must be represented once and evaluated across multiple owners.

No Policy Kernel/Platform package, Policy Definition/Registry/Evaluator abstraction, or Policy persistence exists. Introducing those mechanics now would require inventing representation, context, precedence, composition, evaluation, conflict, persistence, versioning, and authorization interaction semantics without a real shared consumer.

Policy is not rejected permanently. Re-evaluate when a real implemented product slice needs configurable policy meaning that varies by Universe/context and requires shared evaluation across consumers—for example publication/source requirements, moderation, visibility, regional restrictions, or AI-use rules.

Decision result:

```text
POLICY DECISION GATE
CLOSED

POLICY KERNEL
DEFERRED

IMPLEMENTATION CHANGE
NONE

PRISMA CHANGE
NONE

MIGRATION
NONE

CANONICAL MIGRATIONS
12
```

Phase 4 remained ACTIVE at Policy Decision Gate closure.

At Policy Decision Gate closure, the next delivery action was:

```text
Section 135 — Phase 4 Closure Criteria Evaluation
```

Section 135 has now been evaluated and all 15 closure criteria are satisfied. The Policy decision itself did not close Phase 4; the separate Section 135 evaluation now records the Phase 4 closure decision.

Section 135 — Phase 4 Closure Criteria Evaluation is CLOSED.

Evaluation result:

```text
15 / 15 CLOSURE CRITERIA
SATISFIED
```

Phase decision:

```text
PHASE 4 — KNOWLEDGE PLATFORM
COMPLETE

EXIT OUTCOME
MULTI-UNIVERSE KNOWLEDGE PLATFORM
```

Conditional capabilities were evaluated according to their accepted criterion wording rather than materialized speculatively. Taxonomy and Relationships remain deferred because the required reusable classification/connection demand did not arise. Knowledge Events remain deferred because no production Event consumer exists, while Audit exists for a real Identity consumer. Sources and Citations remain deferred because no implemented proof Resource requires those semantics. Reusable Temporal semantics remain explicitly deferred to later real demand/History.

The closure proof also confirms that Devotional and Anime share the same Knowledge Platform without duplicate Universe infrastructure or named-Universe Platform/Kernel branches, and that the Web/public API consume both proof Universes through shared contracts.

Tag rule:

```text
phase-4-complete
ELIGIBLE ONLY AFTER
the exact Phase 4 closure documentation commit
completes remote CI successfully
```

This evaluation runner does not create the tag.

Next phase:

```text
PHASE 5 — Media Platform
NEXT
```

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

At P4-M07 closure, the next milestone was:

```text
P4-M08 — Knowledge Events
```

P4-M08 must establish whether a real producer/consumer boundary now justifies activating the deferred Events capability. Event names, envelope Contracts, and delivery mechanics remain intentionally undefined until that review.

---

# 120. Phase 4 Milestone P4-M08 — Knowledge Events

Current milestone status:

```text
DEFERRED — no real production Event consumer
```

P4-M08 was demand-reviewed after P4-M07 established the first real Knowledge lifecycle transitions.

The activation gate is:

```text
activate shared Events only when
a real implemented producer/consumer boundary
requires business Event publication/subscription mechanics
```

P4-M07 now gives Knowledge meaningful state changes that could eventually act as Event producer points:

```text
DRAFT -> PUBLISHED

PUBLISHED -> ARCHIVED
```

That alone is not sufficient to materialize shared Events.

Repository evidence at the P4-M08 demand review:

```text
Knowledge lifecycle transitions
IMPLEMENTED

production Event publisher
NONE

production Event subscriber
NONE

concrete Knowledge Event Contract
NONE

Events Kernel package
NOT MATERIALIZED

Event publisher abstraction
NONE

Event subscriber abstraction
NONE

Event bus
NONE

Event/outbox persistence
NONE

Queue/broker
NONE

apps/worker
NOT MATERIALIZED

real production Event consumer
NONE

real producer/consumer Event boundary
NONE
```

Potential names remain conceptual rather than approved Contracts:

```text
KnowledgeCreated
KnowledgeUpdated
KnowledgePublished
KnowledgeArchived
```

No final Event name, payload, envelope, ordering rule, delivery guarantee, retry rule, or subscriber Contract is justified until a real consumer exists.

The accepted ownership model remains unchanged:

```text
Knowledge Platform
    owns the business meaning of Knowledge lifecycle changes
    owns when a future Knowledge Event is semantically true

Events Kernel
    would own shared Event publication mechanics
    would own Event envelope conventions
    would own shared subscription mechanics

Event consumer
    owns only its derived reaction/projection
    does not gain Knowledge ownership
```

P4-M08 therefore introduces:

```text
NO @ai-world/kernel-events package

NO Event base class

NO generic Event envelope

NO Event publisher abstraction

NO Event subscriber abstraction

NO in-process Event bus

NO outbox

NO Event persistence table

NO Queue

NO broker

NO worker application

NO Prisma schema change

NO database migration

NO Knowledge source change

NO API or Web change
```

Canonical migration count remains:

```text
12
```

Deferral is intentional. The lifecycle operations themselves remain canonical synchronous Knowledge mutations. The absence of Events does not weaken their ownership or persistence semantics.

The activation gate remains open. Events should be reconsidered when a real implemented consumer — for example a future Discovery projection, Media integration, Composition reaction, worker process, or another concrete capability — must react to Knowledge changes without being coupled directly to the Knowledge mutation path.

P4-M08 demand-review conclusion:

```text
MEANINGFUL LIFECYCLE PRODUCER POINTS
YES

REAL PRODUCTION EVENT CONSUMER
NONE

REAL PRODUCER/CONSUMER EVENT BOUNDARY
NONE

EVENTS IMPLEMENTATION
DEFERRED

SPECULATIVE EVENT SCAFFOLDING
REJECTED
```

At P4-M08 deferral, the next milestone was:

```text
P4-M09 — Sources
```

P4-M09 remains demand-driven and must introduce Source/provenance semantics only if an implemented Devotional Resource establishes a real traceability requirement.

---

# 121. Phase 4 Milestone P4-M09 — Sources

Current milestone status:

```text
DEFERRED — no implemented Devotional source-backed Resource
```

P4-M09 was demand-reviewed against the implemented Devotional domain before introducing Source/provenance semantics.

The activation gate is:

```text
an implemented Devotional Resource
requires traceability
to an external or textual source
```

Current Devotional production evidence:

```text
implemented Devotional Resource types
1

implemented Resource
DeityResource

DeityResource domain-specific field
name

ScriptureResource
NOT MATERIALIZED

source-sensitive explanatory Resource
NOT MATERIALIZED

external/textual Source reference
NONE

provenance field/Contract
NONE

Citation field/Contract
NONE

real Source traceability requirement
NONE
```

The canonical Ownership Model already reserves Source ownership appropriately:

```text
Knowledge Platform
    owns canonical Source representation/reference

Universe/domain Resource
    establishes the real semantic need for traceability
```

That architectural reservation does not justify materializing Source infrastructure before a real Resource requires it.

P4-M09 therefore introduces:

```text
NO Source domain model

NO Source public Contract

NO Source repository

NO Source persistence table

NO provenance abstraction

NO generic Source registry

NO URL/document Source normalization framework

NO Source API

NO Source Web UI

NO Prisma schema change

NO database migration

NO Devotional source change

NO Knowledge source change
```

Canonical migration count remains:

```text
12
```

The likely future activation pressure remains Devotional Scripture or source-sensitive devotional explanatory content. When such a Resource is actually implemented, Source semantics should be designed from that Resource's real traceability requirements rather than from hypothetical future needs.

P4-M09 demand-review conclusion:

```text
IMPLEMENTED DEVOTIONAL RESOURCE TYPES
1

SOURCE-BACKED DEVOTIONAL RESOURCE
NONE

REAL SOURCE TRACEABILITY REQUIREMENT
NONE

SOURCE IMPLEMENTATION
DEFERRED

SPECULATIVE SOURCE INFRASTRUCTURE
REJECTED
```

At P4-M09 deferral, the next milestone was:

```text
P4-M10 — Citations
```

P4-M10 retained the same demand-driven activation gate: structured Citation association would be justified only when a real source-backed Resource required citation semantics distinct from the Source itself.

---

# 122. Phase 4 Milestone P4-M10 — Citations

Current milestone status:

```text
DEFERRED — no implemented Devotional Resource requires Citation semantics distinct from Source
```

P4-M10 was demand-reviewed after P4-M09 Sources remained deferred.

The activation gate is:

```text
an implemented Resource
is already source-backed
and requires structured Citation association
whose semantics are distinct from the Source itself
```

Current Devotional production evidence:

```text
implemented Devotional Resource types
1

implemented Resource
DeityResource

DeityResource domain-specific field
name

Source-backed Devotional Resource
NONE

ScriptureResource
NOT MATERIALIZED

Citation field
NONE

Citation collection/association
NONE

page/chapter/verse locator semantics
NONE

real Citation requirement distinct from Source
NONE
```

The canonical Ownership Model already reserves Citation ownership appropriately:

```text
Knowledge Platform
    owns canonical Citation semantics

Resource / domain consumer
    establishes the real need for structured citation association
```

That ownership reservation does not justify materializing Citation infrastructure before a real consumer exists.

P4-M09 Sources is itself deferred because there is no implemented Devotional source-backed Resource. P4-M10 therefore has no real source-backed Resource against which distinct Citation semantics can currently be designed.

P4-M10 therefore introduces:

```text
NO Citation domain model

NO Citation public Contract

NO Citation association abstraction

NO Citation repository

NO Citation persistence table

NO locator vocabulary

NO academic citation-style framework

NO footnote/endnote framework

NO Citation API

NO Citation Web UI

NO Prisma schema change

NO database migration

NO Devotional source change

NO Knowledge source change
```

Canonical migration count remains:

```text
12
```

Potential future requirements such as:

```text
Source + page

Source + chapter

Source + verse

Source + passage range

Source + quoted span

Source + edition-specific locator
```

remain intentionally undefined. They should be derived from an implemented source-backed Resource, not standardized before the domain requires them.

P4-M10 demand-review conclusion:

```text
SOURCE-BACKED DEVOTIONAL RESOURCE
NONE

REAL STRUCTURED CITATION ASSOCIATION
NONE

CITATION SEMANTICS DISTINCT FROM SOURCE REQUIRED
NO

CITATION IMPLEMENTATION
DEFERRED

SPECULATIVE CITATION INFRASTRUCTURE
REJECTED
```

The activation gate remains open. P4-M10 should be revisited when a real Resource needs structured citation information that cannot be represented merely as its Source reference.

At P4-M10 deferral, the next milestone was:

```text
P4-M11 — Temporal Baseline
```

P4-M11 retained the demand-driven gate and required a review before any reusable temporal semantics could be introduced.

---

# 123. Phase 4 Milestone P4-M11 — Temporal Baseline

Current milestone status:

```text
DEFERRED — no implemented Devotional Resource requires reusable date/date-range semantics
```

P4-M11 was demand-reviewed before introducing reusable temporal semantics.

The activation gate is:

```text
an implemented Devotional Resource
has a real domain temporal requirement
that benefits from shared date/date-range semantics
```

Current Devotional production evidence:

```text
implemented Devotional Resource types
1

implemented Resource
DeityResource

DeityResource domain-specific field
name

birth/death semantics
NONE

festival/observance date semantics
NONE

event date semantics
NONE

effective/valid date-range semantics
NONE

start/end date semantics
NONE

year/era/century semantics
NONE

real domain temporal consumer
NONE
```

Knowledge already contains:

```text
createdAt
updatedAt
```

Those fields are technical record timestamps. They answer when the canonical record was created or updated; they do not model when the domain subject existed, occurred, was valid, was observed, or belonged to a historical period.

Therefore:

```text
TECHNICAL TIMESTAMP
!=
DOMAIN TEMPORAL SEMANTIC
```

P4-M11 introduces:

```text
NO DateRange value object

NO Temporal abstraction

NO approximate-date abstraction

NO partial-date abstraction

NO historical era abstraction

NO uncertainty model

NO calendar-system abstraction

NO recurring-date abstraction

NO temporal relation model

NO Knowledge domain temporal fields

NO Prisma schema change

NO database migration

NO Devotional source change

NO Knowledge source change
```

Canonical migration count remains:

```text
12
```

Potential future needs such as:

```text
birth/death date

festival or observance date

historical period

temple founding date

text composition period

effective date range

approximate or uncertain date
```

remain intentionally undefined until an implemented Resource establishes the actual semantics required.

P4-M11 demand-review conclusion:

```text
IMPLEMENTED DEVOTIONAL RESOURCE TYPES
1

REAL DOMAIN TEMPORAL CONSUMER
NONE

TECHNICAL createdAt/updatedAt
PRESENT — NOT AN ACTIVATION SIGNAL

SHARED DATE/DATE-RANGE IMPLEMENTATION
DEFERRED

SPECULATIVE TEMPORAL ABSTRACTION
REJECTED
```

The activation gate remains open. P4-M11 should be revisited when an implemented Resource requires reusable domain date/date-range behavior.

At P4-M11 deferral, the next milestone was:

```text
P4-M12 — Devotional Universe v1
```

---

# 124. Phase 4 Milestone P4-M12 — Devotional Universe v1

Current milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
1b7fab5bcdbe39024bef686af3c636a738042623
feat(devotional): establish universe v1
```

Remote validation:

```text
GitHub Actions CI
run 31926097194
completed / success
exact implementation SHA verified
```

Actual v1 scope:

```text
Universe
universe.devotional

Resource Types
devotional.deity
devotional.scripture
devotional.temple

Typed Resources
DeityResource      -> name
ScriptureResource  -> title
TempleResource     -> name
```

All three typed Resources specialize the shared Knowledge Resource contract.

P4-M12 deliberately did not promote a generic shared Universe Definition abstraction. The concrete Devotional definition remains Devotional-owned until the Anime reuse test supplies a second structural consumer.

Deferred shared capability state at closure:

```text
Taxonomy / classification
NOT ACTIVATED

Resource relationships
NOT ACTIVATED

Source / provenance
NOT ACTIVATED

Citation
NOT ACTIVATED

Reusable domain Temporal semantics
NOT ACTIVATED

generic Universe Registry
NOT CREATED

Devotional database / Search / auth infrastructure
NOT CREATED

Prisma schema change
NONE

database migration
NONE

canonical migrations
12
```

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

P4-M12 closure outcome:

```text
Devotional domain definitions specialize shared Knowledge
PROVED FOR DEVOTIONAL v1

Devotional-specific semantics stay in the Devotional owner
PROVED

shared Knowledge contains no Devotional-specific core branches
PROVED

separate Devotional database engine
NOT CREATED

separate Devotional Search infrastructure
NOT CREATED

separate Devotional authorization engine
NOT CREATED

generic shared Universe definition framework
INTENTIONALLY NOT PROMOTED YET
```

Shared authorization remains owned by Identity & Access and is consumed through the existing actor-facing Knowledge operations rather than through a Devotional-specific authorization engine.

The second-Universe Anime reuse test is now responsible for determining whether the concrete Devotional definition pattern should become a shared typed Universe Definition contract.

---

# 126. Phase 4 Milestone P4-M13 — Anime Reuse-Test Universe v1

Current milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
c90b4a99e1d66319e54278afbf2017a6c63af6b8
feat(anime): establish reuse-test universe v1
```

Remote validation:

```text
GitHub Actions CI
run 31927100260
completed / success
exact implementation SHA verified
```

Product-priority boundary:

```text
Devotional
PRIMARY PRODUCT / DOMAIN PRIORITY

Anime
BOUNDED SECOND-UNIVERSE ARCHITECTURE REUSE TEST
NOT A PARALLEL PRODUCT PRIORITY
```

Actual Anime v1 scope:

```text
Universe
universe.anime

Resource Types
anime.character
anime.series

Typed Resources
CharacterResource -> name
SeriesResource    -> title
```

Both typed Anime Resources specialize the shared Knowledge Resource contract. Anime consumes shared Knowledge and does not depend on Devotional.

Reuse conclusion:

```text
Devotional concrete Universe-definition pattern
REUSED SUCCESSFULLY

generic shared UniverseDefinition contract
NOT PROMOTED

Universe Registry
NOT CREATED

shared Platform named-Universe core branches
NONE
```

The second consumer proved the concrete pattern can support a structurally different Universe without forcing a new shared runtime abstraction. Promotion remains demand-driven until an actual shared consumer or registry requires a common Contract.

Deferred potential scope at P4-M13 closure:

```text
Genre / reusable classification
NOT MATERIALIZED

Character APPEARS_IN Series
NOT MATERIALIZED

Taxonomy mechanics
NOT ACTIVATED

Relationship mechanics
NOT ACTIVATED

Source / Citation / Temporal
NOT ACTIVATED

Anime-specific database / Search / authorization infrastructure
NOT CREATED

Prisma schema change
NONE

database migration
NONE

canonical migrations
12
```

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

P4-M13 closure outcome:

```text
same Knowledge Platform
PROVED

same Identity/Authorization ownership model
PRESERVED — Anime adds no authorization engine

same Taxonomy mechanics where activated
NOT EXERCISED — Taxonomy remains deferred

same Relationship mechanics where activated
NOT EXERCISED — Relationships remain deferred

different domain semantics
PROVED — Character and Series remain Anime-owned

Anime-specific database engine
NOT CREATED

Anime-specific Search infrastructure
NOT CREATED

Anime-specific Platform core branches
NONE

Anime-to-Devotional production dependency
NONE

generic shared UniverseDefinition abstraction
NOT PROMOTED
```

The reuse test demonstrates that Devotional and Anime can specialize the same shared Knowledge contract while keeping their domain semantics isolated. This is sufficient for P4-M13; broader Anime product work remains outside the current priority, and Devotional remains the primary product/domain focus.

---

# 128. Phase 4 Milestone P4-M14 — Basic Public Knowledge API

Current milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
c7f21161e896cd3daa838aa14fca71907313b7a8
feat(knowledge): expose public read API
```

Remote validation:

```text
GitHub Actions CI
run 31928964366
completed / success
exact implementation SHA verified
```

Primary product/domain focus:

```text
Devotional
PRIMARY

Anime
reuse/isolation proof only
```

Actual public API:

```text
GET /knowledge/resources/:id

GET /knowledge/resources
    universeKey REQUIRED
    resourceType OPTIONAL
    limit OPTIONAL
```

Controlled public visibility:

```text
PUBLISHED
PUBLIC

DRAFT
HIDDEN

ARCHIVED
HIDDEN
```

Public query bounds:

```text
default limit
20

maximum limit
50

stable order
createdAt DESC
id ASC
```

Public response surface:

```text
id
universeKey
resourceType
createdAt
updatedAt

lifecycle
NOT EXPOSED
```

Devotional integration proof:

```text
published devotional.deity
VISIBLE

published devotional.scripture
VISIBLE

draft devotional.temple
HIDDEN

archived devotional.deity
HIDDEN

published anime.character during Devotional query
EXCLUDED
```

Architecture / persistence outcome:

```text
named-Universe production branches
NONE

creator write endpoints
NONE

Prisma schema change
NONE

database migration
NONE

canonical migrations
12
```

Validation evidence:

```text
Knowledge unit validation
5 test files / 37 tests passed

Public Knowledge API integration
1 test file / 10 tests passed

Architecture validation
367 modules / 943 dependencies / 0 violations
```

P4-M14 deliberately stops at public read/query. Protected creation/editing remains P4-M15.

Expose controlled read/query APIs.

---

# 129. Phase 4 Milestone P4-M15 — Basic Creator Knowledge API

Current milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
888523cbf7d35e8dc4f5751d650f81384da8a6df
feat(knowledge): expose creator write API
```

Remote validation:

```text
GitHub Actions CI
run 31930221502
completed / success
exact implementation SHA verified
```

Primary product/domain focus:

```text
Devotional
PRIMARY
```

Protected creator API:

```text
POST /knowledge/resources

PATCH /knowledge/resources/:id
```

Authentication / authorization:

```text
Session
REQUIRED

actingActorId
DERIVED FROM VALIDATED SESSION ONLY

create Permission
knowledge.resource.create

update Permission
knowledge.resource.update
```

Security ordering:

```text
Session validation
↓
Permission evaluation
↓
Canonical ResourceId / NamespacedKey validation
↓
Knowledge owner operation
↓
Persistence
```

Validation semantics:

```text
unauthorized malformed input
FORBIDDEN BEFORE CANONICAL VALIDATION

authorized malformed canonical input
400 knowledge.resource.invalid_input

downstream repository/data TypeError
NOT RECLASSIFIED AS CLIENT VALIDATION
```

Devotional integration proof:

```text
knowledge-editor
CREATES

universe.devotional
devotional.deity
DRAFT

public P4-M14 GET for created DRAFT
HIDDEN / 404

canonical edit
devotional.deity -> devotional.temple
```

Deliberately excluded:

```text
creator UI
NONE

publish/archive HTTP endpoints
NONE

typed Universe payload persistence
NONE

named-Universe production branches
NONE

Search
NOT ACTIVATED

Taxonomy / Relationships / Source / Citation / Temporal
NOT ACTIVATED
```

Persistence outcome:

```text
Prisma schema change
NONE

database migration
NONE

canonical migrations
12
```

Validation evidence:

```text
Knowledge unit validation
5 test files / 41 tests passed

Creator Knowledge API integration
1 test file / 10 tests passed

Architecture validation
370 modules / 968 dependencies / 0 violations
```

P4-M15 stops at the protected creation/editing API boundary. The creator UI remains intentionally unmaterialized.

Expose protected creation/editing APIs.

Creator UI may remain minimal.

---

# 130. Phase 4 Milestone P4-M16 — Web Knowledge Experience

Current milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
b61374d744c8accf9da8300c5f196644bf9e1dc9
feat(web): add knowledge experience
```

Remote validation:

```text
GitHub Actions CI
run 31933927697
push / main
completed / success
exact implementation SHA verified
```

Primary product/domain focus:

```text
Devotional
PRIMARY
```

Web route:

```text
/knowledge
```

Presented views:

```text
Devotional Resources
PRIMARY / FIRST

Anime Resources
SECONDARY / BOUNDED REUSE-TEST
```

Shared public Knowledge contract consumed:

```text
GET /knowledge/resources?universeKey=universe.devotional

GET /knowledge/resources?universeKey=universe.anime
```

Web ownership boundary:

```text
direct Platform package dependency
NONE

direct Universe package dependency
NONE

deep package import
NONE

canonical Knowledge ownership in Web
NONE
```

Deferred capabilities:

```text
relationships
NOT RENDERED — capability remains deferred

classification / Taxonomy
NOT RENDERED — capability remains deferred

Source / Citation / reusable Temporal / Search
NOT ACTIVATED
```

Creator/editor scope:

```text
creator UI
NONE

Knowledge write controls
NONE

publish/archive controls
NONE
```

Persistence outcome:

```text
Prisma schema change
NONE

database migration
NONE

canonical migrations
12
```

Validation evidence:

```text
Web lint
PASS

Web typecheck
PASS

Web unit tests
6 files / 23 tests passed

Web production build
PASS

Playwright browser validation
3 tests passed

Architecture validation
375 modules / 978 dependencies / 0 violations
```

P4-M16 completes the final named implementation milestone currently listed inside Phase 4. Phase 4 itself remains ACTIVE until Sections 131–135 are explicitly reviewed and the Phase 4 Closure Criteria are evaluated.

Next delivery action:

```text
Section 131 — Phase 4 Proof Generality Review
```

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

Current review status:

```text
CLOSED
```

Review baseline:

```text
743c36d0583cbdb073146ca85ac47d8e76539cfa
docs(roadmap): close P4-M16

GitHub Actions
31934463622
completed / success
```

## 131.1 Shared Knowledge capabilities genuinely required by Devotional

The implemented Devotional slices genuinely required and exercised:

```text
canonical KnowledgeResource identity
universeKey + resourceType NamespacedKey addressing
typed Universe Resource extension
shared Knowledge persistence
create / get / update
owner-side mutation authorization
DRAFT -> PUBLISHED -> ARCHIVED lifecycle
published-only public get/list
```

The public API, creator API, and Web experience are delivery surfaces proving those shared capabilities; they are not separate canonical owners.

The following proposed shared capabilities were not required by the implemented Devotional proof and therefore remained deferred:

```text
Taxonomy
Relationships
Knowledge Events
Sources
Citations
domain Temporal semantics
dedicated Search
```

## 131.2 Anime reuse without shared-core modification

Result:

```text
REUSED WITHOUT SHARED-CORE MODIFICATION
```

The Anime v1 implementation added its own typed Universe package and workspace registration while reusing `@ai-world/platform-knowledge`. It did not require Knowledge Platform, Kernel, API, Web, or Prisma production changes.

Devotional runtime dependency:

```text
@ai-world/platform-knowledge
```

Anime runtime dependency:

```text
@ai-world/platform-knowledge
```

P4-M16 later demonstrated the same reuse at the Web boundary by rendering Devotional and Anime through the same `KnowledgeUniverseSection` and the same generic public Knowledge HTTP adapter.

## 131.3 Duplicate infrastructure review

Result:

```text
NONE
```

There is one canonical `KnowledgeResource` persistence model.

There is no:

```text
Devotional database model;
Anime database model;
Universe-specific authentication system;
Universe-specific authorization engine;
Universe-specific Search infrastructure;
Universe-specific Event bus;
Universe-specific persistence provider.
```

## 131.4 Metadata-as-untyped-escape-hatch review

Result:

```text
NOT INTRODUCED
```

The shared `KnowledgeResource` model contains no Metadata bag.

The canonical Prisma Knowledge Resource model contains no Metadata field.

Typed Universe Resources keep explicit domain fields:

```text
DeityResource.name
ScriptureResource.title
TempleResource.name
CharacterResource.name
SeriesResource.title
```

At Proof Generality Review closure, the Metadata Decision Gate remained separate and followed this review. Section 132 has now evaluated that evidence and deferred the Metadata Kernel.

## 131.5 Named-Universe Platform switch review

Result:

```text
NONE FOUND
```

Reviewed Platform and Kernel production source contains no named Devotional or Anime Universe/Resource tokens.

Shared Knowledge creation and public listing remain generic over:

```text
NamespacedKey
universeKey
resourceType
```

Named Universe values are confined to Universe definitions and application-level presentation/integration proof where such selection belongs.

## 131.6 History shared-core change expectation

Review conclusion:

```text
FEWER BASELINE SHARED-CORE CHANGES EXPECTED
```

The already-proven generic Resource/typing/persistence/auth/lifecycle/public-read baseline should be reusable for History without rebuilding the Knowledge core.

This is not a claim that History will require no new shared capability. History remains the later third structural reuse test and may establish real consumers for currently deferred:

```text
Sources
Citations
Temporal semantics
Relationships
Taxonomy
```

Any such capability should be activated only from concrete History or earlier real product pressure, not speculatively.

## 131.7 Review conclusion

```text
PROOF GENERALITY REVIEW
CLOSED

Devotional primary product proof
PRESERVED

Anime shared-core reuse
DEMONSTRATED

Duplicate infrastructure
NONE

Metadata escape hatch
NOT INTRODUCED

Platform Universe switches
NONE FOUND

Phase 4
ACTIVE

AT REVIEW CLOSURE
Metadata Decision Gate followed next

CURRENT RESULT
Metadata Decision Gate CLOSED — Metadata Kernel DEFERRED
```

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

Current decision status:

```text
CLOSED
```

Decision:

```text
METADATA KERNEL
DEFERRED
```

Decision baseline:

```text
0082539c6c96aeb77ad87de267097d0ae9ceb639
docs(roadmap): close Phase 4 generality review

GitHub Actions
31935169513
completed / success
```

## 132.1 Real variation observed

Implemented Devotional typed Resource properties:

```text
DeityResource.name
ScriptureResource.title
TempleResource.name
```

Implemented Anime typed Resource properties:

```text
CharacterResource.name
SeriesResource.title
```

These are stable meaningful domain properties and are already represented by typed Universe contracts.

No implemented Resource currently demonstrates a set of extensible descriptive properties that requires a shared Metadata definition/value engine.

## 132.2 Current shared Knowledge model

The canonical `KnowledgeResource` remains limited to:

```text
id
universeKey
resourceType
lifecycle
createdAt
updatedAt
```

There is no generic Metadata bag in the shared Knowledge contract.

The canonical Prisma `KnowledgeResource` model likewise has no Metadata field.

## 132.3 Metadata capability materialization review

Current reusable Metadata implementation:

```text
Metadata Kernel package
NONE

Metadata Platform package
NONE

Metadata Definition registry
NONE

Metadata value persistence
NONE

Metadata query semantics
NONE

Metadata compatibility/versioning mechanics
NONE
```

No current API, Web, Knowledge, Devotional, or Anime production requirement depends on those mechanics.

## 132.4 Architecture fit

The accepted Universe Principles prefer:

```text
GENERIC KNOWLEDGE PLATFORM
+
TYPED UNIVERSE DEFINITIONS
+
CONTROLLED METADATA EXTENSIONS
```

They do not require Metadata to exist before real extensible-property pressure exists.

Important stable fields should not be represented merely through arbitrary Metadata.

Future Metadata, if activated, must remain:

```text
typed
validated
owned
queryable where required
versionable where required
```

The accepted Extension Model also requires the least powerful safe mechanism and treats `Metadata Definition` as one possible typed-definition mechanism rather than an automatically materialized universal framework.

## 132.5 Decision rationale

Real pressure is insufficient to justify a shared Metadata Kernel now.

Implementing it at this point would require choosing mechanics for:

```text
definition identity
definition validation
value typing
ownership
registration
persistence
querying
compatibility
versioning
migration
```

without a concrete production Resource requiring those mechanics.

The existing typed Universe model is simpler, safer, and already passed the Anime reuse test without shared-core modification.

Therefore Section 132 follows its explicit `If no` branch:

```text
defer it.
```

## 132.6 Future activation gate

Re-evaluate Metadata only when an implemented Resource/Universe supplies a concrete consumer with both:

```text
extensible descriptive properties
that should not become stable typed Resource fields

AND

shared mechanics required for
definition / validation / persistence / query / compatibility
```

Potential future History or another Universe pressure may activate Metadata, but future possibility alone is not an activation reason.

## 132.7 Decision result

```text
METADATA DECISION GATE
CLOSED

METADATA KERNEL
DEFERRED

PRODUCTION CODE CHANGE
NONE

SCHEMA CHANGE
NONE

MIGRATION
NONE

CANONICAL MIGRATIONS
12

PHASE 4
ACTIVE

NEXT
Workflow Decision Gate
```

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

Current decision status:

```text
CLOSED
```

Decision:

```text
WORKFLOW KERNEL
DEFERRED
```

Decision baseline:

```text
763523052b9929ce9c396db8c403521317240ce8
docs(roadmap): close Metadata decision gate

GitHub Actions
31935914132
completed / success
```

## 133.1 Existing lifecycle is not Workflow proof

Knowledge currently owns exactly three lifecycle states:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Implemented transitions:

```text
DRAFT -> PUBLISHED

PUBLISHED -> ARCHIVED
```

These are direct canonical Resource lifecycle transitions.

They do not by themselves establish reusable Workflow requirements.

## 133.2 Current editorial-process evidence

Current reusable editorial mechanics:

```text
submit for review
NONE

review state
NONE

reviewer assignment
NONE

approval
NONE

rejection
NONE

multi-step approval
NONE

Workflow Definition
NONE

Workflow Instance
NONE

workflow/process history
NONE
```

The current creator API exposes create/update only. It does not expose a review/approval process.

Knowledge authorization currently defines semantic actions for:

```text
create
update
publish
archive
```

It does not define separate review/approve/reject actions.

## 133.3 Current Workflow materialization

```text
Workflow Kernel package
NONE

Workflow Platform package
NONE

Workflow Definition persistence
NONE

Workflow Instance persistence
NONE

Approval persistence
NONE

Reviewer/assignment persistence
NONE
```

Canonical migrations remain 12.

## 133.4 Ownership boundary

The accepted ownership model states:

```text
Workflow Kernel
owns reusable Workflow mechanics

Platform / Universe
owns business Workflow meaning

Workflow may coordinate advanced process later

Workflow does not own target Resource state

Knowledge remains owner of Knowledge canonical mutation/lifecycle
```

Therefore a future Workflow capability must coordinate process without taking ownership of the Knowledge Resource.

## 133.5 Decision rationale

The current editorial requirement is satisfied by direct Knowledge lifecycle semantics plus owner-side authorization.

Adding Workflow now would require prematurely choosing mechanics for:

```text
Workflow Definition identity
Workflow Instance lifecycle
participants / reviewer assignment
approval / rejection rules
transition authorization
history / audit interaction
retry / concurrency behavior
persistence
configuration / versioning
Universe-specific process variation
```

without a real consumer requiring those mechanics.

Section 133 therefore follows the demand-driven architecture principle:

```text
Do not add Workflow merely because publishing states exist.
```

Decision:

```text
defer reusable Workflow.
```

## 133.6 Future activation gate

Re-evaluate Workflow when an implemented product/editorial slice requires process semantics beyond direct lifecycle transitions, such as one or more of:

```text
submit-for-review
explicit review state
reviewer or participant assignment
approval / rejection
multiple approval stages
conditional/branching process
reusable Workflow Definitions
durable Workflow Instances/history
different reusable editorial processes across contexts/Universes
```

At that point, Workflow should own reusable process mechanics while Knowledge remains canonical Resource owner.

## 133.7 Decision result

```text
WORKFLOW DECISION GATE
CLOSED

WORKFLOW KERNEL
DEFERRED

PRODUCTION CODE CHANGE
NONE

SCHEMA CHANGE
NONE

MIGRATION
NONE

CANONICAL MIGRATIONS
12

PHASE 4
ACTIVE

AT WORKFLOW GATE CLOSURE
Policy Decision Gate followed next

CURRENT RESULT
Policy Decision Gate CLOSED — Policy Kernel DEFERRED
```

Evaluate whether editorial requirements now justify reusable Workflow.

Do not add it merely because publishing states exist.

---

# 134. Policy Decision Gate

Current decision status:

```text
CLOSED
```

Decision:

```text
POLICY KERNEL
DEFERRED
```

Decision baseline:

```text
380ddd69e8c817a4dd19926a741caf382b07c716
docs(roadmap): close Workflow decision gate

GitHub Actions
31936814311
completed / success
```

## 134.1 Current owner-local rules

Current stable Knowledge rules include:

```text
lifecycle
DRAFT -> PUBLISHED -> ARCHIVED

public visibility
PUBLISHED only

semantic actions
create
update
publish
archive
```

These rules have clear Knowledge ownership and do not currently vary through external policy configuration.

Identity & Access owns authorization representation/evaluation. Knowledge defines the meaning of its actions and supplies permission keys; Identity & Access evaluates Actor permission assignments.

The existing owner-local files named `authorization-policy.ts` contain stable Role/Permission/action vocabulary. They are not a generic Policy Kernel.

## 134.2 Cross-context configurability review

Current implemented configurable cross-context Policy consumers:

```text
Universe publication requirements
NONE

Universe source requirements
NONE

Universe moderation rules
NONE

Universe visibility rules
NONE

regional restrictions
NONE

Universe AI-use policies
NONE
```

The Devotional and Anime Universe definitions currently contain only Universe identity/resource-type definition data and no policy configuration.

## 134.3 Current Policy materialization

```text
Policy Kernel package
NONE

Policy Platform package
NONE

Policy Definition
NONE

Policy Registry
NONE

Policy Evaluator
NONE

Policy Rule abstraction
NONE

Policy persistence
NONE
```

Canonical migrations remain 12.

## 134.4 Ownership boundary

Accepted architecture establishes:

```text
Universe
owns domain-specific policy configuration

Policy Kernel
owns representation/evaluation mechanics where genuinely shared

Defining consumer
owns business policy meaning

Identity & Access
continues to own Authorization semantics
```

A future Policy Kernel must therefore not absorb Domain meaning or replace Identity-owned authorization.

## 134.5 Decision rationale

The current system has rules, but the existence of rules is not sufficient evidence for a shared Policy Kernel.

The implemented rules are:

```text
stable
owner-specific
directly encoded by their semantic owners
not cross-context configurable
not reused through a shared policy representation
```

Creating Policy now would prematurely require decisions around:

```text
policy identity
policy context
rule representation
composition / precedence
conflict semantics
evaluation result
configuration ownership
persistence
versioning
authorization interaction
```

without a concrete consumer needing those mechanics.

Section 134 therefore follows its explicit fallback:

```text
keep stable rules in their Domain owners.
```

## 134.6 Future activation gate

Re-evaluate Policy when an implemented product slice demonstrates both:

```text
a business rule must vary through configuration
across Universe / context / product boundaries

AND

multiple consumers need shared representation/evaluation mechanics
```

Potential future examples include:

```text
publication requirements
source requirements
moderation
visibility
regional restrictions
AI-use rules
```

Those examples are future activation candidates, not current requirements.

## 134.7 Decision result

```text
POLICY DECISION GATE
CLOSED

POLICY KERNEL
DEFERRED

PRODUCTION CODE CHANGE
NONE

SCHEMA CHANGE
NONE

MIGRATION
NONE

CANONICAL MIGRATIONS
12

PHASE 4
AT POLICY GATE CLOSURE: ACTIVE

AT POLICY GATE CLOSURE
Phase 4 Closure Criteria Evaluation followed next

CURRENT RESULT
Phase 4 Closure Criteria Evaluation CLOSED — 15/15 SATISFIED
Phase 4 COMPLETE
```

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

Current evaluation status:

```text
CLOSED
```

Evaluation baseline:

```text
4165ecfe25a94f750d37f0d555fdcddc7ec99213
docs(roadmap): close Policy decision gate

GitHub Actions
31937800697
completed / success
```

## 135.1 Criterion-by-criterion evaluation

| # | Closure criterion | Result | Evidence |
|---|---|---|---|
| 1 | Knowledge owns canonical Resources | SATISFIED | Ownership Model assigns the canonical Knowledge Resource/Entity owner to Knowledge; shared `KnowledgeResource` and exactly one canonical Prisma `KnowledgeResource` model exist. |
| 2 | typed domain modeling works | SATISFIED | Devotional Deity/Scripture/Temple and Anime Character/Series Resources extend shared `KnowledgeResource` with explicit typed domain fields. |
| 3 | Devotional v1 works | SATISFIED | P4-M12 is CLOSED; `universe.devotional` defines Deity, Scripture, and Temple Resource Types over shared Knowledge. |
| 4 | Anime v1 works | SATISFIED | P4-M13 is CLOSED; `universe.anime` defines Character and Series Resource Types as the bounded second-Universe reuse proof. |
| 5 | Taxonomy works across both where reusable classification is required | SATISFIED — CONDITION NOT TRIGGERED | P4-M05 demand review found no implemented reusable classification consumer; Taxonomy remains deferred with an activation gate rather than being materialized speculatively. |
| 6 | Relationships work across both where reusable connections are required | SATISFIED — CONDITION NOT TRIGGERED | P4-M06 found no implemented Resource-to-Resource relationship consumer; Relationships remains deferred with an activation gate. |
| 7 | Identity/Authorization protects mutation | SATISFIED | Knowledge create/update/publish/archive actions are permission-protected through Identity & Access evaluation and owner-side actor wrappers. |
| 8 | basic lifecycle works | SATISFIED | Knowledge owns `DRAFT -> PUBLISHED -> ARCHIVED` with implemented publish/archive transitions. |
| 9 | Events/Audit exist where required | SATISFIED | Audit is materialized through a real security-sensitive Identity consumer; Knowledge Events were demand-reviewed and deferred because no production Event consumer exists. |
| 10 | Source/Citation semantics exist only where required by real Resources | SATISFIED — CONDITION NOT TRIGGERED | P4-M09/P4-M10 found no implemented proof Resource requiring Source or distinct Citation semantics; both retain activation gates. |
| 11 | Temporal semantics are implemented from real demand or explicitly deferred to History | SATISFIED — EXPLICITLY DEFERRED | No current proof Resource needs domain temporal semantics; `createdAt`/`updatedAt` remain technical timestamps and reusable temporal semantics remain deferred to later real demand/History. |
| 12 | Web/API can consume both initial proof Universes | SATISFIED | `/knowledge` renders Devotional and Anime through the same shared component; the Web adapter/public Knowledge API are generic by `universeKey`. |
| 13 | no duplicate Universe infrastructure exists | SATISFIED | Devotional and Anime each depend at runtime only on shared Knowledge; no separate Universe auth/storage/search/event infrastructure was introduced. |
| 14 | no core `switch(universe)` architecture exists | SATISFIED | Reviewed Platform/Kernel production source contains no Devotional/Anime literals or named-Universe core branch. |
| 15 | History remains positioned as the later third structural reuse test | SATISFIED | History remains deliberately after Devotional and Anime; it was not pulled into Phase 4 merely to manufacture genericity. |

## 135.2 Closure result

```text
TOTAL CRITERIA
15

SATISFIED
15

UNSATISFIED
0
```

Conditional wording is part of the accepted closure contract. A capability whose explicit `where required` condition was not triggered is satisfied by the recorded demand review plus future activation gate; Phase 4 is not required to materialize unused shared infrastructure merely to close.

## 135.3 Phase decision

```text
PHASE 4 — Knowledge Platform
COMPLETE

EXIT OUTCOME
MULTI-UNIVERSE KNOWLEDGE PLATFORM

PHASE 5 — Media Platform
NEXT
```

## 135.4 Tag decision

The Phase 4 closure criteria justify the annotated tag:

```text
phase-4-complete
```

but the tag must not be created until the exact Phase 4 closure documentation commit has completed remote CI successfully.

This Section 135 evaluation itself performs no commit, push, or tag.

---

# 136. Phase 4 Exit Outcome

AI World becomes a demonstrated:

```text
MULTI-UNIVERSE KNOWLEDGE PLATFORM.
```

Current exit status:

```text
ACHIEVED
```

Section 135 evaluated all 15 accepted Phase 4 closure criteria as satisfied.

Phase 4 therefore exits as a demonstrated:

```text
MULTI-UNIVERSE KNOWLEDGE PLATFORM.
```

Phase 5 — Media Platform is ACTIVE.

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

## P5-M01 CLOSURE RECORD

Milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
9dbc6cee582c3bde882c2f0fc0cb5cf5799c5f66
feat(media): establish asset model baseline
```

Verified remote CI:

```text
GitHub Actions run
31941303048

CI
#71

branch
main

commit
9dbc6cee582c3bde882c2f0fc0cb5cf5799c5f66

status
completed

conclusion
success
```

Implemented canonical Media baseline:

```text
Package
@ai-world/platform-media

Canonical Resource
Asset

Identifier
ResourceId

Asset Type
IMAGE
VIDEO
AUDIO
DOCUMENT

Technical metadata
mimeType
sizeBytes

Storage reference
opaque provider-neutral string

Asset lifecycle
ACTIVE
ARCHIVED
DELETED

Initial lifecycle
ACTIVE

Persistence
media_assets

Migration
20260816152600_media_asset_baseline

Canonical migrations
13
```

P5-M01 deliberately does not materialize:

```text
Storage Foundation
filesystem Adapter
S3-compatible Adapter
upload API
authorization
Knowledge integration
Universe-specific Media integration
Media Variants
processing
Queue / Worker
Events / Audit
rights / licensing / provenance
```

Ownership remains:

```text
Media Platform
    owns
Asset meaning
Asset metadata
Asset lifecycle
Asset canonical state

Storage Foundation
    remains deferred to P5-M02
    and will own storage-object mechanics
    rather than Asset semantics
```

The implementation validates:

```text
Media unit tests
5 passed

Media PostgreSQL integration tests
2 passed

Architecture validation
0 dependency violations

Canonical migration status
13 migrations
database schema up to date
```

P5-M01 is therefore:

```text
CLOSED
```

Next:

```text
P5-M02 — Storage Foundation
```

# 141. Phase 5 Milestone P5-M02 — Storage Foundation

Implement:

```text
Storage Contract;

filesystem development Adapter;

S3-compatible production Contract/Adapter direction.
```

Actual production vendor may remain deferred.

---

## P5-M02 CLOSURE RECORD

Milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
d875f3134dd02df4ef73417d0fc20696f376203b
feat(storage): establish storage foundation
```

Verified remote CI:

```text
GitHub Actions run
31943031951

CI
#73

branch
main

commit
d875f3134dd02df4ef73417d0fc20696f376203b

status
completed

conclusion
success
```

Implemented Storage Foundation baseline:

```text
Package
@ai-world/foundation-storage

Provider-neutral Contract
StorageObjectStore

Storage Object Reference
portable relative object key

Operations
writeObject
readObject
deleteObject

Development Adapter
FilesystemStorageAdapter

Production direction
S3CompatibleStorageAdapter

S3-compatible integration seam
S3CompatibleObjectStorageClient

Production vendor
DEFERRED

Provider SDK
NONE
```

Validated implementation evidence:

```text
Storage unit tests
9 passed across 3 test files

Architecture validation
0 dependency violations

Canonical migrations
13

Database/schema/migration changes
NONE
```

The filesystem development Adapter validates portable object references and prevents path traversal outside its configured root.

The S3-compatible Adapter establishes the accepted bucket/key production direction through an injected narrow client port without freezing AWS, MinIO, a cloud vendor, credentials, endpoint configuration, or provider SDK.

P5-M02 deliberately does not materialize:

```text
Media → Storage integration
upload API
upload authorization
delivery API
Sharp / image processing
Media Variants
Queue / Worker
S3 vendor selection
Docker object-storage service
database/schema changes
new migrations
```

Ownership remains:

```text
Storage Foundation
    owns
Storage Object interaction mechanics
provider-neutral storage Contract
filesystem development Adapter
S3-compatible provider boundary

Media Platform
    continues to own
Asset meaning
Asset metadata
Asset lifecycle
Asset canonical state
```

P5-M02 is therefore:

```text
CLOSED
```

Next:

```text
P5-M03 — Upload
```

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

## P5-M03 CLOSURE RECORD

Milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
aba28f2cf3eff61e9a5402253485413d1679c34f
feat(media): implement secure asset upload
```

Verified remote CI:

```text
GitHub Actions run
31946959290

CI
#75

branch
main

commit
aba28f2cf3eff61e9a5402253485413d1679c34f

status
completed

conclusion
success
```

Implemented secure upload baseline:

```text
HTTP
POST /media/assets

Session
required

Media Permission
media.asset.upload

Initial granted Role
administrator

Authorization ordering
Session validation
→ media.asset.upload authorization
→ multipart parsing
→ Media upload validation

Defense-in-depth
UploadAssetAsActor authorizes again inside Media

Initial accepted media
PNG
JPEG

Maximum size
10 MiB

Validation
declared MIME
actual file signature
size
technical metadata

Storage reference
media/assets/{assetId}/original

Public response
does not expose storageReference
```

Persistence/storage ordering:

```text
validate
→ store bytes
→ persist Asset

if Asset persistence fails after storage write
→ attempt Storage delete
→ rethrow persistence failure
```

Validated implementation evidence:

```text
Canonical migrations
14

Media unit tests
11 passed

Media persistence integration tests
2 passed

API integration tests
98 passed

Media Upload API integration tests
7 passed

Architecture validation
415 modules
1084 dependencies
0 dependency violations
```

P5-M03 deliberately does not materialize:

```text
media-uploader Role
video upload
audio upload
document upload
Asset delivery
signed delivery
CDN integration
image processing
Sharp
Media Variants
Queue / Worker
Phase 5 completion tag
```

Ownership remains:

```text
Media Platform
    owns
Asset upload semantics
Asset technical metadata
Asset lifecycle
media.asset.upload semantic action

Identity & Access
    owns
Session validation
Permission representation
Permission assignment
Permission evaluation

Storage Foundation
    owns
Storage Object interaction mechanics
```

P5-M03 is therefore:

```text
CLOSED
```

Next:

```text
P5-M04 — Delivery
```

# 143. Phase 5 Milestone P5-M04 — Delivery

Support controlled delivery for initial Assets.

---

## P5-M04 CLOSURE RECORD

Milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
291636bed48c45a18ae30aa5ec7254b028774737
feat(media): implement controlled asset delivery
```

Verified remote CI:

```text
GitHub Actions run
31948583211

CI
#77

branch
main

commit
291636bed48c45a18ae30aa5ec7254b028774737

status
completed

conclusion
success
```

Implemented controlled initial Asset delivery:

```text
HTTP
GET /media/assets/:id/content

Access
public initial delivery

Deliverable lifecycle
ACTIVE

Initial deliverable Asset Type
IMAGE

Media lookup
AssetReader
→ PrismaAssetRepository.findById

Storage read
StorageObjectStore.readObject(storageReference)

Transport
StreamableFile

Content-Type
canonical Asset technicalMetadata.mimeType

Content-Length
delivered byte length

Storage integrity
delivered byte length must equal canonical technicalMetadata.sizeBytes

Public Storage exposure
storageReference is not returned
```

Delivery behavior:

```text
valid ACTIVE IMAGE Asset
→ 200
→ bytes delivered

unknown Asset
→ 404
→ media.asset.delivery.not_found

ARCHIVED Asset
→ 404

non-image Asset
→ 404 for the initial delivery baseline

malformed Resource ID
→ 400
→ media.asset.delivery.invalid_asset_id

stored bytes conflict with canonical sizeBytes
→ safe 500
→ bytes are not delivered
```

Upload authorization remains isolated to upload:

```text
POST /media/assets
→ MediaUploadPreauthorizationGuard
→ Session required
→ media.asset.upload required

GET /media/assets/:id/content
→ not protected by the upload Permission
```

Validated implementation evidence:

```text
Canonical migrations
14

Media unit tests
17 passed

Media persistence integration tests
2 passed

API unit tests
12 passed

API integration tests
104 passed

Media Delivery API integration tests
6 passed

Media Upload API regression tests
7 passed

Architecture validation
420 modules
1115 dependencies
0 dependency violations
```

The P5-M04 candidate also corrected Media API integration-test isolation without changing production semantics:

```text
P5-M03 upload fixture accounting
scoped to canonical media/assets/ references

P5-M04 delivery fixtures
use test/media-delivery/ references
```

P5-M04 deliberately does not materialize:

```text
private Asset visibility semantics
private-delivery policy
signed access
signed URLs
CDN integration
S3 presigning
image transformations
Sharp
thumbnails
Media Variants
Queue / Worker
new Permission
new migration
Knowledge → Asset references
Phase 5 completion tag
```

Ownership remains:

```text
Media Platform
    owns
Asset lookup semantics
Asset lifecycle gate
Asset Type delivery gate
delivery error semantics
delivery response semantics

Storage Foundation
    owns
Storage Object read mechanics
provider-specific storage implementation

API Application
    owns
HTTP route
StreamableFile transport
HTTP response headers
```

P5-M04 is therefore:

```text
CLOSED
```

Next:

```text
P5-M05 — Image Processing
```

# 144. Phase 5 Milestone P5-M05 — Image Processing

Introduce:

```text
Sharp
```

for real required image transformations such as thumbnails.

---

## P5-M05 CLOSURE RECORD

Milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
f5e388397c433bc7b5fbaea011dff440d72b7e8b
feat(media): implement synchronous image thumbnails
```

Verified remote CI:

```text
GitHub Actions run
31952328514

CI
#79

branch
main

commit
f5e388397c433bc7b5fbaea011dff440d72b7e8b

status
completed

conclusion
success
```

Implemented initial synchronous image processing:

```text
Processor
Sharp 0.35.3

Native runtime
libvips 8.18.3

HTTP
GET /media/assets/:id/thumbnail

Access
public initial thumbnail delivery

Deliverable lifecycle
ACTIVE

Deliverable Asset Type
IMAGE

Initial source MIME types
image/png
image/jpeg

Transformation
fit inside 320 x 320

Aspect ratio
preserved

Enlargement
disabled

Processing model
synchronous

Source read
StorageObjectStore.readObject(storageReference)

Source integrity
stored byte length must equal canonical technicalMetadata.sizeBytes

Output format
PNG source → PNG thumbnail
JPEG source → JPEG thumbnail

Persistence
ephemeral response bytes only
no persisted Media Variant
```

Media-owned processing boundary:

```text
GenerateImageThumbnail
    owns
Asset eligibility
lifecycle gate
Asset Type gate
supported source MIME gate
source integrity gate
thumbnail size policy
processor result validation
Media error semantics

ImageThumbnailProcessor
    defines
processing contract

SharpImageThumbnailProcessor
    implements
Sharp-specific image transformation

API Application
    owns
GET route
StreamableFile transport
HTTP Content-Type
HTTP Content-Length
```

Validated behavior:

```text
valid ACTIVE PNG/JPEG image
→ synchronous thumbnail

unknown Asset
→ 404
→ media.asset.thumbnail.not_found

ARCHIVED Asset
→ 404

non-image Asset
→ 404

unsupported image MIME metadata
→ unavailable before Storage processing

malformed Resource ID
→ 400
→ media.asset.thumbnail.invalid_asset_id

source byte count conflicts with canonical sizeBytes
→ safe 500
→ processor is not invoked
```

Validated implementation evidence:

```text
Canonical migrations
14

Sharp native runtime
0.35.3
libvips 8.18.3

Media unit tests
26 passed

Media persistence integration tests
2 passed

API unit tests
12 passed

API integration tests
110 passed

Media Thumbnail API integration tests
6 passed

Architecture validation
429 modules
1158 dependencies
0 dependency violations
```

The final validation also repaired only the static thumbnail API PNG fixture used by tests:

```text
Production semantics changed by fixture repair
NO

Replacement fixture
valid 640 x 480 PNG

Purpose
exercise the real Sharp transformation path
```

P5-M05 deliberately does not materialize:

```text
persisted Media Variant model
thumbnail Asset record
variant database schema
variant migration
Queue
Worker
Redis
background image processing
CDN
signed access
signed URL
new Permission
Knowledge → Asset references
Phase 5 completion tag
```

The roadmap's synchronous-processing rule remains satisfied:

```text
small early transformation
→ process synchronously

Queue/Worker
→ DEFERRED until the accepted Queue Introduction Gate is met
```

P5-M05 is therefore:

```text
CLOSED
```

Next:

```text
P5-M06 — Knowledge Integration
```

The next milestone remains constrained by the accepted ownership rule:

```text
Knowledge Resources
→ reference Asset IDs
→ through owned Media Contracts

Knowledge
→ does not own Storage mechanics
```

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

## P5-M06 CLOSURE RECORD

Milestone status:

```text
CLOSED
```

Implementation checkpoint:

```text
144c26a7befa289f528dc92d17d4273b7b4380ad
feat(knowledge): integrate media asset references
```

Verified remote CI:

```text
GitHub Actions run
31991765647

CI
#81

branch
main

status
completed

conclusion
success
```

Implemented Knowledge → Media integration:

```text
Creator mutation
PUT /knowledge/resources/:id/assets

Public read
GET /knowledge/resources/:id/assets

Persistence
knowledge_resource_asset_references

Reference semantics
unordered unique canonical Asset IDs

Write-time Media eligibility
ACTIVE Assets only

Public Knowledge visibility
PUBLISHED Resources only

Authorization
existing knowledge.resource.update Permission
```

Ownership boundary:

```text
MediaAssetReferenceResolver
    owns
canonical Asset ID validation
Asset lookup
ACTIVE lifecycle eligibility
Media reference errors

Knowledge
    owns
Knowledge Resource existence
authorization
reference-set semantics
reference persistence
public PUBLISHED visibility

Knowledge does not own
StorageObjectStore
storageReference
filesystem paths
Sharp
Media infrastructure
```

Database evidence:

```text
Canonical migrations
15

Migration
20260816200400_knowledge_media_asset_references

Table
knowledge_resource_asset_references

Knowledge Resource delete
CASCADE reference rows

Referenced Asset delete
RESTRICT
```

Validated implementation evidence:

```text
Media unit tests
30 passed

Media persistence integration tests
2 passed

Knowledge unit tests
46 passed

Knowledge integration tests
15 passed

API unit tests
12 passed

API integration tests
119 passed

Knowledge / Media API vertical-slice tests
9 passed

Architecture validation
441 modules
1220 dependencies
0 dependency violations
```

Deliberately deferred:

```text
Asset role semantics
Asset ordering semantics
captions
Storage mechanics inside Knowledge
new Permission
Queue / Worker
background reconciliation
CDN
signed access
Phase 5 completion tag
```

P5-M06 is therefore:

```text
CLOSED
```

Next:

```text
P5-M07 — Devotional Media Proof
```

# 148. Phase 5 Milestone P5-M07 — Devotional Media Proof

Use Devotional to validate shared Media through real needs such as:

```text
Temple imagery;

Resource artwork/imagery where rights and domain policy permit;

shared image delivery and variants.
```

Do not create Devotional-specific storage or processing infrastructure.

## P5-M07 CLOSURE RECORD

P5-M07 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
12674d94f383c5bda43c6f5bf025364cc1437730

SUBJECT
feat(web): implement devotional media proof

GITHUB ACTIONS
CI run 31998857858
CI #83
completed — success
```

The delivered Devotional product proof is intentionally narrow:

```text
published devotional.temple Resource
    ↓
public Web Knowledge experience
    ↓
GET /knowledge/resources/:id/assets
    ↓
canonical Asset IDs
    ↓
GET /media/assets/:assetId/thumbnail
    ↓
Temple imagery rendered

open full-size imagery
    ↓
GET /media/assets/:assetId/content
```

The proof establishes that Devotional consumes the shared Knowledge/Media boundary rather than owning Media infrastructure.

Verified ownership and scope:

```text
Knowledge owns Resource → Asset references.

Media owns Asset delivery and thumbnail generation.

Web consumes public Knowledge Asset IDs and public Media routes.

Devotional selects devotional.temple as the real product consumer.

No storageReference is exposed to Devotional or Web.

No Devotional-specific storage adapter exists.

No Devotional-specific image processor exists.

No hero / cover / primary Asset role was introduced.

No Asset ordering semantics were introduced.

No new Permission was introduced.

No production API route was added for P5-M07.

No schema or migration change was required.

Canonical migration count remains 15.
```

Validation evidence for the final candidate:

```text
Initial full API integration regression
119 / 119 passed

Web lint
PASS

Web typecheck
PASS

Web unit
25 / 25 passed

Web production build
PASS

Public Knowledge API integration
10 / 10 passed

Knowledge → Media reference integration
9 / 9 passed

Media thumbnail integration
6 / 6 passed

Media original delivery integration
6 / 6 passed

Web Playwright E2E
3 / 3 passed

Architecture validation
443 modules
1224 dependencies
0 violations
```

The browser proof verifies that published Devotional Temple Knowledge renders shared Media thumbnails, links to shared original delivery, and keeps Anime on the existing bounded reuse path.

The following remain deliberately deferred until real product pressure requires them:

```text
Asset role semantics;

primary / hero / cover image semantics;

gallery ordering;

persisted image variants;

Devotional-specific storage or processing;

Queue / Worker processing;

CDN or signed delivery;

Phase 5 completion tag.
```

P5-M08 — Anime Media Proof is the next Phase 5 milestone.

---

# 149. Phase 5 Milestone P5-M08 — Anime Media Proof

Use Anime to validate:

```text
Character image;

Series image;

possibly visual media relationships.
```

## P5-M08 CLOSURE RECORD

P5-M08 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
9fcbef43226828532eb2da4ab810ca87ecba7fe2

SUBJECT
feat(web): implement anime media proof

GITHUB ACTIONS
CI run 32000314155
CI #85
completed — success
```

The Anime Media reuse proof is intentionally based on the existing Anime domain model rather than a copied Devotional-specific implementation.

Existing Anime domain pressure:

```text
universe.anime

anime.character
    CharacterResource
    name: string

anime.series
    SeriesResource
    title: string
```

The delivered product proof is:

```text
published anime.character Resource
    ↓
public Web Knowledge experience
    ↓
GET /knowledge/resources/:id/assets
    ↓
canonical Asset IDs
    ↓
shared PublishedResourceImageGallery
    ↓
GET /media/assets/:assetId/thumbnail
    ↓
Character imagery rendered

published anime.series Resource
    ↓
same Knowledge Asset-reference contract
    ↓
same shared gallery
    ↓
same Media thumbnail route
    ↓
Series imagery rendered

open either image
    ↓
GET /media/assets/:assetId/content
```

The proof establishes cross-Universe reuse without extending Media infrastructure.

Verified ownership and scope:

```text
Anime retains only domain Resource semantics.

Knowledge continues to own Resource → Asset references.

Media continues to own Asset delivery and thumbnail generation.

Web composition opts anime.character and anime.series into the existing shared image presentation.

PublishedResourceImageGallery was not changed.

KnowledgeUniverseSection was not changed.

The public Knowledge API contract was not changed.

No Anime-specific storage adapter exists.

No Anime-specific image processor exists.

No storageReference is exposed to Anime or Web.

No hero / cover / primary Asset role was introduced.

No Asset ordering semantics were introduced.

No production API route was added for P5-M08.

No package dependency was added.

No schema or migration change was required.

Canonical migration count remains 15.
```

Validation evidence for the final candidate:

```text
Anime Universe tests
4 / 4 passed

Anime Universe typecheck
PASS

Web lint
PASS

Web typecheck
PASS

Web unit
26 / 26 passed

Web production build
PASS

Public Knowledge API integration
10 / 10 passed

Knowledge → Media reference integration
9 / 9 passed

Media thumbnail integration
6 / 6 passed

Media original delivery integration
6 / 6 passed

Web Playwright E2E
3 / 3 passed

Architecture validation
443 modules
1224 dependencies
0 violations
```

The browser proof exercises Devotional Temple, Anime Character, and Anime Series Resources through the same Knowledge/Media boundary and verifies that only the expected canonical Resource and Asset IDs are requested.

The optional roadmap phrase `possibly visual media relationships` does not activate a Relationships implementation at P5-M08. No real relationship consumer is required by this product slice, so visual-media relationship semantics remain deferred rather than being introduced speculatively.

The following remain deliberately deferred until real product pressure requires them:

```text
visual media relationship semantics;

Asset role semantics;

primary / hero / cover image semantics;

gallery ordering;

persisted image variants;

Anime-specific storage or processing;

Queue / Worker processing;

CDN or signed delivery;

Phase 5 completion tag.
```

P5-M09 — Media Audit/Events is the next Phase 5 milestone.

---

# 150. Phase 5 Milestone P5-M09 — Media Audit/Events

Important Asset lifecycle actions should publish/record required Events/Audit.

## P5-M09 CLOSURE RECORD

P5-M09 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
de49c4c179b8a467a0ca6dd474c54fbfc63c5e3f

SUBJECT
feat(media): audit asset uploads

GITHUB ACTIONS
CI run 32024393772
CI #87
completed — success
```

The implemented lifecycle pressure is the one real Media Asset mutation that currently exists:

```text
authenticated and authorized Actor
    ↓
image upload
    ↓
Storage write
    ↓
Media Asset persistence
    ↓
ACTIVE lifecycle
```

P5-M09 records that successful accountability fact through the existing shared Audit Kernel rather than creating a Media-specific audit subsystem.

Canonical Audit semantics:

```text
action
media.asset.upload

resource type
media.asset

result
media.asset.created

actor
authenticated acting Actor

resource id
canonical created Asset ResourceId

context
assetType
mimeType
sizeBytes
lifecycle
```

`storageReference` is deliberately excluded from Audit context.

The required Audit record and Asset persistence share one database transaction:

```text
Storage write
    ↓
MediaAssetUploadTransaction
    ↓
single Prisma transaction
    ├── Asset persistence
    └── Audit persistence
    ↓
commit
```

If required Audit persistence or the database transaction fails:

```text
Asset database mutation
ROLLBACK

Audit database mutation
ROLLBACK

stored object
best-effort compensation delete

request
FAIL
```

This prevents a failed upload response from leaving a committed Asset whose required accountability record is missing.

Ownership remains bounded:

```text
Media
    owns Asset lifecycle business meaning
    owns media.asset.* Audit vocabulary
    owns upload transaction orchestration

Audit Kernel
    owns AuditRecord semantics
    owns AuditRecorder Contract
    owns PrismaAuditRecorder infrastructure

Database Foundation
    owns Prisma client and transaction capability

API Application
    composes Media transaction infrastructure
    with PrismaAuditRecorder
```

Validation evidence for the final P5-M09 candidate:

```text
Kernel Audit tests
11 / 11 passed

Kernel Audit typecheck
PASS

Media lint
PASS

Media typecheck
PASS

Media unit tests
32 / 32 passed

Media transaction integration
3 / 3 passed

API lint
PASS

API typecheck
PASS

Media Upload API integration
7 / 7 passed

Authorization Audit regression
12 / 12 passed

Full API integration
119 / 119 passed

Architecture validation
448 modules
1245 dependencies
0 violations
```

No schema or migration change was required. Canonical migration count remains 15.

Events remain deliberately deferred.

The implemented upload lifecycle creates a real accountability requirement, so durable Audit is justified. It still does not create a real independent post-operation consumer requiring business Event publication, producer/consumer decoupling, eventual consistency, or durable Event delivery.

P5-M09 therefore introduces:

```text
NO Events Kernel

NO EventBus

NO Event publisher/subscriber mechanism

NO Outbox

NO Queue / Worker

NO Kafka / Redis

NO archive Asset API

NO delete Asset API

NO speculative ARCHIVED / DELETED lifecycle mutation
```

P3-M03 Events remains deferred until a concrete producer/consumer boundary requires it.

P5-M09 is CLOSED.

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

## PHASE 5 CLOSURE CRITERIA EVALUATION

Phase 5 closure criteria are evaluated against the implemented repository after the green P5-M09 checkpoint.

```text
1. Media owns Assets
SATISFIED
P5-M01 established the canonical Media-owned Asset model and persistence boundary.

2. Storage does not own Asset semantics
SATISFIED
P5-M02 keeps Storage limited to provider-neutral storage-object mechanics.

3. filesystem development storage works
SATISFIED
P5-M02 established the filesystem Storage adapter used by development and integration flows.

4. production-compatible S3 boundary exists
SATISFIED
P5-M02 established the narrow S3-compatible Storage adapter boundary without vendor coupling.

5. image upload works
SATISFIED
P5-M03 established authenticated, authorized PNG/JPEG upload with content validation and compensation.

6. basic processing works
SATISFIED
P5-M05 established real Sharp-based image thumbnail processing without premature Queue/Worker infrastructure.

7. Knowledge references Assets safely
SATISFIED
P5-M06 established canonical Knowledge → Asset references while keeping storage internals Media-owned.

8. Devotional and Anime reuse the same Media Platform
SATISFIED
P5-M07 and P5-M08 proved the same Knowledge → Asset → Media delivery/thumbnail path across both Universes.

9. no Universe-specific storage exists
SATISFIED
Neither Devotional nor Anime owns a storage adapter, storageReference contract, image processor, or Media infrastructure.
```

Closure result:

```text
PHASE 5 — Media Platform
COMPLETE

CLOSURE CRITERIA
9 / 9 SATISFIED

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

P5-M05 — Image Processing
CLOSED

P5-M06 — Knowledge Integration
CLOSED

P5-M07 — Devotional Media Proof
CLOSED

P5-M08 — Anime Media Proof
CLOSED

P5-M09 — Media Audit/Events
CLOSED

CANONICAL MIGRATIONS
15

PHASE 6 — Discovery Platform
NEXT

P6-M01 — Search Contract
NEXT
```

The following remain intentionally deferred until real demand requires them:

```text
business Events / Event Kernel;

Queue / Worker processing;

persisted image variants;

CDN or signed delivery;

Asset role / hero / cover semantics;

gallery ordering;

visual media relationship semantics;

advanced licensing / rights workflows.
```

These deferrals do not block Phase 5 closure because none is part of the accepted Phase 5 closure criteria and none has a current concrete consumer requiring materialization.

The `phase-5-complete` tag is not created by this roadmap update. It may be created only after this Phase 5 closure commit itself passes remote CI.

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

## P6-M01 CLOSURE RECORD

P6-M01 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
f60756093f9c7ea36d23fc1bea73da0e1e5754f1

SUBJECT
feat(discovery): establish search contract

PARENT
c5d17918cb454003ad1ad1e1aa9579af995d172a
docs(roadmap): close Phase 5

GITHUB ACTIONS
CI run 32031713898
CI #89
completed — success
```

P6-M01 establishes the first canonical Discovery-owned package:

```text
@ai-world/platform-discovery
```

Canonical Search request semantics:

```text
SearchRequest
    query: string

    scope:
        global
        OR
        universe + NamespacedKey

    filter:
        resourceTypes: readonly NamespacedKey[]

    pagination:
        offset
        limit
```

Canonical normalized result semantics:

```text
SearchResult
    resourceId: ResourceId
    resourceType: NamespacedKey
    universeKey?: NamespacedKey

SearchResultPage
    items
    pagination
```

The executable public abstraction is:

```text
SearchContract
    search(SearchRequest)
        ↓
    SearchResultPage
```

Discovery owns these Search semantics. Search does not become the source of truth for canonical Resources.

P6-M01 production dependencies remain exactly:

```text
@ai-world/kernel-identifiers

@ai-world/kernel-namespace
```

P6-M01 introduces no dependency on Knowledge, Media, Database/Prisma, a Search provider, or a named Universe.

P6-M02 is the first milestone that will search canonical Knowledge Resources through a Discovery-owned implementation. The accepted initial technology remains PostgreSQL Search.

The following remain outside P6-M01:

```text
Knowledge Search implementation
    → P6-M02

real Universe-scoped behavior
    → P6-M03

real cross-Universe/global behavior
    → P6-M04

filter execution and Taxonomy pressure
    → P6-M05

ranking / score
    → P6-M06

Search projection / index architecture
    → P6-M07 review

dedicated Search provider
    → Dedicated Search Gate

semantic / vector Search
    → Semantic Search Gate

API route
    → later integration pressure

Web Search UI
    → Phase 6 Web Integration
```

No schema or migration change was required. Canonical migration count remains 15.

Validation evidence for the approved implementation candidate:

```text
Discovery lint
PASS

Discovery typecheck
PASS

Discovery unit tests
2 / 2 passed

Discovery build
PASS

Root lint regression
18 / 18 tasks

Root typecheck regression
32 / 32 tasks

Root unit regression
28 / 28 tasks
267 tests passed

Architecture validation
19 / 19 build tasks
451 modules
1252 dependencies
0 violations
```

P6-M01 is CLOSED.

P6-M02 — Knowledge Search is NEXT.

---

# 156. Phase 6 Milestone P6-M02 — Knowledge Search

Search canonical Knowledge Resources through a Discovery-owned implementation.

## P6-M02 CLOSURE RECORD

P6-M02 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
9d1a359ceabf365b399cb10070a7536e3004f293

SUBJECT
feat(discovery): implement knowledge search

PARENT
63f93f0a1d15137f6fe5a71cf53acde2d4d03a64
docs(roadmap): close P6-M01

GITHUB ACTIONS
CI run 32044439194
CI #91
completed — success
```

P6-M02 establishes the first real Discovery Search implementation:

```text
SearchContract
        ↓
PrismaKnowledgeSearch
        ↓
Database Foundation
        ↓
canonical KnowledgeResource relational state
```

Ownership remains explicit:

```text
Knowledge Platform
    owns canonical Knowledge Resources

Discovery Platform
    owns Search semantics and Search execution
```

Search does not become the source of truth.

The implementation queries canonical PostgreSQL relational state directly. No separate Search projection or Search index is introduced.

The current searchable canonical field is:

```text
resourceType
```

because the canonical `KnowledgeResource` persistence model does not yet contain a generic title, display label, body, or Search-text field.

The current query behavior is:

```text
trim query

blank query
    → empty result page

non-blank query
    → case-insensitive substring match on resourceType
```

Visibility is constrained to:

```text
PUBLISHED
```

Knowledge Resources only.

DRAFT and ARCHIVED Resources are not returned.

For this milestone, Search execution requires the existing generic Universe scope:

```text
scope.kind = universe
universeKey = NamespacedKey
```

P6-M02 does not claim the P6-M03 named-Universe reuse proof. That proof remains NEXT and must exercise the same Discovery implementation with both:

```text
Devotional-only Search
Anime-only Search
```

The current P6-M02 boundary deliberately rejects:

```text
global scope
    → P6-M04 Cross-Universe Search

non-empty Resource Type filters
    → P6-M05 Filters
```

Pagination uses the P6-M01 Contract:

```text
offset
limit
```

with deterministic ordering:

```text
createdAt DESC
id ASC
```

This deterministic ordering is pagination stability only. It is not relevance ranking.

Ranking remains deferred to:

```text
P6-M06 — Basic Ranking
```

The indexing/projection decision remains deferred to:

```text
P6-M07 — Indexing Architecture Review
```

and the accepted architecture continues to permit direct PostgreSQL queries over canonical relational state while they remain adequate.

P6-M02 production dependencies are exactly:

```text
@ai-world/foundation-database

@ai-world/kernel-identifiers

@ai-world/kernel-namespace

@ai-world/platform-knowledge
```

The Knowledge dependency is through its public Platform package surface for canonical lifecycle semantics. Discovery does not import Knowledge infrastructure.

No new schema or migration was required.

Canonical migration count remains:

```text
15
```

The approved implementation validation included:

```text
Discovery lint
PASS

Discovery typecheck
PASS

Discovery unit tests
6 / 6 passed

Discovery PostgreSQL integration
2 / 2 passed

Discovery build
PASS

Knowledge unit regression
46 / 46 passed

Knowledge integration regression
15 / 15 passed

Root lint regression
18 / 18 tasks

Root typecheck regression
32 / 32 tasks

Root unit regression
28 / 28 tasks
271 tests observed passed

Architecture validation
19 / 19 build tasks
456 modules
1270 dependencies
0 violations
```

P6-M02 introduces no:

```text
API route
Web Search UI
named-Universe branching
global Search
filter execution
ranking / score
Search projection
Search index
Elasticsearch
OpenSearch
Redis
semantic/vector Search
Event infrastructure
Queue / Worker
schema change
migration
```

P6-M02 is CLOSED.

P6-M03 — Universe-Scoped Search is NEXT.

---

# 157. Phase 6 Milestone P6-M03 — Universe-Scoped Search

Support:

```text
Devotional-only Search;

Anime-only Search.
```

## P6-M03 CLOSURE RECORD

P6-M03 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
9678fdeeea82eafb678bc52dc6dff98ce4b1beec

SUBJECT
test(discovery): prove universe-scoped search

PARENT
ecc82767cfc989cdd4f10d2832e31e63d9ba4fe9
docs(roadmap): close P6-M02

GITHUB ACTIONS
CI run 32100741704
CI #93
completed — success
```

P6-M03 proves that the generic Universe scope established by Discovery is reusable by structurally different real Universes without adding named-Universe logic to Discovery runtime source.

The proof is intentionally located at the application integration-test composition boundary:

```text
@ai-world/universe-devotional
        │
        │ public Universe / Resource Type definitions
        ▼
apps/api integration proof
        │
        ▼
PrismaKnowledgeSearch
        ▲
        │
        │ public Universe / Resource Type definitions
@ai-world/universe-anime
```

The same existing:

```text
PrismaKnowledgeSearch
```

instance is exercised for both named Universes.

The proof creates canonical `PUBLISHED` Knowledge Resources using the real public definitions:

```text
Devotional
    universe.devotional
    devotional.temple

Anime
    universe.anime
    anime.character
```

Both Search requests use the same neutral query:

```text
.
```

which matches the namespaced Resource Type shape in both Universes.

Therefore result isolation is proven by:

```text
scope.kind = universe
universeKey
```

rather than by using different query terms.

The observed behavior is:

```text
Devotional scope
    → Devotional Resource returned
    → Anime Resource excluded

Anime scope
    → Anime Resource returned
    → Devotional Resource excluded
```

The existing P6-M01 filter object remains present only as its neutral value:

```text
resourceTypes: []
```

No Resource Type filter execution is introduced.

Filter execution remains deferred to:

```text
P6-M05 — Filters
```

P6-M03 does not modify Discovery runtime source.

Discovery therefore still contains no:

```text
universe.devotional
universe.anime
DEVOTIONAL_* condition
ANIME_* condition
@ai-world/universe-devotional runtime dependency
@ai-world/universe-anime runtime dependency
```

The implementation commit changes exactly:

```text
apps/api/package.json

apps/api/test/discovery-universe-scope.integration.spec.ts

pnpm-lock.yaml
```

The application adds only test-side workspace dependencies:

```text
@ai-world/platform-discovery

@ai-world/universe-anime

@ai-world/universe-devotional
```

They are `devDependencies`, not production dependencies.

No new API Search route is introduced.

No Web Search UI is introduced.

No schema or migration is introduced.

Canonical migration count remains:

```text
15
```

The approved P6-M03 validation included:

```text
Targeted P6-M03 PostgreSQL integration proof
1 / 1 passed

Root lint regression
18 / 18 tasks

Root typecheck regression
35 / 35 tasks

Root unit regression
31 / 31 tasks
271 tests passed

Root integration regression
23 / 23 tasks
187 integration tests passed

API integration suite
14 files
120 tests passed

Architecture validation
19 / 19 build tasks
463 modules
1283 dependencies
0 violations
```

P6-M03 introduces no:

```text
Discovery runtime change
Universe runtime change
API runtime route
Web Search UI
global Search
cross-Universe Search
filter execution
ranking / score
Search projection
Search index
Elasticsearch
OpenSearch
Redis
semantic/vector Search
Event infrastructure
Queue / Worker
schema change
migration
```

Global Search remains the next distinct capability:

```text
P6-M04 — Cross-Universe Search
```

Ranking remains:

```text
P6-M06 — Basic Ranking
```

The indexing/projection decision remains:

```text
P6-M07 — Indexing Architecture Review
```

P6-M03 is CLOSED.

P6-M04 — Cross-Universe Search is NEXT.

---

# 158. Phase 6 Milestone P6-M04 — Cross-Universe Search

Support global Search across authorized Universes.

## P6-M04 CLOSURE RECORD

P6-M04 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
3922bd83f00e978acb8a45989f411dbb29a4c437

SUBJECT
feat(discovery): enable cross-universe search

PARENT
4dd24682f66f4377a0855d82feed07f36fd4f063
docs(roadmap): close P6-M03

GITHUB ACTIONS
CI run 32111419905
CI #95
completed — success
```

P6-M04 enables the existing Discovery Search implementation to execute the already-established global Search scope across canonical Knowledge Resources from multiple Universes.

No second Search contract is introduced.

The P6-M01 Search contract remains the shared contract:

```text
SearchRequest
    query
    scope
    filter
    pagination

SearchScope
    global
    universe
```

The runtime behavior is now:

```text
Universe scope
    scope.kind = universe
    universeKey = requested Universe
    lifecycle = PUBLISHED

Global scope
    scope.kind = global
    no universeKey predicate
    lifecycle = PUBLISHED
```

Global Search therefore broadens Universe scope without broadening lifecycle visibility.

The implementation continues to query canonical PostgreSQL `KnowledgeResource` state directly.

The existing Search behavior remains:

```text
case-insensitive Resource Type substring matching

blank trimmed query
    → empty result page

pagination
    offset
    limit

deterministic ordering
    createdAt DESC
    id ASC

normalized Search result
    resourceId
    resourceType
    universeKey
```

The P6-M01 filter object remains present only at its neutral value:

```text
resourceTypes: []
```

Non-empty Resource Type filter execution still fails at the P6-M05 capability boundary.

Therefore P6-M04 does not implement:

```text
P6-M05 — Filters
P6-M06 — Basic Ranking
P6-M07 — Indexing Architecture Review
```

The real cross-Universe proof remains at the application integration-test composition boundary:

```text
@ai-world/universe-devotional
        │
        ▼
apps/api integration proof
        │
        ▼
PrismaKnowledgeSearch
        ▲
        │
@ai-world/universe-anime
```

The proof creates canonical Knowledge Resources for both real Universes:

```text
Devotional
    universe.devotional
    devotional.temple

Anime
    universe.anime
    anime.character
```

The global request uses:

```text
query = A
scope.kind = global
resourceTypes = []
offset = 0
limit = 100
```

The query is intentionally uppercase while both namespaced Resource Types contain lowercase `a`, retaining the existing case-insensitive Search proof.

The observed visibility behavior is:

```text
PUBLISHED Devotional Resource
    → returned

PUBLISHED Anime Resource
    → returned

INITIAL / draft Devotional Resource
    → excluded

ARCHIVED Anime Resource
    → excluded
```

The proof also verifies the preserved deterministic ordering between the two published fixtures.

The roadmap wording for P6-M04 is:

```text
Support global Search across authorized Universes.
```

At this repository checkpoint, the Search contract carries no actor, Role, Permission, or Universe-ACL context, and the repository has no Universe authorization registry for Discovery.

P6-M04 therefore closes against the existing public Discovery authorization / visibility boundary already established by Knowledge:

```text
PUBLISHED
    publicly searchable

INITIAL / draft
    hidden

ARCHIVED
    hidden
```

P6-M04 does not invent a per-actor Universe authorization model, Identity dependency, policy engine, Universe registry, or Universe ACL solely to broaden Search scope.

The implementation commit changes exactly:

```text
apps/api/test/discovery-universe-scope.integration.spec.ts

packages/platforms/discovery/src/prisma-knowledge-search.ts

packages/platforms/discovery/test/prisma-knowledge-search.spec.ts
```

Implementation diff size:

```text
3 files changed
143 insertions
35 deletions
```

No package manifest or lockfile changes are introduced.

No schema or migration is introduced.

Canonical migration count remains:

```text
15
```

The approved local P6-M04 validation included:

```text
Targeted Discovery unit proof
4 / 4 passed

Targeted Discovery PostgreSQL integration
2 / 2 passed

Real Devotional + Anime Search proof
2 / 2 passed

Root lint regression
18 / 18 tasks

Root typecheck regression
35 / 35 tasks

Root unit regression
31 / 31 tasks
271 tests passed

Root integration regression
23 / 23 tasks
188 integration tests passed

API integration suite
14 files
121 tests passed

Root build
19 / 19 tasks

Architecture validation
463 modules
1284 dependencies
0 violations
```

P6-M04 introduces no:

```text
new Search contract
new API Search route
Web Search UI
Resource Type filter execution
Taxonomy filter execution
ranking / score
Search projection
Search index
Elasticsearch
OpenSearch
Redis
semantic/vector Search
Identity dependency
Universe ACL model
named-Universe Discovery runtime dependency
schema change
migration
```

Filter execution is now the next distinct capability:

```text
P6-M05 — Filters
```

Ranking remains:

```text
P6-M06 — Basic Ranking
```

The indexing/projection decision remains:

```text
P6-M07 — Indexing Architecture Review
```

P6-M04 is CLOSED.

P6-M05 — Filters is NEXT.


---

# 159. Phase 6 Milestone P6-M05 — Filters

Initial filters may include:

```text
Universe;

Resource Type;

Taxonomy.
```

Add others only as needed.

## P6-M05 CLOSURE RECORD

P6-M05 is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
fb19a3f6981d0c2038729ed3cc500a612b17f346

SUBJECT
feat(discovery): enable resource type filters

PARENT
f61d9a85fa4761298a46e66600ade467662ddf0f
docs(roadmap): close P6-M04

GITHUB ACTIONS
CI run 32114069955
CI #97
completed — success
```

P6-M05 closes with the minimum filter behavior justified by the repository that exists at this checkpoint.

The accepted milestone wording is:

```text
Initial filters may include:

Universe;
Resource Type;
Taxonomy.

Add others only as needed.
```

The implemented filter surface is:

```text
Universe
    represented by the existing SearchScope
    scope.kind = universe
    universeKey = requested Universe

Resource Type
    represented by the existing SearchFilter.resourceTypes
    exact canonical ANY-OF constraint when non-empty

Taxonomy
    DEFERRED
```

No duplicate Universe filter field is introduced because Universe restriction already belongs to Search scope.

The existing P6-M01 Search contract remains unchanged:

```text
SearchRequest
    query
    scope
    filter
    pagination

SearchFilter
    resourceTypes
```

Resource Type filter semantics are:

```text
resourceTypes = []
    neutral
    no Resource Type restriction

resourceTypes = [A]
    resourceType must equal A

resourceTypes = [A, B, ...]
    resourceType must equal any requested value
```

The Resource Type filter is composed with the existing Search conditions:

```text
query match
AND
PUBLISHED lifecycle
AND
Universe predicate when scope.kind = universe
AND
Resource Type predicate when resourceTypes is non-empty
```

Global Search therefore supports Resource Type filtering across Universes while Universe-scoped Search supports the same filter within the requested Universe.

The implementation preserves:

```text
PUBLISHED-only public visibility

global Search

Universe-scoped Search

case-insensitive Resource Type substring query matching

blank-query empty result page

offset/limit pagination

deterministic pre-ranking ordering
    createdAt DESC
    id ASC

normalized Search result
    resourceId
    resourceType
    universeKey
```

Taxonomy filtering is intentionally not implemented.

At this checkpoint:

```text
P3-M05 — Taxonomy
DEFERRED

P4-M05 — Taxonomy Integration
DEFERRED
```

and the repository still has no:

```text
Taxonomy Kernel package

Taxonomy persistence model

Knowledge Resource taxonomy relation

implemented Devotional classification consumer
```

Creating taxonomy infrastructure only to satisfy a possible P6-M05 filter would violate the project's demand-driven architecture rule.

Taxonomy therefore remains evidence-driven and may be materialized only when a real classification consumer establishes reusable semantics.

The P6-M05 implementation commit changes exactly:

```text
apps/api/test/discovery-universe-scope.integration.spec.ts

packages/platforms/discovery/src/prisma-knowledge-search.ts

packages/platforms/discovery/test/prisma-knowledge-search.integration.spec.ts

packages/platforms/discovery/test/prisma-knowledge-search.spec.ts
```

Implementation diff size:

```text
4 files changed
187 insertions
15 deletions
```

The approved local P6-M05 validation included:

```text
Targeted Discovery unit proof
4 / 4 passed

Targeted Discovery PostgreSQL integration
3 / 3 passed

Real Devotional + Anime API proof
3 / 3 passed

Root lint regression
18 / 18 tasks

Root typecheck regression
35 / 35 tasks

Root unit regression
31 / 31 tasks
271 tests passed

Root integration regression
23 / 23 tasks

API integration suite
14 files
122 tests passed

Root build
19 / 19 tasks

Architecture validation
463 modules
1284 dependencies
0 violations
```

No package manifest or lockfile changes are introduced.

No schema or migration is introduced.

Canonical migration count remains:

```text
15
```

P6-M05 introduces no:

```text
Taxonomy model
Taxonomy filter execution
new Universe filter field
new Search contract
ranking / score
AI ranking
Search projection
Search index
dedicated Search engine
semantic/vector Search
API Search route
Web Search UI
named-Universe Discovery runtime dependency
schema change
migration
```

Ranking remains a distinct next capability:

```text
P6-M06 — Basic Ranking
```

The indexing/projection decision remains:

```text
P6-M07 — Indexing Architecture Review
```

P6-M05 is CLOSED.

P6-M06 — Basic Ranking is NEXT.


---

# 160. Phase 6 Milestone P6-M06 — Basic Ranking

Use understandable PostgreSQL ranking.

Do not introduce AI ranking immediately.

## P6-M06 CLOSURE RECORD

P6-M06 is closed against the final green checkpoint:

```text
FINAL CHECKPOINT
54b12ce60d8948f01609f69770cf0d90f3b8f1e7

SUBJECT
test(api): serialize integration tests

PARENT
5c0b6303a5f53261534e31900a4683fe28703cd4
feat(discovery): add basic search ranking

GITHUB ACTIONS
CI run 32122735772
CI #100
attempt 1
completed — success
```

The ranking implementation itself was introduced by:

```text
IMPLEMENTATION COMMIT
5c0b6303a5f53261534e31900a4683fe28703cd4

SUBJECT
feat(discovery): add basic search ranking

PARENT
7d57b28c854bade2bbe2b900c98bdc83e09507f5
docs(roadmap): close P6-M05
```

The implementation push initially produced:

```text
CI run 32119370009
CI #99
completed — failure
```

That failure did not identify a production Search ranking defect.

It exposed API integration-test file concurrency against one shared PostgreSQL database:

```text
public-knowledge.integration.spec.ts
and
discovery-universe-scope.integration.spec.ts

ran concurrently

both created PUBLISHED real-Universe Knowledge fixtures

broad Universe queries could observe the other file's fixtures
```

The follow-up commit:

```text
54b12ce60d8948f01609f69770cf0d90f3b8f1e7
test(api): serialize integration tests
```

changes only the API integration-test execution policy:

```text
vitest run integration
    --no-file-parallelism
```

so database-backed API integration files sharing mutable PostgreSQL state execute file-by-file.

No P6-M06 production Search behavior was changed by that repair.

The accepted P6-M06 milestone wording is:

```text
Use understandable PostgreSQL ranking.

Do not introduce AI ranking immediately.
```

P6-M06 implements a Discovery-owned PostgreSQL lexical ranking over the existing canonical Knowledge Resource Type Search surface.

Eligibility remains:

```text
trimmed query is non-blank

AND

case-insensitive Resource Type substring match

AND

PUBLISHED lifecycle

AND

requested Universe when scope.kind = universe

AND

exact Resource Type ANY-OF filter when resourceTypes is non-empty
```

Eligible rows are ordered in PostgreSQL by understandable ranking tiers:

```text
0
case-insensitive exact complete Resource Type key

1
case-insensitive exact terminal NamespacedKey segment

2
case-insensitive terminal NamespacedKey segment prefix

3
case-insensitive complete Resource Type key prefix

4
remaining case-insensitive substring matches
```

Deterministic tie-breaking remains:

```text
createdAt DESC

id ASC
```

Pagination is applied by PostgreSQL after ranking:

```text
OFFSET

LIMIT
```

The Search contract remains unchanged.

Search results still expose only:

```text
resourceId

resourceType

universeKey
```

No numeric relevance score is added to the public Search result contract.

The runtime uses Prisma's parameterized tagged `$queryRaw` interface with fixed SQL structure.

It does not use:

```text
$queryRawUnsafe

dynamic SQL concatenation

AI ranking

semantic/vector ranking

embeddings

full-text ranking

trigram similarity

dedicated Search engine
```

The implementation preserves:

```text
PUBLISHED-only public visibility

global Search

Universe-scoped Search

Resource Type exact ANY-OF filters

empty Resource Type filter as neutral

blank-query empty result page

pagination validation

normalized Search results

no named-Universe branch inside Discovery
```

The real-Universe API proof demonstrates that generic ranking can change ordering across Devotional and Anime without named-Universe ranking logic.

For the query:

```text
A
```

the lexical ranking places:

```text
anime.character
```

ahead of:

```text
devotional.temple
```

despite the Anime fixture being older, proving relevance outranks recency.

The Discovery PostgreSQL integration proof also demonstrates:

```text
terminal exact match
    outranks
terminal-prefix match
    outranks
complete-key prefix match
    outranks
generic substring match
```

while pagination is applied over that ranked order.

The implementation commit changes exactly:

```text
apps/api/test/discovery-universe-scope.integration.spec.ts
packages/platforms/discovery/src/prisma-knowledge-search.ts
packages/platforms/discovery/test/prisma-knowledge-search.integration.spec.ts
packages/platforms/discovery/test/prisma-knowledge-search.spec.ts
```

Implementation diff size:

```text
4 files changed, 237 insertions(+), 82 deletions(-)
```

The API integration-test isolation repair changes exactly:

```text
apps/api/package.json
```

Repair diff size:

```text
1 file changed, 1 insertion(+), 1 deletion(-)
```

The approved local P6-M06 implementation validation included:

```text
Targeted Discovery unit proof
4 / 4 passed

Targeted Discovery PostgreSQL integration
4 / 4 passed

Real Devotional + Anime API proof
3 / 3 passed

Root lint regression
18 / 18 tasks

Root typecheck regression
35 / 35 tasks

Root unit regression
31 / 31 tasks
271 tests passed

Root integration regression
23 / 23 tasks

API integration suite
14 files
122 tests passed

Root build
19 / 19 tasks

Architecture validation
463 modules
1284 dependencies
0 violations
```

The approved CI-repair validation additionally proved:

```text
Serialized API integration run 1
14 / 14 files
122 / 122 tests

Serialized API integration run 2
14 / 14 files
122 / 122 tests

Root integration regression
23 / 23 tasks
191 integration tests passed

Canonical migrations
15
```

The final green GitHub Actions checkpoint validates the repaired repository through the repository CI workflow.

No schema or migration is introduced.

Canonical migration count remains:

```text
15
```

P6-M06 introduces no:

```text
Search score contract

Ranking Strategy registry

named-Universe ranking branch

Taxonomy materialization

Search projection

Search index

PostgreSQL extension

dedicated Search engine

semantic/vector Search

AI ranking

API Search route

Web Search UI

schema change

migration
```

The indexing/projection decision remains a distinct next milestone:

```text
P6-M07 — Indexing Architecture Review
```

P6-M06 is CLOSED.

P6-M07 — Indexing Architecture Review is NEXT.


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

## P6-M07 CLOSURE RECORD

P6-M07 is closed against the green architecture-decision checkpoint:

```text
DECISION COMMIT
371a83bb3725ed51599c81d39140036f487e74e0

SUBJECT
docs(architecture): record P6-M07 indexing review

PARENT
4ab921f6296cb137b5a610d5c90d3d79f277e3f9
docs(roadmap): close P6-M06

GITHUB ACTIONS
CI run 32126421684
CI #102
attempt 1
completed — success
```

The accepted decision artifact is:

```text
docs/14-decisions/adr/p6-m07-indexing-architecture-review.md
```

P6-M07 reviewed the architecture actually implemented by Discovery rather than manufacturing a separate Search index merely because future scale might eventually require one.

The current Search implementation continues to query canonical Knowledge relational state directly in PostgreSQL.

The review outcome is:

```text
DIRECT POSTGRESQL OVER CANONICAL KNOWLEDGE
REMAINS THE CURRENT BASELINE

SEPARATE SEARCH PROJECTION
NOT REQUIRED NOW

SEPARATE SEARCH INDEX MODEL
NOT REQUIRED NOW

DEDICATED SEARCH ENGINE
DEFERRED

SEARCH SYNCHRONIZATION PIPELINE
NOT REQUIRED NOW

SEMANTIC / VECTOR SEARCH
DEFERRED

FUTURE PROJECTION OWNER IF REQUIRED
DISCOVERY
```

This decision is evidence-bounded.

It does not claim that direct PostgreSQL queries are proven sufficient for every future production scale or every future Search feature.

The accepted decision explicitly records that production-scale Search latency has not yet been characterized.

The current repository still has no:

```text
SearchProjection model

SearchIndex model

Search-specific PostgreSQL migration

Search-specific tsvector persistence

pg_trgm extension

Knowledge-to-Discovery indexing Event pipeline

Search rebuild worker

dedicated Search provider

vector store

embedding persistence

Search score in the public Search result contract
```

Canonical Knowledge remains owned by the Knowledge Platform.

Discovery owns Search semantics.

If a derived Search projection later becomes justified:

```text
Discovery owns the projection.

Knowledge remains canonical.

The projection remains derived.

The projection must be rebuildable.

The projection must not become a second canonical Knowledge source.
```

The roadmap-defined Dedicated Search Gate remains evidence-driven.

Before specialized Search infrastructure is introduced, representative evidence should be collected for:

```text
latency

result quality

faceting complexity

scale

language analysis
```

P6-M07 intentionally does not invent production SLO thresholds or claim measurements that do not exist.

The Phase 6 closure criteria still require the project to ensure that PostgreSQL Search is measured before specialized infrastructure is introduced.

That closure evidence remains separate from this architecture decision.

The Semantic Search Gate remains:

```text
DEFERRED
```

until a real product requirement demonstrates value.

Recommendations remain outside the required P6-M07 architecture change:

```text
basic related Resources
may later use relationships / taxonomy

personalized recommendations
remain later scope
```

P6-M07 changes no runtime behavior.

It introduces no:

```text
production code

Search contract change

schema change

migration

package dependency

lockfile change

Search projection

Search index

dedicated Search engine

AI ranking

semantic/vector infrastructure

named-Universe Discovery branch
```

Canonical migration count remains:

```text
15
```

P6-M07 is CLOSED.

There are no further numbered P6 milestones after P6-M07 in the current roadmap.

The next concrete Phase 6 implementation surface is:

```text
# 165. Phase 6 Web Integration
```

The remaining Phase 6 work after this closure is tracked by the roadmap sections:

```text
# 162. Dedicated Search Gate
measurement evidence before specialized infrastructure

# 163. Semantic Search Gate
DEFERRED unless real product value appears

# 164. Recommendations
basic related-resource capability is optional;
personalized recommendations remain later scope

# 165. Phase 6 Web Integration
PENDING

# 166. Phase 6 Security
PENDING final verification / completion

# 167. Phase 6 Closure Criteria
PENDING evaluation
```

Phase 6 remains ACTIVE.

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

## PHASE 6 WEB INTEGRATION CLOSURE RECORD

Phase 6 Web Integration is closed against the green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
80d496f491607b0a15f2b5602780852c061ba8f2

SUBJECT
feat(discovery): add web search experience

PARENT
3386d02d78494733fe9b090e5f144770a2217b31
docs(roadmap): close P6-M07

GITHUB ACTIONS
CI run 32131161796
CI #104
attempt 1
completed — success
```

The delivered public Search transport is:

```text
GET /discovery/search
```

The API composes the existing Discovery-owned Search contract through:

```text
SearchContract
        ↓
PrismaKnowledgeSearch
```

No duplicate Search implementation is introduced at the API boundary.

The public Search transport supports:

```text
query

global scope by default

optional Universe scope

exact multi-value Resource Type ANY-OF filters

offset pagination

bounded limit pagination
```

The public Web Search experience is available at:

```text
/search
```

It provides:

```text
global Search UI

Devotional Universe Search

Anime Universe Search

Resource Type filters

ranked Search result presentation

Resource navigation
```

Search-result navigation uses:

```text
/knowledge/resources/[id]
```

and reuses the existing public Knowledge Resource endpoint.

Search therefore does not introduce a second canonical Knowledge read model.

The implementation proves the public HTTP boundary against real PostgreSQL with:

```text
PUBLISHED Devotional Resource
VISIBLE

PUBLISHED Anime Resource
VISIBLE

DRAFT Devotional Resource
HIDDEN

ARCHIVED Anime Resource
HIDDEN
```

The same HTTP endpoint proves:

```text
global cross-Universe Search

Universe scope

Resource Type ANY-OF filters

pagination transport

invalid transport rejection
```

The browser flow proves:

```text
/search
        ↓
global Search
        ↓
Universe scope
        ↓
Resource Type filtering
        ↓
Search results
        ↓
/knowledge/resources/[id]
```

The validated implementation changed exactly:

```text
15 files

830 insertions

5 deletions
```

The runtime dependency classification changed only as required for the real API composition:

```text
@ai-world/platform-discovery

API devDependency
        ↓
API runtime dependency
```

No new third-party Search dependency was introduced.

The implementation introduced no:

```text
Search contract change

Search ranking change

Search score

Search projection

Search index

schema change

migration

AI ranking

semantic/vector Search

dedicated Search engine

named-Universe backend Search branch
```

Canonical migration count remains:

```text
15
```

Phase 6 remains ACTIVE.

The next required workstream is:

```text
# 166. Phase 6 Security
SECURITY REVIEW NEXT
```

The Security review must verify the now-public Search transport against:

```text
Resource visibility

Universe scope

Authorization/privacy rules

hidden Resource non-leakage
```

PostgreSQL Search measurement closure evidence remains pending.

Final Phase 6 closure-criteria evaluation remains pending.

No `phase-6-complete` tag is created by this checkpoint.

---

# 166. Phase 6 Security

Discovery must respect:

```text
Resource visibility;

Universe scope;

Authorization/privacy rules.
```

Search may not expose hidden Resources.

## PHASE 6 SECURITY CLOSURE RECORD

Phase 6 Security is closed against the green dedicated public-boundary proof:

```text
SECURITY PROOF COMMIT
76eb84794553257a3db284e94a2c89a0be9be4e4

SUBJECT
test(discovery): prove public search security

PARENT
822c2a8ff65808353242df26ef6473a4f6e8e44a
docs(roadmap): close Phase 6 Web Integration

GITHUB ACTIONS
CI run 32134953115
CI #106
attempt 1
completed - success
```

The Security review required no production security architecture change.

Canonical Knowledge currently has no implemented owner-specific visibility, private/public flag, audience model, ACL, or per-Resource privacy policy. Phase 6 therefore does not invent those semantics solely for Search.

The existing public visibility rule remains:

```text
PUBLISHED
PUBLICLY SEARCHABLE / READABLE

INITIAL
HIDDEN

DRAFT
HIDDEN

ARCHIVED
HIDDEN
```

The dedicated public-boundary proof verifies:

```text
anonymous global Search exposes only PUBLISHED Resources

Search result data is minimized to resourceId, resourceType, universeKey

Universe scope cannot fall back to global

cross-Universe Resource Type filters cannot bypass Universe scope

unknown canonical Universe scope returns no results

hidden Resource IDs remain unavailable through public Resource navigation

SQL-like Search input is treated literally

caller-controlled includeHidden=true is rejected
```

Authorization remains correctly separated: creator mutations use Identity & Access permission evaluation, while public Search/public Knowledge reads use the PUBLISHED lifecycle visibility boundary.

No new Search guard, Search permission key, Policy Kernel, privacy schema, ACL model, Search projection, Search index, migration, or third-party dependency was introduced.

Canonical migrations remain 15.

Phase 6 remains ACTIVE.

The next required workstream is:

```text
POSTGRESQL SEARCH MEASUREMENT EVIDENCE
NEXT
```

That workstream must measure the existing direct PostgreSQL Search implementation before any specialized Search infrastructure is considered. Measurement must be evidence-scoped and must not be represented as production-scale latency unless production-scale workload evidence exists.

Final Phase 6 closure-criteria evaluation remains pending.

No `phase-6-complete` tag is created by this checkpoint.

## POSTGRESQL SEARCH MEASUREMENT EVIDENCE CLOSURE RECORD

PostgreSQL Search Measurement Evidence is closed against the green documentation checkpoint:

```text
MEASUREMENT COMMIT
ccce4c7a6437b3526b37112d2b571558593c14c7

SUBJECT
docs(discovery): record PostgreSQL search measurement

PARENT
1a654c5f5057f8b5c9421ec8ac4aec85007c83b6
docs(roadmap): close Phase 6 Security

GITHUB ACTIONS
CI run 32139713314
CI #108
attempt 1
completed - success
```

The committed evidence measures the existing direct PostgreSQL Search implementation in a controlled local environment.

```text
POSTGRESQL
18.4

CONTROLLED KNOWLEDGE ROWS
100,000

WARM-UP RUNS PER SHAPE
2 discarded

MEASURED WARM RUNS PER SHAPE
10 retained
```

Representative Search shapes measured:

```text
global Search

Universe-scoped Search

Resource-Type-filtered Search
```

Measured warm medians:

```text
global
50.478 ms

Universe-scoped
28.491 ms

Resource-Type-filtered
32.533 ms
```

The captured warm PostgreSQL plans used parallel sequential scan, one worker plus the leader, in-memory top-N heapsort, Gather Merge, and Limit.

The evidence records planning time, execution time, scan strategy, parallel workers, scan loops, controlled rows examined/passing/removed, shared-buffer activity, and sort behavior.

The measurement is intentionally local and controlled. It does not claim a production SLA, production p95/p99, production concurrency capacity, production hardware equivalence, or future scale sufficiency.

No specialized Search infrastructure was introduced by the measurement.

The measurement introduces no Search index, Search projection, PostgreSQL extension, schema change, migration, new dependency, dedicated Search engine, or semantic/vector Search.

Canonical migrations remain 15.

The roadmap gate is satisfied:

```text
PostgreSQL Search is measured before specialized infrastructure is introduced.
```

Phase 6 remains ACTIVE.

The next required workstream is:

```text
PHASE 6 CLOSURE CRITERIA EVALUATION
NEXT
```

That evaluation must independently verify all eight criteria in Section 167.

No `phase-6-complete` tag is created by this checkpoint.

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

## PHASE 6 CLOSURE CRITERIA EVALUATION RECORD

The Phase 6 closure criteria were evaluated against the exact green repository checkpoint:

```text
BASELINE COMMIT
4e0736c120c4664355ef44febded68137a6a9560

SUBJECT
docs(roadmap): close PostgreSQL Search measurement

PARENT
ccce4c7a6437b3526b37112d2b571558593c14c7
docs(discovery): record PostgreSQL search measurement

GITHUB ACTIONS
CI run 32141331110
CI #109
attempt 1
completed — success
```

Evaluation result:

```text
8 / 8 CLOSURE CRITERIA
SATISFIED
```

Criterion-by-criterion result:

```text
1. Discovery owns Search
SATISFIED

2. Devotional and Anime are searchable
SATISFIED

3. Universe scope works
SATISFIED

4. global Search works
SATISFIED

5. filters work
SATISFIED

6. Search security is preserved
SATISFIED

7. Search does not own canonical Knowledge
SATISFIED

8. PostgreSQL Search is measured before specialized infrastructure is introduced
SATISFIED
```

Evidence matrix:

```text
1. Discovery owns Search
   STATUS: SATISFIED
   EVIDENCE: packages/platforms/discovery/src/search-contract.ts, packages/platforms/discovery/src/prisma-knowledge-search.ts, apps/api/src/app.module.ts, docs/14-decisions/adr/p6-m07-indexing-architecture-review.md

2. Devotional and Anime are searchable
   STATUS: SATISFIED
   EVIDENCE: apps/api/test/discovery-search.integration.spec.ts

3. Universe scope works
   STATUS: SATISFIED
   EVIDENCE: packages/platforms/discovery/src/search-contract.ts, packages/platforms/discovery/src/prisma-knowledge-search.ts, apps/api/test/discovery-search.integration.spec.ts, apps/api/test/discovery-security.integration.spec.ts

4. global Search works
   STATUS: SATISFIED
   EVIDENCE: packages/platforms/discovery/src/search-contract.ts, packages/platforms/discovery/src/prisma-knowledge-search.ts, apps/api/test/discovery-search.integration.spec.ts

5. filters work
   STATUS: SATISFIED
   EVIDENCE: packages/platforms/discovery/src/search-contract.ts, packages/platforms/discovery/src/prisma-knowledge-search.ts, apps/api/test/discovery-search.integration.spec.ts

6. Search security is preserved
   STATUS: SATISFIED
   EVIDENCE: packages/platforms/discovery/src/prisma-knowledge-search.ts, apps/api/test/discovery-security.integration.spec.ts

7. Search does not own canonical Knowledge
   STATUS: SATISFIED
   EVIDENCE: packages/platforms/discovery/src/prisma-knowledge-search.ts, packages/foundations/database/prisma/schema.prisma, docs/14-decisions/adr/p6-m07-indexing-architecture-review.md, docs/03-engineering/postgresql-search-measurement.md

8. PostgreSQL Search is measured before specialized infrastructure is introduced
   STATUS: SATISFIED
   EVIDENCE: docs/03-engineering/postgresql-search-measurement.md, docs/14-decisions/adr/p6-m07-indexing-architecture-review.md
```

The evaluation confirms the Phase 6 architecture remains:

```text
Discovery Platform
owns Search contract and Search semantics

Knowledge Platform
owns canonical Knowledge state

PrismaKnowledgeSearch
queries canonical knowledge_resources directly

public Search visibility
PUBLISHED only

Universe scope
ENFORCED

global cross-Universe Search
ENABLED

Resource Type exact ANY-OF filters
ENABLED

Devotional + Anime
PROVEN THROUGH THE SAME SHARED SEARCH PLATFORM
```

The PostgreSQL measurement gate is satisfied using the committed controlled 100,000-row evidence.

Current evidence does not justify:

```text
separate Search projection

dedicated Search engine

semantic/vector Search

named-Universe Search infrastructure
```

Those capabilities remain gated by future real product/workload evidence.

Canonical migrations remain:

```text
15
```

Phase 6 closure criteria are therefore satisfied.

This evaluation does not itself create the completion tag.

Phase 6 remains ACTIVE until the separate final Phase 6 closure documentation checkpoint is validated, committed, pushed, and its exact CI succeeds.

Next workstream:

```text
PHASE 6 FINAL CLOSURE DOCUMENTATION
NEXT
```

Tag rule:

```text
phase-6-complete
NOT ELIGIBLE YET

ELIGIBLE ONLY AFTER
the exact final Phase 6 closure documentation commit
completes remote CI successfully
```


## PHASE 6 FINAL CLOSURE DOCUMENTATION RECORD

The final Phase 6 roadmap closure is based on the exact green closure-criteria evaluation checkpoint:

```text
BASELINE COMMIT
856c1e10c3f3a386a002aedcec4b182046706a7b

SUBJECT
docs(roadmap): evaluate Phase 6 closure criteria

PARENT
4e0736c120c4664355ef44febded68137a6a9560
docs(roadmap): close PostgreSQL Search measurement

GITHUB ACTIONS
CI run 32143012420
CI #110
attempt 1
completed — success
```

Phase 6 closure state:

```text
PHASE 6 — DISCOVERY PLATFORM
COMPLETE

CLOSURE CRITERIA
8 / 8 SATISFIED

EXIT OUTCOME
SHARED MULTI-UNIVERSE DISCOVERY PLATFORM
```

Closed capability sequence:

```text
P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

P6-M03 — Universe-Scoped Search
CLOSED

P6-M04 — Cross-Universe Search
CLOSED

P6-M05 — Filters
CLOSED

P6-M06 — Basic Ranking
CLOSED

P6-M07 — Indexing Architecture Review
CLOSED

Phase 6 Web Integration
CLOSED

Phase 6 Security Review
CLOSED

PostgreSQL Search Measurement Evidence
CLOSED

Phase 6 Closure Criteria Evaluation
CLOSED — 8 / 8 SATISFIED
```

The completed Discovery boundary is:

```text
Discovery Platform
owns Search contracts and Search semantics

Knowledge Platform
owns canonical Knowledge state

public Search
PUBLISHED-only visibility

Universe scope
SUPPORTED and ENFORCED

global Search
SUPPORTED

cross-Universe Search
SUPPORTED

Resource Type exact ANY-OF filters
SUPPORTED

basic deterministic ranking
SUPPORTED

Devotional + Anime
PROVEN THROUGH ONE SHARED DISCOVERY PLATFORM

Web Search experience
AVAILABLE

canonical Resource navigation
AVAILABLE
```

The measured PostgreSQL baseline remains the accepted current Search infrastructure.

The committed measurement evidence used a controlled 100,000-row dataset and measured:

```text
global Search

Universe-scoped Search

Resource-Type-filtered Search

planning time

execution time

scan strategy

rows examined / removed

buffer behavior

sort behavior

repeated warm measurements
```

Current evidence still does not justify:

```text
separate Search projection

dedicated Search engine

semantic/vector Search

named-Universe Search infrastructure
```

Those capabilities remain evidence-gated rather than phase-closure requirements.

Security remains within the implemented canonical model:

```text
PUBLISHED
searchable

INITIAL
hidden

DRAFT
hidden

ARCHIVED
hidden

Universe scope bypass
blocked

hidden Resource direct navigation
blocked

caller-controlled hidden visibility
rejected
```

Canonical migrations remain:

```text
15
```

This final closure documentation checkpoint introduces no:

```text
runtime Search change

Knowledge semantic change

authorization/privacy model change

database schema change

migration

package dependency

lockfile change

CI behavior change
```

Repository tag governance remains separate from this documentation candidate.

The final Phase 6 completion tag must be:

```text
phase-6-complete

annotated

target
the exact final Phase 6 documentation-closure commit

creation gate
that exact commit has been pushed
AND
its remote CI has completed successfully
```

Therefore this runner does not create or push `phase-6-complete`.

After the exact final Phase 6 closure commit passes remote CI, create the annotated phase tag against that exact commit and push only that tag.

The next delivery phase is:

```text
PHASE 7 — AI / Creator Platform
NEXT
```

Phase 7 implementation begins only after the Phase 6 repository completion marker is established according to the phase-tag rule.

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

## PHASE 7 PROVIDER DECISION CLOSURE RECORD

The Phase 7 Provider Decision is closed against the exact green Provider Decision checkpoint:

```text
IMPLEMENTATION COMMIT
de8ef05596eff8022910b7df362c6dbe0cef5cac

SUBJECT
docs(ai): select initial AI provider

PARENT
ab75238ecab17b6251479fed871f654e955ed21a
docs(roadmap): close Phase 6

GITHUB ACTIONS
CI run 32155970530
CI #112
attempt 2
event push
branch main
completed — success
```

Accepted Provider selection:

```text
PHASE 7 PROVIDER DECISION
CLOSED

INITIAL PROVIDER
OPENAI API

PREFERRED P7-M02 PROVIDER API SURFACE
Responses API

CONCRETE MODEL
NOT SELECTED YET

PROVIDER SDK
NOT INSTALLED

MULTI-PROVIDER
NOT JUSTIFIED
```

The decision establishes the Provider only.

P7-M01 remains Provider-neutral and must introduce only the smallest AI World-owned Provider Contract required by the next real capability.

The Provider Decision does not introduce:

```text
OpenAI SDK dependency

Anthropic SDK dependency

Gemini SDK dependency

Provider Adapter

concrete model selection

API credential

AI database schema

Generation persistence

AI API endpoint

AI Web UI

Agent framework

MCP runtime

embeddings

Vector Database

Queue / Worker

second Provider
```

Ownership remains:

```text
AI World
owns
Provider Contract

future OpenAI Adapter
implements
Provider Contract

future OpenAI SDK
private to
OpenAI Adapter
```

Provider-specific request/response SDK types must not become canonical AI World Domain, Knowledge, Media, Discovery, Universe, API transport, or Generation types.

The existing Phase 7 gates remain unchanged:

```text
P7-M01 — AI Provider Port
NEXT

P7-M02 — Initial Provider Adapter
AFTER P7-M01

concrete OpenAI model selection
P7-M02

second Provider
ONLY AFTER MULTI-PROVIDER GATE EVIDENCE
```

Canonical migrations remain:

```text
15
```

This roadmap closure changes documentation state only.

It introduces no runtime, package dependency, lockfile, schema, migration, CI, Knowledge, Media, Discovery, Identity, or Universe behavior change.

Phase 7 delivery position after this closure is:

```text
PHASE 7 — AI / Creator Platform
ACTIVE

PHASE 7 PROVIDER DECISION
CLOSED

INITIAL PROVIDER
OPENAI API

P7-M01 — AI Provider Port
NEXT
```

---

# 171. Phase 7 Milestone P7-M01 — AI Provider Port

Create typed AI World-owned Provider Contract.

---

## P7-M01 CLOSURE RECORD

P7-M01 is closed against the exact green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
273891fb87cfe608bb51b4b7650dfdf786d5e598

SUBJECT
feat(ai): establish provider port

PARENT
c9e899eaa925c22141ca015b97cdc203956fa5c7
docs(roadmap): close Phase 7 provider decision

GITHUB ACTIONS
CI run 32248325572
CI #114
attempt 1
event push
branch main
completed — success
```

Implemented AI World-owned boundary:

```text
PACKAGE
@ai-world/platform-ai-creator

AiProviderPort
    generateText(request)

AiProviderTextRequest
    input
    instructions?

AiProviderTextResult
    text
    model
```

The contract is Provider-neutral.

`model` is an opaque AI World result field and does not select or expose a concrete Provider model.

P7-M01 intentionally does not introduce:

```text
OpenAI SDK dependency

Anthropic SDK dependency

Gemini SDK dependency

Provider Adapter

concrete model selection

API credential

Provider environment/configuration

structured-output abstraction

Tools

streaming

embeddings

Vector Database

Agent framework

MCP runtime

Generation persistence

AI database schema or migration

AI API endpoint

AI Web UI
```

Ownership remains:

```text
AI / Creator Platform
owns
AiProviderPort

P7-M02 OpenAI Adapter
will implement
AiProviderPort

OpenAI SDK
must remain private to
P7-M02 Provider Adapter infrastructure
```

P7-M02 is now the next milestone.

P7-M02 may introduce only the smallest OpenAI Adapter required to implement the P7-M01 contract, including the official Provider SDK and concrete initial model selection when validated against the accepted Provider Decision.

The existing Provider Decision remains:

```text
INITIAL PROVIDER
OPENAI API

PREFERRED P7-M02 API SURFACE
Responses API

CONCRETE MODEL
NOT SELECTED YET

SECOND PROVIDER
NOT JUSTIFIED
```

Canonical migrations remain:

```text
15
```

This closure changes roadmap documentation only.

It does not change runtime code, Provider dependencies, the lockfile, Prisma schema, migrations, API/Web behavior, Knowledge, Media, Discovery, Identity, or Universe behavior.

Phase 7 delivery position after this closure is:

```text
PHASE 7 — AI / Creator Platform
ACTIVE

PHASE 7 PROVIDER DECISION
CLOSED

P7-M01 — AI Provider Port
CLOSED

P7-M02 — Initial Provider Adapter
NEXT

PROVIDER SDK
NOT INSTALLED

CONCRETE MODEL
NOT SELECTED YET
```

---

# 172. Phase 7 Milestone P7-M02 — Initial Provider Adapter

Implement one Provider Adapter.

Provider SDK must remain isolated.

---

## P7-M02 CLOSURE RECORD

P7-M02 is closed against the exact green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
7b126ac375c954b544f651d0d4e9886835ba8e28

SUBJECT
feat(ai): add OpenAI provider adapter

PARENT
21855d60c926e5fdb83de1e09d8de53e6d79686e
docs(roadmap): close P7-M01 provider port

GITHUB ACTIONS
CI run 32256862516
CI #116
attempt 1
event push
branch main
completed — success
```

Implemented Provider boundary:

```text
AI WORLD PROVIDER PORT
AiProviderPort

INITIAL PROVIDER
OpenAI API

PROVIDER SDK
openai 7.5.0

PROVIDER API SURFACE
Responses API

CONCRETE INITIAL MODEL
gpt-5.6-terra
```

Provider isolation is preserved:

```text
Provider-neutral package root
@ai-world/platform-ai-creator

Provider-specific infrastructure subpath
@ai-world/platform-ai-creator/infrastructure/openai

OpenAI SDK import
isolated to OpenAI Adapter infrastructure
```

The implemented Adapter maps the existing AI World-owned text contract to the OpenAI Responses API:

```text
AiProviderTextRequest
    input
    instructions?
        ↓
OpenAiProviderAdapter
        ↓
Responses API

model
gpt-5.6-terra

store
false
        ↓
response.output_text
response.model
        ↓
AiProviderTextResult
    text
    model
```

The concrete initial model selection is therefore:

```text
gpt-5.6-terra
```

This model selection belongs to the P7-M02 Adapter checkpoint and does not alter the Provider-neutral `AiProviderPort`.

Credential ownership remains server-side composition responsibility:

```text
OpenAiProviderConfig
    apiKey
```

The AI / Creator package does not read `process.env`, does not own `OPENAI_API_KEY` loading, and does not contain a committed API credential.

P7-M02 intentionally does not introduce:

```text
live paid Provider acceptance request

API / Web Provider wiring

Generation persistence

Generation database model

Prisma schema change

migration

structured-output abstraction

Tools

streaming

embeddings

Vector Database

Agent framework

MCP runtime

second Provider Adapter
```

P7-M02 validates the Provider Adapter boundary itself.

The first real Generation capability remains a later Phase 7 vertical slice.

Canonical migrations remain:

```text
15
```

This closure changes roadmap documentation only.

It does not change runtime code, package dependencies, the lockfile, Prisma schema, migrations, API/Web behavior, Knowledge, Discovery, Media, Identity, or Universe behavior.

Phase 7 delivery position after this closure is:

```text
PHASE 7 — AI / Creator Platform
ACTIVE

PHASE 7 PROVIDER DECISION
CLOSED

P7-M01 — AI Provider Port
CLOSED

P7-M02 — Initial Provider Adapter
CLOSED

INITIAL PROVIDER
OpenAI API

PROVIDER SDK
openai 7.5.0

PROVIDER API SURFACE
Responses API

CONCRETE INITIAL MODEL
gpt-5.6-terra

P7-M03 — Generation Model
NEXT
```

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

## P7-M03 CLOSURE RECORD

P7-M03 is closed against the exact green implementation checkpoint:

```text
IMPLEMENTATION COMMIT
f21d0219ea2f6fa7203be11a2fd7adc02c58790e

SUBJECT
feat(ai): establish generation model

PARENT
8ee981b4d8e2273ac605b7815f14aba3e36f8569
docs(roadmap): close P7-M02 provider adapter

GITHUB ACTIONS
CI run 32265489506
CI #118
attempt 1
event push
branch main
completed — success
```

Canonical AI / Creator Generation ownership now exists as:

```text
Generation
    id
    actorId
    status
    provider
    model?
    request
    result?
    createdAt
    updatedAt

GenerationRequest
    input
    instructions?
    createdAt

GenerationResult
    text
    createdAt
```

Canonical Generation statuses introduced by P7-M03 are intentionally limited to:

```text
REQUESTED
SUCCEEDED
FAILED
```

P7-M03 does not invent queue, worker, retry, cancellation, or agent-runtime states.

Requester ownership reuses canonical Identity:

```text
Generation.actorId
    ↓
identity_actors.id
```

The Actor foreign key uses `ON DELETE RESTRICT` and `ON UPDATE CASCADE`.

Generation-owned Request and Result records are one-per-Generation primary-key extensions and cascade with their Generation.

Provider/model mapping remains AI World-owned and Provider-neutral:

```text
provider
required opaque string

model
nullable opaque string
```

This permits `REQUESTED` with provider known and model/result absent, followed by either `SUCCEEDED` with the actual returned model and GenerationResult, or `FAILED` with no manufactured result.

No OpenAI SDK type enters the canonical Generation model, Prisma schema, or migration.

Persistence is owned through:

```text
ai_generations
ai_generation_requests
ai_generation_results
```

The P7-M03 migration is:

```text
20260819193000_ai_generation_model_baseline
```

Canonical migration count after P7-M03 is:

```text
16
```

P7-M03 intentionally does not introduce:

```text
live paid Provider request
OPENAI_API_KEY composition
NestJS Generation endpoint
Web Generation UI
text-generation application orchestration
authorized Knowledge / Discovery grounding
expanded provenance model
safety pipeline
canonical AI acceptance workflow
structured output abstraction
Tools
streaming
embeddings
Vector Database
queue / worker / retry framework
Agent framework
MCP runtime
usage / token / cost accounting
second Provider
```

The existing P7-M02 OpenAI Provider Adapter remains unchanged: OpenAI API, `openai` 7.5.0, Responses API, `gpt-5.6-terra`, and `store: false`.

P7-M03 establishes only the canonical Generation state needed by the next real capability.

This closure changes roadmap documentation only. It does not change runtime code, dependencies, lockfile, Prisma schema, migrations, API/Web behavior, Knowledge, Discovery, Media, Identity, or Universe behavior.

Phase 7 delivery position after this closure is:

```text
PHASE 7 — AI / Creator Platform
ACTIVE

PHASE 7 PROVIDER DECISION
CLOSED

P7-M01 — AI Provider Port
CLOSED

P7-M02 — Initial Provider Adapter
CLOSED

P7-M03 — Generation Model
CLOSED

INITIAL PROVIDER
OpenAI API

PROVIDER SDK
openai 7.5.0

PROVIDER API SURFACE
Responses API

CONCRETE INITIAL MODEL
gpt-5.6-terra

CANONICAL GENERATION MIGRATIONS
16

P7-M04 — Text Generation
NEXT
```

---

## P7-M03 CI REVALIDATION RECORD

P7-M03 remains CLOSED.

The original roadmap closure commit is:

```text
2b62137681606eb36242f4cf65f6b852a989d0bb
docs(roadmap): close P7-M03 generation model
```

Its first CI path exposed a GitHub-hosted Playwright provisioning reliability problem rather than a P7-M03 implementation defect.

The CI reliability repair sequence was intentionally isolated from P7-M04:

```text
1.
54e2becfb18a5fd4ced1e9f8817f05f88eaf113c
ci: use preinstalled Chrome for browser tests

removed Playwright browser/apt provisioning from GitHub CI
and selected the preinstalled Google Chrome channel.

2.
df9e9342c46f8fcab5f199b2eaac36769a62f028
ci: pass system Chrome flag through Turbo

passed PLAYWRIGHT_USE_SYSTEM_CHROME through Turborepo strict environment handling.
```

The final repair is revalidated against the exact successful GitHub Actions push run:

```text
COMMIT
df9e9342c46f8fcab5f199b2eaac36769a62f028

WORKFLOW
CI

RUN ID
32278323216

CI NUMBER
#121

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 12s
(192 seconds)

VALIDATE JOB DURATION
3m 8s
(188 seconds)

BROWSER E2E DURATION
25s
(25 seconds)
```

The repaired CI path proves:

```text
Install Playwright Chromium
ABSENT

playwright install
ABSENT

--with-deps / apt browser provisioning
ABSENT

PLAYWRIGHT_USE_SYSTEM_CHROME
PASSED THROUGH TURBO

Playwright
channel = chrome

Run browser E2E tests
SUCCESS

Build
SUCCESS

Check architecture
SUCCESS
```

P7-M03 canonical implementation remains unchanged:

```text
f21d0219ea2f6fa7203be11a2fd7adc02c58790e
feat(ai): establish generation model
```

This checkpoint changes governance documentation only.

It does not change:

```text
Generation
GenerationRequest
GenerationResult

Prisma schema or migrations

AI Provider Port

OpenAI Provider Adapter

API

Web product behavior

Knowledge

Discovery

Media

Identity

dependencies

lockfile
```

P7-M04 remains the next milestone and is unblocked only after this CI-revalidation checkpoint commit itself completes green CI.

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

## P7-M04 CLOSURE RECORD

P7-M04 — Text Generation is CLOSED.

The canonical implementation commit is:

```text
c37a8ce71046524b0e2ed2733b1aa2d8c0c1f4e5
feat(ai): implement text generation
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32333020737

CI NUMBER
#123

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
2m 54s
(174 seconds)

VALIDATE JOB DURATION
2m 51s
(171 seconds)

BROWSER E2E DURATION
17s
(17 seconds)
```

P7-M04 establishes the first real provider-neutral text-generation vertical slice:

```text
Actor
  ↓
GenerateText
  ↓
Generation REQUESTED persisted
  ↓
AiProviderPort.generateText(...)
  ↓
success:
  Generation SUCCEEDED
  actual Provider-returned model persisted
  GenerationResult text persisted

failure:
  Generation FAILED
  model remains null
  no fabricated GenerationResult
```

The concrete first capability is creator text drafting from caller-supplied text and optional instructions.

The application boundary is:

```text
GenerateText
  ↓
GenerationWriter
  ↑
PrismaGenerationRepository
```

The Provider boundary remains:

```text
AiProviderPort
```

and the existing OpenAI adapter remains an infrastructure implementation behind that Port.

P7-M04 reuses the P7-M03 canonical persistence model:

```text
Generation
GenerationRequest
GenerationResult
```

No new Prisma schema change or migration was required.

Canonical migration count remains:

```text
16
```

The implementation commit contains exactly:

```text
packages/platforms/ai-creator/package.json
packages/platforms/ai-creator/src/generate-text.ts
packages/platforms/ai-creator/src/generation-writer.ts
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/src/infrastructure.ts
packages/platforms/ai-creator/src/prisma-generation-repository.ts
packages/platforms/ai-creator/test/generate-text.spec.ts
packages/platforms/ai-creator/test/text-generation.integration.spec.ts
pnpm-lock.yaml
```

Validated behavior includes:

```text
REQUESTED is persisted before Provider invocation

successful Provider result
→ actual model persisted
→ result text persisted
→ SUCCEEDED

Provider rejection
→ FAILED
→ no fabricated model/result

invalid terminal transition
→ success is not manufactured

real PostgreSQL integration
→ request/status visible during Provider invocation
→ final terminal state persisted
```

P7-M04 intentionally does not introduce:

```text
OPENAI_API_KEY composition wiring

a live paid OpenAI validation call

NestJS generation endpoint

Web generation UI

Knowledge or Discovery context

RAG

embeddings or vector database

structured output

streaming

tools

agents or MCP

queue/worker infrastructure

retry framework

token/usage/cost accounting

canonical Knowledge acceptance
```

Those concerns remain governed by later Phase 7 milestones.

P7-M05 — Authorized AI Context is NEXT.

P7-M05 must continue to use approved public Platform Contracts for:

```text
Knowledge
Discovery
User/Universe Context
```

and AI must not bypass those Contracts to read arbitrary canonical tables.

This closure changes governance documentation only.

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

## P7-M05 CLOSURE RECORD

P7-M05 — Authorized AI Context is CLOSED.

The canonical implementation commit is:

```text
8964565eb20af76f54faf2982ab23fbcfff63b2b
feat(ai): implement authorized AI context
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32335792901

CI NUMBER
#125

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 26s
(206 seconds)

VALIDATE JOB DURATION
3m 22s
(202 seconds)

BROWSER E2E DURATION
27s
(27 seconds)

BUILD DURATION
12s
(12 seconds)

ARCHITECTURE DURATION
9s
(9 seconds)
```

P7-M05 establishes an authorized AI context boundary:

```text
requesting Actor
  ↓
UserProfileReader
  ↓
self User context

requested Universe
  ↓
SearchContract
  ↓
Universe-scoped Discovery
  ↓
PublicKnowledgeResourceReader
  ↓
published Knowledge only
  ↓
AuthorizedAiContextPort
  ↓
GenerateTextWithAuthorizedContext
  ↓
existing P7-M04 GenerateText
```

The concrete first capability flows:

```text
self User display name

requested Universe

published matching Knowledge Resource IDs/types
```

into the existing text-generation instructions.

The application boundary is:

```text
GenerateTextWithAuthorizedContext
  ↓
AuthorizedAiContextPort
```

The platform-contract adapter is:

```text
PlatformAuthorizedAiContext
```

and depends only on the approved public contracts:

```text
UserProfileReader
SearchContract
PublicKnowledgeResourceReader
```

The AI context adapter does not import:

```text
Foundation Database
Prisma
```

and therefore does not bypass Platform Contracts to read canonical tables.

The authorized-context boundary fails closed when:

```text
requesting User cannot be resolved

Discovery returns a Resource outside the requested Universe

Knowledge returns a Resource outside the authorized public context
```

The context query is bounded:

```text
default limit
5

maximum limit
10
```

P7-M05 intentionally uses the current public Knowledge contract as it exists today.

That contract exposes canonical Resource identity/type/Universe/lifecycle metadata but not a rich arbitrary content-body read for AI.

P7-M05 therefore does not invent a hidden table read to obtain richer context.

The implementation commit contains exactly:

```text
packages/platforms/ai-creator/package.json
packages/platforms/ai-creator/src/authorized-ai-context.ts
packages/platforms/ai-creator/src/generate-text-with-authorized-context.ts
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/src/infrastructure.ts
packages/platforms/ai-creator/src/infrastructure/platform-authorized-ai-context.ts
packages/platforms/ai-creator/test/authorized-ai-context.integration.spec.ts
packages/platforms/ai-creator/test/generate-text-with-authorized-context.spec.ts
packages/platforms/ai-creator/test/platform-authorized-ai-context.spec.ts
pnpm-lock.yaml
```

Validated real PostgreSQL behavior includes:

```text
requesting Actor resolves only its own User profile

Discovery is constrained to the requested Universe

published Knowledge in the requested Universe is included

DRAFT Knowledge is excluded

published Knowledge from another Universe is excluded

authorized context reaches AiProviderPort

authorized context is persisted in GenerationRequest.instructions

Generation completes through the existing P7-M04 lifecycle
```

No Prisma schema change or migration was required.

Canonical migration count remains:

```text
16
```

P7-M05 intentionally does not introduce:

```text
direct AI reads of User/Knowledge canonical tables

private or unpublished Knowledge context

global cross-Universe AI context

NestJS generation endpoint

Web generation UI

OPENAI_API_KEY composition wiring

a live paid OpenAI validation call

RAG

embeddings or vector database

structured output

streaming

tools

agents or MCP

queue/worker infrastructure

retry framework

token/usage/cost accounting

canonical Knowledge acceptance
```

Those concerns remain governed by later Phase 7 milestones.

P7-M06 — AI Provenance is NEXT.

P7-M06 must record enough provenance to answer:

```text
which Provider

which model

which task

which source context

when

who requested it
```

P7-M05's authorized context is not itself canonical Knowledge and does not alter the AI Source-of-Truth rule.

This closure changes governance documentation only.

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

## P7-M06 CLOSURE RECORD

P7-M06 — AI Provenance is CLOSED.

The canonical implementation commit is:

```text
a7dd142693fb7425f30b2a4915d4e4e4ffdb03a3
feat(ai): implement generation provenance
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32339994138

CI NUMBER
#127

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 0s
(180 seconds)

VALIDATE JOB DURATION
2m 57s
(177 seconds)

BROWSER E2E DURATION
27s
(27 seconds)

BUILD DURATION
11s
(11 seconds)

ARCHITECTURE DURATION
9s
(9 seconds)
```

P7-M06 closes the minimum Generation-owned provenance model needed to answer:

```text
which Provider

which model

which task

which source context

when

who requested it
```

The existing Generation remains canonical for:

```text
requesting Actor
→ Generation.actorId

Provider
→ Generation.provider

actual model when known
→ Generation.model

Generation time
→ Generation.createdAt
```

P7-M06 adds the missing Generation-owned evidence:

```text
Generation
  ↓
GenerationProvenance
  task
  sourceContext?
  createdAt
```

The persistence table is:

```text
ai_generation_provenance
```

with a one-to-one Generation relationship and:

```text
ON DELETE CASCADE
ON UPDATE CASCADE
```

The authorized source-context snapshot contains only stable identifiers already obtained through the P7-M05 authorized-context boundary:

```text
Universe key

Knowledge Resource ID

Knowledge Resource type

Knowledge Resource Universe
```

P7-M06 deliberately does not duplicate the User display name.

Requester identity remains represented by:

```text
Generation.actorId
```

Provenance is created atomically with the REQUESTED Generation and GenerationRequest before Provider execution.

Therefore both Provider success and Provider failure retain:

```text
requester

Provider

task

source context

timestamp
```

and successful completion additionally records the actual returned model through the existing Generation lifecycle.

Default task identifiers established by P7-M06 are:

```text
ai.text-generation

ai.authorized-text-generation
```

while callers may supply a more specific task identifier when the real use case knows one.

The implementation commit contains exactly:

```text
packages/foundations/database/prisma/migrations/20260820113000_ai_generation_provenance/migration.sql
packages/foundations/database/prisma/schema.prisma
packages/platforms/ai-creator/src/generate-text-with-authorized-context.ts
packages/platforms/ai-creator/src/generate-text.ts
packages/platforms/ai-creator/src/generation-writer.ts
packages/platforms/ai-creator/src/generation.ts
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/src/prisma-generation-repository.ts
packages/platforms/ai-creator/test/generate-text-with-authorized-context.spec.ts
packages/platforms/ai-creator/test/generation-provenance.integration.spec.ts
```

P7-M06 adds exactly one migration.

Canonical migration count is now:

```text
17
```

Validated real PostgreSQL behavior includes:

```text
REQUESTED Generation provenance exists before Provider execution

task and authorized source-context snapshot persist before Provider execution

successful Provider result retains provenance and records actual model

Provider failure retains provenance with model null and no GenerationResult

existing authorized-context generation remains compatible

existing text-generation lifecycle remains compatible

existing Generation model persistence remains compatible
```

No `package.json` or `pnpm-lock.yaml` dependency change was required.

P7-M06 intentionally does not introduce:

```text
P7-M07 safety-policy implementation

generic input-validation framework

tool restriction framework

output-schema validation framework

sensitive-data policy framework

failure-control framework expansion

P7-M08 canonical acceptance flow

NestJS generation endpoint

Web generation UI

RAG

embeddings or vector database

tools

agents or MCP

queue/worker infrastructure

retry framework

token/usage/cost accounting
```

Those concerns remain governed by later Phase 7 milestones.

P7-M07 — Safety Baseline is NEXT.

P7-M07 remains blocked until this roadmap-only closure commit itself completes exact green CI.

This closure changes governance documentation only.

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

## P7-M07 CLOSURE RECORD

P7-M07 — Safety Baseline is CLOSED.

The canonical implementation commit is:

```text
7fb7ac5308fbe776c6abb7c66b1ac171e650ea5d
feat(ai): implement safety baseline
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32365848716

CI NUMBER
#129

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 4s
(184 seconds)

VALIDATE JOB DURATION
3m 1s
(181 seconds)

BROWSER E2E DURATION
23s
(23 seconds)

BUILD DURATION
11s
(11 seconds)

ARCHITECTURE DURATION
9s
(9 seconds)
```

P7-M07 establishes a mandatory text-generation safety boundary inside the existing GenerateText path:

```text
Actor
  ↓
GenerateText
  ↓
bounded input / task / source-context validation
  ↓
credential-like sensitive-data rejection
  ↓
Identity PermissionEvaluationReader
  ai.generate
  ↓
REQUESTED Generation + provenance
  ↓
allowlisted text-only Provider request
  ↓
AiProviderPort
  ↓
runtime text/model output validation
  ↓
SUCCEEDED
```

The safety boundary is not an optional wrapper.

Every GenerateText execution requires:

```text
GenerateTextConfig.permissions
```

and evaluates the existing public Identity contract:

```text
PermissionEvaluationReader.hasPermission
```

using:

```text
ai.generate
```

P7-M07 adds the `ai.generate` permission and grants it conservatively to the existing:

```text
administrator
```

role.

The permission migration is:

```text
20260820164000_ai_generation_permission
```

No Prisma schema change was required.

Canonical migration count is now:

```text
18
```

Input validation establishes bounded text-generation limits:

```text
AI input
non-blank
max 20,000 characters
no NUL characters

instructions
max 10,000 characters

task
namespaced identifier
max 128 characters

authorized source context
max 10 Knowledge Resources
no duplicate Resource IDs
no cross-Universe Resource entries
```

Tool access remains structurally:

```text
DISABLED
```

The Provider Port still exposes no tool execution surface.

Provider requests are rebuilt from an allowlist containing only:

```text
input

instructions
```

so unexpected runtime properties are not forwarded to the Provider.

Sensitive-data handling rejects credential-like material before Generation persistence and before Provider transfer.

The first safety baseline covers:

```text
private-key material

Bearer credentials

OpenAI-style secret-key patterns

AWS access-key identifiers

explicit password / secret / API-key / access-token assignments
```

The safety error does not echo the detected credential value.

P7-M07 does not claim a universal PII or DLP platform.

Provider output is validated at runtime.

The text-generation output contract requires:

```text
generated text
non-empty
max 50,000 characters

model identifier
non-empty
max 128 characters
```

The model limit intentionally matches the canonical persistence constraint:

```text
Generation.model
VARCHAR(128)
```

Provider exceptions and invalid Provider output use the existing failure-control path:

```text
REQUESTED
  ↓
FAILED
```

Invalid Provider output therefore does not fabricate:

```text
model

GenerationResult
```

while existing provenance remains retained.

Requests rejected before Provider execution do not create a Generation.

Validated rejection paths include:

```text
invalid input

permission denied

credential-like sensitive data
```

Validated real PostgreSQL behavior includes:

```text
Administrator with ai.generate can execute generation

Actor without ai.generate is denied before persistence and Provider execution

credential-like input is denied before persistence and Provider transfer

Provider output with invalid text transitions Generation to FAILED

Provider model identifier longer than 128 characters is rejected as INVALID_OUTPUT
before persistence of an invalid model and transitions Generation to FAILED

failed output validation retains Generation provenance

existing P7-M04 text generation remains compatible

existing P7-M05 authorized-context generation remains compatible

existing P7-M06 provenance remains compatible
```

The implementation commit contains exactly:

```text
packages/foundations/database/prisma/migrations/20260820164000_ai_generation_permission/migration.sql
packages/platforms/ai-creator/package.json
packages/platforms/ai-creator/src/ai-generation-safety.ts
packages/platforms/ai-creator/src/generate-text.ts
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/test/ai-generation-safety.integration.spec.ts
packages/platforms/ai-creator/test/ai-generation-safety.spec.ts
packages/platforms/ai-creator/test/authorized-ai-context.integration.spec.ts
packages/platforms/ai-creator/test/generate-text.spec.ts
packages/platforms/ai-creator/test/generation-provenance.integration.spec.ts
packages/platforms/ai-creator/test/support/allow-ai-generation-permission.ts
packages/platforms/ai-creator/test/text-generation.integration.spec.ts
pnpm-lock.yaml
```

The only new AI Creator workspace dependency is:

```text
@ai-world/platform-identity-access
```

OpenAI SDK remains exactly:

```text
7.5.0
```

P7-M07 intentionally does not introduce:

```text
P7-M08 Creator review / canonical acceptance

canonical Knowledge/Media/CMS mutation

AI Tool execution

RAG

embeddings or vector database

agents or MCP

queue/worker infrastructure

retry framework

token/usage/cost accounting

a universal PII/DLP platform

NestJS generation endpoint

Web generation UI
```

P7-M08 — Canonical Acceptance Flow is NEXT.

P7-M08 must prove:

```text
AI generates candidate
        ↓
Creator reviews
        ↓
Knowledge/Media/CMS owner accepts
        ↓
canonical Resource changes
```

The AI Source-of-Truth rule remains unchanged:

```text
Generation Result is not canonical Knowledge merely because a model produced it.
```

P7-M08 remains blocked until this roadmap-only closure commit itself completes exact green CI.

This closure changes governance documentation only.

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

## P7-M08 CLOSURE RECORD

P7-M08 — Canonical Acceptance Flow is CLOSED.

The canonical implementation commit is:

```text
13af59d2ecd1366bfbca24d4a262e8ea8ffa1d19
feat(ai): implement canonical acceptance flow
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32371217387

CI NUMBER
#131

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 1s
(181 seconds)

VALIDATE JOB DURATION
2m 57s
(177 seconds)

BROWSER E2E DURATION
26s
(26 seconds)

BUILD DURATION
10s
(10 seconds)

ARCHITECTURE DURATION
7s
(7 seconds)
```

P7-M08 proves the canonical acceptance rule through a real Knowledge vertical slice:

```text
AI generates candidate
        ↓
Generation Result remains AI-owned and non-canonical
        ↓
Creator explicitly reviews and accepts
        ↓
Knowledge canonical owner authorizes and validates
        ↓
DRAFT canonical Knowledge Resource is created
```

The AI Source-of-Truth rule remains:

```text
Generation Result is not canonical Knowledge merely because a model produced it.
```

The Generation path does not automatically mutate canonical Knowledge.

P7-M08 introduces the provider-neutral read contract:

```text
GenerationReader.findById
```

implemented by the existing:

```text
PrismaGenerationRepository
```

The explicit review/accept use case is:

```text
ReviewAndAcceptGenerationAsKnowledgeResource
```

It fails closed unless the Generation:

```text
exists

has status SUCCEEDED

has a persisted GenerationResult
```

The rejection codes are:

```text
GENERATION_NOT_FOUND

GENERATION_NOT_SUCCEEDED

GENERATION_RESULT_MISSING
```

Only then can the candidate reach the canonical-owner boundary:

```text
KnowledgeCanonicalAcceptanceOwner
```

The concrete Platform integration is:

```text
PlatformKnowledgeCanonicalAcceptance
```

which delegates to the existing public Knowledge owner API:

```text
CreateKnowledgeResourceAsActor
```

The AI / Creator Platform therefore does not write directly to:

```text
knowledge_resources
```

and does not bypass canonical Knowledge authorization or validation.

The reviewing Creator Actor is passed to the canonical owner as:

```text
actingActorId
```

The Knowledge owner remains responsible for:

```text
permission enforcement

Universe / Resource-type canonical validation

canonical Resource creation
```

Accepted Resources begin with the existing Knowledge lifecycle:

```text
DRAFT
```

They are not automatically published.

Validated real PostgreSQL behavior includes:

```text
successful AI Generation creates zero canonical Knowledge Resources by itself

explicit Creator review/accept creates one DRAFT canonical Knowledge Resource

unauthorized reviewing Actor is rejected by the Knowledge owner

unauthorized acceptance creates zero canonical Knowledge Resources

invalid AI candidate Resource type is rejected by canonical Knowledge validation

invalid candidate acceptance creates zero canonical Knowledge Resources
```

Unit behavior also proves:

```text
missing Generation never reaches the canonical owner

REQUESTED Generation never reaches the canonical owner

FAILED Generation never reaches the canonical owner

inconsistent SUCCEEDED Generation without a result never reaches the canonical owner
```

The implementation commit contains exactly:

```text
packages/platforms/ai-creator/src/generation-reader.ts
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/src/infrastructure.ts
packages/platforms/ai-creator/src/infrastructure/platform-knowledge-canonical-acceptance.ts
packages/platforms/ai-creator/src/prisma-generation-repository.ts
packages/platforms/ai-creator/src/review-and-accept-generation-as-knowledge-resource.ts
packages/platforms/ai-creator/test/canonical-acceptance.integration.spec.ts
packages/platforms/ai-creator/test/review-and-accept-generation-as-knowledge-resource.spec.ts
```

P7-M08 adds:

```text
no migration

no Prisma schema change

no package.json dependency change

no pnpm-lock.yaml change
```

Canonical migration count remains:

```text
18
```

P7-M08 intentionally proves one canonical owner — Knowledge — instead of introducing a speculative generic multi-owner workflow framework.

It does not introduce:

```text
P7-M09 AI Creator Assistance features

Media acceptance adapter

CMS acceptance adapter

persistent review/workflow engine

automatic canonical acceptance

automatic publication

AI-owned Knowledge mutation

AI Tool execution

RAG

embeddings or vector database

agents or MCP

queue/worker infrastructure

retry framework

NestJS generation/acceptance endpoint

Web review UI
```

P7-M09 — AI Creator Assistance is NEXT.

Possible P7-M09 features remain governed by the roadmap:

```text
draft description

suggest taxonomy

suggest relationships

summarize Source

create structured candidate data
```

Each accepted result must continue to pass canonical owner validation.

P7-M09 remains blocked until this roadmap-only P7-M08 closure commit itself completes exact green CI.

This closure changes governance documentation only.

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

## P7-M09 CLOSURE RECORD

P7-M09 — AI Creator Assistance is CLOSED.

The canonical implementation commit is:

```text
1d9e6f4eb4bc8367849e723b1a5fd10f56f2bb2d
feat(ai): implement creator assistance
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32375754167

CI NUMBER
#133

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 5s
(185 seconds)

VALIDATE JOB DURATION
3m 1s
(181 seconds)

BROWSER E2E DURATION
22s
(22 seconds)

BUILD DURATION
11s
(11 seconds)

ARCHITECTURE DURATION
9s
(9 seconds)
```

P7-M09 proves one real Creator-assistance vertical slice using the existing governed AI architecture:

```text
Creator request
        ↓
P7-M05 authorized published Knowledge context
        ↓
P7-M07 safe / permissioned GenerateText
        ↓
P7-M09 task-specific candidate validation
        ↓
typed Knowledge Resource candidate
        ↓
candidate remains non-canonical
        ↓
explicit P7-M08 Creator review / accept
        ↓
Knowledge owner authorization + canonical validation
        ↓
DRAFT Knowledge Resource
```

The P7-M09 assistance use case is:

```text
SuggestKnowledgeResourceCandidate
```

with task:

```text
ai.creator.knowledge-resource-candidate
```

The Provider is instructed to return exactly one:

```text
Knowledge Resource type as a namespaced key
```

and not return:

```text
prose

Markdown

JSON

code fences

multiple candidates
```

The task-specific output is validated with:

```text
parseNamespacedKey
```

before it becomes typed structured candidate data:

```text
KnowledgeResourceCandidate

{
  universeKey,
  resourceType
}
```

The P7-M09 failure controls include:

```text
GENERATION_NOT_SUCCEEDED

GENERATION_RESULT_MISSING

INVALID_CANDIDATE
```

Malformed Provider text may remain a persisted SUCCEEDED Generation for provenance/audit when text generation itself succeeded, but it does not become a valid P7-M09 candidate.

Validated real PostgreSQL behavior proves:

```text
authorized published Knowledge context reaches the Provider

the Creator assistance Generation is persisted with the task
ai.creator.knowledge-resource-candidate

a valid namespaced Resource-type result becomes typed candidate data

the typed candidate creates zero canonical Knowledge Resources by itself

explicit P7-M08 Creator acceptance creates one DRAFT canonical Knowledge Resource

malformed candidate output is rejected as INVALID_CANDIDATE

malformed candidate output creates zero canonical Knowledge Resources
```

The canonical Source-of-Truth rule therefore remains intact:

```text
AI assistance output is candidate data, not canonical Knowledge.
```

P7-M09 reuses the already-governed boundaries rather than introducing direct ownership bypasses:

```text
GenerateTextWithAuthorizedContext

GenerateText

ReviewAndAcceptGenerationAsKnowledgeResource

PlatformKnowledgeCanonicalAcceptance

CreateKnowledgeResourceAsActor
```

Canonical owner authorization and canonical owner validation remain mandatory before canonical mutation.

The implementation commit contains exactly:

```text
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/src/suggest-knowledge-resource-candidate.ts
packages/platforms/ai-creator/test/ai-creator-assistance.integration.spec.ts
packages/platforms/ai-creator/test/suggest-knowledge-resource-candidate.spec.ts
```

P7-M09 adds:

```text
no migration

no Prisma schema change

no package.json dependency change

no pnpm-lock.yaml change
```

Canonical migration count remains:

```text
18
```

P7-M09 intentionally implements only the minimum real structured-candidate assistance slice.

Other roadmap examples remain possible future Creator-assistance work rather than prerequisites for closure:

```text
draft description

suggest taxonomy

suggest relationships

summarize Source
```

P7-M09 does not introduce:

```text
P7-M10 AI Tool execution

Search Knowledge Tool

Fetch Resource Tool

generic Tool registry

autonomous Agent framework

RAG

embeddings or vector database

taxonomy mutation

relationship mutation

Source-model expansion

generic workflow engine

automatic canonical acceptance

automatic publication

AI-owned Knowledge mutation

queue / worker / retry infrastructure

usage / token / cost accounting

NestJS assistance endpoint

Web assistance UI
```

P7-M10 — AI Tool Baseline is NEXT.

Its roadmap scope remains:

```text
Introduce typed Tool execution only when needed.

Potential:
Search Knowledge;
Fetch Resource.

Do not build autonomous Agent framework.
```

P7-M10 remains blocked until this roadmap-only P7-M09 closure commit itself completes exact green CI.

This closure changes governance documentation only.

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

## P7-M10 CLOSURE RECORD

P7-M10 — AI Tool Baseline is CLOSED.

The canonical implementation commit is:

```text
efa881a5572a68ba1c7833b89fedc3c7125b9580
feat(ai): implement search knowledge tool
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32391739498

CI NUMBER
#135

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 14s
(194 seconds)

VALIDATE JOB DURATION
3m 11s
(191 seconds)

BROWSER E2E DURATION
29s
(29 seconds)

BUILD DURATION
11s
(11 seconds)

ARCHITECTURE DURATION
9s
(9 seconds)
```

P7-M10 proves the minimum real typed Tool vertical slice:

```text
Application code explicitly invokes
SearchKnowledgeTool
        ↓
typed bounded input
        ↓
AuthorizedAiContextPort
        ↓
actor-bound + Universe-scoped
        ↓
Discovery SearchContract
        ↓
PUBLISHED Knowledge only
        ↓
public Knowledge re-verification
        ↓
typed READ_ONLY Tool result
```

The reusable Tool contract introduced by P7-M10 is deliberately small:

```text
AiTool<TName, TInput, TResult>

readonly name

execute(input): Promise<TResult>
```

The first concrete Tool is:

```text
SearchKnowledgeTool

name
ai.search-knowledge

effect
READ_ONLY
```

Its input remains explicit and typed:

```text
actorId

universeKey

query

resourceTypes?

limit?
```

The Search Knowledge Tool bounds are:

```text
query
nonblank
no NUL
maximum 500 characters

resourceTypes
maximum 10
no duplicates

limit
integer 1 through 10
default 5
```

The Tool result is typed as:

```text
toolName

effect

items[]
    resourceId
    resourceType
    universeKey
```

The Tool fails closed on invalid input and invalid authorized results with:

```text
INVALID_INPUT

INVALID_AUTHORIZED_RESULT
```

P7-M10 deliberately reuses existing governed read boundaries:

```text
SearchKnowledgeTool
        ↓
AuthorizedAiContextPort
        ↓
PlatformAuthorizedAiContext
        ↓
UserProfileReader for requesting Actor
        ↓
Universe-scoped SearchContract
        ↓
PublicKnowledgeResourceReader
        ↓
PUBLISHED same-Universe Knowledge
```

This preserves the existing P7-M05 authorization behavior rather than introducing a direct database/search bypass.

Validated real PostgreSQL behavior proves:

```text
the requesting Actor must resolve to its self User

Search Knowledge is Universe-scoped

only PUBLISHED Knowledge reaches the Tool result

DRAFT Knowledge is excluded

other-Universe Knowledge is excluded

resource-type filtering and the explicit limit are honored

the Tool creates no Generation for the executing Actor

missing-self-User execution fails closed before exposing Knowledge results
```

P7-M07 Provider/model Tool access remains unchanged:

```text
AI_TEXT_TOOL_ACCESS
DISABLED
```

Therefore P7-M10 does not permit the model or Provider to decide when to invoke Tools.

Tool execution is explicit and deterministic application behavior.

The implementation commit contains exactly:

```text
packages/platforms/ai-creator/src/ai-tool.ts
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/src/search-knowledge-tool.ts
packages/platforms/ai-creator/test/search-knowledge-tool.integration.spec.ts
packages/platforms/ai-creator/test/search-knowledge-tool.spec.ts
```

P7-M10 adds:

```text
no migration

no Prisma schema change

no package.json dependency change

no pnpm-lock.yaml change
```

Canonical migration count remains:

```text
18
```

P7-M10 intentionally does not introduce:

```text
Fetch Resource Tool

OpenAI function/tool calling

model-directed Tool execution

dynamic Tool registry

Tool router

planner or orchestration loop

autonomous Agent framework

RAG

embeddings or vector database

write-capable Tools

Generation creation from SearchKnowledgeTool

canonical Knowledge mutation

queue / worker / retry infrastructure

P7-M11 usage / latency / failure / cost tracking

NestJS Tool endpoint

Web Tool UI
```

The Phase 7 Queue Gate is evaluated for this milestone as:

```text
NOT TRIGGERED
```

P7-M10 introduces a synchronous bounded read-only Tool and does not create a new long-running Generation or reliable-retry requirement.

Therefore P7-M10 does not introduce:

```text
Queue Foundation

apps/worker
```

Queue Selection likewise requires no implementation decision here, and Kafka remains deferred.

P7-M11 — AI Usage Tracking is NEXT.

Its roadmap scope remains:

```text
Track at least enough operational data for:

usage;

latency;

failure;

cost estimation.
```

P7-M11 remains blocked until this roadmap-only P7-M10 closure commit itself completes exact green CI.

This closure changes governance documentation only.

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

## P7-M11 CLOSURE RECORD

P7-M11 — AI Usage Tracking is CLOSED.

The canonical implementation commit is:

```text
a75d33b71192554cd73f54af61afb66e6b8d624e
feat(ai): implement usage tracking
```

Its exact successful GitHub Actions implementation CI is:

```text
WORKFLOW
CI

RUN ID
32395969304

CI NUMBER
#137

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success

WORKFLOW DURATION
3m 2s
(182 seconds)

VALIDATE JOB DURATION
2m 57s
(177 seconds)

BROWSER E2E DURATION
18s
(18 seconds)

BUILD DURATION
10s
(10 seconds)

ARCHITECTURE DURATION
9s
(9 seconds)
```

P7-M11 proves the minimum real AI usage-tracking vertical slice:

```text
GenerateText
        ↓
Provider call
        ↓
Provider latency measured
        ↓
provider-neutral token usage when reported
        ↓
runtime validation
        ↓
terminal Generation transition
        ↓
GenerationUsage persisted atomically
```

The Generation-owned usage record is optional one-to-one:

```text
GenerationUsage

providerLatencyMs

inputTokens?

outputTokens?

totalTokens?

failureKind?

createdAt
```

Successful Provider usage can persist:

```text
inputTokens

outputTokens

totalTokens
```

when the Provider reports those values.

P7-M11 records bounded terminal failure classification only:

```text
PROVIDER_ERROR

INVALID_OUTPUT
```

Raw Provider error messages are not persisted as Generation usage data.

Provider latency is measured specifically around the Provider generation call.

The latency value is bounded to the PostgreSQL integer range used by the canonical schema.

Provider token metadata is validated as:

```text
safe integer

non-negative

maximum
2147483647
```

The database independently enforces:

```text
non-negative provider latency

all-or-none token fields

non-negative token fields

supported failure-kind values
```

OpenAI Responses usage metadata is translated only inside the existing Provider adapter:

```text
input_tokens
        ↓
inputTokens

output_tokens
        ↓
outputTokens

total_tokens
        ↓
totalTokens
```

No OpenAI-specific response type leaks into the provider-neutral AI Creator contract.

P7-M11 keeps enough durable inputs for later cost estimation:

```text
provider

actual model

inputTokens

outputTokens
```

P7-M11 deliberately does not persist a currency-denominated estimated cost.

Provider/model pricing is external and time-varying, so a future cost estimator can apply the appropriate rate table to these stable historical usage inputs.

The implementation migration is:

```text
20260820222000_ai_generation_usage
```

Canonical migration count becomes:

```text
19
```

The implementation commit contains exactly:

```text
packages/foundations/database/prisma/migrations/20260820222000_ai_generation_usage/migration.sql
packages/foundations/database/prisma/schema.prisma
packages/platforms/ai-creator/src/ai-generation-safety.ts
packages/platforms/ai-creator/src/ai-provider-port.ts
packages/platforms/ai-creator/src/generate-text.ts
packages/platforms/ai-creator/src/generation-writer.ts
packages/platforms/ai-creator/src/generation.ts
packages/platforms/ai-creator/src/index.ts
packages/platforms/ai-creator/src/infrastructure/openai/openai-provider-adapter.ts
packages/platforms/ai-creator/src/prisma-generation-repository.ts
packages/platforms/ai-creator/test/ai-generation-safety.spec.ts
packages/platforms/ai-creator/test/ai-provider-port.spec.ts
packages/platforms/ai-creator/test/ai-usage-tracking.integration.spec.ts
packages/platforms/ai-creator/test/openai-provider-adapter.spec.ts
```

P7-M11 intentionally does not introduce:

```text
currency pricing table

billing or invoicing

cost ledger

budget enforcement

analytics warehouse

dashboard infrastructure

generic observability platform

queue / worker / retry infrastructure

second AI Provider

model-directed Tool execution

autonomous Agent framework

RAG

embeddings or vector database

NestJS usage endpoint

Web usage UI
```

The existing Provider/model Tool-access restriction remains:

```text
AI_TEXT_TOOL_ACCESS
DISABLED
```

The Phase 7 Queue Gate remains not triggered by P7-M11.

P7-M11 adds bounded synchronous persistence to the existing Generation terminal transition and does not introduce a long-running Generation or reliable-retry requirement.

P7-M11 is the final numbered Phase 7 implementation milestone, but Phase 7 is NOT yet closed.

The next canonical governance item is:

```text
Phase 7 Multi-Provider Gate
NEXT
```

Its roadmap rule remains:

```text
Do not add a second Provider until there is evidence such as:

missing modality;

availability requirement;

cost benefit;

quality requirement;

regional requirement.
```

No second Provider is introduced by this closure.

The later Phase 7 Semantic Search Gate, Devotional AI Proof, Anime AI Proof, and Phase 7 Closure Criteria remain unchanged and not closed.

The Phase 7 Multi-Provider Gate remains blocked until this roadmap-only P7-M11 closure commit itself completes exact green CI.

This closure changes governance documentation only.

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

## PHASE 7 MULTI-PROVIDER GATE DECISION RECORD

The Phase 7 Multi-Provider Gate is CLOSED for the current delivery sequence.

Decision:

```text
SECOND PROVIDER
DEFERRED

GATE TRIGGER
NOT TRIGGERED
```

The gate was evaluated only after the exact P7-M11 roadmap-closure baseline:

```text
06c1e124597d599706765cb69b5ab6c2e0e49ec1
docs(roadmap): close P7-M11 AI usage tracking
```

and its exact successful GitHub Actions closure CI:

```text
WORKFLOW
CI

RUN ID
32397908497

CI NUMBER
#138

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success
```

The roadmap requires evidence before adding a second Provider.

The evidence review is:

```text
missing modality
NOT PROVEN

availability requirement
NOT PROVEN

cost benefit
NOT PROVEN

quality requirement
NOT PROVEN

regional requirement
NOT PROVEN
```

Current repository evidence shows:

```text
AI Creator Provider contract
provider-neutral

implemented Provider adapter
OpenAI only

implemented generation modality
text

Provider/model Tool access
DISABLED
```

P7-M11 now persists durable usage inputs:

```text
provider

actual model

inputTokens

outputTokens

totalTokens
```

but those inputs do not themselves prove a cross-Provider cost benefit.

No accepted cross-Provider pricing comparison, availability/SLA requirement,
quality benchmark, missing-modality requirement, or regional/data-residency
requirement exists in the canonical delivery evidence.

Therefore adding a second Provider now would be hypothetical architecture.

The existing owned `AiProviderPort` keeps the future extension seam available,
so deferral does not require Provider-specific code to spread into application
or domain layers.

This gate deliberately introduces:

```text
no second Provider adapter

no Provider router

no automatic Provider failover

no Provider selection policy

no pricing table

no new package dependency

no migration

no queue / worker / retry infrastructure
```

Canonical migration count remains:

```text
19
```

Phase 7 remains ACTIVE.

The next canonical governance item is:

```text
Phase 7 Semantic Search Gate
NEXT
```

That gate must independently decide whether embeddings/semantic Search have a
real use case. It must not infer that semantic Search is required merely because
the Multi-Provider Gate was deferred.

### Phase 7 final completion tag rule

The Phase 7 completion tag is deliberately NOT created by this gate.

After all remaining Phase 7 gates/proofs and Phase 7 Closure Criteria are
formally closed, the final Phase 7 closure commit must first complete its own
exact green `push/main` CI.

Only then create and push:

```text
phase-7-complete
```

on that exact verified final Phase 7 closure commit.

Phase 8 must not be activated until the Phase 7 completion tag is independently
verified.

---

# 187. Phase 7 Semantic Search Gate

AI phase may trigger embeddings/semantic Search evaluation.

Introduce them only if a real use case proves value.

---

## PHASE 7 SEMANTIC SEARCH GATE DECISION RECORD

The Phase 7 Semantic Search Gate is CLOSED for the current delivery sequence.

Decision:

```text
SEMANTIC / VECTOR SEARCH
DEFERRED

GATE TRIGGER
NOT TRIGGERED
```

The gate was evaluated only after the exact Multi-Provider Gate closure baseline:

```text
36425717e54a71bc1f48d7288d9699394d41b9de
docs(roadmap): close Phase 7 multi-provider gate
```

and its exact successful GitHub Actions closure CI:

```text
WORKFLOW
CI

RUN ID
32447656946

CI NUMBER
#139

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success
```

The canonical Phase 7 rule is:

```text
AI phase may trigger embeddings/semantic Search evaluation.

Introduce them only if a real use case proves value.
```

The earlier Phase 6 Semantic Search Gate also remains an important constraint:

```text
Semantic/vector Search remains deferred until product requirements demonstrate value.
```

Current shipped Discovery remains:

```text
SearchContract
        ↓
PrismaKnowledgeSearch
        ↓
PostgreSQL
        ↓
lexical Resource Type matching
        ↓
deterministic ranking
```

Current authorized AI context reuses that owned Discovery seam:

```text
PlatformAuthorizedAiContext
        ↓
SearchContract
        ↓
Universe-scoped Discovery
        ↓
PUBLISHED Knowledge re-verification
```

The P7-M10 Search Knowledge Tool likewise remains:

```text
SearchKnowledgeTool
        ↓
AuthorizedAiContextPort
        ↓
SearchContract
```

No current accepted Phase 7 capability requires semantic/vector retrieval to work.

The evidence review is:

```text
real product use case proving semantic value
NOT PROVEN

current Search result-quality failure requiring semantic retrieval
NOT PROVEN

embedding model requirement
NOT PROVEN

language-analysis requirement
NOT PROVEN

scale requirement requiring vector infrastructure
NOT PROVEN

vector schema / index
ABSENT

embedding Provider surface
ABSENT

semantic/vector migration
ABSENT
```

This does not declare lexical Search permanently sufficient.

The narrower decision is that no accepted evidence currently proves
semantic/vector Search creates enough product value to justify its infrastructure.

The existing Discovery-owned `SearchContract` remains the future extension seam.
If measured product evidence later proves lexical Search inadequate, semantic
retrieval can be evaluated behind that boundary without leaking vector-provider
details into AI Creator or Universe code.

This gate deliberately introduces:

```text
no embedding model

no embedding Provider API

no embedding generation pipeline

no vector column

no vector index

no pgvector extension

no semantic score contract

no hybrid ranking pipeline

no dedicated Search engine

no embedding queue / worker

no new package dependency

no migration
```

Canonical migration count remains:

```text
19
```

Phase 7 remains ACTIVE.

The next canonical Phase 7 item is:

```text
Phase 7 Devotional AI Proof
NEXT
```

### Phase 7 final completion tag rule

The Phase 7 completion tag is deliberately NOT created by this gate.

After the Devotional AI Proof, Anime AI Proof, and Phase 7 Closure Criteria are
formally resolved, the final Phase 7 closure commit must first complete its own
exact green `push/main` CI.

Only then create and push:

```text
phase-7-complete
```

on that exact verified final Phase 7 closure commit.

Phase 8 must not be activated until the Phase 7 completion tag is independently
verified.

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

## PHASE 7 DEVOTIONAL AI PROOF CLOSURE RECORD

The Phase 7 Devotional AI Proof is CLOSED.

Implementation baseline:

```text
67300e60d47c38c6d31b7d4ab0a2f93b955be274
test(ai): add devotional AI proof
```

Parent:

```text
e68d21b6179f00f4087a18e7902b89d6b9ccc708
docs(roadmap): close Phase 7 semantic search gate
```

Implementation scope:

```text
packages/platforms/ai-creator/test/devotional-ai-proof.integration.spec.ts
```

Committed proof blob:

```text
cdda0767144dae05e67dbc1b8d70743e1fa37c0d
```

The exact implementation push CI was verified before this roadmap transition:

```text
WORKFLOW
CI

RUN ID
32451526784

CI NUMBER
#141

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success
```

The controlled PostgreSQL proof demonstrates:

```text
Devotional Creator
        ↓
provider-neutral AI Creator Assistance
        ↓
universe.devotional
        ↓
authorized PUBLISHED devotional.scripture
        ↓
Generation
        ├── provenance
        └── usage
        ↓
NO canonical Knowledge mutation
        ↓
explicit Creator review
        ↓
Knowledge-owned acceptance
        ↓
devotional.temple
DRAFT
```

The proof deliberately creates both a PUBLISHED and a DRAFT
`devotional.scripture` source and verifies that only the PUBLISHED source reaches
authorized AI context/provenance.

The model-facing boundary remains provider-neutral:

```text
AiProviderPort

provider.devotional-proof

model.devotional-proof
```

No Devotional package or AI Creator production source contains Provider-specific
Devotional behavior.

The generated candidate does not mutate canonical Knowledge before review.

Only explicit `ReviewAndAcceptGenerationAsKnowledgeResource` acceptance delegates
canonical creation to the Knowledge owner, and the resulting Resource begins in
the canonical Knowledge `DRAFT` lifecycle.

Operational Generation evidence is also retained:

```text
inputTokens
24

outputTokens
3

totalTokens
27

failureKind
null
```

The Devotional proof therefore satisfies the Phase 7 requirement that Devotional
AI output has appropriate provenance, review, and canonical-owner validation and
does not become canonical merely because a model produced it.

This proof intentionally introduces:

```text
no Devotional-specific Provider adapter

no OpenAI-specific Devotional code

no new Generation model

no new canonical owner

no auto-publish behavior

no source/citation subsystem expansion

no semantic/vector Search

no second Provider

no queue / worker / retry framework

no API endpoint

no Web UI

no schema change

no migration

no package or lockfile change
```

Canonical migration count remains:

```text
19
```

Phase 7 remains ACTIVE.

The next canonical Phase 7 item is:

```text
Phase 7 Anime AI Proof
NEXT
```

The Anime proof must independently demonstrate reuse of the same AI Creator
boundaries without Provider-specific Anime code. It must not be treated as
satisfied merely because the Devotional proof passed.

### Phase 7 completion tag rule

The Phase 7 completion tag remains deliberately absent.

After the Anime AI Proof and Phase 7 Closure Criteria are formally resolved, the
final Phase 7 closure commit must first receive its own exact green `push/main`
CI. Only then create and push:

```text
phase-7-complete
```

on that exact final verified closure commit.

Phase 8 must not become active before that tag is independently verified.

---

# 189. Phase 7 Anime AI Proof

Potential controlled use:

```text
character summary draft;

series metadata suggestion.
```

---

## PHASE 7 ANIME AI PROOF CLOSURE RECORD

The Phase 7 Anime AI Proof is CLOSED.

Implementation baseline:

```text
82a19030e1a0eba61056e8fc2f3d32860f949a80
test(ai): add anime AI proof
```

Parent:

```text
f6abb961ce3d39c7761938fd3f05578010c00729
docs(roadmap): close Phase 7 devotional AI proof
```

Implementation scope:

```text
packages/platforms/ai-creator/test/anime-ai-proof.integration.spec.ts
```

Committed proof blob:

```text
29f131a6777dd1712bc29730b8b9cdbc8a8b7085
```

The exact implementation push CI was verified before this roadmap transition:

```text
WORKFLOW
CI

RUN ID
32454470036

CI NUMBER
#143

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success
```

The controlled PostgreSQL proof demonstrates:

```text
Anime Creator
        ↓
provider-neutral GenerateTextWithAuthorizedContext
        ↓
universe.anime
        ↓
authorized PUBLISHED anime.series
        ↓
non-canonical character-summary draft
        ├── provenance
        └── usage
        ↓
NO canonical Knowledge mutation
```

The proof deliberately creates both a PUBLISHED and a DRAFT `anime.series` source
and verifies that only the PUBLISHED source reaches authorized AI context and
Generation provenance.

The model-facing boundary remains provider-neutral:

```text
AiProviderPort

provider.anime-proof

model.anime-proof
```

The Anime Universe package does not depend on AI Creator or any Provider SDK.

The generated character-summary draft remains canonical to AI / Creator state
only. The proof verifies the canonical `anime.character` Knowledge count is
unchanged before and after Generation.

Operational Generation evidence is retained:

```text
inputTokens
30

outputTokens
9

totalTokens
39

failureKind
null
```

Together with the already closed Devotional proof, this demonstrates reuse of the
same AI Creator platform across two distinct Universes without Provider-specific
Universe code.

This proof intentionally introduces:

```text
no Anime-specific Provider adapter

no OpenAI-specific Anime code

no Anime package dependency on AI Creator

no new Generation model

no canonical Knowledge mutation

no semantic/vector Search

no second Provider

no queue / worker / retry framework

no API endpoint

no Web UI

no schema change

no migration

no package or lockfile change
```

Canonical migration count remains:

```text
19
```

Phase 7 remains ACTIVE.

The next canonical Phase 7 item is:

```text
Phase 7 Closure Criteria
NEXT
```

The closure-criteria evaluation must independently verify every criterion against
the repository and accepted Phase 7 evidence. Anime closure alone does not close
Phase 7.

### Phase 7 completion tag rule

The Phase 7 completion tag remains deliberately absent.

After the Phase 7 Closure Criteria are formally evaluated and satisfied, the
final Phase 7 closure commit must first receive its own exact green `push/main`
CI. Only then create and push:

```text
phase-7-complete
```

on that exact final verified Phase 7 closure commit.

Phase 8 must not become active before that tag is independently verified.

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

## PHASE 7 CLOSURE CRITERIA EVALUATION RECORD

The Phase 7 Closure Criteria evaluation is CLOSED.

Decision:

```text
9 / 9
SATISFIED

PHASE 7
COMPLETE

PHASE 8
BLOCKED PENDING phase-7-complete TAG VERIFICATION
```

The evaluation was performed only after the exact Anime AI Proof closure baseline:

```text
f84d74974497fa50501d8a3256bc5a6c2ae8587d
docs(roadmap): close Phase 7 anime AI proof
```

Parent:

```text
82a19030e1a0eba61056e8fc2f3d32860f949a80
test(ai): add anime AI proof
```

and its exact successful GitHub Actions closure CI:

```text
WORKFLOW
CI

RUN ID
32455973328

CI NUMBER
#144

ATTEMPT
1

EVENT
push

BRANCH
main

STATUS
completed

CONCLUSION
success
```

The canonical Phase 7 closure criteria are:

```text
1. AI Provider is behind owned Adapter

2. one Generation capability works

3. Generation state is canonical to AI / Creator

4. AI context respects authorization

5. provenance exists

6. safety baseline exists

7. AI output requires owner acceptance before canonical mutation

8. Devotional and Anime can consume AI without Provider-specific code

9. Provider SDK is isolated
```

Evaluation:

```text
1. AI Provider is behind owned Adapter
SATISFIED

AiProviderPort is the provider-neutral owned boundary.
OpenAiProviderAdapter implements that boundary under AI Creator infrastructure.
Provider request/response translation remains inside the adapter.
```

```text
2. one Generation capability works
SATISFIED

GenerateText executes provider-neutral text Generation.
REQUESTED → SUCCEEDED / FAILED state is durable.
Text-generation, Devotional, and Anime PostgreSQL integration proofs exercise the
working capability.
```

```text
3. Generation state is canonical to AI / Creator
SATISFIED

Generation, GenerationRequest, GenerationResult, GenerationProvenance, and
GenerationUsage remain AI-owned domain state.

Persistence remains under:
ai_generations
ai_generation_requests
ai_generation_results
ai_generation_provenance
ai_generation_usage

Knowledge does not own model Generation state.
```

```text
4. AI context respects authorization
SATISFIED

PlatformAuthorizedAiContext resolves the requesting User, constrains Discovery
to the requested Universe, and re-verifies returned Knowledge through the public
PUBLISHED Knowledge reader before context can reach Generation.

Devotional and Anime proofs independently confirm DRAFT Knowledge is excluded.
```

```text
5. provenance exists
SATISFIED

GenerationProvenance stores the bounded task and source context.
Authorized Knowledge Resource IDs, Resource Types, and Universe Keys are persisted
with Generation provenance.
```

```text
6. safety baseline exists
SATISFIED

The baseline enforces:
ai.generate permission
bounded input / instructions / output / model / task
sensitive credential-like data rejection
bounded same-Universe source context
Provider output validation
bounded usage metadata
tool access DISABLED
```

```text
7. AI output requires owner acceptance before canonical mutation
SATISFIED

Generation output remains non-canonical.
ReviewAndAcceptGenerationAsKnowledgeResource accepts only successful Generation
results and delegates canonical mutation to the Knowledge owner.

The Devotional proof verifies no devotional.temple exists from Generation alone;
only explicit reviewed Knowledge-owner acceptance creates the canonical Resource,
which starts in DRAFT.
```

```text
8. Devotional and Anime can consume AI without Provider-specific code
SATISFIED

Devotional:
PUBLISHED devotional.scripture
→ provider-neutral AI Creator assistance
→ provenance / usage
→ explicit Knowledge-owner acceptance

Anime:
PUBLISHED anime.series
→ provider-neutral authorized text Generation
→ non-canonical character-summary draft
→ provenance / usage
→ no Knowledge mutation

Neither Universe package depends on OpenAI or owns Provider-specific AI wiring.
```

```text
9. Provider SDK is isolated
SATISFIED

The only direct TypeScript import of the OpenAI SDK is:

packages/platforms/ai-creator/src/infrastructure/openai/openai-provider-adapter.ts

The OpenAI package dependency is owned by:

packages/platforms/ai-creator/package.json

Provider-neutral domain/application files and Universe packages do not import the
SDK directly.
```

The previously reviewed Phase 7 expansion gates remain intentionally deferred:

```text
Multi-Provider Gate
SECOND PROVIDER DEFERRED
no evidence trigger

Semantic Search Gate
SEMANTIC / VECTOR SEARCH DEFERRED
no proven real use case
```

Those decisions do not block Phase 7 closure because both gates were explicitly
evaluated against evidence and the accepted Phase 7 capabilities do not require
the deferred infrastructure.

Canonical migration count remains:

```text
19
```

This final closure deliberately adds no production capability.

It introduces:

```text
no second Provider

no Provider router / failover policy

no embeddings / vector Search

no agent loop

no model-directed tool calling

no queue / worker platform

no billing platform

no new API endpoint

no new Web UI

no schema change

no migration

no dependency change
```

Phase 7 is therefore COMPLETE.

### Mandatory completion-tag postcondition

The completion tag is NOT created by this validation runner or by this roadmap
candidate.

The final Phase 7 closure commit produced from this candidate must first receive
its own exact successful:

```text
push/main
CI
```

Only after that exact final closure SHA is independently verified green may the
following annotated tag be created and pushed on that exact SHA:

```text
phase-7-complete
```

Phase 8 remains BLOCKED until the remote `phase-7-complete` tag is independently
verified to resolve to that exact final Phase 7 closure commit.

The next governance action after tag verification is a separate Phase 8
activation decision. This final Phase 7 closure does not activate Phase 8.

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

Phase 4 has no remaining delivery action. The next major delivery phase is:

```text
Phase 5 — Media Platform
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

P4-M08 — Knowledge Events
DEFERRED — no real production Event consumer

Demand-review evidence
Knowledge lifecycle transitions implemented
Production Event publisher NONE
Production Event subscriber NONE
Concrete Knowledge Event Contract NONE
Events Kernel package NOT MATERIALIZED
Event bus NONE
Event/outbox persistence NONE
apps/worker NOT MATERIALIZED
Real producer/consumer Event boundary NONE
Prisma schema change NONE
Database migration NONE
Canonical migrations remain 12
Knowledge source change NONE
API/Web change NONE

P4-M09 — Sources
DEFERRED — no implemented Devotional source-backed Resource

Demand-review evidence
Implemented Devotional Resource types 1
DeityResource only
DeityResource domain-specific field name
ScriptureResource NOT MATERIALIZED
Source-backed Devotional Resource NONE
Real Source traceability requirement NONE
Source Contract/model NONE
Source persistence NONE
Prisma schema change NONE
Database migration NONE
Canonical migrations remain 12
Devotional source change NONE
Knowledge source change NONE

P4-M10 — Citations
DEFERRED — no implemented Devotional Resource requires Citation semantics distinct from Source

Demand-review evidence
Implemented Devotional Resource types 1
DeityResource only
DeityResource domain-specific field name
Source-backed Devotional Resource NONE
Citation field/association NONE
Structured locator semantics NONE
Citation Contract/model NONE
Citation persistence NONE
Prisma schema change NONE
Database migration NONE
Canonical migrations remain 12
Devotional source change NONE
Knowledge source change NONE

P4-M11 — Temporal Baseline
DEFERRED — no implemented Devotional Resource requires reusable date/date-range semantics

Demand-review evidence
Implemented Devotional Resource types 1
DeityResource only
DeityResource domain-specific field name
Real domain temporal consumer NONE
createdAt/updatedAt technical timestamps only
Shared DateRange/Temporal abstraction NONE
Knowledge domain temporal persistence NONE
Prisma schema change NONE
Database migration NONE
Canonical migrations remain 12
Devotional source change NONE
Knowledge source change NONE

P4-M12 — Devotional Universe v1
CLOSED

Implementation checkpoint
1b7fab5bcdbe39024bef686af3c636a738042623
feat(devotional): establish universe v1

Remote CI
31926097194 completed / success

Universe key
universe.devotional

Resource Types
devotional.deity
devotional.scripture
devotional.temple

Typed Knowledge specializations
DeityResource
ScriptureResource
TempleResource

Devotional unit validation
2 test files / 7 tests passed

Architecture validation
351 modules / 886 dependencies / 0 violations

Generic shared UniverseDefinition framework
NOT CREATED

Deferred Taxonomy / Relationships / Source / Citation / Temporal
NOT ACTIVATED

Prisma schema change
NONE

Database migration
NONE

Canonical migrations remain 12

P4-M13 — Anime Reuse-Test Universe v1
CLOSED

Implementation checkpoint
c90b4a99e1d66319e54278afbf2017a6c63af6b8
feat(anime): establish reuse-test universe v1

Remote CI
31927100260 completed / success

Primary product/domain priority
Devotional

Anime role
bounded architecture reuse test

Anime Universe key
universe.anime

Anime Resource Types
anime.character
anime.series

Typed Knowledge specializations
CharacterResource
SeriesResource

Anime unit validation
1 test file / 4 tests passed

Architecture validation
356 modules / 896 dependencies / 0 violations

Devotional concrete definition pattern
REUSED

Generic shared UniverseDefinition / Registry
NOT PROMOTED

Genre / classification
NOT MATERIALIZED

Character APPEARS_IN Series
NOT MATERIALIZED

Prisma schema change
NONE

Database migration
NONE

Canonical migrations remain 12

P4-M14 — Basic Public Knowledge API
CLOSED

Implementation checkpoint
c7f21161e896cd3daa838aa14fca71907313b7a8
feat(knowledge): expose public read API

Remote CI
31928964366 completed / success

Primary product/domain focus
Devotional

Public endpoints
GET /knowledge/resources/:id
GET /knowledge/resources

Visibility
PUBLISHED only

DRAFT / ARCHIVED
HIDDEN

Query scope
universeKey required
resourceType optional
default limit 20
max limit 50

Public response
id / universeKey / resourceType / createdAt / updatedAt
lifecycle not exposed

Knowledge validation
5 test files / 37 tests passed

Public API integration
1 test file / 10 tests passed

Architecture validation
367 modules / 943 dependencies / 0 violations

Named-Universe production branches
NONE

Creator write endpoints
NONE

Prisma schema change
NONE

Database migration
NONE

Canonical migrations remain 12

P4-M15 — Basic Creator Knowledge API
CLOSED

Implementation checkpoint
888523cbf7d35e8dc4f5751d650f81384da8a6df
feat(knowledge): expose creator write API

Remote CI
31930221502 completed / success

Primary product/domain focus
Devotional

Protected endpoints
POST /knowledge/resources
PATCH /knowledge/resources/:id

Session
REQUIRED

Permissions
knowledge.resource.create
knowledge.resource.update

Acting Actor
derived only from validated Session

Created Resource lifecycle
DRAFT

Created Devotional DRAFT public visibility
HIDDEN

Canonical validation
after authorization

Controlled invalid canonical input
knowledge.resource.invalid_input

Downstream TypeErrors
not reclassified as client validation

Knowledge validation
5 test files / 41 tests passed

Creator API integration
1 test file / 10 tests passed

Architecture validation
370 modules / 968 dependencies / 0 violations

Creator UI
NONE

Publish/archive HTTP
NONE

Named-Universe production branches
NONE

Prisma schema change
NONE

Database migration
NONE

Canonical migrations remain 12

P4-M16 — Web Knowledge Experience
CLOSED

Implementation checkpoint
b61374d744c8accf9da8300c5f196644bf9e1dc9
feat(web): add knowledge experience

Remote CI
31933927697 completed / success

Primary product/domain focus
Devotional

Web route
/knowledge

Devotional view
PRIMARY / FIRST

Anime view
SECONDARY / REUSE-TEST

Shared public Knowledge contract
GET /knowledge/resources?universeKey=...

Direct Platform/Universe package imports
NONE

Relationships Web activation
NONE — deferred

Classification/Taxonomy Web activation
NONE — deferred

Creator/write/lifecycle Web controls
NONE

Web validation
6 unit test files / 23 tests passed

Playwright
3 tests passed

Architecture validation
375 modules / 978 dependencies / 0 violations

Prisma schema change
NONE

Database migration
NONE

Canonical migrations remain 12

Phase 4
COMPLETE — Closure Criteria 15 / 15 SATISFIED

Phase 4 Proof Generality Review
CLOSED

Devotional genuinely required
canonical Resource model
typed Resource extension
shared persistence / CRUD
owner-side mutation authorization
Knowledge lifecycle
published-only public read/list

Anime shared-core modification required
NONE

Duplicate Universe infrastructure
NONE

Generic Metadata escape hatch
NOT INTRODUCED

Named-Universe Platform/Kernel switches
NONE FOUND

History baseline expectation
fewer shared-core changes expected
deferred semantic capabilities may still activate

Phase 4
ACTIVE

At review closure
Metadata Decision Gate followed next

Metadata Decision Gate
CLOSED

Metadata Kernel
DEFERRED

Real implemented Metadata consumer
NONE

Stable domain properties
remain typed in Universe Resource contracts

Generic Knowledge Metadata bag
NONE

Prisma Knowledge Metadata field
NONE

Metadata Kernel/Platform package
NONE

Metadata registry/persistence/query/version mechanics
NONE

Implementation change
NONE

Schema change
NONE

Migration
NONE

Canonical migrations remain 12

Future activation
real extensible-property consumer required

Phase 4
ACTIVE

At Metadata gate closure
Workflow Decision Gate followed next

Workflow Decision Gate
CLOSED

Workflow Kernel
DEFERRED

Knowledge lifecycle
DRAFT -> PUBLISHED -> ARCHIVED

Direct lifecycle operations
publish / archive

Knowledge permissions
create / update / publish / archive

Submit-for-review
NONE

Reviewer assignment
NONE

Approval / rejection
NONE

Workflow Definition
NONE

Workflow Instance
NONE

Workflow/approval persistence
NONE

Workflow package
NONE

Implementation change
NONE

Schema change
NONE

Migration
NONE

Canonical migrations remain 12

Future activation
real editorial process beyond direct lifecycle transitions required

Phase 4
ACTIVE

At Workflow gate closure
Policy Decision Gate followed next

Policy Decision Gate
CLOSED

Policy Kernel
DEFERRED

Knowledge stable lifecycle rules
owner-local

Knowledge public visibility rule
PUBLISHED only

Knowledge semantic action permissions
create / update / publish / archive

Authorization evaluation
Identity & Access-owned

Devotional policy configuration
NONE

Anime policy configuration
NONE

Cross-context configurable Policy consumer
NONE

Policy Definition / Registry / Evaluator
NONE

Policy package
NONE

Policy persistence
NONE

Implementation change
NONE

Schema change
NONE

Migration
NONE

Canonical migrations remain 12

Future activation
real configurable cross-context rule consumer required

Phase 4
COMPLETE

Exit outcome
MULTI-UNIVERSE KNOWLEDGE PLATFORM

Closure criteria
15 / 15 SATISFIED

Next
Phase 5 — Media Platform

Phase 4 Closure Criteria Evaluation
CLOSED

Criteria
15 / 15 SATISFIED

Unsatisfied criteria
NONE

Knowledge canonical ownership
SATISFIED

Typed domain modeling
SATISFIED

Devotional v1
SATISFIED

Anime v1
SATISFIED

Taxonomy conditional
SATISFIED — demand not triggered / deferred

Relationships conditional
SATISFIED — demand not triggered / deferred

Identity/Authorization mutation protection
SATISFIED

Basic Knowledge lifecycle
SATISFIED

Events/Audit where required
SATISFIED

Source/Citation where required
SATISFIED — demand not triggered / deferred

Temporal
SATISFIED — explicitly deferred to later real demand/History

Web/API multi-Universe consumption
SATISFIED

Duplicate Universe infrastructure
NONE

Named-Universe Platform/Kernel core branch
NONE

History positioning
later third structural reuse test PRESERVED

Phase 4
COMPLETE

Exit outcome
MULTI-UNIVERSE KNOWLEDGE PLATFORM

Next
Phase 5 — Media Platform

Tag rule
phase-4-complete only after exact closure docs commit CI success
```

The four P4-M01 unit tests prove the initial lifecycle vocabulary. The PostgreSQL integration proof establishes durable ResourceId/NamespacedKey-backed persistence and duplicate identifier rejection.

P4-M01 deliberately introduced no generic JSON payload, Universe registry, Taxonomy, Relationships, Events, API, Web behavior, or expanded lifecycle.

P4-M02 then proved the first real Universe-owned typed specialization without changing Knowledge, persistence, or the canonical lifecycle. It deliberately created only Devotional and kept Anime and History unmaterialized.

P4-M03 then established canonical Knowledge-owned create/read/update operations and Prisma-backed persistence behind public Knowledge Contracts. It kept the existing schema and migration count unchanged, kept lifecycle at DRAFT, and limited the update operation to `resourceType`.

P4-M04 then protected Knowledge create/update mutations through the shared Identity & Access permission evaluator, added the Identity-owned `knowledge-editor` Role and Knowledge-owned create/update Permission actions, proved Administrator, editor, and ordinary User behavior against real PostgreSQL, preserved denial non-disclosure, and introduced only the required data-only authorization migration.

P4-M05 then demand-reviewed Taxonomy against the currently implemented Devotional domain. Because only `DeityResource` exists and it currently requires no reusable classification semantic, Taxonomy remains deferred and unmaterialized rather than being scaffolded speculatively.

P4-M06 then demand-reviewed Relationships against the same implemented Devotional domain. Because there is still only `DeityResource`, with no second implemented Devotional Resource such as `TempleResource`, there is no real reusable Resource-to-Resource relationship consumer. Relationships therefore remains deferred and unmaterialized.

P4-M08 then demand-reviewed Events after the lifecycle baseline became real. Although publish/archive transitions now provide plausible future producer points, no implemented production consumer currently requires a business Event boundary. Events therefore remains deferred and unmaterialized.

P4-M09 then demand-reviewed Source/provenance semantics against the implemented Devotional domain. Because `DeityResource` remains the only Devotional Resource and contains no source-backed content or traceability requirement, Source semantics remain deferred and unmaterialized.

P4-M10 then demand-reviewed Citation semantics after Sources remained deferred. With no implemented source-backed Devotional Resource and no structured Citation association requirement distinct from Source, Citation semantics remain deferred and unmaterialized.

P4-M11 then demand-reviewed reusable temporal semantics. `KnowledgeResource.createdAt` and `updatedAt` remain technical timestamps, while the only implemented Devotional Resource has no domain date/date-range requirement. Shared temporal semantics therefore remain deferred and unmaterialized.

P4-M12 then established Devotional Universe v1 with a concrete Devotional-owned definition for `universe.devotional` and Deity, Scripture, and Temple typed Resources over shared Knowledge. The milestone intentionally kept the definition concrete instead of promoting a generic Universe framework before the Anime reuse test. Deferred Taxonomy, Relationships, Source, Citation, and Temporal semantics remained unmaterialized.

P4-M13 then completed the bounded Anime second-Universe reuse test. `CharacterResource` and `SeriesResource` reused shared Knowledge while Anime remained isolated from Devotional implementation and shared Platform code remained free of named-Universe core branches. The concrete Universe-definition pattern proved reusable, but no generic shared `UniverseDefinition` or registry was promoted without a runtime consumer. Devotional remains the primary product/domain priority.

P4-M14 then established the first controlled public Knowledge read/query surface. Only `PUBLISHED` Resources are publicly visible; draft and archived Resources remain hidden. Devotional supplied the primary product proof while production code remained Universe-generic, and Anime appeared only as a cross-Universe isolation fixture. No creator writes, schema change, migration, Search subsystem, or deferred semantic capability was introduced.

P4-M15 then established the first protected creator Knowledge transport surface. Session-authenticated creators now exercise the existing owner-side create/update authorization boundary through generic POST/PATCH endpoints, with Devotional supplying the primary product proof. Created Resources remain DRAFT and therefore hidden from the public P4-M14 surface until lifecycle publication occurs through the existing owner capability. No creator UI, publish/archive HTTP transport, named-Universe production branch, schema change, or migration was introduced.

P4-M16 completed the first limited Web Knowledge experience and the final named implementation milestone currently listed for Phase 4. The subsequent Proof Generality Review is now closed: Devotional remains the primary proof, Anime reused the shared baseline without shared-core modification or duplicate infrastructure, no Metadata escape hatch was introduced, and no named-Universe Platform switch was found. The Metadata, Workflow, and Policy Decision Gates are closed with all three shared capabilities deferred. Section 135 has now formally evaluated all accepted Closure Criteria as satisfied, so Phase 4 is complete.

P4-M07 closed the first real Knowledge publication lifecycle with explicit `DRAFT -> PUBLISHED -> ARCHIVED` semantics, protected publish/archive operations, conditional persistence transitions, and no generic Workflow engine. Events remained separate, and P4-M08 later deferred them after finding no real production Event consumer.

Phase 4 has no remaining delivery action. The next major delivery phase is:

```text
Phase 5 — Media Platform
```

Phase 4 completion evidence demonstrates Devotional and the Anime reuse-test Universe operating through one shared Knowledge Platform. History remains positioned as the later third structural reuse test.

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
    COMPLETE
    EXIT: MULTI-UNIVERSE KNOWLEDGE PLATFORM
    ✅ P4-M01 Knowledge Resource Model — CLOSED
    ✅ P4-M02 Typed Domain Resource Support — CLOSED
    ✅ P4-M03 Knowledge CRUD Baseline — CLOSED
    ✅ P4-M04 Knowledge Authorization — CLOSED
    ↷  P4-M05 Taxonomy Integration — DEFERRED (no implemented Devotional classification consumer)
    ↷  P4-M06 Relationship Integration — DEFERRED (no implemented Devotional Resource-to-Resource relationship consumer)
    ✅ P4-M07 Knowledge Lifecycle — CLOSED
    ↷  P4-M08 Knowledge Events — DEFERRED (no real production Event consumer)
    ↷  P4-M09 Sources — DEFERRED (no implemented Devotional source-backed Resource)
    ↷  P4-M10 Citations — DEFERRED (no implemented Devotional Resource requires Citation semantics distinct from Source)
    ↷  P4-M11 Temporal Baseline — DEFERRED (no implemented Devotional Resource requires reusable date/date-range semantics)
    ✅ P4-M12 Devotional Universe v1 — CLOSED
    ✅ P4-M13 Anime Reuse-Test Universe v1 — CLOSED
    ✅ P4-M14 Basic Public Knowledge API — CLOSED
    ✅ P4-M15 Basic Creator Knowledge API — CLOSED
    ✅ P4-M16 Web Knowledge Experience — CLOSED
    ✅ Phase 4 Proof Generality Review — CLOSED
    ↷  Metadata Decision Gate — CLOSED (Metadata Kernel DEFERRED)
    ↷  Workflow Decision Gate — CLOSED (Workflow Kernel DEFERRED)
    ↷  Policy Decision Gate — CLOSED (Policy Kernel DEFERRED)
    ✅ Phase 4 Closure Criteria Evaluation — CLOSED (15/15 SATISFIED)
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
    ACTIVE
    ✅ P5-M01 Asset Model — CLOSED
    ✅ P5-M02 Storage Foundation — CLOSED
    ✅ P5-M03 Upload — CLOSED
    ✅ P5-M04 Delivery — CLOSED
    ✅ P5-M05 Image Processing — CLOSED
    ✅ P5-M06 Knowledge Integration — CLOSED
    ✅ P5-M07 Devotional Media Proof — CLOSED
    ✅ P5-M08 Anime Media Proof — CLOSED
    ✅ P5-M09 Media Audit/Events — CLOSED
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
P4-M08 — Knowledge Events — no real production Event consumer
P4-M09 — Sources — no implemented Devotional source-backed Resource
P4-M10 — Citations — no implemented Devotional Resource requires Citation semantics distinct from Source
P4-M11 — Temporal Baseline — no implemented Devotional Resource requires reusable date/date-range semantics

NEXT DELIVERY ACTION
Metadata Decision Gate

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

P4-M08 DEMAND REVIEW RESULT
Knowledge lifecycle producer points now exist
Production Event publisher none
Production Event subscriber none
Concrete Knowledge Event Contract none
Events Kernel not materialized
Event bus none
Event/outbox persistence none
Worker application not materialized
Real production Event consumer none
Real producer/consumer Event boundary none
Prisma schema unchanged
No migration
Canonical migrations remain 12
Decision: DEFERRED

P4-M09 DEMAND REVIEW RESULT
Implemented Devotional Resource types 1
DeityResource only
DeityResource domain-specific field name
ScriptureResource not materialized
Source-backed Devotional Resource none
Real Source traceability requirement none
Source Contract/model none
Source persistence none
Prisma schema unchanged
No migration
Canonical migrations remain 12
Decision: DEFERRED

P4-M10 DEMAND REVIEW RESULT
Implemented Devotional Resource types 1
DeityResource only
Source-backed Devotional Resource none
Citation field/association none
Structured Citation locator semantics none
Citation semantics distinct from Source required no
Citation Contract/model none
Citation persistence none
Prisma schema unchanged
No migration
Canonical migrations remain 12
Decision: DEFERRED

P4-M11 DEMAND REVIEW RESULT
Implemented Devotional Resource types 1
DeityResource only
Real domain temporal consumer none
createdAt/updatedAt technical timestamps only
Shared DateRange/Temporal abstraction none
Knowledge domain temporal persistence none
Prisma schema unchanged
No migration
Canonical migrations remain 12
Decision: DEFERRED

P4-M12 CLOSURE RESULT
Devotional Universe v1 CLOSED
Implementation 1b7fab5 feat(devotional): establish universe v1
CI 31926097194 success
Universe key universe.devotional
Resource Types deity / scripture / temple
Three typed Knowledge specializations
Generic shared UniverseDefinition framework not created
Deferred shared capabilities not activated
Prisma unchanged
No migration
Canonical migrations remain 12

P4-M13 CLOSURE RESULT
Anime Reuse-Test Universe v1 CLOSED
Implementation c90b4a99 feat(anime): establish reuse-test universe v1
CI 31927100260 success
Devotional remains primary product/domain priority
Anime remains bounded architecture reuse test
Universe key universe.anime
Resource Types character / series
Shared Knowledge reuse proved
Generic shared UniverseDefinition / Registry not promoted
Genre and APPEARS_IN relationship not materialized
Prisma unchanged
No migration
Canonical migrations remain 12

P4-M14 CLOSURE RESULT
Basic Public Knowledge API CLOSED
Implementation c7f21161 feat(knowledge): expose public read API
CI 31928964366 success
Devotional remains primary product/domain focus
GET /knowledge/resources/:id
GET /knowledge/resources
PUBLISHED-only public visibility
DRAFT / ARCHIVED hidden
universeKey required
resourceType optional
default limit 20
max limit 50
lifecycle not exposed
Knowledge 5 files / 37 tests
Public API integration 1 file / 10 tests
Architecture 367 modules / 943 dependencies / 0 violations
No named-Universe production branches
No creator writes
Prisma unchanged
No migration
Canonical migrations remain 12

P4-M15 CLOSURE RESULT
Basic Creator Knowledge API CLOSED
Implementation 888523cb feat(knowledge): expose creator write API
CI 31930221502 success
Devotional remains primary product/domain focus
POST /knowledge/resources
PATCH /knowledge/resources/:id
Session required
acting Actor derived from validated Session only
knowledge.resource.create
knowledge.resource.update
authorization before canonical validation
controlled canonical invalid-input response
downstream TypeErrors not reclassified
created Resources begin DRAFT
created Devotional DRAFT remains hidden publicly
Knowledge 5 files / 41 tests
Creator API integration 1 file / 10 tests
Architecture 370 modules / 968 dependencies / 0 violations
No creator UI
No publish/archive HTTP endpoints
No named-Universe production branches
Prisma unchanged
No migration
Canonical migrations remain 12

P4-M16 CLOSURE RESULT
Web Knowledge Experience CLOSED
Implementation b61374d feat(web): add knowledge experience
CI 31933927697 success
Devotional remains primary product/domain focus
/knowledge
Devotional Resources FIRST / PRIMARY
Anime Resources SECONDARY / bounded reuse-test
Shared public Knowledge GET contract reused
No direct Platform package dependency
No direct Universe package dependency
No deep package import
No canonical Knowledge ownership in Web
No creator/write/lifecycle controls
Relationships remain deferred
Classification/Taxonomy remains deferred
Web unit tests 6 files / 23 tests
Playwright 3 tests
Architecture 375 modules / 978 dependencies / 0 violations
Prisma unchanged
No migration
Canonical migrations remain 12
Phase 4 remains ACTIVE
AT P4-M16 CLOSURE Phase 4 Proof Generality Review followed next

PHASE 4 PROOF GENERALITY REVIEW RESULT
CLOSED
Baseline 743c36d docs(roadmap): close P4-M16
Baseline CI 31934463622 success
Devotional remains primary product/domain proof
Shared Knowledge core genuinely exercised
canonical Resource model
typed Resource extension
shared persistence / CRUD
owner-side mutation authorization
lifecycle
published-only public read/list
Anime reused baseline without shared-core modification
Anime P4-M13 changed no Platform/Kernel/API/Web/Prisma production code
Devotional runtime dependency @ai-world/platform-knowledge
Anime runtime dependency @ai-world/platform-knowledge
Duplicate Universe infrastructure NONE
Universe-specific Prisma models NONE
Generic Metadata escape hatch NOT INTRODUCED
Named-Universe Platform/Kernel switches NONE FOUND
History baseline reuse expectation FEWER SHARED-CORE CHANGES
History may still activate deferred semantic capabilities
Phase 4 remains ACTIVE
AT REVIEW CLOSURE Metadata Decision Gate followed next

METADATA DECISION GATE RESULT
CLOSED
Metadata Kernel DEFERRED
Baseline 0082539c docs(roadmap): close Phase 4 generality review
Baseline CI 31935169513 success
Devotional stable domain properties remain typed
Anime stable domain properties remain typed
Generic Knowledge Metadata bag NONE
Prisma Knowledge Metadata field NONE
Metadata Kernel/Platform package NONE
Metadata Definition registry NONE
Metadata value persistence NONE
Metadata query/versioning mechanics NONE
Current real shared Metadata consumer NONE
Implementation change NONE
Schema change NONE
Migration NONE
Canonical migrations remain 12
Future activation requires a real extensible-property consumer
Phase 4 remains ACTIVE
AT METADATA GATE CLOSURE Workflow Decision Gate followed next

WORKFLOW DECISION GATE RESULT
CLOSED
Workflow Kernel DEFERRED
Baseline 76352305 docs(roadmap): close Metadata decision gate
Baseline CI 31935914132 success
Knowledge lifecycle DRAFT -> PUBLISHED -> ARCHIVED
Direct owner-side publish/archive transitions
Knowledge permissions create/update/publish/archive
Submit-for-review NONE
Review state NONE
Reviewer assignment NONE
Approval/rejection NONE
Workflow Definition NONE
Workflow Instance NONE
Workflow package NONE
Workflow/approval persistence NONE
Current real reusable editorial Workflow consumer NONE
Implementation change NONE
Schema change NONE
Migration NONE
Canonical migrations remain 12
Future activation requires real process beyond direct lifecycle transitions
Phase 4 remains ACTIVE
AT WORKFLOW GATE CLOSURE Policy Decision Gate followed next

POLICY DECISION GATE RESULT
CLOSED
Policy Kernel DEFERRED
Baseline 380ddd69 docs(roadmap): close Workflow decision gate
Baseline CI 31936814311 success
Knowledge lifecycle/public visibility remain owner-local rules
Knowledge permissions create/update/publish/archive remain owner-local action meaning
Authorization evaluation remains Identity & Access-owned
Devotional policy configuration NONE
Anime policy configuration NONE
Cross-context configurable Policy consumer NONE
Policy Definition/Registry/Evaluator NONE
Policy package NONE
Policy persistence NONE
Implementation change NONE
Schema change NONE
Migration NONE
Canonical migrations remain 12
Future activation requires real configurable cross-context rule pressure
AT POLICY GATE CLOSURE Phase 4 remained ACTIVE
AT POLICY GATE CLOSURE Phase 4 Closure Criteria Evaluation followed next

PHASE 4 CLOSURE CRITERIA RESULT
CLOSED
15 / 15 SATISFIED
Unsatisfied NONE
Baseline 4165ecfe docs(roadmap): close Policy decision gate
Baseline CI 31937800697 success
Production changes since P4-M16 implementation NONE
Canonical migrations remain 12
Knowledge canonical ownership SATISFIED
Typed domain modeling SATISFIED
Devotional v1 SATISFIED
Anime v1 SATISFIED
Taxonomy conditional SATISFIED — deferred / demand not triggered
Relationships conditional SATISFIED — deferred / demand not triggered
Identity/Authorization mutation protection SATISFIED
Basic lifecycle SATISFIED
Events/Audit where required SATISFIED
Source/Citation where required SATISFIED — deferred / demand not triggered
Temporal SATISFIED — explicitly deferred to later real demand/History
Web/API consume both proof Universes SATISFIED
Duplicate Universe infrastructure NONE
Named-Universe Platform/Kernel core branch NONE
History remains later third structural reuse test
Phase 4 COMPLETE
Exit Outcome MULTI-UNIVERSE KNOWLEDGE PLATFORM
NEXT Phase 5 — Media Platform
TAG RULE phase-4-complete only after exact closure docs commit CI success

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

## PHASE 5 CURRENT STATE AFTER P5-M01

The authoritative current delivery state after the green P5-M01 implementation checkpoint is:

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

IMPLEMENTATION
9dbc6cee582c3bde882c2f0fc0cb5cf5799c5f66

REMOTE CI
31941303048
CI #71
SUCCESS

CANONICAL MIGRATIONS
13

P5-M02 — Storage Foundation
NEXT
```

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CURRENT STATE AFTER P5-M02

The authoritative current delivery state after the green P5-M02 implementation checkpoint is:

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

IMPLEMENTATION
d875f3134dd02df4ef73417d0fc20696f376203b

REMOTE CI
31943031951
CI #73
SUCCESS

CANONICAL MIGRATIONS
13

P5-M03 — Upload
NEXT
```

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CURRENT STATE AFTER P5-M03

The authoritative current delivery state after the green P5-M03 implementation checkpoint is:

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

IMPLEMENTATION
aba28f2cf3eff61e9a5402253485413d1679c34f

REMOTE CI
31946959290
CI #75
SUCCESS

CANONICAL MIGRATIONS
14

P5-M04 — Delivery
NEXT
```

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CURRENT STATE AFTER P5-M04

The authoritative current delivery state after the green P5-M04 implementation checkpoint is:

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

IMPLEMENTATION
291636bed48c45a18ae30aa5ec7254b028774737

REMOTE CI
31948583211
CI #77
SUCCESS

CANONICAL MIGRATIONS
14

P5-M05 — Image Processing
NEXT
```

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CURRENT STATE AFTER P5-M05

The authoritative current delivery state after the green P5-M05 implementation checkpoint is:

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

P5-M05 — Image Processing
CLOSED

IMPLEMENTATION
f5e388397c433bc7b5fbaea011dff440d72b7e8b

REMOTE CI
31952328514
CI #79
SUCCESS

CANONICAL MIGRATIONS
14

P5-M06 — Knowledge Integration
NEXT
```

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CURRENT STATE AFTER P5-M06

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

P5-M05 — Image Processing
CLOSED

P5-M06 — Knowledge Integration
CLOSED

IMPLEMENTATION
144c26a7befa289f528dc92d17d4273b7b4380ad

REMOTE CI
31991765647
CI #81
SUCCESS

CANONICAL MIGRATIONS
15

P5-M07 — Devotional Media Proof
NEXT
```

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CURRENT STATE AFTER P5-M07

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

P5-M05 — Image Processing
CLOSED

P5-M06 — Knowledge Integration
CLOSED

P5-M07 — Devotional Media Proof
CLOSED

IMPLEMENTATION CHECKPOINT
12674d94f383c5bda43c6f5bf025364cc1437730
feat(web): implement devotional media proof

IMPLEMENTATION CI
31998857858
CI #83
SUCCESS

CANONICAL MIGRATIONS
15

P5-M08 — Anime Media Proof
NEXT
```

P5-M07 proved the first real Devotional Media consumer through published Temple imagery using the already-owned Knowledge Asset-reference contract and shared Media thumbnail/original delivery routes.

The implementation did not create Devotional-specific storage or processing and did not invent Asset role/order semantics.

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CURRENT STATE AFTER P5-M08

```text
PHASE 5 — Media Platform
ACTIVE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

P5-M05 — Image Processing
CLOSED

P5-M06 — Knowledge Integration
CLOSED

P5-M07 — Devotional Media Proof
CLOSED

P5-M08 — Anime Media Proof
CLOSED

IMPLEMENTATION CHECKPOINT
9fcbef43226828532eb2da4ab810ca87ecba7fe2
feat(web): implement anime media proof

IMPLEMENTATION CI
32000314155
CI #85
SUCCESS

CANONICAL MIGRATIONS
15

P5-M09 — Media Audit/Events
NEXT
```

P5-M08 proved shared Media reuse through both existing Anime Resource types, `anime.character` and `anime.series`, without changing the shared Media presentation component, the Anime domain package, API production code, or persistence.

The optional visual-media-relationship idea remains deferred because the milestone produced no real relationship consumer that justifies activating that abstraction.

No Phase 5 completion tag is authorized at this milestone.

## PHASE 5 CLOSURE STATE AFTER P5-M09

```text
PHASE 5 — Media Platform
COMPLETE

P5-M01 — Asset Model
CLOSED

P5-M02 — Storage Foundation
CLOSED

P5-M03 — Upload
CLOSED

P5-M04 — Delivery
CLOSED

P5-M05 — Image Processing
CLOSED

P5-M06 — Knowledge Integration
CLOSED

P5-M07 — Devotional Media Proof
CLOSED

P5-M08 — Anime Media Proof
CLOSED

P5-M09 — Media Audit/Events
CLOSED

IMPLEMENTATION CHECKPOINT
de49c4c179b8a467a0ca6dd474c54fbfc63c5e3f
feat(media): audit asset uploads

IMPLEMENTATION CI
32024393772
CI #87
SUCCESS

PHASE 5 CLOSURE CRITERIA
9 / 9 SATISFIED

CANONICAL MIGRATIONS
15

PHASE 6 — Discovery Platform
NEXT

P6-M01 — Search Contract
NEXT

phase-5-complete
PENDING CLOSURE-COMMIT CI
```

Phase 5 now provides one shared Media Platform with Media-owned Assets, provider-neutral Storage mechanics, authenticated upload, controlled delivery, synchronous basic image processing, safe Knowledge references, Devotional and Anime reuse proof, and durable required Audit for the implemented Asset creation lifecycle.

Events remain deferred because no real business Event consumer exists.

No Phase 5 completion tag is created by this documentation closure. The tag decision occurs only after this closure commit is pushed and its CI is green.

## PHASE 6 CURRENT STATE AFTER P6-M01

```text
PHASE 5 — Media Platform
COMPLETE

phase-5-complete
ESTABLISHED

PHASE 6 — Discovery Platform
ACTIVE

P6-M01 — Search Contract
CLOSED

IMPLEMENTATION COMMIT
f60756093f9c7ea36d23fc1bea73da0e1e5754f1

IMPLEMENTATION CI
32031713898
CI #89
SUCCESS

DISCOVERY PACKAGE
@ai-world/platform-discovery

SEARCH CONTRACT
query
scope
filter
pagination
normalized Resource result

CANONICAL MIGRATIONS
15

P6-M02 — Knowledge Search
NEXT
```

P6-M01 established Discovery-owned Search semantics without prematurely implementing Knowledge Search, PostgreSQL execution, ranking, indexing, a dedicated Search provider, or API/Web delivery.

P6-M02 is the next implementation milestone and gives the Search Contract its first real canonical Knowledge consumer.

## PHASE 6 CURRENT STATE AFTER P6-M02

```text
PHASE 5 — Media Platform
COMPLETE

phase-5-complete
ESTABLISHED

PHASE 6 — Discovery Platform
ACTIVE

P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

IMPLEMENTATION COMMIT
9d1a359ceabf365b399cb10070a7536e3004f293

IMPLEMENTATION CI
32044439194
CI #91
SUCCESS

DISCOVERY IMPLEMENTATION
PrismaKnowledgeSearch

SOURCE OF TRUTH
Knowledge Platform

SEARCH SOURCE
canonical PostgreSQL KnowledgeResource relational state

CURRENT QUERY FIELD
resourceType

VISIBILITY
PUBLISHED only

CURRENT SCOPE
generic Universe scope

PAGINATION
offset + limit

ORDERING
createdAt DESC
id ASC
not relevance ranking

CANONICAL MIGRATIONS
15

P6-M03 — Universe-Scoped Search
NEXT
```

P6-M02 proved a real Discovery-owned PostgreSQL Search implementation over canonical Knowledge state without introducing a derived Search index, ranking, global Search, filter execution, or application delivery prematurely.

P6-M03 is the next implementation milestone and must prove the same generic Discovery Search implementation against the existing Devotional and Anime Universes.

## PHASE 6 CURRENT STATE AFTER P6-M03

```text
PHASE 5 — Media Platform
COMPLETE

phase-5-complete
ESTABLISHED

PHASE 6 — Discovery Platform
ACTIVE

P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

P6-M03 — Universe-Scoped Search
CLOSED

IMPLEMENTATION COMMIT
9678fdeeea82eafb678bc52dc6dff98ce4b1beec

IMPLEMENTATION CI
32100741704
CI #93
SUCCESS

PROOF TYPE
named-Universe reuse proof

SHARED IMPLEMENTATION
PrismaKnowledgeSearch

DEVOTIONAL
universe.devotional
devotional.temple
PROVEN

ANIME
universe.anime
anime.character
PROVEN

ISOLATION MECHANISM
generic Universe scope
scope.kind = universe
universeKey

DISCOVERY NAMED-UNIVERSE COUPLING
NONE

FILTER EXECUTION
DEFERRED TO P6-M05

GLOBAL / CROSS-UNIVERSE SEARCH
DEFERRED TO P6-M04

RANKING
DEFERRED TO P6-M06

PROJECTION / INDEX REVIEW
DEFERRED TO P6-M07

CANONICAL MIGRATIONS
15

P6-M04 — Cross-Universe Search
NEXT
```

P6-M03 proves that the existing generic Discovery Search implementation can isolate real Devotional and Anime results using only the shared Universe scope, without adding Universe-specific branches or infrastructure to Discovery.

P6-M04 is the next implementation milestone and must add true global/cross-Universe Search across authorized Universes while preserving canonical visibility boundaries.


## PHASE 6 CURRENT STATE AFTER P6-M04

```text
PHASE 5 — Media Platform
COMPLETE

phase-5-complete
ESTABLISHED

PHASE 6 — Discovery Platform
ACTIVE

P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

P6-M03 — Universe-Scoped Search
CLOSED

P6-M04 — Cross-Universe Search
CLOSED

IMPLEMENTATION COMMIT
3922bd83f00e978acb8a45989f411dbb29a4c437

IMPLEMENTATION CI
32111419905
CI #95
SUCCESS

GLOBAL SEARCH
PROVEN

UNIVERSE-SCOPED SEARCH
PRESERVED

PUBLIC VISIBILITY
PUBLISHED ONLY

DEVOTIONAL
universe.devotional
devotional.temple
GLOBAL SEARCH PROVEN

ANIME
universe.anime
anime.character
GLOBAL SEARCH PROVEN

DRAFT / INITIAL VISIBILITY
HIDDEN

ARCHIVED VISIBILITY
HIDDEN

DISCOVERY NAMED-UNIVERSE COUPLING
NONE

PER-ACTOR UNIVERSE ACL
NOT INTRODUCED

FILTER EXECUTION
DEFERRED TO P6-M05

RANKING
DEFERRED TO P6-M06

PROJECTION / INDEX REVIEW
DEFERRED TO P6-M07

CANONICAL MIGRATIONS
15

P6-M05 — Filters
NEXT
```

P6-M04 proves that the shared Discovery Search implementation can broaden from a single requested Universe to global Search across canonical published Knowledge from both existing real Universes without introducing named-Universe runtime branches or weakening lifecycle visibility.

P6-M05 is the next implementation milestone and may add the roadmap-defined Search filters while preserving the P6-M04 global and Universe-scoped behavior.


## PHASE 6 CURRENT STATE AFTER P6-M05

```text
PHASE 5 — Media Platform
COMPLETE

phase-5-complete
ESTABLISHED

PHASE 6 — Discovery Platform
ACTIVE

P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

P6-M03 — Universe-Scoped Search
CLOSED

P6-M04 — Cross-Universe Search
CLOSED

P6-M05 — Filters
CLOSED

IMPLEMENTATION COMMIT
fb19a3f6981d0c2038729ed3cc500a612b17f346

IMPLEMENTATION CI
32114069955
CI #97
SUCCESS

UNIVERSE FILTERING
EXISTING SEARCH SCOPE
PRESERVED

RESOURCE TYPE FILTERING
IMPLEMENTED
EXACT ANY-OF

EMPTY RESOURCE TYPE FILTER
NEUTRAL

TAXONOMY FILTERING
DEFERRED

TAXONOMY KERNEL
NOT MATERIALIZED

KNOWLEDGE TAXONOMY INTEGRATION
NOT MATERIALIZED

PUBLIC VISIBILITY
PUBLISHED ONLY

GLOBAL SEARCH
PRESERVED

UNIVERSE-SCOPED SEARCH
PRESERVED

RANKING
DEFERRED TO P6-M06

PROJECTION / INDEX REVIEW
DEFERRED TO P6-M07

CANONICAL MIGRATIONS
15

P6-M06 — Basic Ranking
NEXT
```

P6-M05 proves that the existing Search contract can execute practical Resource Type filtering without contract expansion, duplicate Universe-filter semantics, taxonomy speculation, ranking, or Search-index infrastructure.

P6-M06 is the next implementation milestone and must introduce understandable PostgreSQL ranking while preserving the established Search visibility, scope, filter, and pagination behavior.


## PHASE 6 CURRENT STATE AFTER P6-M06

```text
PHASE 5 — Media Platform
COMPLETE

phase-5-complete
ESTABLISHED

PHASE 6 — Discovery Platform
ACTIVE

P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

P6-M03 — Universe-Scoped Search
CLOSED

P6-M04 — Cross-Universe Search
CLOSED

P6-M05 — Filters
CLOSED

P6-M06 — Basic Ranking
CLOSED

RANKING IMPLEMENTATION COMMIT
5c0b6303a5f53261534e31900a4683fe28703cd4

RANKING IMPLEMENTATION SUBJECT
feat(discovery): add basic search ranking

INITIAL IMPLEMENTATION CI
32119370009
CI #99
FAILURE — API INTEGRATION TEST FILE CONCURRENCY

FINAL GREEN CHECKPOINT
54b12ce60d8948f01609f69770cf0d90f3b8f1e7

FINAL CHECKPOINT SUBJECT
test(api): serialize integration tests

FINAL CHECKPOINT CI
32122735772
CI #100
SUCCESS

RANKING OWNER
DISCOVERY

RANKING EXECUTION
POSTGRESQL

RANKING INPUT
CANONICAL KNOWLEDGE RESOURCE TYPE

RANKING TIERS
EXACT COMPLETE KEY
TERMINAL SEGMENT EXACT
TERMINAL SEGMENT PREFIX
COMPLETE KEY PREFIX
OTHER SUBSTRING

TIE BREAK
createdAt DESC
id ASC

PAGINATION
AFTER RANKING
OFFSET / LIMIT

SEARCH RESULT SCORE
NOT EXPOSED

PUBLIC VISIBILITY
PUBLISHED ONLY

GLOBAL SEARCH
PRESERVED

UNIVERSE-SCOPED SEARCH
PRESERVED

RESOURCE TYPE FILTERING
PRESERVED
EXACT ANY-OF

NAMED-UNIVERSE DISCOVERY COUPLING
NONE

AI / VECTOR RANKING
NOT INTRODUCED

SEARCH PROJECTION
NOT INTRODUCED

SEARCH INDEX
NOT INTRODUCED

CANONICAL MIGRATIONS
15

P6-M07 — Indexing Architecture Review
NEXT
```

P6-M06 proves that the shared Discovery platform can rank canonical published Knowledge in PostgreSQL using understandable lexical relevance while preserving scope, visibility, filters, deterministic pagination, and cross-Universe reuse.

The failed first implementation CI also exposed and corrected an API integration-test isolation weakness without changing production Search semantics.

P6-M07 is the next milestone and must review whether direct PostgreSQL queries over canonical relational state remain adequate before any Search projection or index architecture is introduced.


## PHASE 6 CURRENT STATE AFTER P6-M07

```text
PHASE 6 — Discovery Platform
ACTIVE

P6-M01 — Search Contract
CLOSED

P6-M02 — Knowledge Search
CLOSED

P6-M03 — Universe-Scoped Search
CLOSED

P6-M04 — Cross-Universe Search
CLOSED

P6-M05 — Filters
CLOSED

P6-M06 — Basic Ranking
CLOSED

P6-M07 — Indexing Architecture Review
CLOSED

P6-M07 DECISION COMMIT
371a83bb3725ed51599c81d39140036f487e74e0

P6-M07 DECISION SUBJECT
docs(architecture): record P6-M07 indexing review

P6-M07 CI
32126421684
CI #102
SUCCESS

CURRENT SEARCH STORAGE
CANONICAL KNOWLEDGE RELATIONAL STATE

CURRENT SEARCH EXECUTION
DIRECT POSTGRESQL

SEPARATE SEARCH PROJECTION
NOT REQUIRED NOW

SEPARATE SEARCH INDEX MODEL
NOT REQUIRED NOW

DEDICATED SEARCH ENGINE
DEFERRED

SEMANTIC / VECTOR SEARCH
DEFERRED

FUTURE PROJECTION OWNER IF REQUIRED
DISCOVERY

CANONICAL KNOWLEDGE OWNER
KNOWLEDGE PLATFORM

CANONICAL MIGRATIONS
15

NUMBERED P6 MILESTONES REMAINING
0

PHASE 6 WEB INTEGRATION
NEXT

PHASE 6 SECURITY
PENDING

POSTGRESQL SEARCH MEASUREMENT CLOSURE EVIDENCE
PENDING

PHASE 6 CLOSURE CRITERIA EVALUATION
PENDING
```

P6-M07 closes the numbered Discovery-platform milestone sequence without introducing speculative Search infrastructure.

Phase 6 remains active because post-milestone Web Integration, Security, measurement evidence, and final closure evaluation remain.

The next concrete implementation surface is Phase 6 Web Integration.


## PHASE 6 CURRENT STATE AFTER WEB INTEGRATION

```text
PHASE 6 — Discovery Platform
ACTIVE

NUMBERED P6 MILESTONES REMAINING
0

PHASE 6 WEB INTEGRATION
CLOSED

WEB INTEGRATION IMPLEMENTATION COMMIT
80d496f491607b0a15f2b5602780852c061ba8f2

WEB INTEGRATION IMPLEMENTATION SUBJECT
feat(discovery): add web search experience

WEB INTEGRATION CI
32131161796
CI #104
SUCCESS

PUBLIC SEARCH HTTP TRANSPORT
GET /discovery/search

GLOBAL SEARCH WEB UI
/search

UNIVERSE SEARCH
DEVOTIONAL + ANIME

RESOURCE TYPE FILTERS
ENABLED

RESOURCE NAVIGATION
/knowledge/resources/[id]

PUBLIC SEARCH VISIBILITY
PUBLISHED ONLY

CANONICAL KNOWLEDGE OWNER
KNOWLEDGE PLATFORM

SEARCH OWNER
DISCOVERY PLATFORM

SEARCH PROJECTION
NOT REQUIRED NOW

DEDICATED SEARCH ENGINE
DEFERRED

SEMANTIC / VECTOR SEARCH
DEFERRED

CANONICAL MIGRATIONS
15

PHASE 6 SECURITY REVIEW
NEXT

POSTGRESQL SEARCH MEASUREMENT CLOSURE EVIDENCE
PENDING

PHASE 6 CLOSURE CRITERIA EVALUATION
PENDING

PHASE 6 COMPLETION TAG
NOT CREATED
```

The Web Integration workstream closes the public Discovery transport and browser-consumer gap without changing Search ownership or canonical Knowledge ownership.

Phase 6 remains active.

The next workstream is the Phase 6 Security review.


## PHASE 6 FINAL CLOSURE STATE

```text
PHASE 6 — Discovery Platform
COMPLETE

EXIT OUTCOME
SHARED MULTI-UNIVERSE DISCOVERY PLATFORM

NUMBERED P6 MILESTONES REMAINING
0

P6-M01 THROUGH P6-M07
CLOSED

PHASE 6 WEB INTEGRATION
CLOSED

PHASE 6 SECURITY REVIEW
CLOSED

POSTGRESQL SEARCH MEASUREMENT EVIDENCE
CLOSED

PHASE 6 CLOSURE CRITERIA EVALUATION
CLOSED — 8 / 8 SATISFIED

PHASE 6 FINAL CLOSURE DOCUMENTATION
CLOSED

PUBLIC SEARCH VISIBILITY
PUBLISHED ONLY

UNIVERSE SCOPE
ENFORCED

GLOBAL / CROSS-UNIVERSE SEARCH
ENABLED

RESOURCE TYPE FILTERS
ENABLED

BASIC DETERMINISTIC RANKING
ENABLED

CANONICAL KNOWLEDGE OWNER
KNOWLEDGE PLATFORM

SEARCH OWNER
DISCOVERY PLATFORM

CONTROLLED POSTGRESQL MEASUREMENT SCALE
100,000 Knowledge rows

HIGHEST MEASURED WARM MEDIAN
50.478 ms

SPECIALIZED SEARCH INFRASTRUCTURE
NOT JUSTIFIED BY CURRENT EVIDENCE

CANONICAL MIGRATIONS
15

PHASE 6 COMPLETION TAG RULE
ANNOTATED phase-6-complete
TARGET THE EXACT FINAL CLOSURE COMMIT
CREATE ONLY AFTER THAT COMMIT'S REMOTE CI SUCCEEDS

PHASE 7 — AI / Creator Platform
NEXT
```

Phase 6 is complete at the roadmap level with all eight closure criteria satisfied.

The final repository completion marker is the annotated `phase-6-complete` tag. It is created only after the exact final Phase 6 documentation-closure commit has been pushed and its remote CI succeeds, and it must target that exact closure commit.

Phase 7 is the next delivery phase after that repository marker is established.


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

Phase 4 delivery is complete. The current next delivery work is:

```text
Phase 5 — Media Platform
```

P3-M01 established canonical Resource identifier semantics.

P3-M02 established the minimal collision-safe NamespacedKey semantic and proved it through the existing Identity Permission vocabulary.

P3-M03 was reviewed and intentionally deferred because the production codebase has no real Event producer/consumer requirement. No Event package, bus, persistence, queue, Kafka, or RabbitMQ was introduced.

P3-M04 established the durable Audit Record baseline through `@ai-world/kernel-audit`, PostgreSQL `audit_records`, and a real Identity authorization-decision consumer. Audit remains separate from Events and operational logging; Audit Query and Retention remain deferred until real consumers require them.

P3-M05 Taxonomy was demand-reviewed and intentionally deferred because no implemented Resource currently requires reusable shared classification semantics. No Taxonomy package, persistence model, registry, or migration was introduced. Its first strong activation gate remains Phase 4 P4-M05 Taxonomy Integration.

P3-M06 Relationships was demand-reviewed and intentionally deferred because no implemented production capability currently requires a shared semantic Resource-to-Resource relationship. No Relationships package, Relationship Type/Instance persistence, traversal layer, Graph Database, or migration was introduced. Its first strong activation gate remains Phase 4 P4-M06 Relationship Integration.

P3-M07 strengthened the concrete package boundaries that now exist. Applications and packages can no longer deep-import foreign package source, and production package source cannot consume foreign infrastructure implementations. Legitimate application composition and integration-test composition remain supported. The implementation checkpoint is `aaf6e80 feat(architecture): expand package boundary enforcement`, and its remote CI is green.

Phase 3 is therefore complete with the exit outcome `MINIMAL SHARED SEMANTIC KERNEL`. Phase 4 Knowledge is active; P4-M01, P4-M02, P4-M03, P4-M04, P4-M07, and P4-M12 are closed; P4-M05, P4-M06, P4-M08, P4-M09, P4-M10, and P4-M11 are deferred after demand review; and P4-M13 is next.

P4-M02 established the first Devotional typed resource only. Anime remains deferred to its later second-Universe reuse-test milestone, and History remains the later third structural reuse test.

P4-M03 established canonical Knowledge create/read/update operations behind Knowledge-owned Contracts and Prisma persistence. It introduced no new migration, kept Knowledge lifecycle at DRAFT, and kept the shared Platform Universe-neutral.

P4-M04 established shared authorization around Knowledge create/update mutations through the Identity & Access public permission evaluator. It introduced the `knowledge-editor` capability Role, Knowledge-owned create/update Permission actions, a data-only grant migration, default-deny ordinary User proof, and denial non-disclosure without adding API/Web behavior or changing the Prisma schema.

P4-M05 demand-reviewed Taxonomy Integration against the implemented Devotional domain and found no real reusable classification consumer. The Taxonomy Kernel therefore remains deferred and unmaterialized.

P4-M06 demand-reviewed Relationship Integration against the same implemented Devotional domain and found no real reusable Resource-to-Resource relationship consumer. With only `DeityResource` implemented and no `TempleResource` or other second Devotional Resource present, the Relationships Kernel remains deferred and unmaterialized.

P4-M07 then established the smallest canonical Knowledge lifecycle: `DRAFT -> PUBLISHED -> ARCHIVED`, with explicit protected publish/archive operations, lifecycle-specific Permission actions, conditional persistence, and no generalized Workflow engine. P4-M08 Knowledge Events is next.
