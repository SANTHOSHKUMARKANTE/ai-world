# Phase 10 P10-M03 — Infrastructure as Code Decision

## Status

ACCEPTED FOR IMPLEMENTATION

## Date

2026-08-22

## Phase

Phase 10 — Production Operations

## Milestone

P10-M03 — Infrastructure as Code

## Baseline

```text
P10-M02 ROADMAP CLOSURE
4346818ff2b843f10636427d1e412a5c4fd10640

SUBJECT
docs(roadmap): close P10-M02 Production Infrastructure Provider

P10-M02 PROVIDER DECISION
e29d3ec69fa2f0e1ba3c330aa1accf542b95ea0e

ACCEPTED PROVIDER ADR
docs/14-decisions/adr/p10-m02-production-infrastructure-provider.md
```

## Decision

AI World selects:

```text
Terraform
```

as the initial Infrastructure-as-Code technology for Phase 10.

The validated Terraform CLI line is:

```text
1.15.x
```

with the implementation candidate validated using:

```text
Terraform 1.15.8
```

The DigitalOcean provider is pinned by the Terraform dependency lock file to:

```text
digitalocean/digitalocean 2.99.1
```

P10-M03 establishes IaC source, state, locking, validation, and secret-handling
rules.

It does not apply infrastructure.

## Why Terraform

The accepted P10-M02 stack uses DigitalOcean as the primary cloud.

DigitalOcean publishes and maintains a Terraform provider that manages the core
resources AI World currently needs:

```text
Projects
VPCs
Managed PostgreSQL
database firewall rules
Spaces object storage
App Platform
```

Better Stack also exposes Terraform providers for later observability work.

Terraform therefore covers the current production architecture without adding a
second IaC language or custom provisioning framework.

## Repository Layout

The canonical production IaC root is:

```text
infrastructure/terraform/platform
```

The same source is applied separately to:

```text
staging
production
```

using distinct variable values and distinct remote state.

AI World does not duplicate a full Terraform source tree per environment.

Environment differences belong in inputs, not copied infrastructure code.

No module hierarchy is introduced yet.

A reusable module should be extracted only when a second real Terraform root
demonstrates meaningful reusable structure.

## Remote State

Terraform local state is not accepted for shared staging or production
operation.

AI World uses the Terraform S3 backend against DigitalOcean Spaces.

DigitalOcean's current Terraform backend guidance supports:

```text
S3-compatible Spaces backend
Terraform lock files
use_lockfile = true
backend credentials from environment variables
```

Staging and production use:

```text
separate state buckets
separate backend credentials
separate state objects
```

This keeps environment control boundaries independent.

The state bucket must exist before `terraform init`.

State-bucket creation is therefore a documented bootstrap action and is not
managed by the root whose state it stores.

No bootstrap Terraform root is added merely to move the same bootstrap-state
problem one level earlier.

## State Is Sensitive

Terraform state for DigitalOcean Managed PostgreSQL can contain provider-returned
connection information including database credentials.

Therefore state is treated as sensitive operational data.

Requirements:

```text
state bucket is private
state access uses least privilege
staging credentials cannot access production state
production credentials cannot be used for staging automation
state files are never committed
state is never pasted into issue/CI logs
state access is reviewed during P10-M10
```

The committed backend examples contain no access key or secret key.

Backend credentials use environment variables.

## Provider Credentials

Terraform configuration contains no DigitalOcean or Spaces credential variables.

Operational credentials are supplied through provider-supported environment
variables at execution time.

In particular, repository files must not contain:

```text
DigitalOcean API token
Spaces access key
Spaces secret key
Postmark SMTP credential
OpenAI API key
Better Stack API/ingestion token
database password
```

Secret `.tfvars` files are gitignored.

Committed `*.tfvars.example` files are non-secret documentation only.

## Initial Managed Resources

P10-M03 materializes the IaC definitions for:

```text
DigitalOcean Project
DigitalOcean VPC
DigitalOcean Managed PostgreSQL cluster
AI World PostgreSQL database
DigitalOcean database firewall
DigitalOcean Spaces Media bucket
Project resource assignment
```

The PostgreSQL major version is:

```text
18
```

because AI World CI already validates against PostgreSQL 18 and DigitalOcean
currently supports PostgreSQL 18.

The final compute/database size and node count remain inputs.

P10-M03 does not freeze production sizing.

## Database Firewall Apply Gate

