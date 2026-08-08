# AI World Ownership Model

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Ownership Model |
| Document ID | P0-D13 |
| Area | Architecture |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Canonical Capability and Data Ownership Model |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md`, `docs/01-vision/terminology.md`, `docs/02-architecture/system-context.md`, `docs/02-architecture/platform-architecture.md`, `docs/02-architecture/platform-layers.md`, `docs/02-architecture/capability-map.md` |

---

# 1. Purpose

This document defines the canonical **Ownership Model** for AI World.

It establishes:

```text
who owns each major concept;

who defines its semantics;

who may mutate its canonical state;

who owns its lifecycle;

who exposes its public Contracts;

how other capabilities may reference it;

how shared physical infrastructure differs from logical ownership;

how derived copies must be treated;

how cross-capability integration must occur.
```

The primary objective is:

> **Every important AI World concept must have one clear canonical owner.**

Shared usage does not mean shared ownership.

---

# 2. Why Ownership Matters

Without explicit ownership, large platforms tend to evolve toward:

```text
multiple modules changing the same tables;

business rules duplicated across services;

unclear mutation authority;

data models designed around screens instead of Domains;

circular dependencies;

search indexes becoming sources of truth;

provider data becoming canonical data;

Universe-specific code modifying shared infrastructure;

difficult migrations;

unsafe refactoring.
```

The Ownership Model exists to prevent these outcomes.

---

# 3. Core Ownership Principle

> **A concept may have many consumers, many references, many projections, and many presentation forms, but it should have one canonical semantic owner.**

Example:

```text
Asset
```

may be used by:

```text
Knowledge

Anime

History

CMS

AI

User Profile
```

but its canonical owner remains:

```text
Media Platform.
```

---

# 4. Ownership Is Semantic

Ownership is determined by:

```text
meaning

business invariants

lifecycle

mutation authority

Contract responsibility
```

not by:

```text
which table contains the field;

which screen displays it;

which application created it;

which provider stores it;

which service reads it most frequently.
```

---

# 5. Ownership Dimensions

AI World distinguishes several forms of ownership.

```text
Semantic Ownership

Canonical Data Ownership

Mutation Ownership

Lifecycle Ownership

Contract Ownership

Operational Ownership

Presentation Ownership
```

These dimensions often align but are not always identical.

---

# 6. Semantic Owner

The **Semantic Owner** defines:

```text
what the concept means;

what rules apply;

what invariants must hold;

how it relates to other concepts.
```

Example:

```text
Media Platform
```

is the Semantic Owner of:

```text
Asset.
```

---

# 7. Canonical Data Owner

The **Canonical Data Owner** controls the authoritative state representing the concept.

It determines:

```text
what data is canonical;

how it is stored logically;

how it changes;

what consistency rules apply.
```

---

# 8. Mutation Owner

The **Mutation Owner** controls operations that create, modify, archive, restore, or delete canonical state.

Other capabilities must not mutate that state directly.

---

# 9. Lifecycle Owner

The **Lifecycle Owner** defines meaningful states and transitions.

Example:

```text
Asset lifecycle
```

belongs to:

```text
Media Platform.
```

Storage does not determine whether an Asset is:

```text
ACTIVE

ARCHIVED

DELETED.
```

---

# 10. Contract Owner

The **Contract Owner** defines the supported interface through which other capabilities interact with the concept.

This includes appropriate:

```text
commands

queries

services

Events

reference Contracts.
```

---

# 11. Operational Owner

Operational Ownership concerns:

```text
monitoring

deployment

provider availability

maintenance

runbooks
```

for a capability or runtime.

Operational Ownership does not transfer Domain Ownership.

---

# 12. Presentation Owner

Presentation Ownership controls how a Resource is displayed or composed in a particular experience.

Example:

```text
Composition / CMS
```

may own the Page that presents an Entity.

It does not own the Entity itself.

---

# 13. Canonical Owner

When this document says:

```text
OWNER
```

without qualification, it normally means the combination of:

```text
Semantic Owner
+
Canonical Data Owner
+
Mutation Owner
+
Lifecycle Owner
```

unless otherwise stated.

---

# 14. Single Canonical Owner Rule

For important state:

```text
ONE canonical owner
```

is strongly preferred.

Avoid:

```text
Knowledge and CMS both own Entity publication.

User and Identity both own profile.

Media and Storage both own Asset.

Anime and Knowledge both own Character.
```

Instead, assign clear responsibility.

---

# 15. Shared Usage Is Allowed

Many capabilities may consume the same canonical concept.

Example:

```text
Asset
```

may be consumed by:

```text
Knowledge

Composition

AI / Creator

User

Engagement

Universes.
```

Consumption does not grant mutation authority.

---

# 16. Shared Physical Database Does Not Mean Shared Ownership

AI World may initially use one physical database.

Conceptually:

```text
Database
│
├── Identity & Access-owned data
├── User-owned data
├── Knowledge-owned data
├── Media-owned data
└── Engagement-owned data
```

The database is shared infrastructure.

The data is not jointly owned.

---

# 17. Physical Schema Does Not Define Ownership

A table location such as:

```text
public.users
```

does not define architectural ownership by itself.

Architecture determines ownership.

Persistence implements it.

---

# 18. Foreign Keys Do Not Transfer Ownership

Example:

```text
Knowledge Entity
    references
Media Asset
```

A foreign key to:

```text
asset_id
```

does not make Knowledge an owner of Asset.

---

# 19. Read Access Does Not Transfer Ownership

A capability may read another capability's Resource through an approved Contract.

That does not give the reader authority to:

```text
change

delete

restore

publish

archive
```

the Resource.

---

# 20. Event Consumption Does Not Transfer Ownership

If Discovery receives:

```text
EntityPublished
```

Discovery does not become an owner of Entity.

It owns only the derived Discovery state created from that Event.

---

# 21. Projection Ownership

A capability may own a derived projection while another capability owns the source.

Example:

```text
Knowledge
    owns
Entity

Discovery
    owns
Search Projection of Entity
```

The projection remains derived.

---

# 22. Snapshot Ownership

A capability may retain a historical snapshot of data from another owner when necessary.

The snapshot must be clearly identified as:

```text
snapshot

derived representation

historical copy
```

and must not silently become a second canonical Resource.

---

# 23. Reference Ownership

A capability may own the fact that it references another Resource.

Example:

```text
User Platform
    owns
User.avatarAssetId reference

Media Platform
    owns
the referenced Asset.
```

User may change which Asset is referenced.

User may not change the Asset's canonical Media state directly.

---

# 24. Canonical Ownership Layers

Canonical concepts may be owned by:

```text
Universe Layer

Platform

Platform Kernel

Foundation
```

Applications generally do not own canonical business concepts.

External Providers never own canonical AI World Domain semantics.

---

# 25. Applications Ownership Rule

Applications may own:

```text
application configuration;

routes;

UI state;

presentation state;

transport-specific Contracts;

application bootstrap.
```

They should not own major canonical Domain Resources.

---

# 26. Universe Ownership Rule

A Universe owns:

```text
its domain definition;

its domain-specific semantics;

its configuration;

its first-party domain extensions;

its presentation configuration;

its domain-specific content rules.
```

Shared Platform Resources used by the Universe remain owned by their Platforms.

---

# 27. Platform Ownership Rule

Platforms own major reusable business concepts.

Examples:

```text
Identity & Access
    owns
Session

Knowledge
    owns
Entity

Media
    owns
Asset

AI / Creator
    owns
Generation

Engagement
    owns
Favorite.
```

---

# 28. Kernel Ownership Rule

Kernel capabilities own shared semantic primitives.

Examples:

```text
Relationships
    owns
Relationship semantics

Taxonomy
    owns
Taxonomy semantics

Audit
    owns
Audit Record semantics.
```

---

# 29. Foundation Ownership Rule

Foundations own technical infrastructure concepts.

Examples:

```text
Storage
    owns
Storage Object interaction contract

Queue
    owns
Queue transport capability

Configuration
    owns
Runtime Configuration loading mechanics.
```

Foundations must not own higher-level business concepts merely because they persist or transport them.

---

# 30. Provider Ownership Rule

External Providers own only their external implementation concepts.

Examples:

```text
storage provider
    owns provider object behavior;

AI provider
    owns model execution API;

email provider
    owns delivery infrastructure.
```

AI World owns the Platform semantics wrapped around them.

---

# 31. Identity & Access Ownership

Canonical owner:

```text
Identity & Access Platform
```

Primary owned concepts:

```text
Actor security identity

Identity

Credential

Authentication Method

Session

Verification state

Recovery state

Role

Permission

Authorization assignment

Machine Identity

Service Account security identity

External Identity mapping
```

---

# 32. Actor Ownership

The general architectural concept:

```text
Actor
```

is security-oriented and primarily owned by:

```text
Identity & Access.
```

Other Platforms may associate Domain state with an Actor ID.

They do not redefine Actor identity.

---

# 33. Human Actor and User Distinction

Identity & Access owns:

```text
the security identity of the human Actor.
```

User Platform owns:

```text
the product-facing User state.
```

Conceptually:

```text
Human Actor Identity
        │
        └──── maps to ──── User
```

---

# 34. Credential Ownership

Owner:

```text
Identity & Access
```

Includes:

```text
password credential

future passkey credential

machine credential

credential lifecycle.
```

No other Platform may directly change Credential state.

---

# 35. Authentication Method Ownership

Owner:

```text
Identity & Access
```

Examples:

```text
password authentication

external identity authentication

future passkeys

future magic links.
```

---

# 36. Session Ownership

Owner:

```text
Identity & Access
```

Identity & Access determines:

```text
Session creation;

Session validation;

Session expiration;

Session revocation;

logout behavior.
```

---

# 37. Session Consumer Examples

Consumers may include:

```text
Web Application

Admin Application

API Application

User-facing Security Center.
```

They consume Session Contracts.

They do not own Session persistence.

---

# 38. Verification Ownership

Owner:

```text
Identity & Access
```

Examples:

```text
email verification state

credential-reset verification

security-action verification.
```

Email Foundation only delivers messages.

---

# 39. Recovery Ownership

Owner:

```text
Identity & Access
```

Email Foundation may send recovery communication.

Recovery tokens/state remain security-owned.

---

# 40. Role Ownership

Owner:

```text
Identity & Access
```

Roles may be:

```text
Platform-scoped

Universe-scoped

