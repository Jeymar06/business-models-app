import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase.types';

export const isSupabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'replace-with-your-anon-key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'replace-with-your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
