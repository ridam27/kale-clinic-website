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

  Dependency model        No npm workspaces / root   DECIDED
                          hoisting. Each folder has  
                          its own node_modules.      
                          Shared database package    
                          via file: reference.       

  Environment variables   Isolated per-project .env  DECIDED
                          in each folder. No shared  
                          root .env file.            

  Database Provider       Supabase (PostgreSQL)      DECIDED              

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

  Language                Pure JavaScript (.js, .jsx)DECIDED

  Database                Standard PostgreSQL (via   DECIDED
                          DATABASE_URL; zero vendor  
                          lock-in; works with        
                          Supabase, RDS, Neon, etc.) 

  Storage                 Cloudflare R2 (10 GB free  DECIDED
                          forever, zero egress fee,  
                          S3-compatible JS SDK)      

  Email                   Dual Failover Engine:      DECIDED
                          Primary: Gmail SMTP        
                          Secondary: Resend          

  Video technology        WebRTC standalone client   DECIDED

  Frontend                Next.js / React (JS)       DECIDED

  Backend                 Node.js / Express (JS)     DECIDED
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

### 2026-11-08 14:05 IST — Phase 1 Completion, Late-Joiner Presentation Sync, Dual Mobile Layout (Case 1 & 2), and Decoupled Independent Node Modules & Per-Project .env

**Status:** IMPLEMENTED & DECIDED

**Work completed**
- **Phase 1 (Video Calling Platform) Verified Complete**:
  - Independent WebRTC signaling server in `video-app/backend` and Next.js frontend in `video-app/frontend`.
  - Multi-peer conferencing, camera/mic controls, pinned presentation screen, dynamic room generation, collaborative whiteboard with auto-open for patients, and in-call note taker all tested and working.
- **Late-Joiner Screen Presentation Synchronization**:
  - Solved issue where participants joining after a screen presentation had already begun could not see the shared screen.
  - Added room-level `activePresentation` tracking in `video-app/backend/src/index.js` (`{ presenterId, presenterName }`).
  - Broadcasted presentation state to late joiners on `room-joined`, automatically re-negotiating the WebRTC peer connection so late joiners immediately receive the presentation feed.
- **Mobile Presentation Dual Layout (Case 1 & Case 2)**:
  - **Case 1 (Whiteboard / Workspace OPEN + Presentation ON on Mobile)**: Video tiles are hidden (`hidden lg:flex`) to maximize vertical space for the shared screen and drawer. Google Meet–style member count badge displayed in the bottom-right corner of the presentation screen.
  - **Case 2 (Whiteboard CLOSED + Presentation ON on Mobile)**: Full height available; participant video tiles display in a responsive horizontal scrollable carousel (`flex flex-row overflow-x-auto h-20 sm:h-24`) directly below the presentation screen.
- **Codebase Cleanup across `video-app`**:
  - Extracted `stopScreenSharing` helper, removed duplicate track teardown logic, removed unused imports and dead props.
  - Verified pure JavaScript/JSX standards and successful Next.js production builds.
- **Architectural Decoupling: Removal of Root Workspaces & Isolated `node_modules`**:
  - Per user direction, eliminated npm workspaces and root hoisting.
  - Removed `"workspaces"` from root `package.json` and deleted monorepo `package-lock.json`.
  - Configured each folder (`video-app/frontend`, `video-app/backend`, `doctor-panel/frontend`, `doctor-panel/backend`, `patient-website/frontend`, `patient-website/backend`, `packages/database`) to maintain its own independent `node_modules`.
  - Linked shared database package locally via `"@kale/database": "file:../../packages/database"`.
  - Removed unused `@kale/shared-types` dependency entries.
  - Updated root scripts to standard `--prefix` flags (`npm run dev:video:fe`, etc.).
- **Per-Project Isolated `.env` Architecture**:
  - Decoupled from root `.env` requirement.
  - Backends now load local `.env` via `path.join(__dirname, '../.env')`.
  - Added dedicated `.env.example` templates in each sub-directory.
  - Database confirmed to use Supabase (PostgreSQL).