Capability-scoped
```

but canonical Role semantics remain centralized.

---

# 41. Permission Ownership

Owner:

```text
Identity & Access
```

Identity & Access owns:

```text
Permission representation;

assignment;

evaluation infrastructure.
```

Business Platforms define the meaning of the Actions to which Permissions apply.

---

# 42. Action Ownership

The concept:

```text
Action
```

may participate in Authorization.

The business Platform owns the semantic meaning of its actions.

Example:

```text
Knowledge Platform
    defines semantic action:
Publish Entity

Identity & Access
    evaluates whether Actor may perform it.
```

---

# 43. Authorization Ownership

Infrastructure owner:

```text
Identity & Access
```

Business semantic contributors:

```text
owning Platforms.
```

Authorization answers:

```text
may Actor perform Action?
```

Domain validation separately answers:

```text
is the operation valid?
```

---

# 44. External Identity Mapping Ownership

Owner:

```text
Identity & Access
```

Example:

```text
External Provider Subject
        ↓
AI World Identity
        ↓
Actor
```

External provider subject IDs do not replace AI World Actor identity.

---

# 45. Machine Identity Ownership

Owner:

```text
Identity & Access
```

Potential:

```text
Service Accounts

Workers

Automations

AI Agents.
```

---

# 46. User Platform Ownership

Canonical owner:

```text
User Platform
```

Primary concepts:

```text
User

User Profile

User Preferences

User Locale

User Timezone preference

Accessibility Preferences

Privacy Preferences

User product lifecycle.
```

---

# 47. User Ownership

Owner:

```text
User Platform
```

User represents product-facing human state.

Identity & Access may hold the linkage required for security.

---

# 48. User Profile Ownership

Owner:

```text
User Platform
```

Possible profile fields:

```text
display name

bio

avatar reference

public profile information.
```

---

# 49. Avatar Ownership

User Platform may own:

```text
which Asset is selected as avatar.
```

Media Platform owns:

```text
the Asset itself.
```

Conceptually:

```text
User.avatarAssetId
        ↓
Media Asset
```

---

# 50. User Preference Ownership

Owner:

```text
User Platform
```

Examples:

```text
language preference

timezone preference

appearance preference

default Universe preference.
```

---

# 51. Security Settings Ownership

Security settings such as:

```text
credentials

Sessions

MFA state

authentication methods
```

belong to:

```text
Identity & Access
```

not User Profile.

---

# 52. Engagement State Ownership

User-related concepts such as:

```text
Favorites

Collections

Progress

Activity History
```

belong primarily to:

```text
Engagement Platform
```

not User Platform.

---

# 53. Universe Definition Ownership

Canonical owner:

```text
Universe Layer / Universe Definition Capability
```

Each Universe owns its own domain-world definition.

Examples:

```text
Anime Universe Definition

History Universe Definition.
```

---

# 54. Universe Registry Ownership

If a shared Universe Registry is implemented later:

```text
Registry runtime
```

may own:

```text
registration and resolution mechanics.
```

Individual Universe definitions remain owned by their respective Universe packages/configuration.

---

# 55. Universe Identity Ownership

The canonical logical concept:

```text
Universe
```

belongs to the Universe architecture.

The Platform may maintain:

```text
Universe ID

Universe Key

status

registration information.
```

The exact runtime ownership will be refined when Universe implementation begins.

---

# 56. Universe Domain Definition Ownership

Examples:

```text
Anime Character definition
```

is owned by:

```text
Anime Universe.
```

```text
History Person definition
```

is owned by:

```text
History Universe.
```

The shared Knowledge Platform owns the underlying reusable Knowledge capability.

---

# 57. Universe Content vs Knowledge Ownership

Important distinction:

```text
Universe
    defines domain meaning and configuration.

Knowledge Platform
    owns canonical Knowledge Resources created using those definitions.
```

Example:

```text
Anime
    defines Character type.

Knowledge
    owns a canonical Character Resource instance.
```

---

# 58. Universe Taxonomy Definition Ownership

Universe may own:

```text
which taxonomy vocabularies it defines;

which terms it configures;

domain meaning of those vocabularies.
```

Taxonomy Kernel owns:

```text
taxonomy mechanics and canonical Taxonomy Resource semantics.
```

---

# 59. Universe Relationship Definition Ownership

Universe owns the domain meaning of specific Relationship Types it introduces.

Relationships Kernel owns:

```text
Relationship Type infrastructure;

Relationship Instance semantics;

validation mechanics.
```

---

# 60. Universe Metadata Definition Ownership

Universe may own domain-specific Metadata Definitions.

Metadata Kernel owns:

```text
Metadata Definition mechanics;

Metadata Value validation semantics.
```

---

# 61. Universe Workflow Configuration Ownership

Universe may own:

```text
its selected/configured workflow definitions
```

when those workflows express Universe-specific process.

Workflow Kernel owns reusable Workflow mechanics.

---

# 62. Universe Policy Configuration Ownership

Universe owns domain-specific policy configuration.

Policy Kernel owns policy representation/evaluation mechanics where shared.

---

# 63. Universe AI Configuration Ownership

Universe owns AI configuration that defines:

```text
domain behavior

retrieval scope

prompt behavior

tool availability

review requirements.
```

AI / Creator owns execution semantics and Provider integration.

---

# 64. Universe Presentation Ownership

Universe may own:

```text
theme choice

home composition configuration

navigation configuration

available experience styles.
```

Composition / CMS owns canonical Page/Block/Experience mechanics.

---

# 65. Knowledge Platform Ownership

Canonical owner:

```text
Knowledge Platform
```

Primary owned concepts:

```text
Knowledge Resource

Entity

typed canonical Knowledge Resource instances

Knowledge lifecycle

Knowledge source associations

Citation associations

Knowledge publication state

Knowledge validation

Knowledge import acceptance.
```

---

# 66. Entity Ownership

Owner:

```text
Knowledge Platform
```

An Entity is not owned by:

```text
Search

CMS

AI

Universe UI

external source.
```

---

# 67. Entity Type Ownership

Ownership may be split intentionally:

```text
Knowledge Platform
    owns
Entity Type capability/contract

Universe
    owns
domain-specific Entity Type definitions
```

Example:

```text
Knowledge
    understands typed Entity capabilities.

Anime
    defines Character.

History
    defines Historical Person.
```

---

# 68. Entity Instance Ownership

Canonical Entity instances are owned by:

```text
Knowledge Platform
```

even when their domain type originates from a Universe Definition.

---

# 69. Knowledge Lifecycle Ownership

Owner:

```text
Knowledge Platform
```

Possible lifecycle:

```text
DRAFT

REVIEW

PUBLISHED

ARCHIVED
```

Workflow may coordinate advanced process later.

Workflow does not take ownership of Entity state.

---

# 70. Knowledge Publication Ownership

Owner:

```text
Knowledge Platform
```

Composition may publish Pages.

AI may generate candidate content.

Only Knowledge owns whether canonical Knowledge itself becomes published.

---

# 71. Source Ownership

Canonical owner:

```text
Knowledge Platform
```

for AI World Source records used to support Knowledge.

External source systems retain ownership of their original source material.

AI World owns its canonical Source representation/reference.

---

# 72. Citation Ownership

Canonical owner:

```text
Knowledge Platform
```

when Citation supports Knowledge assertions/content.

A Citation may reference:

```text
Source

Resource

specific location/section.
```

---

# 73. Provenance Ownership

Provenance ownership follows the Resource being described.

Examples:

```text
Knowledge provenance
    Knowledge Platform

AI Generation provenance
    AI / Creator Platform

Asset provenance
    Media Platform.
```

Shared provenance primitives may later emerge if proven reusable.

---

# 74. Verification Ownership

Knowledge verification state is owned by:

```text
Knowledge Platform.
```

Workflow may coordinate review.

Reviewer actions may be audited.

---

# 75. Temporal Knowledge Ownership

Domain-specific temporal meaning belongs to:

```text
Knowledge Platform + relevant Universe definitions.
```

A generic temporal Kernel capability is not currently assumed.

---

# 76. Knowledge Import Ownership

Knowledge Platform owns:

```text
whether imported data becomes canonical Knowledge.
```

Ingestion tooling may assist.

External Sources never directly become canonical simply by being imported.

---

# 77. Knowledge Export Ownership

Knowledge controls authoritative export of Knowledge-owned canonical state.

Applications may trigger exports.

Storage may store generated files.

---

# 78. Media Platform Ownership

Canonical owner:

```text
Media Platform
```

Primary owned concepts:

```text
Asset

Asset metadata

Asset lifecycle

Media Variant

processing state

delivery policy integration

Media rights information

Media provenance.
```

---

# 79. Asset Ownership

Owner:

```text
Media Platform
```

Not:

```text
Storage Foundation

Knowledge

CMS

Universe.
```

---

# 80. Asset Binary vs Asset Domain Record

Storage Foundation owns:

```text
binary/object storage operation.
```

Media Platform owns:

```text
Asset meaning and lifecycle.
```

Conceptually:

```text
Asset
    ↓
Storage Reference
    ↓
Storage Object
```

---

# 81. Storage Object Ownership

Technical owner:

```text
Storage Foundation
```

External provider owns the physical provider object implementation.

Storage object existence does not define Asset existence.

---

# 82. Asset Metadata Ownership

Media-specific canonical metadata such as:

```text
MIME type

size

dimensions

duration

checksum

processing status
```

is owned by:

```text
Media Platform.
```

---

# 83. Media Variant Ownership

Owner:

```text
Media Platform
```

Examples:

```text
thumbnail

responsive image

video rendition.
```

Storage Foundation stores variant bytes.

---

# 84. Media Processing Ownership

Media Platform owns:

```text
what processing is required;

which Asset/Variant state results.
```

Workers execute it.

Queue transports Jobs.

Processors perform technical work.

---

# 85. Media Rights Ownership

If implemented:

```text
Media Platform
```

owns Asset-specific:

```text
license

usage restrictions

attribution

regional constraints.
```

Policy Kernel may assist evaluation.

---

# 86. Knowledge-to-Media Reference

Knowledge may own:

```text
the fact that an Entity references Asset X
```

depending on association semantics.

Media still owns Asset X.

---

# 87. Composition-to-Media Reference

Composition owns:

```text
where/how Asset X appears in a Page/Block.
```

Media owns Asset X.

---

# 88. User-to-Media Reference

User owns:

```text
which Asset is chosen as avatar.
```

Media owns the Asset.

---

# 89. Discovery Platform Ownership

Canonical owner:

```text
Discovery Platform
```

Primary owned concepts:

```text
Search Contract

