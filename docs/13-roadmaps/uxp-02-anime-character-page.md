# AI World UXP-02 — Finished Anime Character Page

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-02 |
| Area | Product / Web / Knowledge / Engagement / Creator |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-02C ACTIVE |
| Created | 2026-08-24 |
| Baseline | `573cc1b2e24345c2571698326eb4041bc493da0b` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Scope | Fully finish `/anime/characters/[slug]` and the minimum creator-management path that drives it |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Purpose

UXP-02 finishes the first AI World public content page end to end:

```text
/anime/characters/[slug]
```

Naruto is the primary proof fixture.

A second Anime Character must prove that the finished implementation is a
Character capability rather than Naruto-specific production code.

The page must satisfy the complete Page Definition of Done from the Web UI
Completion Program before UXP-03 may begin.

The governing rule is:

> Finish the Anime Character experience through the existing shared Platform capabilities, add only the canonical data and Creator controls the finished page actually needs, and preserve a clean path for later Anime Series and Devotional pages.

---

# 2. Repository Evidence Reviewed Before Freeze

The UXP-02 contract is based on the accepted repository after UXP-01 closure.

The review included:

```text
Anime Character route;
shared Entity Experience renderer;
public Knowledge Entity Web contract;
public Knowledge Entity API/controller/repository;
Knowledge Entity profile persistence;
Knowledge Entity relationship persistence;
Knowledge Entity configure use case;
Creator Knowledge Entity PUT endpoint;
Creator Knowledge + Media workspace;
minimum Creator Knowledge Media manager;
Engagement Favorite / Collection controls;
typed Universe presentation registry;
IMAGE / bounded SHORT_LOOP VIDEO rendering;
reduced-motion behavior;
Entity Playwright proofs;
Prisma schema and migration history;
UXP-01 closure evidence.
```

Current implementation facts are:

```text
the Anime Character route still renders the shared proof-era Entity Experience;

the public profile exposes slug / displayName / summary / facts only;

there is no long Character overview / biography field;

there is no explicit native name / alternate-name contract;

Knowledge relationships already support arbitrary canonical sectionKey /
relationshipType pairs and deterministic section positions;

the Creator API can PUT an Entity configuration but has no authorized GET path
for loading the current Entity profile + relationships;

the first-party Creator Web API does not yet expose Character Entity
configuration management;

the Creator workspace now manages contextual Media placements but not the full
Character profile / facts / relationships;

Favorite and Collection behavior already exists and is server-backed;

the Character page has no finished share / copy-link interaction;

the Anime route has no canonical Character metadata / Open Graph projection;

Media Highlights currently links raw Assets in a new tab rather than opening one
consistent page-owned viewer interaction;

short motion is already bounded, poster-backed, muted, inline and
reduced-motion-aware;

the shared Entity section vocabulary is sufficient for proof reuse but is not
deep enough to express the finished Anime Character information architecture;

Devotional Entity behavior must remain a regression target while Anime receives
its finished Universe-specific composition.
```

---

# 3. Architectural Decision

## 3.1 Anime may own page composition

The accepted architecture allows a Universe to own:

```text
presentation;
vocabulary;
domain metadata;
relationship semantics;
content composition.
```

Therefore UXP-02 may introduce an Anime Character composition inside:

```text
apps/web
```

without introducing:

```text
a second Anime application;
a generic theme engine;
packages/ui;
a frontend plugin runtime;
Naruto-specific production branches.
```

The Devotional page may continue using the current shared Entity proof
composition until UXP-06.

## 3.2 Shared capabilities remain shared

The finished Anime Character page continues to consume the accepted shared
boundaries for:

```text
Identity / Session;
Authorization;
Knowledge;
Media;
Engagement;
Storage;
typed Universe presentation;
API error behavior.
```

No Anime-specific Media, Engagement, Identity or Storage Platform is created.

## 3.3 Do not generalize prematurely

A helper/component is extracted only when the finished Character page and an
existing real consumer both need it.

UXP-02 is allowed to create an Anime-specific page composition.

UXP-02 is not allowed to create a generic page-builder framework merely because
future pages may eventually need one.

---

# 4. Canonical Character Profile Depth

The proof-era profile is:

```text
slug
displayName
summary
facts[]
```

The finished Character page requires a small explicit extension:

