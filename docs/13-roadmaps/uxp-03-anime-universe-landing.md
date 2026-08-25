# AI World UXP-03 — Anime Universe Landing

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-03 |
| Area | Product / Web / Knowledge / Media / Discovery |
| Status | CLOSED — ACCEPTED |
| Created | 2026-08-25 |
| Baseline | `3ddb3fcd4c42e94efaedfb2f444e09b93ab16a4a` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Scope | Add and fully finish `/anime` as the Anime Universe discovery front door |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Purpose

UXP-03 adds and finishes the first Universe landing page:

```text
/anime
```

The Anime landing must turn the accepted finished Character experience into a
coherent discovery destination rather than a generic Resource-ID grid.

The governing rule is:

> Build the Anime front door from real published Knowledge and accepted shared Platform capabilities, add only the public discovery projection the landing actually needs, and do not pull Anime Series, recommendations, editorial curation, or Creator Studio work forward from later phases.

UXP-03 begins only after the complete UXP-02 Character page acceptance chain
closed at:

```text
3ddb3fcd4c42e94efaedfb2f444e09b93ab16a4a
test(web): prove full anime character acceptance
```

GitHub CI run 223 completed successfully for that exact checkpoint on
2026-08-25.

---

# 2. Repository Evidence Reviewed Before Freeze

The UXP-03 contract is based on the accepted repository after UXP-02 closure.

The review included:

```text
apps/web/src/app/anime;
finished /anime/characters/[slug] route;
finished Anime Character composition;
typed Web Universe presentation;
public Knowledge Resource list Web/API contracts;
public Knowledge Entity projection;
public-safe Knowledge Media descriptors;
cross-Universe Search experience;
existing /knowledge/resources/[id] public detail;
UXP-02 A/B/C/D/E automated proofs;
current roadmap and WPR-M05 constraints.
```

At the UXP-03 freeze, repository facts were:

```text
/apps/web/src/app/anime contains only the characters subtree;

/anime itself does not exist;

the finished Character route is canonical and accepted;

/knowledge/resources?universeKey=... already lists published Resources but
returns only id / universeKey / resourceType / createdAt / updatedAt;

that generic list is sufficient for registry/browse proof but not sufficient for
a finished content-first Anime landing because it has no slug, display name,
summary or preview Media;

the public Entity API already owns canonical slug / displayName / summary and
public-safe Media descriptors for individual Entities;

Knowledge already owns Resource publication, Entity profile semantics and
Resource-to-Media contextual placement;

Media continues to own Asset lifecycle, technical metadata and delivery;

the existing Search experience already supports Universe and Resource Type
filters and therefore remains the correct search capability;

the typed Anime presentation already provides Anime tone, energetic motion and
Universe vocabulary;

there is no finished /anime/series/[slug] route yet;

there is no accepted public Anime ranking, popularity, recommendation,
trending, editorial curation or featured-content model;

there is no need for a new Anime database, Anime Media platform, Anime Search
platform or separate Anime Web application.
```

---

# 3. Architectural Decision

## 3.1 `/anime` is a first-party Web composition

UXP-03 adds:

```text
apps/web/src/app/anime/page.tsx
```

and the minimum Anime landing composition inside:

```text
apps/web
```

It remains part of the one shared AI World Web application.

Do not introduce:

```text
apps/anime;
a frontend plugin runtime;
a generic page builder;
packages/ui solely for UXP-03;
a second navigation system;
a second Search implementation.
```

## 3.2 Knowledge owns public discovery semantics

The current public Knowledge Resource list intentionally exposes only Resource
identity/lifecycle-safe metadata.

UXP-03 needs content cards with real public identity.

The minimum shared extension is a Knowledge-owned public discovery projection,
conceptually:

```text
GET /knowledge/discovery
  ?universeKey=universe.anime
  &resourceType=anime.character
  &limit=<bounded>
```

The exact route name may remain `knowledge/discovery` unless repository evidence
during UXP-03A proves an existing public route can express the same typed
projection without weakening its current contract.

The projection is generic to published Knowledge. It is not an Anime-owned API.

## 3.3 Media remains Media-owned

