import { CalendarCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button, Pill } from '@/components/ui';

export function BookingSuccess({ citaId, onAgain }: { citaId: string; onAgain: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-mint/24 bg-paper p-10 text-center shadow-soft sm:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-mint/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gold-500/8 blur-3xl"
      />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-mint/24 bg-mint/10 text-mint-dark">
          <CalendarCheck size={28} />
        </div>
        <div className="mt-5 flex justify-center">
          <Pill icon={<Sparkles size={12} />} tone="gold">
            Cita confirmada
          </Pill>
        </div>
        <h1 className="font-display mx-auto mt-6 max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-5xl">
          Tu cita quedó <span className="font-display-italic text-gold-700">en pendiente.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-ink/60">
          Recibirás confirmación cuando la barbería revise tu reserva.
        </p>
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-ink/8 bg-ink/3 px-4 py-2">
          <span className="eyebrow text-ink/45">Código</span>
          <span className="numeric text-sm font-semibold text-ink">{citaId.slice(0, 8).toUpperCase()}</span>
        </div>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/client-dashboard">
            <Button size="lg" variant="primary">Ver mis citas</Button>
          </Link>
          <Button onClick={onAgain} size="lg" variant="outline-ink">
            Agendar otra cita
          </Button>
        </div>
      </div>
    </section>
  );
}
