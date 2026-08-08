# AI World Terminology

## Document Metadata

| Field | Value |
|---|---|
| Project | AI World |
| Document | Terminology |
| Document ID | P0-D08 |
| Area | Vision |
| Status | ACCEPTED |
| Version | 1.0.0 |
| Created | 2026-08-08 |
| Last Reviewed | 2026-08-08 |
| Authority | Canonical Project Vocabulary |
| Applies To | Entire AI World Platform |
| Parent Documents | `docs/00-governance/project-charter.md`, `docs/01-vision/vision.md`, `docs/01-vision/mission.md`, `docs/01-vision/platform-principles.md`, `docs/01-vision/universe-principles.md`, `docs/01-vision/goals.md`, `docs/01-vision/non-goals.md` |

---

# 1. Purpose

This document defines the canonical terminology used throughout **AI World**.

Its purpose is to prevent architectural ambiguity.

As the project grows, words such as:

```text
Platform
Module
Resource
Entity
Identity
User
Actor
Provider
Workflow
Event
Metadata
Universe
```

could easily acquire different meanings in different parts of the system.

AI World must avoid that.

This document establishes a common architectural vocabulary for:

- documentation,
- source code,
- architecture reviews,
- ADRs,
- APIs,
- data models,
- events,
- permissions,
- configuration,
- testing,
- operations,
- Universe definitions.

When a term has a canonical meaning here, future documents should use that meaning unless an explicit specialized definition is provided.

---

# 2. Terminology Principle

AI World follows:

> **One architectural concept should have one preferred name, and one preferred name should represent one architectural concept whenever practical.**

Terminology should optimize for:

```text
clarity
precision
durability
consistency
discoverability
```

rather than cleverness or brevity.

---

# 3. Terminology Authority

This document is the canonical vocabulary for Phase 0 architecture.

If another document uses a term differently, one of the following must happen:

```text
1. The other document adopts this terminology.

2. The other document explicitly defines a narrower contextual meaning.

3. This terminology document is deliberately amended.
```

Silent semantic drift is not acceptable.

---

# 4. Capitalization Convention

AI World documentation may capitalize major architectural concepts when referring to their formal platform meaning.

Examples:

```text
Universe

Platform

Foundation

Platform Kernel

Knowledge Platform

Media Platform

Actor

Asset
```

Lowercase may be used when referring to ordinary generic meanings.

Example:

```text
The Media Platform owns media processing.

The image contains media content.
```

Capitalization should improve clarity without becoming excessive.

---

# 5. Naming Stability

Names in this document describe architectural concepts.

They do not automatically prescribe:

```text
database table names

class names

package names

API route names

filesystem paths

TypeScript type names
```

Implementation naming will follow engineering and repository standards.

---

# 6. AI World

## Definition

**AI World** is the complete reusable digital platform being built by the project.

It includes:

```text
technical Foundations

Platform Kernel capabilities

business Platforms

Universes

applications

APIs

creator tooling

AI capabilities

operations
```

AI World is not defined by any specific technology.

---

# 7. AI World Platform

## Definition

**AI World Platform** refers to the shared capabilities and architecture that support all AI World Universes and experiences.

In many contexts:

```text
AI World
```

and:

```text
AI World Platform
```

may refer to the same overall system.

Use **AI World Platform** when emphasizing shared technical or architectural capability.

---

# 8. Capability

## Definition

A **Capability** is something AI World knows how to do.

Examples:

```text
Authenticate an Actor

Authorize an Action

Store an Asset

Classify a Resource

Relate Resources

Publish an Event

Search Knowledge

Generate AI Content
```

A Capability is an architectural concept.

It is not necessarily equivalent to:

```text
one class

one module

one package

one microservice
```

---

# 9. Capability Owner

## Definition

The **Capability Owner** is the architectural area responsible for defining and maintaining a Capability.

Ownership includes responsibility for:

```text
semantics

business invariants

public contracts

persistence where applicable

security behavior

lifecycle

documentation
```

A Capability should normally have one primary owner.

---

# 10. Foundation

## Definition

A **Foundation** is reusable technical infrastructure that supports higher-level AI World capabilities.

Examples:

```text
Configuration

Database

Storage

Cache

Queue

Scheduler

Email

Migration

Seed

Observability
```

Foundations should generally remain unaware of specific Universe semantics.

---

# 11. Technical Foundation

**Technical Foundation** is equivalent to **Foundation** when additional clarity is useful.

Preferred short form:

```text
Foundation
```

---

# 12. Platform Kernel

## Definition

The **Platform Kernel** contains highly reusable semantic capabilities that multiple Platforms may depend upon.

Initial conceptual areas include:

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

The Platform Kernel must remain small and carefully governed.

---

# 13. Kernel Capability

A **Kernel Capability** is a Capability belonging to the Platform Kernel.

Examples:

```text
Metadata

Taxonomy

Relationships
```

Not every reusable concept belongs in the Kernel.

---

# 14. Platform

## Definition

A **Platform** is a major reusable business or product capability built on top of Foundations and, where appropriate, Platform Kernel capabilities.

Examples:

```text
Identity & Access Platform

User Platform

Knowledge Platform

Media Platform

Discovery Platform

AI / Creator Platform

Composition / CMS Platform

Engagement Platform

Operations Platform
```

A Platform may contain multiple modules and internal capabilities.

---

# 15. Module

## Definition

A **Module** is an implementation-level organizational boundary containing related code.

A Module may implement:

```text
all of a Capability

part of a Capability

part of a Platform
```

A Module is not automatically a Platform.

Architecture is Capability-oriented.

Code organization may be Module-oriented.

---

# 16. Component

## Definition

A **Component** is a generic implementation unit.

Depending on context, it may refer to:

```text
service

module

worker

frontend component

infrastructure unit
```

Use a more precise term whenever one is available.

---

# 17. Universe

## Definition

A **Universe** is a logical domain world operating on top of AI World.

Examples:

```text
Anime

History

Nature

Science

Education
```

A Universe may define:

```text
domain concepts

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

A Universe is not automatically:

```text
an application

a database

a microservice

a tenant

a frontend
```

---

# 18. Proof Universe

## Definition

A **Proof Universe** is a Universe intentionally used to validate whether AI World's shared architecture is genuinely reusable.

Initial Proof Universes:

```text
Anime

History
```

They are architectural test cases.

They are not special core Platform types.

---

# 19. Universe Definition

## Definition

A **Universe Definition** is the structured declaration of what makes a Universe unique.

It may eventually contain:

```text
identity

capability configuration

domain definitions

taxonomy

metadata schemas

relationship definitions

workflow definitions

policy configuration

AI configuration

presentation configuration
```

The exact implementation format is not yet defined.

---

# 20. Universe Configuration

## Definition

**Universe Configuration** is declarative configuration controlling a Universe's use of AI World capabilities.

Configuration represents variability that does not require new executable business logic.

---

# 21. Universe Extension

## Definition

A **Universe Extension** is typed custom behavior required by a Universe when configuration alone is insufficient.

Universe Extensions must remain:

```text
bounded

registered

validated

secure
```

They must not become unrestricted access to core Platform internals.

---

# 22. Domain

## Definition

A **Domain** is an area of subject meaning or business responsibility.

Examples:

```text
authentication

knowledge

media

history

anime
```

A Domain may exist:

```text
inside a Platform

inside a Universe

across multiple Modules
```

---

# 23. Domain Model

## Definition

A **Domain Model** is the typed representation of meaningful concepts and rules within a Domain.

Examples may include:

```text
Asset

HistoricalEvent

AnimeEpisode

UserSession
```

A Domain Model is not necessarily identical to a persistence model.

---

# 24. Domain Invariant

## Definition

A **Domain Invariant** is a rule that must remain true for a Domain concept to remain valid.

Example:

```text
A Published resource may require a publication timestamp.
```

Domain invariants belong to the owning Capability.

---

# 25. Resource

## Definition

A **Resource** is a general term for a persistable or addressable object managed by AI World.

Examples may include:

```text
User

Asset

Entity

Experience

Collection

Workflow Definition
```

Use a more specific term whenever known.

---

# 26. Canonical Resource

## Definition

A **Canonical Resource** is an authoritative AI World representation of a business or knowledge concept.

A Canonical Resource is owned by one Capability.

Derived representations may exist elsewhere.

---

# 27. Entity

## Definition

An **Entity** is a canonical Knowledge Platform concept representing a distinguishable subject, object, concept, person, place, fictional character, organization, event, or similar knowledge-bearing thing.

Potential examples:

```text
Historical Person

Anime Character

Civilization

Studio

Location

Scientific Concept
```

The exact Knowledge Platform Entity model is not finalized by this document.

---

# 28. Entity Type

## Definition

An **Entity Type** defines a category of Entity with meaningful semantics and potentially typed structure.

Possible examples:

```text
Character

Person

Place

Organization

Event
```

Entity Type architecture will be defined during Knowledge Platform design.

---

# 29. Content

## Definition

**Content** is information intended to be created, managed, published, or experienced by users.

Content may include:

```text
text

structured knowledge

media

stories

experiences

collections

AI-generated drafts
```

Not all persisted data is Content.

---

# 30. Knowledge

## Definition

**Knowledge** is structured or meaningful information represented by the Knowledge Platform.

Knowledge may involve:

```text
Entities

relationships

facts

sources

temporal context

domain definitions

structured descriptions
```

---

# 31. Knowledge Platform

## Definition

The **Knowledge Platform** owns canonical structured knowledge capabilities used across AI World.

Its future exact model is not yet finalized.

Potential responsibilities include:

```text
Entities

domain resource definitions

knowledge semantics

knowledge lifecycle

knowledge relationships integration
```

---

# 32. Experience

## Definition

An **Experience** is a structured user-facing composition or interaction built from AI World resources.

Examples may include:

```text
interactive timeline

guided story

learning journey

character exploration

historical exhibition
```

An Experience may compose:

```text
Knowledge

Media

Relationships

UI blocks

AI behavior
```

---

# 33. Scene

## Definition

A **Scene** is a structured unit representing a meaningful moment, segment, or compositional sequence within an Experience or content domain.

Possible examples:

```text
anime scene

historical reenactment segment

interactive story scene
```

The exact canonical semantics will be defined when the Knowledge/Experience architecture is designed.

---

# 34. Story

## Definition

A **Story** is a narrative composition connecting resources or Experiences through meaningful sequence.

Story is conceptually distinct from raw Knowledge.

Knowledge describes.

Stories narrate.

---

# 35. Collection

## Definition

A **Collection** is an intentional grouping of Resources.

Collections may be:

```text
editorial

user-created

system-created

AI-assisted
```

depending on future requirements.

---

# 36. Journey

## Definition

A **Journey** is an ordered or guided progression through Resources or Experiences.

Potential uses include:

```text
learning

discovery

storytelling

curated exploration
```

---

# 37. Taxonomy

## Definition

**Taxonomy** is the structured classification of Resources using governed concepts or vocabularies.

Examples may include:

```text
genres

topics

eras

subjects

themes

categories
```

Taxonomy is more structured than arbitrary tagging.

---

# 38. Taxonomy Term

## Definition

A **Taxonomy Term** is one value within a Taxonomy.

Examples:

```text
Action

Ancient History

Ecology

Space Exploration
```

Terms may eventually support:

```text
hierarchy

localization

aliases

lifecycle
```

---

# 39. Tag

## Definition

A **Tag** is a lightweight label used for classification or discovery.

A Tag is not necessarily equivalent to a governed Taxonomy Term.

Do not use the two terms interchangeably automatically.

---

# 40. Metadata

## Definition

**Metadata** is validated descriptive information associated with a Resource that extends or describes it without replacing its core Domain Model.

Metadata should be:

```text
typed

validated

owned

governed
```

where appropriate.

---

# 41. Metadata Definition

## Definition

A **Metadata Definition** describes the semantics and validation rules of a metadata field.

Potential properties may include:

```text
key

type

required status

constraints

display name

scope

version
```

The exact architecture is not yet finalized.

---

# 42. Metadata Value

## Definition

A **Metadata Value** is the actual value assigned to a Resource for a defined metadata property.

Metadata Values must conform to their Metadata Definitions.

---

# 43. Relationship

## Definition

A **Relationship** is a meaningful typed connection between two Resources or concepts.

Examples:

```text
Person
    PARTICIPATED_IN
Event

Character
    APPEARS_IN
Series
```

A Relationship is not merely an arbitrary pair of IDs.

---

# 44. Relationship Type

## Definition

A **Relationship Type** defines the semantics of a Relationship.

It may eventually define:

```text
name

source type

target type

direction

inverse semantics

constraints
```

---

# 45. Graph

## Definition

A **Graph** is the conceptual network formed by Resources and Relationships.

Using graph semantics does not imply use of a graph database.

---

# 46. Knowledge Graph

## Definition

The **Knowledge Graph** is the connected representation of AI World Knowledge through Resources and typed Relationships.

It is a conceptual Platform capability.

It is not a commitment to a specific persistence technology.

---

# 47. Identifier

## Definition

An **Identifier** uniquely identifies a Resource or architectural concept within an appropriate scope.

Examples:

```text
User ID

Asset ID

Entity ID

Universe ID
```

Identifiers should remain stable where long-lived references depend on them.

---

# 48. Canonical Identifier

## Definition

A **Canonical Identifier** is the identifier AI World considers authoritative for a Resource.

It should not depend unnecessarily on:

```text
provider IDs

URLs

slugs

storage locations
```

---

# 49. External Identifier

## Definition

An **External Identifier** is an identifier assigned by another system.

Examples:

```text
provider media ID

external catalog ID

third-party knowledge ID
```

External Identifiers may map to Canonical Resources.

---

# 50. Slug

## Definition

A **Slug** is a human-readable identifier typically used in URLs or presentation.

Example:

```text
ashoka-the-great
```

A Slug is generally mutable.

It should not automatically be treated as canonical identity.

---

# 51. Namespace

## Definition

A **Namespace** creates a scope for names or identifiers so independently defined concepts can avoid collisions.

Possible namespace applications include:

```text
permissions

events

metadata

relationships

capabilities

Universe-defined concepts
```

---

# 52. Key

## Definition

A **Key** is a stable machine-readable name used to reference a concept within a defined namespace or context.

Examples may include:

```text
anime

history

media.asset.read
```

A Key is not necessarily the canonical database identifier.

---

# 53. Actor

## Definition

An **Actor** is something capable of initiating or being attributed to an action within AI World.

Actors may include:

```text
User

Administrator

Service Account

System Process

Worker

AI Agent
```

Actor is broader than User.

---

# 54. Human Actor

A **Human Actor** is an Actor representing a person interacting with AI World.

Examples:

```text
User

Editor

Administrator

Creator
```

---

# 55. Machine Actor

A **Machine Actor** is an Actor representing an automated or software-controlled identity.

Examples:

```text
Service Account

Worker

AI Agent

Automation
```

---

# 56. User

## Definition

A **User** is a Human Actor represented by the User Platform.

User concerns may include:

```text
profile

preferences

privacy

personal settings

engagement context
```

Authentication credentials are not automatically owned by the User Platform.

---

# 57. Identity

## Definition

**Identity** describes who or what an Actor is from an authentication/security perspective.

Identity may involve:

```text
credentials

authentication methods

verified identifiers

machine identities
```

Identity must not be confused with generic platform Resource identifiers.

This distinction is why:

```text
Platform Kernel → Identifiers
```

and:

```text
Identity & Access Platform
```

are separate architectural areas.

---

# 58. Identity & Access Platform

## Definition

The **Identity & Access Platform** owns shared security capabilities involving:

```text
authentication

sessions

credentials

authorization

roles

permissions

access policies

machine identity
```

The exact decomposition may later separate Authentication and Authorization internally.

---

# 59. Authentication

## Definition

**Authentication** answers:

```text
Who is this Actor?
```

It establishes or verifies Actor identity.

---

# 60. Authorization

## Definition

**Authorization** answers:

```text
May this Actor perform this Action
on this Resource
in this Context?
```

Authentication and Authorization are different concerns.

---

# 61. Credential

## Definition

A **Credential** is secret or cryptographic material used to authenticate an Actor.

Examples may include:

```text
password

passkey credential

API credential

service credential
```

Credentials require strong security controls.

---

# 62. Session

## Definition

A **Session** represents an authenticated interaction context associated with an Actor.

The specific session architecture will be decided later.

---

# 63. Role

## Definition

A **Role** is a named grouping of access responsibilities or Permissions assigned to an Actor within an appropriate scope.

Examples may include:

```text
Platform Administrator

History Editor

Reviewer
```

---

# 64. Permission

## Definition

A **Permission** represents authorization to perform a specific category of Action.

Conceptually:

```text
resource
+
action
+
scope
```

may contribute to Permission semantics.

The final Permission model will be designed later.

---

# 65. Policy

## Definition

A **Policy** is an explicit rule used to evaluate variable behavior, access, or operational decisions.

Policies may depend on:

```text
Actor

Resource

Universe

environment

workflow state

context
```

Policy must not become a generic substitute for all business logic.

---

# 66. Access Policy

An **Access Policy** is a Policy specifically governing Authorization.

---

# 67. Business Policy

A **Business Policy** is an explicit rule governing domain behavior that varies by configured context.

---

# 68. Scope

## Definition

A **Scope** defines the boundary within which a capability, Permission, policy, identifier, or configuration applies.

Examples:

```text
Platform scope

Universe scope

Resource scope

User scope
```

---

# 69. Context

## Definition

**Context** is runtime information required to correctly interpret an operation.

Potential Context includes:

```text
Actor

Universe

Resource

Locale

Request

Workflow State

Security Scope
```

Context should be explicit when it materially affects behavior.

---

# 70. Action

## Definition

An **Action** is an operation an Actor or system attempts to perform.

Examples:

```text
read

create

update

delete

publish

approve

generate
```

Action semantics belong to the appropriate Capability.

---

# 71. Workflow

## Definition

A **Workflow** is a defined business process governing progression through states, steps, approvals, or actions.

Examples:

```text
Draft
    ↓
Review
    ↓
Approved
    ↓
Published
```

Workflow should not be confused with asynchronous execution infrastructure.

---

# 72. Workflow Definition

## Definition

A **Workflow Definition** describes the configured process structure of a Workflow.

It may define:

```text
states

transitions

conditions

actions

approvals
```

The implementation model is not yet finalized.

---

# 73. Workflow Instance

## Definition

A **Workflow Instance** is one executing or active application of a Workflow Definition to a Resource or process.

Not every workflow implementation will necessarily require a separately persisted Workflow Instance.

---

# 74. State

## Definition

A **State** describes the current lifecycle condition of a Resource, Workflow, Job, or similar concept.

State must be interpreted within its owning model.

Examples:

```text
DRAFT

PUBLISHED