A discovery card may include one eligible public preview descriptor derived from
the existing Knowledge Resource Media placements and Media-owned public Asset
boundary.

UXP-03 must not query private Asset metadata or bypass Asset lifecycle filtering.

## 3.4 Search remains Search

The landing provides a strong Search Anime entry but does not create a second
Anime search service.

If the existing `/search` page needs a small URL-initialization enhancement so a
landing link can preselect `universe.anime`, UXP-03 may add that bounded Web-only
behavior while preserving the existing Search API.

---

# 4. Public Discovery Card Contract

The first landing projection should be intentionally small.

Required item shape:

```text
resourceId: string
universeKey: string
resourceType: string
slug: string
displayName: string
summary: string
updatedAt: string
previewMedia: PublicDiscoveryPreview | null
```

`PublicDiscoveryPreview` may expose only fields already safe for public Web
presentation, such as:

```text
assetId
assetType
mimeType
playback
posterAssetId
altText
```

The exact preview shape should reuse the accepted public Media descriptor types
where practical rather than defining a second Media vocabulary.

## 4.1 Publication rule

Discovery items are returned only when:

```text
Resource lifecycle = PUBLISHED;
Entity profile exists and is public;
requested Universe matches;
requested Resource Type matches when supplied;
preview Asset, when present, remains publicly eligible.
```

DRAFT and ARCHIVED Resources must not appear.

Deleted/archived/unavailable Assets must not become landing previews.

## 4.2 Query bounds

The first projection supports:

```text
required universeKey;
optional resourceType;
bounded limit.
```

Do not add arbitrary sorting/filter DSLs.

## 4.3 Ordering

Landing discovery must be deterministic.

Initial ordering is:

```text
updatedAt descending
then resourceId ascending as a stable tie-break
```

This is an editorially neutral recency order.

Do not label it:

```text
trending;
popular;
top;
recommended;
most watched;
fan favorite.
```

unless a later accepted capability supplies real semantics for those claims.

---

# 5. Anime Landing Information Architecture

The initial finished `/anime` page order is:

```text
1. Anime Universe hero / identity
2. primary Explore Characters action
3. Search Anime entry
4. Recently Updated Characters
5. Series discovery when canonical published Series exist
6. Continue exploring through existing AI World discovery paths
```

The page may include a small media-forward visual treatment inside Character or
Series cards.

It does not need a separate global Media feed to be complete.

It does not need an Experience feed merely because the program listed Experiences
as a possible future landing ingredient.

Optional sections do not render fake placeholders when no canonical data exists.

---

# 6. Anime Hero Contract

The Anime landing hero should feel:

```text
energetic;
cinematic;
character-driven;
clearly Anime;
visually connected to the accepted Character page;
usable without media;
readable independent of any background visual.
```

Required content:

```text
Anime Universe identity;
short product promise;
Explore Characters action;
Search Anime action.
```

A hero may use an eligible published Anime preview only when the implementation
can do so without inventing curation semantics.

Otherwise the hero may use the typed Anime presentation and CSS composition
without pretending a specific Resource is featured.

No fake popularity counters, episode counts or ranking badges.

---

# 7. Character Discovery

The primary content rail/grid is:

```text
Recently Updated Characters
```

It is driven by:

```text
universeKey = universe.anime
resourceType = anime.character
```

Character cards should provide:

```text
real display name;
real summary;
eligible preview image/poster when present;
direct canonical link to /anime/characters/[slug].
```

Character cards must degrade coherently when preview Media is absent.

The landing must prove at least two Characters use the same card/component
without named-Character production branches.

---

# 8. Series Discovery Boundary

UXP-03 may show:

```text
Anime Series
```

when real published:

```text
anime.series
```

Resources with public Entity profiles exist.

UXP-03 does not finish the Series page.

Until UXP-04 creates:

```text
/anime/series/[slug]
```

a Series card may link to the existing public generic Knowledge detail:

```text
/knowledge/resources/[resourceId]
```

The UI must not imply that a finished Anime Series destination already exists.

If no canonical published Series exist, the Series section is omitted.

Do not create fake Series fixtures solely to fill the landing in production.

---

