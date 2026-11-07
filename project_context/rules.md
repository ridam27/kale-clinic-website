# Engineering Rules and Project Guardrails

**Status:** Mandatory\
**Last updated:** 2026-11-06 20:55 IST

## 1. Before working

Read all project documents (`PRD.md`, `architecture.md`, `design.md`, `rules.md`, `Security.md`, `memory.md`, and `phases.md`). PRD is the product baseline; Security is
mandatory; architecture is the approved technical direction; phases is
the implementation roadmap; this file is the implementation guardrail;
memory is the chronological handoff log.

Make small testable changes. Use TypeScript strict mode, shared types,
schema validation, migrations, readable code, and tests. Keep business
logic server-side. Do not silently change scope.

## 2. Use

-   Three top-level directories (`patient-website/`, `doctor-panel/`, `video-app/`), each containing isolated `frontend/` and `backend/`.
-   Shared PostgreSQL database for `patient-website` and `doctor-panel`.
-   Completely independent `video-app` supporting dynamic link generation by external systems.
-   Video platform feature set: screen share, camera controls, microphone mute/unmute, settings, drawing canvas, and note taker.
-   Doctor/admin panel capabilities: fee management, prescription maker, patient database, appointment scheduling, and consultation link generation.
-   Universal theme switcher with Light, Dark, and System modes across all three frontends.
-   Server-side validation and authorization for every protected
    operation.
-   Server-side price lookup and payment verification.
-   Server-side availability checks and transactional booking.
-   UTC timestamps plus IANA timezone identifiers.
-   A maintained timezone library.
-   Database transactions, constraints, and idempotency.
-   Short-lived, single-use passwordless tokens.
-   Server-issued video tokens and dynamically generated room links.
-   Private file storage and authorized downloads.
-   Immutable booking price snapshots and prescription versions.
-   Medicine snapshots in prescription items.
-   Structured logs with correlation IDs and redaction.
-   Accessible semantic controls and centralized design tokens.
-   Theme switcher with Light, Dark, and System modes across all surfaces (patient website, doctor dashboard, and video app).
-   Explicit states and allowed state transitions.

## 3. Avoid

-   Never trust browser role, price, payment state, patient ownership,
    availability, or prescription status.
-   No secrets in frontend bundles or source control.
-   No separate databases for patient website and doctor panel (they must share the same PostgreSQL database).
-   No coupling of the video calling platform as a clinic-branded subdomain (e.g. `doctor.videocall.com`); it is an independent standalone project in a separate repo.
-   No public medical-file storage or permanent public PDF URLs.
-   No card number/CVV storage.
-   No manual timezone offset arithmetic.
-   No client clock as authoritative booking/call timer.
-   No booking ID as proof of identity.
-   No frontend-only route guards.
-   No internal doctor notes in patient APIs.
-   No silent overwrite of finalized prescriptions.
-   No prescription email before doctor approval.
-   No recording, transcription, or AI summary of calls.
-   No invented medicine, potency, dosage, diagnosis, doctor
    credentials, or clinical claim.
-   No hard-coded fees, hours, slot length, or medicine list.
-   No WhatsApp unless scope is formally changed.
-   No multiple-doctor features in initial release without approval.
-   No raw stack traces or secrets in user-facing errors.
-   No swallowed errors or false success states.
-   No appointment confirmation from browser redirect alone.

## 4. State management

Document state machines for: - Appointment - Payment - Consultation -
Prescription - Video session Reject invalid transitions server-side.

Suggested appointment states: `held`, `pending_payment`, `confirmed`,
`completed`, `cancelled`, `rescheduled`, `no_show`, `payment_failed`,
`expired`.

## 5. Error response standard

Use a consistent shape:

``` json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "This appointment slot is no longer available.",
    "requestId": "server-generated-id",
    "details": null
  }
}
```

Codes are stable and machine-readable. Messages are safe and actionable.
Never expose stack traces, SQL, secrets, provider credentials, or
sensitive health data.

Categories: validation, unauthenticated, forbidden, not found, conflict,
rate limit, provider failure, timeout, payment pending/failed,
PDF/storage failure, internal error.

## 6. Retry and partial failure

-   Retry transient errors with bounded exponential backoff and jitter.
-   Never retry non-idempotent operations without idempotency
    protection.
-   Do not retry invalid input or authorization failures.
-   Duplicate webhook/email retries must not duplicate bookings or
    prescriptions.

If payment succeeds but confirmation fails: preserve payment event,
reconcile, alert admin, and never charge again blindly.

If PDF generation fails: preserve finalized prescription, mark PDF
pending/failed, allow safe retry.

If email fails: preserve booking/prescription state, log failure, allow
resend. Email failure does not reverse payment or prescription
finalization.

## 7. Required UI states

Every major page must have loading, empty, validation, error, retry,
success, and disabled/unavailable states.

### Booking

No slots; slot taken; hold expired; payment pending; payment failed;
timezone unavailable.

### Patient portal

OTP sent; OTP expired; too many attempts; no records; session expired.
Do not reveal whether an arbitrary email is registered.

### Doctor dashboard

No appointments; record unavailable; save failed; concurrent edit
conflict.

### Prescription

Empty medicine master; incomplete row; PDF failed; email failed;
finalized/read-only; amendment flow.

### Video calling platform

Permission denied; device unavailable; screen share rejected/cancelled;
canvas sync error; notes autosave status; waiting for doctor; appointment
not open; invalid/expired link; reconnecting; meeting ended. No
recording control/state.

## 8. AI boundaries

AI coding agents may assist with code, UI scaffolding, tests,
documentation, migrations, and non-clinical workflow automation.

AI must not: - Diagnose patients. - Recommend homeopathic or other
medicines. - Select medicine or potency. - Invent dosage, frequency,
duration, or meal instructions. - Infer missing vitals or clinical
findings. - Create a prescription without doctor-authored content and
explicit approval. - Transcribe/summarize video calls. - Record calls. -
Alter finalized records outside an authorized amendment workflow. -
Claim legal compliance without qualified review. - Invent doctor
credentials or clinical claims.

Any future AI clinical feature requires a separate approved product
decision, consent/privacy assessment, clinical governance, and human
review. It is not in current scope.

## 9. Medical data rules

-   Medicine master starts empty.
-   Only doctor/admin-approved medicine entries.
-   Catalogue entries are not treatment recommendations.
-   Snapshot medicine data into prescription.
-   Missing vitals display `—`.
-   Never infer missing readings.
-   Keep internal and patient-visible notes separate.
-   Calculate age from DOB at consultation date where possible.
-   Do not merge patients by name alone.

## 10. Accessibility, Themes, and UX

Visible labels, actionable validation, keyboard navigation,
screen-reader names, clear timezone/date labels, confirmation for
destructive/high-impact actions, preserve safe input on validation
failure, and show unsaved state.
Theme switching across Light, Dark, and System modes must meet WCAG 2.2 AA
contrast in both palettes, prevent initial load theme flash (FOUC), and dynamically
respond to changes in system `prefers-color-scheme`.

## 11. Critical tests

Timezone/DST/date boundaries; concurrent slot booking; hold expiry;
immutable price; webhook signature/idempotency; OTP expiry/replay;
patient isolation; role authorization; video token scope/expiry;
recording disabled; missing-vitals PDF; prescription
snapshot/versioning; PDF/email retries; internal-note privacy.

## 12. Change control

For requirement changes: identify affected docs, data model, APIs, UI,
tests, cost/timeline; seek approval for
scope/security/privacy/clinical/provider changes; update relevant docs
and add timestamped memory entry. Never silently reinterpret client
decisions.
