import { CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export function BookingSuccess({ citaId, onAgain }: { citaId: string; onAgain: () => void }) {
  return (
    <section className="rounded-lg border border-mint/30 bg-white p-8 text-center shadow-panel">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint/10 text-ink">
        <CalendarCheck size={28} />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-ink">Cita creada</h1>
      <p className="mt-2 text-sm text-slate-500">Tu cita quedo en estado pendiente. Codigo: {citaId.slice(0, 8)}</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/client-dashboard">
          <Button>Ver mis citas</Button>
        </Link>
        <Button onClick={onAgain} variant="secondary">Agendar otra cita</Button>
      </div>
    </section>
  );
}
