# PostgreSQL Search Measurement — Phase 6

## Status

**MEASURED BASELINE**

This document records the Phase 6 PostgreSQL Search measurement evidence required before specialized Search infrastructure may be introduced.

It measures the existing direct PostgreSQL implementation. It does not introduce a new Search index, projection, extension, ranking algorithm, dedicated engine, or vector capability.

## Repository checkpoint

- Baseline commit: `1a654c5f5057f8b5c9421ec8ac4aec85007c83b6`
- Baseline subject: `docs(roadmap): close Phase 6 Security`
- Parent: `76eb84794553257a3db284e94a2c89a0be9be4e4` — `test(discovery): prove public search security`
- Baseline CI run: `32136168097`
- Baseline CI number: `#107`
- Baseline CI attempt: `1`
- Baseline CI conclusion: `success`

## Measurement environment

- Local orchestration: `infrastructure/local/compose.yml`
- PostgreSQL container image declared by the repository: `postgres:18.4-alpine`
- PostgreSQL server version: `18.4`
- `shared_buffers`: `128MB`
- `effective_cache_size`: `4GB`
- `work_mem`: `4MB`
- `random_page_cost`: `4`
- `effective_io_concurrency`: `16`
- `max_parallel_workers_per_gather`: `2`
- JIT: `on`

These values describe the measured local environment only.

## Existing Search implementation measured

The measured implementation is the existing `PrismaKnowledgeSearch` query over canonical `knowledge_resources`.

The production query shape remains:

```text
canonical knowledge_resources
        ↓
optional Universe predicate
        ↓
PUBLISHED lifecycle predicate
        ↓
literal case-insensitive Resource Type substring predicate
        ↓
optional exact Resource Type ANY-OF filter
        ↓
understandable CASE ranking
        ↓
created_at DESC
        ↓
id ASC
        ↓
OFFSET / LIMIT
```

No Search-specific Prisma index exists on `KnowledgeResource` at this checkpoint.

Indexes reported by PostgreSQL during the measurement:

- `knowledge_resources_pkey`: `CREATE UNIQUE INDEX knowledge_resources_pkey ON public.knowledge_resources USING btree (id)`

## Controlled fixture

The measurement inserts **100,000 disposable Knowledge rows** using reserved measurement Universes and Resource Types, runs `ANALYZE`, performs the measurements, then deletes all measurement rows and runs `ANALYZE` again.

- Pre-measurement canonical Knowledge rows: `0`
- Measurement fixture rows: `100000`
- Universe alpha rows: `50000`
- Universe beta rows: `50000`
- PUBLISHED rows: `76924`
- INITIAL rows: `7692`
- DRAFT rows: `7692`
- ARCHIVED rows: `7692`
- PUBLISHED rows matching `measure-temple` before scope/type filtering: `61539`
- Table heap size with fixture: `12050432` bytes
- Table + indexes size with fixture: `20643840` bytes

The controlled fixture is not a production dataset and does not model production concurrency, network latency, cache churn, real query-frequency distribution, or future content growth.

## Method

For each representative Search shape:

1. execute 2 warm-up runs and discard them;
2. execute 10 measured warm runs inside PostgreSQL using `clock_timestamp()`;
3. calculate min, median, mean, p95, and max database-side elapsed time;
4. capture `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`;
5. record planning time, execution time, plan nodes, scan strategy, scan loops, parallel-worker use, rows removed by filter, shared-buffer activity, and sort behavior.

The captured plans used one parallel worker plus the leader, so the scan node executed twice. PostgreSQL reports `Actual Rows` and `Rows Removed by Filter` for a repeatedly executed plan node as per-loop averages. The raw values are retained below as PostgreSQL reported them; controlled-fixture totals are shown separately to avoid treating those averages as totals.

With only 10 measured samples per shape, the nearest-rank p95 is the maximum observed sample. It is descriptive local evidence, not a production percentile estimate.

Raw JSON plans and raw timing samples are retained in the validation evidence archive that produced this document.

## Results

### Global Search

- Scope: `global`
- Query: `measure-temple`
- Exact Resource Type filters: none
- Warm-up runs discarded: 2
- Measured warm runs: 10
- Database-side warm timing min: **48.136 ms**
- Database-side warm timing median: **50.478 ms**
- Database-side warm timing mean: **53.356 ms**
- Database-side warm timing p95: **66.186 ms**
- Database-side warm timing max: **66.186 ms**
- EXPLAIN planning time: **0.647 ms**
- EXPLAIN execution time: **59.792 ms**
- Scan strategy: `Seq Scan`
- Parallel workers planned / launched: `1` / `1`
- Scan actual loops: `2`
- PostgreSQL scan `Actual Rows` per-loop average: `30769.5`
- PostgreSQL `Rows Removed by Filter` per-loop average: `19230`
- Controlled fixture rows examined by the scan: `100000`
- Controlled rows passing the scan predicates: `61539`
- Controlled rows removed by the scan predicates: `38461`
- Root actual rows: `20.0`
- Shared hit blocks: `1523`
- Shared read blocks: `0`
- Sort method: `top-N heapsort`
- Sort space: `29` kB (`Memory`)
- Plan nodes: `Limit -> Gather Merge -> Sort -> Seq Scan`

