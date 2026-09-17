'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { DEADLINES, type Deadline } from '@/utils/deadlines';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tracked-deadlines';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));

const daysUntil = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(`${date}T00:00:00`);
  return Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
};

const urgencyClass = (days: number) =>
  days <= 14
    ? 'bg-chance-low/30 text-chance-low-ink'
    : days <= 45
      ? 'bg-chance-medium/30 text-chance-medium-ink'
      : 'bg-chance-high/30 text-chance-high-ink';

export const DeadlinesList = () => {
  const [tracked, setTracked] = useState<string[]>([]);
  const [onlyTracked, setOnlyTracked] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setTracked(JSON.parse(saved) as string[]);
  }, []);

  const toggleTracked = (id: string) => {
    const next = tracked.includes(id) ? tracked.filter(item => item !== id) : [...tracked, id];
    setTracked(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const visibleDeadlines = useMemo(
    () => (onlyTracked ? DEADLINES.filter(deadline => tracked.includes(deadline.id)) : DEADLINES),
    [onlyTracked, tracked],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Следите за сроками подачи документов и не пропускайте важные даты.
        </p>
        <Button
          type="button"
          variant={onlyTracked ? 'primary' : 'secondary'}
          onClick={() => setOnlyTracked(value => !value)}>
          {onlyTracked ? 'Все дедлайны' : 'Только отслеживаемые'}
        </Button>
      </div>

      {!visibleDeadlines.length ? (
        <Card className="text-center text-sm text-muted">
          Вы ещё не добавили дедлайны в отслеживание.
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {visibleDeadlines.map(deadline => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              isTracked={tracked.includes(deadline.id)}
              onToggle={() => toggleTracked(deadline.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const DeadlineCard = ({
  deadline,
  isTracked,
  onToggle,
}: {
  deadline: Deadline;
  isTracked: boolean;
  onToggle: () => void;
}) => {
  const days = daysUntil(deadline.date);
  const daysLabel = days < 0 ? 'Срок прошёл' : days === 0 ? 'Сегодня' : `Осталось ${days} дн.`;

  return (
    <li>
      <Card className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-navy-deep">{deadline.university}</p>
            <p className="mt-1 text-sm text-muted">{deadline.city}</p>
          </div>
          <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${urgencyClass(days)}`}>
            {daysLabel}
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy">{deadline.type}</p>
          <p className="mt-1 text-lg font-bold text-navy-deep">{formatDate(deadline.date)}</p>
          <p className="mt-1 text-sm text-muted">{deadline.description}</p>
        </div>

        <Button type="button" variant={isTracked ? 'primary' : 'secondary'} onClick={onToggle}>
          {isTracked ? 'Отслеживается' : 'Отслеживать'}
        </Button>
      </Card>
    </li>
  );
};
