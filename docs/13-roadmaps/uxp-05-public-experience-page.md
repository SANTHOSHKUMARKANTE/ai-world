# AI World UXP-05 — Public Experience / Social Landing

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-05 |
| Area | Product / Web / Composition / Media / Knowledge / Creator |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-05A ACTIVE |
| Created | 2026-08-27 |
| Activation Baseline | `95836f344dbf523b20591cc20536f1517a1cb060` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Predecessor | UXP-04 — Anime Series — CLOSED — ACCEPTED |
| Canonical Route | `/experiences/[id]` |
| Scope | Fully finish the existing published Composition Page consumer as a canonical social/content destination |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Activation Gate

UXP-05 is activated only from the accepted UXP-04 closure baseline:

```text
95836f344dbf523b20591cc20536f1517a1cb060
docs(roadmap): close UXP-04
GitHub CI run 241
run id 33072679792
success
```

UXP-04 is closed and accepted before any UXP-05 implementation begins.
This activation is docs-only. No UXP-05 production implementation belongs in
this checkpoint.

---

# 2. Governing Principle

UXP-05 finishes the existing public Composition consumer. It does not create a
second Experience platform.

> Reuse the accepted Composition Page, Block, Media, Knowledge, Creator and
> lifecycle capabilities. Add only the minimum projection and Web behavior
> required by the first finished public Experience.

The canonical route remains `/experiences/[id]`. Campaign parameters may decorate
entry URLs but do not change canonical identity.

---

# 3. Repository Inspection Baseline

Inspection was performed against exact baseline:

```text
95836f344dbf523b20591cc20536f1517a1cb060
```

Critical inspected source locks:

```text
apps/web/src/app/experiences/[id]/page.tsx
2b747b0da560821522c55cc9937017d0e6109a75

apps/web/src/creator/public-experience.tsx
a36cc3e215eacff1ca8b1f85af70c1be4294f2d3

apps/web/src/creator/creator-workspace.tsx
a534c1c5370f9ea4862c58b19555b2b778b3436e
```

The existing route already delegates to the shared `PublicExperience` consumer.
Composition already owns:

```text
Page lifecycle;
ordered composition;
BLOCK references;
KNOWLEDGE_RESOURCE references;
MEDIA_ASSET references;
Creator editing and preview;
publish/archive behavior;
same-Universe composition validation.
```

The principal UXP-05 gaps are public projection/presentation, typed Media
handling, canonical/social identity, responsive/accessibility acceptance and
Creator/public parity. They are not a persistence-platform gap.

---

# 4. Frozen Ownership Model

Composition owns Page, lifecycle, ordered composition, Blocks, references,
Creator editing/preview and publish/archive behavior.

Media owns Asset identity/type, technical metadata, delivery, accepted upload
policy and rights/security boundaries.

Knowledge owns canonical Knowledge Resource identity and published availability.

Web owns finished public Experience presentation, responsive composition,
accessible media controls, canonical/social metadata and public failure states.

No ownership is duplicated merely for UXP-05.

---

# 5. Explicit Non-Goals / Protected Architecture

UXP-05 must not introduce the following merely to finish this route:

```text
Experience database/table;
Experience service/repository;
Experience-specific public API family;
Experience-specific Engagement backend;
routePath-driven public router;
general-purpose page builder;
Creator Studio rewrite;
new Search/indexing architecture;
UXP-08 Search expansion;
recommendation/ranking platform;
new generic theme engine;
new generic transcoding platform;
speculative workflow/policy kernels.
```

`routePath` does not become the public router in UXP-05. Knowledge references may
continue through accepted generic Knowledge identity such as
`/knowledge/resources/[id]` until bounded evidence justifies an already-accepted
canonical destination. UXP-05 does not invent missing canonical slugs.

---

# 6. Public Identity / Social Contract

Canonical identity is `/experiences/[id]`. Campaign parameters such as UTM values
may decorate entry URLs but must not enter canonical metadata.

Initial social precedence:

```text
title: Page title;
description: first substantive public text Block where suitable, otherwise a
bounded canonical-content fallback;
social image: first eligible public IMAGE, otherwise existing app fallback;
VIDEO/AUDIO: never fabricate an Open Graph image from a non-image Asset.
```

The public page remains useful when optional social-image content is absent.

---

# 7. Media Contract

The canonical Media model recognizes `IMAGE`, `VIDEO`, `AUDIO` and `DOCUMENT`.
Model recognition is not the same as an accepted authoring/ingestion capability.

The inspected accepted upload policy currently proves bounded image and MP4
paths, not general audio ingestion. AUDIO is therefore deliberately gated.

For already accepted Assets, the finished consumer may support IMAGE and bounded
short-motion VIDEO/SHORT_LOOP behavior with explicit poster/fallback and
reduced-motion handling. SHORT_LOOP remains presentation behavior, not a new
Asset type.

No page may depend on audible autoplay.

Any eventual audio capability remains restricted to original, owned, properly
licensed, royalty-cleared or otherwise operator-verified audio. A short clip of
commercial music is not automatically licensed.

---

# 8. Slice Plan

## UXP-05A — Public projection + canonical/social shell

Status: `ACTIVE — NEXT IMPLEMENTATION SLICE`

Finish the minimum public projection and page shell required for a canonical
social/content destination:

```text
strict published Page consumption;
canonical `/experiences/[id]` identity;
Page title and bounded description;
campaign-safe canonical/Open Graph metadata;
finished BLOCK rendering;
finished Knowledge reference rendering/navigation;
clear loading/error/not-found/empty behavior;
responsive public shell;
no invented Experience backend.
```

