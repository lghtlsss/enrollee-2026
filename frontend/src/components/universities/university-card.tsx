'use client';

import { Card } from '@/src/components/ui/card';
import { Link } from '@/src/components/ui/link';
import { formatRating } from '@/src/utils/functions';
import type { UniversityShort } from '@/src/utils/types';
import { FavoriteButton } from './favorite-button';
import { RatingBlock } from './rating-block';

export const UniversityCard = ({ university }: { university: UniversityShort }) => (
  <Card className="flex items-center gap-4">
    <div
      aria-hidden="true"
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-lavender-soft text-base font-black text-navy">
      {university.name.replace(/[^А-ЯA-Z]/g, '').slice(0, 3) || university.name.slice(0, 2)}
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <Link
        href={`/universities/${university.id}`}
        className="truncate text-lg font-bold text-navy-deep">
        {university.name}
      </Link>
      <p className="text-sm text-muted">{university.city}</p>
      <RatingBlock rating={university.rating} />
    </div>
    <div className="flex shrink-0 flex-col items-end gap-2">
      <span className="text-2xl font-black text-navy">{formatRating(university.rating)}</span>
      <FavoriteButton universityId={university.id} compact />
    </div>
  </Card>
);
