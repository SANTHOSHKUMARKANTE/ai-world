# AI World UXP-07 — Devotional Universe Landing

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-07 |
| Area | Product / Web / Knowledge / Media / Discovery |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-07A ACTIVE |
| Created | 2026-08-30 |
| Activation Baseline | `ae9bfb8a5d504f71c703c82e835de207a62c9e66` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Predecessor | UXP-06 — Devotional Deity — CLOSED — ACCEPTED |
| Canonical Route | `/devotional` |
| Scope | Add and fully finish the Devotional Universe discovery front door by reusing accepted generic public Knowledge discovery and finished Deity destinations |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Activation Gate

UXP-07 activates only from the remotely accepted UXP-06 closure checkpoint:

```text
ae9bfb8a5d504f71c703c82e835de207a62c9e66
docs(roadmap): close UXP-06
GitHub CI #261
run id 33307155736
completed / success
```

UXP-06 and UXP-06D are closed and accepted before UXP-07 begins.

This activation checkpoint is docs-only.

No `/devotional` production implementation begins until this UXP-07 contract is:

```text
independently reviewed;
manually committed;
pushed to origin/main;
verified at its exact remote SHA;
green in GitHub CI.
```

UXP-08 remains NOT STARTED.

---

# 2. Governing Principle

UXP-07 adds one first-party Web composition:

```text
/devotional
```

It does not create a separate Devotional application, a Devotional discovery
platform, or another Search implementation.

The governing rule is:

> Build the Devotional front door from real published Knowledge by reusing the
> accepted generic discovery projection, public-safe Media preview semantics,
> typed Devotional presentation, finished canonical Deity destinations and the
> shared AI World shell. Add only the minimum Web composition needed to make
> `/devotional` a complete calm discovery destination.

The landing must feel:

```text
calm;
respectful;
spacious;
contemplative;
content-first;
clearly part of AI World.
```

It must not import Anime intensity merely because Anime is the first accepted
Universe landing implementation.

---

# 3. Repository Evidence Reviewed Before Freeze

Inspection was performed against exact remotely-green UXP-06 closure baseline:

```text
ae9bfb8a5d504f71c703c82e835de207a62c9e66
```

Critical inspected locks:

```text
apps/web/src/app/anime/page.tsx
9a0c1c6dfe99e13f804167739baffd75a40a1435

apps/web/src/anime/anime-universe-discovery-foundation.tsx
ac4ffbcd91e7871616af993558c32ca59c5045db

apps/web/src/anime/anime-universe-metadata.ts
6c7f208fa0ad4ffd42f34f9b7d4f162ad7fc723a

apps/web/src/app/anime/opengraph-image.tsx
83dde55a2ea8dfe3c3024d57d5f414ba345328ff

apps/web/src/knowledge/public-knowledge-discovery-api.ts
890f2aaca0330e4b181d160857c980a85a883d08

apps/api/src/knowledge/public-knowledge-discovery.controller.ts
6da0846e30f44b1d54c59d3021e1103c03c3e1c6

packages/platforms/knowledge/src/list-public-knowledge-discovery.ts
6b358e2622338e24d25d86a411e4c8d814753f86

apps/web/src/universes/presentation.ts
f1f85727fc2712b50c31e637f0bbe2934db46842

apps/web/src/app/devotional/[slug]/page.tsx
48ecc362772953bbdd28872c42e9b24cf6144cda

apps/web/e2e/devotional-deity-full-acceptance.spec.ts
f851f5243378f21bf202e286251ee936578cdcbb

apps/web/e2e/anime-universe-foundation.spec.ts
ad71351b9d6ea020c18a03a16b3177f7a71823fb

apps/web/e2e/anime-universe-full-acceptance.spec.ts
e88054e816c69365cf833958f1e8d55b96edf10b

apps/web/e2e/anime-universe-series-social.spec.ts
ebde1ac48fbd57b585a4e9e77851f5a71a6e7ffa

docs/13-roadmaps/uxp-03-anime-universe-landing.md
d7b57d352e246431e675059a791bf81e9ba2f5bc
```

---

# 4. Current Repository Facts

## 4.1 `/devotional` is genuinely absent

At activation baseline:

```text
apps/web/src/app/devotional/
  [slug]/
```

exists, but:

```text
apps/web/src/app/devotional/page.tsx
```

does not exist.

UXP-06D explicitly accepted the `/devotional` 404 boundary before UXP-07.

Therefore UXP-07 owns creation of the Universe landing route.

## 4.2 The finished Deity destination already exists

UXP-06 accepted:

```text
/devotional/[slug]
```

as the strict canonical destination for:

```text
universeKey = universe.devotional
resourceType = devotional.deity
```

The landing must link published Deity cards directly to:

```text
/devotional/[slug]
```