# 9. Search Entry

The landing must provide an obvious path to existing Search.

Preferred destination:

```text
/search
```

with Anime preselection when a small URL-initialization enhancement is justified.

Example direction:

```text
/search?universe=universe.anime
```

The exact query key must follow the existing Search Web contract.

UXP-03 does not add:

```text
a second search endpoint;
a client-only fake search index;
Anime-specific indexing;
recommendation ranking.
```

---

# 10. Media Presentation

Landing previews may consume:

```text
IMAGE / STILL;
bounded VIDEO / SHORT_LOOP with poster;
poster fallback.
```

The same accepted constraints remain:

```text
muted ambient short motion;
plays inline;
no audible autoplay;
reduced-motion poster-first;
no long-form player;
no HLS/DASH/transcoding.
```

A landing card does not need to open the full Character Media viewer.

Its primary action is navigation to the canonical content destination.

---

# 11. Canonical URL + Social Metadata

The canonical Anime Universe URL is:

```text
/anime
```

UXP-03 must provide:

```text
title;
description;
canonical URL;
Open Graph title;
Open Graph description;
representative social image only when a stable eligible image is available.
```

Tracking parameters do not change canonical identity.

No campaign parameter is persisted as page state unless an accepted feature uses
it.

---

# 12. Loading / Error / Empty States

The finished landing distinguishes:

```text
loading;
unexpected discovery error;
no published Anime Characters yet;
Characters present but no Series;
cards without preview Media.
```

A temporary Series absence is not a page error.

If Character discovery itself fails, the page must expose an accessible error
rather than silently rendering an empty success state.

---

# 13. Responsive + Accessibility Contract

Engineering target remains:

```text
WCAG 2.2 AA
```

Acceptance includes:

```text
semantic page/section headings;
keyboard navigation;
visible focus;
meaningful link names;
meaningful image alt text;
reduced-motion behavior;
desktop;
tablet;
390px-class mobile;
no horizontal overflow;
touch-friendly cards/actions;
usable content hierarchy at 200% zoom.
```

No essential information may depend on hover or motion.

---

# 14. Authentication / Creator Boundary

The Anime landing is a public discovery page.

UXP-03 does not require a new Creator/admin management surface.

Existing authenticated shell behavior may remain visible where already shared,
but the landing itself does not gain:

```text
featured-content admin;
manual ranking editor;
Anime landing CMS;
new roles;
new permissions;
new publish workflow.
```

If a future real curation requirement needs those capabilities, it must be
justified by a later milestone rather than anticipated in UXP-03.

---

# 15. UXP-03 Implementation Slices

## UXP-03A — Public discovery projection + route foundation

Status:

```text
CLOSED — ACCEPTED
```

Production scope:

```text
generic Knowledge-owned public discovery-card projection;
published-only filtering;
Character/Series Resource Type filtering;
deterministic recency ordering;
eligible preview Media projection;
typed Web API decoder;
new /anime route foundation;
no finished visual landing yet.
```

Proof:

```text
published Character returned;
DRAFT/ARCHIVED Character hidden;
second Character returned through same contract;
resourceType filter;
bounded limit;
deterministic ordering;
preview Media safe;
no preview Media degrades to null;
Devotional query remains generic/reusable.
```

Accepted implementation checkpoint:

```text
a2d0dc9119b93b195bda17f072da23a664a945a5
feat(knowledge): add public discovery projection
```

Accepted remote CI:

```text
GitHub CI run 225
run id 32821766397
completed successfully on a2d0dc9119b93b195bda17f072da23a664a945a5
```

Accepted validation evidence includes:

```text
generic GET /knowledge/discovery;
published-only Resource filtering;
public Entity profile requirement;
optional Resource Type filtering;
bounded query limit;
updatedAt descending + resourceId ascending deterministic ordering;
eligible public preview Media;
unavailable preview skipped;
no eligible preview degrades to null;
Devotional reuse through the same generic projection;
strict Web decoder;
minimal /anime route foundation;
route-to-discovery contract connection without visible UXP-03B UI;
Knowledge unit 4 / 4;
Web decoder unit 2 / 2;
Web unit regression 15 / 15 files and 50 / 50 tests;
32 migrations applied on isolated PostgreSQL 18.4;
focused UXP-03A API integration 2 / 2;
API integration 26 / 26 files and 181 / 181 tests;
focused /anime browser 1 / 1;
full browser E2E 47 / 47;
production build 22 / 22;
architecture validation with 0 violations across 739 modules / 2433 dependencies.
```

