# AI World Platform Principles

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Platform Principles |
| Document ID | P0-D04 |
| Area | Vision |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Foundational Platform Principles |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md` |

---

# 1. Purpose

This document defines the practical principles that govern how **AI World** must be designed, implemented, extended, reviewed, and evolved.

The Project Charter defines the fundamental project contract.

The Vision defines the destination.

The Mission defines the ongoing purpose.

This document defines the **decision rules** used while building the platform.

These principles apply to:

- architecture,
- platforms,
- Foundations,
- Platform Kernel capabilities,
- Universes,
- backend systems,
- frontend systems,
- APIs,
- data models,
- AI systems,
- media systems,
- infrastructure,
- integrations,
- testing,
- operations,
- documentation.

When several technically valid solutions exist, these principles should help determine which one is most compatible with AI World's long-term architecture.

---

# 2. Platform Principle Model

AI World follows a hierarchy of concerns:

```text
PROJECT CHARTER
        ↓
VISION
        ↓
MISSION
        ↓
PLATFORM PRINCIPLES
        ↓
ARCHITECTURE
        ↓
CAPABILITY SPECIFICATIONS
        ↓
IMPLEMENTATION
```

Implementation must not casually contradict higher-level principles.

If a real requirement requires an exception, the exception must be deliberate.

---

# 3. Principle 1 — Platform Before Universe

AI World must be designed as a reusable platform before being optimized for one specific Universe.

The architecture should ask:

```text
What capability does the platform need?
```

before asking:

```text
What special code does this Universe need?
```

A Universe may define domain-specific content and behavior, but general platform concerns must remain shared.

---

# 4. Practical Consequence

Avoid:

```text
AnimeAuthentication

HistoryAuthentication

NatureAuthentication
```

Prefer:

```text
Identity & Access Platform
        ↓
Anime
History
Nature
```

Avoid:

```text
AnimeMediaService

HistoryMediaService
```

Prefer:

```text
Media Platform
```

with reusable media contracts.

---

# 5. Principle 2 — Build Once, Reuse Where Appropriate

A capability should be implemented once when the capability is logically shared.

Examples:

```text
Authentication

Authorization

Storage

Media

Metadata

Taxonomy

Relationships

Events

Search

AI Gateway

Notifications
```

should not be reimplemented independently by multiple consumers without a strong reason.

---

# 6. Reuse Does Not Mean Forced Sharing

Not every similar-looking feature should become shared infrastructure.

Two concepts may appear similar while having different invariants.

Reuse is appropriate when:

```text
ownership is coherent

contracts are stable

semantics are shared

consumers genuinely need the same behavior
```

Do not create shared abstractions merely to remove a few duplicated lines of code.

---

# 7. Principle 3 — Capability Before Module

AI World architecture is defined around capabilities.

Folders and modules are implementation structures.

Examples of capabilities:

```text
Authenticate Actor

Authorize Action

Store Asset

Classify Resource

Relate Resources

Publish Event

Execute Workflow

Search Knowledge

Generate Content
```

The architecture should remain understandable even if implementation modules are reorganized later.

---

# 8. Principle 4 — Explicit Capability Classification

Every major capability must be classified as one of:

```text
FOUNDATION

PLATFORM KERNEL

PLATFORM

UNIVERSE
```

The classification determines:

- ownership,
- expected stability,
- dependency direction,
- extensibility expectations,
- acceptable domain knowledge.

---

# 9. Foundation Definition

A Foundation provides reusable technical infrastructure.

Examples:

```text
Configuration

Database

Repository infrastructure

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

Foundations should normally remain independent of Universe-specific concepts.

---

# 10. Platform Kernel Definition

The Platform Kernel contains broadly reusable semantic concepts.

Initial areas include:

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

Kernel capabilities require particularly careful design because many Platforms may depend on them.

---

# 11. Platform Definition

A Platform owns a major reusable business capability.

Examples:

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

Platforms may consume Foundations and Kernel capabilities.

---

# 12. Universe Definition

A Universe represents a configured world/domain using the shared platform.

A Universe may define:

```text
domain schemas

taxonomy

metadata

relationships

workflows

policies

content

AI configuration

presentation

controlled extensions
```

but should not recreate infrastructure owned elsewhere.

---

# 13. Principle 5 — Clear Ownership

Every major capability must have exactly one primary owner.

Every important persisted business resource must also have clear ownership.

Ownership means responsibility for:

```text
definition

business invariants

lifecycle

persistence

mutation rules

public contracts

events

security behavior
```

Multiple consumers may use data.

That does not imply multiple owners.

---

# 14. Ownership Questions

Every new capability must answer:

```text
Who owns this concept?

Who may create it?

Who may change it?

Who controls its lifecycle?

Where is it stored?

What public contract exposes it?

What events describe its important changes?
```

If ownership cannot be answered clearly, implementation should stop until the boundary is understood.

---

# 15. Principle 6 — One Source of Truth

Important business concepts should have one canonical source of truth.

Examples:

```text
Knowledge data
    → Knowledge Platform

Asset metadata
    → Media Platform

Roles and Permissions
    → Identity & Access Platform

User profile
    → User Platform
```

Derived systems may copy or index representations.

They do not become canonical owners.

---

# 16. Principle 7 — Derived State Must Be Recognizable

Systems such as:

```text
search indexes

caches

analytics projections

recommendation indexes

generated previews
```

should be clearly classified as derived state when applicable.

Derived state should ideally be reconstructable from authoritative state.

---

# 17. Principle 8 — Explicit Dependencies

Dependencies must be intentional and visible.

Avoid architectures that depend on:

```text
global mutable state

hidden service locators

arbitrary internal imports

direct table modification across modules

runtime lookup by naming convention
```

unless explicitly justified.

---

# 18. Principle 9 — Dependency Direction Matters

Dependencies should generally flow from higher-level capabilities toward lower-level reusable capabilities.

Conceptually:

```text
Universe
    ↓
Platforms
    ↓
Platform Kernel
    ↓
Foundations
```

Lower-level Foundations must not depend on high-level Universe behavior.

---

# 19. Invalid Dependency Example

Avoid:

```text
Storage Foundation
        ↓
Anime Universe
```

or:

```text
Database Foundation
        ↓
Knowledge CMS controller
```

Generic infrastructure should not require knowledge of specific product behavior.

---

# 20. Principle 10 — Encapsulation

Every major capability should expose a deliberate public surface.

Consumers should depend on public contracts rather than internal implementation.

Conceptually:

```text
Capability
│
├── public contracts
├── public application services
├── public events
│
└── internal
    ├── repositories
    ├── persistence
    ├── adapters
    ├── utilities
    └── private implementation
```

---

# 21. Principle 11 — Do Not Reach Into Another Capability's Internals

Avoid:

```text
Module A
    imports
Module B/internal/repository
```

or:

```text
Module A
    directly updates
Module B's tables
```

Preferred interaction:

```text
public contract

application service

command

query interface

event
```

depending on the use case.

---

# 22. Principle 12 — Generic Does Not Mean Dynamic Everything

AI World must remain configurable without becoming structurally untyped.

Avoid using:

```text
arbitrary JSON
generic key/value tables
uncontrolled metadata
runtime reflection
```

as substitutes for proper domain models.

Preferred model:

```text
GENERIC PRIMITIVE
+
TYPED CONTRACT
+
VALIDATED CONFIGURATION
+
CONTROLLED EXTENSION
```

---

# 23. Principle 13 — Typed Core, Extensible Edge

Core platform behavior should remain strongly typed.

Variability should be introduced at controlled edges.

Examples:

```text
typed provider contract
        +
multiple provider implementations

typed metadata schema
        +
Universe-specific definitions

typed workflow engine
        +
configurable workflows
```

---

# 24. Principle 14 — Configuration Where Variability Is Data

Use configuration when behavior differences are naturally declarative.

Examples:

```text
enabled entity types

available workflow

ranking weights

provider selection

feature availability

presentation settings
```

Configuration should not become a programming language.

---

# 25. Principle 15 — Code Where Variability Is Behavior

When behavior requires complex:

```text
algorithms

domain invariants

security rules

transaction handling

external orchestration
```

proper implementation code is preferable to excessive configuration.

---

# 26. Principle 16 — Extension Where Configuration Is Insufficient

When genuine domain-specific behavior exists, use controlled extension points.

Examples:

```text
provider adapter

workflow action

media processor

AI tool

presentation block

Universe extension
```

Extensions must have explicit contracts.

---

# 27. Principle 17 — Extension Before Core Modification

When adding a new Universe or provider, prefer:

```text
registration

configuration

adapter

extension
```

before modifying core platform logic.

Frequent core modifications for new consumers indicate weak extensibility.

---

# 28. Principle 18 — Avoid Core Universe Switches

Patterns such as:

```ts
switch (universe) {
  case 'anime':
  case 'history':
  case 'nature':
}
```

should not be the primary architecture.

Universe-specific behavior should normally be represented through:

```text
configuration

schemas

policies

registries

typed extensions
```

---

# 29. Principle 19 — Stable Concepts Outlive Technologies

Domain concepts must not be defined by current implementation tools.

AI World should understand:

```text
Asset
Entity
Universe
Permission
Relationship
Workflow
Generation
```

independently from technologies used to store or process them.

---

# 30. Principle 20 — Technology Is Replaceable

Technology should be chosen intentionally but treated as replaceable where practical.

Possible future changes may include:

```text
ORM replacement

database migration

frontend framework replacement

AI provider replacement

search-engine replacement

queue replacement

storage replacement
```

Meaningful boundaries should reduce the cost of these changes.

---

# 31. Principle 21 — Avoid Technology Leaking Into Domain Contracts

Avoid defining domain contracts in terms of:

```text
Prisma models

ORM-specific types

provider SDK objects

database rows

cloud provider response objects
```

unless the contract intentionally belongs to that infrastructure layer.

---

# 32. Principle 22 — Canonical Business Data Belongs to AI World

External systems may process data, but canonical business data must remain under platform ownership where practical.

Examples:

```text
AI provider response
    ≠ canonical knowledge automatically

Search index
    ≠ canonical entity storage

CDN URL
    ≠ Asset identity

Analytics profile
    ≠ User identity
```

---

# 33. Principle 23 — Stable Identifiers

Long-lived resources should use identifiers that survive implementation changes.

Identifiers should avoid unnecessary dependence on:

```text
URLs

database table names

storage paths

frontend routes

provider identifiers
```

External provider identifiers may exist as mappings.

They should not automatically become canonical platform identity.

---

# 34. Principle 24 — Namespaces Prevent Collision

Shared concepts such as:

```text
permissions

events

metadata keys

relationship types

capabilities
```

should use clear namespace strategies when collision becomes possible.

Namespace design must remain:

```text
stable
readable
predictable
versionable where required
```

---

# 35. Principle 25 — API Contracts Are Product Assets

APIs are not controller implementation details.

Public API design should consider:

```text
consumer needs

ownership

security

versioning

errors

pagination

compatibility

performance
```

Persistence models should not be exposed automatically.

---

# 36. Principle 26 — Events Are Contracts

Events that cross capability boundaries are long-lived contracts.

Events should describe meaningful facts.

Prefer:

```text
EntityPublished

AssetProcessed

UserRegistered
```

Avoid:

```text
DoSomethingNow

CallServiceX

RefreshThisTable
```

---

# 37. Principle 27 — Commands and Events Are Different

Conceptually:

```text
Command
    asks for something to happen

Event
    records that something happened
```

Do not misuse events as indirect RPC.

---

# 38. Principle 28 — Synchronous vs Asynchronous Is Intentional

Use synchronous interaction when:

```text
the caller requires an immediate result

consistency is required

the operation belongs to one request boundary
```

Use asynchronous interaction when:

```text
work is long-running

consumers can react independently

eventual consistency is acceptable

side effects should be decoupled
```

Do not use async architecture merely because queues are fashionable.

---

# 39. Principle 29 — Transaction Boundaries Belong to Business Operations

Transactions should normally be controlled at the application/use-case level where multiple writes form one atomic operation.

Avoid having individual repositories independently create transaction semantics that conflict with larger business operations.

---

# 40. Principle 30 — Cross-System Atomicity Is Not Assumed

A database transaction cannot automatically roll back:

```text
email

AI provider calls

search indexing

object storage

external APIs
```

Architectures involving irreversible external side effects must explicitly define consistency strategy.

---

# 41. Principle 31 — Side Effects Need Coordination

When database state and external side effects are related, evaluate patterns such as:

```text
transactional outbox

background delivery

idempotent handlers

reconciliation
```

when requirements justify them.

Do not introduce these patterns automatically before they are needed.

---

# 42. Principle 32 — Idempotency Where Retries Are Possible

Operations that may be repeated must define idempotency behavior where appropriate.

Examples:

```text
webhooks

job processing

migration execution

external callbacks

event consumers

AI completion callbacks
```

---

