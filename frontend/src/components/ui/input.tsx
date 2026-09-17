import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

const field =
  'w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 transition focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none';

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${field} ${className}`} {...props} />
);

export const Select = ({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={`${field} appearance-none ${className}`} {...props}>
    {children}
  </select>
);

export const Label = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-xs font-semibold tracking-wide text-muted uppercase">
    {children}
  </label>
);
