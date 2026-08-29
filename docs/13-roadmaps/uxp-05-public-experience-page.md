# AI World UXP-05 — Public Experience / Social Landing

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-05 |
| Area | Product / Web / Composition / Media / Knowledge / Creator |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-05C FROZEN; IMPLEMENTATION NEXT AFTER FREEZE CI |
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

Status: `FROZEN — IMPLEMENTATION NEXT AFTER MICRO-FREEZE CHECKPOINT IS REMOTE-GREEN`

This checkpoint is the focused Media/security capability micro-freeze. It changes
no production implementation and does not by itself authorize AUDIO code before
this docs-only checkpoint is reviewed, manually committed/pushed, independently
verified at its exact remote SHA and green in GitHub CI.

Inspection baseline:

```text
ad6590ea87fd6b94941554ace7950827b1b0c72b
docs(roadmap): close UXP-05B
GitHub CI run 246
run id 33229789932
success
```

### Evidence-backed inspection result

The exact accepted baseline proves:

```text
AssetType already recognizes IMAGE / VIDEO / AUDIO / DOCUMENT;
Asset technical metadata already carries mimeType / sizeBytes / optional durationMs;
Prisma persists assetType as a string and durationMs as an optional integer;
PrismaAssetRepository validates persisted assetType through the canonical isAssetType guard;
AUDIO therefore already fits the canonical persistence shape with no schema migration required;
AUDIO is modeled/persistable but is not currently authorable through accepted upload validation;

canonical upload validation currently accepts only image/png, image/jpeg and bounded video/mp4;
canonical upload has a 10 MiB hard limit and rejects empty/invalid content;
Media upload already uses the permission media.asset.upload;
session/permission preauthorization occurs before the upload handler;
upload persistence/storage/audit already use the shared Media transaction path;

public raw Media delivery already uses GET /media/assets/:id/content;
public delivery currently allows ACTIVE IMAGE and bounded supported VIDEO only;
StorageObjectStore reads/writes whole objects and has no byte-range contract;
currently deliverable ACTIVE IMAGE/VIDEO Media is retrievable by Asset ID under the accepted visibility contract;
once UXP-05C admits the frozen AUDIO delivery profile, ACTIVE AUDIO will inherit the same public-by-ID visibility;
Page publication is not a privacy boundary for raw Media;

Composition already accepts MEDIA_ASSET references by canonical Asset ID;
Composition resolves ACTIVE Asset type + optional duration server-side;
Creator and public Page preview already preserve typed AUDIO projection;

Creator Page composition already has the correct generic upload/reference seam;
the current Page workspace file picker is image-only and may be extended minimally;
KnowledgeMediaManager is intentionally IMAGE / VIDEO STILL / SHORT_LOOP only and is not an AUDIO surface;

ExperienceMediaContent is already shared by public Experience and Creator preview;
its current AUDIO branch degrades explicitly and is the bounded presentation seam to evolve;

no ffmpeg / ffprobe / generic Media probing dependency exists;
the accepted Media package already contains a bounded ISO-BMFF/MP4 parser pattern for short VIDEO.
```

### Frozen initial AUDIO profile

UXP-05C implementation is limited to one initial browser-oriented AUDIO profile:

```text
canonical Asset type: AUDIO
accepted declared MIME: audio/mp4
container: ISO Base Media File Format / MPEG-4
required audio track: hdlr=soun with an mp4a sample entry
accepted codec profile: AAC-LC (MPEG-4 Audio Object Type 2)
acceptance fixture: AAC-LC in the accepted mp4a track
maximum bytes: existing MEDIA_UPLOAD_MAX_BYTES = 10 MiB
required duration: positive integer durationMs derived from the accepted audio track mdhd metadata
product maximum duration: none is invented by UXP-05C beyond the existing 10 MiB byte bound
```

Do not reuse the VIDEO `8000 ms` ceiling for AUDIO. That limit belongs to the
bounded VIDEO/SHORT_LOOP contract and has no accepted AUDIO product basis.

