'use client';

import { useLogout, useUser } from '@/src/hooks/use-auth';
import { NAV_ITEMS } from '@/src/utils/constants';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const isActive = (pathname: string, href: string) =>
  href === '/'
    ? pathname === '/' || pathname.startsWith('/recommendations')
    : pathname.startsWith(href);

export const Header = () => {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const logout = useLogout();

  return (
    <header className="flex flex-col">
      <div className="bg-lavender">
        <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-4 px-4 py-6 sm:px-6 sm:py-8">
          <NextLink href="/" className="group flex flex-col">
            <span className="text-5xl leading-none font-black tracking-tight text-navy-deep sm:text-7xl">
              UniVibe
            </span>
            <span className="mt-2 text-sm font-medium text-navy/80 sm:text-base">
              Компас абитуриента: шансы, вайб и дедлайны
            </span>
          </NextLink>

          <nav aria-label="Аккаунт" className="flex shrink-0 items-center gap-2 pt-1">
            {isLoading ? (
              <span
                className="h-10 w-28 animate-pulse rounded-pill bg-paper/60"
                aria-hidden="true"
              />
            ) : user ? (
              <>
                <NextLink
                  href="/profile"
                  className="rounded-pill bg-paper px-4 py-2 text-sm font-semibold text-navy transition hover:bg-white">
                  {user.name}
                </NextLink>
                <Button variant="ghost" onClick={logout} className="hidden sm:inline-flex">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <NextLink
                  href="/login"
                  className="hidden rounded-pill px-4 py-2 text-sm font-semibold text-navy transition hover:bg-paper/60 sm:inline-flex">
                  Войти
                </NextLink>
                <NextLink
                  href="/register"
                  className="rounded-pill bg-paper px-4 py-2 text-sm font-semibold text-navy transition hover:bg-white">
                  Регистрация
                </NextLink>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="bg-cream px-4 pt-5 sm:px-6">
        <nav
          aria-label="Разделы"
          className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-2 rounded-2xl border-2 border-lavender bg-paper p-2 sm:grid-cols-3 sm:gap-3 sm:p-3">
          {NAV_ITEMS.map(item => {
            const active = isActive(pathname, item.href);
            return (
              <NextLink
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-pill px-4 py-3 text-center text-sm font-semibold transition sm:text-base ${
                  active
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-lavender-soft text-navy hover:bg-lavender'
                }`}>
                {item.label}
              </NextLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
