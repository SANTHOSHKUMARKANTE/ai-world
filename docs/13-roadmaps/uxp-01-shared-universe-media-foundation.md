# AI World UXP-01 — Shared Universe + Media Foundation

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-01 |
| Area | Product / Web / Knowledge / Media |
| Status | CLOSED — ACCEPTED |
| Created | 2026-08-23 |
| Baseline | `04061464d2621bb55a1b6dd4e68fe68312729d50` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Scope | Smallest shared Universe + Media foundation required by the finished Anime Character page |
| Roadmap Effect | None until WPR-M05 closes |
| Closed | 2026-08-24 |
| Closure Baseline | `573cc1b2e24345c2571698326eb4041bc493da0b` |

---

# 1. Purpose

UXP-01 freezes and implements only the reusable presentation and Media capability
that the first finished Anime Character page has now proven it needs.

The governing sequence remains:

```text
UXP-01
Shared Universe + Media foundation
        ↓
UXP-02
Finished Anime Character page
        ↓
Second-character reuse proof
        ↓
Character-page UAT
```

UXP-01 is not a generic frontend architecture exercise.

It must not attempt to finish every future Media, Creator, Composition, Anime, or
Devotional capability.

The design rule is:

> Build the smallest correct shared contract required by the real Character consumer while preserving canonical ownership and leaving future media/presentation evolution possible.

---

# 2. Evidence Reviewed Before Freeze

This contract was derived from the current repository at the baseline above and
from the accepted architecture rather than from a new design imposed on the
project.

The review included:

```text
public Knowledge Entity contract;
Knowledge Entity persistence;
Knowledge-to-Media association;
Media Asset model;
Media upload validation;
Media delivery;
Media thumbnail generation;
filesystem Storage adapter;
S3-compatible Storage adapter;
Creator Media upload;
Creator Knowledge mutation;
Composition public Media delivery;
Identity / Permission evaluation;
Web Universe presentation;
Entity Experience rendering;
Web semantic token CSS;
Web Product Readiness decision;
Capability Map;
Ownership Model;
Dependency Rules;
Extension Model;
Architecture Boundaries;
production object-storage provider decision.
```

Current implementation facts at this baseline are:

```text
AssetType already includes IMAGE / VIDEO / AUDIO / DOCUMENT;

upload currently accepts only PNG and JPEG;

public delivery currently delivers only ACTIVE IMAGE Assets;

the accepted Media integration test explicitly treats ACTIVE image delivery by
Asset ID as public;

StorageObjectStore currently reads/writes whole objects and has no byte-range
contract;

PublicKnowledgeEntity currently exposes assetIds only;

KnowledgeResourceAssetReference currently stores only resource ID + Asset ID;

Entity media ordering is therefore currently accidental Asset-ID ordering;

the Entity Experience chooses assetIds[0] as hero;

alt text is currently synthesized by the Web rather than supplied by canonical
placement context;

Creator Media upload is permission protected;

Knowledge Resource Media-reference mutation is permission protected;

the Web Universe presentation registry currently contains only label / tone /
description;

Anime section vocabulary is currently expressed by named conditional logic in
the shared Entity renderer.
```

Those proof-era constraints are sufficient for architecture validation.

They are not sufficient for the finished Character page.

---

# 3. Governing Ownership

Canonical ownership remains:

```text
Universe
    owns domain definition and presentation configuration

Knowledge
    owns canonical Knowledge Resource instances
    and the contextual fact that a Knowledge Resource references an Asset

Media
    owns Asset
    Asset type
    Asset lifecycle
    Media technical metadata
    Media processing / variants
    Media delivery policy

Storage Foundation
    owns object-storage interaction

Web Application
    owns first-party Web presentation and interaction composition

Identity & Access
    owns Permission representation and evaluation
```

UXP-01 must not transfer Asset ownership into Knowledge.

UXP-01 must not make Media depend on Knowledge or Composition.

The accepted dependency-cycle rule remains:

```text
Knowledge → Media
    may use a narrow Media public Contract

Media → Knowledge
    must not be introduced
```

No Platform dependency cycle is authorized.

---

# 4. UXP-01 Boundary

UXP-01 is divided into five bounded implementation slices:

