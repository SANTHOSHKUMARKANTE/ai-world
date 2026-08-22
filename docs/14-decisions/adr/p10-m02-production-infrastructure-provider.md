# Phase 10 P10-M02 — Production Infrastructure Provider Decision

## Status

ACCEPTED

## Date

2026-08-22

## Phase

Phase 10 — Production Operations

## Milestone

P10-M02 — Production Infrastructure Provider

## Baseline

```text
P10-M01 ROADMAP CLOSURE
7c5e963c134df7c6b5a37e1ad04754f8a831ee48

SUBJECT
docs(roadmap): close P10-M01 Environment Architecture

P10-M01 IMPLEMENTATION
14c81048cf117b27098ecfcef521f69d530317a0
feat(operations): add environment architecture

PHASE 9 COMPLETION TAG
phase-9-complete

REMOTE/LOCAL TAG OBJECT
0afbe0d0a18a293249db37e40471c972032c1e6a

TAG PEELED TARGET
844329fa7848ebce774dca21cd8d6ab348ac9db1
```

## Decision

AI World selects the following initial production provider stack:

```text
PRIMARY CLOUD / HOSTING
DigitalOcean
DigitalOcean App Platform

MANAGED CANONICAL POSTGRESQL
DigitalOcean Managed PostgreSQL

OBJECT STORAGE
DigitalOcean Spaces Standard Storage

PRODUCTION TRANSACTIONAL EMAIL
Postmark
SMTP transport

OBSERVABILITY
Better Stack
Telemetry + Uptime

INITIAL PRIMARY REGION
DigitalOcean BLR / BLR1
Bangalore

RUNTIME SECRET DELIVERY
DigitalOcean App Platform encrypted SECRET runtime environment variables
```

This decision selects providers and the initial production region only.

It does not create any provider account, cloud resource, database, bucket, email
server, telemetry source, domain, DNS record, secret, credential, or deployment.

It installs no Provider SDK.

Infrastructure materialization begins only after P10-M02 is closed and the
roadmap advances to:

```text
P10-M03 — Infrastructure as Code
```

## Why Selection Happens Now

P10-M01 formalized four application environments:

```text
development
test
staging
production
```

with staging and production required to remain isolated for mutable state,
credentials, Secrets, and operational telemetry.

P10-M02 must now select the production providers that later milestones can
materialize reproducibly.

The decision is intentionally made before P10-M03 so the IaC strategy is driven
by actual providers rather than by speculative infrastructure abstractions.

## Current Runtime Shape

AI World currently has:

```text
NestJS API
Next.js Web application
PostgreSQL canonical persistence
Media object storage abstraction
SMTP email delivery abstraction
OpenAI outbound HTTPS calls
structured HTTP logs
GitHub Actions CI
```

The repository already contains:

```text
S3CompatibleStorageAdapter
SmtpEmailDelivery
```

Therefore provider fit should prefer the existing owned boundaries instead of
forcing application code to adopt provider-specific SDK types.

## Decision Priorities

The provider decision follows the AI World decision order:

```text
1. Security
2. Data integrity
3. Correctness
4. Canonical ownership
5. Maintainability
6. Simplicity
7. User value
8. Developer experience
9. Reuse
10. Performance
11. Extensibility
12. Convenience
```

The practical production-provider criteria are:

```text
managed durability and recovery
private database connectivity
TLS
safe secret delivery
Node.js / Next.js / NestJS fit
monorepo deployment fit
S3-compatible object storage
SMTP compatibility
operational visibility
regional availability
IaC support
rollback path
provider exit path
predictable cost
minimum new infrastructure
```

## Primary Cloud Selection — DigitalOcean

AI World selects:

```text
DigitalOcean
```

as the primary production cloud.

The initial application hosting surface is:

```text
DigitalOcean App Platform
```

### Why

App Platform provides a managed PaaS deployment surface for Git repositories or
container images without requiring AI World to operate virtual machines,
Kubernetes, load balancers, or a container orchestrator.

Current DigitalOcean documentation supports:

```text
Node.js applications
Next.js applications
monorepo deployment
GitHub source deployment
health checks
zero-downtime style replacement of healthy revisions
rollback to recent successful deployments
encrypted runtime environment variables
VPC connectivity
runtime log forwarding
```

This matches the current modular-monolith application architecture.

### Region

The initial production region is:

