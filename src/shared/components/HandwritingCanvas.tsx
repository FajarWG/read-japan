"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { 
  Undo2, 
  Trash2, 
  RefreshCw, 
  Keyboard, 
  PenTool, 
  Delete, 
  Sparkles,
  CheckCircle,
  X
} from "lucide-react";
import { recognizeHandwriting } from "../actions/handwriting";

interface StrokePoint {
  x: number;
  y: number;
  time: number;
}

interface Stroke {
  points: StrokePoint[];
}

interface DrawingSegment {
  id: string;
  text: string;
  strokes: Stroke[];
  width: number;
  height: number;
}

interface HandwritingCanvasProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  language?: string; // 'ja' or 'en'
  className?: string;
  id?: string;
}

export function HandwritingCanvas({
  value,
  onChange,
  onSubmit,
  placeholder = "Tulis di sini...",
  language = "ja",
  className = "",
  id = "handwriting-canvas"
}: HandwritingCanvasProps) {
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [segments, setSegments] = useState<DrawingSegment[]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [drawProgress, setDrawProgress] = useState(0); // Progress bar for auto-recognize
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const strokeStartTimeRef = useRef<number>(0);
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getDpr = () => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

  // Redraw canvas content
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = getDpr();
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Get current theme accent color or fallback to purple
    let strokeColor = "#7c6ef5";
    if (typeof window !== "undefined") {
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--accent").trim();
      if (accent) strokeColor = accent;
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes]);

  // Initialize and resize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = getDpr();

    // Set resolution sizes
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }
    redrawCanvas();
  }, [redrawCanvas]);

  // Sync canvas size on mount and window resize
  useEffect(() => {
    if (isKeyboardMode) return;
    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [initCanvas, isKeyboardMode]);

  // Redraw when strokes change
  useEffect(() => {
    if (!isKeyboardMode) {
      redrawCanvas();
    }
  }, [strokes, redrawCanvas, isKeyboardMode]);

  // Sync outside changes to value with internal segment states
  useEffect(() => {
    const currentSegmentsText = segments.map((s) => s.text).join("");
    if (value !== currentSegmentsText) {
      if (!value) {
        setSegments([]);
      } else {
        const newSegments: DrawingSegment[] = [];
        let tempValue = value;
        
        // Preserve segments that still match the prefix of value
        for (const seg of segments) {
          if (tempValue.startsWith(seg.text)) {
            newSegments.push(seg);
            tempValue = tempValue.substring(seg.text.length);
          } else {
            break;
          }
        }
        
        // For remaining text, generate text-only segments (empty strokes)
        if (tempValue.length > 0) {
          for (const char of tempValue.split("")) {
            newSegments.push({
              id: Math.random().toString(36).substring(2, 9),
              text: char,
              strokes: [],
              width: 300,
              height: 150
            });
          }
        }
        setSegments(newSegments);
      }
    }
  }, [value]);

  // Clear timers
  const clearTimers = () => {
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setDrawProgress(0);
  };

  // Recognize API caller
  const triggerRecognition = useCallback(async (currentStrokes: Stroke[]) => {
    if (currentStrokes.length === 0 || !canvasRef.current) return;
    setIsRecognizing(true);
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Format to [ [x1, x2, ...], [y1, y2, ...], [t1, t2, ...] ]
    const inkData = currentStrokes.map((stroke) => [
      stroke.points.map((p) => Math.round(p.x)),
      stroke.points.map((p) => Math.round(p.y)),
      stroke.points.map((p) => p.time),
    ]);

    const res = await recognizeHandwriting(inkData, rect.width, rect.height, language);
    setIsRecognizing(false);
    
    if (res.success && res.candidates.length > 0) {
      setCandidates(res.candidates);
    } else {
      setCandidates([]);
    }
  }, [language]);

  // Start auto-recognition countdown progress bar
  const startRecognitionTimer = useCallback(() => {
    clearTimers();
    const totalTime = 1200; // 1.2s timeout
    const intervalTime = 50;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += intervalTime;
      setDrawProgress(Math.min(100, (elapsed / totalTime) * 100));
    }, intervalTime);

    recognitionTimeoutRef.current = setTimeout(() => {
      clearTimers();
      triggerRecognition(strokes);
    }, totalTime);
  }, [strokes, triggerRecognition]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    clearTimers();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (strokes.length === 0) {
      strokeStartTimeRef.current = Date.now();
    }

    const newPoint: StrokePoint = {
      x,
      y,
      time: Date.now() - strokeStartTimeRef.current,
    };

    setStrokes((prev) => [...prev, { points: [newPoint] }]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint: StrokePoint = {
      x,
      y,
      time: Date.now() - strokeStartTimeRef.current,
    };

    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const lastStroke = prev[prev.length - 1];
      const updatedStroke = {
        points: [...lastStroke.points, newPoint],
      };
      return [...prev.slice(0, -1), updatedStroke];
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDrawingRef.current = false;
    startRecognitionTimer();
  };

  // Confirm and insert word segment
  const handleConfirmCandidate = (text: string) => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.getBoundingClientRect().width : 300;
    const height = canvas ? canvas.getBoundingClientRect().height : 150;

    const newSegment: DrawingSegment = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      strokes: [...strokes],
      width,
      height,
    };

    const nextSegments = [...segments, newSegment];
    setSegments(nextSegments);
    setStrokes([]);
    setCandidates([]);
    clearTimers();

    onChange(nextSegments.map((s) => s.text).join(""));
  };

  // Erase last word
  const handleBackspace = () => {
    if (segments.length === 0) return;
    const nextSegments = segments.slice(0, -1);
    setSegments(nextSegments);
    setStrokes([]);
    setCandidates([]);
    clearTimers();
    onChange(nextSegments.map((s) => s.text).join(""));
  };

  // Clear current canvas
  const handleClearCanvas = () => {
    setStrokes([]);
    setCandidates([]);
    clearTimers();
  };

  // Undo last stroke
  const handleUndoStroke = () => {
    if (strokes.length === 0) return;
    const nextStrokes = strokes.slice(0, -1);
    setStrokes(nextStrokes);
    setCandidates([]);
    clearTimers();
    if (nextStrokes.length > 0) {
      // Re-trigger recognition with updated strokes
      triggerRecognition(nextStrokes);
    }
  };

  // Reset entire input sentence
  const handleResetAll = () => {
    setSegments([]);
    setStrokes([]);
    setCandidates([]);
    clearTimers();
    onChange("");
  };

  // Remove specific segment from stroke timeline
  const handleRemoveSegment = (segId: string) => {
    const nextSegments = segments.filter((s) => s.id !== segId);
    setSegments(nextSegments);
    onChange(nextSegments.map((s) => s.text).join(""));
  };

  // Render a tiny SVG paths preview for previous segments
  const renderSegmentSVG = (segment: DrawingSegment) => {
    if (segment.strokes.length === 0) {
      // Text-only fallback (like keyboard input)
      return (
        <div className="w-12 h-10 flex items-center justify-center bg-surface-muted border border-border/50 rounded-lg text-xs font-bold text-muted select-none">
          Kb
        </div>
      );
    }

    // Compute bounding box for optimal scaling
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    segment.strokes.forEach((stroke) => {
      stroke.points.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });

    const w = maxX - minX;
    const h = maxY - minY;
    const padding = 10;
    const viewW = Math.max(25, w) + padding * 2;
    const viewH = Math.max(25, h) + padding * 2;
    const viewBox = `${minX - padding} ${minY - padding} ${viewW} ${viewH}`;

    // Convert strokes to SVG path
    const pathData = segment.strokes
      .map((stroke) => {
        if (stroke.points.length === 0) return "";
        return stroke.points
          .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
          .join(" ");
      })
      .join(" ");

    return (
      <svg
        viewBox={viewBox}
        className="w-12 h-10 stroke-current text-accent/50 dark:text-accent/60 opacity-80"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d={pathData} />
      </svg>
    );
  };

  // Auto-scroll timeline to the right when segments change
  const timelineRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
    }
  }, [segments]);

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`} id={id}>
      
      {/* ─── Mode Selector and Main Output ───────────────── */}
      <div className="flex items-center gap-2 border border-border bg-surface/50 rounded-2xl p-2 px-3 shadow-2xs">
        
        {/* Toggle Mode */}
        <button
          type="button"
          onClick={() => {
            setIsKeyboardMode(!isKeyboardMode);
            clearTimers();
          }}
          title={isKeyboardMode ? "Ganti ke mode Tulis" : "Ganti ke mode Keyboard"}
          className="p-2 rounded-xl border border-border/40 hover:bg-surface-muted hover:text-accent transition-all cursor-pointer text-muted"
        >
          {isKeyboardMode ? <PenTool className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
        </button>

        {/* Output Text Field */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 px-1">
          {value ? (
            <span className="font-jp text-lg font-black text-foreground tracking-wide leading-none select-all">
              {value}
            </span>
          ) : (
            <span className="text-xs font-semibold text-muted/65 italic select-none">
              {isKeyboardMode ? placeholder : "Gunakan canvas untuk menulis..."}
            </span>
          )}
          
          {/* Faux Cursor */}
          {!isKeyboardMode && (
            <span className="w-1.5 h-5 bg-accent animate-pulse rounded-full shrink-0" />
          )}
        </div>

        {/* Global Toolbar Operations */}
        {value && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleBackspace}
              title="Hapus kata terakhir"
              className="p-1.5 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer text-muted"
            >
              <Delete className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetAll}
              title="Hapus semua"
              className="p-1.5 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer text-muted"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ─── Keyboard Input Mode ─────────────────────────── */}
      {isKeyboardMode ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-jp font-bold transition-all focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSubmit) {
                onSubmit();
              }
            }}
          />
        </div>
      ) : (
        /* ─── Handwriting Input Mode ─────────────────────── */
        <div className="flex flex-col gap-3">
          
          {/* 📍 Stroke History Timeline (Mini visual words) */}
          {segments.length > 0 && (
            <div className="relative group">
              <div 
                ref={timelineRef}
                className="flex items-center gap-3 overflow-x-auto py-2 px-3 bg-surface-muted/40 border border-border/30 rounded-2xl scrollbar-none shadow-3xs"
              >
                <span className="text-[9px] font-black uppercase text-muted tracking-wider select-none shrink-0 border-r border-border/40 pr-2">
                  History
                </span>
                
                <div className="flex items-center gap-2">
                  {segments.map((seg, index) => (
                    <div 
                      key={seg.id}
                      className="flex flex-col items-center gap-1 bg-surface border border-border p-1.5 rounded-xl shrink-0 shadow-3xs group/item relative min-w-14"
                    >
                      {/* Scaled strokes canvas preview */}
                      <div className="h-10 w-12 flex items-center justify-center overflow-hidden">
                        {renderSegmentSVG(seg)}
                      </div>

                      {/* Recognized Text under drawing */}
                      <span className="font-jp text-xs font-black text-foreground">
                        {seg.text}
                      </span>

                      {/* Remove segment action */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSegment(seg.id)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 hover:scale-110 shadow-md cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ✍️ Drawing Board */}
          <div className="relative border border-border bg-surface rounded-3xl shadow-xs overflow-hidden group">
            
            {/* Countdown Auto-Recognize Progress Bar */}
            {drawProgress > 0 && (
              <div className="absolute top-0 left-0 w-full h-1 bg-border/20 z-10">
                <div 
                  className="h-full bg-accent transition-all duration-75"
                  style={{ width: `${drawProgress}%` }}
                />
              </div>
            )}

            <div className="flex h-44 sm:h-52">
              
              {/* Canvas drawing plane */}
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="flex-1 h-full touch-none cursor-crosshair bg-surface"
              />

              {/* Drawing Toolbar controls (Side/Vertical) */}
              <div className="flex flex-col justify-between items-center border-l border-border/40 p-2 bg-surface-muted/30 shrink-0 gap-2">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleUndoStroke}
                    disabled={strokes.length === 0}
                    title="Undo stroke terakhir"
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-surface border border-border/20 text-muted hover:text-accent disabled:opacity-40 disabled:hover:text-muted transition-all cursor-pointer text-[10px] font-extrabold gap-1 min-w-12"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Batal</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    disabled={strokes.length === 0}
                    title="Bersihkan coretan aktif"
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-surface border border-border/20 text-muted hover:text-red-500 disabled:opacity-40 disabled:hover:text-muted transition-all cursor-pointer text-[10px] font-extrabold gap-1 min-w-12"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center w-8 h-8 select-none">
                  {isRecognizing ? (
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  ) : strokes.length > 0 ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-border" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 🏷️ Candidates Panel */}
          <div className="flex flex-col gap-1 px-1">
            <span className="text-[9px] font-extrabold text-muted uppercase tracking-wider select-none leading-none mb-1">
              Kandidat Karakter / Kata
            </span>
            
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none min-h-11">
              {candidates.length > 0 ? (
                <>
                  <div className="flex items-center gap-1.5 pr-2 border-r border-border/30 shrink-0">
                    {candidates.slice(0, 5).map((candidate, idx) => {
                      const isTop = idx === 0;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleConfirmCandidate(candidate)}
                          className={[
                            "px-4 py-1.5 rounded-xl text-sm font-jp font-black transition-all cursor-pointer shadow-3xs",
                            isTop
                              ? "bg-accent text-white hover:scale-105 active:scale-95"
                              : "bg-surface border border-border/40 hover:bg-surface-muted text-foreground hover:scale-105 active:scale-95"
                          ].join(" ")}
                        >
                          {candidate}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Space / Confirm Top result button */}
                  <button
                    type="button"
                    onClick={() => handleConfirmCandidate(candidates[0])}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500 hover:text-white text-emerald-600 transition-all cursor-pointer shrink-0 shadow-3xs hover:scale-105"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Konfirmasi ({candidates[0]})</span>
                  </button>

                  {/* Clear Canvas button */}
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/25 hover:bg-red-500 hover:text-white text-red-500 transition-all cursor-pointer shrink-0 shadow-3xs hover:scale-105"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Coretan</span>
                  </button>
                </>
              ) : strokes.length > 0 ? (
                <div className="flex items-center justify-between w-full pr-1">
                  <span className="text-xs text-muted/80 italic font-semibold select-none flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" />
                    Menganalisis coretan...
                  </span>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/25 hover:bg-red-500 hover:text-white text-red-500 transition-all cursor-pointer shrink-0 shadow-3xs hover:scale-105"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Coretan</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs text-muted/60 italic font-medium select-none">
                  Tulis pada canvas di atas untuk menampilkan hasil deteksi.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