**Files changed**
- `package.json`
- `package-lock.json`
- `video-app/backend/src/index.js`
- `video-app/backend/package.json`
- `video-app/backend/.env.example`
- `video-app/frontend/package.json`
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `video-app/frontend/.env.example`
- `doctor-panel/backend/package.json`
- `doctor-panel/backend/src/index.js`
- `doctor-panel/backend/.env.example`
- `doctor-panel/frontend/package.json`
- `doctor-panel/frontend/.env.example`
- `patient-website/backend/package.json`
- `patient-website/backend/src/index.js`
- `patient-website/backend/.env.example`
- `patient-website/frontend/package.json`
- `patient-website/frontend/.env.example`
- `packages/database/.env.example`
- `project_context/memory.md`
- `project_context/phases.md`
- `project_context/architecture.md`

### 2026-11-07 17:15 IST — Multi-Peer Video Streaming, Google Meet Tile Alignment, Pinned Presentation with Right-Aligned Video Tiles, and Laptop Sidebar Optimization

**Status:** IMPLEMENTED

**Work completed**
- **Multi-Peer Video Streaming (Every Participant Visible to Everyone)**:
  - Transitioned from single-peer stream to multi-peer registry `remoteStreams: Map<peerId, MediaStream>`.
  - Every connected participant (Doctor, Patient, Guardian 1, Guardian 2) has an independent `<ParticipantVideoTile>` with their own video stream, camera-off fallback initials, mic status, and name pill.
- **Google Meet Tile Alignment (Normal Gallery Mode)**:
  - 1 participant: Centered card.
  - 2 participants: Equal side-by-side 50/50 split on desktop/tablet (`grid-cols-2`), stacked on mobile (`grid-rows-2`).
  - 3 participants: 3-column split on desktop/tablet (`grid-cols-3`), responsive wrap on mobile.
  - 4 participants: 2x2 grid (`grid-cols-2 grid-rows-2`).
  - 5+ participants: Responsive auto-fill grid (`grid-cols-2 md:grid-cols-3`).
- **Pinned Screen Presentation + Right-Aligned Video Tiles**:
  - When a screen is shared (by doctor or patient), it is automatically **PINNED** in the primary stage (`object-contain bg-black rounded-2xl`, zero edge cutoff).
  - **All participant webcam tiles are aligned to the RIGHT of it** in a dedicated vertical sidebar (`w-64 lg:w-72 xl:w-80`) on desktop/laptop.
  - On mobile/tablet, webcam tiles align underneath in a compact scrollable strip (`h-24 sm:h-32`), keeping the presentation dominant without hiding any webcam.
- **Laptop Clipboard / Sidebar Width Optimization**:
  - Reduced Whiteboard & NoteTaker drawer width from `440px - 500px` down to **`320px - 360px`** (`w-[320px] lg:w-[360px]`).
  - Maintains 50/50 height split when both Whiteboard and Notes are open, freeing up maximum screen space for the video tiles.
- **Universal Zero-Overflow Responsiveness**:
  - Bound viewport to `h-[100dvh] w-screen overflow-hidden` with `min-h-0` and `min-w-0` constraints on all flex containers. Nothing overflows the viewport on mobile, tablet, laptop, or desktop.

**Files changed**
- `video-app/backend/src/index.js`
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `video-app/frontend/src/components/Whiteboard.jsx`
- `video-app/frontend/src/components/NoteTaker.jsx`
- `project_context/memory.md`

### 2026-11-07 16:40 IST — Universal Responsive Layout, Auto Fit/Fill, Screen Presentation Alignment, 50/50 Whiteboard+Notes, and Auto-Open Patient Whiteboard

**Status:** IMPLEMENTED

**Work completed**
- **Universal Responsiveness across Desktop, Laptop, Tablet & Mobile**:
  - Bound viewport to `100dvh` to eliminate mobile URL bar jump bugs.
  - Controls toolbar and header adapt smoothly across all screen breakpoints (`sm`, `md`, `lg`).
