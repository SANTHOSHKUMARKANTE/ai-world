# AI World UXP-05 — Public Experience / Social Landing

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-05 |
| Area | Product / Web / Composition / Media / Knowledge / Creator |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-05D ACCEPTANCE ACTIVE |
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

Status: `CLOSED — ACCEPTED`

Accepted implementation checkpoint:

```text
8da119f2aad069d8ee26e8a65f8631d7625fa950
feat(web): finish public experience shell
GitHub CI run 243
run id 33098505327
success
```

Accepted UXP-05A behavior:

```text
strict published Composition Page consumption retained;
canonical `/experiences/[id]` identity;
campaign query parameters excluded from canonical metadata;
Page title drives social title when the public projection is available;
first substantive public text Block drives bounded social description;
bounded metadata fallback when the public projection is unavailable;
explicit loading / not-found / unexpected-error / empty public states;
generic Knowledge Resource navigation retained;
existing pre-UXP-05B MEDIA_ASSET rendering retained;
390px campaign-entry proof with no horizontal overflow;
no Experience-specific backend / database / migration / Search expansion.
```

Reviewed local validation evidence:

```text
focused UXP-05A Web unit 7 / 7;
full Web unit 61 / 61;
focused UXP-05A browser E2E 3 / 3;
unchanged Anime Character regression isolated 1 / 1;
full Web browser E2E 80 / 80;
production build 22 / 22 tasks;
architecture validation with 0 violations across 762 modules / 2490 dependencies.
```

Exact remote CI #243 on the accepted implementation checkpoint proved:

```text
root unit pipeline 37 / 37 tasks;
Web unit 17 / 17 files and 61 / 61 tests;
32 migrations found with no pending migrations;
AI Creator integration 11 / 11 files and 24 / 24 tests;
full integration pipeline 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
full Web browser E2E 80 / 80;
production build 22 / 22 tasks;
architecture validation with 0 violations across 762 modules / 2490 dependencies.
```

UXP-05A deliberately did not implement Media-derived Open Graph image
precedence. The public Composition projection is still not a typed Media
projection, so treating every `MEDIA_ASSET` as an eligible social IMAGE would be
incorrect. Typed IMAGE / VIDEO projection and eligible social-image precedence
remain UXP-05B work.

No backend rewrite was required. UXP-05A is CLOSED — ACCEPTED.

## UXP-05B — Typed IMAGE / short-motion Media + Creator/public parity

Status: `CLOSED — ACCEPTED`

Accepted implementation checkpoint:

```text
403ac69198185a7cd35b85178e4342ed5f1f2a0f
feat(composition): add typed experience media
GitHub CI run 245
run id 33195903383
success
```

Accepted UXP-05B behavior:

```text
Composition Page preview preserves canonical Media assetType + durationMs;
public and Creator Composition responses expose the same typed Media projection;
public Experience and Creator preview share the same typed Media renderer;
IMAGE renders as image content;
bounded VIDEO is user-started with controls and preload=none;
VIDEO with missing duration or duration above the accepted 8000 ms bound degrades honestly;
VIDEO does not autoplay or loop and no poster is fabricated;
AUDIO and DOCUMENT degrade explicitly rather than pretending to be images;
Creator preview/public rendering semantics remain aligned;
first eligible IMAGE drives Experience social-image metadata;
preceding VIDEO/AUDIO/DOCUMENT never fabricate an Open Graph image;
no Experience backend/database/migration/Search expansion was introduced.
```

Reviewed implementation evidence:

```text
focused Composition preview unit 3 / 3;
focused UXP-05B Web unit 11 / 11;
full Web unit 63 / 63;
root unit pipeline 37 / 37 tasks;
32 migrations applied on a clean database;
focused UXP-05B API integration 10 / 10;
API integration 181 / 181;
Creator preview regression isolated 1 / 1;
focused UXP-05B browser E2E 4 / 4;
full Web browser E2E 81 / 81;
production build 22 / 22 tasks;
architecture validation with 0 violations across 763 modules / 2494 dependencies.
```

