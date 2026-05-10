import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

/* Input — UI/UX Pro Max v2 (editorial, focus-visible refined) */

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', id, label, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="grid gap-2 text-sm font-medium text-ink/70" htmlFor={inputId}>
        {label ? (
          <span className="eyebrow text-ink/55">{label}</span>
        ) : null}
        <input
          ref={ref}
          className={[
            'h-12 rounded-2xl border border-ink/10 bg-paper px-4 text-[0.95rem] text-ink shadow-soft outline-none',
            'transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
            'placeholder:text-ink/35 hover:border-ink/22 focus:border-gold-500/70 focus:ring-4 focus:ring-gold-200/50 focus:-translate-y-px',
            'disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink/40',
            className,
          ].join(' ')}
          id={inputId}
          {...props}
        />
      </label>
    );
  },
);

Input.displayName = 'Input';
