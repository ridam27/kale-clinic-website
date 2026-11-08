'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  Settings,
  PenTool,
  PhoneOff,
  Link2,
  Check,
  Users,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Clock,
  KeyRound,
  AlertCircle,
  X,
  UserPlus,
  HelpCircle,
  ExternalLink,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Whiteboard } from '@/components/Whiteboard';
import { NoteTaker } from '@/components/NoteTaker';
import { SettingsModal } from '@/components/SettingsModal';
import { MembersList } from '@/components/MembersList';

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

function getVideoApiUrl() {
  if (process.env.NEXT_PUBLIC_VIDEO_API_URL) {
    return process.env.NEXT_PUBLIC_VIDEO_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:4002`;
  }
  return 'http://localhost:4002';
}

/**
 * Google Meet Style Participant Video Tile
 * Displays video stream, fallback initials, mic state, name pill, and fit/fill toggle.
 */
function ParticipantVideoTile({
  stream,
  isLocal = false,
  name = 'Participant',
  role = 'patient',
  isMicOn = true,
  isCamOn = true,
  fitMode = 'cover',
  onToggleFit,
  className = '',
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Tile video play notice:', e));
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const initials =
    role === 'doctor'
      ? 'Dr'
      : name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'P';

  const roleLabel = isLocal
    ? role === 'doctor'
      ? 'Dr. Kale (You)'
      : `${name} (You)`
    : role === 'doctor'
    ? 'Dr. Kale (Doctor)'
    : role === 'guardian'
    ? `${name} (Guardian)`
    : `${name} (Patient)`;

  return (
    <div
      className={`rounded-xl sm:rounded-2xl border border-border/70 bg-[#161d1b] relative overflow-hidden flex items-center justify-center shadow-md select-none group min-h-0 min-w-0 ${className}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full transition-all duration-200 ${
          fitMode === 'contain' ? 'object-contain bg-black' : 'object-cover'
        } ${!isCamOn || !stream ? 'hidden' : 'block'}`}
      />

      {/* Camera Off / Connecting Avatar (Google Meet Style) */}
      {(!isCamOn || !stream) && (
        <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-soft border border-primary/20 text-primary flex items-center justify-center font-bold text-base sm:text-xl shadow">
            {initials}
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-text-muted">
            {isLocal ? 'Camera paused' : stream ? `${name}'s camera is off` : `Connecting ${name}...`}
          </p>
        </div>
      )}

      {/* Top-Right Fit/Fill Mode Toggle */}
      {stream && isCamOn && onToggleFit && (
        <button
          type="button"
          onClick={onToggleFit}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 text-[10px] font-medium flex items-center space-x-1 shadow transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100 sm:opacity-80"
          title={fitMode === 'cover' ? 'Fit video in frame' : 'Fill frame'}
        >
          {fitMode === 'cover' ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span className="hidden sm:inline text-[9px] uppercase tracking-wider">
            {fitMode === 'cover' ? 'Fit' : 'Fill'}
          </span>
        </button>
      )}

      {/* Bottom-Left Name & Mic Status Pill (Google Meet Style) */}
      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium flex items-center space-x-1.5 shadow max-w-[85%] z-10">
        {isMicOn ? (
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
        ) : (
          <MicOff className="w-3 h-3 text-danger shrink-0" />
        )}
        <span className="truncate">{roleLabel}</span>
      </div>
    </div>
  );
}