- **Auto Fit vs. Fill for Incoming Video**:
  - Webcam feeds automatically default to `object-cover` (filling the video card with no black letterboxes).
  - Shared screen presentations automatically switch to `object-contain` (fitting the whole screen with zero cropped edges).
  - Added a 1-click **[Fit / Fill]** toggle button on the remote video tile.
- **Participant & Presentation Name Pills**:
  - Pill badges on all video tiles: `Dr. Kale (You)`, `Rahul (Patient)`, `Dr. Kale (Doctor)`, with real-time mic status.
  - Screen presentation banner: `Dr. Kale is presenting screen` / `You are presenting screen`.
- **Proportional Presentation Layout (Zero Hidden Tiles)**:
  - When screen presentation is active, neither webcam is hidden:
    - Desktop/Laptop: Presentation takes main stage; Doctor and Patient webcams are stacked in a proportional side column.
    - Tablet: Webcam tiles neatly align in a 2-tile row under the presentation.
    - Mobile: Presentation takes top ~60%, and both webcams take the bottom ~40% in an equal 50/50 split (`grid grid-cols-2`).
- **Locked Whiteboard Aspect Ratio & 50/50 Workspace Pane**:
  - Locked drawing canvas to standard `16:9` aspect ratio across all devices so strokes map 1:1 without distortion or stretching.
  - When Doctor opens Whiteboard + Notes, the right sidebar divides into 50% Whiteboard (top) and 50% NoteTaker (bottom). Both same size!
  - On mobile portrait mode, Whiteboard takes half the screen (`h-1/2`) while maintaining the exact host 16:9 ratio.
- **Doctor Auto-Open Whiteboard for Patient**:
  - Added `"Share to Patient"` / `"Synced to Patient"` toggle button on the Host Whiteboard header.
  - Toggling emits `toggle-patient-whiteboard` via Socket.io, which automatically opens the Whiteboard on the patient's screen in real time.

**Files changed**
- `video-app/backend/src/index.js`
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `video-app/frontend/src/components/Whiteboard.jsx`
- `video-app/frontend/src/components/NoteTaker.jsx`
- `project_context/memory.md`

### 2026-11-07 15:35 IST — Peer-to-Peer WebRTC Audio/Video Streaming Implemented

**Status:** IMPLEMENTED

**Work completed**
- **WebRTC PeerConnection Integration (`RTCPeerConnection`)**:
  - Implemented client-side WebRTC peer connection management in `video-app/frontend/src/app/room/[roomId]/page.jsx`.
  - Configured Google public STUN servers (`stun:stun.l.google.com:19302`, `stun1`, `stun2`) for reliable NAT traversal and local LAN candidate exchange.
  - Automated negotiation:
    - When a peer enters (`peer-joined`), the existing peer initiates an SDP Offer with audio and video (`createOffer`).
    - The joining peer receives `webrtc-offer`, creates an `RTCPeerConnection`, sets remote description, and responds with `webrtc-answer`.
    - Both peers exchange trickle ICE candidates (`webrtc-ice-candidate`) with a candidate queue safeguarding against early candidate arrival before remote description is set.
    - `pc.ontrack` binds the remote media stream directly to `remoteVideoRef.current.srcObject` and invokes playback.
  - Live track swapping:
    - Screen sharing dynamically replaces the video track on active `RTCRtpSenders` via `replaceTrack`.
    - In-call camera/mic toggling dynamically re-acquires media if joining initially without permissions and attaches new tracks to live peer connections.

**Files changed**
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `project_context/memory.md`

### 2026-11-07 15:15 IST — Mobile/Tablet Responsiveness, Icon-Only Members Button, Doctor-Only Link Sharing, and Mobile Camera Fix

**Status:** IMPLEMENTED

**Work completed**
- **Link Sharing Permissions**:
  - The "Share Consultation Link" button is strictly restricted to the Doctor (`isDoctor`).
  - Removed completely from the view of patients and guardians to avoid confusion and clutter.
