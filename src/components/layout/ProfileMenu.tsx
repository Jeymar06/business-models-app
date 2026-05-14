import { CircleHelp, KeyRound, Loader2, LogOut, UserCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { isRenderableMediaUrl } from '@/utils/media';

function getInitial(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : null;
}

export function ProfileMenu() {
  const { profile, signOut, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const profileEmail = profile?.email || user?.email || null;

  const fallbackInitial = useMemo(
    () => getInitial(profile?.full_name) ?? getInitial(profileEmail) ?? 'U',
    [profile?.full_name, profileEmail],
  );

  const displayName = profile?.full_name?.trim() || profileEmail || 'Usuario';
  const secondaryText = profile?.full_name?.trim() ? profileEmail : 'Mi cuenta';
  const avatarUrl = isRenderableMediaUrl(profile?.avatar_url) ? profile?.avatar_url!.trim() : null;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
        className="flex h-10 max-w-[12.5rem] items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/6 pl-1 pr-2 text-left text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10 lg:max-w-[14.5rem] lg:gap-3 lg:pr-3"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#202020] text-sm font-semibold text-white">
          {avatarUrl ? (
            <img alt={displayName} className="h-full w-full object-cover" referrerPolicy="no-referrer" src={avatarUrl} />
          ) : (
            fallbackInitial
          )}
        </span>
        <span className="hidden min-w-0 lg:block">
          <span className="block truncate text-sm font-semibold text-white">{displayName}</span>
          <span className="block truncate text-xs text-white/56">{secondaryText}</span>
        </span>
      </button>

      {isOpen ? (
        <div
          className="surface-panel absolute right-0 top-[calc(100%+0.85rem)] z-30 w-[min(calc(100vw-1rem),18rem)] rounded-3xl p-2 text-ink sm:w-72"
          id="profile-menu"
          role="menu"
        >
          <div className="rounded-[20px] bg-[#111111] px-4 pb-4 pt-3 text-white">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-white/60">{profileEmail || 'Sin correo disponible'}</p>
          </div>

          <div className="py-2">
            <MenuLink icon={<UserCircle2 size={16} />} label="Mi perfil" onSelect={() => setIsOpen(false)} to="/profile" />
            <MenuLink icon={<KeyRound size={16} />} label="Cambiar contraseña" onSelect={() => setIsOpen(false)} to="/change-password" />
            <MenuLink icon={<CircleHelp size={16} />} label="Ayuda y soporte" onSelect={() => setIsOpen(false)} to="/support" />
          </div>

          <div className="border-t border-black/6 pt-2">
            <button
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/10"
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
      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-black/4 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/5"
      onClick={onSelect}
      role="menuitem"
      to={to}
    >
      <span className="text-steel">{icon}</span>
      {label}
    </Link>
  );
}
