import type { Session, User } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/types/supabase.types';

import { authService } from '../services/authService';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        if (data.session?.user) {
          fetchUserProfile(data.session.user);
        } else {
          setIsLoading(false);
        }
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        if (nextSession?.user) {
          fetchUserProfile(nextSession.user);
        } else {
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(profileUser: User) {
    try {
      const profile = await authService.getUserProfile(profileUser.id);
      if (profile) {
        setUserProfile(profile);
        return;
      }

      setUserProfile(await authService.ensureUserProfile(profileUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching profile');
    } finally {
      setIsLoading(false);
    }
  }

  return useMemo(
    () => ({
      isAuthenticated: Boolean(session?.user),
      isLoading,
      error,
      session,
      user: session?.user ?? null,
      profile: userProfile,
      role: userProfile?.role ?? null,
      signIn: authService.signIn,
      signUp: authService.signUp,
      signOut: authService.signOut,
      signInWithGoogle: authService.signInWithGoogle,
    }),
    [isLoading, error, session, userProfile],
  );
}