```text
UXP-01A
Typed Web Universe presentation

UXP-01B
Contextual Knowledge Media placement

UXP-01C
Public Entity Media descriptor

UXP-01D
Bounded short-motion Media support + shared Web renderer

UXP-01E
Minimum Creator management + foundation acceptance
```

A slice is implemented and validated before the next slice expands the change
surface.

UXP-01 does not itself complete the Anime Character page.

UXP-02 remains responsible for the final Character hierarchy, content depth,
creator journey, social metadata, and page-level UAT.

---

# 5. Typed Universe Presentation

## 5.1 Ownership

The first-party Web Universe presentation registry remains owned inside:

```text
apps/web
```

during WPR-M05.

No new:

```text
packages/ui
generic theme engine
frontend plugin runtime
```

is introduced.

## 5.2 Stable shape

The current:

```text
universeKey
label
tone
description
```

registry evolves only enough to express real shared Entity presentation needs.

The typed configuration may additionally carry:

```text
motion profile;
Entity vocabulary / section labels;
small semantic presentation hints required by the shared renderer.
```

The exact TypeScript property spelling is implementation detail.

The durable semantic requirements are not.

## 5.3 CSS boundary

Universe expression is applied through semantic CSS custom properties at the
Universe/Entity root.

The initial vocabulary should remain small, for example:

```text
--aw-universe-surface
--aw-universe-surface-raised
--aw-universe-text
--aw-universe-text-muted
--aw-universe-accent
--aw-universe-focus
--aw-universe-hero-scrim
```

Exact values are replaceable.

The semantic role is the contract.

The base `--aw-*` AI World tokens remain the shared shell vocabulary.

## 5.4 Anime

Anime may express:

```text
higher contrast;
deeper surfaces;
stronger content-driven accent;
more cinematic hero treatment;
energetic but controlled motion.
```

The global Anime definition must not hard-code Naruto colors.

Character imagery and content should supply most Character-specific color and
mood.

## 5.5 Devotional

Devotional may express:

```text
warmer / calmer surfaces;
gentler contrast;
restrained accent;
calmer motion;
more breathing room.
```

It remains the same AI World interaction system.

## 5.6 No named Universe branches in the shared renderer

Proof-era logic such as:

```text
if universe === anime
```

inside generic section-title rendering should be replaced by typed presentation
configuration where the variation is declarative.

Do not replace one switch with an untyped dictionary of arbitrary behavior.

Configuration must remain typed and validated.

## 5.7 No per-Character themes

Do not introduce:

```text
NarutoTheme
SasukeTheme
KakashiTheme
ShivaTheme
HanumanTheme
```

An individual Resource may later supply a small typed accent/presentation hint
only when a real page proves the need.

That is not part of UXP-01.

---

# 6. Media Asset Contract

## 6.1 Keep the canonical Asset types

The canonical Media types remain unchanged:

```text
IMAGE
VIDEO
AUDIO
DOCUMENT
```

Do not add:

```text
SHORT_VIDEO
ANIME_VIDEO
DEVOTIONAL_VIDEO
SOCIAL_VIDEO
```

A short Character loop is canonically a:

```text
VIDEO Asset
```

Its use as short motion is contextual presentation.

## 6.2 Technical metadata

Media remains the owner of technical metadata.

UXP-01 may extend the current technical metadata beyond:

```text
mimeType
sizeBytes
```

with only the fields required by real image/video presentation:

```text
width?
height?
durationMs?
```

Backward compatibility with existing persisted Assets must be non-destructive.

Existing rows may therefore have absent optional metadata.

New VIDEO uploads used as short motion must have a valid positive
`durationMs`.

No checksum, codec catalog, bitrate model, rendition graph, or transcoding state
is introduced merely for UXP-01.

---

# 7. Contextual Knowledge Media Placement

## 7.1 Why the association must evolve

The current Knowledge association stores only:

```text
knowledgeResourceId
assetId
```

That cannot express:

```text
editorial order;
hero selection;
gallery/highlight intent;
still vs short-loop behavior;
alt text;
caption;
video poster.
```

Those are properties of how a Knowledge Resource uses an Asset.

They are not canonical properties of the Asset itself.

## 7.2 Placement model

The existing Knowledge-to-Media reference evolves into a contextual placement.

Conceptually:

```text
KnowledgeMediaPlacement

knowledgeResourceId
assetId

role
playback
position

altText
caption?

posterAssetId?
```

