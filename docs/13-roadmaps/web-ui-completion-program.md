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
Current accepted routes now include:

| Route | Current role in product |
| --- | --- |
| `/` | AI World landing |
| `/account` | Account/profile |
| `/anime` | Finished Anime Universe landing — UXP-03 CLOSED and accepted at `75d91ef7975e515c10b529c143641bad0d1d6055` |
| `/anime/characters/[slug]` | Finished Anime Character destination |
| `/anime/series/[slug]` | Finished Anime Series destination — UXP-04 CLOSED and accepted at `f14b984f34dd25855d709c2a5cb67806861f34d1` |
| `/creator` | Creator workspace |
| `/creator/series/[id]/preview` | Creator-only Anime Series draft preview accepted through UXP-04C |
| `/creator/preview/[id]` | Creator preview |
| `/devotional` | Finished Devotional Universe landing — UXP-07 CLOSED — ACCEPTED |
| `/devotional/[slug]` | Finished Devotional Deity destination — UXP-06 CLOSED — ACCEPTED |
| `/experiences/[id]` | Finished Public Experience destination — UXP-05 CLOSED — ACCEPTED |
| `/forgot-password` | Identity recovery |
| `/knowledge` | Finished Knowledge browse — UXP-08A CLOSED — ACCEPTED — `0805eda89a420b5f90f6e3ce0facb1b3d36f81fd` |
| `/knowledge/resources/[id]` | Finished generic Knowledge detail — UXP-08B CLOSED — ACCEPTED — `ed366a0aca49c0c110660bb4b2c47b791f4b4a62` |
| `/register` | Registration |
| `/reset-password` | Password reset |
| `/saved` | Finished Saved / Favorites / Collections — UXP-08D CLOSED — ACCEPTED — `b19304825052da6d5aee240e896ce575261ebe54` |
| `/search` | Finished Cross-Universe Search — UXP-08C CLOSED — ACCEPTED — `0ca5b8699cd087314a2f86c0f10642d3d0e6eff9` |
| `/sign-in` | Sign in |
| `/verify-email` | Email verification |

All four UXP-08 target routes physically exist.

UXP-08A has finished `/knowledge`.

UXP-08B has finished the existing generic Knowledge detail fallback.

UXP-08C has finished the existing Cross-Universe Search experience.

UXP-08D has finished the authenticated Saved / Favorites / Collections library.

No parallel Discovery application and no new top-level UXP-08 route is introduced.

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

## 12.8 UXP-02 closure

UXP-02 is closed and accepted.

Final accepted slice state:

```text
UXP-02A — Character canonical depth + Creator read boundary
CLOSED — a1df9afb749a4f3e3ece6a9e7709093ff174edc6

UXP-02B — Finished Anime Character shell + social identity
CLOSED — c7d754f6851d90d36aabaf62a6b139ede4b6e963

UXP-02C — Character Media viewer + deep link
CLOSED — 381a9ab9c47f4544f3a42c265ef6eea0c30f8723

UXP-02D — Anime relationships + Creator Character manager
CLOSED — 9fba11f72fc237a0a8ff305f873089fc4e5c6a68
CI compatibility checkpoint:
cbd6a447b688bb350fefd4e24f8617917ea6245d

UXP-02E — Reuse + full Character acceptance
CLOSED — 3ddb3fcd4c42e94efaedfb2f444e09b93ab16a4a
```

UXP-02E completed the full Character Page Definition of Done.

Accepted final evidence includes:

```text
Naruto desktop/mobile;
second Anime Character reuse;
anonymous/authenticated Engagement;
authorized and unauthorized Creator paths;
image-only and mixed bounded Media;
missing optional sections;
loading;
error;
not found / unpublished;
keyboard-only;
reduced motion;
social/deep-link entry;
Shiva/Hanuman regressions;
Web unit 48 / 48;
32 migrations;
API integration 25 / 25 files and 179 / 179 tests;
focused Character browser acceptance 25 / 25;
full browser E2E 46 / 46;
production build 22 / 22;
architecture validation with no violations across 728 modules / 2391 dependencies;
commit / push;
GitHub CI run 223 green on 3ddb3fcd4c42e94efaedfb2f444e09b93ab16a4a.
```

The first finished public page is therefore accepted.

The active detailed implementation contract is now:

```text
docs/13-roadmaps/uxp-03-anime-universe-landing.md
```

UXP-03 may begin. UXP-04 does not begin until the finished Anime landing passes
its complete applicable Page Definition of Done.

---

# 13. Later Page Intent

## UXP-03 — Anime Universe landing

Status:

```text
CLOSED — ACCEPTED
```

The Anime landing becomes the high-energy discovery front door.

The frozen detailed implementation contract is:

```text
docs/13-roadmaps/uxp-03-anime-universe-landing.md
```

Accepted initial direction:

```text
new /anime route;
generic Knowledge-owned published discovery-card projection;
real Character identity + canonical Character links;
eligible public preview Media;
Recently Updated Characters;
optional real Series discovery;
existing Search reuse;
typed Anime presentation;
canonical/social identity;
complete loading/error/empty/responsive/accessibility acceptance.
```

Important boundaries:

```text
no fake trending/popularity/recommendations;
no editorial ranking or landing CMS;
no finished Anime Series page before UXP-04;
no new Anime persistence;
no new Media/Search platform;
no public Experience feed merely to fill space.
```

UXP-03 starts from the accepted UXP-02 closure baseline:

```text
3ddb3fcd4c42e94efaedfb2f444e09b93ab16a4a
```

Current UXP-03 slice state:

```text
UXP-03A — Public discovery projection + route foundation
CLOSED — a2d0dc9119b93b195bda17f072da23a664a945a5

UXP-03B — Finished Anime landing shell + Character discovery
CLOSED — 80c968b617991c31db9a046ec2c02e240c703fbe

UXP-03C — Series + social identity integration
CLOSED — e454ba3d602b8c05efb3eabde42a0ec2bf8a64ba

UXP-03D — Reuse + full landing acceptance
CLOSED — 75d91ef7975e515c10b529c143641bad0d1d6055
```

UXP-03A accepted the generic published Knowledge discovery projection, safe
optional preview Media, strict Web decoder, `/anime` route foundation, and the
non-visual route-to-discovery connection.

GitHub CI run 225 completed successfully on the exact UXP-03A
implementation checkpoint:

