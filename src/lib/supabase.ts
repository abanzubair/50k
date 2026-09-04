import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_STOREFRONT_SUPABASE_URL || 'https://agsldsqeynzydujmijgc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_STOREFRONT_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnc2xkc3FleW56eWR1am1pamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NDQxOTAsImV4cCI6MjEwNDAyMDE5MH0.PHFlhCQyRyBCxy1nFR2GdYgwcraiQZu8wSho29qkpEA';

// Clean up any legacy or cross-domain auth tokens
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-kvnwribvwaqgpvpmvqwr-') || (key.startsWith('sb-') && key.endsWith('-auth-token') && !key.includes('tavishi_storefront_auth_v1')))) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.warn('[Supabase] Auth cleanup skipped:', e);
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storageKey: 'tavishi_storefront_auth_v1',
    persistSession: true,
    autoRefreshToken: true,
  },
});
