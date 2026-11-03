import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  isSupabaseConfigured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: Error | AuthError | null }>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize and listen to auth changes, including OAuth redirects
  useEffect(() => {
    if (isSupabaseConfigured) {
      // 0. Extract potential OAuth error parameters from query string or URL hash
      const searchParams = new URLSearchParams(window.location.search);
      const rawHash = window.location.hash.startsWith('#')
        ? window.location.hash.substring(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(rawHash);

      const errorParam = searchParams.get('error') || hashParams.get('error');
      const errorDesc =
        searchParams.get('error_description') || hashParams.get('error_description');

      if (errorParam || errorDesc) {
        const readableMsg = (errorDesc || errorParam || 'Authentication failed').replace(/\+/g, ' ');
        setAuthError(readableMsg);
        // Clean up error query/hash from the browser URL bar
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Check for PKCE auth code in URL
      const code = searchParams.get('code');

      if (code) {
        setLoading(true);
        supabase.auth
          .exchangeCodeForSession(code)
          .then(({ data, error }) => {
            if (error) {
              console.warn('OAuth code exchange warning:', error.message);
            } else if (data?.session) {
              setSession(data.session);
              setUser(data.user);
            }
          })
          .catch((err) => {
            console.error('OAuth code exchange error:', err);
          })
          .finally(() => {
            // Remove code & state query params from address bar
            window.history.replaceState({}, document.title, window.location.pathname);
            // Verify final active session
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                setSession(session);
                setUser(session.user);
              }
              setLoading(false);
            });
          });
      } else {
        // 1. Get initial session from Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });
      }

      // 2. Subscribe to auth events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, activeSession) => {
        setSession(activeSession);
        setUser(activeSession?.user ?? null);
        setLoading(false);

        // On successful sign-in, strip any lingering OAuth hash or search fragments
        if (event === 'SIGNED_IN') {
          if (
            window.location.search.includes('code=') ||
            window.location.hash.includes('access_token=')
          ) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline / local development session fallback
      try {
        const localSession = localStorage.getItem('truthlens_dev_session');
        if (localSession) {
          const parsed = JSON.parse(localSession);
          setUser(parsed.user);
          setSession(parsed.session);
        }
      } catch (e) {
        console.warn('Could not read dev session:', e);
      }
      setLoading(false);
    }
  }, []);

  const getAccessToken = (): string | null => {
    if (session?.access_token) {
      return session.access_token;
    }
    // Fallback for dev session
    if (!isSupabaseConfigured && user) {
      return `dev-session-${user.id}:${user.email}:${user.user_metadata?.full_name || 'Analyst'}`;
    }
    return null;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) return { error };
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }
      return { error: null };
    } else {
      // Local development registration
      const newId = 'user_' + Math.random().toString(36).substring(2, 11);
      const newUser = {
        id: newId,
        email,
        app_metadata: {},
        user_metadata: { full_name: fullName },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const newSession = {
        access_token: `dev-session-${newId}:${email}:${fullName}`,
        refresh_token: 'dev-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: newUser,
      } as unknown as Session;

      localStorage.setItem('truthlens_dev_session', JSON.stringify({ user: newUser, session: newSession }));
      setUser(newUser);
      setSession(newSession);
      return { error: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error };
      setSession(data.session);
      setUser(data.user);
      return { error: null };
    } else {
      // Local dev sign in
      const newId = 'user_' + Math.random().toString(36).substring(2, 11);
      const mockUser = {
        id: newId,
        email,
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockSession = {
        access_token: `dev-session-${newId}:${email}:${email.split('@')[0]}`,
        refresh_token: 'dev-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      } as unknown as Session;

      localStorage.setItem('truthlens_dev_session', JSON.stringify({ user: mockUser, session: mockSession }));
      setUser(mockUser);
      setSession(mockSession);
      return { error: null };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('truthlens_dev_session');
    }
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      });
      return { error };
    } else {
      return { error: null };
    }
  };

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured) {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      return { error };
    } else {
      // Explain that Supabase OAuth must be configured
      return {
        error: new Error(
          'Google OAuth requires configured Supabase credentials. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.'
        ),
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authError,
        setAuthError,
        isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        resetPassword,
        signInWithGoogle,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

