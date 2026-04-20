import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  typeof supabaseUrl === 'string' && supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 0;

const createNotConfiguredQuery = () => ({
  select: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
  order: () => createNotConfiguredQuery(),
  eq: () => createNotConfiguredQuery(),
  or: () => createNotConfiguredQuery(),
  update: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
  insert: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
  single: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
});

const notConfiguredSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
    signOut: async () => ({ error: { message: 'Supabase is not configured' } }),
  },
  from: () => createNotConfiguredQuery(),
};

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : notConfiguredSupabase;
