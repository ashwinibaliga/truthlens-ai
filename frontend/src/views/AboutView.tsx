import React from 'react';
import { 
  ImageIcon, 
  Volume2, 
  Video as VideoIcon, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Scale, 
  Layers
} from 'lucide-react';

interface AboutViewProps {
  onNavigateDetect: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateDetect }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* ---------------------------------------------------- */}
      {/* Hero Header */}
      {/* ---------------------------------------------------- */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0EA] border border-[#E8DCD5]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88A55]" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#78636A]">
            Methodological Manifesto
          </span>
        </div>
        
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#541D2B] tracking-tight leading-[1.15]">
          The Architecture of Authenticity
        </h1>
        
        <p className="text-base sm:text-lg text-[#343039] leading-relaxed font-normal pt-1 max-w-2xl mx-auto">
          TruthLens AI helps you examine digital content using image patterns, audio signals, video frames, and writing characteristics. Our goal is to make media analysis easier to understand through measurable evidence and transparent AI assistance.
        </p>
      </header>

      {/* ---------------------------------------------------- */}
      {/* Section 01: Evidence, Not Guesswork */}
      {/* ---------------------------------------------------- */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] shadow-luxury transition-all">
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
          <div className="shrink-0 flex items-center gap-3">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B88A55] tracking-tight">
              01
            </span>
            <div className="h-8 w-px bg-[#E8DCD5] hidden md:block" />
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78636A]">
                Empirical Foundation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#702B3D]">
                Evidence, Not Guesswork
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#343039] leading-relaxed font-normal">
              We believe AI analysis should be honest and transparent. Instead of showing made-up confidence scores, TruthLens presents measurable indicators from the content being examined.
            </p>

            {/* Indicator List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#541D2B]">Image analysis</h4>
                  <p className="text-xs text-[#343039] leading-normal mt-0.5 font-normal">
                    Examines pixel patterns, frequency details, and compression differences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#541D2B]">Audio analysis</h4>
                  <p className="text-xs text-[#343039] leading-normal mt-0.5 font-normal">
                    Studies voice patterns, sound variation, and frequency characteristics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <VideoIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#541D2B]">Video analysis</h4>
                  <p className="text-xs text-[#343039] leading-normal mt-0.5 font-normal">
                    Examines selected video frames and looks for visual inconsistencies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#541D2B]">Text analysis</h4>
                  <p className="text-xs text-[#343039] leading-normal mt-0.5 font-normal">
                    Studies sentence patterns, writing rhythm, and language characteristics.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF0EA]/60 border border-[#E8DCD5] text-xs text-[#78636A] leading-relaxed">
              <span className="font-semibold text-[#541D2B]">Important note: </span>
              These indicators can help identify unusual patterns, but they cannot prove on their own whether content is AI-generated.
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Section 02: Four Ways We Examine Media */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-[#B88A55]">02</span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78636A]">
              Core Modalities
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#702B3D]">
            Four Ways We Examine Media
          </h2>
          <p className="text-sm text-[#78636A] max-w-lg mx-auto font-normal">
            Each medium has distinct synthetic footprints. TruthLens deploys specialized forensic checks designed for each format.
          </p>
        </div>

        {/* Four Distinct Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Image Forensics */}
          <div className="p-7 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] shadow-luxury hover:border-[#B88A55]/40 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EA] border border-[#E8DCD5] flex items-center justify-center text-[#B88A55]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#702B3D]">
                Image Forensics
              </h3>
              <p className="text-sm text-[#343039] leading-relaxed font-normal">
                Looks at image details, pixel patterns, and compression changes to find possible signs of editing or synthetic generation.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8DCD5] flex items-center justify-between text-xs text-[#78636A]">
              <span className="font-medium">Modality</span>
              <span className="font-semibold text-[#541D2B]">Pixel & Frequency Lens</span>
            </div>
          </div>

          {/* Card 2: Audio Forensics */}
          <div className="p-7 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] shadow-luxury hover:border-[#B88A55]/40 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EA] border border-[#E8DCD5] flex items-center justify-center text-[#B88A55]">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#702B3D]">
                Audio Forensics
              </h3>
              <p className="text-sm text-[#343039] leading-relaxed font-normal">
                Studies changes in voice patterns, pitch, sound variation, and audio frequencies that may indicate synthetic speech.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8DCD5] flex items-center justify-between text-xs text-[#78636A]">
              <span className="font-medium">Modality</span>
              <span className="font-semibold text-[#541D2B]">Acoustic & Vocoder Lens</span>
            </div>
          </div>

          {/* Card 3: Video Forensics */}
          <div className="p-7 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] shadow-luxury hover:border-[#B88A55]/40 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EA] border border-[#E8DCD5] flex items-center justify-center text-[#B88A55]">
                <VideoIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#702B3D]">
                Video Forensics
              </h3>
              <p className="text-sm text-[#343039] leading-relaxed font-normal">
                Extracts selected frames from a video and examines them for visual inconsistencies. It does not claim to inspect every moment of the video.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8DCD5] flex items-center justify-between text-xs text-[#78636A]">
              <span className="font-medium">Modality</span>
              <span className="font-semibold text-[#541D2B]">Discrete Keyframe Lens</span>
            </div>
          </div>

          {/* Card 4: Text Analysis */}
          <div className="p-7 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] shadow-luxury hover:border-[#B88A55]/40 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0EA] border border-[#E8DCD5] flex items-center justify-center text-[#B88A55]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#702B3D]">
                Text Analysis
              </h3>
              <p className="text-sm text-[#343039] leading-relaxed font-normal">
                Examines sentence length, writing rhythm, and language patterns that may be associated with AI-generated writing. These patterns are not proof of who wrote the text.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8DCD5] flex items-center justify-between text-xs text-[#78636A]">
              <span className="font-medium">Modality</span>
              <span className="font-semibold text-[#541D2B]">Linguistic Cadence Lens</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Section 03: Our Ethical Boundaries */}
      {/* ---------------------------------------------------- */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] shadow-luxury transition-all">
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
          <div className="shrink-0 flex items-center gap-3">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#B88A55] tracking-tight">
              03
            </span>
            <div className="h-8 w-px bg-[#E8DCD5] hidden md:block" />
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78636A]">
                Standards & Transparency
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#702B3D]">
                Our Ethical Boundaries
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#343039] leading-relaxed font-normal">
              We believe responsible technology should be clear about what it can and cannot do.
            </p>

            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-6 h-6 rounded-full bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#541D2B]">No identity claims</h4>
                  <p className="text-xs sm:text-sm text-[#343039] leading-relaxed font-normal">
                    We cannot identify the person who created a piece of content.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-6 h-6 rounded-full bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#541D2B]">No assumptions about intent</h4>
                  <p className="text-xs sm:text-sm text-[#343039] leading-relaxed font-normal">
                    AI-generated content is not automatically fake, harmful, or misleading.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-6 h-6 rounded-full bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#541D2B]">Honest results</h4>
                  <p className="text-xs sm:text-sm text-[#343039] leading-relaxed font-normal">
                    We show available analysis and clearly communicate when an AI service is unavailable.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DCD5]">
                <div className="w-6 h-6 rounded-full bg-[#FAF0EA] flex items-center justify-center shrink-0 mt-0.5 text-[#B88A55]">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#541D2B]">Privacy transparency</h4>
                  <p className="text-xs sm:text-sm text-[#343039] leading-relaxed font-normal">
                    We explain how uploaded content is processed and stored, based on the actual system implementation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* Closing Section: Call to Action */}
      {/* ---------------------------------------------------- */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#541D2B] via-[#4A1028] to-[#380B1E] text-white shadow-2xl text-center space-y-6 border border-[#702B3D]/50 relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-[#B88A55]/10 blur-2xl pointer-events-none" />

        <div className="max-w-xl mx-auto space-y-3 relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF5F1] tracking-tight">
            Ready to Examine Your Media?
          </h2>
          <p className="text-sm sm:text-base text-[#EAD5D0] font-normal leading-relaxed">
            Start an analysis using the TruthLens Detection Console.
          </p>
        </div>

        <div className="pt-2 relative z-10">
          <button
            onClick={onNavigateDetect}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-[#541D2B] text-xs uppercase tracking-widest font-bold hover:bg-[#FAF5F1] hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <span>LAUNCH DETECTION CONSOLE</span>
            <ArrowRight className="w-4 h-4 text-[#541D2B]" />
          </button>
        </div>
      </section>
    </div>
  );
};
