# Patient Website & Records Portal (`patient-website`)

This project houses the public-facing patient website, guest consultation booking engine, timezone converter, and passwordless records portal for Dr. Kale's Clinic.

---

## Architecture & Subdirectories

```text
patient-website/
├── frontend/             # Next.js 14 / React (Pure JavaScript) - Runs on Port 3000
│   ├── src/
│   │   ├── app/          # App Router (layout.jsx, page.jsx, globals.css)
│   │   └── components/   # ThemeSwitcher.jsx, Booking components
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/              # Express API (Pure JavaScript) - Runs on Port 4000
    ├── src/
    │   ├── services/     # emailService.js (Automated Dual Failover Engine)
    │   └── index.js      # API router & endpoints
    └── package.json
```

---

## Key Features

1. **Guest Consultation Booking**: Minimal data collection (Name, DOB/age, email, phone with country code, chief complaint). No mandatory password registration.
2. **Timezone Conversion**: Automatically shows doctor's IST hours (`Asia/Kolkata`, 9:00 AM – 12:00 PM) converted into the patient's local timezone.
3. **Automated Dual Failover Email Engine**:
   - **Primary (Gmail SMTP via `nodemailer`)**: Free, fast (1–2s delivery), and patient replies land directly in Dr. Kale's Gmail app.
   - **Secondary (Resend)**: If Gmail's daily quota (480 safe limit) is reached or throttled, all subsequent emails are automatically and seamlessly dispatched via Resend.
4. **Universal Theme Switcher**: Light, Dark, and System modes with zero-FOUC (no theme flashing).
5. **Shared Database**: Operates directly on the shared PostgreSQL database via `@kale/database`.

---

## How to Start

### Prerequisites
Make sure the root `.env` file exists with your `DATABASE_URL` and email credentials configured.

### 1. Start Backend API (Port 4000)
```bash
cd backend
npm install
npm run dev
```
- Health Check: `http://localhost:4000/api/health`
- Test Failover Email: `POST http://localhost:4000/api/test-email` with `{ "to": "your-email@example.com" }`

### 2. Start Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## Environment Variables Used
- `DATABASE_URL`: PostgreSQL connection string (Supabase / local Postgres).
- `PATIENT_API_PORT`: `4000`
- `NEXT_PUBLIC_PATIENT_WEB_URL`: `http://localhost:3000`
- `GMAIL_USER`: Doctor's Gmail address
- `GMAIL_APP_PASSWORD`: 16-character Google App Password
- `RESEND_API_KEY`: Fallback Resend API Key
- `RESEND_FROM_ADDRESS`: Verified Resend sender address

