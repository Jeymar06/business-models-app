import { CircleHelp, KeyRound, Loader2, LogOut, UserCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';

function getInitial(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : null;
}

export function ProfileMenu() {
  const { profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fallbackInitial = useMemo(
    () => getInitial(profile?.full_name) ?? getInitial(profile?.email) ?? 'U',
    [profile?.email, profile?.full_name],
  );

  const displayName = profile?.full_name?.trim() || profile?.email || 'Usuario';
  const secondaryText = profile?.full_name?.trim() ? profile.email : 'Mi cuenta';

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await signOut();
      setIsOpen(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No fue posible cerrar sesion.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-controls="profile-menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-3 rounded-full border border-slate-200 bg-white pl-1 pr-3 text-left transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-ink text-sm font-semibold text-white">
          {profile?.avatar_url ? (
            <img alt={displayName} className="h-full w-full object-cover" referrerPolicy="no-referrer" src={profile.avatar_url} />
          ) : (
            fallbackInitial
          )}
        </span>
        <span className="hidden min-w-0 md:block">
          <span className="block truncate text-sm font-semibold text-ink">{displayName}</span>
          <span className="block truncate text-xs text-slate-500">{secondaryText}</span>
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70"
          id="profile-menu"
          role="menu"
        >
          <div className="border-b border-slate-100 px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{profile?.email}</p>
          </div>

          <div className="py-2">
            <MenuLink icon={<UserCircle2 size={16} />} label="Mi perfil" onSelect={() => setIsOpen(false)} to="/profile" />
            <MenuLink icon={<KeyRound size={16} />} label="Cambiar contraseña" onSelect={() => setIsOpen(false)} to="/change-password" />
            <MenuLink icon={<CircleHelp size={16} />} label="Ayuda y soporte" onSelect={() => setIsOpen(false)} to="/support" />
          </div>

          <div className="border-t border-slate-100 pt-2">
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
              disabled={isSigningOut}
              onClick={() => void handleSignOut()}
              role="menuitem"
              type="button"
            >
              {isSigningOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
              {isSigningOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  icon,
  label,
  onSelect,
  to,
}: {
  icon: ReactNode;
  label: string;
  onSelect: () => void;
  to: string;
}) {
  return (
    <Link
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel"
      onClick={onSelect}
      role="menuitem"
      to={to}
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}