The physical Prisma model name may remain
`KnowledgeResourceAssetReference` if evolving it in place is the smallest
non-destructive implementation.

A rename is not required for product value.

## 7.3 Initial placement roles

UXP-01 needs only:

```text
HERO
GALLERY
HIGHLIGHT
```

Do not create dozens of speculative roles.

## 7.4 Initial playback modes

UXP-01 needs only:

```text
STILL
SHORT_LOOP
```

`USER_PLAY` becomes eligible when a real seekable/general-video consumer is
implemented.

## 7.5 Placement invariants

For the new write contract:

```text
one Asset appears at most once for one Knowledge Resource;

positions are deterministic and unique inside the Resource;

the ordered request array is the source of position;

at most one placement has role HERO;

IMAGE accepts playback STILL;

VIDEO accepts playback SHORT_LOOP in UXP-01;

SHORT_LOOP requires a VIDEO Asset;

SHORT_LOOP requires a posterAssetId;

posterAssetId must resolve to an ACTIVE IMAGE Asset;

SHORT_LOOP requires positive duration metadata and must not exceed 8 seconds;

altText is required for new meaningful placements;

caption is optional.
```

The creative target remains approximately:

```text
3–8 seconds
```

with approximately five seconds as a common target.

The eight-second value is the initial product ceiling for the
`SHORT_LOOP` playback mode, not a new Media Asset type.

## 7.6 Existing rows

Migration must not delete existing local Media references.

Existing reference rows are backfilled deterministically where schema changes
require values.

Acceptable compatibility direction:

```text
role       → GALLERY
playback   → STILL
position   → deterministic order based on existing reference order/Asset ID
altText    → nullable legacy value
caption    → null
poster     → null
```

New placement writes must satisfy the stronger UXP-01 invariants.

The public Web may use a bounded legacy alt fallback for migrated rows until the
content is re-authored.

Do not infer rich semantic captions from Asset IDs.

---

# 8. Public Entity Media Descriptor

## 8.1 Replace the proof-era ID-only media projection

The finished Entity contract must not require the Web to guess Media meaning
from:

```text
assetIds[]
```

UXP-01 introduces an ordered typed projection conceptually equivalent to:

```text
media: [
  {
    assetId
    assetType
    mimeType

    role
    playback
    position

    altText
    caption

    width
    height
    durationMs

    posterAssetId
  }
]
```

Optional metadata remains optional where a legacy Asset cannot provide it.

## 8.2 Ownership-safe enrichment

Knowledge may depend on a narrow Media public descriptor/read Contract to
resolve:

```text
Asset existence
Asset type
ACTIVE lifecycle eligibility
public-safe technical metadata
```

Knowledge must not read or mutate Media persistence internals directly.

Media must not be taught Knowledge publication semantics.

## 8.3 Publication

A public Entity is still returned only when the Knowledge Resource is
`PUBLISHED`.

The Entity media array contains only placements whose referenced primary Asset
is currently eligible through the Media Asset descriptor contract.

An unavailable / archived / deleted Asset is omitted from public Entity media.

## 8.4 No storage leakage

Public Entity responses must never expose:

```text
storageReference
filesystem path
bucket name
object key
provider credentials
provider SDK object
```

## 8.5 `assetIds` transition

`assetIds[]` is a proof-era Web/API contract.

Once all in-repository Entity consumers are migrated in the same UXP-01 slice,
the preferred direction is:

```text
media[]
```

rather than maintaining two long-lived authoritative media projections.

If a temporary compatibility field is needed inside one bounded migration, it
must be derived from the same placement source and removed before UXP-01 closes.

## 8.6 Relationship preview

Related-Entity cards may continue to receive one `previewAssetId` in UXP-01.

Preview selection should become semantic rather than raw UUID ordering:

```text
HERO image
    else
poster image for HERO short motion
    else
first eligible image placement
    else
no preview
```

A full nested Media descriptor for every related card is not required yet.

---

# 9. Initial VIDEO Upload Contract

## 9.1 Image behavior remains

Existing accepted image upload remains:

```text
image/png
image/jpeg
```

## 9.2 Initial video container

UXP-01 adds only:

```text
video/mp4
```

for VIDEO upload.

No WebM matrix, HLS, DASH, adaptive streaming, or transcoding pipeline is added.

## 9.3 Size

The existing initial upload hard limit remains:

