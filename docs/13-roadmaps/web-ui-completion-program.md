# AI World Web UI Completion Program

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Document | Web UI Completion Program |
| Working ID | WPR-M05-UXP |
| Area | Product / Web / UI |
| Status | ACTIVE PLANNING CONTRACT |
| Created | 2026-08-23 |
| Baseline | `95d1b62649fa94ffbed3c9f11701628902660443` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Scope | First-party Web product completion before P10-M04 |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Purpose

This document defines the page-by-page Web UI completion program for AI World.

The immediate product goal is:

> Complete the first-party Web experience page by page, including public user behavior, authenticated behavior, creator/admin behavior where relevant, Universe-specific presentation, media delivery, social-entry behavior, responsive/accessibility quality, and evidence-based acceptance before moving to the next page.

This program remains inside WPR-M05.

It does not renumber the Master Roadmap and does not close WPR-M05 by itself.

P10-M04 remains sequencing-blocked until the Web Product Readiness Gate closes.

---

# 2. Governing Architecture

This program follows the accepted AI World architecture:

```text
ONE AI WORLD PLATFORM
+
SHARED PRODUCT SHELL
+
SHARED INTERACTION LANGUAGE
+
SHARED ACCESSIBILITY RULES
+
SHARED KNOWLEDGE / MEDIA / ENGAGEMENT CAPABILITIES
+
TYPED UNIVERSE PRESENTATION
+
UNIVERSE-SPECIFIC CONTENT AND COMPOSITION
```

A Universe may own:

```text
presentation
vocabulary
domain metadata
relationship semantics
content composition
AI configuration
```

A Universe must not duplicate:

```text
identity
authorization
media infrastructure
engagement
search
storage
creator infrastructure
platform contracts
```

The Web remains in `apps/web`.

No separate Anime application and no separate Devotional application are introduced.

No new shared UI package is introduced merely for this program.

---

# 3. Product Strategy

AI World is a content-first destination.

The expected acquisition loop is:

```text
CREATE / CURATE CANONICAL CONTENT IN AI WORLD
                ↓
IMAGE / SHORT MOTION / EXPERIENCE
                ↓
DISTRIBUTE TO SOCIAL CHANNELS
Instagram / Facebook / YouTube / future channels
                ↓
CANONICAL AI WORLD LINK
                ↓
CHARACTER / DEITY / SERIES / EXPERIENCE PAGE
                ↓
DISCOVERY + RELATIONSHIPS + MEDIA + SAVE + COLLECTION
                ↓
DEEPER AI WORLD SESSION
```

Social networks are distribution channels.

AI World is the canonical destination and owner of the structured Resource, Media association, relationships, and public experience.

Social campaigns may carry tracking parameters.

Canonical page identity must remain independent from campaign parameters.

---

# 4. External Product Research Inputs

The program may learn from mature products without copying their visual identity.

## Anime / entertainment references

### AniList

Useful patterns:

```text
character identity is immediately visible;
native/alternate names are secondary but accessible;
quick facts sit near the identity;
long biography is separate from compact facts;
relations lead users into a larger connected world;
series pages connect characters, staff, relations, stats and watch entry points.
```

### Anime-Planet

Useful patterns:

```text
clear content tabs;
character/staff hierarchy;
descriptive tags;
related works;
dense information that remains scannable.
```

### Crunchyroll

Useful patterns:

```text
cinematic title presentation;
one obvious primary action;
watchlist/share nearby;
genres and descriptive metadata near the hero;
content availability and language details are explicit;
related content extends the session.
```

### IMDb

Useful patterns:

```text
media is first-class;
photo/video counts are visible;
trailers and galleries are easy to enter;
watchlist/rating actions remain close to title identity;
content is broken into understandable sections.
```

## Short-form visual reference

Spotify Canvas demonstrates a useful short-loop model:

```text
3–8 second visual loop;
vertical-first social/mobile composition;
continuous or rebound loops;
coherent visual identity;
avoid rapid cuts and intense flashing;
visual should tell a complete micro-story rather than feel like a broken trailer.
```

AI World may use a similar duration class for its own original/licensed motion assets.

