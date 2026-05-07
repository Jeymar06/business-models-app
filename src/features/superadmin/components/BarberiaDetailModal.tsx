import { Button } from '@/components/ui';
import type { SuperadminBarberiaDetail } from '@/features/superadmin/superadminService';
import { StatusBadge } from '@/features/superadmin/components/StatusBadge';

function formatDate(value: string) {
  return new Date(value).toLocaleString('es-CO');
}

export function BarberiaDetailModal({
  data,
  error,
  isLoading,
  onClose,
  open,
}: {
  data?: SuperadminBarberiaDetail;
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
            <p className="text-sm font-semibold tracking-[0.18em] text-steel">DETALLE DE BARBERÍA</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{data?.nombre ?? 'Cargando...'}</h2>
          </div>
          <Button onClick={onClose} size="sm" variant="secondary">
            Cerrar
          </Button>
        </div>

        {isLoading ? <div className="mt-6 rounded-3xl bg-white/70 p-6 text-sm text-slate-500">Cargando detalle...</div> : null}
        {error ? <div className="mt-6 rounded-3xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}

        {data ? (
          <div className="mt-6 space-y-6">
            <section className="surface-panel rounded-[28px] p-5">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={data.state} />
                <p className="text-sm text-slate-500">Creada el {formatDate(data.createdAt)}</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{data.descripcion || 'Sin descripción registrada.'}</p>
              {data.logoUrl ? <img alt={data.nombre} className="mt-5 h-28 w-28 rounded-3xl object-cover" src={data.logoUrl} /> : null}
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <InfoCard label="Dueño / admin" value={data.ownerName} />
              <InfoCard label="Email admin" value={data.ownerEmail} />
              <InfoCard label="Teléfono" value={data.telefono || 'Sin teléfono'} />
              <InfoCard label="Ciudad" value={data.ciudad || 'Sin ciudad'} />
              <InfoCard label="Dirección" value={data.direccion || 'Sin dirección'} />
              <InfoCard label="Barberos" value={String(data.totalBarberos)} />
              <InfoCard label="Servicios" value={String(data.totalServicios)} />
            </section>

            <section className="surface-panel rounded-[28px] p-5">
              <h3 className="text-lg font-semibold text-ink">Citas recientes</h3>
              <div className="mt-4 space-y-3">
                {data.recentCitas.length ? (
                  data.recentCitas.map((cita) => (
                    <article className="rounded-2xl border border-black/8 bg-[#FFFCF7] p-4" key={cita.id}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink">{cita.cliente}</p>
                          <p className="text-sm text-slate-500">{cita.servicio} con {cita.barbero}</p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p>{cita.fecha}</p>
                          <p>{cita.hora}</p>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No hay citas recientes para mostrar.</p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="surface-panel rounded-[24px] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
      <p className="mt-3 text-sm font-medium text-ink">{value}</p>
    </article>
  );
}
