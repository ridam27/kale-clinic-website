# Online Consultation Platform (`video-app`)

A completely independent, generic, and unbranded online video consultation platform with dynamic link generation support for external systems, doctor-controlled interactive drawing canvas (whiteboard), in-call clinical note taking, and one-click patient invitation.

---

## Architecture & Subdirectories

```text
video-app/
├── frontend/             # Next.js 14 / React (Pure JavaScript) - Runs on Port 3002
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.jsx                   # Consultation entry / room creation
│   │   │   ├── room/[roomId]/page.jsx     # Dynamic consultation room
│   │   │   └── globals.css
│   │   └── components/
│   │       ├── Whiteboard.jsx             # Doctor drawing canvas with patient view & history
│   │       ├── NoteTaker.jsx              # Doctor in-call clinical notes editor
│   │       ├── SettingsModal.jsx          # Device selector (Mic, Speaker, Camera)
│   │       └── ThemeSwitcher.jsx          # Universal Light/Dark/System switcher
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/              # Node.js + Express + Socket.io - Runs on Port 4002
    ├── src/
    │   └── index.js      # Signaling server & dynamic room generation API
    └── package.json
```

---

## Key Features

1. **Generic & Independent**: Standalone consultation platform uncoupled from clinic branding or specific doctor subdomains.
2. **One-Click "Share Patient Link"**: Direct button inside the call for the doctor to instantly copy the patient's invite link to clipboard.
3. **Doctor-Controlled Whiteboard with History Replay**:
   - Only the **Doctor** has editing tools (pen, colors, eraser, clear).
   - The **Patient** has a clean **view-only** display (no editing permissions).
   - **Late Joiner History Replay**: If the patient joins late and the doctor has already drawn diagrams, the backend immediately replays the full drawing history so the patient sees everything.
4. **Doctor Note Taker**:
   - Private clinical note drawer for the doctor during consultation.
   - Autosaved locally to prevent accidental data loss.
   - One-click copy to clipboard and `.txt` file export.
5. **Screen Share**: Clear Monitor icon for sharing screens or tabs (`navigator.mediaDevices.getDisplayMedia`).
6. **Device Settings**: Clean modal for selecting microphones, speakers, and webcams.
7. **Clean Status**: Shows simple `Connected` status with live duration timer.
8. **Call Duration Webhook**: Automatically notifies the clinic backend with session duration when the consultation concludes.
9. **Universal Theme Switcher**: Light, Dark, and System modes.
8. **Call Duration Webhook**: Automatically notifies the clinic backend with session start/end time and duration in seconds when the call concludes.
9. **Universal Theme Switcher**: Light, Dark, and System modes.

---

## How to Start

### 1. Start Signaling Server (Port 4002)
```bash
cd backend
npm install
npm run dev
```
- Health Check: `http://localhost:4002/api/health`
- Dynamic Room API: `POST http://localhost:4002/api/rooms`

### 2. Start Video Frontend (Port 3002)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3002` in your browser.
- You can create a test room directly from the homepage or join an existing room via:  
  `http://localhost:3002/room/<room_id>?role=doctor` or  
  `http://localhost:3002/room/<room_id>?role=patient`

---

## Dynamic Room API Integration Contract

External systems generate consultation links by sending a `POST` request to `/api/rooms`:

```bash
curl -X POST http://localhost:4002/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "apt_12345",
    "doctorName": "Dr. Kale",
    "patientName": "Rahul Sharma",
    "slotStartUtc": "2026-11-07T09:30:00Z",
    "slotEndUtc": "2026-11-07T10:00:00Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "roomId": "e4f89d3a12b7",
  "doctorMeetingUrl": "http://localhost:3002/room/e4f89d3a12b7?token=...&role=doctor",
  "patientMeetingUrl": "http://localhost:3002/room/e4f89d3a12b7?token=...&role=patient",
  "tokenExpiresAt": "2026-11-07T10:00:00Z"
}
```

---

## Environment Variables Used
- `VIDEO_API_PORT`: `4002`
- `NEXT_PUBLIC_VIDEO_APP_URL`: `http://localhost:3002`
- `DOCTOR_API_URL`: `http://localhost:4001` (to dispatch call session duration webhooks)