P10-M03 defines the database firewall contract with an App Platform application
ID as a required input.

The configuration is intentionally not ready for `terraform apply` until:

```text
P10-M04 — Deployment Pipeline
```

materializes or otherwise supplies the managed App Platform identity.

This prevents an early P10-M03 apply from establishing canonical persistence
without its intended application access boundary.

P10-M04 may replace the temporary `database_trusted_app_id` input with a direct
reference to a Terraform-managed `digitalocean_app` resource when the deployment
topology is implemented.

## Object Storage Safety

The Media Spaces bucket is:

```text
private
force_destroy = false
prevent_destroy = true
```

P10-M03 does not enable a retention/versioning policy and does not claim that
Spaces availability constitutes backup.

Object protection remains:

```text
P10-M08 — Backup
```

## Canonical Persistence Safety

The PostgreSQL cluster uses:

```text
prevent_destroy = true
```

to make accidental destructive replacement explicit.

This does not replace DigitalOcean managed backups or P10-M08/P10-M09 recovery
work.

## Deferred Provider Surfaces

The accepted providers remain unchanged, but not every provider surface belongs
in this Terraform root today.

### App Platform

`digitalocean_app` is deferred to:

```text
P10-M04 — Deployment Pipeline
```

because its spec necessarily decides:

```text
build commands
run commands
source/revision
component topology
routing
health gates
deployment behavior
environment promotion
```

### Better Stack

Better Stack Terraform resources are deferred until the owning operational
milestone creates a real monitor, telemetry source, metric, or alert.

Provider selection alone does not justify empty provider configuration.

### Postmark

Postmark remains SMTP-based production delivery.

P10-M03 creates no speculative third-party Terraform provider for Postmark.

Domain verification and account bootstrap are documented operational work until
a supported IaC surface is deliberately accepted.

## CI Validation

P10-M03 extends the existing CI validation job with:

```text
Terraform 1.15.8 setup
terraform fmt -check
terraform init -backend=false -lockfile=readonly
terraform validate
```

CI performs no:

```text
terraform plan against live accounts
terraform apply
provider authentication
remote state access
cloud mutation
```

This keeps pull-request/push validation deterministic and credential-free.

## Explicit Non-Goals

P10-M03 does not introduce:

```text
terraform apply
live DigitalOcean resources
live Spaces state buckets
cloud credentials
runtime Secrets
DigitalOcean App Platform deployment spec
DNS/custom domain
Postmark account/domain creation
Better Stack monitor/source/alert
metrics
OpenTelemetry
distributed tracing
alerting
backup implementation
disaster recovery
runbooks
final production sizing
autoscaling policy
Kubernetes
Terragrunt
Pulumi
HCP Terraform dependency
microservices
```

## Decision Sources

Current sources reviewed on 2026-08-22:

```text
Terraform releases
https://releases.hashicorp.com/terraform/

Terraform version constraints
https://developer.hashicorp.com/terraform/language/expressions/version-constraints

DigitalOcean Terraform Provider
https://registry.terraform.io/providers/digitalocean/digitalocean/latest

DigitalOcean Terraform provider reference
https://docs.digitalocean.com/reference/terraform/reference/

DigitalOcean Spaces Terraform remote state backend
https://docs.digitalocean.com/products/spaces/reference/terraform-backend/

DigitalOcean Managed PostgreSQL Terraform resource
https://docs.digitalocean.com/reference/terraform/reference/resources/database_cluster/

DigitalOcean Spaces bucket Terraform resource
https://docs.digitalocean.com/reference/terraform/reference/resources/spaces_bucket/

DigitalOcean VPC Terraform resource
https://docs.digitalocean.com/reference/terraform/reference/resources/vpc/

Better Stack Terraform
https://betterstack.com/docs/getting-started/integrations/terraform/

HashiCorp Setup Terraform GitHub Action
https://github.com/hashicorp/setup-terraform
```

## P10-M03 Outcome Target

P10-M03 is implementation-complete only when:

```text
Terraform strategy is recorded
Terraform root is version-controlled
remote-state strategy is documented
state locking is enabled by backend contract
state/credential boundaries are explicit
core DigitalOcean resource definitions validate
provider dependency lock file is committed
CI validates Terraform without cloud credentials
no live resources were created by validation
```

Only after the exact implementation commit is green should the single P10-M03
roadmap closure update advance Phase 10 to P10-M04.