- **Icon Button for Members**:
  - Replaced text button with a compact, circular icon button: `<Users className="w-4 h-4" />` with an overlay badge showing active member count (and pulsating alert for waiting guests).
- **Mobile & Tablet Responsiveness**:
  - **Bottom Call Toolbar**: Responsive button padding (`p-2.5 sm:p-3.5`), icon sizes (`w-4 h-4 sm:w-5 sm:h-5`), and spacing (`space-x-1.5 sm:space-x-3`). Screen share is hidden on small phone screens where `getDisplayMedia` is unsupported.
  - **Slide-out Drawers (`MembersList`, `Whiteboard`, `NoteTaker`)**: Responsive treatment (`fixed inset-0 z-50 md:static md:inset-auto md:z-30`) so panels overlay cleanly on mobile phones without breaking video stage layout.
  - **Local PiP Preview**: Repositioned (`bottom-16 sm:bottom-4 right-2 sm:right-4 w-24 h-20 sm:w-44 sm:h-32`) to stay clear of bottom call controls on mobile portrait screens.
  - **Pre-Join Screen**: Scaled for mobile viewports (`p-3 sm:p-6`, `h-44 sm:h-52` video box).
- **Mobile Camera Access Resolution**:
  - Mobile browsers (Chrome/Safari) treat LAN IP over plain HTTP (`http://10.63.9.158:3002`) as an insecure context, hiding `navigator.mediaDevices`.
  - Added `dev:https` script (`next dev --experimental-https -H 0.0.0.0 -p 3002`) in `video-app/frontend/package.json` to enable secure context on local Wi-Fi.
  - Added in-app mobile camera help dialog explaining both HTTPS and `chrome://flags/#unsafely-treat-insecure-origin-as-secure`.
  - Implemented cascading fallback constraints for `getUserMedia` (front camera user facing -> any camera + mic -> camera only -> legacy GUM).

**Files changed**
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `video-app/frontend/src/components/MembersList.jsx`
- `video-app/frontend/src/components/Whiteboard.jsx`
- `video-app/frontend/src/components/NoteTaker.jsx`
- `video-app/frontend/src/components/SettingsModal.jsx`
- `video-app/frontend/src/app/page.jsx`
- `video-app/frontend/src/app/layout.jsx`
- `video-app/frontend/package.json`
- `project_context/memory.md`

### 2026-11-07 14:45 IST — 3-Tier Verification (Doctor Host / Patient Magic Link / Guardian Waiting Lobby) Implemented

**Status:** IMPLEMENTED

**Work completed**
- **3-Tier Verification Architecture**:
  1. **Doctor (Host)**:
     - Verified via cryptographic host token (`?token=<doctorToken>`) from clinic backend.
     - Fallback: Doctor can claim Host privileges via Host PIN modal (`9999`) using `POST /api/rooms/:roomId/claim-host`.
     - Controls: Full whiteboard drawing/clearing, clinical note taker, and in-call admission controls.
     - Doctor receives real-time floating toast notification and Members Drawer alerts when a guardian requests to join (`[Admit]` and `[Decline]` buttons).
  2. **Patient (1-Click Magic Link)**:
     - Joins using verified magic link token (`?token=<patientToken>`) received in appointment email.
     - Enters consultation room directly without waiting room.
     - Read-only whiteboard view with synchronized canvas history.
  3. **Guardian / Family Member (Waiting Lobby)**:
     - Joins via plain room link (`/room/:roomId`) without cryptographic token.
     - Submits name (e.g., "Mrs. Sharma (Mother)").
     - Enters clean, reassuring **Waiting Lobby** ("Waiting for Dr. Kale to admit you to the consultation...").
     - On doctor click Admit -> Automatically enters call via `admitted-to-room`.
     - On doctor click Decline -> Displays clear "Admission Declined" screen via `denied-from-room`.
- **Address Bar Cleanliness**:
  - Completely eliminated `?role=` query parameter.
  - Room URLs are clean (`/room/:roomId`) and access rights are enforced strictly server-side.
