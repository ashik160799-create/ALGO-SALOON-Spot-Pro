import { SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL: string;
export const SUPABASE_ANON_KEY: string;
export const SUPABASE_PUBLISHABLE_KEY: string;
export const supabase: SupabaseClient;

export interface SignInWithGoogleOptions {
  redirectTo?: string;
  queryParams?: Record<string, string>;
  scopes?: string;
  [key: string]: any;
}

export function signInWithGoogle(options?: SignInWithGoogleOptions): Promise<{ data: any; error: any }>;

export default supabase;
