# Patient Website & Records Portal (`patient-website`)

A unified, full-stack Next.js 14 application powering the public-facing patient website, guest consultation booking engine, automated timezone converter, and passwordless records portal for Kale Homeopathy Clinic.

---

## Unified Full-Stack Architecture

```text
patient-website/
├── README.md                  # Project overview & operational commands
├── WEBSITE_CONTENT.md         # Clinical specifications & page-by-page content
├── package.json               # Single unified package configuration
├── next.config.js             # Next.js build & dev configuration
├── tailwind.config.js         # Design tokens & color system
├── postcss.config.js
├── jsconfig.json              # Path aliases (@/* -> ./src/*)
├── .env.example               # Full-stack environment template
├── public/                    # Static assets, logos, favicon
└── src/
    ├── app/                   # App Router (Pages + Server API Route Handlers)
    │   ├── layout.jsx         # Root layout, clinical metadata & theme injector
    │   ├── page.jsx           # Page 1: Homepage & Clinical Overview
    │   ├── globals.css        # Palette tokens, typography, and theme variables
    │   ├── about/             # Page 2: The Practice & Physician Profile
    │   │   └── page.jsx
    │   ├── services/          # Page 3: Consultations & Transparent Fees
    │   │   └── page.jsx
    │   ├── book/              # Page 4: Interactive Guest Booking & Hold Lock
    │   │   └── page.jsx
    │   ├── portal/            # Page 5: Passwordless Patient Portal & Rx Viewer
    │   │   └── page.jsx
    │   ├── contact/           # Page 6: FAQs, Clinic Hours & Inquiry Form
    │   │   └── page.jsx
    │   └── api/               # Built-in Server Route Handlers (Replaces Express)
    │       ├── availability/
    │       │   └── route.js   # GET: IST to local timezone slot calculations
    │       ├── appointments/
    │       │   ├── hold/
    │       │   │   └── route.js # POST: 10-minute hold lock during checkout
    │       │   └── confirm/
    │       │       └── route.js # POST: Payment confirm, video link, and email dispatch
    │       ├── portal/
    │       │   ├── send-otp/
    │       │   │   └── route.js # POST: Passwordless OTP generation & email
    │       │   ├── verify-otp/
    │       │   │   └── route.js # POST: OTP authentication & session issue
    │       │   └── records/
    │       │       └── route.js # GET: Patient consultation history & prescriptions
    │       └── contact/
    │           └── route.js   # POST: Patient query form with clinic notification
    │
    ├── components/            # Reusable UI components
    │   ├── Navbar.jsx         # Global navigation header
    │   ├── Footer.jsx         # Global footer with credentials & legal notice
    │   └── ThemeSwitcher.jsx  # Universal Light/Dark mode toggle
    │
    └── lib/                   # Server-side business logic & services
        ├── email.js           # Multi-provider email failover engine (Gmail / Resend)
        ├── scheduler.js       # Doctor schedule (9 AM - 12 PM IST) slot calculator
        └── constants.js       # Clinic fee rules, timings, and supported countries
```

---

## Key Features

1. **Zero Express Redundancy:** Runs both user-facing pages and server API routes on a single port (`3000`) with zero CORS issues.
2. **Guest Consultation Booking:** Minimal data collection (Name, age/DOB, email, phone with country code, chief complaint). No mandatory password registration.
3. **Automated Timezone Conversion:** Automatically maps the clinic's IST morning hours (`9:00 AM – 12:00 PM IST`, Mon–Sat) into the patient's local clock anywhere in the world.
4. **Dual Failover Email Engine (`src/lib/email.js`):**
   - **Primary (Gmail SMTP via `nodemailer`):** Free, fast delivery, with direct patient replies landing in the clinic's inbox.
   - **Secondary (Resend):** Automatically routes dispatches to Resend if Gmail's daily quota (480 safe threshold) is approached or throttled.
5. **Passwordless Patient Portal:** Instant 6-digit email OTP login allowing patients to review past appointments and download official PDF prescriptions.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your database and email credentials:
```bash
cp .env.example .env
```

### 3. Start Development Server (Port 3000)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
