# AI World Web Product Readiness Gate Before P10-M04

## Status

ACCEPTED FOR IMPLEMENTATION

## Date

2026-08-22

## Placement

Between:

```text
P10-M03 — Infrastructure as Code
CLOSED
```

and:

```text
P10-M04 — Deployment Pipeline
```

This is an interstitial product-readiness gate.

It does not renumber Phase 10 milestones.

P10-M04 remains the next canonical Phase 10 milestone but must not begin until
this gate closes.

## Baseline

```text
3fe85224beb1a69b49e876aaa1e9b34da5d1225d
docs(roadmap): close P10-M03 Infrastructure as Code
```

The Master Roadmap at this baseline records:

```text
P10-M03 Infrastructure as Code CLOSED
P10-M04 Deployment Pipeline NEXT
```

## Decision

AI World pauses P10-M04 implementation and completes a bounded Web Product
Readiness Gate first.

The gate exists because local runtime proof established that:

```text
the Web process works;
the API process works;
PostgreSQL is healthy;
Mailpit is healthy;
API liveness is healthy;
API readiness is healthy;
```

while direct product inspection established that the first-party Web is not yet
a coherent finished product experience.

The current Web contains real functional vertical slices.

It is not an empty frontend.

However, product presentation and product-visible capability coverage are
uneven.

The correct response is therefore:

```text
evolve the existing Web
```

not:

```text
rewrite the Web;
rewrite the backend;
deploy an unfinished product first;
create speculative frontend infrastructure.
```

## Why This Gate Is Consistent With The Existing Roadmap

AI World's governing roadmap already requires:

```text
vertical slices before broad unfinished frameworks;
real consumers before speculative abstractions;
capability before infrastructure.
```

The current local product inspection is new evidence from a real consumer: the
first-party Web Application.

That evidence justifies deliberate product-surface completion before additional
deployment infrastructure is introduced.

This gate is a sequencing correction based on evidence.

It is not a rejection of Phase 10.

## The Long-Lived Product Principle

AI World may be expected to survive technology generations.

The architecture must not attempt to predict one hundred years of frameworks or
visual trends.

The durable objective is:

```text
stable product concepts;
portable canonical data;
explicit contracts;
semantic Web structure;
accessible interaction;
clear ownership;
replaceable delivery technology;
incremental migration.
```

The frontend framework, CSS tooling, visual details, and component
implementation are replaceable.

Canonical Knowledge, Media, Identity, Engagement, Composition, Universe
semantics, and public Platform contracts are not defined by the frontend.

A future Web rewrite must not require redefining those concepts.

## Product Experience Direction

The first-party Web should feel:

```text
simple;
clear;
fast;
trustworthy;
human;
distinctive;
content-first;
calm enough to age well;
expressive enough to communicate each Universe.
```

AI World should not imitate a short-lived visual trend merely because the trend
currently signals "AI" or "startup."

Avoid making the product identity depend on:

```text
neon AI gradients;
glassmorphism;
excessive blur;
decorative animation;
visual novelty without information value;
dashboard patterns where no dashboard is needed;
chatbot-first framing for the whole product.
```

Attraction should come from:

```text
clear purpose;
beautiful content;
strong information hierarchy;
useful discovery;
rich Media;
distinct Universe expression;
fast interaction;
creator capability;
responsible AI assistance.
```

## One AI World, Many Universe Expressions

The durable presentation model is:

```text
one shared AI World shell
+
shared interaction language
+
shared accessibility behavior
+
shared semantic design tokens
+
typed Universe presentation configuration
+
Universe-specific composition/content
```

A user should recognize AI World across Universes.

A Devotional experience and an Anime experience should not need to look
identical.

They should share interaction rules while being allowed distinct visual tone.

## Web Ownership

The product UI remains inside:

```text
apps/web
```

during this gate.

No new:

```text
packages/ui
```

is created.

The accepted Repository Architecture explicitly makes a shared UI package a
non-initial requirement and allows public, authenticated, creator, and admin
presentation to remain in the first-party Web Application.

A shared UI package becomes eligible only when a second real Application
demonstrates reusable visual consumers.

## UI Technology

Retain:

```text
Next.js
React
Tailwind CSS
semantic HTML
CSS custom properties
```

for the current implementation.

Do not add a large opinionated UI component framework.

Do not add Redux or another global state framework merely for UI completion.

Do not create a frontend plugin runtime.

New dependencies require a concrete product need.

## Durable Design Token Contract

The Web should establish a small semantic token vocabulary.

Examples:

```text
surface;
surface-muted;
surface-raised;
text;
text-muted;
border;
brand;
accent;
success;
warning;
danger;
focus;
radius;
shadow;
content-width;
```

Exact color values, fonts, radii, and implementation syntax are replaceable.

The semantic role is the durable part.

CSS custom properties are the application-level portability boundary.

Tailwind utilities may consume those variables.

Tailwind is not the canonical design model.

## Application-Level UI Primitives

Create reusable primitives only after repeated use exists.

Initial likely primitives include:

```text
Button;
LinkButton;
Field;
Input;
Textarea;
Select;
Surface/Card;
Alert;
Badge;
Spinner/Progress;
EmptyState;
PageContainer;
ApplicationHeader;
ApplicationFooter.
```

Modal, menu, popover, tabs, tooltip, command palette, data grid, and other
primitives are introduced only when real screens need them.

Business rules do not move into visual primitives.

## Server-First Web Rule

Public and SEO-sensitive experiences remain server-first where practical.

Client Components are used for:

```text
forms;
interactive search state;
session-aware interaction;
creator editing;
Media upload;
AI assistance;
engagement mutations.
```

Large route trees must not become client-rendered by default merely to simplify
styling.

The existing same-origin:

```text
/apps/web
    → /api
    → apps/api
```

boundary remains.

The Web must not access Prisma directly.

## Session Resilience

The current session provider performs one initial session request.

A temporary API-startup/network failure can therefore leave the home page in a
sticky error state even after the API recovers.

The Product Readiness Gate must replace that behavior with a bounded resilient
experience.

Requirements:

```text
anonymous users are not mistaken for failures;
temporary network/API failure is distinguishable from anonymous state;
the user receives a retry path;
initial temporary failure can recover without requiring a full browser restart;
no infinite retry loop;
no authentication bypass;
HttpOnly Session ownership remains unchanged.
```

## Product-Visible Capability Gap: Engagement

Favorites and Collections are implemented backend capabilities.

The current Web has no Engagement presentation area.

Product Readiness must expose the currently accepted user-facing Engagement
scope through the first-party Web where it naturally belongs.

Required scope:

```text
Favorite / unfavorite a Resource;
view Favorites;
create/list Collections;
add/remove Resources from a Collection;
view Collection membership.
```

Do not pull forward:

```text
Activity History;
Progress;
Notifications;
Personalization;
personalized recommendations;
Community features.
```

Those remain deferred.

## Product-Visible Capability Gap: Published Experiences

Composition currently supports creator-side:

```text
Page creation;
ordered composition;
preview;
publish;
archive;
AI-assisted creation.
```

The current API Composition transport is creator-oriented and the Web has a
creator preview route.

There is not yet a complete public delivery surface for a published composed
Page/Experience.

Product Readiness must establish the minimum public published-Experience
vertical slice:

```text
Composition-owned public read contract;
public API transport;
published-only visibility;
stable public Web presentation;
typed Block/Resource/Media rendering;
Universe-aware presentation;
public routing with collision-safe semantics;
browser E2E proof.
```

The exact public URL design is decided from existing Page identity and route
semantics during that milestone.

A URL must not become canonical Page identity.

Draft and archived content must not become publicly visible.

## Product-Visible Identity Scope

The existing Identity Web flows are functional but visually inconsistent.

Product Readiness must make coherent:

```text
registration;
sign in;
email verification;
forgot password;
reset password;
sign out;
account/profile;
authenticated navigation;
unauthenticated navigation;
authorization-denied states.
```

Local verification/recovery delivery is proven through Mailpit.

Production Postmark configuration remains Phase 10 operational work.

## Product-Visible Knowledge And Discovery Scope

The existing Knowledge and Search experiences are retained and evolved.

Do not rewrite their backend contracts merely to restyle them.

Required public product behavior includes:

```text
home/landing experience;
clear global navigation;
Universe discovery;
Devotional-first Knowledge browsing;
Anime reuse-test browsing;
Knowledge Resource detail;
Media presentation where available;
cross-Universe Search;
Universe-filtered Search;
loading/empty/error states;
Engagement actions where authenticated.
```

## Creator Product Scope

The existing Creator workspace already proves meaningful functionality.

The gate makes that functionality coherent and usable.

Required creator journey:

```text
authorized creator enters workspace;
creates Knowledge;
uploads/links Media;
creates Page;
creates/uses Blocks;
orders composition;
saves;
uses AI assistance;
reviews AI candidate before canonical acceptance;
previews;
publishes;
views published result through public experience;
archives where appropriate.
```