UXP-03A is therefore accepted. The `/anime` route remains intentionally
foundation-only at this checkpoint; the finished visible landing shell belongs
to UXP-03B.

## UXP-03B — Finished Anime landing shell + Character discovery

Status:

```text
CLOSED — ACCEPTED
```

Production scope:

```text
Anime hero;
Explore Characters;
Search Anime entry;
Recently Updated Characters;
canonical Character links;
Anime card Media treatment;
loading/error/empty states;
desktop/mobile composition.
```

Proof:

```text
two Character reuse;
with Media;
without Media;
empty Character state;
loading;
error;
390px mobile;
keyboard;
reduced motion.
```

Accepted implementation checkpoint:

```text
80c968b617991c31db9a046ec2c02e240c703fbe
feat(web): finish anime landing character discovery
```

Accepted remote CI:

```text
GitHub CI run 227
run id 32830038924
completed successfully on 80c968b617991c31db9a046ec2c02e240c703fbe
```

Accepted validation evidence includes:

```text
finished Anime hero;
Explore Characters action;
Search Anime entry reusing existing /search;
Recently Updated Characters driven by accepted discovery ordering;
three reusable Character fixtures proving generic cards;
canonical /anime/characters/[slug] links;
IMAGE preview;
SHORT_LOOP preview;
no-Media fallback;
visible loading state;
accessible unexpected-error state with retry recovery;
truthful empty Character state;
390px mobile with no horizontal overflow;
keyboard navigation through hero actions and a Character card;
reduced-motion VIDEO poster fallback;
Web lint;
Web typecheck;
root format / lint / typecheck;
root unit pipeline 37 / 37 tasks;
32 migrations applied on isolated PostgreSQL 18.4;
full integration pipeline 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
focused UXP-03B browser acceptance 6 / 6;
full browser E2E 52 / 52;
production build 22 / 22;
architecture validation with 0 violations across 739 modules / 2436 dependencies.
```

UXP-03B is therefore accepted. The finished visible Character-first landing shell
is now the stable starting point for bounded Series/social identity integration.

## UXP-03C — Series + social identity integration

Status:

```text
CLOSED — ACCEPTED
```

Production scope:

```text
optional published Series discovery;
generic Knowledge-detail Series destination until UXP-04;
canonical /anime metadata;
Open Graph projection;
bounded Search preselection enhancement when required;
final landing information hierarchy.
```

Proof:

```text
Series present;
Series absent;
no fake Series route;
canonical metadata;
campaign-safe canonical identity;
Anime Search entry.
```

Accepted implementation checkpoint:

```text
e454ba3d602b8c05efb3eabde42a0ec2bf8a64ba
feat(web): integrate anime series social identity
```

Accepted remote CI:

```text
GitHub CI run 229
run id 32842592376
completed successfully on e454ba3d602b8c05efb3eabde42a0ec2bf8a64ba
```

Accepted validation evidence includes:

```text
optional published anime.series discovery through the accepted generic Knowledge projection;
Series-present and Series-absent behavior;
two reusable Series fixtures in browser proof;
Series IMAGE preview;
Series no-Media fallback;
generic /knowledge/resources/[resourceId] Series destinations;
zero /anime/series/[slug] production links;
existing /search reuse with native Anime Character and Series filters;
canonical /anime identity;
campaign parameters excluded from canonical identity;
Open Graph title and description;
generated /anime/opengraph-image;
AI_WORLD_WEB_ORIGIN public Web metadata boundary;
validated http(s)-origin-only metadata configuration;
root-layout metadataBase inheritance;
deterministic Playwright Web-origin configuration;
Turbo build hashing for AI_WORLD_WEB_ORIGIN;
production build with no metadataBase localhost fallback warning;
production next-start proof of canonical and og:image on the configured Web origin;
generated Open Graph image returned 200 image/png;
focused UXP-03C metadata unit 2 / 2;
Web unit regression 16 / 16 files and 52 / 52 tests;
root unit pipeline 37 / 37 tasks;
32 migrations applied on isolated PostgreSQL 18.4;
full integration pipeline 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
focused UXP-03B + UXP-03C browser acceptance 10 / 10;
full browser E2E 56 / 56;
production build 22 / 22;
architecture validation with 0 violations across 745 modules / 2446 dependencies.
```

