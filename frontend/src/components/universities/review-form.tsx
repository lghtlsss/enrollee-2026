'use client';

import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Input, Label } from '@/src/components/ui/input';
import { useCreateReview } from '@/src/hooks/use-auth';
import { useState, type FormEvent } from 'react';

export const ReviewForm = ({ universityId }: { universityId: number }) => {
  const createReview = useCreateReview(universityId);

  const [rating, setRating] = useState('5');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const numericRating = Number(rating);
    const normalizedText = text.trim();

    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      setError('Поставьте оценку от 1 до 5.');
      return;
    }

    if (!normalizedText) {
      setError('Напишите текст отзыва.');
      return;
    }

    if (normalizedText.length > 300) {
      setError('Отзыв должен содержать не более 300 символов.');
      return;
    }

    const normalizedTags = tags
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(Boolean)
      .filter((tag, index, all) => all.indexOf(tag) === index);

    createReview.mutate(
      {
        rating: numericRating,
        text: normalizedText,
        tags: normalizedTags,
      },
      {
        onSuccess: () => {
          setRating('5');
          setText('');
          setTags('');
        },
        onError: mutationError => {
          setError(
            mutationError instanceof Error
              ? mutationError.message
              : 'Не удалось опубликовать отзыв.',
          );
        },
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-navy-deep">Оставить отзыв</h3>
          <p className="mt-1 text-sm text-muted">Поделитесь своим опытом обучения в этом вузе.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="review-rating">Оценка</Label>
            <select
              id="review-rating"
              value={rating}
              onChange={event => setRating(event.target.value)}
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink transition focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none">
              {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(value => (
                <option key={value} value={value}>
                  {value} — {value >= 4.5 ? 'отлично' : value >= 3.5 ? 'хорошо' : value >= 2.5 ? 'нормально' : 'плохо'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="review-tags">Теги</Label>
            <Input
              id="review-tags"
              value={tags}
              onChange={event => setTags(event.target.value)}
              placeholder="например: преподаватели, кампус"
            />
            <p className="text-xs text-muted">Можно указать несколько через запятую.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="review-text">Отзыв</Label>
          <textarea
            id="review-text"
            value={text}
            onChange={event => setText(event.target.value)}
            maxLength={300}
            rows={5}
            placeholder="Расскажите о своём опыте..."
            className="w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none"
          />
          <div className="flex justify-end text-xs text-muted">{text.length}/300</div>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-chance-low-ink">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={createReview.isPending}>
            {createReview.isPending ? 'Публикуем…' : 'Опубликовать отзыв'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
