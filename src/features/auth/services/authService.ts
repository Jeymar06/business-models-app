import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/types/supabase.types';
import { uploadPublicImage } from '@/utils/imageUpload';
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
      await authService.ensureUserProfile(data.user);
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

  async updatePassword(password: string) {
    ensureSupabase();
    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw error;
    }

    return data;
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
    const { data, error } = await (supabase as any)
      .rpc('ensure_profile_for_current_user')
      .single();

    if (error) {
      console.error('Error ensuring profile:', error);
      return null;
    }

    return data as Profile;
  },

  async updateUserProfile(input: { userId: string; fullName?: string | null; avatarUrl?: string | null }) {
    ensureSupabase();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: input.fullName ?? null,
        avatar_url: input.avatarUrl ?? null,
      } as never)
      .eq('id', input.userId)
      .select()
      .single();

    if (error) throw error;

    await supabase.auth.updateUser({
      data: {
        full_name: input.fullName ?? null,
        avatar_url: input.avatarUrl ?? null,
      },
    }).catch(() => undefined);

    window.dispatchEvent(new CustomEvent('barber-flow-profile-updated'));
    return data as Profile;
  },

  async uploadAvatar(file: File, userId: string) {
    ensureSupabase();
    return uploadPublicImage({
      bucket: 'barberias',
      file,
      folder: `profiles/${userId}/avatars`,
      maxWidth: 800,
    });
  },

  async deleteUserAccount() {
    ensureSupabase();
    const { error } = await (supabase as any).rpc('delete_current_user');
    if (error) throw error;

    await supabase.auth.signOut().catch(() => undefined);
  },
};