FAILED
```

---

# 75. Transition

## Definition

A **Transition** is a valid movement from one State to another.

Transitions may have:

```text
authorization

validation

policy

side effects
```

---

# 76. Lifecycle

## Definition

A **Lifecycle** is the set of meaningful States and Transitions through which a Resource or Capability progresses over time.

---

# 77. Event

## Definition

An **Event** is a record or message representing a meaningful fact that has happened.

Examples:

```text
UserRegistered

EntityPublished

AssetProcessed
```

An Event should generally use past-tense semantics.

---

# 78. Domain Event

## Definition

A **Domain Event** represents a meaningful fact within one Domain.

Example:

```text
HistoricalEventVerified
```

---

# 79. Platform Event

## Definition

A **Platform Event** represents a fact intended for consumption across Platform or Capability boundaries.

Example:

```text
EntityPublished
```

The boundary between Domain Event and Platform Event should be deliberate.

---

# 80. Integration Event

## Definition

An **Integration Event** is an externally consumable or cross-system Event contract used to integrate independent systems or deployment boundaries.

Not every internal Domain Event should become an Integration Event.

---

# 81. Command

## Definition

A **Command** expresses an intention or request for something to happen.

Example:

```text
PublishEntity
```

Compare:

```text
Command:
PublishEntity

Event:
EntityPublished
```

---

# 82. Query

## Definition

A **Query** asks for information without intending to mutate canonical state.

Examples:

```text
FindEntity

SearchKnowledge

ListAssets
```

The project does not automatically require formal CQRS architecture.

---

# 83. Message

## Definition

A **Message** is a general communication payload exchanged between components.

A Message may be:

```text
Command

Event

Job payload
```

Use a more precise term when possible.

---

# 84. Queue

## Definition

A **Queue** is infrastructure used to coordinate asynchronous work delivery.

Queue is a Foundation-level concern.

A Queue does not define business Workflow semantics.

---

# 85. Job

## Definition

A **Job** is a unit of asynchronous or deferred work.

Examples:

```text
GenerateThumbnail

ReindexEntity

ProcessVideo
```

A Job may have durable execution state where required.

---

# 86. Background Job

A **Background Job** is a Job executed outside the primary synchronous request lifecycle.

---

# 87. Scheduler

## Definition

A **Scheduler** determines when work should be triggered.

Examples:

```text
run every hour

run at a future date

execute recurring cleanup
```

Scheduler is distinct from Queue and Workflow.

---

# 88. Worker

## Definition

A **Worker** is a runtime process or component responsible for executing background Jobs or asynchronous tasks.

A Worker is an implementation/deployment concept.

---

# 89. Task

## Definition

A **Task** is a generic executable unit of work.

Because Task is broad, prefer more specific terms such as:

```text
Job

Migration

Seed

Workflow Action
```

when possible.

---

# 90. Migration

## Definition

A **Migration** is a deliberate historical change required to evolve persisted system state.

AI World distinguishes multiple migration concepts.

---

# 91. Schema Migration

## Definition

A **Schema Migration** changes persistent database structure.

Examples:

```text
create table

add column

create index

change constraint
```

Schema Migrations belong to database evolution.

---

# 92. Application Migration

## Definition

An **Application Migration** performs one-time historical application/data evolution not adequately represented as a schema-only change.

Examples may include:

```text
backfill derived state

transform historical data

rename persistent semantic values
```

Application Migration architecture will be defined when required.

---

# 93. Seed

## Definition

A **Seed** intentionally populates controlled initial, reference, development, or environment-specific data.

Seed is not historical application evolution.

---

# 94. Bootstrap

## Definition

**Bootstrap** is initialization required to bring an application runtime or environment into an operational starting state.

Bootstrap may involve:

```text
runtime registration

provider initialization

system startup
```

Bootstrap is not automatically equivalent to Seed or Migration.

The exact use of this term will be finalized during engineering architecture.

---

# 95. Configuration

## Definition

**Configuration** is controlled data that determines environment or capability behavior without requiring source changes.

Configuration may be:

```text
environment-specific

Platform-specific

Universe-specific
```

Configuration must be validated.

---

# 96. Runtime Configuration

## Definition

**Runtime Configuration** controls executable system behavior or environment integration.

Examples:

```text
database connection

provider credentials reference

feature settings
```

---

# 97. Product Configuration

## Definition

**Product Configuration** controls product behavior intended to vary independently of infrastructure.

Examples may include:

```text
Universe capability settings

presentation settings

policy settings
```

---

# 98. Feature Flag

## Definition

A **Feature Flag** is a temporary or operational switch controlling the availability of a feature.

Feature Flags may support:

```text
rollout

experimentation

emergency disablement
```

They should not replace long-term product configuration.

---

# 99. Provider

## Definition

A **Provider** is an implementation supplying a capability through an external service or replaceable backend.

Examples:

```text
Email Provider

Storage Provider

AI Provider

Search Provider
```

---

# 100. External Provider

## Definition

An **External Provider** is a third-party system used by AI World.

Examples:

```text
cloud object storage

email delivery service

AI model provider
```

External Providers do not own AI World domain concepts.

---

# 101. Adapter

## Definition

An **Adapter** translates between an AI World contract and an external or implementation-specific system.

Conceptually:

```text
AI World Contract
        ↓
Adapter
        ↓
Provider / Technology
```

---

# 102. Port

## Definition

A **Port** is an architectural contract representing a boundary where AI World depends on a capability that may have multiple implementations.

Use this term only where a ports-and-adapters boundary provides genuine value.

---

# 103. Driver

## Definition

A **Driver** is infrastructure-level software that communicates with a specific technology.

Examples may include:

```text
database driver

storage SDK
```

Do not confuse Driver with higher-level Adapter semantics.

---

# 104. Strategy

## Definition

A **Strategy** is a replaceable implementation of a defined behavioral algorithm or policy.

Example:

```text
RankingStrategy
```

Use Strategy when behavior, not provider connectivity, varies.

---

# 105. Registry

## Definition

A **Registry** is a controlled collection mapping identifiers or types to registered implementations or definitions.

Potential examples:

```text
Universe Registry

AI Provider Registry

Block Registry
```

Registries should be explicit and typed.

---

# 106. Plugin

## Definition

A **Plugin** is a separately installable or independently developed extension integrating through defined Platform contracts.

AI World does not initially assume a public Plugin ecosystem.

Use **Extension** rather than **Plugin** for internal first-party variability unless independent installation is actually supported.

---

# 107. Extension

## Definition

An **Extension** is controlled additional behavior integrated through an explicit extension contract.

Extensions may be first-party.

They do not imply package installation or public ecosystem support.

---

# 108. Extension Point

## Definition

An **Extension Point** is a deliberately exposed location where alternate or additional behavior may be registered.

Examples:

```text
AI Provider

Media Processor

Workflow Action

Composition Block
```

Extension Points should only exist where variation is expected.

---

# 109. Contract

## Definition

A **Contract** defines the stable expectations between two components or consumers.

A Contract may define:

```text
inputs

outputs

semantics

errors

compatibility

security assumptions
```

---

# 110. Public Contract

## Definition

A **Public Contract** is a Contract intentionally exposed outside an owning Capability's internal implementation.

Public does not necessarily mean internet-public.

It may mean:

```text
public to other modules

public to other Platforms

public to external API consumers
```

---

# 111. Internal Contract

## Definition

An **Internal Contract** is an interface used within an owning architectural boundary.

Internal Contracts may evolve more freely than Public Contracts.

---

# 112. API

## Definition

An **API** is an interface through which consumers interact with a Capability or application.

Possible forms include:

```text
HTTP API

library API

event API

tool API
```

REST is one API style, not the definition of API.

---

# 113. REST API

## Definition

A **REST API** is an HTTP-based resource-oriented API style.

AI World may use REST initially without defining the entire Platform as REST-only.

---

# 114. Endpoint

## Definition

An **Endpoint** is one externally addressable API operation or route.

Endpoints belong to API implementation.

Capabilities exist independently of any single Endpoint.

---

# 115. DTO

## Definition

A **DTO**, or **Data Transfer Object**, defines data transferred across a boundary.

Possible boundaries include:

```text
HTTP request

HTTP response

message

application service
```

DTOs should not automatically be identical to persistence models.

---

# 116. Schema

## Definition

A **Schema** formally defines the structure and validation expectations of data.

Schema may refer to:

```text
database schema

API schema

metadata schema

Universe schema

event schema
```

The context must be clear.

---

# 117. Persistence

## Definition

**Persistence** is the durable storage of state beyond a process lifetime.

Persistence may involve:

```text
database

object storage

specialized stores
```

---

# 118. Persistence Model

## Definition

A **Persistence Model** represents data as stored by a persistence technology.

It may differ from:

```text
Domain Model

API Model
```

---

# 119. Repository

## Definition

A **Repository** encapsulates persistence operations for a defined owning Domain or aggregate when such abstraction provides architectural value.

Repository responsibilities may include:

```text
queries

persistence mapping

data access
```

Repository should not absorb unrelated business logic.

---

# 120. Transaction

## Definition

A **Transaction** defines a consistency boundary within which a group of state changes succeeds or fails atomically where supported.

Transactions should align with business operations.

---

# 121. Unit of Work

## Definition

A **Unit of Work** coordinates multiple persistence changes within a transactional boundary.

AI World does not assume a custom Unit of Work abstraction unless technology and architecture require one.

---

# 122. Canonical Data

## Definition

**Canonical Data** is authoritative business data owned by AI World.

Examples may include:

```text
User profile

Entity

Asset metadata

Permission definitions
```

Canonical Data is the source from which derived systems may be reconstructed where appropriate.

---

# 123. Source of Truth

## Definition

The **Source of Truth** is the authoritative system or data representation for a concept.

Prefer:

```text
canonical owner
```

when referring to architectural ownership.

---

# 124. Derived Data

## Definition

**Derived Data** is data calculated, indexed, cached, projected, or generated from Canonical Data.

Examples:

```text
search index

cache entry

recommendation projection

analytics aggregate
```

Derived Data is not automatically authoritative.

---

# 125. Projection

## Definition

A **Projection** is a derived representation optimized for a particular read or analytical use case.

---

# 126. Cache

## Definition

A **Cache** temporarily stores data to improve performance or availability.

Cache should generally remain reconstructable.

Cache is not canonical persistence by default.

---

# 127. Search Index

## Definition

A **Search Index** is a derived representation optimized for discovery and search.

A Search Index does not own canonical Knowledge.

---

# 128. Asset

## Definition

An **Asset** is a Media Platform resource representing managed media or file-based content.

Potential types include:

```text
image

video

audio

document

generated media

3D asset
```

---

# 129. Media

## Definition

**Media** refers collectively to Asset-based visual, audio, video, document, or similar content managed through the Media Platform.

---

# 130. Storage

## Definition

**Storage** is the Foundation responsible for storing and retrieving binary or object data.

Storage answers:

```text
Where/how are bytes stored?
```

Media answers:

```text
What does this Asset mean and how is it processed?
```

These are separate concerns.

---

# 131. Media Variant

## Definition

A **Media Variant** is a transformed representation of an Asset.

Examples:

```text
thumbnail

optimized image

alternate format

video rendition
```

---

# 132. Media Processor

## Definition

A **Media Processor** performs a transformation or analysis operation on an Asset.

Examples:

```text
resize image

extract metadata

transcode video
```

---

# 133. Discovery

## Definition

**Discovery** is the broader capability through which users or systems find relevant Resources.

Discovery includes more than Search.

Potential components include:

```text
search

related resources

recommendations

collections

ranking

semantic discovery
```

---

# 134. Discovery Platform

## Definition

The **Discovery Platform** owns reusable capabilities for finding and ranking AI World Resources.

---

# 135. Search

## Definition

**Search** retrieves Resources matching a user or system query.

Search may use:

```text
text

filters

taxonomy

metadata

relationships

semantic similarity
```

depending on future implementation.

---

# 136. Ranking

## Definition

**Ranking** determines ordering or relevance among candidate Resources.

Ranking may use:

```text
text relevance

quality

recency

user context

business rules
```

---

# 137. Recommendation

## Definition

A **Recommendation** is a Resource or Experience suggested based on contextual signals rather than explicit direct lookup.

Recommendation is a Discovery capability.

---

# 138. AI

## Definition

**AI** refers to machine intelligence capabilities used by AI World for generation, reasoning, classification, retrieval enhancement, transformation, or automation.

AI is a Platform capability.

It is not AI World's sole identity.

---

# 139. AI / Creator Platform

## Definition

The **AI / Creator Platform** owns shared AI execution and AI-assisted creation capabilities.

Potential future responsibilities include:

```text
AI providers

models

routing

prompts

generation

AI tools

provenance

evaluation

safety

creator assistance
```

---

# 140. AI Provider

## Definition

An **AI Provider** supplies external or internal AI model execution.

Examples may include commercial or self-hosted model platforms.

Domain code should preferably depend on AI World AI capabilities rather than provider-specific SDKs.

---

# 141. Model

## Definition

A **Model** is a specific AI model used to perform AI tasks.

Examples may include:

```text
language model

image model

embedding model

speech model
```

Model identity is runtime/Platform configuration rather than domain architecture.

---

# 142. Model Capability

## Definition

A **Model Capability** describes something a Model can perform.

Examples:

```text
text generation

image generation

embedding

vision

speech synthesis
```

---

# 143. Model Routing

## Definition

**Model Routing** is the process of selecting an AI Model or Provider according to task requirements.

Potential inputs include:

```text
quality

cost

latency

modality

safety

availability
```

Model Routing is a future AI Platform capability.

---

# 144. Prompt

## Definition

A **Prompt** is structured input instructing or contextualizing an AI Model.

Prompts may include:

```text
system instructions

task instructions

user input

context

tool definitions
```

---

# 145. Prompt Template

## Definition

A **Prompt Template** is a reusable Prompt definition containing controlled variables or composition logic.

Prompt Templates may require:

```text
versioning

testing

ownership

provenance
```

as AI Platform maturity increases.

---

# 146. Generation

## Definition

A **Generation** is an AI execution that produces output.

Examples:

```text
text generation

image generation

metadata generation

summary generation
```

---

# 147. Generation Request

## Definition

A **Generation Request** represents a request submitted to the AI Platform to perform a Generation.

---

# 148. Generation Result

## Definition

A **Generation Result** represents the output and relevant execution metadata produced by a Generation.

---

# 149. AI Tool

## Definition

An **AI Tool** is a controlled capability an AI model or Agent may invoke.

Examples might include:

```text
SearchKnowledge

FetchEntity

GenerateImage
```

AI Tools must respect authorization and safety boundaries.

---

# 150. AI Agent

## Definition

An **AI Agent** is a Machine Actor capable of using AI reasoning to select and execute controlled tools toward an objective.

AI World does not initially assume unrestricted autonomous Agents.

---

# 151. Provenance

## Definition

**Provenance** describes where data, content, or generated output came from and how it was produced.

Potential provenance may include:

```text
source

creator

AI provider

model

prompt

generation workflow

review history
```

---

# 152. Source

## Definition

A **Source** is an origin used to support or derive Knowledge or Content.

Examples:

```text
book

official website

historical document

dataset

external API
```

Source semantics will vary by Universe.

---

# 153. Citation

## Definition

A **Citation** is a structured reference linking a statement, Content item, or Knowledge Resource to a supporting Source.

---

# 154. Verification

## Definition

**Verification** is a process determining whether Knowledge or Content satisfies defined evidence or quality rules.

Verification does not necessarily mean absolute truth.

---

# 155. Confidence

## Definition

**Confidence** represents an assessment of certainty or reliability.

Confidence may come from:

```text
source quality

AI estimation

editorial review

domain evidence
```

Use carefully.

Confidence is not equivalent to truth.

---

# 156. Evaluation

## Definition

**Evaluation** measures the performance or quality of a Capability.

In AI contexts, evaluation may assess:

```text
accuracy

quality

safety

latency

cost
```

---

# 157. Safety

## Definition

**Safety** refers to controls preventing harmful, unauthorized, insecure, or inappropriate behavior.

Safety may involve:

```text
AI safety

content safety

tool restrictions

abuse prevention

security policy
```

---

# 158. Moderation

## Definition

**Moderation** is the process of reviewing or controlling Content according to defined policies.

Moderation may be:

```text
human

automated

AI-assisted
```

---

# 159. Composition

## Definition

**Composition** is the process of assembling reusable Resources into user-facing Experiences or Pages.

Composition should prefer references to Canonical Resources over copying them.

---

# 160. Composition / CMS Platform

## Definition

The **Composition / CMS Platform** provides reusable capabilities for creating, managing, composing, previewing, and publishing structured Experiences and presentation.

Potential responsibilities include:

```text
pages

blocks

layouts

publishing

SEO

creator interfaces
```

---

# 161. CMS

## Definition

**CMS** means **Content Management System**.

Within AI World, CMS refers specifically to creator/admin capabilities for managing AI World structured Content and Experiences.

It does not mean an arbitrary generic website builder.

---

# 162. Page

## Definition

A **Page** is a presentation/composition resource representing a user-facing navigable surface.

A Page is not necessarily canonical Knowledge.

---

# 163. Block

## Definition

A **Block** is a composable presentation unit used within a Page or Experience.

Possible examples:

```text
Hero

Media Gallery

Timeline

Entity Grid

Related Resources
```

---

# 164. Layout

## Definition

A **Layout** describes structural presentation arrangement.

Layout should remain separate from canonical Knowledge semantics.

---

# 165. Publishing

## Definition

**Publishing** is the controlled transition by which Content or Experiences become available to an intended audience.

Publishing may involve:

```text
workflow

authorization

versioning

scheduling

visibility
```

---

# 166. Draft

## Definition

A **Draft** is a non-final version of Content or configuration that is not considered publicly published.

Draft semantics depend on the owning Capability.

---

# 167. Revision

## Definition

A **Revision** is a meaningful historical or editable version of a Resource.

Not every Resource requires Revision support.

---

# 168. Version

## Definition

A **Version** identifies a defined state of a contract, schema, resource, configuration, or software artifact.

Because Version is broad, context must be explicit.

Examples:

```text
API Version

Document Version

Schema Version

Resource Version
```

---

# 169. Versioning

## Definition

**Versioning** is the capability or strategy used to manage multiple versions over time.

Versioning is distinct from Audit.

---

# 170. Localization

## Definition

**Localization** adapts AI World content or experiences for a particular language, locale, region, or cultural context.

Localization may involve:

```text
translation

formatting

media

taxonomy labels

AI output

regional content
```

---

# 171. Internationalization

## Definition

**Internationalization**, often abbreviated **i18n**, is the architectural preparation enabling Localization.

---

# 172. Locale

## Definition

A **Locale** identifies a language/regional convention context.

Examples:

```text
en-IN