AI remains assistance.

Generated candidates remain visibly non-canonical until explicit acceptance.

Do not turn the creator into a generic WYSIWYG site builder.

## Web Product Readiness Milestones

The gate contains five bounded milestones.

### WPR-M01 — Product UI Foundation And Resilient Shell

Owns:

```text
semantic design-token contract;
global Application shell;
responsive global navigation;
footer;
page/container rhythm;
application-level primitives;
focus and keyboard baseline;
loading/error/empty-state language;
typed Web Universe presentation configuration;
Devotional and Anime presentation mapping;
session startup/retry resilience;
home/landing experience;
global metadata basics.
```

It does not rewrite feature behavior.

### WPR-M02 — Identity And Account Experience

Owns:

```text
registration UX;
sign-in UX;
email-verification UX;
password-recovery UX;
reset UX;
account/profile UX;
authenticated/anonymous navigation;
authorization-denied UX;
local Mailpit journey proof.
```

It does not change authorization ownership.

### WPR-M03 — Public Knowledge, Discovery And Engagement Experience

Owns:

```text
Knowledge browse/detail coherence;
Media presentation where supported;
cross-Universe Search;
Universe-scoped Search;
Favorites Web flow;
Collections Web flow;
responsive public content states;
Devotional-first and Anime reuse-test presentation.
```

It does not activate deferred Engagement capabilities.

### WPR-M04 — Creator, Composition, Public Experience And AI Experience

Owns:

```text
creator workspace coherence;
Knowledge creation/editing presentation;
Media upload/link presentation;
Page/Block composition;
preview;
publish/archive;
AI candidate review/acceptance;
minimum public published-Experience read/delivery slice.
```

It does not introduce a generic rich editor, collaboration engine, workflow
Kernel, frontend plugin engine, or autonomous publishing.

### WPR-M05 — Product Quality And Local User Acceptance

Owns:

```text
responsive/mobile pass;
keyboard-only pass;
screen-reader semantic sanity pass;
focus visibility;
reduced-motion behavior;
contrast;
form/error/status accessibility;
critical browser E2E expansion;
product performance lab checks;
full local normal-user journey;
full local authorized-creator journey;
restart/persistence proof;
manual user acceptance.
```

The gate closes only after automated evidence and manual local acceptance agree.

## Accessibility Target

AI World targets:

```text
WCAG 2.2 Level AA
```

for the Web Product Readiness work.

This is an engineering/product target.

AI World must not make a formal legal conformance claim merely because automated
tools pass.

Validation must combine:

```text
semantic review;
keyboard testing;
automated accessibility checks where useful;
manual interaction testing;
screen-reader sanity testing for critical journeys.
```

Accessibility is not a later visual-polish task.

## Performance Target

The durable product requirement is:

```text
fast loading;
responsive interaction;
stable layout;
low unnecessary browser JavaScript.
```

Current Core Web Vitals implementation targets are:

```text
LCP <= 2.5 seconds;
INP <= 200 milliseconds;
CLS <= 0.1;
```

at the current recommended field percentile where real field data exists.

Before deployment, WPR-M05 uses lab measurements and bundle/runtime review to
catch obvious regressions.

Field validation belongs to later operational measurement after staging and
production traffic exists.

Core Web Vitals thresholds are implementation measurements, not permanent
Domain semantics.

## Browser Strategy

Use Web standards first.

Critical flows must not depend on Chromium-only browser behavior.

Current CI may continue with its established browser baseline during earlier WPR
milestones.

WPR-M05 must review whether core smoke journeys should run across Chromium,
Firefox, and WebKit based on deterministic CI cost and stability.

A browser-specific optimization must not become a canonical product contract.

## Security Boundary

UI completion must not weaken existing security.

In particular:

```text
authorization remains server-enforced;
session remains opaque and HttpOnly;
Web controls do not confer permission;
draft/archived Composition remains non-public;
actor ownership is derived from authenticated context;
runtime Secrets remain outside browser bundles;
safe rendering is required for untrusted/user/AI content.
```

Hiding a button is not authorization.

## SEO And Discoverability

Public pages should provide useful semantic:

```text
page titles;
descriptions;
heading hierarchy;
canonical URL behavior where appropriate;
linkable Resources/Experiences;
crawlable server-rendered public content.
```

Do not introduce SEO metadata infrastructure disconnected from real public
routes.

Structured data may be added only where a real public Resource type maps cleanly
to a supported vocabulary.

## Localization Readiness

The Localization Kernel and frontend localization technology remain deferred.

