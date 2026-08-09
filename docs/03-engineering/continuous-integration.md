# AI World Continuous Integration

## 1. Purpose

This document defines the canonical Continuous Integration contract for AI World.

Continuous Integration exists to prove that the repository can be installed, validated, tested, migrated, and built reproducibly outside a developer workstation.

Phase 1 established the original repository-validation baseline.

Phase 2 extends that baseline with real PostgreSQL-backed persistence validation where Platform behavior requires it.

The canonical CI implementation is GitHub Actions.

The authoritative workflow is:

```text
.github/workflows/ci.yml
```

CI must remain:

```text
reproducible
architecture-aware
migration-aware
security-conscious
infrastructure-minimal
independent of developer-local state
```

---

## 2. Current CI Contract

The current AI World validation pipeline is:

```text
checkout
  ↓
setup pnpm
  ↓
setup Node.js
  ↓
start and health-check PostgreSQL
  ↓
install dependencies
  ↓
format validation
  ↓
lint
  ↓
typecheck
  ↓
default tests
  ↓
apply committed database migrations
  ↓
database integration tests
  ↓
install Playwright Chromium
  ↓
browser E2E tests
  ↓
build
  ↓
architecture validation
```

Phase 1 originally established CI without a live database.

P2-M01 introduces PostgreSQL-backed validation because the Identity & Access and User Platforms now contain real persistence behavior that must be verified against PostgreSQL.

A successful CI run means every configured validation stage completed successfully on the GitHub-hosted Linux runner.

---

## 3. Workflow Triggers

The CI workflow runs for pushes to:

```text
main
```

and for pull requests targeting:

```text
main
```

This provides validation:

```text
before merge through pull requests
and
after changes reach the canonical branch
```

The same validation job is used for both trigger types.

---

## 4. Workflow Identity

The workflow name is:

```text
CI
```

The validation job is:

```text
Validate
```

A healthy repository state should therefore report:

```text
CI / Validate
```

as successful for the relevant commit.

A locally successful change is not considered fully CI-validated until the real GitHub-hosted workflow has executed successfully.

---

## 5. Runner Baseline

The workflow uses:

```text
ubuntu-24.04
```

as the GitHub-hosted runner.

This intentionally validates AI World on Linux even when development occurs on Windows.

CI therefore helps detect environment-specific problems such as:

```text
case-sensitive paths
Linux command resolution
line-ending issues
shell assumptions
Playwright Linux dependencies
Next.js Linux builds
Prisma generation on Linux
PostgreSQL connectivity
migration portability
workspace dependency behavior
filesystem assumptions
```

A change is not considered portable merely because it succeeds on one developer workstation.

---

## 6. Node.js and pnpm Versions

The Node.js version is taken from:

```text
.nvmrc
```

The current repository baseline is:

```text
Node.js 24.18.1
```

pnpm is configured through the root package manifest:

```text
packageManager
```

The current repository baseline is:

```text
pnpm 10.17.1
```

CI must not independently drift from these repository-pinned versions.

Runtime and package-manager upgrades must be deliberate repository changes rather than workflow-only changes.

---

## 7. GitHub Actions Used

The current workflow uses:

```text
actions/checkout@v6.0.2
pnpm/action-setup@v6.0.9
actions/setup-node@v6.4.0
```

The pnpm setup derives the package-manager version from repository package metadata rather than duplicating it in the workflow.

Node setup derives the Node.js version from:

```text
.nvmrc
```

Action-version changes should be reviewed as engineering changes rather than casually updated.

---

## 8. Dependency Installation

CI installs dependencies using:

```bash
pnpm install --frozen-lockfile
```

The committed:

```text
pnpm-lock.yaml
```

is part of the reproducible-build contract.

CI must fail when package manifests and the lockfile are inconsistent.

Do not replace the frozen install with an unconstrained install merely to make CI pass.

Dependency changes must update the lockfile intentionally.

---

## 9. Dependency Cache

The GitHub Actions Node setup enables pnpm dependency caching using:

```text
pnpm-lock.yaml
```

as the dependency cache input.

Caching may improve CI execution time.

CI correctness must never depend on a warm cache.

A clean runner must still be able to install and validate the repository successfully.

---

## 10. Formatting Validation

CI runs:

```bash
pnpm run format:check
```

This checks repository files managed by the canonical Prettier configuration.

Formatting validation is read-only.

CI must not rewrite files automatically to make validation succeed.

Formatting corrections belong in committed source changes.

---

## 11. Lint Validation

CI runs:

```bash
pnpm run lint
```

The root lint command validates repository-level JavaScript tooling and participating workspace packages.

Current root behavior includes repository tooling such as:

```text
scripts/**/*.mjs
.dependency-cruiser.mjs
```

and package lint tasks orchestrated through Turborepo.

Platform source and Platform tests participate in lint validation.

A lint failure must be corrected in source rather than hidden by weakening validation without an accepted engineering reason.

---

## 12. Typecheck Validation

CI runs:

```bash
pnpm run typecheck
```

Turborepo executes workspace typechecking according to the dependency graph.

The Database Foundation performs Prisma client generation when required before dependent TypeScript validation.

The Identity & Access and User Platforms separately typecheck:

```text
production source
test source
```

through their package and test TypeScript configurations.

TypeScript validation remains strict according to the repository's accepted compiler baseline.

---

## 13. Default Test Lane

CI runs the normal repository test lane through:

```bash
pnpm run test
```

The current default test baseline includes:

```text
Foundation configuration tests
Foundation error-model tests
API integration tests
Web component tests
```

The default lane intentionally does not require a live PostgreSQL database.

This preserves a fast general-purpose test path for:

```text
local development
ordinary package changes
repository-wide validation
failure isolation
```

Database-backed persistence tests are kept in a separate integration lane.

Adding persistence requirements must not silently convert:

```text
pnpm run test
```

into an infrastructure-dependent command.

---

## 14. Database Integration-Test Lane

Database-backed tests run through:

```bash
pnpm run test:integration
```

The root command delegates to Turborepo.

The current participating Platform packages are:

```text
@ai-world/platform-identity-access
@ai-world/platform-user
```

P2-M01 currently proves:

```text
Actor can be persisted
Actor receives canonical identifiers and timestamps
User can reference an existing Actor
one Actor cannot receive multiple Users
User cannot reference a nonexistent Actor
Actor deletion is rejected while a User references it
test-owned persistence is cleaned up
```

The current persistence proof contains:

```text
Identity & Access integration tests   1
User integration tests                4
                                      ─
Total                                 5
```

The integration lane uses a real PostgreSQL database and the real generated Prisma client.

It does not replace the normal test lane.

Both exist for different purposes.

---

## 15. Integration-Test Isolation and Cleanup

Database integration tests must not depend on manually pre-created business records.

Tests create the persistence they own and remove it after execution.

The current P2-M01 cleanup contract leaves:

```text
identity_actors = 0 test-owned rows
users           = 0 test-owned rows
```

after the integration suites complete.

Tests must clean up in referentially valid order.

For the current Actor/User relationship:

```text
User
  ↓ delete first

Actor
  ↓ delete second
```

because the canonical foreign key uses:

```text
ON DELETE RESTRICT
```

Integration tests should prove business invariants through observable persistence behavior rather than depend unnecessarily on unstable adapter-specific implementation details.

---

## 16. PostgreSQL CI Service

Phase 1 intentionally did not start PostgreSQL in CI.

P2-M01 introduces PostgreSQL because real Actor and User persistence tests now require it.

The CI service baseline is:

```text
image: postgres:18.4-alpine

database: ai_world
user: ai_world
password: ai_world

host: 127.0.0.1
port: 5432
```

The service is ephemeral and belongs only to the CI validation job.

It is not production infrastructure.

CI uses PostgreSQL only because an accepted validation requirement now depends on it.

---

## 17. PostgreSQL Health Check

The GitHub Actions service uses:

```text
pg_isready
```

to verify PostgreSQL readiness.

The current health-check intent is:

```text
database: ai_world
user: ai_world
```

with bounded retries and timeouts.

Database-dependent validation must not start against an unready database.

Failure to establish a healthy PostgreSQL service is a CI failure rather than a reason to bypass database integration tests.

---

## 18. CI Database Configuration

The validation job provides:

```text
DATABASE_URL=postgresql://ai_world:ai_world@127.0.0.1:5432/ai_world
```

This points to the ephemeral PostgreSQL service owned by the CI job.

The value is CI-local configuration.

It is not a production credential.

The application and Platform code consume database connectivity through:

```text
DATABASE_URL
```

rather than depending on environment-specific port assumptions.

---

## 19. Local and CI Database Ports

Local development PostgreSQL currently maps to:

```text
127.0.0.1:55432
```

GitHub Actions uses:

```text
127.0.0.1:5432
```

This difference is intentional.

The application should not care which infrastructure port is selected.

The environment-specific connection string owns that concern.

Conceptually:

```text
local development
DATABASE_URL
  ↓
127.0.0.1:55432

GitHub Actions
DATABASE_URL
  ↓
127.0.0.1:5432
```

No source-code branching is permitted merely to distinguish these environments.

---

## 20. Migration Deployment in CI

The CI PostgreSQL service begins as a fresh database.

Before database integration tests run, CI applies committed migrations using:

```bash
pnpm --filter @ai-world/foundation-database run prisma:migrate:deploy
```

The lifecycle is:

```text
fresh PostgreSQL
  ↓
committed Prisma migrations
  ↓
canonical schema
  ↓
database integration tests
```

This proves that AI World persistence can be reconstructed from committed migration history.

The current canonical migration baseline begins with:

```text
20260809133830_actor_user_baseline
```

CI must not use manual schema mutations as a substitute for migrations.

---

## 21. Migration Contract

Committed Prisma migrations are part of the repository contract.

CI database setup must use:

```text
prisma migrate deploy
```

rather than development-oriented migration creation.

Migration creation belongs to development workflows.

Migration deployment belongs to reproducible environments such as CI.

A successful integration test against a manually prepared database does not prove migration correctness.

The schema must first be reconstructed through committed migrations.

---

## 22. No Application `.env` in CI

The validation workflow does not create:

```text
.env
```

This remains intentional.

Configuration required by CI-owned infrastructure is supplied explicitly through the workflow environment.

P2-M01 currently requires:

```text
CI
DATABASE_URL
```

Developer-local `.env` files are not part of the CI contract.

The workflow must remain independent of uncommitted workstation configuration.

---

## 23. Browser E2E Tests

The Web application owns Playwright.

Before browser E2E execution, CI installs Chromium and required Linux system dependencies through:

```bash
pnpm --filter @ai-world/web exec playwright install --with-deps chromium
```

Browser tests then run through:

```bash
pnpm run test:e2e
```

The current browser baseline uses Chromium.

Playwright starts its required Web development server for the E2E run.

The browser E2E baseline must not depend on a manually running local Web process.

Database integration tests and browser E2E tests remain distinct validation responsibilities.

---

## 24. Build Validation

CI runs:

```bash
pnpm run build
```

Build validation currently includes participating buildable applications and packages such as:

```text
NestJS API
Next.js Web
Foundation packages
Identity & Access Platform
User Platform
```

A successful test suite does not replace build validation.

A successful build does not replace tests.

Both must succeed.

---

## 25. Architecture Validation

CI runs:

```bash
pnpm run architecture:check
```

Architecture validation builds the participating workspaces and executes dependency-cruiser against the accepted repository boundaries.

The current architecture rules include protection against:

```text
circular source dependencies
app-to-app dependencies
Foundations depending upward
Kernel depending upward
Platforms depending on Applications or Universes
Universes depending on Applications
undeclared external dependencies
unresolvable imports
production source depending on devDependencies
```

P2-M01 Platform integration tests may use Database Foundation infrastructure as test-only dependencies.

Production Platform source must not accidentally depend on those devDependencies.

Architecture validation is therefore part of the CI contract, not merely an optional local diagnostic.

---

## 26. Integration Task Orchestration

The root integration command is:

```bash
pnpm run test:integration
```

Turborepo owns workspace orchestration.

The integration task is configured as non-cacheable because it interacts with mutable database state.

Conceptually:

```text
test:integration
  cache: false
  DATABASE_URL passed through
  required dependency builds run first
```

Only workspaces defining:

```text
test:integration
```

participate in the actual database-test execution.

Other workspace packages do not need placeholder integration tests.

---

## 27. No Deferred Infrastructure in CI

The current CI baseline does not introduce infrastructure without an accepted test or runtime requirement.

CI currently does not add:

```text
Redis
external search engine
message broker
vector database
MinIO
Mailpit
```

PostgreSQL is present because P2-M01 has concrete persistence integration tests requiring it.

This does not justify introducing unrelated infrastructure.

The rule remains:

```text
requirement first
infrastructure second
```

CI should validate the system that exists rather than pre-build speculative architecture.

---

## 28. Workflow Permissions and Credentials

The workflow explicitly configures:

```yaml
permissions:
  contents: read
```

The validation job does not require repository write access.

Repository checkout uses:

```yaml
persist-credentials: false
```

The workflow does not need to:

```text
push changes
create tags
modify repository state
retain GitHub credentials after checkout
```

CI permissions must follow least-privilege principles.

Broader workflow-token permissions require a concrete accepted need.

