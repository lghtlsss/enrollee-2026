'use client';
import { getUser } from '@/utils/functions';
import { useQuery } from '@tanstack/react-query';
import { Link } from './ui/link';

export const Header = () => {
  const { data, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
  return (
    <header className="flex h-20 items-center justify-between border-b-2 p-2">
      <Link href="/">
        <p className="text-xl">Название</p>
      </Link>
      <div className="flex gap-2">
        {isPending ? (
          <>
            <Link href="/login">Войти</Link>
            <Link href="/register">Зарегистрироваться</Link>
          </>
        ) : data?.id == -1 ? (
          <>
            <Link href="/login">Войти</Link>
            <Link href="/register">Зарегистрироваться</Link>
          </>
        ) : (
          <div>Профиль</div>
        )}
      </div>
    </header>
  );
};
