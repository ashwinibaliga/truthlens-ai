import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Clock, 
  Fingerprint, 
  ShieldAlert 
} from 'lucide-react';

interface LiveForensicScannerProps {
  mediaType: string;
  filename?: string;
}

const STAGES = [
  { id: '01', title: 'Receiving your file', detail: 'Validating payload integrity & byte headers' },
  { id: '02', title: 'Examining digital patterns', detail: 'Running discrete spatial & frequency transforms' },
  { id: '03', title: 'Analysing forensic indicators', detail: 'Checking compression, spectrum & cadence anomalies' },
  { id: '04', title: 'Comparing available AI signals', detail: 'Cross-referencing multimodal neural models' },
  { id: '05', title: 'Preparing your report', detail: 'Synthesizing evidence and sealing forensic dossier' },
];

const MICROCOPY_QUOTES = [
  "Pixels have stories too.",
  "Taking a closer look...",
  "Checking the details that aren't obvious.",
  "No guessing. Just evidence.",
  "Interesting patterns. Let's look closer.",
  "Almost done. The details matter.",
];

export const LiveForensicScanner: React.FC<LiveForensicScannerProps> = ({
  mediaType,
  filename,
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Progressive stage advancement
  useEffect(() => {
    const t1 = setTimeout(() => setActiveStage(1), 1400);
    const t2 = setTimeout(() => setActiveStage(2), 3200);
    const t3 = setTimeout(() => setActiveStage(3), 5400);
    const t4 = setTimeout(() => setActiveStage(4), 7800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Microcopy rotation
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MICROCOPY_QUOTES.length);
    }, 2400);
    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
      {/* Background Decorative Ambience */}
      <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#541D2B]/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="text-center max-w-md mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EA] border border-[#E8DCD5]">
          <span className="w-2 h-2 rounded-full bg-[#702B3D] animate-ping" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#702B3D]">
            Live Forensic Inspection
          </span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#541D2B]">
          Investigating {mediaType.toUpperCase()} Evidence
        </h3>
        {filename && (
          <p className="text-xs font-mono text-[#78636A] truncate max-w-sm mx-auto">
            Payload: {filename}
          </p>
        )}
      </div>

      {/* Radar Scanner Visual Centerpiece */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
        {/* Outer Halo */}
        <div className="absolute inset-0 rounded-full border border-[#E8DCD5] opacity-60 animate-pulse-halo" />
        <div className="absolute inset-4 rounded-full border border-[#D8B4AD] opacity-40" />
        <div className="absolute inset-12 rounded-full border border-[#E8DCD5] opacity-50" />
        <div className="absolute inset-20 rounded-full border border-[#C9A227] opacity-30" />

        {/* Crosshair Lines */}
        <div className="absolute w-full h-px bg-[#E8DCD5] opacity-40" />
        <div className="absolute h-full w-px bg-[#E8DCD5] opacity-40" />

        {/* Rotating Radar Conic Beam */}
        <div
          className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(84, 29, 43, 0.28) 0deg, rgba(201, 162, 39, 0.12) 40deg, transparent 90deg, transparent 360deg)',
          }}
        />

        {/* Center Forensic Lens Core */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#541D2B] to-[#702B3D] text-[#FAF5F1] flex items-center justify-center shadow-lg border border-[#C9A227]/40">
          <Fingerprint className="w-8 h-8 text-[#FAF5F1] animate-pulse" />
        </div>

        {/* Subtle Orbiting Data Nodes */}
        <div className="absolute top-3 right-8 w-2 h-2 rounded-full bg-[#C9A227] animate-float-particle shadow-sm" />
        <div className="absolute bottom-6 left-10 w-2.5 h-2.5 rounded-full bg-[#702B3D] animate-float-particle shadow-sm" />
        <div className="absolute top-12 left-6 w-1.5 h-1.5 rounded-full bg-[#14532D] animate-ping" />
      </div>

      {/* Subtle Rotating Microcopy */}
      <div className="text-center h-8 flex items-center justify-center">
        <p className="font-serif italic text-base sm:text-lg text-[#541D2B] transition-all duration-500 key={quoteIndex}">
          "{MICROCOPY_QUOTES[quoteIndex]}"
        </p>
      </div>

      {/* Live Progress Stage Stepper */}
      <div className="space-y-3 max-w-lg mx-auto pt-2">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStage;
          const isCurrent = idx === activeStage;
          const isUpcoming = idx > activeStage;

          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-500 ${
                isCurrent
                  ? 'bg-white border-[#541D2B]/30 shadow-md scale-[1.01]'
                  : isDone
                  ? 'bg-[#FAF0EA]/60 border-[#E8DCD5] opacity-90'
                  : 'bg-transparent border-transparent opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-[#14532D] text-white'
                      : isCurrent
                      ? 'bg-[#541D2B] text-white shadow-sm'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : stage.id}
                </div>
                <div>
                  <h4
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isCurrent
                        ? 'text-[#541D2B] font-bold'
                        : isDone
                        ? 'text-[#343039]'
                        : 'text-[#78636A]'
                    }`}
                  >
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-[#78636A] font-normal leading-tight mt-0.5">
                    {stage.detail}
                  </p>
                </div>
              </div>

              {isCurrent && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#C9A227] font-semibold pr-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-ping" />
                  <span>ACTIVE</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

