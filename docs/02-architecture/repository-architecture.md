# AI World Repository Architecture

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Repository Architecture |
| Document ID | P0-D16 |
| Area | Architecture |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Canonical Repository and Source Ownership Architecture |
| Applies To | Entire AI World Repository |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md`, `docs/01-vision/terminology.md`, `docs/02-architecture/system-context.md`, `docs/02-architecture/platform-architecture.md`, `docs/02-architecture/platform-layers.md`, `docs/02-architecture/capability-map.md`, `docs/02-architecture/ownership-model.md`, `docs/02-architecture/dependency-rules.md`, `docs/02-architecture/extension-model.md` |

---

# 1. Purpose

This document defines the canonical **Repository Architecture** for AI World.

It translates the logical architecture into a repository organization capable of supporting:

```text
Applications;

Foundations;

Platform Kernel;

Platforms;

Universes;

Provider Adapters;

Extensions;

tests;

documentation;

infrastructure;

engineering tooling.
```

The repository must make the architecture visible without turning every architectural concept into a separate package unnecessarily.

---

# 2. Core Repository Principle

> **The repository should reflect ownership and dependency direction strongly enough to protect the architecture, while remaining simple enough for developers to understand and change.**

Repository structure is therefore designed around:

```text
capability ownership
```

rather than primarily around:

```text
framework type;

database table;

technical file type;

deployment topology.
```

---

# 3. Repository Objectives

The AI World repository should make it easy to answer:

```text
Where does this code belong?

Who owns this code?

Is this Application code?

Is this Universe-specific?

Is this a shared Platform capability?

Is this Kernel semantics?

Is this technical Foundation code?

Where is the public Contract?

Where is the Provider Adapter?

Where should its tests live?

Which dependencies are allowed?
```

---

# 4. Repository Non-Objectives

The repository structure must not attempt to:

```text
create one package for every class;

create one package for every database table;

mirror every documentation directory mechanically;

create microservices through folder names;

create abstraction before implementation exists;

separate code solely for aesthetic symmetry.
```

---

# 5. Repository Architecture vs Platform Architecture

Platform Architecture defines:

```text
logical ownership.
```

Repository Architecture defines:

```text
physical source organization.
```

The repository should reflect the logical architecture.

It does not need to reproduce the architecture diagram one-to-one.

---

# 6. Repository Architecture vs Deployment

A repository directory does not automatically represent:

```text
a process;

a container;

a service;

a deployment;

a database.
```

Likewise, several repository packages may eventually execute inside one runtime.

---

# 7. Repository Architecture vs Package Architecture

A directory represents ownership before it necessarily represents a package.

Important rule:

> **An ownership directory may exist without becoming an independently versioned or independently built package.**

Package boundaries should be introduced where they improve:

```text
dependency enforcement;

reuse;

build boundaries;

runtime sharing;

testability;

ownership clarity.
```

---

# 8. Repository Architecture vs Framework Architecture

The repository must not be organized primarily around framework concepts such as:

```text
controllers/

services/

repositories/

modules/

components/
```

at the repository root.

Those concepts may exist inside appropriately owned capabilities.

---

# 9. Canonical Repository Root

The target repository shape is:

```text
ai-world/
│
├── apps/
├── packages/
├── docs/
├── infrastructure/
├── scripts/
├── tooling/
├── tests/
│
├── .editorconfig
├── .env.example
├── .gitignore
├── README.md
│
└── <workspace / build / tool configuration>
```

Not every directory must be physically created immediately.

Directories should appear when real implementation requires them.

---

# 10. Repository Root Responsibilities

```text
apps/
    deployable/runtime entry points

packages/
    reusable capability-owned source

docs/
    canonical architecture and engineering documentation

infrastructure/
    deployment/environment infrastructure definitions

scripts/
    project automation scripts

tooling/
    reusable engineering/build/development tooling

tests/
    system-level tests that do not naturally belong to one owner
```

---

# 11. Root Minimalism Principle

The repository root should remain small.

Avoid accumulating root-level directories such as:

```text
helpers/

common/

shared/

services/

models/

utils/

misc/

temp/
```

without clear architectural ownership.

---

# 12. `apps/`

The `apps/` directory contains executable AI World Applications.

An Application is a runtime entry point or independently buildable delivery surface.

Examples may include:

```text
API runtime;

Web client;

Worker runtime;

future Admin client;

future Mobile/other clients.
```

---

# 13. Application Directory Rule

Only deployable or independently executable Applications belong under:

```text
apps/
```

Do not place reusable Domain logic there merely because one Application currently consumes it.

---

# 14. Initial Application Direction

The preferred minimal starting application model is:

```text
apps/
├── api/
└── web/
```

Additional Applications should be added only when requirements require them.

---

# 15. `apps/api`

`apps/api` is the expected primary backend entry point.

It should own concerns such as:

```text
runtime bootstrap;

HTTP/API transport;

request handling;

authentication boundary integration;

response serialization;

transport error mapping;

application composition;

health endpoints.
```

It must not become the canonical owner of all business logic.

---

# 16. API Business Logic Rule

Bad:

```text
apps/api/src/services/knowledge.service
```

containing the entire Knowledge Platform merely because requests arrive through the API.

Preferred:

```text
apps/api
    consumes
Knowledge Platform package/module.
```

---

# 17. API Persistence Rule

`apps/api` should not become a general database-access layer.

Canonical persistence remains owned by:

```text
Platforms;

Kernel capabilities;

Foundations where technically appropriate.
```

---

# 18. `apps/web`

`apps/web` is the expected initial first-party web experience.

It may initially contain both:

```text
public experience;

authenticated user experience;

creator/admin interfaces
```

if one Web Application is sufficient.

---

# 19. Admin Application Extraction

AI World must not create a separate:

```text
apps/admin
```

merely because administrative routes exist.

A dedicated Admin Application should be introduced only if justified by:

```text
independent deployment;

strong security isolation;

substantially different runtime;

independent build needs;

independent product ownership;

significant application complexity.
```

---

# 20. Initial Creator/Admin Direction

Initial direction:

```text
apps/web
    may host
creator/admin presentation
```

while backend business capabilities remain shared Platforms.

---

# 21. Future `apps/admin`

If eventually justified:

```text
apps/
├── web/
├── admin/
└── api/
```

is valid.

`admin` would remain a delivery Application.

It would not own:

```text
Knowledge;

Media;

Identity;

CMS Domain state.
```

---

# 22. Worker Application

A separate Worker Application should appear only when durable asynchronous work requires one.

Possible future:

```text
apps/worker/
```

---

# 23. `apps/worker`

Potential responsibilities:

```text
queue consumption;

Job dispatch;

background execution bootstrap;

worker health;

worker observability.
```

Business Job semantics remain with their owning capabilities.

---

# 24. Worker Extraction Rule

Do not create `apps/worker` before real work exists such as:

```text
AI generation;

media processing;

search indexing;

bulk import;

email processing.
```

---

# 25. Multiple Worker Runtimes

Future scale may justify:

```text
apps/media-worker/

apps/ai-worker/
```

or another specialized deployment structure.

This should happen only after operational evidence.

---

# 26. Future Applications

Potential future Applications include:

```text
apps/admin/

apps/mobile/

apps/desktop/

apps/gateway/
```

No such Application is part of initial implementation unless explicitly added to the roadmap.

---

# 27. Application-Local Code

Application-specific code may include:

```text
routes;

controllers;

transport adapters;

UI components;

page composition;

client state;

runtime bootstrap.
```

Reusable business rules should move to the appropriate Capability owner.

---

# 28. Application Feature Folders

Applications may organize local presentation concerns by feature.

Example:

```text
apps/web/src/features/
    search/
    profile/
    universe-navigation/
```

This is acceptable because those folders own presentation/use-case composition rather than canonical Domain state.

---

# 29. Application Universe Presentation

A Web Application may contain Universe-specific presentation.

Example:

```text
apps/web/src/universes/anime/
apps/web/src/universes/history/
```

if the presentation is genuinely Application-specific.

This does not make `apps/web` the canonical owner of Universe semantics.

---

# 30. Domain Definitions Do Not Belong in Web App

The canonical definition of:

```text
Anime Character