# 43. Principle 33 — Fail Explicitly

Correctness failures should not disappear silently.

Prefer:

```text
explicit error

clear status

structured log

metric/alert where appropriate
```

over silently ignoring invalid state.

---

# 44. Principle 34 — Fail Safely

When failure occurs, the system should preserve:

```text
security

data integrity

consistent ownership

recoverability
```

before convenience.

---

# 45. Principle 35 — Retry Only What Is Retryable

Automatic retry is appropriate for transient failures.

It may be dangerous for deterministic failures.

The system should distinguish between:

```text
timeout

temporary network error

provider rate limit
```

and:

```text
invalid input

permission denial

business invariant violation
```

---

# 46. Principle 36 — Graceful Degradation Where Appropriate

Failure of optional capability should not automatically break unrelated critical capability.

Example:

```text
Recommendation service failure
```

should not necessarily prevent:

```text
basic knowledge retrieval.
```

Criticality must be explicit.

---

# 47. Principle 37 — Security Is Architectural

Security is not a final checklist.

Every capability should consider:

```text
actor

authorization

input trust

data exposure

secrets

abuse

audit

failure behavior
```

during design.

---

# 48. Principle 38 — Authentication Is Not Authorization

Authentication answers:

```text
Who is the actor?
```

Authorization answers:

```text
May this actor perform this action?
```

The platform must not confuse the two.

---

# 49. Principle 39 — Frontend Is Not a Security Boundary

Hiding UI elements does not secure an operation.

Authorization must be enforced by trusted backend/platform boundaries.

---

# 50. Principle 40 — Least Privilege

Actors should receive the minimum capability needed for their role.

This applies to:

```text
users

administrators

services

workers

AI agents

automation

external integrations
```

---

# 51. Principle 41 — Security Applies to Machine Actors

Background jobs, service accounts, and AI agents must not become privileged bypasses around platform authorization.

Their permissions and identities should be explicit when relevant.

---

# 52. Principle 42 — Privacy by Design

Personal data should be collected only when justified.

Capabilities involving user data should consider:

```text
collection

access

visibility

retention

deletion

consent

export
```

where requirements apply.

---

# 53. Principle 43 — Secrets Are Never Normal Configuration

Secrets must not be:

```text
committed to source control

placed in public documentation

embedded in application code
```

Secrets management is an operational/security concern.

---

# 54. Principle 44 — Audit Is Not Logging

Logs primarily support diagnosis and operations.

Audit supports accountability.

Audit may answer:

```text
who changed what

when

from which actor/context
```

while logs may answer:

```text
what happened inside the process
```

These concerns must remain distinct.

---

# 55. Principle 45 — Structured Logging

Logs should increasingly be structured and machine-searchable.

Important contextual fields may include:

```text
request ID

correlation ID

actor ID

resource ID

capability

operation

error code
```

without leaking sensitive information.

---

# 56. Principle 46 — Observability Is Part of Production Readiness

Important capabilities should become observable through appropriate:

```text
logs

metrics

traces

health indicators

alerts
```

before being considered production-ready.

---

# 57. Principle 47 — Health and Readiness Are Different Concepts

A running process is not necessarily ready to serve traffic.

Future operational design should distinguish:

```text
liveness

readiness

dependency health
```

where deployment architecture requires it.

---

# 58. Principle 48 — Data Integrity Before Convenience

Database constraints and business invariants should protect important state.

Avoid relying only on application convention when persistence can enforce critical guarantees.

---

# 59. Principle 49 — Validate at Boundaries

Untrusted input must be validated at system boundaries.

Examples:

```text
API requests

event payloads

external provider responses

file uploads

configuration

AI tool inputs
```

Internal code may rely on stronger invariants once boundary validation has occurred.

---

# 60. Principle 50 — Domain Invariants Belong to Owners

Validation such as:

```text
valid email shape
```

may be generic.

Rules such as:

```text
published Entity cannot transition directly to Draft
```

belong to the owning capability.

Do not scatter domain invariants throughout controllers, repositories, and helpers.

---

# 61. Principle 51 — Persistence Models Are Not API Models

Database models optimize persistence.

API contracts optimize consumers.

The two may overlap but should not be automatically identical.

---

# 62. Principle 52 — Repositories Encapsulate Persistence

Where repository abstraction provides architectural value, repositories should encapsulate persistence behavior.

Repositories should not become:

```text
business services

authorization engines

workflow coordinators
```

Their responsibility remains persistence-focused.

---

# 63. Principle 53 — Do Not Abstract the Database Without Reason

A repository layer should protect domain ownership and persistence boundaries.

It should not merely rename every ORM method without adding architectural value.

Use abstractions deliberately.

---

# 64. Principle 54 — Schema Evolution Is Historical

Persistent schema changes are historical system evolution.

Database migrations must be:

```text
reviewed

reproducible

ordered

safe

version-controlled
```

according to technology strategy.

---

# 65. Principle 55 — Application Data Evolution Is Separate

Database schema evolution and application data evolution are different concerns.

Conceptually:

```text
Schema Migration
    → structure

Application Migration
    → one-time historical application/data change

Seed
    → intentional environment/reference population
```

The final implementations will be defined later.

---

# 66. Principle 56 — Seed Data Is Not Production History

Seed mechanisms must not be used to fake application migration history.

Likewise migrations should not become general development fixture systems.

---

# 67. Principle 57 — Historical State Must Be Respected

Important historical artifacts such as:

```text
migration history

audit records

published revisions

provenance
```

should not be casually modified after they become authoritative.

---

# 68. Principle 58 — Cache Is an Optimization

Cache should not silently become canonical business state.

The system must define:

```text
source of truth

expiration

invalidation

failure behavior
```

before relying on cache for correctness-sensitive behavior.

---

# 69. Principle 59 — Search Is Derived

Search indexes should normally represent canonical resources.

Search should not independently become the authoritative owner of Knowledge Platform state.

---

# 70. Principle 60 — Analytics Is Derived

Analytics systems may contain projections and aggregates.

They should not quietly become primary business persistence.

---

# 71. Principle 61 — Media Has One Shared Ownership Model

Media should not be embedded independently into every capability.

Domains should reference Media Platform resources through deliberate contracts.

---

# 72. Principle 62 — Storage Is Not Media

Storage answers:

```text
Where/how are bytes stored?
```

Media answers:

```text
What is this asset?
How is it processed?
How is it used?
What variants exist?
```

Storage is infrastructure.

Media is a Platform capability.

---

# 73. Principle 63 — AI Provider Is Not AI Platform

