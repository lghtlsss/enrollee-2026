'use client';

import { useUser } from '@/src/hooks/use-auth';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { EmptyState, Skeleton } from '../ui/card';

export const AuthGate = ({
  children,
  title,
  description,
  next,
}: {
  children: ReactNode;
  title: string;
  description: string;
  next: string;
}) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) return <Skeleton className="h-40" />;

  if (!isAuthenticated) {
    return (
      <EmptyState title={title}>
        <p>{description}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <NextLink
            href={`/login?next=${encodeURIComponent(next)}`}
            className="rounded-pill bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep">
            Войти
          </NextLink>
          <NextLink
            href={`/register?next=${encodeURIComponent(next)}`}
            className="rounded-pill bg-lavender-soft px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-lavender">
            Регистрация
          </NextLink>
        </div>
      </EmptyState>
    );
  }

  return <>{children}</>;
};
