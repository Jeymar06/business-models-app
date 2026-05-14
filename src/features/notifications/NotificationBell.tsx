import { Bell, CalendarCheck2, CheckCheck, Loader2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNotifications } from './useNotifications';

export function NotificationBell() {
  const { role, user } = useAuth();
  const { isLoading, isMarking, markAllAsRead, markAsRead, notifications, unreadCount } = useNotifications(user?.id);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const [panelStyle, setPanelStyle] = useState<CSSProperties>();

  const targetPath = useMemo(() => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'superadmin') return '/superadmin-dashboard';
    return '/client-dashboard';
  }, [role]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function updatePanelPosition() {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      setPanelStyle({
        position: 'fixed',
        top: rect.bottom + 12,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    updatePanelPosition();
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [isOpen]);

  async function handleNotificationClick(notificationId: string, isRead: boolean) {
    if (!isRead) {
      await markAsRead(notificationId);
    }
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-controls="notifications-menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={unreadCount ? `${unreadCount} notificaciones sin leer` : 'Notificaciones'}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-cream transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
        onClick={() => setIsOpen((current) => !current)}
        ref={buttonRef}
        type="button"
      >
        <Bell size={18} />
        {unreadCount ? (
          <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[0.65rem] font-bold leading-none text-ink ring-2 ring-ink">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="surface-panel z-[70] w-[min(calc(100vw-1rem),24rem)] rounded-3xl p-2 text-ink"
          id="notifications-menu"
          role="menu"
          style={panelStyle}
        >
          <div className="rounded-[20px] bg-[#111111] px-4 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow text-gold-300">Notificaciones</p>
                <p className="mt-2 text-sm text-white/62">
                  {unreadCount ? `${unreadCount} sin leer` : 'Todo al dia'}
                </p>
              </div>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                disabled={!unreadCount || isMarking}
                onClick={() => void markAllAsRead()}
                title="Marcar todas como leidas"
                type="button"
              >
                {isMarking ? <Loader2 className="animate-spin" size={16} /> : <CheckCheck size={16} />}
              </button>
            </div>
          </div>

          <div className="max-h-[26rem] overflow-y-auto py-2">
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-4 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={16} />
                Cargando notificaciones...
              </div>
            ) : null}

            {!isLoading && !notifications.length ? (
              <div className="px-3 py-6 text-center text-sm leading-6 text-slate-500">
                No tienes notificaciones todavia.
              </div>
            ) : null}

            {notifications.map((notification) => {
              const isRead = Boolean(notification.leido_at);

              return (
                <Link
                  className={[
                    'group block rounded-2xl px-3 py-3 transition hover:bg-black/4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/5',
                    isRead ? 'opacity-72' : 'bg-gold-500/8',
                  ].join(' ')}
                  key={notification.id}
                  onClick={() => void handleNotificationClick(notification.id, isRead)}
                  role="menuitem"
                  to={targetPath}
                >
                  <div className="flex gap-3">
                    <span
                      className={[
                        'mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full border',
                        isRead ? 'border-black/8 bg-black/3 text-steel' : 'border-gold-500/24 bg-gold-500/12 text-gold-700',
                      ].join(' ')}
                    >
                      <CalendarCheck2 size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">
                        {notification.titulo || 'Notificacion'}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        {notification.mensaje || 'Tienes una actualizacion en Barber Flow.'}
                      </span>
                      <span className="numeric mt-2 block text-xs text-slate-400">
                        {formatNotificationDate(notification.created_at)}
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatNotificationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