History Event
```

must not exist only inside frontend source.

Shared semantic definitions belong to the Universe/Platform ownership area.

---

# 31. Applications Must Depend Inward

General dependency direction:

```text
apps/*
    ↓
packages/*
```

Packages must not depend on Applications.

---

# 32. No Application Imports

Production reusable packages must never import:

```text
apps/api

apps/web

apps/admin

apps/worker.
```

---

# 33. `packages/`

The `packages/` directory contains reusable AI World source organized primarily by architectural ownership.

The canonical high-level grouping is:

```text
packages/
├── foundations/
├── kernel/
├── platforms/
└── universes/
```

Additional package groups should be introduced only when justified.

---

# 34. Why Group Packages by Architecture

This structure makes architectural ownership visible:

```text
packages/foundations/
    technical infrastructure

packages/kernel/
    shared semantics

packages/platforms/
    reusable business capabilities

packages/universes/
    domain-world specialization.
```

---

# 35. Ownership Directory vs Workspace Package

A child directory under these groups is initially an:

```text
OWNERSHIP DIRECTORY.
```

It becomes a standalone workspace/build package only when package separation provides real value.

---

# 36. No Immediate Package Explosion

AI World must not create dozens of empty package manifests during Phase 0.

Example:

```text
packages/kernel/versioning/
```

should not be materialized merely because Versioning appears in architecture documentation.

Create it when implementation starts and a real consumer requires it.

---

# 37. Capability Materialization Rule

A capability directory should normally be created when:

```text
implementation work begins;

a real consumer exists;

ownership is understood;

the capability has meaningful source code.
```

---

# 38. Package Promotion Rule

An ownership directory should become an independent workspace package when one or more of these apply:

```text
multiple Applications consume it;

a strict dependency boundary is valuable;

it requires independent build/testing;

it has reusable public Contracts;

it has distinct provider dependencies;

it needs isolated dependency enforcement;

it is large enough that package-level ownership improves maintenance.
```

---

# 39. Package Non-Promotion Rule

Do not create an independent package if:

```text
the code is tiny;

there is one local consumer;

the boundary would create ceremony;

the package would merely forward another package;

the package exists only to match a diagram.
```

---

# 40. `packages/foundations/`

Canonical Foundation ownership zone:

```text
packages/
└── foundations/
    ├── configuration/
    ├── database/
    ├── repository/
    ├── migration/
    ├── seed/
    ├── storage/
    ├── cache/
    ├── queue/
    ├── scheduler/
    ├── email/
    ├── observability/
    └── feature-flags/
```

Only implemented Foundations should exist physically.

---

# 41. Foundation Directory Rule

Foundation directories contain:

```text
technical capability;

provider-neutral Contracts;

technical implementation;

Foundation-specific tests;

provider Adapters where owned by that Foundation.
```

---

# 42. Foundation Universe Neutrality

Nothing under:

```text
packages/foundations/
```

may contain imports from:

```text
packages/universes/
```

---

# 43. Foundation Platform Neutrality

Foundations must not import:

```text
packages/platforms/
```

for business semantics.

---

# 44. Foundation Naming

Foundation package/directory names should describe the technical capability.

Good:

```text
configuration

database

storage

queue

email.
```

Avoid provider names as canonical Foundation names.

Bad:

```text
aws-storage

postgres-platform

redis-core.
```

---

# 45. Provider-Specific Foundation Code

Provider-specific code may live under the owning Foundation.

Example conceptual structure:

```text
storage/
├── src/
│   ├── contract/
│   ├── internal/
│   └── adapters/
│       ├── local/
│       └── <provider>/
```

Only real implementations should exist.

---

# 46. Storage Adapter Ownership

Storage Adapters belong with:

```text
Storage Foundation.
```

Do not create root-level:

```text
providers/storage/
```

unless future repository scale proves it necessary.

---

# 47. Email Adapter Ownership

Email Provider Adapters belong with:

```text
Email Foundation.
```

---

# 48. Database Driver Ownership

Database-provider implementation details belong with:

```text
Database Foundation
```

or tooling required by the selected persistence technology.

---

# 49. Queue Adapter Ownership

Queue-provider implementation belongs with:

```text
Queue Foundation.
```

---

# 50. Observability Provider Ownership

Observability exporters/adapters belong with:

```text
Observability Foundation.
```

---

# 51. `packages/kernel/`

Canonical Platform Kernel ownership zone:

```text
packages/
└── kernel/
    ├── identifiers/
    ├── namespace/
    ├── taxonomy/
    ├── metadata/
    ├── relationships/
    ├── events/
    ├── audit/
    ├── workflow/
    ├── policy/
    ├── localization/
    └── versioning/
```

Again, create only when implementation begins.

---

# 52. Kernel Naming

Use the canonical name:

```text
identifiers
```

not:

```text
identity
```

because Actor Identity belongs to:

```text
Identity & Access Platform.
```

---

# 53. Kernel Directory Responsibility

A Kernel capability may contain:

```text
shared semantic models;

public Contracts;

application mechanics where needed;

persistence owned by the Kernel capability;

tests.
```

---

# 54. Kernel Domain Neutrality

Kernel code must not contain concrete assumptions about:

```text
Anime

History

User Profile

CMS Page
```

unless those concepts are represented through generic public Resource Contracts.

---

# 55. Kernel Package Promotion

A Kernel capability becomes an independent package when:

```text
multiple Platforms consume it;

public boundaries matter;

independent tests are valuable.
```

This will likely be common for implemented Kernel capabilities.

---

# 56. Do Not Create Full Kernel Upfront

The presence of eleven Kernel areas in architecture does not authorize building all eleven at the beginning.

Initial implementation should materialize only required capabilities.

---

# 57. Likely Early Kernel Directories

Depending on early Platform work, likely early candidates are:

```text
identifiers/

namespace/

events/

audit/
```

and Knowledge-driven:

```text
taxonomy/

relationships/
```

Only actual requirements determine final order.

---

# 58. Deferred Kernel Directories

Likely deferred until real consumers require them:

```text
workflow/

policy/

localization/

versioning/

metadata/
```

depending on proof-domain needs.

---

# 59. `packages/platforms/`

Canonical business Platform ownership zone:

```text
packages/
└── platforms/
    ├── identity-access/
    ├── user/
    ├── knowledge/
    ├── media/
    ├── discovery/
    ├── ai-creator/
    ├── composition-cms/
    ├── engagement/
    └── operations/
```

---

# 60. Platform Directory Rule

A Platform directory is the canonical source ownership area for:

```text
Domain semantics;

business use cases;

canonical persistence;

Platform public Contracts;

Platform Events;

Platform-owned Provider Ports;

Platform implementation;

Platform-specific tests.
```

---

# 61. Identity & Access Directory

Canonical:

```text
packages/platforms/identity-access/
```

It should own implementation of:

```text
authentication;

Sessions;

Credentials;

Roles;

Permissions;

Authorization.
```

---

# 62. User Directory

Canonical:

```text
packages/platforms/user/
```

It should own:

```text
profile;

preferences;

User product state.
```

---

# 63. Knowledge Directory

Canonical:

```text
packages/platforms/knowledge/
```

It should own:

```text
Entities;

Knowledge Resources;

Sources;

Citations;

Knowledge lifecycle;

Knowledge persistence.
```

---

# 64. Media Directory

Canonical:

```text
packages/platforms/media/
```

It should own:

```text
Assets;

Media lifecycle;

processing;

Variants;

Media persistence.
```

Storage infrastructure remains under Foundations.

---

# 65. Discovery Directory

Canonical:

```text
packages/platforms/discovery/
```

It should own:

```text
Search;

ranking;

index projections;

related Resources;

Search Provider Port/Adapter.
```

---

# 66. AI / Creator Directory

Canonical:

```text
packages/platforms/ai-creator/
```

It should own:

```text
Generation;

AI Provider Contracts;

Model Catalog;

Prompt Templates;

AI Tools;

routing;

evaluation;

AI provenance.
```

---

# 67. AI Provider Adapters

Concrete AI Provider Adapters should normally live within the AI / Creator ownership area.

Conceptual:

```text
packages/platforms/ai-creator/
└── src/
    └── adapters/
        └── providers/
            └── <provider>/
```

Exact structure may differ after Technology Strategy.

---

# 68. Composition / CMS Directory

Canonical:

```text
packages/platforms/composition-cms/
```

It should own:

```text
Pages;

Blocks;

Layouts;

Experiences;

preview;

publishing of composition-owned Resources.
```

---

# 69. Engagement Directory

Canonical:

```text
packages/platforms/engagement/
```

It should own:

```text
Favorites;

Collections;

Progress;

Notifications;

product Activity History.
```

---

# 70. Operations Directory

Canonical:

```text
packages/platforms/operations/
```

It should own AI World product-level operational capabilities.

Technical infrastructure definitions do not belong there by default.

---

# 71. Platform-to-Platform Imports

If Platforms become independent packages, a peer dependency should target only an explicit public entrypoint.

Conceptual:

```text
@ai-world/platform-knowledge
```

or an approved public subpath.

Never:

```text
../../knowledge/src/internal/repositories/...
```

---

# 72. Platform Package Names

If package naming is required, the preferred architecture-visible convention is:

```text
@ai-world/platform-identity-access

@ai-world/platform-user

@ai-world/platform-knowledge

@ai-world/platform-media

@ai-world/platform-discovery

@ai-world/platform-ai-creator

@ai-world/platform-composition-cms

@ai-world/platform-engagement

@ai-world/platform-operations
```

The exact workspace/package-manager mechanism is chosen later.

---

# 73. Foundation Package Names

Preferred conceptual names:

```text
@ai-world/foundation-configuration

@ai-world/foundation-database

@ai-world/foundation-storage

@ai-world/foundation-email
```

and similarly for implemented Foundations.

---

# 74. Kernel Package Names

Preferred conceptual names:

```text
@ai-world/kernel-identifiers

@ai-world/kernel-namespace

@ai-world/kernel-taxonomy

@ai-world/kernel-relationships
```

and similarly for implemented Kernel capabilities.

---

# 75. Universe Package Names

Preferred conceptual names:

```text
@ai-world/universe-anime

@ai-world/universe-history
```

when those ownership areas become packages.

---

# 76. Why Architecture-Prefixed Package Names

Architecture-prefixed names make dependency intent obvious.

For example:

```text
@ai-world/kernel-taxonomy
```

immediately communicates a different responsibility from:

```text
@ai-world/platform-knowledge.
```

---

# 77. Package Name Does Not Mean Public NPM Package

These names may refer to private workspace packages only.

Publishing to a public package registry is not implied.

---

# 78. `packages/universes/`

Canonical Universe semantic ownership zone:

```text
packages/
└── universes/
    ├── anime/
    └── history/
```

Future Universes are added here.

---

# 79. Universe Package Purpose

Universe source should contain the reusable semantic definition of the Universe.

Potential content:

```text
Universe Definition;

domain types;

taxonomy definitions;

relationship definitions;

metadata definitions;

policy/workflow configuration;

AI configuration;

typed Extensions.
```

---

# 80. Universe Package Non-Responsibilities

Universe packages should not contain:

```text
database infrastructure;

AI Provider SDKs;

storage Provider SDKs;

email Provider SDKs;

duplicated authentication;

duplicated search engines.
```

---

# 81. Anime Ownership Directory

Canonical:

```text
packages/universes/anime/
```

Potential source includes:

```text
Character definitions;

Series definitions;

Genre taxonomy;

Anime relationships;

Anime-specific typed Extensions.
```

---

# 82. History Ownership Directory

Canonical:

```text
packages/universes/history/
```

Potential source includes:

```text
Person definitions;

Event definitions;

Place definitions;

Era taxonomy;

source requirements;

History-specific typed Extensions.
```

---

# 83. Universe Presentation Separation

Universe semantic packages should not be forced to contain framework-specific frontend components.

Framework-specific presentation may remain inside:

```text
apps/web/
```

or a presentation package if later reused by multiple Applications.

---

# 84. Semantic Universe vs Presentation Universe

Conceptually:

```text
packages/universes/anime
    owns Anime semantics

apps/web/src/universes/anime
    owns Web-specific Anime presentation.
```

Both relate to Anime, but responsibilities differ.

---

# 85. Avoid Universe Fragmentation

Presentation separation must not make Universe semantics difficult to discover.

Universe documentation should link:

```text
semantic definitions;

presentation implementations;

configuration;

Extensions.
```

---

# 86. Universe Package Dependency Direction

Universe packages may depend on:

```text
Platform public Contracts;

Kernel public Contracts;

Universe-local code.
```

They must not normally depend on:

```text
Foundations;

Applications;

concrete Provider Adapters.
```

---

# 87. No Platform Imports Universe

A package under:

```text
packages/platforms/
```

must never import:

```text
packages/universes/anime

packages/universes/history
```

by default.

---

# 88. Universe Registration

Applications/Composition Root may import Universe packages for runtime registration.

Conceptually:

```text
apps/api/bootstrap
    imports Anime Universe registration
    imports History Universe registration
```

This is acceptable.

---

# 89. Universe Registration Is Wiring

Runtime registration code should stay near:

```text
Composition Root;

Application bootstrap;

Universe registry configuration.
```

Shared Platforms must remain unaware of concrete Universe source packages.

---

# 90. Public Surface Architecture

Every substantial reusable package should expose a deliberate public surface.

Potential forms:

```text
root public entrypoint;

contracts subpath;

events subpath;

testing subpath.
```

Exact syntax depends on the selected build/package tooling.

---

# 91. Canonical Public Entrypoint

Conceptually:

```text
<capability>/src/index
```

or equivalent package export.

It should expose only intentionally supported APIs.

---

# 92. Internal Code

Implementation not intended for external consumers should remain unexported.

Potential internal concerns:

```text
Repositories;

ORM models;

private services;

provider-specific mappers;

internal validators;

persistence helpers.
```

---

# 93. No Cross-Package Deep Imports

Forbidden conceptual import:

```text
@ai-world/platform-knowledge/src/internal/repositories/entity.repository
```

Consumers must use approved public exports.

---

# 94. Explicit Public Subpaths

Where one public entrypoint becomes too broad, explicit subpaths may be added.

Conceptual examples:

```text
@ai-world/platform-knowledge/contracts

@ai-world/platform-knowledge/events

@ai-world/platform-knowledge/testing
```

Only actual consumer needs justify them.

---

# 95. Contracts Stay With Their Owner

AI World should **not** create a universal root package such as:

```text
packages/contracts/
```

containing every Platform's business Contracts.

Why?

Because:

```text
ownership becomes unclear;

unrelated types become coupled;

the package becomes a dependency hub.
```

---

# 96. Contract Example

Knowledge Contracts belong with:

```text
Knowledge.
```

Media Contracts belong with:

```text
Media.
```

Identity Contracts belong with:

```text
Identity & Access.
```

---

# 97. Global Contract Standards vs Contract Source

Global standards may live in:

```text
docs/09-contracts/
```

but actual runtime business Contract definitions remain owned by their Capability.

---

# 98. No Global Domain Types Package

Avoid:

```text
packages/types/
```

containing:

```text
User

Entity

Asset

Generation

Page

Favorite
```

from unrelated owners.

---

# 99. Shared Semantic Types

A type may move into Kernel only when semantics are truly shared.

Example:

```text
canonical Identifier
```

may belong in:

```text
kernel/identifiers.
```

---

# 100. Shared Utilities

A small shared technical utility package may eventually be accepted if it is:

```text
Domain-neutral;

cohesive;

stable;

used broadly.
```

Do not create:

```text
packages/shared/
```

or:

```text
packages/common/
```

as default dumping grounds.

---

# 101. `packages/shared` Policy

Default:

```text
DO NOT CREATE.
```

If a future shared package is proposed, it must have a coherent semantic or technical name.

---

# 102. `packages/common` Policy

Default:

```text
DO NOT CREATE.
```

"Common" does not define ownership.

---

# 103. `packages/utils` Policy

Default:

```text
DO NOT CREATE AS A GENERAL DUMPING GROUND.
```

Utilities should remain close to their owner unless genuinely reusable and coherent.

---

# 104. Optional UI Package

A future reusable UI package may be introduced if multiple Applications share visual components.

Conceptual:

```text
packages/ui/
```

Status:

```text
NOT INITIAL REQUIREMENT.
```

---

# 105. UI Package Boundaries

A shared UI package must not become owner of:

```text
Knowledge business rules;

Authorization;

Universe Domain semantics.
```

It owns reusable presentation components only.

---

# 106. Optional Client SDK Package

A future external/client SDK might live under:

```text
packages/sdk/
```

only if multiple external or first-party clients genuinely need a generated/maintained SDK.

Not initial scope.

---

# 107. Optional Testing Package

Reusable test infrastructure may eventually live under:

```text
packages/testing/
```

or:

```text
tooling/testing/
```

depending on technology.

It must contain testing support only.

---

# 108. Production Dependency on Testing

Strictly forbidden:

```text
production code
    → testing package.
```

---

# 109. Capability Internal Structure

A substantial capability may evolve toward:

```text
<capability>/
├── src/
│   ├── public/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── internal/
├── tests/
├── README.md
└── <package configuration if independently packaged>
```

This is a **possible organizational pattern**, not mandatory ceremony.

---

# 110. Minimal Capability Structure

A small capability may begin simply:

```text
<capability>/
├── src/
│   ├── index.ts
│   └── ...
└── tests/
```

Add folders only when they improve clarity.

---

# 111. No Empty Architectural Folders

Do not create:

```text
domain/

application/

infrastructure/
```

with no meaningful content simply because architecture terminology exists.

---

# 112. `public/`

If used, `public/` contains:

```text
public Contracts;

public types;

public application interfaces;

public Events where intentionally exposed.
```

---

# 113. `domain/`

If used, `domain/` contains:

```text
Domain Models;

Value Objects;

Domain invariants;

Domain Services;

Domain-specific policies.
```

---

# 114. `application/`

If used, `application/` contains:

```text
use cases;

Commands;

Queries;

transaction coordination;

public application services.
```

---

# 115. `infrastructure/`

Inside a Capability, `infrastructure/` may contain:

```text
persistence implementations;

provider Adapters;

framework integration;

technical mapping.
```

This must not be confused with the root:

```text
infrastructure/
```

directory for deployment infrastructure.

---

# 116. Capability `internal/`

If used:

```text
internal/
```

makes implementation intent explicit.

Nothing from another ownership boundary should deep-import it.

---

# 117. Internal Folder Is Not Security

Folder naming does not enforce access automatically.

Package exports, linting, dependency checks, and review should reinforce the boundary.

---

# 118. Internal Architecture Flexibility

A Platform is not required to follow identical internal architecture to every other Platform.

For example:

```text
Identity & Access
```

may require more explicit layering than:

```text
a small Identifiers capability.
```

---

# 119. One Template Does Not Fit Every Capability

Do not force every capability to contain:

```text
entities/

services/

repositories/

factories/

strategies/

adapters/
```

if they are not needed.

---

# 120. Source Naming Principle

Names should express:

```text
business meaning;

capability responsibility;

architecture ownership.
```

Avoid vague names such as:

```text
manager

helper

processor
```

unless the behavior is genuinely described by that term.

---

# 121. `manager` Naming

A class called:

```text
SomethingManager
```

should be reviewed.

Usually a more specific responsibility exists.

---

# 122. `service` Naming

`Service` is permitted but should not become the only naming vocabulary.

Prefer names reflecting:

```text
use case;

Domain behavior;

integration role.
```

---

# 123. Repository Naming

A Repository should belong to the canonical owner whose state it persists.

Example:

```text
Knowledge EntityRepository
```

stays inside Knowledge.

---

# 124. No Global Repositories Directory

Avoid root structure:

```text
repositories/
    user.repository
    entity.repository
    asset.repository
```

This groups by technical type and obscures ownership.

---

# 125. No Global Models Directory

Avoid:

```text
models/
```

containing every Domain model.

---

# 126. No Global Services Directory

Avoid:

```text
services/
```

containing every Platform's services.

---

# 127. Capability-First Structure

Prefer:

```text
knowledge/
    Entity
    Knowledge services
    Knowledge repositories

media/
    Asset
    Media services
    Media repositories
```

over global technical-layer grouping.

---

# 128. Database Schema Location

Exact database schema structure depends on selected technology.

Repository architecture requires only:

```text
ownership remains traceable.
```

---

# 129. Central ORM Schema Possibility

Some technologies may require one central schema file.

If so:

```text
central physical schema
```

does not mean:

```text
central semantic ownership.
```

Models should still indicate capability ownership through:

```text
naming;

schema sections;

comments;

generation structure;

migration ownership;

supporting repository organization.
```

---

# 130. Distributed Schema Possibility

If technology supports distributed schemas/models per package, owner-colocated persistence is preferred where practical.

---

# 131. Migration Placement Principle

Preferred:

```text
migrations stay attributable to the Capability whose state they evolve.
```

---

# 132. Owner-Colocated Migration Model

If tooling allows:

```text
packages/platforms/knowledge/migrations/

packages/platforms/media/migrations/
```

is a strong model.

---

# 133. Central Migration Model

If technology requires:

```text
database/migrations/
```

migration metadata/naming/documentation must still identify the canonical owner.

Conceptual:

```text
2026..._knowledge_add_entity_status

2026..._media_add_asset_checksum.
```

---

# 134. Cross-Capability Migration

A migration modifying multiple canonical owners should be exceptional.

It must document why one coordinated migration is necessary.

---

# 135. Seed Placement

Seed mechanics may be Foundation-owned.

Seed definitions should remain close to the Capability/environment whose data they create.

---

# 136. Development Seed Example

Conceptually:

```text
Identity & Access
    defines development Roles

Anime
    defines Anime sample data

History
    defines History sample data

Seed runner
    composes them.
```

---

# 137. Root Seed Dumping Ground

Avoid one giant:

```text
seed.ts
```

that understands every Domain indefinitely.

---

# 138. Provider Adapter Placement

Provider Adapters should remain with their owner.

Examples:

```text
packages/foundations/storage/.../adapters/

packages/foundations/email/.../adapters/

packages/platforms/ai-creator/.../adapters/

packages/platforms/discovery/.../adapters/
```

---

# 139. No Global Providers Directory by Default

Avoid:

```text
packages/providers/
    openai/
    aws/
    elastic/
```

as the initial architecture.

Provider ownership becomes unclear.

---

# 140. When a Provider Package May Be Valid

A provider-specific package may be extracted later if:

```text
several Capabilities legitimately share one provider-specific technical integration;

provider integration is large;

the package still has coherent ownership.
```

This requires architectural review.

---

# 141. External SDK Imports

External SDK imports should remain localized inside owner integration areas.

Future static checks may restrict them.

---

# 142. Universe Extension Placement

A Universe-specific Extension belongs with that Universe.

Example:

```text
packages/universes/history/
└── src/
    └── extensions/
```

only when real Extensions exist.

---

# 143. Platform Extension Contract Placement

The corresponding Extension Contract belongs with the Platform being extended.

Example:

```text
packages/platforms/knowledge/
    owns KnowledgeValidatorExtension Contract.
```

---

# 144. Shared Platform Must Not Import Extension

The dependency direction remains:

```text
History Extension
    → Knowledge Extension Contract.
```

---

# 145. Strategy Placement

Strategy Contracts belong to the Capability using the Strategy.

Concrete generic Strategies may live with that owner.

Universe-specific Strategies may live with the Universe.

---

# 146. Registry Placement

A Registry belongs to the Capability owning the registered concept.

Examples:

```text
Universe Registry
    Universe runtime/composition capability

Ranking Strategy Registry
    Discovery

AI Provider Registry
    AI / Creator.
```

---

# 147. No Global Registry Package

Do not create:

```text
packages/registry/
```

for all registries.

---

# 148. Composition Root Location

Composition Root belongs to the executable Application/runtime.

Examples:

```text
apps/api/src/bootstrap/

apps/worker/src/bootstrap/
```

or equivalent.

---

# 149. Why Composition Root Lives in App

The Application is responsible for assembling:

```text
Platforms;

Foundations;

Adapters;

Universes;

runtime configuration.
```

Therefore it may know concrete implementations.

---

# 150. Composition Root Restriction

Application bootstrap may import many packages.

Business packages must not acquire the same unrestricted dependency privileges.

---

# 151. Multiple Composition Roots

Different Applications may have different Composition Roots.

Example:

```text
API
    requires HTTP + Platforms

Worker
    requires Queue + selected Platform Job handlers.
```

---

# 152. Composition Duplication

Small wiring duplication between Applications is acceptable.

Do not build a complex universal bootstrap framework prematurely.

---

# 153. Shared Runtime Composition

If wiring becomes significantly duplicated, a narrowly owned runtime-composition package may later emerge.

Not initial scope.

---

# 154. `docs/`

The canonical documentation architecture remains:

```text
docs/
```

with the previously accepted documentation structure.

Documentation is not generated from source automatically by default.

---

# 155. Docs Are First-Class Repository Content

Architecture and engineering documentation must be committed alongside source.

---

# 156. Documentation Ownership

Capability-specific docs live under their accepted documentation area.

Examples:

```text
docs/04-foundations/storage/

docs/05-platform-kernel/relationships/

docs/06-platforms/knowledge/

docs/07-universes/examples/anime/
```

---

# 157. Code README vs Canonical Architecture Docs

A code-level `README.md` may explain:

```text
how to use/build/test a package.
```

Canonical architectural decisions remain under:

```text
docs/.
```

Avoid duplicating entire architecture documents into source package READMEs.

---

# 158. Package README Purpose

A package README may include:

```text
purpose;

classification;

owner;

public entrypoints;

local development commands;

links to canonical docs.
```

---

# 159. `infrastructure/`

Root:

```text
infrastructure/
```

owns deployable/environment infrastructure definitions.

Possible future content:

```text
environments/

deployment/

networking/

databases/

storage/

observability/

secrets integration.
```

Exact technology is not yet selected.

---

# 160. Infrastructure Is Not Foundation Source

Important distinction:

```text
packages/foundations/storage
    defines AI World Storage capability.

infrastructure/
    provisions actual storage infrastructure.
```

---

# 161. Infrastructure Provider Specificity

Unlike Domain packages, root infrastructure may legitimately contain cloud/provider-specific definitions.

Example future:

```text
infrastructure/<cloud-provider>/
```

because deployment infrastructure is inherently implementation-specific.

---

# 162. Cloud Provider Leakage

Provider-specific infrastructure must not cause Domain packages to depend on cloud-specific resource names.

---

# 163. Environment Organization

Potential future organization:

```text
infrastructure/
├── environments/
│   ├── development/
│   ├── staging/
│   └── production/
└── modules/
```

Exact structure depends on selected infrastructure technology.

---

# 164. Infrastructure Do-Not-Create Rule

Do not create extensive infrastructure folders before Technology Strategy selects actual deployment direction.

---

# 165. Local Development Infrastructure

Local environment configuration may later use:

```text
containers;

local services;

emulators.
```

This may live under:

```text
infrastructure/local/
```

or another clearly documented location.

---

# 166. `docker/` Directory

A dedicated root:

```text
docker/
```

may be retained or introduced if container-based local/deployment workflows justify it.

It must not duplicate authoritative deployment definitions under `infrastructure/`.

---

# 167. Docker Is Not Architecture

Container files represent implementation/runtime packaging.

They must not determine Platform ownership.

---

# 168. `scripts/`

Root:

```text
scripts/
```

contains project automation intended to be invoked directly.

Examples:

```text
repository bootstrap;

development environment automation;

migration helpers;

validation commands;

release automation.
```

---

# 169. Scripts Must Stay Thin

Scripts should orchestrate supported tooling.

Avoid large business systems hidden in shell/Node/Python scripts.

---

# 170. Script Business Logic

Bad:

```text
script directly updates business tables
using duplicated validation.
```

Preferred:

```text
script invokes an owned migration/CLI/application capability.
```

---

# 171. One-Off Scripts

Temporary one-off scripts should either:

```text
be removed after use;
```

or:

```text
be promoted into maintained tooling with ownership.
```

Do not accumulate unexplained scripts indefinitely.

---

# 172. Script Naming

Script names should describe purpose clearly.

Avoid:

```text
fix.js

temp.py

run2.sh.
```

---

# 173. `tooling/`

Root:

```text
tooling/
```

contains reusable engineering tools/configuration that support the repository itself.

Potential future content:

```text
lint configuration;

test configuration;

build presets;

code generation;

architecture checks;

development CLI support.
```

---

# 174. Tooling vs Production Packages

Tooling must not become a runtime dependency of production Domain code unless explicitly designed as such.

---

# 175. Tooling Package Possibility

If the selected monorepo technology benefits from internal config packages, they may live under:

```text
tooling/
```

or another conventional workspace area.

Technology Strategy will decide.

---

# 176. Architecture Enforcement Tooling

Future dependency enforcement may live under:

```text
tooling/architecture/
```

or be represented through standard lint/build configuration.

---

# 177. Code Generation Tooling

If AI World generates:

```text
API clients;

schemas;

types;

Universe artifacts;
```

generation source/configuration must have a clear owner.

Generated output must not become the architectural source of truth accidentally.

---

# 178. Generated Source Rule

Generated source should be clearly marked and reproducible.

Manual edits to generated output should be avoided.

---

# 179. `tests/`

Root:

```text
tests/
```

is reserved for tests whose scope crosses individual ownership boundaries.

Potential content:

```text
system E2E;

cross-Application E2E;

architecture conformance;

system contract suites;

performance suites.
```

---

# 180. Root Tests Are Not Mandatory Initially

If all early tests naturally belong inside:

```text
apps/

packages/
```

then root `tests/` may remain absent.

---

# 181. Unit Test Placement

Unit tests should normally stay close to their owning source.

Possible patterns:

```text
src/.../*.test.*

tests/unit/
```

Exact framework convention comes later.

---

# 182. Integration Test Placement

Capability-specific integration tests should remain with the owner.

Example:

```text
packages/platforms/knowledge/tests/integration/
```

if that structure proves useful.

---

# 183. App E2E Tests

Application-specific E2E tests may live with the Application.

Example:

```text
apps/api/tests/e2e/

apps/web/tests/e2e/
```

---

# 184. System E2E Tests

Cross-system scenarios may live at root:

```text
tests/e2e/
```

if they span several Applications.

---

# 185. Architecture Tests

Architecture/dependency tests may live under:

```text
tests/architecture/
```

or:

```text
tooling/architecture/
```

depending on chosen tooling.

---

# 186. Contract Tests

Contract tests should remain close to the Contract owner or shared between owner and Adapter through dedicated test utilities.

---

# 187. Provider Integration Tests

Provider-specific integration tests should remain near the Provider Adapter.

They should be separable from ordinary unit test execution where live credentials/services are required.

---

# 188. Fixture Ownership

Capability-specific Fixtures should remain with the capability's test support.

Avoid one universal fixture directory containing all Domain data.

---

# 189. Test Data Universes

Anime and History may provide small deterministic test datasets for proof/testing.

These datasets belong to their respective Universe/test ownership.

---

# 190. Environment Files

Canonical repository direction:

```text
.env.example
```

may exist at root or per Application where configuration ownership requires it.

Real Secrets must never be committed.

---

# 191. `.env` Ownership

Local `.env` files are developer/runtime artifacts.

They are not canonical product configuration.

---

# 192. Environment Configuration Duplication

Avoid many duplicated environment files with unclear precedence.

Configuration standards will define the final strategy during Engineering Foundation.

---

# 193. Root Configuration Files

Build/lint/format/workspace files may live at root where they configure the monorepo.

They are repository tooling concerns.

---

# 194. Root README

Root:

```text
README.md
```

should eventually explain:

```text
what AI World is;

repository purpose;

current project status;

how to navigate docs;

how to start development;

major commands.
```

It should not duplicate the full architecture documentation.

---

# 195. Workspace Configuration

The repository may eventually require files for:

```text
workspace management;

package management;

task execution;

build orchestration.
```

The exact tooling is intentionally deferred to P0-D17.

---

# 196. Monorepo Principle

AI World will use a **single canonical monorepo** for the initial Platform.

The repository should contain:

```text
Applications;

shared capabilities;

Universes;

infrastructure definitions;

documentation;

engineering tooling.
```

---

# 197. Why Monorepo

A monorepo supports:

```text
atomic changes across Contracts and consumers;

shared architecture enforcement;

consistent tooling;

easy first-party Universe development;

coordinated migrations;

central documentation;

simpler early Platform development.
```

---

# 198. Monorepo Is Not Shared Ownership

Being in one repository does not mean every module may import every other module.

Architectural boundaries remain mandatory.

---

# 199. Monorepo Does Not Mean Single Deployment

A monorepo may produce:

```text
Web Application;

API runtime;

Worker runtime;

future independent services.
```

---

# 200. Monorepo Does Not Mean Single Package

The repository may contain several independently bounded packages.

Package count should grow from real architectural need.

---

# 201. Monorepo Does Not Mean One Version Forever

Initial first-party packages may evolve together.

Independent package versioning may be introduced later only if necessary.

---

# 202. Initial Versioning Direction

Early internal packages should normally move with repository revisions rather than complex independently published versions.

---

# 203. External Contract Versioning

External API/Event compatibility is separate from internal package versioning.

---

# 204. Package Dependency Direction

Canonical direction:

```text
apps
    ↓

universes
    ↓

platforms
    ↓

kernel
    ↓

foundations
```

with deliberate peer Platform dependencies and Adapter inversion defined by P0-D14.

---

# 205. Source Structure Dependency Matrix

| Source Area | May Depend On |
|---|---|
| `apps/*` | Universe public surface, Platform public surface, selected Kernel/Foundation public surfaces, Application-local code |
| `packages/universes/*` | Platform public Contracts, Kernel public Contracts, Universe-local code |
| `packages/platforms/*` | Kernel, Foundations, approved peer Platform public Contracts |
| `packages/kernel/*` | Foundations, approved Kernel public Contracts |
| `packages/foundations/*` | Approved Foundations, provider SDKs at integration edges |
| Provider Adapter | Owned Contract + external Provider SDK |
| `infrastructure/*` | Deployment/provider tooling; must not become Domain dependency |
| `tooling/*` | Repository/build/test tooling |
| `tests/*` | Public Contracts and intentional test interfaces |

---

# 206. Forbidden Source Directions

Forbidden by default:

```text
Foundation
    → Kernel

Foundation
    → Platform

Foundation
    → Universe

Kernel
    → Platform

Kernel
    → Universe

Platform
    → Universe

Platform
    → Application

Universe
    → Foundation implementation

Universe
    → Provider SDK

Production package
    → Application internals

Production code
    → test fixtures/helpers.
```

---

# 207. Peer Platform Dependencies

If:

```text
Platform A
```

needs:

```text
Platform B,
```

A may depend only on B's public Contract.

---

# 208. Package Manifest Dependency

When packages are independently declared, their manifest dependencies must match real source dependencies.

Do not depend on every internal package "just in case."

---

# 209. Dependency Hygiene

Unused package dependencies should be removed.

The declared dependency graph should remain an accurate architecture artifact.

---

# 210. Circular Workspace Dependencies

Circular package dependencies are forbidden by default.

If a cycle appears, ownership must be reviewed before using tooling workarounds.

---

# 211. Package Export Rule

A package should explicitly export supported interfaces.

Avoid exporting every source file by default.

---

# 212. Package Private Internals

Where tooling supports package export maps, internal source should be inaccessible through supported package imports.

---

# 213. Deep Relative Imports

Cross-ownership relative imports such as:

```text
../../../platforms/knowledge/src/...
```

should be treated as architecture violations.

---

# 214. Path Aliases

Path aliases may improve readability.

They must reflect ownership rather than hide invalid dependencies.

---

# 215. Alias Naming

If aliases are used, names should map to canonical capability ownership.

Avoid:

```text
@shared/*

@common/*.
```

Prefer architecture-aware aliases.

---

# 216. Import Boundary Enforcement

Future tooling should enforce:

```text
allowed package dependencies;

public entrypoints;

restricted deep imports;

layer direction.
```

---

# 217. Provider SDK Enforcement

Future tooling may restrict Provider package imports to approved integration directories.

---

# 218. ORM Import Enforcement

Future tooling may restrict direct ORM/database imports to:

```text
Database Foundation;

owned persistence implementations;

migration tooling;

approved testing support.
```

---

# 219. Universe Neutrality Enforcement

Future checks should ensure:

```text
platforms/*
kernel/*
foundations/*
```

do not import concrete Universe source.

---

# 220. Architecture Test Enforcement

A future architecture suite should be capable of asserting:

```text
layer direction;

public/private imports;

no Platform cycles;

no Provider leakage;

no Universe leakage;

no test-to-production leakage.
```

---

# 221. Enforcement Timing

Do not implement complex enforcement before source structure exists.

Sequence:

```text
Architecture documented
    ↓
Repository materialized
    ↓
real dependencies appear
    ↓
high-value rules automated.
```

---

# 222. Package Boundary vs Runtime Performance

Do not collapse ownership boundaries merely to avoid imagined package/runtime overhead.

Internal workspace package boundaries generally do not imply network overhead.

---

# 223. Package Boundary vs Build Performance

If package count eventually harms developer/build performance, optimize tooling without abandoning ownership unnecessarily.

---

# 224. Source Colocation Principle

Code that changes together and shares one owner should usually remain close together.

---

# 225. Separation Principle

Code with different:

```text
ownership;

dependency direction;

provider dependencies;

security concerns
```

may deserve separate boundaries even if currently small.

---

# 226. Capability Cohesion

A package should represent a coherent capability.

Avoid packages containing unrelated:

```text
authentication + media + taxonomy
```

because they happen to use similar technical libraries.

---

# 227. Framework Module Boundaries

If a backend framework provides Modules, those modules should reflect AI World capability boundaries.

Framework modules must not redefine the architecture.

---

# 228. Framework Module Example

Potential:

```text
IdentityAccessModule

KnowledgeModule

MediaModule.
```

The exact framework is not yet selected.

---

# 229. No Framework Shared Module Dump

Avoid:

```text
SharedModule
```

that imports and exports every capability globally.

---

# 230. Global Module Warning

Framework "global" dependency features should be used sparingly.

They can hide architectural dependencies.

---

# 231. Infrastructure Dependency Injection

Foundations such as:

```text
Observability

Configuration
```

may be broadly injectable.

Their low-level nature must remain clear.

---

# 232. Domain Dependency Injection

Peer business Platforms should still use deliberate public Contracts even if DI framework makes every service globally available.

---

# 233. Backend Internal Architecture

Within a major Platform, code may follow a shape such as:

```text
public Contract
        ↓
application/use case
        ↓
Domain behavior
        ↓
owned persistence / external Port
```

only where that structure helps.

---

# 234. Frontend Architecture

Frontend should organize primarily around:

```text
Application features;

shared UI;

Universe presentation;

API client boundaries.
```

It must not duplicate backend Domain ownership.

---

# 235. Frontend Domain Models

Frontend may define presentation/view models.

They must not become independent canonical Domain definitions when server/shared Contracts already exist.

---

# 236. API Client Ownership

Frontend API clients should be generated or manually owned in a clear integration area.

Avoid network requests scattered throughout arbitrary UI components.

---

# 237. Web Universe Presentation

Possible conceptual structure:

```text
apps/web/src/
├── features/
├── universes/
│   ├── anime/
│   └── history/
├── app/
└── infrastructure/
```

Exact frontend framework conventions will be selected later.

---

# 238. Web Shared Components

Reusable generic UI components may remain:

```text
apps/web/src/components/
```

initially.

Extract to a package only when another Application needs them.

---

# 239. Web Feature Components

Feature-specific UI should remain near the feature rather than forcing everything into a global components directory.

---

# 240. API Transport Organization

Potential backend Application transport organization:

```text
apps/api/src/
├── bootstrap/
├── http/
└── health/
```

Business capability controllers/adapters may be organized by capability depending on framework.

Exact structure comes later.

---

# 241. API Route Ownership

Route source may live under API Application.

The invoked business Contract remains Platform-owned.

---

# 242. Worker Handler Organization

Queue handlers should remain thin.

Conceptual:

```text
apps/worker/src/handlers/
    process-asset
    generate-content
```

Handlers invoke owned Platform operations.

---

# 243. No Business Logic in Worker Handler

Business logic should remain in:

```text
Media;

AI / Creator;

Discovery;

other owner.
```

---

# 244. CLI Applications

A maintained CLI may eventually become:

```text
apps/cli/
```

if it is a true executable product/developer tool.

Small scripts should remain under `scripts/`.

---

# 245. CLI Ownership

CLI commands orchestrate public capability/tooling Contracts.

They must not duplicate business invariants.

---

# 246. Infrastructure CLI

Migration/seed administration may initially be provided through selected technology commands rather than an AI World CLI.

No CLI framework is required upfront.

---

# 247. Source Boundaries and Security

Repository boundaries are not security boundaries.

However, strong source ownership reduces accidental privilege and access violations.

---

# 248. Secrets in Repository

No real Secrets should be committed under:

```text
apps/

packages/

infrastructure/

docs/

tests/
```

---

# 249. Secret Examples

Never commit:

```text
database passwords;

AI API keys;

JWT/private signing material;

cloud credentials;

email provider credentials.
```

---

# 250. Example Configuration Files

Safe committed configuration may include:

```text
.env.example

configuration schemas

local development defaults without Secrets.
```

---

# 251. Generated Assets

Build-generated outputs should not be treated as source.

Examples:

```text
dist/

build/

coverage/

generated cache.
```

Version-control policy will define exceptions.

---

# 252. Generated API Artifacts

If API schemas or clients are generated, decide explicitly whether generated output is:

```text
committed
```

or:

```text
reproducibly generated during build.
```

Do not mix approaches accidentally.

---

# 253. Uploads and Runtime Data

Runtime-generated uploads must not live inside committed source directories.

Media runtime state belongs to Storage infrastructure.

---

# 254. Local Runtime Files

Development-only runtime state should be:

```text
ignored;

disposable;

clearly outside source ownership.
```

---

# 255. Dependency on `node_modules`

No repository architecture decision should rely on manually editing installed dependencies.

Dependency state must come from package/workspace configuration.

---

# 256. Build Output Imports

Production source should not import another package's compiled output through filesystem paths.

Use declared package/public Contracts.

---

# 257. Package Source Imports

Workspace tooling may compile from source or package builds.

Technology Strategy will decide the mechanism.

Architecture cares only that ownership remains valid.

---

# 258. Repository Naming Conventions

Directories use:

```text
lowercase-kebab-case
```

by default.

Examples:

```text
identity-access

ai-creator

composition-cms

feature-flags.
```

---

# 259. Canonical AI World Name

Project display name:

```text
AI World
```

Canonical internal repository/project slug:

```text
ai-world
```

---

# 260. No `v2` in Canonical Naming

The greenfield repository should not encode migration history into permanent names such as:

```text
ai-world-v2.
```

Legacy repositories may use:

```text
ai-world-legacy
```

or equivalent.

---

# 261. Legacy Repository Isolation

Legacy source is:

```text
REFERENCE ONLY.
```

The new repository must not depend on legacy packages as runtime dependencies.

---

# 262. Copying Legacy Code

Legacy code may be studied or selectively adapted.

Any copied concept must conform to:

```text
new ownership;

new dependency rules;

new architecture;

new testing standards.
```

---

# 263. No Legacy Compatibility Layer by Default

Do not create compatibility wrappers around legacy architecture unless a real migration requirement exists.

---

# 264. Repository Status During Phase 0

At this point:

```text
Documentation architecture:
FROZEN v1

Source architecture:
DEFINED CONCEPTUALLY

Technology stack:
NOT YET FROZEN

Implementation:
NOT STARTED BY DESIGN
```

---

# 265. Do Not Materialize Entire Source Tree Yet

Acceptance of this document does **not** mean immediately creating:

```text
all apps;

all packages;

all Foundation folders;

all Kernel folders;

all Platform folders.
```

The repository should materialize source incrementally after Phase 0.

---

# 266. Why Empty Source Folders Should Not Be Created

Empty architecture folders:

```text
create false implementation signals;

increase visual noise;

are not tracked by Git without placeholder files;

encourage speculative structure.
```

---

# 267. Repository Materialization Principle

After Phase 0:

```text
create only the structure required by the next implementation phase.
```

---

# 268. Expected Phase 1 Materialization

Engineering Foundation will likely require a subset such as:

```text
apps/api/

apps/web/

packages/foundations/configuration/

packages/foundations/database/

packages/foundations/migration/

packages/foundations/observability/
```

Exact folders depend on P0-D17 and P0-D18.

---

# 269. Expected Identity Phase Materialization

Identity implementation may introduce:

```text
packages/platforms/identity-access/

packages/platforms/user/

packages/foundations/email/
```

and required Kernel capabilities.

---

# 270. Expected Knowledge Phase Materialization

Knowledge implementation may introduce:

```text
packages/platforms/knowledge/

packages/kernel/identifiers/

packages/kernel/taxonomy/

packages/kernel/relationships/

packages/universes/anime/

packages/universes/history/
```

as the roadmap requires.

---

# 271. Repository Expansion Rule

Every newly created top-level ownership area should correspond to an accepted capability or explicit engineering need.

---

# 272. New Root Directory Rule

Adding a new root-level directory requires stronger justification than adding an internal capability folder.

The root is part of the repository's architectural interface.

---

# 273. Root Directory Review

Before adding a root folder ask:

```text
Can this live under apps?

Can this live under packages?

Can this live under infrastructure?

Can this live under tooling?

Can this live under scripts?

Can this live under tests?

Does it represent a genuinely new repository concern?
```

---

# 274. Package Group Review

Before adding a new group beside:

```text
foundations/

kernel/

platforms/

universes/
```

ask whether it represents a real architectural classification.

---

# 275. `domain/` Root Rule

Do not create:

```text
packages/domain/
```

as a generic ownership area.

Domain logic belongs to its Platform or Universe.

---

# 276. `core/` Root Rule

Avoid generic:

```text
packages/core/
```

because "core" is ambiguous between:

```text
Kernel;

Platforms;

shared utilities;

runtime.
```

Use explicit architectural names.

---

# 277. `shared/` Root Rule

Avoid.

---

# 278. `common/` Root Rule

Avoid.

---

# 279. `services/` Root Rule

Avoid.

---

# 280. `modules/` Root Rule

Avoid as primary architecture.

A framework-specific module folder may exist inside an Application or Capability if needed.

---

# 281. `libs/` vs `packages/`

Canonical AI World direction:

```text
packages/
```

is preferred over simultaneously maintaining:

```text
libs/

packages/
```

for reusable source.

Use one convention.

---

# 282. Why `packages/`

`packages/` communicates:

```text
reusable bounded source;
```

and works conceptually regardless of selected monorepo technology.

---

# 283. Application Libraries

Code shared only within one Application may remain inside that Application.

Not every reusable function belongs in `packages/`.

---

# 284. Two-Consumer Rule Is Not Absolute

A package does not automatically become shared after two imports.

Evaluate semantics and future coupling.

---

# 285. Package Stability

The wider a package's consumer base, the smaller and more stable its public surface should become.

---

# 286. Internal Refactoring Freedom

Consumers must not depend on internal paths so package owners can freely refactor implementation.

---

# 287. Capability Ownership Metadata

A future package README or manifest may include metadata such as:

```text
Classification:
Platform

Owner:
Knowledge

Status:
Implemented

Canonical docs:
docs/06-platforms/knowledge/
```

This may improve maintainability.

---

# 288. CODEOWNERS Direction

A source-control `CODEOWNERS` file may later be introduced when multiple maintainers/teams require formal review ownership.

It is not needed solely for architectural symmetry.

---

# 289. Repository Dependency Graph

The repository should eventually support generating a dependency graph.

The graph should expose:

```text
package edges;

cycles;

architecture layer violations;

highly connected hubs.
```

---

# 290. Dependency Graph Is Diagnostic

The graph does not replace human architecture review.

A technically acyclic graph may still have poor semantic ownership.

---

# 291. Package Build Graph

Build orchestration should use actual package dependencies where tooling supports it.

This improves:

```text
incremental builds;

test selection;

CI efficiency.
```

---

# 292. Package Test Graph

A change to:

```text
kernel/identifiers
```

may need tests for dependent Platforms.

Tooling may eventually derive this automatically.

---

# 293. Repository CI Direction

Future CI should conceptually perform:

```text
format validation;

lint;

type validation;

unit tests;

integration tests;

architecture checks;

build;

security checks.
```

Actual tools come later.

---

# 294. Documentation CI

Future CI may validate:

```text
broken internal links;

documentation formatting;

required metadata;

ADR naming.
```

Only if benefit justifies tooling.

---

# 295. Repository Quality Gates

Quality gates should be repository-wide where applicable, while tests remain owner-specific.

---

# 296. Repository Release Direction

Initial AI World releases should likely represent the Platform repository as a coordinated product.

Independent package release pipelines are not needed initially.

---

# 297. Release Artifacts

Potential release artifacts may include:

```text
Web build;

API build/container;

Worker build/container;

migration artifacts;

infrastructure definitions.
```

Exact artifacts depend on Technology Strategy.

---

# 298. Package Publishing

Internal workspace packages do not need to be published externally merely to be consumed by Applications in the same monorepo.

---

# 299. External SDK Publishing

If a public SDK eventually exists, it may use separate publishing/versioning rules.

Not initial scope.

---

# 300. Repository Security Boundaries

Sensitive infrastructure source may require stronger review.

Examples:

```text
authentication implementation;

authorization;

secret integration;

production infrastructure;

data migrations.
```

---

# 301. Repository Review Boundaries

Changes to:

```text
Kernel;

Foundation public Contracts;

Platform public Contracts;

Universe extension Contracts
```

deserve stronger architectural review than local implementation changes.

---

# 302. Breaking Package Change

An internal package change is breaking when it changes a public Contract used by another owner.

Same-repository atomic updates may make migration easier.

That does not eliminate the need for deliberate Contract design.

---

# 303. Internal Contract Evolution

Early first-party internal Contracts may evolve quickly while architecture is being validated.

Stable public surfaces should remain intentionally small.

---

# 304. Repository and ADRs

Repository-wide structural decisions should use ADRs when they materially alter the accepted architecture.

Examples:

```text
switch monorepo model;

introduce microservice repository split;

introduce public plugin packages;

move a major Platform;

adopt independent package releases.
```

---

# 305. Repository Split

AI World should not split major Platform source into several repositories initially.

A repository split introduces:

```text
version coordination;

cross-repo Contracts;

CI complexity;

developer friction;

release complexity.
```

---

# 306. Future Multi-Repository Architecture

A future repository split may be justified by:

```text
independent organization;

security boundary;

external open-source project;

independent product;

very different lifecycle.
```

It requires architectural review.

---

# 307. Universe Repository Split

Universes should initially remain in the AI World monorepo.

This supports proving shared architecture.

A separate third-party Universe ecosystem is future scope.

---

# 308. Infrastructure Repository Split

Infrastructure should remain in the monorepo initially unless security/operations requirements justify separation.

---

# 309. Documentation Repository Split

Canonical architecture documentation should remain with source.

Do not create a separate docs repository initially.

---

# 310. Example Target Repository — Conceptual Mature Form

```text
ai-world/
│
├── apps/
│   ├── api/
│   ├── web/
│   └── worker/                         # only when required
│
├── packages/
│   │
│   ├── foundations/
│   │   ├── configuration/
│   │   ├── database/
│   │   ├── repository/
│   │   ├── migration/
│   │   ├── seed/
│   │   ├── storage/
│   │   ├── cache/
│   │   ├── queue/
│   │   ├── scheduler/
│   │   ├── email/
│   │   ├── observability/
│   │   └── feature-flags/
│   │
│   ├── kernel/
│   │   ├── identifiers/
│   │   ├── namespace/
│   │   ├── taxonomy/
│   │   ├── metadata/
│   │   ├── relationships/
│   │   ├── events/
│   │   ├── audit/
│   │   ├── workflow/
│   │   ├── policy/
│   │   ├── localization/
│   │   └── versioning/
│   │
│   ├── platforms/
│   │   ├── identity-access/
│   │   ├── user/
│   │   ├── knowledge/
│   │   ├── media/
│   │   ├── discovery/
│   │   ├── ai-creator/
│   │   ├── composition-cms/
│   │   ├── engagement/
│   │   └── operations/
│   │
│   └── universes/
│       ├── anime/
│       └── history/
│
├── docs/
│
├── infrastructure/
│
├── scripts/
│
├── tooling/
│
├── tests/                              # only when system-level suites require it
│
├── .editorconfig
├── .env.example
├── .gitignore
├── README.md
└── <workspace/tool configuration>
```

This is a **mature conceptual target**, not a command to create all directories immediately.

---

# 311. Example Minimal Initial Implementation Shape

After Phase 0, the first implementation may begin much smaller:

```text
ai-world/
│
├── apps/
│   ├── api/
│   └── web/
│
├── packages/
│   └── foundations/
│       ├── configuration/
│       ├── database/
│       └── observability/
│
├── docs/
│
├── infrastructure/
├── scripts/
└── tooling/
```

Additional directories appear as implementation reaches their capabilities.

---

# 312. Example Identity Expansion

Later:

```text
packages/
├── foundations/
│   ├── configuration/
│   ├── database/
│   ├── email/
│   └── observability/
│
├── kernel/
│   ├── identifiers/
│   ├── namespace/
│   └── audit/
│
└── platforms/
    ├── identity-access/
    └── user/
```

---

# 313. Example Knowledge Expansion

Later:

```text
packages/
├── kernel/
│   ├── identifiers/
│   ├── taxonomy/
│   ├── relationships/
│   └── events/
│
├── platforms/
│   └── knowledge/
│
└── universes/
    ├── anime/
    └── history/
```

---

# 314. Example Media Expansion

```text
packages/
├── foundations/
│   └── storage/
│
└── platforms/
    └── media/
```

---

# 315. Example Discovery Expansion

```text
packages/platforms/discovery/
```

may initially use Database capabilities.

A dedicated Search Adapter should appear only if dedicated Search infrastructure is introduced.

---

# 316. Example AI Expansion

```text
packages/platforms/ai-creator/
```

may contain:

```text
Generation Domain

AI Provider Port

one Provider Adapter

AI safety

context construction.
```

No separate provider package is necessary initially.

---

# 317. Example Worker Expansion

When long-running AI/Media work becomes real:

```text
apps/worker/
```

can be added and consume:

```text
Media;

AI / Creator;

Queue Foundation.
```

---

# 318. Repository Architecture Anti-Pattern — App Contains Everything

Bad:

```text
apps/api/src/modules/
    auth/
    users/
    knowledge/
    media/
```

where reusable Platform implementation permanently remains owned by the API Application.

The exact source may initially start near the runtime during bootstrapping, but accepted long-term ownership should move into the Platform area once implementation becomes substantive.

---

# 319. Repository Architecture Anti-Pattern — Package for Every File

Bad:

```text
packages/entity-id/

packages/entity-name/

packages/asset-url/
```

without meaningful independent capability boundaries.

---

# 320. Repository Architecture Anti-Pattern — One Giant Platform Package

Bad:

```text
packages/platform/
```

containing every business Platform with unrestricted internal imports.

This makes architectural dependency enforcement difficult.

---

# 321. Repository Architecture Anti-Pattern — One Giant Core

Bad:

```text
packages/core/
```

containing:

```text
auth;

database;

knowledge;

media;

utilities;

events.
```

---

# 322. Repository Architecture Anti-Pattern — Shared Dumping Ground

Bad:

```text
packages/shared/
```

becoming the owner of anything difficult to classify.

---

# 323. Repository Architecture Anti-Pattern — Global Models

Bad:

```text
packages/models/
```

containing all ORM/Domain models.

---

# 324. Repository Architecture Anti-Pattern — Global Repositories

Bad:

```text
packages/repositories/
```

containing persistence for every owner.

---

# 325. Repository Architecture Anti-Pattern — Global Services

Bad:

```text
packages/services/
```

containing all business behavior.

---

# 326. Repository Architecture Anti-Pattern — Global Adapters

Bad:

```text
packages/adapters/
```

without capability ownership.

---

# 327. Repository Architecture Anti-Pattern — Global Events

Bad:

```text
packages/events/
```

containing all Domain Events without producer ownership.

Events Kernel may own mechanism/contracts standards.

Specific business Events remain with producers.

---

# 328. Repository Architecture Anti-Pattern — Global DTOs

Bad:

```text
packages/dtos/
```

for every API/business contract.

DTOs should remain owned by boundary/capability.

---

# 329. Repository Architecture Anti-Pattern — Universe Stack Duplication

Bad:

```text
apps/anime-api/

apps/history-api/

packages/anime-auth/

packages/history-auth/

packages/anime-search/

packages/history-search/
```

---

# 330. Repository Architecture Anti-Pattern — Provider-Led Business Packages

Bad:

```text
packages/openai/

packages/s3/

packages/redis/
```

as primary Domain architecture.

---

# 331. Repository Architecture Anti-Pattern — Microservice Folder Prematurity

Bad:

```text
services/
    auth-service/
    media-service/
    knowledge-service/
```

before service extraction is justified.

---

# 332. Repository Architecture Anti-Pattern — Duplicate Domain Models Per App

Bad:

```text
apps/web/domain/entity

apps/api/domain/entity

apps/admin/domain/entity
```

as independent canonical definitions.

---

# 333. Repository Architecture Anti-Pattern — Deep Imports

Bad:

```text
../../../../knowledge/src/private/entity-model
```

---

# 334. Repository Architecture Anti-Pattern — Package Export Everything

Bad:

```text
export * from './src/**/*'
```

or equivalent broad exposure.

---

# 335. Repository Architecture Anti-Pattern — Tests as Production Source

Production imports must not depend on:

```text
fixtures;

