import React, { useState } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User as UserIcon, 
  ArrowRight, Shield, Sparkles, CheckCircle2, 
  AlertCircle, ArrowLeft, KeyRound, Cpu, Layers, Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../services/api';

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
  const { signIn, signUp, resetPassword, signInWithGoogle, isSupabaseConfigured, getAccessToken } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

        // Register token
        const token = getAccessToken();
        setAuthToken(token);

        setSuccessMsg('Account created successfully! Redirecting to verification console...');
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both your email address and password.');
        }

        const res = await signIn(email.trim(), password);
        if (res.error) throw res.error;

        const token = getAccessToken();
        setAuthToken(token);

        setSuccessMsg('Authentication verified. Welcome to TruthLens AI.');
        setTimeout(() => {
          onSuccess();
        }, 600);
      } else if (mode === 'forgot-password') {
        if (!email.trim()) {
          throw new Error('Please enter your email address to receive a recovery link.');
        }

        const res = await resetPassword(email.trim());
        if (res.error) throw res.error;

        setSuccessMsg(
          'Password recovery instructions dispatched. Please check your inbox for the verification link.'
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
    setLoading(true);

    try {
      const res = await signInWithGoogle();
      if (res.error) throw res.error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Google OAuth failed to initialize.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-dusty/40 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Elegant Cream / Ivory Form Panel (58% width)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 bg-[#FCFAF8] p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Top Bar: Back button & brand emblem */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-wine font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-wine flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-ivory-100" />
                </div>
                <span className="font-serif font-bold text-wine text-sm">TruthLens AI</span>
              </div>
            </div>

            {/* Header Titles */}
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-widest font-bold text-wine block mb-1">
                {mode === 'signup'
                  ? 'Accession Protocol'
                  : mode === 'forgot-password'
                  ? 'Key Recovery'
                  : 'Forensic Authorization'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                {mode === 'signup'
                  ? 'Create Your Account'
                  : mode === 'forgot-password'
                  ? 'Reset Your Password'
                  : 'Sign In to TruthLens'}
              </h1>
              <p className="text-xs text-charcoal-muted mt-2 font-normal leading-relaxed">
                {mode === 'signup'
                  ? 'Join journalists, legal scholars, and forensic analysts discovering media authenticity.'
                  : mode === 'forgot-password'
                  ? 'Provide your registered email address to receive secure cryptographic credentials.'
                  : 'Enter your credentials to access your isolated forensic records and detection suites.'}
              </p>
            </div>

            {/* Notifications / Alerts */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-wine/10 border border-wine/25 text-wine text-xs flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{errorMsg}</div>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/10 border border-emerald-600/30 text-emerald-800 text-xs flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                <div>{successMsg}</div>
              </div>
            )}

            {/* Supabase Status Banner (Informative helper when offline) */}
            {!isSupabaseConfigured && (
              <div className="mb-6 p-3.5 rounded-2xl bg-ivory-200 border border-rose-dusty/40 text-[11px] text-charcoal-muted leading-relaxed">
                <span className="font-semibold text-wine">Developer Sandbox Mode: </span>
                Supabase credentials not yet configured in <code className="text-[10px] bg-white px-1 py-0.5 rounded">.env</code>. Local authenticated developer sessions are active with full user-level scan isolation.
              </div>
            )}

            {/* Main Form */}
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
                      placeholder="Eleanor Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-1 focus:ring-wine outline-none text-xs text-charcoal bg-white transition shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-1 focus:ring-wine outline-none text-xs text-charcoal bg-white transition shadow-sm"
                  />
                </div>
              </div>

              {/* Password */}
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
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-1 focus:ring-wine outline-none text-xs text-charcoal bg-white transition shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-subtle hover:text-wine"
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
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-wine focus:ring-1 focus:ring-wine outline-none text-xs text-charcoal bg-white transition shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Checkboxes: Remember Me (Login) or Agree Terms (Sign Up) */}
              {mode === 'login' && (
                <div className="flex items-center pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-wine rounded border-stone-300 cursor-pointer"
                  />
                  <label htmlFor="remember" className="ml-2 text-xs text-charcoal-muted cursor-pointer">
                    Remember credentials on this workstation
                  </label>
                </div>
              )}

              {mode === 'signup' && (
                <div className="flex items-start pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-wine rounded border-stone-300 cursor-pointer mt-0.5 shrink-0"
                  />
                  <label htmlFor="terms" className="ml-2 text-[11px] text-charcoal-muted leading-tight cursor-pointer">
                    I agree to the <span className="text-wine underline">Terms of Service</span> and acknowledge that AI detection produces probabilistic estimations under zero data retention guarantees.
                  </label>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4A1028] to-[#681B28] text-white text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-md shadow-wine/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>
                        {mode === 'signup'
                          ? 'Create Account'
                          : mode === 'forgot-password'
                          ? 'Send Reset Link'
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
              <div className="mt-6">
                <div className="relative flex items-center justify-center mb-4">
                  <div className="border-t border-stone-200 w-full" />
                  <span className="bg-[#FCFAF8] px-3 text-[10px] uppercase font-mono tracking-wider text-charcoal-subtle">
                    or authenticate with
                  </span>
                  <div className="border-t border-stone-200 w-full" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-white border border-stone-300 text-charcoal text-xs font-semibold hover:bg-stone-50 transition flex items-center justify-center gap-2.5 shadow-sm"
                >
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
                  <span>Continue with Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Mode Switching Footer */}
          <div className="pt-8 border-t border-stone-200/80 text-center text-xs text-charcoal-muted">
            {mode === 'login' ? (
              <p>
                Don't have an analyst account yet?{' '}
                <button
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
            ) : mode === 'signup' ? (
              <p>
                Already have an authorized account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-semibold text-wine hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Remembered your password?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-semibold text-wine hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Premium Wine AI-Forensics Visual Panel (42%)    */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#4A1028] via-[#681B28] to-[#380B1E] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative concentric lens background ring */}
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-rose-dusty/15 pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full border border-rose-dusty/20 pointer-events-none" />
          <div className="absolute right-12 top-12 w-24 h-24 rounded-full bg-rose-dusty/10 blur-xl pointer-events-none" />

          {/* Top Tag & Security Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[10px] font-mono uppercase tracking-wider text-rose-dusty mb-8">
              <Sparkles className="w-3 h-3 text-rose-dusty" />
              <span>Multi-Modal Forensics Suite</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100 leading-snug">
              See Beyond What <br />
              <span className="italic font-normal text-rose-dusty">Looks Real.</span>
            </h2>

            <p className="text-xs text-ivory-200/80 leading-relaxed font-normal mt-3">
              Uncompromising mathematical verification across images, audio, video, and text.
            </p>
          </div>

          {/* Forensic Feature Pills */}
          <div className="space-y-3 relative z-10 my-8">
            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-rose-dusty">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-serif font-bold text-white">2D Fourier Lattice Analysis</div>
                <div className="text-[10px] text-ivory-200/70">Isolates diffusion generative upscaler grids</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-rose-dusty">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-serif font-bold text-white">Acoustic Vocoder Auditing</div>
                <div className="text-[10px] text-ivory-200/70">ZCR jitter & 8kHz high-frequency rolloff</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-rose-dusty">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-serif font-bold text-white">Syntactic Cadence & Entropy</div>
                <div className="text-[10px] text-ivory-200/70">Probabilistic token predictability modeling</div>
              </div>
            </div>
          </div>

          {/* Bottom Security Seals */}
          <div className="pt-4 border-t border-rose-dusty/20 relative z-10 flex items-center justify-between text-[10px] font-mono text-rose-dusty">
            <span>RLS ISOLATION ACTIVE</span>
            <span>ZERO DATA RETENTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
