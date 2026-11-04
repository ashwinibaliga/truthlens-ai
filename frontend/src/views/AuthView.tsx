import React, { useState } from 'react';
import {
  Eye, EyeOff, Lock, Mail, User as UserIcon,
  ArrowRight, Shield, CheckCircle2,
  AlertCircle, KeyRound, Cpu, Layers, Sliders,
  HelpCircle, Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../services/api';
import { GlassFingerprint3D } from '../components/GlassFingerprint3D';

interface AuthViewProps {
  initialMode?: 'login' | 'signup' | 'forgot-password';
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onSuccess,
  onNavigateHome,
}) => {
  const {
    user,
    signIn,
    signUp,
    resetPassword,
    signInWithGoogle,
    isSupabaseConfigured,
    getAccessToken,
    authError,
    setAuthError
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If user is already authenticated on mount, navigate immediately
  React.useEffect(() => {
    if (user) {
      onSuccess();
    }
  }, []);
  // Synchronize any OAuth callback errors from AuthContext
  React.useEffect(() => {
    if (authError) {
      setErrorMsg(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (!agreeTerms) {
          throw new Error('Please accept the Terms of Service to create an account.');
        }

        const res = await signUp(email.trim(), password, fullName.trim());

        if (res.error) throw res.error;

        // Switch to the login tab after successful registration
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setAgreeTerms(false);
        setErrorMsg(null);

        if (res.needsEmailConfirmation) {
          setSuccessMsg('Account created! Please check your email to confirm your account before logging in.');
        } else {
          setSuccessMsg('Account created successfully! Please log in with your email and password.');
        }
      } else if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both your email address and password.');
        }

        const res = await signIn(email.trim(), password);
        if (res.error) throw res.error;

        const token = getAccessToken();
        setAuthToken(token);

        setSuccessMsg('Authorization confirmed. Accessing forensic archives...');
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else if (mode === 'forgot-password') {
        if (!email.trim()) {
          throw new Error('Please enter your email address to receive a recovery link.');
        }

        const res = await resetPassword(email.trim());
        if (res.error) throw res.error;

        setSuccessMsg(
          'Recovery dispatched. If an account is registered with this address, you will receive reset instructions shortly.'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setAuthError(null);
    setGoogleLoading(true);

    try {
      const res = await signInWithGoogle();
      if (res.error) throw res.error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Google OAuth failed to initialize.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F0E9] flex flex-col justify-between selection:bg-[#681B28] selection:text-[#F8F0E9]">
      {/* Top Editorial Micro-Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-wine to-burgundy flex items-center justify-center shadow-md shadow-wine/20 group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 rounded-full border border-rose-dusty/60 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-ivory-100" />
            </div>
          </div>
          <div>
            <div className="font-serif text-xl font-bold tracking-tight text-wine flex items-center gap-1.5 leading-none">
              TruthLens <span className="text-[10px] uppercase font-sans tracking-widest font-semibold px-1.5 py-0.5 rounded bg-wine/10 text-wine">AI</span>
            </div>
            <p className="text-[9px] uppercase tracking-wider text-charcoal-muted mt-0.5 font-medium">
              Forensic Media Authentication
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-wine font-medium transition px-3.5 py-1.5 rounded-full border border-stone-300/80 bg-white/70 backdrop-blur-sm shadow-sm"
        >
          <Compass className="w-3.5 h-3.5 text-wine" />
          <span>Explore Public Dossiers</span>
        </button>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-rose-dusty/40 grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">

          {/* ============================================================ */}
          {/* LEFT PANEL: Elegant Ivory/Cream Minimalist Form (52% width)  */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 bg-[#FCFAF8] p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative z-10">
            <div>
              {/* Tab Switcher: Sign In vs Create Account */}
              {mode !== 'forgot-password' && (
                <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200/80 mb-8 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${mode === 'login'
                      ? 'bg-wine text-white shadow-md shadow-wine/25'
                      : 'text-charcoal-muted hover:text-wine'
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${mode === 'signup'
                      ? 'bg-wine text-white shadow-md shadow-wine/25'
                      : 'text-charcoal-muted hover:text-wine'
                      }`}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Title & Editorial Description */}
              <div className="mb-7">
                <span className="text-[10px] uppercase tracking-widest font-bold text-wine block mb-1">
                  {mode === 'signup'
                    ? 'Get Started'
                    : mode === 'forgot-password'
                      ? 'Key Recovery'
                      : 'Welcome'}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
                  {mode === 'signup'
                    ? 'New here? How suspicious.'
                    : mode === 'forgot-password'
                      ? 'Recover Access Key'
                      : 'Welcome to TruthLens'}
                </h1>
                <p className="text-xs text-charcoal-muted mt-2 font-normal leading-relaxed max-w-md">
                  {mode === 'signup' ? (
                    <>
                      <span className="block mb-3">
                        AI is getting better at pretending. Good thing we're nosy.
                      </span>
                      <span className="block">
                        Create your account and start checking what's real and what's not.
                      </span>
                    </>
                  ) : mode === 'forgot-password' ? (
                    'Enter your registered email to receive a secure cryptographic recovery dispatch.'
                  ) : (
                    <>
                      <span className="block mb-3">
                        Because apparently, even reality needs a fact-check.
                      </span>
                      <span className="block">
                        Sign in to check whether text, images, audio, or videos were created by AI or humans.
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Alerts & Notifications */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-wine/10 border border-wine/25 text-wine text-xs flex items-start gap-2.5 leading-relaxed animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-950/10 border border-emerald-600/30 text-emerald-800 text-xs flex items-start gap-2.5 leading-relaxed animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                  <div>{successMsg}</div>
                </div>
              )}

              {!isSupabaseConfigured && (
                <div className="mb-6 p-3.5 rounded-2xl bg-ivory-200 border border-rose-dusty/40 text-[11px] text-charcoal-muted leading-relaxed">
                  <span className="font-semibold text-wine">Developer Sandbox Active: </span>
                  Supabase keys not yet provided in <code className="text-[10px] bg-white px-1 py-0.5 rounded font-mono">.env</code>. Local authenticated sessions run offline with complete scan isolation.
                </div>
              )}

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Dr. Julian Ross"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-2 focus:ring-wine/20 outline-none text-xs text-charcoal bg-white transition shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="analyst@truthlens.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-2 focus:ring-wine/20 outline-none text-xs text-charcoal bg-white transition shadow-sm"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                {mode !== 'forgot-password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-charcoal">
                        Password
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot-password');
                            setErrorMsg(null);
                            setSuccessMsg(null);
                          }}
                          className="text-[11px] text-wine hover:underline font-medium"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-2 focus:ring-wine/20 outline-none text-xs text-charcoal bg-white transition shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-subtle hover:text-wine transition"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-2 focus:ring-wine/20 outline-none text-xs text-charcoal bg-white transition shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me / Terms Checkboxes */}
                {mode === 'login' && (
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      id="remember3d"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-wine rounded border-stone-300 cursor-pointer"
                    />
                    <label htmlFor="remember3d" className="ml-2 text-xs text-charcoal-muted cursor-pointer font-normal">
                      Maintain secure workstation authorization
                    </label>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      id="terms3d"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 accent-wine rounded border-stone-300 cursor-pointer mt-0.5 shrink-0"
                    />
                    <label htmlFor="terms3d" className="ml-2 text-[11px] text-charcoal-muted leading-relaxed cursor-pointer font-normal">
                      I agree to the <span className="text-wine underline font-medium">Terms of Use</span> and acknowledge that media analysis generates scientific probability estimates.
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4A1028] via-[#681B28] to-[#4A1028] text-white text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-wine/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        <span>Verifying Authorization...</span>
                      </span>
                    ) : (
                      <>
                        <span>
                          {mode === 'signup'
                            ? 'Create Account'
                            : mode === 'forgot-password'
                              ? 'Dispatch Recovery Token'
                              : 'Sign In'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Google OAuth Option */}
              {mode !== 'forgot-password' && (
                <div className="mt-5">
                  <div className="relative flex items-center justify-center mb-3.5">
                    <div className="border-t border-stone-200 w-full" />
                    <span className="bg-[#FCFAF8] px-3 text-[10px] uppercase font-mono tracking-wider text-charcoal-subtle">
                      or continue with
                    </span>
                    <div className="border-t border-stone-200 w-full" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                    className="w-full py-2.5 rounded-xl bg-white border border-stone-300 text-charcoal text-xs font-semibold hover:bg-stone-50 transition flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    {googleLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-wine/40 border-t-wine animate-spin" />
                        <span>Redirecting to Google...</span>
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Google Secure Identity</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Form Footer */}
            <div className="pt-6 border-t border-stone-200/80 text-center text-xs text-charcoal-muted">
              {mode === 'forgot-password' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-semibold text-wine hover:underline"
                >
                  Return to Sign In
                </button>
              ) : mode === 'login' ? (
                <p>
                  New to TruthLens?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-semibold text-wine hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already authorized?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-semibold text-wine hover:underline"
                  >
                    Sign in to existing vault
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT PANEL: Immersive Real 3D Glass Fingerprint Sculpture   */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#380B1E] via-[#4A1028] to-[#681B28] text-white relative min-h-[500px] lg:min-h-full flex flex-col justify-end overflow-hidden">

            {/* Embedded Interactive 3D Three.js Canvas */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
              <GlassFingerprint3D />
            </div>

            {/* Bottom Glassmorphic Overlay Card */}
            <div className="p-8 sm:p-10 relative z-20">
              <div className="p-6 rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-serif text-lg font-bold text-ivory-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-dusty animate-pulse" />
                    TruthLens AI Forensic Verification
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-rose-dusty border border-white/15 uppercase">
                    AI vs HUMAN DETECTION
                  </span>
                </div>

                <p className="text-xs text-ivory-200/80 leading-relaxed font-normal">
                  TruthLens analyzes digital content to identify whether it is AI-generated or human-created. Detect AI-generated content across text, images, audio, and video with intelligent forensic verification.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-rose-dusty/90">
                  <span>TEXT • IMAGE • AUDIO • VIDEO</span>
                  <span>AI FORENSIC ANALYSIS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Editorial Sub-Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-charcoal-subtle z-20">
        TruthLens AI Forensic Verification • Zero Media Retention • ISO/IEC Compliant Cryptographic Isolation
      </footer>
    </div>
  );
};
