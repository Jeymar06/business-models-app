import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/* =========================================================
   Toast — editorial notification system
   Provides useToast() with success/error/info variants
   ========================================================= */

type ToastVariant = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  push: (item: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<
  ToastVariant,
  { ring: string; icon: ReactNode; accent: string }
> = {
  success: {
    ring: 'border-mint/30 bg-[#141210]/96',
    icon: <CheckCircle2 size={18} />,
    accent: 'text-mint',
  },
  error: {
    ring: 'border-danger/35 bg-[#141210]/96',
    icon: <AlertCircle size={18} />,
    accent: 'text-danger',
  },
  info: {
    ring: 'border-gold-500/30 bg-[#141210]/96',
    icon: <Info size={18} />,
    accent: 'text-gold-300',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback<ToastContextValue['push']>(
    (item) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const next: ToastItem = { id, ...item };
      setToasts((prev) => [...prev, next]);
      window.setTimeout(() => remove(id), 4800);
    },
    [remove],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      push,
      success: (message, title) => push({ message, title, variant: 'success' }),
      error: (message, title) => push({ message, title, variant: 'error' }),
      info: (message, title) => push({ message, title, variant: 'info' }),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3"
      >
        {toasts.map((toast) => {
          const meta = variantStyles[toast.variant];
          return (
            <div
              key={toast.id}
              className={[
                'pointer-events-auto relative overflow-hidden rounded-2xl border px-4 py-3 text-cream shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl',
                'animate-fade-up',
                meta.ring,
              ].join(' ')}
              role="status"
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 ${meta.accent}`}>{meta.icon}</span>
                <div className="flex-1 space-y-0.5">
                  {toast.title ? (
                    <p className="font-display text-sm font-semibold tracking-tight text-cream">
                      {toast.title}
                    </p>
                  ) : null}
                  <p className="text-sm leading-6 text-cream/72">{toast.message}</p>
                </div>
                <button
                  aria-label="Cerrar"
                  className="text-cream/40 transition-colors hover:text-cream"
                  onClick={() => remove(toast.id)}
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
