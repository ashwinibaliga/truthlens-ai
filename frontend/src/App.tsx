import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { DetectView } from './views/DetectView';
import { ResultsView } from './views/ResultsView';
import { HistoryView } from './views/HistoryView';
import { AboutView } from './views/AboutView';
import { AuthView } from './views/AuthView';
import { ReportModal } from './components/ReportModal';
import { ScanResponse } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { setAuthToken } from './services/api';

const AppContent: React.FC = () => {
  const { user, session, getAccessToken } = useAuth();
  
  // Requirement: Opening the website must show login/register first
  const [currentView, setCurrentView] = useState<string>(user ? 'detect' : 'auth');
  const [activeDetectTab, setActiveDetectTab] = useState<string>('image');
  const [currentScan, setCurrentScan] = useState<ScanResponse | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [pendingViewAfterAuth, setPendingViewAfterAuth] = useState<string>('detect');
  
  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [modalScan, setModalScan] = useState<ScanResponse | null>(null);

  // Sync token whenever session changes
  useEffect(() => {
    const token = getAccessToken();
    setAuthToken(token);
  }, [session, user]);

  // Requirement: Logout returns to the login screen
  useEffect(() => {
    if (!user && (currentView === 'detect' || currentView === 'history')) {
      setCurrentView('auth');
    }
  }, [user]);

  const handleNavigate = (view: string, subTab?: string) => {
    if (subTab) {
      setActiveDetectTab(subTab);
    }

    // Route protection: require authentication for Detect and History
    if ((view === 'detect' || view === 'history') && !user) {
      setPendingViewAfterAuth(view);
      setAuthMode('login');
      setCurrentView('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'how-it-works') {
      setCurrentView('about');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setPendingViewAfterAuth('detect');
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    // Requirement: Successful login redirects to personal dashboard
    setCurrentView(pendingViewAfterAuth || 'detect');
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

  // If in full 3D Auth view, render immersive split-screen layout
  if (currentView === 'auth') {
    return (
      <AuthView
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
        onNavigateHome={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F0E9] text-[#282124]">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

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
          <AboutView onNavigateDetect={() => handleNavigate('detect')} />
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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
