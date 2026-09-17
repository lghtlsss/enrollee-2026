import { VIBE_META } from '@/src/utils/constants';
import type { Vibe } from '@/src/utils/types';

const tone = (value: number) =>
  value >= 4.3 ? 'bg-chance-high' : value >= 3.8 ? 'bg-chance-medium' : 'bg-chance-low';

export const VibeBars = ({ vibe, max = 5 }: { vibe: Vibe | null; max?: number }) => {
  if (!vibe) return <p className="text-sm text-muted">Вуз ещё не собрал оценки студентов.</p>;
  return (
    <dl className="flex flex-col gap-3">
      {VIBE_META.map(({ key, label }) => {
        const value = vibe[key];
        if (value === null) return null;
        return (
          <div
            key={key}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1">
            <dt className="text-sm font-medium text-ink">{label}</dt>
            <dd className="text-sm font-semibold text-navy">{value.toFixed(1)}</dd>
            <div
              className="col-span-2 h-2.5 overflow-hidden rounded-pill bg-lavender-soft"
              role="meter"
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={value}>
              <div
                className={`h-full rounded-pill ${tone(value)}`}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </dl>
  );
};
