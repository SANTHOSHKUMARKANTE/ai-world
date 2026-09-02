# AI World UXP-10 — Creator / Admin Studio

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-10 |
| Area | Product / Web / Creator / Administration |
| Status | ACTIVE ACCEPTANCE CONTRACT — UXP-10A ACTIVE |
| Created | 2026-09-02 |
| Activation Baseline | `f5fb93f7cc708bb7b7af4877cc96a59acadec020` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Predecessor | UXP-09 — Identity + Account — CLOSED — ACCEPTED |
| Routes | `/creator`, `/creator/preview/[id]`, `/creator/characters/[id]/preview`, `/creator/series/[id]/preview`, `/creator/deities/[id]/preview` |
| Scope | Finish the existing Creator workspace and the minimum accepted permissioned administration journey by reusing canonical Platform capabilities |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Activation Gate

UXP-10 activates only from the remotely accepted UXP-09 closure checkpoint:

```text
f5fb93f7cc708bb7b7af4877cc96a59acadec020
docs(roadmap): close UXP-09
exact remote CI user-confirmed green
```

This activation is docs-only.

No UXP-10 production implementation begins until this activation checkpoint is
independently reviewed, manually committed/pushed and exact remote CI is green.

WPR-M05 remains ACTIVE.

P10-M04 remains SEQUENCING-BLOCKED.

The Master Roadmap remains unchanged.

---

# 2. Product Intent

UXP-10 turns the accepted creator capabilities into one understandable Studio:

```text
enter through an authenticated, authorized workspace
    ↓
find or create canonical content
    ↓
edit typed Knowledge and Media
    ↓
compose and preview an Experience
    ↓
review AI output before canonical acceptance
    ↓
publish or archive through owner-controlled lifecycle actions
    ↓
perform only accepted permissioned administration
```

The Studio is a Web application workflow. It does not become the canonical owner
of Knowledge, Media, Composition, AI, Identity or User state.

---

# 3. Repository Truth At Activation

The following production capabilities already exist and must be reused:

```text
authenticated Creator workspace at /creator;
Knowledge Resource create, load, update, publish and archive contracts;
typed Anime Character, Anime Series and Devotional Deity editors;
typed entity facts and relationships;
Media upload and Knowledge media placement;
Composition Page and Text Block creation;
ordered Page composition replacement;
owner-authorized draft previews;
Page publish and archive actions;
AI-assisted Knowledge candidate suggestion, review and explicit acceptance;
public Experience delivery;
permission evaluation and administrator / knowledge-editor roles;
permission-checked Role assignment API.
```

The current `/creator` implementation is a single long form containing multiple
workflows. It relies heavily on manually entered identifiers and does not provide
a coherent Studio information architecture or a Web administration journey.

Existing unit, API integration and browser tests protect the individual flows,
but do not establish the final UXP-10 product experience.

---

# 4. Canonical Ownership

Ownership remains:

```text
Knowledge Platform
    Knowledge Resource and typed Entity semantics, lifecycle and relationships

Media Platform
    Asset semantics, upload authorization and lifecycle

Composition Platform
    Pages, Blocks, composition, preview, publish and archive

AI / Creator Platform
    Generation, safety, provenance and non-canonical candidate semantics

Identity & Access Platform
    Sessions, roles, permissions, evaluation and Role assignment

Web Application
    Studio information architecture, forms, navigation and state presentation

API Application
    REST delivery boundary only
```

The Web must not access Prisma or directly mutate canonical state.

Administration must use Identity & Access public mutation contracts and must not
be implemented through database access, hidden bootstrap behavior or client-only
role checks.

---

# 5. Frozen Slice Sequence

```text
UXP-10A — Finished Creator Studio Foundation
ACTIVE

UXP-10B — Finished Knowledge + Entity + Media Management
NOT STARTED

UXP-10C — Finished Composition + AI + Publishing Journey
NOT STARTED

UXP-10D — Accepted Permissioned Administration
NOT STARTED

UXP-10E — Full Creator / Admin Studio Acceptance
NOT STARTED
```

Each slice requires:

```text
repository inspection;
minimum bounded implementation;
focused tests;
relevant full regression;
reviewed evidence;
manual commit/push;
exact remote SHA verification;
exact GitHub CI success;
separate docs transition before the next slice.
```

No later slice begins before the preceding slice has exact remote CI acceptance.

---

# 6. UXP-10A — Finished Creator Studio Foundation

Status:

```text
ACTIVE
```

UXP-10A establishes a clear, responsive Studio shell around the existing
capabilities.

Minimum scope:

```text
preserve the canonical /creator entry route;
replace the single undifferentiated workflow with clear task-oriented navigation;
make the current object and lifecycle state obvious;
preserve work context while moving between Studio tasks where practical;
provide safe loading, empty, success and error states;
keep sign-in and authorization failures understandable;
preserve keyboard navigation, focus visibility and semantic landmarks;
preserve narrow-screen usability without horizontal page overflow.
```

The slice may introduce a small internal Studio state/navigation model in
`apps/web`. It must not create a generic design system, workflow engine or page
builder framework.

Acceptance must prove anonymous, authenticated, unauthorized and authorized
states without weakening server-side authorization.

---

# 7. UXP-10B — Finished Knowledge + Entity + Media Management

Status:

```text
NOT STARTED
```

UXP-10B finishes the creator journey for:

```text
Knowledge Resources;
Anime Character entities;
Anime Series entities;
Devotional Deity entities;
typed facts and relationships;
Media upload and ordered placement;
Knowledge publish/archive lifecycle where already accepted.
```

Creators must not be forced to remember opaque identifiers for ordinary repeat
work. If repository inspection proves a listing or lookup gap, add only the
smallest owner-controlled, authorized contract required by this Studio journey.

Do not add generic schemas, arbitrary Resource types, a Media library platform,
bulk import, taxonomy expansion or speculative editorial workflow.

---

# 8. UXP-10C — Finished Composition + AI + Publishing Journey

Status:

```text
NOT STARTED
```

UXP-10C finishes one coherent path across:

```text
Page selection or creation;
Block creation;
ordered Knowledge / Media / Block composition;
saved draft state;
authorized preview;
AI candidate request and review;
explicit canonical acceptance;
publish;
public Experience handoff;
archive.
```

Preview and public delivery must remain distinct. AI output remains non-canonical
until the canonical owner validates and accepts it.

Lifecycle constraints must be visible before an invalid action, while the server
remains the authority for every mutation.

---

# 9. UXP-10D — Accepted Permissioned Administration

Status:

```text
NOT STARTED
```

UXP-10D exposes only administration already supported by accepted Identity &
Access semantics.

Minimum candidate scope:

```text
administrator-only Role assignment;
clear target Actor and Role confirmation;
explicit success and safe failure presentation;
server-authoritative permission enforcement;
no credential, token or Session-secret exposure.
```

Repository inspection at slice start must confirm that the journey is usable
without inventing a general User directory. Any required lookup must be narrow,
authorized and owned by the correct Platform.

This slice does not authorize arbitrary Permission editing, Role definition,
impersonation, Session inspection, audit-console construction, moderation tools
or a new Operations capability.

---

# 10. UXP-10E — Full Creator / Admin Studio Acceptance

Status:

```text
NOT STARTED
```

UXP-10E is an evidence and defect-remediation slice, not a feature-expansion
milestone.

Acceptance must cover:

```text
anonymous and expired-Session entry;
authorized creator journey;
unauthorized mutation denial;
administrator-only governance path;
Knowledge / Entity / Media round trip;
Composition / preview / publish / public-delivery parity;
AI candidate non-canonical and accepted states;
archive and immutable-state behavior;
keyboard-only and semantic sanity;
responsive narrow and wide viewports;
reduced-motion behavior where motion exists;
fresh-database migrations and persistence restart;
production build and fresh-process route smoke;
architecture validation;
exact GitHub CI success.
```

UXP-10 closes only after all applicable Web Page Definition of Done categories
are satisfied.

---

# 11. Security, Privacy And Safety Rules

```text
all mutations remain Session-authenticated and server-authorized;
client presentation never substitutes for permission enforcement;
opaque identifiers are not treated as authorization;
AI prompts and output are untrusted boundaries;
uploaded files retain accepted Media validation and licensing guidance;
credentials, tokens, Session secrets and private provider data are never logged;
public preview is never inferred from authenticated draft access;
Role assignment remains administrator-only and auditable through accepted paths.
```

---

# 12. Explicit Non-Goals

UXP-10 does not introduce:

```text
a separate creator or admin application;
a generic headless CMS;
a generic page-builder framework;
a new rich-text editor technology;
a workflow or policy engine;
a new Identity provider or authorization model;
arbitrary Role or Permission design tools;
moderation, analytics or operations consoles;
bulk import/export;
third-party plugin architecture;
provider SDKs in Web or Universe code;
new search infrastructure;
P10-M04 deployment implementation;
live cloud resources;
UXP-11 Home work;
UXP-12 whole-site acceptance work.
```

---

# 13. Validation Baseline

Each implementation slice runs the smallest meaningful validation set and ends
with the repository protocol:

```text
format relevant files;
lint;
typecheck;
focused Web unit tests;
focused API / Platform integration tests when contracts change;
focused Playwright coverage;
relevant regression suites;
production build where practical;
git diff --check;
status and diff review;
architecture validation for boundary-affecting work.
```

UXP-10E expands this to the complete acceptance matrix in Section 10.

---

# 14. Current Position

```text
UXP-09 — CLOSED — ACCEPTED
UXP-10 — ACTIVE
UXP-10A — ACTIVE
UXP-10B — NOT STARTED
UXP-10C — NOT STARTED
UXP-10D — NOT STARTED
UXP-10E — NOT STARTED
UXP-11 — NOT STARTED
WPR-M05 — ACTIVE
P10-M04 — SEQUENCING-BLOCKED
Master Roadmap — UNCHANGED
```

---

# 15. Next Action

After this docs-only activation is independently reviewed, manually
committed/pushed and exact remote CI is green:

```text
inspect the /creator implementation at the accepted activation baseline;
implement only UXP-10A — Finished Creator Studio Foundation;
preserve all accepted creator and public-page behavior;
do not begin UXP-10B, UXP-10C, UXP-10D, UXP-10E or UXP-11;
keep WPR-M05 ACTIVE;
keep P10-M04 SEQUENCING-BLOCKED;
keep the Master Roadmap unchanged.
```
