# AI World UXP-04 — Anime Series Page

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-04 |
| Area | Product / Web / Knowledge / Media / Engagement / Creator |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-04D ACTIVE |
| Created | 2026-08-25 |
| Baseline | `64435607011e0bc6d57c34fe7a5d439a4aef6a48` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Predecessor | UXP-03 — Anime Universe Landing — CLOSED — ACCEPTED |
| Scope | Add and fully finish `/anime/series/[slug]` as the canonical Anime Series destination |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Purpose

UXP-04 adds the second fully finished Anime entity page:

```text
/anime/series/[slug]
```

The page must turn an existing published `anime.series` Knowledge Entity into a
canonical, social-ready, media-rich Series destination.

It must reuse the architecture already proven by the finished Anime Character and
Anime Universe landing rather than creating a separate Anime application, Series
backend, Series database, or generic page-building system.

The governing principle remains:

> Build the minimum architecture necessary to support the next real capability,
> then validate it through working vertical slices before expanding further.

---

# 2. Accepted Starting Point

UXP-04 starts after the accepted UXP-03 closure transition:

```text
64435607011e0bc6d57c34fe7a5d439a4aef6a48
docs(roadmap): close UXP-03 and activate UXP-04
GitHub CI run 232 — success
```

Accepted predecessors already provide:

```text
/anime landing;
optional published anime.series discovery;
finished /anime/characters/[slug];
generic public Knowledge Entity reads by Universe + slug;
generic Entity profile identity / summary / overview / facts;
generic ordered Knowledge relationships;
generic contextual Knowledge Media placements;
public-safe IMAGE / SHORT_LOOP Media;
Favorites / Collections by Knowledge Resource ID;
shared anonymous / authenticated shell;
Creator Knowledge Resource lifecycle;
generic Creator Entity read / replace APIs;
generic Creator Knowledge Media management;
campaign-safe Web metadata origin;
existing Anime Search filter for anime.series.
```

The dedicated route does not yet exist:

```text
/anime/series/[slug]
```

Current Series cards on `/anime` still point to:

```text
/knowledge/resources/[resourceId]
```

This is an accepted temporary UXP-03 destination and must become the canonical
Series route only after the dedicated route is real.

---

# 3. Repository / Architecture Inspection Findings

The UXP-04 inspection at baseline `6443560` established the following facts.

## 3.1 Knowledge already owns the complete canonical Series entity boundary

`KnowledgeResource` already carries:

```text
universeKey;
resourceType;
lifecycle.
```

`KnowledgeEntityProfile` already carries:

```text
slug;
displayName;
nativeName;
alternateNames;
summary;
overview;
ordered quick facts.
```

Knowledge relationships already carry:

```text
targetResourceId;
sectionKey;
relationshipType;
position.
```

Knowledge Media placements already carry:

```text
assetId;
role;
playback;
position;
altText;
caption;
posterAssetId.
```

No Series-specific persistence is required for the core page.

## 3.2 Public Entity reads are resource-type agnostic

The accepted public Entity endpoint already resolves:

```text
Universe + slug
        ↓
published Knowledge Resource
        ↓
Entity profile
        ↓
ordered public-safe Media
        ↓
ordered relationships with resolved public target identity
```

UXP-04 therefore does not create a new public Series API by default.

The Web route must still enforce the expected type:

```text
universeKey = universe.anime
resourceType = anime.series
```

A published `anime.character` with a valid Anime slug must never render through
`/anime/series/[slug]`.

## 3.3 Engagement is already generic

`ResourceEngagementControls` accepts only:

```text
resourceId
```

Favorites and Collections already work across Knowledge Resource types.

UXP-04 reuses that control unchanged unless evidence proves a Series-specific
defect.

## 3.4 Creator backend contracts are already generic

Existing Creator APIs already support:

```text
create Knowledge Resource by universeKey + resourceType;
load Entity configuration;
replace Entity profile / facts / relationships;
publish Resource;
archive Resource;
load / replace Knowledge Media placements.
```

No Series-specific backend controller is justified.

