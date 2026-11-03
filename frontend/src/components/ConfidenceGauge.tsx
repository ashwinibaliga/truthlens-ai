import React from 'react';
import { ConfidenceMetrics, Verdict } from '../types';
import { Info, Sparkles } from 'lucide-react';
import { CircularScoreGauge } from './CircularScoreGauge';

interface ConfidenceGaugeProps {
  metrics: ConfidenceMetrics;
  verdict?: Verdict;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ 
  metrics,
  verdict = 'likely_ai' as Verdict
}) => {
  const {
    ai_probability = 0,
    human_probability = 100,
    confidence_level = 'moderate',
    explanation = 'Empirical analysis completed.',
    entropy,
  } = metrics || {};

  return (
    <div className="card-3d-depth p-6 sm:p-8 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8DCD5]">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78636A]">
            Empirical Evaluation
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#541D2B]">
            Confidence & Probability Profile
          </h3>
          <p className="text-xs text-[#78636A] mt-0.5">
            Calibrated signal metrics across multi-axis forensic checks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#78636A] font-medium">
            Calibration Confidence:
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border ${
              confidence_level === 'high'
                ? 'bg-wine/10 text-wine border-wine/30'
                : confidence_level === 'moderate'
                ? 'bg-[#FAF0EA] text-[#702B3D] border-[#E8DCD5]'
                : 'bg-stone-100 text-stone-600 border-stone-300'
            }`}
          >
            {confidence_level.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Animated Circular Visualization */}
        <div className="lg:col-span-5 flex justify-center">
          <CircularScoreGauge
            score={ai_probability}
            verdict={verdict}
            confidenceLevel={confidence_level}
          />
        </div>

        {/* Dual Linear Bars & Entropy Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-1.5 text-xs">
                <span className="font-semibold text-[#541D2B] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#541D2B] inline-block" />
                  Measured AI Generation Signal
                </span>
                <span className="font-serif text-2xl font-bold text-[#541D2B]">
                  {ai_probability.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-[#FAF0EA] rounded-full h-3 overflow-hidden border border-[#E8DCD5]/60">
                <div
                  className="bg-gradient-to-r from-[#541D2B] to-[#702B3D] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, ai_probability))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5 text-xs">
                <span className="font-semibold text-[#14532D] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#166534] inline-block" />
                  Organic Human Provenance
                </span>
                <span className="font-serif text-xl font-bold text-[#14532D]">
                  {human_probability.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-[#FAF0EA] rounded-full h-2.5 overflow-hidden border border-[#E8DCD5]/60">
                <div
                  className="bg-[#166534] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, human_probability))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="pt-4 border-t border-[#E8DCD5]/80 flex items-start gap-2.5 text-xs text-[#343039]">
            <Info className="w-4 h-4 text-[#702B3D] shrink-0 mt-0.5" />
            <div>
              <p className="leading-relaxed font-normal">{explanation}</p>
              {entropy !== undefined && (
                <p className="mt-1.5 text-[11px] text-[#78636A]">
                  Measured Shannon informational entropy:{' '}
                  <span className="font-mono text-[#541D2B] font-bold">{entropy} bits</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
