'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PenTool, Eraser, RotateCcw, X, Eye, Users, FileText } from 'lucide-react';

const COLORS = [
  { name: 'Teal', value: '#176B63' },
  { name: 'Sage', value: '#8BA99B' },
  { name: 'Charcoal', value: '#1F2D2A' },
  { name: 'Red', value: '#B33A3A' },
  { name: 'White', value: '#FFFFFF' },
];

export function Whiteboard({
  socket,
  roomId,
  role = 'patient',
  isPatientSynced = false,
  onTogglePatientWhiteboard,
  onSwitchToNotes,
  onClose,
}) {
  const isDoctor = role === 'doctor';
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#176B63');
  const [isEraser, setIsEraser] = useState(false);
  const strokeWidth = 3;

  // Draws a stroke using normalized 0.0-1.0 coordinates so it scales identically across any screen size
  const renderNormalizedStroke = useCallback((ctx, width, height, stroke) => {
    const { nx0, ny0, nx1, ny1, strokeColor, strokeWidth, eraser } = stroke;
    ctx.save();
    if (eraser) {
      // True pixel erasure: clears ink transparently rather than dropping white ink
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = strokeWidth || 22;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth || 3;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(nx0 * width, ny0 * height);
    ctx.lineTo(nx1 * width, ny1 * height);
    ctx.stroke();
    ctx.restore();
  }, []);

  // Redraw entire history onto canvas
  const redrawAll = useCallback(
    (strokes) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (Array.isArray(strokes)) {
        strokes.forEach((s) => {
          renderNormalizedStroke(ctx, width, height, s);
        });
      }
    },
    [renderNormalizedStroke]
  );

  // Canvas setup and history retrieval (Locked 1:1 Aspect Ratio)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const size = Math.round(Math.min(rect.width, rect.height));
      canvas.width = size;
      canvas.height = size;
      // Replay all strokes whenever size is set/resized
      redrawAll(historyRef.current);
    };

    setupCanvasSize();
    window.addEventListener('resize', setupCanvasSize);

    if (socket) {
      // 1. Immediately request current whiteboard history from server
      socket.emit('request-canvas-history');

      // 2. Receive history (for late-joining patients or newly opened whiteboard)
      const handleHistory = (history) => {
        historyRef.current = history || [];
        redrawAll(historyRef.current);
      };
      socket.on('canvas-history', handleHistory);

      // 3. Receive single live stroke from doctor
      const handleLiveStroke = (stroke) => {
        historyRef.current.push(stroke);
        const ctx = canvas.getContext('2d');
        renderNormalizedStroke(ctx, canvas.width, canvas.height, stroke);
      };
      socket.on('canvas-stroke', handleLiveStroke);

      // 4. Clear event
      const handleClear = () => {
        historyRef.current = [];
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
      socket.on('canvas-clear', handleClear);

      return () => {
        window.removeEventListener('resize', setupCanvasSize);
        socket.off('canvas-history', handleHistory);
        socket.off('canvas-stroke', handleLiveStroke);
        socket.off('canvas-clear', handleClear);
      };
    }

    return () => {
      window.removeEventListener('resize', setupCanvasSize);
    };
  }, [socket, redrawAll, renderNormalizedStroke]);

  const prevNormCoordRef = useRef({ nx: 0, ny: 0 });

  const startDrawing = (e) => {
    if (!isDoctor) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;

    prevNormCoordRef.current = { nx, ny };
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !isDoctor) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const stroke = {
      nx0: prevNormCoordRef.current.nx,
      ny0: prevNormCoordRef.current.ny,
      nx1: nx,
      ny1: ny,
      strokeColor: color,
      strokeWidth: isEraser ? 22 : strokeWidth,
      eraser: isEraser,
    };

    historyRef.current.push(stroke);
    const ctx = canvas.getContext('2d');
    renderNormalizedStroke(ctx, canvas.width, canvas.height, stroke);

    // Broadcast normalized stroke to peers in the room
    if (socket) {
      socket.emit('canvas-stroke', stroke);
    }

    prevNormCoordRef.current = { nx, ny };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (!isDoctor) return;
    historyRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (socket) {
      socket.emit('canvas-clear');
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col p-2 sm:p-2.5 space-y-2 bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <PenTool className="w-4 h-4 text-primary shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-text-main truncate">
            {isDoctor ? 'Doctor Whiteboard' : 'Consultation Whiteboard'}
          </span>
          {!isDoctor && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-soft text-primary font-medium flex items-center space-x-1 shrink-0">
              <Eye className="w-3 h-3" />
              <span>View Only</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Doctor Toggle for Patient Whiteboard */}
          {isDoctor && onTogglePatientWhiteboard && (
            <button
              type="button"
              onClick={onTogglePatientWhiteboard}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition-colors ${
                isPatientSynced
                  ? 'bg-success text-white shadow-sm'
                  : 'bg-primary-soft text-primary hover:bg-primary/20'
              }`}
              title="Automatically open or close whiteboard on patient screen"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPatientSynced ? 'Synced to Patient' : 'Share to Patient'}</span>
              <span className="sm:hidden">{isPatientSynced ? 'Synced' : 'Share'}</span>
            </button>
          )}

          {/* Doctor Switch to Clinical Notes */}
          {isDoctor && onSwitchToNotes && (
            <button
              type="button"
              onClick={onSwitchToNotes}
              className="px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 bg-surface border border-border hover:border-primary text-text-main transition-colors shadow-sm"
              title="Open Clinical Notes"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Notes</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-text-muted hover:text-text-main p-1 rounded-md shrink-0"
              title="Close Whiteboard"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Toolbar Controls - Doctor ONLY */}
      {isDoctor ? (
        <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-control bg-background border border-border text-xs shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setColor(c.value);
                  setIsEraser(false);
                }}
                style={{ backgroundColor: c.value }}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-transform ${
                  !isEraser && color === c.value ? 'scale-125 border-primary shadow' : 'border-border'
                }`}
                title={c.name}
              />
            ))}
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 border-l border-border pl-2">
            <button
              type="button"
              onClick={() => setIsEraser(!isEraser)}
              className={`p-1 rounded ${isEraser ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'}`}
              title="Eraser"
            >
              <Eraser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-text-muted hover:text-danger rounded"
              title="Clear Whiteboard"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-2.5 py-1 rounded-control bg-background border border-border text-[11px] text-text-muted shrink-0">
          Dr. Kale is sharing notes and diagrams in real-time.
        </div>
      )}

      {/* Drawing Canvas Area - Fixed 1:1 Square Aspect Ratio on Doctor & Patient */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center bg-background rounded-control border border-border p-1.5 overflow-hidden">
        <div className="w-full h-full max-w-full max-h-full aspect-square relative bg-white dark:bg-[#15201d] border border-border/80 rounded shadow-inner flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className={`w-full h-full touch-none block ${isDoctor ? 'cursor-crosshair' : 'cursor-default'}`}
          />
        </div>
      </div>
    </div>
  );
}
