# AI World UXP-11 — Home + Whole-Site Integration

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-11 |
| Area | Product / Web / Home / Whole-Site Integration |
| Status | ACTIVE — UXP-11D ACTIVE |
| Created | 2026-09-03 |
| Activation Baseline | `aab61148d5a3aa21b26e7731f5b13982ae1f3bc0` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Predecessor | UXP-10 — Creator / Admin Studio — CLOSED — ACCEPTED |
| Primary Route | `/` |
| Connected Routes | `/devotional`, `/anime`, `/knowledge`, `/search`, `/saved`, `/account`, `/creator` |
| Scope | Finish Home from accepted public capabilities, then complete shared navigation, footer and cross-site pathways |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Activation Gate

UXP-11 activates only from the remotely accepted UXP-10 closure checkpoint:

```text
aab61148d5a3aa21b26e7731f5b13982ae1f3bc0
docs(roadmap): close UXP-10
exact remote CI user-confirmed green
```

This activation is docs-only.

No UXP-11 production implementation begins until this activation checkpoint is
independently reviewed, manually committed/pushed and exact remote CI is green.

WPR-M05 remains ACTIVE.

P10-M04 remains SEQUENCING-BLOCKED.

The Master Roadmap remains unchanged.

---

# 2. Product Intent

UXP-11 makes Home an honest entrance to the product that now exists:

```text
understand AI World and its Universes
    ↓
enter Devotional or Anime directly
    ↓
discover real published Knowledge
    ↓
search across Universes
    ↓
continue into saved, account or creator journeys when relevant
```

Home must lead to canonical public destinations and real published content. It
must not imply recommendations, popularity, personalization or editorial ranking
that the accepted backend does not own.

Whole-site integration in this milestone means coherent navigation and pathways
across accepted experiences. It does not transfer canonical ownership to Web.

---

# 3. Repository Truth At Activation

The following accepted capabilities already exist and must be reused:

```text
public Devotional and Anime Universe landing experiences;
public typed entity and generic Knowledge detail experiences;
public Knowledge browse and discovery contracts;
finished cross-Universe Search;
saved favorites and collections;
session-aware account navigation and account management;
permissioned Creator / Admin Studio;
typed Web Universe presentation configuration;
shared application header, primary navigation, account navigation and footer;
route metadata and responsive public-page foundations.
```

The current `/` route contains a strong introductory statement, three static
product-path cards, Universe descriptions and session summary. Its Universe cards
route generically to Search instead of their actual Universe destinations, and it
does not yet surface real published Knowledge.

The current shared shell exposes Explore, Search and Create in the primary
navigation. Its footer exposes only Knowledge and Search. Existing Home browser
coverage proves the basic shell and narrow-screen overflow only; it does not prove
the final real-content Home or whole-site pathway contract.

---

# 4. Canonical Ownership

Ownership remains:

```text
Knowledge Platform
    canonical published Knowledge and public discovery semantics

Discovery Platform
    Search semantics and cross-Universe result discovery

Engagement Platform
    favorites and collections

Identity & Access and User Platforms
    session, authorization, account and profile semantics

Composition and AI / Creator Platforms
    published Experiences and reviewed creator assistance

Universe packages
    Universe definitions and domain-specialized configuration

Web Application
    Home composition, presentation, navigation and client state
```

Web may compose public contracts but must not access Prisma, invent canonical
ranking, mutate owner state directly or embed named-Universe behavior in shared
Platforms, Kernel or Foundations.

---

# 5. Frozen Slice Sequence

```text
UXP-11A — Finished Home Content Foundation
CLOSED — ACCEPTED — 5d7d44dac3c4a479e433a46eccb25ec41792c00c

UXP-11B — Finished Global Navigation + Footer
CLOSED — ACCEPTED — 1cc52e1e1a2286ca6fb69f4b402e5396d35e7840

UXP-11C — Finished Cross-Site Pathways
CLOSED — ACCEPTED — b0a2a5ba02d7ba42557b9486e31559f696978338

UXP-11D — Full Home + Whole-Site Integration Acceptance
ACTIVE
```

Each slice requires:

```text
repository inspection;
minimum bounded implementation;
focused tests;
relevant regression;
reviewed evidence;
manual commit/push;
exact remote SHA verification;
exact GitHub CI success;
separate docs transition before the next slice.
```

No later slice begins before the preceding slice has exact remote CI acceptance.

---

