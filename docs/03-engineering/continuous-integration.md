# AI World Continuous Integration

## 1. Purpose

This document defines the canonical Continuous Integration baseline for AI World.

Phase 1 CI exists to prove that the repository can be installed, validated, tested, and built reproducibly outside a developer workstation.

The canonical CI implementation is GitHub Actions.

The authoritative workflow is:

```text
.github/workflows/ci.yml
```

---

## 2. Phase 1 CI Contract

The Phase 1 roadmap requires CI validation for:

```text
install
format
lint
typecheck
tests
build
```

AI World additionally runs the existing browser E2E baseline through Playwright.

The complete Phase 1 validation pipeline is therefore:

```text
install
  ↓
format
  ↓
lint
  ↓
typecheck
  ↓
unit/integration tests
  ↓
browser E2E tests
  ↓
build
```

A successful CI run means all of these stages completed successfully on the GitHub-hosted Linux runner.

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

This provides validation both before changes are merged through pull requests and after changes reach the canonical branch.

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

---

## 5. Runner Baseline

The workflow uses:

```text
ubuntu-24.04
```

as the GitHub-hosted runner.

This intentionally provides a Linux validation environment even when development occurs on Windows.

CI therefore helps detect environment-specific problems such as:

```text
case-sensitive paths
Linux command resolution
line-ending issues
Playwright Linux dependencies
Next.js Linux builds
Prisma generation on Linux
workspace dependency behavior
```

A change is not considered CI-safe merely because it succeeds on one developer machine.

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

CI must not independently drift from the repository-pinned runtime or package-manager versions.

---

## 7. GitHub Actions Used

The Phase 1 workflow uses:

```text
actions/checkout@v6.0.2
pnpm/action-setup@v6.0.9
actions/setup-node@v6.4.0
```

The pnpm setup derives the package-manager version from the repository package metadata rather than duplicating the pnpm version inside the workflow.

Node setup derives the Node.js version from `.nvmrc`.

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

is therefore part of the reproducible build contract.

CI must fail if package manifests and the lockfile are inconsistent.

Do not replace the frozen install with an unconstrained install merely to make CI pass.

Dependency changes must update the lockfile intentionally.

---

## 9. Dependency Cache

The GitHub Actions Node setup enables pnpm dependency caching using:

```text
pnpm-lock.yaml
```

as the dependency cache input.

Caching may improve CI execution time, but CI correctness must never depend on a warm cache.

A clean runner must still be able to install and validate the repository successfully.

---

## 10. Formatting Validation

CI runs:

```bash
pnpm run format:check
```

This checks repository files managed by the canonical Prettier configuration.

Formatting validation is read-only.

CI must not automatically rewrite files to make the workflow succeed.

Formatting corrections belong in the committed change.

---

## 11. Lint Validation

CI runs:

```bash
pnpm run lint
```

The root lint command validates repository-level JavaScript tooling and all participating workspace packages.

Current root behavior includes:

```text
scripts/**/*.mjs
```

and package lint tasks orchestrated through Turborepo.

A lint failure must be fixed in source rather than hidden by loosening rules without an accepted engineering reason.

---

## 12. Typecheck Validation

CI runs:

```bash
pnpm run typecheck
```

Turborepo executes package typechecking according to the workspace dependency graph.

The database foundation performs Prisma generation when required before dependent TypeScript validation.

TypeScript validation remains strict according to the repository's accepted compiler configuration.

---

## 13. Unit and Integration Tests

CI runs:

```bash
pnpm run test
```

The current automated test baseline includes:

```text
Foundation configuration tests
Foundation error-model tests
API integration tests
Web component tests
```

API integration tests do not require a live PostgreSQL service.

The test application intentionally supports verification of behavior when the database is unavailable.

---

## 14. Browser E2E Tests

The Web application owns Playwright.

Before browser E2E execution, CI installs Chromium and the required Linux system dependencies through the Web workspace.

The workflow command is:

```bash
pnpm --filter @ai-world/web exec playwright install --with-deps chromium
```

Browser tests then run through:

```bash
pnpm run test:e2e
```

The Phase 1 browser baseline uses Chromium.

Playwright starts its own Web development server for the E2E run.

The browser E2E baseline must not depend on a manually running local Web process.

---

## 15. Build Validation

CI runs:

```bash
pnpm run build
```

The build validates all participating buildable packages and applications through Turborepo.

This currently includes the NestJS API, Next.js Web application, and buildable Foundation packages.

A successful test suite does not replace build validation.

Both must succeed.

---

## 16. CI Environment

The workflow sets:

```text
CI=true
```

for the validation job.

This ensures tools can use their CI-specific behavior where configured.

For example, Playwright may adjust:

```text
forbidOnly
retries
workers
```

when running in CI.

Local validation may simulate this environment with:

```bat
set "CI=true"
```

on Windows CMD.

After local simulation:

```bat
set "CI="
```

clears the variable.

---

## 17. No Application `.env` in CI

The Phase 1 validation workflow does not create:

```text
.env
```

and does not require local-development environment values.

This is intentional.

The standard validation path must not depend on developer-local configuration.

Secrets or runtime configuration should only be introduced into CI when a validated test or workflow requirement actually needs them.

---

## 18. No PostgreSQL Service in Initial CI

The Phase 1 CI workflow does not start PostgreSQL.

This is intentional because the current automated validation suite does not require a live database.