Discovery query semantics

ranking configuration

Discovery projections

Search Index mappings

recommendation outputs/signals where applicable.
```

---

# 90. Discovery Does Not Own Source Resources

Discovery does not own:

```text
Entity

Asset

Page

User.
```

It indexes or ranks representations of those Resources.

---

# 91. Search Index Ownership

Discovery owns:

```text
Search Index representation

index mapping

index lifecycle

rebuild behavior.
```

The Search Index remains derived state.

---

# 92. Search Provider Ownership

External Search Provider owns:

```text
provider index execution behavior.
```

Discovery owns:

```text
AI World search semantics.
```

---

# 93. Search Document Ownership

A Search Document is a Discovery-owned projection.

It is not a canonical Knowledge Resource.

---

# 94. Ranking Ownership

Discovery owns generic ranking behavior.

Universe may provide:

```text
ranking configuration

boosting preferences

domain signals
```

through supported extension/configuration Contracts.

---

# 95. Recommendation Ownership

Current owner:

```text
Discovery Platform
```

unless future architecture promotes Recommendations into a dedicated Platform.

---

# 96. Recommendation Output

A Recommendation is derived.

It does not modify canonical Resources merely because the system recommends them.

---

# 97. AI / Creator Platform Ownership

Canonical owner:

```text
AI / Creator Platform
```

Primary owned concepts:

```text
Generation

Generation Request

Generation Result

AI Provider Contract

Model Catalog

Model Capability

Prompt Template

AI Tool registration

AI routing configuration

AI execution state

AI provenance

AI evaluation.
```

---

# 98. Generation Ownership

Owner:

```text
AI / Creator Platform
```

A Generation may produce:

```text
text

image

metadata suggestions

structured output.
```

---

# 99. Generation Result Ownership

AI / Creator owns the original normalized Generation Result.

If accepted into another Platform:

```text
Knowledge

Media

CMS
```

that Platform owns the resulting canonical Resource.

---

# 100. Generated Knowledge Ownership

Example:

```text
AI generates Entity description.
```

Initially:

```text
AI / Creator
    owns Generation Result.
```

After accepted publication:

```text
Knowledge
    owns canonical Knowledge content.
```

The provenance may reference the Generation.

---

# 101. Generated Media Ownership

Initially:

```text
AI / Creator
    owns Generation execution.
```

When generated image becomes a managed Asset:

```text
Media Platform
    owns Asset.
```

---

# 102. AI Provider Contract Ownership

Owner:

```text
AI / Creator Platform
```

Concrete Adapters implement the Contract.

No Universe should own separate AI provider infrastructure.

---

# 103. Model Catalog Ownership

Owner:

```text
AI / Creator Platform
```

External Provider model identifiers may be mapped internally.

---

# 104. Prompt Template Ownership

Shared AI Prompt Templates are owned by:

```text
AI / Creator Platform
```

Domain-specific prompt configuration may originate from:

```text
Universe

Knowledge

CMS
```

through AI-owned contracts.

---

# 105. AI Tool Ownership

The AI / Creator Platform owns:

```text
tool registration and invocation framework
```

where implemented.

The actual business operation remains owned by the Capability exposed as a Tool.

Example:

```text
SearchKnowledge tool
    AI owns tool exposure;
    Knowledge/Discovery owns underlying operation.
```

---

# 106. AI Context Ownership

AI / Creator owns:

```text
construction/execution context model.
```

Source data inside the context remains owned by its originating Capability.

AI Context is not a transfer of ownership.

---

# 107. AI Evaluation Ownership

AI / Creator owns shared evaluation capability.

Domain-specific quality criteria may be supplied by relevant Platforms or Universes.

---

# 108. AI Safety Ownership

AI / Creator owns AI-specific execution safety.

Platform Security architecture owns broader cross-cutting security requirements.

Business Platforms still validate AI-derived output before canonical acceptance.

---

# 109. Composition / CMS Ownership

Canonical owner:

```text
Composition / CMS Platform
```

Primary concepts:

```text
Page

Block

Layout

Experience

Composition

Preview state

presentation publication state

SEO configuration

creator composition state.
```

---

# 110. Page Ownership

Owner:

```text
Composition / CMS
```

A Page may reference:

```text
Knowledge Entity

Media Asset

Collection

Experience.
```

References do not transfer ownership.

---

# 111. Block Ownership

Owner:

```text
Composition / CMS
```

The Block defines:

```text
presentation configuration

references

layout-specific behavior.
```

---

# 112. Layout Ownership

Owner:

```text
Composition / CMS
```

Layout does not own canonical Content placed into the layout.

---

# 113. Experience Ownership

Current owner:

```text
Composition / CMS Platform
```

for structured composed Experiences.

If a future Experience concept grows beyond composition semantics, ownership may require architectural review.

---

# 114. CMS Editing Ownership

CMS owns:

```text
editing workflow for CMS-owned composition Resources.
```

When editing Knowledge through CMS UI:

```text
CMS is the interface;
Knowledge remains the canonical owner.
```

---

# 115. CMS and Knowledge Mutation

Bad:

```text
CMS repository
    directly updates
Knowledge tables.
```

Preferred:

```text
CMS Application
    invokes
Knowledge mutation Contract.
```

---

# 116. CMS and Media Mutation

Likewise:

```text
CMS
    requests Media operation
```

rather than directly changing Media persistence.

---

# 117. Preview Ownership

Composition owns preview state for composition Resources.

Knowledge may separately own draft Knowledge state.

A preview does not transfer Resource ownership.

---

# 118. SEO Ownership

Page/Experience-specific SEO configuration belongs to:

```text
Composition / CMS.
```

Entity semantic data remains Knowledge-owned.

---

# 119. Engagement Platform Ownership

Canonical owner:

```text
Engagement Platform
```

Primary concepts:

```text
Favorite

User Collection

Activity History

Progress

Personalization Signal

Notification

Notification Preference

Achievement

community interaction state where implemented.
```

---

# 120. Favorite Ownership

Owner:

```text
Engagement Platform
```

A Favorite references:

```text
User ID

Resource ID

possibly Universe Context.
```

It does not copy ownership of the favorited Resource.

---

# 121. User Collection Ownership

Owner:

```text
Engagement Platform
```

A Collection may reference:

```text
Knowledge Resources

Assets

Experiences.
```

Collection membership belongs to Engagement.

Referenced Resources remain owned elsewhere.

---

# 122. Activity History Ownership

Owner:

```text
Engagement Platform
```

Activity History is product behavior.

It is not equivalent to:

```text
Audit Record

Security History

Operational Log.
```

---

# 123. Progress Ownership

Owner:

```text
Engagement Platform
```

The underlying Experience/Journey remains owned by its relevant Platform.

Engagement owns:

```text
User's progress against that Resource.
```

---

# 124. Personalization Signal Ownership

Current owner:

```text
Engagement Platform
```

Derived analytical copies may exist.

Privacy choices may be User-owned.

---

# 125. Notification Ownership

Current direction:

```text
Engagement Platform
```

owns user-facing Notification state and semantics.

Email Foundation owns:

```text
email delivery mechanics.
```

---

# 126. Notification Preference Ownership

Owner:

```text
Engagement Platform
```

unless a future User Platform architecture determines some broad communication preferences belong there.

For current architecture, Notification-specific preferences remain Engagement-owned.

---

# 127. Achievement Ownership

If implemented:

```text
Engagement Platform
```

owns:

```text
Achievement definitions

User achievement state
```

unless Universe-specific definitions are supplied through controlled configuration.

---

# 128. Operations Platform Ownership

Canonical owner:

```text
Operations Platform
```

for AI World-specific operational product concepts such as:

```text
operational dashboards

provider status projections

usage views

cost views

administrative operational actions.
```

---

# 129. Operations Does Not Own Source Telemetry

Observability Foundation owns technical telemetry mechanics.

Operations may consume that telemetry.

---

# 130. Operations Does Not Own Business Resources

Operations may trigger:

```text
reindex

retry

reprocess
```

through owning Platform Contracts.

It must not directly mutate another Platform's data as an operational shortcut.

---

# 131. Operations Reprocessing Example

Bad:

```text
Operations
    directly changes
Asset processing status.
```

Preferred:

```text
Operations
    invokes
Media.reprocessAsset(assetId).
```

---

# 132. Platform Kernel Ownership

Kernel capabilities own reusable semantic primitives.

Current owners:

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

Versioning.
```

---

# 133. Identifiers Ownership

Canonical owner:

```text
Identifiers Kernel
```

Owns shared identifier semantics such as:

```text
canonical identifier strategy

identifier generation contract

identifier representation rules.
```

Individual Resource IDs remain associated with their owning Resources.

---

# 134. Resource Identifier Ownership

Example:

```text
Entity ID
```

semantics use:

```text
Identifiers Kernel
```

but:

```text
Knowledge Platform
```

owns the Entity that ID identifies.

---

# 135. External Identifier Mapping Ownership

General mapping mechanics may belong to:

```text
Identifiers Kernel.
```

The meaning of a particular external ID belongs to the owning Resource capability.

Example:

```text
Media Asset
    external provider asset ID
```

remains Media-owned mapping data.

---

# 136. Namespace Ownership

Owner:

```text
Namespace Kernel
```

Namespace owns:

```text
naming mechanics

validation

collision prevention.
```

Consumers own the concepts whose Keys are namespaced.

---

# 137. Permission Namespace Example

Identity & Access owns:

```text
Permission.
```

Namespace Kernel may define:

```text
how permission Keys are safely namespaced.
```

---

# 138. Taxonomy Ownership

Canonical engine owner:

```text
Taxonomy Kernel
```

Primary concepts:

```text
Taxonomy

Taxonomy Term

classification mechanics.
```

---

# 139. Taxonomy Definition Semantics

Domain-specific vocabulary meaning may originate from:

```text
Universe

Platform.
```

Taxonomy Kernel owns the canonical representation/mechanics once registered.

---

# 140. Taxonomy Assignment Ownership

Taxonomy Kernel may own the classification association itself.

The classified Resource remains owned by its own Capability.

Example:

```text
Taxonomy Assignment:
Entity X → Ancient History
```

does not transfer Entity ownership.

---

# 141. Metadata Ownership

Canonical engine owner:

```text
Metadata Kernel
```

Primary concepts:

```text
Metadata Definition

Metadata Value mechanics

validation

scope.
```

---

# 142. Metadata Definition Domain Ownership

