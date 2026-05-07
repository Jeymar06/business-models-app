import { Button } from '@/components/ui';
import { StatusBadge } from '@/features/superadmin/components/StatusBadge';
import type { SuperadminCitaDetail } from '@/features/superadmin/superadminService';

function formatDate(value: string) {
  return new Date(value).toLocaleString('es-CO');
}

export function CitaDetailModal({
  data,
  error,
  isLoading,
  onClose,
  open,
}: {
  data?: SuperadminCitaDetail;
  error?: string | null;
  isLoading: boolean;
  onClose: () => void;
  open: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-[#FBF7F0] p-6 shadow-[0_30px_120px_rgba(17,17,17,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-steel">DETALLE DE CITA</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{data?.cliente ?? 'Cargando...'}</h2>
          </div>
          <Button onClick={onClose} size="sm" variant="secondary">
            Cerrar
          </Button>
        </div>

        {isLoading ? <div className="mt-6 rounded-3xl bg-white/70 p-6 text-sm text-slate-500">Cargando cita...</div> : null}
        {error ? <div className="mt-6 rounded-3xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}

        {data ? (
          <div className="mt-6 space-y-6">
            <section className="surface-panel rounded-[28px] p-5">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={data.estado} />
                <p className="text-sm text-slate-500">Creada el {formatDate(data.createdAt)}</p>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoCard label="Cliente" value={data.cliente} />
                <InfoCard label="Email cliente" value={data.emailCliente} />
                <InfoCard label="Barbería" value={data.barberia} />
                <InfoCard label="Barbero" value={data.barbero} />
                <InfoCard label="Servicio" value={data.servicio} />
                <InfoCard label="Precio" value={`$${data.precio.toLocaleString('es-CO')}`} />
                <InfoCard label="Fecha" value={data.fecha} />
                <InfoCard label="Hora inicio" value={data.horaInicio.slice(0, 5)} />
                <InfoCard label="Hora fin" value={data.horaFin.slice(0, 5)} />
              </div>
            </section>

            <section className="surface-panel rounded-[28px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Notas</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{data.notas || 'Sin notas registradas.'}</p>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[24px] border border-black/8 bg-[#FFFCF7] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
      <p className="mt-3 text-sm font-medium text-ink">{value}</p>
    </article>
  );
}
