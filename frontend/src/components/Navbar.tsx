import React, { useState, useEffect } from 'react';
import { Eye, Shield, Activity, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchProviders } from '../services/api';
import { ProviderStatus } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [providersModalOpen, setProvidersModalOpen] = useState(false);
  const [providers, setProviders] = useState<ProviderStatus[]>([]);

  useEffect(() => {
    fetchProviders()
      .then(setProviders)
      .catch(() => {});
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'detect', label: 'Detect' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'history', label: 'History' },
  ];

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
                  onClick={() => onNavigate(link.id)}
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

          {/* Right Action: Provider Health Pill & Quick CTA */}
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

            <button
              onClick={() => onNavigate('detect')}
              className="px-5 py-2 rounded-full bg-wine text-white text-xs font-semibold uppercase tracking-wider hover:bg-wine-light transition shadow-md shadow-wine/20"
            >
              Launch Scanner
            </button>
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
                  onNavigate(link.id);
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
            <div className="pt-2">
              <button
                onClick={() => {
                  setProvidersModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-medium text-charcoal"
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

