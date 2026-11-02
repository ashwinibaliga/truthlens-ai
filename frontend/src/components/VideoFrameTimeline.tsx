import React, { useState } from 'react';
import { FrameAnalysisItem } from '../types';
import { Film, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VideoFrameTimelineProps {
  frames: FrameAnalysisItem[];
  temporalDetails?: Record<string, any>;
}

export const VideoFrameTimeline: React.FC<VideoFrameTimelineProps> = ({ frames, temporalDetails }) => {
  const [selectedFrame, setSelectedFrame] = useState<FrameAnalysisItem | null>(frames[0] || null);

  if (!frames || frames.length === 0) {
    return null;
  }

  const jitter = temporalDetails?.temporal_jitter_index ?? 0;

  return (
    <div className="editorial-card p-6 rounded-2xl bg-white border border-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
            <Film className="w-5 h-5 text-wine" />
            Sampled Keyframe Timeline (1 fps Extraction)
          </h3>
          <p className="text-xs text-charcoal-muted">
            Independent frame-level deepfake evaluation across sequential video intervals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-subtle">Inter-frame Jitter:</span>
          <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
            jitter > 15 
              ? 'bg-wine/10 text-wine border-wine/30' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}>
            σ = {jitter}
          </span>
        </div>
      </div>

      {/* Frame Timeline Bar Scrubber */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 mb-5">
        {frames.map((f, i) => {
          const isSelected = selectedFrame?.frame_index === f.frame_index;
          const isFlagged = f.ai_probability >= 70;

          return (
            <button
              key={i}
              onClick={() => setSelectedFrame(f)}
              className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between h-20 ${
                isSelected
                  ? 'border-wine bg-wine/5 shadow-md ring-2 ring-wine/20'
                  : 'border-stone-200 hover:border-wine/40 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-medium text-charcoal-subtle">
                  {f.timestamp}
                </span>
                {isFlagged ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-wine" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>

              {/* Mini probability vertical gauge */}
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden my-1">
                <div
                  className={`h-full rounded-full ${
                    isFlagged ? 'bg-wine' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${f.ai_probability}%` }}
                />
              </div>

              <div className="text-[11px] font-serif font-bold text-charcoal">
                {f.ai_probability.toFixed(0)}% AI
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Frame Detail Callout */}
      {selectedFrame && (
        <div className="p-4 rounded-xl bg-ivory-100 border border-rose-dusty/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-wine">Selected Sample: </span>
            <span className="font-mono text-charcoal font-bold">Keyframe #{selectedFrame.frame_index}</span> (Timestamp: {selectedFrame.timestamp})
            <p className="text-charcoal-muted mt-0.5">
              Individual frame spatial spectrum analysis yielded <span className="font-semibold text-charcoal">{selectedFrame.ai_probability}% AI probability</span> ({selectedFrame.verdict.replace('_', ' ').toUpperCase()}).
            </p>
          </div>
          <span className="shrink-0 text-[11px] px-2.5 py-1 rounded-full font-mono bg-white border border-stone-200">
            Status: {selectedFrame.ai_probability > 70 ? 'Synthetic Artifacts Present' : 'Natural Spatial Noise'}
          </span>
        </div>
      )}

      {/* Strict Rule 8 Methodology Disclaimer */}
      <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] text-charcoal-subtle leading-relaxed italic">
        * Note on Methodology: Frame extraction evaluates spatial compression and frequency anomalies on discrete sampled keyframes. Frame sampling does not assert or prove temporal authenticity for unexamined intermediate frames.
      </div>
    </div>
  );
};

