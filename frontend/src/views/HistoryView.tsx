import React, { useState, useEffect } from 'react';
import { ScanResponse, MediaType } from '../types';
import { fetchScans, deleteScan } from '../services/api';
import { Search, Filter, Trash2, ExternalLink, RefreshCw, FileText, Download } from 'lucide-react';
import { VerdictBadge } from '../components/VerdictBadge';
import { downloadForensicReportPDF } from '../services/reportGenerator';

interface HistoryViewProps {
  onViewScan: (scan: ScanResponse) => void;
  onNavigateDetect: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onViewScan, onNavigateDetect }) => {
  const [scans, setScans] = useState<ScanResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mediaFilter, setMediaFilter] = useState<string>('all');
  const [verdictFilter, setVerdictFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadScans();
  }, [mediaFilter, verdictFilter]);

  const loadScans = async () => {
    setLoading(true);
    try {
      const data = await fetchScans({
        media_type: mediaFilter !== 'all' ? mediaFilter : undefined,
        verdict: verdictFilter !== 'all' ? verdictFilter : undefined,
        limit: 50,
      });
      setScans(data);
    } catch (err) {
      console.error('Error fetching scans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this forensic scan record?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteScan(id);
      setScans(scans.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (scan: ScanResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadForensicReportPDF(scan);
  };

  const filteredScans = scans.filter((s) =>
    s.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-wine block mb-1">
            Audit Trail
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Forensic Scan Archives
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Historical records, probabilistic assessments, and verified reports stored in database.
          </p>
        </div>

        <button
          onClick={loadScans}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-charcoal hover:bg-stone-50 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="editorial-card p-4 rounded-2xl bg-white border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-charcoal-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs text-charcoal outline-none focus:border-wine"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-charcoal-subtle font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-charcoal outline-none bg-white font-medium"
          >
            <option value="all">All Modalities</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
          </select>

          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-charcoal outline-none bg-white font-medium"
          >
            <option value="all">All Verdicts</option>
            <option value="likely_ai">Likely AI</option>
            <option value="likely_human">Likely Human</option>
            <option value="potentially_manipulated">Manipulated</option>
            <option value="inconclusive">Inconclusive</option>
          </select>
        </div>
      </div>

      {/* Scans List / Table */}
      {loading ? (
        <div className="editorial-card p-16 rounded-3xl text-center bg-white border border-stone-200">
          <RefreshCw className="w-6 h-6 text-wine animate-spin mx-auto mb-3" />
          <p className="text-xs text-charcoal-muted">Retrieving archived forensic records...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="editorial-card p-16 rounded-3xl text-center bg-white border border-stone-200 space-y-4">
          <FileText className="w-10 h-10 text-charcoal-subtle mx-auto opacity-50" />
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal">No Forensic Records Found</h3>
            <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
              No historical verification scans match your current filter parameters.
            </p>
          </div>
          <button
            onClick={onNavigateDetect}
            className="px-6 py-2.5 rounded-full bg-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-wine-light transition shadow-md"
          >
            Start a New Scan
          </button>
        </div>
      ) : (
        <div className="editorial-card rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory-200/60 border-b border-stone-200 text-charcoal-subtle uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Modality</th>
                  <th className="py-3.5 px-4">Verdict</th>
                  <th className="py-3.5 px-4">AI Probability</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredScans.map((scan) => (
                  <tr
                    key={scan.id}
                    onClick={() => onViewScan(scan)}
                    className="hover:bg-ivory-100/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-charcoal max-w-[220px] truncate">
                      {scan.filename}
                    </td>
                    <td className="py-4 px-4 uppercase text-charcoal-muted font-medium">
                      {scan.media_type}
                    </td>
                    <td className="py-4 px-4">
                      <VerdictBadge verdict={scan.verdict} size="sm" />
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-wine">
                      {scan.confidence_metrics.ai_probability.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-charcoal-subtle">
                      {new Date(scan.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDownload(scan, e)}
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-wine hover:bg-stone-100 transition"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onViewScan(scan)}
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-wine hover:bg-stone-100 transition"
                          title="Open Dossier"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(scan.id, e)}
                          disabled={deletingId === scan.id}
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-700 hover:bg-red-50 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