```text
a2d0dc9119b93b195bda17f072da23a664a945a5
feat(knowledge): add public discovery projection
```

UXP-03B accepted the finished Anime landing shell, real Character discovery,
canonical Character navigation, safe IMAGE / SHORT_LOOP / no-Media cards,
loading/error/empty behavior, 390px mobile composition, keyboard navigation and
reduced-motion poster fallback.

GitHub CI run 227 completed successfully on the exact UXP-03B
implementation checkpoint:

```text
80c968b617991c31db9a046ec2c02e240c703fbe
feat(web): finish anime landing character discovery
```

UXP-03C accepted truthful optional published Series discovery, generic
Knowledge-detail Series navigation, existing Search reuse, campaign-safe
canonical `/anime` identity, generated Open Graph identity/image, and a validated
configurable public Web-origin boundary.

GitHub CI run 229 completed successfully on the exact UXP-03C
implementation checkpoint:

```text
e454ba3d602b8c05efb3eabde42a0ec2bf8a64ba
feat(web): integrate anime series social identity
```

UXP-03D accepted the complete landing Page Definition of Done without requiring a
production feature change. The final acceptance checkpoint added the missing
tablet, anonymous/authenticated shared-shell, reusable media-matrix and canonical
Character-navigation proofs while retaining all accepted UXP-03B/03C behavior.

Accepted UXP-03D evidence includes:

```text
focused Anime landing acceptance 14 / 14;
finished Anime Character regressions 14 / 14;
Shiva / Hanuman regressions 4 / 4;
full browser E2E 60 / 60;
Web unit 16 / 16 files and 52 / 52 tests;
root unit pipeline 37 / 37 tasks;
32 migrations on isolated PostgreSQL 18.4;
full integration pipeline 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
production build 22 / 22;
fresh-process canonical / Open Graph production smoke;
architecture validation with 0 violations across 746 modules / 2447 dependencies.
```

GitHub CI run 231 completed successfully on the exact UXP-03D
acceptance checkpoint:

```text
75d91ef7975e515c10b529c143641bad0d1d6055
test(web): prove full anime landing acceptance
```

UXP-03 is therefore CLOSED — ACCEPTED.

## UXP-04 — Anime Series

Status:

```text
CLOSED — ACCEPTED
```

Repository/architecture inspection is complete.

The frozen detailed implementation contract is:

```text
docs/13-roadmaps/uxp-04-anime-series-page.md
```

Repository evidence freezes the minimum direction as:

```text
canonical /anime/series/[slug];
existing public Knowledge Entity read;
strict universe.anime + anime.series guard;
existing Entity profile / facts;
existing Knowledge Media placements;
existing Resource Engagement controls;
Series-specific Character + related-Series relationship presentation;
canonical Anime landing / relationship navigation;
existing root metadataBase / social-origin behavior;
bounded Series-specific Creator Web manager over generic Creator APIs;
existing generic Knowledge Media manager;
Creator-only Series preview;
no schema migration expected;
no new public or Creator backend endpoint expected.
```

Explicitly deferred because no current canonical model exists:

```text
staff/studio persistence;
episodes/scenes;
streaming availability / watch providers;
direct Experience relationship infrastructure.
```

Search remains regression-only in UXP-04. Its current public result contract has no
Entity slug, and UXP-08 owns the finished Search experience.

UXP-04A is accepted at:

```text
e9cc98aa162687e2ee2d2af209d6a91809d57b11
feat(web): add anime series identity shell
GitHub CI run 234 — success
```

Accepted UXP-04A evidence includes:

```text
strict canonical Series route / Resource Type guard;
identity / native / alternate names;
summary / overview / generic facts;
anonymous + authenticated shared shell;
existing Engagement;
share / copy-link;
campaign-safe canonical / Open Graph identity;
shared Anime social Media precedence;
focused social unit 7 / 7;
root unit pipeline 37 / 37 tasks;
Web unit 17 / 17 files and 56 / 56 tests;
32 migrations on PostgreSQL 18.4;
AI Creator integration 24 / 24;
full serial integration 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
focused browser 11 / 11;
full browser E2E 66 / 66;
production build 22 / 22;
fresh-process production social proof;
architecture validation with 0 violations across 752 modules / 2463 dependencies.
```

UXP-04B is accepted at:

```text
3656cabc6018feb9c89fe389dd20412f56eb5094
feat(web): finish anime series media navigation
GitHub CI run 236 — success
```

Accepted UXP-04B evidence includes:

```text
shared Character + Series Anime Entity media viewer;
Series IMAGE / SHORT_LOOP / poster / reduced-motion behavior;
Series media deep links with campaign preservation;
Characters + Related Series & Movies rails;
strict relationship vocabulary / target filtering;
canonical Series -> Character / Series -> Series / Character -> Series navigation;
Anime landing canonical Series slug destinations;
updated UXP-03D tablet canonical-Series regression;
root unit pipeline 37 / 37 tasks;
Web unit 17 / 17 files and 56 / 56 tests;
32 migrations on PostgreSQL 18.4;
AI Creator integration 24 / 24;
full serial integration 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
focused browser 24 / 24;
full browser E2E 71 / 71;
production build 22 / 22;
architecture validation with 0 violations across 755 modules / 2466 dependencies.
```

UXP-04C is accepted at:

```text
1cc5f6c2d764a2fa5fb426baeb3ee4bdbce34b07
feat(creator): manage anime series
GitHub CI run 238 — success
```

Accepted UXP-04C evidence includes:

```text
bounded anime.series Creator Web manager;
generic Creator Entity API reuse;
generic KnowledgeMediaManager reuse;
preferred Series fact vocabulary;
fixed Characters / related-Series relationship vocabulary;
Creator-only Series DRAFT preview;
publish / archive public lifecycle proof;
wrong Resource Type rejection;
403 authorization proof;
anonymous preview boundary;
Character Creator regressions preserved;
remote Web unit 56 / 56;
32 migrations;
AI Creator integration 24 / 24;
full integration pipeline 29 / 29 tasks;
API integration 181 / 181;
full browser E2E 75 / 75;
production build 22 / 22 tasks;
architecture validation with 0 violations across 759 modules / 2483 dependencies.
```

UXP-04D and complete UXP-04 acceptance are accepted at:

```text
f14b984f34dd25855d709c2a5cb67806861f34d1
test(web): prove full anime series acceptance
GitHub CI run 240 — success
```

Accepted final UXP-04 evidence includes:

```text
three-Series responsive reuse matrix at 1440px / 834px / 390px;
IMAGE / SHORT_LOOP / no-Media Series;
facts and Character / related-Series relationship groups present / sparse / absent;
existing anonymous / authenticated / Creator authorization states retained;
loading / error / not-found / wrong-type / unpublished / archived states retained;
keyboard / media-viewer focus / reduced-motion behavior retained;
canonical/social deep links and campaign preservation retained;
landing / Character / Series canonical navigation retained;
Search regression without UXP-08 expansion;
Anime landing / Character / Shiva / Hanuman regressions retained;
acceptance-only UXP-04D with no production feature change;
reviewed fresh-process production Series social / deep-link smoke;
remote root unit 37 / 37 tasks;
remote Web unit 17 / 17 files and 56 / 56 tests;
32 migrations;
remote AI Creator integration 24 / 24;
remote full integration pipeline 29 / 29 tasks;
remote API integration 181 / 181;
remote full browser E2E 78 / 78;
remote production build 22 / 22 tasks;
remote architecture validation with 0 violations across 760 modules / 2484 dependencies;
exact acceptance checkpoint / push / GitHub CI green.
```

Current UXP-04 slice state:

```text
UXP-04A — Canonical route + identity / social shell
CLOSED — e9cc98aa162687e2ee2d2af209d6a91809d57b11

UXP-04B — Media + Series relationships + canonical Anime navigation
CLOSED — 3656cabc6018feb9c89fe389dd20412f56eb5094

UXP-04C — Creator Series manager + creator-only preview
CLOSED — 1cc5f6c2d764a2fa5fb426baeb3ee4bdbce34b07

UXP-04D — Reuse + full Series acceptance
CLOSED — f14b984f34dd25855d709c2a5cb67806861f34d1

UXP-04 — Anime Series
CLOSED — ACCEPTED
```

## UXP-05 — Public Experience

Status:

```text
CLOSED — ACCEPTED
```

The detailed frozen implementation/acceptance contract is:

```text
docs/13-roadmaps/uxp-05-public-experience-page.md
```

Accepted slice checkpoints:

```text
UXP-05A — Public projection + canonical/social shell
CLOSED — ACCEPTED — 8da119f2aad069d8ee26e8a65f8631d7625fa950

UXP-05B — Typed IMAGE / short-motion Media + Creator/public parity
CLOSED — ACCEPTED — 403ac69198185a7cd35b85178e4342ed5f1f2a0f

UXP-05C — User-started AUDIO capability gate
CLOSED — ACCEPTED — 0cb1548541cc3f57164cb25a739b2fa1ee75d522

UXP-05D — Reuse + full Experience acceptance
CLOSED — ACCEPTED — 527921f3587b3c5d011a8c9ef0565bc4fc39c5ce
```

UXP-05C implementation history:

```text
065a35523dcf391949652721d26b4e1e91a05877
docs(roadmap): freeze UXP-05C audio capability
GitHub CI run 247
run id 33239861317
success

ad2c72881995e68d0680a4594073aab60110e39c
feat(media): add bounded experience audio
GitHub CI run 248
run id 33244423316
success

0cb1548541cc3f57164cb25a739b2fa1ee75d522
fix(media): harden AAC audio validation
GitHub CI run 249
run id 33247968029
success
```

Accepted UXP-05C behavior includes:

```text
bounded audio/mp4 AUDIO upload through existing Media ownership;
mp4a + AAC-LC / MPEG-4 Audio Object Type 2 byte validation;
complete bounded AudioSpecificConfig validation;
truncated/malformed config rejection;
implicit SBR / HE-AAC rejection;
streaming ISO box/descriptor traversal;
existing 10 MiB upload ceiling with positive durationMs and no invented AUDIO duration ceiling;
existing authorization/audit/Storage path;
existing whole-object public Media delivery;
existing Composition MEDIA_ASSET reference;
Creator Page/Experience AUDIO upload + rights/public-by-ID disclosure;
shared Creator/public native user-started AUDIO controls;
preload=none with no autoplay/loop;
honest load fallback;
AUDIO excluded from social-image precedence;
KnowledgeMediaManager remains IMAGE/VIDEO-only;
no schema/migration/Range/transcoding/Search expansion.
```

Reviewed final UXP-05C evidence includes:

```text
focused Media AUDIO unit 28 / 28;
root unit pipeline 37 / 37 tasks;
32 clean-database migrations;
focused UXP-05C API integration 29 / 29;
full integration pipeline 29 / 29 tasks;
API integration 185 / 185;
focused Creator/public browser 7 / 7;
full Web browser 81 / 81;
production build 22 / 22 tasks;
architecture 0 violations across 767 modules / 2500 dependencies;
exact final hardening checkpoint CI #249 green.
```

UXP-05D and complete UXP-05 acceptance are accepted at:

```text
527921f3587b3c5d011a8c9ef0565bc4fc39c5ce
test(web): prove full experience acceptance
GitHub CI run 251
run id 33252939400
success
```

Accepted final UXP-05 evidence includes:

```text
UXP-05D acceptance-only checkpoint with no Public Experience production change;
Devotional + Anime reusable Experience proof;
1440px / 834px / 390px responsive matrix;
single IMAGE, bounded VIDEO, user-started AUDIO, multi-Block and Knowledge compositions;
mixed Block + Knowledge + Media composition;
anonymous / authenticated / Creator authorization boundaries;
DRAFT / ARCHIVED non-public and PUBLISHED public behavior;
Creator-preview / public composition parity;
loading / error / not-found / degraded Media / sparse content behavior;
missing referenced public content omission retained through API integration;
keyboard focus / semantic structure / reduced motion / no audible autoplay;
390px no-horizontal-overflow proof;
campaign-safe canonical identity;
Open Graph title / description and eligible IMAGE precedence;
no fabricated VIDEO / AUDIO social image;
focused Web unit 12 / 12;
root unit pipeline 37 / 37 tasks;
32 migrations and schema up to date;
focused API integration 29 / 29;
full API integration 185 / 185;
focused browser acceptance 13 / 13;
full Web browser E2E 87 / 87;
production build 22 / 22 tasks;
fresh-process production canonical/social proof;
architecture 0 violations across 768 modules / 2501 dependencies;
reviewed evidence ZIP;
exact acceptance checkpoint / push / GitHub CI #251 green.
```

