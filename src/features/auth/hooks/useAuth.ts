import type { Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

import { authService } from '../authService';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return useMemo(
    () => ({
      isAuthenticated: Boolean(session?.user),
      isLoading,
      session,
      signIn: authService.signIn,
      signOut: authService.signOut,
      signUp: authService.signUp,
      user: session?.user ?? null,
    }),
    [isLoading, session],
  );
}
