import { X } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

/* =========================================================
   Modal — editorial dialog primitive
   ========================================================= */

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
} as const;

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof sizes;
  tone?: 'light' | 'dark';
};

export function Modal({
  open,
  onClose,
  title,
  description,
  eyebrow,
  children,
  footer,
  size = 'md',
  tone = 'light',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  if (!open) return null;

  const isDark = tone === 'dark';

  return (
    <div
      aria-hidden={!open}
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
    >
      <button
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-ink/72 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div
        className={[
          'relative w-full overflow-hidden rounded-[28px] border shadow-[0_40px_100px_rgba(0,0,0,0.55)] animate-fade-up',
          sizes[size],
          isDark
            ? 'border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.98),rgba(20,18,16,1))] text-cream'
            : 'border-ink/8 bg-paper text-ink',
        ].join(' ')}
      >
        <button
          aria-label="Cerrar"
          className={[
            'absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border transition-colors',
            isDark
              ? 'border-white/10 bg-white/5 text-cream/70 hover:border-gold-500/40 hover:bg-gold-500/12 hover:text-gold-300'
              : 'border-ink/8 bg-ink/4 text-ink/55 hover:border-ink/20 hover:bg-ink/8 hover:text-ink',
          ].join(' ')}
          onClick={onClose}
          type="button"
        >
          <X size={16} />
        </button>

        <div className="px-7 pb-7 pt-8 sm:px-9 sm:pt-10">
          {eyebrow ? (
            <div className={`eyebrow mb-3 ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>
              {eyebrow}
            </div>
          ) : null}
          {title ? (
            <h2
              className={`font-display text-2xl font-semibold tracking-tight sm:text-3xl ${
                isDark ? 'text-cream' : 'text-ink'
              }`}
            >
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-cream/68' : 'text-ink/60'}`}>
              {description}
            </p>
          ) : null}
          {children ? <div className={title || description ? 'mt-6' : ''}>{children}</div> : null}
        </div>

        {footer ? (
          <div
            className={[
              'flex flex-col-reverse gap-3 border-t px-7 py-5 sm:flex-row sm:justify-end sm:px-9',
              isDark ? 'border-white/8 bg-white/[0.02]' : 'border-ink/8 bg-ink/[0.02]',
            ].join(' ')}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
