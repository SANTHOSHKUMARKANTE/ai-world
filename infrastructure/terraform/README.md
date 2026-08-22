# AI World Terraform

This directory contains AI World's production Infrastructure-as-Code baseline.

## Ownership

```text
P10-M03
owns
IaC source, provider versions, state strategy and validation

P10-M04
owns
App Platform deployment/promotion topology

P10-M05/P10-M07
own
metrics/alerting resources

P10-M08/P10-M09
own
backup and recovery implementation
```

## Toolchain

Validated baseline:

```text
Terraform 1.15.8
digitalocean/digitalocean 2.99.1
```

The provider lock file is committed for Windows AMD64 and Linux AMD64 so local
Windows validation and GitHub Actions use the same provider release.

## Root

The shared root is:

```text
infrastructure/terraform/platform
```

Apply the same root independently for:

```text
staging
production
```

Do not copy the root per environment.

## Remote state

Shared environments must use DigitalOcean Spaces remote state.

Create one private state bucket and dedicated credentials for each environment:

```text
staging
production
```

The backend bucket must exist before Terraform initialization.

Use the corresponding example under:

```text
infrastructure/terraform/backends/
```

as the starting point for a non-secret backend configuration.

Do not commit the final backend file if it contains environment/account-specific
information that should remain operational.

Backend credentials are supplied with:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

as required by Terraform's S3-compatible backend integration.

Never put credentials in `-backend-config` command arguments or committed HCL.

The backend uses:

```text
use_lockfile = true
```

so concurrent Terraform mutations cannot silently race on the same state.

## Provider credentials

Supply DigitalOcean/Spaces credentials only through the execution environment.

Do not create committed Terraform variables for credentials.

Secret values must not be placed in:

```text
*.tf
*.tfvars.example
.git tracked files
CI logs
```

Real `*.tfvars` and `*.tfvars.json` are ignored.

## Validation

Credential-free repository validation:

```text
terraform fmt -check -recursive infrastructure/terraform

cd infrastructure/terraform/platform

terraform init -backend=false -input=false -lockfile=readonly
terraform validate -no-color
```

These commands install/validate provider schemas but do not access AI World's
DigitalOcean account and do not create resources.

## Apply gate

Do not run `terraform apply` for this P10-M03 baseline.

The root intentionally requires:

```text
database_trusted_app_id
```

which represents the DigitalOcean App Platform identity trusted by the database
firewall.

P10-M04 must materialize/supply that identity and complete the deployment
topology before staging or production apply is accepted.

## Current resources represented as code

```text
DigitalOcean Project
DigitalOcean VPC
DigitalOcean Managed PostgreSQL
AI World database
database firewall
DigitalOcean Spaces private Media bucket
project resource assignment
```

No App Platform application is defined yet.

## Sizing

Database size and node count are required environment inputs.

P10-M03 does not freeze their production values.

Use the environment example files as schema/examples only, not as approved
capacity settings.

## Destruction safety

Canonical PostgreSQL and Media storage use Terraform `prevent_destroy`.

The Media bucket also uses:

```text
force_destroy = false
```

These controls prevent routine Terraform operations from silently destroying
canonical data stores.

They are not backups.

## Backend bootstrap

State-bucket creation is an explicit bootstrap operation because Terraform cannot
use a backend bucket before that bucket exists.

Do not create a nested "bootstrap Terraform" layer merely to relocate the same
bootstrap-state problem.

Record the actual bootstrap procedure in the later deployment/runbook work once
the production account exists.
