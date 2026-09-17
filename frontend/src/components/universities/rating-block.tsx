export const RatingBlock = ({ rating, max = 5 }: { rating: number | null; max?: number }) => {
  if (rating === null) return <span className="text-xs text-muted">Рейтинг не указан</span>;
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Рейтинг ${rating.toFixed(1)} из ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < filled ? 'text-navy' : 'text-line'}`}
          fill="currentColor"
          aria-hidden="true">
          <path d="M12 2.5l2.9 6.2 6.7.8-5 4.6 1.3 6.7L12 17.5l-5.9 3.3 1.3-6.7-5-4.6 6.7-.8z" />
        </svg>
      ))}
    </div>
  );
};