An AI SDK integration is not an AI Platform.

The AI Platform should eventually own concepts such as:

```text
providers

models

routing

prompts

generation

usage

safety

provenance

evaluation
```

as requirements emerge.

---

# 74. Principle 64 — AI Must Respect Platform Security

AI tools must not gain unrestricted access to:

```text
user data

administrative operations

private content

external actions
```

simply because they are automated.

AI capabilities must follow platform authorization and policy.

---

# 75. Principle 65 — AI Output Is Not Automatically Truth

Generated output may be:

```text
suggestion

draft

derived content

creative material
```

depending on the workflow.

Generated data should enter canonical state only through appropriate ownership and validation mechanisms.

---

# 76. Principle 66 — Provenance Where Risk Justifies It

For important AI-created or transformed content, preserve sufficient information to understand origin.

Potential provenance may include:

```text
provider

model

prompt/template

source context

generation time

human review
```

The required detail depends on risk and product needs.

---

# 77. Principle 67 — AI Model Selection Is Policy

Domain modules should request capabilities such as:

```text
summarize

generate image

classify

extract metadata
```

instead of hard-coding provider/model names everywhere.

Routing architecture should be introduced when real multi-model requirements exist.

---

# 78. Principle 68 — Cost Is a Design Constraint

AI and infrastructure usage may create meaningful cost.

Capabilities should permit future:

```text
measurement

quotas

routing

optimization

usage attribution
```

without compromising correctness or safety.

---

# 79. Principle 69 — Work That Takes Long Belongs Outside Request Lifecycles

Potential candidates:

```text
video processing

AI generation

large indexing

bulk import

large exports

notification delivery
```

should use background execution when synchronous request handling is inappropriate.

---

# 80. Principle 70 — Jobs Need Explicit State

Long-running jobs may require explicit states such as:

```text
PENDING

RUNNING

SUCCEEDED

FAILED

CANCELLED
```

when business or operational requirements need them.

Do not model asynchronous work only through ephemeral process logs.

---

# 81. Principle 71 — Scheduler Is Not Queue

A scheduler decides:

```text
when work should begin
```

A queue coordinates:

```text
how asynchronous work is delivered/executed
```

The two may integrate but are conceptually different.

---

# 82. Principle 72 — Frameworks Must Earn Their Existence

Do not turn every reusable service into a Framework.

A Framework is justified when it provides:

```text
clear lifecycle

reusable contracts

multiple consumers

consistent extensibility

shared infrastructure behavior
```

Otherwise a module or service may be sufficient.

---

# 83. Principle 73 — No Framework Without Real Need

Do not create:

```text
Plugin Framework

Rule Framework

Notification Framework

AI Workflow Framework
```

only because the concepts may someday be useful.

Introduce infrastructure when a real or near-term capability requires it.

---

# 84. Principle 74 — Common Is Not Ownership

Code should not live in `common` merely because its owner is unclear.

If logic has domain meaning, move it to the appropriate capability.

If logic is genuinely cross-cutting, give it a precise architectural responsibility.

---

# 85. Principle 75 — Utilities Must Stay Small

Utility code should generally be:

```text
stateless

deterministic

focused

domain-neutral where shared
```

When utilities accumulate business behavior, they should become owned services or modules.

---

# 86. Principle 76 — Modular Monolith First Unless Evidence Says Otherwise

The initial backend should prefer strong modular boundaries within a simpler deployment architecture.

Microservices should not be adopted for prestige or perceived scale.

A capability may later be extracted when justified by:

```text
independent scaling

runtime isolation

security

deployment independence

team ownership

specialized technology
```

---

# 87. Principle 77 — Logical Boundaries Before Physical Distribution

A poor module does not become better by turning it into a network service.

First establish:

```text
ownership

contracts

data boundaries

dependency rules
```

Then consider separate deployment if needed.

---

# 88. Principle 78 — Minimize Infrastructure Count

Each database, queue, cache, search engine, and infrastructure service adds:

```text
deployment burden

monitoring burden

security surface

failure modes

cost
```

New infrastructure must solve a demonstrated requirement.

---

# 89. Principle 79 — Prefer Mature Infrastructure for Commodity Problems

AI World's differentiation should come primarily from:

```text
platform model

knowledge architecture

Universe model

AI-enabled experiences

creator capabilities
```

rather than unnecessarily reinventing commodity infrastructure.

---

# 90. Principle 80 — Architecture Must Permit Evolution

Avoid hard-coded choices that make future migration prohibitively difficult.

But do not add abstraction layers for every imaginable replacement.

Balance:

```text
current simplicity
+
meaningful future seams
```

---

# 91. Principle 81 — Documentation Is a First-Class Artifact

Architecture that exists only in someone's memory does not scale.

Important decisions should be documented in canonical locations.

Documentation must be updated when significant architecture changes.

---

# 92. Principle 82 — One Canonical Document Per Concern

Avoid duplicate authoritative documentation.

For example:

```text
Master Roadmap
    → delivery sequence

ADR
    → architectural decision

Platform Architecture
    → system structure

Capability Specification
    → capability responsibility
```

Supporting documents should link to these rather than redefine them.

---

# 93. Principle 83 — Documentation Status Must Be Explicit

Documents should use controlled statuses such as:

```text
DRAFT

PROPOSED

ACCEPTED

IMPLEMENTED

VALIDATED

CLOSED

DEPRECATED
```

A design document marked ACCEPTED does not automatically mean the capability is implemented.

---

# 94. Principle 84 — Code Status Must Be Explicit

A folder existing is not evidence that a capability is complete.

Capability maturity should distinguish states such as:

```text
PLANNED

IMPLEMENTED

INTEGRATED

TESTED

VALIDATED

CLOSED
```

---

# 95. Principle 85 — Definition of Done Is Capability-Specific

A major capability may require:

```text
architecture

implementation

tests

security review

documentation

operational validation
```

before closure.

Small internal changes may use lighter requirements.

Process must remain proportional.

---

# 96. Principle 86 — Test Behavior, Not Implementation Shape

Tests should protect externally meaningful behavior and invariants.

Avoid test suites that fail merely because harmless internal refactoring occurred.

---

# 97. Principle 87 — Use the Right Testing Layer

Use:

```text
unit tests
```

for isolated logic.

Use:

```text
integration tests
```

for database/framework interactions.

Use:

```text
contract tests
```

for long-lived interfaces.

Use:

```text
end-to-end tests
```

for critical system workflows.

Do not force every component to have every test type.

---

# 98. Principle 88 — Quality Gates Must Be Automated

