import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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

  // Initialize and listen to auth changes
  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Get initial session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // 2. Subscribe to auth events
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
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
