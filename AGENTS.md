# AI World — Codex Engineering Instructions

## 1. Project Identity

AI World is a greenfield, architecture-first, capability-oriented platform.

The legacy AI World implementation is reference-only and must not be treated as the architecture or runtime dependency of this repository.

Canonical project name:

`AI World`

Canonical repository/internal slug:

`ai-world`

Do not introduce `v2` into canonical project or package naming.

---

## 2. Canonical Architecture Authority

Architecture decisions are defined under `docs/`.

Before making an architectural or cross-capability change, consult the relevant canonical documentation.

The most important governing documents include:

- `docs/00-governance/project-charter.md`
- `docs/01-vision/platform-principles.md`
- `docs/01-vision/universe-principles.md`
- `docs/01-vision/terminology.md`
- `docs/02-architecture/platform-architecture.md`
- `docs/02-architecture/platform-layers.md`
- `docs/02-architecture/capability-map.md`
- `docs/02-architecture/ownership-model.md`
- `docs/02-architecture/dependency-rules.md`
- `docs/02-architecture/extension-model.md`
- `docs/02-architecture/repository-architecture.md`
- `docs/02-architecture/technology-strategy.md`
- `docs/13-roadmaps/master-roadmap.md`

Do not silently override accepted architecture because another implementation appears easier.

If implementation needs conflict with accepted architecture, stop and report the conflict.

---

## 3. Architectural Classification

AI World source is classified into:

1. Applications
2. Universes
3. Platforms
4. Platform Kernel
5. Foundations

Canonical conceptual dependency direction:

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

This is a semantic dependency model, not a requirement that every call pass through every layer.

Applications may consume Platform public contracts directly where appropriate.

---

## 4. Repository Architecture

Canonical source organization is:

```text
apps/
    executable applications

packages/
    foundations/
    kernel/
    platforms/
    universes/

docs/
    canonical architecture and engineering documentation

infrastructure/
    deployment/environment infrastructure

scripts/
    thin repository automation

tooling/
    engineering/build tooling

tests/
    system-level tests only when genuinely cross-cutting
```

Do not materialize empty future source trees merely to mirror architecture documentation.

Create directories only when implementation requires them.

---

## 5. Ownership

Every important concept has one canonical owner.

Canonical ownership controls:

- semantics
- validation
- mutation
- lifecycle
- persistence meaning
- public contracts

Shared use does not imply shared ownership.

A shared database does not imply shared ownership.

A foreign key does not grant mutation authority.

Cross-owner mutations must go through the canonical owner's public mutation contract.

Do not directly mutate another capability's tables or persistence internals.

---

## 6. Dependency Rules

A capability may depend on another capability only through deliberately exposed public contracts unless both belong to the same ownership boundary.

Do not:

- deep-import another capability's internals
- import another capability's repositories
- import another capability's ORM models
- use dependency injection to hide an illegal dependency
- use dynamic imports to hide an illegal dependency
- use a service locator to bypass boundaries
- solve architectural cycles with framework workarounds

Circular capability architecture is forbidden by default.

If a cycle appears, stop and review ownership and dependency direction.

---

## 7. Universe Rules

A Universe is a configured/domain-specialized world inside AI World.

A Universe is not automatically:

- a separate application
- a separate database
- a separate service
- a separate deployment
- a tenant
- a category

Shared Platforms, Kernel capabilities, and Foundations must never depend on a named Universe implementation.

Forbidden examples in shared core code:

```text
if anime
if history
switch(universeKey)
case "anime"
case "history"
```

Universe-specific behavior must normally be represented through:

1. configuration
2. typed definitions
3. shared capability
4. bounded strategy/policy
5. typed extension only when genuinely required

The architectural target is that new Universes require zero shared-core modifications.

Do not use that target as justification for speculative generalization.

---

## 8. Extension Rules

Extension preference order:

```text
configuration
    ↓
typed definition
    ↓
shared capability
    ↓
strategy / policy
    ↓
typed extension
```

Provider adapters represent technical variability and are separate from Universe extensions.

Extension contracts are owned by the capability being extended.

Concrete extensions depend on the host contract.

The host capability must not import the concrete extension implementation.

Registration belongs at controlled composition/bootstrap boundaries.

Do not introduce:

- arbitrary runtime scripting
- arbitrary plugin loading
- global service locators
- universal `execute(any): any` extension interfaces
- hidden import-order behavior
- generic before/after hooks everywhere

Third-party plugin architecture is not part of the initial platform.

---

## 9. Foundation Rules

Foundations provide reusable technical infrastructure.

They must remain domain-neutral.

Foundations must not contain Anime, History, User, Knowledge, Media, CMS, or other higher-level product semantics.

Examples include:

- Configuration
- Database
- Migration
- Storage
- Cache
- Queue
- Scheduler
- Email
- Observability
- Feature Flags

Do not build a Foundation until a real consumer requires it.

---

## 10. Platform Kernel Rules

The Platform Kernel owns small, stable, universal semantics.

Canonical Kernel areas include:

- Identifiers
- Namespace
- Taxonomy
- Metadata
- Relationships
- Events
- Audit
- Workflow
- Policy
- Localization
- Versioning