export default function VideoRoomPage({ params }) {
  const { roomId } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Server-verified room authorization state (Never trust address bar!)
  const [authResolved, setAuthResolved] = useState(false);
  const [accessType, setAccessType] = useState('waiting_lobby');
  const [role, setRole] = useState('guardian');
  const [doctorName, setDoctorName] = useState('Dr. Kale');

  // Pre-join form fields
  const [patientEmail, setPatientEmail] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  // Mobile Camera Insecure Context state
  const [cameraNotice, setCameraNotice] = useState('');
  const [showCameraHelp, setShowCameraHelp] = useState(false);

  // Waiting Lobby states
  const [isWaitingInLobby, setIsWaitingInLobby] = useState(false);
  const [isAdmissionDenied, setIsAdmissionDenied] = useState(false);

  // Doctor Host PIN Claim Modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [hostPinInput, setHostPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isClaimingHost, setIsClaimingHost] = useState(false);

  // In-call Doctor Waiting List state
  const [waitingGuests, setWaitingGuests] = useState([]);

  // Call & Media state
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [localScreenStream, setLocalScreenStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [members, setMembers] = useState([]);

  // MULTI-PEER STREAM REGISTRY: peerId -> MediaStream
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [remoteScreenStreams, setRemoteScreenStreams] = useState(new Map());
  const [peerFitModes, setPeerFitModes] = useState(new Map());
  const screenSenderMapRef = useRef(new Map());
  const knownCamStreamIdsRef = useRef(new Map());

  // Screen Presentation Tracking
  const [remotePresentation, setRemotePresentation] = useState({
    isPresenting: false,
    presenterPeerId: null,
    presenterName: '',
    presenterRole: '',
    screenStreamId: null,
    screenTrackId: null,
  });

  // Mutable refs to prevent stale closure issues in WebRTC callbacks
  const remoteStreamsRef = useRef(new Map());
  const remoteScreenStreamsRef = useRef(new Map());
  const remotePresentationRef = useRef({
    isPresenting: false,
    presenterPeerId: null,
    presenterName: '',
    presenterRole: '',
    screenStreamId: null,
    screenTrackId: null,
  });

  // Whiteboard Auto-Sync state (Doctor toggles for patient)
  const [isPatientWhiteboardSynced, setIsPatientWhiteboardSynced] = useState(false);

  // Drawers & Modals
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

  const prejoinVideoRef = useRef(null);
  const pinnedVideoRef = useRef(null);

  // WebRTC Peer Connections Registry: peerId -> { pc, candidateQueue, isRemoteDescSet }
  const localStreamRef = useRef(null);
  const localScreenStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const earlyIceCandidatesRef = useRef(new Map());

  // Keep refs synchronized
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    localScreenStreamRef.current = localScreenStream;
  }, [localScreenStream]);

  useEffect(() => {
    remoteStreamsRef.current = remoteStreams;
  }, [remoteStreams]);

  useEffect(() => {
    remoteScreenStreamsRef.current = remoteScreenStreams;
  }, [remoteScreenStreams]);

  useEffect(() => {
    remotePresentationRef.current = remotePresentation;
  }, [remotePresentation]);

  // Bind presentation stream to pinned player whenever presenter changes
  useEffect(() => {
    if (pinnedVideoRef.current) {
      if (isScreenSharing && localScreenStream) {
        pinnedVideoRef.current.srcObject = localScreenStream;
        pinnedVideoRef.current.play().catch((e) => console.warn('Presentation play note:', e));
      } else if (remotePresentation.isPresenting && remotePresentation.presenterPeerId) {
        let pStream = remoteScreenStreams.get(remotePresentation.presenterPeerId);
        if (!pStream) {
          // If remoteScreenStreams not ready, check if peer connection has 2 video receivers
          const peerObj = peerConnectionsRef.current.get(remotePresentation.presenterPeerId);
          if (peerObj && peerObj.pc) {
            const vReceivers = peerObj.pc.getReceivers().filter(
              (r) => r.track && r.track.kind === 'video' && r.track.readyState === 'live'
            );
            if (vReceivers.length >= 2) {
              const sTrack = (remotePresentation.screenTrackId
                ? vReceivers.find((r) => r.track.id === remotePresentation.screenTrackId)?.track
                : vReceivers[1].track) || vReceivers[1].track;
              if (sTrack) {
                pStream = new MediaStream([sTrack]);
              }
            }
          }
        }
        if (pStream) {
          pinnedVideoRef.current.srcObject = pStream;
          pinnedVideoRef.current.play().catch((e) => console.warn('Presentation play note:', e));
        } else {
          pinnedVideoRef.current.srcObject = null;
        }
      } else {
        pinnedVideoRef.current.srcObject = null;
      }
    }
  }, [isScreenSharing, localScreenStream, remotePresentation, remoteScreenStreams]);

  // ---------------------------------------------------------------------------
  // 1. Validate token with server to resolve 3-Tier identity securely
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function validateToken() {
      try {
        const apiUrl = getVideoApiUrl();
        const res = await fetch(`${apiUrl}/api/rooms/${roomId}/validate?token=${token || ''}`);
        const data = await res.json();
        if (data.valid) {
          setAccessType(data.accessType || 'waiting_lobby');
          setRole(data.role || 'guardian');
          if (data.doctorName) setDoctorName(data.doctorName);

          if (data.role === 'doctor') {
            setParticipantName(data.name || data.doctorName || 'Dr. Kale');
          } else if (data.role === 'patient') {
            setParticipantName(data.name || 'Patient');
          }
        }
      } catch (err) {
        console.warn('Could not validate room token with server:', err);
      } finally {
        setAuthResolved(true);
      }
    }

    validateToken();
  }, [roomId, token]);

  // ---------------------------------------------------------------------------
  // 2. Pre-join webcam preview with resilient mobile fallbacks
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let stream = null;
    let isCancelled = false;

    async function startPrejoinMedia() {
      if (typeof window !== 'undefined' && window.isSecureContext === false && window.location.hostname !== 'localhost') {
        setCameraNotice('mobile_http_insecure');
      }

      const getMedia = async (constraints) => {
        if (navigator?.mediaDevices?.getUserMedia) {
          return await navigator.mediaDevices.getUserMedia(constraints);
        }
        const legacyGUM = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (legacyGUM) {
          return new Promise((resolve, reject) => legacyGUM.call(navigator, constraints, resolve, reject));
        }
        throw new Error('getUserMedia not supported in this browser context');
      };

      try {
        try {
          stream = await getMedia({ video: { facingMode: 'user' }, audio: true });
        } catch (e1) {
          try {
            stream = await getMedia({ video: true, audio: true });
          } catch (e2) {
            stream = await getMedia({ video: true, audio: false });
          }
        }

        if (!isCancelled && stream) {
          setLocalStream(stream);
          localStreamRef.current = stream;
          setCameraNotice('');
          if (prejoinVideoRef.current) {
            prejoinVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Webcam acquisition failed:', err);
        if (typeof window !== 'undefined' && window.isSecureContext === false && window.location.hostname !== 'localhost') {
          setCameraNotice('mobile_http_insecure');
        } else {
          setCameraNotice('permission_denied');
        }
      }
    }

    if (!hasJoined && !callEnded) {
      startPrejoinMedia();
    }

    return () => {
      isCancelled = true;
    };
  }, [hasJoined, callEnded]);

  // ---------------------------------------------------------------------------
  // WebRTC Helper: Create and Configure an RTCPeerConnection for a Peer
  // ---------------------------------------------------------------------------
  const createPeerConnection = useCallback((peerId, socketInstance) => {
    console.log(`[WebRTC Multi-Peer] Initializing RTCPeerConnection for peer: ${peerId}`);
    const pc = new RTCPeerConnection(RTC_CONFIG);
    const candidateQueue = [];
    let isRemoteDescSet = false;

    // Attach active local tracks (Camera & Microphone)
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, localStreamRef.current);
        } catch (e) {
          console.warn('[WebRTC Multi-Peer] addTrack notice:', e);
        }
      });
    }

    // Attach active local screen track if screen presentation is already ongoing
    if (localScreenStreamRef.current) {
      const screenTrack = localScreenStreamRef.current.getVideoTracks()[0];
      if (screenTrack) {
        try {
          const sender = pc.addTrack(screenTrack, localScreenStreamRef.current);
          screenSenderMapRef.current.set(peerId, sender);
        } catch (e) {
          console.warn('[WebRTC Multi-Peer] addTrack screen notice:', e);
        }
      }
    }

    // ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate && socketInstance) {
        socketInstance.emit('webrtc-ice-candidate', {
          targetPeerId: peerId,
          candidate: event.candidate,
        });
      }
    };

    // Incoming remote track event (Receives audio, camera video, and screen share video)
    pc.ontrack = (event) => {
      console.log(`[WebRTC Multi-Peer] Received track from peer ${peerId}:`, event);
      const incomingTrack = event.track;
      const incomingStream = event.streams && event.streams[0] ? event.streams[0] : null;

      if (!incomingTrack) return;

      if (incomingTrack.kind === 'audio') {
        setRemoteStreams((prev) => {
          const next = new Map(prev);
          const existing = next.get(peerId);
          if (existing) {
            const allTracks = [...existing.getTracks()];
            if (!allTracks.some((t) => t.id === incomingTrack.id)) {
              allTracks.push(incomingTrack);
            }
            next.set(peerId, new MediaStream(allTracks));
          } else {
            next.set(peerId, new MediaStream([incomingTrack]));
          }
          remoteStreamsRef.current = next;
          return next;
        });
      } else if (incomingTrack.kind === 'video') {
        const activePres = remotePresentationRef.current;
        const isFromPresenter = activePres && activePres.isPresenting && activePres.presenterPeerId === peerId;

        const existingStream = remoteStreamsRef.current.get(peerId);
        const existingCamVideoTrack = existingStream ? existingStream.getVideoTracks().find((t) => t.readyState === 'live') : null;
        const knownCamId = knownCamStreamIdsRef.current.get(peerId);

        let isScreen = false;
        if (isFromPresenter) {
          if (activePres.screenTrackId && incomingTrack.id === activePres.screenTrackId) {
            isScreen = true;
          } else if (activePres.screenStreamId && incomingStream && incomingStream.id === activePres.screenStreamId) {
            isScreen = true;
          } else if (existingCamVideoTrack && existingCamVideoTrack.id !== incomingTrack.id) {
            isScreen = true;
          } else if (knownCamId && incomingStream && incomingStream.id !== knownCamId) {
            isScreen = true;
          }
        } else {
          isScreen =
            (existingCamVideoTrack && existingCamVideoTrack.id !== incomingTrack.id) ||
            (knownCamId && incomingStream && incomingStream.id !== knownCamId);
        }

        if (isScreen) {
          console.log(`[WebRTC Multi-Peer] Mapped incoming SCREEN track from peer ${peerId}`);
          setRemoteScreenStreams((prev) => {
            const next = new Map(prev);
            next.set(peerId, new MediaStream([incomingTrack]));
            remoteScreenStreamsRef.current = next;
            return next;
          });
          incomingTrack.onended = () => {
            setRemoteScreenStreams((prev) => {
              const next = new Map(prev);
              next.delete(peerId);
              remoteScreenStreamsRef.current = next;
              return next;
            });
          };
        } else {
          console.log(`[WebRTC Multi-Peer] Mapped incoming CAMERA track from peer ${peerId}`);
          if (incomingStream) {
            knownCamStreamIdsRef.current.set(peerId, incomingStream.id);
          }
          setRemoteStreams((prev) => {
            const next = new Map(prev);
            const current = next.get(peerId);
            if (current) {
              const otherTracks = current.getTracks().filter((t) => t.kind !== 'video');
              otherTracks.push(incomingTrack);
              next.set(peerId, new MediaStream(otherTracks));
            } else {
              next.set(peerId, new MediaStream([incomingTrack]));
            }
            remoteStreamsRef.current = next;
            return next;
          });
        }
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC Multi-Peer] Peer ${peerId} state:`, pc.connectionState);
    };

    const peerObj = {
      pc,
      candidateQueue,
      getIsRemoteDescSet: () => isRemoteDescSet,
      setRemoteDescSet: (val) => {
        isRemoteDescSet = val;
      },
    };

    // Drain any early ICE candidates that arrived before peerObj was initialized
    const earlyQueue = earlyIceCandidatesRef.current.get(peerId) || [];
    if (earlyQueue.length > 0) {
      candidateQueue.push(...earlyQueue);
      earlyIceCandidatesRef.current.delete(peerId);
    }

    peerConnectionsRef.current.set(peerId, peerObj);
    return peerObj;
  }, []);

  // ---------------------------------------------------------------------------
  // 3. Connect to active room & Initialize WebRTC Signaling
  // ---------------------------------------------------------------------------
  const connectAndJoinRoom = useCallback(
    (customRole, customName) => {
      const activeRole = customRole || role;
      const activeName =
        customName ||
        participantName ||
        (activeRole === 'doctor' ? doctorName : activeRole === 'patient' ? 'Patient' : 'Guardian');

      setHasJoined(true);
      setIsWaitingInLobby(false);

      const apiUrl = getVideoApiUrl();
      const newSocket = io(apiUrl);
      setSocket(newSocket);

      // 1. Join room on server
      newSocket.emit('join-room', {
        roomId,
        token,
        name: activeName,
        email: patientEmail || null,
        role: activeRole,
        isMicOn,
        isCamOn,
      });

      // 2. Listen for members directory updates
      newSocket.on('members-updated', (updatedMembers) => {
        setMembers(updatedMembers);
      });

      // 3. Doctor listens for waiting lobby updates
      if (activeRole === 'doctor') {
        newSocket.on('waiting-lobby-updated', (guests) => {
          setWaitingGuests(guests || []);
        });

        newSocket.on('guest-waiting', (guest) => {
          setWaitingGuests((prev) => {
            if (prev.some((g) => g.socketId === guest.socketId)) return prev;
            return [...prev, guest];
          });
        });

        newSocket.on('guest-admitted-ack', ({ guestSocketId }) => {
          setWaitingGuests((prev) => prev.filter((g) => g.socketId !== guestSocketId));
        });
      }

      // 4. Whiteboard remote auto-sync event
      newSocket.on('patient-whiteboard-toggled', ({ isOpen }) => {
        console.log(`[Socket] Patient whiteboard auto-toggled: ${isOpen}`);
        setShowWhiteboard(isOpen);
      });

      // 5. Presentation state notification (Pins shared screen for everyone)
      newSocket.on('presentation-state-changed', (presData) => {
        console.log('[Socket] Presentation state broadcast:', presData);
        const pres = presData || { isPresenting: false };
        setRemotePresentation(pres);
        remotePresentationRef.current = pres;

        if (pres.isPresenting && pres.presenterPeerId) {
          const peerObj = peerConnectionsRef.current.get(pres.presenterPeerId);
          if (peerObj && peerObj.pc) {
            const vReceivers = peerObj.pc.getReceivers().filter(
              (r) => r.track && r.track.kind === 'video' && r.track.readyState === 'live'
            );
            if (vReceivers.length >= 2) {
              let screenTrack = null;
              let camTrack = null;
              if (pres.screenTrackId) {
                screenTrack = vReceivers.find((r) => r.track.id === pres.screenTrackId)?.track;
                camTrack = vReceivers.find((r) => r.track.id !== pres.screenTrackId)?.track;
              }
              if (!screenTrack) {
                camTrack = vReceivers[0].track;
                screenTrack = vReceivers[1].track;
              }

              if (screenTrack) {
                setRemoteScreenStreams((prev) => {
                  const next = new Map(prev);
                  next.set(pres.presenterPeerId, new MediaStream([screenTrack]));
                  remoteScreenStreamsRef.current = next;
                  return next;
                });
              }
              if (camTrack) {
                setRemoteStreams((prev) => {
                  const next = new Map(prev);
                  const current = next.get(pres.presenterPeerId);
                  const audioTracks = current ? current.getAudioTracks() : [];
                  next.set(pres.presenterPeerId, new MediaStream([...audioTracks, camTrack]));
                  remoteStreamsRef.current = next;
                  return next;
                });
              }
            }
          }
        }
      });

      // -----------------------------------------------------------------------
      // WebRTC Multi-Peer Signaling Handlers
      // -----------------------------------------------------------------------

      // When another peer joins, initiate offer
      newSocket.on('peer-joined', async ({ peerId, role: pRole, userName: pName }) => {
        console.log(`[WebRTC Multi-Peer] Peer joined: ${peerId} (${pRole} - ${pName})`);
        const peerObj = createPeerConnection(peerId, newSocket);

        // If local client is actively sharing screen, broadcast presentation state to update late joiner
        if (localScreenStreamRef.current) {
          const sTrack = localScreenStreamRef.current.getVideoTracks()[0];
          newSocket.emit('presentation-state-changed', {
            isPresenting: true,
            presenterName: participantName || (activeRole === 'doctor' ? doctorName : 'Presenter'),
            presenterRole: activeRole,
            screenStreamId: localScreenStreamRef.current.id,
            screenTrackId: sTrack?.id || null,
          });
        }

        try {
          const offer = await peerObj.pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await peerObj.pc.setLocalDescription(offer);

          newSocket.emit('webrtc-offer', {
            targetPeerId: peerId,
            sdp: offer,
          });
        } catch (err) {
          console.error('[WebRTC Multi-Peer] Error creating offer:', err);
        }
      });

      // When receiving offer from another peer, respond with answer
      newSocket.on('webrtc-offer', async ({ senderPeerId, sdp }) => {
        console.log(`[WebRTC Multi-Peer] Received offer from ${senderPeerId}`);
        let peerObj = peerConnectionsRef.current.get(senderPeerId);
        if (!peerObj) {
          peerObj = createPeerConnection(senderPeerId, newSocket);
        }

        try {
          await peerObj.pc.setRemoteDescription(new RTCSessionDescription(sdp));
          peerObj.setRemoteDescSet(true);

          while (peerObj.candidateQueue.length > 0) {
            const candidate = peerObj.candidateQueue.shift();
            try {
              await peerObj.pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {}
          }

          const answer = await peerObj.pc.createAnswer();
          await peerObj.pc.setLocalDescription(answer);

          newSocket.emit('webrtc-answer', {
            targetPeerId: senderPeerId,
            sdp: answer,
          });
        } catch (err) {
          console.error('[WebRTC Multi-Peer] Error handling offer:', err);
        }
      });

      // When receiving answer, set remote description
      newSocket.on('webrtc-answer', async ({ senderPeerId, sdp }) => {
        console.log(`[WebRTC Multi-Peer] Received answer from ${senderPeerId}`);
        const peerObj = peerConnectionsRef.current.get(senderPeerId);
        if (peerObj) {
          try {
            await peerObj.pc.setRemoteDescription(new RTCSessionDescription(sdp));
            peerObj.setRemoteDescSet(true);

            while (peerObj.candidateQueue.length > 0) {
              const candidate = peerObj.candidateQueue.shift();
              try {
                await peerObj.pc.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (e) {}
            }
          } catch (err) {
            console.error('[WebRTC Multi-Peer] Error setting remote description from answer:', err);
          }
        }
      });

      // Handle incoming ICE candidate
      newSocket.on('webrtc-ice-candidate', async ({ senderPeerId, candidate }) => {
        if (!candidate) return;
        const peerObj = peerConnectionsRef.current.get(senderPeerId);
        if (peerObj) {
          if (peerObj.getIsRemoteDescSet()) {
            try {
              await peerObj.pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.warn('[WebRTC Multi-Peer] Error adding ICE candidate:', err);
            }
          } else {
            peerObj.candidateQueue.push(candidate);
          }
        } else {
          if (!earlyIceCandidatesRef.current.has(senderPeerId)) {
            earlyIceCandidatesRef.current.set(senderPeerId, []);
          }
          earlyIceCandidatesRef.current.get(senderPeerId).push(candidate);
        }
      });

      // Handle peer leaving (clean up stream and peer connection)
      newSocket.on('peer-left', ({ peerId }) => {
        console.log(`[WebRTC Multi-Peer] Peer left: ${peerId}`);
        const peerObj = peerConnectionsRef.current.get(peerId);
        if (peerObj) {
          peerObj.pc.close();
          peerConnectionsRef.current.delete(peerId);
        }
        earlyIceCandidatesRef.current.delete(peerId);
        screenSenderMapRef.current.delete(peerId);
        knownCamStreamIdsRef.current.delete(peerId);
        setRemoteStreams((prev) => {
          const next = new Map(prev);
          next.delete(peerId);
          return next;
        });
        setRemoteScreenStreams((prev) => {
          const next = new Map(prev);
          next.delete(peerId);
          return next;
        });
      });
    },
    [role, participantName, doctorName, roomId, token, patientEmail, isMicOn, isCamOn, createPeerConnection]
  );

  // ---------------------------------------------------------------------------
  // 4. Guest Entry Request (Tier 3: Waiting Lobby)
  // ---------------------------------------------------------------------------
  const handleRequestGuestEntry = useCallback(() => {
    if (!participantName.trim()) return;

    setIsWaitingInLobby(true);

    const apiUrl = getVideoApiUrl();
    const lobbySocket = io(apiUrl);
    setSocket(lobbySocket);

    lobbySocket.emit('request-guest-entry', {
      roomId,
      name: participantName.trim(),
    });

    lobbySocket.on('admitted-to-room', (guestInfo) => {
      console.log('[Waiting Lobby] Admitted to room by doctor!');
      setRole('guardian');
      connectAndJoinRoom('guardian', guestInfo?.name || participantName);
    });

    lobbySocket.on('denied-from-room', () => {
      console.log('[Waiting Lobby] Admission declined by doctor');
      setIsWaitingInLobby(false);
      setIsAdmissionDenied(true);
      lobbySocket.disconnect();
    });
  }, [participantName, roomId, connectAndJoinRoom]);

  // ---------------------------------------------------------------------------
  // 5. Doctor Actions: Admit / Deny Guests & Toggle Patient Whiteboard
  // ---------------------------------------------------------------------------
  const handleAdmitGuest = (guestSocketId) => {
    if (socket && role === 'doctor') {
      socket.emit('admit-guest', { roomId, guestSocketId });
      setWaitingGuests((prev) => prev.filter((g) => g.socketId !== guestSocketId));
    }
  };

  const handleDenyGuest = (guestSocketId) => {
    if (socket && role === 'doctor') {
      socket.emit('deny-guest', { roomId, guestSocketId });
      setWaitingGuests((prev) => prev.filter((g) => g.socketId !== guestSocketId));
    }
  };

  const handleTogglePatientWhiteboard = () => {
    if (socket && role === 'doctor') {
      const nextState = !isPatientWhiteboardSynced;
      setIsPatientWhiteboardSynced(nextState);
      socket.emit('toggle-patient-whiteboard', { isOpen: nextState });
      if (nextState) {
        setShowWhiteboard(true);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 6. Doctor Host PIN Verification Fallback
  // ---------------------------------------------------------------------------
  const handleClaimHostPin = async (e) => {
    e.preventDefault();
    setPinError('');
    setIsClaimingHost(true);

    try {
      const apiUrl = getVideoApiUrl();
      const res = await fetch(`${apiUrl}/api/rooms/${roomId}/claim-host`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostPin: hostPinInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAccessType('doctor_host');
        setRole('doctor');
        setParticipantName(data.doctorName || 'Dr. Kale');
        setShowPinModal(false);
      } else {
        setPinError(data.error || 'Incorrect Host PIN. Please try again.');
      }
    } catch (err) {
      setPinError('Could not verify PIN. Please try again.');
    } finally {
      setIsClaimingHost(false);
    }
  };

  // Timer
  useEffect(() => {
    if (!hasJoined || callEnded) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasJoined, callEnded]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Mic
  const toggleMic = async () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach((track) => {
          track.enabled = !isMicOn;
        });
        setIsMicOn(!isMicOn);
        if (socket) {
          socket.emit('update-media-state', { isMicOn: !isMicOn, isCamOn });
        }
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newTrack = stream.getAudioTracks()[0];
        if (newTrack) {
          const newStream = localStream || new MediaStream();
          newStream.addTrack(newTrack);
          setLocalStream(newStream);
          localStreamRef.current = newStream;
          peerConnectionsRef.current.forEach(({ pc }) => {
            const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'audio');
            if (sender) {
              sender.replaceTrack(newTrack);
            } else {
              pc.addTrack(newTrack, newStream);
            }
          });
          setIsMicOn(true);
        }
      } catch (e) {
        console.warn('Could not turn on microphone:', e);
      }
    }
  };

  // Toggle Cam
  const toggleCam = async () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach((track) => {
          track.enabled = !isCamOn;
        });
        setIsCamOn(!isCamOn);
        if (socket) {
          socket.emit('update-media-state', { isMicOn, isCamOn: !isCamOn });
        }
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const newTrack = stream.getVideoTracks()[0];
          localStream.addTrack(newTrack);
          peerConnectionsRef.current.forEach(({ pc }) => {
            pc.addTrack(newTrack, localStream);
          });
          setIsCamOn(true);
        } catch (e) {
          console.warn('Could not acquire camera track:', e);
        }
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localStreamRef.current = stream;
        peerConnectionsRef.current.forEach(({ pc }) => {
          stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        });
        setIsCamOn(true);
      } catch (e) {
        console.warn('Could not acquire camera stream:', e);
      }
    }
  };

  // Cleanly dismantle screen share tracks and renegotiate with all peers
  const stopScreenSharing = useCallback(() => {
    peerConnectionsRef.current.forEach(async ({ pc }, pId) => {
      const sender = screenSenderMapRef.current.get(pId);
      if (sender) {
        try {
          pc.removeTrack(sender);
        } catch (e) {}
        screenSenderMapRef.current.delete(pId);
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          if (socket) {
            socket.emit('webrtc-offer', { targetPeerId: pId, sdp: offer });
          }
        } catch (e) {
          console.warn('[ScreenShare] Error renegotiating removal:', e);
        }
      }
    });

    if (localScreenStreamRef.current) {
      localScreenStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    setLocalScreenStream(null);
    localScreenStreamRef.current = null;
    if (socket) {
      socket.emit('presentation-state-changed', {
        isPresenting: false,
        presenterName: '',
        presenterRole: '',
        screenStreamId: null,
        screenTrackId: null,
      });
    }
    setIsScreenSharing(false);
  }, [socket]);

  // Toggle Screen Share (Keeps Webcam Intact & Transmits Screen as Secondary Track)
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        setLocalScreenStream(screenStream);
        localScreenStreamRef.current = screenStream;

        peerConnectionsRef.current.forEach(async ({ pc }, pId) => {
          try {
            const sender = pc.addTrack(screenTrack, screenStream);
            screenSenderMapRef.current.set(pId, sender);

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            if (socket) {
              socket.emit('webrtc-offer', {
                targetPeerId: pId,
                sdp: offer,
              });
            }
          } catch (e) {
            console.warn('[ScreenShare] Error adding screen track to peer:', pId, e);
          }
        });

        if (socket) {
          socket.emit('presentation-state-changed', {
            isPresenting: true,
            presenterName: participantName || (role === 'doctor' ? doctorName : 'Patient'),
            presenterRole: role,
            screenStreamId: screenStream.id,
            screenTrackId: screenTrack.id,
          });
        }

        screenTrack.onended = stopScreenSharing;
        setIsScreenSharing(true);
      } catch (err) {
        console.warn('Screen share cancelled or failed:', err);
      }
    } else {
      stopScreenSharing();
    }
  };

  // Toggle Fit/Fill mode for an individual peer
  const togglePeerFitMode = (peerId) => {
    setPeerFitModes((prev) => {
      const next = new Map(prev);
      const current = next.get(peerId) || 'cover';
      next.set(peerId, current === 'cover' ? 'contain' : 'cover');
      return next;
    });
  };

  // Copy Plain Patient / Guest Consultation Link (Doctor only)
  const handleCopyLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const cleanUrl = `${origin}/room/${roomId}`;
    await navigator.clipboard.writeText(cleanUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // End Call
  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (localScreenStream) {
      localScreenStream.getTracks().forEach((track) => track.stop());
    }
    peerConnectionsRef.current.forEach(({ pc }) => {
      pc.close();
    });
    peerConnectionsRef.current.clear();
    screenSenderMapRef.current.clear();
    knownCamStreamIdsRef.current.clear();
    earlyIceCandidatesRef.current.clear();
    if (socket) {
      socket.disconnect();
    }
    setRemoteStreams(new Map());
    setRemoteScreenStreams(new Map());
    setCallEnded(true);
  };

  // ---------------------------------------------------------------------------
  // A. WAITING LOBBY SCREEN (Tier 3: Guest Waiting for Admission)
  // ---------------------------------------------------------------------------
  if (isWaitingInLobby) {
    return (
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-4 sm:p-6 bg-background overflow-hidden">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-card border border-border bg-surface text-center space-y-6 shadow-2xl">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
            <div className="relative w-16 h-16 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-text-main">Waiting for Doctor to Admit You</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Dr. Kale has been notified that you are waiting. You will automatically enter the consultation room once admitted.
            </p>
          </div>

          <div className="p-3.5 rounded-control bg-background border border-border text-xs text-text-muted space-y-1 text-left">
            <div className="flex justify-between">
              <span className="font-semibold text-text-main">Participant Name:</span>
              <span>{participantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-text-main">Status:</span>
              <span className="text-warning font-medium">In Waiting Lobby</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (socket) socket.disconnect();
              setIsWaitingInLobby(false);
            }}
            className="w-full py-2.5 rounded-control border border-border text-text-muted hover:text-text-main hover:bg-background text-xs font-medium transition-colors"
          >
            Cancel & Exit Lobby
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // B. ADMISSION DECLINED SCREEN
  // ---------------------------------------------------------------------------
  if (isAdmissionDenied) {
    return (
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-4 sm:p-6 bg-background overflow-hidden">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-card border border-border bg-surface text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-text-main">Admission Declined</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              The doctor is unable to admit additional participants into this consultation session at this time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full py-2.5 rounded-control bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // C. PRE-JOIN INTAKE SCREEN
  // ---------------------------------------------------------------------------
  if (!hasJoined && !callEnded) {
    const isDoctorHost = role === 'doctor';
    const isMagicPatient = accessType === 'patient_magic_link';

    return (
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-3 sm:p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 rounded-card border border-border bg-surface space-y-4 sm:space-y-5 shadow-2xl relative my-auto">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-text-main">
              {isDoctorHost
                ? 'Welcome Dr. Kale'
                : isMagicPatient
                ? 'Patient Consultation Portal'
                : 'Join Online Consultation'}
            </h2>
            <p className="text-[11px] sm:text-xs text-text-muted">
              {isDoctorHost
                ? 'Verified Host Token. Ready to conduct consultation.'
                : isMagicPatient
                ? 'Verified appointment link. Ready to connect with Dr. Kale.'
                : 'Enter your name to request admission from the doctor.'}
            </p>
          </div>

          {/* Camera / Mic Preview Box */}
          <div className="w-full h-44 sm:h-52 rounded-control border border-border bg-black relative overflow-hidden flex flex-col items-center justify-center">
            <video
              ref={prejoinVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!isCamOn || cameraNotice ? 'hidden' : ''}`}
            />

            {/* Insecure Context / Mobile Permission Banner */}
            {cameraNotice === 'mobile_http_insecure' && (
              <div className="p-3 text-center space-y-2 max-w-xs text-white">
                <div className="w-8 h-8 rounded-full bg-warning/20 text-warning mx-auto flex items-center justify-center">
                  <VideoOff className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-warning">Camera Blocked by Mobile Browser</p>
                <p className="text-[10px] text-white/80 leading-relaxed">
                  Mobile Chrome & Safari require HTTPS to turn on the camera on a network IP.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCameraHelp(!showCameraHelp)}
                  className="text-[11px] text-primary-soft hover:underline inline-flex items-center space-x-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Tap to see 10-second fix</span>
                </button>
              </div>
            )}

            {!isCamOn && !cameraNotice && (
              <div className="text-white text-xs flex flex-col items-center space-y-1">
                <VideoOff className="w-6 h-6 text-text-muted" />
                <span>Camera paused</span>
              </div>
            )}

            <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 z-10">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-1.5 rounded-full ${isMicOn ? 'bg-surface/80 text-text-main' : 'bg-danger text-white'}`}
                title={isMicOn ? 'Mute' : 'Unmute'}
              >
                {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={toggleCam}
                className={`p-1.5 rounded-full ${isCamOn ? 'bg-surface/80 text-text-main' : 'bg-danger text-white'}`}
                title={isCamOn ? 'Stop Camera' : 'Start Camera'}
              >
                {isCamOn ? <VideoIcon className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Mobile Camera Help Expandable Modal */}
          {showCameraHelp && (
            <div className="p-3 rounded-control border border-warning/30 bg-warning/5 text-xs space-y-2 text-text-main animate-in fade-in">
              <div className="flex justify-between items-center font-bold text-xs">
                <span className="flex items-center space-x-1.5 text-warning">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>How to Enable Phone Camera on Local Wi-Fi:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCameraHelp(false)}
                  className="text-text-muted hover:text-text-main p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[11px] text-text-muted space-y-1.5 leading-relaxed">
                <p>
                  <strong>Option A (Android Chrome):</strong> Open Chrome on your phone, paste this into the address bar:
                  <code className="block mt-1 p-1 bg-surface rounded border border-border select-all font-mono text-[10px]">
                    chrome://flags/#unsafely-treat-insecure-origin-as-secure
                  </code>
                  Enable it, add{' '}
                  <code className="text-primary font-mono">
                    {typeof window !== 'undefined' ? window.location.origin : 'http://10.63.9.158:3002'}
                  </code>
                  , and tap <strong>Relaunch</strong>.
                </p>
                <p>
                  <strong>Option B (Terminal):</strong> Run Next.js with self-signed HTTPS:
                  <code className="block mt-1 p-1 bg-surface rounded border border-border select-all font-mono text-[10px]">
                    npm run dev:https --prefix video-app/frontend
                  </code>
                  And open <code className="text-primary font-mono">https://10.63.9.158:3002</code> on your phone.
                </p>
              </div>
            </div>
          )}

          {/* Form Fields Based on Role */}
          {isDoctorHost ? (
            <div className="p-3 rounded-control bg-primary-soft border border-primary/20 flex items-center space-x-2 text-xs text-primary font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Doctor Host Privileges Verified (Whiteboard, Notes & Admission Control)</span>
            </div>
          ) : isMagicPatient ? (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-control bg-success/10 border border-success/20 flex items-center space-x-2 text-xs text-success font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>1-Click Magic Link Confirmed. Direct entry enabled.</span>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-main flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 rounded-control border border-border bg-background text-[16px] sm:text-xs text-text-main focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-main flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full p-2.5 rounded-control border border-border bg-background text-[16px] sm:text-xs text-text-main focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-main flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Your Name <span className="text-danger">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="e.g. Mrs. Sharma (Mother) or Rahul"
                  className="w-full p-2.5 rounded-control border border-border bg-background text-[16px] sm:text-xs text-text-main focus:outline-none focus:border-primary"
                />
                <p className="text-[11px] text-text-muted">
                  The doctor will see this name before admitting you.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {isDoctorHost ? (
              <button
                type="button"
                onClick={() => connectAndJoinRoom('doctor')}
                className="w-full py-3 rounded-control bg-primary hover:bg-primary-hover text-white text-xs font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>Enter Consultation Room as Host</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : isMagicPatient ? (
              <button
                type="button"
                onClick={() => connectAndJoinRoom('patient')}
                className="w-full py-3 rounded-control bg-primary hover:bg-primary-hover text-white text-xs font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>Join Consultation Directly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRequestGuestEntry}
                disabled={!participantName.trim()}
                className="w-full py-3 rounded-control bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ask to Join (Waiting Room)</span>
              </button>
            )}

            {!isDoctorHost && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowPinModal(true)}
                  className="text-[11px] text-text-muted hover:text-primary transition-colors inline-flex items-center space-x-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Are you Dr. Kale? Enter Host PIN</span>
                </button>
              </div>
            )}
          </div>

          {/* Host PIN Claim Modal */}
          {showPinModal && (
            <div className="absolute inset-0 bg-surface/98 backdrop-blur-md p-4 sm:p-6 rounded-card flex flex-col justify-center space-y-4 z-20">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-sm text-text-main">Doctor Host Verification</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="text-text-muted hover:text-text-main p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-text-muted">
                Enter your emergency Host PIN to claim full doctor control for this consultation.
              </p>

              <form onSubmit={handleClaimHostPin} className="space-y-3">
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="Enter Host PIN (e.g. 9999)"
                  value={hostPinInput}
                  onChange={(e) => setHostPinInput(e.target.value)}
                  className="w-full p-2.5 rounded-control border border-border bg-background text-[16px] sm:text-sm text-center tracking-widest font-mono text-text-main focus:outline-none focus:border-primary"
                />

                {pinError && (
                  <p className="text-xs text-danger font-medium text-center">{pinError}</p>
                )}

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 py-2 rounded-control border border-border text-xs text-text-muted hover:bg-background"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isClaimingHost || !hostPinInput.trim()}
                    className="flex-1 py-2 rounded-control bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-medium"
                  >
                    {isClaimingHost ? 'Verifying...' : 'Verify PIN'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // D. CALL CONCLUDED SCREEN
  // ---------------------------------------------------------------------------
  if (callEnded) {
    return (
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-4 sm:p-6 bg-background overflow-hidden">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-card border border-border bg-surface text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-primary-soft text-primary mx-auto flex items-center justify-center">
            <Check className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-text-main">Consultation Completed</h2>
          <p className="text-sm text-text-muted">
            Duration: <strong>{formatTimer(callDuration)}</strong>
          </p>
          <div className="pt-4">
            <a
              href="/"
              className="inline-block px-6 py-2.5 rounded-control bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors shadow-sm"
            >
              Done
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isDoctor = role === 'doctor';
  const otherMembers = members.filter((m) => m.id !== socket?.id);

  // Active Presentation State
  const isAnyPresentationActive = isScreenSharing || remotePresentation.isPresenting;

  // Total Participants Count (You + Remote Peers)
  const totalParticipantCount = 1 + otherMembers.length;

  // Workspace Open State (Whiteboard / Notes)
  const isWorkspaceOpen = showWhiteboard || showNotes;

  // Single Close Action for Workspace Drawer
  const closeWorkspace = () => {
    setShowWhiteboard(false);
    setShowNotes(false);
  };

  // Counterpart member for single-video view on mobile when workspace is open
  const primaryRemoteMember = isDoctor
    ? otherMembers.find((m) => m.role === 'patient') || otherMembers[0]
    : otherMembers.find((m) => m.role === 'doctor') || otherMembers[0];

  // ---------------------------------------------------------------------------
  // E. ACTIVE CALL INTERFACE (Google Meet Tile Alignment & Presentation Pinning)
  // ---------------------------------------------------------------------------
  return (
    <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row relative bg-surface overflow-hidden">
      {/* Video Stage Area */}
      <div
        className={`flex flex-col relative p-1.5 sm:p-2.5 md:p-3 bg-background justify-between overflow-hidden min-h-0 min-w-0 transition-all duration-300 ${
          isWorkspaceOpen ? 'h-[44%] sm:h-[46%] md:h-full md:flex-1' : 'flex-1 h-full'
        }`}
      >
        {/* Top Header Status Bar */}
        <div className="flex flex-col space-y-1.5 z-20 shrink-0">
          <div className="flex items-center justify-between">
            {/* Status Indicator */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-surface/90 border border-border backdrop-blur-sm text-[11px] sm:text-xs font-medium text-text-main shadow-sm">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
              <span>Connected</span>
              <span className="text-border">|</span>
              <span className="font-mono text-primary font-bold">{formatTimer(callDuration)}</span>
            </div>

            {/* Active Presentation Notification */}
            {isAnyPresentationActive && (
              <div className="hidden sm:flex px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-medium items-center space-x-1.5 animate-pulse">
                <Monitor className="w-3.5 h-3.5" />
                <span>
                  {isScreenSharing
                    ? 'You are presenting screen'
                    : `${remotePresentation.presenterName || 'Presenter'} is presenting`}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Share Consultation Link - DOCTOR ONLY! */}
              {isDoctor && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-surface border border-border hover:border-primary text-xs font-medium text-text-main flex items-center space-x-1.5 shadow-sm transition-colors"
                  title="Share Consultation Link"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="hidden sm:inline text-success font-semibold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5 text-primary" />
                      <span className="hidden sm:inline">Share Link</span>
                    </>
                  )}
                </button>
              )}

              {/* Members Button - COMPACT ICON BUTTON */}
              <button
                type="button"
                onClick={() => setShowMembers(!showMembers)}
                className={`relative p-2 rounded-full border transition-colors ${
                  showMembers
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface border-border text-text-main hover:border-primary'
                }`}
                title={`Consultation Members (${members.length})`}
                aria-label="View Members"
              >
                <Users className="w-4 h-4" />
                <span
                  className={`absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 shadow-sm ${
                    isDoctor && waitingGuests.length > 0
                      ? 'bg-warning text-white animate-pulse'
                      : 'bg-primary-soft text-primary'
                  }`}
                >
                  {isDoctor && waitingGuests.length > 0 ? waitingGuests.length : members.length}
                </span>
              </button>
            </div>
          </div>

          {/* Doctor-Only Floating Guest Admission Alert */}
          {isDoctor && waitingGuests.length > 0 && (
            <div className="bg-surface/98 border border-warning/40 backdrop-blur-md p-2 sm:p-2.5 rounded-control shadow-xl flex items-center justify-between space-x-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-warning animate-ping shrink-0" />
                <p className="text-xs text-text-main truncate">
                  <strong>{waitingGuests[0].name}</strong> is waiting to join.
                </p>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAdmitGuest(waitingGuests[0].socketId)}
                  className="px-2.5 sm:px-3 py-1 rounded bg-success hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
                >
                  Admit
                </button>
                <button
                  type="button"
                  onClick={() => handleDenyGuest(waitingGuests[0].socketId)}
                  className="px-2 sm:px-2.5 py-1 rounded bg-danger hover:bg-red-700 text-white text-xs font-medium transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* GOOGLE MEET TILE ADJUSTMENT ENGINE                                  */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex-1 min-h-0 min-w-0 flex flex-col justify-center py-1 sm:py-1.5 relative overflow-hidden">
          {isAnyPresentationActive ? (
            /* =============================================================== */
            /* MODE 1: PINNED PRESENTATION STAGE + VIDEO TILES ALIGNED TO RIGHT*/
            /* =============================================================== */
            <div className="flex-1 min-h-0 min-w-0 flex flex-col lg:flex-row gap-2 overflow-hidden">
              {/* Pinned Shared Screen Stage (Center/Left, object-contain, zero cropped edges) */}
              <div className="flex-1 min-h-0 min-w-0 rounded-xl sm:rounded-2xl border border-border/80 bg-black relative overflow-hidden flex items-center justify-center shadow-inner">
                <video
                  ref={pinnedVideoRef}
                  autoPlay
                  playsInline
                  muted={isScreenSharing}
                  className="w-full h-full object-contain"
                />

                {/* Presentation Badge */}
                <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center space-x-1.5 shadow border border-white/10 z-10">
                  <Monitor className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>
                    {isScreenSharing
                      ? 'You are presenting screen'
                      : `${remotePresentation.presenterName || 'Presenter'} is presenting screen`}
                  </span>
                </div>

                {/* Presenter Stop Sharing Button */}
                {isScreenSharing && (
                  <button
                    type="button"
                    onClick={toggleScreenShare}
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-danger hover:bg-red-700 text-white text-[11px] font-medium shadow transition-colors z-10"
                  >
                    Stop Presenting
                  </button>
                )}

                {/* Google Meet style member count circle in bottom-right (shown when cam feeds are hidden on mobile) */}
                <button
                  type="button"
                  onClick={() => setShowMembers(true)}
                  className={`absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 hover:bg-black/95 backdrop-blur-md text-white text-[11px] font-semibold items-center space-x-1.5 shadow border border-white/15 z-10 transition-transform active:scale-95 ${
                    isWorkspaceOpen ? 'flex' : 'hidden lg:flex'
                  }`}
                  title={`View ${members.length} members`}
                >
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{members.length}</span>
                </button>
              </div>

              {/* Participant Video Tiles - Case 1: Hidden on mobile when workspace is open. Case 2: Visible in horizontal scrollable strip below presentation when workspace is closed. Desktop/Laptop: Right sidebar. */}
              <div
                className={`shrink-0 ${
                  isWorkspaceOpen
                    ? 'hidden lg:flex lg:flex-col gap-2 lg:h-auto lg:max-h-full lg:w-64 xl:w-72 overflow-y-auto py-0'
                    : 'flex flex-row lg:flex-col gap-1.5 sm:gap-2 h-20 sm:h-24 lg:h-auto lg:max-h-full lg:w-64 xl:w-72 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto py-0.5 lg:py-0'
                }`}
              >
                {/* Local Participant Tile */}
                <ParticipantVideoTile
                  stream={localStream}
                  isLocal={true}
                  name={participantName || (role === 'doctor' ? doctorName : 'Patient')}
                  role={role}
                  isMicOn={isMicOn}
                  isCamOn={isCamOn}
                  fitMode="cover"
                  className={isWorkspaceOpen ? 'w-full aspect-video shrink-0' : 'h-full lg:h-auto aspect-video shrink-0 lg:w-full'}
                />

                {/* All Remote Participants Tiles */}
                {otherMembers.map((member) => (
                  <ParticipantVideoTile
                    key={member.id}
                    stream={remoteStreams.get(member.id)}
                    isLocal={false}
                    name={member.name || 'Participant'}
                    role={member.role || 'patient'}
                    isMicOn={member.isMicOn !== false}
                    isCamOn={member.isCamOn !== false}
                    fitMode={peerFitModes.get(member.id) || 'cover'}
                    onToggleFit={() => togglePeerFitMode(member.id)}
                    className={isWorkspaceOpen ? 'w-full aspect-video shrink-0' : 'h-full lg:h-auto aspect-video shrink-0 lg:w-full'}
                  />
                ))}
              </div>
            </div>
          ) : isWorkspaceOpen ? (
            /* =============================================================== */
            /* MODE 2A: MOBILE WORKSPACE OPEN - SHOW SINGLE VIDEO ABOVE DRAWER */
            /* =============================================================== */
            <>
              {/* Mobile View: Single video tile of doctor (to patient) or patient (to doctor) */}
              {/* STRICTLY CONTAINED (object-contain) & BOUNDED CONTAINER SIZE */}
              <div className="md:hidden flex-1 min-h-0 min-w-0 w-full flex items-center justify-center p-1 overflow-hidden">
                <div className="w-full h-full max-h-full aspect-video flex items-center justify-center bg-black rounded-xl overflow-hidden shadow relative">
                  {primaryRemoteMember ? (
                    <ParticipantVideoTile
                      key={primaryRemoteMember.id}
                      stream={remoteStreams.get(primaryRemoteMember.id)}
                      isLocal={false}
                      name={primaryRemoteMember.name || (isDoctor ? 'Patient' : 'Dr. Kale')}
                      role={primaryRemoteMember.role || (isDoctor ? 'patient' : 'doctor')}
                      isMicOn={primaryRemoteMember.isMicOn !== false}
                      isCamOn={primaryRemoteMember.isCamOn !== false}
                      fitMode="contain"
                      className="w-full h-full"
                    />
                  ) : (
                    <ParticipantVideoTile
                      stream={localStream}
                      isLocal={true}
                      name={participantName || (role === 'doctor' ? 'Dr. Kale' : 'Patient')}
                      role={role}
                      isMicOn={isMicOn}
                      isCamOn={isCamOn}
                      fitMode="contain"
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>

              {/* Desktop/Tablet View (md+): Standard Gallery Grid */}
              <div
                className={`hidden md:grid flex-1 min-h-0 w-full overflow-hidden ${
                  totalParticipantCount <= 1
                    ? 'flex items-center justify-center p-2'
                    : totalParticipantCount === 2
                    ? 'grid-cols-2 grid-rows-1 gap-2 sm:gap-3'
                    : totalParticipantCount === 3
                    ? 'grid-cols-3 grid-rows-1 gap-2 sm:gap-3'
                    : totalParticipantCount === 4
                    ? 'grid-cols-2 grid-rows-2 gap-2 sm:gap-3'
                    : 'grid-cols-2 md:grid-cols-3 auto-rows-fr gap-2'
                }`}
              >
                {/* Local Tile */}
                <ParticipantVideoTile
                  stream={localStream}
                  isLocal={true}
                  name={participantName || (role === 'doctor' ? 'Dr. Kale' : 'Patient')}
                  role={role}
                  isMicOn={isMicOn}
                  isCamOn={isCamOn}
                  fitMode="cover"
                  className={totalParticipantCount <= 1 ? 'w-full max-w-2xl aspect-video mx-auto h-auto' : 'w-full h-full'}
                />

                {/* All Remote Participant Tiles */}
                {otherMembers.map((member) => (
                  <ParticipantVideoTile
                    key={member.id}
                    stream={remoteStreams.get(member.id)}
                    isLocal={false}
                    name={member.name || 'Participant'}
                    role={member.role || 'patient'}
                    isMicOn={member.isMicOn !== false}
                    isCamOn={member.isCamOn !== false}
                    fitMode={peerFitModes.get(member.id) || 'cover'}
                    onToggleFit={() => togglePeerFitMode(member.id)}
                    className="w-full h-full"
                  />
                ))}
              </div>
            </>
          ) : (
            /* =============================================================== */
            /* MODE 2B: NORMAL GALLERY GRID (Workspace Closed)                 */
            /* =============================================================== */
            <div
              className={`flex-1 min-h-0 w-full overflow-hidden ${
                totalParticipantCount <= 1
                  ? 'flex items-center justify-center p-2'
                  : totalParticipantCount === 2
                  ? 'grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-2 sm:gap-3'
                  : totalParticipantCount === 3
                  ? 'grid grid-cols-1 grid-rows-3 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-3 md:grid-rows-1 gap-2 sm:gap-3'
                  : totalParticipantCount === 4
                  ? 'grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3'
                  : 'grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-2'
              }`}
            >
              {/* Local Tile */}
              <ParticipantVideoTile
                stream={localStream}
                isLocal={true}
                name={participantName || (role === 'doctor' ? 'Dr. Kale' : 'Patient')}
                role={role}
                isMicOn={isMicOn}
                isCamOn={isCamOn}
                fitMode="cover"
                className={totalParticipantCount <= 1 ? 'w-full max-w-2xl aspect-video mx-auto h-auto' : 'w-full h-full'}
              />

              {/* All Remote Participant Tiles (Visible to Everyone!) */}
              {otherMembers.map((member) => (
                <ParticipantVideoTile
                  key={member.id}
                  stream={remoteStreams.get(member.id)}
                  isLocal={false}
                  name={member.name || 'Participant'}
                  role={member.role || 'patient'}
                  isMicOn={member.isMicOn !== false}
                  isCamOn={member.isCamOn !== false}
                  fitMode={peerFitModes.get(member.id) || 'cover'}
                  onToggleFit={() => togglePeerFitMode(member.id)}
                  className="w-full h-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* Call Toolbar Controls (Compact & Scaled to Never Overflow) */}
        <div className="py-1.5 sm:py-2 px-1 sm:px-4 flex items-center justify-center space-x-2 sm:space-x-3 z-20 shrink-0 max-w-full overflow-x-auto">
          {/* Mic */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 sm:p-3 rounded-full transition-all shadow-sm shrink-0 ${
              isMicOn
                ? 'bg-surface border border-border text-text-main hover:bg-background'
                : 'bg-danger text-white'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <MicOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
          </button>

          {/* Cam */}
          <button
            type="button"
            onClick={toggleCam}
            className={`p-2.5 sm:p-3 rounded-full transition-all shadow-sm shrink-0 ${
              isCamOn
                ? 'bg-surface border border-border text-text-main hover:bg-background'
                : 'bg-danger text-white'
            }`}
            title={isCamOn ? 'Stop Camera' : 'Start Camera'}
          >
            {isCamOn ? <VideoIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <VideoOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
          </button>

          {/* Screen Share - DOCTOR ONLY! (Completely Removed for Guardian & Patient) */}
          {isDoctor && (
            <button
              type="button"
              onClick={toggleScreenShare}
              className={`p-2.5 sm:p-3 rounded-full transition-all shadow-sm shrink-0 flex ${
                isScreenSharing
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface border border-border text-text-main hover:bg-background'
              }`}
              title={isScreenSharing ? 'Stop Presenting' : 'Share Screen'}
            >
              <Monitor className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          )}

          {/* Whiteboard / Notes Button */}
          {isDoctor ? (
            /* DOCTOR: On mobile, opens ONLY Whiteboard (does not open notes). On desktop/laptop, opens both. */
            <button
              type="button"
              onClick={() => {
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                if (isMobile) {
                  // Mobile: Toggle Whiteboard only (never open notes together on mobile)
                  if (showWhiteboard) {
                    setShowWhiteboard(false);
                  } else {
                    setShowWhiteboard(true);
                    setShowNotes(false);
                  }
                } else {
                  // Desktop / Laptop: Toggle both simultaneously
                  const nextState = !(showWhiteboard && showNotes);
                  setShowWhiteboard(nextState);
                  setShowNotes(nextState);
                }
              }}
              className={`p-2.5 sm:p-3 rounded-full transition-all shadow-sm shrink-0 flex items-center space-x-1 ${
                showWhiteboard || showNotes
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface border border-border text-text-main hover:bg-background'
              }`}
              title={showWhiteboard || showNotes ? 'Close Whiteboard' : 'Open Whiteboard'}
            >
              <PenTool className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          ) : (
            /* PATIENT: Single Button for Whiteboard (Kept exactly same!) */
            <button
              type="button"
              onClick={() => setShowWhiteboard(!showWhiteboard)}
              className={`p-2.5 sm:p-3 rounded-full transition-all shadow-sm shrink-0 ${
                showWhiteboard
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface border border-border text-text-main hover:bg-background'
              }`}
              title="View Whiteboard"
            >
              <PenTool className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          )}

          {/* Settings */}
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="p-2.5 sm:p-3 rounded-full bg-surface border border-border text-text-muted hover:text-text-main shadow-sm shrink-0"
            title="Device Settings"
          >
            <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* End Call */}
          <button
            type="button"
            onClick={handleEndCall}
            className="p-2.5 sm:p-3 rounded-full bg-danger text-white hover:bg-red-700 transition-colors shadow-sm shrink-0"
            title="Leave Call"
          >
            <PhoneOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* WORKSPACE SIDEBAR / BOTTOM DRAWER: Locked 1:1 Ratio on Laptop & Mobile */}
      {/* ------------------------------------------------------------------- */}
      {isWorkspaceOpen && (
        <div
          className={`flex flex-col border-t md:border-t-0 md:border-l border-border bg-surface shrink-0 shadow-2xl overflow-hidden z-30 transition-all duration-300 ${
            showWhiteboard && showNotes
              ? 'h-[56%] sm:h-[54%] md:h-full w-full md:w-[380px] lg:w-[420px]'
              : 'h-[56%] sm:h-[54%] md:h-full w-full md:w-auto md:aspect-square md:max-w-[48vw]'
          }`}
        >
          {showWhiteboard && showNotes ? (
            /* BOTH OPEN: WHITEBOARD GETS DOMINANT SPACE TO LOCK 1:1 RATIO; NOTETAKER IS COMPACT */
            /* SINGLE CLOSE BUTTON ON WHITEBOARD'S TOP-RIGHT CLOSES BOTH! */
            <div className="flex-1 flex flex-col h-full min-h-0 divide-y divide-border overflow-hidden">
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <Whiteboard
                  socket={socket}
                  roomId={roomId}
                  role={role}
                  isPatientSynced={isPatientWhiteboardSynced}
                  onTogglePatientWhiteboard={handleTogglePatientWhiteboard}
                  onClose={closeWorkspace}
                />
              </div>

              <div className="h-44 sm:h-48 md:h-52 shrink-0 flex flex-col overflow-hidden bg-surface">
                <NoteTaker
                  roomId={roomId}
                  doctorName="Dr. Kale"
                  patientName={otherMembers[0]?.name || 'Patient'}
                  onClose={null}
                />
              </div>
            </div>
          ) : showWhiteboard ? (
            /* ONLY Whiteboard Open (Mobile, or switched from Notes) */
            <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden">
              <Whiteboard
                socket={socket}
                roomId={roomId}
                role={role}
                isPatientSynced={isPatientWhiteboardSynced}
                onTogglePatientWhiteboard={handleTogglePatientWhiteboard}
                onSwitchToNotes={() => {
                  setShowWhiteboard(false);
                  setShowNotes(true);
                }}
                onClose={closeWorkspace}
              />
            </div>
          ) : (
            /* ONLY Notes Open (Mobile, or switched from Whiteboard) */
            <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden">
              <NoteTaker
                roomId={roomId}
                doctorName="Dr. Kale"
                patientName={otherMembers[0]?.name || 'Patient'}
                onSwitchToWhiteboard={() => {
                  setShowNotes(false);
                  setShowWhiteboard(true);
                }}
                onClose={closeWorkspace}
              />
            </div>
          )}
        </div>
      )}

      {/* Slide-out / Modal Members List */}
      {showMembers && (
        <MembersList
          members={members}
          waitingGuests={waitingGuests}
          role={role}
          onAdmitGuest={handleAdmitGuest}
          onDenyGuest={handleDenyGuest}
          onClose={() => setShowMembers(false)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