A Platform or Universe may define what a Metadata property means.

Metadata Kernel owns:

```text
registration

storage semantics

validation mechanics.
```

The exact data ownership boundary will be refined when Metadata is implemented.

---

# 143. Metadata Value Ownership

Default direction:

```text
Metadata Kernel
```

owns canonical Metadata Value records when using shared Metadata infrastructure.

The target Resource owner retains ownership of the Resource.

---

# 144. Relationships Ownership

Canonical owner:

```text
Relationships Kernel
```

Primary concepts:

```text
Relationship Type

Relationship Instance

relationship validation

relationship traversal semantics.
```

---

# 145. Relationship Type Domain Meaning

A Universe or Platform may introduce:

```text
APPEARS_IN

PARTICIPATED_IN

LOCATED_AT.
```

That defining consumer owns the domain meaning.

Relationships Kernel owns shared canonical mechanics.

---

# 146. Relationship Instance Ownership

Default:

```text
Relationships Kernel
```

owns the canonical Relationship Instance.

Source and target Resources remain owned by their own capabilities.

---

# 147. Relationship Mutation

Consumers request:

```text
create relationship

remove relationship
```

through Relationships Contracts.

They should not modify Relationship persistence directly.

---

# 148. Events Ownership

Canonical engine owner:

```text
Events Kernel
```

Events Kernel owns:

```text
event publication mechanics

event envelope conventions

subscription mechanics.
```

---

# 149. Event Semantic Ownership

The producing Capability owns the semantic meaning of a specific Event.

Example:

```text
EntityPublished
```

is semantically owned by:

```text
Knowledge Platform.
```

Events Kernel owns the shared event mechanism.

---

# 150. Event Consumer Ownership

Consumers own only:

```text
their reaction

their derived state.
```

They do not own the Event producer's canonical state.

---

# 151. Audit Ownership

Canonical owner:

```text
Audit Kernel
```

Primary concept:

```text
Audit Record.
```

---

# 152. Audit Record Ownership

Audit Kernel owns durable Audit Records.

Business Platforms provide:

```text
Actor

Action

Resource

scope

business context.
```

---

# 153. Audit vs Security Events

Identity & Access may own security-event semantics.

If such events are stored as Audit Records:

```text
Audit owns record mechanism;

Identity & Access owns event meaning.
```

---

# 154. Audit vs Activity History

Audit:

```text
accountability.
```

Engagement Activity History:

```text
product experience.
```

They are independently owned concepts.

---

# 155. Workflow Ownership

Canonical engine owner:

```text
Workflow Kernel
```

Primary concepts:

```text
Workflow Definition

Workflow Instance

Transition

Approval mechanics.
```

---

# 156. Business Workflow Ownership

A Platform or Universe owns the meaning of a configured workflow.

Example:

```text
History review workflow
```

domain semantics:

```text
History Universe / Knowledge.
```

Workflow execution mechanics:

```text
Workflow Kernel.
```

---

# 157. Workflow Does Not Own Target Resource

Example:

```text
Entity publication Workflow
```

does not make Workflow owner of Entity.

Knowledge remains Entity owner.

---

# 158. Workflow Transition Coordination

Workflow may coordinate transition approval.

The owning Platform remains responsible for applying valid canonical mutation.

---

# 159. Policy Ownership

Canonical engine owner:

```text
Policy Kernel
```

for shared policy mechanics.

---

# 160. Business Policy Ownership

The consumer defining the rule owns the policy meaning.

Examples:

```text
History source requirement
    History/Knowledge

AI cost policy
    AI / Creator

Media regional policy
    Media.
```

---

# 161. Authorization Policy Ownership

Identity & Access owns Authorization semantics.

Policy Kernel may assist generic evaluation.

Identity & Access remains the access-control authority.

---

# 162. Localization Ownership

Canonical engine owner:

```text
Localization Kernel
```

for:

```text
Locale semantics

Localized Value mechanics

locale resolution primitives.
```

---

# 163. Localized Content Ownership

Localization does not own the underlying Content.

Examples:

```text
localized Entity name
    Knowledge-owned content using Localization mechanics

localized Page title
    Composition-owned content using Localization mechanics.
```

---

# 164. Versioning Ownership

Canonical engine owner:

```text
Versioning Kernel
```

for shared revision/version mechanics.

---

# 165. Versioned Resource Ownership

Versioning does not take ownership of the target Resource.

Example:

```text
Entity Revision
```

may use Versioning mechanics.

Knowledge remains Entity owner.

---

# 166. Foundation Ownership

Foundations own technical behavior.

They do not own business Resources using that behavior.

---

# 167. Configuration Ownership

Canonical owner:

```text
Configuration Foundation
```

for:

```text
runtime configuration loading

validation

technical configuration access.
```

---

# 168. Product Configuration Ownership

Product configuration belongs to the Platform whose behavior it configures.

Example:

```text
AI generation limit
    AI / Creator or Operations

Universe search configuration
    Universe + Discovery.
```

Configuration Foundation should not become owner of all configuration-like business data.

---

# 169. Secret Ownership

Secret management infrastructure is technical.

The capability requiring the Secret owns the dependency.

Example:

```text
AI Provider credential
    AI / Creator integration

Email credential
    Email Foundation.
```

Secret storage mechanics may be external/infrastructure-owned.

---

# 170. Database Ownership

Database Foundation owns:

```text
database connection mechanics

transaction infrastructure

database health

technical persistence capability.
```

It does not own Domain tables semantically.

---

# 171. Domain Table Ownership

Even when located in one database:

```text
Identity tables
    Identity & Access

User tables
    User

Knowledge tables
    Knowledge

Media tables
    Media

Engagement tables
    Engagement.
```

---

# 172. Repository Infrastructure Ownership

Repository Foundation owns only reusable technical repository/persistence support.

Domain Repositories belong to:

```text
their owning Platform/Kernel capability.
```

---

# 173. Knowledge Repository Ownership

Owner:

```text
Knowledge Platform.
```

Not Repository Foundation.

---

# 174. Asset Repository Ownership

Owner:

```text
Media Platform.
```

---

# 175. Migration Ownership

Migration Foundation owns:

```text
execution mechanics

migration history mechanism.
```

The Capability whose data/schema changes owns:

```text
the migration definition and semantic correctness.
```

---

# 176. Schema Migration Ownership

Example:

```text
Knowledge adds Entity field.
```

Knowledge owns the change intent.

Migration Foundation executes/version-controls the migration mechanism.

---

# 177. Application Migration Ownership

Example:

```text
Knowledge backfills publication status.
```

Knowledge owns transformation semantics.

Application Migration framework, if implemented, owns execution mechanics.

---

# 178. Seed Ownership

Seed Foundation owns:

```text
seed execution mechanics.
```

Individual seed definitions belong to their Domain/environment owner.

---

# 179. Role Seed Example

Initial Roles may be defined by:

```text
Identity & Access.
```

Seed Foundation simply executes the seed.

---

# 180. Universe Seed Example

Anime sample development data belongs to:

```text
Anime / Knowledge test-development domain.
```

Seed Foundation executes loading.

---

# 181. Storage Ownership

Storage Foundation owns:

```text
binary/object persistence operations

provider abstraction

access-reference generation mechanics.
```

It does not own Media Assets.

---

# 182. Cache Ownership

Cache Foundation owns:

```text
technical cache mechanics.
```

The consumer owns:

```text
cache key semantics

what is cached

invalidation conditions

canonical fallback.
```

---

# 183. Cache Entry Ownership

A Cache entry is derived technical state.

The Cache Foundation controls transport/storage mechanics.

The originating Capability owns the semantic meaning of cached content.

---

# 184. Queue Ownership

Queue Foundation owns:

```text
enqueue/dequeue mechanics

retry transport

queue infrastructure abstraction.
```

It does not own business Job semantics.

---

# 185. Job Ownership

A Job is owned by the Capability defining the work.

Examples:

```text
ProcessAsset
    Media Platform

GenerateContent
    AI / Creator Platform

ReindexEntity
    Discovery Platform.
```

Queue only delivers the Job.

---

# 186. Job Execution Record Ownership

Default:

```text
the owning Capability
```

owns meaningful Job business state.

Queue may expose infrastructure delivery metadata separately.

---

# 187. Scheduler Ownership

Scheduler Foundation owns:

```text
time-based triggering mechanics.
```

The scheduled operation remains owned by the relevant Capability.

---

# 188. Scheduled Publication Ownership

Example:

```text
Scheduler triggers publication at 10:00.

Composition or Knowledge
    owns publication semantics.
```

Scheduler does not own publication.

---

# 189. Email Ownership

Email Foundation owns:

```text
email delivery mechanics

Provider Adapter

transport-level message execution.
```

---

# 190. Email Business Intent Ownership

The requesting Capability owns the business reason for the message.

Examples:

```text
verification email
    Identity & Access

notification email
    Engagement

operational alert email
    Operations.
```

---

# 191. Email Template Ownership

Templates should follow their business meaning.

Examples:

```text
Password reset template
    Identity & Access content ownership

Engagement notification template
    Engagement content ownership

Email Foundation
    rendering/delivery mechanics where shared.
```

---

# 192. Observability Ownership

Observability Foundation owns:

```text
logging mechanics

metrics mechanics

tracing mechanics

correlation mechanics

health instrumentation support.
```

---

# 193. Business Metric Ownership

A Platform owns the meaning of its business metrics.

Example:

```text
GenerationCompletedCount
```

semantic owner:

```text
AI / Creator.
```

Observability transports/records it.

---

# 194. Operational Log Ownership

Observability owns technical logging capability.

The component emitting the Log owns the meaning of its operational event.

Logs are not canonical Domain state.

---

# 195. Health Ownership

Each Capability knows what healthy means for itself.

Observability Foundation supplies common health infrastructure.

Applications may expose aggregated health endpoints.

---

# 196. Feature Flag Ownership

Feature Flags Foundation owns:

```text
flag evaluation mechanics

rollout mechanics.
```

The feature-owning Capability owns:

```text
what the flag controls.
```

---

# 197. Feature Flag Lifecycle

Feature flags are temporary operational constructs.

Once rollout is complete:

```text
flag should normally be removed.
```

Feature Flag ownership must not become permanent business-rule ownership.

---

# 198. Canonical Ownership Matrix