# 6. UXP-11A — Finished Home Content Foundation

Status:

```text
CLOSED — ACCEPTED
```

UXP-11A replaces the static-only Home body with an understandable entrance to
real accepted public content while retaining the established AI World identity.

Minimum scope:

```text
preserve the canonical / route and clear AI World proposition;
link each Universe presentation to its actual public Universe route;
surface a small bounded set of real published Knowledge through existing public contracts;
label content neutrally unless an owned ordering semantic exists;
provide honest loading, empty and failure states without blocking static navigation;
keep Search and general Knowledge entry points obvious;
preserve semantic landmarks, keyboard use and visible focus;
preserve wide, tablet and narrow-screen layouts without horizontal overflow.
```

Implementation should reuse the existing public Knowledge discovery Web boundary
and typed Universe presentation registry. Any Home-specific orchestration belongs
inside `apps/web`.

The slice must not add a new API, database schema, dependency, recommendation
engine, analytics-derived ranking, CMS content type or named-Universe condition in
shared core code merely to populate Home.

Acceptance must prove:

```text
Home still provides useful navigation when public content is empty;
one failed content request does not erase the rest of Home;
only public published content is rendered;
Universe cards reach /devotional and /anime directly;
rendered content links resolve through existing public destination rules;
loading and error copy does not claim nonexistent personalization or ranking;
390px viewport has no horizontal page overflow;
keyboard order and landmarks remain coherent.
```

Accepted implementation and validation evidence:

```text
5d7d44dac3c4a479e433a46eccb25ec41792c00c
feat(web): finish home content foundation
exact remote CI user-confirmed green;

Home now consumes a bounded limit of three public discovery items per Universe;
Devotional and Anime cards now use typed direct Universe destinations;
published items retain canonical typed and generic destination resolution;
each Universe retains independent loading, empty, error and retry behavior;
static Knowledge and Search continuation paths remain available during failures;
no backend, schema, dependency, ranking or personalization semantics were added;
Prettier, Web lint and strict typecheck passed;
26/26 Web unit files and 96/96 tests passed;
Web production build passed;
focused Home browser coverage passed 3/3;
full browser execution reported all 167 cases passing before service teardown;
git diff --check passed and generated artifacts were removed.
```

---

# 7. UXP-11B — Finished Global Navigation + Footer

Status:

```text
CLOSED — ACCEPTED
```

UXP-11B completes the shared shell after the finished Home information hierarchy
shows which global destinations need persistent access.

Minimum scope:

```text
make the two accepted Universe destinations discoverable from the shared shell;
keep Knowledge, Search and Creator entry paths understandable;
preserve session-aware account and saved pathways without duplicating authorization;
finish footer information architecture with real internal destinations only;
provide a usable narrow-screen navigation treatment;
preserve skip-link, landmarks, focus order and current-route clarity.
```

This slice must not introduce speculative settings, legal, social, download,
community or support destinations that do not exist.

Accepted implementation and validation evidence:

```text
1cc52e1e1a2286ca6fb69f4b402e5396d35e7840
feat(web): finish global navigation and footer

65936599bf29d04eb29c5edc8784ee3e95b1dbc7
fix(web): stabilize responsive global navigation

e503ee2df683d5a5c1f103d3a89e834a8eab7f88
fix(web): prevent responsive navigation overflow

exact remote CI user-confirmed green;

the shared shell exposes both accepted Universe destinations and global Knowledge,
Search and Creator paths;
session-aware Saved, Account and Create pathways remain available without moving
authorization into navigation;
the footer exposes only real internal product destinations;
responsive navigation wraps without page-level or navigation-container overflow;
skip-link, landmark, focus and current-route behavior remain covered;
Prettier, Web lint and strict typecheck passed;
27/27 Web unit files and 98/98 tests passed;
the CI-aligned single-worker browser regression passed 92/92 cases;
git diff --check passed and generated browser artifacts were removed.
```

---

# 8. UXP-11C — Finished Cross-Site Pathways

Status:

```text
CLOSED — ACCEPTED
```

UXP-11C verifies and finishes the journeys connecting Home, Universe discovery,
Knowledge detail, Search, saved state, account and Creator entry.

Minimum scope:

```text
remove generic or dead-end links where a canonical destination exists;
preserve search scope and detail return paths where the accepted contract supports it;
make public-to-authenticated transitions understandable;
keep creator entry separate from public browsing while visibly part of AI World;
ensure direct URLs and browser history remain valid;
align cross-page labels without erasing Universe vocabulary;
cover representative Devotional, Anime and generic Knowledge journeys.
```

