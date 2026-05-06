import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { adminService, type BarberiaInput } from '@/features/admin/adminService';
import { BarberiaForm } from '@/features/admin/barberia/components/BarberiaForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function CreateBarberiaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(values: BarberiaInput) {
    if (!user) return;
    setError(null);
    setIsSaving(true);

    try {
      await adminService.createMyBarberia(user.id, values);
      window.location.assign('/admin-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la barberia.');
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">SaaS para barberias</p>
        <h1 className="text-3xl font-bold text-ink">Crear mi barberia</h1>
        <p className="mt-2 text-slate-600">
          Al crearla quedaras como administrador de esa barberia y podras gestionar barberos, servicios y horarios.
        </p>
      </div>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <BarberiaForm isSaving={isSaving} onSubmit={handleSubmit} />
      </section>
    </div>
  );
}
