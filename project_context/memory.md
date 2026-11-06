# Project Memory and Handoff Log

**Project:** International Online Homeopathy Consultation Platform\
**Created:** 2026-11-06 20:55 IST\
**Log timezone:** Asia/Kolkata\
**Purpose:** Portable chronological context for future AI assistants and
developers.

------------------------------------------------------------------------

## 1. Mandatory instructions for future AI assistants

Read this file and the other five project documents before making
changes.

At the end of every meaningful work session: 1. Add a new entry at the
top of the Change Log. 2. Use the actual current date/time and timezone
(`Asia/Kolkata` / IST preferred). 3. Record completed work, decisions,
files changed, tests/results, blockers, and next action. 4. Do not
invent timestamps or test results. 5. Never delete historical entries.
Correct old information with a new dated correction. 6. Update the
relevant source document as well as this file. 7. Verify implementation
in the repository; a planned feature is not an implemented feature. 8.
If moving to another AI tool, provide all six documents and the current
repository.

Status labels: - **DECIDED**: confirmed by client/user. - **PROPOSED**:
recommendation awaiting approval. - **PENDING**: unresolved. -
**IMPLEMENTED**: verified in repository and tested. - **BLOCKED**:
cannot proceed. - **SUPERSEDED**: replaced by a newer decision; retain
historical entry.

If exact time is unavailable, record date and say time unknown. Do not
fabricate.

## 2. Project summary

A single homeopathic doctor wants an international online consultation
platform. It includes a public patient site, guest booking, passwordless
patient portal, doctor/admin dashboard, independent unrecorded video
app, consultation notes/vitals, medicine master, prescription builder,
PDF/email, payments, follow-ups, and patient history.

This is a healthcare workflow platform, not only a marketing website.

## 3. Confirmed decisions as of 2026-11-06

  --------------------------------------------------------------------------
  Topic                   Decision                   Status
  ----------------------- -------------------------- -----------------------
  Doctor count            One doctor initially       DECIDED

  Patient account         No compulsory traditional  DECIDED
                          registration/password      

  Booking                 Guest booking              DECIDED

  Patient records         Passwordless email OTP or  DECIDED
                          secure magic link          

  Consultation            Paid                       DECIDED

  India fee               INR 150 initially          DECIDED

  International fee       Not decided                PENDING

  Fee changes             Must be admin-configurable DECIDED

  Follow-up               Required                   DECIDED

  Video                   Independent app with       DECIDED
                          dynamically generated      
                          meeting link               

  Recording               No recording               DECIDED

  Medicine list           No existing list; starts   DECIDED
                          empty and doctor adds      
                          entries                    

  Patient history         Previous appointment       DECIDED
                          date/time, prescription,   
                          call duration              

  Prescription            Digitally generated PDF    DECIDED

  Signature               No uploaded/handwritten    DECIDED, subject to
                          signature required in      compliance review
                          initial scope              

  Notifications           Email                      DECIDED

  WhatsApp                Not required               DECIDED

  Country/timezone        Patient selects country;   DECIDED
                          timezone options load      
                          dynamically                

  Doctor timezone         `Asia/Kolkata` (IST)       DECIDED

  Initial working hours   9 AM--12 PM IST requested  DECIDED as initial
                                                     schedule; days pending

  Slot length             30 minutes used as example PROPOSED; confirm

  Advance payment         Full payment at booking    PROPOSED

  Video technology        WebRTC with LiveKit or     PROPOSED
                          equivalent                 

  Frontend                Next.js/React/TypeScript   PROPOSED

  Backend                 NestJS or structured       PROPOSED
                          Next.js API                

  Database                PostgreSQL                 PROPOSED
  --------------------------------------------------------------------------

## 4. Key non-negotiable product rules

-   Guest booking; no compulsory password account.
-   Patient records require email OTP/magic-link verification.
-   Booking ID is not proof of identity.
-   Doctor availability authored in IST.
-   Patient chooses country; load applicable IANA timezones and suggest
    browser timezone.
-   Show patient-local time and IST.
-   Store appointment instants in UTC.
-   Availability originates from doctor's schedule.
-   Payment verified server-side via provider webhook.
-   Never trust browser price, payment status, role, availability, or
    ownership.