This is a product pattern, not a Spotify feature copy.

## Calm-content reference

Headspace demonstrates useful calm-product patterns:

```text
clear breathing room;
one primary action;
short content that is easy to start;
soft visual hierarchy;
intentional rather than constant motion;
audio begins through user intent;
share is available without overwhelming the content.
```

The Devotional Universe may learn from these interaction qualities while retaining its own cultural and devotional identity.

---

# 5. Universe Presentation Contract

## 5.1 Shared AI World invariants

Every Universe shares:

```text
semantic HTML;
keyboard behavior;
focus behavior;
loading/error/empty language;
responsive rules;
accessible controls;
save/favorite/collection interaction semantics;
media controls;
content hierarchy rules;
canonical-link behavior;
security boundaries;
creator permission rules.
```

## 5.2 Anime presentation

The Anime Universe should feel energetic, cinematic, character-driven and alive.

Preferred qualities:

```text
deep ink / charcoal / near-black foundations;
strong content-driven accent colors;
high-contrast character portraiture;
edge-to-edge or layered cinematic media;
bold display typography;
faster but controlled micro-motion;
diagonal / directional composition where useful;
rim-light / energy accents used with restraint;
denser discovery rails;
strong transformation / technique / relationship imagery.
```

Anime must not become:

```text
permanent generic purple gradients;
constant flashing;
uncontrolled animation;
visual noise that hides information;
Naruto-specific hard-coding.
```

The Universe supplies the presentation language.

An individual Series or Character may later provide typed accent/presentation hints without becoming a separate theme engine.

## 5.3 Devotional presentation

The Devotional Universe should feel calm, respectful, spacious and contemplative.

Preferred qualities:

```text
warm ivory / sandal / saffron / restrained gold;
deep indigo / celestial night where appropriate;
soft atmospheric gradients;
generous breathing room;
gentler surface contrast;
slow restrained motion;
radiance used sparingly;
clear devotional hierarchy;
image treatment that feels respectful rather than game-like.
```

Devotional media must not unexpectedly play audible sound.

Motion should support stillness, not compete with it.

---

# 6. Media Experience Contract

The existing AI World Media model already recognizes:

```text
IMAGE
VIDEO
AUDIO
DOCUMENT
```

The Web UI program will consume these shared Asset types.

## 6.1 Initial public media modes

```text
still image;
image gallery;
short muted motion loop;
user-started video;
image + optional user-started audio;
composed public Experience containing Media.
```

## 6.2 Short motion target

For social-style motion assets, the initial product target is approximately:

```text
3–8 seconds
```

with approximately five seconds as a common creative target.

Preferred social composition:

```text
9:16 vertical master where social distribution requires it;
responsive Web crop/presentation;
poster image fallback;
loop only where intentional;
muted by default;
plays inline;
audio enabled only by explicit user action.
```

`prefers-reduced-motion` must turn non-essential automatic motion into a still/poster-first experience.

No page may depend on audible autoplay.

## 6.3 Rights rule

AI World must not assume that a short excerpt of a commercial song is automatically permitted.

Until the Media Rights capability is explicitly implemented, product content using audio must be limited to:

```text
original audio;
owned audio;
properly licensed audio;
royalty-cleared audio;
other content for which the operator has verified usage rights.
```

Third-party music licensing is not silently solved by making a clip five seconds long.

---

# 7. Social Entry And Sharing Contract

Every public content page should ultimately support:

```text
stable canonical URL;
useful title;
useful description;
representative social image;
Open Graph metadata;
share action;
copy-link action;
campaign-safe query parameters;
deep link to relevant content context where useful.
```

Example campaign URL:

```text
/anime/characters/naruto-uzumaki
  ?utm_source=instagram
  &utm_medium=social
  &utm_campaign=character-launch
  &media=<asset-id>
```

The canonical URL remains the Character URL without campaign tracking parameters.

For composed social stories/reels, `/experiences/[id]` may be the better canonical destination.

Exact media deep-link behavior is implemented only when the first page requires it.

---

# 8. Role Model For Page Acceptance

Each page is tested only against roles that have real server-enforced meaning.

## Anonymous visitor

