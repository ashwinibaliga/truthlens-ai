import React from 'react';
import { Eye, Shield, Lock, Cpu, Layers, Sliders, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

interface AboutViewProps {
  onNavigateDetect: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateDetect }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-2">
          Methodological Manifesto
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-charcoal leading-tight">
          The Architecture of Authenticity
        </h1>
        <p className="text-base text-charcoal-muted mt-4 font-normal leading-relaxed">
          In an era where synthetic media imperils institutional trust, TruthLens AI provides scientific media forensics grounded in empirical mathematics, signal theory, and transparent neural inference.
        </p>
      </div>

      {/* Tenet 1: The Zero-Fabrication Charter */}
      <section className="editorial-card p-8 sm:p-12 rounded-3xl bg-white border border-rose-dusty/40 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-wine text-white flex items-center justify-center font-serif text-lg font-bold">
            I
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
            The Zero-Fabricated-Score Doctrine
          </h2>
        </div>
        <p className="text-sm text-charcoal-muted leading-relaxed font-normal">
          Most commercial AI detectors operate as opaque black boxes, delivering synthetic confidence scores (often hardcoded or exaggerated to 99%) without presenting verifiable forensic evidence. When an uncompressed optical photo is uploaded, these simplistic classifiers often misdiagnose natural depth-of-field blur as generative smoothing.
        </p>
        <p className="text-sm text-charcoal-muted leading-relaxed font-normal">
          TruthLens AI is built on radical empirical honesty: We compute and display the actual 2D Fourier high-frequency energy ratio, the exact JPEG recompression standard deviation (ELA), the measured voice zero-crossing rate jitter, and syntactic sentence burstiness. If a third-party neural model is unconfigured or unreachable, the system states its status openly rather than generating an illusion of certainty.
        </p>
      </section>

      {/* Tenet 2: The Four Forensic Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-1">
            Core Modalities
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal">
            Four Analytical Paradigms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Pillar 1 */}
          <div className="editorial-card p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-wine">
              <Cpu className="w-5 h-5" />
              <span>Image Spatial & Frequency Analysis</span>
            </div>
            <p className="text-charcoal-muted leading-relaxed">
              Generative diffusion models (Stable Diffusion, Midjourney, DALL-E) assemble images through iterative denoising. In doing so, their latent upscalers leave periodic high-frequency energy artifacts that manifest as distinct spikes in a 2D Fourier (FFT) spectrum. Combined with Error Level Analysis (ELA) which isolates JPEG compression differences, TruthLens measures spatial tampering at the pixel level.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="editorial-card p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-wine">
              <Layers className="w-5 h-5" />
              <span>Acoustic Phase & Vocoder Forensics</span>
            </div>
            <p className="text-charcoal-muted leading-relaxed">
              Biological human vocal folds exhibit natural physical perturbations known as micro-jitter and shimmer. When synthetic speech engines (Tacotron, VITS, HiFi-GAN) synthesize audio, they typically generate overly uniform phase curves and exhibit a sharp rolloff cutoff above 8,000–11,000 Hz. TruthLens tracks Zero-Crossing Rate variance to separate living vocal tracts from synthetic vocoders.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="editorial-card p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-wine">
              <Sliders className="w-5 h-5" />
              <span>Video Discrete Keyframe Extraction</span>
            </div>
            <p className="text-charcoal-muted leading-relaxed">
              Using OpenCV, TruthLens isolates discrete sample frames at fixed temporal intervals. Each keyframe is passed through the spatial vision pipeline, and inter-frame temporal variance is computed to detect face-swap boundary flickering. We strictly enforce that frame sampling is labeled as a sampled visual evaluation and does not assert continuous whole-video immunity.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="editorial-card p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-wine">
              <FileCode className="w-5 h-5" />
              <span>Linguistic Cadence & Syntactic Entropy</span>
            </div>
            <p className="text-charcoal-muted leading-relaxed">
              Human authors write with rhythmic asymmetry: short, punchy sentences interspersed with expansive clauses (high burstiness). Autoregressive transformers, by contrast, optimize for maximum token likelihood, producing uniform sentence lengths (low burstiness) and characteristic rhetorical markers ("delve", "tapestry", "in conclusion").
            </p>
          </div>
        </div>
      </section>

      {/* Tenet 3: Ethical Boundaries and Non-Claims */}
      <section className="editorial-card p-8 sm:p-12 rounded-3xl bg-[#4A1028] text-white shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-rose-dusty" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
            Ethical Boundaries & Non-Claims
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-ivory-200/90 leading-relaxed font-normal">
          In strict compliance with forensic science principles:
        </p>

        <ul className="space-y-3 text-xs text-ivory-200/80 font-normal">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-rose-dusty shrink-0 mt-0.5" />
            <span><strong>Never claims to identify human identity:</strong> Text detection is purely statistical and cannot establish who wrote a given text or assign individual authorship.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-rose-dusty shrink-0 mt-0.5" />
            <span><strong>Never equates synthetic media with disinformation:</strong> Synthetic content is frequently created for legitimate artistic, illustrative, or accessibility purposes. Detection indicates generative origin, not intent.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-rose-dusty shrink-0 mt-0.5" />
            <span><strong>Zero Media Persistence Guarantee:</strong> Uploaded payloads are examined in isolated memory buffers and purged immediately following telemetry extraction.</span>
          </li>
        </ul>

        <div className="pt-4 border-t border-rose-dusty/20 flex justify-end">
          <button
            onClick={onNavigateDetect}
            className="px-6 py-2.5 rounded-full bg-white text-wine text-xs font-semibold uppercase tracking-wider hover:bg-ivory-100 transition shadow-md"
          >
            Launch Detection Console
          </button>
        </div>
      </section>
    </div>
  );
};