-   No video recording/transcription/AI summaries.
-   Store call start/end/duration metadata only.
-   Medicine master starts empty.
-   Doctor alone determines medicine, potency, dosage, frequency,
    duration, and meal instructions.
-   Missing vitals show `—`; never infer values.
-   Doctor reviews/finalizes every prescription.
-   Finalized prescriptions are versioned and not silently overwritten.
-   PDFs stored privately.
-   Email notifications only; no WhatsApp.
-   AI must not diagnose, prescribe, or recommend medicines.

## 5. Initial pricing and scheduling

Pricing: - India: INR 150 initially. - International fee pending. -
Admin configurable. - Historical bookings retain price/currency
snapshot. - International booking may remain disabled until price,
gateway eligibility, and legal coverage are confirmed.

Scheduling: - Doctor timezone `Asia/Kolkata`. - Requested hours
09:00--12:00 IST. - Example 30-minute slots: 09:00, 09:30, 10:00, 10:30,
11:00, 11:30. - Working days, final duration, and buffer pending.

## 6. Open questions

1.  Doctor's name, qualifications, registration number, biography,
    photo, clinic/contact details.
2.  International consultation fee and currencies.
3.  Countries to enable at launch.
4.  Working days and confirmation of 9 AM--12 PM every working day.
5.  Final appointment duration and buffer.
6.  Cancellation/rescheduling/refund policy.
7.  Payment gateway and international merchant eligibility.
8.  Email verification before payment or only before records access.
9.  Patient document uploads in first release?
10. In-call chat?
11. Reminder schedule?
12. Consent, privacy, disclaimer, and terms approved by doctor/advisor?
13. Professional/regulatory prescription requirements, including
    signature.
14. Hosting region/data residency.
15. Brand name, logo, palette, languages.

Do not silently invent answers.

## 7. Implementation status at creation

No application code has been verified in this memory file.

Initial documentation baseline: - `PRD.md` - `Security.md` -
`architecture.md` - `rules.md` - `design.md` - `memory.md`

These six files should be maintained together. If a conflict exists,
record the resolution in a new dated entry and update the relevant
source document.

## 8. Change Log

### 2026-11-06 20:55 IST --- Initial project context captured

**Status:** Initial baseline.

Context: User is preparing a software project for a homeopathic doctor
who wants online consultations for patients in India and abroad.

Confirmed scope: - One doctor. - Guest appointment booking; no mandatory
password account. - Passwordless access to patient history. - Paid
consultations. - India fee INR 150 initially; international fee
undecided. - Fees configurable. - Follow-up appointments. - Independent
video app with dynamically generated links. - No video recording. -
Medicine database starts empty; doctor adds medicines. - Patient can
access prior appointment dates/times, prescriptions, and call
duration. - Digital prescription PDF; no uploaded signature required in
initial scope. - Email notifications; no WhatsApp. - Patient chooses
country; timezone options dynamically loaded. - Initial doctor hours
requested: 9 AM--12 PM IST.

Proposals: - Full advance payment. - 30-minute slots. - PostgreSQL,
TypeScript, Next.js, NestJS/Next API. - WebRTC/LiveKit or equivalent. -
Private object storage. - Email OTP or magic link.

Files created: - `PRD.md` - `Security.md` - `architecture.md` -
`rules.md` - `design.md` - `memory.md`

Implementation status: No application code verified.

Next action: Ask Antigravity to read all six documents and propose
architecture, schema, folder structure, external services, risks, and
phased implementation plan before coding.

## 9. Future entry template

Copy this at the top of Change Log for each meaningful session:

``` md
### YYYY-MM-DD HH:MM TZ — Short title
**Status:** DECIDED / PROPOSED / PENDING / IMPLEMENTED / BLOCKED / SUPERSEDED

**Work completed**
- ...

**Decisions**
- ...

**Files changed**
- ...

**Tests and verification**
- ...

**Open questions / blockers**
- ...

**Next action**
- ...

**Supersedes**
- None, or identify earlier decision.
```

**End of project memory file.**
