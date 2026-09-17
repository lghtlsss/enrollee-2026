import { RecommendationsList } from '@/src/components/recommendations/recommendations-list';
import { EmptyState } from '@/src/components/ui/card';
import { Link } from '@/src/components/ui/link';
import { requestToSearchParams, searchParamsToRequest } from '@/src/utils/functions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Рекомендации — UniVibe' };

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const request = searchParamsToRequest(await searchParams);

  if (!request) {
    return (
      <EmptyState title="Сначала введите баллы">
        <Link href="/">Перейти к подбору</Link>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-deep sm:text-3xl">Ваши рекомендации</h1>
          <p className="mt-1 text-sm text-muted">
            {Object.entries(request.scores)
              .map(([subject, score]) => `${subject} ${score}`)
              .join(' · ')}
            {request.city ? ` · ${request.city}` : ''}
            {request.budget_only ? ' · только бюджет' : ''}
          </p>
        </div>
        <Link href={`/?${requestToSearchParams(request)}`} className="text-sm">
          Изменить баллы
        </Link>
      </div>
      <RecommendationsList request={request} />
    </div>
  );
}
