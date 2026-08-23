# AI World Web Product Local Acceptance

## Status

WPR-M05 acceptance procedure.

This document defines the repeatable local acceptance protocol. It does not record an acceptance result by itself.

## Scope

WPR-M05 closes the Web Product Readiness Gate only when automated evidence and manual local acceptance agree.

The local acceptance target covers:

- responsive/mobile behavior;
- keyboard-only operation;
- screen-reader semantic sanity;
- visible focus;
- reduced motion;
- WCAG-oriented contrast checks;
- accessible forms, errors, and status messages;
- critical browser journeys;
- local performance lab checks;
- the full normal-user journey;
- the full authorized-creator journey;
- restart/persistence behavior.

A passing automated suite is necessary but is not a formal WCAG conformance claim.

## Automated Quality Gate

Before manual acceptance, require all of the following to pass:

```text
format
lint
typecheck
unit tests
database migrations
Mailpit email-verification and password-recovery integration
full integration suite
WPR-M05 product-quality browser checks
critical product browser journeys
full browser E2E
production build
bundle/runtime review
restart/persistence proof
architecture validation
```

The WPR-M05 product-quality browser checks include:

```text
keyboard skip-to-content path;
visible focus;
mobile overflow sweep across critical routes;
one-main / one-H1 semantic sanity;
duplicate-ID detection;
Identity form labels and announced error feedback;
prefers-reduced-motion behavior;
semantic-token contrast guardrails;
warm local LCP <= 2.5 seconds;
warm local CLS <= 0.1;
warm local interaction-event duration <= 200 milliseconds.
```

Local lab numbers are regression guardrails. Field Core Web Vitals remain a later staging/production measurement concern.

## Browser Review

The current deterministic repository and CI baseline uses the installed system Chrome channel.

WPR-M05 retains Chromium for the mandatory pre-deployment gate because the current CI intentionally has no pinned Firefox/WebKit installation step and the product-quality milestone must not add a large, unstable browser-download tax without evidence.

This is not a Chromium-only product contract.

The Web remains standards-first, and P10-M04 staging acceptance must re-evaluate a pinned Chromium/Firefox/WebKit smoke matrix when deployment validation infrastructure is established.

## Normal-User Manual Journey

Use a unique local email address and complete this journey without database edits or browser devtools mutations:

```text
open landing page
→ register
→ sign in
→ request email verification
→ retrieve the verification message from Mailpit
→ complete email verification
→ browse Knowledge
→ search across Universes
→ favorite a published Resource
→ create a Collection
→ add/remove a Resource from the Collection
→ update account/profile
→ request password recovery
→ retrieve the recovery message from Mailpit
→ reset password
→ sign out
→ sign in with the new password
```

Reject acceptance if any step requires hidden implementation knowledge that a normal user would not reasonably have.

## Authorized-Creator Manual Journey

Use an acceptance actor that has the existing server-side Administrator role required by the current creator authorization contract.

Do not add or use a public self-elevation path for this test. The local acceptance handoff must provision the acceptance actor through a controlled server-side setup that preserves the existing authorization model; direct browser or hidden-field role mutation is not acceptable.

Complete:

```text
sign in
→ enter Creator
→ create Knowledge
→ upload/link Media
→ create a Page
→ create/use Blocks
→ compose ordered content
→ save
→ request AI assistance
→ verify the AI candidate is visibly non-canonical
→ explicitly accept only when appropriate
→ preview the saved composition
→ publish
→ open the public published Experience
→ confirm the public result contains only public-safe content
→ archive where appropriate
```

The creator journey must never treat a hidden button as authorization. Server enforcement remains authoritative.

## Accessibility Manual Pass

For the landing, Identity, Knowledge/Search, Saved, Creator, and public Experience surfaces:

1. Navigate the critical journey using only the keyboard.
2. Confirm focus is always visible and logical.
3. Use the skip-to-content link.
4. Confirm headings and landmarks make sense in a screen-reader landmark/heading list.
5. Confirm every form control has a usable accessible name.
6. Confirm errors are announced as alerts and successful/status feedback is exposed as status content.
7. Enable reduced motion and confirm interaction does not depend on animation.
8. Check at 200% browser zoom and a narrow mobile viewport for clipping or inaccessible horizontal overflow.
9. Perform a screen-reader sanity pass with a locally available screen reader; this is a usability check, not a legal conformance certification.

## Restart And Persistence

Acceptance data must survive an application restart and a non-destructive PostgreSQL container restart.

At minimum verify:

```text
registered actor persists;
existing Session remains server-valid until normal expiry/revocation;
a user-owned Collection persists;
API readiness recovers after PostgreSQL restart.
```

Do not use destructive `docker compose down -v` during this proof.

## Local Infrastructure

The acceptance stack uses:

```text
PostgreSQL 18.4
Mailpit 1.30.0
API
Web
```

Mailpit is local test infrastructure only. Production transactional email remains Phase 10 operational work.

## Manual Acceptance Record

Record the final manual result outside the implementation commit evidence and attach it to the WPR-M05 validation handoff.

```text
Baseline commit:
Date:
Reviewer:
Browser/version:
Screen reader used:
Normal-user journey: PASS / FAIL
Authorized-creator journey: PASS / FAIL
Keyboard/focus: PASS / FAIL
Screen-reader sanity: PASS / FAIL
Reduced motion: PASS / FAIL
Responsive/zoom: PASS / FAIL
Restart/persistence: PASS / FAIL
Unexpected user-facing 5xx: NONE / DETAILS
Notes:
Overall local acceptance: APPROVED / REJECTED
```

WPR-M05 and the Web Product Readiness Gate must remain open until the overall local acceptance result is explicitly APPROVED.
