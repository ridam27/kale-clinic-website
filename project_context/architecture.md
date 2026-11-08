# Application Architecture

**Status:** Confirmed architecture  
**Last updated:** 2026-11-08 14:05 IST  

## 1. Overview

The repository is organized into three distinct top-level folders, each containing separate `frontend/` and `backend/` sub-directories with **completely decoupled, independent `node_modules` and local `.env` files**:

1. **`patient-website/` (Patient Website & Records Portal)**:
   - `frontend/`: Public patient-facing Next.js/React application (guest booking, timezone converter, passwordless portal, Light/Dark/System theme switcher).
   - `backend/`: Dedicated API for patient operations (availability queries, booking holds, payment processing, OTP verification).
   - **Shared Database**: Accesses the shared Supabase PostgreSQL database via local `@kale/database` (`file:../../packages/database`).

2. **`doctor-panel/` (Doctor & Admin Management Dashboard)**:
   - `frontend/`: Doctor-facing Next.js/React dashboard (fee management, prescription maker, patient database, appointment calendar, Light/Dark/System theme switcher).
   - `backend/`: Dedicated API for clinical and administrative management (prescriptions, medicine master, fee rules, appointment status, dynamic consultation link generation).
   - **Shared Database**: Operates on the **exact same Supabase PostgreSQL database** as `patient-website` via local `@kale/database` (`file:../../packages/database`).

3. **`video-app/` (Completely Independent Video Calling Platform)**:
   - `frontend/`: Standalone WebRTC video calling web application featuring multi-peer streaming, Google Meet tile alignment, pinned screen presentation, camera toggle, microphone mute/unmute, settings modal, interactive drawing canvas (whiteboard), note taker, and Light/Dark/System theme switcher.
   - `backend/`: Completely independent signaling server, room lifecycle manager, active presentation synchronizer, and dynamic link generation API (callable by external systems such as `doctor-panel/backend`).
   - Independent data lifecycle; zero recording or media storage.
   - Completely independent dependencies (`video-app/backend/node_modules`, `video-app/frontend/node_modules`) and local `.env`.

## 2. Logical architecture

