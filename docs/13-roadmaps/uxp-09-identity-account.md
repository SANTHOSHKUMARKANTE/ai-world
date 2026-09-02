# AI World UXP-09 — Identity + Account

## Document Metadata

| Field | Value |
| --- | --- |
| Project | AI World |
| Working ID | UXP-09 |
| Area | Product / Web / Identity & Access / User / Email |
| Status | ACTIVE IMPLEMENTATION CONTRACT — UXP-09A ACTIVE |
| Created | 2026-09-02 |
| Activation Baseline | `82e40675a3e41251345a5c3f9e6ef84abbfc3885` |
| Parent Program | `docs/13-roadmaps/web-ui-completion-program.md` |
| Parent Decision | `docs/14-decisions/adr/p10-web-product-readiness-gate.md` |
| Governing Roadmap | `docs/13-roadmaps/master-roadmap.md` |
| Predecessor | UXP-08 — Discovery + Engagement — CLOSED — ACCEPTED |
| Routes | `/register`, `/sign-in`, `/verify-email`, `/forgot-password`, `/reset-password`, `/account` |
| Scope | Finish the existing Identity + Account Web journey by reusing accepted Identity, User, Email and Session capabilities |
| Roadmap Effect | None until WPR-M05 closes |

---

# 1. Activation Gate

UXP-09 activates only from the remotely accepted UXP-08 closure checkpoint:

```text
82e40675a3e41251345a5c3f9e6ef84abbfc3885
docs(roadmap): close UXP-08
exact remote CI user-confirmed green
```

This activation is docs-only.

No UXP-09 production implementation begins until this activation checkpoint is
independently reviewed, manually committed/pushed and exact remote CI is green.

WPR-M05 remains ACTIVE.

P10-M04 remains SEQUENCING-BLOCKED.

The Master Roadmap remains unchanged.

---

# 2. Product Intent

UXP-09 finishes Identity + Account as one trustworthy product journey:

```text
register
    ↓
sign in
    ↓
verify email
    ↓
recover/reset when necessary
    ↓
manage account/profile
    ↓
sign out safely
```

The experience must be calm, direct and security-aware without exposing
implementation identifiers, tokens, Session internals or authorization details.

UXP-09 is not permission to redesign the accepted Identity architecture.

---

# 3. Repository Truth At Activation

The following production capabilities already exist and must be reused:

```text
Identity & Access-owned registration;
password authentication and policy;
email verification request and confirmation;
enumeration-safe password recovery request;
password reset with Session revalidation;
opaque HttpOnly Session cookie;
Session validation and revocation;
User-owned display-name profile read/update;
SMTP Email Foundation delivery;
same-origin Web-to-API transport;
shared Identity page presentation;
shared responsive application shell.
```

The six target routes already exist:

```text
/register;
/sign-in;
/verify-email;
/forgot-password;
/reset-password;
/account.
```

Existing unit, API integration, Mailpit and browser tests prove important pieces,
but they do not by themselves establish the final coherent UXP-09 journey.

---

# 4. Canonical Ownership

Ownership remains:

```text
Identity & Access Platform
    registration, credentials, authentication, verification, recovery,
    Sessions, roles, permissions and authorization

User Platform
    product User profile and display name

Email Foundation
    SMTP delivery mechanics only

Web Application
    page presentation, journey composition, safe navigation and state UX

API Application
    REST delivery boundary only
```

The Web must not access Prisma or mutate canonical state directly.

The User Platform must not acquire credential or Session ownership.

The Email Foundation must not acquire Identity semantics.

---

# 5. Frozen Slice Sequence

```text
UXP-09A — Finished Registration + Sign-In
ACTIVE — IMPLEMENTATION SLICE

UXP-09B — Finished Verification + Recovery / Reset
BLOCKED BY UXP-09A REMOTE ACCEPTANCE

UXP-09C — Finished Account + Session
BLOCKED BY UXP-09B REMOTE ACCEPTANCE

UXP-09D — Full Identity + Account Acceptance
BLOCKED BY UXP-09C REMOTE ACCEPTANCE
```

Each slice requires:

```text
repository inspection;
minimum bounded implementation;
focused tests;
relevant full regression;
reviewed evidence;
manual commit/push;
exact remote SHA verification;
exact GitHub CI success;
separate docs transition before the next slice.
```

---

# 6. UXP-09A — Finished Registration + Sign-In

Status:

```text
ACTIVE — IMPLEMENTATION SLICE
```

UXP-09A finishes the two entry routes as one coherent authentication handoff:

```text
/register;
/sign-in.
```

Required product behavior:

```text
clear page purpose and hierarchy;
real existing API submission;
password requirements communicated before failure;
safe field and server validation;
submitting, success and failure states;
registration continuation into the accepted verification/sign-in journey;
sign-in continuation to the intended safe first-party destination;
authenticated-user handling that avoids a misleading duplicate sign-in journey;
forgot-password and account navigation;
no account-enumeration leakage;
no raw Actor/User/Session identifiers;
no token exposure;
keyboard and visible-focus acceptance;
390px, tablet and desktop acceptance;
200%-effective hierarchy acceptance;
shared-shell consistency.
```