Where practical, important quality checks should run automatically.

Examples:

```text
formatting

linting

type checking

tests

build

dependency validation

security scanning
```

---

# 99. Principle 89 — Production Readiness Is More Than Passing Tests

A capability may work locally yet still lack:

```text
monitoring

backup strategy

failure handling

security review

deployment procedure

capacity understanding
```

Production readiness must be evaluated explicitly.

---

# 100. Principle 90 — Local Development Must Be Reproducible

The platform should evolve toward:

```text
clone
        ↓
install
        ↓
start dependencies
        ↓
configure
        ↓
migrate
        ↓
seed
        ↓
run
```

through documented and automated commands.

---

# 101. Principle 91 — Environment Differences Must Be Intentional

Avoid environments behaving differently due to accidental configuration.

Differences between:

```text
local

test

development

staging

production
```

must be documented and controlled.

---

# 102. Principle 92 — Production Must Not Depend on Developer Machines

No production workflow should rely on:

```text
local filesystem state

developer-specific scripts

manually edited database rows

undocumented commands
```

for normal operation.

---

# 103. Principle 93 — Automate Repeated Operations

Repetitive operational processes should become scripts, tooling, or CI/CD steps when automation improves safety.

Do not automate one-time or ambiguous processes purely for automation's sake.

---

# 104. Principle 94 — Version Long-Lived Contracts

APIs, events, schemas, or extension interfaces with broad consumers should have compatibility strategies.

Possible strategies:

```text
backward-compatible evolution

explicit versions

deprecation windows

migration tooling
```

---

# 105. Principle 95 — Deprecate Before Removing

When practical:

```text
introduce replacement
        ↓
mark old behavior deprecated
        ↓
migrate consumers
        ↓
remove after compatibility period
```

Abrupt breaking changes should be reserved for justified cases.

---

# 106. Principle 96 — Backward Compatibility Has a Cost

Compatibility should not be maintained forever without reason.

The platform should balance:

```text
consumer stability

system simplicity

maintenance cost
```

Deprecation policies will define details.

---

# 107. Principle 97 — Feature Flags Are Temporary Control Mechanisms

Feature flags may support:

```text
gradual rollout

experimentation

operational disablement
```

but stale flags should be removed.

Flags must not become permanent alternate architectures.

---

# 108. Principle 98 — Separate Experimental From Stable

Experimental capabilities may evolve quickly.

Stable public contracts require stronger compatibility expectations.

The project should identify the difference clearly.

---

# 109. Principle 99 — Proof of Generality Requires More Than One Consumer

A capability should not be declared universally generic only because it works for one domain.

Where practical, validate shared abstractions using multiple consumers.

---

# 110. Principle 100 — Anime and History Are Initial Architecture Tests

Initial proof Universes:

```text
Anime

History
```

should intentionally exercise different domain requirements.

Their purpose is to expose false generalization.

---

# 111. Principle 101 — The Third Universe Is a Key Test

After two proof Universes, introduce another structurally different Universe.

The goal:

```text
minimal or zero core platform changes
```

If substantial changes are required, review the abstractions before scaling further.

---

# 112. Principle 102 — Do Not Optimize Core for Proof Universes

Anime and History are architecture tests.

They must not become implicit hard-coded assumptions in core platform design.

---

# 113. Principle 103 — Universe-Specific Requirements Are Valid

Generic architecture must not erase real domain differences.

If History requires:

```text
sources

historical periods

uncertainty
```

and Anime requires:

```text
episodes

character abilities

production studios
```

those differences may be represented through typed Universe/domain models and extensions.

---

# 114. Principle 104 — Generic Infrastructure, Specific Semantics

The preferred pattern is:

```text
shared engine
+
domain-specific definitions
```

not:

```text
domain-specific duplicate engine
```

---

# 115. Principle 105 — Composition Over Duplication

Experiences should reuse canonical resources.

Examples:

```text
Timeline
    references Events

Collection
    references Entities

Page
    references Media

Journey
    references Experiences
```

Do not duplicate source content merely to display it differently.

---

# 116. Principle 106 — Presentation Is Not Canonical Knowledge

Frontend presentation may change frequently.

Canonical knowledge should remain independent from individual layouts or clients.

---

# 117. Principle 107 — Frontend Applications Are Consumers

A web frontend, admin frontend, mobile app, or future interface consumes platform contracts.

No frontend application should become the sole owner of important domain rules.

---

# 118. Principle 108 — Shared Frontend Capability Where Appropriate

Common:

```text
design tokens

UI primitives

API contracts

validation types
```

may be shared when boundaries justify it.

Avoid tightly coupling all frontends into one implementation package without clear ownership.

---

# 119. Principle 109 — Accessibility Is a Shared Quality

User-facing systems should support accessibility through reusable design and engineering standards.

Accessibility should not be independently rediscovered for each Universe.

---

# 120. Principle 110 — Localization Is Structural

Localization must not be treated only as translation strings in one frontend.

It may affect:

```text
content

search

metadata labels

AI output

media

formatting

publishing
```

and therefore belongs to broader platform architecture.

---

# 121. Principle 111 — Time Must Be Explicit

Use clear semantics for:

```text
created time

updated time

published time

effective time

scheduled time

historical period
```

Do not overload one timestamp for unrelated business concepts.

---

# 122. Principle 112 — Timezones Must Be Deliberate

Store and transmit timestamps using clear standards.

Convert to user-local time at appropriate boundaries.

Domain-specific historical time concepts require separate modeling where necessary.

---

# 123. Principle 113 — Soft Delete Is Not a Default Pattern

Do not automatically add:

```text
deletedAt
```

to every model.

Choose among:

```text
hard delete

soft delete

archive

revision

retention
```

based on ownership and business requirements.

---

# 124. Principle 114 — Version Everything Only When It Matters

Not every record requires revision history.

Versioning should be introduced where:

```text
historical revision

publication lifecycle

rollback

auditability

drafting
```

provides real value.

---

# 125. Principle 115 — Avoid Universal Metadata Abuse

Metadata is useful for extensibility.

It must not become the place where every domain property goes because schema design is inconvenient.

Use first-class fields/models for stable and important invariants.

---

# 126. Principle 116 — Taxonomy Has Meaningful Governance

Taxonomy is not merely a `tags` string array.

Taxonomy may require:

```text
hierarchy

labels

localization

ownership

lifecycle

aliases

relationships
```

as requirements emerge.

---

# 127. Principle 117 — Relationships Must Be Typed

Avoid relying entirely on arbitrary:

```text
sourceId
targetId
typeString
```

without validation and relationship semantics.

Relationship architecture should define valid resource types, direction, and lifecycle appropriately.

---

# 128. Principle 118 — Workflow State Is Not Random Boolean Flags

Avoid:

```text
isDraft

isApproved

isPublished

isArchived
```

scattered inconsistently when a coherent lifecycle is required.

Use explicit state models and transitions where appropriate.

---

# 129. Principle 119 — Policy Should Not Become Hidden Code Everywhere

Variable access/business decisions may be better represented through explicit policies.

Policies should remain testable and understandable.

---

# 130. Principle 120 — Admin Is Not a Bypass

Administrative capabilities must still use:

```text
authorization

validation

audit

owned services
```

where appropriate.

Admin privileges are stronger permissions, not permission-free access.

---

# 131. Principle 121 — User Experience Must Remain Coherent

Multiple Universes should feel like parts of one platform.

Shared concepts may include:

```text
identity

navigation

search

preferences

collections

design system
```

while Universes retain distinct presentation where appropriate.

---

# 132. Principle 122 — Creator Experience Should Reuse Platform Tools

Creators should not need independent tooling for every Universe.

Shared:

```text
taxonomy tools

media tools

workflow tools

AI tools

publishing tools
```

should adapt to domain definitions.

---

# 133. Principle 123 — Operations Must Be Coherent

Operational tooling should converge where possible.

Examples:

```text
health

audit

metrics

logs

feature flags

deployments

incidents
```

should be understandable across the platform.

---

# 134. Principle 124 — Scale What Hurts

Do not distribute everything in advance.

When performance or scaling pressure appears:

```text
measure

identify bottleneck

isolate capability

optimize/extract
```

rather than redesigning unrelated systems.

---

# 135. Principle 125 — Optimize Hot Paths, Not Architecture Everywhere

A few hot paths may require specialized optimization.

Do not let exceptional performance-sensitive behavior force the entire codebase into low-level complexity.

---

# 136. Principle 126 — Reliability Requirements Are Capability-Specific

Critical authentication or publishing flows may require stronger guarantees than optional recommendation refreshes.

Reliability should correspond to business impact.

---

# 137. Principle 127 — Strong Consistency Where Required

Use strong transactional guarantees when business invariants require them.

Do not use eventual consistency merely because distributed architectures use it.

---

# 138. Principle 128 — Eventual Consistency Where Appropriate

Derived systems such as:

```text
search

analytics

recommendations
```

may tolerate delayed convergence.

Consistency requirements should be explicitly documented.

---

# 139. Principle 129 — External Dependencies Can Fail

Every external provider integration should consider:

```text
timeout

rate limit

partial outage

invalid response

authentication failure
```

Provider failures must not be treated as impossible.

---

# 140. Principle 130 — External SDKs Stay Behind Boundaries

Provider-specific SDK usage should be localized.

Avoid exposing SDK response shapes throughout application/domain code.

---

# 141. Principle 131 — Provider Abstractions Must Be Meaningful

Do not create generic provider interfaces that are merely lowest-common-denominator wrappers.

An abstraction should represent an AI World capability.

Example:

```text
ImageGenerationCapability
```

may be more useful than:

```text
GenericProvider.execute(anything)
```

---

# 142. Principle 132 — Avoid Lowest-Common-Denominator Architecture

Provider independence must not prevent use of valuable provider-specific capabilities.

A platform contract may support:

```text
core portable behavior

optional provider capabilities
```

through explicit extension mechanisms.

---

# 143. Principle 133 — Cost and Performance May Influence Routing

Provider or infrastructure selection may eventually consider:

```text
latency

quality

cost

regional availability

quota

capability
```

but routing complexity should be introduced incrementally.

---

# 144. Principle 134 — Architecture Is Not Immutable

Principles provide strong defaults.

Real evidence may justify change.

Major exceptions or reversals should be recorded through architectural governance.

---

# 145. Principle 135 — Evidence Beats Preference

Do not redesign major systems merely because:

```text
another framework looks cleaner

a new technology is popular

an implementation style is fashionable
```

Use evidence and requirements.

---

# 146. Principle 136 — Avoid Rewrite Culture

The greenfield restart is a deliberate reset.

Future improvement should favor:

```text
refactoring

migration

versioning

modular replacement
```

over repeated full rewrites.

A new rewrite requires exceptional justification.

---

# 147. Principle 137 — Simplicity Is a Feature

When two designs meet requirements:

```text
prefer the simpler one
```

provided it preserves important boundaries and evolution paths.

Complexity must provide measurable or strategic value.

---

# 148. Principle 138 — Explicitness Over Magic

Prefer explicit:

```text
registration

ownership

dependencies

configuration

transactions

authorization

state transitions
```

when hidden convention would make behavior difficult to understand.

---

# 149. Principle 139 — Consistency Over Personal Style

Shared architectural patterns should remain consistent across capabilities.

Developers should not reinvent:

```text
error shapes

pagination

authorization

logging

testing structure
```

in every module.

---

# 150. Principle 140 — Consistency Does Not Mean Uniformity

Different capabilities may have different needs.

Do not force one pattern everywhere when domain requirements differ substantially.

Architecture should provide consistency of principles, not mechanical sameness.

---

# 151. Principle 141 — Naming Must Reflect Meaning

Names should express domain intent.

Prefer:

```text
AssetRepository

RelationshipPolicy

GenerationJob
```

over ambiguous:

```text
Manager

Processor

Helper

DataService
```

unless the generic name genuinely reflects the responsibility.

---

# 152. Principle 142 — Avoid Abbreviation Without Value

Names should be readable.

Use abbreviations only when they are widely understood and reduce noise without introducing ambiguity.

---

# 153. Principle 143 — Package Boundaries Need Purpose

A shared package should exist because it has:

```text
clear responsibility

multiple intentional consumers

stable contract
```

not merely because code can technically be extracted.

---

# 154. Principle 144 — Do Not Create Empty Architecture in Code

Documentation may reserve future capability areas.

The source repository should not contain dozens of empty modules merely to mirror the long-term roadmap.

Create implementation structure when implementation begins.

---

# 155. Principle 145 — Platform Architecture Should Be Discoverable

Repository layout, naming, and documentation should allow future developers to understand major capability boundaries without reverse-engineering every import.

---

# 156. Principle 146 — Architecture Tests May Be Valuable

Some boundaries may eventually be protected automatically.

Examples:

```text
Foundation cannot import Universe

Platform cannot access another Platform's internal directory

public contracts have controlled import paths
```