UXP-05D is CLOSED — ACCEPTED.

UXP-05 is CLOSED — ACCEPTED.

UXP-06 is the next eligible page but remains NOT STARTED until this docs-only
UXP-05 closure transition is itself committed, pushed and exact remote CI is
green. This closure checkpoint does not activate or implement UXP-06.

## UXP-06 / UXP-07 — Devotional
Status:

```text
UXP-06 — CLOSED — ACCEPTED
UXP-07 — CLOSED — ACCEPTED
```

The closed UXP-06 implementation/acceptance contract is:

```text
docs/13-roadmaps/uxp-06-devotional-deity-page.md
```

The closed accepted UXP-07 implementation/acceptance contract is:

```text
docs/13-roadmaps/uxp-07-devotional-universe-landing.md
```

Frozen UXP-07 slices:

```text
UXP-07A — Devotional landing shell + Deity discovery + social identity
CLOSED — ACCEPTED — efe50f0d2f921990a22dc3c0a1395745696fe1ed

UXP-07B — Reuse + full Devotional landing acceptance
CLOSED — ACCEPTED — 9959c9ea4490ad71e91f04760d123fad65ea5b3d

UXP-07 — Devotional Universe landing
CLOSED — ACCEPTED
```

Accepted UXP-07A implementation checkpoint:

```text
efe50f0d2f921990a22dc3c0a1395745696fe1ed
feat(web): add devotional universe landing
GitHub CI #263
run id 33312976028
completed / success
```

UXP-07A is therefore:

```text
CLOSED — ACCEPTED — efe50f0d2f921990a22dc3c0a1395745696fe1ed
```

Reviewed UXP-07A evidence includes:

```text
exact eight-file implementation/test scope;
1421 insertions / 5 deletions;
/devotional first-party Web route;
typed universe.devotional presentation;
generic listPublicKnowledgeDiscovery reuse;
universe.devotional + devotional.deity + limit 6;
truthful Recently Updated Deities;
canonical /devotional/[slug] child navigation;
IMAGE / bounded SHORT_LOOP / no-Media cards;
loading / error+retry / empty;
plain /search entry without UXP-08 expansion;
/knowledge continuation;
canonical /devotional metadata;
stable presentation-owned Devotional Open Graph image;
campaign-safe canonical identity;
anonymous + authenticated shared shell;
reduced motion;
keyboard navigation;
390px no-horizontal-overflow;
rendered mobile H1 text-bound containment;
manual desktop + corrected 390px screenshot review;
obsolete pre-UXP-07 /devotional=404 regression removed;
no backend/schema/migration/dependency/CI/docs change in implementation checkpoint;
root lint 21 / 21;
root typecheck 41 / 41;
focused Web unit 4 files / 9 tests;
Web unit 21 files / 71 tests;
root unit 37 / 37 tasks;
32 migrations / schema up to date;
focused API 3 files / 11 tests;
integration 29 / 29 tasks;
full API integration 26 files / 185 tests;
focused browser 27 / 27;
full Web E2E 113 / 113;
production build 22 / 22;
fresh-process /devotional canonical/social proof;
architecture 0 violations / 788 modules / 2555 dependencies;
reviewed Resume 3 evidence ZIP;
exact candidate/worktree/staged blob identity;
0 unstaged / 0 untracked;
GitHub CI #263 / run 33312976028 green on the exact checkpoint.
```

Final accepted UXP-07A blobs:

```text
apps/web/src/app/devotional/page.tsx
aa89e23dc1c27f54f79af67656208c863a9a7ba4
apps/web/src/app/devotional/opengraph-image.tsx
3ddc4d9833deb0ce48a45260a9a237b135d7e21f
apps/web/src/devotional/devotional-universe-discovery-foundation.tsx
7396f0757636fde9e8084b838c33f37909240dae
apps/web/src/devotional/devotional-universe-metadata.ts
9d1a29a40011a6a6ea9d7e05e2845ad21f13b5d8
apps/web/src/app/globals.css
9b549a47caa3b258ceb0f01af5a15295a367fca1
apps/web/e2e/devotional-universe-foundation.spec.ts
1181370b62e969753067a34afecf4009c1afafe8
apps/web/test/devotional-universe-social-identity.spec.ts
906b997b88eb1add9c44ad5170f92d18bb1a3459
apps/web/e2e/devotional-deity-full-acceptance.spec.ts
839009566482477f205dc604600aafa298e1861d
```

Accepted UXP-07B / final UXP-07 acceptance checkpoint:

```text
9959c9ea4490ad71e91f04760d123fad65ea5b3d
test(web): prove full devotional landing acceptance
GitHub CI #265
run id 33356451179
completed / success
```

UXP-07B is therefore:

```text
CLOSED — ACCEPTED — 9959c9ea4490ad71e91f04760d123fad65ea5b3d
```

Reviewed UXP-07B acceptance evidence includes:

```text
acceptance-only checkpoint;
exactly 2 new test files;
851 insertions / 0 deletions;
0 production changes;
0 docs changes in the acceptance checkpoint;
0 schema/migration/dependency/CI changes;

Devotional-specific discovery lifecycle API:
PUBLISHED-only projection;
deterministic recency order;
landing limit 6;
bounded limit 2;
newer DRAFT hidden;
newer ARCHIVED hidden;
other Universe excluded;

responsive / reuse:
1440px desktop;
834px tablet;
390px mobile;
200%-effective hierarchy at 720 CSS pixels;
multiple Deities;
IMAGE;
SHORT_LOOP;
no Media;
no horizontal overflow;
rendered heading containment;
manual screenshot review at all four responsive targets;

states / resilience:
loading;
unexpected error;
retry recovery;
empty;
populated;
failed thumbnail resilience;

roles / shell:
anonymous shared shell;
authenticated shared shell;
no landing-specific Creator/Admin controls;

Media / accessibility:
IMAGE previews;
muted bounded SHORT_LOOP;
poster-backed reduced-motion fallback;
no audible autoplay;
semantic headings;
keyboard;
visible focus;
meaningful links;
alt text;

canonical / social:
canonical /devotional;
campaign-safe canonical identity;
title / description;
Open Graph title / description;
stable /devotional/opengraph-image;
social image independent of arbitrary Deity ordering;

navigation / regressions:
canonical /devotional/[slug] Deity links;
/knowledge continuation;
existing /search entry only;
finished Deity regression;
Anime landing / Character / Series regressions;
Public Experience regression;
shared shell regression;

engineering:
root lint 21 / 21 tasks;
root typecheck 41 / 41 tasks;
isolated Creator workspace unit 1 file / 4 tests;
canonical root unit pipeline 37 / 37 tasks;
Web unit suite 21 files / 71 tests;
32 canonical migrations / schema up to date;
focused UXP-07B API integration 3 files / 6 tests;
new Devotional lifecycle proof 3 / 3;
full integration pipeline 29 / 29 tasks;
full API integration 27 files / 188 tests;
focused browser + cross-surface regressions 56 / 56;
full Web browser E2E 125 / 125;
production build 22 / 22 tasks;
fresh-process /devotional canonical/social proof;
architecture validation 0 violations across 790 modules / 2563 dependencies;
reviewed Resume 1 evidence ZIP;
exact candidate/worktree/staged blob identity;
0 unstaged tracked files / 0 untracked files;
exact acceptance checkpoint committed and pushed;
GitHub CI #265 / run 33356451179 green on the exact acceptance SHA.
```

Final accepted UXP-07B proof blobs:

```text
apps/api/test/uxp-07b-devotional-universe-discovery.integration.spec.ts
3e350cae71fa0392cd30e2921554339a9d8d08ad

apps/web/e2e/devotional-universe-full-acceptance.spec.ts
3adee95a54abcbab1af0751d4a383ce27a8cab00
```

UXP-07B remained acceptance-first.

No Devotional landing production correction was required.

UXP-07 is therefore:

```text
CLOSED — ACCEPTED
```


The complete UXP-07 page is CLOSED — ACCEPTED.

UXP-08 remains NOT STARTED in this closure checkpoint.

UXP-06 was activated only after UXP-05 was fully accepted and the docs-only
UXP-05 closure checkpoint was remotely green:

```text
cc0018ede0a02925cac654f00f10c913f01894c4
docs(roadmap): close UXP-05
GitHub CI run 252
run id 33254945103
success
```

Repository inspection confirms that `/devotional/[slug]` is already a real
shared Knowledge Entity consumer. Existing Shiva and Hanuman browser proof
already demonstrates reusable Devotional presentation, facts, relationships,
Media, Engagement, keyboard focus and mobile no-overflow behavior.

UXP-06 therefore finishes the existing Deity consumer rather than creating a new
Devotional platform.

Frozen minimum direction:

```text
strict universe.devotional + devotional.deity route guard;
existing generic Entity profile depth;
native / alternate identity and overview on the Devotional page;
existing Resource Engagement;
existing IMAGE / bounded SHORT_LOOP Knowledge Media;
page-owned Deity Media viewer;
canonical /devotional/[slug] metadata;
campaign-safe Open Graph identity;
Share / Copy canonical link;
existing Devotional section vocabulary;
canonical relationship navigation without fabricated routes;
bounded devotional.deity Creator Web manager;
generic Creator Entity API reuse;
generic KnowledgeMediaManager reuse;
Creator-only Deity preview;
existing Knowledge publish/archive lifecycle;
no backend/schema migration expected.
```

Frozen UXP-06 slices:

```text
UXP-06A — Strict Deity identity + canonical/social shell
CLOSED — ACCEPTED — 77bde1a35ad50fc67a20b778f44d2cda52662cff

UXP-06B — Deity Media viewer + canonical relationship navigation
CLOSED — ACCEPTED — c5f5a68e143adc3800f297a1b7ffbfebab239d5b

UXP-06C — Creator Deity manager + Creator-only preview
CLOSED — ACCEPTED — a79b5f2252ed10636743d499f163f37bd44129cc

UXP-06D — Reuse + full Deity acceptance
CLOSED — ACCEPTED — 563e48a57d0b95b83db674b0838aac879d48b61b
```

UXP-06A is accepted at:

```text
77bde1a35ad50fc67a20b778f44d2cda52662cff
feat(web): finish devotional deity identity
GitHub CI run 254
run id 33259321923
success
```

Accepted UXP-06A evidence includes:

```text
strict devotional.deity route guard;
finished Deity native / alternate identity and overview;
existing facts + Resource Engagement reuse;
canonical /devotional/[slug];
campaign-safe canonical/Open Graph identity;
shared eligible Entity social-image precedence;
Share / Copy canonical link;
wrong Resource Type rejection;
Shiva desktop + Hanuman authenticated 390px reuse proof;
focused Web unit 3 files / 11 tests;
Web unit suite 19 files / 68 tests;
root unit pipeline 37 / 37 tasks;
32 migrations and schema up to date;
focused API integration 2 files / 11 tests;
full API integration 26 files / 185 tests;
integration pipeline 29 / 29 tasks;
focused browser 12 / 12;
full Web E2E 90 / 90;
production build 22 / 22 tasks;
fresh-process production canonical/social proof;
architecture 0 violations across 773 modules / 2515 dependencies;
reviewed evidence ZIP;
exact checkpoint / push / GitHub CI #254 green.
```

UXP-06A is CLOSED — ACCEPTED.

Before UXP-06B implementation, the accepted UXP-06A transition recorded this
repository evidence for the bounded shared implementation:

```text
the Anime Entity media viewer already supplies the required dialog/focus/video behavior;
the shared Entity page currently restricts viewer eligibility to Anime;
Devotional therefore becomes the second real viewer consumer;
typed relationship routing already exists;
generic Knowledge detail fallback already exists;
no new Media or relationship backend is justified.
```

UXP-06B is accepted at:

```text
c5f5a68e143adc3800f297a1b7ffbfebab239d5b
feat(web): add devotional deity media navigation
GitHub CI run 256
run id 33293220962
success
```

Accepted UXP-06B evidence includes:

```text
shared Knowledge-owned Entity Media viewer extraction;
Anime compatibility export retained;
Devotional IMAGE + bounded SHORT_LOOP viewer;
poster / caption / alt;
explicit user-started VIDEO controls;
no viewer autoplay / loop;
reduced-motion ambient still/poster behavior;
Escape close + focus restoration;
valid/invalid media= deep-link behavior with campaign preservation;
deterministic Devotional relationship order;
strict Universe + Resource Type typed routes;
wrong-Universe typed target generic fallback;
safe non-typed /knowledge/resources/[id] fallback;
Shiva rich proof + Hanuman sparse 390px proof;
focused Web unit 3 files / 11 tests;
Web unit suite 19 files / 68 tests;
root unit pipeline 37 / 37 tasks;
32 migrations and schema up to date;
focused API integration 2 files / 11 tests;
full API integration 26 files / 185 tests;
integration pipeline 29 / 29 tasks;
focused browser 17 / 17;
full Web E2E 95 / 95;
production build 22 / 22 tasks;
architecture 0 violations across 775 modules / 2517 dependencies;
reviewed five-file evidence ZIP;
exact implementation checkpoint / push / GitHub CI #256 green.
```

UXP-06B is CLOSED — ACCEPTED.

Accepted UXP-06C checkpoint:

```text
a79b5f2252ed10636743d499f163f37bd44129cc
feat(web): add devotional deity creator management
GitHub CI run 258
run id 33300488072
success
```

Reviewed UXP-06C evidence includes:

```text
bounded devotional.deity Creator Web manager;
fresh Creator typed-manager default aligned with universe.devotional + devotional.deity;
existing Anime Character manager remains available through explicit Anime selection;
generic getCreatorKnowledgeEntity reuse;
generic replaceCreatorKnowledgeEntity reuse;
existing publishCreatorKnowledgeResource reuse;
existing archiveCreatorKnowledgeResource reuse;
unchanged KnowledgeMediaManager reuse;
preferred Devotional fact vocabulary remains Web-only suggestions;
preferred Devotional relationship section/type vocabulary remains Web-only;
persisted relationship position order retained;
strict universe.devotional + devotional.deity manager guard;
wrong Universe rejected;
correct Universe + wrong Resource Type rejected;
Creator-only /creator/deities/[id]/preview;
Creator preview uses Creator Entity + Media APIs rather than the public Entity API;
anonymous Creator preview makes zero Creator Entity/Media requests;
existing 403 authorization denial is preserved;
DRAFT Creator preview renders saved identity/content/Media/relation order;
DRAFT canonical /devotional/[slug] directly proven non-public;
publish makes the canonical Deity public;
published public Deity renders saved identity/content/Media;
archive makes the canonical Deity non-public again;
Anime Character Creator regression preserved with 3/3 explicit Anime manager entries;
Anime Series Creator regression preserved;
focused Web unit regression 3 files / 11 tests;
root unit pipeline 37 / 37 tasks;
Web unit suite 19 files / 68 tests;
32 canonical migrations with schema up to date;
focused Creator Knowledge API integration 2 files / 11 tests;
full API integration 26 files / 185 tests;
integration pipeline 29 / 29 tasks;
focused browser acceptance 19 / 19;
full Web browser E2E 100 / 100;
production build 22 / 22 tasks;
architecture validation with 0 violations across 780 modules / 2535 dependencies;
reviewed seven-file implementation evidence ZIP;
exact candidate/staged blob identity across all seven files;
zero unstaged tracked files and zero untracked files at acceptance;
exact implementation checkpoint committed and pushed;
GitHub CI #258 / run 33300488072 green on the exact checkpoint.
```

UXP-06C is therefore CLOSED — ACCEPTED.

The accepted Creator Deity management and preview implementation is now a
protected regression surface for UXP-06D.

Accepted UXP-06D / complete UXP-06 checkpoint:

```text
563e48a57d0b95b83db674b0838aac879d48b61b
test(web): prove full devotional deity acceptance
GitHub CI #260
run id 33306100558
completed / success
```

UXP-06D remained acceptance-first. No Deity production change was required.

Reviewed final acceptance evidence includes:

```text
exact two test-only acceptance files;
523 test-only insertions;
0 production changes;
0 docs changes in the acceptance checkpoint;
0 API/schema/migration/dependency/CI changes;

responsive/reuse:
1440px desktop through accepted UXP-06A/B/C regression;
834px sparse tablet proof;
390px-class mobile proof;
Shiva;
Hanuman;
sparse/no-Media Deity;
no Deity-name-specific production branching;
no horizontal overflow;

identity/content:
native name present/absent;
alternate names present/absent;
overview present/absent;
facts rich/sparse/absent;
IMAGE;
bounded SHORT_LOOP;
no Media;
relationship groups present/sparse/absent;

lifecycle/roles:
anonymous visitor;
authenticated shared shell;
Favorite add/remove;
Collection membership mutation;
authorized Creator;
unauthorized Creator;
DRAFT non-public;
PUBLISHED public;
ARCHIVED non-public;
Creator preview/public composition parity;

failure/route states:
loading -> ready;
unexpected error;
not found;
explicit malformed invalid slug -> API 404 + bounded Deity not-found UI;
wrong Resource Type;
unpublished;
archived;
sparse valid Deity;

Media/accessibility:
page-owned viewer;
poster;
reduced motion;
keyboard controls;
Escape close;
focus restoration;
caption/alt;
no audible autoplay;
direct AUDIO Knowledge placement omitted;
no Media delivery request for rejected direct AUDIO placement;

canonical/social:
canonical /devotional/[slug];
campaign-safe entry;
Open Graph title/description;
eligible STILL IMAGE;
SHORT_LOOP poster precedence;
raw VIDEO without poster cannot fabricate social image;
no eligible social image fallback retained through accepted regression;
Share / Copy canonical link;

navigation/regression:
Deity -> Deity relationship navigation;
safe non-Deity relationship destinations;
current /knowledge context;
no /devotional landing before UXP-07;
Search regression without UXP-08 expansion;
Anime landing / Character / Series regressions;
Public Experience regressions;
Creator Character / Series regressions;

engineering:
root lint 21 / 21 tasks;
root typecheck 41 / 41 tasks;
focused UXP-06D Web unit 4 files / 11 tests;
Web unit suite 20 files / 70 tests;
root unit pipeline 37 / 37 tasks;
32 canonical migrations with schema up to date;
focused UXP-06D API integration 5 files / 27 tests;
isolated Media integration 3 / 3;
isolated Knowledge integration 15 / 15;
isolated Identity Access integration 41 / 41;
isolated AI Creator integration 24 / 24;
full integration pipeline 29 / 29 tasks;
full API integration 26 files / 185 tests;
focused browser acceptance 25 / 25;
full Web browser E2E 106 / 106;
production build 22 / 22 tasks;
fresh-process production canonical/social proof;
architecture validation with 0 violations across 782 modules / 2539 dependencies;
reviewed Resume 4 evidence ZIP;
exact candidate/worktree/staged blob identity;
0 unstaged tracked files / 0 untracked files;
exact acceptance checkpoint committed and pushed;
GitHub CI #260 / run 33306100558 green on the exact acceptance SHA.
```