Do not place a concept in Kernel merely because multiple files use it.

Kernel must remain Universe-neutral.

Only implement Kernel capabilities when real consumers require them.

---

## 11. Platform Rules

Platforms own reusable business/product capabilities.

Canonical Platforms include:

- Identity & Access
- User
- Knowledge
- Media
- Discovery
- AI / Creator
- Composition / CMS
- Engagement
- Operations

Platforms may depend on:

- Kernel public contracts
- Foundations
- selected peer Platform public contracts where semantically justified

Platforms must not depend on named Universe implementations.

Peer Platform dependencies must remain narrow, public, intentional, and acyclic.

---

## 12. Identity Terminology

Do not confuse:

```text
Identity
```

with:

```text
Identifier
```

Identity & Access owns human/machine security identity, authentication, sessions, credentials, roles, permissions, and authorization.

Identifiers Kernel owns canonical resource identifier semantics.

User Platform owns product User profile/preferences.

---

## 13. Data and Persistence

PostgreSQL is the initial canonical operational database.

Prisma is the accepted initial ORM/data-access implementation.

Prisma models are persistence representations.

They are not canonical public Domain Models.

Do not expose Prisma-generated types through:

- public Platform contracts
- external APIs
- Universe contracts
- frontend contracts

Do not create generic CRUD repositories merely to wrap Prisma.

Raw SQL is allowed only within appropriately owned persistence/Discovery implementations and must respect ownership and security.

---

## 14. API and Application Boundaries

The initial API is REST/JSON with OpenAPI.

`apps/api` is a delivery/runtime boundary.

It must not become the canonical owner of all business logic.

`apps/web` is a delivery Application.

It must not directly mutate canonical database state through Prisma.

Default Web-to-backend flow:

```text
Web
    → API
    → owning Platform
```

Transport DTOs, persistence models, and Domain Models are distinct concerns.

---

## 15. Technology Baseline

Accepted initial baseline:

- TypeScript
- Node.js Active LTS
- pnpm
- Turborepo
- NestJS
- Next.js
- React
- Tailwind CSS
- REST / JSON
- OpenAPI
- Zod
- PostgreSQL
- Prisma
- Prisma Migrate
- Vitest
- Supertest
- Playwright
- Pino
- OpenTelemetry direction
- Docker
- Docker Compose
- GitHub Actions

Do not substitute major accepted technologies without explicit instruction and architectural justification.

---

## 16. Deferred / Not-Initial Technologies

Do not introduce the following merely because they are common:

- Redis
- Kafka
- RabbitMQ
- Elasticsearch
- OpenSearch
- Meilisearch
- dedicated vector database
- MongoDB
- Neo4j
- Temporal
- Kubernetes
- service mesh
- microservices-first architecture
- GraphQL
- tRPC
- event sourcing
- dedicated CQRS framework
- multi-provider AI routing
- public plugin runtime

These require demonstrated requirements and, where appropriate, an ADR.

PostgreSQL should satisfy reasonable persistence/search requirements before introducing additional data infrastructure.

---

## 17. Provider Isolation

External provider SDKs must remain at controlled adapter boundaries.

Examples:

```text
Storage provider
    → Storage Foundation adapter

Email provider
    → Email Foundation adapter

AI provider
    → AI / Creator adapter

Search provider
    → Discovery adapter
```

Do not expose provider:

- SDK types
- errors
- identifiers
- request objects
- response objects

through canonical AI World contracts.

---

## 18. AI Rules

AI / Creator owns AI execution semantics.

Universes may configure domain-specific AI behavior through approved contracts.

Universe code must not directly import AI provider SDKs.

AI output is not automatically canonical truth.

Canonical target owners must validate/accept generated output before it becomes canonical state.

AI must consume canonical AI World models and public contracts rather than creating a parallel data architecture.

---

## 19. Search and Derived State

Discovery owns Search semantics.

Knowledge remains owner of canonical Knowledge resources.

Search indexes, caches, analytics projections, and similar structures are derived state unless explicitly documented otherwise.

Do not treat Search or Cache as canonical source of truth.

---

## 20. Media and Storage

Media owns Asset semantics and lifecycle.

Storage Foundation owns binary object-storage mechanics.

Do not make Storage the owner of Media Assets.

Runtime uploads must not become permanent files inside application source directories.

---

## 21. Configuration

Configuration must be:

- typed
- validated
- scoped
- owned

Zod is the accepted runtime validation baseline.

Do not scatter direct `process.env` reads through business code.

Do not turn configuration into arbitrary executable scripting.

---

## 22. Code Organization

Prefer capability-first organization.

Avoid repository-wide dumping grounds named:

- common
- shared
- utils
- helpers
- services
- models
- repositories
- core

If genuinely reusable code emerges, give it a coherent architectural owner and meaningful name.

Do not create a package merely to match an architecture diagram.

---

## 23. Public Surfaces

Substantial reusable packages must expose deliberate public surfaces.

Do not export every source file.

Do not cross package boundaries using deep relative imports.