mocks;

test factories.
```

---

# 336. Repository Architecture Anti-Pattern — Infrastructure in Domain

Bad:

```text
knowledge/
    terraform/

anime/
    docker-compose.yml
```

unless a very specific independently deployable ownership reason exists.

---

# 337. Repository Architecture Anti-Pattern — Runtime Uploads in App Source

Bad:

```text
apps/api/uploads/
```

as long-term production Media storage.

Media should use Storage capability.

---

# 338. Repository Architecture Anti-Pattern — Checked-In Secrets

Never acceptable.

---

# 339. Repository Architecture Anti-Pattern — Generated Build Output as Source

Avoid committing build output unless an explicitly accepted workflow requires it.

---

# 340. Repository Architecture Anti-Pattern — Empty Folder Architecture

Do not create hundreds of directories filled with:

```text
.gitkeep
```

merely to visualize future architecture.

Documentation already represents planned architecture.

---

# 341. Repository Architecture Anti-Pattern — One Configuration Package Owns Product Behavior

Configuration Foundation provides mechanics.

Platform and Universe configuration remains capability-owned.

---

# 342. Repository Architecture Anti-Pattern — Public Contract Detached From Owner

Bad:

```text
packages/contracts/knowledge.ts
```

owned by no Knowledge package while Knowledge implementation evolves elsewhere.

---

# 343. Repository Architecture Anti-Pattern — Framework-Locked Domain

Bad:

```text
Domain Models require HTTP framework types;