UXP-03C is therefore accepted. The Character-first Anime landing now has truthful
optional Series discovery and stable campaign-safe social identity. The remaining
UXP-03 work is reuse and complete landing acceptance, not a new product capability.

## UXP-03D — Reuse + full landing acceptance

Status:

```text
CLOSED — ACCEPTED
```

Required evidence:

```text
desktop;
tablet;
390px mobile;
two+ Characters;
optional Series present;
Series absent;
image preview;
short-motion preview when canonical;
no Media;
anonymous;
authenticated shared shell;
loading;
empty;
error;
keyboard-only;
reduced motion;
canonical/social entry;
Character navigation;
Search navigation;
Shiva regression;
Hanuman regression;
finished Character regressions;
format;
lint;
typecheck;
focused unit;
migration status/deployment;
integration;
focused browser;
full browser E2E;
production build;
architecture check;
evidence ZIP;
commit/push;
CI green.
```

Accepted acceptance checkpoint:

```text
75d91ef7975e515c10b529c143641bad0d1d6055
test(web): prove full anime landing acceptance
```

Accepted remote CI:

```text
GitHub CI run 231
run id 32861441865
completed successfully on 75d91ef7975e515c10b529c143641bad0d1d6055
```

Accepted validation evidence includes:

```text
test-only UXP-03D acceptance checkpoint with no production behavior change;
1024px tablet composition with no horizontal overflow;
anonymous shared shell;
authenticated shared shell;
canonical landing-to-Character navigation;
three reusable Anime Characters;
Character IMAGE preview;
Character SHORT_LOOP preview;
Character no-Media fallback;
two optional Series with IMAGE and no-Media variants;
zero /anime/series/[slug] links before UXP-04;
desktop and 390px landing regressions retained from accepted UXP-03B;
loading / empty / unexpected-error + retry behavior;
keyboard-only landing navigation;
reduced-motion poster fallback;
Series-present and Series-absent behavior;
existing Anime Search navigation;
campaign-safe canonical / Open Graph identity;
focused Anime landing acceptance 14 / 14;
finished Anime Character regressions 14 / 14;
Shiva / Hanuman regressions 4 / 4;
full browser E2E 60 / 60;
Web unit regression 16 / 16 files and 52 / 52 tests;
root unit pipeline 37 / 37 tasks;
32 migrations applied on isolated PostgreSQL 18.4;
full integration pipeline 29 / 29 tasks;
API integration 26 / 26 files and 181 / 181 tests;
production build 22 / 22;
fresh-process production next-start proof on a dynamically reserved Web origin;
fresh next-start process reported Ready and remained alive during canonical / Open Graph validation;
generated Open Graph image returned 200 image/png with 51,580 bytes;
fresh next-start process tree cleaned up and validation port proven released;
architecture validation with 0 violations across 746 modules / 2447 dependencies;
reviewed evidence ZIP;
commit / push;
exact GitHub CI green.
```

UXP-03D is therefore accepted. The complete Anime landing now satisfies the
applicable reusable Page Definition of Done and the UXP-03 exit rule.

---

# 16. Expected Database Boundary

No schema migration is expected for the initial UXP-03 design.

The landing should query existing:

```text
Knowledge Resources;
Knowledge Entity profiles;
Knowledge Resource Media placements;
Media public-safe Asset state.
```

Do not add:

```text
anime_landing;
featured_content;
trending_score;
recommendation;
homepage_slot;
ranking;
```

tables for UXP-03.

If implementation proves a real query-performance issue, an index may be
considered only with measured evidence and must not change semantic ownership.

---

