# Product Requirements Document (PRD)

**Product:** International Online Homeopathy Consultation & Patient
Management Platform\
**Status:** Initial requirements baseline\
**Created:** 2026-11-06 20:55 IST

## 1. Product vision

Build a secure, responsive platform for one homeopathic doctor to
consult patients online in India and approved international markets. The
system includes: 1. Public patient website and guest booking. 2.
Passwordless patient portal for previous records. 3. Doctor/admin
dashboard sharing the same database with the website (fee management,
prescription builder, patient database, availability, and scheduling).
4. Integration with an independent video calling application (maintained in a
separate repository) featuring dynamic link generation, screen share, mute,
cam, settings, drawing canvas, and note taker. 5. Consultation notes
and optional vitals. 6. Medicine master and structured prescription
builder. 7. PDF generation, email delivery, payments, follow-ups, and
patient history.

## 2. Goals

-   No compulsory password-based patient registration.
-   Guest appointment booking.
-   Passwordless access to the patient's own records using email OTP or
    a secure single-use magic link.
-   Paid consultations.
-   Correct timezone conversion from doctor's IST schedule to patient's
    selected timezone.
-   Independent, secure, unrecorded video calls.
-   Doctor-managed medicines and prescriptions.
-   Secure patient history and prescription PDFs.
-   Configurable fees and working hours.

## 3. Out of scope initially

-   Multiple doctors or doctor marketplace.
-   WhatsApp notifications.
-   Video recording, transcription, or AI summaries.
-   AI diagnosis, medicine recommendation, or prescribing.
-   Pharmacy, inventory, medicine delivery, or e-commerce.
-   Native mobile apps.
-   International consultations in countries not approved by the doctor
    after legal/payment review.

## 4. Roles

### Patient

Browse website, book as guest, pay, join consultation, receive
prescription, and access own records after email verification.

### Doctor

Manage availability, appointments, patients, consultations, vitals,
medicines, prescriptions, follow-ups, and payment information.

### Administrator

Doctor acts as administrator initially. Keep roles separate in code to
support a future admin user.

## 5. Patient website

Public pages: - Home - About doctor - Qualifications and registration
details - Consultation services and fees - How online consultation
works - Book appointment - FAQs - Contact - Privacy policy - Terms -
Cancellation/refund policy - Consent and disclaimer.
Includes accessible Theme Switcher (Light / Dark / System) across all public and portal pages.

Do not invent doctor name, qualifications, registration details,
biography, contact details, or clinical claims. Use editable
placeholders until supplied.

### Guest booking form

Collect: - Full name - Date of birth (preferred) or age - Gender if
required - Email - Mobile with country code - Country - Selected
timezone - Main complaint / reason for consultation - Optional brief
symptom details - Required consent acknowledgements

Keep pre-booking data collection minimal.

### Passwordless patient access

Patient enters the email used for booking and verifies with OTP or a
secure, single-use magic link. Patient can then access: - Upcoming and
previous appointments - Appointment dates/times and status -
Consultation date/time - Call start/end and duration metadata -
Prescription PDFs - Follow-up details - Payment status/receipt reference
where available

A booking ID or email address alone must never grant access to medical
records.

## 6. Appointment scheduling and timezone

Initial doctor settings: - Doctor timezone: `Asia/Kolkata` (IST) -
Requested working hours: 9:00 AM--12:00 PM IST - Suggested initial slot
length: 30 minutes (confirm) - Example slots: 09:00, 09:30, 10:00,
10:30, 11:00, 11:30 IST

Doctor/admin can configure working days, hours per weekday, slot
duration, buffers, breaks, holidays, blocked dates, additional
availability, advance notice, booking horizon, and separate
initial/follow-up durations.

Timezone requirements: - Patient selects country. - Dynamically list the
IANA timezones associated with that country. - Suggest browser timezone
but allow manual selection. - For countries with multiple timezones,
allow city/timezone selection. - Display patient-local time and
corresponding IST before confirmation. - Store actual appointment
instants in UTC and retain IANA timezone identifiers. - Use a maintained
timezone library; never manually add fixed UTC offsets. - Handle
daylight-saving changes, ambiguous times, and nonexistent local times. -
Availability always originates from doctor's IST schedule, never
patient-local working hours.

Booking integrity: - Recheck availability server-side. - Temporarily
hold selected slot during checkout (suggested 10 minutes,
configurable). - Prevent overlapping bookings using database
transactions and constraints/locking. - Release failed/expired holds. -
Use idempotent payment webhook handling.

Suggested states: `held`, `pending_payment`, `confirmed`, `completed`,
`cancelled`, `rescheduled`, `no_show`, `payment_failed`, `expired`.

## 7. Payments and pricing

Client-provided initial fee: - India: INR 150 per consultation. -
International fee: undecided. - Fees may change.

