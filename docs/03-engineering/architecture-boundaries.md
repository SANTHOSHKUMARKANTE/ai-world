# AI World Architecture Boundaries

## 1. Purpose

This document defines the automated architecture-boundary baseline for AI World.

The purpose of the Phase 1 architecture checks is to preserve accepted ownership and dependency direction while the codebase is still small.

The baseline intentionally focuses on:

```text
workspace boundaries
restricted imports
simple cycle detection
dependency hygiene
```

It is not intended to be an elaborate architecture-testing framework.

The enforcement mechanism is:

```text
dependency-cruiser
```

The canonical configuration is:

```text
.dependency-cruiser.mjs
```

The canonical validation command is:

```bash
pnpm run architecture:check
```

---

## 2. Architecture Direction

The accepted logical dependency direction is:

```text
Applications
    ↓
Universes
    ↓
Platforms
    ↓
Kernel
    ↓
Foundations
```

This expresses allowed architectural direction rather than requiring every layer to be traversed.

For example, an application may legitimately consume a Foundation directly when appropriate.

The important constraint is that lower architectural layers must not depend upward on higher layers.

---

## 3. Repository Layers

The architecture baseline recognizes these repository locations:

```text
apps/
  <application>/

packages/
  foundations/
    <package>/

  kernel/
    <package>/

  platforms/
    <package>/

  universes/
    <package>/
```

Not every future layer must exist physically during Phase 1.

Architecture rules may still reserve their intended dependency direction before those packages are introduced.

Do not create empty source packages solely to satisfy architecture tooling.

---

## 4. Current Workspace Baseline

At the completion of the Phase 1 architecture-boundary milestone, the implemented workspace packages include:

```text
apps/
  api
  web

packages/foundations/
  configuration
  database
  errors
  observability
```

The Foundation packages currently have no dependencies on other AI World workspace packages.

The API consumes Foundation packages through their public package exports.

The Web application currently has no AI World package dependencies.

---

## 5. Public Package APIs

Foundation packages expose their public APIs through package-level exports.

The current pattern is:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

Consumers therefore import through package roots such as:

```ts
import { ApplicationError } from '@ai-world/foundation-errors';
```

rather than reaching into internal package files.

This keeps public contracts owner-controlled.

Deep internal imports should not be introduced when the package export surface already provides the required capability.

---

## 6. No Circular Dependencies

The architecture baseline forbids source dependency cycles.

Conceptually:

```text
A
↓
B
↓
C
↓
A
```

is invalid.

The dependency-cruiser rule is:

```text
no-circular
```

A detected circular dependency fails:

```bash
pnpm run architecture:check
```

with a non-zero exit code.

Cycle detection applies to the repository source graph analyzed by the architecture command.

---

## 7. Application Isolation

Applications must not import source directly from other applications.

Forbidden examples include:

```text
apps/api → apps/web
apps/web → apps/api
```

The rule is:

```text
no-cross-application-dependencies
```

Applications are composition roots and delivery mechanisms.

Reusable capability belongs in an appropriate owned package rather than being shared through direct application-to-application source imports.

---

## 8. Foundation Direction

Foundations form the lowest architectural layer.

Foundation packages must not depend on:

```text
Applications
Kernel
Platforms
Universes
```

The rule is:

```text
foundations-do-not-depend-upward
```

Allowed conceptual direction:

```text
Application
    ↓
Foundation
```

Forbidden direction:

```text
Foundation
    ↓
Application
```

Foundation-to-Foundation dependencies are not globally prohibited by the Phase 1 baseline.

Such dependencies may be legitimate when technically justified, while cycle detection still protects against circular coupling.

---

## 9. Kernel Direction

Future Kernel packages may depend on Foundations.

They must not depend upward on:

```text
Applications
Platforms
Universes
```

The rule is:

```text
kernel-does-not-depend-upward
```

Conceptually:

```text
Kernel
  ↓
Foundations
```

is valid.

The reverse upward relationships are not.

---

## 10. Platform Direction

Future Platform packages may depend on:

```text
Kernel
Foundations
```

They must not depend upward on:

```text
Applications
Universes
```

The rule is:

```text
platforms-do-not-depend-upward
```

This helps preserve reusable platform ownership independently of application composition and Universe-specific presentation.

---

## 11. Universe Direction

Future Universe packages may depend on lower reusable layers such as:

```text
Platforms
Kernel
Foundations
```

Universe packages must not depend on application composition roots.

The rule is:

```text
universes-do-not-depend-on-applications
```

This helps keep Universes reusable across delivery applications.

---

## 12. Unresolvable Imports

Statically analyzable imports must resolve.

The rule is:

```text
not-to-unresolvable
```

An unresolved import is treated as an architecture validation error.

Do not disable this rule merely to hide a path, package-export, casing, or workspace configuration defect.

---

## 13. Dependency Declaration Hygiene

External dependencies consumed by a workspace package must be declared by that package.

The rule is:

```text
no-undeclared-package-dependencies
```

The Phase 1 configuration checks dependency classifications corresponding to packages that are not correctly represented in the owning package manifest.

This protects against code accidentally succeeding only because a dependency happens to exist elsewhere in the monorepo installation.

For example:

```text
packages/foundations/errors
```

must not consume an external package merely because that package exists at the repository root.

The owning package must declare the dependency intentionally.

---

## 14. pnpm Workspace Resolution Note

During P1-M13 validation, dependency-cruiser correctly resolved AI World workspace imports such as:

```text
@ai-world/foundation-errors
@ai-world/foundation-database
@ai-world/foundation-observability
@ai-world/foundation-configuration
```

to their workspace package outputs.

With the current pnpm workspace layout, dependency-cruiser classified these valid workspace edges as:

```text
undetermined
```

rather than as normal external npm dependencies.

Because these imports were already correctly declared in the consuming application's package manifest, treating every `undetermined` edge as undeclared produced false positives.

The final dependency-hygiene rule therefore does not equate the generic `undetermined` classification with an undeclared dependency.

Real undeclared external dependency behavior was separately verified through a controlled negative proof.

Do not broaden the rule again without retesting pnpm workspace behavior.

---

## 15. Production Source and Dev Dependencies

Production source must not rely on dependencies available only through:

```text
devDependencies
```

The rule is:

```text
no-dev-dependencies-from-production-source
```

Production source currently means source under application and architectural package `src` directories.

Tests and tooling may legitimately consume development-only dependencies according to their owning package configuration.

---

## 16. node_modules Traversal

Architecture analysis must not recursively inspect third-party package implementation trees.

The dependency-cruiser configuration prevents traversal through paths matching:

```text
node_modules
```

at any workspace depth.

This is important in a pnpm workspace because package-local dependency links may exist under locations such as:

```text
apps/api/node_modules/
packages/foundations/database/node_modules/
```

The architecture graph should inspect dependencies on third-party packages without treating third-party implementation code as AI World architecture.

---

## 17. Generated Prisma Code

Generated Prisma implementation code is not part of the authored architecture model.

Architecture analysis excludes generated Prisma internals beneath the database Foundation's generated output.

The owning database code may still depend on the generated Prisma client.

The generated client's internal implementation graph does not need to be treated as AI World architectural source.

Generated provider code must not become the basis for shared ownership rules.

---

## 18. Architecture Input Scope

The root architecture command analyzes the supported workspace shape explicitly.

Current input patterns include:

```text
apps/*/src
apps/*/test
apps/*/e2e

packages/*/*/src
packages/*/*/test
packages/*/*/prisma
```

The patterns deliberately avoid overly broad recursive workspace globs.

A broad pattern such as:

```text
apps/**/src
```

can accidentally select third-party source directories below workspace-local `node_modules`.

Architecture input patterns should therefore reflect the actual repository package structure.

---

## 19. Why Architecture Validation Builds First

Internal AI World packages currently expose compiled package entry points through:

```text
dist/index.js
```

The architecture command therefore runs the repository build before dependency analysis:

```text
build
  ↓
dependency-cruiser
```

The canonical root command is conceptually:

```bash
pnpm run build
depcruise ...
```

This allows workspace package imports to resolve according to the same public package contract used by the applications.

Turborepo caching reduces repeated build cost when the inputs have not changed.

---

## 20. Canonical Validation Command

Run:

```bash
pnpm run architecture:check
```

A healthy graph reports:

```text
no dependency violations found
```

and exits successfully.

An architecture violation returns a non-zero exit code.

Architecture validation must remain deterministic and suitable for both local use and CI.

---

## 21. Linting the Architecture Configuration

The repository root lint command includes:

```text
.dependency-cruiser.mjs
```

alongside repository JavaScript tooling.

This ensures the architecture configuration itself remains covered by the standard lint baseline.

A configuration file should not be exempt from basic code-quality validation merely because it controls tooling.

---

## 22. Controlled Negative Proofs

P1-M13 did not accept a green architecture command without proving the rules could fail.

Temporary controlled violations were created locally, validated, and immediately removed.

No proof file was committed.

The tested cases were:

```text
Foundation → Application
Application → Application
Circular dependency
Undeclared external dependency
```

Each violation caused dependency-cruiser to return an error and non-zero exit status.

After every proof, the temporary files were removed.

---

## 23. Foundation-Upward Proof

A temporary Foundation source dependency on the API was introduced.

Dependency-cruiser rejected it through:

```text
foundations-do-not-depend-upward
```

This proved that the lower-level Foundation layer cannot depend on the application composition root.

The temporary proof file was deleted immediately after validation.

---

## 24. Cross-Application Proof

A temporary API source dependency on Web source was introduced.

Dependency-cruiser rejected it through:

```text
no-cross-application-dependencies
```

This proved direct application-to-application source dependencies are blocked.

The temporary proof file was deleted immediately after validation.

---

