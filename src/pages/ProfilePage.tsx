import { Camera, Loader2, Mail, ShieldCheck, UserCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Button, Input, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/authService';

function getInitial(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : null;
}

export function ProfilePage() {
  const toast = useToast();
  const { profile, role, user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setAvatarUrl(profile?.avatar_url ?? '');
  }, [profile?.avatar_url, profile?.full_name]);

  const displayEmail = profile?.email || user?.email || 'Sin correo disponible';
  const displayName = fullName.trim() || user?.email || 'Usuario';
  const avatarInitial = getInitial(fullName) ?? getInitial(displayEmail) ?? 'U';
  const previewUrl = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return avatarUrl.trim() || null;
  }, [avatarFile, avatarUrl]);

  useEffect(() => {
    return () => {
      if (avatarFile && previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [avatarFile, previewUrl]);

  async function handleSave() {
    if (!user) return;

    setIsSaving(true);
    try {
      const uploadedAvatarUrl = avatarFile ? await authService.uploadAvatar(avatarFile, user.id) : null;
      await authService.updateUserProfile({
        userId: user.id,
        fullName: fullName.trim() || null,
        avatarUrl: uploadedAvatarUrl || avatarUrl.trim() || null,
      });
      setAvatarFile(null);
      toast.success('Tu perfil fue actualizado.', 'Perfil guardado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible guardar tu perfil.', 'Error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">Cuenta</p>
        <h1 className="text-3xl font-bold text-ink">Mi perfil</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Actualiza tu nombre y foto para que tu perfil se vea claro dentro de Barber Flow.</p>
      </div>

      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-panel lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="space-y-4">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-ink text-3xl font-semibold text-white">
            {previewUrl ? (
              <img alt={displayName} className="h-full w-full object-cover" referrerPolicy="no-referrer" src={previewUrl} />
            ) : (
              avatarInitial
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink/5">
            <Camera size={16} />
            Subir foto
            <input
              accept="image/*"
              className="sr-only"
              onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-ink">{displayName}</h2>
            <p className="text-sm text-slate-500">Gestiona tu informacion de cuenta y revisa tus datos de acceso.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nombre visible" onChange={(event) => setFullName(event.target.value)} placeholder="Tu nombre" value={fullName} />
            <Input label="URL de avatar" onChange={(event) => { setAvatarUrl(event.target.value); setAvatarFile(null); }} placeholder="https://..." value={avatarUrl} />
          </div>

          <Button disabled={isSaving || !user} onClick={() => void handleSave()} type="button">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <UserCircle2 size={18} />}
            {isSaving ? 'Guardando...' : 'Guardar perfil'}
          </Button>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard icon={<Mail size={18} />} label="Correo" value={displayEmail} />
            <InfoCard icon={<ShieldCheck size={18} />} label="Rol" value={role ?? 'Sin rol'} />
            <InfoCard icon={<UserCircle2 size={18} />} label="Nombre" value={fullName.trim() || 'Sin nombre configurado'} />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-steel">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm font-semibold text-ink">{value}</p>
    </article>
  );
}
