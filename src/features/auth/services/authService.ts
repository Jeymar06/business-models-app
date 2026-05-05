import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/types/supabase.types';
import type { User } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  fullName: string;
}

function ensureSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado correctamente');
  }
}

export const authService = {
  async signIn(credentials: AuthCredentials) {
    ensureSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async signUp(credentials: SignUpCredentials) {
    ensureSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: credentials.email,
          full_name: credentials.fullName,
          role: 'client',
        } as never);

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
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

  async signInWithGoogle() {
    ensureSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async getCurrentUser() {
    ensureSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async getUserProfile(userId: string): Promise<Profile | null> {
    ensureSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile;
  },

  async ensureUserProfile(user: User): Promise<Profile | null> {
    ensureSupabase();

    const fullName =
      typeof user.user_metadata.full_name === 'string'
        ? user.user_metadata.full_name
        : typeof user.user_metadata.name === 'string'
          ? user.user_metadata.name
          : null;

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email ?? `${user.id}@oauth.local`,
        full_name: fullName,
        role: 'client',
      } as never)
      .select()
      .single();

    if (error) {
      console.error('Error ensuring profile:', error);
      return null;
    }

    return data as Profile;
  },
};
