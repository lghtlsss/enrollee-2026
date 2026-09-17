import type { ReactNode } from 'react';
import { Card } from '../ui/card';

export const AuthCard = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) => (
  <div className="mx-auto flex w-full max-w-md flex-col gap-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-navy-deep sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </div>
    <Card>{children}</Card>
    <p className="text-center text-sm text-muted">{footer}</p>
  </div>
);