Universe Definitions require frontend framework components;

canonical Contracts expose ORM records.
```

---

# 344. Repository Architecture Anti-Pattern — Runtime Wiring Inside Domain

Concrete Application composition should not be hidden inside reusable Domain packages.

---

# 345. Repository Architecture Anti-Pattern — Global Container Access

Packages should not resolve arbitrary dependencies through a global Application container.

Dependencies should remain explicit.

---

# 346. Repository Architecture Anti-Pattern — Circular Package Workaround

Do not fix cycles using:

```text
barrel tricks;

lazy imports;

runtime injection tokens
```

before fixing ownership.

---

# 347. Repository Architecture Anti-Pattern — One Package Manifest Dependency on Everything

A package declaring every internal workspace package makes dependency architecture meaningless.

---

# 348. Repository Architecture Anti-Pattern — Documentation Drift

A package being moved or reclassified should trigger relevant architecture documentation updates.

---

# 349. Repository Change Decision Checklist

Before creating a new source directory/package:

```text
1. Which architecture area owns it?

2. Which capability owns the behavior?

3. Is it reusable outside one Application?

4. Is it already represented by an existing capability?

5. Does it deserve an independent package?

6. Who will consume it?

7. What may it depend on?

8. What public Contract will it expose?

9. Does it contain Provider-specific code?