| Concept | Canonical Owner | Mutation Authority | Typical Consumers |
|---|---|---|---|
| Actor Identity | Identity & Access | Identity & Access | All authenticated capabilities |
| Credential | Identity & Access | Identity & Access | Authentication |
| Session | Identity & Access | Identity & Access | Applications |
| Verification State | Identity & Access | Identity & Access | Applications, Email |
| Recovery State | Identity & Access | Identity & Access | Applications, Email |
| Role | Identity & Access | Identity & Access | Authorization/Admin |
| Permission | Identity & Access | Identity & Access | Platforms |
| User | User Platform | User Platform | Applications, Engagement |
| User Profile | User Platform | User Platform | Applications |
| User Preference | User Platform | User Platform | Applications/Platforms |
| Universe Definition | Universe Layer | Universe configuration owner | Platforms/Applications |
| Domain Definition | Universe | Universe | Knowledge, CMS, AI |
| Entity | Knowledge | Knowledge | Discovery, CMS, AI, Universes |
| Source | Knowledge | Knowledge | Knowledge, CMS, AI |
| Citation | Knowledge | Knowledge | Knowledge, CMS |
| Knowledge Verification | Knowledge | Knowledge | Workflow, CMS |
| Asset | Media | Media | Knowledge, CMS, User, AI |
| Media Variant | Media | Media | Applications |
| Search Projection | Discovery | Discovery | Applications |
| Ranking Configuration | Discovery | Discovery + allowed configuration | Applications/Universes |
| Generation | AI / Creator | AI / Creator | CMS, Knowledge, Media |
| Generation Result | AI / Creator | AI / Creator | Knowledge, Media, CMS |
| Prompt Template | AI / Creator | AI / Creator | Universes/Platforms |
| Page | Composition / CMS | Composition / CMS | Applications |
| Block | Composition / CMS | Composition / CMS | Applications |
| Experience | Composition / CMS | Composition / CMS | Applications/Engagement |
| Favorite | Engagement | Engagement | Users/Applications |
| Collection | Engagement | Engagement | Users/Applications |
| Progress | Engagement | Engagement | Applications |
| Notification | Engagement | Engagement | Applications/Email |
| Taxonomy | Taxonomy Kernel | Taxonomy | Platforms/Universes |
| Taxonomy Term | Taxonomy Kernel | Taxonomy | Platforms/Universes |
| Metadata Definition | Metadata Kernel + defining Domain semantics | Metadata Contract | Platforms/Universes |
| Metadata Value | Metadata Kernel | Metadata | Resource consumers |
| Relationship Type | Relationships Kernel + defining Domain semantics | Relationships | Platforms/Universes |
| Relationship Instance | Relationships Kernel | Relationships | Knowledge/Universes |
| Event Mechanism | Events Kernel | Events | All Platforms |
| Specific Domain Event | Producing Capability | Producing Capability | Event consumers |
| Audit Record | Audit Kernel | Audit | Security/Admin |
| Workflow Mechanism | Workflow Kernel | Workflow | Platforms |
| Business Workflow Meaning | Defining Platform/Universe | Defining owner through Workflow | Workflow participants |
| Policy Mechanism | Policy Kernel | Policy | Platforms/Universes |
| Business Policy Meaning | Defining Capability | Defining Capability | Policy |
| Localized Value Mechanics | Localization Kernel | Localization | Platforms |
| Resource Revision Mechanics | Versioning Kernel | Versioning | Platforms |
| Runtime Configuration | Configuration Foundation | Configuration | Applications/Foundations |
| Database Connectivity | Database Foundation | Database Foundation | Persistence implementations |
| Domain Repository | Owning Platform/Kernel | Owning Platform/Kernel | Internal capability |
| Migration Mechanism | Migration Foundation | Migration Foundation | All persistence owners |
| Migration Definition | Data-owning Capability | Data-owning Capability | Migration runner |
| Seed Mechanism | Seed Foundation | Seed Foundation | Environments/Capabilities |
| Seed Definition | Relevant Capability | Relevant Capability | Seed runner |
| Storage Object Mechanism | Storage Foundation | Storage Foundation | Media |
| Cache Mechanism | Cache Foundation | Cache Foundation | Platforms |
| Business Job | Defining Capability | Defining Capability | Worker |
| Queue Delivery | Queue Foundation | Queue Foundation | Jobs |
| Scheduled Business Operation | Defining Capability | Defining Capability | Scheduler |
| Scheduling Mechanism | Scheduler Foundation | Scheduler Foundation | Platforms |
| Email Delivery | Email Foundation | Email Foundation | Platforms |
| Email Business Intent | Requesting Capability | Requesting Capability | Email |
| Observability Mechanism | Observability Foundation | Observability | Entire system |
| Feature Flag Mechanism | Feature Flags Foundation | Feature Flags | Applications/Platforms |

---

# 199. Mutation Authority Principle

A capability must mutate canonical state through the canonical owner's supported operation.

Preferred:

```text
Consumer
    ↓
Owner Public Contract
    ↓
Owner Mutation
```

Not:

```text
Consumer
    ↓
Owner's database table.
```

---

# 200. Cross-Capability Mutation Example

Bad:

```text
EngagementService
    updates
knowledge_entity.view_count
```

Potential better designs:

```text
Engagement emits activity;
Knowledge maintains its own counter if canonical;

or

Analytics/Discovery maintains derived count.
```

Ownership must be deliberate.

---

# 201. Direct Persistence Mutation Rule

Direct mutation of another capability's persistence is:

```text
FORBIDDEN BY DEFAULT.
```

This applies even in:

```text
same package

same runtime

same database

same transaction.
```

---

# 202. Administrative Mutation Rule

Administrators do not receive direct data ownership.

Admin UI actions must still invoke canonical owner Contracts.

---

# 203. Operations Mutation Rule

Operations tooling does not gain universal write authority.

Operational repair should call:

```text
explicit owner repair/reconciliation operations
```

where possible.

---

# 204. Migration Mutation Exception

Migrations may technically modify another Capability's physical data only when the migration itself is owned and defined by that Capability.

Migration execution infrastructure does not own the transformation.

---

# 205. Emergency Repair Exception

Production emergency repair may occasionally require direct data intervention.

Such repair should be:

```text
exceptional;

audited;

reviewed;

documented;

followed by corrective engineering
```

if recurring.

Emergency operations must not become the normal application architecture.

---

# 206. Read Ownership Principle

Reads are less restrictive than writes but must remain architecturally controlled.

Preferred options:

```text
Owner Query Contract

Public Read Model

Event-derived Projection

Application Composition
```

---

# 207. Read Contract Example

```text
Composition
    needs Entity title.

Composition
        ↓
Knowledge Reference Contract
        ↓
Entity summary.
```

Composition does not need Knowledge Repository access.

---

# 208. Reference Contract

A Capability may expose a narrow stable reference representation.

Example:

```text
EntityReference {
    id
    type
    displayName
}
```

Conceptual example only.

Such a Contract can reduce unnecessary coupling.

---

# 209. Cross-Capability Data Duplication

Duplication is permitted when intentional.

Examples:

```text
Search Projection

Cache entry

historical snapshot

analytics projection.
```

Each duplicate must answer:

```text
Is this canonical or derived?

How is it updated?

Can it become stale?

Can it be rebuilt?

Who owns it?
```

---

# 210. Canonical Copy Rule

Two independent mutable canonical copies of the same business concept should be avoided.

Bad:

```text
Knowledge.Entity.name

and

CMS.EntityCopy.name
```

both independently editable.

---

# 211. Derived Copy Rule

If Composition needs Entity display information, it may:

```text
query Knowledge dynamically
```

or store a deliberate:

```text
snapshot/projection.
```

The latter must be marked derived.

---

# 212. Denormalization Ownership

Denormalized data is owned by the Capability maintaining the projection.

The source owner remains canonical.

---

# 213. Search Denormalization Example

```text
Knowledge Entity
        ↓
Discovery Search Document
```

Discovery owns the Search Document.

Knowledge owns the Entity.

---

# 214. Cache Denormalization Example

```text
Media Asset metadata
        ↓
Cache Entry
```

Cache storage is technical.

Media remains semantic owner.

---

# 215. Eventual Consistency Ownership

Derived consumers are responsible for convergence of their own projections.

Example:

```text
Discovery
```

must detect/recover from failed indexing.

Knowledge should not become responsible for Discovery's index internals.

---

# 216. Rebuild Responsibility

The derived-state owner must define:

```text
how to rebuild;

how to reconcile;

how to detect stale state.
```

where production requirements justify it.

---

# 217. Event Ownership Model

For every Event distinguish:

```text
Event Mechanism Owner

Event Semantic Owner

Event Consumer Owner.
```

Example:

```text
Events Kernel
    mechanism owner

Knowledge
    EntityPublished semantic owner

Discovery
    index-reaction owner.
```

---

# 218. Event Schema Ownership

The producing Capability owns the Event payload semantics.

Events Kernel may define the standard envelope.

---

# 219. Event Version Ownership

The producing Capability is responsible for compatible evolution of its published Event.

Global Event versioning standards may apply.

---

# 220. Command Ownership

A Command belongs to the Capability responsible for performing the requested operation.

Example:

```text
PublishEntity
    Knowledge

GenerateContent
    AI / Creator

ProcessAsset
    Media.
```

---

# 221. Query Ownership

A Query belongs to the Capability responsible for answering it.

Example:

```text
FindEntity
    Knowledge

SearchResources
    Discovery

ListUserSessions
    Identity & Access.
```

---

# 222. API Ownership

Transport-level API operation belongs to Application/API architecture.

The business operation invoked belongs to its owning Platform.

---

# 223. DTO Ownership

Boundary DTO ownership follows the Contract exposing it.

Example:

```text
Knowledge API Entity Response
```

belongs to:

```text
Knowledge public/API Contract,
```

not Database Foundation.

---

# 224. Database Model Ownership

Database/ORM models should map to the owning Capability.

Avoid global ownership of all models simply because one ORM schema file generates them.

---

# 225. ORM Generated Types

Generated persistence types do not become public Platform types automatically.

Ownership remains with the relevant persistence implementation.

---

# 226. Repository Ownership

Domain Repositories belong to the same Capability as their canonical data.

Examples:

```text
SessionRepository
    Identity & Access

UserRepository
    User

EntityRepository
    Knowledge

AssetRepository
    Media.
```

---

# 227. Transaction Ownership

A transaction is normally coordinated by the Capability owning the use case.

Example:

```text
Knowledge publishes Entity
```

Knowledge determines the transaction boundary for Knowledge-owned canonical changes.

---

