'use client';

import { useFavorites, useToggleFavorite, useUser } from '@/src/hooks/use-auth';
import { useRouter } from 'next/navigation';

export const FavoriteButton = ({
  universityId,
  compact = false,
}: {
  universityId: number;
  compact?: boolean;
}) => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const { data: favorites } = useFavorites(isAuthenticated);
  const toggle = useToggleFavorite();

  const isFavorite = favorites?.some(f => f.id === universityId) ?? false;

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=/universities/${universityId}`);
      return;
    }
    toggle.mutate({ id: universityId, isFavorite });
  };

  const label = isFavorite ? 'Убрать из избранного' : 'В избранное';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-pressed={isFavorite}
      aria-label={label}
      title={!isAuthenticated ? 'Войдите, чтобы сохранять вузы' : label}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-pill border text-xs font-semibold transition disabled:opacity-60 ${
        compact ? 'px-2.5 py-1' : 'px-4 py-2 text-sm'
      } ${
        isFavorite
          ? 'border-navy bg-navy text-white hover:bg-navy-deep'
          : 'border-line bg-paper text-navy hover:bg-lavender-soft'
      }`}>
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        aria-hidden="true"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2">
        <path
          d="M12 21s-7-4.6-9.2-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.2 12C19 16.4 12 21 12 21z"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && label}
      {compact && (isFavorite ? 'Сохранено' : 'Сохранить')}
    </button>
  );
};
