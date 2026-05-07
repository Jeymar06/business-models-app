import { Eye, Power, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui';
import { StatusBadge } from '@/features/superadmin/components/StatusBadge';
import type { BarberiaFilters, PaginatedResult, SuperadminBarberiaRow } from '@/features/superadmin/superadminService';

export function BarberiasTable({
  data,
  error,
  filters,
  isLoading,
  onFiltersChange,
  onSoftDelete,
  onToggleStatus,
  onViewDetail,
}: {
  data?: PaginatedResult<SuperadminBarberiaRow>;
  error?: string | null;
  filters: BarberiaFilters;
  isLoading: boolean;
  onFiltersChange: (patch: Partial<BarberiaFilters>) => void;
  onSoftDelete: (row: SuperadminBarberiaRow) => void;
  onToggleStatus: (row: SuperadminBarberiaRow) => void;
  onViewDetail: (row: SuperadminBarberiaRow) => void;
}) {
  const rows = data?.items ?? [];

  return (
    <section className="surface-panel rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-steel">BARBERÍAS REGISTRADAS</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Administra barberías y su visibilidad.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[720px]">
          <input
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ page: 1, search: event.target.value })}
            placeholder="Buscar por nombre"
            value={filters.search ?? ''}
          />
          <input
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ city: event.target.value || 'all', page: 1 })}
            placeholder="Filtrar por ciudad"
            value={filters.city === 'all' ? '' : filters.city ?? ''}
          />
          <select
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ page: 1, state: event.target.value as BarberiaFilters['state'] })}
            value={filters.state ?? 'all'}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="pending">Pendiente</option>
            <option value="suspended">Suspendido</option>
            <option value="deleted">Oculto</option>
          </select>
        </div>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}
      {isLoading ? <LoadingState /> : null}

      {!isLoading ? (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.18em] text-steel">
                <th className="pb-3 pr-4">Barbería</th>
                <th className="pb-3 pr-4">Dueño</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Teléfono</th>
                <th className="pb-3 pr-4">Ciudad</th>
                <th className="pb-3 pr-4">Dirección</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3 pr-4">Citas del mes</th>
                <th className="pb-3 pr-4">Creación</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-t border-black/8 align-top" key={row.id}>
                  <td className="py-4 pr-4 font-medium text-ink">{row.nombre}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.ownerName}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.ownerEmail}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.telefono || 'Sin teléfono'}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.ciudad || 'Sin ciudad'}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.direccion || 'Sin dirección'}</td>
                  <td className="py-4 pr-4"><StatusBadge status={row.state} /></td>
                  <td className="py-4 pr-4 text-slate-600">{row.totalCitasMes}</td>
                  <td className="py-4 pr-4 text-slate-600">{new Date(row.createdAt).toLocaleDateString('es-CO')}</td>
                  <td className="py-4 text-right">
                    <div className="hidden justify-end gap-2 md:flex">
                      <Button onClick={() => onViewDetail(row)} size="sm" variant="secondary"><Eye size={15} />Ver detalle</Button>
                      <Button onClick={() => onToggleStatus(row)} size="sm" variant="secondary"><Power size={15} />{row.state === 'active' ? 'Desactivar' : 'Activar'}</Button>
                      <Button className="bg-danger text-white hover:bg-[#b91c1c]" onClick={() => onSoftDelete(row)} size="sm"><Trash2 size={15} />Ocultar</Button>
                    </div>
                    <details className="relative md:hidden">
                      <summary className="inline-flex cursor-pointer list-none rounded-xl border border-black/8 bg-[#FFFCF7] px-3 py-2 text-xs font-semibold text-ink">Acciones</summary>
                      <div className="absolute right-0 z-10 mt-2 flex w-48 flex-col gap-2 rounded-2xl border border-black/8 bg-white p-2 shadow-panel">
                        <button className="rounded-xl px-3 py-2 text-left text-sm hover:bg-black/5" onClick={() => onViewDetail(row)} type="button">Ver detalle</button>
                        <button className="rounded-xl px-3 py-2 text-left text-sm hover:bg-black/5" onClick={() => onToggleStatus(row)} type="button">{row.state === 'active' ? 'Desactivar' : 'Activar'}</button>
                        <button className="rounded-xl px-3 py-2 text-left text-sm text-danger hover:bg-danger/10" onClick={() => onSoftDelete(row)} type="button">Ocultar</button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!isLoading && !rows.length ? <p className="mt-5 text-sm text-slate-500">No encontramos barberías con esos filtros.</p> : null}
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