The current Web identity/facts/relationship manager is explicitly
`anime.character`-only, so UXP-04 does require a bounded Series-specific Creator
consumer later.

## 3.5 Search is intentionally not expanded by UXP-04

Current public Search already filters:

```text
anime.character;
anime.series.
```

However the current Search result contract exposes only:

```text
resourceId;
resourceType;
optional universeKey.
```

It does not expose a public Entity slug and therefore cannot construct
`/anime/series/[slug]` without changing the Search projection.

UXP-08 owns the finished Search experience.

UXP-04 will not expand the Search API merely to rewire Search result URLs.
Search must remain regression-green and its current generic Knowledge-detail
destination remains accepted until UXP-08.

## 3.6 Staff, studio and episode systems are not modeled

Repository inspection found no canonical:

```text
anime.episode;
anime.staff;
anime.studio;
```

Resource contracts.

There is also no accepted typed Knowledge-to-Composition relationship that makes
public `/experiences/[id]` a first-class Series relation today.

Therefore UXP-04 must not invent:

```text
episode persistence;
scene persistence;
staff persistence;
studio persistence;
streaming availability;
watch-provider data;
direct Experience relationship infrastructure.
```

These remain future capabilities and render no fake placeholders.

---

# 4. Architecture Decision

UXP-04 is a Web product/composition milestone over accepted shared platforms.

The architecture is:

```text
/anime/series/[slug]
        |
        v
existing public Knowledge Entity contract
        |
        +--> typed Series guard
        |
        +--> existing Entity profile
        |
        +--> existing Knowledge Media placements
        |
        +--> existing Knowledge relationships
        |
        +--> existing Engagement controls
        |
        +--> Anime Series presentation
```

The canonical owner boundaries remain:

```text
Knowledge
  owns Series Resource / Entity semantics, facts, relationships and lifecycle;

Media
  owns Asset lifecycle, metadata and delivery;

Engagement
  owns Favorites / Collections mechanics;

Identity & Access
  owns session and Creator authorization;

Web
  owns Series route composition, presentation, canonical links and metadata.
```

UXP-04 does not introduce:

```text
Series Platform;
Series service;
Series table;
Series repository;
new Universe app;
generic page builder;
theme engine;
new shared UI package.
```

---

# 5. Canonical Route Contract

Canonical public route:

```text
/anime/series/[slug]
```

The route resolves only a public Entity where:

```text
resource.universeKey === universe.anime
resource.resourceType === anime.series
public publication rules pass
profile slug resolves
```

Wrong type, missing Entity, unpublished, archived, deleted or unavailable
Resources must not render as a Series page.

Expected outcome for non-public or mismatched input:

```text
not-found / unavailable public state
```

Never expose draft canonical content through the public route.

The route must remain slug-based, not Resource-ID-based.

---

# 6. Series Public Data Contract

UXP-04 uses the existing public Entity shape.

Required identity:

```text
resource.id;
resource.universeKey;
resource.resourceType;
profile.slug;
profile.displayName;
profile.summary.
```

Optional identity/content:

```text
profile.nativeName;
profile.alternateNames;
profile.overview;
profile.facts[];
media[];
relations[].
```

No optional section renders a fake placeholder merely to fill the page.

## 6.1 Preferred Series quick facts

The existing generic namespaced fact model is sufficient.

When canonically known, the Creator flow should prefer:

```text
anime.format     -> Format
anime.status     -> Status
anime.episodes   -> Episodes
```

Additional real Series facts may use canonical namespaced keys within the accepted
generic quick-fact limit.

These are presentation conventions, not new database columns or new enum
infrastructure.

Do not fabricate values when the source content is unknown.

---

# 7. Public Page Information Hierarchy

The finished Series page should use this hierarchy:

```text
1. Anime Universe context
2. cinematic Series hero
3. display / native / alternate title identity when available
4. concise Series summary
5. format / status / episode facts when canonically authored
6. save / favorite / collection / share
7. Media Highlights
8. long overview / description
9. Characters
10. Related Series & Movies
11. Continue exploring Anime
```

Optional sections disappear cleanly when no canonical data exists.

