import React from 'react';
import { ConfidenceMetrics } from '../types';
import { Info } from 'lucide-react';

interface ConfidenceGaugeProps {
  metrics: ConfidenceMetrics;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ metrics }) => {
  const { ai_probability, human_probability, confidence_level, explanation, entropy } = metrics;

  return (
    <div className="editorial-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-charcoal">Confidence & Probability Profile</h3>
          <p className="text-xs text-charcoal-muted mt-0.5">Empirical statistical evaluation across verification axes</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-charcoal-subtle font-medium">Confidence:</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              confidence_level === 'high'
                ? 'bg-wine/10 text-wine border-wine/30'
                : confidence_level === 'moderate'
                ? 'bg-rose-dusty/20 text-burgundy border-rose-dusty'
                : 'bg-stone-100 text-stone-600 border-stone-300'
            }`}
          >
            {confidence_level.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Probability Dual Meter */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-sm font-medium text-charcoal flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-wine inline-block" />
              AI Generation Probability
            </span>
            <span className="font-serif text-2xl font-bold text-wine">
              {ai_probability.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-stone-200/80 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-wine to-burgundy h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, ai_probability))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-sm font-medium text-charcoal flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
              Organic Human Authenticity
            </span>
            <span className="font-serif text-xl font-semibold text-emerald-800">
              {human_probability.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-stone-200/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-700 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, human_probability))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-start gap-2.5 text-xs text-charcoal-muted">
        <Info className="w-4 h-4 text-wine shrink-0 mt-0.5" />
        <div>
          <p className="leading-relaxed font-normal">{explanation}</p>
          {entropy !== undefined && (
            <p className="mt-1 text-[11px] text-charcoal-subtle">
              Measured Shannon informational entropy: <span className="font-mono text-charcoal font-semibold">{entropy} bits</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

