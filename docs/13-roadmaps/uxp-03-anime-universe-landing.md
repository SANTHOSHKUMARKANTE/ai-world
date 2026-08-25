# AI World UXP-03 — Anime Universe Landing

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-03 |
| Area | Product / Web / Knowledge / Media / Discovery |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-03A ACTIVE |
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

Current repository facts are:

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
ACTIVE — NEXT IMPLEMENTATION SLICE
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

## UXP-03B — Finished Anime landing shell + Character discovery

Status:

```text
NOT STARTED
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

## UXP-03C — Series + social identity integration

Status:

```text
NOT STARTED
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

## UXP-03D — Reuse + full landing acceptance

Status:

```text
NOT STARTED
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

UXP-03 is not complete after a visual screenshot alone.

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

Only then may work begin on:

```text
UXP-04 — Anime Series
```

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

The active implementation slice is:

```text
UXP-03A — Public discovery projection + route foundation
```

The first engineering objective is to add the smallest generic published
discovery-card projection required by `/anime`, prove its publication/media
boundaries, and add only the route foundation that consumes that real contract.

Do not begin the finished visual landing until UXP-03A's data contract is proven.

The Master Roadmap remains unchanged. WPR-M05 remains the active Product Quality
And Local User Acceptance gate, and P10-M04 remains sequencing-blocked until
that gate closes.
