import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', id, label, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor={inputId}>
        {label ? <span>{label}</span> : null}
        <input
          ref={ref}
          className={[
            'h-11 rounded-xl border border-black/8 bg-white/96 px-3.5 text-sm text-ink shadow-soft outline-none transition-all',
            'placeholder:text-slate-400 focus:border-mint/40 focus:ring-4 focus:ring-mint/10',
            'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
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