Final accepted UXP-06D proof blobs:

```text
apps/web/e2e/devotional-deity-full-acceptance.spec.ts
f851f5243378f21bf202e286251ee936578cdcbb

apps/web/test/devotional-deity-full-acceptance.spec.ts
0e2f11079e93d846460508175b775a0affa4b39d
```

UXP-06D is therefore CLOSED — ACCEPTED.

UXP-06 is therefore CLOSED — ACCEPTED.

UXP-07 remains NOT STARTED in this closure checkpoint.

UXP-07 is now ACTIVE at the planning/implementation-contract level.

This activation checkpoint creates the detailed UXP-07 contract but remains
docs-only. `/devotional` production implementation begins only after this
activation checkpoint is independently reviewed, manually committed/pushed and
exact remote CI is green.

The generic public Knowledge discovery capability is already accepted and is
reused by UXP-07. No new discovery backend is planned.

UXP-08 remains NOT STARTED.

Important boundaries:

```text
no /devotional landing in UXP-06;
no UXP-07 work;
no UXP-08 Search expansion;
no AUDIO Knowledge placement;
no Deity database/repository/service;
no Devotional-specific Media or Engagement platform;
no generic theme engine;
no generic page builder;
no Creator Studio rewrite;
no speculative transcoding/workflow/policy/recommendation infrastructure.
```

This UXP-06C close / UXP-06D activation checkpoint is docs-only. No UXP-06D
acceptance execution begins before this transition commit itself is independently
reviewed, manually committed, pushed and exact remote CI is green. UXP-06D is
acceptance-first; production changes are permitted only if acceptance exposes a
real defect.

## UXP-08 — Discovery + Engagement

Status:

```text
CLOSED — ACCEPTED
```

The closed accepted implementation/acceptance contract is:

```text
docs/13-roadmaps/uxp-08-discovery-engagement.md
```

UXP-08A is remotely accepted at:

```text
0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
feat(web): finish knowledge browse
GitHub CI #268 / run 33364121387
completed / success
```

UXP-08B is remotely accepted at:

```text
ed366a0aca49c0c110660bb4b2c47b791f4b4a62
feat(web): finish generic knowledge detail
exact remote CI user-confirmed green
```

UXP-08C is remotely accepted at:

```text
0ca5b8699cd087314a2f86c0f10642d3d0e6eff9
feat(web): finish cross-universe search
exact remote CI user-confirmed green
```

UXP-08D is remotely accepted at:

```text
b19304825052da6d5aee240e896ce575261ebe54
feat(web): finish saved knowledge library
exact remote CI user-confirmed green
```

Frozen slice sequence:

```text
UXP-08A — Finished Knowledge Browse
CLOSED — ACCEPTED — 0805eda89a420b5f90f6e3ce0facb1b3d36f81fd

UXP-08B — Finished Generic Knowledge Detail
CLOSED — ACCEPTED — ed366a0aca49c0c110660bb4b2c47b791f4b4a62

UXP-08C — Finished Cross-Universe Search
CLOSED — ACCEPTED — 0ca5b8699cd087314a2f86c0f10642d3d0e6eff9

UXP-08D — Finished Saved / Favorites / Collections
CLOSED — ACCEPTED — b19304825052da6d5aee240e896ce575261ebe54

UXP-08E — Reuse + Full Discovery / Engagement Acceptance
CLOSED — ACCEPTED — a9b09cd0559bec367beba5e2cb7eb0e8123e33a9
```

Accepted UXP-08E / final UXP-08 acceptance checkpoint:

```text
a9b09cd0559bec367beba5e2cb7eb0e8123e33a9
test(ai-creator): isolate assistance integration namespace
exact remote CI user-confirmed green
```

Reviewed UXP-08E evidence:

```text
acceptance-first checkpoint;
1 test file changed / 3 insertions / 1 deletion;
minimum unique-namespace correction for interrupted-run isolation;
0 production feature files;
0 schema/migration/dependency/CI changes;
format 21 / 21;
lint 21 / 21;
typecheck 41 / 41;
root unit 37 / 37;
32 migrations / schema up to date;
focused AI Creator assistance integration 2 / 2;
integration 29 / 29 tasks;
full API 28 files / 191;
Mailpit integration 2 / 2;
focused UXP-08 browser 27 / 27;
full Web E2E 150 / 150 reached ok;
build 22 / 22;
fresh-process production proof;
architecture 0 violations / 809 modules / 2632 dependencies;
reviewed UXP-08E closure evidence ZIP / SHA-256 D8FFCC486B1B1EC3916F9A741B551A99DA542193565B4C70636E70D2B8CAFD7C;
exact remote CI user-confirmed green.
```

UXP-08 is therefore CLOSED — ACCEPTED.

UXP-09 remains NOT STARTED in this closure checkpoint.

Accepted UXP-08A evidence:

```text
9 Web/test files;
1519 insertions / 603 deletions;
0 API/platform/schema/migration/dependency changes;
lint 21 / 21;
typecheck 41 / 41;
focused Knowledge units 2 files / 8;
root unit 37 / 37 tasks;
Web unit 22 files / 73;
32 migrations / schema up to date;
focused API 2 files / 5;
integration 29 / 29 tasks;
full API 27 files / 188;
focused browser 38 / 38;
full Web E2E 136 / 136;
build 22 / 22;
fresh production proof;
architecture 0 violations / 794 modules / 2570 dependencies;
CI #268 green.
```

Accepted UXP-08B evidence:

```text
18 implementation/test files;
1900 insertions / 53 deletions;
0 schema/migration/dependency changes;
lint 21 / 21;
typecheck 41 / 41;
root unit 37 / 37 tasks;
Web unit 24 files / 79;
API unit 3 files / 24;
Knowledge unit 10 files / 67;
32 migrations / schema up to date;
integration 29 / 29 tasks;
full API 28 files / 190;
focused browser 9 / 9;
full Web E2E 144 / 144;
build 22 / 22;
architecture 0 violations / 804 modules / 2614 dependencies;
exact remote CI user-confirmed green.
```

