import { createClient } from '@supabase/supabase-js';

// ============================================================================
// ALGO Saloon Spot - Supabase Client Configuration
// Connected to Project ID: skexbhjxltryypbyrqzy
// ============================================================================

// 1. Supabase Project URL
export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  'https://skexbhjxltryypbyrqzy.supabase.co';

// 2. Supabase Anon / API Key (JWT)
export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZXhiaGp4bHRyeXlwYnlycXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Mjg4MTIsImV4cCI6MjEwMzMwNDgxMn0.Y23bbmJZddDV-Y_knQQyge2zj_xoWDTl2ORh9_eL43g';

// 3. Supabase Publishable Key
export const SUPABASE_PUBLISHABLE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  'sb_publishable_40tHhyV-s3gzV4b1ORS3LA_rGYqVRer';

// Initialize the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Google OAuth Login Helper using Supabase OAuth
export const signInWithGoogle = async (options = {}) => {
  const redirectTo = options.redirectTo || window.location.origin;
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      ...options
    }
  });
};

export default supabase;

