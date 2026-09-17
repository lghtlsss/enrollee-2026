import type { Review } from '@/utils/types';
import { RatingBlock } from './rating-block';

export const ReviewCard = ({ review }: { review: Review }) => (
  <article className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4">
    <header className="flex items-center justify-between gap-2">
      <span className="text-sm font-semibold text-navy">{review.author}</span>
      <RatingBlock rating={review.rating} />
    </header>
    <p className="text-sm text-ink">{review.text}</p>
    {review.tags.length > 0 && (
      <ul className="flex flex-wrap gap-1.5" aria-label="Теги">
        {review.tags.map(tag => (
          <li
            key={tag}
            className="rounded-pill bg-lavender-soft px-2.5 py-0.5 text-xs font-medium text-navy">
            #{tag}
          </li>
        ))}
      </ul>
    )}
    <time dateTime={review.created_at} className="text-xs text-muted">
      {new Date(review.created_at).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </time>
  </article>
);