---

## 29. Concurrency and Timeout

The workflow groups runs using the workflow identity and Git reference.

Superseded in-progress runs for the same workflow/reference may be cancelled.

This prevents obsolete validation runs from consuming unnecessary CI capacity.

Cancellation must not be interpreted as success.

The newest relevant run must complete successfully.

The validation job currently uses:

```text
timeout: 30 minutes
```

A hung command should terminate rather than consume an unlimited runner session.

Timeout changes should be evidence-driven.

---

## 30. Local CI Simulation

Before pushing workflow changes, developers should run the closest practical equivalent locally.

On Windows CMD:

```bat
set "CI=true"
set "DATABASE_URL=postgresql://ai_world:ai_world@127.0.0.1:55432/ai_world"

pnpm install --frozen-lockfile
pnpm run infra:local:up
pnpm --filter @ai-world/foundation-database run prisma:migrate:deploy
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:integration
pnpm run test:e2e
pnpm run build
pnpm run architecture:check

set "DATABASE_URL="
set "CI="
```

The local PostgreSQL container may intentionally remain running for development.

Therefore the canonical simulation does not automatically execute:

```text
infra:local:down
```

Local validation is useful for catching repository failures before consuming remote CI capacity.

It does not replace the real GitHub-hosted Linux workflow.

---

## 31. Clean-Clone Acceptance

A clean clone must be capable of reproducing the repository validation contract from committed source, package metadata, lockfile, migrations, and documented infrastructure.

The standard clean validation sequence includes:

```bash
pnpm install --frozen-lockfile
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run architecture:check
```

For database-backed persistence validation, PostgreSQL must be available and committed migrations applied before:

```bash
pnpm run test:integration
```

For browser E2E execution on a fresh developer environment, Playwright Chromium may be installed through:

```bash
pnpm --filter @ai-world/web exec playwright install chromium
```

GitHub Actions installs Chromium and Linux system dependencies automatically through the workflow.

A clean-clone proof must not rely on:

```text
uncommitted generated state
manual database schema creation
developer-local packages
untracked configuration
hidden workstation services
```

---

## 32. CI Failure Triage

When CI fails, identify the exact failing stage before changing repository configuration.

Do not respond to a CI failure by broadly:

```text
disabling validation
loosening compiler rules
removing tests
switching away from frozen installs
bypassing migrations
adding unrelated infrastructure
changing package versions
changing runner versions
weakening architecture rules
```

without establishing the actual cause.

Recommended triage sequence:

```text
1. Identify the failing workflow step.
2. Read the first meaningful error.
3. Determine whether it reproduces locally.
4. Check Linux-specific behavior.
5. Check environment and database assumptions.
6. Check migration state when persistence is involved.
7. Make the smallest justified correction.
8. Re-run the relevant local validation.
9. Re-run the complete local validation when appropriate.
10. Push and verify the real GitHub Actions workflow.
```

---

## 33. Linux-Specific Failure Checks

When something works on Windows but fails in CI, inspect:

```text
filename and import casing
path separators
shell-specific commands
line endings
filesystem assumptions
executable availability
environment-variable assumptions
permissions
native dependency installation
PostgreSQL host and port assumptions
migration path casing
generated-client behavior
```

Do not assume a GitHub Actions failure is inherently a workflow-configuration problem.

CI may be correctly exposing a portability defect in repository code or tooling.

---

## 34. Database Failure Triage

When a database integration stage fails, inspect in this order:

```text
1. PostgreSQL service health.
2. DATABASE_URL.
3. Migration deployment result.
4. Prisma client generation.
5. Actual failing persistence test.
6. Database constraints.
7. Test cleanup.
```

Do not immediately reset or mutate the CI database manually.

CI databases are disposable.

The correct fix must remain reproducible from committed repository state.

---

## 35. Workflow Changes

Changes to:

```text
.github/workflows/ci.yml
```

must receive the same engineering discipline as application code.

Before committing a workflow change:

```text
format the YAML
inspect the diff
run relevant local validation
run git diff --check
inspect repository status
commit intentionally
push
verify the real GitHub Actions run
```

A workflow change is not fully validated until GitHub has successfully parsed and executed it.

---

## 36. Pull Request Validation

Pull requests targeting:

```text
main
```

execute the same validation job as pushes to:

```text
main
```

This ensures repository validation is available before merge.

Branch-protection and required-status-check policies are governance concerns separate from the existence of the workflow itself.

CI does not assume branch protection is already enabled.

---

## 37. Database Integration-Test Ownership