This slice is integration work. It must not reopen accepted product surfaces or
create a new application router, global state framework or cross-owner mutation.

Accepted implementation and validation evidence:

```text
b0a2a5ba02d7ba42557b9486e31559f696978338
feat(web): finish cross-site pathways

e7797b5d2367da685d0d91029ad03c88f7e6c531
test(web): expect scoped anime search pathway

exact remote CI user-confirmed green;

Devotional and Anime entry points now retain their native Universe Search scope;
anonymous save and Saved-library entry now retain safe post-sign-in destinations;
the existing validated identity continuation contract remains the sole redirect guard;
canonical typed and generic Knowledge destinations remain unchanged;
browser history and direct Search URLs retain accepted URL-owned state;
no router, global state, backend, schema, dependency or ownership change was introduced;
Prettier, Web lint and strict typecheck passed;
28/28 Web unit files and 100/100 tests passed;
focused affected browser coverage passed 38/38 before the CI assertion correction;
the corrected Anime Search browser file passed 4/4;
Web production build and all 22 repository builds passed;
git diff --check passed and exact remote CI succeeded.
```

---

# 9. UXP-11D — Full Home + Whole-Site Integration Acceptance

Status:

```text
ACTIVE
```

UXP-11D is evidence and bounded defect correction only.

Acceptance must cover:

```text
anonymous and authenticated entry states;
empty, populated, loading and recoverable failure states;
Devotional, Anime and generic Knowledge pathways;
Home-to-search-to-detail continuity;
session-aware saved, account and creator entry paths;
wide, tablet and 390px layouts;
keyboard navigation, landmarks, focus visibility and reduced motion;
route metadata and production build behavior;
fresh-process browser execution without prior local-state assumptions;
relevant architecture, lint, typecheck, unit, integration and browser regressions.
```

Any defect found here must be fixed in the smallest owning boundary. Scope growth
requires a separately reviewed contract change.

---

# 10. Security And Privacy

```text
Home consumes public read contracts only;
unpublished or unauthorized content must never appear;
session-aware links must not substitute for server authorization;
failed requests must not expose internal errors or credentials;
no sensitive session or personal data belongs in public metadata or logs;
Creator and administration actions remain behind their existing authorization boundaries.
```

---

# 11. Explicit Non-Goals

UXP-11 does not introduce:

```text
personalized recommendations;
featured, trending or popularity semantics without an accepted owner;
new canonical content or editorial-ranking models;
new Search infrastructure;
new authentication, authorization or account semantics;
new Engagement semantics;
new Universe implementations;
third-party analytics or advertising;
arbitrary Home page scripting or a generic visual page builder;
unrelated redesigns of accepted detail, Search, saved, account or Creator experiences.
```

---

# 12. Validation Protocol

Every implementation slice must run the smallest meaningful focused set plus all
repository gates affected by its changes.

Expected UXP-11 validation includes, as applicable:

```text
focused Home component/unit tests;
focused Home and shared-shell Playwright tests;
representative Devotional, Anime, Knowledge, Search and session pathway tests;
Web lint and strict typecheck;
Web production build;
relevant API/integration tests when a contract boundary is touched;
architecture validation;
git diff --check;
final status and diff inspection.
```

UXP-11D expands this to the full accepted Home and whole-site regression matrix.

---

# 13. Current Position

```text
UXP-10 — CLOSED — ACCEPTED
UXP-11 — ACTIVE
UXP-11A — CLOSED — ACCEPTED — 5d7d44dac3c4a479e433a46eccb25ec41792c00c
UXP-11B — CLOSED — ACCEPTED — 1cc52e1e1a2286ca6fb69f4b402e5396d35e7840
UXP-11C — CLOSED — ACCEPTED — b0a2a5ba02d7ba42557b9486e31559f696978338
UXP-11D — ACTIVE
UXP-12 — NOT STARTED
```

This UXP-11C closure and UXP-11D activation checkpoint changes documentation only.

After independent review, manual commit/push and exact remote CI success,
execute only UXP-11D acceptance and bounded defect correction.

Do not activate UXP-12 or close WPR-M05 inside this activation checkpoint.

WPR-M05 remains ACTIVE.

P10-M04 remains SEQUENCING-BLOCKED.

The Master Roadmap remains unchanged.