The file name or extension is never authoritative. `audio/mp4` is accepted only
when server-side byte inspection proves the bounded ISO-BMFF audio shape and the
accepted AAC-LC codec profile. The parser must validate the relevant `esds` /
AudioSpecificConfig metadata strongly enough to prove MPEG-4 Audio Object Type 2
(AAC-LC); an `mp4a` sample-entry marker alone is not sufficient. Other `mp4a`
audio object types remain outside the initial UXP-05C profile.

### Frozen byte/content validation

The server must extend the accepted bounded MP4 inspection style rather than
trusting the multipart MIME string alone.

For initial AUDIO acceptance it must safely prove, with boundary-checked parsing:

```text
non-empty bytes;
<= 10 MiB;
declared MIME is exactly audio/mp4;
first/top-level ISO-BMFF structure is plausible and includes ftyp;
moov metadata exists;
an audio track is present and identified as soun;
the accepted audio sample entry is mp4a;
the mp4a codec configuration proves AAC-LC / MPEG-4 Audio Object Type 2;
a positive finite/safe durationMs is derivable;
the initial AUDIO profile does not contain a VIDEO track;
truncated/impossible box sizes and malformed metadata are rejected safely.
```

A video-only MP4 renamed or declared as `audio/mp4` must be rejected. A mixed
AUDIO+VIDEO file is outside this initial AUDIO profile. Do not add transcoding,
codec normalization, waveform analysis or a generic probe service.

### Frozen upload, authorization and audit path

AUDIO must reuse the existing canonical route and Media ownership:

```text
POST /media/assets
session validation
media.asset.upload Permission
MediaUploadPreauthorizationGuard
UploadAssetAsActor
Media upload transaction
audit record
media/assets/{id}/original storage reference
ACTIVE initial lifecycle
```

No AUDIO-specific upload endpoint, permission, repository, table or storage
abstraction is authorized.

The existing audit context already carries Asset type, MIME, size, optional
duration and lifecycle. AUDIO uses that same evidence path.

### Frozen Creator authoring/attach path

UXP-05C extends only the existing Page/Experience Creator path:

```text
Creator workspace accepts the frozen audio/mp4 profile;
upload uses the existing generic Media upload API;
success returns the canonical AUDIO Asset ID;
Page composition attaches it as kind=MEDIA_ASSET with that ID;
server-side Media resolution remains the source of assetType/duration truth;
Creator preview uses the shared Experience Media renderer.
```

Do not add AUDIO to `KnowledgeMediaManager`; its accepted STILL/SHORT_LOOP model
remains IMAGE/VIDEO-only. Do not create a Creator Studio redesign or a second
AUDIO authoring workflow.

### Frozen public delivery and visibility

Initial AUDIO delivery extends the existing Media content route only:

```text
GET /media/assets/:id/content
ACTIVE AUDIO only for the accepted audio/mp4 profile
Content-Type: audio/mp4
correct Content-Length
stored-byte length must still match canonical technical metadata
```

No signed URL, new public AUDIO endpoint, streaming service or range-read Storage
contract is introduced. HTTP Range/seekable long-form streaming is not promised
by UXP-05C. If real implementation/acceptance evidence proves Range is required,
stop and re-freeze that capability rather than silently expanding Storage.

The accepted Media visibility implication remains explicit: after upload creates
an ACTIVE Asset, anyone who knows its Asset ID may retrieve it through the public
Media content route even before a Page referencing it is published. Creator UI
for AUDIO must state this public-by-ID behavior before upload.

### Frozen Web/accessibility behavior

Public Experience and Creator preview must continue to share one renderer.
Accepted AUDIO presentation is native, user-started playback:

```text
<audio controls preload="none">
meaningful accessible label tied to the Experience context;
no autoplay;
no loop;
no hidden background playback;
no page understanding that depends on audio;
honest unavailable/error fallback without failing the whole Experience.
```

Do not add a custom Web Audio player, waveform, playlist, visualization or
background-audio subsystem. AUDIO never supplies an Open Graph image; UXP-05B
eligible-IMAGE social precedence remains unchanged.

### Frozen rights/operator boundary

UXP-05C does not pretend to perform automated copyright/licensing verification.
The operational content rule remains:

```text
original audio;
owned audio;
properly licensed audio;
royalty-cleared audio;
otherwise operator-verified usage rights.
```