# 228. Cross-Capability Transaction Warning

If one transaction must atomically modify:

```text
Knowledge + Media + Engagement
```

review ownership.

Possible issue:

```text
one business aggregate has been split incorrectly.
```

---

# 229. Cross-Capability Orchestration

When several independent owners participate:

```text
orchestration

Events

Workflow

Saga-like coordination
```

may be appropriate depending on consistency needs.

Do not create distributed coordination before it is required.

---

# 230. Universe Association Ownership

A Resource may belong to or participate in one or more Universes.

The Resource owner should store or expose the association when it is intrinsic to the Resource.

A separate Universe mapping capability may emerge if cross-Universe association becomes complex.

---

# 231. Universe Scope Is Not Ownership

An Entity being:

```text
History-scoped
```

does not make:

```text
History Universe
```

the persistence owner of Entity.

Knowledge remains canonical owner.

---

# 232. Universe-Specific Extension Data

If a Universe Extension requires private state:

```text
the Extension/Universe owns the domain-specific state
```

unless that state naturally belongs to a shared Platform.

The Extension must not add arbitrary fields into another Platform's persistence without an approved extension mechanism.

---

# 233. Extension Ownership Principle

An Extension owns:

```text
its specialized behavior;

its private configuration;

its private state where applicable.
```

It does not own the Platform it extends.

---

# 234. Adapter Ownership Principle

An Adapter belongs to the Capability whose external Contract it implements.

Example:

```text
Storage S3 Adapter
    Storage Foundation

AI Provider Adapter
    AI / Creator Platform

Email Provider Adapter
    Email Foundation.
```

---

# 235. Provider Identifier Ownership

Provider-specific IDs should be owned as mappings by the Capability integrating that Provider.

Examples:

```text
providerGenerationId
    AI / Creator

storageObjectKey
    Storage/Media integration

emailProviderMessageId
    Email delivery.
```

---

# 236. Provider State Is Not Canonical Automatically

Provider records may be useful for reconciliation.

They must not silently become the only source of AI World business state.

---

# 237. Provider Failure Ownership

The integrating Capability owns handling of provider failure semantics.

Example:

```text
AI / Creator
```

owns what happens when AI generation Provider fails.

The business consumer should receive AI World-defined failure semantics.

---

# 238. External Data Source Ownership

An external source owns its own external data.

Once accepted by AI World:

```text
the relevant Platform owns the canonical AI World representation.
```

---

# 239. External Knowledge Import

Example:

```text
External History Dataset
        ↓
Knowledge Import
        ↓
Canonical Knowledge
```

The external dataset remains provenance.

Knowledge becomes canonical owner of accepted AI World Resources.

---

# 240. External Media Import

Example:

```text
External image
        ↓
Media ingestion
        ↓
Asset
```

Media owns the canonical Asset representation.

Rights/provenance should remain recorded as needed.

---

# 241. External Identity Ownership

External Identity Provider owns:

```text
its external identity assertion.
```

Identity & Access owns:

```text
AI World Actor mapping

AI World Session

AI World Authorization.
```

---

# 242. External Analytics Ownership

External analytics provider may own analytics platform data technically.

AI World canonical User/Knowledge/Engagement state remains inside AI World.

---

# 243. External Observability Ownership

External monitoring vendor may store logs/metrics.

AI World still owns:

```text
instrumentation semantics

operational interpretation

source-system configuration.
```

---

# 244. Application Presentation Ownership

Applications may own:

```text
screen state

navigation

UI-specific composition

temporary form state.
```

These should not become canonical Domain storage unless explicitly promoted.

---

# 245. Form Draft Ownership

A UI form may hold temporary draft input.

Once persisted:

```text
the target Platform owns the canonical Resource.
```

---

# 246. Client Cache Ownership

Frontend cache owns no canonical Domain state.

It is a presentation optimization.

---

# 247. Route Ownership

Applications own routes.

Example:

```text
/history/people/ashoka
```

does not determine the Entity's canonical identity.

---

# 248. Slug Ownership

The owning Resource capability should define canonical Slug semantics if Slugs are part of Resource presentation identity.

Applications may use the Slug.

Routes do not own it.

---

# 249. URL Ownership

URLs belong to application/presentation/delivery semantics.

Canonical Resource IDs remain independent.

---

# 250. Content Ownership Principle

"Content" is too broad to define one owner.

Content ownership follows semantics.

Examples:

```text
Knowledge article/body
    Knowledge

Image
    Media

Page composition
    Composition / CMS

User comment
    future Engagement/community capability.
```

---

# 251. No Generic Content Owner

AI World should not create:

```text
ContentManager
```

that owns every Content-like object.

Ownership must remain precise.

---

# 252. Data Classification Ownership

Cross-cutting security standards may define data classification rules.

The owning Capability must classify its own data according to those standards.

---

# 253. Privacy Ownership

Privacy is cross-cutting.

User Platform may own user privacy preferences.

Each data-owning Capability remains responsible for respecting privacy requirements for its own data.

---

# 254. Retention Ownership

Retention policy is cross-cutting.

The canonical data owner is responsible for implementing retention for its own Resources according to Platform/security/legal standards.

---

# 255. Deletion Ownership

Only the canonical owner decides how its Resource is deleted.

Examples:

```text
Identity & Access
    credential deletion

User
    User product deletion

Media
    Asset deletion

Knowledge
    Entity deletion/archive.
```

---

# 256. Cascading Deletion Warning

Deleting one Resource may affect references from other owners.

Avoid uncontrolled database cascades that silently delete unrelated canonical Resources across ownership boundaries.

---

# 257. Reference Cleanup Ownership

When a Resource disappears:

```text
source owner
    publishes change/event or exposes lifecycle;

reference owners
    clean up or retain references according to their rules.
```

---

# 258. Example — Asset Deletion

```text
Media
    archives/deletes Asset

Media publishes Asset lifecycle event

Knowledge / CMS / User
    react according to their own reference policies.
```

Media should not blindly delete Knowledge Entities that reference the Asset.

---

# 259. Example — User Deletion

User deletion may require coordination across:

```text
Identity & Access

User

Engagement

Audit

other personal data owners.
```

No single table cascade should define the complete privacy lifecycle.

Detailed privacy architecture will define the process.

---

# 260. Ownership of Audit During Deletion

Audit retention may intentionally outlive deletion of ordinary Resources.

That behavior must follow security/legal policy rather than ordinary relational cascading.

---

# 261. Version Ownership

A Resource owner determines whether the Resource requires versioning.

Versioning Kernel supplies shared mechanics.

---

# 262. Revision Content Ownership

Example:

```text
Knowledge Entity Revision
```

remains semantically Knowledge-owned.

Versioning manages revision mechanics.

---

# 263. Taxonomy Deletion Ownership

Taxonomy owns Term lifecycle.

Resources that reference a Term remain owned by their source capabilities.

The classification association may require cleanup/migration.

---

# 264. Relationship Deletion Ownership

Relationships Kernel owns Relationship Instance lifecycle.

Deleting a source Resource should trigger controlled relationship cleanup according to policy.

---

# 265. Metadata Definition Change Ownership

The Domain defining a Metadata Definition owns its semantic evolution.

Metadata Kernel owns compatibility/validation mechanics.

---

# 266. Metadata Migration

Changing Metadata schemas may require data migration.

Semantic migration belongs to the defining Domain.

Execution mechanics may use Migration Foundation.

---

# 267. Ownership and Security

Canonical ownership determines where authorization enforcement must occur.

The owner must not rely exclusively on callers to enforce security.

---

# 268. Owner-Side Authorization

Even if Admin UI checks:

```text
Actor can edit Entity
```

Knowledge mutation must still enforce required authorization at the trusted boundary.

---

# 269. Owner-Side Validation

Canonical owner must validate Domain invariants.

Consumers may validate earlier for UX.

Owner validation remains authoritative.

---

# 270. Owner-Side Audit

The owner should determine whether a mutation requires Audit.

Audit infrastructure records the result.

---

# 271. Owner-Side Events

The canonical owner is responsible for publishing meaningful lifecycle Events.

Consumers should not infer canonical changes by directly observing database tables.

---

# 272. Owner-Side Idempotency

If a mutation can be retried or triggered externally, the owner is responsible for appropriate idempotency semantics.

---

# 273. Ownership and Testing

Each owner is responsible for testing its:

```text
invariants

lifecycle

mutations

public Contracts

security requirements.
```

Consumers test their own integration.

---

# 274. Ownership and Documentation

Each substantial Capability document should explicitly state:

```text
Owned Concepts

Owned Data

Referenced Concepts

Allowed Mutations

Published Events

Consumed Contracts.
```

---

# 275. Ownership and Repository Architecture

Future source structure should make ownership visible.

Example direction:

```text
knowledge/
    domain
    application
    persistence
    public contracts
```

rather than globally mixing persistence by technical role.

Exact structure is deferred to P0-D16.

---

# 276. Ownership and Database Schema

Future database naming/schema organization should make it possible to understand:

```text
which Capability owns which models.
```

The exact technique may be:

```text
schema organization

model naming

folder ownership

migration ownership.
```

Technology Strategy will influence implementation.

---

# 277. Ownership and Migrations

Every schema migration should be attributable to an owning Capability.

Avoid migrations that casually modify unrelated domains together without a clear architectural reason.

---

# 278. Ownership and Seeds

Seed definitions should similarly identify the Capability whose data they create.

---

# 279. Ownership and APIs

API route location does not change ownership.

Example:

```text
/admin/entities
```

is still:

```text
Knowledge-owned Entity operation.
```

---

# 280. Ownership and Events

Event name should reveal semantic owner where practical through naming or namespace conventions.

Exact convention belongs to Event Contracts.

---

# 281. Ownership and Permissions

Permission naming should map to Capability ownership.

Illustrative:

```text
knowledge.entity.publish

media.asset.delete

cms.page.publish
```

Final syntax is not decided here.

---

# 282. Ownership and Universes

Universe-scoped permissions remain:

```text
Identity & Access-owned authorization data
```

even when scoped to:

```text
History

Anime.
```

---

# 283. Ownership and Cross-Universe Resources

A Resource available in multiple Universes should normally remain one canonical Resource if semantics support it.

Avoid duplication solely for Universe membership.

---

# 284. Shared Entity Example

Conceptually:

```text
Entity X
    visible in History
    referenced by Education
```

Knowledge still owns one canonical Entity.

Universe associations may differ.

---

# 285. Universe Copy Exception

