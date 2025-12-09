import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client with proper error handling for build time
// During build, if env vars are missing, we need to provide valid placeholder values
// that won't cause Supabase to throw validation errors
function createSupabaseClient(): SupabaseClient {
  // If env vars are missing, use a valid format that Supabase will accept
  // The URL format must be a valid URL, and the key must be a valid JWT format
  const url = supabaseUrl || 'https://xxxxxxxxxxxxxx.supabase.co';
  const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTE5MjAwMCwiZXhwIjoyOTYwNzY4MDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  
  try {
    return createClient(url, key);
  } catch (error) {
    // If createClient still throws, return a minimal client
    // This should rarely happen, but provides a safety net
    console.error('Failed to create Supabase client:', error);
    return createClient(
      'https://xxxxxxxxxxxxxx.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTE5MjAwMCwiZXhwIjoyOTYwNzY4MDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    );
  }
}

const supabaseInstance = createSupabaseClient();

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    // Only warn in browser, not during build
    console.warn('Supabase environment variables are not set. Some features may not work.');
  }
}

export const supabase = supabaseInstance;


