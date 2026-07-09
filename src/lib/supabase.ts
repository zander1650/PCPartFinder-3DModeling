import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Returns a Supabase client, or null when the env vars aren't configured —
 * the app then falls back to the bundled sample catalog so it works out of
 * the box without any setup.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (!client) client = createClient(url, anonKey);
  return client;
}
