import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-deep disabled:bg-navy/50',
  secondary: 'bg-lavender-soft text-navy hover:bg-lavender disabled:opacity-60',
  ghost: 'bg-transparent text-navy hover:bg-lavender-soft disabled:opacity-60',
  danger: 'bg-chance-low text-chance-low-ink hover:brightness-95 disabled:opacity-60',
};

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant }) => (
  <button
    className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold transition duration-150 focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    {...props}>
    {children}
  </button>
);