en-US

ja-JP
```

Locale is not a Universe.

---

# 173. Region

## Definition

A **Region** represents a geographic or operational area relevant to product or infrastructure behavior.

Context must clarify whether Region means:

```text
content geography

market region

deployment region
```

---

# 174. Engagement

## Definition

**Engagement** refers to user-facing interaction capabilities that persist or personalize user relationships with AI World.

Potential examples:

```text
favorites

history

progress

collections

notifications

achievements

personalization
```

---

# 175. Engagement Platform

## Definition

The **Engagement Platform** owns reusable user-interaction state and engagement capabilities shared across Universes.

---

# 176. Favorite

## Definition

A **Favorite** is a user-selected Resource intentionally saved as favored.

Favorite is one possible Engagement concept.

---

# 177. History

## Definition

When used in Engagement context, **History** means a record of a User's relevant past interactions.

When capitalized as:

```text
History Universe
```

it means the History domain world.

Context must distinguish these meanings.

---

# 178. Progress

## Definition

**Progress** represents a User's advancement through an Experience, Journey, learning path, or similar structured process.

---

# 179. Personalization

## Definition

**Personalization** adapts content or experiences based on User context, preferences, or behavior.

Personalization must remain privacy-aware.

---

# 180. Notification

## Definition

A **Notification** is a message delivered to an Actor regarding relevant Platform activity.

Possible channels may include:

```text
email

push

in-app

SMS
```

Channel infrastructure should remain reusable.

---

# 181. Notification Preference

## Definition

A **Notification Preference** represents a User's configured preference regarding categories or channels of notifications.

---

# 182. Operations

## Definition

**Operations** refers to the capabilities and processes required to run AI World reliably in deployed environments.

Operations includes concerns such as:

```text
deployment

monitoring

incident response

backup

scaling

cost visibility
```

---

# 183. Operations Platform

## Definition

The **Operations Platform** represents reusable product/administrative operational capabilities exposed within AI World.

It is distinct from lower-level DevOps infrastructure, although the two interact.

---

# 184. Observability

## Definition

**Observability** is the ability to understand system behavior from emitted operational signals.

Primary signals include:

```text
logs

metrics

traces
```

---

# 185. Logging

## Definition

**Logging** records operational or diagnostic events generated by software.

Logs are not equivalent to Audit Records.

---

# 186. Log

## Definition

A **Log** is one operational diagnostic record.

Logs should avoid unnecessary sensitive information.

---

# 187. Metric

## Definition

A **Metric** is a numerical measurement tracked over time.

Examples:

```text
request latency

error rate

queue depth

AI usage
```

---

# 188. Trace

## Definition

A **Trace** represents the execution path of work across one or more system components.

Tracing becomes increasingly useful as runtime distribution increases.

---

# 189. Correlation ID

## Definition

A **Correlation ID** is an identifier used to connect related operations or records across a logical flow.

---

# 190. Request ID

## Definition

A **Request ID** identifies one inbound request.

A Request ID and Correlation ID may be equal in simple flows but represent conceptually different concerns.

---

# 191. Audit

## Definition

**Audit** is the durable recording of significant actions or state changes for accountability.

Audit may answer:

```text
who

did what

to which Resource

when

in what context
```

---

# 192. Audit Record

## Definition

An **Audit Record** is one durable record produced by the Audit capability.

Audit Records should be treated differently from ordinary Logs.

---

# 193. Health Check

## Definition

A **Health Check** reports whether a system or dependency is operating appropriately.

Health may include several different semantics.

---

# 194. Liveness

## Definition

**Liveness** answers:

```text
Is this process/application alive?
```

---

# 195. Readiness

## Definition

**Readiness** answers:

```text
Is this process/application ready to serve intended work?
```

A system may be live but not ready.

---

# 196. Availability

## Definition

**Availability** measures whether a service or capability is accessible and functioning when required.

---

# 197. Reliability

## Definition

**Reliability** is the ability of a system to perform correctly and predictably over time, including under failure conditions.

---

# 198. Resilience

## Definition

**Resilience** is the ability to continue functioning or recover when dependencies or components fail.

---

# 199. Idempotency

## Definition

**Idempotency** means repeating an operation produces no unintended additional effect beyond the intended final state.

This is important for:

```text
retries

webhooks

jobs

events

external callbacks
```

---

# 200. Retry

## Definition

A **Retry** is another attempt to execute an operation following a failure believed to be transient.

Retries must not be applied indiscriminately.

---

# 201. Timeout

## Definition

A **Timeout** defines the maximum allowed waiting period for an operation before it is treated as failed or incomplete.

---

# 202. Dead Letter

## Definition

A **Dead Letter** is a message or Job that cannot be processed successfully after defined handling attempts and is isolated for inspection or recovery.

Use only when queue infrastructure requires this concept.

---

# 203. Backpressure

## Definition

**Backpressure** is the control of workload when producers generate work faster than consumers can safely process it.

This becomes relevant to queues, streaming, media processing, and AI workloads.

---

# 204. Scalability

## Definition

**Scalability** is the ability of AI World to handle increased workload through appropriate resource or architectural growth.

Scalability is not synonymous with microservices.

---

# 205. Horizontal Scaling

## Definition

**Horizontal Scaling** increases capacity by adding more runtime instances.

---

# 206. Vertical Scaling

## Definition

**Vertical Scaling** increases capacity by giving existing runtime instances more resources.

---

# 207. Deployment Unit

## Definition

A **Deployment Unit** is an independently deployed software artifact or runtime.

Examples might eventually include:

```text
API

worker

web application
```

A Module is not automatically a Deployment Unit.

---

# 208. Service

## Definition

**Service** is an overloaded term.

Use one of the following more precise meanings where possible:

```text
Application Service

Domain Service

External Service

Deployable Service
```

Avoid using Service when ownership is unclear.

---

# 209. Application Service

## Definition

An **Application Service** coordinates a business use case using Domain capabilities and infrastructure.

It may define:

```text
transaction boundary

authorization coordination

workflow orchestration
```

depending on architecture.

---

# 210. Domain Service

## Definition

A **Domain Service** contains Domain behavior that does not naturally belong to a single Entity or Value Object.

Use only when meaningful Domain behavior exists.

---

# 211. External Service

## Definition

An **External Service** is a system outside AI World's ownership that AI World integrates with.

---

# 212. Microservice

## Definition

A **Microservice** is an independently deployed service with explicit boundaries and operational independence.

AI World does not use Microservice as a synonym for Module.

---

# 213. Modular Monolith

## Definition

A **Modular Monolith** is an application deployed largely as one runtime while preserving strong internal Module and Capability boundaries.

It may provide future extraction paths without requiring premature distribution.

---

# 214. Monorepo

## Definition

A **Monorepo** is a source-control repository containing multiple applications, packages, and project areas managed together.

Monorepo is a repository strategy.

It does not imply shared ownership of all code.

---

# 215. Application

## Definition

An **Application** is an executable user-facing or system-facing product/runtime built on AI World capabilities.

Possible examples:

```text
public web

admin web

API

worker
```

---

# 216. Client

## Definition

A **Client** is a consumer interacting with AI World through public contracts.

Potential Clients include:

```text
web

mobile

admin

AI agent

external partner
```

---

# 217. Backend

## Definition

The **Backend** contains server-side application and Platform capabilities.

Backend is an implementation grouping.

It is not itself a Domain boundary.

---

# 218. Frontend

## Definition

A **Frontend** is a user-facing application consuming AI World contracts.

Frontend presentation should not become the sole owner of Domain rules.

---

# 219. Admin Application

## Definition

An **Admin Application** is a trusted user-facing Client used to manage AI World capabilities.

Admin does not bypass:

```text
authorization

validation

audit

ownership
```

---

# 220. Creator

## Definition

A **Creator** is a Human Actor who produces or manages AI World content, Experiences, media, or Universe configuration.

Creator may be represented through Roles and Permissions rather than a separate identity type.

---

# 221. Editor

## Definition

An **Editor** is a Human Actor authorized to modify or review Content.

Specific permissions depend on Platform and Universe policy.

---

# 222. Reviewer

## Definition

A **Reviewer** is an Actor authorized to evaluate Content or changes within a defined Workflow.

---

# 223. Administrator

## Definition

An **Administrator** is an Actor with elevated management permissions.

Administration may be:

```text
Platform-wide

Universe-scoped

Capability-scoped
```

Administrator is not equivalent to unrestricted access.

---

# 224. Tenant

## Definition

A **Tenant** is an isolated customer, organization, or account boundary in a multi-tenant system.

AI World does not currently define Universe as Tenant.

Multi-tenancy is not yet an initial implementation requirement.

---

# 225. Organization

## Definition

An **Organization** is a potential future business/group identity containing Users or resources.

Organization architecture is not yet defined.

Do not use Organization and Universe interchangeably.

---

# 226. Workspace

## Definition

A **Workspace** is a potential collaborative context for users or teams.

Workspace architecture is not yet defined.

Do not use Workspace and Universe interchangeably.

---

# 227. Environment

## Definition

An **Environment** is a separately configured execution context.

Expected future environments may include:

```text
local

test

development

staging

production
```

---

# 228. Local Environment

## Definition

The **Local Environment** is a developer-controlled runtime used for local development.

---

# 229. Test Environment

## Definition

A **Test Environment** is a runtime or isolated setup intended for automated or manual validation.

---

# 230. Production

## Definition

**Production** is the live environment serving real users or operational workloads.

Production requires stronger security and operational guarantees.

---

# 231. Development Environment

## Definition

A **Development Environment** is a shared or controlled non-production environment used for active development and integration.

---

# 232. Staging

## Definition

**Staging** is a non-production environment intended to approximate production behavior for validation before release.

---

# 233. Release

## Definition

A **Release** is a defined deployable version of AI World software or a significant subset of it.

---

# 234. Deployment

## Definition

A **Deployment** is the act of making a Release operational in an Environment.

---

# 235. CI

## Definition

**CI**, or **Continuous Integration**, is automated validation of changes through checks such as:

```text
formatting

linting

type checking

tests

build
```

---

# 236. CD

## Definition

**CD** may mean:

```text
Continuous Delivery
```

or:

```text
Continuous Deployment
```

Future Operations documentation must specify which meaning is intended.

---

# 237. Quality Gate

## Definition

A **Quality Gate** is a required validation that must pass before work progresses to a defined lifecycle stage.

Examples:

```text
lint

tests

security checks

build
```

---

# 238. Definition of Done

## Definition

The **Definition of Done** defines the criteria required before work may be considered complete for a given class of Capability or change.

AI World maintains a canonical governance document for this concept.

---

# 239. Architecture Decision Record

## Definition

An **Architecture Decision Record**, or **ADR**, records a significant architectural decision, its context, reasoning, and consequences.

Canonical location:

```text
docs/14-decisions/adr/
```

---

# 240. ADR

**ADR** is the canonical abbreviation for **Architecture Decision Record**.

---

# 241. Specification

## Definition

A **Specification** defines what a Capability or Module must do, what it owns, and the requirements it must satisfy.

Specification answers primarily:

```text
WHAT?
```

Architecture answers primarily:

```text
HOW IS IT STRUCTURED?
```

---

# 242. Architecture

## Definition

**Architecture** defines the structural organization, boundaries, dependencies, ownership, and major design decisions of a system or Capability.

---

# 243. Design

## Definition

**Design** describes a solution structure at a level more detailed than broad Architecture.

Design may include:

```text
models

interfaces

flows

algorithms
```

---

# 244. Implementation

## Definition

**Implementation** is the concrete source code and infrastructure realizing an accepted design.

---

# 245. Integration

## Definition

**Integration** connects independently owned Capabilities through their supported Contracts.

---

# 246. Validation

## Definition

**Validation** has two common meanings.

### Data Validation

Ensuring input/data satisfies structural and Domain rules.

### Capability Validation

Confirming an implemented Capability satisfies its specification, architecture, tests, and operational expectations.

Context must make the meaning clear.

---

# 247. Verification vs Validation

Preferred distinction:

```text
Verification
    Did we build it according to the defined specification?

Validation
    Does the resulting capability actually satisfy the intended requirement?
```

Some project documents may use these terms more broadly.

---

# 248. Closure

## Definition

**Closure** is the formal completion state reached after a major Capability satisfies its defined completion criteria and receives a closure review where required.

---

# 249. Closure Review

## Definition

A **Closure Review** evaluates whether a major Capability is ready to be marked:

```text
CLOSED
```

It should consider:

```text
architecture

implementation

tests

security

operations

documentation

known debt
```

as applicable.

---

# 250. Technical Debt

## Definition

**Technical Debt** is a known engineering compromise that increases future cost, risk, or complexity.

Technical Debt should be visible when significant.

---

# 251. Architecture Debt

## Definition

**Architecture Debt** is Technical Debt specifically involving:

```text
ownership

boundaries

coupling

contracts

structural inconsistency
```

---

# 252. Product Debt

## Definition

**Product Debt** is an intentional limitation or incomplete product behavior requiring future improvement.

Product Debt is not necessarily Technical Debt.

---

# 253. Deprecation

## Definition

**Deprecation** marks a Capability or Contract as supported temporarily but scheduled for replacement or removal.

---

# 254. Backward Compatibility

## Definition

**Backward Compatibility** means existing consumers continue working after a change within the defined compatibility contract.

---

# 255. Breaking Change

## Definition

A **Breaking Change** changes a Contract in a way that requires existing consumers, persisted data, or integrations to adapt.

---

# 256. Compatibility Window

## Definition

A **Compatibility Window** is the period during which older and newer Contracts or behaviors remain supported simultaneously.

---

# 257. Semantic Versioning

## Definition

**Semantic Versioning** is a version numbering convention such as:

```text
MAJOR.MINOR.PATCH
```

AI World may use it where appropriate.

Its exact application to packages, APIs, and documents will be defined separately.

---

# 258. Public

## Definition

Within architecture documentation, **Public** means intentionally exposed outside an owning boundary.

It does not necessarily mean accessible without authentication or exposed to the public internet.

---

# 259. Private

## Definition

**Private** means accessible only inside the owning implementation boundary or to explicitly authorized contexts.

---

# 260. Internal

## Definition

**Internal** means implementation-level behavior not intended as a stable consumer-facing contract.

---

# 261. Shared

## Definition

**Shared** means intentionally reusable across more than one owning consumer.

Shared does not mean:

```text
unowned

globally mutable

importable from anywhere
```

---

# 262. Common

## Definition

**Common** is an ambiguous term and should generally be avoided in architecture names unless the responsibility is explicit.

Prefer names such as:

```text
contracts

logging

pagination

testing
```

instead of:

```text
common
```

where possible.

---

# 263. Utility

## Definition

A **Utility** is a small stateless helper performing a focused reusable operation.

Utilities should not accumulate Domain ownership or business orchestration.

---

# 264. Helper

## Definition

**Helper** is an ambiguous implementation term.

Use a more precise name whenever possible.

Examples:

```text
Parser

Normalizer

Mapper

Validator

Formatter
```

---

# 265. Manager

## Definition

**Manager** is generally discouraged because it rarely communicates precise ownership.

Prefer a specific architectural role.

---

# 266. Service Account

## Definition

A **Service Account** is a Machine Actor identity used by software or automation to authenticate and act within defined permissions.

---

# 267. Agent

## Definition

**Agent** is context-dependent.

Within AI architecture, use:

```text
AI Agent
```

for AI-driven autonomous/semi-autonomous Machine Actors.

Avoid using Agent as a generic synonym for service or worker.

---

# 268. Tool

## Definition

A **Tool** is an explicitly invokable Capability exposed to an Actor, AI Agent, developer, or operational process.

Context should clarify whether Tool means:

```text
AI Tool

CLI Tool

Developer Tool
```

---

# 269. CLI

## Definition

**CLI**, or **Command-Line Interface**, is a text-based interface used to invoke project or operational commands.

Examples may include:

```text
migration

seed

validation

development tooling
```

---

# 270. SDK

## Definition

An **SDK**, or **Software Development Kit**, is a client library or toolset provided for integration.

External SDK objects should generally remain behind adapters when they represent provider-specific implementation details.

---

# 271. Library

## Definition

A **Library** is reusable code consumed by applications or other packages.

A Library does not automatically represent an architectural Capability.

---

# 272. Package

## Definition

A **Package** is a versionable source-code unit in the repository/package manager ecosystem.

A Package should have a coherent purpose.

---

# 273. Workspace

Within repository tooling context, **Workspace** may also mean a package-manager workspace.

Because Workspace may also someday mean a product collaboration concept, context must make the meaning explicit.

Prefer:

```text
pnpm workspace
```

when discussing repository tooling.

---

# 274. Monolith

## Definition

A **Monolith** is an application deployed as a single primary unit.

The term does not imply poor architecture.

A Modular Monolith may preserve strong internal boundaries.

---

# 275. Distributed System

## Definition

A **Distributed System** is a system where functionality or state is coordinated across multiple independent networked processes or services.

Distributed architecture introduces additional failure modes and consistency concerns.

---

# 276. Synchronous

## Definition

A **Synchronous** interaction requires the caller to wait for the operation or result within the active interaction.

---

# 277. Asynchronous

## Definition

An **Asynchronous** interaction allows execution or reaction to occur independently from the initiating request lifecycle.

---

# 278. Eventual Consistency

## Definition

**Eventual Consistency** means different system representations may temporarily differ but are expected to converge.

Use only where business invariants permit it.

---

# 279. Strong Consistency

## Definition

**Strong Consistency** means operations observe a sufficiently current and coordinated state according to the defined consistency boundary.

---

# 280. Outbox

## Definition

A **Transactional Outbox** is a reliability pattern where outgoing messages are recorded atomically with database state and delivered asynchronously afterward.

This is a potential future pattern, not a mandatory architecture.

---

# 281. Saga

## Definition

A **Saga** is a coordination pattern for multi-step operations spanning independent transactional boundaries.

Saga is not an initial default pattern.

---

# 282. Reconciliation

## Definition

**Reconciliation** detects and repairs divergence between expected and actual state across systems.

It may be needed for external integrations or eventual-consistency workflows.

---

# 283. Contract Test

## Definition

A **Contract Test** verifies that a consumer/provider boundary satisfies its agreed Contract.

---

# 284. Unit Test

## Definition

A **Unit Test** validates isolated behavior with minimal external integration.

---

# 285. Integration Test

## Definition

An **Integration Test** validates interaction between real components such as:

```text
application + database

service + adapter
```

---

# 286. End-to-End Test

## Definition

An **End-to-End Test**, or **E2E Test**, validates a meaningful user/system flow across major runtime boundaries.

---

# 287. Security Test

## Definition

A **Security Test** validates security properties such as:

```text
authorization

session behavior

input handling