```text
slug
displayName
nativeName?
alternateNames[]
summary
overview?
facts[]
```

Semantics:

```text
summary
  short public identity / hero description;

overview
  longer Character story / biography text;

nativeName
  canonical native-script or native-language display name when available;

alternateNames
  ordered alternate / localized / alias names.
```

The existing `facts[]` remains the correct place for compact structured values
such as:

```text
series;
role;
affiliation;
rank;
birthday;
status;
team;
voice / production facts when modeled.
```

Do not add Character-only columns for every possible fact.

Do not replace the explicit profile with arbitrary display JSON.

## 4.1 Persistence direction

The minimum non-destructive profile evolution may add:

```text
native_name nullable;
alternate_names canonical ordered JSON array;
overview nullable text.
```

Existing Entity rows remain valid.

No destructive rewrite of Knowledge Entity persistence is authorized.

## 4.2 Validation direction

Server validation remains authoritative.

Initial bounds:

```text
nativeName
  optional, trimmed, <= 160 characters;

alternateNames
  <= 12 entries;
  each non-empty after trim;
  each <= 160 characters;
  duplicates rejected after canonical comparison;

overview
  optional;
  trimmed;
  <= 6000 characters.
```

Exact limits may be lowered only if existing product constraints require it.

---

# 5. Public Character Contract

The public Character API remains a typed projection of canonical Knowledge.

It may evolve the profile with:

```text
nativeName: string | null
alternateNames: string[]
overview: string | null
```

No private Creator data or persistence metadata is exposed.

The existing public-safe Media descriptor boundary remains unchanged unless a
real Character Media requirement proves a missing public field.

The page must continue to hide unpublished Resources.

Archived/deleted/unavailable Assets remain filtered by the Media-owned public
descriptor boundary.

---

# 6. Finished Anime Character Composition

The target page order is:

```text
1. Anime / series context
2. cinematic Character hero
3. identity: display + native / alternate names where available
4. role / series context from canonical facts / relationships
5. quick facts
6. Favorite / Collection / Share
7. Media Highlights
8. About / Character Story
9. Forms & Transformations
10. Training / Techniques / Abilities
11. Story Arcs / Key Moments
12. Allies
13. Rivals
14. Family / Relationships
15. Places / Affiliations
16. Quotes
17. Related Experiences
18. Related Characters
19. Series / Movies / Appearances where canonical data exists
20. Continue exploring Anime
```

Optional sections do not render when canonical data is absent.

No fake counts, fake popularity, fake ratings, fake episodes, fake staff, fake
streaming availability or fake actions are introduced.

---

# 7. Anime Relationship Semantics

Knowledge relationship persistence remains generic.

The Anime Web composition may recognize the following canonical section
vocabulary:

```text
entity.forms
entity.techniques
entity.arcs
entity.allies
entity.rivals
entity.family
entity.affiliations
entity.places
entity.quotes
entity.experiences
entity.characters
entity.series
```

Existing proof-era / Devotional keys remain supported for their existing
consumers.

Relationship types remain canonical namespaced keys.

The server does not gain an Anime-only relationship table.

The Creator Character manager may provide Anime-friendly section/type choices
while still writing the existing generic Knowledge relationship contract.

Ordering remains explicit and deterministic within each section.

---

# 8. Hero Contract

## 8.1 Desktop

The finished Anime hero should provide:

```text
cinematic split / layered composition;
large portrait or bounded short motion;
readable identity independent of the underlying image;
series / role context above the fold where canonical data exists;
native / alternate identity when available;
one clear Media action;
Favorite / Collection / Share nearby;
controlled Anime motion and energy accents.
```

## 8.2 Mobile

The mobile hero must provide:

```text
portrait-first media crop;
identity before secondary controls;
no horizontal overflow;
thumb-friendly actions;
no audible autoplay;
short motion that does not capture scroll;
reduced-motion poster fallback.
```

## 8.3 Reuse

Hero behavior is driven by Entity data and typed Anime presentation.

Production code must not contain branches such as:

```text
if Naruto
if Sasuke
if Sakura
if Kakashi
```

---

# 9. Engagement + Share

Favorite and Collection continue using the existing Engagement Platform.

UXP-02 may adapt the Character presentation of those controls without creating a
second engagement state model.

The Character page also adds:

```text
Share
Copy link
```

Preferred behavior:

```text
use navigator.share when available and initiated by the user;
provide a copy-link fallback;
report success/failure accessibly;
never imply social publishing occurred.
```

No social-network publishing API or scheduler is introduced.

---

# 10. Canonical URL + Social Metadata

The canonical Character identity is:

```text
/anime/characters/[slug]
```

Tracking/query context must not change canonical identity.

The route must provide canonical page metadata derived from the public
Character:

```text
title;
description;
canonical URL;
Open Graph title;
Open Graph description;
representative social image when an eligible public image/poster exists.
```

Campaign parameters such as UTM values remain non-canonical.

A `media=<asset-id>` query may select/highlight media only when that Asset is an
eligible placement on the current public Character.

Invalid/unrelated media IDs are ignored safely.

---

# 11. Character Media Viewer

Media Highlights becomes a mixed Character rail/grid driven by the accepted
public Media descriptors.

Supported in UXP-02:

```text
IMAGE;
bounded SHORT_LOOP VIDEO;
poster fallback;
page-owned viewer interaction.
```

The page no longer opens raw Media in a new browser tab as its primary
interaction.

## 11.1 Viewer behavior

The first viewer should be intentionally small:

```text
accessible dialog / overlay;
keyboard close;
Escape close;
visible close control;
focus returned to the invoking control;
image view;
bounded VIDEO poster;
explicit user-started VIDEO playback inside the viewer;
caption when authored;
alt / accessible name from placement context.
```

The ambient page rail may keep intentional muted SHORT_LOOP playback.

A viewer-opened VIDEO starts from explicit user action.

UXP-02 does not create:

```text
seek timeline;
long-form player;
Range-based general video platform;
HLS;
DASH;
transcoding;
DAM viewer framework.
```

The existing bounded full-object VIDEO constraint remains in force.

## 11.2 Audio boundary

AUDIO remains a canonical Media Asset type, but UXP-02 does not invent public
audio upload/delivery merely to fill an optional section.

If no accepted public AUDIO capability exists, the optional audio experience is
absent rather than faked.

---

# 12. Creator Character Management

The finished public Character page requires a real authorized management path.

UXP-02 extends the existing Creator workspace minimally.

Required Character management:

```text
load current Entity configuration;
edit slug;
edit display name;
edit native name;
edit alternate names;
edit short summary;
edit long overview;
manage facts;
manage relationships;
choose relationship section/type;
order relationships inside sections;
continue using the accepted Media placement manager;
preview the Character result;
publish/archive only through existing lifecycle behavior.
```

## 12.1 Creator read boundary

The current Entity configuration has an authorized write path but no matching
authorized read path.

UXP-02 may add conceptually:

```text
GET /knowledge/resources/:id/entity
```

using the accepted:

```text
knowledge.resource.update
```

permission.

Authorization must be evaluated before exposing Creator configuration.

No new Anime-admin role or Character-admin permission is introduced.

## 12.2 Write boundary

The existing authoritative Entity configuration write remains:

```text
PUT /knowledge/resources/:id/entity
```

and evolves only with the explicit profile fields required by UXP-02.

There must not be two authoritative Character profile write paths.

## 12.3 Preview

Authorized creators need a real way to verify the public composition before
publication.

The implementation may use a narrow Creator-only preview projection or a
Creator route consuming the same Character presentation.

It must not make a DRAFT Resource publicly available merely to preview it.

---

# 13. Loading / Error / Empty / Not Found

The finished page must distinguish:

```text
loading;
network / unexpected error;
not found / unpublished;
valid Character with missing optional sections.
```

Missing optional Character data is not a page error.

A Character with:

```text
no alternate names;
no overview;
no Media;
no transformations;
no quotes;
no related Experiences;
```

still renders a coherent page from the canonical data that does exist.

---

# 14. Accessibility + Responsive Contract

Engineering target:

```text
WCAG 2.2 AA
```

UXP-02 acceptance includes:

```text
semantic headings;
logical landmark order;
keyboard operation;
visible focus;
dialog focus behavior;
accessible status/error announcements;
meaningful Media alt text;
no surprise audible autoplay;
reduced-motion poster-first behavior;
desktop;
tablet;
390px-class mobile;
no horizontal overflow;
touch-friendly action targets.
```

