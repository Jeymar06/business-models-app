import { ExternalLink, MapPin } from 'lucide-react';

import { buildBarberiaAddress, buildGoogleMapsEmbedUrl, buildGoogleMapsSearchUrl } from '@/utils/maps';

export function LocationPreview({
  ciudad,
  description,
  direccion,
  eyebrow = 'Ubicacion',
  mapHeightClass = 'h-64',
  pais = 'Colombia',
  title = 'Ver ubicacion',
}: {
  ciudad?: string | null;
  description?: string;
  direccion?: string | null;
  eyebrow?: string;
  mapHeightClass?: string;
  pais?: string | null;
  title?: string;
}) {
  const address = buildBarberiaAddress({ direccion, ciudad, pais });
  const mapsUrl = buildGoogleMapsSearchUrl({ direccion, ciudad, pais });
  const embedUrl = buildGoogleMapsEmbedUrl({ direccion, ciudad, pais });

  if (!address || !mapsUrl || !embedUrl) return null;

  return (
    <section className="rounded-[24px] border border-ink/10 bg-[#fcfaf5] p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-gold-700">{eyebrow}</p>
          <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink">{title}</h3>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">{description}</p>
          ) : null}
        </div>
        <a
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold-500/35 hover:text-gold-700"
          href={mapsUrl}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink size={16} />
          Abrir en Google Maps
        </a>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-ink/4 px-4 py-3 text-sm text-ink/72">
        <MapPin className="mt-0.5 flex-none text-gold-700" size={17} />
        <span>{address}</span>
      </div>

      <div className={`mt-4 overflow-hidden rounded-[22px] border border-ink/10 ${mapHeightClass}`}>
        <iframe
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          title={`Mapa de ${address}`}
        />
      </div>
    </section>
  );
}
