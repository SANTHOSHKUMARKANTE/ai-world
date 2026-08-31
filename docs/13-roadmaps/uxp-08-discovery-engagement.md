# AI World UXP-08 — Discovery + Engagement

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-08 |
| Area | Product / Web / Knowledge / Discovery / Engagement |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-08B ACTIVE |
| Created | 2026-08-31 |
| Activation Baseline | `2c5a9a1bfd4f2813c961ff9a95e463d85f6ed665` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Predecessor | UXP-07 — Devotional Universe landing — CLOSED — ACCEPTED |
| Routes | `/knowledge`, `/knowledge/resources/[id]`, `/search`, `/saved` |
| Scope | Finish existing Discovery + Engagement pages one route at a time by reusing accepted Knowledge, Discovery, Engagement, Identity and typed Universe capabilities |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Activation Gate

UXP-08 activates only from the remotely accepted UXP-07 closure checkpoint:

```text
2c5a9a1bfd4f2813c961ff9a95e463d85f6ed665
docs(roadmap): close UXP-07
GitHub CI #266
run id 33357837339
completed / success
```

Its direct parent is the remotely accepted UXP-07B acceptance checkpoint:

```text
9959c9ea4490ad71e91f04760d123fad65ea5b3d
test(web): prove full devotional landing acceptance
```

UXP-07, UXP-07A and UXP-07B are closed and accepted before UXP-08 begins.

This activation checkpoint is docs-only.

No UXP-08 product implementation begins until this activation contract is:

```text
independently reviewed;
manually committed;
pushed to origin/main;
verified at its exact remote SHA;
green in GitHub CI.
```

UXP-09 remains NOT STARTED.

WPR-M05 remains ACTIVE.

P10-M04 remains SEQUENCING-BLOCKED.

The Master Roadmap remains unchanged.

---

# 2. Governing Principle

UXP-08 finishes four already-existing first-party routes:

```text
/knowledge
/knowledge/resources/[id]
/search
/saved
```

It does not create a parallel Discovery application, another Knowledge platform,
another Engagement platform, or a replacement Search engine.

The governing rule is:

> Finish the existing Discovery + Engagement journeys by composing accepted
> public Knowledge identity, typed Universe presentation, canonical destinations,
> existing Search behavior and authenticated Engagement state. Add only the
> minimum projection or mutation capability that a real finished page proves it
> needs.

The architectural preference order is:

```text
reuse existing public projection
        ↓
compose existing capabilities in Web/application layer
        ↓
add a bounded field/projection to an existing API only when required
        ↓
add a new platform capability only when a concrete user lifecycle cannot be
completed with the accepted platform
```

Do not jump from a presentation gap to a new database, index, ranking system,
recommendation engine or cross-platform dependency.

---

# 3. Repository Evidence Reviewed Before Freeze

Inspection was performed against exact remotely-green UXP-07 closure baseline:

```text
2c5a9a1bfd4f2813c961ff9a95e463d85f6ed665
```

## 3.1 Governing/current-state locks

```text
docs/13-roadmaps/uxp-07-devotional-universe-landing.md
0b8c88747f9fcb4a0383afe0059a0b6ff6e214a8

docs/13-roadmaps/web-ui-completion-program.md
7f5fb48d2fb5043fa4e77dbbbc0ed4553226e120

docs/13-roadmaps/master-roadmap.md
fbb0921273ce5527b8110bcef774b298b0ca54e8

.github/workflows/ci.yml
35ac7157dd2255dc263bff403b601be522116c53
```

## 3.2 Knowledge browse locks

```text
apps/web/src/app/knowledge/page.tsx
91ee49aa65a3631044dd17091c6e2c6b0c86e271

apps/web/src/knowledge/knowledge-universe-section.tsx
825ca20bdec2e799dfa80feecde92ec2448e4424

apps/web/src/knowledge/public-knowledge-api.ts
fc2d53a982ccf073c67c434aa0e4b74403111936

apps/web/src/knowledge/public-knowledge-discovery-api.ts
890f2aaca0330e4b181d160857c980a85a883d08
```

