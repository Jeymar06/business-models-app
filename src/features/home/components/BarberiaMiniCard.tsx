import { ExternalLink, MapPin, Scissors, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
import type { Barberia } from '@/types/supabase.types';
import { buildGoogleMapsSearchUrl } from '@/utils/maps';

export function BarberiaMiniCard({ barberia }: { barberia: Barberia }) {
  const mapsUrl = buildGoogleMapsSearchUrl({
    direccion: barberia.direccion,
    ciudad: barberia.ciudad,
    pais: barberia.pais,
  });

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-ink/8 bg-paper shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-500/35 hover:shadow-panel">
      <div className="relative overflow-hidden px-6 py-7 text-cream">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,29,25,0.98),rgba(20,18,16,1))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-cream/45">Barberia</p>
            <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight text-cream">
              {barberia.nombre}
            </h3>
          </div>
          <Badge variant="confirmed">Disponible</Badge>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid gap-2.5 text-sm text-ink/65">
          {mapsUrl ? (
            <a
              className="flex items-center justify-between gap-2 rounded-2xl bg-ink/4 px-3 py-2.5 transition hover:bg-ink/6"
              href={mapsUrl}
              rel="noreferrer"
              target="_blank"
            >
              <span className="flex items-center gap-2">
                <span className="text-gold-700"><MapPin size={16} /></span>
                <span>{barberia.ciudad} · {barberia.direccion}</span>
              </span>
              <ExternalLink className="flex-none text-gold-700" size={14} />
            </a>
          ) : (
            <InfoRow icon={<MapPin size={16} />} text={`${barberia.ciudad} · ${barberia.direccion}`} />
          )}
          <InfoRow icon={<Scissors size={16} />} text="Reservas online activas" />
          <InfoRow icon={<Sparkles size={16} />} text="Experiencia lista para cliente" />
        </div>

        <Link to={`/booking/${barberia.id}`}>
          <Button className="w-full" size="md" variant="primary">
            Agendar cita
          </Button>
        </Link>
      </div>
    </article>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-ink/4 px-3 py-2.5">
      <span className="text-gold-700">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