isolation
```

---

# 288. Performance Test

## Definition

A **Performance Test** measures behavior under workload.

Examples:

```text
latency

throughput

resource consumption
```

---

# 289. Load Test

## Definition

A **Load Test** measures system behavior under expected or elevated concurrent workload.

---

# 290. Stress Test

## Definition

A **Stress Test** intentionally exceeds normal capacity to understand failure and recovery characteristics.

---

# 291. Smoke Test

## Definition

A **Smoke Test** performs a small set of checks confirming that major system functionality starts and operates at a basic level.

---

# 292. Fixture

## Definition

A **Fixture** is controlled data used for testing.

Fixtures are not production Seed data by default.

---

# 293. Fake

## Definition

A **Fake** is a simplified functional implementation used for testing or development.

Example:

```text
DevelopmentEmailProvider
```

may eventually be a fake provider implementation.

---

# 294. Mock

## Definition

A **Mock** is a test substitute used to verify or control interactions.

Mocks should not replace meaningful integration testing.

---

# 295. Stub

## Definition

A **Stub** is a test substitute that returns controlled responses.

---

# 296. Boundary

## Definition

A **Boundary** is a deliberate separation between areas of ownership, implementation, security, or integration.

Good architecture makes important boundaries explicit.

---

# 297. Architectural Boundary

## Definition

An **Architectural Boundary** separates Capabilities or layers according to ownership and dependency rules.

---

# 298. Security Boundary

## Definition

A **Security Boundary** is a trusted enforcement point controlling access, validation, or privilege.

Frontend visibility controls are not trusted Security Boundaries.

---

# 299. Trust Boundary

## Definition

A **Trust Boundary** is a point where data or execution crosses between contexts with different trust assumptions.

Examples:

```text
browser → API

AI World → external AI provider

external webhook → AI World
```

---

# 300. Data Boundary

## Definition

A **Data Boundary** defines who owns, reads, writes, or exposes a particular category of data.

---

# 301. Bounded Context

## Definition

A **Bounded Context** is a conceptual Domain boundary within which terms and models have consistent meaning.

AI World may use Bounded Context thinking where it improves ownership clarity.

The project does not require strict DDD ceremony everywhere.

---

# 302. Aggregate

## Definition

An **Aggregate** is a consistency boundary around related Domain objects whose invariants are enforced together.

Use Aggregate terminology only where such modeling is useful.

---

# 303. Value Object

## Definition

A **Value Object** represents a meaningful value defined by its attributes rather than identity.

Examples might include:

```text
EmailAddress

DateRange
```

where domain modeling benefits from them.

---

# 304. Factory

## Definition

A **Factory** encapsulates complex object creation when creation itself has meaningful rules.

Factories should not be created for trivial constructor calls.

---

# 305. Mapper

## Definition

A **Mapper** transforms data between representations.

Examples:

```text
Persistence Model → Domain Model

Domain Model → API DTO
```

---

# 306. Parser

## Definition

A **Parser** converts encoded or structured input into an internal representation.

---

# 307. Normalizer

## Definition

A **Normalizer** converts equivalent input forms into a consistent canonical representation.

Example:

```text
email normalization
```

---

# 308. Validator

## Definition

A **Validator** checks whether input or state satisfies defined rules.

Validators should not silently mutate data unless the contract explicitly defines normalization behavior.

---

# 309. Serializer

## Definition

A **Serializer** converts internal data into a representation suitable for storage or transport.

---

# 310. Deserializer

## Definition

A **Deserializer** converts stored or transported representation into an internal structure.

---

# 311. Error

## Definition

An **Error** represents an unsuccessful condition.

Errors should distinguish meaningful categories such as:

```text
validation

authorization

not found

conflict

infrastructure

unexpected failure
```

according to future error-contract standards.

---

# 312. Domain Error

## Definition

A **Domain Error** represents violation of a Domain rule or invariant.

---

# 313. Infrastructure Error

## Definition

An **Infrastructure Error** originates from technical infrastructure such as:

```text
database

storage

network

provider
```

Infrastructure Errors may need translation before reaching higher-level consumers.

---

# 314. Validation Error

## Definition

A **Validation Error** indicates data fails defined structural or business validation rules.

---

# 315. Conflict

## Definition

A **Conflict** indicates an operation cannot proceed because it conflicts with current state.

Examples:

```text
duplicate key

invalid state transition

concurrent update
```

---

# 316. Not Found

## Definition

**Not Found** indicates a requested Resource cannot be located within the applicable scope.

Security-sensitive APIs may intentionally avoid revealing certain existence information.

---

# 317. Error Code

## Definition

An **Error Code** is a stable machine-readable identifier representing an error category.

Error Codes should not expose internal implementation unnecessarily.

---

# 318. Retryable Error

## Definition

A **Retryable Error** is an Error believed to represent a transient condition where another attempt may reasonably succeed.

---

# 319. Deterministic Error

## Definition

A **Deterministic Error** will continue to occur for the same input/state until the underlying condition changes.

Examples:

```text
validation failure

permission denial
```

These should generally not be blindly retried.

---

# 320. Input

## Definition

**Input** is data supplied to a Capability or boundary.

External Input should be considered untrusted until validated.

---

# 321. Output

## Definition

**Output** is data returned or emitted by a Capability.

Outputs may require filtering or transformation before exposure.

---

# 322. Contract Boundary

## Definition

A **Contract Boundary** is a location where data or behavior crosses between independently evolving architectural areas.

Contracts should be strongest at these boundaries.

---

# 323. Public API Model

## Definition

A **Public API Model** is the data representation exposed through an externally or cross-capability supported API.

It should not be automatically generated directly from persistence models.

---

# 324. Internal Model

## Definition

An **Internal Model** is a representation used only within an owning implementation boundary.

Internal Models may change more freely.

---

# 325. Canonical Model

## Definition

A **Canonical Model** is the authoritative semantic representation used by the owning Capability for a concept.

Canonical Model does not necessarily mean one exact class.

It refers to the owning semantic definition.

---

# 326. Abstraction

## Definition

An **Abstraction** hides implementation detail behind a meaningful concept or Contract.

An Abstraction must protect a real boundary or simplify reasoning.

---

# 327. Indirection

## Definition

**Indirection** introduces an intermediate layer between a consumer and implementation.

Indirection should have architectural value.

More indirection does not automatically mean better design.

---

# 328. Coupling

## Definition

**Coupling** is the degree to which one component depends on another.

AI World seeks:

```text
controlled coupling
```

not:

```text
zero coupling.
```

---

# 329. Cohesion

## Definition

**Cohesion** describes how strongly related the responsibilities inside a Capability or Module are.

High cohesion is generally desirable.

---

# 330. Encapsulation

## Definition

**Encapsulation** hides internal implementation behind deliberate public boundaries.

Encapsulation enables safer evolution.

---

# 331. Dependency

## Definition

A **Dependency** exists when one architectural component requires another to function.

Dependencies may be:

```text
compile-time

runtime

data

operational
```

Architecture documents should focus on meaningful architectural dependencies.

---

# 332. Dependency Direction

## Definition

**Dependency Direction** describes which layer or Capability is allowed to depend on which other area.

The preferred high-level direction is:

```text
Universe
    ↓
Platforms
    ↓
Platform Kernel
    ↓
Foundations
```

subject to deliberately defined exceptions.

---

# 333. Circular Dependency

## Definition

A **Circular Dependency** occurs when components depend on each other in a cycle.

Architectural circular dependencies are generally considered a warning and should be resolved where practical.

---

# 334. Public Surface

## Definition

A **Public Surface** is the complete set of Contracts intentionally exposed by a Capability.

Keep public surfaces smaller than internal implementation where practical.

---

# 335. Internal Surface

## Definition

The **Internal Surface** consists of implementation details not intended for external dependency.

---

# 336. Stability

## Definition

**Stability** describes how strongly a concept or Contract is expected to resist breaking change.

Examples:

```text
Platform Kernel contracts
    high stability expectation

experimental internal implementation
    lower stability expectation
```

---

# 337. Experimental

## Definition

**Experimental** describes functionality whose Contract may change rapidly and is not yet considered stable.

Experimental status must be explicit.

---

# 338. Stable

## Definition

**Stable** describes functionality considered suitable for normal supported use under defined compatibility expectations.

---

# 339. Deprecated

## Definition

**Deprecated** means supported temporarily but discouraged for new use and scheduled for replacement/removal.

---

# 340. Closed

## Definition

**CLOSED** is the lifecycle state indicating a major Capability has satisfied its defined completion criteria for its current scope.

Closed does not mean:

```text
never changes again.
```

It means:

```text
the current scope is deliberately complete.
```

---

# 341. Implemented

## Definition

**IMPLEMENTED** means working implementation exists.

It does not automatically mean:

```text
tested

validated

production-ready

closed
```

---

# 342. Validated

## Definition

**VALIDATED** means an implementation has been evaluated against its defined requirements and quality criteria.

---

# 343. Accepted

## Definition

**ACCEPTED** means a proposal, architecture, or document has been approved as the current intended direction.

Accepted design does not mean implemented capability.

---

# 344. Proposed

## Definition

**PROPOSED** means a design or decision is ready for review but is not yet authoritative.

---

# 345. Draft

When used as a documentation status:

```text
DRAFT
```

means content is actively being developed and is not yet authoritative.

When used as a content lifecycle State:

```text
Draft Content
```

it means unpublished content.

Context must distinguish these meanings.

---

# 346. Planned

## Definition

**PLANNED** means a Capability or work item is intentionally scheduled or expected but implementation has not yet begun.

---

# 347. In Progress

## Definition

**IN PROGRESS** means active implementation or delivery work is underway.

---

# 348. Deferred

## Definition

**DEFERRED** means deliberately postponed while remaining potentially relevant.

---

# 349. Superseded

## Definition

**SUPERSEDED** means replaced by a newer authoritative decision, document, or Contract.

Older historical artifacts may remain for traceability.

---

# 350. Legacy

## Definition

**Legacy** refers to an older implementation or architecture retained for historical/reference purposes but not considered the authority for current greenfield AI World design.

The previous AI World implementation is:

```text
Legacy Reference
```

---

# 351. Greenfield

## Definition

**Greenfield** describes development beginning without compatibility obligations to an existing implementation.

The current AI World repository is a greenfield implementation.

Greenfield does not mean previous lessons are ignored.

---

# 352. Proof of Concept

## Definition

A **Proof of Concept**, or **PoC**, is a temporary implementation intended to validate feasibility.

A PoC is not automatically production architecture.

---

# 353. Prototype

## Definition

A **Prototype** demonstrates interaction, behavior, or design but may not meet production engineering requirements.

---

# 354. MVP

## Definition

**MVP** means **Minimum Viable Product**.

For AI World, MVP means the smallest coherent product/platform slice that proves meaningful value and architecture.

MVP does not mean:

```text
low quality

no tests

unsafe implementation
```

---

# 355. Alpha

## Definition

**Alpha** describes an early working product stage with limited maturity and potentially changing Contracts.

---

# 356. Beta

## Definition

**Beta** describes a product stage suitable for broader validation while some functionality or operational maturity may still evolve.

---

# 357. Production-Ready

## Definition

**Production-Ready** means a Capability is suitable for deployment to real users under its defined operational scope.

Production readiness may require:

```text
security

tests

observability

failure handling

documentation

operational procedures
```

---

# 358. Feature-Complete

## Definition

**Feature-Complete** means all features defined for a specific release or scope have been implemented.

Feature-complete does not mean permanently complete.

---

# 359. Universe-Neutral

## Definition

**Universe-Neutral** means a shared Capability contains no assumptions tied unnecessarily to one specific Universe.

---

# 360. Domain-Specific

## Definition

**Domain-Specific** means behavior or semantics intentionally belong to one Domain or Universe.

Domain-specific does not mean architecturally bad.

Correct Domain-specific behavior should remain at the correct boundary.

---

# 361. Generic

## Definition

**Generic** means reusable across multiple contexts through common semantics.

Generic does not mean:

```text
untyped

dynamic everything

lowest-common-denominator
```

---

# 362. Reusable

## Definition

**Reusable** means intentionally designed to serve multiple legitimate consumers without duplication.

---

# 363. Configurable

## Definition

**Configurable** means behavior may be varied through validated declarative data without modifying implementation code.

---

# 364. Extensible

## Definition

**Extensible** means new behavior or definitions may be added through controlled mechanisms without arbitrary core modification.

---

# 365. Portable

## Definition

**Portable** means data or capability can be moved across implementations/providers with reasonable effort because canonical semantics remain under AI World control.

Portable does not mean zero migration cost.

---

# 366. Vendor Lock-In

## Definition

**Vendor Lock-In** occurs when a provider becomes so deeply embedded in canonical concepts or data that replacement becomes disproportionately difficult.

Some provider-specific usage is acceptable.

Unnecessary lock-in should be avoided.

---

# 367. Technology Strategy

## Definition

The **Technology Strategy** defines which concrete technologies AI World initially selects and why.

It is separate from Platform identity.

Canonical document:

```text
docs/02-architecture/technology-strategy.md
```

---

# 368. Repository Architecture

## Definition

**Repository Architecture** defines how source code, applications, packages, tooling, and documentation are organized to reflect architectural ownership.

Canonical document:

```text
docs/02-architecture/repository-architecture.md
```

---

# 369. System Context

## Definition

The **System Context** describes AI World's position relative to:

```text
users

administrators

external providers

external consumers

systems
```

without focusing on internal implementation detail.

---

# 370. Platform Architecture

## Definition

**Platform Architecture** describes the major internal structural organization of AI World:

```text
layers

Platforms

Kernel

Foundations

Universes

dependency relationships
```

---

# 371. Platform Layer

## Definition

A **Platform Layer** groups capabilities with similar architectural responsibility and dependency position.

Layers provide conceptual structure.

They do not automatically correspond to deployment boundaries.

---

# 372. Capability Map

## Definition

The **Capability Map** catalogs the major capabilities AI World expects to provide and identifies their architectural classification and relationships.

---

# 373. Ownership Model

## Definition

The **Ownership Model** defines which Capability owns:

```text
concepts

data

contracts

business rules
```

across AI World.

---

# 374. Dependency Rule

## Definition

A **Dependency Rule** defines whether one architectural area may depend on another and through what type of boundary.

---

# 375. Extension Model

## Definition

The **Extension Model** defines how AI World supports controlled variation through:

```text
configuration

registries

adapters

strategies

extensions
```

without uncontrolled core changes.

---

# 376. Roadmap

## Definition

A **Roadmap** describes delivery direction, sequence, and status.

Roadmaps do not redefine architectural ownership.

---

# 377. Master Roadmap

## Definition

The **Master Roadmap** is the canonical high-level implementation sequence for AI World.

Other roadmap documents provide specialized views.

---

# 378. Milestone

## Definition

A **Milestone** is a meaningful project checkpoint representing completion of a defined collection of outcomes.

---

# 379. Phase

## Definition

A **Phase** is a broad delivery period focused on a major architectural or product objective.

Current Phase:

```text
Phase 0 — Architecture Foundation
```

---

# 380. Sprint

## Definition

A **Sprint** is a time-boxed or scope-boxed execution period.

AI World architecture does not require a particular agile methodology.

Use Sprint only if the project actively adopts sprint-based planning.

---

# 381. Backlog

## Definition

A **Backlog** is a prioritized collection of potential work not yet committed to immediate execution.

---

# 382. Requirement

## Definition

A **Requirement** states something a Capability or product must satisfy.

Requirements may be:

```text
functional

security

operational

performance

compatibility
```

---

# 383. Functional Requirement

## Definition

A **Functional Requirement** describes behavior the system must provide.

---

# 384. Non-Functional Requirement

## Definition

A **Non-Functional Requirement** describes a quality or constraint such as:

```text
security

performance

availability

maintainability
```

---

# 385. Constraint

## Definition

A **Constraint** is a limitation or condition architecture must respect.

Examples:

```text
budget

technology

legal requirement

timeline

compatibility
```

---

# 386. Assumption

## Definition

An **Assumption** is a condition currently believed to be true but not yet fully validated.

Important architectural assumptions should be documented.

---

# 387. Decision

## Definition

A **Decision** is an intentionally selected architectural, product, or implementation direction.

Significant architectural Decisions may require ADRs.

---

# 388. Tradeoff

## Definition

A **Tradeoff** is a conscious acceptance that improving one system quality may reduce another.

Examples:

```text
simplicity vs flexibility

consistency vs scalability

portability vs provider capability
```

Tradeoffs should be explicit.

---

# 389. Invariant

## Definition

An **Invariant** is a condition that must remain true.

Invariants may be:

```text
Domain

security

architectural

data
```

---

# 390. Architectural Invariant

## Definition

An **Architectural Invariant** is a rule that should remain true across implementation changes.

Example:

```text
Foundations must not depend on Universe-specific code.
```

---

# 391. Reference Implementation

## Definition

A **Reference Implementation** is an implementation used as an example or learning source.

It does not automatically define the canonical architecture.

The previous AI World project may serve as a Legacy Reference Implementation.

---

# 392. Canonical

## Definition

**Canonical** means the authoritative form, source, or definition recognized by AI World.

Use this term carefully.

Examples:

```text
Canonical Data

Canonical Identifier

Canonical Document
```

---

# 393. Authoritative

## Definition

**Authoritative** means officially accepted as the source to follow when alternatives conflict.

---

# 394. Ownership vs Authority

Ownership answers:

```text
Who defines and controls this concept?
```

Authority answers:

```text
Which source or decision should be followed?
```

The terms are related but not identical.

---

# 395. Data Owner

## Definition

A **Data Owner** is the Capability responsible for the canonical semantics, mutation rules, and lifecycle of specific persisted data.

---

# 396. Consumer

## Definition

A **Consumer** is a component, Actor, or external system that uses a Capability or Contract.

Consumers do not automatically become owners.

---

# 397. Producer

## Definition

A **Producer** generates or publishes a Resource, Event, Job, or data representation.

Producer meaning depends on context.

---

# 398. Publisher

## Definition

A **Publisher** is a component responsible for publishing Events, messages, Content, or releases depending on context.

Prefer more specific terminology when ambiguity exists.

---

# 399. Subscriber

## Definition

A **Subscriber** receives or reacts to published Events/messages.

---

# 400. Handler

## Definition

A **Handler** processes a defined input such as:

```text
Command

Event

Job
```

Use a qualifier when possible:

```text
CommandHandler

EventHandler

JobHandler
```

---

# 401. Orchestrator

## Definition

An **Orchestrator** coordinates multiple operations toward one higher-level use case.

Use this term when genuine coordination is the primary responsibility.

Do not use Orchestrator as a fashionable synonym for Service.

---

# 402. Coordinator

## Definition

A **Coordinator** manages interaction among multiple components when coordination is its meaningful responsibility.

Prefer more domain-specific naming when available.

---

# 403. Pipeline

## Definition

A **Pipeline** is an ordered sequence of processing stages.

Examples may include:

```text
Media Processing Pipeline