Accepted UXP-08C evidence:

```text
13 implementation/test files;
892 insertions / 99 deletions;
0 schema/migration/dependency changes;
lint 21 / 21;
typecheck 41 / 41;
root unit 37 / 37 tasks;
Web unit 25 files / 83;
Discovery unit 2 files / 7;
focused Search unit 6 / 6;
Discovery persistence integration 4 / 4;
public Search API integration 8 / 8;
32 migrations / schema up to date;
integration 29 / 29 tasks;
full API 28 files / 190;
full Web E2E 149 / 149;
build 22 / 22;
architecture 0 violations / 807 modules / 2620 dependencies;
exact remote CI user-confirmed green.
```

Accepted UXP-08D evidence:

```text
16 implementation/test files;
470 insertions / 39 deletions;
0 schema/migration/dependency changes;
lint 21 / 21;
typecheck 41 / 41;
root unit 37 / 37 tasks;
Web unit 25 files / 84;
Engagement unit 2 files / 11;
focused Saved Web contract/metadata 3 / 3;
Collection persistence integration 1 / 1;
Collection API integration 5 / 5;
32 migrations / schema up to date;
integration 29 / 29 tasks;
full API 28 files / 191;
full Web E2E 149 / 149;
build 22 / 22;
architecture 0 violations / 809 modules / 2630 dependencies;
exact remote CI user-confirmed green.
```

Accepted UXP-08E remained acceptance-only:

```text
no planned production feature was added;
the complete frozen Discovery / Engagement acceptance matrix was executed;
accepted Knowledge, Search and Saved reuse was proven together;
only the minimum correction for a proven test-isolation defect was accepted;
UXP-08 closure evidence was reviewed against the exact remote-green checkpoint.
```

Program-wide UXP-08 constraints remain protected:

```text
finish existing pages, not platforms;
preserve typed Universe identity;
stop using raw Resource IDs as primary product identity;
reuse public Knowledge discovery/profile data;
preserve specialized canonical routes + generic Knowledge fallback;
reuse existing Search semantics;
allow only minimal public Search projection enrichment when proven necessary;
reuse existing authenticated Favorites/Collections ownership;
compose Knowledge identity with Engagement in Web/application layer;
never add Engagement -> Knowledge platform dependency;
no new Search index/ranking/recommendation architecture;
no new Knowledge backend;
no new Engagement database;
no schema migration expected for UXP-08A/B/C;
Collection delete remains the only pre-eligible missing Engagement lifecycle in UXP-08D;
UXP-08E remained acceptance-first with no production feature.
```

This closure transition is docs-only.

It does not activate or implement UXP-09.

---

## UXP-09 — Identity + Account

Status:

```text
CLOSED — ACCEPTED
```

The closed detailed implementation/acceptance contract is:

```text
docs/13-roadmaps/uxp-09-identity-account.md
```

Activation baseline:

```text
82e40675a3e41251345a5c3f9e6ef84abbfc3885
docs(roadmap): close UXP-08
exact remote CI user-confirmed green
```

Frozen slice sequence:

```text
UXP-09A — Finished Registration + Sign-In
CLOSED — ACCEPTED — 1ce88f2b2c5a33aeea5bb52899fb3195fea7e833

UXP-09B — Finished Verification + Recovery / Reset
CLOSED — ACCEPTED — e800c7aa6cde1a13fb6e0bd786b2f9353604475a

UXP-09C — Finished Account + Session
CLOSED — ACCEPTED — 312d697d02e2b0dcec6a9e3796c514ad3c2a1d23

UXP-09D — Full Identity + Account Acceptance
CLOSED — ACCEPTED — bd9b82b5b02ff4a14e9eb2994ae30ae63ecf2b2d
```

UXP-09 reuses the accepted Identity, User, Email and Session capabilities. It
does not authorize a new Identity provider, Session model or authentication
architecture.

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
UXP-07 — CLOSED — ACCEPTED
UXP-08 — CLOSED — ACCEPTED
UXP-08A — CLOSED — ACCEPTED — 0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
UXP-08B — CLOSED — ACCEPTED — ed366a0aca49c0c110660bb4b2c47b791f4b4a62
UXP-08C — CLOSED — ACCEPTED — 0ca5b8699cd087314a2f86c0f10642d3d0e6eff9
UXP-08D — CLOSED — ACCEPTED — b19304825052da6d5aee240e896ce575261ebe54
UXP-08E — CLOSED — ACCEPTED — a9b09cd0559bec367beba5e2cb7eb0e8123e33a9
UXP-09 — CLOSED — ACCEPTED
UXP-09A — CLOSED — ACCEPTED — 1ce88f2b2c5a33aeea5bb52899fb3195fea7e833
UXP-09B — CLOSED — ACCEPTED — e800c7aa6cde1a13fb6e0bd786b2f9353604475a
UXP-09C — CLOSED — ACCEPTED — 312d697d02e2b0dcec6a9e3796c514ad3c2a1d23
UXP-09D — CLOSED — ACCEPTED — bd9b82b5b02ff4a14e9eb2994ae30ae63ecf2b2d
UXP-10 — ACTIVE
UXP-10A — CLOSED — ACCEPTED — ceeea29ee5746d4a5cf39c3283c071ece7734da0
UXP-10B — CLOSED — ACCEPTED — 28282f76eab4f2e4145e700afd8d77e6ebb9ef44
UXP-10C — ACTIVE
UXP-10D — NOT STARTED
UXP-10E — NOT STARTED
```

Active detailed implementation/acceptance contract:

```text
docs/13-roadmaps/uxp-10-creator-admin-studio.md
```

This UXP-10B closure and UXP-10C activation checkpoint is docs-only.

After it is independently reviewed, manually committed/pushed and exact remote CI
is green, implement only:

```text
UXP-10C — Finished Composition + AI + Publishing Journey
```

Do not begin UXP-10D, UXP-10E or UXP-11 inside UXP-10C.

WPR-M05 remains ACTIVE.

P10-M04 remains SEQUENCING-BLOCKED.

The Master Roadmap remains unchanged.