10. Does it contain Universe-specific code?

11. Where will its tests live?

12. Where will migrations live?

13. Does creating this directory improve clarity or only symmetry?
```

---

# 350. Package Extraction Checklist

Before turning a capability into a separate workspace package:

```text
Does it have clear ownership?

Does another runtime/application consume it?

Would a package boundary prevent invalid imports?

Does it need distinct dependencies?

Does it have a meaningful public surface?

Will independent testing/build improve development?

Is the package substantial enough to justify ceremony?
```

---

# 351. Package Merge Checklist

Consider merging package boundaries when:

```text
one package only forwards another;

the packages always change together;

the separation provides no dependency protection;

the split creates cycles;

semantic ownership is actually one capability.
```

---

# 352. Root Directory Checklist

Before adding a new root directory:

```text
Why does it not fit under an existing root area?

Will the purpose remain understandable in five years?

Does it create overlapping ownership?

Does it create a new architectural classification?

Is an ADR required?
```

---

# 353. Public Export Checklist

Before exporting source publicly from a package:

```text
Who needs it?

Is it a stable Contract?

Could a narrower type suffice?

Does it expose implementation details?

Does it expose provider/framework/ORM types?

Will consumers depend on it long term?
```

---

# 354. Deep Import Review Checklist

If a developer wants a deep import, ask:

```text
Why is the public Contract insufficient?

