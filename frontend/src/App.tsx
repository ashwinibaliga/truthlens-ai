import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
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
import { setAuthToken, fetchScanById } from './services/api';

const AppContent: React.FC = () => {
  const { user, session, loading, getAccessToken } = useAuth();
  
  // Requirement: Opening the website must show login/register first
  const [currentView, setCurrentView] = useState<string>('auth');
  const [activeDetectTab, setActiveDetectTab] = useState<string>('image');
  const [currentScan, setCurrentScan] = useState<ScanResponse | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [pendingViewAfterAuth, setPendingViewAfterAuth] = useState<string>('detect');
  
  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [modalScan, setModalScan] = useState<ScanResponse | null>(null);

  // Track whether initial authentication check on mount has completed
  const initialAuthChecked = React.useRef(false);

  // Sync token whenever session changes
  useEffect(() => {
    const token = getAccessToken();
    setAuthToken(token);
  }, [session, user]);

  // Requirement: Logout returns to the login screen
  useEffect(() => {
    if (!loading && !user && (currentView === 'detect' || currentView === 'history')) {
      setCurrentView('auth');
    }
  }, [user, loading, currentView]);

  // Navigate to personal dashboard on initial mount if an existing valid session is present
  useEffect(() => {
    if (!loading && !initialAuthChecked.current) {
      initialAuthChecked.current = true;
      if (user && currentView === 'auth') {
        setCurrentView(pendingViewAfterAuth || 'detect');
      }
    }
  }, [loading, user, currentView, pendingViewAfterAuth]);

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
      if (currentView !== 'home') {
        setCurrentView('home');
        // Allow home view DOM to mount before smoothly scrolling to section
        setTimeout(() => {
          const section = document.getElementById('how-it-works');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        const section = document.getElementById('how-it-works');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    setCurrentView(view);
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

  const handleViewScan = async (scan: ScanResponse) => {
    if (scan.id && (!scan.confidence_metrics || !scan.forensic_results)) {
      try {
        const full = await fetchScanById(scan.id);
        setCurrentScan(full);
      } catch {
        setCurrentScan(scan);
      }
    } else {
      setCurrentScan(scan);
    }
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

  // While resolving OAuth tokens or restoring cryptographic session, render editorial luxury loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F0E9] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wine to-burgundy flex items-center justify-center shadow-xl shadow-wine/25">
            <div className="w-11 h-11 rounded-full border-2 border-rose-dusty/40 flex items-center justify-center">
              <Eye className="w-6 h-6 text-ivory-100 animate-pulse" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-wine/20 border-t-wine animate-spin" />
        </div>
        <div className="font-serif text-2xl font-bold tracking-tight text-wine flex items-center gap-2 mb-2">
          TruthLens <span className="text-xs uppercase font-sans tracking-widest font-semibold px-1.5 py-0.5 rounded bg-wine/10 text-wine">AI</span>
        </div>
        <p className="text-xs uppercase tracking-widest text-charcoal-muted font-mono animate-pulse">
          Authenticating Forensic Identity...
        </p>
      </div>
    );
  }

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