The current validation responsibilities are:

```text
format             → no database
lint               → no database
typecheck          → no database
Foundation tests   → no database
API tests          → no live database
Web tests          → no database
browser E2E        → Web-only baseline
build              → no runtime database
```

Do not add PostgreSQL to CI merely because PostgreSQL exists in local development.

When real database integration tests require PostgreSQL, CI may introduce a PostgreSQL service as part of the milestone that owns those tests.

---

## 19. No Deferred Infrastructure in CI

The initial CI baseline does not introduce:

```text
Redis
Search engine
Queue broker
Vector database
MinIO
Mailpit
```

Infrastructure belongs in CI only when an accepted validation requirement needs it.

CI should validate the system that exists, not pre-build speculative infrastructure.

---

## 20. Workflow Permissions

The workflow explicitly configures:

```yaml
permissions:
  contents: read
```

The validation job does not require repository write access.

CI permissions should follow least-privilege principles.

Do not grant broader workflow-token permissions without a concrete requirement.

---

## 21. Checkout Credentials

Repository checkout uses:

```yaml
persist-credentials: false
```

The validation workflow does not need to push changes, create tags, modify repository state, or retain GitHub credentials after checkout.

---

## 22. Concurrency

The workflow groups runs by workflow and Git reference.

Superseded in-progress runs for the same workflow/reference may be cancelled.

This prevents obsolete validation runs from consuming unnecessary CI capacity after a newer commit has replaced them.

Concurrency cancellation must not be interpreted as a successful validation result.

The newest relevant run must still complete successfully.

---

## 23. Workflow Timeout

The validation job has an explicit timeout.

The Phase 1 baseline uses:

```text
30 minutes
```

A hung command should eventually terminate rather than consume an unlimited runner session.

The timeout may be revisited when repository scale provides evidence that a different limit is justified.

---

## 24. Local CI Simulation

Before pushing workflow changes, developers can run the primary CI sequence locally.

On Windows CMD:

```bat
set "CI=true"

pnpm install --frozen-lockfile
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:e2e
pnpm run build

set "CI="
```

This is useful for catching repository failures before using remote CI capacity.

Local execution does not replace the GitHub Actions run.

A real Linux-hosted workflow execution remains required to prove the CI configuration itself.

---

## 25. Clean-Clone Acceptance

The Phase 1 CI acceptance rule is that a clean clone must be buildable and testable through documented commands and CI.

The expected clean validation sequence is:

```bash
pnpm install --frozen-lockfile
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:e2e
pnpm run build
```

For browser E2E execution on a fresh environment, required Playwright browser binaries must also be installed.

On CI this is handled by the workflow.

A developer machine may use:

```bash
pnpm --filter @ai-world/web exec playwright install chromium
```

when Chromium is not already installed for Playwright.

---

## 26. CI Failure Triage

When CI fails, identify the exact failing step before changing configuration.

Do not respond to CI failures by broadly:

```text
disabling validation
loosening compiler rules
removing tests
switching to non-frozen installs
adding unrelated infrastructure
changing package versions
changing runner versions
```

without first establishing the actual cause.

Recommended triage sequence:

```text
1. Identify the failing workflow step.
2. Read the first meaningful error.
3. Determine whether the failure reproduces locally.
4. Check for Linux-specific behavior.
5. Make the smallest justified correction.
6. Re-run the relevant local validation.
7. Push and verify the real workflow again.
```

---

## 27. Linux-Specific Failure Checks

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
```

Do not assume a GitHub Actions failure is inherently a GitHub Actions configuration problem.

The workflow may be correctly exposing a portability defect in repository code.

---

## 28. Workflow Changes

Changes to:

```text
.github/workflows/ci.yml
```

must receive the same engineering discipline as application code.

Before committing a workflow change:

```text
format the YAML
inspect the diff
run relevant validation locally
check staged whitespace
push
verify the real GitHub Actions run
```

A workflow change is not fully validated until GitHub has successfully parsed and executed it.

---

## 29. Pull Request Validation

Pull requests targeting `main` execute the same validation job as pushes to `main`.

This ensures the baseline checks are available before merge.

Repository branch-protection or required-status-check policy is separate from the existence of CI itself and should be configured intentionally when repository governance requires it.

The CI workflow does not assume that branch protection is already enabled.

---

## 30. Future Database Integration Tests

When real database integration tests are introduced, the owning milestone should define:

```text
database service lifecycle
test database configuration
migration application
test isolation
cleanup behavior
CI health checks
failure diagnostics
```

The PostgreSQL CI service should be introduced at that time rather than preemptively.

The same requirement-driven rule applies to all other infrastructure.

---

## 31. CI Success Criteria

A Phase 1 CI run is successful only when all configured validation steps complete successfully.

The expected status is:

```text
CI / Validate ✅
```

The validated pipeline includes:

```text
Checkout repository
Setup pnpm
Setup Node.js
Install dependencies
Check formatting
Lint
Typecheck
Run tests
Install Playwright Chromium
Run browser E2E tests
Build
```

---

## 32. Phase 1 CI Contract

P1-M12 establishes the following CI baseline:

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
  unit/integration tests
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
  no PostgreSQL service yet
  no Redis
  no search engine
  no queue broker
  no vector database

Acceptance
  local CI simulation succeeds
  real GitHub Actions CI / Validate succeeds
```

This is the canonical Phase 1 Continuous Integration baseline for AI World.