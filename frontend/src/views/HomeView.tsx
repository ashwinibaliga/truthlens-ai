import React from 'react';
import { Eye, Shield, Image as ImageIcon, Mic, Video, FileText, ArrowRight, CheckCircle2, Cpu, Lock, Sparkles, Layers, Sliders } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string, subTab?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const featureCards = [
    {
      id: 'image',
      title: 'Image Forensics',
      subtitle: 'Spatial & Spectral Authenticity',
      icon: ImageIcon,
      description: 'Discovers 2D Fourier (FFT) high-frequency grid dispersion, JPEG Error Level Analysis (ELA) discrepancies, and camera hardware EXIF provenance.',
      badges: ['2D FFT Spectrum', 'ELA Variance', 'EXIF Validation'],
      action: 'Scan Image',
    },
    {
      id: 'audio',
      title: 'Voice & Audio Forensics',
      subtitle: 'Acoustic Phase & Vocoder Analysis',
      icon: Mic,
      description: 'Evaluates neural vocoder rolloff above 8kHz, Zero Crossing Rate (ZCR) vocal tract micro-jitter, and artificial speech synthesis phase artifacts.',
      badges: ['Spectral Rolloff', 'ZCR Jitter', 'Resemble AI API'],
      action: 'Verify Voice',
    },
    {
      id: 'video',
      title: 'Video Keyframe Forensics',
      subtitle: 'Discrete Frame Sampling & Jitter',
      icon: Video,
      description: 'Extracts sequential sample keyframes via OpenCV, evaluates frame-by-frame spatial authenticity, and tracks inter-frame temporal stability.',
      badges: ['OpenCV Keyframes', 'Temporal Jitter', 'Sampled Scrutiny'],
      action: 'Inspect Video',
    },
    {
      id: 'text',
      title: 'Linguistic Authorship',
      subtitle: 'Syntactic Burstiness & Entropy',
      icon: FileText,
      description: 'Audits sentence cadence variance (burstiness), Shannon informational entropy, Type-Token vocabulary richness, and LLM formulaic discourse markers.',
      badges: ['Burstiness σ', 'Shannon Entropy', 'RoBERTa Detector'],
      action: 'Analyze Text',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Multimodal Ingestion',
      description: 'Upload high-resolution images, lossless or compressed audio, MP4/MOV videos, or raw written prose. Media is validated in isolated memory buffers.',
    },
    {
      num: '02',
      title: 'Dual-Layer Analysis',
      description: 'Files pass concurrently through mathematical forensic signal analyzers (2D FFT, ELA, Acoustic Jitter) and verified neural deepfake classifiers.',
    },
    {
      num: '03',
      title: 'Forensic Dossier & Sealed PDF',
      description: 'Receive an uncompromised breakdown with empirical probability curves, technical indicator flags, and an exportable ISO-styled forensic report.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-wine/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-dusty/50 shadow-sm mb-8 text-xs font-semibold text-wine tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Luxury Forensic Media Verification
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-charcoal leading-[1.05] mb-8">
          See Beyond What <br />
          <span className="italic font-normal text-wine">Looks Real.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-charcoal-muted leading-relaxed font-normal mb-10">
          The luxury standard in multi-modal synthetic media detection. TruthLens AI scrutinizes images, audio, video, and text using empirical frequency mathematics and genuine neural inference.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('detect')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-wine text-white font-semibold text-sm uppercase tracking-wider hover:bg-wine-light transition shadow-lg shadow-wine/25 flex items-center justify-center gap-2"
          >
            <span>Launch Detection Suite</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-charcoal font-semibold text-sm uppercase tracking-wider border border-stone-300 hover:border-wine/50 hover:bg-ivory-100 transition"
          >
            Explore Methodology
          </button>
        </div>

        {/* Value Prop Badges */}
        <div className="mt-14 pt-10 border-t border-rose-dusty/30 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs">
          <div>
            <div className="font-serif text-2xl font-bold text-wine">Zero Fake Scores</div>
            <div className="text-charcoal-muted mt-1">Authentic mathematical calculations</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-wine">4 Modalities</div>
            <div className="text-charcoal-muted mt-1">Image, Audio, Video & Text</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-wine">Zero Retention</div>
            <div className="text-charcoal-muted mt-1">Privacy-first in-memory buffers</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-wine">ISO Aligned</div>
            <div className="text-charcoal-muted mt-1">Downloadable forensic PDF dossiers</div>
          </div>
        </div>
      </section>

      {/* Four Detection Modules Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-2">
            Engine Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal">
            Four Specialized Verification Pillars
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            Each modality is subjected to customized mathematical forensic transforms and validated against state-of-the-art synthetic signatures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="editorial-card rounded-3xl p-7 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-ivory-200 flex items-center justify-center mb-6 group-hover:bg-wine group-hover:text-white transition-colors text-wine">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-dusty block mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed mb-6 font-normal">
                    {card.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {card.badges.map((b, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-charcoal-muted border border-stone-200"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate('detect', card.id)}
                    className="w-full py-2.5 rounded-xl border border-stone-200 hover:border-wine hover:bg-wine hover:text-white text-xs font-semibold uppercase tracking-wider text-charcoal transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{card.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 border-y border-rose-dusty/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-2">
              Forensic Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal">
              How TruthLens Operates
            </h2>
            <p className="text-sm text-charcoal-muted mt-3">
              A transparent three-stage analytical protocol engineered for editorial, legal, and security scrutiny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-ivory-100/60 border border-stone-200/80">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-wine/25 block mb-4">
                  {st.num}
                </span>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">
                  {st.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed font-normal">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TruthLens Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-2">
              The TruthLens Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal mb-6 leading-tight">
              Why Compromised <br />
              <span className="italic text-wine">"Black-Box"</span> Detectors Fail
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-charcoal-muted leading-relaxed font-normal">
              <p>
                Many commercial AI detectors claim 99.9% certainty while hiding their underlying mechanics. In real-world environments, lossy compression, re-encoding, and artistic post-processing produce confounding artifacts that simple thresholds misclassify.
              </p>
              <p>
                TruthLens AI rejects fabricated certainty. We provide multi-layer forensic metrics—revealing the exact Error Level discrepancies, Fourier frequency energy ratios, vocal jitter, and syntactic burstiness values so human analysts can inspect the proof.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                Never invents confidence scores or hardcoded verdicts
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                Clearly states provider status and marks unavailable detectors honestly
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                Distinguishes sampled keyframe analysis from whole-video authentication
              </div>
            </div>
          </div>

          {/* Luxury Editorial Showcase Card */}
          <div className="editorial-card p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#4A1028] to-[#681B28] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-dusty/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-rose-dusty/20">
              <span className="font-serif text-lg tracking-wider text-rose-dusty font-bold">
                FORENSIC DOSSIER SPECIMEN
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-ivory-100 border border-white/20">
                STATUS: SEALED
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-rose-dusty block mb-1">
                  Primary Classification
                </span>
                <div className="font-serif text-3xl font-bold text-ivory-100">
                  Likely AI-Generated
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                  <div className="text-[10px] text-rose-dusty uppercase">AI Probability</div>
                  <div className="font-serif text-2xl font-bold text-white mt-0.5">88.4%</div>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                  <div className="text-[10px] text-rose-dusty uppercase">Confidence Level</div>
                  <div className="font-serif text-2xl font-bold text-white mt-0.5">HIGH</div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-ivory-200/80 leading-relaxed font-mono">
                ✓ 2D FFT High-Frequency Ratio: 91.2% (Spectral Anomaly)<br />
                ✓ Error Level Discrepancy: Peak 14.8 across central quadrant<br />
                ✓ Optical EXIF Sensor Provenance: Zero hardware tags found
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-white py-20 border-t border-rose-dusty/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-2">
              Architecture & Algorithms
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal">
              Scientific Instrumentation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            <div className="editorial-card p-6 rounded-2xl bg-ivory-100/50">
              <Cpu className="w-8 h-8 text-wine mb-4" />
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">2D Fourier Transforms</h3>
              <p className="text-charcoal-muted leading-relaxed">
                Computes 2D Fast Fourier Transforms (FFT) across luminance planes. Diffusion models leave characteristic lattice energy distributions and checkerboard grid spikes unseen by human eyes.
              </p>
            </div>

            <div className="editorial-card p-6 rounded-2xl bg-ivory-100/50">
              <Layers className="w-8 h-8 text-wine mb-4" />
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Acoustic Vocoder Auditing</h3>
              <p className="text-charcoal-muted leading-relaxed">
                Measures Zero Crossing Rate standard deviation (vocal tract micro-jitter) and upper-harmonic rolloff above 8,000 Hz where HiFi-GAN and neural TTS models exhibit sharp phase discontinuities.
              </p>
            </div>

            <div className="editorial-card p-6 rounded-2xl bg-ivory-100/50">
              <Sliders className="w-8 h-8 text-wine mb-4" />
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Syntactic Burstiness & Entropy</h3>
              <p className="text-charcoal-muted leading-relaxed">
                Calculates the standard deviation of sentence lengths and Shannon information entropy. Large Language Models generate balanced, uniform cadence (low burstiness), unlike human stylistic variability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center pb-12">
        <div className="p-10 sm:p-14 rounded-3xl bg-ivory-100 border border-rose-dusty/50 shadow-md">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal mb-4">
            Begin Your Forensic Verification
          </h2>
          <p className="text-sm text-charcoal-muted max-w-xl mx-auto mb-8 font-normal">
            Select any modality to analyze media files or written text. Instant processing, zero permanent storage, and complete technical breakdown.
          </p>
          <button
            onClick={() => onNavigate('detect')}
            className="px-9 py-4 rounded-full bg-wine text-white font-semibold text-xs uppercase tracking-wider hover:bg-wine-light transition shadow-lg shadow-wine/20 inline-flex items-center gap-2"
          >
            <span>Open Detection Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

