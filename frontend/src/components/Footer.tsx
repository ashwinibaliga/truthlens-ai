import React from 'react';
import { Shield, Eye, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-rose-dusty/30 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-wine flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-wine">
                TruthLens AI
              </span>
            </div>
            <p className="font-serif italic text-charcoal-muted text-lg max-w-md">
              "See Beyond What Looks Real."
            </p>
            <p className="text-xs text-charcoal-muted leading-relaxed max-w-lg">
              TruthLens AI is a full-stack forensic media verification suite engineered to analyze images, audio, video, and written text with uncompromising mathematical rigor. Combining frequency-domain Fourier analysis, Error Level Analysis (ELA), vocal tract phase continuity, and syntactic entropy modeling.
            </p>
          </div>

          {/* Col 2: Core Modalities */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-wine">
              Detection Engines
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted font-medium">
              <li className="hover:text-wine transition cursor-pointer">Image & Spatial Spectrum (ELA / 2D FFT)</li>
              <li className="hover:text-wine transition cursor-pointer">Voice & Deepfake Acoustics (ZCR / Vocoder Rolloff)</li>
              <li className="hover:text-wine transition cursor-pointer">Video Keyframe & Temporal Jitter Analysis</li>
              <li className="hover:text-wine transition cursor-pointer">Text & Linguistic Authorship Forensics</li>
            </ul>
          </div>

          {/* Col 3: Ethical Transparency */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-wine">
              Trust & Transparency
            </h4>
            <div className="p-3.5 rounded-xl bg-ivory-200/60 border border-rose-dusty/40 text-[11px] text-charcoal-muted leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-wine">
                <Lock className="w-3.5 h-3.5" />
                Zero Media Persistence
              </div>
              <p>
                Uploaded media is processed in memory or isolated temporary scratch buffers and purged immediately following analytical extraction.
              </p>
            </div>
          </div>
        </div>

        {/* Ethical Limitations Banner (Critical Development Rule compliance) */}
        <div className="p-4 rounded-2xl bg-ivory-100 border border-stone-200 mb-8 text-xs text-charcoal-muted leading-relaxed">
          <div className="font-semibold text-wine mb-1 flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            AI Detection Limitations & Ethical Standard:
          </div>
          <p>
            All AI detection systems operate probabilistically. Detecting synthetic media does not equate to malicious intent, nor does it establish proof of disinformation. AI text analysis evaluates linguistic predictability and burstiness and cannot identify specific authors. Results should be interpreted as scientific estimates to assist human verification, not definitive legal fact.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-subtle">
          <div>
            &copy; {new Date().getFullYear()} TruthLens AI. Built with precision and transparency.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Local + Neural APIs
            </span>
            <span>•</span>
            <span>ISO/IEC Aligned Metrics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

