import React, { useState, useEffect, useRef } from 'react';
import { Eye, Shield, Activity, Menu, X, LogIn, UserPlus, LogOut, ChevronDown, User as UserIcon, History } from 'lucide-react';
import { fetchProviders } from '../services/api';
import { ProviderStatus } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, subTab?: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [providersModalOpen, setProvidersModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProviders()
      .then(setProviders)
      .catch(() => {});
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'detect', label: 'Detect', requiresAuth: true },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'history', label: 'History', requiresAuth: true },
  ];

  const handleLinkClick = (link: { id: string; requiresAuth?: boolean }) => {
    if (link.requiresAuth && !user) {
      onOpenAuth('login');
    } else {
      onNavigate(link.id);
    }
  };

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Analyst';
  const userInitials = userDisplayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F8F0E9]/90 backdrop-blur-md border-b border-rose-dusty/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Concentric Luxury Aperture Emblem */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine to-burgundy flex items-center justify-center shadow-md shadow-wine/20 group-hover:scale-105 transition-transform">
              <div className="w-7 h-7 rounded-full border border-rose-dusty/60 flex items-center justify-center">
                <Eye className="w-4 h-4 text-ivory-100" />
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight text-wine flex items-center gap-1.5 leading-none">
                TruthLens <span className="text-xs uppercase font-sans tracking-widest font-semibold px-1.5 py-0.5 rounded bg-wine/10 text-wine">AI</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1 font-medium">
                See Beyond What Looks Real
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-wine text-white shadow-sm shadow-wine/20'
                      : 'text-charcoal hover:text-wine hover:bg-stone-200/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Engine Status & Auth User State */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setProvidersModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-stone-200/90 text-charcoal text-xs font-medium hover:border-wine/40 hover:bg-white transition shadow-sm"
              title="Inspect AI Detection Providers Status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Activity className="w-3.5 h-3.5 text-wine" />
              <span>Engine Status</span>
            </button>

            {/* Authenticated User Menu or Sign In / Sign Up */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-rose-dusty/50 hover:border-wine transition shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-wine to-burgundy text-white text-[11px] font-bold flex items-center justify-center">
                    {userInitials}
                  </div>
                  <span className="text-xs font-semibold text-charcoal max-w-[120px] truncate">
                    {userDisplayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-subtle" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-rose-dusty/40 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <div className="text-xs font-bold text-charcoal truncate">{userDisplayName}</div>
                      <div className="text-[11px] text-charcoal-subtle truncate">{user.email}</div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('detect');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-charcoal hover:bg-ivory-100 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-3.5 h-3.5 text-wine" />
                        <span>Detection Console</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('history');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-charcoal hover:bg-ivory-100 flex items-center gap-2 font-medium"
                      >
                        <History className="w-3.5 h-3.5 text-wine" />
                        <span>My Scan Archives</span>
                      </button>
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={async () => {
                          await signOut();
                          setProfileDropdownOpen(false);
                          onNavigate('home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-full border border-stone-300 hover:border-wine text-charcoal hover:text-wine text-xs font-semibold uppercase tracking-wider transition"
                >
                  Sign In
                </button>

                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2 rounded-full bg-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-wine-light transition shadow-md shadow-wine/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-charcoal hover:bg-stone-200/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rose-dusty/30 bg-[#F8F0E9] px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  handleLinkClick(link);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide ${
                  currentView === link.id
                    ? 'bg-wine text-white'
                    : 'text-charcoal hover:bg-stone-200/50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-stone-200/60 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 text-xs text-charcoal font-semibold">
                    Signed in as <span className="text-wine">{userDisplayName}</span>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      setMobileMenuOpen(false);
                      onNavigate('home');
                    }}
                    className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl border border-stone-300 text-charcoal text-xs font-semibold text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-wine text-white text-xs font-semibold text-center shadow-md shadow-wine/20"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setProvidersModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-medium text-charcoal mt-2"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Inspect AI Engine Status
                </span>
                <Activity className="w-4 h-4 text-wine" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Provider Status Modal */}
      {providersModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-rose-dusty/40">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-wine">AI Detection Engines & Status</h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Verified live status under TruthLens Zero-Simulated-Score Policy
                </p>
              </div>
              <button
                onClick={() => setProvidersModalOpen(false)}
                className="p-1.5 rounded-xl text-charcoal-subtle hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {providers.map((p, i) => {
                const isOp = p.status === 'operational' || p.status === 'active_api';
                return (
                  <div key={i} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm text-charcoal">{p.name}</span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isOp
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-stone-100 text-stone-600 border-stone-300'
                        }`}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted leading-relaxed">{p.description}</p>
                    <p className="text-[11px] font-mono text-charcoal-subtle mt-1.5">{p.details}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setProvidersModalOpen(false)}
                className="px-5 py-2 rounded-full bg-wine text-white text-xs font-semibold hover:bg-wine-light transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
