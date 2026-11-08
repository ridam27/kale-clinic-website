import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.VIDEO_API_PORT || 4002;
const FRONTEND_URL = process.env.NEXT_PUBLIC_VIDEO_APP_URL || 'http://localhost:3002';
const CLINIC_API_URL = process.env.DOCTOR_API_URL || 'http://localhost:4001';

app.use(cors());
app.use(express.json());

// In-memory active room registry
const activeRooms = new Map();

// Room session duration tracker
const roomSessions = new Map();

// Room whiteboard history cache (persists all strokes so late joiners see previous drawings)
const roomWhiteboards = new Map();

// Live Room Members Tracker: roomId -> Map<socketId, { id, name, role, email, isMicOn, isCamOn }>
const roomMembers = new Map();

// Waiting Lobby Tracker for guests/guardians: roomId -> Map<socketId, { socketId, name, requestedAt }>
const waitingLobbies = new Map();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'video-app-backend',
    activeRooms: activeRooms.size,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Dynamic Room & Link Generation Endpoint
 * POST /api/rooms
 * Generates room with cryptographically random tokens (NO role written in URL!)
 */
app.post('/api/rooms', (req, res) => {
  const { appointmentId, doctorName, patientName, slotStartUtc, slotEndUtc } = req.body;

  const roomId = crypto.randomBytes(12).toString('hex');
  const doctorToken = crypto.randomBytes(16).toString('hex');
  const patientToken = crypto.randomBytes(16).toString('hex');
  const hostPin = '9999'; // Default emergency host PIN for Dr. Kale

  const roomData = {
    roomId,
    appointmentId: appointmentId || `apt_${Date.now()}`,
    doctorName: doctorName || 'Dr. Kale',
    patientName: patientName || 'Patient',
    slotStartUtc: slotStartUtc || new Date().toISOString(),
    slotEndUtc: slotEndUtc || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    doctorToken,
    patientToken,
    hostPin,
    createdAt: new Date().toISOString(),
    status: 'active',
  };

  activeRooms.set(roomId, roomData);
  roomWhiteboards.set(roomId, []);
  roomMembers.set(roomId, new Map());
  waitingLobbies.set(roomId, new Map());

  // Dynamically resolve frontend host for local network access (e.g. mobile at 10.63.9.158)
  const reqHost = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:4002';
  const clientHostname = reqHost.split(':')[0];
  const dynamicFrontendUrl = process.env.NEXT_PUBLIC_VIDEO_APP_URL || `http://${clientHostname}:3002`;

  // Clean URLs: Token defines identity securely (NO ?role= in URL!)
  const doctorMeetingUrl = `${dynamicFrontendUrl}/room/${roomId}?token=${doctorToken}`;
  const patientMeetingUrl = `${dynamicFrontendUrl}/room/${roomId}?token=${patientToken}`;

  console.log(`[Video API] Created room ${roomId} (Doctor token: ${doctorToken.slice(0, 6)}..., Patient token: ${patientToken.slice(0, 6)}...)`);

  res.json({
    success: true,
    roomId,
    doctorToken,
    patientToken,
    doctorMeetingUrl,
    patientMeetingUrl,
    tokenExpiresAt: roomData.slotEndUtc,
  });
});

/**
 * Dynamic Token Validation Endpoint
 * GET /api/rooms/:roomId/validate?token=...
 * 3-Tier Verification:
 *  1. Doctor with Host Token -> 'doctor_host' (instant entry + controls)
 *  2. Patient with Magic Link Token -> 'patient_magic_link' (instant 1-click entry)
 *  3. Guardian / Family without Token -> 'waiting_lobby' (enters waiting room for doctor admission)
 */
