import React, { useEffect } from 'react';
import { ScanResponse } from '../types';
import { 
  Download, Printer, ArrowLeft, RefreshCw, 
  Share2, Shield, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerdictBadge } from '../components/VerdictBadge';
import { ConfidenceGauge } from '../components/ConfidenceGauge';
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
  useEffect(() => {
    // Elegant celebratory burst for authenticated human or definitive forensic completion
    if (scan.verdict === 'likely_human') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D8B4AD', '#681B28', '#166534'],
      });
    }
  }, [scan]);

  const handleDownloadPDF = () => {
    downloadForensicReportPDF(scan);
  };

  const copyDossierLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Dossier reference copied to clipboard.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-dusty/30">
        <button
          onClick={onScanAnother}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-charcoal hover:text-wine transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another File</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyDossierLink}
            className="p-2 rounded-xl bg-white border border-stone-200 text-charcoal hover:bg-stone-50 transition"
            title="Share Dossier Reference"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-charcoal text-xs font-semibold hover:border-wine/50 transition"
          >
            <Printer className="w-3.5 h-3.5 text-wine" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-wine-light transition shadow-md shadow-wine/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Primary Verification Masthead Card */}
      <div className="editorial-card rounded-3xl p-6 sm:p-10 bg-white border border-rose-dusty/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-charcoal-subtle uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-wine" />
              <span>Dossier Reference: {scan.id.slice(0, 18)}...</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal break-words">
              {scan.filename}
            </h1>

            <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-muted flex-wrap">
              <span className="uppercase font-semibold px-2 py-0.5 rounded bg-ivory-200 text-wine border border-rose-dusty/40">
                {scan.media_type}
              </span>
              <span>•</span>
              <span>{(scan.file_size / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span>{new Date(scan.created_at).toLocaleString()}</span>
              <span>•</span>
              <span className="font-medium text-charcoal">{scan.provider}</span>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-charcoal-subtle block mb-1.5 font-medium">
              Detection Determination
            </span>
            <VerdictBadge verdict={scan.verdict} size="lg" />
          </div>
        </div>

        {/* Confidence Gauge Component */}
        <div className="mt-8">
          <ConfidenceGauge metrics={scan.confidence_metrics} />
        </div>
      </div>

      {/* Video Keyframe Timeline (If Modality is Video) */}
      {scan.media_type === 'video' && scan.forensic_results.frame_analysis && (
        <VideoFrameTimeline
          frames={scan.forensic_results.frame_analysis}
          temporalDetails={scan.forensic_results.technical_details?.temporal_consistency}
        />
      )}

      {/* Text Linguistic Breakdown (If Modality is Text) */}
      {scan.media_type === 'text' && scan.forensic_results.linguistic_breakdown && (
        <div className="editorial-card p-6 rounded-2xl bg-white border border-stone-200 space-y-4">
          <h3 className="font-serif text-xl font-bold text-charcoal">
            NLP Cadence & Statistical Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-ivory-100/60 border border-stone-200">
              <span className="text-charcoal-subtle block">Syntactic Burstiness</span>
              <span className="font-serif text-2xl font-bold text-wine mt-1 block">
                {scan.forensic_results.linguistic_breakdown.burstiness?.burstiness_index ?? '0.00'}
              </span>
              <span className="text-[10px] text-charcoal-subtle mt-0.5 block">Sentence length deviation</span>
            </div>
            <div className="p-3.5 rounded-xl bg-ivory-100/60 border border-stone-200">
              <span className="text-charcoal-subtle block">Shannon Entropy</span>
              <span className="font-serif text-2xl font-bold text-charcoal mt-1 block">
                {scan.forensic_results.linguistic_breakdown.entropy ?? '0.00'} <span className="text-xs font-sans font-normal text-charcoal-subtle">bits</span>
              </span>
              <span className="text-[10px] text-charcoal-subtle mt-0.5 block">Perplexity dispersion</span>
            </div>
            <div className="p-3.5 rounded-xl bg-ivory-100/60 border border-stone-200">
              <span className="text-charcoal-subtle block">Lexical Richness (TTR)</span>
              <span className="font-serif text-2xl font-bold text-charcoal mt-1 block">
                {scan.forensic_results.linguistic_breakdown.vocabulary?.type_token_ratio ?? '0.00'}
              </span>
              <span className="text-[10px] text-charcoal-subtle mt-0.5 block">Unique token ratio</span>
            </div>
            <div className="p-3.5 rounded-xl bg-ivory-100/60 border border-stone-200">
              <span className="text-charcoal-subtle block">AI Discourse Markers</span>
              <span className="font-serif text-2xl font-bold text-wine mt-1 block">
                {scan.forensic_results.linguistic_breakdown.ai_markers_found?.length ?? 0}
              </span>
              <span className="text-[10px] text-charcoal-subtle mt-0.5 block">Formulaic transitions</span>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Evidence & Indicators List */}
      <div>
        <div className="mb-4">
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            Observed Technical Indicators
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Individual scientific tests applied to verify biological/optical provenance vs synthetic artifacts
          </p>
        </div>

        <IndicatorsList indicators={scan.forensic_results.indicators} />
      </div>

      {/* Critical Methodology & Limitations Notice */}
      <div className="p-5 rounded-2xl bg-ivory-100 border border-stone-200 text-xs text-charcoal-muted leading-relaxed">
        <div className="font-semibold text-wine mb-1 flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          Forensic Methodology Notice & Limitations:
        </div>
        <p>
          {scan.forensic_results.limitations_disclaimer || 
            "Detection is probabilistic. High-frequency digital noise, social media transcoding, and creative post-processing may impact indicator metrics. AI detection does not confirm malicious intent or verify the personal identity of human creators."}
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <button
          onClick={onScanAnother}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-charcoal border border-stone-300 font-semibold text-xs uppercase tracking-wider hover:bg-stone-50 transition"
        >
          Scan Another File
        </button>

        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-wine text-white font-semibold text-xs uppercase tracking-wider hover:bg-wine-light transition shadow-md"
        >
          Download Sealed Forensic PDF
        </button>
      </div>
    </div>
  );
};

