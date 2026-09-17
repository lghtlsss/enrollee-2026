'use client';

import { useFavorites } from '@/hooks/use-auth';
import { pluralize } from '@/utils/functions';
import { EmptyState, ErrorState, Skeleton } from '../ui/card';
import { Link } from '../ui/link';
import { UniversityCard } from '../universities/university-card';

export const FavoritesList = () => {
  const { data, isPending, error } = useFavorites(true);

  if (isPending) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={`Не удалось загрузить избранное: ${error.message}`} />;
  }

  if (!data.length) {
    return (
      <EmptyState title="Пока пусто">
        <p>Добавляйте вузы в избранное, чтобы вернуться к ним позже.</p>
        <div className="mt-4 flex justify-center">
          <Link
            href="/universities"
            className="rounded-pill bg-navy px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-navy-deep">
            Смотреть вузы
          </Link>
        </div>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        {data.length} {pluralize(data.length, ['вуз', 'вуза', 'вузов'])} в избранном
      </p>
      <ul className="flex flex-col gap-3">
        {data.map(university => (
          <li key={university.id}>
            <UniversityCard university={university} />
          </li>
        ))}
      </ul>
    </div>
  );
};
