import React, { useState } from 'react';
import { EvidenceItem } from '../types';
import { AlertCircle, CheckCircle2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface IndicatorsListProps {
  indicators: EvidenceItem[];
}

export const IndicatorsList: React.FC<IndicatorsListProps> = ({ indicators }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!indicators || indicators.length === 0) {
    return (
      <div className="editorial-card p-6 rounded-2xl text-center text-charcoal-muted text-sm">
        No individual forensic indicators returned for this media sample.
      </div>
    );
  }

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {indicators.map((ind, index) => {
        const isFlag = ind.indicator_type === 'flag';
        const isPass = ind.indicator_type === 'pass';
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className={`editorial-card rounded-xl p-4 transition-all border ${
              isFlag
                ? 'border-wine/20 bg-wine/[0.015]'
                : isPass
                ? 'border-emerald-600/20 bg-emerald-500/[0.01]'
                : 'border-stone-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isFlag ? (
                    <AlertCircle className="w-5 h-5 text-wine shrink-0" />
                  ) : isPass ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-stone-500 shrink-0" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-base text-charcoal">{ind.title}</h4>
                    {ind.metric_value && (
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-stone-100 text-charcoal border border-stone-200/80">
                        {ind.metric_value}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>

              {ind.detail && (
                <button
                  onClick={() => toggleExpand(index)}
                  className="p-1 rounded hover:bg-stone-100 text-charcoal-subtle transition-colors shrink-0"
                  aria-label="Toggle technical details"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            {isExpanded && ind.detail && (
              <div className="mt-3 pt-3 border-t border-stone-200/80 text-[11px] font-mono text-charcoal-muted bg-stone-50 p-2.5 rounded-lg">
                <span className="font-semibold text-wine">Forensic Note: </span>
                {ind.detail}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

