# Security Requirements

**Status:** Mandatory engineering baseline\
**Last updated:** 2026-11-06 20:55 IST

## 1. Core principles

-   Never trust the browser. The browser is an untrusted client.
-   Server is authoritative for identity, authorization, price,
    availability, payments, appointment state, prescription
    finalization, and record access.
-   Deny by default; least privilege; minimize data.
-   Audit sensitive actions.
-   Security and privacy are launch requirements.

## 2. Never trust client-supplied values

Never accept these as authoritative without server validation: - Patient
ID, doctor ID, role, record ownership - Appointment status, slot
availability, working hours - Price, currency, payment status -
Consultation or prescription status - Video room permissions or call
duration - PDF URL/storage key - Consent state

Examples: - Fetch fee from server-side pricing rules; do not trust
browser amount. - Verify payment provider webhook; do not trust success
redirect. - Resolve patient identity from verified session; do not trust
hidden patient ID. - Recheck slot availability inside server
transaction. - Calculate call duration from trusted session events. -
Never allow role assignment through request body.

## 3. Authentication

Patient records use email OTP or single-use magic link: -
Cryptographically random, short-lived, single-use tokens. - Store token
hashes where practical. - Rate-limit issue, resend, and verification
attempts. - Neutral responses to prevent account enumeration. - Secure
HttpOnly, SameSite cookies where applicable. - Rotate session IDs after
authentication. - Support logout/session revocation. - Reverify
sensitive contact changes. - Booking reference is not authentication.

Doctor/admin: - Strong authentication. - MFA preferred/required for
privileged accounts. - Server-side role checks on every protected
endpoint.

## 4. Authorization, shared database, and patient isolation

-   **Shared Database Isolation**: Patient website and Doctor/Admin panel share the same PostgreSQL database. Enforce strict server-side authorization and RBAC on all queries. Patient roles cannot query or mutate admin models (e.g. fee rules, doctor profile, other patients' records).
-   Every record read/download must verify patient ownership.
-   Protect against IDOR by checking object-level authorization for
    every ID.
-   Patient A must never access Patient B's records.
-   Patient cannot call doctor/admin endpoints.
-   Do not rely on hidden UI routes or disabled buttons.
-   Separate internal doctor notes from patient-visible notes.
-   Apply authorization to downloads, rescheduling, cancellations, email
    resend, and document access.

## 5. Booking and timezone integrity

-   Calculate availability on server from doctor's IST rules.
-   Recheck inside transaction.
-   Use database locking/constraints to prevent overlapping bookings.
-   Use server time, not client clock.
-   Store appointment instant in UTC and IANA timezone identifiers.
-   Validate timezone names and local-time mapping.
-   Handle DST, ambiguous times, and nonexistent times using a
    maintained IANA library.
-   Expire holds server-side.
-   Make state transitions transactional.

## 6. Payment security

-   Create payment order on backend.
-   Fetch amount/currency from server configuration.
-   Bind payment to internal appointment/payment records.
-   Verify webhook signature and compare order, amount, currency, and
    status.
-   Make webhooks idempotent; handle duplicates and out-of-order events.
-   Never confirm from browser redirect alone.
-   Never store card number/CVV/raw credentials.
-   Authorize and audit refunds.
-   Keep immutable price snapshot for each booking.

## 7. Video calling platform security

-   **Independent Service Boundary**: Video platform is an independent project hosted in a separate repository; doctor's backend interacts via authenticated server APIs or cryptographically signed dynamic links.
-   **Dynamic Link Generation**: External link generation must use cryptographically secure room identifiers, participant-specific short-lived tokens, and signature verification.
-   **Link Expiry & Scoping**: Dynamic links expire promptly after the consultation window closes.
-   **In-Call Privacy**: Real-time drawing canvas (whiteboard) and doctor's note taker are scoped strictly to the authenticated room session and cleared or securely transferred; no leakage across sessions.
-   **No Media Persistence**: Disable video recording, audio recording, and automated transcription at application and infrastructure levels.
-   **Metadata Only**: Store session metadata only (session ID, appointment ID, start/end timestamps, call duration).
-   Prevent room guessing, brute force, and unauthorized participant admission.

## 8. Medical records and files

-   Store records and PDFs in private storage.
-   Use authenticated downloads or short-lived signed URLs.
-   Validate uploaded file type, size, and content.
-   Malware scan uploads where supported.
-   Never render untrusted HTML/scripts.
-   Preserve finalized prescription versions.
-   Audit creation, finalization, amendment, email, and sensitive
    access.
-   Do not finalize or issue before doctor approval.

## 9. Application security

-   Validate every input server-side with schemas.
-   Use parameterized queries/safe ORM methods.
-   Protect against SQL injection, XSS, CSRF, SSRF, path traversal, mass
    assignment.
-   Use CSRF protection for cookie sessions.
-   Restrictive CSP, secure headers, explicit CORS allowlist.
-   Rate-limit OTP, booking, payment, email, and sensitive endpoints.
-   Do not accept arbitrary file paths/storage keys.
-   Sanitize rich text if rendered.

## 10. Secrets

-   Keep secrets in managed secret store/protected environment
    variables.
-   Never commit credentials, tokens, private keys, webhook secrets, or
    `.env`.
-   Provide `.env.example` with placeholders only.
-   Separate dev/staging/prod secrets.
-   Rotate compromised secrets.
-   Never expose server environment variables in frontend bundles.

## 11. Logging and audit

Never log OTPs, tokens, passwords, API keys, card details, CVV, or
unnecessary medical content.

Audit events include authentication outcomes, record access, appointment
changes, payment webhook outcomes, prescription lifecycle, role changes,
video token issuance, and admin setting changes. Include timestamp,
actor, event, correlation ID, and safe metadata. Restrict and protect
logs.

## 12. Operations and privacy

-   HTTPS everywhere.
-   Encrypt data/backups at rest where supported.
-   Test backup restoration.
-   Restrict production DB access.
-   Patch dependencies and scan vulnerabilities.
-   Use synthetic data in development.
-   Define retention/deletion and incident response procedures.
-   Review Indian and international privacy, telemedicine, professional,
    and cross-border requirements before launch.

## 13. Mandatory security tests

-   Patient A cannot access Patient B by changing IDs.
-   Patient cannot access admin endpoints.
-   Browser cannot change price or payment status.
-   Forged/duplicate webhook cannot create duplicate confirmation.
-   Concurrent booking cannot claim same slot.
-   Expired/replayed OTP rejected; brute force rate-limited.
-   Video token cannot access another room and expires.
-   Prescription download requires authorization.
-   Internal notes never appear in patient APIs.
-   Finalized prescription cannot be silently overwritten.
-   Recording is disabled in production.

**Default:** If uncertain, choose the more restrictive behaviour and
document the decision.
