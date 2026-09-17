import { DeadlinesList } from '@/components/deadlines/deadlines-list';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Дедлайны — UniVibe' };

export default function DeadlinesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-deep sm:text-3xl">Дедлайны</h1>
        <p className="mt-1 text-sm text-muted">
          Сохраняйте важные даты поступления и возвращайтесь к ним в любой момент.
        </p>
      </div>
      <DeadlinesList />
    </div>
  );
}
