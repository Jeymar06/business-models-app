import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BookingStepper } from '@/features/booking/components/BookingStepper';
import { BookingSuccess } from '@/features/booking/components/BookingSuccess';
import { bookingService } from '@/features/booking/bookingService';
import { useBooking } from '@/features/booking/hooks/useBooking';
import { useSlots } from '@/features/booking/hooks/useSlots';
import { Step1Servicio } from '@/features/booking/steps/Step1Servicio';
import { Step2Barbero } from '@/features/booking/steps/Step2Barbero';
import { Step3Fecha } from '@/features/booking/steps/Step3Fecha';
import { Step4Confirmar } from '@/features/booking/steps/Step4Confirmar';

export function BookingPage() {
  const { barberia_id: barberiaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const booking = useBooking();
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const barberiaQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['booking', 'barberia', barberiaId],
    queryFn: () => bookingService.getBarberiaById(barberiaId!),
  });

  const serviciosQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['booking', 'servicios', barberiaId],
    queryFn: () => bookingService.getServiciosByBarberia(barberiaId!),
  });

  const barberosQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['booking', 'barberos', barberiaId],
    queryFn: () => bookingService.getBarberosByBarberia(barberiaId!),
  });

  const disponibilidadQuery = useQuery({
    enabled: Boolean(barberiaId && booking.currentStep >= 3),
    queryKey: ['booking', 'available-days', barberiaId, booking.barbero?.id ?? 'any'],
    queryFn: async () => {
      if (booking.barbero) return bookingService.getDisponibilidadByBarbero(booking.barbero.id);
      const barberos = barberosQuery.data ?? [];
      return bookingService.getDisponibilidadByBarberos(barberos.map((barbero) => barbero.id));
    },
  });

  const slotsQuery = useSlots({
    anyBarbero: booking.anyBarbero,
    barberiaId: barberiaId ?? '',
    barbero: booking.barbero,
    fecha: booking.fecha,
    servicio: booking.servicio,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user || !barberiaId || !booking.servicio || !booking.slot || !booking.fecha || !booking.slot.barbero_id) {
        throw new Error('Completa todos los pasos antes de confirmar.');
      }

      return bookingService.createCita({
        cliente_id: user.id,
        barberia_id: barberiaId,
        barbero_id: booking.slot.barbero_id,
        servicio_id: booking.servicio.id,
        fecha: bookingService.formatDate(booking.fecha),
        hora_inicio: booking.slot.hora_inicio,
        hora_fin: booking.slot.hora_fin,
        notas: booking.notas.trim() || null,
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'No fue posible crear la cita.');
    },
    onSuccess: async (cita) => {
      setError(null);
      setSuccessId(cita.id);
      await queryClient.invalidateQueries({ queryKey: ['client', 'citas', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['booking', 'slots'] });
    },
  });

  const availableDays = useMemo(() => [...new Set((disponibilidadQuery.data ?? []).map((block) => block.dia_semana))], [disponibilidadQuery.data]);

  const barberia = barberiaQuery.data;

  if (!barberiaId) {
    return <MissingBarberia />;
  }

  if (barberiaQuery.isLoading) {
    return <PageState title="Cargando barberia" text="Estamos preparando el flujo de reserva." />;
  }

  if (!barberia || !barberia.activo || !barberia.acepta_reservas) {
    return <PageState title="Barberia no disponible" text="Esta barberia no existe o no acepta reservas por ahora." />;
  }

  if (successId) {
    return <BookingSuccess citaId={successId} onAgain={() => { setSuccessId(null); booking.resetBooking(); }} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] animate-fade-up">
      <div className="space-y-6">
        <section className="surface-panel-dark overflow-hidden rounded-[32px] text-white shadow-panel">
          {barberia.banner_url ? <img alt={barberia.nombre} className="h-56 w-full object-cover" src={barberia.banner_url} /> : null}
          <div className="space-y-4 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="confirmed">Reservas activas</Badge>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">Agendamiento</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{barberia.nombre}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">{barberia.descripcion}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2"><MapPin size={16} />{barberia.direccion}, {barberia.ciudad}</span>
              <span className="flex items-center gap-2"><Phone size={16} />{barberia.telefono}</span>
            </div>
          </div>
        </section>

        {error ? <div className="rounded-2xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger">{error}</div> : null}

        <div className="surface-panel rounded-[28px] p-4 sm:p-5">
          <BookingStepper
            canGoNext={booking.canGoNext}
            currentStep={booking.currentStep}
            isFinalLoading={createMutation.isPending}
            onBack={booking.prevStep}
            onConfirm={() => createMutation.mutate()}
            onNext={booking.nextStep}
          >
            {booking.currentStep === 1 ? (
              <Step1Servicio onSelect={booking.selectServicio} selectedServicio={booking.servicio} servicios={serviciosQuery.data ?? []} />
            ) : null}
            {booking.currentStep === 2 ? (
              <Step2Barbero
                anyBarbero={booking.anyBarbero}
                barbero={booking.barbero}
                barberos={barberosQuery.data ?? []}
                onSelectAny={booking.selectAnyBarbero}
                onSelectBarbero={booking.selectBarbero}
              />
            ) : null}
            {booking.currentStep === 3 ? (
              <Step3Fecha
                availableDays={availableDays}
                fecha={booking.fecha}
                isLoading={slotsQuery.isLoading}
                onSelectFecha={booking.selectFecha}
                onSelectSlot={booking.selectSlot}
                selectedSlot={booking.slot}
                slots={slotsQuery.data ?? []}
              />
            ) : null}
            {booking.currentStep === 4 ? (
              <Step4Confirmar
                barberia={barberia}
                barbero={booking.barbero}
                fecha={booking.fecha}
                notas={booking.notas}
                onNotasChange={booking.setNotas}
                servicio={booking.servicio}
                slot={booking.slot}
              />
            ) : null}
          </BookingStepper>
        </div>
      </div>

      <aside className="surface-panel h-fit rounded-[28px] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Tu reserva</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Resumen</h2>
        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <SummaryRow label="Servicio" value={booking.servicio?.nombre ?? 'Selecciona un servicio'} />
          <SummaryRow label="Barbero" value={booking.barbero?.nombre ?? (booking.anyBarbero ? 'Cualquier barbero disponible' : 'Selecciona un barbero')} />
          <SummaryRow label="Horario" value={booking.slot ? `${booking.slot.hora_inicio} - ${booking.slot.hora_fin}` : 'Selecciona fecha y hora'} />
        </div>
        <Button className="mt-6 w-full" onClick={() => navigate('/client-dashboard')} variant="secondary">Mis citas</Button>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/4 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
      <p className="mt-2 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function MissingBarberia() {
  return (
    <PageState title="Elige una barberia" text="Entra desde una barberia del marketplace para agendar una cita.">
      <Link to="/client-dashboard"><Button>Ver barberias</Button></Link>
    </PageState>
  );
}

function PageState({ children, text, title }: { title: string; text: string; children?: ReactNode }) {
  return (
    <section className="surface-panel rounded-[28px] p-8">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-slate-600">{text}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