### Universe-scoped Search

- Scope: `universe:measurement.alpha`
- Query: `measure-temple`
- Exact Resource Type filters: none
- Warm-up runs discarded: 2
- Measured warm runs: 10
- Database-side warm timing min: **27.686 ms**
- Database-side warm timing median: **28.491 ms**
- Database-side warm timing mean: **29.200 ms**
- Database-side warm timing p95: **34.879 ms**
- Database-side warm timing max: **34.879 ms**
- EXPLAIN planning time: **0.621 ms**
- EXPLAIN execution time: **29.140 ms**
- Scan strategy: `Seq Scan`
- Parallel workers planned / launched: `1` / `1`
- Scan actual loops: `2`
- PostgreSQL scan `Actual Rows` per-loop average: `15385.0`
- PostgreSQL `Rows Removed by Filter` per-loop average: `34615`
- Controlled fixture rows examined by the scan: `100000`
- Controlled rows passing the scan predicates: `30770`
- Controlled rows removed by the scan predicates: `69230`
- Root actual rows: `20.0`
- Shared hit blocks: `1523`
- Shared read blocks: `0`
- Sort method: `top-N heapsort`
- Sort space: `29` kB (`Memory`)
- Plan nodes: `Limit -> Gather Merge -> Sort -> Seq Scan`

### Resource-Type-filtered Search

- Scope: `global`
- Query: `measure-temple`
- Exact Resource Type filters: `measurement.measure-temple`, `measurement.measure-temple-guide`
- Warm-up runs discarded: 2
- Measured warm runs: 10
- Database-side warm timing min: **26.960 ms**
- Database-side warm timing median: **32.533 ms**
- Database-side warm timing mean: **32.598 ms**
- Database-side warm timing p95: **39.174 ms**
- Database-side warm timing max: **39.174 ms**
- EXPLAIN planning time: **1.249 ms**
- EXPLAIN execution time: **34.268 ms**
- Scan strategy: `Seq Scan`
- Parallel workers planned / launched: `1` / `1`
- Scan actual loops: `2`
- PostgreSQL scan `Actual Rows` per-loop average: `15384.5`
- PostgreSQL `Rows Removed by Filter` per-loop average: `34616`
- Controlled fixture rows examined by the scan: `100000`
- Controlled rows passing the scan predicates: `30769`
- Controlled rows removed by the scan predicates: `69231`
- Root actual rows: `20.0`
- Shared hit blocks: `1526`
- Shared read blocks: `0`
- Sort method: `top-N heapsort`
- Sort space: `29` kB (`Memory`)
- Plan nodes: `Limit -> Gather Merge -> Sort -> Seq Scan`

## Interpretation

At the controlled **100,000-row local fixture scale**, the highest observed warm median among the three measured Search shapes was **50.478 ms**.

This measurement establishes what the current direct PostgreSQL implementation does in a reproducible local environment. It does **not** establish a production SLA and must not be represented as production-scale latency evidence.

The plans must be interpreted together with the current Search semantics:

- substring matching uses an expression over `lower(resource_type)`;
- understandable ranking uses expression-based `CASE` evaluation;
- Search currently queries canonical Knowledge directly;
- no separate Search projection exists;
- no dedicated Search engine exists;
- no semantic/vector Search exists.

All three captured warm plans selected a parallel sequential scan with one worker plus the leader, followed by in-memory top-N heapsort, Gather Merge, and Limit. The captured warm EXPLAINs reported zero shared-read blocks, so these specific plans were buffer-resident at measurement time.

That sequential-scan choice is evidence about this query/data shape. It is not by itself sufficient reason to introduce specialized Search infrastructure.

## Phase 6 gate conclusion

**PostgreSQL Search has now been measured before specialized infrastructure is introduced.**

The measurement does not by itself justify a dedicated Search engine, Search projection, vector database, or semantic Search.

If real workload evidence later shows unacceptable latency, result-quality limitations, faceting complexity, scale pressure, or language-analysis requirements, Discovery must revisit the dedicated Search gate using those measurements.

Ordinary PostgreSQL query/index optimization remains available if future measured workload justifies it; that decision does not inherently require a separate Search projection.

## Explicit non-claims

This evidence does not claim:

```text
production-scale performance

production concurrency capacity

production p95 or p99 latency

production cache behavior

production hardware equivalence

production data distribution equivalence

future scale sufficiency
```

## Repository impact

This measurement checkpoint changes documentation evidence only.

It introduces no:

```text
Search contract change
Search ranking change
Search score
Search index
Search projection
PostgreSQL extension
schema change
migration
new dependency
dedicated Search engine
semantic/vector Search
named-Universe runtime branch
```

Canonical migration count remains `15`.

Phase 6 remains ACTIVE. Final Phase 6 closure-criteria evaluation remains a separate checkpoint.
