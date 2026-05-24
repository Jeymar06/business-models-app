import { useQuery } from '@tanstack/react-query';
import { CalendarClock, CalendarPlus, ExternalLink, History, MapPin, Store } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Badge, Button, ConfirmDialog, Pill, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { bookingService } from '@/features/booking/bookingService';
import { useCitas } from '@/features/booking/hooks/useCitas';
import type { CitaConDetalles } from '@/types/supabase.types';
import { buildGoogleMapsSearchUrl } from '@/utils/maps';
import { isRenderableMediaUrl } from '@/utils/media';

type ClientView = 'agendar' | 'mis-citas';

function getClientView(value: string | null): ClientView {
  return value === 'mis-citas' ? 'mis-citas' : 'agendar';
}

export function ClientDashboard() {
  const toast = useToast();
  const { role, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = getClientView(searchParams.get('view'));
  const { cancelarCita, historialCitas, isCancelling, isLoading, proximasCitas } = useCitas(user?.id);
  const barberiasQuery = useQuery({
    queryKey: ['marketplace', 'barberias'],
    queryFn: bookingService.getBarberias,
  });
  const [confirmCancel, setConfirmCancel] = useState<CitaConDetalles | null>(null);

  const appointmentSummary = useMemo(() => ({
    upcoming: proximasCitas.length,
    history: historialCitas.length,
    pending: proximasCitas.filter((cita) => cita.estado === 'pendiente').length,
    completed: historialCitas.filter((cita) => cita.estado === 'completada').length,
  }), [historialCitas, proximasCitas]);

  function changeView(nextView: ClientView) {
    const nextParams = new URLSearchParams(searchParams);
    if (nextView === 'agendar') {
      nextParams.delete('view');
    } else {
      nextParams.set('view', nextView);
    }
    setSearchParams(nextParams, { replace: true });
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
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Pill tone="gold">Cliente</Pill>
                <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
                  {currentView === 'agendar' ? (
                    <>Reserva <span className="font-display-italic text-gold-200">tu proxima cita.</span></>
                  ) : (
                    <>Tus citas <span className="font-display-italic text-gold-200">en un solo lugar.</span></>
                  )}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-cream/76">
                  {currentView === 'agendar'
                    ? 'Explora barberias disponibles y agenda rapido sin salir del panel cliente.'
                    : 'Consulta tus proximas citas, revisa tu historial y administra cambios desde un solo espacio.'}
                </p>
              </div>
              {role === 'client' ? (
                <Link to="/crear-barberia">
                  <Button size="md" variant="outline">
                    <Store size={18} />
                    Crear mi barberia
                  </Button>
                </Link>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className={[
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  currentView === 'agendar'
                    ? 'border-gold-500/40 bg-gold-500/14 text-gold-200'
                    : 'border-white/10 bg-white/5 text-cream/72 hover:bg-white/8 hover:text-cream',
                ].join(' ')}
                onClick={() => changeView('agendar')}
                type="button"
              >
                <CalendarPlus className="mr-2 inline" size={16} />
                Agendar
              </button>
              <button
                className={[
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  currentView === 'mis-citas'
                    ? 'border-gold-500/40 bg-gold-500/14 text-gold-200'
                    : 'border-white/10 bg-white/5 text-cream/72 hover:bg-white/8 hover:text-cream',
                ].join(' ')}
                onClick={() => changeView('mis-citas')}
                type="button"
              >
                <CalendarClock className="mr-2 inline" size={16} />
                Mis citas
              </button>
            </div>
          </div>
        </section>

        {currentView === 'agendar' ? (
          <section className="rounded-[28px] border border-ink/10 bg-white p-7 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="space-y-2">
                <p className="eyebrow text-gold-700">Marketplace</p>
                <h2 className="font-display flex items-center gap-2 text-3xl font-semibold tracking-tight text-ink">
                  <CalendarPlus className="text-gold-700" size={22} />
                  Barberias disponibles
                </h2>
                <p className="text-sm leading-6 text-gold-700">
                  Elige una barberia, revisa su disponibilidad y entra directo a reservar.
                </p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {(barberiasQuery.data ?? []).map((barberia) => (
                <article
                  className="group relative overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-500/35 hover:shadow-panel"
                  key={barberia.id}
                >
                  {(() => {
                    const bannerUrl = isRenderableMediaUrl(barberia.banner_url) ? barberia.banner_url!.trim() : null;
                    const logoUrl = isRenderableMediaUrl(barberia.logo_url) ? barberia.logo_url!.trim() : null;
                    const mapsUrl = buildGoogleMapsSearchUrl({
                      direccion: barberia.direccion,
                      ciudad: barberia.ciudad,
                      pais: barberia.pais,
                    });

                    return (
                      <>
                        <div className="relative overflow-hidden px-6 py-6 text-cream">
                          {bannerUrl ? (
                            <img alt={barberia.nombre} className="absolute inset-0 h-full w-full object-cover" src={bannerUrl} />
                          ) : null}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,29,25,0.86),rgba(20,18,16,0.98))]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_28%)]" />
                          <div className="relative flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-2xl border border-white/12 bg-white/8 text-sm font-semibold text-gold-200">
                                {logoUrl ? (
                                  <img alt={`Logo ${barberia.nombre}`} className="h-full w-full object-cover" src={logoUrl} />
                                ) : (
                                  barberia.nombre.charAt(0).toUpperCase()
                                )}
                              </span>
                              <div>
                                <p className="eyebrow text-cream/55">Barberia</p>
                                <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight">
                                  {barberia.nombre}
                                </h3>
                              </div>
                            </div>
                            <Badge variant="confirmed">Activa</Badge>
                          </div>
                        </div>
                        <div className="space-y-4 p-6">
                          {mapsUrl ? (
                            <a
                              className="flex items-start justify-between gap-3 rounded-2xl bg-[#f8f4eb] px-4 py-3 text-sm leading-7 text-gold-700 transition hover:bg-[#f3ede0]"
                              href={mapsUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <span className="flex items-start gap-2">
                                <MapPin className="mt-1 flex-none" size={16} />
                                <span>
                                  {barberia.direccion}, <span className="font-display italic text-gold-700">{barberia.ciudad}</span>
                                </span>
                              </span>
                              <ExternalLink className="mt-1 flex-none" size={15} />
                            </a>
                          ) : (
                            <p className="text-sm leading-7 text-gold-700">
                              {barberia.direccion}, <span className="font-display italic text-gold-700">{barberia.ciudad}</span>
                            </p>
                          )}
                          <Link to={`/booking/${barberia.id}`}>
                            <Button className="w-full" size="md" variant="primary">
                              Agendar
                            </Button>
                          </Link>
                        </div>
                      </>
                    );
                  })()}
                </article>
              ))}
              {!barberiasQuery.isLoading && !(barberiasQuery.data ?? []).length ? (
                <p className="text-sm text-ink/60">No hay barberias disponibles aun.</p>
              ) : null}
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ClientMetricCard icon={<CalendarClock size={18} />} label="Proximas citas" value={appointmentSummary.upcoming} />
              <ClientMetricCard icon={<History size={18} />} label="Historial" value={appointmentSummary.history} />
              <ClientMetricCard icon={<CalendarPlus size={18} />} label="Pendientes" value={appointmentSummary.pending} />
              <ClientMetricCard icon={<Badge variant="completed">OK</Badge>} label="Completadas" value={appointmentSummary.completed} />
            </section>

            <CitasSection
              citas={proximasCitas}
              isCancelling={isCancelling}
              isLoading={isLoading}
              onCancel={setConfirmCancel}
              title="Proximas citas"
            />
            <CitasSection
              citas={historialCitas}
              isCancelling={isCancelling}
              isLoading={isLoading}
              onCancel={setConfirmCancel}
              title="Historial"
            />
          </>
        )}
      </div>

      <ConfirmDialog
        cancelLabel="Mantener cita"
        confirmLabel="Si, cancelar cita"
        description={
          confirmCancel
            ? `Vas a cancelar tu cita de ${confirmCancel.nombre_servicio} en ${confirmCancel.nombre_barberia}.`
            : ''
        }
        eyebrow="Confirmar cancelacion"
        onClose={() => setConfirmCancel(null)}
        onConfirm={performCancel}
        open={confirmCancel !== null}
        title="Cancelar tu cita"
        warning="La barberia sera notificada y el horario quedara libre para otros clientes."
      />
    </>
  );
}

function ClientMetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <section className="rounded-[24px] border border-ink/10 bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="eyebrow text-gold-700">{label}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-ink/10 bg-ink/4 text-gold-700">
          {icon}
        </div>
      </div>
      <p className="font-display numeric text-4xl font-semibold tracking-tight text-ink">{value}</p>
    </section>
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
    <section className="rounded-[28px] border border-ink/10 bg-white p-7 shadow-soft sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="eyebrow text-gold-700">Agenda</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {isLoading ? <p className="text-sm text-ink/65">Cargando citas...</p> : null}
      <div className="space-y-3">
        {citas.map((cita) => (
          <article
            className="rounded-[22px] border border-ink/10 bg-[#f8f4eb] p-5 transition-colors duration-300 hover:border-gold-500/22 hover:bg-[#f3ede0]"
            key={cita.cita_id}
          >
            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-ink">
                  {cita.nombre_barberia}
                </p>
                <p className="mt-1 text-sm text-ink/72">
                  {cita.nombre_servicio} con <span className="text-ink">{cita.nombre_barbero}</span>
                </p>
              </div>
              <span className="numeric text-sm text-ink/78">
                {cita.fecha} · <span className="text-gold-700">{cita.hora_inicio.slice(0, 5)} - {cita.hora_fin.slice(0, 5)}</span>
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
          <p className="text-sm text-ink/60">No hay citas para mostrar.</p>
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
