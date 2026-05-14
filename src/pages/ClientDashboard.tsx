import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button, ConfirmDialog, Pill, useToast } from '@/components/ui';
import { bookingService } from '@/features/booking/bookingService';
import { useCitas } from '@/features/booking/hooks/useCitas';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { CitaConDetalles } from '@/types/supabase.types';

export function ClientDashboard() {
  const toast = useToast();
  const { role, user } = useAuth();
  const { cancelarCita, historialCitas, isCancelling, isLoading, proximasCitas } = useCitas(user?.id);
  const barberiasQuery = useQuery({
    queryKey: ['marketplace', 'barberias'],
    queryFn: bookingService.getBarberias,
  });
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<CitaConDetalles | null>(null);

  async function performDeleteAccount() {
    try {
      const { authService } = await import('@/features/auth/services/authService');
      await authService.deleteUserAccount();
      window.location.assign('/');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No fue posible eliminar la cuenta.',
        'Error',
      );
    } finally {
      setConfirmDeleteAccount(false);
    }
  }

  async function performCancel() {
    if (!confirmCancel) return;
    try {
      await cancelarCita(confirmCancel.cita_id);
      toast.success('Cita cancelada.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible cancelar.', 'Error');
    } finally {
      setConfirmCancel(null);
    }
  }

  return (
    <>
      <div className="space-y-8 animate-fade-up">
        <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] px-7 py-9 text-cream shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_24%)]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Pill tone="gold">Cliente</Pill>
              <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
                Marketplace <span className="font-display-italic text-gold-200">y citas.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-cream/68">
                Explora barberías, agenda rápido y administra tu historial desde una misma vista.
              </p>
            </div>
            {role === 'client' ? (
              <Link to="/crear-barberia">
                <Button size="md" variant="outline">
                  <Store size={18} />
                  Crear mi barbería
                </Button>
              </Link>
            ) : null}
          </div>
        </section>

        <section className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="eyebrow text-gold-700">Marketplace</p>
              <h2 className="font-display flex items-center gap-2 text-3xl font-semibold tracking-tight text-ink">
                <CalendarPlus className="text-gold-700" size={22} />
                Barberías disponibles
              </h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(barberiasQuery.data ?? []).map((barberia) => (
              <article
                className="group relative overflow-hidden rounded-[24px] border border-ink/8 bg-paper shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-500/35 hover:shadow-panel"
                key={barberia.id}
              >
                <div className="relative overflow-hidden px-6 py-6 text-cream">
                  {barberia.banner_url ? (
                    <img alt={barberia.nombre} className="absolute inset-0 h-full w-full object-cover" src={barberia.banner_url} />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,29,25,0.86),rgba(20,18,16,0.98))]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_28%)]" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-2xl border border-white/12 bg-white/8 text-sm font-semibold text-gold-200">
                        {barberia.logo_url ? (
                          <img alt={`Logo ${barberia.nombre}`} className="h-full w-full object-cover" src={barberia.logo_url} />
                        ) : (
                          barberia.nombre.charAt(0).toUpperCase()
                        )}
                      </span>
                      <div>
                        <p className="eyebrow text-cream/45">Barbería</p>
                        <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight">
                          {barberia.nombre}
                        </h3>
                      </div>
                    </div>
                    <Badge variant="confirmed">Activa</Badge>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <p className="text-sm leading-7 text-ink/65">
                    {barberia.direccion}, <span className="font-display italic text-ink/55">{barberia.ciudad}</span>
                  </p>
                  <Link to={`/booking/${barberia.id}`}>
                    <Button className="w-full" size="md" variant="primary">
                      Agendar
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
            {!barberiasQuery.isLoading && !(barberiasQuery.data ?? []).length ? (
              <p className="text-sm text-ink/50">No hay barberías disponibles aún.</p>
            ) : null}
          </div>
        </section>

        <CitasSection
          citas={proximasCitas}
          isCancelling={isCancelling}
          isLoading={isLoading}
          onCancel={setConfirmCancel}
          title="Próximas citas"
        />
        <CitasSection
          citas={historialCitas}
          isCancelling={isCancelling}
          isLoading={isLoading}
          onCancel={setConfirmCancel}
          title="Historial"
        />

        <section className="rounded-[28px] border border-danger/22 bg-danger/6 p-7">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-danger">
            Eliminar cuenta
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-danger/85">
            Esto elimina tu usuario de Supabase Auth y tus datos asociados. Luego puedes registrarte otra vez.
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
        confirmLabel="Sí, eliminar mi cuenta"
        description="Vas a eliminar definitivamente tu usuario y los datos asociados a tu cuenta."
        eyebrow="Zona crítica"
        onClose={() => setConfirmDeleteAccount(false)}
        onConfirm={performDeleteAccount}
        open={confirmDeleteAccount}
        title="¿Eliminar tu cuenta?"
        warning="Perderás acceso permanente a Barber Flow. Esta acción es irreversible."
      />

      <ConfirmDialog
        cancelLabel="Mantener cita"
        confirmLabel="Sí, cancelar cita"
        description={
          confirmCancel
            ? `Vas a cancelar tu cita de ${confirmCancel.nombre_servicio} en ${confirmCancel.nombre_barberia}.`
            : ''
        }
        eyebrow="Confirmar cancelación"
        onClose={() => setConfirmCancel(null)}
        onConfirm={performCancel}
        open={confirmCancel !== null}
        title="¿Cancelar tu cita?"
        warning="La barbería será notificada y el horario quedará libre para otros clientes."
      />
    </>
  );
}

function CitasSection({
  citas,
  isCancelling: _isCancelling,
  isLoading,
  onCancel,
  title,
}: {
  title: string;
  citas: CitaConDetalles[];
  isLoading: boolean;
  isCancelling: boolean;
  onCancel: (cita: CitaConDetalles) => void;
}) {
  return (
    <section className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="eyebrow text-gold-700">Agenda</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {isLoading ? <p className="text-sm text-ink/55">Cargando citas…</p> : null}
      <div className="space-y-3">
        {citas.map((cita) => (
          <article
            className="rounded-[22px] border border-ink/8 bg-ink/3 p-5 transition-colors duration-300 hover:border-gold-500/22 hover:bg-ink/4"
            key={cita.cita_id}
          >
            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-ink">
                  {cita.nombre_barberia}
                </p>
                <p className="mt-1 text-sm text-ink/55">
                  {cita.nombre_servicio} con <span className="text-ink/80">{cita.nombre_barbero}</span>
                </p>
              </div>
              <span className="numeric text-sm text-ink/68">
                {cita.fecha} · <span className="text-gold-700">{cita.hora_inicio.slice(0, 5)} – {cita.hora_fin.slice(0, 5)}</span>
              </span>
              <Badge variant={badgeVariantForStatus(cita.estado)}>{cita.estado}</Badge>
              {cita.estado === 'pendiente' ? (
                <Button onClick={() => onCancel(cita)} size="sm" variant="outline-ink">
                  Cancelar
                </Button>
              ) : (
                <span />
              )}
            </div>
          </article>
        ))}
        {!isLoading && !citas.length ? (
          <p className="text-sm text-ink/50">No hay citas para mostrar.</p>
        ) : null}
      </div>
    </section>
  );
}

function badgeVariantForStatus(status: string) {
  if (status === 'pendiente') return 'pending';
  if (status === 'confirmada') return 'confirmed';
  if (status === 'cancelada') return 'cancelled';
  if (status === 'completada') return 'completed';
  return 'neutral';
}