- **Real-Time Synchronization**:
  - `waiting-lobby-updated` and `guest-waiting` socket events keep doctor's queue reactive.
  - Waiting guests who disconnect are automatically pruned from the doctor's queue.
  - Whiteboard normalized coordinates and `canvas-history` replay ensure late joiners see all drawings immediately.

**Files changed**
- `video-app/backend/src/index.js`
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `video-app/frontend/src/app/page.jsx`
- `video-app/frontend/src/components/MembersList.jsx`
- `project_context/memory.md`

**Tests and verification**
- Verified syntax on `video-app/backend/src/index.js` (`node -c`).
- Built `video-app/frontend` successfully with Next.js (`npm run build --prefix video-app/frontend` exited 0).

### 2026-11-07 14:05 IST — Members list, token-based role security, patient email pre-join, and whiteboard history replay

**Status:** IMPLEMENTED

**Work completed**
- **Members List Drawer (`MembersList.jsx`)**:
  - Live directory of all participants in the consultation room.
  - Displays participant name, role badge ("Doctor / Host", "Patient"), email address, and real-time mic/camera statuses.
  - Synchronized across all peers via Socket.io `members-updated`.
- **Token-Based Role Security (Prevent Address Bar Spoofing)**:
  - Removed insecure `?role=doctor` and `?role=patient` query parameters.
  - Roles are now cryptographically resolved server-side: only possessing the random `doctorToken` grants host privileges. Tampering with the address bar has zero effect.
- **Patient Email & Name Pre-Join Verification**:
  - Added pre-join lobby where patients must provide their **Email Address** and Full Name before entering the room.
  - Camera & Microphone preview box so patients can test their audio and video prior to joining.
- **Permanent Whiteboard Drawing Persistence & Scaled History Replay**:
  - Normalized drawing coordinates (`0.0` to `1.0`) so strokes render with pixel accuracy across varying screen sizes and devices.
  - Added on-demand `request-canvas-history` event: whenever a client mounts or opens the whiteboard, it immediately fetches all strokes drawn by the doctor earlier in the call and renders them completely.
  - Late-joining patients will now see everything the doctor drew earlier.

**Files changed**
- `video-app/backend/src/index.js`
- `video-app/frontend/src/components/MembersList.jsx`
- `video-app/frontend/src/components/Whiteboard.jsx`
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `project_context/memory.md`

### 2026-11-07 13:05 IST — UI clean up, generic video platform naming, and whiteboard permissions/history

**Status:** IMPLEMENTED

**Work completed**
- Removed defensive/technical jargon from user-facing UI (eliminated "Strict Zero-Recording Telemedicine Standard", "peer-to-peer WebRTC", and replaced "Unrecorded call" badge with a simple, reassuring `"Connected"` status indicator and timer).
- Rebranded video platform to the generic title: **"Online Consultation Platform"** (removed "Kale VideoCall" references).
- **Whiteboard Permissions & Late-Joiner History Replay**:
  - Restricted whiteboard editing exclusively to the **Doctor** (pen, colors, eraser, clear).
  - Patients have a clean **view-only** display.
  - Server now caches drawing strokes (`roomWhiteboards`). When a patient joins late, the server immediately emits `'canvas-history'`, replaying all previously drawn diagrams so nothing is missed.
- **Screen Share & Patient Invite Improvements**:
  - Replaced ambiguous `Share2` icon with clear `Monitor` display icon for screen sharing.
  - Added dedicated **"Share Patient Link"** button inside the active call to copy the patient meeting URL to clipboard with one click.
- Created and updated `README.md` files in root and across all sub-projects (`patient-website`, `doctor-panel`, `video-app`).

**Files changed**
- `video-app/backend/src/index.js`
- `video-app/frontend/src/app/layout.jsx`
- `video-app/frontend/src/app/page.jsx`
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `video-app/frontend/src/components/Whiteboard.jsx`
- `video-app/frontend/src/components/SettingsModal.jsx`
- `video-app/README.md`
- `README.md`
- `project_context/memory.md`

