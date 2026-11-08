'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, ArrowRight, Plus } from 'lucide-react';

function getVideoApiUrl() {
  if (process.env.NEXT_PUBLIC_VIDEO_API_URL) {
    return process.env.NEXT_PUBLIC_VIDEO_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:4002`;
  }
  return 'http://localhost:4002';
}

export default function VideoAppHomePage() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Creates a secure room via API with cryptographic tokens (NO ?role= in URL!)
  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const apiUrl = getVideoApiUrl();
      const res = await fetch(`${apiUrl}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorName: 'Dr. Kale',
          patientName: 'Patient',
        }),
      });
      const data = await res.json();
      if (data.roomId && data.doctorToken) {
        router.push(`/room/${data.roomId}?token=${data.doctorToken}`);
      } else if (data.roomId) {
        router.push(`/room/${data.roomId}`);
      }
    } catch (err) {
      console.warn('Could not reach room API, starting offline session:', err);
      const randomRoomId = Math.random().toString(36).substring(2, 10);
      router.push(`/room/${randomRoomId}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanId = roomIdInput.trim();
    if (cleanId) {
      // Clean link without ?role=
      router.push(`/room/${cleanId}`);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-lg p-5 sm:p-8 rounded-card border border-border bg-surface space-y-5 sm:space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary-soft text-primary mx-auto flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Online Consultation Platform
          </h1>
          <p className="text-xs text-text-muted">
            Direct video consultation room with screen sharing and clinical workspace tools.
          </p>
        </div>

        {/* Start Room */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full py-3 rounded-control bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Creating Room...' : 'Start New Consultation (Doctor Host)'}</span>
          </button>
        </div>

        {/* Or Join with Room ID */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs text-text-muted">Or join with Room ID</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <form onSubmit={handleJoin} className="flex gap-2">
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Enter Room ID"
            className="flex-1 p-2.5 rounded-control border border-border bg-background text-xs text-text-main focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!roomIdInput.trim()}
            className="px-4 py-2.5 rounded-control border border-border bg-surface hover:border-primary disabled:opacity-50 text-text-main text-xs font-medium flex items-center space-x-1 transition-colors"
          >
            <span>Join</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
