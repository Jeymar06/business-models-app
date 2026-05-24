import { Mail, ShieldCheck, Trash2, UserCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Button, ConfirmDialog, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/authService';

function getInitial(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : null;
}

export function ProfilePage() {
  const toast = useToast();
  const { profile, role, user } = useAuth();
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const displayName = profile?.full_name?.trim() || user?.email || 'Usuario';
  const displayEmail = profile?.email || user?.email || 'Sin correo disponible';
  const avatarInitial = getInitial(profile?.full_name) ?? getInitial(displayEmail) ?? 'U';

  async function performDeleteAccount() {
    try {
      await authService.deleteUserAccount();
      window.location.assign('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible eliminar la cuenta.', 'Error');
    } finally {
      setConfirmDeleteAccount(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-steel">Cuenta</p>
          <h1 className="text-3xl font-bold text-ink">Mi perfil</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Resumen basico de la cuenta autenticada en Barber Flow.</p>
        </div>

        <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-panel lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-ink text-2xl font-semibold text-white">
            {avatarInitial}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-ink">{displayName}</h2>
              <p className="text-sm text-slate-500">Gestiona tu informacion de cuenta y revisa tus datos de acceso.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <InfoCard icon={<Mail size={18} />} label="Correo" value={displayEmail} />
              <InfoCard icon={<ShieldCheck size={18} />} label="Rol" value={role ?? 'Sin rol'} />
              <InfoCard icon={<UserCircle2 size={18} />} label="Nombre" value={profile?.full_name?.trim() || 'Sin nombre configurado'} />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-danger/22 bg-danger/6 p-7">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-danger">Eliminar cuenta</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-danger/85">
            Esta accion elimina tu usuario de Barber Flow y los datos asociados a tu cuenta. Luego podras registrarte de nuevo, pero no recuperar lo eliminado.
          </p>
          <Button
            className="mt-5 !bg-danger !text-paper !ring-danger/20 hover:!bg-[#c8383d]"
            onClick={() => setConfirmDeleteAccount(true)}
            size="md"
          >
            <Trash2 size={16} />
            Eliminar mi cuenta
          </Button>
        </section>
      </div>

      <ConfirmDialog
        confirmLabel="Si, eliminar mi cuenta"
        description="Vas a eliminar definitivamente tu usuario y los datos asociados a tu cuenta."
        eyebrow="Zona critica"
        onClose={() => setConfirmDeleteAccount(false)}
        onConfirm={performDeleteAccount}
        open={confirmDeleteAccount}
        title="Eliminar tu cuenta"
        warning="Perderas acceso permanente a Barber Flow. Si administras una barberia, tambien perderas acceso a su panel y a la operacion asociada."
      />
    </>
  );
}

function InfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-steel">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm font-semibold text-ink">{value}</p>
    </article>
  );
}