``` mermaid
flowchart TB
    subgraph PATIENT_SVC ["Folder 1: patient-website/"]
        P_USER[Patient Browser] --> P_FE[frontend/\nNext.js + Theme Switcher]
        P_FE --> P_BE[backend/\nPatient API]
    end

    subgraph DOCTOR_SVC ["Folder 2: doctor-panel/"]
        D_USER[Doctor Browser] --> D_FE[frontend/\nDashboard + Theme Switcher]
        D_FE --> D_BE[backend/\nAdmin & Doctor API]
    end

    subgraph SHARED_DATA ["Shared Data & Services Layer"]
        SHARED_DB[(Shared Standard PostgreSQL DB\nPortable via DATABASE_URL:\nSupabase / Neon / RDS / Docker)]
        P_BE --> SHARED_DB
        D_BE --> SHARED_DB
        P_BE --> EXT_PAY[Payment Gateway\nRazorpay / Stripe]
        P_BE --> EXT_EMAIL[Dual Failover Email Engine\nPrimary: Gmail SMTP\nSecondary: Resend]
        D_BE --> EXT_STORE[Private Object Storage\nCloudflare R2 - 10 GB Free\nZero Egress Fees]
    end

    subgraph VIDEO_SVC ["Folder 3: video-app/ (Completely Independent)"]
        D_BE -.->|Dynamic Link Generation Request| V_BE[backend/\nSignaling & Link Gen API]
        P_USER -.->|Join with Dynamic Link| V_FE[frontend/\nWebRTC Video App\n- Screen Share\n- Cam / Mute\n- Settings\n- Whiteboard\n- Note Taker\n- Theme Switcher]
        D_USER -.->|Join with Dynamic Link| V_FE
        V_FE <--> V_MEDIA[WebRTC Media Infrastructure]
        V_BE --> V_MEDIA
        V_MEDIA -.->|Call End Metadata Webhook| D_BE
    end
```
```

## 3. Suggested stack

  -----------------------------------------------------------------------
  Layer                               Choice & Specification
  ----------------------------------- -----------------------------------
  Language                            Pure JavaScript (ES Modules, .js, .jsx)

  Patient frontend                    Next.js / React (JavaScript) + Tailwind CSS

  Doctor dashboard                    Next.js / React (JavaScript) + Tailwind CSS

  Backend                             Node.js / Express / Next.js API (JavaScript)

  Database                            Standard PostgreSQL (via DATABASE_URL; zero
                                      vendor lock-in, compatible with Supabase,
                                      Neon, AWS RDS, or self-hosted Docker)

  ORM / Query Engine                  Prisma or standard PostgreSQL driver (JS)

  Authentication                      Email OTP / secure magic link (Node.js)

  Video                               WebRTC / SFU signaling (JavaScript)

  PDF                                 Server-side HTML-to-PDF (Node.js)

  Email (Failover Engine)             Automated Dual-Provider Failover:
                                      - Primary: Gmail SMTP (Nodemailer, 500/day)
                                      - Secondary: Resend (Edge API, 3,000/mo)

  Storage                             Cloudflare R2 (10 GB free forever, $0
                                      egress/bandwidth fees, S3-compatible JS SDK)

  Payments                            Razorpay / Stripe (Server webhook verification)

  Themes                              Universal Light, Dark, System Switcher
  -----------------------------------------------------------------------

These are proposals; explain trade-offs before changing major choices.

## 4. Application boundaries

### Patient website & portal
Public pages, country/timezone selection, slot browsing, guest booking, checkout initiation, passwordless portal, appointment history, and prescription downloads. Connects to shared PostgreSQL database via Clinic Backend API.

### Doctor / Admin dashboard
Privileged authenticated dashboard sharing the **exact same database** as the patient website. Core capabilities:
- **Fee management**: Configure India/international consultation fees, initial vs. follow-up rates, currency settings.
- **Prescription maker**: Medicine selection from master catalogue, custom item addition, potencies, dosages, meal instructions, draft preview, immutable version finalization, and PDF generation.
- **Patient database**: Complete clinical and demographic history, past appointments, prescriptions, call metadata, and follow-up tracking.
- **Dynamic link generation**: Backend triggers link generation for confirmed appointments targeting the independent video platform.
- **Availability & calendar**: Scheduling rules in `Asia/Kolkata`, slot generation, exceptions, booking approvals.

### Independent video calling platform (Separate Repo)
Standalone video calling application running in its own repository and deployment:
- Core features: screen share, camera toggle, microphone toggle, settings modal, interactive drawing canvas (whiteboard), and an in-call note taker where notes can be taken during calls.
- Dynamic link generation: Exposes an API / dynamic tokenized room link generation mechanism callable by external systems (such as the clinic backend).
- Media infrastructure: WebRTC/SFU based (LiveKit or equivalent). No call recording or video storage.

### Backend modules (Clinic Platform)
Identity/auth, patients, doctor profile, availability, booking, fee management & pricing, payments, consultations, vitals, medicines, prescriptions, PDF generation, email notifications, dynamic video link orchestration, audit logging, admin settings.

## 5. Source of truth

  Data                       Authority
  -------------------------- -------------------------------------------
  Doctor availability        Backend rules in `Asia/Kolkata`
  Appointment instant        UTC timestamp in database
  Patient display timezone   Selected IANA timezone
  Price                      Server pricing config + booking snapshot
  Payment status             Verified provider event + internal record
  Patient identity           Verified email identity
  Record ownership           Backend authorization
  Prescription               Doctor-approved versioned record
  PDF                        Private storage, referenced by backend
  Video access               Backend-issued short-lived token
  Call duration              Server/video service events

## 6. Scheduling architecture

-   Store recurring availability as local wall-clock rules in
    `Asia/Kolkata`.
-   Generate slot instants using IANA timezone library.
-   Store appointment start/end in UTC.
-   Store patient's selected IANA timezone.
-   Derive local display from UTC + timezone.
-   Show patient-local time and IST.
-   Do not store a fixed offset as a timezone.
-   Recalculate future slots with current timezone database.
-   Use transactions/constraints to prevent conflicts.

``` mermaid
sequenceDiagram
    participant Patient
    participant Web
    participant API
    participant DB
    participant Pay
    Patient->>Web: Choose country, timezone, date
    Web->>API: Request availability
    API->>DB: Read IST rules and bookings
    API-->>Web: Slots in patient timezone and IST
    Patient->>Web: Select slot and submit details
    Web->>API: Create temporary hold
    API->>DB: Reserve slot transactionally
    API-->>Web: Hold and checkout
    Web->>Pay: Complete payment
    Pay-->>API: Signed webhook
    API->>API: Verify signature, amount, currency, order
    API->>DB: Confirm appointment transactionally
    API-->>Patient: Send confirmation email