AI Generation Pipeline

Ingestion Pipeline
```

---

# 404. Ingestion

## Definition

**Ingestion** is the controlled process of bringing external or bulk data into AI World.

Ingestion should preserve:

```text
validation

ownership

provenance

security
```

---

# 405. Import

## Definition

An **Import** is a specific ingestion operation that introduces external data or configuration.

---

# 406. Export

## Definition

An **Export** produces a transferable representation of AI World data or configuration.

---

# 407. Synchronization

## Definition

**Synchronization** keeps AI World state aligned with an external or parallel source over time.

Synchronization requires explicit ownership and conflict behavior.

---

# 408. Conflict Resolution

## Definition

**Conflict Resolution** determines how competing state changes are handled when multiple sources or processes modify related data.

---

# 409. Canonicalization

## Definition

**Canonicalization** transforms equivalent representations into one accepted canonical form.

---

# 410. Enrichment

## Definition

**Enrichment** adds useful derived information to an existing Resource.

Examples:

```text
AI-generated metadata

media metadata extraction

relationship suggestion
```

Enrichment does not automatically alter canonical truth without validation.

---

# 411. Derivation

## Definition

**Derivation** produces one representation from another.

Derived state should be distinguishable from original canonical state.

---

# 412. Transformation

## Definition

A **Transformation** converts one representation into another.

Examples:

```text
image conversion

schema migration

data normalization
```

---

# 413. Publication State

## Definition

**Publication State** describes whether Content is:

```text
draft

reviewed

published

archived
```

according to the owning Capability's lifecycle.

---

# 414. Visibility

## Definition

**Visibility** determines which Actors may discover or access a Resource.

Visibility may differ from Authorization policy implementation.

---

# 415. Privacy

## Definition

**Privacy** concerns the appropriate collection, processing, disclosure, retention, and control of personal information.

---

# 416. Data Classification

## Definition

**Data Classification** labels data according to sensitivity or handling requirements.

Potential categories may eventually include:

```text
public

internal

restricted

personal
```

The actual classification scheme is not yet defined.

---

# 417. Sensitive Data

## Definition

**Sensitive Data** is data requiring stronger protection because disclosure or misuse could cause harm or violate policy.

---

# 418. Secret

## Definition

A **Secret** is confidential credential or cryptographic material used by the system.

Examples:

```text
API key

private key

database password
```

Secrets must not be treated as ordinary configuration.

---

# 419. Token

## Definition

A **Token** is a security or protocol artifact representing authorization, authentication, verification, or another temporary capability.

Because Token is overloaded, use specific names such as:

```text
Access Token

Refresh Token

Verification Token
```

where possible.

---

# 420. Access Token

## Definition

An **Access Token** is an authentication/authorization artifact granting access within defined scope and lifetime.

The exact token architecture is not yet selected.

---

# 421. Refresh Token

## Definition

A **Refresh Token** is a longer-lived credential used to obtain new access credentials where token-based session architecture uses one.

---

# 422. Verification Token

## Definition

A **Verification Token** is a temporary security artifact used to prove or confirm a specific action.

Examples:

```text
email verification

password reset
```

---

# 423. Rate Limit

## Definition

A **Rate Limit** restricts the number or frequency of operations an Actor, Client, or source may perform.

---

# 424. Quota

## Definition

A **Quota** limits total resource or capability usage within a defined period or scope.

Example:

```text
AI generations per month
```

---

# 425. Throttling

## Definition

**Throttling** controls request or workload rate to protect system capacity or policy.

---

# 426. Abuse Prevention

## Definition

**Abuse Prevention** is the set of controls protecting AI World from intentional misuse.

Potential mechanisms include:

```text
rate limiting

moderation

verification

fraud controls

AI safety policy
```

---

# 427. Threat Model

## Definition

A **Threat Model** identifies:

```text
assets

attackers

trust boundaries

threats

mitigations
```

for a system or Capability.

---

# 428. Least Privilege

## Definition

**Least Privilege** means an Actor receives only the access necessary to perform its intended responsibilities.

---

# 429. Zero Trust

## Definition

**Zero Trust** is a security philosophy where access is continuously authenticated/authorized rather than assumed from network location.

AI World does not currently require a full enterprise Zero Trust infrastructure implementation.

---

# 430. Backup

## Definition

A **Backup** is a recoverable copy of important persisted state.

---

# 431. Restore

## Definition

A **Restore** reconstructs operational state from backup or recovery data.

---

# 432. Disaster Recovery

## Definition

**Disaster Recovery** is the strategy and process for restoring AI World following severe system failure or data loss.

---

# 433. RPO

## Definition

**RPO**, or **Recovery Point Objective**, describes the acceptable amount of data loss measured in time.

---

# 434. RTO

## Definition

**RTO**, or **Recovery Time Objective**, describes the target time required to restore service after disruption.

---

# 435. Incident

## Definition

An **Incident** is an unplanned event that materially affects:

```text
availability

security

correctness

data integrity

users
```

---

# 436. Incident Response

## Definition

**Incident Response** is the controlled process of:

```text
detection

triage

mitigation

recovery

review
```

following an Incident.

---

# 437. Runbook

## Definition

A **Runbook** is an operational procedure describing how to perform or recover from a known operational situation.

Canonical location:

```text
docs/12-operations/runbooks/
```

---

# 438. SLO

## Definition

**SLO**, or **Service Level Objective**, is a target reliability or performance objective for a Capability.

SLOs will be introduced only when production maturity requires them.

---

# 439. SLA

## Definition

**SLA**, or **Service Level Agreement**, is a formal commitment regarding service performance, often contractual.

AI World does not require SLAs during initial development.

---

# 440. SLI

## Definition

**SLI**, or **Service Level Indicator**, is the measured value used to evaluate an SLO.

---

# 441. Latency

## Definition

**Latency** is the time required for an operation to complete or respond.

---

# 442. Throughput

## Definition

**Throughput** is the amount of work a system completes within a defined period.

---

# 443. Capacity

## Definition

**Capacity** is the workload level a system can support within defined performance and reliability expectations.

---

# 444. Availability Zone

## Definition

An **Availability Zone** is a cloud infrastructure concept representing an isolated deployment location within a region.

It is an implementation detail, not an AI World Domain concept.

---

# 445. Region — Infrastructure Context

When discussing deployment:

```text
Region
```

means a cloud/geographic deployment region.

When discussing Knowledge:

```text
Region
```

may mean a geographic Domain concept.

Context must make this distinction explicit.

---

# 446. CDN

## Definition

A **CDN**, or **Content Delivery Network**, distributes content closer to users for performance and availability.

CDN URLs must not become canonical Asset identity.

---

# 447. Object Storage

## Definition

**Object Storage** is storage infrastructure optimized for binary/object data.

It may implement the Storage Foundation.

---

# 448. Relational Database

## Definition

A **Relational Database** stores structured data using relational semantics such as tables, keys, and constraints.

Database technology will be selected in Technology Strategy.

---

# 449. ORM

## Definition

An **ORM**, or **Object-Relational Mapper**, maps application representations to relational persistence.

ORM-generated models are not automatically Domain Models.

---

# 450. Database

## Definition

A **Database** is durable structured persistence infrastructure.

The Database Foundation provides controlled access and transaction behavior to higher-level Capabilities.

---

# 451. Index

## Definition

An **Index** is a data structure used to improve retrieval performance.

Context must distinguish:

```text
database index

search index
```

---

# 452. Unique Constraint

## Definition

A **Unique Constraint** enforces uniqueness of defined persisted values.

Use database constraints to protect important invariants where appropriate.

---

# 453. Foreign Key

## Definition

A **Foreign Key** enforces a relational reference between persisted records.

Foreign keys are persistence implementation details supporting data integrity.

---

# 454. Event Bus

## Definition

An **Event Bus** is infrastructure or an abstraction enabling Event publication and subscription across components.

AI World does not assume a distributed event broker initially.

---

# 455. Broker

## Definition

A **Broker** is infrastructure mediating asynchronous messages between producers and consumers.

Examples may include queue or event-stream technologies.

---

# 456. Pub/Sub

## Definition

**Publish/Subscribe**, or **Pub/Sub**, is a communication pattern where producers publish messages without directly addressing each consumer.

---

# 457. Topic

## Definition

A **Topic** is a logical routing category in certain messaging systems.

Do not confuse messaging Topic with Knowledge Taxonomy Topic.

Context must be explicit.

---

# 458. Stream

## Definition

A **Stream** is an ordered sequence of records or events processed continuously or incrementally.

Streaming infrastructure is not an initial requirement by default.

---

# 459. Webhook

## Definition

A **Webhook** is an external HTTP callback notifying AI World or another system about an event.

Webhook inputs must be authenticated/validated where applicable.

---

# 460. External Integration

## Definition

An **External Integration** connects AI World to a system outside its direct ownership.

All integrations should define:

```text
ownership

failure behavior

security

data contract
```

---

# 461. Integration Boundary

## Definition

An **Integration Boundary** is the point where AI World interacts with another independently evolving system.

Adapters and Contracts should protect this boundary.

---

# 462. Canonical Terminology for Major AI World Areas

The preferred names for current major architectural areas are:

```text
AI World

Foundations

Platform Kernel

Platforms

Universes
```

Initial Foundations:

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

Initial Platform Kernel areas:

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

Initial Platforms:

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

# 463. Preferred Dependency Vocabulary

Use:

```text
depends on

consumes

owns

exposes

publishes

subscribes

implements

extends

references
```

precisely.

Examples:

```text
Media Platform consumes Storage Foundation.

Knowledge Platform publishes EntityPublished.

Anime Universe references Media Assets.

AI Provider Adapter implements AI Provider Contract.
```

---

# 464. "Owns"

Use:

```text
owns
```

only when the Capability is responsible for canonical semantics and lifecycle.

Do not say:

```text
Anime Universe owns Asset
```

simply because Anime uses an Asset.

Correct:

```text
Media Platform owns Asset.

Anime Universe references Asset.
```

---

# 465. "Uses"

**Uses** is acceptable informal language.

In architecture documents, prefer a more precise verb when possible:

```text
consumes

depends on

references

invokes
```

---

# 466. "Contains"

Use:

```text
contains
```

for structural composition when ownership implications are clear.

Avoid using it where:

```text
references
```

would better express shared ownership.

---

# 467. "Belongs To"

Use cautiously.

A Resource may:

```text
belong to a Universe
```

for classification while still being owned by another Platform.

Prefer defining exact semantics such as:

```text
associated with

visible in

categorized under

owned by
```

rather than relying on ambiguous "belongs to."

---

# 468. "Global"

## Definition

**Global** means applying across the entire AI World Platform or installation.

Global does not mean internet-public.

Example:

```text
Global Permission
```

may apply Platform-wide.

---

# 469. "Platform-Wide"

## Definition

**Platform-Wide** means applicable across multiple Platforms or Universes within one AI World installation.

Prefer this term over Global when avoiding ambiguity.

---

# 470. "Universe-Scoped"

## Definition

**Universe-Scoped** means behavior, data, or authorization applies within one Universe context.

---

# 471. "Resource-Scoped"

## Definition

**Resource-Scoped** means behavior or authorization applies to a specific Resource or group of Resources.

---

# 472. "Cross-Universe"

## Definition

**Cross-Universe** means involving Resources or behavior spanning more than one Universe.

---

# 473. "Cross-Platform"

## Definition

**Cross-Platform** means involving more than one AI World Platform capability.

Example:

```text
Knowledge + Media + Discovery
```

Do not confuse this with:

```text
cross-platform operating systems.
```

---

# 474. "Platform-Agnostic"

Avoid this phrase unless context is clear.

Prefer:

```text
Universe-neutral

provider-independent

technology-independent
```

depending on the intended meaning.

---

# 475. "Provider-Independent"

## Definition

**Provider-Independent** means Domain or Platform Contracts are not unnecessarily defined by one provider implementation.

It does not mean every provider is supported.

---

# 476. "Technology-Independent"

## Definition

**Technology-Independent** means an architectural concept remains meaningful independent of a specific implementation technology.

---

# 477. "Implementation-Agnostic"

Use sparingly.

Prefer precise phrases such as:

```text
independent of storage provider

independent of ORM
```

when possible.

---

# 478. Ambiguous Terms to Avoid

The following terms should generally be avoided without qualifiers:

```text
Manager

Helper

Common

Data

Object

Item

Thing

Engine

System

Platform

Service
```

These terms may be valid with precise context.

Example:

```text
Taxonomy Engine
```

may be understandable.

But:

```text
DataManager
```

usually is not.

---

# 479. "Engine"

## Definition

An **Engine** is a reusable execution capability implementing a meaningful generic mechanism.

Examples may eventually include:

```text
Workflow Engine

Recommendation Engine
```

Do not append "Engine" to components merely to make them sound architectural.

---

# 480. "Framework"

## Definition

A **Framework** is a reusable architectural implementation providing:

```text
contracts

lifecycle

extension mechanisms

shared runtime behavior
```

for multiple consumers.

Not every reusable Module is a Framework.

---

# 481. "Platform" vs "Framework"

Use:

```text
Platform
```

for a major product/business capability.

Use:

```text
Framework
```

for an implementation mechanism supporting repeated capability implementation.

Example:

```text
Media Platform
```

may internally use a:

```text
Processing Framework
```

if real requirements justify one.

---

# 482. "Foundation" vs "Framework"

A Foundation describes architectural responsibility.

A Framework describes implementation structure.

Example:

```text
Migration
```

may be classified as a Foundation and implemented through a Migration Framework.

---

# 483. "Kernel" vs "Core"

Preferred architectural term:

```text
Platform Kernel
```

Avoid using:

```text
Core
```

as a miscellaneous source-code folder unless its responsibility is explicitly defined.

"Core" often becomes ambiguous.

---

# 484. "Identity" vs "Identifier"

This distinction is mandatory.

```text
Identity
    security concept describing Actor identity

Identifier
    stable reference identifying a Resource
```

Examples:

```text
User authentication identity
```

is Identity.

```text
Entity ID
```

is Identifier.

---

# 485. "Resource" vs "Entity"

```text
Resource
    broad Platform term

Entity
    specific Knowledge Platform concept
```

Every Entity may be considered a Resource.

Not every Resource is an Entity.

Example:

```text
Asset
```

is a Resource but not necessarily a Knowledge Entity.

---

# 486. "Asset" vs "Entity"

```text
Asset
    Media Platform-owned Resource

Entity
    Knowledge Platform-owned Resource
```

An Entity may reference Assets.

An Asset does not become an Entity simply because it appears in Knowledge.

---

# 487. "Content" vs "Knowledge"

```text
Knowledge
    structured information and semantic model

Content
    information intended for creation, publishing, or experience
```

They overlap.

They are not identical.

---

# 488. "Experience" vs "Page"

```text
Experience
    structured interactive/composed user journey

Page
    navigable presentation surface
```

An Experience may span multiple Pages.

A Page may present part of an Experience.

---

# 489. "Workflow" vs "Job"

```text
Workflow
    business process

Job
    execution unit
```

A Workflow may schedule Jobs.

A Job does not necessarily represent Workflow state.

---

# 490. "Workflow" vs "Scheduler"

```text
Workflow
    what process occurs

Scheduler
    when work begins
```

---

# 491. "Queue" vs "Scheduler"

```text
Queue
    distributes asynchronous work

Scheduler
    triggers work according to time
```

---

# 492. "Event" vs "Audit Record"

```text
Event
    communicates a fact for reaction/integration

Audit Record
    preserves accountability history
```

One action may produce both.

They serve different purposes.

---

# 493. "Event" vs "Log"

```text
Event
    domain/platform communication contract

Log
    operational diagnostic record
```

---

# 494. "Version" vs "Revision"

Preferred distinction:

```text
Revision
    historical state of a Resource

Version
    general identifier for evolution of contract/schema/software/resource
```

Capability-specific documents may refine this meaning.

---

# 495. "Migration" vs "Seed"

```text
Migration
    evolves historical state

Seed
    creates intentional baseline/reference/environment data
```

---

# 496. "Seed" vs "Fixture"

```text
Seed
    environment/reference initialization

Fixture
    testing data
```

Do not use testing Fixtures as production Seeds automatically.

---

# 497. "Provider" vs "Adapter"

```text
Provider
    supplies implementation/capability

Adapter
    translates AI World contract to Provider/technology
```

Example:

```text
S3
    external storage provider

S3StorageAdapter
    AI World adapter
```

---

# 498. "Adapter" vs "Strategy"

```text
Adapter
    bridges incompatible interfaces or external systems

Strategy
    varies behavior/algorithm behind a common semantic contract
```

---

# 499. "Extension" vs "Plugin"

```text
Extension
    controlled additional behavior

Plugin
    independently installable extension package/system
```

Use Extension initially.

---

# 500. "Canonical" vs "Derived"

```text
Canonical
    authoritative

Derived
    computed/indexed/projected from canonical state
```

---

# 501. "Authentication" vs "Session"

Authentication verifies identity.

Session preserves an authenticated interaction context.

They are related but different.

---

# 502. "Authorization" vs "Permission"

Authorization is the process of deciding access.

Permission is one representation contributing to that decision.

Authorization may also use:

```text
roles

policy

resource context

ownership
```

---

# 503. "Role" vs "Permission"

```text
Role
    grouping/contextual responsibility

Permission
    allowed action/capability
```

Roles may contain Permissions.

---

# 504. "Policy" vs "Permission"

Permission often expresses a coarse grant.

Policy can evaluate dynamic contextual conditions.

Example:

```text
Permission:
history.entity.publish

Policy:
may publish only after review approval.
```

---

# 505. "User" vs "Actor"

Every User may be an Actor.

Not every Actor is a User.

Examples of non-User Actors:

```text
Worker

Service Account

AI Agent
```

---

# 506. "Actor" vs "Identity"

Actor is the participant performing an action.

Identity is how that Actor is represented/authenticated from a security perspective.

---

# 507. "Admin" vs "Administrator"

Preferred canonical term in architecture:

```text
Administrator
```

Use:

```text
admin
```

for UI/app shorthand where appropriate.

---

# 508. "Owner"

Owner is overloaded.

Future documents should qualify it where possible:

```text
Capability Owner

Data Owner

Resource Owner

User-owned Resource

Universe Owner
```

Do not infer authorization merely from generic "owner" terminology.

---

# 509. "Type"

Type is context-dependent.

Use qualifiers where useful:

```text
Entity Type

Metadata Type

Relationship Type

Asset Type

Event Type
```

---

# 510. "Status"

Status is also context-dependent.

Examples:

```text
Document Status