The visual result must remain usable at 200% zoom for core content/actions.

---

# 15. UXP-02 Implementation Slices

## UXP-02A — Character canonical depth + Creator read boundary

Status:

```text
CLOSED — ACCEPTED
```

Accepted implementation checkpoint:

```text
a1df9afb749a4f3e3ece6a9e7709093ff174edc6
feat(knowledge): deepen character entity profiles
```

Production scope:

```text
non-destructive Knowledge profile evolution;
nativeName / alternateNames / overview;
server validation;
public profile projection;
authorized Creator Entity GET;
Creator API typed read/write contract;
migration probe;
Naruto + second-character API proof.
```

No finished-page visual redesign lands in A.

Proof:

```text
existing profiles migrate safely;
new profile fields persist deterministically;
public Entity exposes only public fields;
unauthorized Creator read denied;
authorized Creator can round-trip profile + ordered relationships;
second Character uses the same contract.
```

## UXP-02B — Finished Anime Character shell + social identity

Status:

```text
CLOSED — ACCEPTED
```

Accepted implementation checkpoint:

```text
c7d754f6851d90d36aabaf62a6b139ede4b6e963
feat(web): finish anime character shell
```

Production scope:

```text
Anime-specific Character composition in apps/web;
cinematic desktop/mobile hero;
identity / native / alternate names;
quick facts;
overview;
existing Engagement integration;
Share / Copy link;
canonical / Open Graph metadata;
loading / error / not-found states;
Shiva/Hanuman regression isolation.
```

Proof:

```text
Naruto desktop;
Naruto mobile;
anonymous;
authenticated Favorite / Collection;
canonical metadata ignores campaign parameters;
second Character uses the same component;
Devotional regression remains stable.
```

## UXP-02C — Character Media viewer + deep link

Status:

```text
ACTIVE — NEXT IMPLEMENTATION SLICE
```

Production scope:

```text
mixed IMAGE / bounded VIDEO rail/grid;
accessible page-owned viewer;
user-started bounded VIDEO in viewer;
caption / alt behavior;
poster fallback;
media query selection restricted to current Entity;
reduced-motion behavior.
```

Proof:

```text
image-only Character;
mixed image + short-motion Character;
valid media deep link;
invalid/unrelated media query ignored safely;
keyboard viewer;
Escape/focus return;
reduced motion;
no raw new-tab Media as primary interaction.
```

## UXP-02D — Anime relationships + Creator Character manager

Production scope:

```text
finished Anime section vocabulary;
relationship grouping + ordering;
Creator Character profile editor;
facts editor;
relationship editor;
existing Media manager integration;
Creator preview;
existing lifecycle controls only.
```

Proof:

```text
forms;
techniques;
arcs;
allies;
rivals;
family;
places / affiliations;
quotes;
Experiences;
related Characters;
series/appearance section when canonical data exists;
authorized Creator round trip;
unauthorized denial;
DRAFT preview without public leakage.
```

## UXP-02E — Reuse + full Character acceptance

Required evidence:

```text
Naruto desktop;
Naruto mobile;
second Anime Character reuse;
anonymous visitor;
authenticated Favorite / Collection;
authorized Creator path;
unauthorized Creator attempt;
image-only Character;
mixed Character Media;
missing optional sections;
loading;
error;
not found / unpublished;
keyboard-only;
reduced motion;
social/deep-link entry;
Shiva regression;
Hanuman regression;
format;
lint;
typecheck;
focused unit;
migration deployment;
integration;
focused browser;
full browser E2E;
production build;
architecture check;
evidence ZIP;
commit/push;
CI green.
```

UXP-02 is not complete after a visual screenshot alone.

---

# 16. Expected Database Boundary

UXP-02 may evolve only the existing Knowledge Entity profile persistence needed
by the finished Character page.

Expected migration class:

```text
knowledge_resource_profiles:
  native_name nullable
  alternate_names ordered JSON array
  overview nullable
```

No new Character table is required.

No new Series table is required merely to finish the Character page.

Existing generic KnowledgeResource + profile + relationship ownership remains.

---

# 17. Explicit Non-Goals

UXP-02 does not authorize:

```text
Anime Universe landing;
Anime Series finished page;
Devotional finished redesign;
home page redesign;
generic theme engine;
packages/ui;
frontend plugin runtime;
per-Character theme engine;
Naruto-specific production branches;

ratings/reviews;
fake popularity;
fake trending;
recommendation infrastructure;
episode platform;
streaming-service integration;
staff database expansion unless a real Character requirement proves it;

long-form video;
Range streaming;
HLS;
DASH;
transcoding;
automatic VIDEO poster extraction;
audio licensing platform;
social-network publishing;
social scheduler;

full Creator Studio redesign;
collaboration;
workflow engine;
new Anime-admin role;
new Character-admin permission;

P10-M04 deployment work.
```

---

# 18. Protected Regression Boundaries

UXP-02 must preserve:

```text
UXP-01 typed Universe presentation;
Devotional Shiva/Hanuman behavior;
Media Asset ownership;
public-safe Media descriptors;
bounded MP4 constraints;
reduced-motion poster fallback;
Knowledge publication rules;
Identity/Authorization ownership;
Favorite/Collection server enforcement;
Creator Media placement management;
31-migration baseline before UXP-02A;
architecture dependency rules.
```

Any proposed change that breaks these boundaries must stop and be justified by a
real Character requirement before proceeding.

---

# 19. Exit Rule

UXP-02 closes only when:

```text
Naruto is a finished canonical/API-driven Anime Character destination;
a second Anime Character proves the same implementation without production
branches;
all applicable Character-management behavior is real and permissioned;
the public route passes the complete UXP-02 acceptance matrix;
the existing Devotional proofs remain green;
the evidence/commit/push/CI chain is accepted.
```

Only then may work begin on:

```text
UXP-03 — Anime Universe landing
```

---

# 20. Current Slice Status

UXP-02A and UXP-02B are closed and accepted.

Accepted implementation checkpoints:

```text
UXP-02A
a1df9afb749a4f3e3ece6a9e7709093ff174edc6
feat(knowledge): deepen character entity profiles

UXP-02B
c7d754f6851d90d36aabaf62a6b139ede4b6e963
feat(web): finish anime character shell
```

Accepted UXP-02B evidence established:

```text
the Anime route now presents an Anime-specific Character shell inside apps/web
without introducing a second application or named-Character production branches;

the Web public Entity decoder consumes nativeName / alternateNames / overview
while remaining compatible with legacy public Entity payloads;

the Character hero, identity, quick facts and long overview remain usable on
desktop and 390px-class mobile without horizontal overflow;

Favorite and Collection continue through the existing Engagement Platform for
authenticated users, while anonymous behavior remains the existing sign-in path;

Share and Copy link use the canonical Character URL and do not preserve campaign
query parameters as canonical identity;

server-generated Character metadata provides title, description, canonical URL
and Open Graph projection from the public Character contract;

loading, not-found / unpublished and unexpected-error states remain
distinguishable;

Naruto proves the finished shell and Sasuke proves second-Character reuse through
the same production composition;

Shiva and Hanuman regressions remain green and the accepted bounded short-motion
behavior remains stable;

the full Web unit suite passed 48 / 48 tests;

the root production build passed 22 / 22 tasks;

the final focused browser acceptance and regression run passed 12 / 12 tests;

the implementation was committed and pushed at the exact checkpoint above;

CI was reported green for the pushed implementation on 2026-08-24.
```

UXP-02B deliberately did not implement the page-owned Media viewer or the
finished Anime relationship / Creator Character management slice.

The active implementation slice is now:

```text
UXP-02C — Character Media viewer + deep link
```

UXP-02C remains inside its frozen scope:

```text
mixed IMAGE / bounded VIDEO rail/grid;
accessible page-owned viewer;
user-started bounded VIDEO in viewer;
caption / alt behavior;
poster fallback;
media query selection restricted to the current Entity;
invalid / unrelated media query ignored safely;
keyboard close / Escape / focus return;
reduced-motion behavior;
no raw new-tab Media as the primary interaction.
```

UXP-02D and UXP-02E remain unstarted.

UXP-02 itself remains ACTIVE and does not close until the Section 19 exit rule
and full UXP-02E acceptance chain are satisfied.

This sub-slice closure does not change the Master Roadmap. WPR-M05 remains the
active Product Quality And Local User Acceptance gate, and P10-M04 remains
sequencing-blocked until that gate closes.