The page must remain coherent with only:

```text
displayName + summary
```

and no Media, facts or relationships.

---

# 8. Series Presentation Contract

The page belongs to the existing Anime presentation language:

```text
energetic;
cinematic;
content-led;
high contrast;
strong media;
controlled short motion;
shared AI World shell and interaction rules.
```

It must not become a separate Series theme system.

The public page should expose an explicit Series identity marker so tests can
distinguish it from Character and generic Knowledge composition.

No production branch may depend on a named Series such as:

```text
Attack on Titan;
Fullmetal Alchemist;
Naruto;
One Piece.
```

Named Series are test fixtures only.

---

# 9. Media Contract

Series Media reuses the accepted Knowledge / Media placement model.

Supported initial public modes:

```text
IMAGE + STILL;
VIDEO + SHORT_LOOP + poster.
```

Placement roles remain:

```text
HERO;
GALLERY;
HIGHLIGHT.
```

Short motion rules remain:

```text
bounded approximately 3–8 seconds;
muted autoplay only when intentional;
loop;
playsInline;
poster required;
no audible autoplay;
prefers-reduced-motion => poster/still-first.
```

Media viewer behavior must reuse the finished Anime interaction rather than create
a second viewer.

Because UXP-04 is the second Anime Entity consumer, a small Web-only
second-consumer generalization is allowed when justified, for example:

```text
AnimeCharacterMediaViewer
        ↓
bounded Anime Entity media viewer reusable by Character + Series
```

Do not introduce a general-purpose Media application or shared package merely for
this reuse.

## 9.1 Media deep link

If the accepted viewer is reused for Series, the route may use:

```text
/anime/series/[slug]?media=<asset-id>
```

Only eligible public Entity Media may open.

Invalid or unavailable media IDs must fall back to the canonical Series page
without breaking the page.

Campaign parameters must not alter canonical identity.

---

# 10. Series Relationship Contract

Series relationships reuse the existing generic Knowledge relationship record.

The initial Series-specific public section vocabulary is intentionally small.

## 10.1 Characters

```text
sectionKey: entity.characters
default relationshipType: anime.character
title: Characters
```

Targets are existing related Knowledge Resources.

Public cards use resolved target identity and eligible preview Media from the
accepted Entity relation projection.

Anime Character targets navigate canonically to:

```text
/anime/characters/[slug]
```

## 10.2 Related Series & Movies

```text
sectionKey: entity.series
default relationshipType: anime.related-series
title: Related Series & Movies
```

Movies remain `anime.series` Resources when that is their current canonical
Knowledge type, distinguished by real facts such as `anime.format` rather than a
new `anime.movie` platform type.

Anime Series targets navigate canonically to:

```text
/anime/series/[slug]
```

## 10.3 Deferred relation groups

Do not add fake sections for:

```text
staff;
studios;
episodes;
scenes;
watch providers;
streaming availability;
Experiences.
```

They become eligible only after a real canonical model exists.

The generic Knowledge validator remains the source of truth for relation limits
and namespaced-key validity.

---

# 11. Existing Entity Experience Reuse Boundary

The current shared public Entity renderer already contains substantial reusable
behavior:

```text
fetch / state handling;
hero structure;
facts;
Engagement;
Media projection;
relationship rails;
Universe presentation.
```

But it currently treats Anime media viewer/share/identity/section ordering as
Character-specific.

UXP-04 may extend that renderer with an explicit expected Resource Type and a
bounded Series presentation branch.

Required type safety:

```text
route expectedResourceType = anime.series
actual public Entity resourceType must match
```

The Character route should preserve or strengthen its own
`anime.character` type guard when the shared renderer is touched.

Do not turn the renderer into an arbitrary data-driven page builder.

Small helpers may be extracted only when Character + Series are both real
consumers.

---

# 12. Canonical Navigation Contract

Once `/anime/series/[slug]` exists:

## Anime landing

Series cards on `/anime` must change from:

```text
/knowledge/resources/[resourceId]
```

to:

```text
/anime/series/[slug]
```

## Entity relationship cards

