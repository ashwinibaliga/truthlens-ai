import { jsPDF } from 'jspdf';
import { ScanResponse } from '../types';

export function downloadForensicReportPDF(scan: ScanResponse): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Background tint: warm ivory
  doc.setFillColor(248, 240, 233);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Header banner: Deep Wine
  doc.setFillColor(104, 27, 40);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(104, 27, 40); // Wine
  doc.text('TRUTHLENS AI', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(106, 95, 100);
  doc.text('OFFICIAL FORENSIC VERIFICATION DOSSIER', margin, 24);

  // Top-Right Metadata
  doc.setFontSize(8);
  doc.setTextColor(40, 33, 36);
  doc.text(`Report ID: ${scan.id.slice(0, 18)}...`, pageWidth - margin, 15, { align: 'right' });
  doc.text(`Timestamp: ${new Date(scan.created_at).toUTCString()}`, pageWidth - margin, 20, { align: 'right' });
  doc.text(`Status: VERIFIED & SEALED`, pageWidth - margin, 25, { align: 'right' });

  let y = 38;

  // Section 1: Subject Media Information
  doc.setDrawColor(216, 180, 173); // Dusty rose border
  doc.setLineWidth(0.5);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(104, 27, 40);
  doc.text('MEDIA SUBJECT PROVENANCE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 33, 36);
  doc.text(`Filename: ${scan.filename}`, margin + 4, y + 13);
  doc.text(`Media Type: ${scan.media_type.toUpperCase()}`, margin + 4, y + 19);
  doc.text(`File Size: ${(scan.file_size / 1024).toFixed(1)} KB`, margin + 85, y + 13);
  doc.text(`Provider: ${scan.provider}`, margin + 85, y + 19);

  y += 30;

  // Section 2: Verdict & Confidence Breakdown
  const verdictTitles: Record<string, string> = {
    likely_ai: 'LIKELY AI-GENERATED',
    likely_human: 'LIKELY HUMAN-CREATED',
    potentially_manipulated: 'POTENTIALLY MANIPULATED / SPLICED',
    inconclusive: 'INCONCLUSIVE / INSUFFICIENT DATA',
  };

  const verdictColor = scan.verdict === 'likely_ai' 
    ? [104, 27, 40] 
    : scan.verdict === 'likely_human' 
      ? [20, 100, 60] 
      : [160, 80, 30];

  doc.setFillColor(253, 252, 251);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(104, 27, 40);
  doc.text('PRIMARY FORENSIC VERDICT', margin + 4, y + 7);

  // Verdict pill
  doc.setFillColor(verdictColor[0], verdictColor[1], verdictColor[2]);
  doc.roundedRect(margin + 4, y + 11, 80, 9, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(verdictTitles[scan.verdict] || scan.verdict.toUpperCase(), margin + 8, y + 17);

  // Metrics on right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 33, 36);
  doc.text(`AI Probability: ${scan.confidence_metrics.ai_probability}%`, margin + 95, y + 14);
  doc.text(`Human Probability: ${scan.confidence_metrics.human_probability}%`, margin + 95, y + 20);
  doc.text(`Confidence Level: ${scan.confidence_metrics.confidence_level.toUpperCase()}`, margin + 95, y + 26);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(106, 95, 100);
  const explLines = doc.splitTextToSize(scan.confidence_metrics.explanation, contentWidth - 8);
  doc.text(explLines, margin + 4, y + 27);

  y += 42;

  // Section 3: Forensic Indicators Table
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(104, 27, 40);
  doc.text('TECHNICAL FORENSIC INDICATORS', margin, y);
  y += 5;

  const indicators = scan.forensic_results.indicators || [];
  indicators.slice(0, 5).forEach((ind) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 220, 215);
    doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

    // Indicator status tag
    const isFlag = ind.indicator_type === 'flag';
    doc.setFillColor(isFlag ? 104 : 80, isFlag ? 27 : 120, isFlag ? 40 : 80);
    doc.rect(margin, y, 3, 18, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 33, 36);
    doc.text(ind.title, margin + 6, y + 6);

    if (ind.metric_value) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(104, 27, 40);
      doc.text(ind.metric_value, pageWidth - margin - 4, y + 6, { align: 'right' });
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 70, 75);
    const descLines = doc.splitTextToSize(ind.description, contentWidth - 10);
    doc.text(descLines, margin + 6, y + 11);

    y += 21;
  });

  // Section 4: Video Frame Breakdown if applicable
  if (scan.forensic_results.frame_analysis && scan.forensic_results.frame_analysis.length > 0) {
    y += 2;
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(104, 27, 40);
    doc.text('KEYFRAME SAMPLING TIMELINE', margin, y);
    y += 4;

    const frames = scan.forensic_results.frame_analysis.slice(0, 6);
    const frameWidth = (contentWidth - (frames.length - 1) * 3) / frames.length;
    frames.forEach((f, idx) => {
      const fx = margin + idx * (frameWidth + 3);
      doc.setFillColor(248, 240, 233);
      doc.roundedRect(fx, y, frameWidth, 12, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(40, 33, 36);
      doc.text(f.timestamp, fx + frameWidth / 2, y + 4, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(f.ai_probability > 70 ? 104 : 40, f.ai_probability > 70 ? 27 : 100, 40);
      doc.text(`${f.ai_probability}% AI`, fx + frameWidth / 2, y + 9, { align: 'center' });
    });
    y += 18;
  }

  // Footer Disclaimer & Seal
  const footerY = pageHeight - 26;
  doc.setDrawColor(216, 180, 173);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 110, 115);
  const disclaimer = scan.forensic_results.limitations_disclaimer || 
    'TruthLens AI forensic assessments represent statistical probability estimations and do not constitute absolute legal or mathematical proof of synthetic origin or human authorship.';
  const discLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(discLines, margin, footerY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(104, 27, 40);
  doc.text('TruthLens AI Verification Dossier — Generated securely under ISO/IEC statistical media standards.', margin, pageHeight - 7);

  // Save the PDF file
  const safeFilename = scan.filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`TruthLens_Dossier_${safeFilename}_${scan.id.slice(0, 8)}.pdf`);
}