```text
10 MiB
```

for UXP-01 unless implementation evidence proves that the transport itself
requires a smaller limit.

The short-loop product rule is primarily duration-based.

## 9.4 Validation

Server-side upload validation must at minimum:

```text
reject empty files;
enforce the byte limit;
require declared video/mp4;
verify a plausible ISO BMFF / MP4 container signature;
extract a positive durationMs for accepted VIDEO;
reject malformed Media input safely.
```

UXP-01 does not promise arbitrary MP4 codec interoperability.

The acceptance fixture should use a broadly compatible MP4/H.264 video encoding.

A future ingestion/transcoding pipeline may normalize codecs when a real
consumer justifies it.

## 9.5 Audio inside short motion

`SHORT_LOOP` meaning must never depend on audio.

Web short-loop playback is always muted by default.

Meaningful audible media is deferred to a user-started media capability with
the required accessibility contract.

---

# 10. Initial VIDEO Delivery Contract

## 10.1 Existing Media route ownership

Media continues to own raw Asset delivery.

UXP-01 may extend the existing Media content delivery use case from:

```text
ACTIVE IMAGE
```

to:

```text
ACTIVE IMAGE
ACTIVE VIDEO
```

while preserving correct MIME and content length behavior.

## 10.2 Thumbnail / poster

Image thumbnail generation remains image-specific.

UXP-01 does not introduce automatic video-frame extraction.

A short VIDEO uses its creator-selected IMAGE poster.

The poster may use the existing image thumbnail/content delivery path.

## 10.3 Whole-object delivery is acceptable only for this bounded short-loop slice

The current Storage contract reads whole objects.

UXP-01 does not extend Storage into byte-range streaming merely to display a
bounded short loop.

This is acceptable because the initial short-motion contract is:

```text
small;
<= 10 MiB upload limit;
<= 8 seconds when placed as SHORT_LOOP;
non-seekable presentation;
loop-focused rather than long-form playback.
```

## 10.4 Range is a future precondition for general video

Before AI World introduces:

```text
seekable long-form video;
general user-started video player;
large Media delivery;
streaming-oriented playback;
```

the Media/Storage design must be revisited for HTTP Range delivery.

That later work may require a narrow range-read extension in
`StorageObjectStore` and both filesystem/S3-compatible adapters.

Provider-specific DigitalOcean APIs must not leak into the Media contract.

---

# 11. Public Media Visibility And Security

## 11.1 Preserve the existing accepted contract

At the UXP-01 baseline, the Media API integration test explicitly proves:

```text
an ACTIVE initial image Asset is publicly deliverable by Asset ID.
```

UXP-01 does not silently redefine that accepted Media visibility contract.

Extending Media delivery to VIDEO therefore preserves:

```text
ACTIVE Asset
    → delivery eligible
```

for the supported delivery types.

## 11.2 Publication remains separate

Knowledge publication answers:

```text
may this Knowledge Resource appear in the public Knowledge/Entity contract?
```

Media ACTIVE lifecycle answers:

```text
is this Asset eligible for Media delivery?
```

Those are different lifecycle concepts.

The public Entity contract must expose Media placements only from a published
Knowledge Resource.

## 11.3 Known implication

An uploaded ACTIVE Asset may be directly retrievable when its Resource ID is
known even before a Knowledge Resource/Page referencing it is published.

That is existing Media behavior.

UXP-01 records the implication explicitly rather than pretending that Knowledge
publication makes the raw Asset private.

## 11.4 Future private Asset requirement

If AI World later requires:

```text
private creator uploads;
draft-only Asset confidentiality;
signed delivery;
audience-scoped Media;
rights-driven delivery restriction;
```

that is a new Media visibility/delivery-policy capability.

It must be owned by Media (with Policy integration where appropriate).

Do not solve it by making:

```text
Media → Knowledge
Media → Composition
```

dependencies.

That future capability is not authorized by UXP-01.

---

# 12. Creator And Authorization Contract

## 12.1 Keep existing security ownership

Media upload continues to require:

```text
media.asset.upload
```

Knowledge Media placement mutation continues to require the accepted Knowledge
update permission:

```text
knowledge.resource.update
```

No new:

```text
Naruto admin
Anime media admin
Devotional media admin
```

role is introduced.

## 12.2 Evolve the Knowledge write contract