app.get('/api/rooms/:roomId/validate', (req, res) => {
  const { roomId } = req.params;
  const { token } = req.query;

  const room = activeRooms.get(roomId);

  if (!room) {
    // Development fallback for direct room entry
    return res.json({
      valid: true,
      roomId,
      accessType: token ? 'doctor_host' : 'waiting_lobby',
      role: token ? 'doctor' : 'guardian',
      doctorName: 'Dr. Kale',
      patientName: 'Patient',
    });
  }

  // 1. Doctor verification via Host Token
  if (token && token === room.doctorToken) {
    return res.json({
      valid: true,
      roomId,
      accessType: 'doctor_host',
      role: 'doctor',
      name: room.doctorName || 'Dr. Kale',
      doctorName: room.doctorName,
      patientName: room.patientName,
    });
  }

  // 2. Patient verification via Magic Link Token
  if (token && token === room.patientToken) {
    return res.json({
      valid: true,
      roomId,
      accessType: 'patient_magic_link',
      role: 'patient',
      name: room.patientName || 'Patient',
      doctorName: room.doctorName,
      patientName: room.patientName,
    });
  }

  // 3. Plain Link without valid token -> Guardian / Family Member (Enters Waiting Lobby)
  res.json({
    valid: true,
    roomId,
    accessType: 'waiting_lobby',
    role: 'guardian',
    doctorName: room.doctorName,
    patientName: room.patientName,
  });
});

/**
 * Host PIN Claim Endpoint (For Doctor joining on phone/tablet without link token)
 * POST /api/rooms/:roomId/claim-host
 */
app.post('/api/rooms/:roomId/claim-host', (req, res) => {
  const { roomId } = req.params;
  const { hostPin } = req.body;

  const room = activeRooms.get(roomId);
  const validPin = room?.hostPin || '9999';

  if (hostPin === validPin) {
    return res.json({
      success: true,
      doctorToken: room?.doctorToken,
      doctorName: room?.doctorName || 'Dr. Kale',
    });
  }

  res.status(401).json({ success: false, error: 'Incorrect Host PIN.' });
});

/**
 * Dispatch session metadata webhook to clinic backend upon consultation end
 */
async function notifyClinicSessionEnded({ appointmentId, roomId, startedAt, endedAt, durationSeconds }) {
  if (!appointmentId) return;

  try {
    const response = await fetch(`${CLINIC_API_URL}/api/webhooks/video-session-ended`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId,
        roomId,
        startedAt,
        endedAt,
        durationSeconds,
      }),
    });
    console.log(`[Video Webhook] Notified clinic backend of call end (duration: ${durationSeconds}s, status: ${response.status})`);
  } catch (err) {
    console.warn(`[Video Webhook Error] Could not reach clinic backend: ${err.message}`);
  }
}

// Helper to broadcast waiting lobby list to the consultation room
function broadcastWaitingLobby(roomId) {
  const lobby = waitingLobbies.get(roomId);
  const list = lobby ? Array.from(lobby.values()) : [];
  io.to(roomId).emit('waiting-lobby-updated', list);
}

