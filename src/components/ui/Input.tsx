import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', id, label, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={inputId}>
        {label ? <span>{label}</span> : null}
        <input
          ref={ref}
          className={[
            'h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-ink shadow-sm',
            'placeholder:text-slate-400 focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20',
            className,
          ].join(' ')}
          id={inputId}
          {...props}
        />
      </label>
    );
  }
);

Input.displayName = 'Input';