User Status

Job Status

Universe Status
```

Do not create one universal Status enum for unrelated concepts.

---

# 511. "State" vs "Status"

Preferred distinction:

```text
State
    meaningful lifecycle condition used in behavior/transitions

Status
    broader descriptive classification
```

This is guidance rather than an absolute rule.

---

# 512. "Definition" vs "Instance"

A useful recurring distinction:

```text
Definition
    describes reusable structure/configuration

Instance
    one concrete application of that definition
```

Examples:

```text
Workflow Definition
Workflow Instance

Metadata Definition
Metadata Value
```

---

# 513. "Template" vs "Definition"

A Template generally describes reusable content or structure intended to instantiate or render.

A Definition describes semantics and rules.

Use the term that best reflects responsibility.

---

# 514. "Schema" vs "Definition"

Schema emphasizes:

```text
structure

types

validation
```

Definition may include broader semantics and behavior.

---

# 515. "Configuration" vs "Definition"

Configuration controls behavior of an existing Capability.

Definition introduces domain-specific structured concepts consumed by that Capability.

Example:

```text
Universe Search Configuration
```

versus:

```text
Entity Type Definition
```

---

# 516. "Platform Configuration" vs "Universe Configuration"

```text
Platform Configuration
    applies to shared Platform behavior

Universe Configuration
    applies within one Universe
```

---

# 517. Terminology Rule for Permission Codes

The final permission naming system is not defined yet.

Until Authorization architecture is accepted, documentation examples such as:

```text
history.entity.publish
```

are illustrative only.

Do not treat them as implementation contracts.

---

# 518. Terminology Rule for Event Names

Examples such as:

```text
EntityPublished
```

illustrate semantic naming only.

Final event naming, namespaces, envelope structure, and versioning will be defined by Event architecture.

---

# 519. Terminology Rule for Resource Types

Examples such as:

```text
Character

Person

Event
```

are conceptual.

The Knowledge Platform has not yet finalized Entity Type representation.

---

# 520. Terminology Rule for Identifier Format

This document intentionally does not select:

```text
UUID

ULID

CUID

numeric IDs
```

The Identifier architecture and Technology Strategy will decide implementation.

---

# 521. Terminology Rule for Database Naming

This document does not prescribe:

```text
snake_case

camelCase

plural tables

singular tables
```

Database standards will define those conventions.

---

# 522. Terminology Rule for API Naming

This document does not prescribe route formats such as:

```text
/api/v1/entities
```

API standards will define route and versioning conventions later.

---

# 523. Terminology Rule for Source Folders

Architectural names do not automatically imply folder names.

Repository Architecture will determine source layout.

---

# 524. Terminology Rule for Package Names

Package naming will be defined by Repository Architecture and Engineering Standards.

Architectural terms should guide package responsibility but not dictate premature package creation.

---

# 525. Terminology Rule for Acronyms

Use well-known acronyms when they improve readability.

Examples:

```text
API

ADR

CMS

CLI

CI

CD

DTO

RPO

RTO
```

Uncommon acronyms should be defined on first use.

Avoid excessive project-specific abbreviations.

---

# 526. Terminology Rule for AI Acronyms

Terms such as:

```text
LLM

RAG

MCP

VLM
```

should be defined in AI-specific documentation when introduced.

Do not make current Platform architecture dependent on industry terminology that may evolve rapidly.

---

# 527. Terminology Rule for "AI World"

Always write the project display name as:

```text
AI World
```

Preferred repository slug:

```text
ai-world
```

Avoid introducing alternate official names casually.

---

# 528. Terminology Rule for "Universe"

Use **Universe** for formal AI World domain-world semantics.

Use lowercase:

```text
universe
```

only in generic prose when capitalization would be distracting.

---

# 529. Terminology Rule for "Platform"

When referring to a formal AI World Platform capability, use descriptive form:

```text
Media Platform

Knowledge Platform
```

Avoid writing:

```text
the platform
```

where multiple meanings are possible.

---

# 530. Terminology Rule for "Foundation"

Use Foundation for technical reusable infrastructure.

Do not call a major business capability a Foundation merely because other capabilities depend on it.

---

# 531. Terminology Rule for "Kernel"

Use Platform Kernel specifically for broadly reusable semantic primitives.

Do not use Kernel as a synonym for:

```text
utilities

shared code

infrastructure
```

---

# 532. Terminology Rule for "Core"

Avoid broad use of:

```text
Core
```

because it easily becomes ambiguous.

If source architecture later includes a `core` directory, its exact meaning must be formally documented.

---

# 533. Terminology Rule for "Engine"

Use Engine only where an actual reusable execution mechanism exists.

Do not rename ordinary Services to Engines for appearance.

---

# 534. Terminology Rule for "Platform Service"

Avoid this phrase unless context makes clear whether it means:

```text
application service inside a Platform
```

or:

```text
independently deployed service.
```

---

# 535. Terminology Rule for "Global"

Use:

```text
Platform-wide
```

where possible when referring to AI World scope.

Reserve Global when the broad meaning is genuinely intended.

---

# 536. Terminology Rule for "Universal"

Use Universal to mean:

```text
intended to apply broadly across AI World
```

not:

```text
supports every imaginable future scenario.
```

---

# 537. Terminology Rule for "Generic"

When describing a Generic Capability, documentation should explain:

```text
what semantics are shared

what remains domain-specific
```

Genericity without defined boundaries is insufficient.

---

# 538. Terminology Rule for "Dynamic"

Avoid saying:

```text
dynamic
```

without specifying what can change dynamically.

Examples:

```text
runtime-configurable

schema-configurable

hot-reloadable

database-driven
```

are more precise.

---

# 539. Terminology Rule for "Real-Time"

Use **Real-Time** only when a latency requirement actually exists.

Otherwise prefer:

```text
near-real-time

asynchronous

event-driven

periodic
```

as appropriate.

---

# 540. Terminology Rule for "Scalable"

Do not call a design scalable without specifying the relevant dimension.

Examples:

```text
scales reads horizontally

supports increasing Universe count

supports worker scaling
```

are more meaningful.

---

# 541. Terminology Rule for "Secure"

Do not describe a Capability as secure merely because it uses authentication.

Security claims should refer to specific properties.

---

# 542. Terminology Rule for "Production-Ready"

Use Production-Ready only after appropriate:

```text
testing

security

operations

documentation
```

criteria are satisfied for the defined scope.

---

# 543. Terminology Rule for "Complete"

Avoid ambiguous:

```text
complete
```

for major Capabilities.

Prefer lifecycle terms:

```text
IMPLEMENTED

VALIDATED

CLOSED
```

---

# 544. Terminology Rule for "Done"

Use Done only in casual project communication.

Formal status should follow controlled lifecycle terminology.

---

# 545. Terminology Rule for "Future-Proof"

Avoid claiming AI World is:

```text
future-proof.
```

No architecture can guarantee this.

Preferred terms:

```text
evolvable

replaceable

extensible

migration-friendly

durable
```

---

# 546. Terminology Rule for "50-Year Architecture"

AI World does not claim to predict 50 years of technology.

When discussing long-term durability, use:

```text
long-lived architecture

technology-evolvable architecture

durable domain contracts
```

The objective is adaptability, not prediction.

---

# 547. Terminology Rule for "Source of Truth"

Use Source of Truth when necessary.

Prefer:

```text
canonical owner

canonical data
```

when architecture ownership is the primary concern.

---

# 548. Terminology Rule for "Single Source of Truth"

This principle means one authoritative owner for a concept.

It does not mean only one physical copy may exist.

Derived copies such as:

```text
search indexes

caches

projections
```

may exist.

---

# 549. Terminology Rule for "Shared Database"

If multiple Capabilities use one physical database, this does not imply shared data ownership.

Documentation should distinguish:

```text
physical database sharing
```

from:

```text
logical ownership.
```

---

# 550. Terminology Rule for "Cross-Module"

Use Cross-Module for implementation-level interaction.

Use Cross-Capability or Cross-Platform when discussing architectural responsibility.

---

# 551. Terminology Rule for "Business Logic"

Use **Business Logic** for rules representing product/domain behavior.

Do not use the phrase for arbitrary implementation logic.

---

# 552. Terminology Rule for "Domain Logic"

Domain Logic is preferred where behavior belongs to a specific Domain.

---

# 553. Terminology Rule for "Infrastructure"

Infrastructure refers to supporting technical systems.

Examples:

```text
database

storage

network

queue

deployment
```

Infrastructure should not become the owner of business semantics.

---

# 554. Terminology Rule for "Application"

Use Application for executable clients or runtimes.

Do not call each Domain Module an Application.

---

# 555. Terminology Rule for "System"

System is broad.

Use a more precise term where possible:

```text
Platform

Application

Capability

Provider
```

---

# 556. Terminology Rule for "Object"

Avoid Object as a Domain term unless there is no more precise concept.

Prefer:

```text
Resource

Entity

Asset

Value
```

depending on context.

---

# 557. Terminology Rule for "Record"

Use Record primarily for persistence/log/history concepts.

Examples:

```text
Audit Record

Migration Record
```

Do not use Record as the general Domain synonym for Resource.

---

# 558. Terminology Rule for "Model"

Model is overloaded.

Use qualifiers:

```text
Domain Model

AI Model

Persistence Model

API Model
```

where ambiguity is possible.

---

# 559. Terminology Rule for "Schema"

Use qualifiers:

```text
Database Schema

Metadata Schema

API Schema

Universe Schema
```

where context is not obvious.

---

# 560. Terminology Rule for "Identity"

Never use Identity casually to mean:

```text
resource ID
```

Use Identifier for resource identity references.

Identity belongs primarily to Actor/security semantics.

---

# 561. Terminology Rule for "Profile"

A **Profile** is User Platform information describing a User for product presentation.

Profile is not authentication identity.

---

# 562. Terminology Rule for "Preferences"

**Preferences** are User-configurable choices affecting experience behavior.

Examples:

```text
theme

language

timezone
```

Authorization settings are not ordinary User Preferences.

---

# 563. Terminology Rule for "Settings"

Settings is broad.

Use more precise categories:

```text
User Preferences

Security Settings

Platform Configuration

Universe Configuration
```

---

# 564. Terminology Rule for "Security Center"

If implemented later, **Security Center** refers to a user-facing capability for managing security-related state such as:

```text
sessions

credentials

devices

security events
```

It is not currently an architectural Platform of its own.

---

# 565. Terminology Rule for "Device"

Device identity/session semantics will be defined by Identity & Access architecture.

Do not assume browser session, physical device, and trusted device are equivalent concepts.

---

# 566. Terminology Rule for "Notification"

A Notification is the user-facing communication.

Delivery through:

```text
email

push

SMS
```

is channel infrastructure.

---

# 567. Terminology Rule for "Email"

Email may mean:

```text
email address

email message

Email Foundation/provider capability
```

Use qualified names where ambiguity matters.

---

# 568. Terminology Rule for "Storage"

Storage should not be used as a synonym for:

```text
database

Media Platform

file metadata
```

Storage Foundation specifically concerns object/binary persistence.

---

# 569. Terminology Rule for "Media"

Media refers to managed Assets and their semantics.

Do not call raw provider storage paths Media Resources without Media Platform ownership.

---

# 570. Terminology Rule for "AI Generation"

Use Generation for concrete AI execution.

Use Generated Content for output that has become or may become Content.

---

# 571. Terminology Rule for "AI Content"

AI Content should distinguish:

```text
AI-generated

AI-assisted

AI-transformed
```

where provenance matters.

---

# 572. Terminology Rule for "Prompt Library"

If implemented, a Prompt Library is an AI Platform collection of reusable Prompt Templates.

It is not a generic source-code utility folder.

---

# 573. Terminology Rule for "Model Registry"

If implemented, a Model Registry is a controlled AI Platform catalog of available Models and capabilities.

It is not equivalent to external provider discovery.

---

# 574. Terminology Rule for "Universe Registry"

If implemented, a Universe Registry identifies the Universe Definitions available to an AI World installation.

The implementation may initially be static.

---

# 575. Terminology Rule for "Capability Registry"

A Capability Registry, if ever needed, would catalog supported Platform capabilities.

Do not create one merely because the term exists.

---

# 576. Terminology Rule for "Reference Data"

**Reference Data** is relatively stable supporting data used across business processes.

Examples may eventually include:

```text
country codes

supported locales
```

Reference Data may use Seed mechanisms.

---

# 577. Terminology Rule for "Master Data"

Use **Master Data** only if future data architecture explicitly adopts that concept.

Prefer Canonical Data and Data Ownership for current architecture.

---

# 578. Terminology Rule for "Knowledge Base"

Avoid using Knowledge Base as the official name for the Knowledge Platform.

A Knowledge Base often implies a narrower document/Q&A system.

AI World Knowledge is broader.

---

# 579. Terminology Rule for "Graph Database"

Use Graph Database only when referring to persistence technology.

Do not say Graph Database when discussing Knowledge Graph semantics.

---

# 580. Terminology Rule for "Semantic Search"

**Semantic Search** uses semantic/vector/model-based meaning rather than only exact lexical matching.

It is one possible Discovery technique.

It is not automatically required for initial Search.

---

# 581. Terminology Rule for "Embedding"

An **Embedding** is a numerical vector representation generated for semantic computation.

Embeddings are derived technical data.

They are not canonical Knowledge.

---

# 582. Terminology Rule for "Vector Store"

A **Vector Store** is specialized infrastructure for storing/querying embeddings.

AI World does not assume one is required initially.

---

# 583. Terminology Rule for "RAG"

If introduced later:

```text
RAG
=
Retrieval-Augmented Generation
```

It describes AI generation using retrieved contextual information.

RAG is a technique, not the AI World architecture.

---

# 584. Terminology Rule for "Agentic"

Avoid vague:

```text
agentic
```

language.

Describe concrete AI Agent behavior such as:

```text
tool selection

multi-step planning

autonomous execution
```

---

# 585. Terminology Rule for "Automation"

**Automation** is deterministic or AI-assisted execution of tasks without continuous manual action.

Not all Automation is AI.

---

# 586. Terminology Rule for "Intelligence"

When used in AI World product language, **Intelligence** broadly describes AI-enabled or knowledge-driven functionality.

In technical architecture, prefer specific terms such as:

```text
AI generation

ranking

classification

reasoning
```

---

# 587. Terminology Rule for "Smart"

Avoid architectural names such as:

```text
SmartSearch

SmartService
```

unless the specific behavior is documented.

Prefer semantically precise names.

---

# 588. Terminology Rule for "Universal"

Avoid names like:

```text
UniversalManager

UniversalObject
```

unless the abstraction has genuinely proven broad semantics.

---

# 589. Terminology Rule for "Dynamic Entity"

Avoid using Dynamic Entity as a foundational term until Knowledge architecture defines exactly what dynamic behavior means.

---

# 590. Terminology Rule for "Content Type"

A **Content Type** may describe a CMS/composition schema.

An **Entity Type** describes Knowledge semantics.

Do not automatically use them interchangeably.

---

# 591. Terminology Rule for "Resource Type"

**Resource Type** is the broad classification of any AI World Resource.

Entity Type is a more specific Knowledge classification.

---

# 592. Terminology Rule for "Asset Type"

**Asset Type** classifies Media Assets.

Examples may include:

```text
image

video

audio

document
```

---

# 593. Terminology Rule for "MIME Type"

**MIME Type** is an internet media-format identifier such as:

```text
image/png
```

It is not equivalent to the higher-level AI World Asset Type.

---

# 594. Terminology Rule for "Publication"

Publication means making Content available to an intended audience through controlled lifecycle.

It does not necessarily mean internet-public.

---

# 595. Terminology Rule for "Archive"

**Archive** means a Resource remains preserved but is no longer active in normal operation or discovery.

Archive is not necessarily deletion.

---

# 596. Terminology Rule for "Delete"

**Delete** means remove according to owning Capability semantics.

Delete may mean:

```text
hard deletion

logical deletion

scheduled destruction
```

depending on policy.

The exact behavior must be explicit.

---

# 597. Terminology Rule for "Soft Delete"

Use Soft Delete only for explicit logical deletion behavior.

Do not assume every model requires it.

---

# 598. Terminology Rule for "Restore"

Restore may mean:

```text
recover from backup

restore archived/deleted Resource
```

Context must be explicit.

---

# 599. Terminology Rule for "Archive" vs "Deprecated"

```text
Archive
    resource/lifecycle state

Deprecated
    contract/capability lifecycle state
```

---

# 600. Terminology Rule for "Retire"

**Retire** may describe intentionally discontinuing a Platform Capability, Universe, or provider.

Prefer Deprecated → Removed for Contracts.

Prefer Archived for retained Universe/content state.

---

# 601. Terminology Rule for "Removal"

**Removal** means a Capability, Contract, or Resource no longer exists in its previous supported form.

Removal should follow relevant migration/deprecation policy.

---

# 602. Terminology Rule for "Breaking"

Breaking means compatibility impact.

It does not mean:

```text
buggy
```

unless context states that.

---

# 603. Terminology Rule for "Immutable"

Use Immutable only when data genuinely cannot or must not change after creation.

Do not describe ordinary stable records as Immutable casually.

---

# 604. Terminology Rule for "Historical"

Historical means preserving past truth/state.

It should not be confused with the History Universe.

Example:

```text
historical migration record
```

versus:

```text
History Universe.
```

---

# 605. Terminology Rule for "Temporal"

**Temporal** describes concepts involving time, duration, validity, sequence, or historical periods.

Temporal modeling is broader than ordinary timestamps.

---

# 606. Terminology Rule for "Spatial"

**Spatial** describes concepts involving physical/geographic position, boundaries, or geometry.

Spatial capability is not yet defined as a Platform Kernel area.

---

# 607. Terminology Rule for "Geo"

Avoid using:

```text
Geo
```

as an architectural concept without clarifying:

```text
geography

geolocation

geospatial
```

---

# 608. Terminology Rule for "Locale" vs "Language"

Language identifies linguistic content.

Locale combines language with regional conventions.

Example:

```text
Language: English

Locale: en-IN
```

---

# 609. Terminology Rule for "Timezone"

A **Timezone** identifies rules for local civil time.

Timezone should not be represented only as an arbitrary UTC offset where daylight/region rules matter.

---

# 610. Terminology Rule for "Country"

Country is a geographic/political Domain concept and may also appear in User preferences or localization.

Do not create one universal country field without contextual ownership.

---

# 611. Terminology Rule for "Region"

Because Region is highly overloaded, always qualify when ambiguity exists:

```text
Cloud Region

Geographic Region

Market Region