## 3.3 Generic Knowledge detail locks

```text
apps/web/src/app/knowledge/resources/[id]/page.tsx
0927b193331386137ecb33f43c94fcf7755f8c52

apps/web/src/knowledge/public-knowledge-resource-detail.tsx
bf82eedeaa7ebe605c1bac29e17215a13afed0c0
```

## 3.4 Search locks

```text
apps/web/src/app/search/page.tsx
f5035400ddd3ed6df1b228b5b630c62f9028c18b

apps/web/src/discovery/search-experience.tsx
35f2079507bf63bfbb5049fcc5bdff42be772dd2

apps/web/src/discovery/public-discovery-api.ts
a090ef1ceb01fb15a3da6a226432b491191ec56b

apps/api/src/discovery/public-discovery-search.controller.ts
db2fd685bac4d8b68ea4221a28b70e3a957554f5
```

## 3.5 Saved / Engagement locks

```text
apps/web/src/app/saved/page.tsx
e87b70100a8e1c8ebdbb10fbc27c658b94372f55

apps/web/src/engagement/saved-experience.tsx
60564993c61b6214d9bc04400df948a21f2e9d00

apps/web/src/engagement/engagement-api.ts
a1c23fdbacebb37ff15a9feaed27b8e60f95f0eb

apps/api/src/engagement/collections.controller.ts
c80accea19c0ab8f5d0c94e848611b153b3ca1db

apps/api/src/engagement/favorites.controller.ts
d2efafec62b57fc2347c2df4d18bd533b24ef795
```

## 3.6 Shared typed Universe presentation

```text
apps/web/src/universes/presentation.ts
f1f85727fc2712b50c31e637f0bbe2934db46842
```

These locks prove that UXP-08 starts from real first-party routes and accepted
platform capabilities, not placeholders requiring a fresh architecture.

---

# 4. Current Repository Facts

## 4.1 All four UXP-08 routes already physically exist

At activation baseline:

```text
apps/web/src/app/knowledge/page.tsx
apps/web/src/app/knowledge/resources/[id]/page.tsx
apps/web/src/app/search/page.tsx
apps/web/src/app/saved/page.tsx
```

all exist.

Therefore UXP-08 is a page-completion program.

No new top-level route is required merely to activate UXP-08.

## 4.2 Knowledge browse has real data but unfinished identity presentation

`/knowledge` already:

```text
renders Devotional and Anime sections;
uses typed Web Universe presentation;
calls the public Knowledge API;
has loading/error/empty behavior;
can render public imagery;
links to generic Knowledge detail.
```

Its current cards still foreground:

```text
raw Resource Type;
raw Resource ID;
generic /knowledge/resources/[id] destination.
```

The existing public Knowledge discovery projection already provides richer,
public-safe card identity:

```text
resourceId;
universeKey;
resourceType;
slug;
displayName;
summary;
updatedAt;
optional IMAGE / SHORT_LOOP preview Media.
```

Therefore UXP-08A should first attempt to finish `/knowledge` by reusing the
already accepted `listPublicKnowledgeDiscovery` projection.

No new Knowledge backend is planned for UXP-08A.

## 4.3 Generic Knowledge detail already composes Engagement

`/knowledge/resources/[id]` already:

```text
loads a public published Resource;
shows Universe-aware presentation;
shows Resource type / dates;
shows published imagery;
includes Resource Engagement controls;
links back to Knowledge and Search.
```

But its user-facing identity is still primarily:

```text
friendly Resource Type;
raw Resource Type;
raw Resource ID.
```

It is not yet aligned with the finished shared shell, canonical/social identity,
or profile depth of specialized Character, Series and Deity destinations.

UXP-08B therefore finishes the generic fallback page rather than replacing the
specialized canonical pages.

## 4.4 Search already exists but its public result projection is intentionally thin

The existing public Search API/Web contract currently returns only:

```text
resourceId;
resourceType;
optional universeKey;
pagination offset/limit.
```

The current Search Web experience:

