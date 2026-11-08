# Doctor & Admin Management Dashboard (`doctor-panel`)

This project houses the clinical and administrative management dashboard for **Dr. Kale**.

---

## Architecture & Subdirectories

```text
doctor-panel/
├── frontend/             # Next.js 14 / React (Pure JavaScript) - Runs on Port 3001
│   ├── src/
│   │   ├── app/          # App Router (layout.jsx, page.jsx, globals.css)
│   │   └── components/   # ThemeSwitcher.jsx, Dashboard components
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/              # Express API (Pure JavaScript) - Runs on Port 4001
    ├── src/
    │   ├── services/     # storageService.js (Cloudflare R2 private storage)
    │   └── index.js      # Fee management, patient DB & dynamic video link endpoints
    └── package.json
```

---

## Key Features

1. **Shared PostgreSQL Database**: Directly connects to the **exact same database** as the patient website, ensuring instant synchronization of appointments, payments, and patient medical records.
2. **Fee Management**: Configurable consultation pricing:
   - India Consultation Fee (INR 150 configurable baseline).
   - International consultation fees and currency rules.
   - Initial vs. follow-up consultation rates.
3. **Patient Database**: Searchable registry of all patients, medical history, prior appointment dates/times, prescription archives, and call duration logs.
4. **Prescription Maker & Cloudflare R2 Storage**:
   - Structured prescription builder with live draft preview.
   - Versioned finalization to immutable PDF.
   - Uploads to **Cloudflare R2** (10 GB free forever, zero egress fee, using `@aws-sdk/client-s3`).
   - Generates 15-minute cryptographically signed download URLs for authorized patient downloads.
5. **Dynamic Video Link Dispatch**: Automatically generates and launches dynamic meeting links for scheduled consultations by communicating with the independent `video-app/backend`.
6. **Universal Theme Switcher**: Instant Light, Dark, and System modes with zero-FOUC.

---

## How to Start

### Prerequisites
Make sure the root `.env` file exists with your `DATABASE_URL` and Cloudflare R2 credentials (optional in local dev).

### 1. Start Backend API (Port 4001)
```bash
cd backend
npm install
npm run dev
```
- Health Check: `http://localhost:4001/api/health`
- Fee Rules API: `GET http://localhost:4001/api/fees`
- Patient Database API: `GET http://localhost:4001/api/patients`

### 2. Start Frontend (Port 3001)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3001` in your browser.

---

## Environment Variables Used
- `DATABASE_URL`: PostgreSQL connection string (Shared with patient-website).
- `DOCTOR_API_PORT`: `4001`
- `NEXT_PUBLIC_DOCTOR_PANEL_URL`: `http://localhost:3001`
- `VIDEO_API_URL`: `http://localhost:4002` (independent video app signaling server)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`: Cloudflare R2 credentials
- `R2_BUCKET_NAME`: `kale-clinic-prescriptions`