Requirements: - Fees stored in admin configuration, never hard-coded. -
Support separate initial/follow-up prices. - Allow
country/currency-based pricing if needed. - International booking can
remain disabled until fee, provider eligibility, and legal coverage are
confirmed. - Snapshot amount and currency on each booking; later fee
changes must not alter historical bookings. - Recommended flow: full
advance payment at booking. - Backend creates payment order and verifies
provider webhook/signature. - Browser redirect is not proof of
payment. - Failed/expired payment releases slot. - Never store card
number, CVV, or raw card credentials. - Evaluate actual merchant
eligibility for international payments; do not assume gateway support.

## 8. Independent video calling platform

The video calling application is an independent standalone project maintained in a separate repository (not coupled to clinic branding or subdomains like `doctor.videocall.com`). It serves as a pure, dedicated video calling platform with dynamic link generation support for external systems.

Key platform features:
- Screen share
- Camera toggle (cam on/off)
- Microphone toggle (mute / unmute)
- Audio/video settings and device selection
- Drawing canvas (interactive whiteboard for visual communication)
- Note taker (integrated notes interface where doctor can write notes during consultation)
- Theme switcher (accessible Light / Dark / System mode toggle)
- Dynamic link generation by other systems (doctor's backend generates meeting links dynamically for confirmed appointments)
- Secure room tokens / short-lived dynamic links
- No video recording, transcription, or media storage

Integration with clinic backend:
- Doctor backend generates dynamic meeting links for scheduled consultations.
- Clinic backend validates appointment timing, participant authorization, and records session metadata only (session ID, appointment ID, start/end, call duration).

## 9. Doctor and Admin dashboard

The admin/doctor dashboard shares the same PostgreSQL database as the public patient website, providing a unified data store and workflow.

Key modules and capabilities:
- **Fee management**: Configure consultation fees (India INR 150 baseline, international pricing when active, initial vs. follow-up consultation fees, currency rules).
- **Prescription maker**: Structured prescription builder, medicine search from master, custom rows, potency, dosage, frequency, duration, instructions, preview, immutable versioning, and PDF generation.
- **Patient database**: Complete patient records, demographic details, consultation history, past prescriptions, call logs, and follow-up recommendations.
- **Video link generation & launch**: Dynamically generate and dispatch consultation links for the independent video platform upon appointment confirmation.
- **Calendar & appointment management**: Slot availability in IST, buffers, booking approval/reschedule/cancellation, and status tracking (`confirmed`, `completed`, `no-show`).
- **Payments overview**: Real-time payment verification logs, order status, and transaction references.
- **Medicine master**: Doctor-curated medicine catalogue.
- **Admin settings & Preferences**: Clinic profile, working hours, hold expiry, policies, and global Theme Switcher (Light / Dark / System).

## 10. Consultation workspace

Auto-fetch patient name, patient ID, DOB and age at consultation date,
gender if collected, email, phone, country, timezone, appointment
details, previous consultations, and prescriptions.

Optional vitals: - Heart rate (BPM) - Blood pressure
(systolic/diastolic, mmHg) - Blood glucose (value, unit, context if
known) - Height (cm) - Weight (kg) - Temperature (°C) - SpO2 (%)

All are optional. Missing values display `—`. Never infer or fabricate
values.

Clinical note fields: - Chief complaints - History of present illness -
Symptoms and duration - Past medical history - Current
medications/allergies if provided - Family history - Clinical
observations - Diagnosis/provisional diagnosis -
Advice/recommendations - Follow-up plan/date - Internal doctor notes

Keep internal notes separate from patient-visible notes.

## 11. Medicine master and prescription builder

Medicine database starts empty. Doctor/admin can add, edit, deactivate,
search, and filter medicines.

Medicine fields: name, category, potency, form
(tablet/drops/dilution/globules etc.), strength/description, optional
default dosage unit, active status, notes. Do not seed clinical
recommendations; doctor supplies and approves entries.

Prescription fields: - Doctor/clinic details from approved profile -
Prescription ID/date - Patient name, ID, age, relevant demographics -
Consultation reference - Complaints/findings, diagnosis/provisional
diagnosis, vitals, advice, follow-up - Multiple medicine rows with
searchable medicine, potency/strength, form, dosage quantity/unit,
frequency, meal timing, duration, quantity to dispense, instructions

Meal timing options can include before food, after food, with food,
empty stomach, bedtime, or custom. Frequency options are input
conveniences only; doctor decides actual instructions.

Doctor can add/remove/reorder rows, select existing medicines, enter
custom medicines, optionally save them to master, save drafts, preview,
finalize, and use templates/previous prescriptions as starting points.
All reused content must be reviewed.

Doctor alone determines medicine, potency, dosage, frequency, duration,
and meal instructions. No AI-generated prescriptions.

## 12. Prescription PDF

Professional printable PDF includes approved doctor/clinic details,
patient details, prescription ID/date, consultation reference,
patient-visible notes, vitals (missing as `—`), medicines and
instructions, advice, follow-up, and approved disclaimer/contact
details.

Workflow: draft → doctor preview/review → explicit finalization →
immutable version → PDF generation → private storage → email to verified
patient → portal access.

No handwritten/uploaded signature is required in initial client scope,
but confirm applicable professional rules before launch. Finalized
prescriptions cannot be silently overwritten; amendments create new
versions.

## 13. Email notifications

Email only; WhatsApp out of scope.

Events: booking received, payment success, appointment
confirmed/rescheduled/cancelled, reminders if enabled, video link,
prescription issued/resend, follow-up reminder if enabled,
refund/payment update.

Include patient-local date/time and timezone plus doctor IST. Avoid
sensitive clinical details in ordinary email; use secure portal links.
Configure SPF, DKIM, and DMARC.

## 14. Patient history

Maintain appointment dates/times in IST and patient timezone, statuses,
payment references, consultation date, call start/end/duration, notes,
vitals, prescription versions/PDFs, follow-up recommendations, and
cancellation/reschedule history.

Call duration is session metadata, not a recording or transcript.

## 15. Admin settings

Doctor profile, timezone, availability, slot duration/buffer,
breaks/holidays, fees/currencies, initial/follow-up pricing,
international booking enablement, hold duration, cancellation/refund
policy, email templates/reminders, video join window, patient portal
settings, and medicine master.

## 16. Suggested technical stack

-   Frontend: Next.js / React / TypeScript
-   Backend: NestJS or structured Next.js API
-   Database: PostgreSQL
-   ORM: Prisma or Drizzle
-   Auth: email OTP/magic link
-   Video: WebRTC with LiveKit or equivalent
-   PDF: server-side HTML-to-PDF
-   Email: Resend/Amazon SES or equivalent
-   Storage: private S3-compatible object storage
-   Payments: gateway approved for Indian and required international
    transactions
-   Hosting: reliable cloud hosting with backups and monitoring

These are proposals; document trade-offs before changing.

## 17. Phased delivery

Refer to [`project_context/phases.md`](phases.md) for the detailed phase-by-phase execution plan:
- **Phase 0**: Repository Scaffolding (3 folders each with `frontend/` & `backend/`) & Shared PostgreSQL DB Setup
- **Phase 1**: Completely Independent Video Calling App (`video-app`) with Whiteboard, Notes & Dynamic Link Generation
- **Phase 2**: Doctor Scheduling & Timezone Engine (Shared Backend)
- **Phase 3**: Patient Website & Guest Booking (`patient-website`)
- **Phase 4**: Doctor & Admin Dashboard (`doctor-panel`) with Fee Management & Patient DB
- **Phase 5**: Medicine Master, Prescription Maker & Digital PDF
- **Phase 6**: Passwordless Patient Portal (`patient-website`)
- **Phase 7**: Quality Assurance, Security Hardening & Launch Readiness

## 18. Acceptance criteria

-   Three top-level folders (`patient-website/`, `doctor-panel/`, `video-app/`), each containing dedicated `frontend/` and `backend/`.
-   `doctor-panel` and `patient-website` connect to and operate on the exact same shared PostgreSQL database.
-   `video-app` is completely independent with its own signaling backend and video frontend.
-   Guest booking works without password account.
-   Country/timezone selection works, including multi-timezone
    countries.
-   Patient-local time and IST are correct.
-   Double booking is prevented.
-   Holds expire correctly.
-   Payment webhook controls confirmation and is idempotent.
-   INR 150 is initial configurable India fee; international price can
    remain pending.
-   Admin dashboard supports fee management, prescription maker, patient
    database, and consultation link generation.
-   Video calling platform is standalone and unbranded, supporting dynamic link generation by external
    systems.
-   Video platform supports screen share, mute, cam, settings, drawing
    canvas (whiteboard), and note taker.
-   Video calls are unrecorded; recording disabled.
-   Call start/end/duration stored.
-   Doctor can enter optional vitals; missing values show `—`.
-   Medicine master starts empty and supports custom rows.
-   Doctor approves every prescription.
-   PDF is private, emailed, and available in portal.
-   Patient sees only own records; internal notes remain private.
-   Theme switcher with Light, Dark, and System modes is accessible across the patient website, doctor/admin dashboard, and video calling app without theme flashing.

## 19. Pending client decisions

Doctor identity/credentials/profile; international fee/currencies;
launch countries; working days; final slot length/buffer;
cancellation/refund policy; payment provider eligibility; email
verification timing; document uploads; in-call chat; reminder schedule;
approved consent/privacy wording; prescription signature/legal
requirements; hosting/data residency; brand and languages.

## 20. Antigravity instruction

Read all project documentation files (`PRD.md`, `architecture.md`, `design.md`, `rules.md`, `Security.md`, `memory.md`, and `phases.md`) before coding. First propose
architecture, schema, folder structure, external services, security
risks, milestones, and unanswered decisions. Do not start major
implementation until the plan is reviewed. Build incrementally following
`phases.md` and test timezone conversion, slot conflicts, payment webhooks,
passwordless access, authorization, video access, and prescription generation.