```text
accepts a query;
supports Universe scope;
supports Resource Type filters;
has idle/loading/error/empty/result states;
uses typed Universe labels;
shows raw Resource Type + Resource ID;
links every result to generic /knowledge/resources/[id].
```

This is enough to prove cross-Universe Search infrastructure exists.

It is not enough for a finished content-first Search result when display identity,
summary and canonical typed routing are required.

UXP-08C may therefore add the minimum public-safe Search result enrichment needed
for finished display and routing.

That does NOT authorize:

```text
a new Search endpoint family;
a new Search index;
a new database/search table;
vector search;
embeddings;
semantic ranking;
recommendations;
popularity;
trending;
editorial ranking;
query analytics infrastructure.
```

The existing search semantics/ranking remain authoritative unless a real defect is
proven.

## 4.5 Saved / Favorites / Collections already have real server-backed behavior

`/saved` already has:

```text
anonymous sign-in state;
session-aware loading/error states;
Favorite listing/removal;
Collection listing;
Collection creation;
Collection Resource listing;
Collection Resource removal;
empty states;
links back to Knowledge.
```

The Web API uses the existing authenticated Engagement endpoints.

Current saved entries still expose:

```text
raw Resource IDs;
generic /knowledge/resources/[id] links.
```

UXP-08D must compose saved Engagement identity with public Knowledge identity in
the application/Web layer.

Do not introduce an Engagement -> Knowledge platform dependency.

## 4.6 Current Collection capability is deliberately bounded

The accepted Collection API currently supports:

```text
create Collection;
list Collections;
add Resource;
list Resources;
remove Resource.
```

It does not currently expose Collection rename/delete.

UXP-08D may add only the minimum missing Collection lifecycle action proven
necessary for a finished user-created library.

At freeze time:

```text
Collection delete is eligible because a user-created Collection otherwise cannot
be removed.

Collection rename is not pre-authorized; add it only if UXP-08D implementation or
acceptance proves a concrete lifecycle defect that delete + create cannot address.
```

No schema migration is expected merely to add a delete operation over existing
Collection ownership.

---

# 5. Shared Discovery Identity Rule

UXP-08 must stop treating internal Resource IDs and raw Resource Type keys as the
primary user-facing identity.

Internal identifiers remain valid technical data.

They are not the product title.

The preferred public result/card shape is:

```text
typed Universe label;
display name;
friendly Resource Type label;
summary where available;
optional eligible public preview Media;
updated context where useful;
canonical destination.
```

Raw IDs may remain available only as secondary/debug-like detail where a real
user need exists.

---

# 6. Canonical Destination Rule

UXP-08 must preserve the canonical destinations already accepted by earlier page
milestones.

When a public result has enough accepted typed identity to derive an existing
canonical route, navigation should use that route.

Examples include:

```text
universe.anime + anime.character + slug
    -> /anime/characters/[slug]

universe.anime + anime.series + slug
    -> /anime/series/[slug]

universe.devotional + devotional.deity + slug
    -> /devotional/[slug]
```

A finished Public Experience destination may be used only when the existing public
projection contains the exact identifier required by the accepted Experience
route.

Do not guess.

For Resource Types without a finished specialized canonical route:

```text
/knowledge/resources/[resourceId]
```

remains the safe generic fallback.

UXP-08A may create/extract one small Web-owned destination resolver because
Knowledge browse is the first real consumer and Search/Saved are later real
consumers.

The resolver must:

```text
encode accepted route knowledge only;
never fabricate a route;
preserve generic fallback;
remain Web/application composition;
not create a new routing platform.
```

---

# 7. Shared Shell / Accessibility / Responsive Rule

All four finished routes must use the accepted AI World shared shell and account
navigation where appropriate.

Acceptance must include applicable:

```text
anonymous state;
authenticated state;
loading;
error;
empty;
not-found where applicable;
1440px desktop;
834px tablet;
390px-class mobile;
200% zoom/effective-width hierarchy;
no horizontal overflow;
semantic headings;
keyboard navigation;
visible focus;
reduced motion where motion exists;
meaningful links;
alt text for meaningful imagery;
status/error semantics.
```