Architecture enforcement tooling may be introduced when worthwhile.

---

# 157. Principle 147 — Build Pipelines Must Protect Mainline Quality

Important branches should not accept changes that fail required quality gates.

The exact CI strategy will be defined later.

---

# 158. Principle 148 — Reviews Should Examine Architecture, Not Only Syntax

Code review should ask:

```text
Does this capability belong here?

Is ownership clear?

Is data ownership respected?

Is there unnecessary duplication?

Does this introduce coupling?
```

not only:

```text
Does this code compile?
```

---

# 159. Principle 149 — Documentation Changes May Be Required With Code

If a change alters:

```text
architecture

public contract

ownership

workflow

operational behavior
```

documentation should be updated in the same change where practical.

---

# 160. Principle 150 — ADRs Record Significant Decisions

Use ADRs for durable decisions that future developers will need to understand.

Do not create ADRs for trivial implementation details.

---

# 161. Principle 151 — ADRs Are Historical

Accepted ADRs should normally remain as records.

When a decision changes:

```text
create a superseding ADR
```

rather than rewriting history without explanation.

---

# 162. Principle 152 — Roadmap Is Not Architecture

A feature being planned earlier does not make it architecturally more important.

Architecture determines dependencies.

Roadmap determines implementation order.

---

# 163. Principle 153 — Architecture Is Not Product Priority

A concept may be foundational architecturally yet not require immediate implementation.

Example:

```text
Versioning
```

may belong in the Kernel architecture while implementation is deferred until a real consumer requires it.

---

# 164. Principle 154 — Do Not Build Everything in the Kernel First

The Platform Kernel should emerge carefully.

Only implement Kernel capabilities when upcoming Platforms require them.

This prevents speculative infrastructure.

---

# 165. Principle 155 — Validate Capabilities Vertically

When possible, prove a capability through real integration.

For example:

```text
Metadata definition
        ↓
Knowledge resource
        ↓
API
        ↓
UI/consumer
        ↓
test
```

provides stronger evidence than isolated infrastructure alone.

---

# 166. Principle 156 — Build Thin End-to-End Paths Early

For major Platforms, an early thin vertical slice can validate:

```text
architecture

contracts

persistence

security

developer experience
```

before implementing every feature.

---

# 167. Principle 157 — Expand After Validation

After a thin path works:

```text
harden

add features

add edge cases

optimize

document
```

rather than building maximum breadth before integration.

---

# 168. Principle 158 — Close Capabilities Before Forgetting Them

Large capabilities should not remain forever at:

```text
mostly done
```

Before moving on, perform closure reviews where appropriate.

Closure reduces accumulating uncertainty.

---

# 169. Principle 159 — Technical Debt Must Be Intentional

If temporary compromises are required:

```text
document them

explain why

define impact

track resolution
```

Avoid accidental permanent shortcuts.

---

# 170. Principle 160 — No Hidden Legacy Carryover

Legacy ideas may be reused only after evaluation against AI World greenfield principles.

Copying old structure for convenience does not automatically make it correct.

---

# 171. Platform Decision Checklist

Before approving a major implementation, evaluate:

```text
1. Which capability owns this?

2. Which architectural class does it belong to?

3. Is it reusable?

4. Is it being duplicated elsewhere?

5. Does it introduce unnecessary coupling?

6. Are its dependencies pointing in the right direction?

7. Does it expose internal implementation?

8. Is its data ownership clear?

9. Does it require configuration or code?

10. Does it require an extension point?

11. Is the abstraction justified?

12. Is technology leaking into domain contracts?

13. Is security addressed?

14. Is failure behavior defined?

15. Is testing appropriate?

16. Is documentation authoritative?

17. Can it evolve without broad unrelated changes?

18. Does it help or hurt the addition of future Universes?
```

---

# 172. Platform Health Questions

Periodically ask:

```text
Are new features easier to add?

Are Universes reusing capabilities?

Are shared abstractions genuinely useful?

Are internal dependencies increasing uncontrollably?

Are module boundaries still understandable?

Is technical infrastructure proliferating?

Are contracts stable?

Is documentation accurate?

Are we adding complexity faster than value?
```

These questions help identify architectural drift.

---

# 173. Anti-Pattern — Universe-Centric Duplication

Warning sign:

```text
anime/
    search/
    media/
    auth/

history/
    search/
    media/
    auth/
```

Likely correction:

```text
shared Search Platform

shared Media Platform

shared Identity Platform
```

with Universe-specific definitions.

---

# 174. Anti-Pattern — Giant Generic Object Model

Warning sign:

```text
Everything
    =
Object + Attributes + JSON
```

Likely correction:

```text
typed domain/resource models
+
controlled metadata extensions
```

---

# 175. Anti-Pattern — Shared Database Without Ownership

Warning sign:

```text
every module can update every table
```

Likely correction:

```text
explicit persistence ownership

public interaction contracts
```

---

# 176. Anti-Pattern — Provider SDK Everywhere

Warning sign:

```text
OpenAI SDK
inside many domain services
```

Likely correction:

```text
AI Platform capability boundary
```

---

# 177. Anti-Pattern — Framework Explosion

Warning sign:

```text
many Frameworks

few real consumers
```

Likely correction:

```text
simpler modules/services
until reuse proves itself
```

---

# 178. Anti-Pattern — Premature Microservices

Warning sign:

```text
many deployable services

few users

high operational burden

frequent cross-service calls
```

Likely correction:

```text
modular architecture first
```

---

# 179. Anti-Pattern — Configuration Explosion

Warning sign:

```text
hundreds of flags

complex nested JSON

runtime rules difficult to test
```

Likely correction:

```text
move real business behavior into typed code/contracts
```

---

# 180. Anti-Pattern — Unbounded Common Folder

Warning sign:

```text
common/
shared/
utils/
```

grows faster than owned capability directories.

Likely correction:

```text
redistribute code according to ownership
```

---

# 181. Anti-Pattern — Documentation Drift

Warning sign:

```text
roadmap says planned

code says implemented

architecture says something else
```

Likely correction:

```text
reconcile canonical documents
```

---

# 182. Anti-Pattern — Core Special Cases

Warning sign:

```text
if Anime
if History
if Education
```

spread across core platform code.

Likely correction:

```text
Universe configuration
typed extension
policy
registry
```

---

# 183. Anti-Pattern — Infrastructure as Product Identity

Warning sign:

```text
"We are a Prisma platform"

"We are an OpenAI app"

"We are a Kubernetes architecture"
```

