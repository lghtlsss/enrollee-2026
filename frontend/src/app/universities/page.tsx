import { UniversitiesList } from '@/src/components/universities/universities-list';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Вузы — UniVibe' };

export default function UniversitiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-deep sm:text-3xl">Все вузы</h1>
        <p className="mt-1 text-sm text-muted">
          Каталог университетов с рейтингом, вайбом и отзывами студентов.
        </p>
      </div>
      <Suspense>
        <UniversitiesList />
      </Suspense>
    </div>
  );
}
