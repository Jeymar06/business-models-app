import { MapPin, Scissors, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
import type { Barberia } from '@/types/supabase.types';

export function BarberiaMiniCard({ barberia }: { barberia: Barberia }) {
  return (
    <article className="surface-panel overflow-hidden rounded-[28px] p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-panel">
      <div className="surface-panel-dark relative overflow-hidden px-5 py-5 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Barberia</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{barberia.nombre}</h3>
          </div>
          <Badge variant="confirmed">Disponible</Badge>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 text-sm text-slate-600">
          <InfoRow icon={<MapPin size={16} />} text={`${barberia.ciudad} · ${barberia.direccion}`} />
          <InfoRow icon={<Scissors size={16} />} text="Reservas online activas" />
          <InfoRow icon={<Sparkles size={16} />} text="Experiencia lista para cliente" />
        </div>

        <Link to={`/booking/${barberia.id}`}>
          <Button className="w-full" size="sm">
            Agendar cita
          </Button>
        </Link>
      </div>
    </article>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-black/4 px-3 py-2.5">
      <span className="text-steel">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