Is a missing public Contract required?

Is the consumer crossing an invalid ownership boundary?

Should the implementation remain internal?
```

---

# 355. Universe Repository Checklist

Before adding a Universe:

```text
Create one semantic Universe ownership area.

Do not create duplicated infrastructure.

Declare Platform dependencies.

Declare Kernel definitions.

Add typed domain definitions.

Add only necessary Extensions.

Keep frontend-specific rendering in Application ownership when appropriate.

Register through Composition Root/Universe Registry.

Add tests proving shared Platform compatibility.
```

---

# 356. Provider Repository Checklist

Before adding Provider integration:

```text
Identify Contract owner.

Place Adapter with owner.

Keep SDK import local.

Keep credentials outside source.

Normalize provider types.

Map provider IDs.

Add failure tests.

Do not expose Adapter directly to unrelated consumers.
```

---

# 357. Migration Repository Checklist

Before adding migration:

```text
Identify canonical data owner.

Keep semantic intent owned there.

Use approved migration mechanism.

Avoid unrelated cross-owner changes.

Make migration deterministic.

Test meaningful data transformations.
```

---

# 358. Testing Repository Checklist

Before adding root-level test infrastructure:

```text
Does the test span multiple owners?

Could it live closer to one capability?

Does it need system-level environment?