Internal implementation must remain internal unless intentionally promoted into a public contract.

---

## 24. Type Safety

Use strict TypeScript.

Avoid uncontrolled `any`.

Prefer:

- explicit Domain types
- `unknown` at unsafe boundaries
- runtime validation
- narrow conversion after validation

Do not use type assertions merely to silence real modeling problems.

---

## 25. Testing

Tests belong as close as practical to the capability that owns the behavior.

Use:

- Vitest for fast TypeScript tests
- Supertest for HTTP/API tests
- Playwright for browser E2E
- real PostgreSQL integration tests where persistence correctness matters
- Testcontainers where valuable

Do not rely entirely on mocked database behavior for important persistence semantics.

Critical authentication, authorization, security, data-integrity, and ownership paths require meaningful tests.

---

## 26. Observability

Use structured logging.

Pino is the accepted initial logging technology.

Do not log:

- passwords
- access tokens
- session secrets
- API keys
- private credentials
- unnecessary sensitive personal data

Use correlation/request context where appropriate.

---

## 27. Git Safety

Unless the user explicitly requests otherwise:

Do not:

- commit
- push
- force push
- amend commits
- reset
- checkout/discard user changes
- run `git clean`
- rewrite history
- delete branches
- change remotes

Never use destructive Git operations merely to make the working tree convenient.

Preserve unrelated user changes.

---

## 28. File Editing Safety

Before modifying files:

1. inspect current repository state
2. inspect the relevant files
3. identify pre-existing user changes
4. respect task scope

Do not modify unrelated files.

If a task allows changes to only specific files, treat that list as strict.

If a required change falls outside the allowed scope, stop and report it.

---

## 29. Dependency Safety

Do not add dependencies unless the current task explicitly requires them.

Before adding a dependency, determine:

- which capability owns its use
- why existing stack capabilities are insufficient
- whether it leaks into public contracts
- whether it adds infrastructure or provider coupling

Do not upgrade unrelated dependencies during a scoped implementation task.

Keep lockfile changes attributable to explicit package operations.

---

## 30. Windows Development

This repository is currently developed on Windows.

When PowerShell execution policy blocks `pnpm.ps1`, prefer:

```text
pnpm.cmd
```

rather than changing the user's system execution policy unless explicitly requested.

Avoid fragile multiline CMD `echo` generation for source/configuration files.

Edit files directly.

---

## 31. Codex Working Protocol

For implementation tasks, use this default sequence:

```text
inspect
    ↓
plan within requested scope
    ↓
edit
    ↓
format where relevant
    ↓
typecheck/lint/test/build as relevant
    ↓
run git diff --check
    ↓
inspect repository diff/status
    ↓
report
```

Do not declare success merely because files were written.

Validate the result.

---

## 32. Validation Protocol

Run the smallest meaningful validation set for the task.

Examples:

Configuration change:

```text
parse configuration
run relevant tool validation
git diff --check
```

TypeScript change:

```text
typecheck
relevant tests
lint
git diff --check
```

Application change:

```text
typecheck
tests
build where practical
git diff --check
```

Do not run expensive unrelated suites without reason.

---

## 33. Diff Review

Before reporting completion:

- inspect `git status`
- inspect changed files
- inspect the diff where tracked files permit it
- verify no unrelated file was modified
- verify no generated/runtime file was accidentally introduced
- verify no architecture boundary was bypassed

Untracked new files must be inspected directly because ordinary `git diff` may not display them.

---

## 34. Stop Conditions

Stop and report instead of improvising when:

- repository state conflicts with task assumptions
- architecture documentation conflicts with requested implementation
- a required modification falls outside task scope
- a destructive operation appears necessary
- ownership is ambiguous
- a dependency cycle appears
- a new infrastructure technology appears necessary
- a migration may destroy or rewrite meaningful data
- unexpected user changes would be overwritten

Ask for direction rather than hiding the issue.

---

## 35. Documentation Discipline

Canonical architecture documentation under `docs/` must not be modified merely to make an implementation task easier.

If implementation demonstrates that architecture should change, report the mismatch.

Architecture changes should follow governance and ADR/document update processes.

Do not duplicate canonical architecture documents into source READMEs.

---

## 36. Roadmap Discipline

The authoritative implementation sequence is:

`docs/13-roadmaps/master-roadmap.md`

Do not independently advance future phases.

Implement only the capability/milestone requested by the current task.

A later capability may be pulled forward only when explicitly approved.

---

## 37. Implementation Philosophy

Prefer:

```text
small coherent changes
over
large speculative scaffolding

working vertical slices
over
empty framework structures

explicit ownership
over
convenient coupling

simple infrastructure
over
premature distributed systems

typed semantics
over
generic key/value modeling

controlled extension
over
core forks
```

---

## 38. Completion Reporting

For substantial implementation tasks, final reports should include:

1. files created
2. files modified
3. important implementation decisions
4. commands/validations run
5. pass/fail status
6. repository `git status` summary
7. remaining warnings, debt, or blockers
8. explicit confirmation that no commit/push occurred unless requested

Be precise.

Do not hide validation failures.