```

## 7. Payment architecture

Frontend requests checkout. Backend loads price, creates internal
payment record and provider order. Provider webhook is verified
server-side. Backend updates payment and appointment in one
safe/idempotent workflow. Reconciliation should identify
inconsistent/pending transactions.

## 8. Video architecture & dynamic link generation

1. **Independent Service**: The video application runs as an independent platform in its own separate repository, completely uncoupled from doctor-specific subdomains (e.g. standard standalone video calling app).
2. **Dynamic Link Generation**:
   - The video platform provides an endpoint or dynamic link structure (e.g., `https://<videocall-domain>/room/:roomId?token=...` or via backend API) enabling other systems to programmatically generate room links.
   - For confirmed appointments, the clinic backend generates a secure dynamic link for the doctor and patient.
3. **In-Call Capabilities**:
   - Screen share, camera controls, mute/unmute, settings (device/mic selection).
   - **Drawing canvas**: Integrated whiteboard allowing real-time drawing/diagramming during the call.
   - **Note taker**: Doctor writes consultation notes directly within the video calling interface.
4. **Session Metadata**: Authenticated webhook/events update the clinic backend with session metadata (start time, end time, duration).
5. **No Call Recording**: Call recording, media persistence, and audio transcription are strictly disabled.

## 9. Prescription architecture

Doctor saves draft → reviews preview → explicitly finalizes → backend
creates immutable version → PDF renderer uses finalized snapshot →
private object storage → email link/attachment → portal checks ownership
before download.

PDF must use the historical prescription snapshot, not mutable current
medicine data.

## 10. Repository structure

The workspace is structured into three dedicated top-level service directories, each containing its own decoupled `frontend/` and `backend/`:

``` text
Kale-Clinic-Website/
├── patient-website/                  # Folder 1: Patient Website & Portal
│   ├── frontend/                     # Next.js / React (Public site, guest booking, portal, theme switcher)
│   └── backend/                      # Node / Express / NestJS API (Availability, booking, payments, OTP auth)
│
├── doctor-panel/                     # Folder 2: Doctor & Admin Dashboard
│   ├── frontend/                     # Next.js / React (Dashboard, fee mgmt, prescription maker, patient DB, theme switcher)
│   └── backend/                      # Node / Express / NestJS API (Admin auth, prescriptions, fees, dynamic link gen)
│                                     # * SHARES SAME POSTGRESQL DATABASE AS PATIENT-WEBSITE *
│
├── video-app/                        # Folder 3: Completely Independent Video Calling App
│   ├── frontend/                     # WebRTC Video App (Cam/mic, screen share, settings, whiteboard, notes, theme switcher)
│   └── backend/                      # Signaling server, room lifecycle & dynamic link generation API (Independent)
│
├── project_context/                  # Central documentation and specifications
│   ├── PRD.md
│   ├── architecture.md
│   ├── design.md
│   ├── rules.md
│   ├── Security.md
│   ├── memory.md
│   └── phases.md
│
├── .env.example
└── README.md
```

## 11. Database domains

Core tables/entities: - users / identities - patients - doctor_profile -
availability_rules - availability_exceptions - appointments - payments -
consultations - consultation_vitals - medicines - prescriptions -
prescription_items - passwordless_tokens - video_sessions -
video_session_events - email_logs - audit_logs - patient_documents (if
enabled) - prescription_templates - consultation_fee_rules - refunds -
consents - system_settings

Use foreign keys, indexes, migrations, constraints, and transactions.
Store UTC instants and IANA timezone identifiers. Preserve booking price
and prescription medicine snapshots.

## 12. External services

Payment provider, email provider, video infrastructure, object storage,
hosting/database, domain/DNS. Require client approval and credentials.
Wrap provider integrations behind service interfaces where practical.

## 13. Environments

Separate local development, staging, and production. Production needs
HTTPS, protected secrets, backups, monitoring, error tracking,
migrations, rollback plan, and restricted admin access.

## 14. Decisions to approve

-   Monorepo vs separate repositories
-   NestJS vs Next.js backend
-   Payment provider and international eligibility
-   Video provider and deployment
-   Hosting region/data residency
-   OTP vs magic-link workflow
-   PDF renderer
-   Storage/retention
-   Patient uploads in first release

Do not make irreversible choices without documenting the reason and
updating `memory.md`.