Exact remote CI #245 on the accepted implementation checkpoint completed
successfully. UXP-05B is CLOSED — ACCEPTED.

UXP-05B did not implement AUDIO ingestion/playback, a generic transcoding
platform, a poster model or a new SHORT_LOOP Asset type. Those boundaries remain
protected.

## UXP-05C — User-started AUDIO capability gate

Status: `CLOSED — ACCEPTED`

Accepted final checkpoint:

```text
0cb1548541cc3f57164cb25a739b2fa1ee75d522
fix(media): harden AAC audio validation
GitHub CI run 249
run id 33247968029
success
```

Primary bounded AUDIO implementation checkpoint:

```text
ad2c72881995e68d0680a4594073aab60110e39c
feat(media): add bounded experience audio
GitHub CI run 248
run id 33244423316
success
```

UXP-05C is accepted only for the frozen initial Experience AUDIO capability.
The accepted implementation did not create a general audio/media platform.

Accepted behavior:

```text
canonical AUDIO upload reuses POST /media/assets;
accepted MIME is audio/mp4;
server-side ISO-BMFF inspection requires an audio soun track with mp4a;
AAC-LC / MPEG-4 Audio Object Type 2 is byte-validated from AudioSpecificConfig;
truncated/malformed AudioSpecificConfig is rejected;
reserved/invalid sampling-frequency and channel configuration are rejected;
implicit SBR / HE-AAC signaling is rejected;
AAC-LC GASpecificConfig extensionFlag3 is consumed and unsupported non-zero values are rejected;
VIDEO-only and mixed AUDIO+VIDEO files are rejected for this initial AUDIO profile;
streaming box/descriptor traversal avoids retaining attacker-controlled metadata arrays;
the existing 10 MiB upload ceiling is retained;
positive durationMs is derived without inventing an AUDIO duration ceiling;

existing media.asset.upload authorization is reused;
existing UploadAssetAsActor / audit / Storage transaction is reused;
existing GET /media/assets/:id/content delivery is extended to accepted ACTIVE AUDIO;
whole-object delivery remains the contract; no HTTP Range architecture is introduced;

existing Composition MEDIA_ASSET references attach AUDIO by canonical Asset ID;
Creator and published projections preserve AUDIO + durationMs;
Creator Page/Experience upload accepts the frozen audio/mp4 path;
Creator states rights/operator responsibility and public-by-ID visibility before upload;
KnowledgeMediaManager remains IMAGE/VIDEO-only;

public Experience and Creator preview continue sharing one Media renderer;
AUDIO uses native user-started <audio controls preload="none">;
AUDIO does not autoplay or loop;
load failure degrades honestly without failing the Experience;
AUDIO never supplies an Open Graph image;
eligible IMAGE social precedence remains unchanged.
```

Accepted boundaries:

```text
no database schema or migration;
no AUDIO-specific endpoint, permission, repository or table;
no ffmpeg / ffprobe;
no transcoding/probing platform;
no waveform/player/playlist subsystem;
no Storage Range/streaming expansion;
no signed/private delivery architecture;
no rights database/policy engine;
no AUDIO Knowledge placement;
no Search expansion;
no UXP-05D production work;
no UXP-06 work.
```

Reviewed final implementation/hardening evidence:

```text
focused Media AUDIO unit 28 / 28;
root format/lint/typecheck green;
root unit pipeline 37 / 37 tasks;
32 migrations applied on a clean database;
focused UXP-05C API integration 29 / 29;
full integration pipeline 29 / 29 tasks;
API integration 185 / 185;
focused Creator/public browser proof 7 / 7;
full Web browser E2E 81 / 81;
production build 22 / 22 tasks;
architecture validation with 0 violations across 767 modules / 2500 dependencies;
reviewed staged evidence ZIP;
exact implementation checkpoint pushed and CI #248 green;
exact final hardening checkpoint pushed and CI #249 green.
```