The current database integration-test contract is:

```text
service lifecycle
  → GitHub Actions PostgreSQL service

configuration
  → DATABASE_URL

schema setup
  → committed Prisma migrations

migration execution
  → prisma:migrate:deploy

integration execution
  → pnpm run test:integration

test isolation
  → test-owned records

cleanup
  → tests remove created records

health
  → pg_isready
```

Database infrastructure remains owned by:

```text
Database Foundation
```

Persistence behavior remains tested from the owning Platform boundaries.

Current Platform ownership is:

```text
Actor
  → Identity & Access Platform

User
  → User Platform
```

Future database-backed Platforms should extend the canonical integration lane rather than create unrelated database-test mechanisms.

---

## 38. CI Success Criteria

A current AI World CI run is successful only when all configured validation steps complete successfully.

The expected GitHub status is:

```text
CI / Validate ✅
```

The validated pipeline includes:

```text
Checkout repository
Setup pnpm
Setup Node.js
Start and health-check PostgreSQL
Install dependencies
Check formatting
Lint
Typecheck
Run default tests
Apply committed database migrations
Run database integration tests
Install Playwright Chromium
Run browser E2E tests
Build
Check architecture
```

A successful database integration test without successful migration deployment is insufficient.

A successful local run without successful GitHub Actions execution is insufficient for workflow validation.

---

## 39. Phase 1 Historical CI Baseline

P1-M12 originally established the following CI baseline:

```text
Platform
  GitHub Actions
  ubuntu-24.04

Triggers
  push → main
  pull request → main

Toolchain
  Node from .nvmrc
  pnpm from packageManager

Dependency policy
  frozen lockfile
  pnpm cache

Validation
  format
  lint
  typecheck
  unit/API/Web tests
  Chromium browser E2E
  build

Security
  contents: read
  checkout credentials not persisted

Execution
  CI=true
  explicit timeout
  superseded-run cancellation

Infrastructure
  no PostgreSQL service
  no Redis
  no search engine
  no queue broker
  no vector database

Acceptance
  local CI simulation succeeds
  real GitHub Actions CI / Validate succeeds
```

This remains the historical Phase 1 CI baseline.

It should not be rewritten retroactively as though PostgreSQL integration testing existed during Phase 1.

---

## 40. P2-M01 CI Extension

P2-M01 extends the Phase 1 baseline with the first real Platform persistence validation.

The extension adds:

```text
PostgreSQL 18.4-alpine CI service
DATABASE_URL CI configuration
PostgreSQL health checking
committed Prisma migration deployment
root test:integration command
Turborepo test:integration task
Identity & Access persistence tests
User persistence tests
database cleanup verification
architecture validation in the complete CI contract
```

The resulting persistence lifecycle is:

```text
fresh database
  ↓
committed migration history
  ↓
canonical Actor/User schema
  ↓
Platform integration tests
  ↓
clean test-owned persistence
```

P2-M01 therefore proves that the shared Identity and User persistence baseline can be reconstructed and validated outside a developer workstation.

---

## 41. Current CI Infrastructure Boundary

The current CI infrastructure is intentionally limited to what validated capabilities require:

```text
GitHub-hosted Ubuntu runner
Node.js
pnpm
PostgreSQL
Playwright Chromium
```

Not currently justified:

```text
Redis
Kafka
RabbitMQ
Temporal
external search
graph database
vector database
MinIO
Mailpit
Kubernetes
service mesh
```

Infrastructure must enter CI only when an accepted capability introduces a real automated validation requirement.

---

## 42. Canonical CI Contract

The current AI World CI contract is:

```text
Repository
  install reproducibly from committed lockfile

Quality
  formatting
  lint
  TypeScript validation

Default testing
  Foundation tests
  API tests
  Web tests

Persistence
  PostgreSQL service
  committed migration deployment
  Identity & Access integration tests
  User integration tests
  deterministic cleanup

Browser
  Chromium Playwright E2E

Build
  all participating applications and packages

Architecture
  dependency-boundary validation

Security
  read-only GitHub contents permission
  checkout credentials not persisted

Execution
  Linux runner
  CI=true
  bounded timeout
  superseded-run cancellation

Configuration
  no developer-local .env dependency
  explicit CI-owned DATABASE_URL

Infrastructure policy
  requirement-driven only

Acceptance
  relevant local validation succeeds
  clean migrations reproduce schema
  integration tests succeed
  real GitHub Actions CI / Validate succeeds
```

This is the canonical Continuous Integration contract for the current AI World repository.