No page is accepted because only the happy-path desktop screenshot looks good.

---

# 8. Canonical / Metadata Rule

Public Discovery pages:

```text
/knowledge
/search
/knowledge/resources/[id]
```

must have stable route-appropriate metadata and campaign-safe canonical identity.

For the generic Knowledge detail route, specialized canonical destinations take
precedence when a Resource already has an accepted typed destination.

`/saved` is account-specific.

It must not leak per-user Favorites/Collections into public social metadata.

UXP-08D should use account/private-appropriate metadata and prevent private
library content from becoming a public indexing/social surface.

---

# 9. UXP-08A — Finished Knowledge Browse

Status:

```text
CLOSED — ACCEPTED — 0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
```

Accepted UXP-08A implementation checkpoint:

```text
0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
feat(web): finish knowledge browse
GitHub CI #268
run id 33364121387
completed / success
```

Reviewed UXP-08A evidence includes:

```text
exactly 9 Web/test files;
1519 insertions / 603 deletions;
0 API/platform/schema/migration/dependency changes;
typed Devotional + Anime Knowledge browse;
real display identity;
IMAGE / bounded SHORT_LOOP / no-Media;
typed canonical destinations + generic fallback;
loading / error / retry / empty;
anonymous + authenticated shared shell;
1440 / 834 / 390 / effective-200%-zoom;
campaign-safe /knowledge metadata;
lint 21 / 21;
typecheck 41 / 41;
focused Knowledge units 2 files / 8 tests;
root unit 37 / 37 tasks;
Web unit 22 files / 73 tests;
32 migrations / schema up to date;
focused API 2 files / 5 tests;
integration 29 / 29 tasks;
full API 27 files / 188 tests;
focused browser 38 / 38;
full Web E2E 136 / 136;
build 22 / 22;
fresh production proof;
architecture 0 violations / 794 modules / 2570 dependencies;
exact reviewed candidate blobs;
GitHub CI #268 green.
```

Accepted UXP-08A implementation checkpoint:

```text
0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
feat(web): finish knowledge browse
GitHub CI #268
run id 33364121387
completed / success
```

UXP-08A is therefore:

```text
CLOSED — ACCEPTED — 0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
```

Reviewed implementation and acceptance evidence:

```text
exactly 9 Web/test files;
1519 insertions / 603 deletions;
5 production files + 4 test files;
0 API changes;
0 Knowledge-platform changes;
0 schema changes;
0 migration changes;
0 dependency changes;
0 roadmap changes in the implementation checkpoint;

Knowledge browse:
existing /knowledge route retained;
typed Devotional + Anime presentation;
existing listPublicKnowledgeDiscovery reused;
Universe query + bounded limit 8;
real displayName identity;
friendly Resource Type vocabulary;
summary + updated context;
IMAGE;
bounded muted SHORT_LOOP;
no-Media fallback;
reduced-motion poster behavior;
known Anime Character / Anime Series / Devotional Deity canonical destinations;
generic /knowledge/resources/[resourceId] fallback;
loading;
unexpected error;
local retry;
per-Universe empty;
independent Universe failure isolation;
anonymous shared shell;
authenticated shared shell;
Search continuation;
stable /knowledge metadata;
campaign-safe canonical;
stable /knowledge/opengraph-image;

responsive/accessibility:
1440 desktop;
834 tablet;
390 mobile;
effective-200%-zoom / 720 CSS-pixel hierarchy;
no horizontal overflow;
semantic headings;
keyboard;
visible focus;
meaningful links;
alt text;
reduced motion;
manual review of all four captured screenshots;

engineering:
root lint 21 / 21;
root typecheck 41 / 41;
focused Knowledge units 2 files / 8 tests;
canonical root unit pipeline 37 / 37 tasks;
Web unit suite 22 files / 73 tests;
32 canonical migrations / schema up to date;
focused public Knowledge discovery API 2 files / 5 tests;
full integration 29 / 29 tasks;
full API integration 27 files / 188 tests;
focused browser + finished-page regressions 38 / 38;
full Web E2E 136 / 136;
production build 22 / 22;
fresh-process /knowledge production proof;
architecture validation 0 violations across 794 modules / 2570 dependencies;
reviewed Resume 1 full-validation evidence;
reviewed Resume 2 exact staged-identity evidence;
expected = evidence = worktree = staged for all 9 blobs;
0 unstaged / 0 untracked;
manual commit/push;
exact GitHub CI #268 success on the accepted SHA.
```

