'use client';

import { api } from '@/utils/api';
import { pluralize } from '@/utils/functions';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { EmptyState, ErrorState, Skeleton } from '../ui/card';
import { Input } from '../ui/input';
import { UniversityCard } from './university-card';

const PAGE_SIZE = 6;

export const UniversitiesList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const page = Math.max(1, Number(params.get('page') ?? 1));
  const search = params.get('search') ?? '';
  const city = params.get('city') ?? '';
  const [draft, setDraft] = useState({ search, city });

  const { data, isPending, error } = useQuery({
    queryKey: ['universities', { page, search, city }],
    queryFn: () =>
      api.universities.list({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: search || undefined,
        city: city || undefined,
      }),
  });

  const navigate = (next: { page?: number; search?: string; city?: string }) => {
    const query = new URLSearchParams();
    const s = next.search ?? search;
    const c = next.city ?? city;
    const p = next.page ?? 1;
    if (s) query.set('search', s);
    if (c) query.set('city', c);
    if (p > 1) query.set('page', String(p));
    router.push(`${pathname}${query.size ? `?${query}` : ''}`);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate({ search: draft.search.trim(), city: draft.city.trim(), page: 1 });
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row" role="search">
        <Input
          aria-label="Поиск по названию"
          placeholder="Название вуза"
          value={draft.search}
          onChange={e => setDraft({ ...draft, search: e.target.value })}
        />
        <Input
          aria-label="Город"
          placeholder="Город"
          value={draft.city}
          onChange={e => setDraft({ ...draft, city: e.target.value })}
          className="sm:max-w-56"
        />
        <Button type="submit" variant="secondary">
          Найти
        </Button>
      </form>

      {isPending ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={`Не удалось загрузить вузы: ${error.message}`} />
      ) : !data.items.length ? (
        <EmptyState title="Ничего не найдено">Измените запрос или сбросьте фильтры.</EmptyState>
      ) : (
        <>
          <p className="text-sm text-muted">
            {data.total} {pluralize(data.total, ['вуз', 'вуза', 'вузов'])}
          </p>
          <ul className="flex flex-col gap-3">
            {data.items.map(u => (
              <li key={u.id}>
                <UniversityCard university={u} />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <nav aria-label="Страницы" className="mx-auto flex items-center gap-3">
              <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => navigate({ page: page - 1 })}>
                Назад
              </Button>
              <span className="text-sm text-muted">
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => navigate({ page: page + 1 })}>
                Вперёд
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};