The shared related-Entity path resolver must recognize:

```text
anime.series -> /anime/series/[slug]
```

This allows Character → Series and Series → Series links to use the canonical
Series route.

## Search

Do not change Search result projection/routing in UXP-04.

Search remains an accepted regression and UXP-08 owns its final canonical
destination behavior.

---

# 13. Engagement Contract

Use the existing:

```text
ResourceEngagementControls
```

with the Series `resourceId`.

Anonymous behavior:

```text
sign-in callout;
no fake saved state.
```

Authenticated behavior:

```text
favorite / unfavorite;
add to Collection;
existing error/loading semantics.
```

No Series-specific Engagement backend or state is allowed.

---

# 14. Sharing / Social Identity Contract

Every public Series page requires:

```text
stable canonical URL;
title;
description;
Open Graph title;
Open Graph description;
representative Open Graph image when eligible Media exists;
share action;
copy-link action;
campaign-safe canonical identity.
```

Canonical:

```text
/anime/series/[slug]
```

Social description:

```text
profile.summary
```

Social image preference reuses the accepted Anime Entity precedence:

```text
first eligible HERO placement;
otherwise first eligible placement;
IMAGE resolves to its image Asset;
SHORT_LOOP resolves to its required poster Asset;
otherwise no fabricated content image.
```

An eligible placement is either:

```text
IMAGE + STILL;
VIDEO + SHORT_LOOP + poster.
```

Series must not introduce an image-first precedence that differs from the finished
Anime Character social-selection behavior.

The existing root `metadataBase` / `AI_WORLD_WEB_ORIGIN` boundary is reused.

The Series metadata helper may reuse or extract the already-proven Anime Entity
social-selection logic when that keeps Character and Series behavior consistent.

No new environment variable is justified.

---

# 15. Creator / Editor Contract

A finished Series page requires a real authorized path to manage the canonical
content that drives it.

The backend work already exists generically.

UXP-04C adds the minimum Web consumer.

## 15.1 Series manager

The Creator Series manager must accept only:

```text
universe.anime
+
anime.series
```

It manages through existing Creator APIs:

```text
slug;
displayName;
nativeName;
alternateNames;
summary;
overview;
quick facts;
ordered Series relationships;
publish;
archive.
```

It should provide sensible Series defaults such as:

```text
anime.format / Format;
anime.status / Status;
anime.episodes / Episodes;
entity.characters / anime.character;
entity.series / anime.related-series.
```

The manager must not create a Series-specific API.

## 15.2 Media management

Reuse the existing generic:

```text
KnowledgeMediaManager
```

for:

```text
IMAGE;
bounded VIDEO SHORT_LOOP;
HERO / GALLERY / HIGHLIGHT;
alt text;
caption;
poster;
ordering.
```

No separate Series Media manager is justified.

## 15.3 Creator-only preview

The Character workflow already proves a Creator-only draft preview pattern.

UXP-04C may add the bounded analogous route:

```text
/creator/series/[id]/preview
```

It may read the existing authorized Creator Entity + Media APIs.

It must verify:

```text
universe.anime
anime.series
```

Draft preview is Creator-only and must not weaken public publication rules.

## 15.4 Permissions

Reuse current server-enforced Creator authorization.

Do not add:

```text
Series Editor role;
Anime Admin role;
Universe Admin role;
new permission vocabulary.
```

unless a real server-enforced requirement independently appears.

---

# 16. Expected Backend / Database Boundary

No schema migration is expected for the initial UXP-04 contract.

No new backend endpoint is expected for the core page.

The implementation should use existing:

```text
public Knowledge Entity;
Creator Knowledge Entity;
Creator Knowledge Resource lifecycle;
Knowledge Media;
Media delivery;
Engagement.
```

A backend/API change is allowed only if implementation proves a concrete missing
capability that cannot be satisfied truthfully through these accepted contracts.

If such a gap appears, stop and document it before expanding scope.

---

# 17. Explicit Non-Goals

UXP-04 does not authorize:

