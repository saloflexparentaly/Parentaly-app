import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// Singleton promise — one anonymous session per page load
let _sessionPromise = null;

export async function getOrCreateSession() {
  if (_sessionPromise) return _sessionPromise;
  _sessionPromise = supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session) return session;
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.session;
  }).catch(err => {
    _sessionPromise = null; // reset so next call retries
    throw err;
  });
  return _sessionPromise;
}
