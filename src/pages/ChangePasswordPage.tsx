import { KeyRound, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">Cuenta</p>
        <h1 className="text-3xl font-bold text-ink">Cambiar contraseña</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Este espacio ya queda enlazado desde el menu de perfil mientras se completa el flujo definitivo de actualizacion de credenciales.</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-steel">
            <KeyRound size={22} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">Ruta preparada</h2>
            <p className="text-sm leading-6 text-slate-600">Por ahora dejamos una pagina minima y estable para no romper la navegacion. El siguiente paso natural es agregar formulario, validacion y actualizacion de contraseña contra Supabase Auth.</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck size={14} />
              Acceso protegido para usuarios autenticados
            </div>
            <div>
              <Link to="/support">
                <Button size="sm" variant="secondary">Ir a ayuda y soporte</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