Does it duplicate lower-level tests?

Who maintains the scenario?
```

---

# 359. Repository Invariants

The following are formal repository invariants:

```text
1. AI World begins as one canonical monorepo.

2. Deployable runtime entry points belong under apps/.

3. Reusable capability-owned source belongs under packages/.

4. packages/ is grouped into foundations, kernel, platforms, and universes.

5. Ownership directories do not automatically require independent package manifests.

6. Packages are introduced only when they improve real boundaries or reuse.

7. Applications depend on reusable packages; reusable packages never depend on Applications.

8. Universes depend on Platform/Kernel public Contracts, not Foundations or Provider SDKs.

9. Platforms never depend on named Universe implementations.

10. Kernel never depends on Platforms or Universes.

11. Foundations remain Domain-neutral.

12. Provider Adapters stay with the Capability owning the Provider Contract.

13. Public business Contracts stay with their canonical owner.

14. No global business contracts/types/models/repositories/services dumping ground is created.

15. Cross-package deep imports are forbidden by default.

16. Public exports are intentional and smaller than implementation.

17. ORM/provider/framework types do not become public Domain Contracts automatically.

18. Composition Roots live at executable Application/runtime boundaries.

19. Composition Roots may wire concrete implementations but contain no business rules.

20. Canonical migrations remain attributable to their data owner.

