'use client';

import React from 'react';
import { Users, X, Mic, MicOff, Video, VideoOff, ShieldCheck, Clock, UserCheck, UserX } from 'lucide-react';

export function MembersList({
  members = [],
  waitingGuests = [],
  role = 'patient',
  onAdmitGuest,
  onDenyGuest,
  onClose,
}) {
  const isDoctor = role === 'doctor';

  return (
    <div className="fixed inset-0 z-50 md:static md:inset-auto md:z-30 w-full md:w-[320px] border-l border-border bg-surface flex flex-col p-4 space-y-4 shrink-0 shadow-2xl md:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-text-main">Consultation Members</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-soft text-primary font-semibold">
            {members.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-text-muted hover:text-text-main p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Doctor-Only: Waiting Lobby Queue */}
      {isDoctor && waitingGuests.length > 0 && (
        <div className="p-3 rounded-control border border-warning/30 bg-warning/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-text-main">
              <Clock className="w-3.5 h-3.5 text-warning" />
              <span>Waiting Lobby</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning font-bold">
              {waitingGuests.length}
            </span>
          </div>

          <div className="space-y-1.5">
            {waitingGuests.map((guest) => (
              <div
                key={guest.socketId}
                className="p-2 rounded bg-surface border border-border flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-medium text-text-main truncate">{guest.name}</p>
                  <p className="text-[10px] text-text-muted">Guardian / Guest</p>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onAdmitGuest && onAdmitGuest(guest.socketId)}
                    className="p-1 px-2 rounded bg-success hover:bg-emerald-600 text-white text-[11px] font-medium flex items-center space-x-1 transition-colors"
                    title="Admit to Consultation"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Admit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDenyGuest && onDenyGuest(guest.socketId)}
                    className="p-1 px-1.5 rounded bg-danger hover:bg-red-700 text-white text-[11px] font-medium transition-colors"
                    title="Decline"
                  >
                    <UserX className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Members Directory */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Active Participants ({members.length})
        </p>
        {members.map((member) => {
          const isMemberDoctor = member.role === 'doctor';
          return (
            <div
              key={member.id}
              className="p-3 rounded-control border border-border bg-background flex items-center justify-between space-x-3"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isMemberDoctor
                      ? 'bg-primary text-white'
                      : 'bg-primary-soft text-primary'
                  }`}
                >
                  {isMemberDoctor ? 'Dr' : (member.name ? member.name.slice(0, 1).toUpperCase() : 'P')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="font-medium text-xs text-text-main truncate">
                      {member.name || (isMemberDoctor ? 'Dr. Kale' : 'Patient')}
                    </p>
                    {isMemberDoctor && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary-soft text-primary font-semibold">
                        Host
                      </span>
                    )}
                  </div>
                  {member.email && (
                    <p className="text-[10px] text-text-muted truncate">{member.email}</p>
                  )}
                  {member.role === 'guardian' && (
                    <p className="text-[10px] text-text-muted">Guardian / Family</p>
                  )}
                </div>
              </div>

              {/* Status Icons */}
              <div className="flex items-center space-x-1.5 text-text-muted shrink-0">
                {member.isMicOn ? (
                  <Mic className="w-3.5 h-3.5 text-success" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-danger" />
                )}
                {member.isCamOn ? (
                  <Video className="w-3.5 h-3.5 text-text-muted" />
                ) : (
                  <VideoOff className="w-3.5 h-3.5 text-danger" />
                )}
              </div>
            </div>
          );
        })}

        {members.length === 0 && (
          <p className="text-xs text-text-muted text-center py-6">Connecting participants...</p>
        )}
      </div>

      <div className="pt-2 border-t border-border flex items-center space-x-1.5 text-[11px] text-text-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <span>End-to-end encrypted consultation</span>
      </div>
    </div>
  );
}