```text
App Platform region
blr

DigitalOcean datacenter
blr1

location
Bangalore
```

The current DigitalOcean platform provides App Platform, PostgreSQL, Spaces, and
VPC support in Bangalore, which allows the initial compute, database, and object
storage resources to be co-located.

Region is an IaC parameter rather than an application-code constant.

A later performance or scaling review may change the preferred region if
measured user traffic justifies it.

This decision does not introduce multi-region active/active operation.

## Managed PostgreSQL Selection

AI World selects:

```text
DigitalOcean Managed PostgreSQL
```

for canonical production persistence.

### Required production properties

The selected service currently provides:

```text
managed PostgreSQL
daily backups
point-in-time recovery within the supported retention window
TLS
VPC placement / private connectivity
automated failure replacement
vertical scaling
optional standby/read-only nodes
```

Production and staging must use separate database resources.

The application continues to depend only on:

```text
DATABASE_URL
PostgreSQL semantics
Prisma
```

No DigitalOcean database SDK becomes part of Domain or Platform code.

### Connection rule

Production IaC/deployment work should prefer:

```text
private VPC connectivity
TLS certificate verification
sslmode=verify-full when supported by the deployed connection form
```

rather than exposing canonical persistence broadly to the public internet.

### Sizing and high availability

P10-M02 does not select final:

```text
CPU
RAM
storage allocation
standby count
connection-pool size
read replicas
```

Those values must be justified by the initial production budget and later
P10-M11 performance evidence.

## Object Storage Selection

AI World selects:

```text
DigitalOcean Spaces Standard Storage
```

for production Media objects.

### Why

Spaces exposes an S3-compatible object-storage interface.

AI World already owns:

```text
S3CompatibleStorageAdapter
```

with an AI World-owned object-storage client boundary.

Therefore Spaces fits the existing architecture without making a
DigitalOcean-specific storage model canonical.

### Access rule

Use a dedicated application access key with only the minimum bucket permissions
required by the API.

Production and staging must use separate buckets and credentials.

Bucket names, endpoints, keys, and credentials are runtime/IaC configuration.

### Backup caveat

Spaces does not itself satisfy P10-M08 Backup.

Current Spaces documentation states that built-in object backup is not included.

Therefore:

```text
P10-M08 — Backup
```

must explicitly establish object-storage protection, such as independent copy,
versioning/retention strategy, or another accepted recovery mechanism.

Provider selection must not falsely treat object storage availability as backup.

## Production Email Selection

AI World selects:

```text
Postmark
```

for production transactional email.

The transport remains:

```text
SMTP
```

### Why

The existing Email Foundation already owns an SMTP delivery boundary.

Postmark provides SMTP delivery with TLS and is focused on transactional email,
which matches current AI World use cases such as:

```text
email verification
password recovery
security/account messages
```

The initial production integration can therefore use the existing:

```text
EMAIL_SMTP_HOST
EMAIL_SMTP_PORT
EMAIL_SMTP_SECURE
EMAIL_SMTP_USERNAME
EMAIL_SMTP_PASSWORD
EMAIL_FROM
```

configuration without adding the Postmark SDK.

### Production configuration direction

Use:

```text
smtp.postmarkapp.com
TLS / STARTTLS-capable SMTP port
Postmark transactional message stream
verified sending domain
SPF
DKIM
DMARC
```

Exact credentials are Secrets and must never be committed.

### Why not select Resend initially

Resend is technically viable and supports both API and SMTP transactional
delivery.

It remains a credible future alternative.

Postmark is selected initially because the current requirement is narrowly
transactional, the existing AI World boundary is SMTP, and Postmark's product
surface is explicitly organized around transactional message streams and
delivery diagnostics.

This is not a claim that Resend is generally inferior.

## Observability Selection

AI World selects:

```text
Better Stack
Telemetry + Uptime
```

as the initial external observability service.

DigitalOcean's native App Platform logs, insights, health checks, and deployment
history remain useful provider-level operational signals.

Better Stack is the selected cross-cutting external destination.

### Why

Current DigitalOcean App Platform supports direct runtime-log forwarding to
Better Stack.

Better Stack currently provides a single service family for:

```text
logs
metrics
traces
error tracking
uptime monitoring
alerts / incident response
status pages
```

and exposes Terraform providers for monitoring and telemetry resources.

This gives later Phase 10 milestones one coherent destination without requiring
those capabilities to be implemented now.

