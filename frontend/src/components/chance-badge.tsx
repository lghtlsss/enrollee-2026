import { CHANCE_META } from '@/src/utils/constants';
import type { Chance } from '@/src/utils/types';

const LEVELS: Chance[] = ['high', 'medium', 'low'];

// Три полосы, как на макете: активная зона яркая, остальные приглушены.
export const ChanceBadge = ({ chance, compact = false }: { chance: Chance; compact?: boolean }) => {
  const meta = CHANCE_META[chance];
  return (
    <div
      className={`flex flex-col ${compact ? 'gap-1' : 'gap-1.5'}`}
      role="img"
      aria-label={meta.label}>
      {LEVELS.map(level => {
        const active = level === chance;
        return (
          <div
            key={level}
            className={`h-2.5 rounded-pill transition ${CHANCE_META[level].bar} ${
              active ? 'opacity-100' : 'opacity-25'
            } ${compact ? 'w-16' : 'w-24 sm:w-32'}`}
          />
        );
      })}
      {!compact && <span className={`mt-1 text-xs font-semibold ${meta.ink}`}>{meta.label}</span>}
    </div>
  );
};

export const ChancePill = ({ chance }: { chance: Chance }) => {
  const meta = CHANCE_META[chance];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill px-3 py-1 text-xs font-semibold ${meta.bar} ${meta.ink}`}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {meta.label}
    </span>
  );
};