Reuse the existing public Composition projection before adding any API field.
Backend/API change is allowed only if the real consumer proves a missing
canonical projection. A backend rewrite is not allowed.

## UXP-05B — Typed IMAGE / short-motion Media + Creator/public parity

Status: `NOT STARTED — GATED ON UXP-05A ACCEPTANCE`

Finish typed public Media behavior for already accepted authorable modes:

```text
IMAGE as image content;
bounded VIDEO as intentional user-started video or SHORT_LOOP;
poster/fallback behavior;
reduced motion;
no audible autoplay;
honest degradation for unsupported Media;
Creator preview/public rendering parity without lifecycle bypass.
```

No general video platform.

## UXP-05C — User-started AUDIO capability gate

Status: `NOT STARTED — CAPABILITY MICRO-FREEZE REQUIRED`

Before audio implementation, perform a focused Media/security inspection and
freeze only the minimum real capability required by an Experience consumer. The
micro-freeze must determine from evidence:

```text
accepted MIME/container choices;
bounded size;
bounded duration if required;
validation behavior;
delivery headers;
Creator upload/attach path;
rights/operator responsibility;
browser support expectations;
test fixtures/security proof.
```

Do not choose codecs, limits or duration speculatively here. Audio playback must
always require user intent. No audible autoplay. No generic transcoding platform.

## UXP-05D — Reuse + full Experience acceptance

Status: `NOT STARTED — GATED ON UXP-05A/B/C ACCEPTANCE`

Prove complete Public Experience acceptance through multiple real composition
shapes and applicable product states.

**Production changes in UXP-05D are allowed only when acceptance exposes a real
defect.**

---

# 9. UXP-05D Frozen Acceptance Matrix

Responsive/reuse:

```text
desktop; tablet; 390px-class mobile; 2+ reusable Experiences; no fixture-specific
production branching.
```

Composition shapes:

```text
single IMAGE; bounded SHORT_LOOP/short-motion; image + user-started AUDIO after
UXP-05C acceptance; multi-Block; Knowledge reference; mixed Block + Knowledge +
Media; minimal/empty valid composition where lifecycle permits.
```

Lifecycle/roles:

```text
anonymous public visitor; authenticated shared shell; authorized Creator preview;
unauthorized Creator attempt; DRAFT non-public; ARCHIVED non-public; PUBLISHED
public; Creator-preview/public composition parity.
```

UXP-05 does not invent Favorite/Collection behavior if no real server-owned
Experience Engagement capability exists.

Failure/sparse states:

```text
loading; unexpected error; not found; missing referenced public content;
unsupported/degraded Media; sparse optional content; no eligible social image.
```

Accessibility/media:

```text
keyboard-only; focus behavior; semantic structure; keyboard media controls;
reduced motion; poster/still fallback; no audible autoplay; user-started audio;
no 390px horizontal overflow.
```

Canonical/social:

```text
canonical `/experiences/[id]`; campaign-safe entry; campaign values excluded from
canonical identity; Open Graph title/description; eligible IMAGE precedence; no
fabricated VIDEO/AUDIO social poster; real copy/share behavior only if UI exists.
```

Regression:

```text
Anime landing; Anime Character; Anime Series; Shiva/Hanuman; Search without UXP-08
expansion; Creator Composition.
```

Engineering evidence:

```text
format; lint; typecheck; focused unit; migration status/deployment; integration;
focused browser; full browser E2E; production build; fresh-process production
canonical/social proof; architecture check; reviewed evidence ZIP; acceptance
checkpoint commit/push; exact remote CI green.
```

---

# 10. Route Boundaries

UXP-05 finishes only `/experiences/[id]`. It does not add an Experience index
route unless a later independently frozen milestone proves one is required.
It does not expand Search result semantics; UXP-08 owns finished Discovery +
Engagement. `/creator/preview/[id]` remains the existing Creator Composition
preview route unless a bounded slice proves a compatibility defect.

---

# 11. Protected Accepted Surfaces

Regressions, not redesign targets:

```text
UXP-03 Anime landing;
UXP-04 Anime Series;
finished Anime Character;
Shiva/Hanuman;
generic Knowledge;
current Search API/UI;
Media ownership/lifecycle;
Composition ownership/lifecycle;
Favorites/Collections ownership;
session shell;
reduced-motion foundations;
metadataBase;
architecture dependency rules;
CI workflow;
Master Roadmap.
```

---

# 12. Current Position

After this docs-only activation checkpoint is reviewed, manually committed/pushed
and exact remote CI is green:

```text
UXP-04 — CLOSED — ACCEPTED
UXP-05 — ACTIVE
UXP-05A — ACTIVE — NEXT IMPLEMENTATION SLICE
UXP-05B — NOT STARTED
UXP-05C — NOT STARTED — CAPABILITY MICRO-FREEZE REQUIRED
UXP-05D — NOT STARTED
UXP-06 — NOT STARTED — BLOCKED ON FULL UXP-05 ACCEPTANCE
UXP-08 Search expansion — NOT STARTED
WPR-M05 — ACTIVE
P10-M04 — SEQUENCING-BLOCKED
```

No UXP-05 implementation begins before review, manual commit/push, independent
exact-remote verification and green CI. The Master Roadmap is unchanged by this
local Web UI program transition.

---

# 13. Next Action

After activation is remotely green, inspect the exact accepted baseline for
UXP-05A and implement only:

```text
Public Experience projection
+
canonical/social shell
```

Do not pre-build UXP-05B/C/D, do not introduce production AUDIO support in
UXP-05A, and do not begin UXP-06.
