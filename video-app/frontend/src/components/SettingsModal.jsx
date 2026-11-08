'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Mic, Video, X } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, onDeviceChange }) {
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    async function loadDevices() {
      try {
        if (!navigator?.mediaDevices?.enumerateDevices) {
          console.warn('enumerateDevices not available in this context');
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter((d) => d.kind === 'audioinput');
        const videos = devices.filter((d) => d.kind === 'videoinput');

        setAudioDevices(audios);
        setVideoDevices(videos);

        if (audios.length > 0 && !selectedAudio) setSelectedAudio(audios[0].deviceId);
        if (videos.length > 0 && !selectedVideo) setSelectedVideo(videos[0].deviceId);
      } catch (err) {
        console.warn('Could not enumerate media devices:', err);
      }
    }

    loadDevices();
  }, [isOpen, selectedAudio, selectedVideo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-text-main">Device Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text-main"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Selectors */}
        <div className="space-y-4 text-sm">
          {/* Audio Input */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-2 font-medium text-text-main text-xs">
              <Mic className="w-4 h-4 text-primary" />
              <span>Microphone</span>
            </label>
            <select
              value={selectedAudio}
              onChange={(e) => {
                setSelectedAudio(e.target.value);
                onDeviceChange?.({ audioDeviceId: e.target.value });
              }}
              className="w-full p-2.5 rounded-control border border-border bg-background text-text-main text-xs focus:outline-none focus:border-primary"
            >
              {audioDevices.length > 0 ? (
                audioDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Microphone ${i + 1}`}
                  </option>
                ))
              ) : (
                <option value="">Default Microphone</option>
              )}
            </select>
          </div>

          {/* Video Camera */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-2 font-medium text-text-main text-xs">
              <Video className="w-4 h-4 text-primary" />
              <span>Camera</span>
            </label>
            <select
              value={selectedVideo}
              onChange={(e) => {
                setSelectedVideo(e.target.value);
                onDeviceChange?.({ videoDeviceId: e.target.value });
              }}
              className="w-full p-2.5 rounded-control border border-border bg-background text-text-main text-xs focus:outline-none focus:border-primary"
            >
              {videoDevices.length > 0 ? (
                videoDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))
              ) : (
                <option value="">Default Camera</option>
              )}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-control bg-primary hover:bg-primary-hover text-white text-xs font-medium shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