```text
episode platform;
scene platform;
staff model;
studio model;
streaming availability;
watch-provider integrations;
ratings/reviews;
fake scores;
fake popularity;
fake trending;
recommendation infrastructure;
personalized recommendations;
editorial ranking;
manual Series curation CMS;
Series-specific persistence;
new Search platform;
Search result projection expansion solely for Series routing;
new Media platform;
long-form streaming platform;
Range streaming;
HLS;
DASH;
transcoding;
audio autoplay;
generic page builder;
theme engine;
new UI package;
new roles/permissions;
P10-M04 deployment work.
```

Direct Experience relations are also deferred until a real typed relationship
between Knowledge and Composition is accepted.

---

# 18. UXP-04 Slice Plan

Implementation proceeds in four bounded slices.

## UXP-04A — Canonical route + identity / social shell

Status:

```text
CLOSED — ACCEPTED
```

Scope:

```text
/anime/series/[slug] route;
explicit universe.anime + anime.series type guard;
loading;
error;
not found / wrong type;
Series hero shell;
display/native/alternate identity;
summary;
overview;
generic facts;
existing Engagement controls;
Series share / copy-link behavior;
canonical metadata;
Open Graph title / description / eligible image;
campaign-safe canonical identity;
base desktop + mobile composition.
```

Expected architecture:

```text
existing public Entity read;
existing root metadataBase;
no migration;
no new public API;
no Creator change yet;
no Search change.
```

Proof:

```text
published Series opens canonically;
Character slug cannot render as Series;
unpublished / absent Series does not render publicly;
no-Media Series remains coherent;
facts optional;
anonymous Engagement;
authenticated shell remains coherent;
campaign-safe metadata.
```

Accepted implementation checkpoint:

```text
e9cc98aa162687e2ee2d2af209d6a91809d57b11
feat(web): add anime series identity shell
```

Accepted remote CI:

```text
GitHub CI run 234
run id 32972017575
completed successfully on e9cc98aa162687e2ee2d2af209d6a91809d57b11
```

Accepted UXP-04A evidence includes:

```text
canonical /anime/series/[slug] route;
strict universe.anime + anime.series type guard;
strengthened anime.character type guard on the existing Character route;
published Series identity / native name / alternate names;
summary / overview / generic facts;
sparse Series fallback without fake optional identity or facts;
existing anonymous / authenticated shared shell;
existing Favorites / Collections Engagement behavior;
Series share / copy-link controls;
campaign-safe canonical URL;
Open Graph title / description;
shared Anime HERO-first social Media precedence;
HERO SHORT_LOOP social image resolved through its required poster;
Series public Media UI intentionally suppressed until UXP-04B;
Series relationship rails intentionally suppressed until UXP-04B;
Anime landing Series-link rewiring intentionally deferred until UXP-04B;
Creator Series management intentionally deferred until UXP-04C;
Search unchanged;
backend / schema / migrations / dependencies / roadmaps unchanged;
focused Character + Series social unit 2 / 2 files and 7 / 7 tests;
root unit pipeline 37 / 37 tasks;
Web unit 17 / 17 files and 56 / 56 tests;
32 migrations deployed on isolated PostgreSQL 18.4;
isolated AI Creator integration 11 / 11 files and 24 / 24 tests;
full serial integration pipeline 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
focused Series + Character browser acceptance 11 / 11;
full browser E2E 66 / 66;
production build 22 / 22;
fresh-process production Series canonical / Open Graph smoke;
fresh Next.js process reported Ready and stayed alive during validation;
campaign parameters excluded from canonical identity;
fresh process tree cleaned up and validation port proven released;
architecture validation with 0 violations across 752 modules / 2463 dependencies;
reviewed evidence ZIP;
commit / push;
exact GitHub CI green.
```

UXP-04A is therefore CLOSED — ACCEPTED.

## UXP-04B — Media + Series relationships + canonical Anime navigation

Status:

```text
CLOSED — ACCEPTED
```

Scope:

```text
reusable Anime media viewer for Series;
IMAGE;
SHORT_LOOP;
poster;
reduced motion;
media deep-link when canonical;
Characters rail;
Related Series & Movies rail;
empty optional relation groups omitted;
canonical Character targets;
canonical Series targets;
Anime landing Series cards -> /anime/series/[slug];
shared related-Entity path recognizes anime.series.
```

Allowed reuse:

```text
small Character + Series Web helper extraction driven by the second consumer.
```

Do not modify Search projection/routing in this slice.

Proof:

```text
image-only Series;
short-loop Series;
no-Media Series;
Characters present / absent;
Related Series present / absent;
Series-to-Series canonical links;
Character-to-Series canonical regression;
Anime landing canonical Series navigation;
keyboard media viewer;
reduced-motion poster behavior.
```

Accepted implementation checkpoint:

```text
3656cabc6018feb9c89fe389dd20412f56eb5094
feat(web): finish anime series media navigation
```

Accepted remote CI:

```text
GitHub CI run 236
run id 32981986570
completed successfully on 3656cabc6018feb9c89fe389dd20412f56eb5094
```

Accepted UXP-04B evidence includes:

```text
bounded Anime Entity media viewer reused by Character + Series;
existing Character media viewer compatibility preserved;
Series IMAGE + STILL public Media;
Series VIDEO + SHORT_LOOP + required poster public Media;
reduced-motion poster-first behavior;
Series ?media=<asset-id> deep-link;
invalid media query removes only media while preserving campaign parameters;
keyboard viewer open / Escape close / focus restoration;
viewer video remains user-started with controls and no autoplay/loop;
Series Characters rail;
Series Related Series & Movies rail;
relationship rendering filtered by sectionKey + relationshipType + target Resource Type;
malformed Series relationship combinations remain hidden;
Series -> Character canonical /anime/characters/[slug];
Series -> Series canonical /anime/series/[slug];
Character -> Series canonical regression;
Anime landing Series cards -> /anime/series/[slug];
UXP-03D tablet acceptance updated to require the exact canonical Series slugs;
04A identity behavior remains coherent when optional Media / relations are absent;
Search unchanged;
Creator Series management not started;
backend / schema / migrations / dependencies / roadmaps / CSS unchanged;
Web lint / typecheck green;
root format / lint / typecheck green;
root unit pipeline 37 / 37 tasks;
Web unit 17 / 17 files and 56 / 56 tests;
32 migrations deployed on isolated PostgreSQL 18.4;
isolated AI Creator integration 11 / 11 files and 24 / 24 tests;
full serial integration pipeline 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
focused UXP-04B + updated UXP-03D browser acceptance 24 / 24;
full browser E2E 71 / 71;
production build 22 / 22;
architecture validation with 0 violations across 755 modules / 2466 dependencies;
reviewed evidence ZIP;
commit / push;
exact GitHub CI green.
```

UXP-04B is therefore CLOSED — ACCEPTED.

## UXP-04C — Creator Series manager + creator-only preview

Status:

```text
CLOSED — ACCEPTED
```

Scope:

```text
bounded anime.series Web manager;
generic Creator Entity APIs;
generic Knowledge Media manager;
profile / facts / Series relationships;
publish / archive lifecycle;
Creator-only /creator/series/[id]/preview;
authorized behavior;
unauthorized behavior;
wrong Resource Type rejection.
```

No new Creator backend endpoint is expected.

Proof:

```text
create/load anime.series Resource;
configure identity;
configure preferred facts;
configure Character / related-Series relationships;
manage Media with existing manager;
preview draft through authorized route;
publish;
public Series becomes available;
archive;
public Series becomes unavailable;
wrong type rejected;
unauthorized Creator path denied.
```

Accepted implementation checkpoint:

```text
1cc5f6c2d764a2fa5fb426baeb3ee4bdbce34b07
feat(creator): manage anime series
```

Accepted remote CI:

```text
GitHub CI run 238
run id 33056755407
completed successfully on 1cc5f6c2d764a2fa5fb426baeb3ee4bdbce34b07
```

Accepted UXP-04C evidence includes:

```text
bounded anime.series Creator Web manager;
existing generic Creator Entity APIs reused;
existing generic KnowledgeMediaManager reused;
preferred Series facts use anime.format / anime.status / anime.episodes;
Series relationship editing is bounded to Characters + Related Series & Movies;
Series relationship-type vocabulary is fixed rather than free-form;
Creator workspace keeps Character as the existing default typed Anime editor;
anime.series Resource creation/selection activates the Series manager;
Creator-only /creator/series/[id]/preview route;
DRAFT Series preview stays inside authenticated Creator Entity / Media reads;
public Entity read is not required for Creator draft preview;
publish lifecycle makes the canonical public Series available;
archive lifecycle makes the canonical public Series unavailable;
wrong Resource Type rejected by Series manager / preview;
existing Creator authorization denial surfaces;
anonymous Series preview is blocked before Creator Entity / Media fetch;
Character Creator manager / preview unchanged;
Creator API unchanged;
KnowledgeMediaManager unchanged;
Search unchanged;
backend / schema / migrations / dependencies / roadmaps / CSS unchanged;
CI workflow unchanged by the UXP-04C implementation commit;
remote Web unit 17 / 17 files and 56 / 56 tests;
32 migrations found and deployed in remote CI;
remote AI Creator integration 11 / 11 files and 24 / 24 tests;
remote full integration pipeline 29 / 29 tasks;
remote API integration 26 / 26 files and 181 / 181 tests;
remote full browser E2E 75 / 75;
remote production build 22 / 22 tasks;
remote architecture validation with 0 violations across 759 modules / 2483 dependencies;
commit / push;
exact GitHub CI green.
```

UXP-04C is therefore CLOSED — ACCEPTED.

## UXP-04D — Reuse + full Series acceptance

Status:

```text
ACTIVE — NEXT IMPLEMENTATION SLICE
```

This is the complete page Definition-of-Done gate.

Required proof includes:

```text
desktop;
tablet;
390px-class mobile;
two or more Series proving reuse;
Series with IMAGE;
Series with SHORT_LOOP;
Series with no Media;
facts present;
facts sparse / absent;
Characters present;
Characters absent;
Related Series present;
Related Series absent;
anonymous visitor;
authenticated user;
authorized Creator;
unauthorized Creator;
loading;
unexpected error;
not found;
wrong Resource Type;
unpublished / archived;
keyboard-only;
focus restoration from media viewer;
reduced motion;
canonical/social deep-link;
campaign parameters;
landing -> Series navigation;
Character -> Series relationship navigation;
Series -> Character navigation;
Series -> Series navigation;
Search regression without UXP-08 expansion;
finished Anime landing regressions;
finished Anime Character regressions;
Shiva / Hanuman regressions;
format;
lint;
typecheck;
focused unit;
migration status/deployment;
integration;
focused browser;
full browser E2E;
production build;
fresh-process production social proof;
architecture check;
reviewed evidence ZIP;
acceptance checkpoint commit/push;
exact remote CI green.
```

Production changes in UXP-04D are allowed only when acceptance exposes a real
defect.

---

# 19. Protected Regression Boundaries

UXP-04 must preserve:

```text
finished /anime landing;
finished /anime/characters/[slug];
Anime Character canonical URLs;
Anime Character media deep links;
Anime Character Creator manager / preview;
Character relationships;
Devotional Shiva / Hanuman behavior;
generic public Knowledge detail;
existing Search API semantics;
existing /search behavior;
Knowledge publication visibility;
Media public-safe delivery;
Favorites / Collections;
shared session shell;
reduced-motion behavior;
root metadataBase / Web-origin behavior;
architecture dependency rules.
```

If a proposed Series implementation requires breaking one of these boundaries,
stop and justify the requirement with repository evidence.

---

# 20. Expected Change Surface

Initial UXP-04 work is expected to remain primarily in:

```text
apps/web/src/app/anime/series/[slug]/...
apps/web/src/anime/...
apps/web/src/knowledge/entity-experience-page.tsx
apps/web/src/creator/...
apps/web/src/app/creator/series/[id]/preview/...
apps/web/e2e/...
apps/web/test/...
```

The Anime landing may receive only the canonical Series-link update required by
UXP-04B.