21. Seed definitions remain attributable to their Domain/environment owner.

22. Capability-specific tests remain close to their owner.

23. Root tests are reserved for genuinely system-level concerns.

24. Root infrastructure defines deployment infrastructure and remains separate from Foundation source code.

25. Scripts and tooling must not become hidden business architecture.

26. Runtime-generated data does not live in committed source directories.

27. Secrets are never committed.

28. Empty future source trees are not materialized merely for documentation symmetry.

29. New root directories require strong justification.

30. Repository structure must make Dependency Rules easier to enforce.

31. The repository may evolve toward more packages/runtimes without changing canonical ownership.

32. Legacy source remains reference-only and is not a runtime dependency.
```

---

# 360. Repository Architecture Decision Summary

AI World repository architecture is:

```text
MONOREPO

    apps/
        executable delivery surfaces

    packages/
        foundations/
        kernel/
        platforms/
        universes/

    docs/
        canonical documentation

    infrastructure/
        deployment/environment definitions

    scripts/
        thin automation

    tooling/
        engineering tooling

    tests/
        only system-wide testing when needed
```

---

# 361. Initial Application Strategy

The preferred initial physical Application count is deliberately small:

```text
apps/api
apps/web
```

Add:

```text
apps/worker
```

only when asynchronous execution requires an independent runtime.

Add:

```text
apps/admin
```

only when independent Application concerns justify it.

---

# 362. Initial Package Strategy

Do not create every planned package immediately.

Materialize packages according to roadmap needs.

Likely implementation growth:

```text
Engineering Foundations
        ↓
Identity & Access + User
        ↓
Kernel baseline
        ↓
Knowledge
        ↓
Anime + History
        ↓
Media
        ↓
Discovery
        ↓
AI / Creator
        ↓
Composition
        ↓
Engagement
        ↓
Operations maturity
```

Exact delivery sequence is finalized by P0-D18.

---

# 363. Public Contract Strategy

Default:

```text
Contract stays with owner.
```

No generic root:

```text
contracts/

types/

models/

services/

repositories/
```

architecture is accepted.

---

# 364. Provider Strategy

Default:

```text
Provider Adapter stays with Contract owner.
```

No provider-led repository architecture is accepted.

---

# 365. Universe Strategy

Default:

```text
semantic Universe definition
    packages/universes/<universe>

Application-specific presentation
    owning Application

shared Platforms
    packages/platforms/*
```

---

# 366. Migration Strategy

Default:

```text
semantic migration ownership
    data-owning Capability

execution mechanics
    Migration Foundation

physical migration layout
    selected after persistence technology.
```

---

# 367. Testing Strategy

Default:

```text
Capability tests
    with Capability

Application E2E
    with Application

Cross-system tests
    root tests/ only when justified.
```

---

# 368. What This Document Decides

This document decides:

```text
monorepo as the initial repository model;

canonical root responsibility areas;

apps/ for executable runtimes;

packages/ for reusable capability-owned source;

foundations/kernel/platforms/universes as package ownership groups;

minimal initial Application strategy;

no automatic package-per-capability requirement;

package promotion criteria;

public/internal source boundaries;

owner-local public Contracts;

provider Adapter placement;

Universe source placement;

Composition Root placement;

testing placement direction;

migration ownership placement principles;

infrastructure vs Foundation distinction;

no global shared/common/core dumping grounds;

incremental source-tree materialization.
```

---

# 369. What This Document Does Not Decide

This document intentionally does not finalize:

```text
package manager;

workspace technology;

task runner;

backend framework;

frontend framework;

build system;

ORM;

database;

testing framework;

lint tool;

architecture test library;

exact package manifest syntax;

exact TypeScript aliases;

exact module export syntax;

exact migration directory required by selected ORM;

exact container/cloud structure.
```

These decisions belong to:

```text
P0-D17 — Technology Strategy.
```

---

# 370. Relationship to Technology Strategy

The next document:

```text
P0-D17 — Technology Strategy
```

will map this architecture to concrete implementation technology.

It will evaluate and select categories such as:

```text
language/runtime;

monorepo tooling;

package manager;

backend framework;

frontend framework;

database;

data access technology;

validation;

authentication implementation direction;

testing;

storage;

email;

queue;

cache;

search;

AI Provider integration;

observability;

containers;

deployment;

CI/CD.
```

The technology must fit this Repository Architecture.

---

# 371. Relationship to Master Roadmap

After technology is selected:

```text
P0-D18 — Master Roadmap
```

will decide exactly when the repository areas are materialized.

Repository Architecture answers:

```text
WHERE WILL CODE LIVE?
```

Master Roadmap answers:

```text
WHEN WILL WE CREATE AND BUILD IT?
```

---

# 372. Relationship to Dependency Rules

Dependency Rules define:

```text
what dependencies are legal.
```

Repository Architecture provides the physical structure needed to make those rules:

```text
visible;

reviewable;

automatable.
```

---

# 373. Relationship to Ownership Model

Ownership Model defines:

```text
who owns each concept.
```

Repository Architecture places the implementation of that owner in a clearly discoverable source area.

---

# 374. Relationship to Extension Model

Extension Model defines:

```text
how behavior varies.
```

Repository Architecture ensures:

```text
Universe Extensions live with the Universe;

Extension Contracts live with the capability being extended;

Provider Adapters live with the Provider Contract owner;

Composition Roots perform registration.
```

---

# 375. Final Repository Architecture Statement

> **AI World will begin as one capability-oriented monorepo. Executable delivery surfaces will live under `apps/`; reusable source will live under `packages/`, grouped by Foundations, Platform Kernel, Platforms, and Universes; canonical Contracts will remain with their owners; Provider Adapters will remain localized to the capabilities they implement; and repository boundaries will make ownership and dependency direction visible without prematurely creating packages, services, or empty architectural scaffolding.**

The repository must grow from actual implementation needs while preserving the architecture already established.

---

# 376. Acceptance

```text
DOCUMENT
P0-D16 — AI World Repository Architecture

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

NEXT DOCUMENT
P0-D17 — Technology Strategy

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```