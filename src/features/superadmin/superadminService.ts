import { bookingService } from '@/features/booking/bookingService';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AppointmentStatus, Barberia, CitaConDetalles, Profile, UserRole } from '@/types/supabase.types';

export const PRIMARY_SUPERADMIN_EMAIL = 'jeidertorres3@gmail.com';

export type SuperadminTab = 'resumen' | 'barberias' | 'usuarios' | 'citas';
export type SuperadminEntityState = 'active' | 'pending' | 'suspended' | 'deleted';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SuperadminStats {
  barberias: number;
  usuarios: number;
  citasMes: number;
  ingresosMes: number;
}

export interface BarberiaFilters {
  search?: string;
  city?: string;
  state?: SuperadminEntityState | 'all';
  page?: number;
  pageSize?: number;
}

export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  state?: SuperadminEntityState | 'all';
  page?: number;
  pageSize?: number;
}

export interface CitaFilters {
  search?: string;
  estado?: AppointmentStatus | 'all';
  month?: number | 'all';
  year?: number | 'all';
  page?: number;
  pageSize?: number;
}

export interface SuperadminBarberiaRow {
  id: string;
  nombre: string;
  ownerName: string;
  ownerEmail: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  state: SuperadminEntityState;
  totalCitasMes: number;
  createdAt: string;
  raw: BarberiaRecord;
}

export interface SuperadminBarberiaDetail {
  id: string;
  nombre: string;
  descripcion: string;
  logoUrl: string | null;
  ownerName: string;
  ownerEmail: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  state: SuperadminEntityState;
  createdAt: string;
  totalBarberos: number;
  totalServicios: number;
  recentCitas: SuperadminCitaRow[];
}

export interface SuperadminUserRow {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  createdAt: string;
  barberiaNombre: string | null;
  totalCitas: number;
  state: SuperadminEntityState;
  isPrimarySuperadmin: boolean;
  raw: ProfileRecord;
}

export interface SuperadminUserDetail {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  createdAt: string;
  state: SuperadminEntityState;
  barberiaNombre: string | null;
  recentCitas: SuperadminCitaRow[];
}

export interface SuperadminCitaRow {
  id: string;
  cliente: string;
  emailCliente: string;
  barberia: string;
  barbero: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: AppointmentStatus;
  precio: number;
  createdAt: string;
  raw: CitaConDetalles;
}

export interface SuperadminCitaDetail {
  id: string;
  cliente: string;
  emailCliente: string;
  barberia: string;
  barbero: string;
  servicio: string;
  precio: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: AppointmentStatus;
  notas: string | null;
  createdAt: string;
}

type ProfileRecord = Profile & {
  activo?: boolean | null;
  status?: string | null;
  deleted_at?: string | null;
};

type BarberiaRecord = Barberia & {
  status?: string | null;
  deleted_at?: string | null;
};

function ensureSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado.');
  }
}

function normalizeText(value?: string | null) {
  return (value ?? '').trim().toLowerCase();
}

function matchesSearch(values: Array<string | null | undefined>, search?: string) {
  const normalizedSearch = normalizeText(search);
  if (!normalizedSearch) return true;
  return values.some((value) => normalizeText(value).includes(normalizedSearch));
}