Product Readiness must nevertheless avoid making future localization
unnecessarily expensive.

Do not encode durable UI behavior around:

```text
English string length assumptions;
fixed text widths;
US-only date/number semantics;
concatenated translatable sentence fragments;
left-to-right-only layout tricks where avoidable.
```

This is localization-ready design, not Localization implementation.

## Visual Longevity Rule

The product should be capable of visual redesign without application/domain
migration.

Therefore:

```text
semantic HTML outlives visual style;
content hierarchy outlives color trends;
design tokens outlive specific values;
accessible controls outlive component styling;
Platform contracts outlive Next.js;
Universe identity outlives one theme.
```

The goal is not one visual design for one hundred years.

The goal is an architecture in which visual evolution is inexpensive and safe.

## Explicit Non-Goals

This gate does not authorize:

```text
P10-M04 deployment pipeline;
live cloud deployment;
DigitalOcean resource creation;
Terraform apply;
production DNS;
production Postmark setup;
Better Stack operational setup;
new microservices;
Kubernetes;
packages/ui;
large opinionated UI framework;
Redux by default;
frontend plugin runtime;
generic theme engine;
generic WYSIWYG editor;
real-time collaboration;
Activity History;
Progress;
Notifications;
Personalization;
recommendation infrastructure;
Community features;
Localization Kernel;
new mobile/desktop Application;
backend rewrite;
frontend rewrite from scratch.
```

## Quality Evidence Required For Gate Closure

The gate cannot close because pages merely look better.

Required evidence includes:

```text
format/lint/typecheck/unit/integration/build/architecture green;
browser E2E green;
public Knowledge and Search journeys green;
Identity/session journey green;
Favorites/Collections Web journey green;
creator composition/AI journey green;
published Experience public journey green;
responsive/accessibility review complete;
no unexplained user-facing 5xx in acceptance flows;
restart preserves canonical data;
manual local user acceptance approved.
```

## Manual Local Acceptance Journey

Normal user:

```text
open landing page
→ register
→ sign in
→ request/complete email verification through Mailpit
→ browse Knowledge
→ search across Universes
→ favorite a Resource
→ create/use a Collection
→ update account/profile
→ request/reset password through Mailpit
→ sign out
→ sign in with new password
```

Authorized creator:

```text
sign in
→ enter Creator
→ create Knowledge
→ upload/link Media
→ create Page/Blocks
→ compose ordered content
→ request AI assistance
→ review non-canonical AI candidate
→ explicitly accept if appropriate
→ preview
→ publish
→ open the public published Experience
→ confirm Search/Knowledge integration where relevant
→ archive where appropriate
```

## P10-M04 Resume Gate

P10-M04 may resume only after:

```text
WPR-M01 CLOSED
WPR-M02 CLOSED
WPR-M03 CLOSED
WPR-M04 CLOSED
WPR-M05 CLOSED
WEB PRODUCT READINESS GATE CLOSED
```

and the final gate closure evidence is green.

P10-M04 then owns:

```text
controlled build;
migration;
deployment;
rollback/recovery mechanics;
staging/production promotion.
```

The product is tested locally before P10-M04.

The complete product is tested again after staging deployment.

Local acceptance does not replace staging acceptance.

## Decision Sources

Internal canonical sources reviewed at baseline:

```text
docs/00-governance/*
docs/01-vision/*
docs/02-architecture/*
docs/03-engineering/*
docs/13-roadmaps/master-roadmap.md
docs/14-decisions/adr/*
docs/templates/*
apps/web/*
relevant apps/api transport surfaces
relevant Platform public contracts and tests
```

The audit included every file under `docs/`.

Empty documentation placeholders were identified as existing non-blocking
governance/documentation debt rather than treated as architectural evidence.

External standards/current references reviewed on 2026-08-22:

```text
W3C — Web Content Accessibility Guidelines (WCAG) 2.2
https://www.w3.org/TR/WCAG22/

web.dev — Web Vitals
https://web.dev/articles/vitals

Next.js — Accessibility guidance
https://nextjs.org/learn/dashboard-app/improving-accessibility
```

## Decision Outcome

```text
P10-M03
CLOSED

WEB PRODUCT READINESS GATE
NEXT

P10-M04
SEQUENCING-BLOCKED UNTIL WEB PRODUCT READINESS GATE CLOSES
```

After this ADR is committed and its exact CI gate is green, update the Master
Roadmap once to record the interstitial gate and its five milestones.

Then begin WPR-M01.

Do not create a separate activation commit.
