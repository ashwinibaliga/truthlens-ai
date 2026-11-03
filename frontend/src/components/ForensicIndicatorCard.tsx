import React, { useState, useRef } from 'react';
import { EvidenceItem } from '../types';
import { 
  Camera, 
  Layers, 
  Activity, 
  Volume2, 
  Film, 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ForensicIndicatorCardProps {
  indicator: EvidenceItem;
  index: number;
}

export const ForensicIndicatorCard: React.FC<ForensicIndicatorCardProps> = ({
  indicator,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const titleLower = indicator.title.toLowerCase();
  
  // Icon selector based on analytical method
  const getIndicatorIcon = () => {
    if (titleLower.includes('camera') || titleLower.includes('exif') || titleLower.includes('hardware')) {
      return <Camera className="w-5 h-5" />;
    }
    if (titleLower.includes('compression') || titleLower.includes('ela')) {
      return <Layers className="w-5 h-5" />;
    }
    if (titleLower.includes('fourier') || titleLower.includes('fft') || titleLower.includes('spectral') || titleLower.includes('frequency')) {
      return <Activity className="w-5 h-5" />;
    }
    if (titleLower.includes('audio') || titleLower.includes('zcr') || titleLower.includes('vocoder') || titleLower.includes('voice')) {
      return <Volume2 className="w-5 h-5" />;
    }
    if (titleLower.includes('video') || titleLower.includes('frame') || titleLower.includes('temporal')) {
      return <Film className="w-5 h-5" />;
    }
    if (titleLower.includes('burstiness') || titleLower.includes('entropy') || titleLower.includes('linguistic') || titleLower.includes('text') || titleLower.includes('marker')) {
      return <FileText className="w-5 h-5" />;
    }
    return <Search className="w-5 h-5" />;
  };

  // Status mapping
  const isFlag = indicator.indicator_type === 'flag';
  const isPass = indicator.indicator_type === 'pass';
  
  const statusLabel = isFlag ? 'Unusual Signal' : isPass ? 'Natural Concordance' : 'Observed Evidence';
  const statusBadgeClasses = isFlag
    ? 'bg-wine/10 text-wine border-wine/30'
    : isPass
    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
    : 'bg-[#FAF0EA] text-[#78636A] border-[#E8DCD5]';

  // Subtle 3D perspective mouse tilt (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Maximum tilt angle of ~4 degrees for subtle luxury feel
    const tiltX = ((y - centerY) / centerY) * -4;
    const tiltY = ((x - centerX) / centerX) * 4;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      className="card-3d-depth rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 group relative overflow-hidden"
    >
      {/* Top Subtle Light Reflection Accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header with Icon, Name & Status */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0EA] border border-[#E8DCD5] flex items-center justify-center text-[#B88A55] group-hover:scale-105 transition-transform shrink-0">
              {getIndicatorIcon()}
            </div>
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-[#541D2B] leading-tight">
                {indicator.title}
              </h4>
              <span className="text-[11px] font-sans font-medium text-[#78636A]">
                Methodological Indicator 0{index + 1}
              </span>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${statusBadgeClasses} shrink-0`}
          >
            {isFlag ? (
              <AlertCircle className="w-3.5 h-3.5 text-wine" />
            ) : isPass ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <HelpCircle className="w-3.5 h-3.5 text-[#78636A]" />
            )}
            <span>{statusLabel}</span>
          </span>
        </div>

        {/* Human Explanation Paragraph */}
        <p className="text-xs sm:text-sm text-[#343039] leading-relaxed font-normal">
          {indicator.description}
        </p>
      </div>

      {/* Measured Value & Expandable Details */}
      <div className="pt-3 border-t border-[#E8DCD5]/80 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans font-medium text-[#78636A]">
              Measured Reading:
            </span>
            <span className="font-mono text-xs font-bold text-[#541D2B] px-2 py-0.5 rounded bg-white border border-[#E8DCD5]">
              {indicator.metric_value || 'Observed Signal'}
            </span>
          </div>

          {indicator.detail && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#702B3D] hover:text-[#541D2B] transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Less' : 'Details'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Expandable Technical Drawer */}
        {isExpanded && indicator.detail && (
          <div className="mt-2 p-3 rounded-xl bg-white border border-[#E8DCD5] text-[11px] font-mono text-[#343039] leading-relaxed animate-fadeIn">
            <span className="font-bold text-[#702B3D]">Forensic Telemetry: </span>
            {indicator.detail}
          </div>
        )}
      </div>
    </div>
  );
};