A short commercial excerpt is not automatically licensed. The Creator AUDIO
surface must communicate both the rights rule and the public-by-ID visibility
before upload. The acceptance fixture must be original/generated or otherwise
clearly rights-safe. Permission to upload is not evidence of copyright ownership,
and no speculative rights database/policy engine is introduced here.

### Frozen implementation proof

The later UXP-05C implementation checkpoint must prove, at minimum:

```text
Media unit:
- valid audio/mp4 acceptance fixture resolves to AUDIO with positive durationMs;
- malformed/truncated/spoofed audio/mp4 is rejected;
- mp4a content whose codec configuration is not AAC-LC / Audio Object Type 2 is rejected;
- video-only or mixed VIDEO content declared as AUDIO is rejected;
- empty/wrong-MIME/oversize content is rejected;
- parser boundary/size safety is covered;

API/integration:
- unauthorized upload is rejected through the existing authorization boundary;
- authorized AUDIO upload returns AUDIO + audio/mp4 + size + duration + ACTIVE;
- audit retains AUDIO/MIME/size/duration/lifecycle evidence;
- public delivery returns exact bytes with audio/mp4 and correct length;
- non-deliverable lifecycle/not-found behavior remains safe;

Composition:
- an ACTIVE AUDIO Asset attaches through the existing MEDIA_ASSET reference;
- Creator preview and published projection preserve AUDIO + durationMs;

Web:
- shared Creator/public renderer exposes native user-started controls;
- preload=none and no autoplay/loop are proven;
- load failure degrades without page failure;
- AUDIO never becomes social-image metadata;
- 390px and desktop presentation do not overflow;

Regression/governance:
- accepted IMAGE/VIDEO Experience behavior remains green;
- KnowledgeMediaManager remains IMAGE/VIDEO-only;
- no database migration is introduced; if implementation evidence claims one is required, stop and re-freeze;
- no Search/UXP-05D/UXP-06 expansion;
- format/lint/typecheck/unit/integration/focused browser/full browser/build/architecture evidence;
- reviewed evidence ZIP;
- manual checkpoint commit/push;
- exact remote SHA + exact GitHub CI green.
```

If implementation evidence contradicts any frozen assumption, classify the
mismatch and return to this capability contract. Do not silently expand scope.

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

After this docs-only UXP-05C capability micro-freeze checkpoint is reviewed,
manually committed/pushed, independently verified at its exact remote SHA and
GitHub CI is green:

```text
UXP-04 — CLOSED — ACCEPTED
UXP-05 — ACTIVE
UXP-05A — CLOSED — ACCEPTED — 8da119f2aad069d8ee26e8a65f8631d7625fa950
UXP-05B — CLOSED — ACCEPTED — 403ac69198185a7cd35b85178e4342ed5f1f2a0f
UXP-05C — ACTIVE — FROZEN IMPLEMENTATION NEXT
UXP-05D — NOT STARTED — GATED ON UXP-05A/B/C ACCEPTANCE
UXP-06 — NOT STARTED — BLOCKED ON FULL UXP-05 ACCEPTANCE
UXP-08 Search expansion — NOT STARTED
WPR-M05 — ACTIVE
P10-M04 — SEQUENCING-BLOCKED
```

The Master Roadmap remains unchanged. This micro-freeze authorizes no production
AUDIO work until the micro-freeze checkpoint itself is exact-remote verified and
green in CI.

---

# 13. Next Action

After this micro-freeze checkpoint is remotely green, implement only the frozen
UXP-05C AUDIO capability:

```text
audio/mp4 initial profile with mp4a + AAC-LC / Audio Object Type 2 validation;
existing 10 MiB upload bound;
positive durationMs with no invented AUDIO duration ceiling;
bounded server-side ISO-BMFF audio inspection;
existing Media upload/auth/audit/storage path;
existing public Media content route;
existing Composition MEDIA_ASSET reference;
Creator Page/Experience upload + attach only;
shared Creator/public native user-started AUDIO rendering;
rights/public-by-ID disclosure;
focused security/accessibility/regression proof.
```

Do not add AUDIO to Knowledge media. Do not introduce HTTP Range, a generic
transcoding/probing platform, signed delivery, a rights engine, Search expansion,
UXP-05D production work or UXP-06 work unless new acceptance evidence forces a
separate explicitly reviewed architecture decision.
