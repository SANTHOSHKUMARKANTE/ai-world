# AI World Environment Architecture

## Status

Accepted implementation baseline for Phase 10 milestone P10-M01.

## Purpose

AI World has four application environments:

```text
development
test
staging
production
```

Environment identity is independent from infrastructure-provider selection.

P10-M01 defines environment semantics and configuration boundaries only. Cloud
providers, managed PostgreSQL, object storage, production email, observability
services, Infrastructure as Code, deployment promotion, backup, and alerting
belong to later Phase 10 milestones.

## Canonical environment identity

The API uses:

```text
AI_WORLD_ENV
```

with exactly:

```text
development
test
staging
production
```

`AI_WORLD_ENV` identifies the AI World deployment environment.

`NODE_ENV` retains Node.js ecosystem runtime semantics and is not used as the
AI World deployment-environment identity.

The required mapping is:

| AI_WORLD_ENV | NODE_ENV |
|---|---|
| `development` | `development` |
| `test` | `test` |
| `staging` | `production` |
| `production` | `production` |

This intentionally prevents `NODE_ENV=staging`.

Staging must exercise production-mode framework/runtime behavior while remaining
a distinct AI World environment for logs, configuration, data, credentials, and
future deployment controls.

## Environment responsibilities

### Development

Used for local developer work.

The existing local infrastructure baseline may provide:

```text
PostgreSQL
Mailpit
local filesystem Media storage
```

Local development may use safe local defaults.

### Test

Used for automated isolated validation.

Tests and CI must use disposable or isolated state and must not depend on staging
or production resources.

### Staging

Used for production-like pre-production verification.

Staging must be isolated from production for:

```text
database
Media/storage state
email credentials
AI/provider credentials
Secrets
operational telemetry
```

Staging uses:

```text
AI_WORLD_ENV=staging
NODE_ENV=production
```

Provider-specific resources are selected in P10-M02 and materialized later.

### Production

Used for live AI World operation.

Production uses:

```text
AI_WORLD_ENV=production
NODE_ENV=production
```

Production configuration and Secrets must be externally supplied. Production
must not depend on repository-committed secret values.

## Configuration boundary

Runtime configuration remains environment-variable driven and is validated at
application startup.

The existing API configuration continues to own validation of:

```text
PORT
DATABASE_URL
LOG_LEVEL
MEDIA_STORAGE_ROOT
EMAIL_SMTP_*
EMAIL_FROM
OPENAI_API_KEY
```

P10-M01 adds validated environment identity; it does not select provider-specific
values for those settings.

Repository examples may contain safe local non-secret defaults only.

Secrets such as:

```text
database credentials
SMTP credentials
AI provider keys
future cloud/provider credentials
```

must not be committed.

Secret-manager/provider selection is deferred to P10-M02/P10-M03 as appropriate.

## Structured logging

Structured API logs carry the canonical AI World environment identity.

Therefore:

```text
environment=development
environment=test
environment=staging
environment=production
```

is distinct even though staging and production both use:

```text
NODE_ENV=production
```

This supports later metrics, tracing, alerting, and incident investigation
without introducing those capabilities in P10-M01.

## Web boundary

The browser continues to call same-origin:

```text
/api/*
```

The Next.js application continues to route that path using:

```text
AI_WORLD_API_ORIGIN
```

`AI_WORLD_API_ORIGIN` is deployment configuration, not a public browser secret.

P10-M01 does not add provider-specific Web configuration or public environment
variables.

## Isolation rule

Staging and production must never intentionally share canonical mutable state.

At minimum, later provider/deployment work must keep distinct:

```text
PostgreSQL databases
Media/object-storage state
Secrets and credentials
email delivery credentials/configuration
operational telemetry dimensions
```

Development and test must likewise remain isolated from staging and production.

## Promotion rule

Environment promotion means promoting a validated application revision and
configuration contract between environments.

It does not mean copying live mutable production data backward into lower
environments.

The concrete staging-to-production deployment/promotion mechanism belongs to
P10-M04 Deployment Pipeline.

## P10-M01 non-goals

This milestone does not introduce:

```text
cloud hosting
managed PostgreSQL provider
object storage provider
production email provider
observability provider
Terraform
Pulumi
Kubernetes
deployment automation
metrics
OpenTelemetry
alerting
backup
disaster recovery
microservices
```

Those decisions remain governed by their own Phase 10 milestones and evidence
gates.