Can consume public content and navigate public relationships.

Must receive correct anonymous Engagement behavior.

## Authenticated user

Can use accepted user features such as:

```text
favorite/save;
collections;
account-aware navigation.
```

## Authorized creator/editor

Can manage the content required to drive the page where the current server permission model allows it.

The public page may expose a small `Edit in Studio` entry point for authorized users, but authoring remains owned by Creator surfaces.

## Admin / Universe administrator

Admin behavior is added only where a real server-enforced permission/capability exists.

The Web must never create a fake admin mode by merely showing extra controls.

Hiding a control is not authorization.

---

# 9. Current Public Web Route Inventory

Current routes at baseline include:

| Route | Current role in product |
| --- | --- |
| `/` | AI World landing |
| `/account` | Account/profile |
| `/anime/characters/[slug]` | Anime Character Entity Experience |
| `/creator` | Creator workspace |
| `/creator/preview/[id]` | Creator preview |
| `/devotional/[slug]` | Devotional Entity Experience |
| `/experiences/[id]` | Published composed Experience |
| `/forgot-password` | Identity recovery |
| `/knowledge` | Knowledge browse |
| `/knowledge/resources/[id]` | Generic Knowledge detail |
| `/register` | Registration |
| `/reset-password` | Password reset |
| `/saved` | Favorites / Collections |
| `/search` | Cross-Universe search |
| `/sign-in` | Sign in |
| `/verify-email` | Email verification |

Important missing destination pages that are justified by current product direction include:

```text
/anime
/anime/series/[slug]
/devotional
```

New routes remain eligible only when a real page milestone requires them.

---

# 10. UI Completion Program Phases

The IDs below are local planning IDs inside WPR-M05.

They are not Master Roadmap milestone IDs.

| Phase | Page / capability gate | Completion intent |
| --- | --- | --- |
| UXP-00 | Program contract | Freeze this plan, route matrix, Universe rules, media/social rules and page Definition of Done |
| UXP-01 | Shared Universe + Media foundation | Build only the reusable presentation/media/deep-link primitives required by the first finished page |
| UXP-02 | Anime Character | Fully finish `/anime/characters/[slug]` and its creator-management path |
| UXP-03 | Anime Universe landing | Add and fully finish `/anime` |
| UXP-04 | Anime Series | Add and fully finish `/anime/series/[slug]` |
| UXP-05 | Public Experience / social landing | Fully finish `/experiences/[id]` as a strong social/content destination |
| UXP-06 | Devotional Deity | Fully finish `/devotional/[slug]` using the calm Devotional presentation language |
| UXP-07 | Devotional Universe landing | Add and fully finish `/devotional` |
| UXP-08 | Discovery + Engagement | Finish `/knowledge`, `/knowledge/resources/[id]`, `/search`, `/saved` one route at a time |
| UXP-09 | Identity + Account | Finish registration, sign-in, verification, recovery/reset and account as one journey |
| UXP-10 | Creator / Admin Studio | Finish `/creator`, creator preview and accepted management/governance journeys |
| UXP-11 | Home + Whole-Site Integration | Rebuild `/` from the now-real content system and finalize global navigation/footer/cross-Universe pathways |
| UXP-12 | Whole-Site Acceptance | Cross-page UAT, accessibility, performance, SEO/social checks, restart/persistence proof and WPR-M05 closure evidence |

No phase begins merely because a visual mock is ready.

The previous page must satisfy its Definition of Done first.

---

# 11. UXP-01 — Shared Foundation Required By Character Page

This phase must remain minimal and Character-driven.

The pre-implementation repository / architecture review is complete.

The frozen detailed implementation contract is:

```text
docs/13-roadmaps/uxp-01-shared-universe-media-foundation.md
```

The accepted direction is:

```text
typed Web Universe presentation
+
contextual Knowledge Media placement
+
ordered public Entity Media descriptors
+
bounded IMAGE / SHORT_LOOP VIDEO support
+
reduced-motion + poster fallback
+
minimum permissioned Creator management
```

Important boundaries:

