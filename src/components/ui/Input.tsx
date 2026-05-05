import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className = '', id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <input
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