### Important boundary

Selecting Better Stack does not automatically activate:

```text
P10-M05 Metrics
P10-M06 Distributed Tracing
P10-M07 Alerting
```

Those milestones retain their own evidence and implementation gates.

In particular:

```text
distributed tracing remains conditional
```

and must not be introduced merely because Better Stack can ingest traces.

## Runtime Secrets

For the initial App Platform deployment, runtime Secrets are delivered through:

```text
DigitalOcean App Platform
SECRET environment variables
RUN_TIME scope
```

Secrets include at least:

```text
DATABASE_URL or database credentials
Spaces access credentials
Postmark SMTP credentials
OPENAI_API_KEY
Better Stack ingestion credentials when required
```

Provider console access and code/configuration permissions must be restricted
because runtime Secrets can ultimately be accessed by sufficiently privileged
operators or code.

P10-M10 Security Hardening must review this control before final production
readiness closure.

No separate Vault, Kubernetes Secret store, or other secret-management product
is introduced by P10-M02.

## IaC Consequence

P10-M03 should evaluate and implement the minimum IaC strategy for the accepted
stack.

The current provider evidence strongly supports evaluating:

```text
Terraform
```

because DigitalOcean has an official Terraform provider covering platform
resources and Better Stack exposes Terraform providers for telemetry/monitoring.

P10-M02 does not itself select a Terraform version or create Terraform files.

Postmark account/domain configuration may require a documented/manual bootstrap
step if a suitable accepted IaC surface is not available.

P10-M03 must distinguish:

```text
fully managed IaC resources
bootstrap resources
Secrets that must not enter Terraform state
```

rather than pretending every external provider action is equally automatable.

## Deployment Consequence

P10-M04 should own the actual controlled deployment path.

The accepted target topology is conceptually:

```text
GitHub
  |
  v
DigitalOcean App Platform
  |
  +-- Web component
  |
  +-- API component
        |
        +-- private Managed PostgreSQL
        |
        +-- Spaces
        |
        +-- Postmark SMTP
        |
        +-- OpenAI API
        |
        +-- Better Stack telemetry
```

The exact public/internal routing arrangement, health gates, migration job,
rollback command, and staging-to-production promotion mechanism belong to
P10-M04.

## Candidate Set Considered

The bounded primary-cloud candidates were:

```text
DigitalOcean
Render
AWS
Google Cloud
```

All are technically credible.

The decision is about fit for the current AI World production shape, not a
universal cloud ranking.

## Why Render Is Not Selected

Render is a credible PaaS and provides:

```text
Node services
managed PostgreSQL
private networking
PITR on paid PostgreSQL
Blueprint IaC
official Terraform provider
Singapore region
```

However, for the current AI World scope:

```text
no India compute region is currently listed;
object storage would require another provider;
```

while DigitalOcean can keep compute, PostgreSQL, and S3-compatible object
storage inside one primary cloud and co-locate them in Bangalore.

Render remains a valid future migration target because AI World keeps
PostgreSQL, object storage, email, and observability behind owned/configured
boundaries.

## Why AWS Is Not Selected

AWS is technically capable of hosting the complete stack and remains a valid
future scale or compliance option.

It is not selected for the initial production architecture because the simplest
managed application surfaces become materially more complex once private
database networking and current external dependencies are combined.

For example, current AWS App Runner documentation states that when an App Runner
service sends outbound traffic through a VPC connector, it loses direct public
internet access unless NAT or suitable VPC endpoints are added.

AI World currently requires public outbound connectivity for at least:

```text
OpenAI API
transactional email provider
```

Adding VPC/NAT/networking machinery at P10-M02 would violate the project's
minimum-architecture rule without current scale, security-boundary, or
compliance evidence requiring it.

AWS is not rejected permanently.

## Why Google Cloud Is Not Selected

Google Cloud Run and Cloud SQL are technically strong and remain credible future
alternatives.

DigitalOcean is selected because its current App Platform + Managed PostgreSQL +
Spaces combination maps more directly to the existing application shape,
including the already-implemented S3-compatible storage boundary, while keeping
the initial operational surface smaller.

No claim is made that Google Cloud is technically inadequate.

## Cost Position

P10-M02 does not freeze instance sizes or a final monthly production budget.

Current published provider pricing shows that the selected stack can begin with
small managed resources and scale vertically later.

The final operational cost baseline belongs to:

