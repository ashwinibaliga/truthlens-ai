import React from 'react';
import { ScanResponse } from '../types';
import { X, Download, Printer, Shield, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { downloadForensicReportPDF } from '../services/reportGenerator';
import { VerdictBadge } from './VerdictBadge';

interface ReportModalProps {
  scan: ScanResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ scan, isOpen, onClose }) => {
  if (!isOpen || !scan) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    downloadForensicReportPDF(scan);
  };

  const aiScore = scan.confidence_metrics?.ai_probability ?? (scan as any).ai_probability ?? 0;
  const humanScore = scan.confidence_metrics?.human_probability ?? Math.max(0, 100 - aiScore);
  const explanation =
    scan.confidence_metrics?.explanation ||
    (scan.verdict
      ? `Analysis determination: ${scan.verdict.replace(/_/g, ' ')}.`
      : 'Analysis completed.');
  const fileSizeText = scan.file_size ? `${(scan.file_size / 1024).toFixed(1)} KB` : 'Available in stream';
  const statusText = scan.status || 'completed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-dusty/40 my-8">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-ivory-100 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-wine" />
            <span className="font-serif font-bold text-wine text-lg">Forensic Dossier Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-wine text-white text-xs font-semibold hover:bg-wine-light transition shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-charcoal border border-stone-200 text-xs font-medium hover:bg-stone-50 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-charcoal-muted" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-200/60 text-charcoal-subtle transition ml-2 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Forensic Report Body */}
        <div className="p-8 sm:p-12 print-page bg-[#FCFAF8] text-[#282124]">
          {/* Editorial Masthead */}
          <div className="border-b-2 border-wine pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-wine inline-block" />
                <span className="text-xs uppercase tracking-widest font-bold text-wine">Official Forensic Analysis</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-wine">
                TRUTHLENS AI
              </h1>
              <p className="font-serif italic text-charcoal-muted text-sm mt-0.5">
                "See Beyond What Looks Real."
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-charcoal-subtle space-y-1">
              <div><span className="font-semibold text-charcoal">DOSSIER ID:</span> {scan.id}</div>
              <div><span className="font-semibold text-charcoal">TIMESTAMP:</span> {new Date(scan.created_at).toLocaleString()}</div>
              <div><span className="font-semibold text-charcoal">PROVIDER:</span> {scan.provider || 'TruthLens Forensic Engine'}</div>
            </div>
          </div>

          {/* Media Subject Specifications */}
          <div className="mb-8 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <h2 className="text-xs uppercase font-bold tracking-wider text-charcoal-subtle mb-3">
              Media Subject Provenance
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-charcoal-subtle block">Filename</span>
                <span className="font-semibold text-charcoal break-all">{scan.filename}</span>
              </div>
              <div>
                <span className="text-charcoal-subtle block">Modality</span>
                <span className="font-semibold text-charcoal uppercase">{scan.media_type}</span>
              </div>
              <div>
                <span className="text-charcoal-subtle block">Payload Size</span>
                <span className="font-semibold text-charcoal">{fileSizeText}</span>
              </div>
              <div>
                <span className="text-charcoal-subtle block">Analysis Status</span>
                <span className="font-semibold text-emerald-800 uppercase">{statusText}</span>
              </div>
            </div>
          </div>

          {/* Primary Verdict & Metrics */}
          <div className="mb-8 p-6 rounded-2xl bg-white border border-wine/20 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-charcoal-subtle font-medium block mb-1">
                  Primary Classification Verdict
                </span>
                <VerdictBadge verdict={scan.verdict} size="lg" />
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs text-charcoal-subtle block">AI Probability</span>
                  <span className="font-serif text-3xl font-bold text-wine">
                    {aiScore.toFixed(1)}%
                  </span>
                </div>
                <div className="text-right border-l pl-6 border-stone-200">
                  <span className="text-xs text-charcoal-subtle block">Human Authenticity</span>
                  <span className="font-serif text-2xl font-semibold text-emerald-800">
                    {humanScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed italic border-t border-stone-100 pt-3">
              {explanation}
            </p>
          </div>

          {/* Evidence Table */}
          <div className="mb-8">
            <h3 className="font-serif text-xl font-bold text-wine mb-3">
              Technical Forensic Indicators
            </h3>
            {scan.forensic_results?.indicators && scan.forensic_results.indicators.length > 0 ? (
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-ivory-200/70 border-b border-stone-200 text-charcoal font-semibold">
                      <th className="py-2.5 px-4 w-12 text-center">Status</th>
                      <th className="py-2.5 px-4">Forensic Indicator</th>
                      <th className="py-2.5 px-4">Observed Metric</th>
                      <th className="py-2.5 px-4">Analytical Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {scan.forensic_results.indicators.map((ind, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4 text-center">
                          {ind.indicator_type === 'flag' ? (
                            <AlertTriangle className="w-4 h-4 text-wine inline" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 inline" />
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-charcoal">{ind.title}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-charcoal-subtle">
                          {ind.metric_value || '—'}
                        </td>
                        <td className="py-3 px-4 text-charcoal-muted leading-relaxed">
                          {ind.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-ivory-100/60 border border-stone-200 text-xs text-charcoal-muted italic">
                No additional analysis details available.
              </div>
            )}
          </div>

          {/* Legal / Ethics Disclaimer Footer */}
          <div className="border-t border-stone-300 pt-5 mt-10 text-[11px] text-charcoal-subtle space-y-1.5 leading-relaxed">
            <p className="font-semibold text-charcoal">
              FORENSIC LIMITATION & STATISTICAL ESTIMATE DISCLAIMER:
            </p>
            <p>
              {scan.forensic_results?.limitations_disclaimer || 
                "All detection determinations are statistical probabilities generated through frequency spectrum analysis, spatial compression degradation (ELA), and machine learning classifiers. Results are probabilistic estimates and should not be used as standalone legal proof of fraud or disinformation."}
            </p>
            <p className="text-[10px] text-stone-400 font-mono pt-2">
              Generated by TruthLens AI • Engine Version 1.0.0 • Cryptographic Audit Reference: {scan.id}
            </p>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="no-print px-8 py-4 bg-ivory-100/70 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-wine-light transition shadow-sm cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

