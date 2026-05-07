import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui';
import { StatusBadge } from '@/features/superadmin/components/StatusBadge';
import type { CitaFilters, PaginatedResult, SuperadminCitaRow } from '@/features/superadmin/superadminService';
import type { AppointmentStatus } from '@/types/supabase.types';

export function CitasGlobalTable({
  data,
  error,
  filters,
  isLoading,
  onFiltersChange,
  onUpdateEstado,
  onViewDetail,
}: {
  data?: PaginatedResult<SuperadminCitaRow>;
  error?: string | null;
  filters: CitaFilters;
  isLoading: boolean;
  onFiltersChange: (patch: Partial<CitaFilters>) => void;
  onUpdateEstado: (row: SuperadminCitaRow, estado: AppointmentStatus) => void;
  onViewDetail: (row: SuperadminCitaRow) => void;
}) {
  const rows = data?.items ?? [];
  const [draftEstados, setDraftEstados] = useState<Record<string, AppointmentStatus>>({});

  useEffect(() => {
    const nextDrafts: Record<string, AppointmentStatus> = {};
    rows.forEach((row) => {
      nextDrafts[row.id] = row.estado;
    });
    setDraftEstados(nextDrafts);
  }, [data?.items]);

  return (
    <section className="surface-panel rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-steel">CITAS GLOBALES</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Monitorea reservas y cambia estados.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-4 xl:min-w-[860px]">
          <input
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ page: 1, search: event.target.value })}
            placeholder="Cliente o barbería"
            value={filters.search ?? ''}
          />
          <select
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ estado: event.target.value as CitaFilters['estado'], page: 1 })}
            value={filters.estado ?? 'all'}
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <select
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ month: event.target.value === 'all' ? 'all' : Number(event.target.value), page: 1 })}
            value={String(filters.month ?? 'all')}
          >
            <option value="all">Todos los meses</option>
            {Array.from({ length: 12 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
          <select
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ page: 1, year: event.target.value === 'all' ? 'all' : Number(event.target.value) })}
            value={String(filters.year ?? 'all')}
          >
            <option value="all">Todos los años</option>
            {Array.from({ length: 5 }).map((_, index) => {
              const year = new Date().getFullYear() - index;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}
      {isLoading ? <LoadingState /> : null}

      {!isLoading ? (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[1260px] w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.18em] text-steel">
                <th className="pb-3 pr-4">Cliente</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Barbería</th>
                <th className="pb-3 pr-4">Barbero</th>
                <th className="pb-3 pr-4">Servicio</th>
                <th className="pb-3 pr-4">Fecha</th>
                <th className="pb-3 pr-4">Hora</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3 pr-4">Precio</th>
                <th className="pb-3 pr-4">Creación</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-t border-black/8 align-top" key={row.id}>
                  <td className="py-4 pr-4 font-medium text-ink">{row.cliente}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.emailCliente}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.barberia}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.barbero}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.servicio}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.fecha}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.hora}</td>
                  <td className="py-4 pr-4"><StatusBadge status={row.estado} /></td>
                  <td className="py-4 pr-4 text-slate-600">${row.precio.toLocaleString('es-CO')}</td>
                  <td className="py-4 pr-4 text-slate-600">{new Date(row.createdAt).toLocaleDateString('es-CO')}</td>
                  <td className="py-4 text-right">
                    <div className="hidden flex-wrap justify-end gap-2 md:flex">
                      <select
                        className="h-9 rounded-xl border border-black/8 bg-[#FFFCF7] px-3 text-sm text-ink outline-none"
                        onChange={(event) => setDraftEstados((current) => ({ ...current, [row.id]: event.target.value as AppointmentStatus }))}
                        value={draftEstados[row.id] ?? row.estado}
                      >
                        <option value="pendiente">pendiente</option>
                        <option value="confirmada">confirmada</option>
                        <option value="completada">completada</option>
                        <option value="cancelada">cancelada</option>
                      </select>
                      <Button disabled={(draftEstados[row.id] ?? row.estado) === row.estado} onClick={() => onUpdateEstado(row, draftEstados[row.id] ?? row.estado)} size="sm" variant="secondary">Guardar estado</Button>
                      <Button onClick={() => onViewDetail(row)} size="sm" variant="secondary"><Eye size={15} />Ver detalle</Button>
                    </div>
                    <details className="relative md:hidden">
                      <summary className="inline-flex cursor-pointer list-none rounded-xl border border-black/8 bg-[#FFFCF7] px-3 py-2 text-xs font-semibold text-ink">Acciones</summary>
                      <div className="absolute right-0 z-10 mt-2 flex w-56 flex-col gap-2 rounded-2xl border border-black/8 bg-white p-2 shadow-panel">
                        <button className="rounded-xl px-3 py-2 text-left text-sm hover:bg-black/5" onClick={() => onViewDetail(row)} type="button">Ver detalle</button>
                        <div className="rounded-xl border border-black/8 p-2">
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-steel">Estado</label>
                          <select
                            className="h-9 w-full rounded-lg border border-black/8 bg-[#FFFCF7] px-2 text-sm text-ink outline-none"
                            onChange={(event) => setDraftEstados((current) => ({ ...current, [row.id]: event.target.value as AppointmentStatus }))}
                            value={draftEstados[row.id] ?? row.estado}
                          >
                            <option value="pendiente">pendiente</option>
                            <option value="confirmada">confirmada</option>
                            <option value="completada">completada</option>
                            <option value="cancelada">cancelada</option>
                          </select>
                          <Button className="mt-2 w-full" disabled={(draftEstados[row.id] ?? row.estado) === row.estado} onClick={() => onUpdateEstado(row, draftEstados[row.id] ?? row.estado)} size="sm" variant="secondary">Guardar estado</Button>
                        </div>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!isLoading && !rows.length ? <p className="mt-5 text-sm text-slate-500">No encontramos citas con esos filtros.</p> : null}
      {data ? <PaginationFooter data={data} onPageChange={(page) => onFiltersChange({ page })} /> : null}
    </section>
  );
}

function LoadingState() {
  return (
    <div className="mt-5 grid gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="h-16 animate-pulse rounded-2xl bg-black/5" key={index} />
      ))}
    </div>
  );
}

function PaginationFooter<T>({ data, onPageChange }: { data: PaginatedResult<T>; onPageChange: (page: number) => void }) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-black/8 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>Mostrando {data.items.length} de {data.total} registros.</p>
      <div className="flex items-center gap-2">
        <Button disabled={data.page <= 1} onClick={() => onPageChange(data.page - 1)} size="sm" variant="secondary">Anterior</Button>
        <span>Página {data.page} de {data.totalPages}</span>
        <Button disabled={data.page >= data.totalPages} onClick={() => onPageChange(data.page + 1)} size="sm" variant="secondary">Siguiente</Button>
      </div>
    </div>
  );
}
