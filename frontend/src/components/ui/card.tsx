import type { HTMLAttributes, ReactNode } from 'react';

export const Card = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) => (
  <div
    className={`rounded-2xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(31,44,90,0.06)] ${className}`}
    {...props}>
    {children}
  </div>
);

export const EmptyState = ({ title, children }: { title: string; children?: ReactNode }) => (
  <Card className="flex flex-col items-center gap-3 py-12 text-center">
    <p className="text-lg font-semibold text-navy">{title}</p>
    {children && <div className="max-w-md text-sm text-muted">{children}</div>}
  </Card>
);

export const ErrorState = ({ message }: { message: string }) => (
  <Card className="border-chance-low bg-chance-low/30 text-sm text-chance-low-ink">{message}</Card>
);

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-lavender-soft ${className}`} aria-hidden="true" />
);