# 17. Explicit Non-Goals

UXP-03 does not authorize:

```text
finished Anime Series page;
Anime episode platform;
staff/studio expansion;
streaming availability;
ratings/reviews;
fake popularity;
fake trending;
recommendation infrastructure;
personalized rails;
editorial ranking engine;
manual landing curation CMS;

new Creator Studio design;
new roles/permissions;
new lifecycle;
new Knowledge ownership model;
new Media ownership model;
new Search platform;

public Experience feed without an accepted reusable listing requirement;
Devotional landing;
home page redesign;

long-form video;
Range streaming;
HLS;
DASH;
transcoding;

P10-M04 deployment work.
```

---

# 18. Protected Regression Boundaries

UXP-03 must preserve:

```text
finished UXP-02 Character route and composition;
Character canonical URLs;
Character Creator workflow;
Character Media viewer;
Character relationship vocabulary;
public Knowledge publication rules;
Knowledge ownership of Entity semantics;
Media ownership of Asset semantics/delivery;
existing Search API semantics;
typed Universe presentation;
bounded short-motion rules;
reduced-motion poster fallback;
Devotional Shiva/Hanuman behavior;
architecture dependency rules.
```

Any proposed change that breaks these boundaries must stop and be justified by a
real Anime landing requirement.

---

# 19. Exit Rule

UXP-03 closes only when:

```text
/anime exists and is a finished Anime Universe front door;
published Character discovery is real and API-driven;
multiple Characters prove reusable cards without named production branches;
optional Series behavior is truthful;
Search entry is real;
Media previews preserve accepted safety/motion rules;
loading/error/empty states are complete;
responsive/accessibility/social acceptance passes;
Character and Devotional regressions remain green;
the evidence/commit/push/CI chain is accepted.
```

UXP-03 satisfies this exit rule at:

```text
75d91ef7975e515c10b529c143641bad0d1d6055
test(web): prove full anime landing acceptance
GitHub CI run 231 — success
```

UXP-03 is therefore CLOSED — ACCEPTED.

The next page may now become active:

```text
UXP-04 — Anime Series
```

Activation authorizes repository/architecture inspection and detailed UXP-04
contract freeze. It does not itself implement `/anime/series/[slug]`.

---

# 20. Current Starting Position

Accepted predecessor:

```text
UXP-02 — Anime Character
CLOSED — ACCEPTED
closure baseline:
3ddb3fcd4c42e94efaedfb2f444e09b93ab16a4a
test(web): prove full anime character acceptance
```

Accepted UXP-03A checkpoint:

```text
a2d0dc9119b93b195bda17f072da23a664a945a5
feat(knowledge): add public discovery projection
GitHub CI run 225 — success
```

Accepted UXP-03B checkpoint:

```text
80c968b617991c31db9a046ec2c02e240c703fbe
feat(web): finish anime landing character discovery
GitHub CI run 227 — success
```

Accepted UXP-03C checkpoint:

```text
e454ba3d602b8c05efb3eabde42a0ec2bf8a64ba
feat(web): integrate anime series social identity
GitHub CI run 229 — success
```

Accepted UXP-03D checkpoint:

```text
75d91ef7975e515c10b529c143641bad0d1d6055
test(web): prove full anime landing acceptance
GitHub CI run 231 — success
```

UXP-03 is now:

```text
CLOSED — ACCEPTED
```

The next active page is:

```text
UXP-04 — Anime Series
```

The first UXP-04 action is repository/architecture inspection followed by a
detailed Series-page contract freeze. That review must determine the minimum real
Knowledge / Media / relationship / Creator behavior needed by
`/anime/series/[slug]` from current repository evidence before implementation.

Do not treat UXP-04 activation as permission to invent episode infrastructure,
streaming availability, staff/studio models, ranking/recommendation semantics,
editorial curation, a Series CMS, new Anime persistence, new roles/permissions,
or speculative infrastructure. Do not implement `/anime/series/[slug]` inside
this docs-only transition.

The Master Roadmap remains unchanged. WPR-M05 remains the active Product Quality
And Local User Acceptance gate, and P10-M04 remains sequencing-blocked until
that gate closes.