function toCurrency(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function isCurrentMonth(dateValue: string) {
  const date = new Date(dateValue);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function paginate<T>(items: T[], page = 1, pageSize = 10): PaginatedResult<T> {
  const safePageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

function getBarberiaState(barberia: BarberiaRecord): SuperadminEntityState {
  if (barberia.status === 'deleted' || barberia.deleted_at) return 'deleted';
  if (!barberia.activo || barberia.estado === 'suspendida') return 'suspended';
  if (barberia.estado === 'pendiente') return 'pending';
  return 'active';
}

function getUserState(profile: ProfileRecord): SuperadminEntityState {
  if (profile.status === 'deleted' || profile.deleted_at) return 'deleted';
  if (profile.activo === false || profile.status === 'suspended') return 'suspended';
  return 'active';
}

function mapCitaRow(cita: CitaConDetalles): SuperadminCitaRow {
  return {
    id: cita.cita_id,
    cliente: cita.nombre_cliente || 'Cliente sin nombre',
    emailCliente: cita.email_cliente,
    barberia: cita.nombre_barberia,
    barbero: cita.nombre_barbero,
    servicio: cita.nombre_servicio,
    fecha: cita.fecha,
    hora: cita.hora_inicio.slice(0, 5),
    estado: cita.estado,
    precio: toCurrency(cita.precio),
    createdAt: cita.created_at,
    raw: cita,
  };
}

function isMissingColumnError(error: unknown) {
  const message = String((error as { message?: string })?.message ?? '').toLowerCase();
  return message.includes('column') && message.includes('does not exist');
}

async function fetchProfilesByIds(ids: string[]) {
  if (!ids.length) return [] as ProfileRecord[];

  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .in('id', ids);

  if (error) throw error;
  return (data ?? []) as ProfileRecord[];
}

async function fetchBarberiasByAdminIds(adminIds: string[]) {
  if (!adminIds.length) return [] as BarberiaRecord[];

  const { data, error } = await (supabase as any)
    .from('barberias')
    .select('*')
    .in('admin_id', adminIds)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as BarberiaRecord[];
}

async function safeBarberiaLifecycleUpdate(barberiaId: string, requiredUpdate: Record<string, unknown>, optionalUpdate: Record<string, unknown>) {
  const fullUpdate = { ...requiredUpdate, ...optionalUpdate };
  const fullResult = await (supabase as any)
    .from('barberias')
    .update(fullUpdate)
    .eq('id', barberiaId)
    .select('*')
    .maybeSingle();

  if (!fullResult.error) return fullResult.data as BarberiaRecord | null;
  if (!isMissingColumnError(fullResult.error)) throw fullResult.error;

  const fallbackResult = await (supabase as any)
    .from('barberias')
    .update(requiredUpdate)
    .eq('id', barberiaId)
    .select('*')
    .maybeSingle();

  if (fallbackResult.error) throw fallbackResult.error;
  return fallbackResult.data as BarberiaRecord | null;
}

async function strictProfileLifecycleUpdate(userId: string, payload: Record<string, unknown>) {
  const result = await (supabase as any)
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select('*')
    .maybeSingle();

  if (!result.error) return result.data as ProfileRecord | null;

  if (isMissingColumnError(result.error)) {
    throw new Error('Falta la migración de profiles para status, activo o deleted_at.');
  }

  throw result.error;
}

async function getAllCitasRaw() {
  ensureSupabase();
  return bookingService.getTodasLasCitas();
}

async function getProfileOrThrow(userId: string) {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('No encontramos el usuario solicitado.');
  return data as ProfileRecord;
}

function assertMutableUser(profile: ProfileRecord) {
  if (normalizeText(profile.email) === PRIMARY_SUPERADMIN_EMAIL) {
    throw new Error('No puedes modificar el superadmin principal.');
  }
}

export const superadminService = {
  async getSuperadminStats(): Promise<SuperadminStats> {
    ensureSupabase();

    const [barberiasCount, usuariosCount, citas] = await Promise.all([
      supabase.from('barberias').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      getAllCitasRaw(),
    ]);

    const citasMes = citas.filter((cita) => isCurrentMonth(cita.fecha));
    const ingresosMes = citasMes
      .filter((cita) => cita.estado === 'confirmada' || cita.estado === 'completada')
      .reduce((total, cita) => total + toCurrency(cita.precio), 0);

    return {
      barberias: barberiasCount.count ?? 0,
      usuarios: usuariosCount.count ?? 0,
      citasMes: citasMes.length,
      ingresosMes,
    };
  },

  async getAllBarberias(filters: BarberiaFilters = {}): Promise<PaginatedResult<SuperadminBarberiaRow>> {
    ensureSupabase();

    const { data, error } = await (supabase as any)
      .from('barberias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const barberias = (data ?? []) as BarberiaRecord[];
    const adminProfiles = await fetchProfilesByIds(Array.from(new Set(barberias.map((barberia) => barberia.admin_id))));
    const citas = await getAllCitasRaw();
    const citaCountMap = new Map<string, number>();

    citas.forEach((cita) => {
      if (!isCurrentMonth(cita.fecha)) return;
      citaCountMap.set(cita.barberia_id, (citaCountMap.get(cita.barberia_id) ?? 0) + 1);
    });

    const profileMap = new Map(adminProfiles.map((profile) => [profile.id, profile]));

    const rows = barberias.map<SuperadminBarberiaRow>((barberia) => {
      const owner = profileMap.get(barberia.admin_id);
      return {
        id: barberia.id,
        nombre: barberia.nombre,
        ownerName: owner?.full_name || owner?.email || 'Sin asignar',
        ownerEmail: owner?.email || 'Sin correo',
        telefono: barberia.telefono,
        ciudad: barberia.ciudad,
        direccion: barberia.direccion,
        state: getBarberiaState(barberia),
        totalCitasMes: citaCountMap.get(barberia.id) ?? 0,
        createdAt: barberia.created_at,
        raw: barberia,
      };
    });

    const filtered = rows.filter((row) => {
      const matchesName = matchesSearch([row.nombre], filters.search);
      const matchesCity = !filters.city || filters.city === 'all' || row.ciudad === filters.city;
      const matchesState = !filters.state || filters.state === 'all' || row.state === filters.state;
      return matchesName && matchesCity && matchesState;
    });

    return paginate(filtered, filters.page ?? 1, filters.pageSize ?? 8);
  },

  async getBarberiaDetail(barberiaId: string): Promise<SuperadminBarberiaDetail> {
    ensureSupabase();

    const { data, error } = await (supabase as any)
      .from('barberias')
      .select('*')
      .eq('id', barberiaId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('No encontramos la barbería solicitada.');

    const barberia = data as BarberiaRecord;
    const [ownerList, barberos, servicios, citas] = await Promise.all([
      fetchProfilesByIds([barberia.admin_id]),
      supabase.from('barberos').select('id').eq('barberia_id', barberiaId),
      supabase.from('servicios').select('id').eq('barberia_id', barberiaId),
      bookingService.getCitasByBarberia(barberiaId),
    ]);

    const owner = ownerList[0];

    return {
      id: barberia.id,
      nombre: barberia.nombre,
      descripcion: barberia.descripcion,
      logoUrl: barberia.logo_url,
      ownerName: owner?.full_name || owner?.email || 'Sin asignar',
      ownerEmail: owner?.email || 'Sin correo',
      telefono: barberia.telefono,
      ciudad: barberia.ciudad,
      direccion: barberia.direccion,
      state: getBarberiaState(barberia),
      createdAt: barberia.created_at,
      totalBarberos: barberos.count ?? 0,
      totalServicios: servicios.count ?? 0,
      recentCitas: citas.slice(0, 6).map(mapCitaRow),
    };
  },

  async toggleBarberiaStatus(barberiaId: string, activo: boolean) {
    ensureSupabase();

    return safeBarberiaLifecycleUpdate(
      barberiaId,
      activo
        ? { activo: true, visible: true, acepta_reservas: true, estado: 'activa' }
        : { activo: false, visible: true, acepta_reservas: false, estado: 'suspendida' },
      activo
        ? { status: 'active', deleted_at: null }
        : { status: 'suspended', deleted_at: null },
    );
  },

  async softDeleteBarberia(barberiaId: string) {
    ensureSupabase();

    return safeBarberiaLifecycleUpdate(
      barberiaId,
      {
        activo: false,
        visible: false,
        acepta_reservas: false,
        estado: 'suspendida',
      },
      {
        status: 'deleted',
        deleted_at: new Date().toISOString(),
      },
    );
  },

  async getAllUsers(filters: UserFilters = {}): Promise<PaginatedResult<SuperadminUserRow>> {
    ensureSupabase();

    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const profiles = (data ?? []) as ProfileRecord[];
    const barberias = await fetchBarberiasByAdminIds(profiles.filter((profile) => profile.role === 'admin').map((profile) => profile.id));
    const citas = await getAllCitasRaw();

    const barberiaByAdmin = new Map(barberias.map((barberia) => [barberia.admin_id, barberia]));
    const citasByCliente = new Map<string, number>();

    citas.forEach((cita) => {
      citasByCliente.set(cita.cliente_id, (citasByCliente.get(cita.cliente_id) ?? 0) + 1);
    });

    const rows = profiles.map<SuperadminUserRow>((profile) => ({
      id: profile.id,
      nombre: profile.full_name || profile.email,
      email: profile.email,
      role: profile.role,
      createdAt: profile.created_at,
      barberiaNombre: barberiaByAdmin.get(profile.id)?.nombre ?? null,
      totalCitas: profile.role === 'client' ? (citasByCliente.get(profile.id) ?? 0) : 0,
      state: getUserState(profile),
      isPrimarySuperadmin: normalizeText(profile.email) === PRIMARY_SUPERADMIN_EMAIL,
      raw: profile,
    }));

    const filtered = rows.filter((row) => {
      const matchesSearchText = matchesSearch([row.nombre, row.email], filters.search);
      const matchesRole = !filters.role || filters.role === 'all' || row.role === filters.role;
      const matchesState = !filters.state || filters.state === 'all' || row.state === filters.state;
      return matchesSearchText && matchesRole && matchesState;
    });

    return paginate(filtered, filters.page ?? 1, filters.pageSize ?? 8);
  },

  async getUserDetail(userId: string): Promise<SuperadminUserDetail> {
    ensureSupabase();

    const profile = await getProfileOrThrow(userId);
    const [barberias, citas] = await Promise.all([
      fetchBarberiasByAdminIds(profile.role === 'admin' ? [profile.id] : []),
      profile.role === 'client' ? bookingService.getMisCitas(profile.id) : Promise.resolve([] as CitaConDetalles[]),
    ]);

    return {
      id: profile.id,
      nombre: profile.full_name || profile.email,
      email: profile.email,
      role: profile.role,
      createdAt: profile.created_at,
      state: getUserState(profile),
      barberiaNombre: barberias[0]?.nombre ?? null,
      recentCitas: citas.slice(0, 6).map(mapCitaRow),
    };
  },

  async updateUserRole(userId: string, role: UserRole) {
    ensureSupabase();
    const profile = await getProfileOrThrow(userId);
    assertMutableUser(profile);

    // TODO: si las políticas RLS dejan de permitir este cambio directo,
    // mover esta operación a una Edge Function segura con validación server-side.
    const { data, error } = await (supabase as any)
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data as ProfileRecord | null;
  },

  async suspendUser(userId: string) {
    ensureSupabase();
    const profile = await getProfileOrThrow(userId);
    assertMutableUser(profile);

    // TODO: si la suspensión necesita auditoría o privilegios más altos,
    // reemplazar este update por una Edge Function protegida.
    return strictProfileLifecycleUpdate(userId, {
      activo: false,
      status: 'suspended',
      deleted_at: null,
    });
  },

  async softDeleteUser(userId: string) {
    ensureSupabase();
    const profile = await getProfileOrThrow(userId);
    assertMutableUser(profile);

    // TODO: si el flujo de ocultado requiere auditoría centralizada,
    // migrar esta acción a una Edge Function segura.
    return strictProfileLifecycleUpdate(userId, {
      activo: false,
      status: 'deleted',
      deleted_at: new Date().toISOString(),
    });
  },

  async getAllCitas(filters: CitaFilters = {}): Promise<PaginatedResult<SuperadminCitaRow>> {
    ensureSupabase();

    const citas = await getAllCitasRaw();
    const rows = citas.map(mapCitaRow);

    const filtered = rows.filter((row) => {
      const fecha = new Date(row.fecha);
      const matchesSearchText = matchesSearch([row.cliente, row.emailCliente, row.barberia], filters.search);
      const matchesStatus = !filters.estado || filters.estado === 'all' || row.estado === filters.estado;
      const matchesMonth = !filters.month || filters.month === 'all' || fecha.getMonth() + 1 === filters.month;
      const matchesYear = !filters.year || filters.year === 'all' || fecha.getFullYear() === filters.year;
      return matchesSearchText && matchesStatus && matchesMonth && matchesYear;
    });

    return paginate(filtered, filters.page ?? 1, filters.pageSize ?? 10);
  },

  async getCitaDetail(citaId: string): Promise<SuperadminCitaDetail> {
    ensureSupabase();

    const citas = await getAllCitasRaw();
    const cita = citas.find((item) => item.cita_id === citaId);

    if (!cita) {
      throw new Error('No encontramos la cita solicitada.');
    }

    return {
      id: cita.cita_id,
      cliente: cita.nombre_cliente || 'Cliente sin nombre',
      emailCliente: cita.email_cliente,
      barberia: cita.nombre_barberia,
      barbero: cita.nombre_barbero,
      servicio: cita.nombre_servicio,
      precio: toCurrency(cita.precio),
      fecha: cita.fecha,
      horaInicio: cita.hora_inicio,
      horaFin: cita.hora_fin,
      estado: cita.estado,
      notas: cita.notas,
      createdAt: cita.created_at,
    };
  },

  async updateCitaEstado(citaId: string, estado: AppointmentStatus) {
    ensureSupabase();
    return bookingService.adminUpdateEstadoCita(citaId, estado);
  },
};
