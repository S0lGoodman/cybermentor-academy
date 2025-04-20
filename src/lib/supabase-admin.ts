import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite applications
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Log environment variables for debugging (don't include this in production)
console.log('Supabase Admin Environment:', {
  hasUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceRoleKey,
  urlPrefix: supabaseUrl?.substring(0, 10),
  keyPrefix: supabaseServiceRoleKey?.substring(0, 5)
});

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});