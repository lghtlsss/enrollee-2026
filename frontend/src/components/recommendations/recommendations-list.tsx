'use client';

import { useLastRequest } from '@/src/hooks/use-auth';
import { api } from '@/src/utils/api';
import { CHANCE_META } from '@/src/utils/constants';
import { pluralize, requestToSearchParams } from '@/src/utils/functions';
import type { Chance, RecommendationRequest } from '@/src/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { EmptyState, ErrorState, Skeleton } from '../ui/card';
import { Link } from '../ui/link';
import { RecommendationCard } from './recommendation-card';

const FILTERS: { value: Chance | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
];

export const RecommendationsList = ({ request }: { request: RecommendationRequest }) => {
  const [filter, setFilter] = useState<Chance | 'all'>('all');
  const { setLastRequest } = useLastRequest();

  useEffect(() => setLastRequest(request), [request, setLastRequest]);

  const { data, isPending, error } = useQuery({
    queryKey: ['recommendations', request],
    queryFn: () => api.recommendations(request),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Загрузка рекомендаций">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={`Не удалось получить рекомендации: ${error.message}`} />;

  if (!data.items.length) {
    return (
      <EmptyState title="Подходящих программ не нашлось">
        Попробуйте убрать фильтр по городу или направлению, либо добавить ещё один предмет ЕГЭ.{' '}
        <Link href={`/?${requestToSearchParams(request)}`}>Изменить параметры</Link>
      </EmptyState>
    );
  }

  const counts = data.items.reduce<Record<string, number>>((acc, item) => {
    acc[item.chance] = (acc[item.chance] ?? 0) + 1;
    return acc;
  }, {});
  const visible = filter === 'all' ? data.items : data.items.filter(item => item.chance === filter);
  const total = Object.values(request.scores).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Найдено {data.total} {pluralize(data.total, ['программа', 'программы', 'программ'])} ·
          сумма ваших баллов <span className="font-semibold text-ink">{total}</span> по{' '}
          {Object.keys(request.scores).length}{' '}
          {pluralize(Object.keys(request.scores).length, ['предмету', 'предметам', 'предметам'])}
        </p>
        <div
          role="tablist"
          aria-label="Фильтр по шансу"
          className="flex flex-wrap gap-1 rounded-pill bg-lavender-soft p-1">
          {FILTERS.map(f => {
            const count = f.value === 'all' ? data.total : (counts[f.value] ?? 0);
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-semibold transition ${
                  active ? 'bg-navy text-white' : 'text-navy hover:bg-lavender'
                }`}>
                {f.value !== 'all' && (
                  <span
                    className={`h-2 w-2 rounded-full ${CHANCE_META[f.value].bar}`}
                    aria-hidden="true"
                  />
                )}
                {f.label} <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {visible.map(item => (
          <li key={item.program_id}>
            <RecommendationCard item={item} />
          </li>
        ))}
      </ul>
      {!visible.length && <EmptyState title="В этой зоне программ нет" />}
    </div>
  );
};
