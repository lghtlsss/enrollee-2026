'use client';

import { ChanceBadge } from '@/components/chance-badge';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { FavoriteButton } from '@/components/universities/favorite-button';
import { CHANCE_META } from '@/utils/constants';
import { formatMoney } from '@/utils/functions';
import type { RecommendationItem } from '@/utils/types';

const Initials = ({ name }: { name: string }) => (
  <div
    aria-hidden="true"
    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-lavender-soft text-lg font-black text-navy sm:h-20 sm:w-20">
    {name.replace(/[^А-ЯA-Z]/g, '').slice(0, 3) || name.slice(0, 2)}
  </div>
);

export const RecommendationCard = ({ item }: { item: RecommendationItem }) => {
  const diff = item.passing_score === null ? null : item.user_total - item.passing_score;
  const meta = CHANCE_META[item.chance];

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <Initials name={item.university_name} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Link
            href={`/universities/${item.university_id}`}
            className="text-lg font-bold text-navy-deep">
            {item.university_name}
          </Link>
          <FavoriteButton universityId={item.university_id} compact />
        </div>
        <p className="text-sm font-medium text-ink">{item.program_name}</p>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted">Ваши баллы</dt>
            <dd className="font-semibold">{item.user_total}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Проходной 2025</dt>
            <dd className="font-semibold">{item.passing_score ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Бюджетных мест</dt>
            <dd className="font-semibold">{item.budget_places ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Платно, в год</dt>
            <dd className="font-semibold">{formatMoney(item.tuition_cost)}</dd>
          </div>
        </dl>

        <p className={`text-xs font-medium ${meta.ink}`}>
          {diff === null
            ? meta.hint
            : diff >= 0
              ? `+${diff} к проходному. ${meta.hint}`
              : `${diff} до проходного. ${meta.hint}`}
        </p>
      </div>

      <div className="shrink-0 sm:pl-2">
        <ChanceBadge chance={item.chance} />
      </div>
    </Card>
  );
};
