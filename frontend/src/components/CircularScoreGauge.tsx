import React, { useState, useEffect, useRef } from 'react';
import { Verdict } from '../types';
import { ShieldCheck, HelpCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface CircularScoreGaugeProps {
  score: number; // 0 to 100 from backend
  verdict: Verdict;
  confidenceLevel?: string;
  explanation?: string;
  label?: string;
}

export const CircularScoreGauge: React.FC<CircularScoreGaugeProps> = ({
  score,
  verdict,
  confidenceLevel = 'moderate',
  explanation,
  label,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isInconclusive = verdict === 'inconclusive';
  const isHuman = verdict === 'likely_human';
  const isManipulated = verdict === 'potentially_manipulated';

  // Radius and Circumference for SVG ring
  const radius = 104;
  const circumference = 2 * Math.PI * radius; // ~653.45

  // Display value: for human verdict, primary score is organic human percentage
  const targetScore = isHuman ? Math.max(0, 100 - score) : score;

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimatedScore(targetScore);
      setHasAnimated(true);
      return;
    }

    let startTime: number | null = null;
    const duration = 1600; // ms

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(targetScore * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedScore(targetScore);
        setHasAnimated(true);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [targetScore]);

  // Calculate tip coordinates for glowing orbital beacon
  const angleRad = ((animatedScore / 100) * 360 - 90) * (Math.PI / 180);
  const beaconX = 150 + radius * Math.cos(angleRad);
  const beaconY = 150 + radius * Math.sin(angleRad);

  // Gradient selection based on verdict
  const gradientId = isHuman
    ? 'humanEmeraldGoldGradient'
    : isInconclusive
    ? 'inconclusiveAmberGradient'
    : 'burgundyChampagneGradient';

  // Dynamic label
  const resolvedLabel =
    label ||
    (isHuman
      ? 'Organic Human Provenance'
      : isManipulated
      ? 'Measured Tampering Signal'
      : isInconclusive
      ? 'Equivocal Forensic Signal'
      : 'Measured AI Likelihood');

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-6 sm:p-8"
      role="region"
      aria-label={`Forensic Score Visualization: ${
        isInconclusive ? 'Inconclusive Determination' : `${animatedScore.toFixed(1)}% ${resolvedLabel}`
      }`}
    >
      {/* Outer 3D Glow Ambience */}
      <div 
        className={`absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          isHuman
            ? 'bg-emerald-600/10'
            : isInconclusive
            ? 'bg-amber-600/10'
            : 'bg-[#541D2B]/15'
        }`}
      />

      {/* SVG Circular Visualization */}
      <div className="relative w-64 h-64 sm:w-76 sm:h-76 md:w-80 md:h-80 flex items-center justify-center">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full transform transition-transform duration-300"
        >
          <defs>
            {/* Burgundy to Champagne Gradient */}
            <linearGradient id="burgundyChampagneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#541D2B" />
              <stop offset="50%" stopColor="#702B3D" />
              <stop offset="100%" stopColor="#C9A227" />
            </linearGradient>

            {/* Human Emerald to Champagne Gradient */}
            <linearGradient id="humanEmeraldGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14532D" />
              <stop offset="60%" stopColor="#166534" />
              <stop offset="100%" stopColor="#C9A227" />
            </linearGradient>

            {/* Inconclusive Amber Gradient */}
            <linearGradient id="inconclusiveAmberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#854D0E" />
              <stop offset="50%" stopColor="#C9A227" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Soft Shadow Filter for 3D Inset Disc */}
            <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#541D2B" floodOpacity="0.12" />
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.06" />
            </filter>

            {/* Glow for Arc Stroke */}
            <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Calibration Ticks */}
          <g className="opacity-40">
            {Array.from({ length: 48 }).map((_, i) => {
              const deg = i * (360 / 48);
              const isMajor = i % 6 === 0;
              const rad = deg * (Math.PI / 180);
              const r1 = 138;
              const r2 = isMajor ? 144 : 141;
              const x1 = 150 + r1 * Math.cos(rad);
              const y1 = 150 + r1 * Math.sin(rad);
              const x2 = 150 + r2 * Math.cos(rad);
              const y2 = 150 + r2 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#C9A227' : '#D8B4AD'}
                  strokeWidth={isMajor ? 1.5 : 0.8}
                />
              );
            })}
          </g>

          {/* 2. Outer Rotating Orbital Dashed Ring */}
          <circle
            cx="150"
            cy="150"
            r="128"
            fill="none"
            stroke="#C9A227"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            className="animate-reverse-slow origin-center opacity-30"
          />

          {/* Cardinal Degree Indicators */}
          <text x="150" y="18" textAnchor="middle" fill="#78636A" fontSize="8" fontFamily="monospace" fontWeight="600" opacity="0.6">000°</text>
          <text x="286" y="153" textAnchor="middle" fill="#78636A" fontSize="8" fontFamily="monospace" fontWeight="600" opacity="0.6">090°</text>
          <text x="150" y="290" textAnchor="middle" fill="#78636A" fontSize="8" fontFamily="monospace" fontWeight="600" opacity="0.6">180°</text>
          <text x="14" y="153" textAnchor="middle" fill="#78636A" fontSize="8" fontFamily="monospace" fontWeight="600" opacity="0.6">270°</text>

          {/* 3. Deep Inset Metallic Track (Base Groove) */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="#E8DCD5"
            strokeWidth="14"
            className="opacity-70"
          />

          {/* Inner Accent Line in Base Groove */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="#FAF0EA"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* 4. Active Glowing Progress Arc */}
          {!isInconclusive && (
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * animatedScore) / 100}
              transform="rotate(-90 150 150)"
              filter="url(#arcGlow)"
              className="transition-[stroke-dashoffset] duration-75 ease-out"
            />
          )}

          {/* Inconclusive Pulsing Arc (Subtle dual segments) */}
          {isInconclusive && (
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="12"
              strokeDasharray="20 15"
              className="animate-spin-slow origin-center opacity-60"
            />
          )}

          {/* 5. Glowing Tip Beacon */}
          {!isInconclusive && animatedScore > 1.5 && (
            <g>
              <circle
                cx={beaconX}
                cy={beaconY}
                r="7"
                fill="#C9A227"
                opacity="0.3"
                className="animate-ping"
              />
              <circle
                cx={beaconX}
                cy={beaconY}
                r="4.5"
                fill="#FFFFFF"
                stroke="#C9A227"
                strokeWidth="1.5"
                filter="url(#gaugeShadow)"
              />
            </g>
          )}

          {/* 6. Center 3D Layered Disc */}
          <circle
            cx="150"
            cy="150"
            r="82"
            fill="#FFFCF9"
            stroke="#E8DCD5"
            strokeWidth="1.5"
            filter="url(#gaugeShadow)"
          />

          <circle
            cx="150"
            cy="150"
            r="78"
            fill="#FFFFFF"
            stroke="#FAF0EA"
            strokeWidth="1"
            className="opacity-90"
          />
        </svg>

        {/* 7. Centerpiece Content Overlay (HTML in Center) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none pointer-events-none">
          {isInconclusive ? (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#541D2B] tracking-tight block">
                INCONCLUSIVE
              </span>
              <span className="text-[10px] sm:text-[11px] font-sans font-medium text-[#78636A] max-w-[120px] block leading-tight">
                No Forced Classification
              </span>
            </div>
          ) : (
            <div className="space-y-1 animate-fadeIn">
              {/* Animated Percentage Number */}
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#541D2B]">
                  {animatedScore.toFixed(1)}
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#C9A227]">
                  %
                </span>
              </div>

              {/* Status Meaning Tag */}
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#78636A] block max-w-[140px] leading-tight mx-auto">
                {resolvedLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Supporting Confidence & Calibration Metadata */}
      <div className="mt-4 text-center max-w-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DCD5]">
          <span
            className={`w-2 h-2 rounded-full ${
              confidenceLevel.toLowerCase() === 'high'
                ? 'bg-[#541D2B]'
                : confidenceLevel.toLowerCase() === 'moderate'
                ? 'bg-[#C9A227]'
                : 'bg-stone-400'
            }`}
          />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#343039]">
            Confidence: {confidenceLevel.toUpperCase()}
          </span>
          <span className="text-[10px] text-[#78636A]">• Signal Calibrated</span>
        </div>

        {explanation && (
          <p className="text-xs text-[#343039] leading-relaxed font-normal pt-1 px-2">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
};

