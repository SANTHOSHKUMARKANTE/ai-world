# P6-M07 — Indexing Architecture Review

## Status

ACCEPTED

## Date

2026-08-18

## Milestone

P6-M07 — Indexing Architecture Review

## Baseline

```text
P6-M06 ROADMAP CLOSURE
4ab921f6296cb137b5a610d5c90d3d79f277e3f9

SUBJECT
docs(roadmap): close P6-M06

PARENT
54b12ce60d8948f01609f69770cf0d90f3b8f1e7
test(api): serialize integration tests

GITHUB ACTIONS
CI run 32124931157
CI #101
attempt 1
completed — success
```

## Decision

AI World will **continue querying canonical Knowledge relational state directly in PostgreSQL** for the current Discovery Search capability.

At this checkpoint:

```text
NO separate Search projection is required.

NO separate Search index model is required.

NO dedicated Search engine is required.

NO Search synchronization pipeline is required.
```

This is a decision about the architecture justified by the repository and workload evidence that exists now.

It is **not** a claim that direct relational queries are proven sufficient for every future production scale or future Search feature.

## Context

P6-M01 through P6-M06 established one shared Discovery Search capability with:

```text
typed Search contract

PUBLISHED-only public visibility

Universe-scoped Search

global cross-Universe Search

exact Resource Type ANY-OF filters

understandable PostgreSQL lexical ranking

deterministic pagination
```

The current implementation executes parameterized SQL directly against:

```text
knowledge_resources
```

through Discovery-owned `PrismaKnowledgeSearch`.

The current canonical searchable Knowledge row contains:

```text
id

universe_key

resource_type

lifecycle

created_at

updated_at
```

There is currently no:

```text
Search projection table

Search index persistence model

index synchronization Event pipeline

Search rebuild worker

dedicated Search provider

vector store

embedding persistence

Search score in the Search result contract
```

Canonical migration count at this review remains:

```text
15
```

## Architecture Evidence

The accepted Technology Strategy establishes:

```text
Search Baseline
PostgreSQL search capabilities
ACCEPTED

Dedicated Search Engine
None initially
DEFERRED

Vector Search
Not initial
DEFERRED
```

The Ownership Model allows Discovery to own a derived Search projection when such a projection is justified.

That ownership rule does not require a projection to exist before there is a real need.

If a projection is introduced later:

```text
Knowledge remains canonical owner of Knowledge state.

Discovery owns only the derived Search representation.

The projection must remain rebuildable derived state.

The projection must not become a second canonical Knowledge source.
```

The Extension Model also requires AI World to avoid creating extension points or infrastructure merely for theoretical future flexibility.

## Adequacy Finding

The current direct PostgreSQL design remains adequate **for the capability actually implemented at this checkpoint** because:

```text
Search operates over one canonical Knowledge Resource relation.

The currently searchable field is the canonical Resource Type key.

Universe scope, lifecycle visibility, filters, ranking, and pagination
are expressed directly in one parameterized PostgreSQL query.

The same implementation is proven across Devotional and Anime.

There is no current projection synchronization problem to solve.

There is no current multi-document denormalization requirement.

There is no current faceting implementation requiring a separate document model.

There is no current language-analysis requirement.

There is no current semantic/vector requirement.

There is no measured repository evidence demonstrating that a
separate projection or dedicated engine is necessary.
```

P6-M06 validation proves functional correctness and deterministic behavior.

It does **not** constitute production-scale latency evidence.

Therefore P6-M07 does not manufacture a scale problem or claim a scale result that has not been measured.

## Rejected at This Checkpoint

P6-M07 intentionally does not introduce:

```text
SearchProjection model

SearchIndex model

new PostgreSQL Search-specific migration

tsvector persistence

pg_trgm extension

new Search-specific PostgreSQL index

change-data-capture pipeline

Knowledge-to-Discovery indexing Events

queue / worker for reindexing

Elasticsearch

OpenSearch

Meilisearch

Typesense

vector database

embedding model

semantic ranking

Ranking Strategy registry
```

An ordinary PostgreSQL index may still be added later if real query plans and workload measurements justify it.

Adding such an index would not by itself require a separate Search projection.

## Dedicated Search Gate

A dedicated projection or Search engine must remain evidence-driven.

Before introducing one, AI World should collect representative evidence for the roadmap-defined dimensions:

```text
latency

result quality

faceting complexity

scale

language analysis
```

Useful future evidence may include:

```text
representative Knowledge row counts

representative query mix

p50 / p95 / p99 Search latency

PostgreSQL EXPLAIN (ANALYZE, BUFFERS) for representative queries

filter selectivity

pagination depth

ranking cost

faceting requirements

language/tokenization requirements

operational cost of canonical-table querying
```

No fixed numeric threshold is invented by this review.

Thresholds must come from real product/SLO requirements.

## Trigger Conditions for Re-review

Re-open the projection/index architecture decision when one or more real requirements appear, for example:

```text
measured Search latency violates an accepted SLO

canonical relational queries become operationally expensive

Search must denormalize multiple canonical owners into one retrieval document

faceting requires materially different derived structures

language analysis cannot be represented adequately by the current approach

result quality requires a retrieval model materially beyond current lexical ranking

independent Search rebuild/recovery becomes operationally valuable

Search workload scaling requires isolation from canonical transactional reads
```

## Future Projection Ownership

If the gate is crossed later:

```text
Discovery owns the Search projection.

Discovery owns projection mapping.

Discovery owns projection lifecycle.

Discovery owns rebuild behavior.

Canonical Knowledge remains owned by Knowledge.

The projection remains derived and disposable/rebuildable.
```

Universe packages may contribute typed searchable definitions or ranking signals when justified.

They must not own independent Search infrastructure.

## Consequences

Benefits of retaining direct PostgreSQL queries now:

```text
no synchronization lag

no duplicate Search state

no rebuild machinery

no indexing worker

no new infrastructure dependency

no new migration

no additional failure mode

visibility semantics continue to read canonical lifecycle state directly

minimum architecture remains aligned with the actual capability
```

Trade-offs accepted:

```text
future Search complexity may require revisiting this decision

future scale may require PostgreSQL indexes, a projection, or a dedicated engine

current lexical ranking remains intentionally limited

production-scale latency is not yet characterized
```

These trade-offs are acceptable because the roadmap already provides explicit measurement gates before specialized Search infrastructure is introduced.

## Invariants Preserved

```text
Discovery owns Search semantics.

Knowledge owns canonical Knowledge.

Search does not become canonical Knowledge.

PUBLISHED-only visibility remains authoritative.

Universe scope remains part of Search semantics.

No named-Universe Search infrastructure is introduced.

Dedicated Search remains deferred until measured need.

Semantic/vector Search remains deferred until product value is demonstrated.
```

## Outcome

```text
P6-M07 REVIEW DECISION
DIRECT POSTGRESQL OVER CANONICAL KNOWLEDGE REMAINS THE BASELINE

SEPARATE SEARCH PROJECTION
NOT REQUIRED NOW

DEDICATED SEARCH ENGINE
DEFERRED

SEMANTIC / VECTOR SEARCH
DEFERRED

FUTURE PROJECTION OWNER IF REQUIRED
DISCOVERY
```

This decision record is the P6-M07 implementation artifact.

The roadmap remains unchanged in this commit and must be closed separately only after this decision commit is validated, committed, pushed, and its exact CI succeeds.
