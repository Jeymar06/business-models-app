import { CheckCircle2, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ChangePasswordPage() {
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccess('Tu contraseña fue actualizada correctamente.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible actualizar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">Cuenta</p>
        <h1 className="text-3xl font-bold text-ink">Cambiar contraseña</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Actualiza tu clave de acceso sin salir del flujo autenticado de Barber App.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-steel">
            <KeyRound size={22} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">Nueva contraseña</h2>
            <p className="text-sm leading-6 text-slate-600">
              Usa una contraseña de al menos 6 caracteres. El cambio se aplica sobre tu sesion actual en Supabase Auth.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck size={14} />
              Ruta protegida para usuarios autenticados
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-ink" htmlFor="newPassword">
              Nueva contraseña
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <button
                aria-label={showNewPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowNewPassword((current) => !current)}
                type="button"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink" htmlFor="confirmPassword">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button
                aria-label={showConfirmPassword ? 'Ocultar confirmacion de contraseña' : 'Mostrar confirmacion de contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirmPassword((current) => !current)}
                type="button"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
          {success ? (
            <div className="flex items-start gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
              <span>{success}</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button className="sm:min-w-44" disabled={isLoading} type="submit">
              {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
            <Link to="/profile">
              <Button size="md" variant="secondary" type="button">
                Volver a mi perfil
              </Button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