The Asset-ID-only Knowledge mutation is insufficient for the Character page.

The preferred replacement is conceptually:

```text
PUT /knowledge/resources/:id/media
```

with an ordered body such as:

```text
placements:
  - assetId
    role
    playback
    altText
    caption?
    posterAssetId?
```

The server derives `position` from the ordered array.

Exact transport naming may change only if the existing API composition makes a
different name materially simpler.

There must not be two long-lived authoritative write paths to the same
Knowledge media-placement state.

## 12.3 Server validation

The server, not the Web, enforces:

```text
Permission;
Knowledge Resource existence;
Asset existence;
Asset ACTIVE lifecycle;
Asset/playback compatibility;
single-HERO rule;
duplicate rejection;
poster validity;
SHORT_LOOP duration ceiling.
```

Hiding Creator controls is not authorization.

## 12.4 Creator UI scope

UXP-01 may add only the minimum management control required to prove the
foundation:

```text
upload/select Media;
choose role;
choose still/short-loop behavior where applicable;
set order;
enter alt text;
enter optional caption;
select poster for VIDEO;
save placement.
```

The full Creator Studio redesign remains UXP-10.

The complete Character-authoring journey remains UXP-02.

---

# 13. Shared Web Media Renderer

The shared renderer remains inside:

```text
apps/web
```

and is introduced only because the Entity Experience consumes it.

## 13.1 IMAGE

Image presentation must support:

```text
real alt text from placement context;
responsive sizing;
stable layout;
caption where provided;
poster reuse.
```

## 13.2 SHORT_LOOP VIDEO

Short-loop rendering uses Web-standard video behavior:

```text
autoplay
muted
loop
playsInline
poster
preload="metadata" or a comparably bounded preload strategy
```

No audible autoplay is allowed.

No controls are required for a non-seekable decorative/ambient short loop.

## 13.3 Reduced motion

When the user prefers reduced motion:

```text
do not automatically play SHORT_LOOP;
render the poster/still-first representation;
do not make page understanding depend on motion.
```

CSS transition reduction alone is not sufficient.

Video autoplay state must also respect the preference.

## 13.4 Failure fallback

If short motion cannot load or decode:

```text
keep the poster visible;
do not leave an empty hero/card;
do not convert playback failure into a page failure.
```

## 13.5 No general media viewer yet

UXP-01 does not create a general-purpose DAM viewer, editor, timeline, or
seekable video player.

---

# 14. Social And Media Deep-Link Boundary

The existing product contract remains:

```text
canonical Character URL
+
optional campaign/query context
```

A future `media=<asset-id>` query may select/highlight a Media placement only
when that Asset belongs to the current public Entity.

Invalid or unrelated Media IDs are ignored or rejected safely.

They never redefine canonical Character identity.

UXP-01 may create a small parsing/helper primitive only when the current Entity
route consumes it.

Full Character social metadata and share UX remain UXP-02.

---

# 15. UXP-01 Implementation Slices

## UXP-01A — Typed Universe presentation

Expected production scope:

```text
apps/web Universe presentation registry;
shared Entity vocabulary consumption;
semantic Universe CSS variables;
Anime + Devotional mappings;
no Character-specific branch.
```

Proof:

```text
Anime and Devotional render through the same Entity component;
shared renderer contains no new named-Character styling;
existing Shiva/Hanuman/Naruto behavior regresses safely.
```

## UXP-01B — Knowledge Media placement

Expected production scope:

```text
non-destructive Prisma migration;
placement type/validation;
repository/read/write evolution;
narrow Media reference/descriptor dependency;
Creator API request validation;
authorization tests.
```

Proof:

```text
ordered placement persists;
duplicate/HERO/playback/poster invariants enforced;
existing rows survive migration;
unauthorized mutation denied.
```

## UXP-01C — Public Entity Media descriptor

Expected production scope:

```text
public Entity projection media[];
ACTIVE Asset filtering;
public-safe technical metadata;
semantic relation preview selection;
Web API contract migration.
```

Proof:

```text
no storageReference leaks;
unpublished Entity remains unavailable;
archived/deleted Asset is absent;
ordered descriptor is deterministic.
```

## UXP-01D — Bounded short-motion delivery

Expected production scope:

```text
video/mp4 upload validation;
VIDEO technical metadata needed by short motion;
ACTIVE VIDEO delivery;
creator-selected poster validation;
shared IMAGE / SHORT_LOOP Web renderer;
reduced-motion behavior.
```