Sometimes different Universes may intentionally represent distinct interpretations of a concept.

In that case:

```text
separate Resources
```

may be valid.

The distinction must be semantic, not merely infrastructure-driven.

---

# 286. Ownership and Contested Knowledge

Knowledge Platform may need to represent:

```text
multiple claims

interpretations

sources.
```

No Universe or AI provider should overwrite contested truth merely because it is the current consumer.

Detailed Knowledge modeling is deferred.

---

# 287. Ownership and AI

AI is a consumer and producer.

It does not gain ownership of every Resource it touches.

---

# 288. AI Enrichment Example

```text
AI
    suggests taxonomy classification.

Taxonomy / owning Platform
    validates and accepts it.
```

AI owns the suggestion/generation.

Canonical target owner owns the accepted result.

---

# 289. AI Relationship Suggestion Example

```text
AI suggests:
Person PARTICIPATED_IN Event

Relationships/Knowledge workflow validates.

Relationship becomes canonical only after accepted mutation.
```

---

# 290. AI Metadata Suggestion Example

```text
AI generates metadata candidate.

Metadata/target Capability validates.

Accepted Metadata Value becomes canonical.
```

---

# 291. Ownership Transfer

Canonical ownership transfer between Capabilities should be extremely rare.

If a concept moves from one Platform to another, it is a major architectural change.

---

# 292. Ownership Transfer Requires Review

A transfer should evaluate:

```text
semantic responsibility

data migration

API compatibility

event compatibility

authorization

repository boundaries

consumer impact.
```

Usually an ADR is appropriate.

---

# 293. Capability Split Ownership

When splitting a Capability:

```text
every existing concept must be assigned a new canonical owner.
```

Nothing should remain implicitly shared.

---

# 294. Capability Merge Ownership

When merging:

```text
duplicate sources of truth must be reconciled.
```

One canonical owner must emerge.

---

# 295. Ownership Conflict Detection

An ownership conflict exists when:

```text
two capabilities both believe they may mutate the same canonical field;

two different models claim to be authoritative;

business validation exists in multiple unrelated locations;

different APIs update the same Resource using different rules.
```

---

# 296. Ownership Conflict Resolution

Resolve by asking:

```text
What concept does this state represent?

Which capability owns its meaning?

Which capability controls its lifecycle?

Which consumers only need a reference?

Is one copy actually derived?

Is one responsibility misplaced?
```

---

# 297. Field-Level Ownership

In some cases different fields on a broader composite view originate from different owners.

Example UI:

```text
User Account Screen

Profile Name
    User Platform

Email Verification
    Identity & Access

Favorites Count
    Engagement

Avatar Asset
    Media.
```

The screen does not imply one data owner.

---

# 298. Aggregated API Ownership

An aggregated API may combine:

```text
User

Identity Security State

Engagement Summary.
```

The aggregation layer owns:

```text
response composition.
```

It does not own the source state.

---

# 299. Dashboard Ownership

Likewise, an operational dashboard may display:

```text
Media status

AI usage

Queue health

Database health.
```

Operations owns the dashboard.

Source capabilities retain ownership of their underlying state.

---

# 300. Reporting Ownership

Reports and analytics are usually derived.

The reporting capability owns the report/projection.

Canonical business owners retain source data authority.

---

# 301. Read Model Ownership

A read model optimized for a particular experience is owned by the capability maintaining that projection.

It must clearly identify its source owners.

---

# 302. Materialized View Ownership

A materialized database view may contain cross-Capability information.

It should be treated as:

```text
derived read infrastructure
```

unless explicitly defined otherwise.

---

# 303. Data Warehouse Ownership

If introduced later:

```text
warehouse data
```

will generally be derived analytical state.

It must not replace operational canonical owners.

---

# 304. Search Index Ownership Reaffirmed

Search infrastructure may be lost and rebuilt.

The same should conceptually be true for other purely derived projections where practical.

---

# 305. Canonical State Rebuild Rule

Canonical state should never depend solely on reconstructing it from:

```text
cache

search

analytics

logs
```

unless a specific architecture intentionally defines one of those as canonical persistence.

---

# 306. Logs Ownership

Logs belong to Observability infrastructure.

They are not authoritative business history.

---

# 307. Audit Ownership Reaffirmed

Audit Records are canonical for accountability history within Audit scope.

They are not canonical for reconstructing all Domain Resources.

---

# 308. Events Ownership Reaffirmed

Events communicate facts.

Unless an explicitly accepted event-sourcing architecture is introduced, Event history is not automatically the primary canonical persistence model.

---

# 309. Queue Message Ownership

Queue messages are delivery artifacts.

The business Job/Command/Event meaning belongs to the originating Capability.

---

# 310. Scheduler Record Ownership

Scheduler owns technical schedule state.

If the schedule itself is a meaningful business Resource, the owning Platform should model that business concept separately.

---

# 311. Feature Flag State Ownership

Feature Flags owns rollout state.

The permanent feature configuration, if any, belongs elsewhere.

---

# 312. Provider Configuration Ownership

Provider configuration belongs to the capability integrating that Provider.

Examples:

```text
AI model/provider configuration
    AI / Creator

Storage provider configuration
    Storage

Email provider configuration
    Email.
```

Runtime Configuration Foundation supplies loading mechanics.

---

# 313. Global Configuration Anti-Pattern

Avoid:

```text
one giant settings table
```

where all Platforms directly read and mutate unrelated settings.

Product configuration should remain capability-owned.

---

# 314. Ownership Anti-Pattern — Shared Table

Bad reasoning:

```text
"Both modules use this table,
so both own it."
```

Correct:

```text
one owner;

multiple authorized consumers.
```

---

# 315. Ownership Anti-Pattern — UI Ownership

Bad:

```text
Profile page shows Sessions,
therefore User Platform owns Sessions.
```

Correct:

```text
Identity & Access owns Sessions.

Profile/Security UI presents them.
```

---

# 316. Ownership Anti-Pattern — Provider Ownership

Bad:

```text
Object Storage owns Asset.
```

Correct:

```text
Media owns Asset.

Storage stores bytes.
```

---

# 317. Ownership Anti-Pattern — Universe Ownership

Bad:

```text
Anime owns all Character persistence outside Knowledge.
```

Preferred:

```text
Anime defines Character domain semantics.

Knowledge owns canonical Knowledge Resource instances.
```

---

# 318. Ownership Anti-Pattern — CMS Ownership

Bad:

```text
CMS owns everything editors can edit.
```

Correct:

```text
CMS provides creator interface/composition.

Underlying Platform retains canonical ownership.
```

---

# 319. Ownership Anti-Pattern — Admin Ownership

Bad:

```text
Admin module owns all admin-managed models.
```

Admin is a delivery application.

Canonical owners remain unchanged.

---

# 320. Ownership Anti-Pattern — Search Ownership

Bad:

```text
Search record is the canonical Entity.
```

Search is derived.

---

# 321. Ownership Anti-Pattern — Cache Ownership

Bad:

```text
Cache entry is the only state of an important business Resource
```

unless explicitly designed as durable canonical storage.

---

# 322. Ownership Anti-Pattern — AI Ownership

Bad:

```text
AI generated it,
therefore AI owns the published Entity.
```

Correct:

```text
AI owns Generation.

Knowledge owns accepted Entity.
```

---

# 323. Ownership Anti-Pattern — Workflow Ownership

Bad:

```text
Workflow owns every Resource whose lifecycle it coordinates.
```

Workflow owns process mechanics.

Target Platform owns target Resource.

---

# 324. Ownership Anti-Pattern — Policy Ownership

Bad:

```text
Policy engine owns business rules.
```

Policy engine evaluates configurable policies.

Domain owner defines policy meaning and invariants.

---

# 325. Ownership Anti-Pattern — Database Ownership

Bad:

```text
Database module owns all persistence.
```

Database owns infrastructure.

Capabilities own their data.

---

# 326. Ownership Anti-Pattern — Repository Ownership

Bad:

```text
Repository package owns all data models.
```

Repositories belong to Domain owners.

---

# 327. Ownership Anti-Pattern — Migration Ownership

Bad:

```text
Migration module decides how Knowledge data is transformed.
```

Knowledge defines semantic transformation.

Migration runs it.

---

# 328. Ownership Anti-Pattern — Queue Ownership

Bad:

```text
Queue owns AI Generation because Generation runs asynchronously.
```

AI owns Generation.

Queue transports work.

---

# 329. Ownership Anti-Pattern — Scheduler Ownership

Bad:

```text
Scheduler owns scheduled Page publication.
```

Composition owns publication.

Scheduler owns timing mechanics.

---

# 330. Ownership Anti-Pattern — Observability Ownership

Bad:

```text
Logs are the source of truth for payment/content/security state.
```

Logs are diagnostic.

---

# 331. Ownership Anti-Pattern — Duplicate Canonical Copies

Bad:

```text
Entity.name
```

editable in Knowledge and:

```text
Page.entityName
```

independently editable as the same canonical fact.

If Page needs custom text, model it as:

```text
presentation override
```

with distinct semantics.

---

# 332. Ownership Anti-Pattern — Generic Resource Owner

Avoid one generic capability owning:

```text
Entity

Asset

Page

User

Favorite
```

simply because all have:

```text
id

createdAt

updatedAt.
```

Shared technical fields do not imply shared Domain ownership.

---

# 333. Ownership Anti-Pattern — Shared CRUD Service

Avoid:

```text
GenericCrudService
```

that mutates Resources across ownership boundaries.

---

# 334. Ownership Anti-Pattern — Common Repository

Avoid:

```text
CommonRepository.update(table, id, data)
```

as an application-level business interface.

---

# 335. Ownership Anti-Pattern — Cross-Domain ORM Access

Avoid:

```text
Knowledge Service
    imports
User ORM model
```

to update User state.

---

# 336. Ownership Anti-Pattern — Hidden Ownership Through Events

Events must not be used to conceal unclear ownership.

If both producer and consumer believe they are canonical state owners, Events do not solve the architecture problem.

---

# 337. Ownership Anti-Pattern — Dual Write Without Authority

Avoid:

```text
Application
    writes Knowledge DB
    then Search DB
```

as if both were canonical.

Preferred:

```text
Knowledge canonical write
    ↓
Discovery projection update.
```

---

# 338. Ownership Anti-Pattern — Frontend Sync as Canonical Logic

Frontend must not be responsible for keeping two canonical backend Resources consistent.

Coordination belongs in trusted Platform logic.