It must not route finished Deities through generic Resource-ID detail pages.

## 4.3 Public Knowledge discovery is already generic

The accepted Web discovery client already accepts:

```text
universeKey;
optional resourceType;
optional bounded limit.
```

The generic Knowledge platform already enforces:

```text
published Resources only;
matching Universe;
optional exact Resource Type;
bounded limit;
public Entity profile;
public-safe preview Media;
deterministic repository ordering.
```

The initial accepted discovery work in UXP-03 explicitly proved Devotional reuse.

Therefore UXP-07 does not add a new discovery endpoint, repository or database.

## 4.4 Discovery cards already have sufficient public data

The accepted public discovery item already provides:

```text
resourceId;
universeKey;
resourceType;
slug;
displayName;
summary;
updatedAt;
previewMedia.
```

Preview Media is already bounded to public-safe:

```text
IMAGE / STILL;
VIDEO / SHORT_LOOP with poster;
or null.
```

That is sufficient for the first Devotional landing.

## 4.5 Devotional presentation already exists

Typed Web Universe presentation already provides Devotional:

```text
label: Devotional;
tone: devotional;
motion: calm;
description: Explore published devotional Knowledge through the same shared AI World experience.
```

Existing Web styles already know the Devotional tone.

UXP-07 does not add a generic theme engine.

## 4.6 Anime landing is an implementation precedent, not a component mandate

The finished Anime landing already proves:

```text
Universe hero;
generic Knowledge discovery;
IMAGE preview;
SHORT_LOOP preview;
no-Media fallback;
loading;
error/retry;
empty state;
anonymous/authenticated shared shell;
canonical child navigation;
responsive/reduced-motion acceptance;
canonical/social metadata.
```

UXP-07 should reuse the architecture and interaction contracts where useful.

It does not need to force the existing Anime-specific component into a generic
abstraction merely for theoretical reuse.

Extract shared Web helpers only when the Devotional implementation demonstrates
a real second-consumer need and the extraction is smaller/cleaner than
duplication.

---

# 5. Frozen Ownership Model

Knowledge owns:

```text
published Resource identity;
Universe;
Resource Type;
Entity profile;
slug;
summary;
public discovery projection;
publication filtering;
deterministic discovery ordering.
```

Media owns:

```text
Asset identity;
Asset lifecycle;
technical metadata;
content/thumbnail delivery.
```

Knowledge owns the contextual public preview through the already accepted
Resource Media placement projection.

Web owns:

```text
/devotional route;
Devotional landing composition;
hero and information hierarchy;
Deity discovery presentation;
canonical child links;
loading/error/empty presentation;
responsive/accessibility behavior;
landing canonical/social metadata;
presentation-owned Universe Open Graph image.
```

Search remains Search.

No ownership is duplicated for UXP-07.

---

# 6. Explicit Non-Goals / Protected Architecture

UXP-07 must not introduce:

```text
Devotional database/table;
Devotional service/repository;
Devotional-specific discovery API;
Devotional-specific Media platform;
Devotional-specific Engagement backend;
new Search/index architecture;
UXP-08 Search expansion;
recommendation/ranking engine;
trending/popularity model;
manual featured-content model;
Devotional landing CMS;
landing-specific Creator/Admin manager;
new roles or permissions;
new generic page builder;
new generic theme engine;
new relationship database;
AUDIO direct Knowledge placement;
new audio-rights platform;
generic transcoding/probing;
HLS/DASH;
Creator Studio rewrite;
ritual/reminder/puja workflow platform;
temple booking/donation platform;
astrology/horoscope platform;
AI-generated devotional content treated as canonical without accepted review;
speculative recommendation or policy infrastructure.
```

The Master Roadmap remains unchanged throughout UXP-07.

---

# 7. Canonical Landing Identity

Canonical route:

```text
/devotional
```

Campaign query parameters may decorate an entry URL, but must not alter canonical
identity.

Required metadata:

```text
title: Devotional;
description: typed Devotional Universe description;
canonical: /devotional;
Open Graph type: website;
Open Graph siteName: AI World;
Open Graph title: Devotional · AI World;
Open Graph description: typed Devotional Universe description.
```

## 7.1 Universe social image

The landing should have a stable presentation-owned Open Graph image analogous
to the accepted Anime Universe social image.

It must:

```text
represent the Devotional Universe rather than a specific Deity;
use the calm Devotional visual language;
remain meaningful without external Asset data;
avoid treating the most recently updated Deity as editorially "featured";
avoid fabricating popularity or recommendation semantics.
```

A bounded route-local Next `opengraph-image.tsx` is acceptable.

Do not use an arbitrary discovery item as the Universe social identity.

---

# 8. Devotional Landing Information Architecture

Initial page order:

```text
1. AI World / Devotional Universe identity
2. calm Devotional hero
3. short product promise / typed Universe description
4. Explore Deities primary action
5. existing Search entry
6. Recently Updated Deities
7. Continue exploring through accepted Knowledge discovery
```

No additional rail exists merely because more Devotional Resource Types may
eventually exist.

In particular, do not add fake first-party landing destinations for:

```text
Stories;
Temples / Sacred Places;
Quotes;
Meditation themes;
Experiences;
Festivals;
Mantras.
```

Those may appear later only when real canonical destination semantics justify
them.

---

# 9. Deity Discovery Contract

Initial discovery query:

```text
universeKey = universe.devotional
resourceType = devotional.deity
limit = 6
```

The initial visible section is named truthfully:

```text
Recently Updated Deities
```

because accepted discovery ordering is recency-based.

Do not label the same data:

```text
Popular Deities;
Trending;
Recommended;
Top Deities;
Most Viewed;
Featured.
```

unless a later accepted capability supplies those semantics.

## 9.1 Deity card contract

Each card uses real public discovery data:

```text
displayName;
summary;
eligible preview when present;
canonical /devotional/[slug] link.
```

Cards must support:

```text
IMAGE / STILL;
bounded VIDEO / SHORT_LOOP + poster;
no preview Media.
```

No Deity-name-specific production branches.

Shiva, Hanuman and future Deities must use the same implementation.

---

# 10. Search Boundary

The landing must expose an obvious route to the existing:

```text
/search
```

UXP-07 does not modify Search behavior merely to prefilter Devotional.

A plain `/search` link is sufficient for UXP-07A.

If a future implementation proposes a Universe-prefilled Search URL, that is
allowed only when the current accepted Search Web contract already supports it
without changing Search semantics.

Otherwise it belongs to UXP-08.

No second search endpoint or client-side fake index.

---

# 11. Media Presentation

Landing preview behavior reuses accepted discovery Media semantics.

IMAGE:

```text
render public thumbnail;
meaningful alt text;
card remains useful when image loading fails.
```

SHORT_LOOP:

```text
poster-backed;
muted;
inline;
non-essential;
bounded by accepted discovery semantics;
no audible autoplay;
poster-first with prefers-reduced-motion.
```

No Media:

```text
render a calm, truthful card fallback;
do not invent imagery.
```

The landing does not need the full Deity Media viewer.

Its primary card action is navigation to the finished Deity destination.

AUDIO is not direct Deity Knowledge landing Media.

---

# 12. Loading / Error / Empty States

The finished landing distinguishes:

```text
loading;
unexpected discovery error;
retry recovery;
no published Deities yet;
Deity card without preview Media.
```

An empty Deity result is not a system error.

Error state must be accessible.

Do not silently convert a discovery failure into an empty-success state.

---

# 13. Authentication / Creator Boundary

`/devotional` is a public discovery page.

Applicable roles:

```text
anonymous visitor;
authenticated user through shared shell.
```

UXP-07 does not require:

```text
new Creator manager;
landing CMS;
featured-content editor;
manual ordering editor;
new Admin mode;
new role;
new permission.
```

The existing Creator Deity manager from UXP-06 remains the authoring surface for
canonical Deity data.

Hiding a UI control is not authorization.

---

# 14. Responsive + Accessibility Contract

Engineering target remains:

```text
WCAG 2.2 AA
```

Acceptance includes:

```text
semantic main/section headings;
keyboard navigation;
visible focus;
meaningful link names;
meaningful preview alt text;
reduced-motion behavior;
1440px desktop;
834px tablet;
390px-class mobile;
no horizontal overflow;
touch-friendly cards/actions;
usable hierarchy at 200% zoom;
no essential information dependent on hover or motion.
```

Devotional motion must remain calmer than Anime.

---

# 15. Canonical Navigation Contract

Primary landing child navigation is:

```text
/devotional
    -> /devotional/[published-deity-slug]
```

Only real published `devotional.deity` discovery items receive that direct
canonical route.

Continue-exploring destinations may use already accepted routes:

```text
/knowledge
/search
```

UXP-07 does not invent canonical routes for other Devotional Resource Types.

---

# 16. Implementation Slices

UXP-07 uses only two slices because the generic discovery platform already
exists.

## UXP-07A — Devotional landing shell + Deity discovery + social identity

Status:

```text
ACTIVE — NEXT IMPLEMENTATION SLICE
```

Production scope:

```text
add apps/web/src/app/devotional/page.tsx;
add the minimum Devotional landing composition in apps/web;
reuse listPublicKnowledgeDiscovery;
query universe.devotional + devotional.deity + limit 6;
Devotional hero and primary Explore Deities action;
existing /search entry;
Recently Updated Deities grid;
canonical /devotional/[slug] card links;
IMAGE / SHORT_LOOP / no-Media card states;
loading / error+retry / empty;
canonical /devotional metadata;
stable presentation-owned Devotional Open Graph image;
responsive + keyboard + reduced-motion baseline.
```