Final accepted UXP-08A blobs:

```text
apps/web/src/app/knowledge/page.tsx
36eb51e78c9fc3d3057464feab62c44327bbef33

apps/web/src/app/knowledge/opengraph-image.tsx
eeb5ee4fc3c6b9dfaf8977b9f5f8240acfa4dfb1

apps/web/src/knowledge/knowledge-universe-section.tsx
3ee0f5358cd6bbed7e76d44a9749f78d212b387e

apps/web/src/knowledge/public-knowledge-destination.ts
0ac054d60869451c43c26d8122a7ed75d14d894c

apps/web/src/app/globals.css
da402c81d6e2ec613206126401e10630c272045c

apps/web/e2e/knowledge.spec.ts
cd97ca7110c0a5be18d48c4b2b92e11d001fadd5

apps/web/e2e/knowledge-browse-full-acceptance.spec.ts
d00a6e4fea0bf9913eaf8edfbac0bc35b79daaf4

apps/web/test/knowledge-browse-foundation.spec.ts
b84f4298450f3a14c26a8d5760740ee8d28e474a

apps/web/test/knowledge-experience.spec.tsx
f757377f807e77da8c3e06105d0a4f59e9f3df48
```


Canonical route:

```text
/knowledge
```

## Objective

Finish the existing Knowledge browse front door without adding a Knowledge
backend.

## Frozen minimum production scope

```text
reuse existing /knowledge route;
use accepted ApplicationShell + account navigation;
retain typed Devotional + Anime presentation;
prefer existing profile-rich listPublicKnowledgeDiscovery projection;
replace raw-ID-first cards with real display identity;
friendly Resource Type vocabulary;
summary where available;
optional public-safe IMAGE / SHORT_LOOP / no-Media preview;
truthful deterministic/recent ordering language;
bounded initial result set;
canonical typed destination resolver + generic fallback;
loading;
unexpected error;
retry where a failed load can be retried locally;
empty per-Universe state;
Search continuation;
stable /knowledge metadata/canonical identity;
responsive + keyboard + focus + reduced-motion behavior;
no backend/schema/migration expected.
```

UXP-08A must not:

```text
add Search features;
add Saved/Collection features;
add a Knowledge database/repository;
add editorial featured/trending/popular semantics;
add recommendation/ranking;
add a CMS;
add a generic theme/page builder.
```

## UXP-08A proof matrix

```text
Devotional + Anime sections;
multiple Resource Types;
real display names;
no raw Resource ID as primary card title;
IMAGE;
SHORT_LOOP where eligible;
no Media;
known typed canonical destination;
unknown/non-specialized generic fallback;
loading;
error;
retry;
empty;
anonymous shared shell;
authenticated shared shell;
1440 / 834 / 390 / effective-200%-zoom;
keyboard;
visible focus;
reduced motion;
canonical /knowledge;
campaign-safe metadata;
Search continuation;
Anime / Devotional landing + Entity regressions.
```

---

# 10. UXP-08B — Finished Generic Knowledge Detail

Status:

```text
ACTIVE — NEXT IMPLEMENTATION SLICE
```

UXP-08B activation baseline:

```text
0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
feat(web): finish knowledge browse
GitHub CI #268 / run 33364121387
completed / success
```

Exact Generic Knowledge Detail starting surfaces:

```text
apps/web/src/app/knowledge/resources/[id]/page.tsx
0927b193331386137ecb33f43c94fcf7755f8c52

apps/web/src/knowledge/public-knowledge-resource-detail.tsx
bf82eedeaa7ebe605c1bac29e17215a13afed0c0

apps/web/src/knowledge/public-knowledge-api.ts
fc2d53a982ccf073c67c434aa0e4b74403111936

apps/web/src/engagement/resource-engagement-controls.tsx
5607a1027b20fa39172f9dfb6d79d4441f47449c

apps/api/src/knowledge/public-knowledge.controller.ts
aedbd1cc10c0f94b8907199ddda4351fa5dd1179

apps/api/src/knowledge/public-knowledge-entity.controller.ts
0a995a653b14186187e80f3448943fd480e0694a

apps/web/src/knowledge/public-knowledge-destination.ts
0ac054d60869451c43c26d8122a7ed75d14d894c

apps/web/src/universes/presentation.ts
f1f85727fc2712b50c31e637f0bbe2934db46842
```

Activation inspection confirms:

```text
generic /knowledge/resources/[id] already exists;
the page already composes real ResourceEngagementControls;
the base public Resource payload remains intentionally thin:
  id + universeKey + resourceType + timestamps;
the public Knowledge Entity projection already exposes:
  slug + displayName + nativeName + alternateNames + summary + overview + facts
  + Media + relations;
the Web-owned canonical destination resolver accepted in UXP-08A already exists;

important bridge constraint:
the generic route starts from canonical Resource ID;
the current public Entity Web/API contract is keyed by universeKey + slug;
the thin public Resource response does not expose slug;
the public published-Entity store currently exposes route-key lookup, not
Resource-ID lookup;
a direct public Resource-ID -> published Entity/profile bridge is therefore not
proven at this transition checkpoint.
```

Therefore the expected UXP-08B architecture is:

```text
finish the generic fallback page by composing accepted Web/Knowledge/Engagement capabilities;
reuse existing public Entity/profile identity when a public-safe bridge can be resolved;
preserve specialized canonical destinations when identity proves one;
preserve /knowledge/resources/[id] only as the truthful generic fallback;
retain existing Engagement ownership;
do not create an Engagement -> Knowledge platform dependency;

first prove whether an already-accepted public-safe Resource-ID -> Entity/profile
bridge exists on the exact transition baseline;

if no such bridge exists, one bounded Knowledge-owned public read correction is
eligible:
  resolve a PUBLISHED Entity/profile from canonical Resource ID;
  or make the minimum semantically equivalent public projection adjustment;

the correction must reuse existing Knowledge ownership and publication rules;
do not duplicate Entity/profile data into a new model merely for display;
do not create a new backend/service family;
no new persistence/storage;
no schema migration expected.
```

No UXP-08B product file changes in this transition.

Canonical route:

```text
/knowledge/resources/[id]
```

## Objective

Finish the generic published Knowledge fallback while preserving specialized
canonical pages.

## Frozen minimum direction

```text
shared ApplicationShell + account navigation;
public published-only Resource boundary;
typed Universe presentation;
reuse existing public Entity/profile data where available;
display name / summary / facts where available;
friendly Resource Type identity;
published Media where applicable;
existing Resource Engagement controls;
Favorite / Collection behavior retained;
loading / unexpected error / not-found / unpublished handling;
typed canonical precedence for Resources with finished specialized pages;
generic canonical fallback for Resources without a specialized page;
Share/Copy only if the generic route is the truthful canonical destination;
stable metadata/social identity only for the truthful canonical destination;
responsive/accessibility acceptance;
no Creator UI;
no backend/schema migration expected.
```

UXP-08B does not duplicate:

```text
Anime Character;
Anime Series;
Devotional Deity;
Public Experience
```

as second full product pages.

---

# 11. UXP-08C — Finished Cross-Universe Search

Status:

```text
NOT STARTED — GATED ON UXP-08B ACCEPTANCE
```

Canonical route:

```text
/search
```

## Objective

Finish the existing Search experience while preserving the accepted Search engine
and current result semantics.

## Frozen minimum direction