### 2026-11-07 12:30 IST — Phase 0 completed & Phase 1 (Independent Video Calling App) implemented

**Status:** IMPLEMENTED

**Work completed**
- Verified and finalized Phase 0 (3-folder architecture, pure JavaScript, shared PostgreSQL database schema, failover email engine, Cloudflare R2 storage integration, universal theme switcher).
- Fully implemented **Phase 1: Independent Video Calling Application (`video-app`)**:
  - `video-app/backend`:
    - WebRTC signaling server via Socket.io for peer-to-peer audio, video, and screen share.
    - Dynamic room & link generation API (`POST /api/rooms`) creating tokenized consultation links for doctor and patient.
    - Dynamic token validation endpoint (`GET /api/rooms/:roomId/validate`).
    - Automated call duration tracking and metadata webhook dispatch to clinic backend upon consultation end.
    - Strict unrecorded calls policy enforced.
  - `video-app/frontend`:
    - Next.js Pure JavaScript video consultation UI with responsive video grid stage and picture-in-picture local preview.
    - In-call media toolbar: Mic mute/unmute, Camera toggle, Screen share (`getDisplayMedia`), Device settings modal, End call.
    - **Collaborative Whiteboard (`Whiteboard.jsx`)**: Real-time collaborative drawing canvas with brush, color palette, eraser, clear canvas, and multi-user Socket.io stroke sync.
    - **Doctor Note Taker (`NoteTaker.jsx`)**: In-call clinical note taking drawer with local autosave, character counter, clipboard copy, and `.txt` file export.
    - **Settings Modal (`SettingsModal.jsx`)**: Device enumeration for microphones, speakers, and cameras.
    - Dynamic room route (`/room/[roomId]`) supporting query token authentication and role separation.
- Updated `phases.md` marking Phase 0 and Phase 1 completed.

**Files changed**
- `video-app/backend/src/index.js`
- `video-app/frontend/src/components/Whiteboard.jsx`
- `video-app/frontend/src/components/NoteTaker.jsx`
- `video-app/frontend/src/components/SettingsModal.jsx`
- `video-app/frontend/src/app/room/[roomId]/page.jsx`
- `video-app/frontend/src/app/page.jsx`
- `project_context/phases.md`
- `project_context/memory.md`

**Next action**
- Ready to proceed with Phase 2: Doctor Scheduling & Timezone Engine (Shared Backend).

### 2026-11-07 11:40 IST — Confirmed JavaScript, Cloudflare R2, and Dual Email Failover Engine

**Status:** DECIDED

**Work completed**
- Adopted **Pure JavaScript** (`.js`, `.jsx` with modern ES Modules) across all frontends and backends.
- Formatted database connection as **Standard PostgreSQL** using `DATABASE_URL` to guarantee 100% portability (zero vendor lock-in; easily switch between Supabase, Neon, AWS RDS, or Docker).
- Selected **Cloudflare R2** for private prescription storage (10 GB free forever, zero bandwidth/egress fees, standard S3-compatible JS SDK `@aws-sdk/client-s3`).
- Designed and documented the **Automated Dual-Provider Failover Email Engine**:
  - Primary: **Gmail SMTP** via `nodemailer` (500 free emails/day; replies land directly in doctor's Gmail).
  - Secondary: **Resend** (3,000 free emails/month; automatic instant failover when Gmail daily limit is approached or fails).
- Updated `architecture.md`, `PRD.md`, `rules.md`, `phases.md`, and `memory.md`.

**Decisions**
- Language: JavaScript (`.js`, `.jsx`).
- Database: Standard PostgreSQL (portable via `DATABASE_URL`).
- Storage: Cloudflare R2 (10 GB free forever).
- Email: Dual Failover (Gmail SMTP $\rightarrow$ Resend).

**Files changed**
- `project_context/architecture.md`
- `project_context/PRD.md`
- `project_context/rules.md`
- `project_context/phases.md`
- `project_context/memory.md`

**Next action**
- Implement Phase 0 scaffolding using pure JavaScript.

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