## 25. Cycle Proof

Two temporary source files imported each other.

Dependency-cruiser rejected the graph through:

```text
no-circular
```

This proved simple cycle detection is active.

Both temporary files were removed immediately after validation.

---

## 26. Undeclared Dependency Proof

A temporary Foundation source file imported:

```text
eslint
```

without the Foundation package declaring ESLint in its own package manifest.

Although ESLint existed elsewhere in the monorepo installation, dependency-cruiser rejected the dependency through:

```text
no-undeclared-package-dependencies
```

This proved the dependency-hygiene rule remains effective after accommodating pnpm workspace dependency classification.

The temporary proof file was removed immediately after validation.

---

## 27. Clean-Graph Proof

After all artificial violations were removed, the complete real repository graph was revalidated.

The Phase 1 baseline produced:

```text
no dependency violations found
```

with:

```text
59 modules
82 dependencies
```

at the time P1-M13 was established.

These counts are observational, not architectural contracts.

They will naturally change as the repository grows.

The architectural contract is that the graph contains no forbidden dependency relationships.

---

## 28. CI Enforcement

Architecture validation runs in the canonical GitHub Actions CI workflow.

The workflow includes:

```yaml
- name: Check architecture
  run: pnpm run architecture:check
```

Architecture validation therefore runs for:

```text
push → main
pull request → main
```

alongside the rest of the Phase 1 validation pipeline.

---

## 29. Linux CI Proof

P1-M13 was validated on both:

```text
Windows local development environment
GitHub-hosted Linux CI environment
```

The real GitHub Actions:

```text
CI / Validate
```

run completed successfully with the architecture step enabled.

This provides cross-platform evidence that the architecture configuration does not rely on Windows-only behavior.

---

## 30. Architecture Failure Handling

When architecture validation fails:

```text
1. Identify the failing rule.
2. Inspect the source and target dependency.
3. Determine whether the dependency violates accepted ownership.
4. Determine whether the result is a resolver/tooling classification issue.
5. Make the smallest justified correction.
6. Re-run the architecture check.
7. Re-run affected standard validation.
8. Verify CI.
```

Do not automatically weaken a rule because it reports a failure.

Likewise, do not automatically restructure source code before confirming the rule is interpreting the dependency correctly.

---

## 31. Rule Changes

Changes to architecture rules must be intentional.

A rule change should answer:

```text
What accepted architecture decision changed?

Why is the existing rule no longer correct?

Does the new rule still protect ownership?

Was a negative proof performed when relevant?

Does the clean repository graph pass?

Does CI pass?
```

Avoid accumulating unexplained exceptions.

---

## 32. No Architecture Baseline Suppression File

Phase 1 does not maintain a list of accepted architecture violations.

There is no architecture debt baseline that silently allows existing forbidden dependencies.

The repository begins with a clean architecture graph.

If a future exception becomes genuinely necessary, it should be handled through an explicit architectural decision rather than a generic suppression list.

---

## 33. No Elaborate Architecture Framework

P1-M13 intentionally does not introduce:

```text
custom AST parsers
custom dependency-graph engines
architecture snapshot databases
package-level architecture configs everywhere
complex instability metrics
automatic graph approval systems
dynamic policy engines
architecture suppression registries
```

The current codebase does not justify that complexity.

Dependency-cruiser plus a small repository-level ruleset is sufficient for the Phase 1 ownership baseline.

---

## 34. Future Evolution

As Kernel, Platform, and Universe packages begin to exist, the existing layer-direction rules will begin protecting those paths automatically.

Future milestones may add narrower ownership rules where actual code demonstrates the need.

Examples may eventually include:

```text
Platform-specific public Contract boundaries
provider adapter ownership
Prisma model/type leakage prevention
Universe isolation
Composition Root restrictions
cross-Platform dependency policies
```

These should be added when corresponding architecture exists rather than speculatively.

---

## 35. P1-M13 Architecture Contract

P1-M13 establishes the following automated contract:

```text
Dependency direction
  Applications
      ↓
  Universes
      ↓
  Platforms
      ↓
  Kernel
      ↓
  Foundations

Enforced boundaries
  no application → application source dependencies
  no Foundation upward dependencies
  no Kernel upward dependencies
  no Platform upward dependencies
  no Universe → application dependencies

Graph quality
  no circular dependencies
  no unresolvable imports
  no undeclared external dependencies
  no production source using dev-only dependencies

Analysis scope
  application source/test/e2e
  architectural package source/test/prisma
  no third-party node_modules traversal
  generated Prisma internals excluded

Automation
  dependency-cruiser 18.1.0
  pnpm run architecture:check
  root lint covers architecture configuration
  CI runs architecture validation

Proof
  clean graph succeeds
  Foundation upward violation fails
  cross-application violation fails
  cycle fails
  undeclared external dependency fails
  real GitHub Actions CI succeeds
```

This is the canonical Phase 1 architecture-boundary enforcement baseline for AI World.