```text
shared ApplicationShell + account navigation;
existing query search;
existing Universe filter;
existing Resource Type filters;
URL-addressable query/filter state;
bounded offset/limit pagination over the existing contract;
typed Universe label;
friendly Resource Type label;
real display identity;
summary where public-safe and available;
canonical typed destination resolver + generic fallback;
idle/loading/error/empty/results;
keyboard/focus/responsive acceptance;
stable /search canonical identity independent of query/campaign params.
```

Current public Search results lack display name/slug.

Therefore UXP-08C may:

```text
first attempt bounded composition with already accepted public Knowledge identity;

if that is insufficient or creates an unacceptable request/performance shape,
minimally enrich the existing public Search result projection with only the
public-safe identity fields required by the Web.
```

Expected enrichment, if required:

```text
slug where canonical typed routing requires it;
displayName;
summary where already public.
```

No new persistence/index/ranking architecture is authorized.

Existing Search order/semantics remain authoritative.

---

# 12. UXP-08D — Finished Saved / Favorites / Collections

Status:

```text
NOT STARTED — GATED ON UXP-08C ACCEPTANCE
```

Canonical route:

```text
/saved
```

## Objective

Finish the authenticated library over the existing Engagement ownership.

## Frozen minimum direction

```text
shared ApplicationShell + account navigation;
anonymous sign-in state;
authenticated loading/error/ready states;
Favorites list;
remove Favorite;
Collections list;
create Collection;
list Collection Resources;
remove Resource from Collection;
existing add Favorite/add-to-Collection flows remain compatible;
compose Resource IDs with public Knowledge identity in Web/application layer;
typed Universe identity;
friendly Resource Type;
display name;
canonical destination resolver;
empty states with meaningful continuation;
private/account-appropriate metadata;
responsive/keyboard/focus acceptance.
```

Minimum eligible Engagement addition:

```text
delete owned Collection
```

only because a user-created Collection currently has no removal lifecycle.

The deletion must preserve:

```text
actor ownership;
authorization;
existing Collection persistence;
existing audit/error conventions;
no Knowledge dependency inside Engagement.
```

Not in UXP-08D unless a real acceptance defect proves otherwise:

```text
public/shared Collections;
collaboration;
followers;
Collection recommendations;
manual ordering framework;
folders;
tags;
Collection cover art;
rename Collection;
new Engagement database;
new Engagement -> Knowledge platform dependency.
```

---

# 13. UXP-08E — Reuse + Full Discovery / Engagement Acceptance

Status:

```text
NOT STARTED — GATED ON UXP-08A/B/C/D ACCEPTANCE
```

UXP-08E is acceptance-first.

No new production feature is planned.

Production changes are permitted only when the frozen full acceptance matrix
exposes a real defect, and then only the minimum bounded correction may be made
before rerunning the complete matrix.

Full acceptance must cover:

```text
Knowledge browse;
generic Knowledge detail;
Search;
Saved / Favorites / Collections;
Devotional + Anime identity reuse;
known specialized canonical destinations;
generic fallback destinations;
anonymous/authenticated states;
Engagement mutations;
published-only boundaries;
loading/error/empty/not-found;
responsive matrix;
keyboard/focus;
reduced motion;
canonical/social/privacy behavior;
finished Anime/Devotional/Experience regressions;
Identity/session regressions;
format/lint/typecheck/unit;
canonical migrations/status;
focused API integration;
full integration;
focused browser;
full Web E2E;
production build;
fresh-process production proof;
architecture:check;
reviewed evidence ZIP;
manual commit/push;
exact remote CI success.
```

---

# 14. Explicit Non-Goals

UXP-08 does not pre-build:

```text
new Search index;
new full-text engine;
Elasticsearch/OpenSearch;
vector database;
embeddings;
semantic search;
AI ranking;
recommendation engine;
trending/popularity platform;
editorial ranking;
search analytics pipeline;
new Knowledge database/repository/service;
new Engagement database;
public/social Collections;
new Media capability;
new Identity capability;
Creator Studio redesign;
Home redesign;
UXP-09 work;
UXP-10 work;
UXP-11 work;
generic design-system rewrite;
generic page builder;
generic theme engine;
speculative workflow/policy infrastructure.
```