Expected backend/schema scope:

```text
none.
```

Production changes to Knowledge/API/Media are permitted only if implementation
evidence proves a real defect in the already accepted generic contract.

Proof:

```text
route exists;
typed Devotional presentation;
two or more Deities reuse one card path;
published Deity discovery uses generic endpoint;
IMAGE card;
SHORT_LOOP card;
no-Media card;
loading;
error + retry;
empty Deity state;
canonical child links;
plain Search entry;
canonical metadata;
presentation-owned OG image;
campaign-safe canonical identity;
390px no overflow;
keyboard;
reduced motion;
no UXP-08 Search expansion;
no backend/schema/migration.
```

## UXP-07B — Reuse + full Devotional landing acceptance

Status:

```text
NOT STARTED — GATED ON UXP-07A ACCEPTANCE
```

UXP-07B is acceptance-first.

No new production feature is planned.

Production changes are allowed only when the frozen acceptance matrix exposes a
real defect, and then only the minimum correction may be made before rerunning
acceptance.

---

# 17. Frozen UXP-07B Acceptance Matrix

## Responsive / reuse

```text
1440px desktop;
834px tablet;
390px-class mobile;
multiple Deities;
IMAGE;
SHORT_LOOP;
no Media;
no name-specific production branch;
no horizontal overflow;
200% zoom hierarchy.
```

## Discovery semantics

```text
universe.devotional query;
devotional.deity filter;
bounded limit;
published-only contract retained;
deterministic order retained;
DRAFT hidden through focused API regression;
ARCHIVED hidden through focused API regression;
canonical Deity links;
no "popular/trending/recommended" false semantics.
```

## States

```text
loading;
unexpected error;
retry recovery;
empty;
populated;
card Media load fallback where applicable.
```

## Roles / shell

```text
anonymous shared shell;
authenticated shared shell;
no fake Creator/Admin landing controls.
```

## Media / accessibility

```text
IMAGE preview;
SHORT_LOOP poster/motion;
no-Media fallback;
reduced motion;
no audible autoplay;
semantic headings;
keyboard;
visible focus;
meaningful links;
alt text.
```

## Canonical / social

```text
canonical /devotional;
campaign entry does not alter canonical;
title;
description;
Open Graph title/description;
stable presentation-owned Universe social image;
social image does not depend on arbitrary Deity selection.
```

## Navigation / regressions

```text
landing -> finished Deity;
Knowledge continuation;
Search entry without UXP-08 expansion;
finished Deity regression;
Anime landing regression;
Anime Character / Series regression;
Public Experience regression;
shared shell regression.
```

## Engineering

```text
format;
lint;
typecheck;
unit;
canonical migrations/status;
focused Knowledge discovery API integration;
full integration;
focused browser;
full Web E2E;
production build;
fresh-process production canonical/social proof;
architecture:check;
reviewed evidence ZIP;
manual commit/push;
exact remote CI success.
```

---

# 18. Definition of Done

UXP-07 is complete only when:

```text
/devotional exists and is a finished public Universe landing;
real published Deities drive discovery;
cards navigate to canonical finished Deity pages;
Devotional tone is calm and distinct;
loading/error/empty are truthful;
Media preview behavior is bounded and accessible;
canonical/social identity is stable;
responsive/accessibility matrix passes;
no UXP-08 Search expansion leaked in;
no speculative backend was added;
UXP-07A is accepted;
UXP-07B full acceptance is accepted;
the exact final checkpoint is pushed and CI green;
closure is recorded separately.
```

---

# 19. Current Position

After this docs-only activation checkpoint is independently reviewed, manually
committed/pushed and exact remote CI is green:

```text
UXP-06 — CLOSED — ACCEPTED
UXP-07 — ACTIVE
UXP-07A — ACTIVE — NEXT IMPLEMENTATION SLICE
UXP-07B — NOT STARTED — GATED ON UXP-07A ACCEPTANCE
UXP-08 — NOT STARTED
WPR-M05 — ACTIVE
P10-M04 — SEQUENCING-BLOCKED
Master Roadmap — UNCHANGED
```

This activation does not implement `/devotional`.

---

# 20. Next Action

After the activation checkpoint is remotely green, implement only:

```text
UXP-07A — Devotional landing shell + Deity discovery + social identity
```

Start from the exact activation SHA.

Expected architecture:

```text
apps/web route/composition
        |
        v
existing typed Devotional presentation
        |
        v
existing Web public Knowledge discovery client
        |
        v
existing generic Knowledge discovery API/platform
        |
        v
published devotional.deity cards
        |
        v
/devotional/[slug]
```

Do not pre-build UXP-07B production work.

Do not begin UXP-08.
