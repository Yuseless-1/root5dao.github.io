import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
// This bypasses RLS and should only be used in API routes
let supabaseClientInstance: ReturnType<typeof createClient> | null = null;

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are not set');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
    throw new Error('Supabase environment variables are not set. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file.');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Lazy initialization to avoid errors at module load time
export function getSupabaseServer() {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createServerClient();
  }
  return supabaseClientInstance;
}

// Export for backward compatibility
export const supabaseServer = {
  from: (table: string) => getSupabaseServer().from(table),
  auth: {
    getUser: (token?: string) => getSupabaseServer().auth.getUser(token),
    getSession: () => getSupabaseServer().auth.getSession(),
  },
};

