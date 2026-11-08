# Kale Homeopathy Clinic - Complete Platform

A secure, responsive online consultation and practice management platform for **Dr. Kale's Homeopathic Clinic**, built in **Pure JavaScript**.

---

## Architecture Overview

The repository is partitioned into three dedicated top-level service folders, each with decoupled `frontend/` and `backend/`:

```text
Kale-Clinic-Website/
├── patient-website/       # Folder 1: Public patient website & guest booking portal
│   ├── frontend/          # Next.js 14 (JavaScript) - Port 3000
│   └── backend/           # Express API - Port 4000
│
├── doctor-panel/          # Folder 2: Doctor & Admin Dashboard
│   ├── frontend/          # Next.js 14 (JavaScript) - Port 3001
│   └── backend/           # Express API - Port 4001
│                          # * Shares the same PostgreSQL database as patient-website *
│
├── video-app/             # Folder 3: Completely Independent Video Calling App
│   ├── frontend/          # WebRTC Video App (Whiteboard, Notes, Screen Share) - Port 3002
│   └── backend/           # WebRTC Signaling Server & Dynamic Room API - Port 4002
│
├── packages/
│   ├── database/          # Shared PostgreSQL schema (compatible with Supabase, RDS, Docker)
│   └── shared-types/      # Shared domain constants and frozen enums
│
├── project_context/       # Central architectural documentation and phases
└── .env.example           # Environment template for all services
```

---

## Key Platform Features

1. **Shared PostgreSQL Database**: Both `patient-website` and `doctor-panel` connect to the exact same PostgreSQL database (hosted on Supabase, AWS RDS, Neon, or local Docker via `DATABASE_URL`).
2. **Automated Dual-Provider Failover Email Engine**:
   - **Primary: Gmail SMTP** (100% free, 500 emails/day, direct replies land on Dr. Kale's phone).
   - **Secondary: Resend** (Automatically rolls over to Resend if Gmail quota is reached or connection fails).
3. **Cloudflare R2 Storage**: 10 GB free forever with **$0 egress/bandwidth fees** for private prescription PDFs.
4. **Independent Video Calling App**: Completely decoupled standalone video platform featuring screen share, camera/mic controls, real-time collaborative drawing canvas (whiteboard), and in-call doctor note taker.
5. **Universal Theme Switcher**: Instant Light, Dark, and System modes with zero-FOUC across all three frontends.

---

## Port Allocation Summary

| Service | Sub-project | Port | URL |
|---|---|---|---|
| **Patient Website** | `patient-website/frontend` | `3000` | http://localhost:3000 |
| **Patient API** | `patient-website/backend` | `4000` | http://localhost:4000 |
| **Doctor Dashboard** | `doctor-panel/frontend` | `3001` | http://localhost:3001 |
| **Doctor API** | `doctor-panel/backend` | `4001` | http://localhost:4001 |
| **Video App Client** | `video-app/frontend` | `3002` | http://localhost:3002 |
| **Video Signaling** | `video-app/backend` | `4002` | http://localhost:4002 |

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local PostgreSQL or cloud instance (Supabase, Neon, etc.)

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Update your `DATABASE_URL` with your PostgreSQL connection string.

### 3. Initialize Shared Database
```bash
# Generate Prisma Client for PostgreSQL
npm run db:generate

# Push schema to your PostgreSQL database
npm run db:push

# Seed initial doctor profile, working hours (9 AM - 12 PM IST), and fee rules (INR 150)
npm run db:seed
```

### 4. Running the Projects

You can start each project individually:

#### Start Patient Website:
```bash
# Terminal 1 - Backend API (Port 4000)
cd patient-website/backend && npm install && npm run dev

# Terminal 2 - Frontend (Port 3000)
cd patient-website/frontend && npm install && npm run dev
```

#### Start Doctor & Admin Dashboard:
```bash
# Terminal 3 - Backend API (Port 4001)
cd doctor-panel/backend && npm install && npm run dev

# Terminal 4 - Frontend (Port 3001)
cd doctor-panel/frontend && npm install && npm run dev
```

#### Start Independent Video Calling App:
```bash
# Terminal 5 - Signaling Server (Port 4002)
cd video-app/backend && npm install && npm run dev

# Terminal 6 - Video Web Client (Port 3002)
cd video-app/frontend && npm install && npm run dev
```

---

## Project Documentation
Detailed technical specifications and delivery phases are located in the [`project_context/`](project_context/) directory:
- [`PRD.md`](project_context/PRD.md) - Product Requirements Document
- [`architecture.md`](project_context/architecture.md) - System Architecture & Boundaries
- [`design.md`](project_context/design.md) - Design System, Colors & Theme Specifications
- [`rules.md`](project_context/rules.md) - Non-Negotiable Engineering Rules
- [`Security.md`](project_context/Security.md) - Privacy & Telemedicine Security Standards
- [`phases.md`](project_context/phases.md) - Delivery Phases & Roadmap
- [`memory.md`](project_context/memory.md) - Chronological Decisions & Change Log

