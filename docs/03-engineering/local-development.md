# AI World Local Development

## 1. Purpose

This document defines the canonical local development workflow for AI World.

The Phase 1 local infrastructure baseline is intentionally minimal.

The initial local infrastructure dependency is:

```text
PostgreSQL
```

provided through Docker Compose.

The initial local stack does not include Redis, a search engine, a queue broker, or a vector database.

Additional infrastructure must only be introduced when a later accepted milestone or demonstrated platform requirement justifies it.

---

## 2. Local Architecture

The canonical local development topology is:

```text
Developer Machine
│
├── Web
│   └── http://127.0.0.1:3000
│
├── API
│   └── http://127.0.0.1:3001
│
└── Docker Desktop / Docker Engine
    │
    └── ai-world-local
        └── PostgreSQL 18.4
            ├── container port: 5432
            └── host port: 55432
```

The application processes run directly through pnpm.

Infrastructure runs through Docker Compose.

---

## 3. Required Toolchain

Use the repository-pinned toolchain.

```text
Node.js: 24.18.1
pnpm:    10.17.1
```

Docker Desktop or another compatible Docker Engine with Docker Compose support is required for local PostgreSQL.

Verify the local toolchain with:

```bash
node --version
pnpm --version
docker --version
docker compose version
docker info
```

On Windows, `pnpm.cmd` may be used explicitly when necessary.

---

## 4. Environment Setup

The tracked environment template is:

```text
.env.example
```

The local environment file is:

```text
.env
```

`.env` is intentionally ignored by Git and must never be committed.

The canonical local values are:

```dotenv
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
DATABASE_URL=postgresql://ai_world:ai_world@127.0.0.1:55432/ai_world
```

Create the local environment file from the template.

Windows CMD:

```bat
copy .env.example .env
```

Unix-like shell:

```bash
cp .env.example .env
```

Do not add credentials or environment-specific secrets to `.env.example`.

---

## 5. Environment Loading

Local commands that require application environment variables load `.env` through:

```text
scripts/local-pnpm.mjs
```

The launcher uses Node's environment-file support and then executes pnpm with the resulting environment.

The local development path is:

```text
.env
  ↓
scripts/local-pnpm.mjs
  ↓
process.env
  ↓
pnpm
  ↓
Turborepo
  ↓
application process
```

Turborepo remains in strict environment mode.

The development task explicitly permits the required variables through its environment allow-list:

```text
NODE_ENV
PORT
DATABASE_URL
LOG_LEVEL
```

Do not switch the repository to loose Turbo environment handling merely to simplify local development.

---

## 6. Local Infrastructure

The canonical Compose definition is:

```text
infrastructure/local/compose.yml
```

The Compose project name is:

```text
ai-world-local
```

The initial stack contains only PostgreSQL.

PostgreSQL uses:

```text
Image:       postgres:18.4-alpine
Host:        127.0.0.1
Host port:   55432
Container:   5432
Database:    ai_world
User:        ai_world
```

The host binding is loopback-only so the development database is not intentionally exposed on all network interfaces.

---

## 7. PostgreSQL Persistence

PostgreSQL data is stored in the Docker named volume:

```text
ai-world-local_postgres_data
```

Stopping or removing the local container must not normally destroy database state.

The following commands preserve the named volume:

```bash
pnpm infra:local:stop
pnpm infra:local:down
```

The equivalent destructive operation:

```text
docker compose down -v
```

deletes the named volume and local database state.

There is intentionally no root package script that performs this destructive operation.

Use destructive volume removal only when an explicit local database reset is required and the data loss is understood.

---

## 8. Infrastructure Commands

Start or recreate the local infrastructure:

```bash
pnpm infra:local:up
```

Inspect infrastructure status:

```bash
pnpm infra:local:status
```

Follow PostgreSQL logs:

```bash
pnpm infra:local:logs
```

Stop the local infrastructure without removing containers:

```bash
pnpm infra:local:stop
```

