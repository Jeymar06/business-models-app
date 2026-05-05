import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '@/features/auth/services/authService';
import { supabase } from '@/lib/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const providerError = params.get('error_description') ?? params.get('error');

    if (providerError) {
      setError(providerError);
      return;
    }

    async function finishLogin() {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (!data.session?.user) {
        setError('No se pudo completar el inicio de sesion con Google.');
        return;
      }

      const profile = await authService.ensureUserProfile(data.session.user);
      const role = profile?.role ?? 'client';
      const nextPath =
        role === 'admin' ? '/admin-dashboard' : role === 'superadmin' ? '/superadmin-dashboard' : '/client-dashboard';

      navigate(nextPath, { replace: true });
    }

    void finishLogin();
  }, [navigate]);

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-panel">
      <h1 className="text-2xl font-bold text-ink">{error ? 'No se pudo iniciar con Google' : 'Conectando con Google'}</h1>
      <p className="mt-3 text-sm text-slate-600">
        {error
          ? `${error}. Revisa que Google este habilitado en Supabase Auth y que la URL de callback este autorizada.`
          : 'Estamos terminando tu inicio de sesion.'}
      </p>
    </div>
  );
}
