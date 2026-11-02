import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.includes('supabase.co')
);

// Fallback dummy URL so createClient does not throw on module evaluation if keys are pending
const validUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