Content Region
```

---

# 612. Terminology Rule for "Locale-Aware"

Locale-Aware means behavior intentionally accounts for locale.

It does not automatically mean full translation/localization support.

---

# 613. Terminology Rule for "Multi-Language"

Prefer:

```text
multilingual
```

for Content supporting multiple languages.

---

# 614. Terminology Rule for "Multi-Tenant"

Use **Multi-Tenant** only for architectural isolation among independent customer/organization tenants.

Do not use it to describe multiple Universes.

---

# 615. Terminology Rule for "Multi-Universe"

Use **Multi-Universe** for functionality spanning or supporting multiple AI World Universes.

---

# 616. Terminology Rule for "Universe-Aware"

**Universe-Aware** means a shared Capability accepts Universe context where behavior legitimately varies.

Universe-aware does not mean Universe-specific.

Example:

```text
Search may be Universe-aware
without containing Anime-specific code.
```

---

# 617. Terminology Rule for "Universe-Neutral"

A Universe-Neutral capability does not embed assumptions tied to specific named Universes.

It may still accept generic Universe context.

---

# 618. Terminology Rule for "Cross-Cutting"

Use Cross-Cutting for concerns applying across many Capabilities, such as:

```text
logging

security

observability
```

Cross-Cutting does not mean unowned.

---

# 619. Terminology Rule for "Infrastructure Capability"

Use Foundation where possible.

Infrastructure Capability is acceptable when discussing technical behavior generically.

---

# 620. Terminology Rule for "Platform Capability"

A Platform Capability is a Capability owned by one of the major Platforms.

---

# 621. Terminology Rule for "Business Capability"

A Business Capability expresses meaningful product/domain behavior.

Most Platform Capabilities are Business Capabilities.

Foundations are primarily technical capabilities.

---

# 622. Terminology Rule for "Primitive"

A **Primitive** is a small foundational semantic or technical building block.

Use carefully.

Platform Kernel concepts may be described as primitives only if they genuinely have broad foundational semantics.

---

# 623. Terminology Rule for "Abstraction Layer"

Avoid introducing an Abstraction Layer without describing what boundary it protects.

---

# 624. Terminology Rule for "Facade"

A **Facade** exposes a simplified public interface over more complex internal behavior.

Use Facade when that specific pattern is intended.

---

# 625. Terminology Rule for "Gateway"

A **Gateway** is a controlled entry point to another system or capability.

Examples:

```text
AI Gateway

Payment Gateway
```

Gateway should represent meaningful integration boundaries.

---

# 626. Terminology Rule for "Client"

Client may mean:

```text
frontend consumer

external SDK consumer

provider client implementation
```

Use qualification where needed:

```text
API Client

Provider Client

Web Client
```

---

# 627. Terminology Rule for "Controller"

A **Controller** handles inbound application/API interactions.

Controllers should generally remain boundary orchestration, not primary Domain owners.

---

# 628. Terminology Rule for "Resolver"

Use Resolver when behavior specifically resolves a value from multiple possibilities or contextual mappings.

Do not use Resolver merely as a generic Service name.

---

# 629. Terminology Rule for "Handler"

Handlers should be qualified whenever useful:

```text
Event Handler

Command Handler

Exception Handler

Job Handler
```

---

# 630. Terminology Rule for "Processor"

A **Processor** performs one focused processing responsibility, often in a Pipeline or Job.

Use specific naming:

```text
ImageProcessor

GenerationResultProcessor
```

rather than generic `Processor`.

---

# 631. Terminology Rule for "Executor"

An **Executor** is responsible for executing a defined operation, task, or plan.

Use when execution semantics are the key responsibility.

---

# 632. Terminology Rule for "Runner"

A **Runner** coordinates execution of a defined process.

Potential uses include:

```text
MigrationRunner

SeedRunner
```

Use only when orchestration/execution is clearly the responsibility.

---

# 633. Terminology Rule for "Registry" vs "Repository"

```text
Registry
    resolves registered definitions/implementations

Repository
    persists/retrieves owned data
```

Do not confuse them.

---

# 634. Terminology Rule for "Store"

Store is ambiguous.

Use:

```text
Repository

Cache

Object Storage

State Store
```

where possible.

---

# 635. Terminology Rule for "State Store"

A **State Store** is persistence specifically used to maintain state for a subsystem.

Use only when architecture truly requires that abstraction.

---

# 636. Terminology Rule for "Database Service"

Prefer:

```text
Database Foundation

Database Client

Transaction Service
```

or a technology-specific name rather than an ambiguous `DatabaseService`.

---

# 637. Terminology Rule for "Repository Pattern"

Use **Repository Pattern** only when describing deliberate persistence abstraction.

Do not call every ORM wrapper a Repository Pattern implementation automatically.

---

# 638. Terminology Rule for "Domain Repository"

A **Domain Repository** exposes persistence behavior in terms of owned Domain concepts.

---

# 639. Terminology Rule for "Query Repository"

A **Query Repository** may provide optimized read/query access when separated read behavior is justified.

AI World does not require this pattern everywhere.

---

# 640. Terminology Rule for "Read Model"

A **Read Model** is a representation optimized for queries.

It may be canonical or derived depending on architecture.

Do not assume read models imply CQRS.

---

# 641. Terminology Rule for "Write Model"

A **Write Model** represents state and behavior optimized around mutations and invariants.

Do not introduce separate Write Models unless they provide real value.

---

# 642. Terminology Rule for "Projection"

Projection is usually derived.

If a read representation becomes canonical, call it a Canonical Model rather than Projection.

---

# 643. Terminology Rule for "Snapshot"

A **Snapshot** is a captured representation of state at a particular time.

Snapshots may support:

```text
backup

versioning

event sourcing
```

depending on context.

---

# 644. Terminology Rule for "Revision History"

Revision History records meaningful Resource versions.

It is different from:

```text
Audit History

Migration History
```

---

# 645. Terminology Rule for "Migration History"

Migration History records which historical migrations have been executed.

It is infrastructure/application evolution state.

---

# 646. Terminology Rule for "Audit History"

Audit History records significant Actor/action accountability.

---

# 647. Terminology Rule for "Activity History"

Activity History is a user/product experience concept and should not be used as a substitute for Audit.

---

# 648. Terminology Rule for "User History"

User History belongs to Engagement/User experience semantics.

It should not include sensitive security audit information by default.

---

# 649. Terminology Rule for "Login History"

Login History is a security/user-facing representation of authentication activity.

It may be derived from dedicated security events/audit information.

---

# 650. Terminology Rule for "Session Metadata"

Session Metadata describes contextual details associated with a Session.

Examples:

```text
device

IP

user agent

last used time
```

The final session data model belongs to Identity & Access architecture.

---

# 651. Terminology Rule for "Trusted Device"

A Trusted Device is not yet a finalized concept.

Do not equate all known Session devices with trusted devices automatically.

---

# 652. Terminology Rule for "Privacy Setting"

Privacy Settings control user-facing privacy behavior.

They are distinct from security permissions.

---

# 653. Terminology Rule for "Security Setting"

Security Settings control security-related user/account behavior.

Examples may include:

```text
MFA preferences

session management
```

---

# 654. Terminology Rule for "Preference"

Preference should represent a user choice, not a required security or policy invariant.

---

# 655. Terminology Rule for "Profile"

Profile is product-facing User information.

Credentials and Permissions do not belong in Profile.

---

# 656. Terminology Rule for "Account"

Use **Account** only when a distinct business/account concept is introduced.

For now, prefer:

```text
User

Identity
```

rather than using Account ambiguously.

---

# 657. Terminology Rule for "Principal"

A **Principal** is a security term representing an authenticated entity to which authorization applies.

AI World prefers Actor in broad architecture.

Principal may be used inside security implementation where conventional.

---

# 658. Terminology Rule for "Subject"

Subject is highly context-dependent.

In security, it may mean the Actor being authorized.

In content, it may mean a knowledge topic.

Prefer a more explicit term.

---

# 659. Terminology Rule for "Owner" in Authorization

Resource ownership may contribute to authorization but should not automatically grant unrestricted access.

Authorization policy must define what ownership means.

---

# 660. Terminology Rule for "Super Admin"

Avoid informal architectural dependence on:

```text
super admin
```

without defining scope.

Prefer:

```text
Platform Administrator
```

or a specific privileged administrative role.

---

# 661. Terminology Rule for "System User"

Avoid representing Machine Actors as fake human Users unless architecture explicitly requires it.

Prefer:

```text
Service Account

Machine Actor
```

---

# 662. Terminology Rule for "Bot"

Use Bot only for user-facing product terminology.

Architecture should prefer:

```text
AI Agent

Automation

Machine Actor
```

where appropriate.

---

# 663. Terminology Rule for "Robot"

Do not use Robot as a technical identity concept unless the project eventually controls physical robotic systems.

---

# 664. Terminology Rule for "World"

Within brand language, World may refer informally to an experience or domain.

The formal architectural term is:

```text
Universe
```

for domain-world configuration.

---

# 665. Terminology Rule for "Sub-Universe"

Sub-Universe is not currently an accepted architectural concept.

If hierarchical Universe requirements emerge, they require explicit design.

---

# 666. Terminology Rule for "Domain Universe"

Avoid this redundancy.

Use:

```text
Universe
```

and describe its Domain when needed.

---

# 667. Terminology Rule for "Platform Universe"

Do not use this term.

Universes consume the Platform.

They are not Platforms themselves.

---

# 668. Terminology Rule for "Universe Platform"

Avoid this phrase unless discussing a separately justified product someday.

Current architecture uses:

```text
AI World Platform
+
Universes
```

---

# 669. Terminology Rule for "Universe Module"

A Universe Module may be an implementation construct.

It must not imply the Universe itself is only one source-code Module.

---

# 670. Terminology Rule for "Universe Package"

Universe Package is a possible future packaging concept.

It is not yet part of accepted implementation architecture.

---

# 671. Terminology Rule for "Universe Manifest"

Universe Manifest is a possible future declarative artifact.

It is not yet an implementation requirement.

---

# 672. Terminology Rule for "Universe Schema"

Universe Schema refers broadly to typed definitions introduced by one Universe.

The exact representation is not finalized.

---

# 673. Terminology Rule for "Universe Type"

Avoid using Universe Type until requirements reveal multiple categories of Universes with meaningful distinct behavior.

---

# 674. Terminology Rule for "Global Entity"

Avoid creating Global Entity as a permanent special type unless Knowledge architecture requires one.

A Resource may participate in multiple Universes without requiring a separate global entity category.

---

# 675. Terminology Rule for "Shared Entity"

Use carefully.

Prefer:

```text
Entity associated with multiple Universes
```

unless the Knowledge architecture introduces an explicit shared-entity concept.

---

# 676. Terminology Rule for "Canonical Entity"

Canonical Entity means the authoritative Knowledge Platform representation of the Entity.

It does not mean one globally unique factual interpretation of every disputed concept.

---

# 677. Terminology Rule for "Fact"

A **Fact** is a potentially structured statement asserted about Knowledge.

Fact modeling is not yet a confirmed canonical Knowledge Platform primitive.

Do not build Fact infrastructure until Knowledge architecture evaluates it.

---

# 678. Terminology Rule for "Claim"

A **Claim** may represent an asserted statement whose truth/provenance may require evaluation.

Claim is a possible future Knowledge concept and is not yet foundational.

---

# 679. Terminology Rule for "Reference"

A **Reference** links one resource or statement to another supporting source/resource.

Use more specific terms such as:

```text
Citation

Relationship

External Reference
```

when applicable.

---

# 680. Terminology Rule for "Source"

Source should describe provenance/evidence origin, not persistence source-of-truth ownership unless explicitly qualified.

---

# 681. Terminology Rule for "Origin"

Origin may describe where a Resource or generated output was created.

Prefer Provenance when historical production lineage matters.

---

# 682. Terminology Rule for "Lineage"

**Lineage** describes the chain of transformations or generations through which data/content evolved.

AI Lineage may include:

```text
source context

prompt

model

generation

human edits
```

---

# 683. Terminology Rule for "Provenance" vs "Lineage"

```text
Provenance
    where something came from

Lineage
    how it evolved through processing/transformation
```

They may overlap.

---

# 684. Terminology Rule for "Source Data"

Source Data means input data from which something is derived.

It does not automatically mean canonical data.

---

# 685. Terminology Rule for "Raw Data"

Raw Data is data before normalization or transformation.

Use only when such processing stages are explicit.

---

# 686. Terminology Rule for "Normalized Data"

Normalized Data is data converted to a canonical representation.

Do not confuse with relational database normalization.

---

# 687. Terminology Rule for "Normalization"

Normalization may mean:

```text
input canonicalization

database normalization
```

Context must be explicit.

---

# 688. Terminology Rule for "Mapping"

Mapping defines correspondence between concepts or representations.

Examples:

```text
external identifier mapping

DTO mapping

taxonomy mapping
```

---

# 689. Terminology Rule for "Alias"

An **Alias** is an alternate name or identifier referring to the same canonical concept.

Aliases may become useful in:

```text
taxonomy

search

entities
```

---

# 690. Terminology Rule for "Synonym"

A **Synonym** is an alternate linguistic expression with equivalent or near-equivalent meaning.

Taxonomy/Search may eventually use Synonyms.

---

# 691. Terminology Rule for "Label"

A **Label** is a human-readable name displayed for a concept.

Labels may be localized.

Labels are not necessarily stable machine keys.

---

# 692. Terminology Rule for "Name"

A **Name** is a human-readable primary textual identifier for a concept.

Names may change.

Do not assume Name is canonical technical identity.

---

# 693. Terminology Rule for "Display Name"

A **Display Name** is a presentation-oriented human-readable name.

It may differ from canonical Name or Key where necessary.

---

# 694. Terminology Rule for "Code"

Code is overloaded.

Use qualifiers:

```text
Permission Code

Error Code

Source Code

Country Code
```

---

# 695. Terminology Rule for "Key"

Key is usually a stable machine-readable identifier within a known scope.

Key does not automatically mean database primary key.

---

# 696. Terminology Rule for "ID"

ID means Identifier.

Use qualified IDs in architecture:

```text
Universe ID

Entity ID

Asset ID
```

rather than generic `id` when discussing semantics.

---

# 697. Terminology Rule for "Reference ID"

Reference ID may refer to another Resource's ID.

Do not use Reference ID as a separate identifier category unless needed.

---

# 698. Terminology Rule for "External Key"

An External Key is a stable external-system identifier used for mapping.

It remains external ownership.

---

# 699. Terminology Rule for "Natural Key"

A **Natural Key** is a business-meaningful value used for uniqueness.

Whether AI World uses Natural Keys as identifiers will be decided per Domain.

---

# 700. Terminology Rule for "Surrogate Key"

A **Surrogate Key** is a generated technical identifier with no necessary Domain meaning.

The Identifier strategy may use surrogate IDs.

---

# 701. Reserved Future Terms

The following terms are intentionally **not yet finalized** as foundational AI World concepts:

```text
Fact

Claim

Ontology

Semantic Layer

Knowledge Node

Sub-Universe

Workspace

Organization

Tenant

Marketplace

Plugin

Rule Engine

Agent Framework

Recommendation Engine

Capability Registry

Universe Package

Universe Manifest
```

They may be introduced later through architecture work if real requirements justify them.

---

# 702. Ontology

## Provisional Definition

An **Ontology** formally defines concepts, categories, properties, and semantic relationships within a knowledge domain.

AI World may eventually need Ontology concepts.

For now:

```text
Taxonomy

Metadata

Entity Types

Relationships
```

should be designed before introducing a broader Ontology abstraction.

Status:

```text
PROVISIONAL TERM
```

---

# 703. Semantic Layer

## Provisional Definition

A **Semantic Layer** could describe shared meaning across Knowledge resources and relationships.

AI World does not currently define a separate Semantic Layer architectural component.

Status:

```text
RESERVED / NOT YET ADOPTED
```

---

# 704. Knowledge Node

Avoid using **Knowledge Node** as a canonical concept unless future Knowledge Graph architecture explicitly introduces it.

Prefer:

```text
Entity

Resource
```

for current architecture.

---

# 705. Rule Engine

A **Rule Engine** is not currently an accepted Platform capability.

Policies and Domain rules should first be implemented through simpler explicit mechanisms.

Introduce a Rule Engine only if real dynamic-rule requirements emerge.

---

# 706. Recommendation Engine

A Recommendation Engine may become a Discovery capability.

The term does not imply a separate service or machine-learning system.

---

# 707. AI Gateway

## Definition

An **AI Gateway** is a potential controlled entry point through which AI World invokes AI providers/models.

The AI Gateway may become part of the AI / Creator Platform.

Its exact implementation is not yet finalized.

---

# 708. Storage Gateway

Avoid creating a Storage Gateway term unless the Storage architecture specifically adopts a Gateway pattern.

Preferred concept currently:

```text
Storage Foundation
```

with adapters/providers as needed.

---

# 709. Search Engine

Use **Search Engine** when referring to the implementation performing search.

Use:

```text
Discovery Platform
```

for the owning AI World Capability.

A third-party Search Engine is infrastructure.

---

# 710. Search Provider

A **Search Provider** is an external or replaceable implementation used by Discovery.

---

# 711. Email Provider

An **Email Provider** delivers Email Messages through an external or development implementation.

---

# 712. Email Message

An **Email Message** is a structured message intended for email delivery.

It is separate from the provider used to send it.

---

# 713. Template

A **Template** defines reusable structure with variable content.

Possible contexts:

```text
Email Template

Prompt Template

Document Template
```

Always qualify where ambiguity exists.

---

# 714. Notification Template

A **Notification Template** is a reusable content definition used to generate Notifications.

If introduced later, it should remain channel-aware without duplicating Notification semantics unnecessarily.

---

# 715. Storage Object

A **Storage Object** is a provider/storage-level binary object.

It is not automatically equivalent to Media Asset.

---

# 716. File

A **File** is an ordinary binary or document artifact.

Within Platform architecture, prefer Asset when the file is managed as Media.

---

# 717. Blob

**Blob** is a storage implementation term meaning binary large object.

Avoid using Blob as a Media Domain concept.

---

# 718. URL

A **URL** is a network location/reference.

URLs are presentation/delivery references and should not automatically serve as canonical Resource identifiers.

---

# 719. URI

A **URI** is a general resource identifier syntax.

Future canonical identifier architecture may or may not use URI-like identifiers.

This document does not decide that.

---

# 720. CDN URL

A CDN URL is a delivery URL.

It may change.

Do not persist it as the only identity of an Asset.

---

# 721. Signed URL

A **Signed URL** is a temporary URL containing authorization information for controlled access to a Resource.

Signed URLs must be treated as security-sensitive.

---

# 722. Upload

An **Upload** is the process of transferring a file/Asset into AI World-managed ingestion/storage.

Upload is not identical to Asset creation lifecycle.

---

# 723. Download

A **Download** is the delivery of Asset data to an authorized consumer.

---

# 724. Processing

**Processing** means applying transformation, validation, analysis, or enrichment to data or Assets.

Always qualify when possible.

---

# 725. Processing Pipeline

A **Processing Pipeline** is an ordered sequence of Processors.

Examples:

```text
Media Processing Pipeline

