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
              “See Beyond What Looks Real.”
            </p>
            <p className="text-xs text-charcoal-muted leading-relaxed max-w-lg">
              TruthLens helps examine images, audio, video, and text for possible signs of AI generation or manipulation. We aim to make detection more understandable, transparent, and useful.
            </p>
          </div>

          {/* Col 2: Core Modalities */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-wine">
              Detection Engines
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted font-medium">
              <li className="hover:text-wine transition cursor-pointer">Image Analysis</li>
              <li className="hover:text-wine transition cursor-pointer">Voice & Audio Analysis</li>
              <li className="hover:text-wine transition cursor-pointer">Video Analysis</li>
              <li className="hover:text-wine transition cursor-pointer">Text Analysis</li>
            </ul>
          </div>

          {/* Col 3: Ethical Transparency */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-wine">
              Trust & Transparency
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-muted font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" />
                <span>Privacy-conscious processing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" />
                <span>Clear explanation of results</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" />
                <span>Honest detection limitations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Limitations Banner */}
        <div className="p-4 rounded-2xl bg-ivory-100 border border-stone-200 mb-8 text-xs text-charcoal-muted leading-relaxed">
          <div className="font-semibold text-wine mb-1 flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Important Note:
          </div>
          <p>
            AI detection is probabilistic. A detection result does not prove malicious intent or establish that something is misinformation. Results should be interpreted as estimates to support human judgment—not as definitive legal proof.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-subtle">
          <div>
            &copy; 2026 TruthLens AI. Built with precision and a healthy dose of skepticism.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Local + Neural APIs
            </span>
            <span>•</span>
            <span>Plain-English Transparency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