A minimal existing-projection change is not permission for a platform rewrite.

---

# 15. Architecture Boundaries

Preserve:

```text
Applications
    ↓
Universes
    ↓
Platforms
    ↓
Platform Kernel
    ↓
Foundations
```

Specific rules:

```text
Web/application composition may depend on Knowledge + Engagement together;
Engagement platform must not depend on Knowledge platform;
Knowledge must not depend on Engagement;
Search/Discovery ownership remains existing;
typed Universe presentation remains Web/Universe presentation concern;
canonical route mapping remains Web application concern;
Identity continues to own sessions;
Media continues to own Asset delivery;
no upward dependency is introduced.
```

Canonical validation remains:

```text
pnpm run architecture:check
```

---

# 16. Slice Governance

The frozen UXP-08 sequence is:

```text
UXP-08A — Finished Knowledge Browse
CLOSED — ACCEPTED — 0805eda89a420b5f90f6e3ce0facb1b3d36f81fd

UXP-08B — Finished Generic Knowledge Detail
ACTIVE — NEXT IMPLEMENTATION SLICE

UXP-08C — Finished Cross-Universe Search
NOT STARTED — GATED ON UXP-08B ACCEPTANCE

UXP-08D — Finished Saved / Favorites / Collections
NOT STARTED — GATED ON UXP-08C ACCEPTANCE

UXP-08E — Reuse + Full Discovery / Engagement Acceptance
NOT STARTED — GATED ON UXP-08A/B/C/D ACCEPTANCE
```

Each slice requires:

```text
implementation/evidence runner;
independent evidence review;
manual commit;
manual push;
exact remote SHA verification;
exact GitHub CI success;
separate docs transition before the next slice when governance state changes.
```

No slice is activated merely because the next design is obvious.

---

# 17. Current Position

Current execution state:

```text
UXP-07 — CLOSED — ACCEPTED
UXP-08 — ACTIVE
UXP-08A — CLOSED — ACCEPTED — 0805eda89a420b5f90f6e3ce0facb1b3d36f81fd
UXP-08B — ACTIVE — NEXT IMPLEMENTATION SLICE
UXP-08C — NOT STARTED
UXP-08D — NOT STARTED
UXP-08E — NOT STARTED
UXP-09 — NOT STARTED
WPR-M05 — ACTIVE
P10-M04 — SEQUENCING-BLOCKED
Master Roadmap — UNCHANGED
```

UXP-08A is remotely accepted.

This A→B checkpoint is docs-only.

No UXP-08B product file belongs in this transition.

UXP-08C/D/E and UXP-09 remain not started.

---

# 18. Next Action

After this docs-only A→B transition is independently reviewed,
manually committed/pushed and exact remote CI is green, execute only:

```text
UXP-08B — Finished Generic Knowledge Detail
```

Start UXP-08B from the exact remotely-green transition SHA.

Before production changes:

```text
re-inspect the exact transition baseline;
lock the generic detail route/component;
lock the public Resource and public Entity/profile projections;
lock existing Resource Engagement controls;
lock the UXP-08A canonical destination resolver;
inspect existing generic-detail unit/browser regressions;
freeze an exact implementation allowlist.
```

Primary direction remains:

```text
finish the existing /knowledge/resources/[id] fallback;
reuse accepted public Knowledge identity/profile data;
reuse typed Universe presentation;
reuse published Media;
retain existing Resource Engagement controls;
preserve specialized canonical destination precedence;
keep generic detail as the truthful fallback;
provide loading/error/not-found/unpublished behavior;
finish metadata/social identity only where the generic route is canonical;
responsive/accessibility acceptance;
minimum architecture only.
```

No new Knowledge backend, Search work, Saved/Collection expansion, ranking,
recommendation system, schema migration or generic page builder is pre-authorized.

Do not begin UXP-08C/D/E.

Do not begin UXP-09.