Ingestion Pipeline
```

---

# 726. AI Pipeline

Avoid using AI Pipeline generically.

Describe the actual flow:

```text
Generation Pipeline

Evaluation Pipeline

Embedding Pipeline
```

---

# 727. Content Pipeline

Use only when a defined sequence exists for:

```text
ingestion

review

enrichment

publication
```

Do not use Pipeline to describe ordinary CRUD flow.

---

# 728. Publishing Pipeline

A Publishing Pipeline is a sequence preparing Content for publication.

This may integrate:

```text
validation

workflow

rendering

indexing
```

if future requirements justify it.

---

# 729. Build

A **Build** is the process of compiling/bundling source into executable or deployable artifacts.

Build is also sometimes used informally as a verb for implementation.

Use context carefully.

---

# 730. Artifact

An **Artifact** is an output produced by development/build/deployment processes.

Do not confuse Build Artifact with Media Asset.

---

# 731. Deployment Artifact

A **Deployment Artifact** is a build output intended for deployment.

---

# 732. Document

A **Document** is a maintained project knowledge artifact under:

```text
docs/
```

or a domain content document when explicitly stated.

Use:

```text
Project Document
```

where needed to distinguish.

---

# 733. Documentation

**Documentation** is the body of maintained project knowledge describing:

```text
governance

vision

architecture

engineering

capabilities

operations

decisions
```

---

# 734. Documentation Architecture

**Documentation Architecture** is the organization and ownership of project documents.

Current canonical root:

```text
docs/
```

---

# 735. README

A **README** provides:

```text
overview

status

navigation

entry-point information
```

for a documentation area or package.

README should not automatically duplicate detailed architecture documents.

---

# 736. Reference

In documentation architecture:

```text
Reference
```

means supporting lookup material.

Canonical project reference area:

```text
docs/15-reference/
```

---

# 737. Glossary

A **Glossary** is a concise lookup collection of terms.

This Terminology document is broader than a simple Glossary because it also defines usage rules and distinctions.

A shorter project Glossary may later exist in:

```text
docs/15-reference/glossary.md
```

derived from this canonical terminology.

---

# 738. Diagram

A **Diagram** visually represents architecture, flow, or relationships.

Canonical diagrams should not contradict textual architecture documents.

---

# 739. Architecture Diagram

An **Architecture Diagram** visualizes architectural structure.

Text remains necessary to define semantics not visible in diagrams.

---

# 740. Decision Process

The **Decision Process** defines how significant project decisions are proposed, reviewed, accepted, superseded, or rejected.

Canonical document:

```text
docs/00-governance/decision-process.md
```

---

# 741. Governance

**Governance** defines how AI World decisions, standards, documentation, status, and architectural authority are managed.

Governance is intended to improve consistency, not create unnecessary bureaucracy.

---

# 742. Standard

A **Standard** defines required or strongly preferred engineering behavior.

Examples:

```text
API Standard

Testing Standard

Naming Standard
```

---

# 743. Guideline

A **Guideline** is recommended practice that permits justified deviation.

---

# 744. Rule

A **Rule** is an explicit constraint expected to be followed unless an approved exception exists.

---

# 745. Principle

A **Principle** is a durable decision heuristic guiding architecture or engineering choices.

Principles may require interpretation during tradeoffs.

---

# 746. Convention

A **Convention** is a consistent agreed practice for naming, structure, or implementation.

---

# 747. Policy — Governance Context

In governance context, Policy may mean a formal project rule.

In Platform Kernel context, Policy means configurable/evaluable Platform behavior.

Use qualifiers when ambiguity exists.

---

# 748. Exception

An **Exception** is a deliberate deviation from an established Rule or Standard.

Exceptions should have:

```text
reason

scope

impact
```

where significant.

---

# 749. Waiver

A **Waiver** is explicit temporary approval not to satisfy a requirement.

Use only if governance later establishes such a process.

---

# 750. Review

A **Review** is structured evaluation of:

```text
architecture

code

security

documentation

closure
```

depending on context.

Always qualify when ambiguity matters.

---

# 751. Architecture Review

An **Architecture Review** evaluates:

```text
boundaries

ownership

dependencies

contracts

tradeoffs

evolution
```

before or during major implementation.

---

# 752. Code Review

A **Code Review** evaluates source changes for:

```text
correctness

architecture

security

maintainability

quality
```

---

# 753. Security Review

A **Security Review** evaluates threats, access boundaries, sensitive data handling, and security controls.

---

# 754. Closure Review

A Closure Review verifies major work satisfies its defined completion criteria before being marked CLOSED.

---

# 755. Status

**Status** describes current lifecycle position.

Project documentation must distinguish different status dimensions when relevant.

Examples:

```text
Document Status

Implementation Status

Release Status
```

---

# 756. Document Status

Canonical document statuses initially include:

```text
DRAFT

PROPOSED

ACCEPTED

SUPERSEDED

DEPRECATED
```

Implementation-oriented statuses may appear when documents correspond directly to Capabilities.

The documentation standard will finalize exact status rules.

---

# 757. Capability Status

Potential Capability lifecycle statuses include:

```text
NOT STARTED

PLANNED

IN PROGRESS

IMPLEMENTED

VALIDATED

CLOSED

DEPRECATED
```

The status model may be refined later.

---

# 758. Roadmap Status

Roadmap items may use delivery statuses such as:

```text
NOT STARTED

PLANNED

IN PROGRESS

BLOCKED

COMPLETE

DEFERRED
```

The Master Roadmap will standardize these.

---

# 759. Blocked

**BLOCKED** means progress cannot continue because a required dependency or decision is unresolved.

Blocked is a delivery status, not an architectural lifecycle state.

---

# 760. Complete

Use COMPLETE primarily for roadmap/milestone reporting.

For major Capability maturity, prefer:

```text
CLOSED
```

when formal closure has occurred.

---

# 761. Current Canonical Vocabulary Hierarchy

The highest-level AI World terms are:

```text
AI World
    │
    ├── Applications
    │
    ├── Foundations
    │
    ├── Platform Kernel
    │
    ├── Platforms
    │
    └── Universes
```

---

# 762. Current Conceptual Dependency Hierarchy

Preferred dependency direction:

```text
Applications / Experiences
        ↓
Universes
        ↓
Platforms
        ↓
Platform Kernel
        ↓
Foundations
```

Applications may consume Platforms directly depending on architecture.

The exact dependency graph will be defined in:

```text
docs/02-architecture/dependency-rules.md
```

---

# 763. Current Ownership Vocabulary

Use:

```text
owns
```

for authoritative responsibility.

Use:

```text
references
```

for linked shared Resources.

Use:

```text
consumes
```

for using a Capability.

Use:

```text
implements
```

for concrete implementation of a Contract.

Use:

```text
extends
```

for controlled extension.

Use:

```text
publishes
```

for Events.

Use:

```text
subscribes
```

for Event consumption.

---

# 764. Current AI World Classification Vocabulary

All major future capabilities should initially be evaluated against:

```text
FOUNDATION

PLATFORM KERNEL

PLATFORM

UNIVERSE-SPECIFIC
```

If none fit, architecture should explain why.

---

# 765. Terminology Decision Checklist

When introducing a new architectural term, ask:

```text
1. Does an existing canonical term already represent this concept?

2. Is the new term meaningfully different?

3. Can its definition be stated clearly?

4. Does it conflict with industry-standard meaning?

5. Will future developers understand the distinction?

6. Does introducing it create unnecessary conceptual complexity?

7. Does it need to be added to this document?
```

---

# 766. New Term Policy

A new foundational term should be added when:

```text
it appears across multiple architectural documents;

its meaning could be ambiguous;

it represents a stable AI World concept;

different teams/modules could interpret it differently.
```

Not every implementation class belongs in this terminology document.

---

# 767. Term Deprecation

If a canonical term becomes inappropriate:

```text
identify replacement

document semantic difference

update canonical documents

mark old terminology deprecated

avoid silent renaming
```

where the change has architectural significance.

---

# 768. Terminology and Source Code

Source code should align with canonical terminology when practical.

Examples:

If architecture calls the concept:

```text
Asset
```

do not casually create:

```text
MediaFileObjectThing
```

for the same semantic concept.

Precise code naming reduces translation cost between documentation and implementation.

---

# 769. Terminology and APIs

Public APIs should use terminology consistent with AI World Domain language.

API consumers should not need to translate between completely different documentation and API vocabularies.

---

# 770. Terminology and Database

Database names may be optimized for persistence conventions, but should remain semantically traceable to owned Domain concepts.

Avoid database models whose meaning is completely unrelated to architecture terminology.

---

# 771. Terminology and Events

Event names should describe meaningful AI World facts using canonical Domain terminology.

Example:

If the canonical concept is:

```text
Asset
```

prefer:

```text
AssetProcessed
```

over an unrelated synonym such as:

```text
FileThingDone
```

---

# 772. Terminology and Permissions

Permission naming should reflect canonical Resource and Action terminology.

If a Capability is renamed architecturally, permission naming may require compatibility planning.

---

# 773. Terminology and Universe Definitions

Universe-specific vocabulary may introduce new Domain terms.

Example:

```text
Anime Episode

Historical Event
```

Those terms belong to Universe/domain documentation unless they become reusable Platform concepts.

---

# 774. Terminology and Localization

Canonical architecture terms remain written in English within source and technical documentation unless future engineering standards explicitly change this.

User-facing labels may be localized.

Internal stable Keys should not change with translated labels.

---

# 775. Terminology and Public Branding

Marketing/product language may occasionally use friendlier terms than technical architecture.

Where they differ, architecture documents must preserve canonical technical meanings.

Example:

Marketing may say:

```text
World
```

while architecture uses:

```text
Universe.
```

---

# 776. Terminology and Future Teams

Future engineers should be able to read this document and understand the fundamental vocabulary without requiring oral historical context.

If repeated confusion occurs around a term, the term or definition should be improved.

---

# 777. Terminology Anti-Pattern — Synonym Drift

Avoid:

```text
Asset
Media File
File Resource
Blob
Attachment
```

being used interchangeably for one canonical concept without reason.

Choose the correct semantic term.

---

# 778. Terminology Anti-Pattern — Same Word, Different Concepts

Avoid one overloaded term such as:

```text
Identity
```

representing both:

```text
authentication identity

resource identifier
```

The canonical distinction is:

```text
Identity
vs
Identifier
```

---

# 779. Terminology Anti-Pattern — Implementation Name Becomes Domain Name

Avoid defining Domain terminology using vendor or framework concepts.

Bad:

```text
PrismaEntity
S3Asset
OpenAIMessage
```

as canonical Domain concepts.

---

# 780. Terminology Anti-Pattern — Generic Names Hide Ownership

Avoid:

```text
DataService

CommonManager

GlobalHelper

GenericObject
```

when more precise names are possible.

---

# 781. Terminology Anti-Pattern — Future Concept Becomes Current Architecture Accidentally

A term appearing in planning documents does not mean the Capability exists.

Examples:

```text
Agent Marketplace

Ontology Engine

Universe Package
```

must remain clearly marked future/provisional until architecture accepts them.

---

# 782. Terminology Anti-Pattern — Brand Language Becomes Technical Requirement

Words such as:

```text
World

Intelligence

Infinite

Universal
```

may be useful in product language.

They must not force vague technical abstractions.

---

# 783. Terminology Anti-Pattern — Technology Becomes Platform Identity

Avoid phrases such as:

```text
Prisma platform

OpenAI backend

Next.js architecture

Postgres model
```

when referring to AI World's canonical architecture.

Technology belongs to implementation strategy.

---

# 784. Terminology Anti-Pattern — Acronym Explosion

Avoid project-specific acronyms such as:

```text
UDE
PKE
AICM
```

unless they provide significant recurring value.

Readable language is preferred.

---

# 785. Terminology Anti-Pattern — Status Ambiguity

Avoid saying:

```text
done
```

when the actual state is:

```text
code exists but testing incomplete.
```

Use precise lifecycle status.

---

# 786. Terminology Anti-Pattern — Ownership Ambiguity

Avoid statements such as:

```text
Users and Authentication share User.
```

Instead define exact ownership:

```text
User Platform owns profile.

Identity & Access owns credentials.
```

---

# 787. Terminology Anti-Pattern — "Shared" Means Nobody Owns It

Shared resources still require owners.

Example:

```text
Asset
```

may be shared by many Universes.

Media Platform still owns it.

---

# 788. Terminology Anti-Pattern — "Global" Means Public

Platform-wide Resources may still be private or permission-restricted.

Scope and visibility are different concepts.

---

# 789. Terminology Anti-Pattern — "Dynamic" Means Untyped

Runtime configurability does not remove the need for:

```text
schemas

validation

typed contracts
```

---

# 790. Terminology Anti-Pattern — "Generic" Means One Model

A generic Platform may contain multiple typed Resource models.

Generic means reusable architecture, not one universal database table.

---

# 791. Terminology Anti-Pattern — "Decoupled" Means No Dependencies

Capabilities may depend on each other deliberately.

Decoupling means dependencies remain controlled and contracts protect change.

---

# 792. Terminology Anti-Pattern — "Future-Proof"

AI World avoids claiming permanent future-proofing.

The correct goal is:

```text
evolvability.
```

---

# 793. Foundational Terminology Summary

The essential vocabulary to remember is:

```text
AI World
    the complete project/platform

Capability
    something AI World can do

Foundation
    reusable technical infrastructure

Platform Kernel
    broadly reusable semantic primitives

Platform
    major reusable business capability

Universe
    configured domain world using shared capabilities

Resource
    broad addressable/persisted AI World concept

Entity
    Knowledge Platform resource

Asset
    Media Platform resource

Actor
    something that performs actions

User
    human actor represented by User Platform

Identity
    security representation of actor identity

Identifier
    stable reference to a resource

Authentication
    who are you?

Authorization
    may you do this?

Taxonomy
    governed classification

Metadata
    validated descriptive extension

Relationship
    typed connection between resources

Workflow
    business process/lifecycle

Event
    fact that happened

Command
    request for something to happen

Policy
    explicit context-sensitive rule

Provider
    implementation supplier

Adapter
    bridge to provider/technology

Extension
    controlled additional behavior

Contract
    stable boundary expectation

Canonical Data
    authoritative AI World state

Derived Data
    calculated/indexed/copied representation

Experience
    structured user-facing composition

Composition
    assembling resources into experiences

Discovery
    finding relevant resources

Generation
    AI execution producing output

Provenance
    origin/history of content or data

Audit
    durable accountability history

Observability
    understanding runtime behavior

Migration
    historical state evolution

Seed
    intentional baseline/reference population
```

---

# 794. Canonical Distinction Summary

The most important distinctions are:

```text
Universe
≠
Application

Universe
≠
Tenant

Universe
≠
Locale

Platform
≠
Module

Foundation
≠
Platform

Platform Kernel
≠
Shared Folder

Identity
≠
Identifier

User
≠
Actor

Resource
≠
Entity

Entity
≠
Asset

Knowledge
≠
Page

Content
≠
Canonical Knowledge

Storage
≠
Media

Search
≠
Discovery

Search Index
≠
Canonical Data

AI Provider
≠
AI Platform

Generation
≠
Publication

Role
≠
Permission

Authentication
≠
Authorization

Workflow
≠
Job

Scheduler
≠
Queue

Event
≠
Command

Event
≠
Audit Record

Log
≠
Audit Record

Migration
≠
Seed

Configuration
≠
Business Logic

Extension
≠
Plugin Marketplace

Generic
≠
Untyped

Reusable
≠
Shared Ownership

Monorepo
≠
No Boundaries

Module
≠
Microservice

Canonical
≠
Only Physical Copy

Versioning
≠
Audit

Production-Ready
≠
Feature-Complete

Implemented
≠
Closed
```

---

# 795. Terminology Principles

AI World terminology follows:

```text
1. Prefer precise words over generic words.

2. One stable concept should have one preferred name.

3. Do not define Domain concepts using implementation technologies.

4. Do not use different names for the same thing casually.

5. Do not use the same name for unrelated concepts when avoidable.

6. Qualify overloaded terms when necessary.

7. Shared does not mean unowned.

8. Generic does not mean untyped.

9. Universe does not mean application.

10. Identity does not mean identifier.

11. Entity does not mean every Resource.

12. Provider does not define the Platform contract.

13. Architecture terminology should remain meaningful across technology changes.

14. Future concepts remain provisional until formally adopted.

15. Terminology must evolve deliberately rather than drift silently.
```

---

# 796. Relationship to Future Glossary

A concise user/developer lookup glossary may later be generated at:

```text
docs/15-reference/glossary.md
```

That Glossary should be derived from this document.

This file remains the canonical detailed terminology authority.

---

# 797. Relationship to Architecture

The terminology defined here will be used directly by:

```text
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

Future architecture must not silently redefine these concepts.

---

# 798. Future Terminology Review

This document should be reviewed when:

```text
major Platform concepts are introduced;

Knowledge architecture defines new canonical primitives;

multi-tenancy or organizations are introduced;

public extension architecture is introduced;

AI architecture introduces durable new concepts;

Universe packaging becomes real;

persistent ambiguity appears in development.
```

Routine implementation class names do not require terminology-document updates.

---

# 799. Current Terminology Status

At acceptance of this document:

```text
AI World
    DEFINED

Capability
    DEFINED

Foundation
    DEFINED

Platform Kernel
    DEFINED

Platform
    DEFINED

Universe
    DEFINED

Resource
    DEFINED

Entity
    HIGH-LEVEL DEFINITION ONLY

Asset
    DEFINED AT HIGH LEVEL

Identity
    DEFINED

Identifier
    DEFINED

Actor
    DEFINED

Taxonomy
    DEFINED

Metadata
    DEFINED

Relationship
    DEFINED

Workflow
    DEFINED

Event
    DEFINED

Policy
    DEFINED

Provider
    DEFINED

Extension
    DEFINED

Canonical Data
    DEFINED

Derived Data
    DEFINED

Detailed implementation models
    NOT YET FINALIZED
```

---

# 800. Final Terminology Statement

> **AI World will use a precise, stable, technology-independent vocabulary so that architecture, code, data, documentation, and future teams describe the same system using the same concepts.**

Terminology exists to reduce ambiguity.

As AI World grows, the vocabulary may grow.

It must not become inconsistent.

---

# 801. Acceptance

```text
DOCUMENT
P0-D08 — AI World Terminology

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

NEXT DOCUMENT
P0-D09 — System Context

IMPLEMENTATION STATUS
NOT STARTED BY DESIGN
```