```text
Media continues to own Asset / lifecycle / technical metadata / delivery;

Knowledge owns the contextual fact that an Entity uses an Asset;

no Media → Knowledge dependency is introduced;

IMAGE / VIDEO / AUDIO / DOCUMENT remain the canonical Asset types;

SHORT_LOOP is presentation behavior, not a new Asset type;

no generic theme engine or packages/ui is introduced;

no general seekable/long-form video platform is introduced by UXP-01.
```

Implementation proceeds through UXP-01A through UXP-01E as defined in the
detailed contract.

Do not create components without the current Entity consumer using them.

## 11.1 UXP-01 closure

UXP-01 closed on 2026-08-24 after the accepted implementation commit:

```text
573cc1b2e24345c2571698326eb4041bc493da0b
feat(creator): add knowledge media management
```

The complete UXP-01 acceptance chain passed and CI was reported green.

The active detailed implementation contract is now:

```text
docs/13-roadmaps/uxp-02-anime-character-page.md
```

---

# 12. UXP-02 — Anime Character Page Definition

`/anime/characters/[slug]` is the first page to be completed fully.

Naruto remains a proof fixture.

The page must be reusable for Sasuke, Sakura, Kakashi and future characters without Character-specific production branches.

## 12.1 Public structure

Target structure:

```text
1. Universe / Series context
2. Cinematic Character hero
3. Name + native/alternate identity where available
4. Character role / series context
5. Primary facts
6. Save / Favorite / Collection / Share
7. Media Highlights
8. About / Character Story
9. Forms & Transformations
10. Training / Techniques / Abilities
11. Story Arcs / Key Moments
12. Allies / Rivals / Family / Relationships
13. Places / Affiliations
14. Quotes
15. Related Experiences
16. Related Characters
17. Related Series / Movies / Appearances where data exists
18. Continue exploring Anime
```

Optional sections do not render fake placeholders when canonical data is absent.

## 12.2 Hero

The Anime Character hero should be substantially stronger than the current reuse proof.

Desktop:

```text
cinematic split/layered hero;
large portrait or short motion media;
character identity remains readable over any image;
one clear primary media action;
save/share nearby;
important series context visible without scrolling.
```

Mobile:

```text
portrait-first crop;
identity readable before actions;
no horizontal overflow;
thumb-friendly actions;
short-loop video does not steal scroll or audio focus.
```

## 12.3 Media Highlights

Character Media must support a mixed rail/grid:

```text
images;
short motion loops;
user-started videos;
poster fallback;
optional audio experience.
```

Opening media should use one consistent viewer interaction.

The first implementation should avoid a complex general-purpose editor/viewer if a simpler real consumer satisfies the page.

## 12.4 Character information depth

The current generic `summary + facts` contract is sufficient for a proof but not necessarily sufficient for a finished Character page.

If the page needs richer canonical content, prefer an explicit contract such as:

```text
short summary;
long overview / biography;
facts;
media descriptors;
typed relationships;
```

rather than hiding all content inside arbitrary display-only JSON.

The minimum backend/API change required by the page is allowed.

A backend rewrite is not.

## 12.5 Relationships

The page should make connected knowledge visible.

Useful Anime relationship groups include:

```text
allies;
rivals;
family;
teams;
mentors;
transformations;
techniques;
story arcs;
locations;
series appearances;
related Experiences.
```

The shared Relationship capability remains the engine.

The Anime Universe supplies the semantics.

## 12.6 Creator / admin path

To call the Character page complete, authorized content operators must have a real path to manage the data that drives it.

Required Character-management capability, using existing Creator/Knowledge/Media ownership where possible:

```text
edit display identity;
edit summary / overview;
manage facts;
attach Media;
choose/reorder public Media;
provide alt/caption where required;
manage relationship sections;
order relationships;
preview public result;
publish only through accepted lifecycle behavior.
```

If current Creator UI lacks one of these controls, the Character milestone may add the minimum supporting Creator UI.

This does not mean the whole Creator Studio is visually complete.

The Creator Studio receives its own full completion phase later.

## 12.7 Character page acceptance matrix

The browser/UAT proof must include:

| Scenario | Required |
| --- | --- |
| Naruto desktop | Yes |
| Naruto mobile | Yes |
| Second Anime Character reuse | Yes |
| Anonymous visitor | Yes |
| Authenticated save/collection state | Yes |
| Authorized creator management path | Yes where real permission exists |
| Unauthorized creator/admin attempt | Yes |
| Image-only Character | Yes |
| Mixed image + short-video Character | Yes once video presentation lands |
| Missing optional section | Yes |
| Loading | Yes |
| Error | Yes |
| Not found/unpublished | Yes |
| Keyboard-only | Yes |
| Reduced motion | Yes |
| Social/deep-link entry | Yes |
| Shiva/Hanuman regression | Yes |

## 12.8 UXP-02 current slice status

Current accepted slice state:

```text
UXP-02A — Character canonical depth + Creator read boundary
CLOSED — ACCEPTED
implementation checkpoint:
a1df9afb749a4f3e3ece6a9e7709093ff174edc6

UXP-02B — Finished Anime Character shell + social identity
CLOSED — ACCEPTED
implementation checkpoint:
c7d754f6851d90d36aabaf62a6b139ede4b6e963

UXP-02C — Character Media viewer + deep link
CLOSED — ACCEPTED
implementation checkpoint:
381a9ab9c47f4544f3a42c265ef6eea0c30f8723

UXP-02D — Anime relationships + Creator Character manager
ACTIVE — NEXT IMPLEMENTATION SLICE

UXP-02E — Reuse + full Character acceptance
NOT STARTED
```

UXP-02A established the canonical/API depth required by the finished Character.

UXP-02B established the finished Anime Character shell and social identity.

UXP-02C established the bounded page-owned Character Media viewer, safe
current-Character media deep linking, explicit viewer VIDEO playback,
keyboard/Escape/focus behavior and reduced-motion preservation.

The immediate engineering objective is now UXP-02D: finish the Anime
relationship vocabulary and the minimum permissioned Creator Character
management path that drives the accepted public composition.

The detailed frozen scope and proof remain governed by:

```text
docs/13-roadmaps/uxp-02-anime-character-page.md
```

UXP-02 as a whole remains ACTIVE. UXP-03 does not begin until UXP-02E closes the
complete Character Page Definition of Done.

---

# 13. Later Page Intent

## UXP-03 — Anime Universe landing

The Anime landing becomes the high-energy discovery front door.

Likely content:

```text
featured Characters;
featured Series;
new Media;
short motion highlights;
trending/editorial rails if real data exists;
search entry;
latest Experiences;
social campaign destinations;
clear path into Character and Series pages.
```

## UXP-04 — Anime Series

Series page should combine:

```text
cinematic series hero;
status/format/episode facts;
description;
characters;
staff/studio where modeled;
episodes/scenes where modeled;
media;
related series/movies;
Experiences;
save/share;
social entry.
```

## UXP-05 — Public Experience

This page becomes a major social landing unit for composed campaigns.

It should be excellent for:

```text
one image story;
short motion story;
image + user-started audio;
multi-block story;
Character/Deity references;
campaign-specific presentation.
```

## UXP-06 / UXP-07 — Devotional

Devotional pages reuse shared Platform behavior but switch composition and visual cadence toward calm, reverence and breathing room.

The Deity page remains connected and media-rich without inheriting Anime intensity.

## UXP-08 — Discovery + Engagement

Finish these pages individually:

```text
Knowledge browse;
Knowledge detail;
Search;
Saved / Favorites / Collections.
```

Discovery must preserve Universe identity in results.

## UXP-09 — Identity + Account

Finish as one coherent journey:

```text
register;
sign in;
verify email;
forgot password;
reset password;
account;
sign out;
denied/session recovery states.
```

## UXP-10 — Creator / Admin Studio

Finish the management experience only after public page requirements are concrete.

The Studio should manage:

```text
Knowledge;
Entity profiles;
Media;
relationships;
Pages/Blocks;
AI candidates;
preview;
publish/archive;
accepted permissioned administration.
```

## UXP-11 — Home

Home is finalized after the real Universe pages exist so it can lead into actual content rather than decorative placeholders.

## UXP-12 — Whole-site acceptance

