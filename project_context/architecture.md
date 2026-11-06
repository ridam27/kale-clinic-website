# Application Architecture

**Status:** Proposed architecture\
**Last updated:** 2026-11-06 20:55 IST

## 1. Overview

Three application surfaces share a secure backend: 1. Patient website
and portal. 2. Doctor/admin dashboard. 3. Independent video consultation
application.

Video media traffic should use dedicated WebRTC/media infrastructure,
not ordinary API requests.

## 2. Logical architecture

``` mermaid
flowchart TB
    P[Patient Browser] --> WEB[Patient Website / Portal]
    D[Doctor Browser] --> DASH[Doctor Dashboard]
    P --> VIDEO[Independent Video App]
    D --> VIDEO
    WEB --> API[Backend API / Services]
    DASH --> API
    VIDEO --> API
    API --> DB[(PostgreSQL)]
    API --> STORE[Private Object Storage]
    API --> EMAIL[Email Provider]
    API --> PAY[Payment Gateway]
    API --> VCONF[Video Provider API]
    VIDEO <--> MEDIA[WebRTC Media Infrastructure]
    MEDIA --> EVENTS[Session Events]
    EVENTS --> API
```

## 3. Suggested stack

  -----------------------------------------------------------------------
  Layer                               Proposal
  ----------------------------------- -----------------------------------
  Language                            TypeScript

  Patient frontend                    Next.js / React

  Doctor dashboard                    Next.js / React

  Backend                             NestJS or structured Next.js API

  Database                            PostgreSQL

  ORM                                 Prisma or Drizzle

  Authentication                      Email OTP / secure magic link

  Video                               WebRTC with LiveKit or equivalent

  PDF                                 Server-side HTML-to-PDF

  Email                               Resend / Amazon SES / equivalent

  Storage                             Private S3-compatible object
                                      storage

  Payments                            Provider approved for Indian and
                                      required international payments

  Hosting                             Reliable cloud hosting, backups,
                                      monitoring
  -----------------------------------------------------------------------

These are proposals; explain trade-offs before changing major choices.

## 4. Application boundaries

### Patient website

Public pages, country/timezone selection, slot browsing, guest booking,
checkout initiation, passwordless portal, appointment and prescription
history. No privileged secrets or authoritative business logic.

### Doctor dashboard

Privileged authentication, availability, appointments, patients,
consultations, vitals, medicines, prescriptions, follow-ups, payments,
settings.

### Independent video app

Appointment-aware join, camera/mic controls, waiting room, secure room,
session status, reconnect handling. Backend authorizes access; app does
not independently decide eligibility.

### Backend modules

Identity/auth, patients, doctor profile, availability, booking, pricing,
payments, consultations, vitals, medicines, prescriptions, PDF, email,
video orchestration, audit, admin settings, optional patient documents.

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

## 8. Video architecture

Backend validates confirmed appointment and join window, creates room,
issues short-lived role-limited tokens. Video service handles media.
Authenticated provider events update session metadata. Recording
disabled at provider and application levels.

## 9. Prescription architecture

Doctor saves draft → reviews preview → explicitly finalizes → backend
creates immutable version → PDF renderer uses finalized snapshot →
private object storage → email link/attachment → portal checks ownership
before download.

PDF must use the historical prescription snapshot, not mutable current
medicine data.

## 10. Suggested monorepo

``` text
homeopathy-platform/
├── apps/
│   ├── patient-web/
│   ├── doctor-dashboard/
│   ├── video-app/
│   └── api/
├── packages/
│   ├── ui/
│   ├── shared-types/
│   ├── validation/
│   ├── timezone/
│   └── config/
├── infrastructure/
│   ├── deployment/
│   ├── monitoring/
│   └── scripts/
├── docs/
│   ├── PRD.md
│   ├── Security.md
│   ├── architecture.md
│   ├── rules.md
│   ├── design.md
│   └── memory.md
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