Remove the local Compose containers and network while preserving the named volume:

```bash
pnpm infra:local:down
```

After starting PostgreSQL, wait until its status is healthy before expecting API readiness to succeed.

---

## 9. Database Connectivity

The canonical local PostgreSQL URL is:

```text
postgresql://ai_world:ai_world@127.0.0.1:55432/ai_world
```

PostgreSQL listens on container port `5432`, while the host publishes it on `55432`.

The non-default host port intentionally reduces collisions with other PostgreSQL installations or legacy development environments.

---

## 10. Database Seed

Run the database seed baseline with:

```bash
pnpm db:seed
```

The root command loads `.env` automatically before executing the database package seed.

The seed baseline performs a real PostgreSQL query to prove database connectivity.

At the current platform-foundation stage, the seed intentionally creates no fake canonical data.

Successful output includes:

```text
Database seed baseline complete. No canonical seed data is defined yet.
```

The seed command must fail when PostgreSQL cannot be reached.

This behavior is intentional because the seed baseline must prove real database connectivity rather than merely construct a Prisma client.

---

## 11. Prisma Migration Policy

Prisma migration infrastructure is configured and available.

The current schema contains no canonical application models, so no artificial empty migration is created merely to make migration status appear successful.

Until the first real canonical model exists, this result is expected:

```text
No migration found in prisma/migrations
The current database is not managed by Prisma Migrate.
```

The first committed migration should represent the first real schema change.

Do not create fake or meaningless schema objects solely to establish migration history.

---

## 12. Starting Development

Ensure local infrastructure is running:

```bash
pnpm infra:local:up
```

Optionally verify:

```bash
pnpm infra:local:status
```

Seed or verify database connectivity when needed:

```bash
pnpm db:seed
```

Start the development applications:

```bash
pnpm dev
```

The root development command loads `.env` automatically and starts application development tasks through Turborepo.

Manual shell exports for `NODE_ENV`, `PORT`, `LOG_LEVEL`, and `DATABASE_URL` are not required during the normal local workflow.

---

## 13. Local Application Ports

The canonical Phase 1 local ports are:

```text
Web:          3000
API:          3001
PostgreSQL:  55432
Playwright:   3100
```

The Web development server is explicitly pinned to:

```text
http://127.0.0.1:3000
```

The API development environment uses:

```text
http://127.0.0.1:3001
```

Playwright uses a separate Web development port so browser E2E execution does not depend on or collide with the normal developer Web process.

---

## 14. API Health Endpoints

The API exposes separate liveness and readiness endpoints.

### Liveness

```text
GET /health/live
```

Example:

```bash
curl http://127.0.0.1:3001/health/live
```

Successful response:

```json
{
  "status": "ok"
}
```

Liveness answers whether the API process is running.

It does not query PostgreSQL.

A database outage must not make API liveness fail.

### Readiness

```text
GET /health/ready
```

Example:

```bash
curl http://127.0.0.1:3001/health/ready
```

Healthy response:

```json
{
  "status": "ok",
  "checks": {
    "database": "up"
  }
}
```

Readiness performs a real PostgreSQL query through the database foundation.

If PostgreSQL is unavailable, readiness returns HTTP `503`.

The public failure response is safe and transport-specific:

```json
{
  "error": {
    "code": "http.service_unavailable",
    "message": "Service unavailable.",
    "status": 503,
    "requestId": "<request-id>"
  }
}
```

The underlying database exception remains available in structured server logs for diagnostics and is not exposed in the client response.

---

## 15. Expected Health Semantics

The expected behavior is:

```text
API running + PostgreSQL running
--------------------------------
/health/live   → 200
/health/ready  → 200

API running + PostgreSQL stopped
--------------------------------
/health/live   → 200
/health/ready  → 503

PostgreSQL recovered
--------------------------------
/health/ready  → 200
```

These semantics must remain distinct.

Do not introduce database access into the liveness check.

---

## 16. Daily Development Workflow

A normal local development session is:

```bash
pnpm infra:local:up
pnpm dev
```

When database seed verification is needed:

```bash
pnpm db:seed
```

Useful status command:

```bash
pnpm infra:local:status
```

When development is finished, application processes may be stopped with the terminal interrupt command.

PostgreSQL may remain running, or it may be stopped with:

```bash
pnpm infra:local:stop
```

Its named volume remains persistent.

---

## 17. Fresh Local Setup

For a clean clone or a new development machine:

```text
1. Install the repository-pinned Node.js version.
2. Enable the repository-pinned pnpm version.
3. Install and start Docker Desktop or another compatible Docker Engine.
4. Install repository dependencies with the frozen lockfile.
5. Copy .env.example to .env.
6. Start local PostgreSQL.
7. Verify or run the seed baseline.
8. Start development applications.
```

Commands:

```bash
pnpm install --frozen-lockfile
pnpm infra:local:up
pnpm infra:local:status
pnpm db:seed
pnpm dev
```

Expected services:

```text
Web           http://127.0.0.1:3000
API           http://127.0.0.1:3001
PostgreSQL    127.0.0.1:55432
```

---

## 18. Troubleshooting

### Docker CLI exists but Docker Engine is unavailable

A command such as:

```bash
docker info
```

must return both client and server information.

If it reports that the Docker API or Docker Desktop Linux engine cannot be reached, start Docker Desktop and wait for the engine to become available before starting local infrastructure.

### PostgreSQL is starting

Immediately after startup, status may temporarily report:

```text
health: starting
```

Wait until:

```text
healthy
```

before testing API readiness.

### API fails because DATABASE_URL is missing

Normal `pnpm dev` execution loads `.env` automatically.

Verify that:

```text
.env
```

exists at the repository root and contains the required values.

Do not solve missing configuration by weakening API configuration validation.

### API liveness succeeds but readiness fails

If:

```text
/health/live   → 200
/health/ready  → 503
```

the API process is healthy but its database dependency is unavailable.

Check:

```bash
pnpm infra:local:status
```

and inspect PostgreSQL logs if necessary:

```bash
pnpm infra:local:logs
```

### Port collision

Canonical ports are:

```text
3000
3001
3100
55432
```

On Windows, inspect a conflicting port with:

```bat
netstat -ano | findstr LISTENING
```

Identify an existing process before terminating or changing anything.

Do not arbitrarily change canonical project ports to work around an unidentified process.

---

## 19. Initial Infrastructure Boundary

Phase 1 deliberately avoids infrastructure that has not yet demonstrated value.

Do not add the following to the initial local stack:

```text
Redis
Search engine
Queue broker
Vector database
```

The local infrastructure baseline remains PostgreSQL-only until an accepted later requirement changes that decision.

The same general principle applies to other optional infrastructure: add capabilities when the owning platform requires them rather than pre-building speculative infrastructure.

---

## 20. Validation Commands

Repository validation remains:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Local infrastructure validation includes:

```bash
pnpm infra:local:status
pnpm db:seed
```

API runtime validation includes:

```bash
curl http://127.0.0.1:3001/health/live
curl http://127.0.0.1:3001/health/ready
```

Web runtime validation includes:

```bash
curl http://127.0.0.1:3000/
```

---

## 21. Phase 1 Local Development Contract

P1-M11 establishes the following local development contract:

```text
Infrastructure
  PostgreSQL 18.4
  Docker Compose
  persistent named volume
  loopback-only host exposure

Applications
  Web :3000
  API :3001

Database
  PostgreSQL :55432
  real Prisma connectivity
  repeatable seed baseline
  no fake migration

Environment
  .env.example tracked
  .env ignored
  automatic local environment loading
  strict Turbo environment propagation

Operations
  liveness independent of database
  readiness dependent on database
  safe public errors
  detailed structured server diagnostics

Developer workflow
  pnpm infra:local:up
  pnpm db:seed
  pnpm dev
```

This is the canonical Phase 1 local development baseline for AI World.