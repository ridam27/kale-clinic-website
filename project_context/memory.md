# Project Memory and Handoff Log

**Project:** International Online Homeopathy Consultation Platform\
**Created:** 2026-11-06 20:55 IST\
**Log timezone:** Asia/Kolkata\
**Purpose:** Portable chronological context for future AI assistants and
developers.

------------------------------------------------------------------------

## 1. Mandatory instructions for future AI assistants

Read this file and the other six project documents (`PRD.md`, `architecture.md`, `design.md`, `rules.md`, `Security.md`, `phases.md`, and `memory.md`) before making
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

  Folder structure        Three top-level folders:   DECIDED
                          1. patient-website/        
                             (frontend/ & backend/)  
                          2. doctor-panel/           
                             (frontend/ & backend/)  
                          3. video-app/              
                             (frontend/ & backend/)  

  Database model          patient-website and        DECIDED
                          doctor-panel share the     
                          exact same PostgreSQL DB.  
                          video-app is completely    
                          independent.               

  Video platform          Completely independent     DECIDED
                          video calling app with     
                          screen share, mute, cam,   
                          settings, drawing canvas   
                          (whiteboard), and note     
                          taker. Dynamic link        
                          generation supported.      

  Admin / Doctor panel    Shares the exact same      DECIDED
                          database as the website.   
                          Supports fee management,   
                          prescription maker,        
                          patient database, and      
                          consultation link gen.     

  Theme switcher          Light, Dark, and System    DECIDED
                          switcher available across  
                          all surfaces (patient      
                          website, admin panel,      
                          and video calling app).    

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
-   Patient website and doctor/admin dashboard share the exact same PostgreSQL database.
-   Doctor panel manages fees, prescription builder, patient database, and dynamic consultation link generation.
-   Video calling application is an independent project in a separate repository (pure video calling app, not coupled to clinic subdomains).
-   Video app includes screen share, mute, cam, settings, drawing canvas, and note taker.
-   Video app supports dynamic link generation by external systems (including doctor's backend).
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

Documentation baseline: - `PRD.md` - `Security.md` -
`architecture.md` - `rules.md` - `design.md` - `phases.md` - `memory.md`

These seven files should be maintained together. If a conflict exists,
record the resolution in a new dated entry and update the relevant
source document.

## 8. Change Log

### 2026-11-07 09:10 IST — Project divided into phases.md & 3-folder architecture formalized

**Status:** DECIDED

**Work completed**
- Created [`phases.md`](phases.md) detailing the complete implementation breakdown:
  - Phase 0: Repository Scaffolding (3 folders) & Shared Database Foundation
  - Phase 1: Completely Independent Video Calling App (`video-app`)
  - Phase 2: Doctor Scheduling & Timezone Engine
  - Phase 3: Patient Website & Guest Booking (`patient-website`)
  - Phase 4: Doctor & Admin Dashboard (`doctor-panel`)
  - Phase 5: Medicine Master, Prescription Builder & Digital PDF
  - Phase 6: Passwordless Patient Portal
  - Phase 7: QA, Security Hardening & Launch Readiness
- Formalized workspace structure into three folders, each containing `frontend/` and `backend/`:
  1. `patient-website/` (`frontend/`, `backend/`)
  2. `doctor-panel/` (`frontend/`, `backend/`) — shares the exact same PostgreSQL database as `patient-website`.
  3. `video-app/` (`frontend/`, `backend/`) — completely independent video calling platform.
- Synchronized `PRD.md`, `architecture.md`, `rules.md`, `Security.md`, and `phases.md`.

**Decisions**
- Three top-level folders: `patient-website/`, `doctor-panel/`, and `video-app/`, each with decoupled `frontend/` and `backend/`.
- `patient-website` and `doctor-panel` share the exact same PostgreSQL database.
- `video-app` is completely independent (its own signaling backend, WebRTC frontend, dynamic link API).
- Universal Light / Dark / System theme switcher across all three frontends.

**Files changed**
- `project_context/phases.md` (created)
- `project_context/architecture.md`
- `project_context/PRD.md`
- `project_context/rules.md`
- `project_context/memory.md`

**Next action**
- Ready to proceed with Phase 0 scaffolding.

### 2026-11-07 00:15 IST — Everywhere Light / Dark / System theme switcher requirement added

**Status:** DECIDED

**Work completed**
- Updated `design.md` with:
  - Extended color token definitions for both Light Mode and Dark Mode.
  - Added dedicated Theme Switcher specification across all surfaces: Light, Dark, and System (`prefers-color-scheme`).
  - Added theme switcher to reusable components list.
- Updated `PRD.md`:
  - Added theme switcher requirement across patient website & portal, doctor/admin dashboard, and the independent video calling app.
  - Added acceptance criteria for theme switching without FOUC (flash of unstyled content).
- Updated `rules.md`:
  - Mandated theme switcher support and WCAG 2.2 AA contrast compliance in both palettes.
- Updated `memory.md`:
  - Added theme switcher to Confirmed decisions table.

**Decisions**
- Light mode, Dark mode, and System mode switcher must be available everywhere (patient website, admin panel, and video calling app).

**Files changed**
- `project_context/design.md`
- `project_context/PRD.md`
- `project_context/rules.md`
- `project_context/memory.md`

**Tests and verification**
- Verified theme tokens, contrast considerations, and FOUC prevention rules across all 4 updated documents.

**Next action**
- Ready to proceed with project scaffolding (Phase 1).

### 2026-11-06 23:55 IST — Video platform decoupling and Admin/Doctor panel shared DB alignment

**Status:** DECIDED

**Work completed**
- Read and reviewed all 6 documentation files.
- Updated all project context documents to incorporate two critical architectural requirements:
  1. **Independent Video Calling Platform (New / Separate Repo)**:
     - The video calling platform is maintained in an independent repository as a pure, standalone video calling application (uncoupled from clinic branding/subdomains such as `doctor.videocall.com`).
     - Core built-in features: Screen share, camera toggle (cam), microphone toggle (mute), device settings, interactive drawing canvas (whiteboard), and an in-call note taker where the doctor writes consultation notes.
     - Supports dynamic link generation callable by external systems (the doctor's backend will dynamically generate consultation links for this platform).
     - Strict unrecorded calls policy maintained.
  2. **Doctor / Admin Panel Architecture**:
     - The doctor/admin panel and the public patient website share the **exact same PostgreSQL database**.
     - Full support for:
       - **Fee management**: Configurable consultation fees (India INR 150 base, international pricing, initial vs. follow-up consultation rates).
       - **Prescription maker**: Structured medicine catalogue, potencies, dosages, meal instructions, live preview, versioning, and immutable PDF generation.
       - **Patient database**: Comprehensive patient history, previous appointments, prescriptions, call metadata, and follow-ups.
       - **Dynamic video link generation**: Generating and launching consultation rooms for confirmed bookings.

**Decisions**
- Video calling platform is housed in its own separate repository and decoupled from doctor-branded domains.
- Video app features screen share, cam, mute, settings, drawing canvas, note taker, and external dynamic link generation API.
- Doctor backend generates meeting links dynamically for the video platform.
- Doctor dashboard and patient website share a unified PostgreSQL database.

**Files changed**
- `project_context/PRD.md`
- `project_context/architecture.md`
- `project_context/design.md`
- `project_context/rules.md`
- `project_context/Security.md`
- `project_context/memory.md`

**Tests and verification**
- Verified all 6 files for consistency, cross-references, and alignment with non-negotiable rules.

**Open questions / blockers**
- Clarification on whether the video app note taker should optionally push notes back to the clinic consultation workspace via webhook/API upon call completion, or if doctor copies/maintains them in the consultation notes tab.
- Tech stack preference for the separate video platform repository (e.g. Next.js + LiveKit / WebRTC).

**Next action**
- Await client feedback on implementation milestones and video platform repository setup.

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