```text
P10-M13 — Cost Visibility
```

and compute/database sizing must also be revisited against:

```text
P10-M11 — Performance Baseline
```

Do not optimize the architecture around promotional/free-tier limits.

## Provider Lock-In Control

Provider selection does not transfer canonical ownership to any provider.

Canonical boundaries remain:

```text
PostgreSQL
DATABASE_URL
Prisma-owned persistence integration

StorageObjectStore
S3CompatibleStorageAdapter

EmailDelivery
SMTP

structured application logs
future AI World-owned metrics/tracing instrumentation
```

Provider SDK/client types must not spread through Platform or Universe Domain
contracts.

A future provider change should primarily affect:

```text
IaC
runtime configuration
provider adapters/clients
operational documentation
```

rather than canonical Domain Models.

## Explicit Non-Goals

P10-M02 does not introduce:

```text
Terraform files
Pulumi
Kubernetes
Docker orchestration
new microservices
service extraction
production cloud resources
staging cloud resources
provider accounts
API tokens
database credentials
Spaces keys
Postmark credentials
Better Stack credentials
DNS changes
custom domains
deployment workflow
migration workflow
backup implementation
DR implementation
metrics instrumentation
OpenTelemetry
distributed tracing
alert rules
runbooks
autoscaling policy
final production sizing
multi-region operation
```

## Decision Sources

Official/current sources reviewed for this decision on 2026-08-22:

```text
DigitalOcean App Platform
https://docs.digitalocean.com/products/app-platform/

DigitalOcean App Platform Pricing
https://docs.digitalocean.com/products/app-platform/details/pricing/

DigitalOcean App Platform Availability
https://docs.digitalocean.com/products/app-platform/details/availability/

DigitalOcean Monorepo Deployment
https://docs.digitalocean.com/products/app-platform/how-to/deploy-from-monorepo/

DigitalOcean App Platform VPC
https://docs.digitalocean.com/products/app-platform/how-to/enable-vpc/

DigitalOcean Managed PostgreSQL
https://docs.digitalocean.com/products/databases/postgresql/

DigitalOcean Managed Database Backups / Restore
https://docs.digitalocean.com/products/databases/postgresql/how-to/restore-from-backups/

DigitalOcean Spaces
https://docs.digitalocean.com/products/spaces/

DigitalOcean Spaces Access
https://docs.digitalocean.com/products/spaces/how-to/manage-access/

DigitalOcean Spaces Limits
https://docs.digitalocean.com/products/spaces/details/limits/

DigitalOcean App Platform Log Forwarding
https://docs.digitalocean.com/products/app-platform/how-to/forward-logs/

DigitalOcean Terraform Provider
https://docs.digitalocean.com/reference/terraform/

Postmark Pricing
https://postmarkapp.com/pricing

Postmark SMTP
https://postmarkapp.com/developer/user-guide/send-email-with-smtp

Better Stack Pricing
https://betterstack.com/pricing

Better Stack Terraform
https://betterstack.com/docs/getting-started/integrations/terraform/

Render Regions
https://render.com/docs/regions

Render Postgres
https://render.com/docs/postgresql

Render Terraform Provider
https://render.com/docs/terraform-provider

AWS App Runner VPC Networking
https://docs.aws.amazon.com/apprunner/latest/dg/network-vpc.html
```

Provider capabilities, pricing, limits, regions, and policies can change.

P10-M03 and P10-M04 must re-check the concrete provider APIs/specifications used
by IaC and deployment at implementation time.

## Decision Outcome

```text
P10-M02 — PRODUCTION INFRASTRUCTURE PROVIDER
ACCEPTED

PRIMARY CLOUD
DigitalOcean

HOSTING
DigitalOcean App Platform

MANAGED POSTGRESQL
DigitalOcean Managed PostgreSQL

OBJECT STORAGE
DigitalOcean Spaces Standard Storage

TRANSACTIONAL EMAIL
Postmark via SMTP

OBSERVABILITY
Better Stack Telemetry + Uptime

INITIAL PRIMARY REGION
BLR / BLR1 — Bangalore

PRODUCTION RESOURCES
NOT CREATED

INFRASTRUCTURE AS CODE
NOT IMPLEMENTED

P10-M03 — INFRASTRUCTURE AS CODE
NEXT AFTER P10-M02 DECISION COMMIT + CI + ROADMAP CLOSURE
```