Implementation should begin by testing the existing pages and changing only gaps
that prevent the required finished journey.

No API, Platform, schema or migration change is planned.

Such a change is permitted only when a real acceptance defect proves it necessary.

---

# 7. UXP-09B — Finished Verification + Recovery / Reset

UXP-09B owns the linked lifecycle routes:

```text
/verify-email;
/forgot-password;
/reset-password.
```

Required proof includes:

```text
authenticated verification request;
anonymous token confirmation;
safe invalid/expired token handling;
enumeration-safe recovery request result;
password-policy guidance;
successful reset;
post-reset Session invalidation/revalidation;
Mailpit delivery proof;
deep-link and refresh behavior;
keyboard/focus/responsive acceptance;
no secret or token logging/exposure.
```

---

# 8. UXP-09C — Finished Account + Session

UXP-09C finishes `/account` and shared Session behavior:

```text
anonymous recovery entry;
authenticated profile loading;
display-name update and clear;
profile error/retry;
expired Session recovery;
sign out;
post-sign-out navigation and protected-state removal;
shared-header account state;
no internal identifier presentation.
```

Profile semantics remain User-owned. Session semantics remain Identity-owned.

---

# 9. UXP-09D — Full Identity + Account Acceptance

UXP-09D is acceptance-first.

No new production feature is planned.

The final matrix must cover:

```text
registration → verification → sign-in → account → sign-out;
forgot-password → reset → old/new credential behavior;
anonymous/authenticated/expired/denied states;
refresh and fresh-process persistence;
enumeration resistance;
HttpOnly/SameSite/Secure production cookie behavior;
CSRF assumptions for same-origin mutation routes;
rate-limit/deployment-security decisions already accepted by the platform;
email delivery without sensitive logging;
loading/error/success/retry states;
keyboard/focus/status semantics;
mobile/tablet/desktop/200%-effective responsive matrix;
finished public, Universe, Discovery, Engagement and Creator regressions;
format/lint/typecheck/unit;
migrations/status;
focused and full integration;
Mailpit integration;
focused and full browser E2E;
production build;
fresh-process production proof;
architecture:check;
reviewed evidence ZIP;
manual commit/push;
exact remote CI success.
```

Production changes are permitted only for a proven acceptance defect and must be
the minimum bounded correction.

---

# 10. Security And Privacy Rules

```text
never expose access/session tokens to browser JavaScript;
never persist secrets in localStorage or sessionStorage;
never include credentials or recovery/verification tokens in logs;
never disclose whether an email address exists during recovery;
never expose Prisma/provider types through Web or API contracts;
never show Actor ID or User ID as primary product identity;
fail closed on malformed Session responses;
preserve same-origin credential transport;
preserve canonical Identity authorization boundaries.
```

If accepted security behavior conflicts with a desired visual flow, stop and
report the conflict. Do not weaken the security contract.

---

# 11. Explicit Non-Goals

UXP-09 does not introduce:

```text
OAuth or social login;
passkeys/WebAuthn;
multi-factor authentication;
passwordless authentication;
new Identity provider;
new email provider;
new Session architecture;
JWT storage in browser JavaScript;
new roles/permissions;
account deletion;
email-address change;
profile avatar upload;
notification preferences;
public profiles;
new User database/repository;
new Identity database/repository;
Creator/Admin Studio redesign;
Home redesign;
UXP-10 work;
UXP-11 work;
UXP-12 work.
```

Future product demand may authorize these separately. They are not implied by
finishing the current Identity + Account journey.

---

# 12. Validation Baseline

Use the smallest meaningful checks during implementation and the full required
matrix at acceptance.

Canonical commands include:

```text
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm --filter @ai-world/foundation-database run prisma:migrate:status
pnpm run test:integration
pnpm --filter @ai-world/api run test:integration:mailpit
pnpm run test:e2e
pnpm run build
pnpm run architecture:check
git diff --check
```

Critical Identity, Session, recovery, verification and profile paths require real
API/database/browser proof rather than mock-only evidence.

---

# 13. Current Position

```text
UXP-08 — CLOSED — ACCEPTED
UXP-09 — ACTIVE
UXP-09A — ACTIVE — IMPLEMENTATION SLICE
UXP-09B — BLOCKED BY UXP-09A REMOTE ACCEPTANCE
UXP-09C — BLOCKED BY UXP-09B REMOTE ACCEPTANCE
UXP-09D — BLOCKED BY UXP-09C REMOTE ACCEPTANCE
UXP-10 — NOT STARTED
WPR-M05 — ACTIVE
P10-M04 — SEQUENCING-BLOCKED
Master Roadmap — UNCHANGED
```

---

# 14. Next Action

After this docs-only activation checkpoint is independently reviewed, manually
committed/pushed and exact remote CI is green, execute only:

```text
UXP-09A — Finished Registration + Sign-In
```

Begin from the exact remote-green activation SHA.

Do not begin UXP-09B, UXP-10 or later work.
