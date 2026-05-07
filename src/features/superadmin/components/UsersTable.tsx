import { Eye, ShieldBan, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui';
import { RoleBadge } from '@/features/superadmin/components/RoleBadge';
import { StatusBadge } from '@/features/superadmin/components/StatusBadge';
import type { PaginatedResult, SuperadminUserRow, UserFilters } from '@/features/superadmin/superadminService';
import type { UserRole } from '@/types/supabase.types';

export function UsersTable({
  data,
  error,
  filters,
  isLoading,
  onFiltersChange,
  onSoftDelete,
  onSuspend,
  onUpdateRole,
  onViewDetail,
}: {
  data?: PaginatedResult<SuperadminUserRow>;
  error?: string | null;
  filters: UserFilters;
  isLoading: boolean;
  onFiltersChange: (patch: Partial<UserFilters>) => void;
  onSoftDelete: (row: SuperadminUserRow) => void;
  onSuspend: (row: SuperadminUserRow) => void;
  onUpdateRole: (row: SuperadminUserRow, role: UserRole) => void;
  onViewDetail: (row: SuperadminUserRow) => void;
}) {
  const rows = data?.items ?? [];
  const [draftRoles, setDraftRoles] = useState<Record<string, UserRole>>({});

  useEffect(() => {
    const nextDrafts: Record<string, UserRole> = {};
    rows.forEach((row) => {
      nextDrafts[row.id] = row.role;
    });
    setDraftRoles(nextDrafts);
  }, [data?.items]);

  return (
    <section className="surface-panel rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-steel">USUARIOS REGISTRADOS</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Administra roles, estados y acceso.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[720px]">
          <input
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ page: 1, search: event.target.value })}
            placeholder="Buscar por nombre o email"
            value={filters.search ?? ''}
          />
          <select
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ page: 1, role: event.target.value as UserFilters['role'] })}
            value={filters.role ?? 'all'}
          >
            <option value="all">Todos los roles</option>
            <option value="client">Cliente</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <select
            className="h-11 rounded-xl border border-black/8 bg-[#FFFCF7] px-3.5 text-sm text-ink outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
            onChange={(event) => onFiltersChange({ page: 1, state: event.target.value as UserFilters['state'] })}
            value={filters.state ?? 'all'}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="suspended">Suspendido</option>
            <option value="deleted">Oculto</option>
          </select>
        </div>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}
      {isLoading ? <LoadingState /> : null}

      {!isLoading ? (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[1120px] w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.18em] text-steel">
                <th className="pb-3 pr-4">Nombre</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Rol</th>
                <th className="pb-3 pr-4">Registro</th>
                <th className="pb-3 pr-4">Barbería</th>
                <th className="pb-3 pr-4">Citas</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-t border-black/8 align-top" key={row.id}>
                  <td className="py-4 pr-4 font-medium text-ink">{row.nombre}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.email}</td>
                  <td className="py-4 pr-4"><RoleBadge role={row.role} /></td>
                  <td className="py-4 pr-4 text-slate-600">{new Date(row.createdAt).toLocaleDateString('es-CO')}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.barberiaNombre || 'No aplica'}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.totalCitas}</td>
                  <td className="py-4 pr-4"><StatusBadge status={row.state} /></td>
                  <td className="py-4 text-right">
                    <div className="hidden flex-wrap justify-end gap-2 md:flex">
                      <select
                        className="h-9 rounded-xl border border-black/8 bg-[#FFFCF7] px-3 text-sm text-ink outline-none"
                        disabled={row.isPrimarySuperadmin}
                        onChange={(event) => {
                          setDraftRoles((current) => ({ ...current, [row.id]: event.target.value as UserRole }));
                        }}
                        value={draftRoles[row.id] ?? row.role}
                      >
                        <option value="client">client</option>
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      </select>
                      <Button disabled={row.isPrimarySuperadmin || (draftRoles[row.id] ?? row.role) === row.role} onClick={() => onUpdateRole(row, draftRoles[row.id] ?? row.role)} size="sm" variant="secondary">Aplicar rol</Button>
                      <Button onClick={() => onViewDetail(row)} size="sm" variant="secondary"><Eye size={15} />Ver perfil</Button>
                      <Button className="bg-[#7c3aed] text-white hover:bg-[#6d28d9]" disabled={row.isPrimarySuperadmin} onClick={() => onSuspend(row)} size="sm"><ShieldBan size={15} />Suspender</Button>
                      <Button className="bg-danger text-white hover:bg-[#b91c1c]" disabled={row.isPrimarySuperadmin} onClick={() => onSoftDelete(row)} size="sm"><Trash2 size={15} />Ocultar</Button>
                    </div>
                    <details className="relative md:hidden">
                      <summary className="inline-flex cursor-pointer list-none rounded-xl border border-black/8 bg-[#FFFCF7] px-3 py-2 text-xs font-semibold text-ink">Acciones</summary>
                      <div className="absolute right-0 z-10 mt-2 flex w-56 flex-col gap-2 rounded-2xl border border-black/8 bg-white p-2 shadow-panel">
                        <button className="rounded-xl px-3 py-2 text-left text-sm hover:bg-black/5" onClick={() => onViewDetail(row)} type="button">Ver perfil</button>
                        <button className="rounded-xl px-3 py-2 text-left text-sm hover:bg-black/5" disabled={row.isPrimarySuperadmin} onClick={() => onSuspend(row)} type="button">Suspender</button>
                        <button className="rounded-xl px-3 py-2 text-left text-sm text-danger hover:bg-danger/10" disabled={row.isPrimarySuperadmin} onClick={() => onSoftDelete(row)} type="button">Ocultar</button>
                        <div className="rounded-xl border border-black/8 p-2">
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-steel">Rol</label>
                          <select
                            className="h-9 w-full rounded-lg border border-black/8 bg-[#FFFCF7] px-2 text-sm text-ink outline-none"
                            disabled={row.isPrimarySuperadmin}
                            onChange={(event) => setDraftRoles((current) => ({ ...current, [row.id]: event.target.value as UserRole }))}
                            value={draftRoles[row.id] ?? row.role}
                          >
                            <option value="client">client</option>
                            <option value="admin">admin</option>
                            <option value="superadmin">superadmin</option>
                          </select>
                          <Button className="mt-2 w-full" disabled={row.isPrimarySuperadmin || (draftRoles[row.id] ?? row.role) === row.role} onClick={() => onUpdateRole(row, draftRoles[row.id] ?? row.role)} size="sm" variant="secondary"><ShieldCheck size={15} />Aplicar rol</Button>
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

      {!isLoading && !rows.length ? <p className="mt-5 text-sm text-slate-500">No encontramos usuarios con esos filtros.</p> : null}
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