---

# 339. Ownership Anti-Pattern — External ID as Canonical ID

Provider IDs must remain mappings where AI World owns the Resource.

---

# 340. Ownership Anti-Pattern — Slug as Only Identity

Slugs may be presentation-owned/mutable.

Canonical owner should retain stable identifier.

---

# 341. Ownership Decision Checklist

For every new concept ask:

```text
1. What does this concept mean?

2. Which Capability defines that meaning?

3. Where is its canonical state?

4. Who may create it?

5. Who may modify it?

6. Who may delete/archive it?

7. Who defines its lifecycle?

8. Who validates its invariants?

9. Who authorizes its mutation?

10. Who publishes lifecycle Events?

11. Which other capabilities only reference it?

12. Are any copies derived?

13. Can derived copies be rebuilt?

14. Is an external Provider being mistaken for owner?

15. Is a UI or API being mistaken for owner?

16. Is a Universe being mistaken for shared Platform owner?
```

---

# 342. Reference Decision Checklist

When one Capability needs another Resource:

```text
Do we only need its ID?

Do we need a narrow reference Contract?

Do we need a synchronous query?

Would a snapshot be legitimate?

Would an Event-derived projection be better?

Are we accidentally trying to mutate it?

Who handles lifecycle changes to the referenced Resource?
```

---

# 343. Mutation Decision Checklist

Before cross-Capability mutation:

```text
Who owns the target state?

Does a public mutation Contract exist?

Should this be one owner-owned use case?

Is this actually an asynchronous reaction?

Would direct mutation create dual ownership?

Does this operation require a transaction?

Does the owner enforce authorization?

Does the owner emit the correct Event?
```

---

# 344. Projection Decision Checklist

Before creating derived data:

```text
What is the canonical source?

Who owns the projection?

How does it update?

Can it be stale?

Can it be rebuilt?

How is deletion handled?

How is authorization preserved?

What happens after missed Events?
```

---

# 345. Ownership Change Checklist

Before moving ownership:

```text
Why is the current owner wrong?

Which new owner better matches semantics?

What data migrates?

Which Contracts change?

Which Events change?

Which permissions change?

Which consumers change?

Does the new ownership create a cycle?

Does an ADR need to record the decision?
```

---

# 346. Capability Ownership Summary

```text
IDENTITY & ACCESS

    Actor security identity
    Credentials
    Sessions
    Verification
    Recovery
    Roles
    Permissions
    Authorization
    Machine Identity


USER

    User
    Profile
    Preferences
    Locale/Timezone preference
    Privacy/Accessibility preferences


UNIVERSE

    Universe Definition
    Domain Definitions
    Domain-specific taxonomy meaning
    Domain-specific relationship meaning
    Universe configuration
    Universe AI configuration
    Universe presentation
    Universe Extensions


KNOWLEDGE

    Entity
    canonical Knowledge Resources
    Knowledge lifecycle
    Sources
    Citations
    Knowledge verification
    accepted imported Knowledge


MEDIA

    Asset
    Media metadata
    Media Variants
    Media lifecycle
    Media processing state
    Media rights


DISCOVERY

    Search Contract
    Search Projection
    Index mappings
    ranking
    related/recommendation discovery state


AI / CREATOR

    Generation
    Generation Result
    AI Provider Contract
    Model Catalog
    Prompt Template
    AI Tool framework
    AI routing
    AI evaluation
    AI provenance


COMPOSITION / CMS

    Page
    Block
    Layout
    Experience
    Preview
    composition publication state
    SEO presentation configuration


ENGAGEMENT

    Favorite
    Collection
    Activity History
    Progress
    Personalization Signals
    Notifications
    Notification Preferences
    Achievements


OPERATIONS

    operational dashboards
    usage/cost projections
    provider status projections
    administrative operational actions


PLATFORM KERNEL

    Identifiers
    Namespace
    Taxonomy mechanics
    Metadata mechanics
    Relationships mechanics
    Event mechanics
    Audit Records
    Workflow mechanics
    Policy mechanics
    Localization mechanics
    Versioning mechanics


FOUNDATIONS

    runtime Configuration mechanics
    Database infrastructure
    Repository infrastructure primitives
    Migration execution
    Seed execution
    Storage infrastructure
    Cache infrastructure
    Queue infrastructure
    Scheduler infrastructure
    Email transport
    Observability
    Feature Flags
```

---

# 347. Canonical Reference Summary

Typical references should follow:

```text
User
    → Asset ID for avatar

Entity
    → Asset ID

Page
    → Entity ID
    → Asset ID

Favorite
    → Resource ID

Collection
    → Resource IDs

Progress
    → Experience/Journey ID

Relationship
    → Source Resource ID
    → Target Resource ID

Generation
    → source Resource IDs
```

The referencing owner owns the reference.

The target owner owns the target Resource.

---

# 348. Canonical Mutation Summary

```text
Credential
    mutated only by Identity & Access

Session
    mutated only by Identity & Access

User Profile
    mutated only by User

Entity
    mutated only by Knowledge

Asset
    mutated only by Media

Search Projection
    mutated only by Discovery

Generation
    mutated only by AI / Creator

Page
    mutated only by Composition / CMS

Favorite
    mutated only by Engagement

Relationship
    mutated only through Relationships capability

Audit Record
    created/managed only through Audit capability
```

---

# 349. Cross-Capability Integration Summary

Preferred integration mechanisms:

```text
PUBLIC CONTRACT
    for synchronous queries/mutations

RESOURCE REFERENCE
    when only identity/linkage is needed

EVENT
    for asynchronous reactions

PROJECTION
    for optimized derived reads

WORKFLOW
    for reusable process coordination

ADAPTER
    for external Provider integration.
```

---

# 350. Ownership Architecture Invariants

The following are formal architectural invariants:

```text
1. Every major canonical concept has one primary owner.

2. Shared use does not imply shared ownership.

3. Physical database sharing does not imply logical data sharing.

4. A Capability normally mutates only state it owns.

5. Cross-Capability mutation must use the owning Capability's supported Contract.

6. Applications do not become canonical owners merely because they expose UI/API operations.

7. Admin and Operations tooling do not bypass canonical owners.

8. Universes define domain specialization but do not duplicate shared Platform ownership.

9. External Providers do not own AI World canonical Domain semantics.

10. Search indexes, caches, analytics, and similar projections remain derived unless explicitly promoted.

11. Knowledge owns canonical Entities.

12. Media owns canonical Assets.

13. Identity & Access owns Credentials, Sessions, Roles, Permissions, and Authorization.

14. User owns product-facing User profile/preferences.

15. AI / Creator owns Generation; target Platforms own accepted canonical AI outputs.

16. Composition / CMS owns Pages, Blocks, Layouts, and composed Experiences.

17. Engagement owns Favorites, Collections, Progress, and user engagement state.

18. Kernel capabilities own reusable semantic mechanics, not the business Resources consuming them.

19. Foundations own technical mechanics, not higher-level Domain state.

20. The Resource owner remains responsible for validation, lifecycle, security integration, and meaningful Events.

21. Derived-state owners are responsible for convergence and rebuild of their projections.

22. Provider identifiers remain distinct from AI World canonical identifiers.

23. Relationship references do not transfer ownership of source or target Resources.

24. Workflow coordination does not transfer ownership of target Resources.

25. Ownership changes are architectural changes and must be deliberate.
```

---

# 351. Current Ownership Decisions That Are Intentionally Provisional

The following may require refinement during later Capability design:

```text
exact Universe Registry runtime ownership;

exact Entity Type persistence ownership;

exact Metadata Definition persistence split between Kernel and defining Domain;

exact Taxonomy Definition persistence split;

exact Relationship Type registration model;

Notification semantics between User and Engagement;

generic provenance abstraction;

Experience scope if it expands beyond Composition;

future Organization / Tenant ownership;

future Commerce / Billing ownership.
```

These uncertainties do not invalidate the primary ownership boundaries.

---

# 352. What This Document Decides

This document establishes:

```text
the canonical ownership model;

single-owner principle;

mutation authority rule;

reference rules;

derived-state rules;

Platform ownership of major concepts;

Kernel ownership of shared semantic mechanics;

Foundation ownership of technical mechanics;

provider ownership boundaries;

AI output ownership transition;

Universe definition vs Resource ownership;

cross-Capability mutation restrictions.
```

---

# 353. What This Document Does Not Decide

This document does not finalize:

```text
database schema

table names

foreign-key strategy

ORM structure

exact API interfaces

exact Permission Keys

exact Event envelope

exact transaction implementation

specific Repository classes

exact Universe registration technology

exact Metadata/Taxonomy storage models.
```

Those decisions belong to later architecture and implementation work.

---

# 354. Relationship to Dependency Rules

This document answers:

```text
WHO OWNS WHAT?
```

The next document:

```text
P0-D14 — Dependency Rules
```

will answer:

```text
WHO MAY DEPEND ON WHOM?

WHAT MAY BE IMPORTED?

HOW MAY CAPABILITIES COMMUNICATE?

WHICH DEPENDENCIES ARE FORBIDDEN?

HOW WILL WE PREVENT ARCHITECTURE EROSION?
```

---

# 355. Relationship to Extension Model

The Extension Model will use this Ownership Model to ensure:

```text
Extensions add behavior
without stealing canonical ownership;

Universe configuration specializes Platforms
without duplicating them;

Provider Adapters implement infrastructure
without leaking provider ownership upward.
```

---

# 356. Relationship to Repository Architecture

Repository Architecture must make the ownership boundaries described here visible and enforceable in source structure.

Repository layout must not create ownership-free shared areas where unrelated business logic accumulates.

---

# 357. Relationship to Technology Strategy

The selected technology stack must support:

```text
logical data ownership;

module boundaries;

public/internal Contracts;

controlled persistence access;

provider isolation;

migration ownership;

testable capability boundaries.
```

Technology convenience must not erase ownership.

---

# 358. Final Ownership Statement

> **AI World will maintain one canonical owner for every important concept. The owner defines meaning, invariants, lifecycle, mutation authority, and supported Contracts. Other capabilities may reference, query, compose, index, cache, analyze, or react to that state, but they do not gain ownership by doing so. Physical infrastructure may be shared; canonical responsibility may not be ambiguous.**

Clear ownership is the foundation for safe modularity.

---

# 359. Acceptance

```text
DOCUMENT
P0-D13 — AI World Ownership Model

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

NEXT DOCUMENT
P0-D14 — Dependency Rules

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```