AI World must remain conceptually independent from those implementation choices.

---

# 184. Anti-Pattern — Test Infrastructure in Production

Test fixtures, fake providers, seeded fake users, and debugging endpoints must not leak into production composition unintentionally.

---

# 185. Anti-Pattern — Admin Database Editing as Normal Workflow

If administrators routinely require direct database edits, the platform likely lacks proper administrative capabilities or ownership boundaries.

---

# 186. Anti-Pattern — AI Bypasses Workflow

AI-generated content should not automatically bypass:

```text
validation

review

security

publication

provenance
```

when those controls are required for human-created content.

---

# 187. Anti-Pattern — Search Owns Business Logic

Search infrastructure should index and discover.

It should not become the only place where fundamental knowledge semantics exist.

---

# 188. Anti-Pattern — Cache Required for Correctness

If loss of cache permanently destroys business state, the cache may actually be functioning as persistence and should be modeled accordingly.

---

# 189. Anti-Pattern — Hidden Event Dependency

If critical behavior only occurs because an undocumented event handler happens to run, system ownership becomes difficult to understand.

Important event-driven flows must be documented and tested.

---

# 190. Anti-Pattern — Distributed Complexity Without Need

Avoid adding:

```text
Kafka

service mesh

multiple databases

distributed locks

event sourcing

CQRS everywhere
```

without demonstrated architectural requirements.

These technologies may become appropriate later.

They are not default goals.

---

# 191. Principle Priority During Conflict

When principles conflict, evaluate in approximately this order:

```text
1. Security and privacy

2. Data integrity

3. Correctness

4. Explicit ownership

5. Maintainability

6. Simplicity

7. Reuse

8. Performance

9. Extensibility

10. Convenience
```

This is a guideline, not an absolute mathematical ordering.

Real requirements may alter priority.

---

# 192. Example Tradeoff — Reuse vs Domain Correctness

Suppose Anime and History both have a concept named:

```text
Character
```

but meanings differ substantially.

Do not force both into one shared model merely for reuse.

Prefer:

```text
shared underlying platform capabilities

+
domain-specific typed models
```

when semantics are genuinely different.

---

# 193. Example Tradeoff — Portability vs Provider Capability

Suppose one AI provider offers a valuable advanced feature.

AI World may use it.

Provider independence does not require refusing provider-specific capabilities.

Instead:

```text
core capability contract
+
optional provider extension
```

may preserve both value and architectural control.

---

# 194. Example Tradeoff — Simplicity vs Future Scale

Do not introduce microservices only because the platform may someday have millions of users.

Prefer a modular architecture that can later isolate pressure points.

---

# 195. Example Tradeoff — Configuration vs Code

A workflow's timeout value may belong in configuration.

A complex safety algorithm probably belongs in code.

Choose based on whether variability is data or behavior.

---

# 196. Example Tradeoff — Generic Metadata vs Typed Field

If many resource types may optionally have:

```text
color
```

metadata may be appropriate.

If every Asset requires:

```text
mimeType
```

and business logic depends on it, a typed Asset field is probably better.

---

# 197. Example Tradeoff — Event vs Direct Call

If publishing an Entity requires immediate authorization and state validation:

```text
synchronous service call
```

may be appropriate.

After publication:

```text
EntityPublished
```

can asynchronously trigger search indexing or analytics.

---

# 198. Example Tradeoff — Shared Package vs Duplication

Two modules containing three identical utility lines do not automatically justify a shared package.

Wait until stable shared responsibility emerges.

---

# 199. Long-Term Architecture Principle

The desired future structure is:

```text
Stable domain concepts

        +

Clear capability ownership

        +

Controlled extension points

        +

Replaceable infrastructure

        +

Versioned public contracts

        +

Incremental evolution
```

This combination is more durable than trying to predict future technologies.

---

# 200. Platform Principles Summary

AI World will prefer:

```text
Platform over Universe duplication

Capabilities over folder-driven architecture

Ownership over ambiguity

Typed models over uncontrolled dynamic structures

Composition over copying

Configuration over unnecessary specialization

Extension over repeated core modification

Contracts over hidden coupling

Stable domain concepts over technology-defined models

Canonical data over provider-owned truth

Security over convenience

Explicit failures over silent corruption

Measured scaling over premature distribution

Real reuse over speculative frameworks

Documentation consistency over architectural folklore

Incremental evolution over repeated rewrites
```

---

# 201. Non-Negotiable Core Principles

The following principles should be treated as especially strong constraints:

```text
1. A new Universe must not require duplicated core infrastructure.

2. Major business data must have clear ownership.

3. Foundations must remain domain-neutral.

4. Kernel capabilities must remain broadly reusable.

5. Generic architecture must remain typed and validated.

6. Cross-capability dependencies must be explicit.

7. Internal implementation must remain encapsulated.

8. Stable platform concepts must not depend on specific providers.

9. Security must be enforced at trusted boundaries.

10. Canonical data must remain under platform ownership.

11. Frameworks must be justified by real consumers.

12. Infrastructure complexity must be introduced by requirement.

13. Documentation must reflect real project state.

14. Public contracts must evolve deliberately.

15. Architecture should reduce the cost of adding future Universes.
```

---

# 202. Platform Review Gate

Before a major capability moves from architecture into implementation, reviewers should confirm:

```text
[ ] Capability classification is defined.

[ ] Ownership is defined.

[ ] Data ownership is defined.

[ ] Public contracts are identified.

[ ] Dependencies are valid.

[ ] Universe-specific assumptions are absent or justified.

[ ] Genericity is appropriately typed.

[ ] Configuration boundaries are defined.

[ ] Extension requirements are defined.

[ ] Security implications are understood.

[ ] Failure behavior is understood.

[ ] Technology decisions support the capability.

[ ] Testing strategy is proportionate.

[ ] Documentation ownership is clear.
```

---

# 203. Principle Evolution

These principles may evolve as AI World gains real implementation experience.

Changes should occur when:

```text
requirements change

evidence reveals a bad principle

technology constraints materially change

security requirements evolve

platform scale introduces new realities
```

Changes should not occur casually merely because an implementation would be easier if a principle disappeared.

---

# 204. Relationship to Future Documents

These Platform Principles will guide:

```text
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

P0-D18 — Master Roadmap
```

Detailed future engineering standards will convert these principles into implementation-specific rules.

---

# 205. Acceptance

```text
DOCUMENT
P0-D04 — AI World Platform Principles

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

NEXT DOCUMENT
P0-D05 — Universe Principles

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```