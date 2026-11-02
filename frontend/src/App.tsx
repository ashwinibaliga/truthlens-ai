import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { DetectView } from './views/DetectView';
import { ResultsView } from './views/ResultsView';
import { HistoryView } from './views/HistoryView';
import { AboutView } from './views/AboutView';
import { ReportModal } from './components/ReportModal';
import { ScanResponse } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeDetectTab, setActiveDetectTab] = useState<string>('image');
  const [currentScan, setCurrentScan] = useState<ScanResponse | null>(null);
  
  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [modalScan, setModalScan] = useState<ScanResponse | null>(null);

  const handleNavigate = (view: string, subTab?: string) => {
    if (subTab) {
      setActiveDetectTab(subTab);
    }
    if (view === 'how-it-works') {
      setCurrentView('about');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanComplete = (scan: ScanResponse) => {
    setCurrentScan(scan);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewScan = (scan: ScanResponse) => {
    setCurrentScan(scan);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReportModal = (scan?: ScanResponse) => {
    const target = scan || currentScan;
    if (target) {
      setModalScan(target);
      setIsReportModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F0E9] text-[#282124]">
      {/* Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 py-10 sm:py-16">
        {currentView === 'home' && (
          <HomeView onNavigate={handleNavigate} />
        )}

        {currentView === 'detect' && (
          <DetectView
            initialTab={activeDetectTab}
            onScanComplete={handleScanComplete}
            onViewScan={handleViewScan}
          />
        )}

        {currentView === 'results' && currentScan && (
          <ResultsView
            scan={currentScan}
            onScanAnother={() => setCurrentView('detect')}
            onOpenReportModal={() => handleOpenReportModal(currentScan)}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onViewScan={handleViewScan}
            onNavigateDetect={() => setCurrentView('detect')}
          />
        )}

        {currentView === 'about' && (
          <AboutView onNavigateDetect={() => setCurrentView('detect')} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Full Forensic Report Modal */}
      <ReportModal
        scan={modalScan}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default App;