This is the final UI gate before WPR-M05 closure.

---

# 14. Page Definition Of Done

A page is not complete because it looks attractive.

Every page must pass all applicable categories below.

## Product

```text
purpose is obvious;
information hierarchy is final;
no fake controls;
real backend behavior works;
empty optional data degrades correctly.
```

## Universe expression

```text
correct visual tone;
correct vocabulary;
correct motion cadence;
shared AI World interaction rules remain recognizable.
```

## User states

```text
anonymous;
authenticated;
authorized creator/admin where relevant;
unauthorized path;
loading;
empty;
error;
not found.
```

## Media

```text
correct image behavior;
correct video/audio behavior where used;
poster/fallback;
captions/alt where applicable;
no surprise audible autoplay;
reduced-motion behavior.
```

## Responsive

```text
desktop;
tablet;
mobile;
no horizontal overflow;
touch targets;
content remains readable.
```

## Accessibility

Target:

```text
WCAG 2.2 AA engineering target
```

Validation includes:

```text
semantic review;
keyboard;
focus;
contrast;
reduced motion;
status/error semantics;
critical screen-reader sanity.
```

## SEO / social

```text
title;
description;
heading hierarchy;
canonical URL;
Open Graph image/title/description;
share/copy link;
campaign parameters do not replace canonical identity.
```

## Performance

Protect:

```text
LCP;
INP;
CLS;
image/video loading;
unnecessary client JavaScript;
layout stability.
```

## Evidence

```text
focused automated browser tests;
role-specific browser tests;
visual screenshots;
manual UAT checklist;
root regression tests when code changes warrant them;
production build;
architecture check;
exact staged file set;
reviewed validation ZIP;
commit/push evidence;
CI result reported by the user.
```

Only after the page passes its applicable Definition of Done does work move to the next page.

---

# 15. Implementation Workflow Per Page

For every page:

```text
inspect current repository + contracts
        ↓
freeze page structure and real functionality
        ↓
identify the minimum shared primitives required
        ↓
implement one bounded page slice
        ↓
test public user behavior
        ↓
test authenticated behavior
        ↓
test creator/admin behavior where applicable
        ↓
responsive + accessibility + motion
        ↓
social/deep-link + metadata
        ↓
focused browser UAT
        ↓
full relevant regression/build/architecture validation
        ↓
stage only
        ↓
evidence ZIP review
        ↓
commit/push runner
        ↓
user reports CI result
        ↓
page marked complete in this program
        ↓
next page
```

The Master Roadmap is not updated after every visual sub-step.

WPR-M05 receives its roadmap closure update only when the entire accepted gate is actually ready to close.

---

# 16. Immediate Next Work

The accepted execution position is:

```text
UXP-00 — Program contract
CLOSED
        ↓
UXP-01 — Character-driven Universe/Media foundation
CLOSED
        ↓
UXP-02A — Character canonical depth + Creator read boundary
CLOSED — a1df9afb749a4f3e3ece6a9e7709093ff174edc6
        ↓
UXP-02B — Finished Anime Character shell + social identity
CLOSED — c7d754f6851d90d36aabaf62a6b139ede4b6e963
        ↓
UXP-02C — Character Media viewer + deep link
CLOSED — 381a9ab9c47f4544f3a42c265ef6eea0c30f8723
        ↓
UXP-02D — Anime relationships + Creator Character manager
ACTIVE
        ↓
UXP-02E — Reuse + full Character acceptance
        ↓
UXP-03 — Anime Universe landing
```

No additional Entity or Media proof milestone is needed.

The next engineering objective is UXP-02D: finish Anime relationship grouping /
ordering and the minimum permissioned Creator Character profile, facts,
relationship and preview workflow on top of the accepted A/B/C capabilities.

UXP-02D must reuse the existing Knowledge relationship contract, Creator Entity
read/write boundary, existing Media manager and existing lifecycle behavior. It
must not create Anime-only relationship persistence, a second Character write
path, a new Character-admin permission, or a full Creator Studio redesign.

The Master Roadmap remains unchanged by this sub-slice transition. WPR-M05
receives its roadmap closure update only when the entire accepted gate is ready
to close.
