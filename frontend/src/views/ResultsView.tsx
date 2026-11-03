import React, { useEffect, useState } from 'react';
import { ScanResponse } from '../types';
import { 
  Download, 
  Printer, 
  ArrowLeft, 
  Share2, 
  Shield, 
  Sparkles, 
  Copy, 
  Check, 
  FileCheck,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerdictBadge } from '../components/VerdictBadge';
import { CircularScoreGauge } from '../components/CircularScoreGauge';
import { IndicatorsList } from '../components/IndicatorsList';
import { VideoFrameTimeline } from '../components/VideoFrameTimeline';
import { downloadForensicReportPDF } from '../services/reportGenerator';

interface ResultsViewProps {
  scan: ScanResponse;
  onScanAnother: () => void;
  onOpenReportModal: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  scan,
  onScanAnother,
  onOpenReportModal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Elegant celebratory burst for authenticated human or definitive forensic completion
    if (scan.verdict === 'likely_human') {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D8B4AD', '#681B28', '#166534', '#C9A227'],
      });
    }
  }, [scan]);

  const handleDownloadPDF = () => {
    downloadForensicReportPDF(scan);
  };

  const copyDossierLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const aiScore = scan.confidence_metrics?.ai_probability ?? 0;
  const humanScore = scan.confidence_metrics?.human_probability ?? Math.max(0, 100 - aiScore);
  const confidenceLevel = scan.confidence_metrics?.confidence_level || 'moderate';
  const explanation = scan.confidence_metrics?.explanation || 'Empirical forensic analysis completed.';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-4 animate-fadeIn">
      {/* ---------------------------------------------------- */}
      {/* Top Navigation & Action Controls */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DCD5]">
        <button
          onClick={onScanAnother}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#541D2B] hover:text-[#702B3D] transition group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Scan Another File</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={copyDossierLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8DCD5] text-xs font-medium text-[#343039] hover:bg-[#FAF7F2] transition shadow-sm cursor-pointer"
            title="Share Dossier Reference"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4 text-[#78636A]" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E8DCD5] text-[#343039] text-xs font-semibold hover:border-[#541D2B]/40 transition shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#541D2B]" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#541D2B] to-[#702B3D] text-white text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition shadow-md shadow-[#541D2B]/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Primary 3D Forensic Masthead & Centerpiece Score */}
      {/* ---------------------------------------------------- */}
      <div className="card-3d-depth rounded-3xl p-6 sm:p-10 bg-[#FFFCF9] border border-[#E8DCD5] relative overflow-hidden">
        {/* Subtle decorative background light reflections */}
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#541D2B]/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />

        {/* Masthead Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E8DCD5]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#78636A] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#541D2B] animate-pulse" />
              <span>Dossier Ref: {scan.id.slice(0, 18)}...</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#541D2B] break-words tracking-tight">
              {scan.filename}
            </h1>

            <p className="text-xs font-serif italic text-[#78636A] pt-0.5">
              "The file has been examined. The evidence speaks."
            </p>

            {/* Metadata Pills */}
            <div className="flex items-center gap-2.5 pt-2 text-xs text-[#78636A] flex-wrap font-normal">
              <span className="uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF0EA] text-[#541D2B] border border-[#E8DCD5]">
                {scan.media_type}
              </span>
              <span>•</span>
              <span>{scan.file_size ? `${(scan.file_size / 1024).toFixed(1)} KB` : 'Verified Payload'}</span>
              <span>•</span>
              <span>{new Date(scan.created_at).toLocaleString()}</span>
              <span>•</span>
              <span className="font-medium text-[#343039]">{scan.provider || 'TruthLens AI Forensic Engine'}</span>
            </div>
          </div>

          {/* Determination Badge */}
          <div className="text-left md:text-right shrink-0 space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#78636A] block font-semibold">
              Final Determination
            </span>
            <VerdictBadge verdict={scan.verdict} size="lg" />
          </div>
        </div>

        {/* Centerpiece 3D Score & Executive Finding */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Animated Circular Score Visualization */}
          <div className="lg:col-span-5 flex justify-center">
            <CircularScoreGauge
              score={aiScore}
              verdict={scan.verdict}
              confidenceLevel={confidenceLevel}
            />
          </div>

          {/* Executive Synthesis & Dual Meters */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#78636A]">
                Executive Finding Summary
              </span>
              <p className="text-sm sm:text-base text-[#343039] leading-relaxed font-normal">
                {explanation}
              </p>
            </div>

            {/* Dual Measured Signal Comparisons */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between items-baseline mb-1 text-xs">
                  <span className="font-semibold text-[#541D2B] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#541D2B]" />
                    AI Synthesis Signal
                  </span>
                  <span className="font-serif text-lg font-bold text-[#541D2B]">
                    {aiScore.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#FAF0EA] rounded-full h-3 overflow-hidden border border-[#E8DCD5]/60">
                  <div
                    className="bg-gradient-to-r from-[#541D2B] to-[#702B3D] h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, aiScore))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1 text-xs">
                  <span className="font-semibold text-[#14532D] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#166534]" />
                    Organic Provenance Signal
                  </span>
                  <span className="font-serif text-base font-bold text-[#14532D]">
                    {humanScore.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#FAF0EA] rounded-full h-2.5 overflow-hidden border border-[#E8DCD5]/60">
                  <div
                    className="bg-[#166534] h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, humanScore))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Philosophical Microcopy */}
            <div className="p-3.5 rounded-2xl bg-[#FAF0EA]/60 border border-[#E8DCD5] text-xs text-[#78636A] flex items-center justify-between">
              <span className="italic">"A result is only as good as its evidence."</span>
              <span className="text-[10px] font-mono font-semibold text-[#541D2B] uppercase">TruthLens Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Video Keyframe Timeline (If Modality is Video) */}
      {/* ---------------------------------------------------- */}
      {scan.media_type === 'video' && scan.forensic_results?.frame_analysis && (
        <VideoFrameTimeline
          frames={scan.forensic_results.frame_analysis}
          temporalDetails={scan.forensic_results.technical_details?.temporal_consistency}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* Text Linguistic Breakdown (If Modality is Text) */}
      {/* ---------------------------------------------------- */}
      {scan.media_type === 'text' && scan.forensic_results?.linguistic_breakdown && (
        <div className="card-3d-depth p-6 sm:p-8 rounded-3xl bg-[#FFFCF9] border border-[#E8DCD5] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78636A]">
                Statistical NLP
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#541D2B]">
                Syntactic Cadence & Entropy Dispersion
              </h3>
            </div>
            <span className="text-xs font-serif italic text-[#78636A] hidden sm:block">
              "Syntax has rhythm."
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5]">
              <span className="text-[#78636A] block">Syntactic Burstiness</span>
              <span className="font-serif text-2xl font-bold text-[#541D2B] mt-1 block">
                {scan.forensic_results.linguistic_breakdown.burstiness?.burstiness_index ?? '0.00'}
              </span>
              <span className="text-[10px] text-[#78636A] mt-0.5 block">Sentence cadence variance</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5]">
              <span className="text-[#78636A] block">Shannon Entropy</span>
              <span className="font-serif text-2xl font-bold text-[#343039] mt-1 block">
                {scan.forensic_results.linguistic_breakdown.entropy ?? '0.00'} <span className="text-xs font-sans font-normal text-[#78636A]">bits</span>
              </span>
              <span className="text-[10px] text-[#78636A] mt-0.5 block">Perplexity dispersion</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5]">
              <span className="text-[#78636A] block">Lexical Richness (TTR)</span>
              <span className="font-serif text-2xl font-bold text-[#343039] mt-1 block">
                {scan.forensic_results.linguistic_breakdown.vocabulary?.type_token_ratio ?? '0.00'}
              </span>
              <span className="text-[10px] text-[#78636A] mt-0.5 block">Unique token ratio</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5]">
              <span className="text-[#78636A] block">Formulaic AI Markers</span>
              <span className="font-serif text-2xl font-bold text-[#702B3D] mt-1 block">
                {scan.forensic_results.linguistic_breakdown.ai_markers_found?.length ?? 0}
              </span>
              <span className="text-[10px] text-[#78636A] mt-0.5 block">Discourse transition matches</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Forensic Evidence & Interactive Indicators Grid */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78636A]">
              Empirical Evidence Matrix
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#541D2B]">
              Observed Technical Indicators
            </h2>
          </div>
          <p className="text-xs font-serif italic text-[#78636A]">
            "We don't guess. We investigate."
          </p>
        </div>

        <IndicatorsList indicators={scan.forensic_results.indicators} />
      </section>

      {/* ---------------------------------------------------- */}
      {/* Critical Forensic Methodology & Limitations Notice */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 rounded-3xl bg-[#FAF0EA]/70 border border-[#E8DCD5] text-xs text-[#343039] leading-relaxed space-y-1.5">
        <div className="font-bold text-[#541D2B] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#702B3D]" />
          <span>Forensic Methodology Notice & Boundaries:</span>
        </div>
        <p className="font-normal text-[#343039]">
          {scan.forensic_results.limitations_disclaimer || 
            "Detection determinations are statistical indicators based on pixel frequency analysis, spatial compression gradients (ELA), acoustic phase variation, and neural language heuristics. TruthLens does not assert malicious intent or personal creator identity."}
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Bottom Actions */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E8DCD5]">
        <button
          onClick={onScanAnother}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#541D2B] border border-[#E8DCD5] font-semibold text-xs uppercase tracking-wider hover:bg-[#FAF7F2] transition shadow-sm cursor-pointer"
        >
          Scan Another File
        </button>

        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#541D2B] to-[#702B3D] text-white font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-[#541D2B]/20 cursor-pointer"
        >
          Download Sealed Forensic PDF
        </button>
      </div>
    </div>
  );
};