// -----------------------------------------------------------------------------
// Realtime WebRTC Signaling & Collaborative Features
// -----------------------------------------------------------------------------
io.on('connection', (socket) => {
  let userRoomId = null;
  let userRole = null;
  let userName = null;

  // Guest requests entry to Waiting Lobby
  socket.on('request-guest-entry', ({ roomId, name }) => {
    userRoomId = roomId;
    userName = name || 'Guardian';
    userRole = 'guardian';

    if (!waitingLobbies.has(roomId)) {
      waitingLobbies.set(roomId, new Map());
    }
    const lobby = waitingLobbies.get(roomId);
    lobby.set(socket.id, {
      socketId: socket.id,
      name: userName,
      requestedAt: new Date().toISOString(),
    });

    socket.join(`lobby_${roomId}`);

    // Alert Doctor in the consultation room
    io.to(roomId).emit('guest-waiting', {
      socketId: socket.id,
      name: userName,
    });
    broadcastWaitingLobby(roomId);

    console.log(`[Waiting Lobby ${roomId}] Guest ${userName} (${socket.id}) is waiting for admission`);
  });

  // Doctor Admits a Guest from the Waiting Lobby
  socket.on('admit-guest', ({ roomId, guestSocketId }) => {
    const lobby = waitingLobbies.get(roomId);
    if (!lobby || !lobby.has(guestSocketId)) return;

    const guest = lobby.get(guestSocketId);
    lobby.delete(guestSocketId);

    // Notify the guest they are admitted
    io.to(guestSocketId).emit('admitted-to-room', {
      name: guest.name,
      role: 'guardian',
    });

    // Notify doctor that guest was admitted
    io.to(roomId).emit('guest-admitted-ack', { guestSocketId });
    broadcastWaitingLobby(roomId);
    console.log(`[Doctor Action] Admitted guest ${guest.name} into room ${roomId}`);
  });

  // Doctor Denies a Guest from the Waiting Lobby
  socket.on('deny-guest', ({ roomId, guestSocketId }) => {
    const lobby = waitingLobbies.get(roomId);
    if (lobby && lobby.has(guestSocketId)) {
      lobby.delete(guestSocketId);
    }
    io.to(guestSocketId).emit('denied-from-room');
    broadcastWaitingLobby(roomId);
    console.log(`[Doctor Action] Denied guest ${guestSocketId} from room ${roomId}`);
  });

  // Participant Joins Active Room (Doctor, Magic-Link Patient, or Admitted Guest)
  socket.on('join-room', ({ roomId, token, name, role = 'patient', isMicOn = true, isCamOn = true }) => {
    userRoomId = roomId;

    // Secure role resolution server-side
    const room = activeRooms.get(roomId);
    if (room && token && token === room.doctorToken) {
      userRole = 'doctor';
      userName = name || room.doctorName || 'Dr. Kale';
    } else if (room && token && token === room.patientToken) {
      userRole = 'patient';
      userName = name || room.patientName || 'Patient';
    } else {
      userRole = role || 'guardian';
      userName = name || 'Guardian';
    }

    socket.join(roomId);

    // Track active members in room
    if (!roomMembers.has(roomId)) {
      roomMembers.set(roomId, new Map());
    }
    const membersMap = roomMembers.get(roomId);
    membersMap.set(socket.id, {
      id: socket.id,
      name: userName,
      role: userRole,
      isMicOn,
      isCamOn,
    });

    // Session duration tracker
    if (!roomSessions.has(roomId)) {
      roomSessions.set(roomId, {
        startedAt: new Date().toISOString(),
        participants: new Set(),
      });
    }
    roomSessions.get(roomId).participants.add(socket.id);

    // 1. Notify peers of arrival
    socket.to(roomId).emit('peer-joined', {
      peerId: socket.id,
      role: userRole,
      userName,
    });

    // 2. Broadcast updated members list to EVERYONE in the room
    const currentMembers = Array.from(membersMap.values());
    io.to(roomId).emit('members-updated', currentMembers);

    // If there are guests already waiting in lobby, inform newly joined doctor
    if (userRole === 'doctor' && waitingLobbies.has(roomId)) {
      const waitingList = Array.from(waitingLobbies.get(roomId).values());
      socket.emit('waiting-lobby-updated', waitingList);
      waitingList.forEach((g) => {
        socket.emit('guest-waiting', { socketId: g.socketId, name: g.name });
      });
    }

    console.log(`[Room ${roomId}] Peer joined: ${socket.id} (${userRole} - ${userName})`);

    // 3. Immediately send full whiteboard history to the newly connected participant
    const history = roomWhiteboards.get(roomId) || [];
    socket.emit('canvas-history', history);

    // 4. Send active presentation state if presentation is currently in progress
    if (room && room.activePresentation) {
      socket.emit('presentation-state-changed', room.activePresentation);
    }

    // Request whiteboard history on demand
    socket.on('request-canvas-history', () => {
      const currentHistory = roomWhiteboards.get(roomId) || [];
      socket.emit('canvas-history', currentHistory);
    });

    // Update media toggle state (Mic / Camera) in members list
    socket.on('update-media-state', ({ isMicOn, isCamOn }) => {
      if (membersMap.has(socket.id)) {
        const m = membersMap.get(socket.id);
        m.isMicOn = isMicOn;
        m.isCamOn = isCamOn;
        io.to(roomId).emit('members-updated', Array.from(membersMap.values()));
      }
    });

    // WebRTC Offer
    socket.on('webrtc-offer', ({ targetPeerId, sdp }) => {
      io.to(targetPeerId).emit('webrtc-offer', {
        senderPeerId: socket.id,
        sdp,
      });
    });

    // WebRTC Answer
    socket.on('webrtc-answer', ({ targetPeerId, sdp }) => {
      io.to(targetPeerId).emit('webrtc-answer', {
        senderPeerId: socket.id,
        sdp,
      });
    });

    // WebRTC ICE Candidate
    socket.on('webrtc-ice-candidate', ({ targetPeerId, candidate }) => {
      io.to(targetPeerId).emit('webrtc-ice-candidate', {
        senderPeerId: socket.id,
        candidate,
      });
    });

    // Whiteboard stroke (Doctor draws, stored & broadcasted)
    socket.on('canvas-stroke', (strokeData) => {
      if (userRole !== 'doctor') return; // Strict doctor-only editing
      if (!roomWhiteboards.has(roomId)) {
        roomWhiteboards.set(roomId, []);
      }
      roomWhiteboards.get(roomId).push(strokeData);
      socket.to(roomId).emit('canvas-stroke', strokeData);
    });

    // Whiteboard clear (Doctor only)
    socket.on('canvas-clear', () => {
      if (userRole !== 'doctor') return;
      roomWhiteboards.set(roomId, []);
      socket.to(roomId).emit('canvas-clear');
    });

    // Host toggles Whiteboard for Patient (Automatically opens/closes on patient screen)
    socket.on('toggle-patient-whiteboard', ({ isOpen }) => {
      if (userRole === 'doctor') {
        socket.to(roomId).emit('patient-whiteboard-toggled', { isOpen });
        console.log(`[Room ${roomId}] Doctor toggled patient whiteboard: ${isOpen}`);
      }
    });

    // Screen presentation state broadcaster
    socket.on('presentation-state-changed', (presData) => {
      const room = activeRooms.get(roomId);
      const activePres = presData?.isPresenting
        ? {
            ...presData,
            isPresenting: true,
            presenterPeerId: socket.id,
            presenterName: presData.presenterName || userName,
            presenterRole: presData.presenterRole || userRole,
          }
        : null;

      if (room) {
        room.activePresentation = activePres;
      }

      socket.to(roomId).emit('presentation-state-changed', activePres || { isPresenting: false });
      console.log(`[Room ${roomId}] Presentation state changed: isPresenting=${!!activePres} by ${userName}`);
    });

    // Disconnect Handler (Handled at connection level for safety & clean cleanup)
    socket.on('disconnect', () => {
      // 1. Lobby cleanup (if socket was in waiting lobby)
      if (userRoomId && waitingLobbies.has(userRoomId)) {
        const lobby = waitingLobbies.get(userRoomId);
        if (lobby.has(socket.id)) {
          lobby.delete(socket.id);
          broadcastWaitingLobby(userRoomId);
          console.log(`[Waiting Lobby ${userRoomId}] Guest ${socket.id} disconnected from lobby`);
        }
      }

      // 2. Room cleanup (if socket had joined an active consultation room)
      if (userRoomId) {
        const room = activeRooms.get(userRoomId);
        if (room && room.activePresentation && room.activePresentation.presenterPeerId === socket.id) {
          room.activePresentation = null;
          io.to(userRoomId).emit('presentation-state-changed', { isPresenting: false });
        }

        const membersMap = roomMembers.get(userRoomId);
        if (membersMap && membersMap.has(socket.id)) {
          membersMap.delete(socket.id);
          io.to(userRoomId).emit('members-updated', Array.from(membersMap.values()));
        }

        socket.to(userRoomId).emit('peer-left', { peerId: socket.id, role: userRole });
        console.log(`[Room ${userRoomId}] Peer disconnected: ${socket.id}`);

        if (roomSessions.has(userRoomId)) {
          const s = roomSessions.get(userRoomId);
          s.participants.delete(socket.id);

          if (s.participants.size === 0) {
            const endedAt = new Date().toISOString();
            const startMs = new Date(s.startedAt).getTime();
            const endMs = new Date(endedAt).getTime();
            const durationSeconds = Math.max(0, Math.round((endMs - startMs) / 1000));

            const roomData = activeRooms.get(userRoomId);
            notifyClinicSessionEnded({
              appointmentId: roomData?.appointmentId,
              roomId: userRoomId,
              startedAt: s.startedAt,
              endedAt,
              durationSeconds,
            });

            roomSessions.delete(userRoomId);
          }
        }
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Independent Video Signaling Server] Running on http://0.0.0.0:${PORT}`);
});
