'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Copy, Download, Trash2, X, Check, PenTool } from 'lucide-react';

export function NoteTaker({
  roomId,
  doctorName = 'Dr. Kale',
  patientName = 'Patient',
  onSwitchToWhiteboard,
  onClose,
}) {
  const storageKey = `kale_call_notes_${roomId}`;
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setNotes(saved);
    }
  }, [storageKey]);

  const handleChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem(storageKey, val);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const header = `${doctorName} Clinic - Consultation Notes\nPatient: ${patientName}\nDate: ${new Date().toLocaleDateString()}\n----------------------------------------\n\n`;
    const file = new Blob([header + notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Consultation_Notes_${roomId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    if (window.confirm('Clear all notes for this consultation?')) {
      setNotes('');
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col p-2 sm:p-2.5 space-y-1.5 bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-text-main truncate">Clinical Note Taker</h3>
            <p className="text-[10px] text-text-muted truncate">Doctor eyes only (Encrypted locally)</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          {onSwitchToWhiteboard && (
            <button
              type="button"
              onClick={onSwitchToWhiteboard}
              className="px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 bg-surface border border-border hover:border-primary text-text-main transition-colors shadow-sm"
              title="Switch to Whiteboard"
            >
              <PenTool className="w-3.5 h-3.5 text-primary" />
              <span>Whiteboard</span>
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-text-muted hover:text-text-main p-1 rounded-md shrink-0"
              title="Close Notes"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-1.5 p-1 rounded-control bg-background border border-border text-xs shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-0.5 rounded bg-surface hover:bg-border text-text-main font-medium flex items-center space-x-1 transition-colors text-[11px]"
          title="Copy notes to clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="px-2 py-0.5 rounded bg-surface hover:bg-border text-text-main font-medium flex items-center space-x-1 transition-colors text-[11px]"
          title="Download notes file"
        >
          <Download className="w-3 h-3" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="p-1 text-text-muted hover:text-danger rounded ml-auto"
          title="Clear notes"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 flex flex-col">
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder="Document chief complaints, clinical observations, repertory symptoms, or homeopathic remedy hints..."
          className="flex-1 w-full p-2.5 rounded-control border border-border bg-background text-xs sm:text-sm text-text-main focus:outline-none focus:border-primary resize-none font-mono leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-text-muted shrink-0 pt-0.5">
        <span className="flex items-center space-x-1 text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>Autosaved</span>
        </span>
        <span>{notes.length} characters</span>
      </div>
    </div>
  );
}
