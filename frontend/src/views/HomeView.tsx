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
      subtitle: 'Looks real. But does it add up?',
      icon: ImageIcon,
      description: 'Examine image details, unusual patterns, and available camera information to spot signs of AI-generated or altered images.',
      badges: ['Image Frequency', 'Pixel Consistency', 'Camera Metadata'],
      action: 'Scan Image',
    },
    {
      id: 'audio',
      title: 'Voice & Audio Forensics',
      subtitle: 'That voice sounds familiar. Is it even real?',
      icon: Mic,
      description: 'Analyze audio patterns and speech characteristics to look for signs that a voice may have been generated or altered by AI.',
      badges: ['Acoustic Spectrum', 'Speech Jitter', 'Neural Synthesis'],
      action: 'Verify Voice',
    },
    {
      id: 'video',
      title: 'Video Forensics',
      subtitle: "Seeing is believing. Except when it isn't.",
      icon: Video,
      description: 'Inspect selected video frames for signs of manipulation and check whether details remain consistent across the video.',
      badges: ['Keyframe Sampling', 'Temporal Stability', 'Frame Inspection'],
      action: 'Inspect Video',
    },
    {
      id: 'text',
      title: 'Linguistic Authorship',
      subtitle: 'A little too polished to be human?',
      icon: FileText,
      description: 'Examine writing patterns, sentence variation, and language predictability to estimate whether text may have been written by AI.',
      badges: ['Sentence Variation', 'Vocabulary Richness', 'Cadence Modeling'],
      action: 'Analyze Text',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Upload Your Media',
      description: "Choose an image, audio clip, video, or text you want to check. We'll prepare it for analysis.",
    },
    {
      num: '02',
      title: 'Examine the Details',
      description: 'TruthLens looks for patterns and signs that may suggest AI generation or manipulation.',
    },
    {
      num: '03',
      title: 'Review the Findings',
      description: 'Get a clear breakdown of the results, including the indicators found and what they may mean.',
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

        <div className="max-w-2xl mx-auto text-base sm:text-xl text-charcoal-muted leading-relaxed font-normal mb-10 space-y-3">
          <p className="font-serif italic text-charcoal text-lg sm:text-2xl">
            “AI is getting better at pretending. Good thing we're nosy.”
          </p>
          <p className="text-sm sm:text-base">
            TruthLens helps you check whether images, audio, videos, and text were created by AI or a real person. Because apparently, even reality needs a fact-check.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('detect')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-wine text-white font-semibold text-sm uppercase tracking-wider hover:bg-wine-light transition shadow-lg shadow-wine/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Detection Suite</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-charcoal font-semibold text-sm uppercase tracking-wider border border-stone-300 hover:border-wine/50 hover:bg-ivory-100 transition cursor-pointer"
          >
            Explore Methodology
          </button>
        </div>

        {/* Value Prop Badges */}
        <div className="mt-14 pt-10 border-t border-rose-dusty/30 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs">
          <div>
            <div className="font-serif text-2xl font-bold text-wine">Zero Fake Scores</div>
            <div className="text-charcoal-muted mt-1">Authentic forensic evidence</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-wine">4 Modalities</div>
            <div className="text-charcoal-muted mt-1">Image, Audio, Video & Text</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-wine">Zero Retention</div>
            <div className="text-charcoal-muted mt-1">In-memory analytical buffers</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-wine">Plain English</div>
            <div className="text-charcoal-muted mt-1">Honest limits & clear reports</div>
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
            Four Ways to Question Reality
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            Not everything you see, hear, or read is what it claims to be. We check the details that might give it away.
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
                    className="w-full py-2.5 rounded-xl border border-stone-200 hover:border-wine hover:bg-wine hover:text-white text-xs font-semibold uppercase tracking-wider text-charcoal transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
      <section id="how-it-works" className="bg-white py-20 border-y border-rose-dusty/30 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-2">
              Forensic Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal">
              How TruthLens Works
            </h2>
            <p className="text-sm text-charcoal-muted mt-3">
              Three steps. No magnifying glass required.
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

          {/* Small note */}
          <div className="mt-12 text-center">
            <p className="inline-block px-4 py-2 rounded-full bg-ivory-200/80 border border-rose-dusty/40 text-xs text-charcoal-muted font-medium">
              Results are estimates, not absolute proof. Even technology has its limits.
            </p>
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
              Why Blindly Trust <br />
              <span className="italic text-wine">a Detector?</span>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-charcoal-muted leading-relaxed font-normal">
              <p>
                Some tools throw out a confident percentage and expect you to believe it. Very convenient. Not very convincing.
              </p>
              <p>
                TruthLens aims to make the process more transparent by showing the signals behind its findings—not just a dramatic verdict.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                <span>No fabricated confidence scores or hardcoded verdicts</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                <span>Clear information when a detection service is unavailable</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                <span>Video analysis explains which frames were inspected</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                <span>Results are presented as estimates, not unquestionable facts</span>
              </div>
            </div>

            <p className="mt-8 font-serif italic text-wine font-semibold text-sm">
              “A result is more useful when you can understand why it happened.”
            </p>
          </div>

          {/* Luxury Editorial Showcase Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFCFA] border border-[#E8D8D0] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#741D2B]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-[#E8D8D0]">
              <span className="font-serif text-lg tracking-wider text-[#741D2B] font-bold">
                A Closer Look at the Findings
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#741D2B]/10 text-[#741D2B] border border-[#741D2B]/20 uppercase tracking-wider font-semibold w-fit">
                SAMPLE REPORT — FOR DEMONSTRATION
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8B5A60] font-semibold block mb-1 font-mono">
                  Primary Classification
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#741D2B]">
                  Likely AI-Generated
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-[#E8D8D0] shadow-sm">
                  <div className="text-[10px] text-[#8B5A60] uppercase font-mono tracking-wider font-semibold">
                    Estimated AI Likelihood
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#292326] mt-0.5">88.4%</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8D8D0] shadow-sm">
                  <div className="text-[10px] text-[#8B5A60] uppercase font-mono tracking-wider font-semibold">
                    Sample Status
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#741D2B] mt-0.5">ESTIMATED</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8D8D0] text-xs text-[#3D3436] leading-relaxed shadow-sm">
                <span className="text-[10px] uppercase font-mono text-[#8B5A60] font-semibold block mb-1 tracking-wider">
                  Interpretation
                </span>
                Several analyzed indicators appear consistent with AI-generated media. This result is an estimate and should not be treated as definitive proof.
              </div>

              <div className="pt-2 text-xs text-[#3D3436] leading-relaxed font-mono space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#741D2B] font-bold shrink-0">✓</span>
                  <span>Unusual image-frequency patterns detected</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#741D2B] font-bold shrink-0">✓</span>
                  <span>Image editing inconsistencies observed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#741D2B] font-bold shrink-0">✓</span>
                  <span>No camera information found in the file</span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#E8D8D0] text-[11px] text-[#75666A] italic leading-relaxed">
                Note: This is an illustrative sample report. Actual results depend on the media and the detection methods available.
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
              The Science Behind the Lens
            </h2>
            <p className="text-sm text-charcoal-muted mt-3">
              The technical work happens behind the scenes. Here's the simple version.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            <div className="editorial-card p-6 rounded-2xl bg-ivory-100/50">
              <Cpu className="w-8 h-8 text-wine mb-4" />
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Image Pattern Analysis</h3>
              <p className="text-charcoal-muted leading-relaxed font-normal">
                We examine patterns and image details that may reveal signs of AI generation or editing.
              </p>
            </div>

            <div className="editorial-card p-6 rounded-2xl bg-ivory-100/50">
              <Layers className="w-8 h-8 text-wine mb-4" />
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Voice Pattern Analysis</h3>
              <p className="text-charcoal-muted leading-relaxed font-normal">
                We look for unusual speech and audio characteristics that may indicate synthetic or altered voices.
              </p>
            </div>

            <div className="editorial-card p-6 rounded-2xl bg-ivory-100/50">
              <Sliders className="w-8 h-8 text-wine mb-4" />
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Writing Pattern Analysis</h3>
              <p className="text-charcoal-muted leading-relaxed font-normal">
                We measure sentence variation and language patterns that may help distinguish AI-generated writing from human writing.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-serif italic text-wine font-semibold text-base sm:text-lg">
              “Fancy mathematics. Plain-English results.”
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center pb-12">
        <div className="p-10 sm:p-14 rounded-3xl bg-ivory-100 border border-rose-dusty/50 shadow-md">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal mb-4">
            Ready to Question What You See?
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted max-w-xl mx-auto mb-8 font-normal">
            Choose an image, voice, video, or piece of text. Let's take a closer look.
          </p>
          <button
            onClick={() => onNavigate('detect')}
            className="px-9 py-4 rounded-full bg-wine text-white font-semibold text-xs uppercase tracking-wider hover:bg-wine-light transition shadow-lg shadow-wine/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Open Detection Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-6">
            <p className="text-xs font-mono text-charcoal-subtle italic">
              Because “looks real” isn't exactly a reliable source.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