Proof:

```text
supported MP4 fixture uploads;
malformed/oversize file rejected;
short-loop placement >8s rejected;
poster fallback works;
autoplay is muted;
reduced-motion prevents automatic motion.
```

## UXP-01E — Foundation acceptance

Required evidence:

```text
format;
lint;
typecheck;
focused unit tests;
database migration deployment;
focused Knowledge/Media integration;
full relevant API integration;
focused browser proof;
full browser E2E;
production build;
architecture check;
exact staged file set;
reviewed evidence ZIP;
commit/push evidence;
user-reported CI green.
```

Do not mark UXP-01 complete merely because an image/video appears on screen.

---

# 16. Explicit Non-Goals

UXP-01 does not authorize:

```text
generic theme engine;
packages/ui;
frontend plugin runtime;
per-Character themes;
Anime-specific Media Platform;
Devotional-specific Media Platform;

HLS;
DASH;
adaptive bitrate streaming;
video transcoding farm;
long-form seekable video;
automatic video-frame poster extraction;
audio-first playback;
music licensing system;
Media Rights implementation;
private/signed Asset delivery;
general Digital Asset Management system;

generic WYSIWYG editor;
Creator Studio redesign;
collaboration;
social-network API publishing;
social scheduling;
analytics/recommendation infrastructure;

Anime landing page;
Anime Series page;
Devotional redesign;
homepage redesign;
P10-M04 deployment work.
```

---

# 17. External Product / Web-Standard Research Inputs

UXP-01 uses external products as interaction references, not visual templates.

Relevant inputs reviewed for the UXP program include:

```text
AniList
structured Character identity + relationships

Crunchyroll
cinematic identity + clear primary content action

Spotify Canvas
short 3–8 second visual-loop pattern + social distribution concept

Headspace
calm presentation + user-intent audio behavior

Open Graph
canonical social metadata identity

MDN Web Media
video autoplay / muted / playsInline / poster behavior
HTTP Range behavior for seekable media

WCAG 2.2
reduced-motion / media accessibility obligations and no-surprise audio direction
```

These inputs do not override AI World's accepted architecture.

---

# 18. Exit Rule

UXP-01 closes only when the shared foundation is proven by the current Entity
consumer and leaves the repository ready to begin:

```text
UXP-02 — Anime Character
```

without another architecture redesign.

The first UXP-02 task after UXP-01 closure is to finish Naruto through real
canonical/API-driven Character data and then prove the same finished renderer
with a second Anime Character.

No Anime landing page begins before Character acceptance.

---

# 19. Closure Record

UXP-01 is closed and accepted.

The implementation sequence was completed as:

```text
contract freeze
05cc0c2dbec14ba04d07b2c70f128ed11e91b332

UXP-01A — Typed Universe presentation
8949aa0aeff6cc4b149ccb7b5e2bbf31605dcd77

UXP-01B — Contextual Knowledge Media placement
3864cda1e48098b1e0d2aa131a77f537f5c57300

UXP-01C — Public Entity Media descriptor
0b16dd711b65b1ef847337f2a69ecc0d98311125

UXP-01D — Bounded short-motion VIDEO
3cbbc9b663c3ebfd94078f5bee0837da76aa5b00

UXP-01E — Minimum Creator management + foundation acceptance
573cc1b2e24345c2571698326eb4041bc493da0b
```

The accepted UXP-01E evidence proved:

```text
typed Universe presentation remained intact;
ordered contextual IMAGE / SHORT_LOOP VIDEO Media remained intact;
Media ownership and public-safe descriptor boundaries remained intact;
bounded MP4 upload/delivery and reduced-motion poster fallback remained intact;
minimum permissioned Creator Media management worked;
Shiva / Hanuman / Naruto regression proofs passed;
format / lint / typecheck / unit / integration / browser / build /
architecture acceptance passed;
repository push completed;
CI was reported green on 2026-08-24.
```

The repository is therefore ready to begin the first finished page:

```text
UXP-02 — Anime Character
```

The governing detailed contract is:

```text
docs/13-roadmaps/uxp-02-anime-character-page.md
```

UXP-01 must not be reopened merely to redesign the shared foundation. A later
change to the foundation requires evidence from a real downstream page need.