Expected unchanged by default:

```text
Prisma schema;
database migrations;
Knowledge public API endpoint set;
Creator Knowledge backend endpoint set;
Media backend;
Engagement backend;
Search backend;
Search result contract;
dependencies;
pnpm lockfile;
CI workflow;
Master Roadmap.
```

---

# 21. Acceptance Evidence Rules

Every implementation slice must produce reviewed evidence before commit approval.

Evidence ZIP should include as applicable:

```text
summary.json;
report.txt;
terminal log;
all command step logs;
focused screenshots;
full browser result;
production build output;
architecture output;
complete staged diff;
final Git status.
```

A green command exit is not enough when the runner itself performs a semantic
check.

Production `next start` proof must launch and validate the newly built process,
not a stale process on an occupied hard-coded port.

Prefer a freshly reserved dynamic port and prove process cleanup afterward.

---

# 22. Exit Rule

UXP-04 closes only when:

```text
/anime/series/[slug] is the finished canonical Series destination;
only published universe.anime / anime.series Entity content renders there;
Series identity / facts / overview are truthful;
Media follows accepted safety / motion rules;
Character and related-Series navigation is real;
Anime landing links Series canonically;
save / collection / share behavior is real;
Creator can manage the data required by the public page through accepted permissions;
Creator-only draft preview is real;
responsive / accessibility / social acceptance passes;
Anime landing / Character / Devotional regressions remain green;
Search remains regression-green without premature UXP-08 scope;
the evidence / commit / push / exact CI chain is accepted.
```

Only then may work begin on:

```text
UXP-05 — Public Experience / social landing
```

---

# 23. Current Starting Position

Accepted predecessor:

```text
UXP-03 — Anime Universe Landing
CLOSED — ACCEPTED
final acceptance:
75d91ef7975e515c10b529c143641bad0d1d6055
test(web): prove full anime landing acceptance
GitHub CI run 231 — success
```

UXP-04 activation:

```text
64435607011e0bc6d57c34fe7a5d439a4aef6a48
docs(roadmap): close UXP-03 and activate UXP-04
GitHub CI run 232 — success
```

Repository/architecture inspection is complete.

UXP-04A is accepted at:

```text
e9cc98aa162687e2ee2d2af209d6a91809d57b11
feat(web): add anime series identity shell
GitHub CI run 234 — success
```

UXP-04B is accepted at:

```text
3656cabc6018feb9c89fe389dd20412f56eb5094
feat(web): finish anime series media navigation
GitHub CI run 236 — success
```

UXP-04C is accepted at:

```text
1cc5f6c2d764a2fa5fb426baeb3ee4bdbce34b07
feat(creator): manage anime series
GitHub CI run 238 — success
```

The active implementation slice is now:

```text
UXP-04D — Reuse + full Series acceptance
```

UXP-04D is the complete Series page Definition-of-Done gate.

It must prove the already frozen acceptance matrix across:

```text
desktop;
tablet;
390px-class mobile;
two or more Series proving reuse;
IMAGE / SHORT_LOOP / no-Media Series;
facts present / sparse / absent;
Characters present / absent;
Related Series present / absent;
anonymous / authenticated / authorized Creator / unauthorized Creator;
loading / unexpected error / not found / wrong Resource Type / unpublished / archived;
keyboard-only;
media-viewer focus restoration;
reduced motion;
canonical/social deep-link + campaign parameters;
landing -> Series;
Character -> Series;
Series -> Character;
Series -> Series;
Search regression without UXP-08 expansion;
finished Anime landing regressions;
finished Anime Character regressions;
Shiva / Hanuman regressions;
full validation / production / architecture / evidence chain.
```

Production changes in UXP-04D are allowed only when acceptance exposes a real
defect.

Do not begin UXP-05 until UXP-04D and complete UXP-04 acceptance have an accepted
checkpoint and exact remote CI green.

The Master Roadmap remains unchanged. WPR-M05 remains the active Product Quality
And Local User Acceptance gate, and P10-M04 remains sequencing-blocked until that
gate closes.