The final hardening checkpoint is the accepted UXP-05C checkpoint because it
contains the complete bounded AAC-LC validation used by the accepted capability.

UXP-05C is CLOSED — ACCEPTED.

## UXP-05D — Reuse + full Experience acceptance

Status: `ACTIVE — ACCEPTANCE NEXT`

UXP-05D is acceptance-first. No new production feature is planned by this
transition. The existing UXP-05D Frozen Acceptance Matrix remains the governing
proof matrix.

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

After the UXP-05C AUDIO implementation and final AAC validation hardening are
independently verified at exact remote checkpoint
`0cb1548541cc3f57164cb25a739b2fa1ee75d522` with GitHub CI #249 green:

```text
UXP-04 — CLOSED — ACCEPTED
UXP-05 — ACTIVE
UXP-05A — CLOSED — ACCEPTED — 8da119f2aad069d8ee26e8a65f8631d7625fa950
UXP-05B — CLOSED — ACCEPTED — 403ac69198185a7cd35b85178e4342ed5f1f2a0f
UXP-05C — CLOSED — ACCEPTED — 0cb1548541cc3f57164cb25a739b2fa1ee75d522
UXP-05D — ACTIVE — ACCEPTANCE NEXT
UXP-06 — NOT STARTED — BLOCKED ON FULL UXP-05 ACCEPTANCE
UXP-08 Search expansion — NOT STARTED
WPR-M05 — ACTIVE
P10-M04 — SEQUENCING-BLOCKED
```

The Master Roadmap remains unchanged.

UXP-05D is not a new feature slice. It is the final Public Experience acceptance
gate. Production code changes are permitted only when acceptance exposes a real
defect that cannot be resolved through fixture/test correction.

---

# 13. Next Action

Execute only `UXP-05D — Reuse + full Experience acceptance` against the frozen
matrix in this contract.

Required acceptance emphasis:

```text
2+ reusable real Experience compositions;
desktop / tablet / 390px-class mobile;
single IMAGE;
bounded short-motion VIDEO;
IMAGE + user-started AUDIO;
multi-Block;
Knowledge reference;
mixed Block + Knowledge + Media;
minimal/empty valid composition where lifecycle permits;

anonymous public visitor;
authenticated shared shell;
authorized Creator preview;
unauthorized Creator attempt;
DRAFT non-public;
ARCHIVED non-public;
PUBLISHED public;
Creator-preview/public parity;

loading / unexpected error / not found;
missing referenced public content;
unsupported/degraded Media;
sparse optional content;
no eligible social image;

keyboard-only and focus behavior;
semantic structure;
keyboard media controls;
reduced motion;
no audible autoplay;
no 390px horizontal overflow;

canonical /experiences/[id];
campaign-safe entry;
eligible IMAGE social precedence;
no fabricated VIDEO/AUDIO social image;

Anime landing / Character / Series;
Shiva / Hanuman;
current Search without UXP-08 expansion;
Creator Composition regression;

format / lint / typecheck / unit;
clean migration status;
integration;
focused browser;
full browser;
production build;
fresh-process production canonical/social proof;
architecture check;
reviewed evidence ZIP;
manual acceptance checkpoint commit/push;
exact remote CI green.
```

Do not introduce new Experience backend/database architecture, Search expansion,
AUDIO Knowledge placement, a Creator Studio redesign, generic Media/transcoding
infrastructure, or UXP-06 work during acceptance.

If acceptance exposes a real production defect, fix only that bounded defect and
rerun the applicable acceptance evidence. Otherwise UXP-05D should remain
acceptance/test/documentation work.

UXP-06 stays blocked until UXP-05D and the complete UXP-05 milestone are accepted
at an exact remote-green checkpoint.
