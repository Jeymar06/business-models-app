import { isSupabaseConfigured, supabase } from '@/lib/supabase';

function ensureSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar auth.');
  }
}

export const authService = {
  async signIn(email: string, password: string) {
    ensureSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    return data;
  },

  async signUp(email: string, password: string) {
    ensureSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    return data;
  },

  async signOut() {
    ensureSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },
};
